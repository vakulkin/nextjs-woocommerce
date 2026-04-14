"use client";

import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/defaultbutton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/defaultcard";
import { Lock } from "lucide-react";
import { CartTotals } from "@/components/cart/cart-totals";
import type { WooCart } from "@/lib/woocommerce/types";
import { t } from "@/lib/i18n";

interface CheckoutOrderSummaryProps {
  cart: WooCart;
  isPending: boolean;
  isUpdatingAddress: boolean;
  isSelectingShipping: boolean;
  isStripeMethod: boolean;
}

export function CheckoutOrderSummary({
  cart,
  isPending,
  isUpdatingAddress,
  isSelectingShipping,
  isStripeMethod,
}: CheckoutOrderSummaryProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>{t('checkout.orderSummaryTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-2">
          {cart.items.map((item) => (
            <div key={item.key} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.name} &times; {item.quantity}
              </span>
              <span>
                {formatPrice(
                  item.totals.line_total,
                  item.totals.currency_minor_unit,
                  item.totals.currency_prefix,
                  item.totals.currency_suffix
                )}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        <CartTotals totals={cart.totals} />

        <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 shrink-0" />
            <span className="font-medium text-foreground">{t('checkout.secureCheckout')}</span>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isPending || isUpdatingAddress || isSelectingShipping}
        >
          {isPending
            ? t('checkout.processing')
            : isUpdatingAddress
            ? t('checkout.recalculating')
            : isStripeMethod
            ? t('checkout.payWithStripe')
            : t('checkout.placeOrder')}
        </Button>
      </CardContent>
    </Card>
  );
}

