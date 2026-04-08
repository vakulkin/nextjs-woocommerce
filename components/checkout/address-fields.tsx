"use client";

import { useCheckoutStore } from "@/lib/store/checkout-store";
import { Input } from "@/components/ui/input";
import { t } from "@/lib/i18n";
import type { BillingAddress, ShippingAddress } from "@/lib/woocommerce/types";

interface AddressFieldsProps {
  namePrefix: "billing" | "shipping";
  /** When true, also renders company, email, and phone fields (billing only). */
  showContactFields?: boolean;
}

export function AddressFields({ namePrefix, showContactFields = false }: AddressFieldsProps) {
  const { updateBilling, updateShipping } = useCheckoutStore();
  const address = useCheckoutStore((s) => namePrefix === "billing" ? s.billing : s.shipping);
  const update =
    namePrefix === "billing"
      ? (f: string, v: string) => updateBilling(f as keyof BillingAddress, v)
      : (f: string, v: string) => updateShipping(f as keyof ShippingAddress, v);

  const htmlId = (f: string) => `${namePrefix}_${f}`;

  function field(fieldName: string) {
    return {
      id: htmlId(fieldName),
      name: htmlId(fieldName),
      value: (address as unknown as Record<string, string>)[fieldName] ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => update(fieldName, e.target.value),
    };
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={htmlId("first_name")} className="text-sm font-medium mb-1 block">
            {t("checkout.fields.firstName")}
          </label>
          <Input {...field("first_name")} placeholder={t("checkout.fields.firstNamePlaceholder")} />
        </div>
        <div>
          <label htmlFor={htmlId("last_name")} className="text-sm font-medium mb-1 block">
            {t("checkout.fields.lastName")}
          </label>
          <Input {...field("last_name")} placeholder={t("checkout.fields.lastNamePlaceholder")} />
        </div>
      </div>

      {showContactFields && (
        <>
          <div>
            <label htmlFor={htmlId("company")} className="text-sm font-medium mb-1 block">
              {t("checkout.fields.company")}
            </label>
            <Input {...field("company")} placeholder={t("checkout.fields.companyPlaceholder")} />
          </div>
          <div>
            <label htmlFor={htmlId("email")} className="text-sm font-medium mb-1 block">
              {t("checkout.fields.email")}
            </label>
            <Input {...field("email")} type="email" placeholder={t("checkout.fields.emailPlaceholder")} />
          </div>
          <div>
            <label htmlFor={htmlId("phone")} className="text-sm font-medium mb-1 block">
              {t("checkout.fields.phone")}
            </label>
            <Input {...field("phone")} type="tel" placeholder={t("checkout.fields.phonePlaceholder")} />
          </div>
        </>
      )}

      <div>
        <label htmlFor={htmlId("address_1")} className="text-sm font-medium mb-1 block">
          {t("checkout.fields.address1")}
        </label>
        <Input {...field("address_1")} placeholder={t("checkout.fields.streetPlaceholder")} />
      </div>

      <div>
        <label htmlFor={htmlId("address_2")} className="text-sm font-medium mb-1 block">
          {t("checkout.fields.address2")}
        </label>
        <Input {...field("address_2")} placeholder={t("checkout.fields.aptPlaceholder")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor={htmlId("city")} className="text-sm font-medium mb-1 block">
            {t("checkout.fields.city")}
          </label>
          <Input {...field("city")} placeholder={t("checkout.fields.cityPlaceholder")} />
        </div>
        <div>
          <label htmlFor={htmlId("state")} className="text-sm font-medium mb-1 block">
            {t("checkout.fields.state")}
          </label>
          <Input {...field("state")} placeholder={t("checkout.fields.statePlaceholder")} />
        </div>
        <div>
          <label htmlFor={htmlId("postcode")} className="text-sm font-medium mb-1 block">
            {t("checkout.fields.postcode")}
          </label>
          <Input {...field("postcode")} placeholder={t("checkout.fields.postcodePlaceholder")} />
        </div>
      </div>

      <div>
        <label htmlFor={htmlId("country")} className="text-sm font-medium mb-1 block">
          {t("checkout.fields.country")}
        </label>
        <Input {...field("country")} placeholder={t("checkout.fields.countryPlaceholder")} />
      </div>
    </div>
  );
}

