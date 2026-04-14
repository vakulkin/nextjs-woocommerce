import { ProductsSection } from "@/components/home/products-section";

export function OnSaleSection() {
  return (
    <ProductsSection
      variant="on_sale"
      eyebrowKey="home.onSale.eyebrow"
      titleKey="home.onSale.heading"
      perPage={4}
      viewAllHref="/shop?on_sale=true"
      viewAllLabelKey="home.onSale.viewAll"
    />
  );
}
