import type { Metadata } from "next";
import { Suspense } from "react";
import { CartClearer } from "@/components/order-confirmation/cart-clearer";
import { OrderDetails } from "@/components/order-confirmation/order-details";
import { OrderDetailsSkeleton } from "@/components/order-confirmation/order-details-skeleton";
import { OrderConfirmationParamsSchema } from "@/lib/validation/schemas";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Thank you for your order. Your purchase has been confirmed.",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Validate URL params — guard against forged/malicious query strings
  const params = OrderConfirmationParamsSchema.parse(await searchParams);

  return (
    <>
      <CartClearer />
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Suspense fallback={<OrderDetailsSkeleton />}>
          <OrderDetails
            orderId={params.order_id ?? null}
            sessionId={params.session_id ?? null}
            orderKey={params.order_key ?? null}
            billingEmail={params.billing_email}
          />
        </Suspense>
      </div>
    </>
  );
}

