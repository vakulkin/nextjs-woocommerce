"use client";

import { useUIStore } from "@/lib/store/ui-store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartSheet } from "@/components/cart-sheet";
import { WishlistIcon } from "@/components/wishlist-icon";
import { Button } from "@/components/ui/defaultbutton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { t } from "@/lib/i18n";

const NAV_LINKS = [
  { href: "/shop", label: t("nav.shopAll") },
  { href: "/shop?on_sale=true", label: t("nav.onSale") },
];

function Logo() {
  return (
    <Link
      href="/"
      className="shrink-0 flex flex-col leading-none select-none"
    >
      <span className="font-heading text-[1.15rem] font-bold tracking-[0.15em] uppercase">
        {t("brand.name")}
      </span>
      <span className="text-[9px] tracking-[0.45em] text-muted-foreground uppercase font-medium -mt-0.5">
        {t("brand.tagline")}
      </span>
    </Link>
  );
}

export function Header() {
  const isMobileMenuOpen = useUIStore((s) => s.isMobileMenuOpen);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between gap-6 px-4 lg:px-8">
        {/* Left: Logo + Nav (desktop) */}
        <div className="flex items-center gap-4">
          <Logo />
          <nav
            className="hidden lg:flex items-center gap-4 text-sm"
            aria-label={t("nav.mainLabel")}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={
                  "relative tracking-wide transition-colors duration-200 " +
                  "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 " +
                  "after:bg-foreground after:transition-all after:duration-300 hover:after:w-full " +
                  (pathname === href || pathname.startsWith(href + "?")
                    ? "text-foreground after:w-full"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Search (desktop) - expands to fill available space but not less than min width */}
        <div className="hidden lg:flex lg:flex-1 lg:min-w-[20rem] w-full">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <ThemeToggle />
          <WishlistIcon />
          <CartSheet />

          {/* Mobile hamburger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent side="right" className="flex flex-col gap-0 p-0">
              {/* Sheet header */}
              <SheetHeader className="border-b border-border/50 px-5 py-4">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>

              {/* Search */}
              <div className="px-5 py-4 border-b border-border/50">
                <SearchBar />
              </div>

              {/* Nav links */}
              <nav
                className="flex flex-col px-2 py-3"
                aria-label={t("nav.mainLabel")}
              >
                {NAV_LINKS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                    className={
                      "flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-colors " +
                      (pathname === href || pathname.startsWith(href + "?")
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground")
                    }
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
