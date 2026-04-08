import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function BrandStoryCta() {
  return (
    <section className="border-t border-border/50 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
        <p className="text-xs tracking-[0.4em] uppercase opacity-60 font-medium mb-4">
          {t('home.brandStory.eyebrow')}
        </p>
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          {t('home.brandStory.heading')}
        </h2>
        <p className="text-base opacity-70 max-w-lg mx-auto mb-8 leading-relaxed">
          {t('home.brandStory.description')}
        </p>
        <Link
          href="/shop"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground px-8"
          )}
        >
          {t('home.brandStory.cta')}
        </Link>
      </div>
    </section>
  );
}
