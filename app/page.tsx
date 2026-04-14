import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { TrustPillars } from "@/components/home/trust-pillars";
import { FeaturedSection } from "@/components/home/featured-section";
import { OnSaleSection } from "@/components/home/on-sale-section";
import { JsonLdScript } from "@/components/analytics/json-ld-script";
import { t } from "@/lib/i18n";
import Features from "@/components/home/features-4";
import IntegrationsSection from "@/components/home/integrations-1";
import CallToAction from "@/components/home/call-to-action-2";
import PricingComparator from "@/components/home/pricing-comparator";
import FAQs from "@/components/home/faqs-5";
import LogoCloud from "@/components/home/logo-cloud";

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
        <Features />
        <OnSaleSection />
        <IntegrationsSection />
        <CallToAction />
        <LogoCloud />
        <PricingComparator />
        <FAQs />
      </div>
    </>
  );
}

