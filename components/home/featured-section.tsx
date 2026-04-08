import Link from "next/link";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeaturedProducts } from "@/components/home/featured-products";
import { t } from "@/lib/i18n";

export const revalidate = 3600;

export function FeaturedSection() {
    return (
        <section>
            <div className="flex items-end justify-between mb-8">
                <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] font-medium mb-1">{t('home.featured.description')}</p>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold">{t('home.featured.title')}</h2>
                </div>
                <Link href="/shop" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}>
                    {t('home.featured.viewAll')} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
            </div>
            <Suspense fallback={<ProductGridSkeleton />}>
                <FeaturedProducts />
            </Suspense>
        </section>
    );
}

