import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { WooProduct } from "@/lib/woocommerce/types";
import { t } from "@/lib/i18n";

interface ProductBreadcrumbProps {
  categories: WooProduct["categories"];
  productName: string;
}

export function ProductBreadcrumb({ categories, productName }: ProductBreadcrumbProps) {
  return (
    <nav
      className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8"
      aria-label="Breadcrumb"
    >
      <Link href="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      <ChevronRight className="h-3 w-3" aria-hidden="true" />
      <Link href="/shop" className="hover:text-foreground transition-colors">
        {t.productBreadcrumb.shop}
      </Link>
      <ChevronRight className="h-3 w-3" aria-hidden="true" />
      {categories[0] && (
        <>
          <Link
            href={`/shop?category=${categories[0].slug}`}
            className="hover:text-foreground transition-colors"
          >
            {categories[0].name}
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
        </>
      )}
      <span className="text-foreground truncate max-w-[200px]" aria-current="page">
        {productName}
      </span>
    </nav>
  );
}
