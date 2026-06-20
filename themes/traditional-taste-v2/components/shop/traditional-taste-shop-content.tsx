'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '../ui/product-card';
import { Loader2, Search, ChefHat } from 'lucide-react';
import { ProductProps } from '@/types';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';

export default function TraditionalTasteShopContent() {
  const envColor = process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#F97316';
  const bgColor = process.env.NEXT_PUBLIC_ACCENT_COLOR // Traditional Taste background

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const PAGE_SIZE = 20;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showAllergenDetails, setShowAllergenDetails] = useState(false);

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

  // Reset to page 1 when category or search changes
  useEffect(() => {
    setCurrentPage(1);
    setAllProducts([]);
  }, [selectedCategory, searchQuery]);

  // Fetch products — 20 at a time
  const categoryParam = selectedCategory === 'All' ? '' : selectedCategory;
  const { data: productsData, isLoading: isLoadingProducts, isFetching } = useProducts(
    storeCode,
    entityCode,
    categoryParam,
    '',          // name
    'shop-page', // retryProducts
    currentPage,
    PAGE_SIZE
  );

  const rawProducts: ProductProps[] = productsData?.products || [];
  const hasMoreProducts = rawProducts.length === PAGE_SIZE;

  // Accumulate products across pages
  useEffect(() => {
    if (!isLoadingProducts && rawProducts.length > 0) {
      if (currentPage === 1) {
        setAllProducts(rawProducts);
      } else {
        setAllProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newOnes = rawProducts.filter(p => !existingIds.has(p.id));
          return [...prev, ...newOnes];
        });
      }
    }
  }, [rawProducts, currentPage, isLoadingProducts]);

  // Local search filter — applied on accumulated products
  const filteredProducts = allProducts.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  // Map to the Product type expected by ProductCard
  const products = filteredProducts.map((p, idx) => {
    const basePrice = p.salePrice || 0;
    const currency = p.ccy || '£';
    const priceString = `${currency}${basePrice.toFixed(2)}`;

    return {
      id: p.id || idx,
      vendor: p.brand || 'Traditional Taste',
      title: p.name || 'Unknown Item',
      price: priceString,
      originalPrice: p.oldPrice && p.oldPrice > basePrice ? `${currency}${p.oldPrice.toFixed(2)}` : null,
      discount: p.discount ? `${p.discount}% OFF` : null,
      image: p.picture || '/placeholder-image.png',
      badges: [],
      stock: (p.qtyInStore || 0) > 0,
      offer: null,
    };
  });

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

        {/* ── ALLERGEN DISCLAIMER (DIRECT DISPLAY) ── */}
        <div className="mx-auto max-w-[1400px] mt-12 md:mt-12 mb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h3 className="text-[#F97316] font-bold text-lg md:text-xl flex items-center gap-2 mb-4">
              <span>⚠️</span> Allergen Notice
            </h3>

            <p className="text-gray-800 text-[15px] md:text-base leading-relaxed mb-2">
              We take food safety seriously and make every effort to minimize the risk of cross-contact. However, all meals are prepared in a kitchen where common allergens are present, including peanuts, tree nuts, gluten, eggs, milk, soy, fish, shellfish, sesame, mustard, celery, lupin, and sulphites.
            </p>

            <p className="text-gray-800 text-[15px] md:text-base leading-relaxed">
              As a result, we cannot guarantee that any item is completely free from allergen traces. If you have any allergies, intolerances, or special dietary requirements, please notify us before placing your order.
            </p>
          </div>
        </div>

        {/* ── CATEGORY PILLS ── */}
        <div className="mb-10 md:mb-12 mt-8 md:mt-10 relative">
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
          {(isLoadingProducts || (isFetching && allProducts.length === 0)) ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 bg-white/50 rounded-[2rem] md:rounded-[3rem] border border-white/60 shadow-xl shadow-black/[0.02] backdrop-blur-xl">
              <Loader2 className="animate-spin text-[#F97316] mb-4 md:mb-6" size={48} />
              <p className="text-gray-500 font-extrabold text-lg md:text-xl animate-pulse tracking-wide">Cooking up delicious items...</p>
            </div>
          ) : products.length > 0 ? (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} isGrid={true} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreProducts && (
                <div className="flex justify-center mt-10 mb-4">
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={isFetching}
                    className="px-10 py-4 bg-[#F97316] hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-full text-[15px] transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 flex items-center gap-3"
                  >
                    {isFetching ? (
                      <><Loader2 size={18} className="animate-spin" /> Loading more...</>
                    ) : (
                      'Load More Dishes'
                    )}
                  </button>
                </div>
              )}
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
