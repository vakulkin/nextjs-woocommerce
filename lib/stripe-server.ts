/**
 * Server-only Stripe + WooCommerce REST API utilities.
 * Never import this file from client components.
 */
import Stripe from "stripe";

// Singleton — constructed once per server process
function getStripeServer(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

// ─── Stripe Checkout Session ──────────────────────────────────────────────────

export interface LineItemParam {
  price_data: {
    currency: string;
    product_data: { name: string };
    unit_amount: number;
  };
  quantity: number;
}

export interface CreateSessionParams {
  orderId: number;
  lineItems: LineItemParam[];
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createStripeCheckoutSession(
  params: CreateSessionParams
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeServer();
  return stripe.checkout.sessions.create({
    mode: "payment",
    line_items: params.lineItems,
    customer_email: params.customerEmail,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: { wc_order_id: String(params.orderId) },
    // Suppress Stripe's own billing/shipping collection since we already have it
    billing_address_collection: "auto",
  });
}

export async function retrieveStripeCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeServer();
  return stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Verifies a Stripe webhook signature and constructs the event.
 * Must be called with the raw request body string (not parsed JSON).
 */
export function constructStripeEvent(
  rawBody: string,
  signature: string
): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  const stripe = getStripeServer();
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}

// ─── WooCommerce REST API v3 ──────────────────────────────────────────────────

/**
 * Update a WooCommerce order status via the REST API.
 * Uses query-string auth so it works on both HTTP and HTTPS.
 * status values: "pending" | "processing" | "on-hold" | "completed" | "cancelled" | "refunded" | "failed"
 */
export async function updateWooOrderStatus(
  orderId: number,
  status: string
): Promise<void> {
  const ck = process.env.WC_CONSUMER_KEY;
  const cs = process.env.WC_CONSUMER_SECRET;
  if (!ck || !cs) throw new Error("WC_CONSUMER_KEY / WC_CONSUMER_SECRET not set");

  const base = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
  const url = `${base}/wp-json/wc/v3/orders/${orderId}?consumer_key=${ck}&consumer_secret=${cs}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WC order update failed (${res.status}): ${body}`);
  }
}
