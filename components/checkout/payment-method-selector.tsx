"use client";

import { cn } from "@/lib/utils";
import { ExternalLink, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCheckoutStore } from "@/lib/store/checkout-store";
import { t } from "@/lib/i18n";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bacs: t.checkout.payment.bacs,
  cheque: t.checkout.payment.cheque,
  cod: t.checkout.payment.cod,
  stripe: t.checkout.payment.stripe,
  stripe_cc: t.checkout.payment.stripe_cc,
  paypal: t.checkout.payment.paypal,
};

const PAYMENT_METHOD_DESCRIPTIONS: Record<string, string> = {
  bacs: t.checkout.paymentDesc.bacs,
  cheque: t.checkout.paymentDesc.cheque,
  cod: t.checkout.paymentDesc.cod,
  stripe: t.checkout.paymentDesc.stripe,
  stripe_cc: t.checkout.paymentDesc.stripe_cc,
  paypal: t.checkout.paymentDesc.paypal,
};

interface PaymentMethodSelectorProps {
  paymentMethods: string[];
  isDisabled: boolean;
  onPaymentSelect?: (method: string) => void;
}

export function PaymentMethodSelector({ paymentMethods, isDisabled, onPaymentSelect }: PaymentMethodSelectorProps) {
  const { selectedPaymentMethod, setSelectedPaymentMethod } = useCheckoutStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {t.checkout.paymentTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {paymentMethods.map((method) => {
          const label = PAYMENT_METHOD_LABELS[method] ?? method;
          const description = PAYMENT_METHOD_DESCRIPTIONS[method];
          const isSelected = selectedPaymentMethod === method;
          return (
            <label
              key={method}
              className={cn(
                "flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <input
                type="radio"
                name="payment_method"
                value={method}
                checked={isSelected}
                onChange={() => {
                  setSelectedPaymentMethod(method);
                  onPaymentSelect?.(method);
                }}
                className="mt-0.5 h-4 w-4 accent-primary"
                disabled={isDisabled}
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium">{label}</span>
                {description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                )}
                {isSelected && (method === "stripe_cc" || method === "stripe") && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    {t.checkout.stripeRedirect}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </CardContent>
    </Card>
  );
}
