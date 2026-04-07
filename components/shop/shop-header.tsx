import { t } from "@/lib/i18n";

interface ShopHeaderProps {
  onSale: boolean;
}

export function ShopHeader({ onSale }: ShopHeaderProps) {
  return (
    <div className="mb-8 md:mb-10">
      <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] font-medium mb-1">
        {t.shop.collection}
      </p>
      <h1 className="text-3xl md:text-4xl font-heading font-bold">
        {onSale ? t.shop.onSale : t.shop.allFragrances}
      </h1>
    </div>
  );
}
