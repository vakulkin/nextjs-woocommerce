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
    <div ref={containerRef} className="relative w-full max-w-sm">
      <form onSubmit={handleSubmit}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={t.search.placeholder}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          className="pl-9 pr-8"
          autoComplete="off"
          aria-label={t.search.ariaLabel}
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t.search.clearLabel}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {isPending ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <ul role="listbox">
                {results.map((product) => {
                  const { current, onSale, regular } = formatProductPrice(product.prices);
                  const image = product.images[0];
                  return (
                    <li key={product.id} role="option" aria-selected={false}>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors"
                      >
                        <div className="shrink-0 w-10 h-10 rounded-md overflow-hidden bg-secondary">
                          {image ? (
                            <Image
                              src={image.src}
                              alt={image.alt || product.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate leading-snug">{product.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <span className={onSale ? "text-foreground font-medium" : ""}>{current}</span>
                            {onSale && <span className="line-through">{regular}</span>}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-border">
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-primary hover:bg-muted transition-colors"
                >
                  <Search className="h-3.5 w-3.5" />
                  {t.search.seeAllResults} &ldquo;{query.trim()}&rdquo;
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
