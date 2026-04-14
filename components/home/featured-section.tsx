import { ProductsSection } from "@/components/home/products-section";

export function FeaturedSection() {
  return (
    <ProductsSection
      variant="featured"
      eyebrowKey="home.featured.description"
      titleKey="home.featured.title"
      perPage={8}
      viewAllHref="/shop"
      viewAllLabelKey="home.featured.viewAll"
    />
  );
}

