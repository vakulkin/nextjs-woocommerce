import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getVariationData } from "@/lib/woocommerce/api";
import type { WooProduct } from "@/lib/woocommerce/types";
import { sortTerms } from "@/lib/utils/product";
import { stripHtml } from "@/lib/utils/format";
import { ProductPageLayout } from "@/components/product/product-page-layout";

export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
    const description = stripHtml(
      product.short_description || product.description
    ).slice(0, 160);
    return {
      title: product.name,
      description,
      openGraph: {
        title: product.name,
        description,
        images: product.images[0]
          ? [{ url: product.images[0].src, width: 1200, height: 1500, alt: product.name }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description,
        images: product.images[0] ? [product.images[0].src] : [],
      },
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export async function generateStaticParams() {
  try {
    const products = await getProducts({ per_page: 20 });
    return products.map((product) => ({ slug: product.slug }));
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * For variable products, walk the sorted variations sequentially and return
 * the first in-stock one's data. Falls back to the first variation if all are
 * OOS. Returns null for non-variable or OOS parent products.
 */
async function resolveInitialVariation(product: WooProduct): Promise<{
  variationId: number;
  prices: WooProduct["prices"] | undefined;
  isInStock: boolean;
} | null> {
  if (!product.is_in_stock || product.type !== "variable" || !product.variations.length) {
    return null;
  }
  const firstVarAttr = product.attributes.find((a) => a.has_variations);
  if (!firstVarAttr) return null;

  // Sort terms numerically then alphabetically and map to variations.
  // variation.attributes[].value may be a slug or a name — match both.
  const sortedVariations = sortTerms(firstVarAttr.terms)
    .map((t) =>
      product.variations.find((v) =>
        v.attributes.some((a) => a.value === t.slug || a.value === t.name)
      )
    )
    .filter((v): v is NonNullable<typeof v> => v != null);

  if (!sortedVariations.length) return null;

  let chosen = sortedVariations[0];
  let chosenData = await getVariationData(chosen.id);

  if (chosenData?.is_in_stock !== true) {
    for (let i = 1; i < sortedVariations.length; i++) {
      const d = await getVariationData(sortedVariations[i].id);
      if (d?.is_in_stock === true) {
        chosen = sortedVariations[i];
        chosenData = d;
        break;
      }
    }
  }

  return {
    variationId: chosen.id,
    prices: chosenData?.prices ?? undefined,
    isInStock: chosenData?.is_in_stock ?? false,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product;
  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  const initialVariation = await resolveInitialVariation(product);

  return (
    <ProductPageLayout
      product={product}
      initialVariationId={initialVariation?.variationId}
      initialVariationPrices={initialVariation?.prices}
      initialVariationInStock={initialVariation?.isInStock}
    />
  );
}
