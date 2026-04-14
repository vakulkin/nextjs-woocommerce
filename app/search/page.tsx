import { Suspense } from "react";
import type { Metadata } from "next";
import { searchProducts } from "@/lib/woocommerce/api";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-skeleton";
import { SearchBar } from "@/components/search-bar";
import { SearchQuerySchema } from "@/lib/validation/schemas";
import { productToEcommerceItem } from "@/lib/utils/gtm-items";
import { JsonLdScript } from "@/components/analytics/json-ld-script";
import { FireGTMEvent } from "@/components/analytics/fire-gtm-event";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Search",
  description: "Search our product catalog.",
  robots: { index: false, follow: false },
};

// SSR: search results are always fresh at request time
export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function SearchResults({ query }: { query: string }) {
  const products = await searchProducts(query);

  if (products.length === 0) {
    return (
      <>
        <FireGTMEvent event="search" params={{ search_term: query }} />
          {t('search.noResults')} &quot;{query}&quot;. {t('search.tryDifferent')}
      </>
    );
  }

  const currency = products[0]?.prices.currency_code ?? "USD";
  const ecommerceItems = products.map((p, i) => productToEcommerceItem(p, i));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Search: ${query}`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/product/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <>
      <JsonLdScript data={itemListJsonLd} />
      <FireGTMEvent event="search" params={{ search_term: query }} />
      <FireGTMEvent
        event="view_item_list"
        params={{ item_list_name: "Search Results", currency, items: ecommerceItems }}
        ecommerce
      />
      <p className="text-muted-foreground mb-6">
        {products.length} result{products.length !== 1 ? "s" : ""} for &quot;{query}&quot;
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  // Validate: trim whitespace, cap at 200 chars, reject empty strings
  const safeQuery = q ? SearchQuerySchema.safeParse(q).data : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">{t('search.pageTitle')}</h1>
        <div className="mt-4 max-w-md">
          <SearchBar />
        </div>
      </div>

      {safeQuery ? (
        <Suspense fallback={<ProductGridSkeleton />}>
          <SearchResults query={safeQuery} />
        </Suspense>
      ) : (
        <p className="text-center text-muted-foreground py-12">
          {t('search.enterTerm')}
        </p>
      )}
    </div>
  );
}
