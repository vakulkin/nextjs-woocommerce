import { Suspense } from "react";
import { ProductGallery } from "@/components/product-gallery";
import { Separator } from "@/components/ui/separator";
import { ProductBreadcrumb } from "@/components/product/product-breadcrumb";
import { ProductInfo } from "@/components/product/product-info";
import { ProductSpecs } from "@/components/product/product-specs";
import { RelatedProducts } from "@/components/product/related-products";
import { stripHtml } from "@/lib/utils/format";
import { productToEcommerceItem } from "@/lib/utils/gtm-items";
import { JsonLdScript } from "@/components/analytics/json-ld-script";
import { FireGTMEvent } from "@/components/analytics/fire-gtm-event";
import type { WooProduct } from "@/lib/woocommerce/types";
import { t } from "@/lib/i18n";

export interface ProductPageData {
  product: WooProduct;
  initialVariationId?: number;
  initialVariationPrices?: WooProduct["prices"];
  initialVariationInStock?: boolean;
}

/** Builds the JSON-LD Product schema for a product page. */
function buildProductJsonLd(
  product: WooProduct,
  isInStock: boolean,
  prices: WooProduct["prices"]
) {
  const divisor = Math.pow(10, prices.currency_minor_unit);
  const priceAmt = parseInt(prices.price) / divisor;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: stripHtml(product.short_description || product.description),
    image: product.images.map((i) => i.src),
    sku: product.sku,
    brand: { "@type": "Brand", name: t('brand.name') },
    offers: {
      "@type": "Offer",
      price: priceAmt.toFixed(prices.currency_minor_unit),
      priceCurrency: prices.currency_code,
      availability: isInStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(parseFloat(product.average_rating) > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.average_rating,
        reviewCount: product.review_count,
      },
    }),
  };
}

/** Shared layout used by both /product/[slug] and /product/[slug]/[variationId]. */
export function ProductPageLayout({
  product,
  initialVariationId,
  initialVariationPrices,
  initialVariationInStock,
}: ProductPageData) {
  const displayPrices = initialVariationPrices ?? product.prices;
  const isInStock = initialVariationInStock ?? product.is_in_stock;
  const jsonLd = buildProductJsonLd(product, isInStock, displayPrices);

  // Build a synthetic product-like object for productToEcommerceItem using display prices
  const productForTracking = initialVariationId
    ? { ...product, id: initialVariationId, prices: displayPrices }
    : product;

  return (
    <>
      <JsonLdScript data={jsonLd} />

      {/* view_item event — fires after hydration via GTM dataLayer */}
      <FireGTMEvent
        event="view_item"
        params={{
          currency: displayPrices.currency_code,
          value:
            parseInt(displayPrices.price) /
            Math.pow(10, displayPrices.currency_minor_unit),
          items: [productToEcommerceItem(productForTracking)],
        }}
        ecommerce
      />

      <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
        <ProductBreadcrumb
          categories={product.categories}
          productName={product.name}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <ProductGallery images={product.images} productName={product.name} />
          <ProductInfo
            key={initialVariationId}
            product={product}
            initialVariationId={initialVariationId}
            initialVariationPrices={initialVariationPrices}
            initialVariationInStock={initialVariationInStock}
          />
        </div>

        {product.description && (
          <div className="mt-16 md:mt-20 max-w-3xl">
            <h2 className="text-xl font-heading font-bold mb-2">Description</h2>
            <Separator className="mb-6 border-border/50" />
            <div
              className="prose dark:prose-invert prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        <ProductSpecs attributes={product.attributes} />

        {product.categories[0] && (
          <Suspense fallback={null}>
            <RelatedProducts
              categorySlug={product.categories[0].slug}
              currentId={product.id}
            />
          </Suspense>
        )}
      </div>
    </>
  );
}
