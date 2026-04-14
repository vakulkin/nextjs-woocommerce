"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { buttonVariants } from "@/components/ui/defaultbutton";
import { CartTotals } from "@/components/cart/cart-totals";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function CartSummary() {
  const { cart } = useCartStore();
  if (!cart) return null;

  return (
    <div className="rounded-lg border bg-card p-6 sticky top-24">
      <h2 className="text-lg font-semibold mb-4">{t('cart.orderSummary')}</h2>

      <CartTotals totals={cart.totals} separatorClassName="my-4" />

      <Link href="/checkout" className={cn(buttonVariants({ size: "lg" }), "w-full mt-6")}>
        {t('cart.proceedToCheckout')}
      </Link>
      <Link
        href="/shop"
        className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full mt-2")}
      >
        {t('cart.continueShopping')}
      </Link>
    </div>
  );
}

