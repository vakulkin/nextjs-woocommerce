import Link from "next/link";
import { getProducts } from "@/lib/woocommerce/api";
import { ProductCard } from "@/components/product-card";
import { buttonVariants } from "@/components/ui/defaultbutton";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { t } from "@/lib/i18n";

interface RelatedProductsProps {
  categorySlug: string;
  currentId: number;
}

export async function RelatedProducts({ categorySlug, currentId }: RelatedProductsProps) {
  let related: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    const products = await getProducts({ category: categorySlug, per_page: 6 });
    related = products.filter((p) => p.id !== currentId).slice(0, 4);
  } catch {
    return null;
  }
  if (related.length === 0) return null;

  return (
    <section className="mt-16 md:mt-24" aria-label="Related products">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-[var(--gold)] font-medium mb-1">
            {t('relatedProducts.eyebrow')}
          </p>
          <h2 className="text-2xl font-heading font-bold">{t('relatedProducts.title')}</h2>
        </div>
        <Link
          href={`/shop?category=${categorySlug}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground gap-1.5"
          )}
        >
          {t('home.onSale.viewAll')} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
