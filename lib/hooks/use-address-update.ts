"use client";

import { useEffect, useRef, useTransition } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { useCheckoutStore } from "@/lib/store/checkout-store";
import { updateCustomer } from "@/lib/actions/cart";

/**
 * Debounced address → shipping-rate recalculation.
 *
 * Watches shipping-relevant address fields and, 800 ms after the last change,
 * calls updateCustomer to get fresh shipping rates / totals from WooCommerce.
 *
 * Returns `isUpdatingAddress` so the parent page can disable the submit button
 * and show a "Recalculating…" label while the API call is in flight.
 */
export function useAddressUpdate(cartToken: string | null) {
  const [isUpdatingAddress, startAddressTransition] = useTransition();
  const { setSelectedPaymentMethod } = useCheckoutStore();

  const sameAsShipping = useCheckoutStore((s) => s.sameAsShipping);
  const billing = useCheckoutStore((s) => s.billing);
  const shipping = useCheckoutStore((s) => s.shipping);

  const effectiveShipping = sameAsShipping ? billing : shipping;

  // Stable primitive deps to prevent effect re-running on every object reference change
  const shipCountry = effectiveShipping.country;
  const shipState = effectiveShipping.state;
  const shipCity = effectiveShipping.city;
  const shipPost = effectiveShipping.postcode;

  // Use a ref so the async callback always reads the latest token without
  // triggering the effect again when the token is refreshed after an API call.
  const cartTokenRef = useRef(cartToken);
  useEffect(() => {
    cartTokenRef.current = cartToken;
  }, [cartToken]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!shipCountry) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const token = cartTokenRef.current;
      if (!token) return;

      // Snapshot store at the moment the timer fires — avoids stale closure.
      const { billing: b, shipping: s, sameAsShipping: same } =
        useCheckoutStore.getState();
      const effective = same ? b : s;

      startAddressTransition(async () => {
        const result = await updateCustomer(
          { ...b } as Record<string, string>,
          { ...effective } as Record<string, string>,
          token
        );
        if (result.cart) {
          useCartStore.setState({ cart: result.cart, itemCount: result.cart.items_count });
          if (result.cartToken) {
            cartTokenRef.current = result.cartToken;
            useCartStore.setState({ cartToken: result.cartToken });
          }
          if (result.cart.payment_methods?.length) {
            const current = useCheckoutStore.getState().selectedPaymentMethod;
            if (!result.cart.payment_methods.includes(current)) {
              setSelectedPaymentMethod(result.cart.payment_methods[0]);
            }
          }
        }
      });
    }, 800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // We intentionally omit cartTokenRef and setSelectedPaymentMethod — both are
    // stable references (ref object + Zustand setter) and must not re-trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipCountry, shipState, shipCity, shipPost, sameAsShipping]);

  return { isUpdatingAddress };
}
