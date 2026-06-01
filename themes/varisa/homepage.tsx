import PromotionalCards from './components/ui/promotional-cards';
import CategoryList from '@/components/ui/category-list';
import BestSellers from './components/ui/best-sellers';
import FeaturedProductsSlider from './components/ui/featured-products';
import Testimonials from './components/ui/testimonials';
import TopDeals from './components/ui/top-deals';

import LimitedOffer from './components/ui/limited-offer';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Promotional Cards Grid */}
      <PromotionalCards />

      {/* Categories List Section */}
      <CategoryList />

      {/* Best Sellers Section */}
      <BestSellers />

      {/* Featured Products Slider (Added after Best Sellers) */}
      <FeaturedProductsSlider />

      {/* Customer Testimonials Section */}
      <Testimonials />

      {/* Top Deals Of The Day Section */}
      <TopDeals />

      {/* Limited Time Offer / Newsletter Section */}
      <LimitedOffer />
    </div>
  )
}
