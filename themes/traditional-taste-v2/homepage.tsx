import HeroPromoGrid from "./components/ui/hero-promo-grid";
import QuickCategoryPills from "./components/ui/quick-category-pills";
import PriceHitsSection from "./components/ui/price-hits-section";
import CategoryShowcaseSection from "./components/ui/category-showcase-section";
import ChefSpecialSection from "./components/ui/chef-special";
import FastDeliverySection from "./components/ui/fast-delivery";
import FAQSection from "./components/ui/faq-section";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text)] transition-colors duration-300 font-sans">
      <HeroPromoGrid />
      <QuickCategoryPills />
      {/* <PriceHitsSection /> */}
      <CategoryShowcaseSection />
      <ChefSpecialSection />
      <FastDeliverySection />
      <FAQSection />
    </div>
  );
}
