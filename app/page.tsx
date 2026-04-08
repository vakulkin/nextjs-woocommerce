import { Suspense } from "react";
import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { TrustPillars } from "@/components/home/trust-pillars";
import { BrandStoryCta } from "@/components/home/brand-story-cta";
import { FeaturedSection } from "@/components/home/featured-section";
import { OnSaleProducts } from "@/components/home/on-sale-products";
import { JsonLdScript } from "@/components/ui/json-ld-script";
import { t } from "@/lib/i18n";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: t('brand.name'),
  description: t('brand.description'),
  openGraph: {
    title: t('brand.name') + " — " + t('brand.tagline'),
    description: t('brand.description'),
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
  name: t('brand.name'),
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
        <FeaturedSection />
        <Suspense fallback={null}>
          <OnSaleProducts />
        </Suspense>
      </div>
      <BrandStoryCta />
    </>
  );
}

