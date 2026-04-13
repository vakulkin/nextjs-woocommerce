"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
  shop: "Shop",
  product: "Products",
  cart: "Cart",
  checkout: "Checkout",
  wishlist: "Wishlist",
  search: "Search",
  "order-confirmation": "Order Confirmation",
};

function formatSegment(segment: string) {
  return LABELS[segment] ?? segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [
    { label: "Home", href: "/" },
    ...segments.map((seg, i) => ({
      label: formatSegment(seg),
      href: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 text-xs text-muted-foreground min-w-0"
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-1 min-w-0">
            {i > 0 && <ChevronRight className="size-3 shrink-0 text-muted-foreground/40" />}
            {i === 0 ? (
              <Link
                href="/"
                className="shrink-0 flex items-center hover:text-foreground transition-colors"
                aria-label="Home"
              >
                <Home className="size-3" />
              </Link>
            ) : isLast ? (
              <span
                className="truncate max-w-[180px] text-foreground/80 font-medium"
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="truncate max-w-[120px] hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
