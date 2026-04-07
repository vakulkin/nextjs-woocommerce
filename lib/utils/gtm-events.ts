"use client";

/**
 * GTM dataLayer event helpers — client only.
 *
 * Pushes events to window.dataLayer using sendGTMEvent from @next/third-parties.
 * GA4 is wired up inside the GTM container — no GA4 tag in code.
 *
 * Standard GTM → GA4 ecommerce pattern:
 *   1. Push { ecommerce: null } to clear any previous ecommerce payload.
 *   2. Push { event, ecommerce: { ...params } } for enhanced ecommerce events.
 *   3. Push { event, ...params } flat for non-ecommerce events (search, login, etc.)
 */

import { sendGTMEvent } from "@next/third-parties/google";
import type { EcommerceItem } from "./gtm-items";

export type { EcommerceItem };

// ── Internal helper ───────────────────────────────────────────────────────────

/** Clears the previous ecommerce payload then pushes a new ecommerce event. */
function pushEcommerce(event: string, ecommerce: Record<string, unknown>) {
  sendGTMEvent({ ecommerce: null }); // prevent data bleed between events
  sendGTMEvent({ event, ecommerce });
}

// ── Web Vitals ────────────────────────────────────────────────────────────────

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  label?: string;
}

export function reportWebVitals(metric: WebVitalsMetric): void {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.info("Web Vitals (dev):", metric.name, metric.value, metric.rating);
    return;
  }
  if (metric.label !== "web-vital") return;

  sendGTMEvent({
    event: "web_vitals",
    metric_name: metric.name,
    metric_id: metric.id,
    metric_value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    metric_rating: metric.rating,
    metric_delta: metric.delta,
  });
}

// ── Ecommerce events ──────────────────────────────────────────────────────────

export function trackViewItemList(items: EcommerceItem[], listName = "Product List") {
  pushEcommerce("view_item_list", { item_list_name: listName, items });
}

export function trackSelectItem(item: EcommerceItem, listName = "Product List", currency?: string) {
  pushEcommerce("select_item", { item_list_name: listName, currency, items: [item] });
}

export function trackViewItem(item: EcommerceItem, currency: string) {
  pushEcommerce("view_item", {
    currency,
    value: item.price ?? 0,
    items: [item],
  });
}

export function trackAddToCart(item: EcommerceItem, currency: string) {
  pushEcommerce("add_to_cart", {
    currency,
    value: (item.price ?? 0) * (item.quantity ?? 1),
    items: [item],
  });
}

export function trackRemoveFromCart(item: EcommerceItem, currency: string) {
  pushEcommerce("remove_from_cart", {
    currency,
    value: (item.price ?? 0) * (item.quantity ?? 1),
    items: [item],
  });
}

export function trackAddToWishlist(item: EcommerceItem, currency: string) {
  pushEcommerce("add_to_wishlist", {
    currency,
    value: item.price ?? 0,
    items: [item],
  });
}

export function trackViewCart(items: EcommerceItem[], currency: string, value: number) {
  pushEcommerce("view_cart", { currency, value, items });
}

export function trackBeginCheckout(items: EcommerceItem[], currency: string, value: number) {
  pushEcommerce("begin_checkout", { currency, value, items });
}

export function trackAddPaymentInfo(
  items: EcommerceItem[],
  currency: string,
  value: number,
  paymentType: string
) {
  pushEcommerce("add_payment_info", {
    currency,
    value,
    payment_type: paymentType,
    items,
  });
}

export function trackAddShippingInfo(
  items: EcommerceItem[],
  currency: string,
  value: number,
  shippingTier: string
) {
  pushEcommerce("add_shipping_info", {
    currency,
    value,
    shipping_tier: shippingTier,
    items,
  });
}

export function trackPurchase(
  transactionId: string,
  items: EcommerceItem[],
  currency: string,
  value: number,
  tax?: number,
  shipping?: number
) {
  pushEcommerce("purchase", {
    transaction_id: transactionId,
    currency,
    value,
    tax,
    shipping,
    items,
  });
}

export function trackRefund(
  transactionId: string,
  items: EcommerceItem[],
  currency: string,
  value: number
) {
  pushEcommerce("refund", {
    transaction_id: transactionId,
    currency,
    value,
    items,
  });
}

export function trackSelectPromotion(
  promotionId: string,
  promotionName: string,
  items: EcommerceItem[] = []
) {
  pushEcommerce("select_promotion", {
    promotion_id: promotionId,
    promotion_name: promotionName,
    items,
  });
}

export function trackViewPromotion(
  promotionId: string,
  promotionName: string,
  items: EcommerceItem[] = []
) {
  pushEcommerce("view_promotion", {
    promotion_id: promotionId,
    promotion_name: promotionName,
    items,
  });
}

// ── Non-ecommerce events ──────────────────────────────────────────────────────

export function trackSearch(searchTerm: string) {
  sendGTMEvent({ event: "search", search_term: searchTerm });
}

export function trackLogin(method = "email") {
  sendGTMEvent({ event: "login", method });
}

export function trackSignUp(method = "email") {
  sendGTMEvent({ event: "sign_up", method });
}



