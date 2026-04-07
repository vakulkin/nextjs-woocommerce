import { NextRequest, NextResponse } from "next/server";
import { constructStripeEvent, updateWooOrderStatus } from "@/lib/stripe-server";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

// Maps each relevant Stripe event to the WC order status it should produce
const EVENT_TO_WC_STATUS: Partial<Record<Stripe.Event["type"], string>> = {
  // Card payment completed immediately
  "checkout.session.completed": "processing", // payment_status === 'paid'
  // Async methods (BACS, SEPA, etc.) that succeed after a delay
  "checkout.session.async_payment_succeeded": "processing",
  // Async payment failed after delay
  "checkout.session.async_payment_failed": "failed",
  // Session expired without payment
  "checkout.session.expired": "cancelled",
};

async function handleSessionEvent(
  session: Stripe.Checkout.Session,
  targetStatus: string
): Promise<NextResponse | null> {
  const orderId = Number(session.metadata?.wc_order_id);
  if (!orderId) {
    console.warn("[stripe webhook] session has no wc_order_id metadata — skipping");
    return null; // acknowledge anyway so Stripe doesn't retry
  }

  // For checkout.session.completed with async payment methods, the
  // payment_status will be 'unpaid' — put the order on-hold instead.
  const status =
    targetStatus === "processing" && session.payment_status !== "paid"
      ? "on-hold"
      : targetStatus;

  try {
    await updateWooOrderStatus(orderId, status);
    console.log(`[stripe webhook] WC order ${orderId} → ${status}`);
  } catch (err) {
    // Return 500 so Stripe retries delivery
    console.error(`[stripe webhook] failed to update WC order ${orderId}:`, err);
    return NextResponse.json(
      { error: "Failed to update WooCommerce order status. Will retry." },
      { status: 500 }
    );
  }

  return null; // success — no error response
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Must read raw body before any parsing for signature verification
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = constructStripeEvent(rawBody, sig);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json(
      { error: `Webhook verification failed: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  const handled = EVENT_TO_WC_STATUS[event.type];
  if (handled) {
    const session = event.data.object as Stripe.Checkout.Session;
    const errResponse = await handleSessionEvent(session, handled);
    if (errResponse) return errResponse;
  }
  // All other event types are acknowledged and ignored

  return NextResponse.json({ received: true });
}
