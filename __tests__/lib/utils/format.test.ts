import { formatPrice, formatProductPrice, stripHtml } from "@/lib/utils/format";

describe("formatPrice", () => {
  it("converts minor-unit integer to decimal display with prefix", () => {
    expect(formatPrice("2999", 2, "$")).toBe("$29.99");
  });

  it("handles zero price", () => {
    expect(formatPrice("0", 2, "$")).toBe("$0.00");
  });

  it("handles 0 minor units (whole currency)", () => {
    expect(formatPrice("99", 0, "¥")).toBe("¥99");
  });

  it("appends currency suffix when provided", () => {
    expect(formatPrice("1000", 2, "", " USD")).toBe("10.00 USD");
  });

  it("defaults to 2 minor units and $ prefix", () => {
    expect(formatPrice("500")).toBe("$5.00");
  });
});

describe("formatProductPrice", () => {
  const basePrices = {
    currency_minor_unit: 2,
    currency_prefix: "$",
    currency_suffix: "",
  };

  it("marks product as on sale when sale_price differs from regular_price", () => {
    const result = formatProductPrice({
      ...basePrices,
      price: "2999",
      regular_price: "3999",
      sale_price: "2999",
    });

    expect(result.current).toBe("$29.99");
    expect(result.regular).toBe("$39.99");
    expect(result.onSale).toBe(true);
  });

  it("marks product as NOT on sale when sale_price is empty", () => {
    const result = formatProductPrice({
      ...basePrices,
      price: "3999",
      regular_price: "3999",
      sale_price: "",
    });

    expect(result.onSale).toBe(false);
  });

  it("marks product as NOT on sale when sale_price equals regular_price", () => {
    const result = formatProductPrice({
      ...basePrices,
      price: "3999",
      regular_price: "3999",
      sale_price: "3999",
    });

    expect(result.onSale).toBe(false);
  });
});

describe("stripHtml", () => {
  it("removes simple HTML tags", () => {
    expect(stripHtml("<p>Hello world</p>")).toBe("Hello world");
  });

  it("removes nested tags", () => {
    expect(stripHtml("<p>A <strong>bold</strong> word</p>")).toBe(
      "A bold word"
    );
  });

  it("returns plain string unchanged", () => {
    expect(stripHtml("no tags here")).toBe("no tags here");
  });

  it("returns empty string for empty input", () => {
    expect(stripHtml("")).toBe("");
  });

  it("strips tags with attributes", () => {
    expect(stripHtml('<a href="https://example.com">link</a>')).toBe("link");
  });
});
