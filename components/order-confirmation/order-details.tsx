import { retrieveStripeCheckoutSession } from "@/lib/stripe-server";
import { getStoreOrder } from "@/lib/woocommerce/api";
import type { WooStoreOrder } from "@/lib/woocommerce/types";
import { OrderStatusCard } from "./order-status-card";
import { OrderSummaryCard } from "./order-summary-card";
import { orderItemsToEcommerceItems } from "@/lib/utils/gtm-items";
import { JsonLdScript } from "@/components/analytics/json-ld-script";
import { FireGTMEvent } from "@/components/analytics/fire-gtm-event";

interface Props {
  orderId: string | null;
  sessionId: string | null;
  orderKey: string | null;
  billingEmail: string | undefined;
}

export async function OrderDetails({ orderId, sessionId, orderKey, billingEmail }: Props) {
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

  let order: WooStoreOrder | null = null;
  if (orderId && orderKey && state !== "failure") {
    order = await getStoreOrder(orderId, orderKey, billingEmail);
  }

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
      {orderJsonLd && <JsonLdScript data={orderJsonLd} />}
      {purchaseParams && order && <FireGTMEvent event="purchase" params={purchaseParams} ecommerce />}
      <OrderStatusCard state={state} orderId={orderId} stripeError={stripeError} />
      {order && <OrderSummaryCard order={order} />}
    </>
  );
}
