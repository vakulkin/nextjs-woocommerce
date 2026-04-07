import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartSheet } from "@/components/cart-sheet";
import { WishlistIcon } from "@/components/wishlist-icon";
import { t } from "@/lib/i18n";

const NAV_LINKS = [
  { href: "/shop", label: t.nav.shopAll },
  { href: "/shop?on_sale=true", label: t.nav.onSale },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">

        {/* Logo */}
        <Link href="/" className="shrink-0 flex flex-col leading-none select-none">
          <span className="font-heading text-[1.15rem] font-bold tracking-[0.15em] uppercase">
            {t.brand.name}
          </span>
          <span className="text-[9px] tracking-[0.45em] text-muted-foreground uppercase font-medium -mt-0.5">
            {t.brand.tagline}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm" aria-label={t.nav.mainLabel}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="relative tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-300 hover:after:w-full"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop search */}
        <div className="hidden md:block flex-1 max-w-xs">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <WishlistIcon />
          <CartSheet />
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden border-t border-border/50 px-4 py-2">
        <SearchBar />
      </div>
    </header>
  );
}
