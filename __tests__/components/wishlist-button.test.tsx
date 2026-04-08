import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { WishlistButton } from "@/components/wishlist-button";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { trackAddToWishlist } from "@/lib/utils/gtm-events";
import { toast } from "sonner";
import { t } from "@/lib/i18n";
import { makeProduct } from "../fixtures";

jest.mock("@/lib/store/wishlist-store", () => ({
  useWishlistStore: jest.fn(),
}));

jest.mock("@/lib/utils/gtm-events", () => ({
  trackAddToWishlist: jest.fn(),
}));

jest.mock("@/lib/utils/gtm-items", () => ({
  productToEcommerceItem: jest.fn(() => ({ item_id: "1", item_name: "Test Product" })),
}));

jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

const mockToggle = jest.fn();
const mockToast = jest.mocked(toast);
const mockTrackAddToWishlist = jest.mocked(trackAddToWishlist);

const product = makeProduct({ id: 1 });

function setupStore(wishlisted: boolean) {
  const state = {
    _hasHydrated: true,
    items: wishlisted ? [product] : [],
    toggle: mockToggle,
  };
  (useWishlistStore as unknown as jest.Mock).mockImplementation(
    (selector: (s: typeof state) => unknown) => selector(state)
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  setupStore(false);
});

describe("WishlistButton", () => {
  it("renders a button", () => {
    render(<WishlistButton product={product} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has 'Add to wishlist' aria-label when product is not wishlisted", () => {
    render(<WishlistButton product={product} />);
    expect(screen.getByRole("button")).toHaveAccessibleName(t('wishlist.addAriaLabel'));
  });

  it("has 'Remove from wishlist' aria-label when product is wishlisted", () => {
    setupStore(true);
    render(<WishlistButton product={product} />);
    expect(screen.getByRole("button")).toHaveAccessibleName(t('wishlist.removeAriaLabel'));
  });

  it("has aria-pressed=false when not wishlisted", () => {
    render(<WishlistButton product={product} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("has aria-pressed=true when wishlisted", () => {
    setupStore(true);
    render(<WishlistButton product={product} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  describe("clicking when NOT in wishlist", () => {
    it("calls trackAddToWishlist", () => {
      render(<WishlistButton product={product} />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockTrackAddToWishlist).toHaveBeenCalledTimes(1);
    });

    it("calls toggle with the product", () => {
      render(<WishlistButton product={product} />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockToggle).toHaveBeenCalledWith(product);
    });

    it("shows saved toast", () => {
      render(<WishlistButton product={product} />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockToast).toHaveBeenCalledWith(t('wishlist.savedToast'));
    });
  });

  describe("clicking when IS in wishlist", () => {
    it("does NOT call trackAddToWishlist", () => {
      setupStore(true);
      render(<WishlistButton product={product} />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockTrackAddToWishlist).not.toHaveBeenCalled();
    });

    it("calls toggle with the product", () => {
      setupStore(true);
      render(<WishlistButton product={product} />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockToggle).toHaveBeenCalledWith(product);
    });

    it("shows removed toast", () => {
      setupStore(true);
      render(<WishlistButton product={product} />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockToast).toHaveBeenCalledWith(t('wishlist.removedToast'));
    });
  });
});
