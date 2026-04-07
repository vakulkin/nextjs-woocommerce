import { create } from "zustand";
import type { WooCart } from "@/lib/woocommerce/types";
import {
  getCart as getCartAction,
  addToCart as addToCartAction,
  updateCartItem as updateCartItemAction,
  removeFromCart as removeFromCartAction,
} from "@/lib/actions/cart";

// ── Token helpers ─────────────────────────────────────────────────────────────

const CART_TOKEN_KEY = "cart-store";

const getStoredToken = (): string | undefined =>
  typeof window !== "undefined"
    ? localStorage.getItem(CART_TOKEN_KEY) || undefined
    : undefined;

const saveToken = (token: string | null | undefined): void => {
  if (typeof window !== "undefined" && token)
    localStorage.setItem(CART_TOKEN_KEY, token);
};

// ── Types ─────────────────────────────────────────────────────────────────────

type CartActionResult = { cart: WooCart | null; cartToken: string | null; error?: string };

export interface CartState {
  cart: WooCart | null;
  cartToken: string | undefined;
  isLoading: boolean;
  isPending: boolean;
  itemCount: number;
  isCartOpen: boolean;
  /** Set to true once initCart has been called at least once. */
  _initialized: boolean;
  /** Promise kept while initCart is in flight so concurrent callers can await it. */
  _initPromise: Promise<void> | null;

  openCart: () => void;
  closeCart: () => void;
  initCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  addItem: (
    productId: number,
    quantity?: number,
    variation?: { attribute: string; value: string }[]
  ) => Promise<{ error?: string }>;
  updateItem: (key: string, quantity: number) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clearCart: () => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartState>((set, get) => {
  /** Apply a cart action result to the store. */
  const applyResult = (result: CartActionResult) => {
    if (result.cartToken) saveToken(result.cartToken);
    set((s) => ({
      cart: result.cart ?? s.cart,
      cartToken: result.cartToken ?? s.cartToken,
      itemCount: result.cart?.items_count ?? s.itemCount,
    }));
  };

  /** Wrap a mutation with isPending guards; ensures initCart has run first. */
  const withPending = async (
    fn: (token: string | undefined) => Promise<CartActionResult>
  ): Promise<CartActionResult> => {
    // If initCart has never been called (e.g. user clicks before the
    // CartStoreInitializer effect fires), kick it off and wait for it.
    if (!get()._initialized) await get().initCart();
    // If initCart IS in-flight (started but not yet finished), wait for it.
    const init = get()._initPromise;
    if (init) await init;

    set({ isPending: true });
    try {
      const token = get().cartToken ?? getStoredToken();
      return await fn(token);
    } finally {
      set({ isPending: false });
    }
  };

  return {
    cart: null,
    cartToken: undefined,
    isLoading: true,
    isPending: false,
    itemCount: 0,
    isCartOpen: false,
    _initialized: false,
    _initPromise: null,

    openCart: () => set({ isCartOpen: true }),
    closeCart: () => set({ isCartOpen: false }),

    initCart: () => {
      const existing = get()._initPromise;
      if (existing) return existing;

      // Already done — nothing to do.
      if (get()._initialized) return Promise.resolve();

      const promise = (async () => {
        try {
          const storedToken = getStoredToken();
          const result = await getCartAction(storedToken);
          if (result.cartToken) saveToken(result.cartToken);
          set({
            cart: result.cart ?? null,
            cartToken: result.cartToken ?? storedToken,
            itemCount: result.cart?.items_count ?? 0,
            _initialized: true,
          });
        } catch (err) {
          console.error("Failed to initialise cart:", err);
          // Don't set _initialized so the next mutation can retry initCart.
        } finally {
          // Always unblock the loading state so the UI never freezes.
          set({ isLoading: false, _initPromise: null });
        }
      })();

      set({ _initPromise: promise });
      return promise;
    },

    refreshCart: async () => {
      const token = get().cartToken ?? getStoredToken();
      const result = await getCartAction(token);
      if (result.cartToken) saveToken(result.cartToken);
      set({
        cart: result.cart ?? null,
        cartToken: result.cartToken ?? token,
        itemCount: result.cart?.items_count ?? 0,
      });
    },

    addItem: async (productId, quantity = 1, variation) => {
      const result = await withPending((token) =>
        addToCartAction(productId, quantity, token, variation)
      );
      applyResult(result);
      return result.error ? { error: result.error } : {};
    },

    updateItem: async (key, quantity) => {
      const result = await withPending((token) =>
        updateCartItemAction(key, quantity, token)
      );
      applyResult(result);
    },

    removeItem: async (key) => {
      const result = await withPending((token) =>
        removeFromCartAction(key, token)
      );
      applyResult(result);
    },

    clearCart: () => {
      if (typeof window !== "undefined") localStorage.removeItem(CART_TOKEN_KEY);
      set({ cart: null, cartToken: undefined, itemCount: 0, _initialized: false, isLoading: true });
    },
  };
});

