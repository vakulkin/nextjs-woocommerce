"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { StarRating } from "@/components/product/star-rating";
import { formatProductPrice } from "@/lib/utils/format";
import { findMatchedVariation, buildSelectionFromVariation } from "@/lib/utils/product";
import type { WooProduct } from "@/lib/woocommerce/types";
import { Truck, RotateCcw, ShieldCheck, Award } from "lucide-react";
import { t } from "@/lib/i18n";

interface ProductInfoProps {
  product: WooProduct;
  initialVariationId?: number;
  initialVariationPrices?: WooProduct["prices"];
  initialVariationInStock?: boolean;
}


export function ProductInfo({ product, initialVariationId, initialVariationPrices, initialVariationInStock }: ProductInfoProps) {
  const router = useRouter();

  const [selectedVariation, setSelectedVariation] = useState<Record<string, string>>(() => {
    if (product.type !== "variable") return {};

    if (initialVariationId) {
      const varObj = product.variations.find((v) => v.id === initialVariationId);
      if (varObj) return buildSelectionFromVariation(product, varObj);
    }

    // Server didn't provide initialVariationId; fall back to first variation.
    const first = product.variations[0];
    return first ? buildSelectionFromVariation(product, first) : {};
  });

  function handleVariationChange(attrName: string, termSlug: string) {
    const next = { ...selectedVariation, [attrName]: termSlug };
    setSelectedVariation(next);
    const matched = findMatchedVariation(product, next);
    if (matched) {
      router.push(`/product/${product.slug}/${matched.id}`, { scroll: false });
    }
  }

  const displayPrices = initialVariationPrices ?? product.prices;
  const { current, regular, onSale } = formatProductPrice(displayPrices);

  // Resolve the currently matched variation to derive per-variation stock status.
  const matchedVariation = product.type === "variable"
    ? findMatchedVariation(product, selectedVariation)
    : undefined;

  // Stock priority: matched variation (parent array) → server-fetched initialVariationInStock → parent product.
  const variationInStock =
    product.type === "variable"
      ? (matchedVariation?.is_in_stock ?? initialVariationInStock ?? product.is_in_stock)
      : product.is_in_stock;

  const divisor = Math.pow(10, displayPrices.currency_minor_unit);
  const priceAmt = parseInt(displayPrices.price) / divisor;
  const regularAmt = parseInt(displayPrices.regular_price || displayPrices.price) / divisor;
  const savingsPct =
    onSale && regularAmt > 0 ? Math.round((1 - priceAmt / regularAmt) * 100) : 0;

  return (
    <div className="space-y-5">
      {product.categories[0] && (
        <p className="text-xs tracking-[0.25em] uppercase text-[var(--gold)] font-medium">
          {product.categories[0].name}
        </p>
      )}

      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold leading-tight mb-3">
          {product.name}
        </h1>
        <StarRating rating={product.average_rating} count={product.review_count} />
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-2xl font-bold">
          {current}
        </span>
        {onSale && (
          <>
            <span className="text-base text-muted-foreground line-through">{regular}</span>
            <Badge className="bg-[var(--gold)] text-white border-0 hover:bg-[var(--gold)] text-[10px] tracking-wider uppercase">
              {t.product.savePct} {savingsPct}%
            </Badge>
          </>
        )}
      </div>

      {!initialVariationPrices && product.prices.price_range && (
        <p className="text-sm text-muted-foreground">
          {t.product.priceFrom}{" "}
          {
            formatProductPrice({
              ...product.prices,
              price: product.prices.price_range.min_amount,
            }).current
          }
          {" "}–{" "}
          {
            formatProductPrice({
              ...product.prices,
              price: product.prices.price_range.max_amount,
            }).current
          }
        </p>
      )}

      {/* Stock — use variation-level stock for variable products */}
      <div className="flex items-center gap-3">
        {variationInStock ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            {t.product.inStock}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" aria-hidden="true" />
            {t.product.outOfStock}
          </span>
        )}
        {product.low_stock_remaining && (
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            Only {product.low_stock_remaining} left – order soon
          </span>
        )}
      </div>

      {/* Short description */}
      {product.short_description && (
        <div
          className="text-sm text-muted-foreground leading-relaxed prose dark:prose-invert prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: product.short_description }}
        />
      )}

      <Separator className="border-border/50" />

      <AddToCartForm
        product={product}
        variationId={initialVariationId}
        selectedVariation={selectedVariation}
        onVariationChange={handleVariationChange}
        variationInStock={variationInStock}
      />

      {/* Trust badges */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {([
          { Icon: Truck, label: t.product.freeShipping, sub: t.product.freeShippingSub },
          { Icon: RotateCcw, label: t.product.returns, sub: t.product.returnsSub },
          { Icon: ShieldCheck, label: t.product.secureCheckout, sub: t.product.secureCheckoutSub },
          { Icon: Award, label: t.product.authenticity, sub: t.product.authenticitySub },
        ] as const).map(({ Icon, label, sub }) => (
          <div key={label} className="flex items-start gap-2">
            <Icon className="h-4 w-4 mt-0.5 shrink-0 text-[var(--gold)]" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium">{label}</p>
              <p className="text-[11px] text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Meta */}
      <div className="space-y-1.5 pt-1">
        {product.sku && (
          <p className="text-xs text-muted-foreground">{t.product.sku} {product.sku}</p>
        )}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="text-[10px] tracking-wider uppercase font-medium"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
