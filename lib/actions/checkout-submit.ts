"use server";

import { BillingSchema, ShippingSchema } from "@/lib/validation/schemas";
import { checkout } from "./cart";
import { createStripeOrder } from "./stripe-checkout";
import type { WooCart } from "@/lib/woocommerce/types";

export type CheckoutActionState =
  | null
  | { type: "error"; message: string }
  | { type: "stripe_redirect"; url: string }
  | { type: "success"; orderId: number; orderKey: string; email: string };

/**
 * Server action for the checkout form.
 * Billing/shipping/cart state is passed as JSON in hidden form inputs.
 */
export async function checkoutAction(
  _prevState: CheckoutActionState,
  formData: FormData
): Promise<CheckoutActionState> {
  // ── Parse raw form data ───────────────────────────────────────────────────
  let rawBilling: unknown;
  let rawShipping: unknown;
  let cart: WooCart;
  let paymentMethod: string;
  let cartToken: string | undefined;

  try {
    rawBilling = JSON.parse(formData.get("billing") as string);
    rawShipping = JSON.parse(formData.get("shipping") as string);
    cart = JSON.parse(formData.get("cart") as string) as WooCart;
    paymentMethod = formData.get("paymentMethod") as string;
    cartToken = (formData.get("cartToken") as string) || undefined;
  } catch {
    return { type: "error", message: "Invalid form data. Please try again." };
  }

  // ── Validate with Zod ────────────────────────────────────────────────────
  const billingResult = BillingSchema.safeParse(rawBilling);
  if (!billingResult.success) {
    const first = billingResult.error.issues[0];
    return { type: "error", message: first?.message ?? "Invalid billing details." };
  }

  const shippingResult = ShippingSchema.safeParse(rawShipping);
  if (!shippingResult.success) {
    const first = shippingResult.error.issues[0];
    return { type: "error", message: first?.message ?? "Invalid shipping details." };
  }

  const billing = billingResult.data;
  const shipping = shippingResult.data;

  if (!paymentMethod) {
    return { type: "error", message: "Please select a payment method." };
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  /** Extract a human-readable message from a raw WooCommerce REST error string. */
  function extractWooMessage(raw?: string): string {
    if (!raw) return "Checkout failed. Please try again.";
    try {
      const parsed = JSON.parse(raw) as {
        message?: string;
        data?: { params?: Record<string, string> };
      };
      const params = parsed.data?.params;
      if (params) {
        const details = Object.entries(params)
          .map(([field, reason]) => `${field}: ${reason}`)
          .join("; ");
        console.error("[checkoutAction] Validation details:", details);
        return details || parsed.message || "Checkout failed. Please try again.";
      }
      if (parsed.message) return parsed.message;
    } catch { /* not JSON, fall through */ }
    return "Checkout failed. Please try again.";
  }

  // ── Route to payment provider ────────────────────────────────────────────
  const isStripeMethod = paymentMethod === "stripe_cc" || paymentMethod === "stripe";

  if (isStripeMethod) {
    const lineItems = cart.items.map((item) => ({
      name: item.name,
      unitAmount: parseInt(item.prices.price),
      quantity: item.quantity,
      currency: item.prices.currency_code,
    }));

    const result = await createStripeOrder(
      billing,
      shipping,
      paymentMethod,
      lineItems,
      cartToken
    );

    if ("error" in result) {
      console.error("[checkoutAction] Stripe order creation failed:", result.error);
      return { type: "error", message: extractWooMessage(result.error) };
    }

    return { type: "stripe_redirect", url: result.sessionUrl };
  }

  // ── Non-Stripe (bacs, cod, cheque, etc.) ─────────────────────────────────
  const result = await checkout(billing, shipping, paymentMethod || "cod", cartToken);

  if (result.error || !result.order) {
    console.error("[checkoutAction] WooCommerce checkout failed:", result.error);
    return { type: "error", message: extractWooMessage(result.error) };
  }

  return {
    type: "success",
    orderId: result.order.order_id,
    orderKey: result.order.order_key,
    email: billing.email,
  };
}
