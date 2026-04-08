import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/50">
      {/* Decorative gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-light)]/20 via-background to-secondary/60 pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--gold-light)]/10 to-transparent pointer-events-none" />

      <div className="relative container mx-auto px-4 md:px-6 py-20 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.4em] uppercase text-[var(--gold)] font-medium mb-4">
            {t('home.hero.eyebrow')}
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] tracking-tight mb-6">
            {t('home.hero.heading1')}<br />
            <em className="not-italic" style={{ color: "var(--gold)" }}>{t('home.hero.heading2')}</em><br />
            {t('home.hero.heading3')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-md leading-relaxed mb-10">
            {t('home.hero.description')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className={cn(buttonVariants({ size: "lg" }), "px-8")}>
              {t('home.hero.shopNow')}
            </Link>
            <Link href="/shop?on_sale=true" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-8")}>
              {t('home.hero.viewSale')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
