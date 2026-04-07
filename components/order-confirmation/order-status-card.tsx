import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { t } from "@/lib/i18n";

interface OrderStatusCardProps {
  state: "success" | "pending" | "failure";
  orderId: string | null;
  stripeError?: string;
}

export function OrderStatusCard({ state, orderId, stripeError }: OrderStatusCardProps) {
  return (
    <Card className="text-center mb-6">
      <CardHeader>
        {state === "success" && (
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        )}
        {state === "pending" && (
          <Clock className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
        )}
        {state === "failure" && (
          <XCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
        )}
        <CardTitle className="text-2xl">
          {state === "success" && t.orderConfirmation.confirmedTitle}
          {state === "pending" && t.orderConfirmation.pendingTitle}
          {state === "failure" && t.orderConfirmation.failureTitle}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {orderId && state !== "failure" && (
          <p className="text-muted-foreground">
            {t.orderConfirmation.orderNumber} <strong>#{orderId}</strong>
          </p>
        )}

        {state === "success" && (
          <p className="text-muted-foreground">
            {t.orderConfirmation.successBody}
          </p>
        )}
        {state === "pending" && (
          <p className="text-muted-foreground">
            {t.orderConfirmation.pendingBody}
          </p>
        )}
        {state === "failure" && (
          <p className="text-muted-foreground">
            {stripeError
              ? t.orderConfirmation.failureVerifyBody
              : t.orderConfirmation.failureBody}
          </p>
        )}

        <div className="flex flex-col gap-2 pt-4">
          {state !== "failure" ? (
            <Link href="/shop" className={cn(buttonVariants())}>
              {t.orderConfirmation.continueShopping}
            </Link>
          ) : (
            <>
              <Link href="/checkout" className={cn(buttonVariants())}>
                {t.orderConfirmation.returnToCheckout}
              </Link>
              <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }))}>
                {t.orderConfirmation.continueShopping}
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
