import { sortTerms, resolveTermSlug, findMatchedVariation, buildSelectionFromVariation } from "@/lib/utils/product";
import type { WooProduct, WooProductAttribute } from "@/lib/woocommerce/types";
import { makeProduct } from "../../fixtures";

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeAttr = (
  name: string,
  terms: { id: number; name: string; slug: string; default: boolean }[]
): WooProductAttribute => ({
  id: 1,
  name,
  taxonomy: `pa_${name.toLowerCase()}`,
  has_variations: true,
  terms,
});

// ── sortTerms ─────────────────────────────────────────────────────────────────
describe("sortTerms", () => {
  it("sorts by parseFloat value (leading numbers are numeric)", () => {
    // parseFloat("50ml") === 50, so "50ml" IS treated as numeric by the sort.
    const terms = [
      { name: "50ml" },
      { name: "100" },
      { name: "30" },
    ] as { name: string }[];

    const sorted = sortTerms(terms);
    // All three have a leading numeric value: 30 < 50 < 100
    expect(sorted[0].name).toBe("30");
    expect(sorted[1].name).toBe("50ml"); // parseFloat → 50
    expect(sorted[2].name).toBe("100");
  });

  it("sorts purely alphabetic names alphabetically", () => {
    const terms = [{ name: "Cedar" }, { name: "Amber" }, { name: "Musk" }] as {
      name: string;
    }[];
    const sorted = sortTerms(terms);
    expect(sorted.map((t) => t.name)).toEqual(["Amber", "Cedar", "Musk"]);
  });

  it("places numeric names before alphabetic names", () => {
    const terms = [{ name: "Amber" }, { name: "10" }] as { name: string }[];
    const sorted = sortTerms(terms);
    expect(sorted[0].name).toBe("10");
    expect(sorted[1].name).toBe("Amber");
  });

  it("does not mutate the original array", () => {
    const terms = [{ name: "B" }, { name: "A" }] as { name: string }[];
    sortTerms(terms);
    expect(terms[0].name).toBe("B");
  });
});

// ── resolveTermSlug ───────────────────────────────────────────────────────────
describe("resolveTermSlug", () => {
  const attr = makeAttr("Size", [
    { id: 1, name: "Small", slug: "small", default: false },
    { id: 2, name: "Large", slug: "large", default: true },
  ]);

  it("resolves a term name to its slug", () => {
    expect(resolveTermSlug(attr, "Small")).toBe("small");
  });

  it("returns the slug directly when passed a slug", () => {
    expect(resolveTermSlug(attr, "large")).toBe("large");
  });

  it("falls back to the raw value when no match found", () => {
    expect(resolveTermSlug(attr, "extra-large")).toBe("extra-large");
  });
});

// ── findMatchedVariation ──────────────────────────────────────────────────────
describe("findMatchedVariation", () => {
  const product = makeProduct({
    type: "variable",
    attributes: [
      makeAttr("Size", [
        { id: 1, name: "Small", slug: "small", default: false },
        { id: 2, name: "Large", slug: "large", default: true },
      ]),
    ],
    variations: [
      { id: 10, attributes: [{ name: "Size", value: "small" }] },
      { id: 11, attributes: [{ name: "Size", value: "large" }] },
    ],
  });

  it("finds the correct variation by slug selection", () => {
    const matched = findMatchedVariation(product, { Size: "small" });
    expect(matched?.id).toBe(10);
  });

  it("returns the large variation", () => {
    const matched = findMatchedVariation(product, { Size: "large" });
    expect(matched?.id).toBe(11);
  });

  it("returns undefined when no variation matches", () => {
    const matched = findMatchedVariation(product, { Size: "medium" });
    expect(matched).toBeUndefined();
  });
});

// ── buildSelectionFromVariation ───────────────────────────────────────────────
describe("buildSelectionFromVariation", () => {
  const product: WooProduct = makeProduct({
    type: "variable",
    attributes: [
      makeAttr("Size", [
        { id: 1, name: "Small", slug: "small", default: false },
      ]),
      makeAttr("Colour", [
        { id: 2, name: "Black", slug: "black", default: false },
      ]),
    ],
    variations: [
      {
        id: 10,
        attributes: [
          { name: "Size", value: "small" },
          { name: "Colour", value: "black" },
        ],
      },
    ],
  });

  it("builds a slug-keyed selection map from a variation", () => {
    const selection = buildSelectionFromVariation(product, product.variations[0]);
    expect(selection).toEqual({ Size: "small", Colour: "black" });
  });
});
