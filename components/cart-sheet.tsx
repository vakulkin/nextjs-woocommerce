"use client";

import { ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils/format";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { QuantityInput } from "@/components/ui/quantity-input";
import { CartTotals } from "@/components/cart/cart-totals";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function CartSheet() {
  const { cart, itemCount, isPending, updateItem, removeItem, isCartOpen, openCart, closeCart } = useCartStore();

  return (
    <Sheet open={isCartOpen} onOpenChange={(v) => (v ? openCart() : closeCart())}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="relative" aria-label={t.header.openCart} />}>
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center bg-[var(--gold)] text-white border-0 hover:bg-[var(--gold)]"
          >
            {itemCount}
          </Badge>
        )}
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-heading text-lg tracking-wide">
              {t.cart.sheetTitle}
              {itemCount > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">({itemCount})</span>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        {!cart || cart.items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="font-heading text-base mb-1">{t.cart.emptyTitle}</p>
              <p className="text-sm text-muted-foreground mb-6">{t.cart.emptySheetHint}</p>
              <Link
                href="/shop"
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                onClick={closeCart}
              >
                {t.cart.shopAll}
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="divide-y divide-border/50">
                {cart.items.map((item) => (
                  <div key={item.key} className="flex gap-4 py-4">
                    {/* Thumbnail */}
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                      {item.images[0] ? (
                        <Image
                          src={item.images[0].src}
                          alt={item.images[0].alt || item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          —
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium line-clamp-1 leading-snug">{item.name}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                          onClick={() => removeItem(item.key)}
                          disabled={isPending}
                          aria-label={t.cart.removeItem}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {item.variation.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.variation.map((v) => `${v.attribute}: ${v.value}`).join(", ")}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-2">
                        <QuantityInput
                          value={item.quantity}
                          min={item.quantity_limits.minimum}
                          max={item.quantity_limits.maximum}
                          onDecrement={() =>
                            updateItem(
                              item.key,
                              Math.max(item.quantity_limits.minimum, item.quantity - 1)
                            )
                          }
                          onIncrement={() => updateItem(item.key, item.quantity + 1)}
                          disabled={isPending}
                          size="sm"
                        />

                        <p className="text-sm font-semibold">
                          {formatPrice(
                            item.totals.line_total,
                            item.totals.currency_minor_unit,
                            item.totals.currency_prefix,
                            item.totals.currency_suffix
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 px-6 py-5 space-y-4">
              {/* Totals */}
              <CartTotals totals={cart.totals} separatorClassName="border-border/50" />

              {/* CTAs */}
              <Link
                href="/checkout"
                className={cn(buttonVariants({ size: "lg" }), "w-full")}
                onClick={closeCart}
              >
                {t.cart.proceedToCheckout}
              </Link>
              <Link
                href="/cart"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full text-muted-foreground")}
                onClick={closeCart}
              >
                {t.cart.viewFullCart}
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

