/**
 * Tests for the i18n translation system.
 *
 * - deepMerge logic is tested via a local copy (the function is internal to
 *   index.ts and not exported, so we test the algorithm directly).
 * - The exported `t` object is tested to ensure it exposes all English defaults.
 */

import { t } from "@/lib/i18n";
import { en } from "@/lib/i18n/en";

// ── Local copy of deepMerge for isolated algorithm tests ──────────────────────

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? DeepPartial<T[K]>
    : T[K];
};

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: DeepPartial<T>
): T {
  const result = { ...base };
  for (const key in override) {
    const ov = override[key as keyof DeepPartial<T>];
    if (ov === undefined) continue;
    const bv = base[key as keyof T];
    if (
      typeof ov === "object" &&
      ov !== null &&
      typeof bv === "object" &&
      bv !== null &&
      !Array.isArray(ov)
    ) {
      result[key as keyof T] = deepMerge(
        bv as Record<string, unknown>,
        ov as DeepPartial<Record<string, unknown>>
      ) as T[keyof T];
    } else {
      result[key as keyof T] = ov as T[keyof T];
    }
  }
  return result;
}

// ── deepMerge algorithm ───────────────────────────────────────────────────────

describe("deepMerge", () => {
  it("returns base values when override is empty", () => {
    const result = deepMerge({ a: 1, b: "hello" } as Record<string, unknown>, {});
    expect(result).toEqual({ a: 1, b: "hello" });
  });

  it("overrides a top-level scalar key", () => {
    const result = deepMerge(
      { a: "original", b: "keep" } as Record<string, unknown>,
      { a: "replaced" }
    );
    expect(result.a).toBe("replaced");
    expect(result.b).toBe("keep");
  });

  it("deeply merges nested objects, preserving non-overridden keys", () => {
    const base = {
      cart: { title: "Cart", empty: "Empty cart", checkout: "Checkout" },
    } as unknown as Record<string, unknown>;
    const override = { cart: { title: "Basket" } };
    const result = deepMerge(base, override as DeepPartial<typeof base>);
    expect((result.cart as Record<string, string>).title).toBe("Basket");
    expect((result.cart as Record<string, string>).empty).toBe("Empty cart");
    expect((result.cart as Record<string, string>).checkout).toBe("Checkout");
  });

  it("skips undefined override values (leaves base unchanged)", () => {
    const result = deepMerge(
      { a: "keep" } as Record<string, unknown>,
      { a: undefined }
    );
    expect(result.a).toBe("keep");
  });

  it("handles multiple levels of nesting", () => {
    const base = {
      home: { hero: { heading: "Original", sub: "Sub" } },
    } as unknown as Record<string, unknown>;
    const override = { home: { hero: { heading: "New Heading" } } };
    const result = deepMerge(base, override as DeepPartial<typeof base>);
    const hero = (result.home as Record<string, unknown>).hero as Record<string, string>;
    expect(hero.heading).toBe("New Heading");
    expect(hero.sub).toBe("Sub");
  });

  it("does not mutate the base object", () => {
    const base = { a: "original" } as Record<string, unknown>;
    deepMerge(base, { a: "mutated" });
    expect(base.a).toBe("original");
  });
});

// ── t export (defaults with empty custom) ─────────────────────────────────────

describe("t — default translations", () => {
  it("has all top-level keys from en", () => {
    const enKeys = Object.keys(en);
    for (const key of enKeys) {
      expect(t).toHaveProperty(key);
    }
  });

  it("t.brand matches English defaults", () => {
    expect(t.brand.name).toBe(en.brand.name);
    expect(t.brand.tagline).toBe(en.brand.tagline);
  });

  it("t.cart has required checkout-flow strings", () => {
    expect(t.cart.pageTitle).toBeTruthy();
    expect(t.cart.emptyTitle).toBeTruthy();
    expect(t.cart.proceedToCheckout).toBeTruthy();
  });

  it("t.product has add-to-cart UI strings", () => {
    expect(t.product.addToCart).toBeTruthy();
    expect(t.product.outOfStock).toBeTruthy();
    expect(t.product.added).toBeTruthy();
  });

  it("t.checkout.fields has all address field labels", () => {
    const fields = t.checkout.fields;
    expect(fields.firstName).toBeTruthy();
    expect(fields.lastName).toBeTruthy();
    expect(fields.email).toBeTruthy();
    expect(fields.address1).toBeTruthy();
    expect(fields.country).toBeTruthy();
  });

  it("t.notFound has 404 page strings", () => {
    expect(t.notFound.code).toBe("404");
    expect(t.notFound.title).toBeTruthy();
    expect(t.notFound.goHome).toBeTruthy();
  });

  it("t.shop.sort has all four sort labels", () => {
    expect(t.shop.sort.newest).toBeTruthy();
    expect(t.shop.sort.priceLow).toBeTruthy();
    expect(t.shop.sort.priceHigh).toBeTruthy();
    expect(t.shop.sort.popularity).toBeTruthy();
  });

  it("t.orderConfirmation has all three status titles", () => {
    expect(t.orderConfirmation.confirmedTitle).toBeTruthy();
    expect(t.orderConfirmation.pendingTitle).toBeTruthy();
    expect(t.orderConfirmation.failureTitle).toBeTruthy();
  });
});
