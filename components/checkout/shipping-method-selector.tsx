"use client";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import type { WooShippingPackage } from "@/lib/woocommerce/types";
import { t } from "@/lib/i18n";

interface ShippingMethodSelectorProps {
  shippingRates: WooShippingPackage[];
  isDisabled: boolean;
  onSelect: (packageId: number, rateId: string) => void;
}

export function ShippingMethodSelector({
  shippingRates,
  isDisabled,
  onSelect,
}: ShippingMethodSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          {t('checkout.shippingMethodTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {shippingRates.map((pkg) => (
          <div key={pkg.package_id} className="space-y-2">
            {shippingRates.length > 1 && (
              <p className="text-sm font-medium text-muted-foreground">{pkg.name}</p>
            )}
            {pkg.shipping_rates.map((rate) => (
              <label
                key={rate.rate_id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-md border p-3 cursor-pointer transition-colors",
                  rate.selected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`shipping_package_${pkg.package_id}`}
                    value={rate.rate_id}
                    checked={rate.selected}
                    onChange={() => onSelect(pkg.package_id, rate.rate_id)}
                    className="h-4 w-4 accent-primary"
                    disabled={isDisabled}
                  />
                  <div>
                    <span className="text-sm font-medium">{rate.name}</span>
                    {rate.description && (
                      <p className="text-xs text-muted-foreground">{rate.description}</p>
                    )}
                    {rate.delivery_time && (
                      <p className="text-xs text-muted-foreground">{rate.delivery_time}</p>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium shrink-0">
                  {parseInt(rate.price) === 0
                    ? t('checkout.freeShipping')
                    : formatPrice(
                        rate.price,
                        rate.currency_minor_unit,
                        rate.currency_prefix,
                        rate.currency_suffix
                      )}
                </span>
              </label>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
