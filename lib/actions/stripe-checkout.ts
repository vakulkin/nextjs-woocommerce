"use server";

import { checkoutOnServer } from "@/lib/woocommerce/api";
import { createStripeCheckoutSession } from "@/lib/stripe-server";
import type { BillingAddress, ShippingAddress, WooCheckoutOrder } from "@/lib/woocommerce/types";

export interface StripeLineItem {
  name: string;
  unitAmount: number; // in minor units (e.g. cents)
  quantity: number;
  currency: string; // e.g. "usd"
}

export interface CreateStripeOrderResult {
  sessionUrl: string;
  orderId: number;
}

/**
 * Creates a WooCommerce order (status: pending) then a Stripe Checkout Session.
 * Returns the Stripe-hosted payment page URL.
 */
export async function createStripeOrder(
  billing: BillingAddress,
  shipping: ShippingAddress,
  stripePaymentMethod: string, // e.g. "stripe_cc"
  lineItems: StripeLineItem[],
  cartToken?: string
): Promise<CreateStripeOrderResult | { error: string }> {
  // 1. Create the WC order so we get an order_id and billing/shipping is stored
  const wcRes = await checkoutOnServer(
    {
      billing_address: billing as unknown as Record<string, string>,
      shipping_address: shipping as unknown as Record<string, string>,
      payment_method: stripePaymentMethod,
    },
    cartToken
  );

  if (!wcRes.ok) {
    const body = await wcRes.text();
    console.error("[createStripeOrder] WooCommerce checkout API error:", wcRes.status, body);
    return { error: body };
  }

  const wcOrder = await wcRes.json() as WooCheckoutOrder;
  const orderId = wcOrder.order_id;
  const orderKey = wcOrder.order_key;

  // 2. Create Stripe Checkout Session
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    `http://localhost:${process.env.PORT ?? 3000}`;

  let session;
  try {
    session = await createStripeCheckoutSession({
      orderId,
      lineItems: lineItems.map((item) => ({
        price_data: {
          currency: item.currency.toLowerCase(),
          product_data: { name: item.name },
          unit_amount: item.unitAmount,
        },
        quantity: item.quantity,
      })),
      customerEmail: billing.email,
      successUrl: `${appUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&order_key=${encodeURIComponent(orderKey)}&billing_email=${encodeURIComponent(billing.email)}`,
      cancelUrl: `${appUrl}/checkout`,
    });
  } catch (err) {
    return { error: (err as Error).message };
  }

  if (!session.url) return { error: "Stripe did not return a session URL." };

  return { sessionUrl: session.url, orderId };
}
