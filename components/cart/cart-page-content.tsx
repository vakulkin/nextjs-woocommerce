"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { buttonVariants } from "@/components/ui/defaultbutton";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { trackViewCart } from "@/lib/utils/gtm-events";
import { cartItemsToEcommerceItems } from "@/lib/utils/gtm-items";
import { t } from "@/lib/i18n";

export function CartPageContent() {
  const { cart, isLoading, itemCount } = useCartStore();

  useEffect(() => {
    if (!cart || cart.items.length === 0) return;
    const currency = cart.totals.currency_code;
    const value = parseInt(cart.totals.total_price) / Math.pow(10, cart.totals.currency_minor_unit);
    trackViewCart(cartItemsToEcommerceItems(cart.items), currency, value);
  }, [cart]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">{t('cart.pageTitle')}</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-24 w-24 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="text-3xl font-heading font-bold mt-4">
          {t('cart.emptyTitle')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('cart.emptyHint')}
        </p>
        <Link href="/shop" className={cn(buttonVariants({ size: "lg" }), "mt-6")}>
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold mb-8">
        {t('cart.pageTitle')} ({itemCount})
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItem key={item.key} item={item} />
          ))}
        </div>
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
