'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '../ui/product-card';
import { Loader2, Search, ChefHat } from 'lucide-react';
import { ProductProps } from '@/types';

export default function TraditionalTasteShopContent() {
  const envColor = process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#F97316';
  const bgColor = '#FAFAF9'; // Traditional Taste background

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || 'H2P';
  const storeCode = process.env.NEXT_PUBLIC_STORE_CODE || 'WEB';

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  const categories = (categoriesData?.categories || []).filter((cat: any) => cat.name !== 'Foods');

  const allCategoriesList = [{ code: 'All', name: 'All Menu' }, ...categories];
  const extendedCategories = Array(6).fill(allCategoriesList).flat();

  useEffect(() => {
    if (isPaused || !categories.length) return;
    
    let animationFrameId: number;

    const animateScroll = () => {
      const el = scrollRef.current;
      if (el) {
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

  // Fetch products (pass empty string for category if 'All' is selected)
  const categoryParam = selectedCategory === 'All' ? '' : selectedCategory;
  const { data: productsData, isLoading: isLoadingProducts } = useProducts(
    storeCode,
    entityCode,
    categoryParam,
    '',          // name
    'shop-page', // retryProducts
    1,           // pageNumber
    200          // pageSize
  );

  const rawProducts: ProductProps[] = productsData?.products || [];

  // Local search filter
  const filteredProducts = rawProducts.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  // Map to the Product type expected by ProductCard
  const products = filteredProducts.map((p, idx) => ({
    id: p.id || idx,
    vendor: p.brand || 'Traditional Taste',
    title: p.name || 'Unknown Item',
    price: `${p.ccy || '$'}${p.salePrice || 0}`,
    originalPrice: p.oldPrice && p.oldPrice > (p.salePrice || 0) ? `${p.ccy || '$'}${p.oldPrice}` : null,
    discount: p.discount ? `${p.discount}% OFF` : null,
    image: p.picture || '/placeholder-image.png',
    badges: p.banner ? [{ text: 'Bestseller', color: 'bg-orange-100 text-orange-700' }] : [],
    stock: (p.qtyInStore || 0) > 0,
    offer: p.onSale ? { type: 'flash', text: 'Limited time offer' } as const : null
  }));

  const selectedCategoryName = categories.find((c: any) => c.code === selectedCategory)?.name || selectedCategory;

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: bgColor }}>
      {/* ── HERO BANNER ── */}
      <section className="relative w-full h-[250px] sm:h-[320px] md:h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: 'url("/nigerian-food-banner.png")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 w-full max-w-4xl mx-auto mt-8 md:mt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-extrabold text-[10px] md:text-[12px] uppercase tracking-[0.2em] shadow-xl mb-4 md:mb-6">
            <ChefHat size={14} className="text-[#F97316]" />
            <span>Premium Taste</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-lg mb-4 md:mb-6">
            Discover Our <span className="text-[#F97316] italic font-serif">Menu</span>
          </h1>
          <p className="text-[15px] sm:text-[17px] md:text-[20px] text-gray-200 font-medium max-w-2xl mx-auto leading-relaxed text-shadow-sm px-2">
            Authentic recipes made with passion. Browse our freshly prepared dishes and find your perfect craving for any occasion.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30 pb-24">

        {/* ── CATEGORY PILLS ── */}
        <div className="mb-10 md:mb-12 mt-14 md:mt-16 relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#FAFAF9] to-transparent z-10 pointer-events-none hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FAFAF9] to-transparent z-10 pointer-events-none hidden md:block" />

          {isLoadingCategories ? (
            <div className="flex justify-center gap-4 overflow-hidden px-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 md:h-12 w-28 md:w-32 bg-gray-200 rounded-full animate-pulse" />
              ))}
            </div>
          ) : (
            <div 
              ref={scrollRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              className="flex items-center justify-start md:justify-center gap-2 md:gap-3 overflow-hidden pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-1 hide-scrollbar"
            >
              <style dangerouslySetInnerHTML={{ __html: `.hide-scrollbar::-webkit-scrollbar { display: none; }` }} />
              {extendedCategories.map((cat: any, index: number) => {
                const isActive = selectedCategory === cat.code;
                return (
                  <button
                    key={`${cat.code}-${index}`}
                    onClick={() => setSelectedCategory(cat.code || 'Unknown')}
                    className={`flex-shrink-0 whitespace-nowrap px-6 py-2.5 md:px-8 md:py-3.5 rounded-full font-black text-[13px] md:text-[15px] transition-all duration-300 shadow-sm ${isActive
                      ? 'bg-[#F97316] text-white shadow-[#F97316]/30 shadow-lg -translate-y-0.5'
                      : 'bg-white text-gray-600 hover:bg-[#F97316]/10 hover:text-[#F97316] border border-gray-200'
                      }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── PRODUCTS GRID ── */}
        <div className="min-h-[500px]">
          {isLoadingProducts ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 bg-white/50 rounded-[2rem] md:rounded-[3rem] border border-white/60 shadow-xl shadow-black/[0.02] backdrop-blur-xl">
              <Loader2 className="animate-spin text-[#F97316] mb-4 md:mb-6" size={48} />
              <p className="text-gray-500 font-extrabold text-lg md:text-xl animate-pulse tracking-wide">Cooking up delicious items...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} isGrid={true} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-12 md:p-20 text-center shadow-2xl shadow-black/[0.03] border border-gray-100 max-w-3xl mx-auto my-12 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl opacity-60" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#F97316]/5 rounded-full blur-3xl opacity-60" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#F97316]/10 text-[#F97316] rounded-full flex items-center justify-center mb-6">
                  <Search size={32} className="md:w-10 md:h-10" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 md:mb-4 tracking-tight">No cravings found</h3>
                <p className="text-gray-500 text-[16px] md:text-[18px] max-w-md mx-auto leading-relaxed px-4">
                  We couldn't find any dishes {searchQuery ? `matching "${searchQuery}"` : `in the "${selectedCategoryName}" category`} right now.
                </p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="mt-8 md:mt-10 px-8 py-3.5 md:px-10 md:py-4 bg-[#F97316] text-white rounded-full font-extrabold text-[15px] md:text-[16px] hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1"
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
