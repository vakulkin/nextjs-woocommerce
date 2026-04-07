import Link from "next/link";
import { getProducts } from "@/lib/woocommerce/api";
import { ProductCard } from "@/components/product-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { t } from "@/lib/i18n";

export async function OnSaleProducts() {
  const products = await getProducts({ per_page: 4, on_sale: true });
  if (products.length === 0) return null;

  return (
    <section className="mt-24">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] font-medium mb-1">
            {t.home.onSale.eyebrow}
          </p>
          <h2 className="text-2xl md:text-3xl font-heading font-bold">{t.home.onSale.heading}</h2>
        </div>
        <Link
          href="/shop?on_sale=true"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
        >
          {t.home.onSale.viewAll} <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
