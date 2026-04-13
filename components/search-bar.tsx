"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { formatProductPrice } from "@/lib/utils/format";
import { searchAction } from "@/lib/actions/search";
import type { WooProduct } from "@/lib/woocommerce/types";
import { t } from "@/lib/i18n";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WooProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  function handleQueryChange(value: string) {
    setQuery(value);
    const trimmed = value.trim();

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!trimmed || trimmed.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      startTransition(async () => {
        const products = await searchAction(trimmed);
        setResults(products);
        setIsOpen(products.length > 0);
      });
    }, 300);
  }

  // Close dropdown on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }

  function clearQuery() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }

  const showDropdown = isOpen && (isPending || results.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          className="h-9 rounded-full bg-muted border-transparent pl-9 pr-9 text-sm placeholder:text-muted-foreground/60 focus-visible:bg-background focus-visible:border-border focus-visible:ring-2 focus-visible:ring-ring/30 transition-all"
          autoComplete="off"
          aria-label={t('search.ariaLabel')}
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
        />
        {isPending ? (
          <Loader2 className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : query ? (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30 transition-colors"
            aria-label={t('search.clearLabel')}
          >
            <X className="h-2.5 w-2.5" />
          </button>
        ) : null}
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/60 rounded-xl shadow-xl z-50 overflow-hidden">
          {isPending ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </div>
          ) : (
            <>
              <div className="px-3 py-2 border-b border-border/50">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground/60">
                  Results for &ldquo;{query.trim()}&rdquo;
                </p>
              </div>
              <ul role="listbox" className="py-1">
                {results.map((product) => {
                  const { current, onSale, regular } = formatProductPrice(product.prices);
                  const image = product.images[0];
                  return (
                    <li key={product.id} role="option" aria-selected={false}>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-3.5 px-3 py-2.5 hover:bg-muted transition-colors"
                      >
                        <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-secondary ring-1 ring-border/50">
                          {image ? (
                            <Image
                              src={image.src}
                              alt={image.alt || product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate leading-snug group-hover:text-foreground transition-colors">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-xs font-semibold ${onSale ? "text-destructive" : "text-muted-foreground"}`}>
                              {current}
                            </span>
                            {onSale && (
                              <span className="text-xs text-muted-foreground/60 line-through">{regular}</span>
                            )}
                            {onSale && (
                              <span className="text-[10px] font-semibold uppercase tracking-wide bg-destructive/10 text-destructive rounded px-1 py-px">
                                Sale
                              </span>
                            )}
                          </div>
                        </div>
                        <Search className="shrink-0 h-3.5 w-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-border/50 p-2">
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Search className="h-3.5 w-3.5" />
                  {t('search.seeAllResults')} &ldquo;{query.trim()}&rdquo;
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
