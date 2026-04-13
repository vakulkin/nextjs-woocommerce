"use client";

import { Menu, Sparkles, Tag, Star, PackageOpen } from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { WishlistIcon } from "@/components/wishlist-icon";
import { CartSheet } from "@/components/cart-sheet";
import { t } from "@/lib/i18n";

interface SubItem {
  title: string;
  url: string;
  description: string;
  icon: React.ReactNode;
}

interface NavItem {
  title: string;
  url: string;
  items?: SubItem[];
}

const NAV_LINKS: NavItem[] = [
  {
    title: t("nav.shopAll"),
    url: "/shop",
    items: [
      {
        title: "New Arrivals",
        description: "The latest additions to our collection",
        icon: <Sparkles className="size-5 shrink-0" />,
        url: "/shop?orderby=date",
      },
      {
        title: "On Sale",
        description: "Exclusive deals and discounted fragrances",
        icon: <Tag className="size-5 shrink-0" />,
        url: "/shop?on_sale=true",
      },
      {
        title: "Best Sellers",
        description: "Our most popular and top-rated products",
        icon: <Star className="size-5 shrink-0" />,
        url: "/shop?orderby=popularity",
      },
      {
        title: "All Products",
        description: "Browse the complete fragrance catalogue",
        icon: <PackageOpen className="size-5 shrink-0" />,
        url: "/shop",
      },
    ],
  },
  {
    title: t("nav.aboutUs"),
    url: "/about",
  },
  {
    title: t("nav.contact"),
    url: "/contact",
  },    
  {
    title: t("nav.blog"),
    url: "/blog",
  }    
];

const Navbar1 = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 md:px-6">

        {/* Desktop */}
        <nav className="hidden h-16 items-center lg:grid lg:grid-cols-3" aria-label={t("nav.mainLabel")}>

          {/* Logo — left */}
          <Link href="/" className="flex flex-col leading-none select-none shrink-0">
            <span className="font-heading text-[1.15rem] font-bold tracking-[0.15em] uppercase">
              {t("brand.name")}
            </span>
            <span className="text-[9px] tracking-[0.45em] text-muted-foreground uppercase font-medium -mt-0.5">
              {t("brand.tagline")}
            </span>
          </Link>

          {/* Nav — center */}
          <div className="flex justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {NAV_LINKS.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Actions — right */}
          <div className="flex items-center justify-end gap-1">
            <ThemeToggle />
            <WishlistIcon />
            <CartSheet />
          </div>
        </nav>

        {/* Mobile */}
        <div className="flex h-16 items-center justify-between lg:hidden">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none select-none shrink-0">
            <span className="font-heading text-[1.15rem] font-bold tracking-[0.15em] uppercase">
              {t("brand.name")}
            </span>
            <span className="text-[9px] tracking-[0.45em] text-muted-foreground uppercase font-medium -mt-0.5">
              {t("brand.tagline")}
            </span>
          </Link>

          {/* Mobile actions + hamburger */}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <WishlistIcon />
            <CartSheet />
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="icon" />}>
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex flex-col leading-none select-none">
                      <span className="font-heading text-[1.15rem] font-bold tracking-[0.15em] uppercase">
                        {t("brand.name")}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-4">
                  <Accordion className="flex w-full flex-col gap-4">
                    {NAV_LINKS.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </header>
  );
};

const renderMenuItem = (item: NavItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((sub) => (
            <NavigationMenuLink key={sub.title} className="w-80" render={<SubMenuLink item={sub} />} />
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: NavItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((sub) => (
            <SubMenuLink key={sub.title} item={sub} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: SubItem }) => (
  <Link
    href={item.url}
    className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-foreground"
  >
    <div className="text-foreground">{item.icon}</div>
    <div>
      <div className="text-sm font-semibold">{item.title}</div>
      <p className="text-sm leading-snug text-muted-foreground">{item.description}</p>
    </div>
  </Link>
);

export { Navbar1 };
