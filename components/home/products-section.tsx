import Link from "next/link";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product-skeleton";
import { buttonVariants } from "@/components/ui/defaultbutton";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProducts } from "@/lib/woocommerce/api";
import { ProductCard } from "@/components/product-card";
import { t } from "@/lib/i18n";

type ProductsSectionProps = {
  variant?: "featured" | "on_sale" | "all";
  eyebrow?: string;
  eyebrowKey?: string;
  title?: string;
  titleKey?: string;
  perPage?: number;
  viewAllHref?: string;
  viewAllLabel?: string;
  viewAllLabelKey?: string;
};

async function ProductsGrid({
  variant,
  perPage,
}: {
  variant: ProductsSectionProps["variant"];
  perPage: number;
}) {
  if (variant === "on_sale") {
    const products = await getProducts({ per_page: perPage, on_sale: true });
    if (products.length === 0) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  if (variant === "featured") {
    const products = await getProducts({ per_page: perPage, featured: true });
    const displayProducts = products.length > 0 ? products : await getProducts({ per_page: perPage });

    if (displayProducts.length === 0) {
      return <p className="text-center text-muted-foreground py-12">{t('home.featured.noProducts')}</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  const products = await getProducts({ per_page: perPage });
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ProductsSection({
  variant = "featured",
  eyebrowKey,
  eyebrow,
  titleKey,
  title,
  perPage = 8,
  viewAllHref = "/shop",
  viewAllLabelKey,
  viewAllLabel,
}: ProductsSectionProps) {
  const eyebrowText = eyebrowKey ? t(eyebrowKey) : eyebrow;
  const titleText = titleKey ? t(titleKey) : title;
  const viewAllText = viewAllLabelKey ? t(viewAllLabelKey) : viewAllLabel || t('home.featured.viewAll');

  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          {eyebrowText && (
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] font-medium mb-1">{eyebrowText}</p>
          )}
          {titleText && <h2 className="text-2xl md:text-3xl font-heading font-bold">{titleText}</h2>}
        </div>
        <Link href={viewAllHref} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}>
          {viewAllText} <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        {/* Server component — suspended while fetching */}
        <ProductsGrid variant={variant} perPage={perPage} />
      </Suspense>
    </section>
  );
}
