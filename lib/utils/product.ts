import type { WooProduct } from "@/lib/woocommerce/types";

/** Sort terms: numeric values first (ascending), then alphabetically. */
export function sortTerms<T extends { name: string }>(terms: T[]): T[] {
  return [...terms].sort((a, b) => {
    const aNum = parseFloat(a.name);
    const bNum = parseFloat(b.name);
    const aIsNum = !isNaN(aNum) && a.name.trim() !== "";
    const bIsNum = !isNaN(bNum) && b.name.trim() !== "";
    if (aIsNum && bIsNum) return aNum - bNum;
    if (aIsNum) return -1;
    if (bIsNum) return 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Normalize a raw variation attribute value (which may be a term name or slug)
 * to the canonical slug by looking it up in the parent attribute's terms list.
 */
export function resolveTermSlug(
  attr: WooProduct["attributes"][number],
  rawValue: string
): string {
  const term =
    attr.terms.find((t) => t.name === rawValue) ??
    attr.terms.find((t) => t.slug === rawValue);
  return term?.slug ?? rawValue;
}

/**
 * Find the variation from product.variations whose attributes all match
 * the given slug-keyed selection map (attr.name → term slug).
 */
export function findMatchedVariation(
  product: WooProduct,
  selection: Record<string, string>
): WooProduct["variations"][number] | undefined {
  return product.variations.find((v) =>
    v.attributes.every((va) => {
      const attr = product.attributes.find((a) => a.name === va.name);
      if (!attr) return true;
      return selection[attr.name] === resolveTermSlug(attr, va.value);
    })
  );
}

/**
 * Build a slug-keyed selection map (attr.name → term slug) from a variation's
 * own attribute values.
 */
export function buildSelectionFromVariation(
  product: WooProduct,
  variation: WooProduct["variations"][number]
): Record<string, string> {
  const result: Record<string, string> = {};
  variation.attributes.forEach((va) => {
    const attr = product.attributes.find((a) => a.name === va.name);
    if (attr) result[attr.name] = resolveTermSlug(attr, va.value);
  });
  return result;
}
