import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { t } from "@/lib/i18n";

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

function pageUrl(page: number, params: Record<string, string | undefined>) {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
  );
  return `/shop?${new URLSearchParams({ ...filtered, page: String(page) })}`;
}

const btnBase =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 w-9 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
const btnOutline = cn(btnBase, "border border-input bg-background hover:bg-accent hover:text-accent-foreground");
const btnActive = cn(btnBase, "bg-primary text-primary-foreground pointer-events-none");
const btnGhost = cn(btnBase, "hover:bg-accent hover:text-accent-foreground");
const btnDisabled = cn(btnGhost, "opacity-40 pointer-events-none");

export function ShopPagination({ currentPage, totalPages, searchParams }: ShopPaginationProps) {
  if (totalPages <= 1) return null;

  const WINDOW = 4;
  const windowStart = Math.max(1, currentPage - WINDOW);
  const windowEnd = Math.min(totalPages, currentPage + WINDOW);

  const pages: (number | "...")[] = [];
  if (windowStart > 1) {
    pages.push(1);
    if (windowStart > 2) pages.push("...");
  }
  for (let i = windowStart; i <= windowEnd; i++) pages.push(i);
  if (windowEnd < totalPages) {
    if (windowEnd < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex justify-center items-center gap-1 mt-12" aria-label={t.shop.paginationLabel}>
      {/* First */}
      {currentPage > 1 ? (
        <Link href={pageUrl(1, searchParams)} className={btnGhost} aria-label={t.shop.paginationFirst}>
          <ChevronsLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={btnDisabled} aria-disabled="true"><ChevronsLeft className="h-4 w-4" /></span>
      )}

      {/* Prev */}
      {currentPage > 1 ? (
        <Link href={pageUrl(currentPage - 1, searchParams)} className={btnGhost} aria-label={t.shop.paginationPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={btnDisabled} aria-disabled="true"><ChevronLeft className="h-4 w-4" /></span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 text-center text-sm text-muted-foreground select-none">
            &hellip;
          </span>
        ) : (
          <Link
            key={p}
            href={pageUrl(p, searchParams)}
            className={p === currentPage ? btnActive : btnOutline}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link href={pageUrl(currentPage + 1, searchParams)} className={btnGhost} aria-label={t.shop.paginationNext}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={btnDisabled} aria-disabled="true"><ChevronRight className="h-4 w-4" /></span>
      )}

      {/* Last */}
      {currentPage < totalPages ? (
        <Link href={pageUrl(totalPages, searchParams)} className={btnGhost} aria-label={t.shop.paginationLast}>
          <ChevronsRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={btnDisabled} aria-disabled="true"><ChevronsRight className="h-4 w-4" /></span>
      )}
    </nav>
  );
}
