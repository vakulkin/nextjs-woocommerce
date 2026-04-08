import type { Metadata } from "next";
import { ShopHeader } from "@/components/shop/shop-header";
import { ShopSortBar } from "@/components/shop/shop-sort-bar";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";
import { ShopPagination } from "@/components/shop/shop-pagination";
import { ShopParamsSchema } from "@/lib/validation/schemas";
import { getProductsMeta, getProducts } from "@/lib/woocommerce/api";
import { productToEcommerceItem } from "@/lib/utils/gtm-items";
import { JsonLdScript } from "@/components/ui/json-ld-script";
import { FireGTMEvent } from "@/components/analytics/fire-gtm-event";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: t('shop.title'),
  description: t('shop.description'),
  openGraph: {
    title: t('shop.title'),
    description: t('shop.description'),
    type: "website",
    url: "/shop",
  },
};

export const revalidate = 3600;

interface ShopPageProps {
  searchParams: Promise<{
    page?: string;
    orderby?: string;
    order?: string;
    on_sale?: string;
    category?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Validate and sanitise URL params — invalid values fall back to undefined
  // so child components apply their own safe defaults.
  const params = ShopParamsSchema.parse(await searchParams);
  const currentPage = parseInt(params.page ?? "1");
  const activeOrderby = params.orderby ?? "date";
  const activeOrder = params.order ?? "desc";
  const onSale = params.on_sale === "true";

  const { totalPages } = await getProductsMeta({
    per_page: 12,
    page: currentPage,
    orderby: activeOrderby,
    order: activeOrder as "asc" | "desc",
    on_sale: onSale || undefined,
    category: params.category,
  });

  // Fetch the same page of products for JSON-LD + view_item_list GTM event
  const products = await getProducts({
    per_page: 12,
    page: currentPage,
    orderby: activeOrderby,
    order: activeOrder as "asc" | "desc",
    on_sale: onSale || undefined,
    category: params.category,
  });

  const listName = onSale ? "On Sale" : params.category ? `Category: ${params.category}` : "Shop";

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: (currentPage - 1) * 12 + i + 1,
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/product/${p.slug}`,
      name: p.name,
    })),
  };

  const ecommerceItems = products.map((p, i) =>
    productToEcommerceItem(p, (currentPage - 1) * 12 + i)
  );

  const currency = products[0]?.prices.currency_code ?? "USD";

  return (
    <>
      <JsonLdScript data={itemListJsonLd} />
      <FireGTMEvent
        event="view_item_list"
        params={{ item_list_name: listName, currency, items: ecommerceItems }}
        ecommerce
      />
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
        <ShopHeader onSale={onSale} />
        <ShopSortBar
          searchParams={params}
          activeOrderby={activeOrderby}
          activeOrder={activeOrder}
          onSale={onSale}
        />
        <ShopProductGrid searchParams={params} />
        <ShopPagination currentPage={currentPage} totalPages={totalPages} searchParams={params} />
      </div>
    </>
  );
}

