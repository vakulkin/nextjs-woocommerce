"use client";

import Link from "next/link";
import Image from "next/image";
import type { WooProduct } from "@/lib/woocommerce/types";
import { formatProductPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/wishlist-button";
import { trackSelectItem } from "@/lib/utils/gtm-events";
import { productToEcommerceItem } from "@/lib/utils/gtm-items";
import { t } from "@/lib/i18n";

interface ProductCardProps {
  product: WooProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { current, regular, onSale } = formatProductPrice(product.prices);
  const image = product.images[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      onClick={() => trackSelectItem(productToEcommerceItem(product), "Product List", product.prices.currency_code)}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary/60 mb-4">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            {t('product.noImageAlt')}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/8 transition-colors duration-300 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100">
          <span className="bg-background/95 backdrop-blur-sm text-foreground text-xs font-medium tracking-[0.15em] uppercase px-4 py-2 rounded-full shadow-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {t('product.viewProduct')}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {onSale && (
            <Badge className="text-[10px] tracking-wider uppercase font-medium px-2 py-0.5 bg-[var(--gold)] text-white border-0 hover:bg-[var(--gold)]">
              {t('product.saleBadge')}
            </Badge>
          )}
          {!product.is_in_stock && (
            <Badge variant="secondary" className="text-[10px] tracking-wider uppercase font-medium px-2 py-0.5">
              {t('product.soldOutBadge')}
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <div className="absolute top-3 right-3">
          <WishlistButton product={product} size="sm" />
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        {product.categories[0] && (
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">
            {product.categories[0].name}
          </p>
        )}
        <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-foreground transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="font-semibold text-sm">{current}</span>
          {onSale && (
            <span className="text-xs text-muted-foreground line-through">{regular}</span>
          )}
        </div>
        {product.prices.price_range && (
          <p className="text-xs text-muted-foreground">
            {t('product.priceFrom')} {formatProductPrice({ ...product.prices, price: product.prices.price_range.min_amount }).current}
          </p>
        )}
      </div>
    </Link>
  );
}
