"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatProductPrice } from "@/lib/utils/format";
import { Heart, ShoppingBag, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { validateWishlistItems } from "@/lib/actions/wishlist";
import { t } from "@/lib/i18n";

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] rounded-lg bg-secondary/60 mb-4" />
          <div className="space-y-2">
            <div className="h-3 bg-secondary/60 rounded w-1/3" />
            <div className="h-4 bg-secondary/60 rounded w-3/4" />
            <div className="h-4 bg-secondary/60 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function WishlistPageContent() {
  const { items, remove, clear, _hasHydrated } = useWishlistStore();

  // After hydration, verify that every saved product still exists in WooCommerce.
  // Any product that has been deleted or unpublished is silently removed.
  useEffect(() => {
    if (!_hasHydrated || items.length === 0) return;
    const ids = items.map((i) => i.id);
    validateWishlistItems(ids).then((validIds) => {
      const validSet = new Set(validIds);
      items.forEach((item) => {
        if (!validSet.has(item.id)) {
          remove(item.id);
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated]);

  const handleRemove = (id: number, name: string) => {
    remove(id);
    toast(`${name} ${t('wishlist.removedFromWishlist')}`);
  };

  if (!_hasHydrated) {
    return (
      <main className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">{t('wishlist.pageTitle')}</h1>
        <WishlistSkeleton />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 md:px-6 py-24 flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-secondary/60 flex items-center justify-center">
          <Heart className="h-9 w-9 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold">{t('wishlist.emptyTitle')}</h1>
          <p className="text-muted-foreground max-w-sm">
            {t('wishlist.emptyHint')}
          </p>
        </div>
        <Link href="/shop" className={buttonVariants({ size: "lg" })}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          {t('wishlist.browseCollection')}
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 md:px-6 py-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] font-medium mb-1">
            {t('wishlist.savedItems')}
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold">
            {t('wishlist.pageTitle')}
            <span className="ml-3 text-base font-normal text-muted-foreground font-sans">
              ({items.length} {items.length === 1 ? t('wishlist.itemSingular') : t('wishlist.itemPlural')})
            </span>
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive shrink-0"
          onClick={() => {
            clear();
            toast(t('wishlist.wishlistCleared'));
          }}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          {t('wishlist.clearAll')}
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const { current, regular, onSale } = formatProductPrice(item.prices);
          const image = item.images[0];

          return (
            <div key={item.id} className="group relative">
              {/* Remove button */}
              <button
                onClick={() => handleRemove(item.id, item.name)}
                className="absolute top-3 right-3 z-10 h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background shadow-sm transition-all opacity-0 group-hover:opacity-100"
                aria-label={`Remove ${item.name} from wishlist`}
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <Link href={`/product/${item.slug}`} className="inner-group block">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary/60 mb-4">
                  {image ? (
                    <Image
                      src={image.src}
                      alt={image.alt || item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                      {t('wishlist.noImage')}
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {onSale && (
                      <Badge className="text-[10px] tracking-wider uppercase font-medium px-2 py-0.5 bg-[var(--gold)] text-white border-0 hover:bg-[var(--gold)]">
                        {t('wishlist.saleBadge')}
                      </Badge>
                    )}
                    {!item.is_in_stock && (
                      <Badge variant="secondary" className="text-[10px] tracking-wider uppercase font-medium px-2 py-0.5">
                        {t('wishlist.soldOutBadge')}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  {item.categories[0] && (
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">
                      {item.categories[0].name}
                    </p>
                  )}
                  <h3 className="font-medium text-sm leading-snug line-clamp-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className={cn("font-semibold text-sm", onSale && "text-[var(--gold)]")}>{current}</span>
                    {onSale && (
                      <span className="text-xs text-muted-foreground line-through">{regular}</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
