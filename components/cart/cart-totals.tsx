import { formatPrice } from "@/lib/utils/format";
import { Separator } from "@/components/ui/separator";
import { t } from "@/lib/i18n";

/** Minimal totals shape shared by WooCart and WooStoreOrder. */
export interface TotalsShape {
  total_items: string;
  total_shipping: string;
  total_discount?: string;
  total_tax: string;
  total_price: string;
  currency_minor_unit: number;
  currency_prefix: string;
  currency_suffix: string;
}

interface CartTotalsProps {
  totals: TotalsShape;
  /** Extra className applied to the Separator between line-items and the total row. */
  separatorClassName?: string;
}

/** Reusable totals display: subtotal → shipping → discount → tax → total. */
export function CartTotals({ totals, separatorClassName }: CartTotalsProps) {
  const fmt = (v: string) =>
    formatPrice(
      v,
      totals.currency_minor_unit,
      totals.currency_prefix,
      totals.currency_suffix
    );

  return (
    <>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('cart.subtotal')}</span>
          <span>{fmt(totals.total_items)}</span>
        </div>

        {parseInt(totals.total_shipping) > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('cart.shipping')}</span>
            <span>{fmt(totals.total_shipping)}</span>
          </div>
        )}

        {totals.total_discount && parseInt(totals.total_discount) > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>{t('cart.discount')}</span>
            <span>-{fmt(totals.total_discount)}</span>
          </div>
        )}

        {parseInt(totals.total_tax) > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('cart.tax')}</span>
            <span>{fmt(totals.total_tax)}</span>
          </div>
        )}
      </div>

      <Separator className={separatorClassName} />

      <div className="flex justify-between font-semibold text-base">
        <span>{t('cart.total')}</span>
        <span>{fmt(totals.total_price)}</span>
      </div>
    </>
  );
}
