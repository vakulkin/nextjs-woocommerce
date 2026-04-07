"use server";

import { getProducts } from "@/lib/woocommerce/api";

/**
 * Given a list of wishlist product IDs, returns only the IDs that are still
 * published and available in WooCommerce. Any ID not returned has been
 * deleted or unpublished and should be removed from the local wishlist.
 */
export async function validateWishlistItems(ids: number[]): Promise<number[]> {
  if (!ids.length) return [];
  try {
    const products = await getProducts({ include: ids, per_page: ids.length });
    return products.map((p) => p.id);
  } catch {
    // If the API fails we return all IDs — don't wipe the wishlist on a transient error
    return ids;
  }
}
