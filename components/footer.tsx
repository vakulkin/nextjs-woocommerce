import Link from "next/link";
import { t } from "@/lib/i18n";

const SHOP_LINKS = [
  { href: "/shop", label: t('footer.links.allProducts') },
  { href: "/shop?on_sale=true", label: t('footer.links.sale') },
  { href: "/shop?orderby=popularity", label: t('footer.links.bestSellers') },
];

const HELP_LINKS = [
  { href: "/cart", label: t('footer.links.cart') },
  { href: "/checkout", label: t('footer.links.checkout') },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-secondary/40 mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-heading text-base font-bold tracking-[0.15em] uppercase mb-1">
              {t('brand.name')}
            </p>
            <p className="text-[9px] tracking-[0.4em] text-muted-foreground uppercase font-medium mb-4">
              {t('brand.tagline')}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('brand.description')}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground mb-4">{t('footer.shopHeading')}</h4>
            <ul className="space-y-3">
              {SHOP_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground mb-4">{t('footer.accountHeading')}</h4>
            <ul className="space-y-3">
              {HELP_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground mb-4">{t('footer.contactHeading')}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.contactBody')}
            </p>
          </div>

        </div>
      </div>

      <div className="border-t border-border/50">
        <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {t('brand.name')}. {t('brand.copyright')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('brand.fineLine')}
          </p>
        </div>
      </div>
    </footer>
  );
}
