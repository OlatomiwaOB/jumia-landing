'use client';


import { clientConfig, getClientIdentifiers } from '@/config/client-config';
import React, { useState, useEffect, useRef } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import VarisaProductCard from './components/ui/product-card';
import { Loader2, Search, SlidersHorizontal, ChefHat, AlertTriangle } from 'lucide-react';
import { ProductProps } from '@/types';

export default function ShopPage() {
  const envColor = clientConfig().branding.colors.accentForeground;
  const bgColor = envColor ? (envColor.startsWith('#') ? envColor : `#${envColor}`) : '#FCFBF8';

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const entityCode = getClientIdentifiers().entityCode;
  const storeCode = getClientIdentifiers().storeCode;

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  const categories = (categoriesData?.categories || []).filter((cat: any) => cat.name !== 'Foods');

  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allCategoriesList = [{ code: 'All', name: 'All Menu' }, ...categories];
  const extendedCategories = Array(6).fill(allCategoriesList).flat();

  useEffect(() => {
    if (isPaused || !categories.length) return;

    let animationFrameId: number;

    const animateScroll = () => {
      const el = scrollRef.current;
      if (el && window.innerWidth < 768) {
        el.scrollLeft += 1;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, categories.length]);

  // Fetch products (pass undefined for category if 'All' is selected)
  const categoryParam = selectedCategory === 'All' ? undefined : selectedCategory;
  const { data: productsData, isLoading: isLoadingProducts } = useProducts(
    storeCode,
    entityCode,
    categoryParam,
    '',          // name
    'shop-page', // retryProducts
    1,           // pageNumber
    200          // pageSize
  );

  const products: ProductProps[] = productsData?.products || [];

  // Local search filter (since the API isn't taking 'searchQuery' right now, we can filter client-side)
  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const selectedCategoryName = categories.find((c: any) => c.code === selectedCategory)?.name || selectedCategory;

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: bgColor }}>
      {/* ── TOP PROMO MARQUEE ── */}
      <div className="w-full bg-gray-900 text-gray-200 py-2.5 overflow-hidden relative z-40 text-[11.5px] md:text-[13px] font-semibold tracking-wide border-b border-white/10 shadow-sm">
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes scroll-marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-promo-marquee {
            display: flex;
            width: max-content;
            animation: scroll-marquee 15s linear infinite;
          }
          @media (min-width: 768px) {
            .animate-promo-marquee {
              animation: scroll-marquee 25s linear infinite;
            }
          }
        `}} />
        <div className="animate-promo-marquee">
          {/* We repeat the content 4 times to ensure it covers even ultrawide screens without leaving empty gaps */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-10 md:gap-20 items-center px-5 md:px-10 shrink-0" aria-hidden={i > 1 ? "true" : "false"}>
              <span className="flex items-center gap-2 whitespace-nowrap"><span className="text-accent text-lg leading-none">✨</span> <span className="text-white font-bold">PROMO:</span> Orders of 12+ pieces of any single protein attract a 5% discount!</span>
              <span className="flex items-center gap-2 whitespace-nowrap"><span className="text-accent text-lg leading-none">🚚</span> <span className="text-white font-bold">Delivery:</span> Charges start from £8.99, capped at £16.99.</span>
              <span className="flex items-center gap-2 whitespace-nowrap"><span className="text-accent text-lg leading-none">📦</span> <span className="text-white font-bold">Bulk Orders:</span> Contact us for a custom quote on large-scale catering.</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <section className="relative w-full h-[250px] sm:h-[320px] md:h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 w-full max-w-4xl mx-auto mt-8 md:mt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-extrabold text-[10px] md:text-[12px] uppercase tracking-[0.2em] shadow-xl mb-4 md:mb-6">
            <ChefHat size={14} className="text-accent" />
            <span>Premium Taste</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-lg mb-4 md:mb-6">
            Discover Our <span className="text-accent italic">Menu</span>
          </h1>
          <p className="text-[15px] sm:text-[17px] md:text-[20px] text-gray-200 font-medium max-w-2xl mx-auto leading-relaxed text-shadow-sm px-2">
            Authentic recipes made with passion. Browse our freshly prepared dishes and find your perfect craving for any occasion.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30 pb-24">

        {/* ── GOOD TO KNOW INFO CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 mt-8">

          {/* Card 1: Allergen */}
          <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-3 transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} />
              </div>
              <h3 className="text-gray-900 font-extrabold text-sm uppercase tracking-wider">Allergen Notice</h3>
            </div>
            <p className="text-gray-600 text-[13px] leading-relaxed font-medium">
              Our meals are prepared in a kitchen that handles common allergens (peanuts, nuts, gluten, dairy, etc.). We cannot guarantee meals are completely trace-free. Please contact us before ordering if you have specific dietary requirements.
            </p>
          </div>

          {/* Card 2: Rice Dishes */}
          <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-3 transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <ChefHat size={16} />
              </div>
              <h3 className="text-gray-900 font-extrabold text-sm uppercase tracking-wider">Rice Dishes</h3>
            </div>
            <p className="text-gray-600 text-[13px] leading-relaxed font-medium">
              Our standard recipe includes diced chicken for all rice dishes to ensure maximum flavor. Liver is also available as an optional addition at <strong className="text-orange-600">NO extra cost</strong>.
            </p>
          </div>

          {/* Card 3: Pies Notice */}
          <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-3 transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <span className="text-sm">🥧</span>
              </div>
              <h3 className="text-gray-900 font-extrabold text-sm uppercase tracking-wider">Pies Add-on</h3>
            </div>
            <p className="text-gray-600 text-[13px] leading-relaxed font-medium">
              Our freshly baked savory pies are a delicious complement to any meal! Please note that pies are available exclusively as an add-on item for orders over <strong className="text-blue-600">£100</strong>.
            </p>
          </div>

        </div>

        {/* ── CATEGORY PILLS ── */}
        <div className="mb-10 md:mb-12 mt-14 md:mt-16 relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#FCFBF8] to-transparent z-10 pointer-events-none hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FCFBF8] to-transparent z-10 pointer-events-none hidden md:block" />

          {isLoadingCategories ? (
            <div className="flex justify-center gap-4 overflow-hidden px-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 md:h-12 w-28 md:w-32 bg-gray-200 rounded-full animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Mobile Scrolling View */}
              <div
                ref={scrollRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
                className="flex md:hidden items-center justify-start gap-2 overflow-x-auto pb-4 pt-2 -mx-4 px-4 hide-scrollbar"
              >
                <style dangerouslySetInnerHTML={{ __html: `.hide-scrollbar::-webkit-scrollbar { display: none; }` }} />
                {extendedCategories.map((cat: any, index: number) => {
                  const isActive = selectedCategory === cat.code;
                  return (
                    <button
                      key={`mobile-${cat.code}-${index}`}
                      onClick={() => setSelectedCategory(cat.code || 'Unknown')}
                      className={`flex-shrink-0 whitespace-nowrap px-6 py-2.5 rounded-full font-black text-[13px] transition-all duration-300 shadow-sm ${isActive
                        ? 'bg-accent text-accent-foreground shadow-accent/30 shadow-lg -translate-y-0.5'
                        : 'bg-white text-gray-600 hover:bg-accent/10 hover:text-accent border border-gray-200'
                        }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Desktop Static View */}
              <div className="hidden md:flex items-center justify-center flex-wrap gap-3 pb-4 pt-2">
                {allCategoriesList.map((cat: any, index: number) => {
                  const isActive = selectedCategory === cat.code;
                  return (
                    <button
                      key={`desktop-${cat.code}-${index}`}
                      onClick={() => setSelectedCategory(cat.code || 'Unknown')}
                      className={`flex-shrink-0 whitespace-nowrap px-8 py-3.5 rounded-full font-black text-[15px] transition-all duration-300 shadow-sm ${isActive
                        ? 'bg-accent text-accent-foreground shadow-accent/30 shadow-lg -translate-y-0.5'
                        : 'bg-white text-gray-600 hover:bg-accent/10 hover:text-accent border border-gray-200'
                        }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ── PRODUCTS GRID ── */}
        <div className="min-h-[500px]">
          {isLoadingProducts ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 bg-white/50 rounded-[2rem] md:rounded-[3rem] border border-white/60 shadow-xl shadow-black/[0.02] backdrop-blur-xl">
              <Loader2 className="animate-spin text-accent mb-4 md:mb-6" size={48} />
              <p className="text-gray-500 font-extrabold text-lg md:text-xl animate-pulse tracking-wide">Cooking up delicious items...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <VarisaProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-12 md:p-20 text-center shadow-2xl shadow-black/[0.03] border border-gray-100 max-w-3xl mx-auto my-12 relative overflow-hidden">
              {/* Aesthetic background blobs */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-60" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl opacity-60" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                  <Search size={32} className="md:w-10 md:h-10" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 md:mb-4 tracking-tight">No cravings found</h3>
                <p className="text-gray-500 text-[16px] md:text-[18px] max-w-md mx-auto leading-relaxed px-4">
                  We couldn't find any dishes {searchQuery ? `matching "${searchQuery}"` : `in the "${selectedCategoryName}" category`} right now.
                </p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="mt-8 md:mt-10 px-8 py-3.5 md:px-10 md:py-4 bg-accent text-accent-foreground rounded-full font-extrabold text-[15px] md:text-[16px] hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1"
                >
                  View Full Menu
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
