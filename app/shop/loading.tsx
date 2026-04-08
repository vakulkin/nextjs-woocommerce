import { ProductGridSkeleton } from "@/components/product-skeleton";
import { t } from "@/lib/i18n";

export default function ShopLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">{t('shop.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('shop.description')}
        </p>
      </div>
      <ProductGridSkeleton count={12} />
    </div>
  );
}
