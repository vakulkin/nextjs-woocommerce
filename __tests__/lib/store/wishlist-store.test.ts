/**
 * Wishlist store tests.
 *
 * The store uses zustand/persist which writes to localStorage. We reset the
 * store between tests by calling `clear()` to keep tests independent.
 */
import { act } from "react";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { makeProduct } from "../../fixtures";

// Reset the store state before every test
beforeEach(() => {
  act(() => {
    useWishlistStore.getState().clear();
  });
});

describe("useWishlistStore — toggle", () => {
  it("adds a product when it is not yet wishlisted", () => {
    const product = makeProduct({ id: 1, name: "Rose Oud" });
    act(() => {
      useWishlistStore.getState().toggle(product);
    });

    const { items } = useWishlistStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(1);
    expect(items[0].name).toBe("Rose Oud");
  });

  it("removes a product when it is already wishlisted", () => {
    const product = makeProduct({ id: 2 });
    act(() => {
      useWishlistStore.getState().toggle(product);
      useWishlistStore.getState().toggle(product);
    });

    expect(useWishlistStore.getState().items).toHaveLength(0);
  });

  it("preserves other items when toggling one item off", () => {
    const p1 = makeProduct({ id: 1 });
    const p2 = makeProduct({ id: 2 });
    act(() => {
      useWishlistStore.getState().toggle(p1);
      useWishlistStore.getState().toggle(p2);
      useWishlistStore.getState().toggle(p1); // remove p1
    });

    const { items } = useWishlistStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(2);
  });
});

describe("useWishlistStore — remove", () => {
  it("removes a specific product by id", () => {
    const p1 = makeProduct({ id: 10 });
    const p2 = makeProduct({ id: 20 });
    act(() => {
      useWishlistStore.getState().toggle(p1);
      useWishlistStore.getState().toggle(p2);
      useWishlistStore.getState().remove(10);
    });

    const { items } = useWishlistStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(20);
  });

  it("does nothing when removing a non-existent id", () => {
    const product = makeProduct({ id: 1 });
    act(() => {
      useWishlistStore.getState().toggle(product);
      useWishlistStore.getState().remove(999);
    });

    expect(useWishlistStore.getState().items).toHaveLength(1);
  });
});

describe("useWishlistStore — isWishlisted", () => {
  it("returns true for a wishlisted product", () => {
    act(() => {
      useWishlistStore.getState().toggle(makeProduct({ id: 5 }));
    });

    expect(useWishlistStore.getState().isWishlisted(5)).toBe(true);
  });

  it("returns false for a product that is not wishlisted", () => {
    expect(useWishlistStore.getState().isWishlisted(999)).toBe(false);
  });
});

describe("useWishlistStore — clear", () => {
  it("empties the wishlist", () => {
    act(() => {
      useWishlistStore.getState().toggle(makeProduct({ id: 1 }));
      useWishlistStore.getState().toggle(makeProduct({ id: 2 }));
      useWishlistStore.getState().clear();
    });

    expect(useWishlistStore.getState().items).toHaveLength(0);
  });
});

describe("useWishlistStore — stored item shape", () => {
  it("stores only the required WishlistItem fields", () => {
    const product = makeProduct({ id: 42, slug: "rose-oud", on_sale: true });
    act(() => {
      useWishlistStore.getState().toggle(product);
    });

    const item = useWishlistStore.getState().items[0];
    expect(item).toMatchObject({
      id: 42,
      slug: "rose-oud",
      name: product.name,
      on_sale: true,
      is_in_stock: product.is_in_stock,
    });
    // Server-only fields like `description` should NOT be stored
    expect((item as unknown as Record<string, unknown>).description).toBeUndefined();
  });
});
