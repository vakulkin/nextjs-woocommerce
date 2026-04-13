import type { Metadata } from "next";
import { LandingHero } from "@/components/home/landing-hero";
import { LandingArchitecture } from "@/components/home/landing-architecture";
import { LandingForBusiness } from "@/components/home/landing-for-business";
import { LandingFeatures } from "@/components/home/landing-features";
import { LandingForMarketers } from "@/components/home/landing-for-marketers";
import { LandingForDevelopers } from "@/components/home/landing-for-developers";
import { LandingFinalCta } from "@/components/home/landing-final-cta";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Headless WooCommerce Storefront · Next.js 16",
  description:
    "Production-grade headless storefront for WooCommerce. CDN-fast pages, full GA4 Enhanced Ecommerce, Stripe Checkout — without migrating a product.",
  openGraph: {
    title: "Headless WooCommerce Storefront · Next.js 16",
    description:
      "Drop-in headless frontend for WooCommerce. Next.js, Stripe, GA4 Enhanced Ecommerce — your data stays exactly where it is.",
    type: "website",
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <LandingArchitecture />
      <LandingForBusiness />
      <LandingFeatures />
      <LandingForMarketers />
      <LandingForDevelopers />
      <LandingFinalCta />
    </>
  );
}

