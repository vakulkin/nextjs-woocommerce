import type { Metadata } from "next";
import { retrieveStripeCheckoutSession } from "@/lib/stripe-server";
import { getStoreOrder } from "@/lib/woocommerce/api";
import type { WooStoreOrder } from "@/lib/woocommerce/types";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Thank you for your order. Your purchase has been confirmed.",
  robots: { index: false, follow: false },
};
import { OrderStatusCard } from "@/components/order-confirmation/order-status-card";
import { OrderSummaryCard } from "@/components/order-confirmation/order-summary-card";
import { CartClearer } from "@/components/order-confirmation/cart-clearer";
import { OrderConfirmationParamsSchema } from "@/lib/validation/schemas";
import { orderItemsToEcommerceItems } from "@/lib/utils/gtm-items";
import { JsonLdScript } from "@/components/ui/json-ld-script";
import { FireGTMEvent } from "@/components/analytics/fire-gtm-event";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const rawParams = await searchParams;
  // Validate URL params — guard against forged/malicious query strings
  const params = OrderConfirmationParamsSchema.parse(rawParams);
  const orderId = params.order_id ?? null;
  const sessionId = params.session_id ?? null;
  const orderKey = params.order_key ?? null;
  const billingEmail = params.billing_email;

  // ── Stripe flow: verify session status server-side ───────────────────────
  type StripeStatus = "paid" | "unpaid" | "no_payment_required" | null;
  let stripePaymentStatus: StripeStatus = null;
  let stripeError: string | undefined;

  if (sessionId) {
    try {
      const session = await retrieveStripeCheckoutSession(sessionId);
      stripePaymentStatus = session.payment_status as StripeStatus;
    } catch (err) {
      stripeError = (err as Error).message;
    }
  }

  // ── Derive display state ─────────────────────────────────────────────────
  const isStripeFlow = Boolean(sessionId);

  const state: "success" | "pending" | "failure" = !isStripeFlow
    ? "success"
    : stripeError
    ? "failure"
    : stripePaymentStatus === "paid" || stripePaymentStatus === "no_payment_required"
    ? "success"
    : stripePaymentStatus === "unpaid"
    ? "pending"
    : "failure";

  // ── Fetch WC order details ────────────────────────────────────────────────
  let order: WooStoreOrder | null = null;
  if (orderId && orderKey && state !== "failure") {
    order = await getStoreOrder(orderId, orderKey, billingEmail);
  }

  // ── Build schema + dataLayer payload when order is available ─────────────
  let orderJsonLd: object | null = null;
  let purchaseParams: Record<string, unknown> | null = null;

  if (order && state === "success") {
    const divisor = Math.pow(10, order.totals.currency_minor_unit);
    const orderTotal = (parseInt(order.totals.total_price) / divisor).toFixed(2);
    const taxTotal = (parseInt(order.totals.total_tax) / divisor).toFixed(2);
    const shippingTotal = (parseInt(order.totals.total_shipping) / divisor).toFixed(2);
    const currency = order.totals.currency_code;

    orderJsonLd = {
      "@context": "https://schema.org",
      "@type": "Order",
      orderNumber: order.id,
      orderStatus: "https://schema.org/OrderProcessing",
      priceCurrency: currency,
      price: orderTotal,
      acceptedOffer: order.items.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Product", name: item.name, sku: item.sku },
        price: (parseInt(item.prices.price) / divisor).toFixed(2),
        priceCurrency: currency,
      })),
    };

    purchaseParams = {
      transaction_id: String(order.id),
      value: parseFloat(orderTotal),
      tax: parseFloat(taxTotal),
      shipping: parseFloat(shippingTotal),
      currency,
      items: orderItemsToEcommerceItems(order.items),
    };
  }

  return (
    <>
      <CartClearer />
      {orderJsonLd && <JsonLdScript data={orderJsonLd} />}
      {purchaseParams && <FireGTMEvent event="purchase" params={purchaseParams} ecommerce />}
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <OrderStatusCard state={state} orderId={orderId} stripeError={stripeError} />
        {order && <OrderSummaryCard order={order} />}
      </div>
    </>
  );
}

