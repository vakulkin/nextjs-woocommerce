import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-heading font-bold text-muted-foreground">{t('notFound.code')}</h1>
      <h2 className="text-2xl font-semibold mt-4">{t('notFound.title')}</h2>
      <p className="text-muted-foreground mt-2">
        {t('notFound.description')}
      </p>
      <div className="flex gap-4 justify-center mt-8">
        <Link href="/" className={cn(buttonVariants())}>
          {t('notFound.goHome')}
        </Link>
        <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }))}>
          {t('notFound.browseShop')}
        </Link>
      </div>
    </div>
  );
}
