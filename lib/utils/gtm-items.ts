/**
 * GTM ecommerce item helpers — server + client safe.
 *
 * Pure data transforms only. Event tracking lives in ./gtm-events.ts ("use client").
 * GTM is loaded via components/GoogleTagManager.tsx — GA4 is wired in the GTM container.
 */

import type { WooProduct, WooCartItem, WooStoreOrderItem } from "@/lib/woocommerce/types";

/** Decodes common HTML entities returned by the WooCommerce REST API. */
function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

/** GA4 Enhanced Ecommerce item shape expected by GTM → GA4 */
export interface EcommerceItem {
  item_id: string | number;
  item_name: string;
  item_category?: string;
  item_brand?: string;
  price?: number;
  quantity?: number;
  index?: number;
}

// ── Data transform helpers (server + client safe) ─────────────────────────────

/** Converts a WooProduct to a GTM ecommerce item object. */
export function productToEcommerceItem(product: WooProduct, index = 0): EcommerceItem {
  const divisor = Math.pow(10, product.prices.currency_minor_unit);
  return {
    item_id: String(product.id),
    item_name: decodeHtml(product.name),
    item_category: product.categories[0]?.name ?? "",
    item_brand: "LuxuryAroma",
    price: parseInt(product.prices.price) / divisor,
    quantity: 1,
    index,
  };
}

/** Converts WooCommerce cart items to GTM ecommerce item objects. */
export function cartItemsToEcommerceItems(items: WooCartItem[]): EcommerceItem[] {
  return items.map((item, i) => ({
    item_id: String(item.id),
    item_name: decodeHtml(item.name),
    price: parseInt(item.prices.price) / Math.pow(10, item.prices.currency_minor_unit),
    quantity: item.quantity,
    index: i,
  }));
}

/** Converts WooCommerce order line items to GTM ecommerce item objects. */
export function orderItemsToEcommerceItems(items: WooStoreOrderItem[]): EcommerceItem[] {
  return items.map((item, i) => ({
    item_id: item.sku || String(item.id),
    item_name: decodeHtml(item.name),
    price: parseInt(item.prices.price) / Math.pow(10, item.prices.currency_minor_unit),
    quantity: item.quantity,
    index: i,
  }));
}


