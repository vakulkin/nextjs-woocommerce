import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductGridSkeleton } from "@/components/product-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroSection } from "@/components/home/hero-section";
import { TrustPillars } from "@/components/home/trust-pillars";
import { BrandStoryCta } from "@/components/home/brand-story-cta";
import { FeaturedProducts } from "@/components/home/featured-products";
import { OnSaleProducts } from "@/components/home/on-sale-products";
import { JsonLdScript } from "@/components/ui/json-ld-script";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "LuxuryAroma — Premium Fragrances",
  description:
    "Discover an exclusive collection of premium fragrances and luxury perfumes crafted for the discerning connoisseur. Free shipping on orders over £50.",
  openGraph: {
    title: "LuxuryAroma — Premium Fragrances",
    description:
      "Discover an exclusive collection of premium fragrances and luxury perfumes crafted for the discerning connoisseur.",
    type: "website",
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "LuxuryAroma",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLdScript data={websiteJsonLd} />
      <HeroSection />
      <TrustPillars />
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] font-medium mb-1">Hand-Picked</p>
              <h2 className="text-2xl md:text-3xl font-heading font-bold">Featured Fragrances</h2>
            </div>
            <Link href="/shop" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}>
              View All <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
          <Suspense fallback={<ProductGridSkeleton />}>
            <FeaturedProducts />
          </Suspense>
        </section>
        <Suspense fallback={null}>
          <OnSaleProducts />
        </Suspense>
      </div>
      <BrandStoryCta />
    </>
  );
}

