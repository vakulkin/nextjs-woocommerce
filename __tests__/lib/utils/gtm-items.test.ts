import {
  productToEcommerceItem,
  cartItemsToEcommerceItems,
  orderItemsToEcommerceItems,
} from "@/lib/utils/gtm-items";
import { makeProduct, makeCartItem, makeOrderItem } from "../../fixtures";

describe("productToEcommerceItem", () => {
  it("maps product fields correctly", () => {
    const product = makeProduct();
    const item = productToEcommerceItem(product);

    expect(item.item_id).toBe("1");
    expect(item.item_name).toBe("Test Perfume");
    expect(item.item_category).toBe("Fragrance");
    expect(item.price).toBe(29.99);
    expect(item.quantity).toBe(1);
    expect(item.index).toBe(0);
  });

  it("uses the provided index", () => {
    const item = productToEcommerceItem(makeProduct(), 3);
    expect(item.index).toBe(3);
  });

  it("decodes HTML entities in product name", () => {
    const product = makeProduct({ name: "Rose &amp; Oud" });
    const item = productToEcommerceItem(product);
    expect(item.item_name).toBe("Rose & Oud");
  });

  it("uses empty string for category when product has no categories", () => {
    const product = makeProduct({ categories: [] });
    const item = productToEcommerceItem(product);
    expect(item.item_category).toBe("");
  });
});

describe("cartItemsToEcommerceItems", () => {
  it("converts a list of cart items to ecommerce items", () => {
    const items = [
      makeCartItem({ id: 1, name: "Perfume A", quantity: 2 }),
      makeCartItem({ id: 2, name: "Perfume B", quantity: 1 }),
    ];

    const result = cartItemsToEcommerceItems(items);

    expect(result).toHaveLength(2);
    expect(result[0].item_id).toBe("1");
    expect(result[0].item_name).toBe("Perfume A");
    expect(result[0].quantity).toBe(2);
    expect(result[0].price).toBe(29.99);
    expect(result[0].index).toBe(0);
    expect(result[1].index).toBe(1);
  });

  it("returns empty array for empty cart", () => {
    expect(cartItemsToEcommerceItems([])).toEqual([]);
  });
});

describe("orderItemsToEcommerceItems", () => {
  it("converts order items to ecommerce items using sku as item_id", () => {
    const items = [makeOrderItem({ sku: "SKU-1", name: "Item One", quantity: 3 })];
    const result = orderItemsToEcommerceItems(items);

    expect(result[0].item_id).toBe("SKU-1");
    expect(result[0].item_name).toBe("Item One");
    expect(result[0].quantity).toBe(3);
    expect(result[0].price).toBe(29.99);
  });

  it("falls back to string id when sku is empty", () => {
    const items = [makeOrderItem({ id: 99, sku: "" })];
    const result = orderItemsToEcommerceItems(items);
    expect(result[0].item_id).toBe("99");
  });

  it("returns empty array for empty order", () => {
    expect(orderItemsToEcommerceItems([])).toEqual([]);
  });
});
