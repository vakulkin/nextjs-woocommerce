"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/defaultcard";
import { AddressFields } from "@/components/checkout/address-fields";
import { t } from "@/lib/i18n";

export function BillingAddressForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('checkout.billingTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <AddressFields namePrefix="billing" showContactFields />
      </CardContent>
    </Card>
  );
}
