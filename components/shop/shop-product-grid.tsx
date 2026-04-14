import Link from "next/link";
import { getProducts } from "@/lib/woocommerce/api";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-skeleton";
import { buttonVariants } from "@/components/ui/defaultbutton";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { t } from "@/lib/i18n";

interface ShopProductGridProps {
  searchParams: {
    page?: string;
    orderby?: string;
    order?: string;
    on_sale?: string;
    category?: string;
  };
}

async function ProductList({ searchParams }: ShopProductGridProps) {
  const products = await getProducts({
    per_page: 12,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    orderby: searchParams.orderby || "date",
    order: (searchParams.order as "asc" | "desc") || "desc",
    on_sale: searchParams.on_sale === "true" ? true : undefined,
    category: searchParams.category,
  });

  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-24">
        <p className="text-muted-foreground">{t('shop.noProducts')}</p>
        <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>
          {t('shop.clearOnSale')}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ShopProductGrid({ searchParams }: ShopProductGridProps) {
  return (
    <Suspense fallback={<ProductGridSkeleton count={12} />}>
      <ProductList searchParams={searchParams} />
    </Suspense>
  );
}
