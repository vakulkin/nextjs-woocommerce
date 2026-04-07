import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View and manage your saved fragrances.",
  robots: { index: false, follow: false },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
