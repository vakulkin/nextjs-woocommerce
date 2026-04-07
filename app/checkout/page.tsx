"use client";

import { useCallback, useTransition, useEffect, useRef, useActionState, startTransition } from "react";
import { useForm, FormProvider } from "react-hook-form";
import type { Resolver, FieldErrors, FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { useCheckoutStore } from "@/lib/store/checkout-store";
import { selectShippingRate } from "@/lib/actions/cart";
import { checkoutAction } from "@/lib/actions/checkout-submit";
import { CheckoutFormSchema, type CheckoutFormValues } from "@/lib/validation/schemas";
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

/**
 * Inline Zod v4 resolver — avoids @hookform/resolvers version-check issues
 * with Zod 4.3.x while reusing the same schema as server-side validation.
 */
function zodV4Resolver(schema: typeof CheckoutFormSchema): Resolver<CheckoutFormValues> {
  return async (values: FieldValues) => {
    const result = schema.safeParse(values);
    if (result.success) return { values: result.data, errors: {} };
    const errors: Record<string, unknown> = {};
    for (const issue of result.error.issues) {
      let cur = errors;
      for (let i = 0; i < issue.path.length - 1; i++) {
        const k = String(issue.path[i]);
        cur[k] ??= {};
        cur = cur[k] as Record<string, unknown>;
      }
      const last = String(issue.path.at(-1));
      cur[last] ??= { type: issue.code, message: issue.message };
    }
    return { values: {}, errors: errors as FieldErrors<CheckoutFormValues> };
  };
}

export default function CheckoutPage() {
  const { cart, isLoading, cartToken } = useCartStore();
  const {
    billing,
    shipping,
    sameAsShipping,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  } = useCheckoutStore();
  const router = useRouter();
  const [checkoutState, formAction, isPending] = useActionState(checkoutAction, null);
  const [isSelectingShipping, startShippingTransition] = useTransition();
  const { isUpdatingAddress } = useAddressUpdate(cartToken ?? null);

  const isStripeMethod = selectedPaymentMethod === "stripe_cc" || selectedPaymentMethod === "stripe";

  // ── React Hook Form ────────────────────────────────────────────────────────
  // defaultValues uses the reactive hook values (empty on SSR, populated after
  // Zustand persist rehydrates on the client). The useEffect below overwrites
  // them with getState() which reads the TRUE current store at effect-run time,
  // avoiding the stale-closure bug that occurred when the closure captured the
  // SSR-empty reactive values before Zustand had loaded from localStorage.
  const methods = useForm<CheckoutFormValues>({
    resolver: zodV4Resolver(CheckoutFormSchema),
    defaultValues: { billing, shipping },
    mode: "onTouched",
  });

  // Restore persisted address values after client mount.
  // getState() is called at effect-run time (post-paint), by which point
  // Zustand's persist middleware has synchronously read from localStorage.
  useEffect(() => {
    const { billing, shipping } = useCheckoutStore.getState();
    methods.reset({ billing, shipping });

    // Validate non-empty persisted fields immediately so that pre-filled but
    // invalid values (e.g. a saved invalid email) surface errors on page load
    // without the user having to blur each field first.
    const toValidate: string[] = [];
    for (const [k, v] of Object.entries(billing)) {
      if (typeof v === "string" && v.trim()) toValidate.push(`billing.${k}`);
    }
    for (const [k, v] of Object.entries(shipping)) {
      if (typeof v === "string" && v.trim()) toValidate.push(`shipping.${k}`);
    }
    if (toValidate.length) methods.trigger(toValidate as Parameters<typeof methods.trigger>[0]);
    // methods is stable (useForm ref), getState() reads the true current state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle server action result: show errors, redirect for Stripe, navigate on success
  useEffect(() => {
    if (!checkoutState) return;
    if (checkoutState.type === "error") {
      toast.error(checkoutState.message);
    } else if (checkoutState.type === "stripe_redirect") {
      window.location.href = checkoutState.url;
    } else if (checkoutState.type === "success") {
      methods.reset();
      const params = new URLSearchParams({
        order_id: String(checkoutState.orderId),
        order_key: checkoutState.orderKey,
        billing_email: checkoutState.email,
      });
      router.push(`/order-confirmation?${params.toString()}`);
    }
  }, [checkoutState, router, methods]);

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
      if (!selectedPaymentMethod) {
        setSelectedPaymentMethod(cart.payment_methods[0]);
      }
    }
  }, [cart?.payment_methods, selectedPaymentMethod, setSelectedPaymentMethod]);

  const handleShippingRateChange = useCallback(
    (packageId: number, rateId: string) => {
      startShippingTransition(async () => {
        const result = await selectShippingRate(packageId, rateId, useCartStore.getState().cartToken);
        if (result.error) {
          toast.error(t.checkout.failedShipping);
          console.error("Shipping rate error:", result.error);
          return;
        }
        if (result.cart) {
          useCartStore.setState({ cart: result.cart, itemCount: result.cart.items_count });
          if (result.cartToken) {
            useCartStore.setState({ cartToken: result.cartToken });
          }
          // track shipping info selection
          const c = result.cart;
          const currency = c.totals.currency_code;
          const value = parseInt(c.totals.total_price) / Math.pow(10, c.totals.currency_minor_unit);
          const selectedRate = c.shipping_rates
            .flatMap((pkg) => pkg.shipping_rates)
            .find((r) => r.selected);
          trackAddShippingInfo(
            cartItemsToEcommerceItems(c.items),
            currency,
            value,
            selectedRate?.name ?? rateId
          );
        }
      });
    },
    []
  );

  // ── Form submit: RHF validates first, then calls the server action ─────────
  const onSubmit = (data: CheckoutFormValues) => {
    const shippingData = sameAsShipping
      ? {
          first_name: data.billing.first_name,
          last_name: data.billing.last_name,
          company: data.billing.company,
          address_1: data.billing.address_1,
          address_2: data.billing.address_2,
          city: data.billing.city,
          state: data.billing.state,
          postcode: data.billing.postcode,
          country: data.billing.country,
        }
      : data.shipping;

    const fd = new FormData();
    fd.append("billing", JSON.stringify(data.billing));
    fd.append("shipping", JSON.stringify(shippingData));
    fd.append("paymentMethod", selectedPaymentMethod);
    fd.append("cartToken", cartToken ?? "");
    fd.append("cart", JSON.stringify(cart));
    startTransition(() => { formAction(fd); });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">{t.checkout.pageTitle}</h1>
        <p className="text-muted-foreground">{t.checkout.loadingCart}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="text-3xl font-heading font-bold mt-4">
          {t.checkout.emptyTitle}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t.checkout.emptyHint}
        </p>
        <Link href="/shop" className={cn(buttonVariants({ size: "lg" }), "mt-6")}>
          {t.checkout.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold mb-8">{t.checkout.pageTitle}</h1>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Billing & Shipping */}
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

            {/* Order Summary */}
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
      </FormProvider>
    </div>
  );
}
