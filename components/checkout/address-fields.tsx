"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useCheckoutStore } from "@/lib/store/checkout-store";
import { t } from "@/lib/i18n";
import type { CheckoutFormValues } from "@/lib/validation/schemas";
import type { BillingAddress, ShippingAddress } from "@/lib/woocommerce/types";

/** Renders a red helper text beneath a field when there is a validation error. */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive text-xs mt-1">{message}</p>;
}

interface AddressFieldsProps {
  namePrefix: "billing" | "shipping";
  /** When true, also renders company, email, and phone fields (billing only). */
  showContactFields?: boolean;
}

/**
 * Shared address field set used by both BillingAddressForm and ShippingAddressForm.
 * Uses React Hook Form context (FormProvider must wrap the checkout form) for
 * validation and inline error display.  Also keeps the Zustand checkout store
 * in sync so the live shipping-rate recalculation hook can observe changes.
 */
export function AddressFields({ namePrefix, showContactFields = false }: AddressFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();

  const { updateBilling, updateShipping } = useCheckoutStore();
  const updateField =
    namePrefix === "billing"
      ? (f: string, v: string) => updateBilling(f as keyof BillingAddress, v)
      : (f: string, v: string) => updateShipping(f as keyof ShippingAddress, v);

  // Field errors for this prefix (typed loosely so we can index by field name)
  type FieldErrors = Partial<Record<string, { message?: string }>>;
  const fieldErrors = (errors[namePrefix] ?? {}) as FieldErrors;

  const htmlId = (f: string) => `${namePrefix}_${f}`;

  /** Merges RHF register props with Zustand sync on every keystroke. */
  function field(
    fieldName: string,
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { onChange: regOnChange, ...rest } = register(`${namePrefix}.${fieldName}` as any);
    return {
      id: htmlId(fieldName),
      ...rest,
      ...inputProps,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        regOnChange(e);
        updateField(fieldName, e.target.value);
      },
      "aria-invalid": !!fieldErrors[fieldName] || undefined,
    };
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={htmlId("first_name")} className="text-sm font-medium mb-1 block">
            {t('checkout.fields.firstName')}
          </label>
          <Input {...field("first_name")} placeholder={t('checkout.fields.firstNamePlaceholder')} />
          <FieldError message={fieldErrors["first_name"]?.message} />
        </div>
        <div>
          <label htmlFor={htmlId("last_name")} className="text-sm font-medium mb-1 block">
            {t('checkout.fields.lastName')}
          </label>
          <Input {...field("last_name")} placeholder={t('checkout.fields.lastNamePlaceholder')} />
          <FieldError message={fieldErrors["last_name"]?.message} />
        </div>
      </div>

      {showContactFields && (
        <>
          <div>
            <label htmlFor={htmlId("company")} className="text-sm font-medium mb-1 block">
              {t('checkout.fields.company')}
            </label>
            <Input {...field("company")} placeholder={t('checkout.fields.companyPlaceholder')} />
          </div>
          <div>
            <label htmlFor={htmlId("email")} className="text-sm font-medium mb-1 block">
              {t('checkout.fields.email')}
            </label>
            <Input {...field("email", { type: "email" })} placeholder={t('checkout.fields.emailPlaceholder')} />
            <FieldError message={fieldErrors["email"]?.message} />
          </div>
          <div>
            <label htmlFor={htmlId("phone")} className="text-sm font-medium mb-1 block">
              {t('checkout.fields.phone')}
            </label>
            <Input {...field("phone", { type: "tel" })} placeholder={t('checkout.fields.phonePlaceholder')} />
            <FieldError message={fieldErrors["phone"]?.message} />
          </div>
        </>
      )}

      <div>
        <label htmlFor={htmlId("address_1")} className="text-sm font-medium mb-1 block">
          {t('checkout.fields.address1')}
        </label>
        <Input {...field("address_1")} placeholder={t('checkout.fields.streetPlaceholder')} />
          <FieldError message={fieldErrors["address_1"]?.message} />
      </div>

      <div>
        <label htmlFor={htmlId("address_2")} className="text-sm font-medium mb-1 block">
          {t('checkout.fields.address2')}
        </label>
        <Input {...field("address_2")} placeholder={t('checkout.fields.aptPlaceholder')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor={htmlId("city")} className="text-sm font-medium mb-1 block">
            {t('checkout.fields.city')}
          </label>
          <Input {...field("city")} placeholder={t('checkout.fields.cityPlaceholder')} />
          <FieldError message={fieldErrors["city"]?.message} />
        </div>
        <div>
          <label htmlFor={htmlId("state")} className="text-sm font-medium mb-1 block">
            {t('checkout.fields.state')}
          </label>
          <Input {...field("state")} placeholder={t('checkout.fields.statePlaceholder')} />
          <FieldError message={fieldErrors["state"]?.message} />
        </div>
        <div>
          <label htmlFor={htmlId("postcode")} className="text-sm font-medium mb-1 block">
            {t('checkout.fields.postcode')}
          </label>
          <Input {...field("postcode")} placeholder={t('checkout.fields.postcodePlaceholder')} />
          <FieldError message={fieldErrors["postcode"]?.message} />
        </div>
      </div>

      <div>
        <label htmlFor={htmlId("country")} className="text-sm font-medium mb-1 block">
          {t('checkout.fields.country')}
        </label>
        <Input {...field("country")} placeholder={t('checkout.fields.countryPlaceholder')} />
          <FieldError message={fieldErrors["country"]?.message} />
      </div>
    </div>
  );
}
