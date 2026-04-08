import type { Metadata } from "next";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Checkout",
  description: t('checkout.pageDescription'),
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
