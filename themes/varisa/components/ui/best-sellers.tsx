'use client'
import React, { useState, useRef, useEffect } from 'react';
import VarisaProductCard from './product-card';
import { ProductProps } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BestSellersProps {
  products?: ProductProps[];
  categories?: { code?: string; name?: string; logo?: string }[];
}

export default function BestSellers({ products: dynamicProducts = [], categories: dynamicCategories = [] }: BestSellersProps) {
  const preferredOrder = ['Soups & Stews', 'Grills & Peppered Meats', 'Main Meals', 'Sides & Snacks'];
  const displayCategories = dynamicCategories.filter(c => c.name && c.code).sort((a, b) => {
    const indexA = preferredOrder.indexOf(a.name!);
    const indexB = preferredOrder.indexOf(b.name!);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
  const initialTab = displayCategories.length > 0 ? displayCategories[0].code : 'All';

  const [activeTab, setActiveTab] = useState<string | undefined>(initialTab);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentDesktopSlide, setCurrentDesktopSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Update active tab if categories load asynchronously
  useEffect(() => {
    if (activeTab === 'All' && displayCategories.length > 0) {
      setActiveTab(displayCategories[0].code);
    }
  }, [displayCategories, activeTab]);

  const products: ProductProps[] = activeTab === 'All' || !activeTab
    ? dynamicProducts
    : dynamicProducts.filter(p => p.category === activeTab);

  // Reset slide index when tab changes
  const handleTabChange = (code?: string) => {
    setActiveTab(code);
    setCurrentSlide(0);
    setCurrentDesktopSlide(0);
  };

  const goToPrev = () => setCurrentSlide((p) => Math.max(0, p - 1));
  const goToNext = () => setCurrentSlide((p) => Math.min(products.length - 1, p + 1));

  const maxDesktopSlide = Math.max(0, products.length - 1);
  const currentCategoryIndex = displayCategories.findIndex(c => c.code === activeTab);
  const hasNextCategory = currentCategoryIndex >= 0 && currentCategoryIndex < displayCategories.length - 1;
  const hasPrevCategory = currentCategoryIndex > 0;

  const goToPrevDesktop = () => {
    if (currentDesktopSlide === 0 && hasPrevCategory) {
      handleTabChange(displayCategories[currentCategoryIndex - 1].code);
    } else {
      setCurrentDesktopSlide((p) => Math.max(0, p - 1));
    }
  };

  const goToNextDesktop = () => {
    if (currentDesktopSlide === maxDesktopSlide && hasNextCategory) {
      handleTabChange(displayCategories[currentCategoryIndex + 1].code);
    } else {
      setCurrentDesktopSlide((p) => Math.min(maxDesktopSlide, p + 1));
    }
  };

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
            {displayCategories.map((category) => (
              <button
                key={category.code}
                onClick={() => handleTabChange(category.code)}
                className={`whitespace-nowrap font-bold text-[15px] transition-colors relative pb-4 ${activeTab === category.code ? 'text-accent border-b-2 border-accent' : 'text-[#111] hover:text-accent'}`}
              >
                {category.name}
              </button>
            ))}
            <button
              onClick={() => handleTabChange('All')}
              className={`whitespace-nowrap font-bold text-[14px] flex items-center gap-1 ml-2 pb-4 transition-colors relative ${activeTab === 'All' ? 'text-accent border-b-2 border-accent' : 'text-[#111] hover:text-accent'}`}
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
              No best sellers found in {displayCategories.find(c => c.code === activeTab)?.name || 'this category'} right now. Check back later!
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
                  disabled={currentDesktopSlide === 0 && !hasPrevCategory}
                  className={`absolute top-[40%] -translate-y-1/2 -left-6 w-12 h-12 bg-white text-gray-900 border border-gray-100 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 z-10 opacity-0 group-hover/desktop-carousel:opacity-100 ${currentDesktopSlide === 0 && !hasPrevCategory ? 'cursor-not-allowed opacity-50' : 'hover:bg-accent hover:border-accent hover:text-accent-foreground cursor-pointer'}`}
                >
                  <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <button
                  onClick={goToNextDesktop}
                  disabled={currentDesktopSlide === maxDesktopSlide && !hasNextCategory}
                  className={`absolute top-[40%] -translate-y-1/2 -right-6 w-12 h-12 bg-white text-gray-900 border border-gray-100 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 z-10 opacity-0 group-hover/desktop-carousel:opacity-100 ${currentDesktopSlide === maxDesktopSlide && !hasNextCategory ? 'cursor-not-allowed opacity-50' : 'hover:bg-accent hover:border-accent hover:text-accent-foreground cursor-pointer'}`}
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


