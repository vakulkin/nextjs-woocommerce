import {
  BillingSchema,
  ShippingSchema,
  AddToCartSchema,
  UpdateCartItemSchema,
  RemoveCartItemSchema,
  ShopParamsSchema,
  SearchQuerySchema,
  OrderConfirmationParamsSchema,
} from "@/lib/validation/schemas";

// ── BillingSchema ─────────────────────────────────────────────────────────────
describe("BillingSchema", () => {
  const validBilling = {
    first_name: "Jane",
    last_name: "Doe",
    company: "",
    address_1: "123 Main St",
    address_2: "",
    city: "New York",
    state: "NY",
    postcode: "10001",
    country: "US",
    email: "jane@example.com",
    phone: "+1 555 000 0000",
  };

  it("accepts a valid billing object", () => {
    const result = BillingSchema.safeParse(validBilling);
    expect(result.success).toBe(true);
  });

  it("rejects missing first_name", () => {
    const result = BillingSchema.safeParse({ ...validBilling, first_name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = BillingSchema.safeParse({ ...validBilling, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects missing country", () => {
    const result = BillingSchema.safeParse({ ...validBilling, country: "" });
    expect(result.success).toBe(false);
  });

  it("defaults company to empty string when not supplied", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { company, ...withoutCompany } = validBilling;
    const result = BillingSchema.safeParse(withoutCompany);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.company).toBe("");
    }
  });
});

// ── ShippingSchema ────────────────────────────────────────────────────────────
describe("ShippingSchema", () => {
  it("accepts an empty object (all fields have defaults)", () => {
    const result = ShippingSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.first_name).toBe("");
    }
  });

  it("accepts a fully populated shipping object", () => {
    const result = ShippingSchema.safeParse({
      first_name: "John",
      last_name: "Smith",
      address_1: "1 Park Ave",
      city: "Boston",
      postcode: "02108",
      country: "US",
    });
    expect(result.success).toBe(true);
  });
});

// ── AddToCartSchema ───────────────────────────────────────────────────────────
describe("AddToCartSchema", () => {
  it("accepts a valid add-to-cart payload", () => {
    const result = AddToCartSchema.safeParse({ productId: 5, quantity: 1 });
    expect(result.success).toBe(true);
  });

  it("rejects productId of 0", () => {
    const result = AddToCartSchema.safeParse({ productId: 0, quantity: 1 });
    expect(result.success).toBe(false);
  });

  it("rejects quantity of 0", () => {
    const result = AddToCartSchema.safeParse({ productId: 1, quantity: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects quantity greater than 999", () => {
    const result = AddToCartSchema.safeParse({ productId: 1, quantity: 1000 });
    expect(result.success).toBe(false);
  });

  it("accepts optional variation array", () => {
    const result = AddToCartSchema.safeParse({
      productId: 1,
      quantity: 2,
      variation: [{ attribute: "pa_size", value: "large" }],
    });
    expect(result.success).toBe(true);
  });
});

// ── UpdateCartItemSchema ──────────────────────────────────────────────────────
describe("UpdateCartItemSchema", () => {
  it("accepts quantity 0 (remove intent)", () => {
    const result = UpdateCartItemSchema.safeParse({ key: "abc", quantity: 0 });
    expect(result.success).toBe(true);
  });

  it("rejects empty key", () => {
    const result = UpdateCartItemSchema.safeParse({ key: "", quantity: 1 });
    expect(result.success).toBe(false);
  });
});

// ── RemoveCartItemSchema ──────────────────────────────────────────────────────
describe("RemoveCartItemSchema", () => {
  it("accepts a valid cart item key", () => {
    const result = RemoveCartItemSchema.safeParse({ key: "item-key-123" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty key", () => {
    const result = RemoveCartItemSchema.safeParse({ key: "" });
    expect(result.success).toBe(false);
  });
});

// ── ShopParamsSchema ──────────────────────────────────────────────────────────
describe("ShopParamsSchema", () => {
  it("accepts valid shop params", () => {
    const result = ShopParamsSchema.safeParse({
      page: "2",
      orderby: "price",
      order: "asc",
      on_sale: "true",
      category: "fragrance",
    });
    expect(result.success).toBe(true);
  });

  it("coerces invalid orderby to undefined via .catch", () => {
    const result = ShopParamsSchema.safeParse({ orderby: "invalid-sort" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.orderby).toBeUndefined();
    }
  });

  it("coerces invalid category to undefined via .catch", () => {
    const result = ShopParamsSchema.safeParse({ category: "UPPER CASE" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.category).toBeUndefined();
    }
  });

  it("coerces non-numeric page to undefined", () => {
    const result = ShopParamsSchema.safeParse({ page: "abc" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBeUndefined();
    }
  });
});

// ── SearchQuerySchema ─────────────────────────────────────────────────────────
describe("SearchQuerySchema", () => {
  it("accepts a valid trimmed query", () => {
    expect(SearchQuerySchema.safeParse("  perfume  ").success).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(SearchQuerySchema.safeParse("").success).toBe(false);
  });

  it("rejects a string longer than 200 chars", () => {
    expect(SearchQuerySchema.safeParse("a".repeat(201)).success).toBe(false);
  });
});

// ── OrderConfirmationParamsSchema ─────────────────────────────────────────────
describe("OrderConfirmationParamsSchema", () => {
  it("accepts a valid order confirmation payload", () => {
    const result = OrderConfirmationParamsSchema.safeParse({
      order_id: "42",
      session_id: "cs_test_abc123XYZ",
      order_key: "wc_order_abc123",
      billing_email: "buyer@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("coerces invalid session_id to undefined", () => {
    const result = OrderConfirmationParamsSchema.safeParse({
      session_id: "invalid",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.session_id).toBeUndefined();
    }
  });

  it("coerces invalid order_key to undefined", () => {
    const result = OrderConfirmationParamsSchema.safeParse({
      order_key: "not-a-wc-key",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.order_key).toBeUndefined();
    }
  });
});
