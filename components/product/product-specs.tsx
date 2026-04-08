import { Separator } from "@/components/ui/separator";
import type { WooProduct } from "@/lib/woocommerce/types";
import { t } from "@/lib/i18n";

interface ProductSpecsProps {
  attributes: WooProduct["attributes"];
}

export function ProductSpecs({ attributes }: ProductSpecsProps) {
  if (attributes.length === 0) return null;

  return (
    <div className="mt-12 max-w-lg">
      <h2 className="text-xl font-heading font-bold mb-2">{t('productSpecs.title')}</h2>
      <Separator className="mb-4 border-border/50" />
      <table className="w-full text-sm" aria-label={t('productSpecs.ariaLabel')}>
        <tbody>
          {attributes.map((attr) => (
            <tr key={attr.name} className="border-b border-border/40">
              <td className="py-3 font-medium w-1/3 text-xs tracking-wider uppercase text-muted-foreground">
                {attr.name}
              </td>
              <td className="py-3 text-sm">
                {attr.terms.map((term) => term.name).join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
