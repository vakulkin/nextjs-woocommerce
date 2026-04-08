import { getProducts } from "@/lib/woocommerce/api";
import { ProductCard } from "@/components/product-card";
import { t } from "@/lib/i18n";

export async function FeaturedProducts() {
  const products = await getProducts({ per_page: 8, featured: true });
  const displayProducts =
    products.length > 0 ? products : await getProducts({ per_page: 8 });

  if (displayProducts.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        {t('home.featured.noProducts')}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
