import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";
import { t } from "@/lib/i18n";
import { makeProduct } from "../fixtures";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/store/cart-store", () => ({
  useCartStore: jest.fn(),
}));

jest.mock("@/lib/utils/gtm-events", () => ({
  trackAddToCart: jest.fn(),
}));

jest.mock("@/lib/utils/gtm-items", () => ({
  productToEcommerceItem: jest.fn(() => ({ item_id: "1", item_name: "Test" })),
}));

jest.mock("sonner", () => ({
  toast: Object.assign(jest.fn(), { error: jest.fn() }),
}));

// Stub out WishlistButton — not under test here
jest.mock("@/components/wishlist-button", () => ({
  WishlistButton: () => null,
}));

const mockAddItem = jest.fn();
const mockOpenCart = jest.fn();
const mockToastError = jest.mocked(toast.error);

function setupStore({ addResult = { error: undefined } }: { addResult?: { error?: string } } = {}) {
  mockAddItem.mockResolvedValue(addResult);
  (useCartStore as unknown as jest.Mock).mockReturnValue({
    addItem: mockAddItem,
    openCart: mockOpenCart,
  });
}

const noopVariationChange = jest.fn();
const defaultProps = {
  selectedVariation: {},
  onVariationChange: noopVariationChange,
};

beforeEach(() => {
  jest.clearAllMocks();
  setupStore();
});

// ── Simple product ─────────────────────────────────────────────────────────────

describe("simple product (in stock)", () => {
  it("renders the Add to Cart button", () => {
    render(<AddToCartForm product={makeProduct()} {...defaultProps} />);
    expect(screen.getByRole("button", { name: new RegExp(t.product.addToCart, "i") })).toBeInTheDocument();
  });

  it("button is enabled when product is purchasable and in stock", () => {
    render(<AddToCartForm product={makeProduct()} {...defaultProps} />);
    expect(screen.getByRole("button", { name: new RegExp(t.product.addToCart, "i") })).not.toBeDisabled();
  });

  it("renders the quantity input controls", () => {
    render(<AddToCartForm product={makeProduct()} {...defaultProps} />);
    expect(screen.getByRole("button", { name: /increase quantity/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /decrease quantity/i })).toBeInTheDocument();
  });

  it("calls addItem and openCart on submit", async () => {
    render(<AddToCartForm product={makeProduct({ id: 7 })} {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(t.product.addToCart, "i") }));
    await waitFor(() => expect(mockAddItem).toHaveBeenCalledWith(7, 1));
    expect(mockOpenCart).toHaveBeenCalled();
  });
});

// ── Out of stock ──────────────────────────────────────────────────────────────

describe("simple product (out of stock)", () => {
  it("renders the out of stock text inside the button", () => {
    render(<AddToCartForm product={makeProduct({ is_in_stock: false })} {...defaultProps} />);
    expect(screen.getByRole("button", { name: new RegExp(t.product.outOfStock, "i") })).toBeInTheDocument();
  });

  it("button is disabled when out of stock", () => {
    render(<AddToCartForm product={makeProduct({ is_in_stock: false })} {...defaultProps} />);
    expect(screen.getByRole("button", { name: new RegExp(t.product.outOfStock, "i") })).toBeDisabled();
  });
});

// ── External product ──────────────────────────────────────────────────────────

describe("external product", () => {
  it("renders the default buy button label when no button_text supplied", () => {
    render(
      <AddToCartForm
        product={makeProduct({ type: "external", external_url: "https://example.com" })}
        {...defaultProps}
      />
    );
    expect(screen.getByRole("button", { name: new RegExp(t.product.buyProduct, "i") })).toBeInTheDocument();
  });

  it("uses product.button_text when provided", () => {
    render(
      <AddToCartForm
        product={makeProduct({ type: "external", external_url: "https://example.com", button_text: "Buy Now" })}
        {...defaultProps}
      />
    );
    expect(screen.getByRole("button", { name: /Buy Now/i })).toBeInTheDocument();
  });

  it("opens external URL in a new tab on click", () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
    render(
      <AddToCartForm
        product={makeProduct({ type: "external", external_url: "https://partner.com/buy" })}
        {...defaultProps}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(openSpy).toHaveBeenCalledWith("https://partner.com/buy", "_blank", "noopener,noreferrer");
    openSpy.mockRestore();
  });

  it("does NOT render a quantity input", () => {
    render(
      <AddToCartForm
        product={makeProduct({ type: "external", external_url: "https://example.com" })}
        {...defaultProps}
      />
    );
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });
});

// ── Grouped product ───────────────────────────────────────────────────────────

describe("grouped product", () => {
  it("renders the grouped hint text", () => {
    render(<AddToCartForm product={makeProduct({ type: "grouped" })} {...defaultProps} />);
    expect(screen.getByText(t.product.groupedHint)).toBeInTheDocument();
  });

  it("renders a link to browse products", () => {
    render(<AddToCartForm product={makeProduct({ type: "grouped" })} {...defaultProps} />);
    expect(screen.getByRole("link", { name: new RegExp(t.product.browseProducts, "i") })).toBeInTheDocument();
  });

  it("does NOT render an Add to Cart button", () => {
    render(<AddToCartForm product={makeProduct({ type: "grouped" })} {...defaultProps} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

// ── Variable product — attribute selection ────────────────────────────────────

describe("variable product", () => {
  const variableProduct = makeProduct({
    type: "variable",
    attributes: [
      {
        id: 1,
        name: "Size",
        taxonomy: "pa_size",
        has_variations: true,
        terms: [
          { id: 1, name: "Small", slug: "small", default: false },
          { id: 2, name: "Large", slug: "large", default: false },
        ],
      },
    ],
  });

  it("renders attribute term buttons", () => {
    render(
      <AddToCartForm
        product={variableProduct}
        selectedVariation={{}}
        onVariationChange={noopVariationChange}
      />
    );
    expect(screen.getByRole("button", { name: /Small/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Large/i })).toBeInTheDocument();
  });

  it("shows toast error when trying to add without selecting all attributes", () => {
    render(
      <AddToCartForm
        product={variableProduct}
        selectedVariation={{}} // no Size selected
        onVariationChange={noopVariationChange}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: new RegExp(t.product.addToCart, "i") }));
    expect(mockToastError).toHaveBeenCalledWith(t.product.selectAllOptions);
    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it("calls addItem when all required attributes are selected", async () => {
    render(
      <AddToCartForm
        product={variableProduct}
        variationId={99}
        selectedVariation={{ Size: "small" }} // all attributes selected
        onVariationChange={noopVariationChange}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: new RegExp(t.product.addToCart, "i") }));
    await waitFor(() => expect(mockAddItem).toHaveBeenCalledWith(99, 1));
  });
});

// ── Quantity input ────────────────────────────────────────────────────────────

describe("quantity controls", () => {
  it("increments the quantity value", () => {
    const { container } = render(<AddToCartForm product={makeProduct()} {...defaultProps} />);
    const quantitySpan = container.querySelector('[aria-live="polite"]')!;
    expect(quantitySpan).toHaveTextContent("1");
    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
    expect(quantitySpan).toHaveTextContent("2");
  });

  it("decrement button is disabled at minimum quantity", () => {
    render(<AddToCartForm product={makeProduct()} {...defaultProps} />);
    // starts at minimum (1), so the decrement button should be disabled
    expect(screen.getByRole("button", { name: /decrease quantity/i })).toBeDisabled();
  });

  it("increment button becomes disabled at maximum", () => {
    render(
      <AddToCartForm
        product={makeProduct({ add_to_cart: { text: "", description: "", url: "", minimum: 1, maximum: 2, multiple_of: 1 } })}
        {...defaultProps}
      />
    );
    const incrementBtn = screen.getByRole("button", { name: /increase quantity/i });
    fireEvent.click(incrementBtn); // value → 2 (equals max)
    expect(incrementBtn).toBeDisabled();
  });
});

// ── Add to cart error handling ────────────────────────────────────────────────

describe("add to cart error", () => {
  it("shows error toast when addItem returns an error", async () => {
    setupStore({ addResult: { error: "Cannot add item" } });
    render(<AddToCartForm product={makeProduct()} {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(t.product.addToCart, "i") }));
    await waitFor(() =>
      expect(mockToastError).toHaveBeenCalledWith(
        t.product.cantAddToCart,
        expect.objectContaining({ description: "Cannot add item" })
      )
    );
    expect(mockOpenCart).not.toHaveBeenCalled();
  });
});
