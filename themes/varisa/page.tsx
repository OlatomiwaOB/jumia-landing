'use client';

import React, { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import VarisaProductCard from './components/ui/product-card';
import { Loader2, Search, SlidersHorizontal, ChefHat } from 'lucide-react';
import { ProductProps } from '@/types';

export default function ShopPage() {
  const envColor = process.env.NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR;
  const bgColor = envColor ? (envColor.startsWith('#') ? envColor : `#${envColor}`) : '#FCFBF8';

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || 'H2P';
  const storeCode = process.env.NEXT_PUBLIC_STORE_CODE!;

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  const categories = (categoriesData?.categories || []).filter((cat: any) => cat.name !== 'Foods');

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

  const products: ProductProps[] = productsData?.products || [];

  // Local search filter (since the API isn't taking 'searchQuery' right now, we can filter client-side)
  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const selectedCategoryName = categories.find((c: any) => c.code === selectedCategory)?.name || selectedCategory;

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: bgColor }}>
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
            <div className="flex items-center justify-start md:justify-center gap-2 md:gap-3 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-1 hide-scrollbar snap-x snap-mandatory">
              <style dangerouslySetInnerHTML={{ __html: `.hide-scrollbar::-webkit-scrollbar { display: none; }` }} />
              <button
                onClick={() => setSelectedCategory('All')}
                className={`flex-shrink-0 whitespace-nowrap px-6 py-2.5 md:px-8 md:py-3.5 rounded-full font-black text-[13px] md:text-[15px] transition-all duration-300 shadow-sm snap-start flex items-center gap-2 ${selectedCategory === 'All'
                  ? 'bg-accent text-accent-foreground shadow-accent/30 shadow-lg -translate-y-0.5'
                  : 'bg-white text-gray-600 hover:bg-accent/10 hover:text-accent border border-gray-200'
                  }`}
              >
                All Menu
              </button>
              {categories.map((cat: any, index: number) => {
                const isActive = selectedCategory === cat.code;
                return (
                  <button
                    key={cat.id || index}
                    onClick={() => setSelectedCategory(cat.code || 'Unknown')}
                    className={`flex-shrink-0 whitespace-nowrap px-6 py-2.5 md:px-8 md:py-3.5 rounded-full font-black text-[13px] md:text-[15px] transition-all duration-300 shadow-sm snap-start ${isActive
                      ? 'bg-accent text-accent-foreground shadow-accent/30 shadow-lg -translate-y-0.5'
                      : 'bg-white text-gray-600 hover:bg-accent/10 hover:text-accent border border-gray-200'
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
