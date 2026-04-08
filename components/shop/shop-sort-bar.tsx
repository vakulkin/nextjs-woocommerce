import Link from "next/link";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

const SORT_OPTIONS = () => [
  { label: t('shop.sort.newest'), orderby: "date", order: "desc" },
  { label: t('shop.sort.priceLow'), orderby: "price", order: "asc" },
  { label: t('shop.sort.priceHigh'), orderby: "price", order: "desc" },
  { label: t('shop.sort.popularity'), orderby: "popularity", order: "desc" },
];

interface ShopSortBarProps {
  searchParams: Record<string, string | undefined>;
  activeOrderby: string;
  activeOrder: string;
  onSale: boolean;
}

export function ShopSortBar({
  searchParams,
  activeOrderby,
  activeOrder,
  onSale,
}: ShopSortBarProps) {
  function sortHref(orderby: string, order: string) {
    const p = new URLSearchParams({
      ...Object.fromEntries(
        Object.entries(searchParams).filter(([, v]) => v !== undefined) as [string, string][]
      ),
      orderby,
      order,
      page: "1",
    });
    if (!onSale) p.delete("on_sale");
    return `/shop?${p.toString()}`;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8 pb-6 border-b border-border/50">
      <span className="text-xs text-muted-foreground tracking-wider uppercase mr-2">{t('shop.sortBy')}</span>
      {SORT_OPTIONS().map(({ label, orderby, order }) => {
        const isActive = activeOrderby === orderby && activeOrder === order;
        return (
          <Link
            key={label}
            href={sortHref(orderby, order)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border transition-colors duration-200",
              isActive
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
            )}
          >
            {label}
          </Link>
        );
      })}
      {!onSale && (
        <Link
          href="/shop?on_sale=true"
          className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground transition-colors duration-200 ml-auto"
        >
          {t('shop.showSaleOnly')}
        </Link>
      )}
      {onSale && (
        <Link
          href="/shop"
          className="text-xs px-3 py-1.5 rounded-full border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold-light)]/20 transition-colors duration-200 ml-auto"
        >
          {t('shop.clearOnSale')}
        </Link>
      )}
    </div>
  );
}
