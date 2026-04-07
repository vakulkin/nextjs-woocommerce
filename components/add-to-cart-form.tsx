"use client";

import { useState, useTransition } from "react";
import type { WooProduct } from "@/lib/woocommerce/types";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sortTerms } from "@/lib/utils/product";
import { ShoppingCart, ExternalLink, Check } from "lucide-react";
import { WishlistButton } from "@/components/wishlist-button";
import { QuantityInput } from "@/components/ui/quantity-input";
import { trackAddToCart } from "@/lib/utils/gtm-events";
import { productToEcommerceItem } from "@/lib/utils/gtm-items";
import { t } from "@/lib/i18n";


interface AddToCartFormProps {
  product: WooProduct;
  /** Server-resolved variation ID — the canonical ID to add to cart. */
  variationId?: number;
  selectedVariation: Record<string, string>;
  onVariationChange: (attr: string, value: string) => void;
  /** Whether the currently selected variation is in stock (for variable products). */
  variationInStock?: boolean;
}

/**
 * For a given attribute term slug, check if it participates in at least one
 * in-stock variation. Returns undefined when no stock data is available on the
 * variations array (i.e. the Store API didn't include it), which means we
 * can't determine availability and should not show OOS styling.
 */
function isTermInStock(
  attrName: string,
  termSlug: string,
  product: WooProduct
): boolean | undefined {
  const hasStockData = product.variations.some((v) => v.is_in_stock !== undefined);
  if (!hasStockData) return undefined;

  const matching = product.variations.filter((v) =>
    v.attributes.some((va) => {
      if (va.name !== attrName) return false;
      const attr = product.attributes.find((a) => a.name === va.name);
      if (!attr) return false;
      const term =
        attr.terms.find((t) => t.name === va.value) ??
        attr.terms.find((t) => t.slug === va.value);
      return term?.slug === termSlug;
    })
  );
  if (!matching.length) return undefined;
  return matching.some((v) => v.is_in_stock !== false);
}

export function AddToCartForm({ product, variationId, selectedVariation, onVariationChange, variationInStock }: AddToCartFormProps) {
  const { addItem, openCart } = useCartStore();
  const [quantity, setQuantity] = useState(product.add_to_cart.minimum || 1);
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);

  const min = product.add_to_cart.minimum || 1;
  const max = product.add_to_cart.maximum || 99;

  // Use variation-level stock when available, fall back to parent product.
  const isInStock = product.type === "variable"
    ? (variationInStock ?? product.is_in_stock)
    : product.is_in_stock;

  function handleAddToCart() {
    if (product.type === "external") {
      window.open(product.external_url, "_blank", "noopener,noreferrer");
      return;
    }

    // For variable products, ensure all attributes are selected
    if (product.type === "variable" && product.attributes.length > 0) {
      const variationAttrs = product.attributes.filter((a) => a.has_variations);
      const allSelected = variationAttrs.every(
        (attr) => selectedVariation[attr.name]
      );
      if (!allSelected) {
        toast.error(t.product.selectAllOptions);
        return;
      }
    }

    startTransition(async () => {
      // For variable products the Store API requires the variation's own ID.
      // We use the server-resolved variationId (same source as pricing) rather
      // than re-deriving it client-side from selectedVariation attributes.
      const idToAdd = (product.type === "variable" && variationId) ? variationId : product.id;

      const result = await addItem(idToAdd, quantity);
      if (result.error) {
        toast.error(t.product.cantAddToCart, { description: result.error });
      } else {
        trackAddToCart(
          { ...productToEcommerceItem(product), item_id: String(variationId ?? product.id), quantity },
          product.prices.currency_code
        );
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
        openCart();
      }
    });
  }

  // External product
  if (product.type === "external") {
    return (
      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        {product.button_text || t.product.buyProduct}
      </Button>
    );
  }

  // Grouped product — show links to individual products
  if (product.type === "grouped") {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {t.product.groupedHint}
        </p>
      <a href="/shop" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full")}>
          {t.product.browseProducts}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Variable product options */}
      {product.type === "variable" &&
        product.attributes
          .filter((attr) => attr.has_variations)
          .map((attr) => {
            const sorted = sortTerms(attr.terms);
            return (
              <div key={attr.name}>
                <p className="text-sm font-medium mb-2">
                  {attr.name}:
                  <span className="font-normal text-muted-foreground ml-1">
                    {sorted.find((t) => t.slug === selectedVariation[attr.name])?.name ?? ""}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2" role="group" aria-label={`Select ${attr.name}`}>
                  {sorted.map((term) => {
                    const isSelected = selectedVariation[attr.name] === term.slug;
                    const termStock = isTermInStock(attr.name, term.slug, product);
                    const termIsOos = termStock === false;
                    return (
                      <button
                        key={term.slug}
                        type="button"
                        onClick={() => onVariationChange(attr.name, term.slug)}
                        aria-pressed={isSelected}
                        title={termIsOos ? "Out of stock" : undefined}
                        className={cn(
                          "px-3 py-1.5 text-sm rounded-md border transition-colors duration-150 relative",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isSelected
                            ? termIsOos
                              ? "border-muted-foreground bg-muted text-muted-foreground"
                              : "border-foreground bg-foreground text-background"
                            : termIsOos
                              ? "border-border text-muted-foreground line-through hover:border-muted-foreground/50"
                              : "border-border hover:border-foreground/50 hover:bg-accent"
                        )}
                      >
                        {term.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

      {/* Quantity */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">{t.product.quantity}</label>
        <QuantityInput
          value={quantity}
          min={min}
          max={max}
          onDecrement={() => setQuantity(Math.max(min, quantity - 1))}
          onIncrement={() => setQuantity(Math.min(max, quantity + 1))}
        />
      </div>

      {/* Add to Cart + Wishlist */}
      <div className="flex gap-2">
        <Button
          size="lg"
          className="flex-1 transition-all"
          onClick={handleAddToCart}
          disabled={!product.is_purchasable || !isInStock || isPending}
          aria-live="polite"
        >
          {justAdded ? (
            <><Check className="mr-2 h-4 w-4" />{t.product.added}</>
          ) : isPending ? (
            <><ShoppingCart className="mr-2 h-4 w-4 animate-bounce" />{t.product.adding}</>
          ) : !isInStock ? (
            t.product.outOfStock
          ) : (
            <><ShoppingCart className="mr-2 h-4 w-4" />{t.product.addToCart}</>
          )}
        </Button>
        <WishlistButton product={product} size="default" />
      </div>
    </div>
  );
}
