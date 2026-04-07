/**
 * Cart store tests.
 *
 * Server actions (getCart, addToCart, …) are mocked so no network calls happen.
 * localStorage is provided by jest-environment-jsdom.
 */
import { act } from "react";

// ── Mock server actions before importing the store ────────────────────────────
jest.mock("@/lib/actions/cart", () => ({
  getCart: jest.fn(),
  addToCart: jest.fn(),
  updateCartItem: jest.fn(),
  removeFromCart: jest.fn(),
}));

import {
  getCart as mockGetCart,
  addToCart as mockAddToCart,
  updateCartItem as mockUpdateCartItem,
  removeFromCart as mockRemoveFromCart,
} from "@/lib/actions/cart";
import { useCartStore } from "@/lib/store/cart-store";
import type { WooCart } from "@/lib/woocommerce/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeCart = (overrides: Partial<WooCart> = {}): WooCart => ({
  items: [],
  items_count: 0,
  items_weight: 0,
  coupons: [],
  totals: {
    total_items: "0",
    total_items_tax: "0",
    total_shipping: "0",
    total_shipping_tax: "0",
    total_discount: "0",
    total_discount_tax: "0",
    total_tax: "0",
    total_price: "0",
    currency_code: "USD",
    currency_symbol: "$",
    currency_minor_unit: 2,
    currency_prefix: "$",
    currency_suffix: "",
  },
  shipping_rates: [],
  needs_payment: false,
  needs_shipping: false,
  payment_methods: [],
  ...overrides,
});

// Reset the store to a clean slate between tests
function resetStore() {
  useCartStore.setState({
    cart: null,
    cartToken: undefined,
    isLoading: true,
    isPending: false,
    itemCount: 0,
    isCartOpen: false,
    _initialized: false,
    _initPromise: null,
  });
  localStorage.clear();
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  resetStore();
});

describe("useCartStore — openCart / closeCart", () => {
  it("opens the cart", () => {
    act(() => {
      useCartStore.getState().openCart();
    });
    expect(useCartStore.getState().isCartOpen).toBe(true);
  });

  it("closes the cart", () => {
    act(() => {
      useCartStore.getState().openCart();
      useCartStore.getState().closeCart();
    });
    expect(useCartStore.getState().isCartOpen).toBe(false);
  });
});

describe("useCartStore — clearCart", () => {
  it("resets cart state and removes token from localStorage", () => {
    localStorage.setItem("cart-store", "some-token");
    useCartStore.setState({ cart: makeCart({ items_count: 3 }), itemCount: 3 });

    act(() => {
      useCartStore.getState().clearCart();
    });

    expect(useCartStore.getState().cart).toBeNull();
    expect(useCartStore.getState().itemCount).toBe(0);
    expect(localStorage.getItem("cart-store")).toBeNull();
  });
});

describe("useCartStore — initCart", () => {
  it("fetches the cart and sets state", async () => {
    const cart = makeCart({ items_count: 2 });
    (mockGetCart as jest.Mock).mockResolvedValue({
      cart,
      cartToken: "tok_abc",
    });

    await act(async () => {
      await useCartStore.getState().initCart();
    });

    const state = useCartStore.getState();
    expect(state.cart).toEqual(cart);
    expect(state.itemCount).toBe(2);
    expect(state.cartToken).toBe("tok_abc");
    expect(state._initialized).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it("does not call getCart a second time if already initialized", async () => {
    (mockGetCart as jest.Mock).mockResolvedValue({ cart: makeCart(), cartToken: "t1" });

    await act(async () => {
      await useCartStore.getState().initCart();
      await useCartStore.getState().initCart();
    });

    expect(mockGetCart).toHaveBeenCalledTimes(1);
  });
});

describe("useCartStore — addItem", () => {
  it("adds an item and updates the store", async () => {
    const cart = makeCart({ items_count: 1 });
    (mockGetCart as jest.Mock).mockResolvedValue({ cart: makeCart(), cartToken: "tok" });
    (mockAddToCart as jest.Mock).mockResolvedValue({ cart, cartToken: "tok" });

    await act(async () => {
      await useCartStore.getState().addItem(5, 1);
    });

    expect(useCartStore.getState().itemCount).toBe(1);
  });

  it("returns an error object when the action fails", async () => {
    (mockGetCart as jest.Mock).mockResolvedValue({ cart: makeCart(), cartToken: "tok" });
    (mockAddToCart as jest.Mock).mockResolvedValue({
      cart: null,
      cartToken: null,
      error: "Out of stock",
    });

    let result: { error?: string } = {};
    await act(async () => {
      result = await useCartStore.getState().addItem(5, 1);
    });

    expect(result.error).toBe("Out of stock");
  });
});

describe("useCartStore — updateItem", () => {
  it("calls updateCartItem with the correct key and quantity", async () => {
    const cart = makeCart({ items_count: 3 });
    (mockGetCart as jest.Mock).mockResolvedValue({ cart: makeCart(), cartToken: "tok" });
    (mockUpdateCartItem as jest.Mock).mockResolvedValue({ cart, cartToken: "tok" });

    await act(async () => {
      await useCartStore.getState().updateItem("key-abc", 3);
    });

    expect(mockUpdateCartItem).toHaveBeenCalledWith("key-abc", 3, expect.anything());
    expect(useCartStore.getState().itemCount).toBe(3);
  });
});

describe("useCartStore — removeItem", () => {
  it("calls removeFromCart and updates the cart", async () => {
    const cart = makeCart({ items_count: 0 });
    (mockGetCart as jest.Mock).mockResolvedValue({
      cart: makeCart({ items_count: 1 }),
      cartToken: "tok",
    });
    (mockRemoveFromCart as jest.Mock).mockResolvedValue({ cart, cartToken: "tok" });

    await act(async () => {
      await useCartStore.getState().removeItem("key-xyz");
    });

    expect(mockRemoveFromCart).toHaveBeenCalledWith("key-xyz", expect.anything());
    expect(useCartStore.getState().itemCount).toBe(0);
  });
});
