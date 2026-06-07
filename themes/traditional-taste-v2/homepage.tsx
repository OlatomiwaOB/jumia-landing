import HeroPromoGrid from "./components/ui/hero-promo-grid";
import QuickCategoryPills from "./components/ui/quick-category-pills";
import PriceHitsSection from "./components/ui/price-hits-section";
import CategoryShowcaseSection from "./components/ui/category-showcase-section";
import FeaturedFoodShowcase from "./components/ui/featued-feasts";
import WhyChooseUsSection from "./components/ui/whychooseus";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text)] transition-colors duration-300 font-sans">
      <QuickCategoryPills />
      <HeroPromoGrid />
      <PriceHitsSection />
      <CategoryShowcaseSection />
      <FeaturedFoodShowcase />
      <WhyChooseUsSection />
    </div>
  );
}
