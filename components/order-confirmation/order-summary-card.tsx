import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/defaultcard";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils/format";
import type { WooStoreOrder } from "@/lib/woocommerce/types";
import { t } from "@/lib/i18n";

interface OrderSummaryCardProps {
  order: WooStoreOrder;
}

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const { totals } = order;
  const fmt = (amount: string) =>
    formatPrice(amount, totals.currency_minor_unit, totals.currency_prefix, totals.currency_suffix);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('orderConfirmation.orderSummaryTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <ul className="divide-y">
          {order.items.map((item) => {
            const img = item.images[0];
            return (
              <li key={item.id} className="flex items-center gap-4 py-3">
                {img && (
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={img.thumbnail || img.src}
                      alt={img.alt || item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{t('orderConfirmation.qty')} {item.quantity}</p>
                </div>
                <p className="font-medium whitespace-nowrap">
                  {formatPrice(
                    item.totals.line_total,
                    item.totals.currency_minor_unit,
                    item.totals.currency_prefix,
                    item.totals.currency_suffix
                  )}
                </p>
              </li>
            );
          })}
        </ul>

        <Separator />

        {/* Totals */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('orderConfirmation.subtotal')}</span>
            <span>{fmt(totals.total_items)}</span>
          </div>
          {parseInt(totals.total_discount, 10) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>{t('orderConfirmation.discount')}</span>
              <span>−{fmt(totals.total_discount)}</span>
            </div>
          )}
          {parseInt(totals.total_shipping, 10) > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('orderConfirmation.shipping')}</span>
              <span>{fmt(totals.total_shipping)}</span>
            </div>
          )}
          {parseInt(totals.total_tax, 10) > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('orderConfirmation.tax')}</span>
              <span>{fmt(totals.total_tax)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-base">
          <span>{t('orderConfirmation.total')}</span>
          <span>{fmt(totals.total_price)}</span>
        </div>

        {/* Billing address */}
        {order.billing_address.first_name && (
          <>
            <Separator />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">{t('orderConfirmation.billedTo')}</p>
              <p>
                {order.billing_address.first_name} {order.billing_address.last_name}
              </p>
              <p>{order.billing_address.address_1}</p>
              {order.billing_address.address_2 && <p>{order.billing_address.address_2}</p>}
              <p>
                {order.billing_address.city}, {order.billing_address.state}{" "}
                {order.billing_address.postcode}
              </p>
              <p>{order.billing_address.country}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
