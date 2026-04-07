"use server";

import { searchProducts } from "@/lib/woocommerce/api";
import { SearchQuerySchema } from "@/lib/validation/schemas";
import type { WooProduct } from "@/lib/woocommerce/types";

export async function searchAction(query: string): Promise<WooProduct[]> {
  const parsed = SearchQuerySchema.safeParse(query);
  if (!parsed.success) return [];
  try {
    const products = await searchProducts(parsed.data);
    return products.slice(0, 6);
  } catch {
    return [];
  }
}
