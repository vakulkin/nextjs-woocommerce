import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WooProduct } from "@/lib/woocommerce/types";

export interface WishlistItem {
  id: number;
  slug: string;
  name: string;
  prices: WooProduct["prices"];
  images: WooProduct["images"];
  categories: WooProduct["categories"];
  on_sale: boolean;
  is_in_stock: boolean;
}

interface WishlistState {
  items: WishlistItem[];
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  toggle: (product: WooProduct) => void;
  remove: (id: number) => void;
  isWishlisted: (id: number) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      toggle: (product) =>
        set((s) => {
          const exists = s.items.some((i) => i.id === product.id);
          return {
            items: exists
              ? s.items.filter((i) => i.id !== product.id)
              : [
                  ...s.items,
                  {
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    prices: product.prices,
                    images: product.images,
                    categories: product.categories,
                    on_sale: product.on_sale,
                    is_in_stock: product.is_in_stock,
                  },
                ],
          };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      isWishlisted: (id) => get().items.some((i) => i.id === id),
      clear: () => set({ items: [] }),
    }),
    {
      name: "wishlist-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
