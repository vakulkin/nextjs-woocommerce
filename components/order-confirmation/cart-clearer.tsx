"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cart-store";

/**
 * Clears the cart once the order-confirmation page has mounted.
 * Keeping this here (rather than in the checkout page's success handler)
 * prevents the checkout page from flickering through the "empty cart" screen
 * while Next.js is still completing the navigation.
 */
export function CartClearer() {
  useEffect(() => {
    useCartStore.getState().clearCart();
  }, []);

  return null;
}
