'use client';


import { getClientIdentifiers } from '@/config/client-config';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import ProductCard, { Product } from '../ui/product-card';
import { Loader2, ArrowLeft, ChevronDown } from 'lucide-react';
import { ProductProps } from '@/types';

export default function TraditionalTasteCategoryContent() {
  const params = useParams();
  const router = useRouter();
  const categoryCode = params?.categoryCode as string;

  const [sortBy, setSortBy] = useState('Sort by Name');

  const entityCode = getClientIdentifiers().entityCode;
  const storeCode = getClientIdentifiers().storeCode;

  // Fetch categories to get the category name
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  const categories = categoriesData?.categories || [];
  const currentCategory = categories.find((cat: any) => cat.code === categoryCode);
  const categoryName = currentCategory?.name || categoryCode;

  // Fetch products for this specific category
  const { data: productsData, isLoading: isLoadingProducts } = useProducts(
    storeCode,
    entityCode,
    categoryCode,
    '',          // name
    'category-page', // retryProducts
    1,           // pageNumber
    200          // pageSize
  );

  const rawProducts: ProductProps[] = productsData?.products || [];

  // Map API ProductProps to the ProductCard's expected Product interface
  const products: Product[] = rawProducts.map((p, idx) => ({
    id: p.id || idx,
    vendor: p.brand || 'Traditional Taste',
    title: p.name || 'Unknown Item',
    price: `${p.ccy || '$'}${p.salePrice || 0}`,
    originalPrice: p.oldPrice && p.oldPrice > (p.salePrice || 0) ? `${p.ccy || '$'}${p.oldPrice}` : null,
    discount: p.discount ? `${p.discount}% OFF` : null,
    image: p.picture || '/placeholder-image.png',
    badges: p.banner ? [{ text: 'Bestseller', color: 'bg-orange-100 text-orange-700' }] : [],
    stock: (p.qtyInStore || 0) > 0,
    offer: p.onSale ? { type: 'flash', text: 'Limited time offer' } : null
  }));

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'Sort by Name') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'Price: Low to High') {
      return parseFloat(a.price.replace(/[^0-9.-]+/g,"")) - parseFloat(b.price.replace(/[^0-9.-]+/g,""));
    }
    if (sortBy === 'Price: High to Low') {
      return parseFloat(b.price.replace(/[^0-9.-]+/g,"")) - parseFloat(a.price.replace(/[^0-9.-]+/g,""));
    }
    return 0;
  });

  return (
    <div className="min-h-screen font-sans bg-[#FCFBF8] pb-24">
      {/* ── HEADER AREA ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Back button & Title */}
          <div className="flex items-start gap-4">
            <button 
              onClick={() => router.back()} 
              className="mt-1.5 p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft size={24} className="text-gray-900" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-[34px] font-bold text-[#1a1f2c] tracking-tight leading-tight">
                {isLoadingCategories ? (
                  <span className="inline-block w-48 h-8 bg-gray-200 rounded animate-pulse" />
                ) : (
                  categoryName
                )}
              </h1>
              <p className="text-[#6e7481] text-[15px] mt-1 font-medium">
                {isLoadingProducts ? (
                  <span className="inline-block w-24 h-4 bg-gray-200 rounded animate-pulse" />
                ) : (
                  `${products.length} items available`
                )}
              </p>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative group ml-10 md:ml-0 mt-2 md:mt-0">
            <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-[14px] font-medium text-gray-700 min-w-[160px] hover:border-gray-300 transition-colors shadow-sm">
              <span>{sortBy}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            
            {/* Simple CSS-based hover dropdown for sorting */}
            <div className="absolute top-full right-0 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <div className="flex flex-col">
                {['Sort by Name', 'Price: Low to High', 'Price: High to Low'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className="px-4 py-2.5 text-left text-[14px] hover:bg-gray-50 text-gray-700 font-medium transition-colors border-b last:border-b-0 border-gray-50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCTS GRID ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[500px]">
          {isLoadingProducts ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <Loader2 className="animate-spin text-[#F97316] mb-4" size={48} />
              <p className="text-gray-500 font-bold text-lg animate-pulse">Loading {categoryName}...</p>
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} isGrid={true} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto my-12">
              <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No foods found</h3>
              <p className="text-gray-500 text-[16px] max-w-md mx-auto">
                We couldn't find any items for "{categoryName}" right now.
              </p>
              <button
                onClick={() => router.push('/shop')}
                className="mt-8 px-8 py-3 bg-[#F97316] text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md"
              >
                Go back to Shop
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
