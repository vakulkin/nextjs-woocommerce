"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { toast } from "sonner";
import type { WooProduct } from "@/lib/woocommerce/types";
import { cn } from "@/lib/utils";
import { trackAddToWishlist } from "@/lib/utils/gtm-events";
import { productToEcommerceItem } from "@/lib/utils/gtm-items";
import { t } from "@/lib/i18n";

interface WishlistButtonProps {
  product: WooProduct;
  className?: string;
  size?: "sm" | "default";
}

export function WishlistButton({ product, className, size = "default" }: WishlistButtonProps) {
  const wishlisted = useWishlistStore(
    (s) => s._hasHydrated && s.items.some((i) => i.id === product.id)
  );
  const toggle = useWishlistStore((s) => s.toggle);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!wishlisted) {
      trackAddToWishlist(productToEcommerceItem(product), product.prices.currency_code);
    }
    toggle(product);
    toast(!wishlisted ? t.wishlist.savedToast : t.wishlist.removedToast);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm",
        wishlisted
          ? "text-rose-500 hover:text-rose-600"
          : "text-muted-foreground hover:text-foreground",
        size === "sm" ? "h-7 w-7" : "h-9 w-9",
        className
      )}
      onClick={handleClick}
      aria-label={wishlisted ? t.wishlist.removeAriaLabel : t.wishlist.addAriaLabel}
      aria-pressed={wishlisted}
    >
      <Heart
        className={cn(
          size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
          wishlisted && "fill-current"
        )}
      />
    </Button>
  );
}
