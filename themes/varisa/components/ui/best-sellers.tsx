'use client'
import React, { useState, useRef } from 'react';
import VarisaProductCard from './product-card';
import { ProductProps } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { id: 1, title: 'Traditional Soups', code: 'Traditional Soups' },
  { id: 2, title: 'Rice Dishes', code: 'Rice Dishes' },
  { id: 3, title: 'Porridges', code: 'Porridges' },
  { id: 4, title: 'Proteins', code: 'Proteins' },
  { id: 5, title: 'Classic Stews', code: 'Classic Stews' },
  { id: 6, title: 'Small Chops', code: 'Small Chops' },
  { id: 7, title: 'Sides & Extras', code: 'Sides & Extras' },
  { id: 8, title: 'Bundles', code: 'Bundles' },
];

const mockProductsData: Record<string, ProductProps[]> = {
  'Traditional Soups': [
    { id: 101, name: 'Eforiro (Traditional Soup) - 2L', salePrice: 70, picture: '/images/mock/eforiro_soup.png', ccy: 'GBP' },
    { id: 102, name: 'Uziza Soup - 2L', salePrice: 70, picture: '/images/mock/eforiro_soup.png', ccy: 'GBP' },
    { id: 103, name: 'Okro Soup - 4L', salePrice: 120, oldPrice: 130, picture: '/images/mock/eforiro_soup.png', ccy: 'GBP', discount: '8%' },
    { id: 104, name: 'Oha Soup - 6L', salePrice: 150, picture: '/images/mock/eforiro_soup.png', ccy: 'GBP' },
    { id: 105, name: 'Egusi Soup - 2L', salePrice: 80, picture: '/images/mock/eforiro_soup.png', ccy: 'GBP' },
    { id: 106, name: 'Edikang Ikong - 4L', salePrice: 140, picture: '/images/mock/eforiro_soup.png', ccy: 'GBP' },
  ],
  'Rice Dishes': [
    { id: 201, name: 'Asun Jollof Rice - 2L', salePrice: 65, oldPrice: 75, picture: '/images/mock/jollof_rice.png', ccy: 'GBP', discount: '13%' },
    { id: 202, name: 'Asun Jollof Rice - 4L', salePrice: 90, picture: '/images/mock/jollof_rice.png', ccy: 'GBP' },
    { id: 203, name: 'Fried Rice (with diced chicken) - 2L', salePrice: 40, picture: '/images/mock/jollof_rice.png', ccy: 'GBP' },
    { id: 204, name: 'Fried Rice - 4L', salePrice: 60, picture: '/images/mock/jollof_rice.png', ccy: 'GBP' },
    { id: 205, name: 'Coconut Rice - 2L', salePrice: 50, picture: '/images/mock/jollof_rice.png', ccy: 'GBP' },
    { id: 206, name: 'Coconut Rice - 4L', salePrice: 80, picture: '/images/mock/jollof_rice.png', ccy: 'GBP' },
  ],
  'Porridges': [
    { id: 301, name: 'Yam Porridge - 2L', salePrice: 65, picture: '/images/mock/yam_porridge.png', ccy: 'GBP' },
    { id: 302, name: 'Yam Porridge - 4L', salePrice: 95, oldPrice: 110, picture: '/images/mock/yam_porridge.png', ccy: 'GBP', discount: '14%' },
    { id: 303, name: 'Beans Porridge - 2L', salePrice: 55, picture: '/images/mock/yam_porridge.png', ccy: 'GBP' },
    { id: 304, name: 'Beans Porridge - 4L', salePrice: 80, picture: '/images/mock/yam_porridge.png', ccy: 'GBP' },
    { id: 305, name: 'Plantain Porridge - 2L', salePrice: 60, picture: '/images/mock/yam_porridge.png', ccy: 'GBP' },
    { id: 306, name: 'Plantain Porridge - 4L', salePrice: 90, picture: '/images/mock/yam_porridge.png', ccy: 'GBP' },
  ],
  'Proteins': [
    { id: 401, name: 'Peppered Fish (Red Bream)', salePrice: 3.50, picture: '/images/mock/peppered_snail.png', ccy: 'GBP' },
    { id: 402, name: 'Jumbo Turkey Mid-Wings', salePrice: 3.00, oldPrice: 3.50, picture: '/images/mock/peppered_snail.png', ccy: 'GBP', discount: '5%' },
    { id: 403, name: 'Peppered Jumbo Chicken', salePrice: 2.60, picture: '/images/mock/peppered_snail.png', ccy: 'GBP' },
    { id: 404, name: 'Peppered Beef', salePrice: 2.60, picture: '/images/mock/peppered_snail.png', ccy: 'GBP' },
    { id: 405, name: 'Peppered Snail', salePrice: 5.00, picture: '/images/mock/peppered_snail.png', ccy: 'GBP' },
    { id: 406, name: 'Fried Fish', salePrice: 3.00, picture: '/images/mock/peppered_snail.png', ccy: 'GBP' },
  ],
  'Classic Stews': [
    { id: 501, name: 'Ofada Sauce - 2L', salePrice: 75, picture: '/images/mock/ayamase_stew.png', ccy: 'GBP' },
    { id: 502, name: 'Ofada Sauce - 4L', salePrice: 120, oldPrice: 130, picture: '/images/mock/ayamase_stew.png', ccy: 'GBP', discount: '8%' },
    { id: 503, name: 'Ofada Sauce - 6L', salePrice: 150, picture: '/images/mock/ayamase_stew.png', ccy: 'GBP' },
    { id: 504, name: 'Assorted Meat Stew - 2L', salePrice: 70, picture: '/images/mock/ayamase_stew.png', ccy: 'GBP' },
    { id: 505, name: 'Chicken Stew - 2L', salePrice: 65, picture: '/images/mock/ayamase_stew.png', ccy: 'GBP' },
    { id: 506, name: 'Fish Stew - 2L', salePrice: 70, picture: '/images/mock/ayamase_stew.png', ccy: 'GBP' },
  ],
  'Small Chops': [
    { id: 601, name: 'Freshly Baked Pies (12 Pcs)', salePrice: 30, picture: '/images/mock/small_chops.png', ccy: 'GBP' },
    { id: 602, name: 'Mixed Small Chops Platter', salePrice: 40, oldPrice: 45, picture: '/images/mock/small_chops.png', ccy: 'GBP', discount: '10%' },
    { id: 603, name: 'Samosas & Spring Rolls', salePrice: 25, picture: '/images/mock/small_chops.png', ccy: 'GBP' },
    { id: 604, name: 'Puff Puff Bowl', salePrice: 15, picture: '/images/mock/small_chops.png', ccy: 'GBP' },
    { id: 605, name: 'Spring Rolls (12 Pcs)', salePrice: 20, picture: '/images/mock/small_chops.png', ccy: 'GBP' },
    { id: 606, name: 'Samosas (12 Pcs)', salePrice: 20, picture: '/images/mock/small_chops.png', ccy: 'GBP' },
  ],
  'Sides & Extras': [
    { id: 701, name: 'Moimoi Wraps (10 pcs)', salePrice: 39, picture: '/images/mock/moi_moi.png', ccy: 'GBP' },
    { id: 702, name: 'Gizdodo - 2L', salePrice: 65, oldPrice: 70, picture: '/images/mock/moi_moi.png', ccy: 'GBP', discount: '5%' },
    { id: 703, name: 'Gizdodo - 4L', salePrice: 95, picture: '/images/mock/moi_moi.png', ccy: 'GBP' },
    { id: 704, name: 'Peppered Gizzard - 2L', salePrice: 45, picture: '/images/mock/moi_moi.png', ccy: 'GBP' },
    { id: 705, name: 'Fried Plantain (Dodo)', salePrice: 15, picture: '/images/mock/moi_moi.png', ccy: 'GBP' },
    { id: 706, name: 'Coleslaw', salePrice: 10, picture: '/images/mock/moi_moi.png', ccy: 'GBP' },
  ],
  'Bundles': [
    { id: 801, name: 'Postpartum & Busy Mum Bundle', salePrice: 469, oldPrice: 500, picture: '/images/mock/mixed_platter.png', ccy: 'GBP', discount: '6%' },
    { id: 802, name: 'Family Feast Platter', salePrice: 150, picture: '/images/mock/mixed_platter.png', ccy: 'GBP' },
    { id: 803, name: 'Weekend Starter Combo', salePrice: 80, picture: '/images/mock/mixed_platter.png', ccy: 'GBP' },
    { id: 804, name: 'Party Pack Bundle', salePrice: 250, picture: '/images/mock/mixed_platter.png', ccy: 'GBP' },
    { id: 805, name: 'Couples Bundle', salePrice: 120, picture: '/images/mock/mixed_platter.png', ccy: 'GBP' },
    { id: 806, name: 'Breakfast Combo', salePrice: 60, picture: '/images/mock/mixed_platter.png', ccy: 'GBP' },
  ],
};

export default function BestSellers() {
  const [activeTab, setActiveTab] = useState(categories[0].code);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentDesktopSlide, setCurrentDesktopSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const products: ProductProps[] = activeTab === 'All'
    ? Object.values(mockProductsData).flat()
    : mockProductsData[activeTab] || [];

  // Reset slide index when tab changes
  const handleTabChange = (code: string) => {
    setActiveTab(code);
    setCurrentSlide(0);
    setCurrentDesktopSlide(0);
  };

  const goToPrev = () => setCurrentSlide((p) => Math.max(0, p - 1));
  const goToNext = () => setCurrentSlide((p) => Math.min(products.length - 1, p + 1));

  const maxDesktopSlide = Math.max(0, products.length - 4);
  const goToPrevDesktop = () => setCurrentDesktopSlide((p) => Math.max(0, p - 1));
  const goToNextDesktop = () => setCurrentDesktopSlide((p) => Math.min(maxDesktopSlide, p + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) goToNext();
    else if (diff < -40) goToPrev();
    touchStartX.current = null;
  };

  return (
    <section className="w-full bg-accent-foreground">
      <div className="px-4 md:px-8 pt-6 pb-16 md:py-20 max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#111] leading-none pb-4 text-center lg:text-left w-full lg:w-auto">Best Products</h2>

          {/* Scrollable Tabs */}
          <div className="flex items-center overflow-x-auto overflow-y-hidden no-scrollbar gap-6 lg:gap-8 w-full lg:w-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleTabChange(category.code)}
                className={`whitespace-nowrap font-bold text-[15px] transition-colors relative pb-4 text-[#111] hover:text-accent`}
              >
                {category.title}
              </button>
            ))}
            <button
              onClick={() => handleTabChange('All')}
              className={`whitespace-nowrap font-bold text-[14px] flex items-center gap-1 ml-2 pb-4 transition-colors relative text-[#111] hover:text-accent`}
            >
              View All <span className="text-[12px] font-black">»</span>
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl text-gray-300">🍽️</span>
            </div>
            <p className="text-gray-400 font-medium text-[15px]">
              No best sellers found in {activeTab} right now. Check back later!
            </p>
          </div>
        ) : (
          <>
            {/* ── 'VIEW ALL' Grid Layout ── */}
            {activeTab === 'All' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <VarisaProductCard key={product.id || product.code} product={product} />
                ))}
              </div>
            )}

            {/* ── DESKTOP CAROUSEL ── */}
            {activeTab !== 'All' && (
              <div className="hidden sm:block relative w-full group/desktop-carousel px-1">
                <div className="overflow-hidden -mx-3">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentDesktopSlide * 25}%)` }}
                  >
                    {products.map((product) => (
                      <div key={product.id || product.code} className="w-1/4 flex-shrink-0 px-3 pb-8 pt-4">
                        <VarisaProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Arrows */}
                <button
                  onClick={goToPrevDesktop}
                  disabled={currentDesktopSlide === 0}
                  className={`absolute top-[40%] -translate-y-1/2 -left-6 w-12 h-12 bg-white text-gray-900 border border-gray-100 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 z-10 opacity-0 group-hover/desktop-carousel:opacity-100 ${currentDesktopSlide === 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-accent hover:border-accent hover:text-accent-foreground cursor-pointer'}
                    }`}
                >
                  <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <button
                  onClick={goToNextDesktop}
                  disabled={currentDesktopSlide === maxDesktopSlide}
                  className={`absolute top-[40%] -translate-y-1/2 -right-6 w-12 h-12 bg-white text-gray-900 border border-gray-100 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 z-10 opacity-0 group-hover/desktop-carousel:opacity-100 ${currentDesktopSlide === maxDesktopSlide ? 'cursor-not-allowed opacity-50' : 'hover:bg-accent hover:border-accent hover:text-accent-foreground cursor-pointer'}
                    }`}
                >
                  <ChevronRight size={24} strokeWidth={2.5} />
                </button>
              </div>
            )}

            {/* ── MOBILE CATEGORIES: one-at-a-time carousel ── */}
            {activeTab !== 'All' && (
              <div className="sm:hidden">
                {/* Slide area */}
                <div
                  className="relative overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {products.map((product) => (
                      <div
                        key={product.id || product.code}
                        className="w-full flex-shrink-0 px-2"
                      >
                        <VarisaProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots only */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 h-6 px-4">
                  {products.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className="flex items-center justify-center w-6 h-6 pointer-events-auto"
                    >
                      {i === currentSlide ? (
                        <div className="w-6 h-6 rounded-full border border-accent flex items-center justify-center">
                          <div className="w-2 h-2 bg-accent rounded-full" />
                        </div>
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full hover:bg-gray-500 transition-colors" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}


