"use client";

import Image from "next/image";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { QuantityInput } from "@/components/ui/quantity-input";
import type { WooCartItem } from "@/lib/woocommerce/types";
import { trackRemoveFromCart } from "@/lib/utils/gtm-events";
import { t } from "@/lib/i18n";

interface CartItemProps {
  item: WooCartItem;
}

export function CartItem({ item }: CartItemProps) {
  const { isPending, updateItem, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 p-4 rounded-lg border bg-card">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
        {item.images[0] ? (
          <Image
            src={item.images[0].src}
            alt={item.images[0].alt || item.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            {t('cart.noImageFull')}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="font-medium">{item.name}</h3>
        {item.variation.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {item.variation.map((v) => `${v.attribute}: ${v.value}`).join(", ")}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {formatPrice(
            item.prices.price,
            item.prices.currency_minor_unit,
            item.prices.currency_prefix,
            item.prices.currency_suffix
          )}{" "}
          each
        </p>

        <div className="flex items-center justify-between mt-auto pt-2">
          <QuantityInput
            value={item.quantity}
            min={item.quantity_limits.minimum}
            max={item.quantity_limits.maximum}
            onDecrement={() =>
              updateItem(item.key, Math.max(item.quantity_limits.minimum, item.quantity - 1))
            }
            onIncrement={() => updateItem(item.key, item.quantity + 1)}
            disabled={isPending}
          />
          <div className="flex items-center gap-4">
            <span className="font-semibold">
              {formatPrice(
                item.totals.line_total,
                item.totals.currency_minor_unit,
                item.totals.currency_prefix,
                item.totals.currency_suffix
              )}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => {
                trackRemoveFromCart(
                  {
                    item_id: String(item.id),
                    item_name: item.name,
                    price: parseInt(item.prices.price) / Math.pow(10, item.prices.currency_minor_unit),
                    quantity: item.quantity,
                  },
                  item.prices.currency_code
                );
                removeItem(item.key);
              }}
              disabled={isPending}
              aria-label={t('cart.removeItem')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
