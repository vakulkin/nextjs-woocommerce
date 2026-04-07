"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cart-store";

export function CartStoreInitializer() {
  useEffect(() => {
    useCartStore.getState().initCart();
  }, []);

  return null;
}
