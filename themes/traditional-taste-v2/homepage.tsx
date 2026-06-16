import { Suspense } from 'react';
import HeroPromoGrid from "./components/ui/hero-promo-grid";
import QuickCategoryPills from "./components/ui/quick-category-pills";
import CategoryShowcaseSection from "./components/ui/category-showcase-section";
import ChefSpecialSection from "./components/ui/chef-special";
import FastDeliverySection from "./components/ui/fast-delivery";
import FAQSection from "./components/ui/faq-section";

function SectionSkeleton({ height = 'h-[400px]' }: { height?: string }) {
  return <div className={`w-full ${height} bg-gray-100 animate-pulse`} />;
}

export default function Homepage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text)] transition-colors duration-300 font-sans">

      {/* Hero — loads immediately, no API block */}
      <Suspense fallback={<SectionSkeleton height="h-[75vh]" />}>
        <HeroPromoGrid />
      </Suspense>

      {/* Category pills — loads independently */}
      <Suspense fallback={<SectionSkeleton height="h-[80px]" />}>
        <QuickCategoryPills />
      </Suspense>

      {/* Showcase section — loads independently */}
      <Suspense fallback={<SectionSkeleton height="h-[500px]" />}>
        <CategoryShowcaseSection />
      </Suspense>

      {/* Chef Special — loads independently */}
      <Suspense fallback={<SectionSkeleton height="h-[500px]" />}>
        <ChefSpecialSection />
      </Suspense>

      {/* These sections have no API calls — always instant */}
      <FastDeliverySection />
      <FAQSection />
    </div>
  );
}
