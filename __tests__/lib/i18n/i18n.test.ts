/**
 * Tests for the i18n translation system.
 *
 * The public API is a single `t(key, fallback?)` function that looks up
 * dot-notation keys in a flat merged dictionary (en defaults + custom overrides).
 */

import { t } from "@/lib/i18n";
import { en } from "@/lib/i18n/en";

// ── Core behaviour ────────────────────────────────────────────────────────────

describe("t — core lookup", () => {
  it("returns the English default for a known key", () => {
    expect(t("brand.name")).toBe(en["brand.name"]);
    expect(t("brand.tagline")).toBe(en["brand.tagline"]);
  });

  it("returns an empty string for an unknown key", () => {
    expect(t("totally.unknown.key")).toBe("");
  });

  it("returns the provided fallback for an unknown key", () => {
    expect(t("totally.unknown.key", "fallback text")).toBe("fallback text");
  });

  it("returns a non-empty string for every key defined in en", () => {
    for (const key of Object.keys(en)) {
      const value = t(key);
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    }
  });
});

// ── Spot-checks for individual sections ──────────────────────────────────────

describe("t — checkout-flow strings", () => {
  it("cart section has required strings", () => {
    expect(t("cart.pageTitle")).toBeTruthy();
    expect(t("cart.emptyTitle")).toBeTruthy();
    expect(t("cart.proceedToCheckout")).toBeTruthy();
  });

  it("product section has add-to-cart UI strings", () => {
    expect(t("product.addToCart")).toBeTruthy();
    expect(t("product.outOfStock")).toBeTruthy();
    expect(t("product.added")).toBeTruthy();
  });

  it("checkout.fields has all address field labels", () => {
    expect(t("checkout.fields.firstName")).toBeTruthy();
    expect(t("checkout.fields.lastName")).toBeTruthy();
    expect(t("checkout.fields.email")).toBeTruthy();
    expect(t("checkout.fields.address1")).toBeTruthy();
    expect(t("checkout.fields.country")).toBeTruthy();
  });
});

describe("t — page-level strings", () => {
  it("notFound section has 404 page strings", () => {
    expect(t("notFound.code")).toBe("404");
    expect(t("notFound.title")).toBeTruthy();
    expect(t("notFound.goHome")).toBeTruthy();
  });

  it("shop.sort has all four sort labels", () => {
    expect(t("shop.sort.newest")).toBeTruthy();
    expect(t("shop.sort.priceLow")).toBeTruthy();
    expect(t("shop.sort.priceHigh")).toBeTruthy();
    expect(t("shop.sort.popularity")).toBeTruthy();
  });

  it("orderConfirmation has all three status titles", () => {
    expect(t("orderConfirmation.confirmedTitle")).toBeTruthy();
    expect(t("orderConfirmation.pendingTitle")).toBeTruthy();
    expect(t("orderConfirmation.failureTitle")).toBeTruthy();
  });
});
