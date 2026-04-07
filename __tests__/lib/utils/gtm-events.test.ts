/**
 * Tests for GTM event helpers in lib/utils/gtm-events.ts.
 *
 * sendGTMEvent is mocked so no real dataLayer push happens. Each ecommerce helper
 * must: (1) call sendGTMEvent with { ecommerce: null } to clear the previous
 * payload, then (2) call sendGTMEvent with the correct event name and payload.
 */

jest.mock("@next/third-parties/google", () => ({
  sendGTMEvent: jest.fn(),
}));

import { sendGTMEvent } from "@next/third-parties/google";
import {
  trackViewItemList,
  trackSelectItem,
  trackViewItem,
  trackAddToCart,
  trackRemoveFromCart,
  trackAddToWishlist,
  trackViewCart,
  trackBeginCheckout,
  trackAddPaymentInfo,
  trackAddShippingInfo,
  trackPurchase,
  trackRefund,
  trackSelectPromotion,
  trackViewPromotion,
  trackPageView,
  trackSearch,
  trackLogin,
  trackSignUp,
  reportWebVitals,
} from "@/lib/utils/gtm-events";
import type { EcommerceItem } from "@/lib/utils/gtm-events";

const mockSend = jest.mocked(sendGTMEvent);

const item: EcommerceItem = {
  item_id: "42",
  item_name: "Test Product",
  item_category: "Perfume",
  price: 29.99,
  quantity: 2,
};

const items = [item];

beforeEach(() => {
  mockSend.mockClear();
});

// ── Helper to assert the ecommerce double-push pattern ────────────────────────

function assertEcommerceEvent(
  eventName: string,
  expectedPayload: Record<string, unknown>
) {
  expect(mockSend).toHaveBeenCalledTimes(2);
  expect(mockSend).toHaveBeenNthCalledWith(1, { ecommerce: null });
  expect(mockSend).toHaveBeenNthCalledWith(2, {
    event: eventName,
    ecommerce: expectedPayload,
  });
}

// ── Ecommerce events ──────────────────────────────────────────────────────────

describe("trackViewItemList", () => {
  it("pushes view_item_list with a default list name", () => {
    trackViewItemList(items);
    assertEcommerceEvent("view_item_list", {
      item_list_name: "Product List",
      items,
    });
  });

  it("uses the provided list name", () => {
    trackViewItemList(items, "Featured");
    assertEcommerceEvent("view_item_list", {
      item_list_name: "Featured",
      items,
    });
  });
});

describe("trackSelectItem", () => {
  it("pushes select_item with item wrapped in array", () => {
    trackSelectItem(item, "Featured", "USD");
    assertEcommerceEvent("select_item", {
      item_list_name: "Featured",
      currency: "USD",
      items: [item],
    });
  });
});

describe("trackViewItem", () => {
  it("pushes view_item with value equal to item price", () => {
    trackViewItem(item, "USD");
    assertEcommerceEvent("view_item", {
      currency: "USD",
      value: 29.99,
      items: [item],
    });
  });

  it("uses 0 when item has no price", () => {
    const noPriceItem: EcommerceItem = { item_id: "1", item_name: "Free" };
    trackViewItem(noPriceItem, "EUR");
    assertEcommerceEvent("view_item", {
      currency: "EUR",
      value: 0,
      items: [noPriceItem],
    });
  });
});

describe("trackAddToCart", () => {
  it("pushes add_to_cart with value = price × quantity", () => {
    trackAddToCart(item, "USD");
    assertEcommerceEvent("add_to_cart", {
      currency: "USD",
      value: 29.99 * 2, // price × quantity
      items: [item],
    });
  });

  it("falls back to quantity 1 when item has no quantity", () => {
    const oneItem: EcommerceItem = { item_id: "1", item_name: "X", price: 10 };
    trackAddToCart(oneItem, "USD");
    const ecommerce = (mockSend.mock.calls[1][0] as Record<string, unknown>).ecommerce as Record<string, unknown>;
    expect(ecommerce.value).toBe(10);
  });
});

describe("trackRemoveFromCart", () => {
  it("pushes remove_from_cart with value = price × quantity", () => {
    trackRemoveFromCart(item, "USD");
    assertEcommerceEvent("remove_from_cart", {
      currency: "USD",
      value: 29.99 * 2,
      items: [item],
    });
  });
});

describe("trackAddToWishlist", () => {
  it("pushes add_to_wishlist with value equal to price (not × quantity)", () => {
    trackAddToWishlist(item, "USD");
    assertEcommerceEvent("add_to_wishlist", {
      currency: "USD",
      value: 29.99,
      items: [item],
    });
  });
});

describe("trackViewCart", () => {
  it("pushes view_cart with currency and total value", () => {
    trackViewCart(items, "USD", 59.98);
    assertEcommerceEvent("view_cart", {
      currency: "USD",
      value: 59.98,
      items,
    });
  });
});

describe("trackBeginCheckout", () => {
  it("pushes begin_checkout", () => {
    trackBeginCheckout(items, "USD", 59.98);
    assertEcommerceEvent("begin_checkout", {
      currency: "USD",
      value: 59.98,
      items,
    });
  });
});

describe("trackAddPaymentInfo", () => {
  it("pushes add_payment_info with payment_type", () => {
    trackAddPaymentInfo(items, "USD", 59.98, "credit_card");
    assertEcommerceEvent("add_payment_info", {
      currency: "USD",
      value: 59.98,
      payment_type: "credit_card",
      items,
    });
  });
});

describe("trackAddShippingInfo", () => {
  it("pushes add_shipping_info with shipping_tier", () => {
    trackAddShippingInfo(items, "USD", 59.98, "standard");
    assertEcommerceEvent("add_shipping_info", {
      currency: "USD",
      value: 59.98,
      shipping_tier: "standard",
      items,
    });
  });
});

describe("trackPurchase", () => {
  it("pushes purchase with transaction_id, tax, and shipping", () => {
    trackPurchase("TXN-001", items, "USD", 59.98, 5, 4.99);
    assertEcommerceEvent("purchase", {
      transaction_id: "TXN-001",
      currency: "USD",
      value: 59.98,
      tax: 5,
      shipping: 4.99,
      items,
    });
  });
});

describe("trackRefund", () => {
  it("pushes refund event", () => {
    trackRefund("TXN-001", items, "USD", 59.98);
    assertEcommerceEvent("refund", {
      transaction_id: "TXN-001",
      currency: "USD",
      value: 59.98,
      items,
    });
  });
});

describe("trackSelectPromotion", () => {
  it("pushes select_promotion with promotion details", () => {
    trackSelectPromotion("PROMO_1", "Summer Sale", items);
    assertEcommerceEvent("select_promotion", {
      promotion_id: "PROMO_1",
      promotion_name: "Summer Sale",
      items,
    });
  });

  it("defaults to empty items array", () => {
    trackSelectPromotion("PROMO_1", "Summer Sale");
    assertEcommerceEvent("select_promotion", {
      promotion_id: "PROMO_1",
      promotion_name: "Summer Sale",
      items: [],
    });
  });
});

describe("trackViewPromotion", () => {
  it("pushes view_promotion", () => {
    trackViewPromotion("PROMO_1", "Summer Sale", items);
    assertEcommerceEvent("view_promotion", {
      promotion_id: "PROMO_1",
      promotion_name: "Summer Sale",
      items,
    });
  });
});

// ── Non-ecommerce events ──────────────────────────────────────────────────────

describe("trackPageView", () => {
  it("calls sendGTMEvent once with event and page_location", () => {
    trackPageView("/shop");
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      event: "page_view",
      page_location: "/shop",
    });
  });
});

describe("trackSearch", () => {
  it("calls sendGTMEvent once with search_term", () => {
    trackSearch("rose oud");
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      event: "search",
      search_term: "rose oud",
    });
  });
});

describe("trackLogin", () => {
  it("defaults method to email", () => {
    trackLogin();
    expect(mockSend).toHaveBeenCalledWith({ event: "login", method: "email" });
  });
});

describe("trackSignUp", () => {
  it("pushes sign_up event", () => {
    trackSignUp("google");
    expect(mockSend).toHaveBeenCalledWith({ event: "sign_up", method: "google" });
  });
});

// ── reportWebVitals ───────────────────────────────────────────────────────────

describe("reportWebVitals", () => {
  const metric = {
    id: "v3-123",
    name: "LCP",
    value: 2400,
    rating: "good" as const,
    delta: 10,
    label: "web-vital",
  };

  it("sends web_vitals event in non-development env with web-vital label", () => {
    reportWebVitals(metric);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "web_vitals",
        metric_name: "LCP",
        metric_id: "v3-123",
        metric_value: 2400,
        metric_rating: "good",
      })
    );
  });

  it("rounds CLS by multiplying by 1000", () => {
    reportWebVitals({ ...metric, name: "CLS", value: 0.12 });
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ metric_name: "CLS", metric_value: 120 })
    );
  });

  it("does not send event when label is not web-vital", () => {
    reportWebVitals({ ...metric, label: "custom" });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("does not send event in development environment", () => {
    const original = process.env.NODE_ENV;
    // @ts-expect-error NODE_ENV is readonly at the type level but writable at runtime in tests
    process.env.NODE_ENV = "development";
    try {
      reportWebVitals(metric);
      expect(mockSend).not.toHaveBeenCalled();
    } finally {
      // @ts-expect-error NODE_ENV is readonly at the type level but writable at runtime in tests
      process.env.NODE_ENV = original;
    }
  });
});
