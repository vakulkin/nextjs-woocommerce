"use client";

import { useTransition, useEffect, useRef, useActionState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { useCheckoutStore } from "@/lib/store/checkout-store";
import { selectShippingRate } from "@/lib/actions/cart";
import { checkoutAction } from "@/lib/actions/checkout-submit";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { BillingAddressForm } from "@/components/checkout/billing-address-form";
import { ShippingAddressForm } from "@/components/checkout/shipping-address-form";
import { ShippingMethodSelector } from "@/components/checkout/shipping-method-selector";
import { PaymentMethodSelector } from "@/components/checkout/payment-method-selector";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { useAddressUpdate } from "@/lib/hooks/use-address-update";
import { trackBeginCheckout, trackAddShippingInfo, trackAddPaymentInfo } from "@/lib/utils/gtm-events";
import { cartItemsToEcommerceItems } from "@/lib/utils/gtm-items";
import { t } from "@/lib/i18n";

export default function CheckoutPage() {
  const { cart, isLoading, cartToken } = useCartStore();
  const { sameAsShipping, selectedPaymentMethod, setSelectedPaymentMethod } = useCheckoutStore();
  const router = useRouter();
  const [checkoutState, formAction, isPending] = useActionState(checkoutAction, null);
  const [isSelectingShipping, startShippingTransition] = useTransition();
  const { isUpdatingAddress } = useAddressUpdate(cartToken ?? null);

  const isStripeMethod = selectedPaymentMethod === "stripe_cc" || selectedPaymentMethod === "stripe";

  // Handle server action result
  useEffect(() => {
    if (!checkoutState) return;
    if (checkoutState.type === "error") {
      toast.error(checkoutState.message);
    } else if (checkoutState.type === "stripe_redirect") {
      window.location.href = checkoutState.url;
    } else if (checkoutState.type === "success") {
      const params = new URLSearchParams({
        order_id: String(checkoutState.orderId),
        order_key: checkoutState.orderKey,
        billing_email: checkoutState.email,
      });
      router.push(`/order-confirmation?${params.toString()}`);
    }
  }, [checkoutState, router]);

  // Fire begin_checkout once when cart is ready
  const checkoutTracked = useRef(false);
  useEffect(() => {
    if (!cart || cart.items.length === 0 || checkoutTracked.current) return;
    checkoutTracked.current = true;
    const currency = cart.totals.currency_code;
    const value = parseInt(cart.totals.total_price) / Math.pow(10, cart.totals.currency_minor_unit);
    trackBeginCheckout(cartItemsToEcommerceItems(cart.items), currency, value);
  }, [cart]);

  // Auto-select first payment method when cart loads
  const paymentInitialized = useRef(false);
  useEffect(() => {
    if (cart?.payment_methods?.length && !paymentInitialized.current) {
      paymentInitialized.current = true;
      if (!selectedPaymentMethod) setSelectedPaymentMethod(cart.payment_methods[0]);
    }
  }, [cart?.payment_methods, selectedPaymentMethod, setSelectedPaymentMethod]);

  const handleShippingRateChange = (packageId: number, rateId: string) => {
    startShippingTransition(async () => {
      const result = await selectShippingRate(packageId, rateId, useCartStore.getState().cartToken);
      if (result.error) {
        toast.error(t("checkout.failedShipping"));
        return;
      }
      if (result.cart) {
        useCartStore.setState({ cart: result.cart, itemCount: result.cart.items_count });
        if (result.cartToken) useCartStore.setState({ cartToken: result.cartToken });
        const c = result.cart;
        const currency = c.totals.currency_code;
        const value = parseInt(c.totals.total_price) / Math.pow(10, c.totals.currency_minor_unit);
        const selectedRate = c.shipping_rates.flatMap((pkg) => pkg.shipping_rates).find((r) => r.selected);
        trackAddShippingInfo(cartItemsToEcommerceItems(c.items), currency, value, selectedRate?.name ?? rateId);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">{t("checkout.pageTitle")}</h1>
        <p className="text-muted-foreground">{t("checkout.loadingCart")}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="text-3xl font-heading font-bold mt-4">{t("checkout.emptyTitle")}</h1>
        <p className="text-muted-foreground mt-2">{t("checkout.emptyHint")}</p>
        <Link href="/shop" className={cn(buttonVariants({ size: "lg" }), "mt-6")}>
          {t("checkout.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold mb-8">{t("checkout.pageTitle")}</h1>

      <form action={formAction}>
        {/* Side-channel data not rendered as address fields */}
        <input type="hidden" name="cartToken" value={cartToken ?? ""} />
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        <input type="hidden" name="paymentMethod" value={selectedPaymentMethod} />
        <input type="hidden" name="sameAsShipping" value={sameAsShipping ? "1" : "0"} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <BillingAddressForm />
            <ShippingAddressForm />

            {cart.needs_shipping && cart.shipping_rates?.length > 0 && (
              <ShippingMethodSelector
                shippingRates={cart.shipping_rates}
                isDisabled={isSelectingShipping || isUpdatingAddress}
                onSelect={handleShippingRateChange}
              />
            )}

            {cart.needs_payment && cart.payment_methods?.length > 0 && (
              <PaymentMethodSelector
                paymentMethods={cart.payment_methods}
                isDisabled={isUpdatingAddress}
                onPaymentSelect={(method) => {
                  const currency = cart.totals.currency_code;
                  const value = parseInt(cart.totals.total_price) / Math.pow(10, cart.totals.currency_minor_unit);
                  trackAddPaymentInfo(cartItemsToEcommerceItems(cart.items), currency, value, method);
                }}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <CheckoutOrderSummary
              cart={cart}
              isPending={isPending}
              isUpdatingAddress={isUpdatingAddress}
              isSelectingShipping={isSelectingShipping}
              isStripeMethod={isStripeMethod}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
