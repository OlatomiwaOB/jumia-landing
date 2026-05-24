'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { ProductCard } from '../utils/products-card';
import { ProductProps } from '@/types';
import ProductDetailsModal from '../utils/product-details-modal';
import Image from 'next/image';
import { ArrowLeft, SlidersHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { useCategories } from '@/app/hooks/useCategories';

export default function DepotCategoryContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryCode = decodeURIComponent(params.categoryCode as string);
  const storeCode = searchParams?.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE || '';
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || 'FTD';

  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['depot-category-products', categoryCode, storeCode, sortBy],
    queryFn: async () => {
      const response = await axiosInstanceNoAuth.request({
        method: 'GET',
        url: '/ecommerce/products/list',
        params: {
          name: '',
          storeCode: storeCode,
          entityCode: entityCode,
          category: categoryCode,
          tag: '',
          pageNumber: 1,
          pageSize: 200,
          sortBy: sortBy
        }
      });
      return response.data;
    }
  });

  const currentCategory = categoriesData?.categories?.find(
    (cat: any) => cat.code === categoryCode
  );

  const categoryName = currentCategory?.name || 'Category';
  const allProducts = productsData?.products || [];
  
  // Sorting handle (client side if needed, but API also supports it)
  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = allProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Category Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <button
            onClick={() => router.push(`/shop?storeCode=${storeCode}`)}
            className="group flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#888] hover:text-black transition-colors mb-8"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            BACK TO SHOP
          </button>

          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-black mb-6">
              {categoryName.toUpperCase()}
            </h1>
            <p className="text-base lg:text-lg text-[#666] leading-relaxed">
              {currentCategory?.description || `Explore our refined selection of ${categoryName.toLowerCase()} products, curated for quality and timeless style.`}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 pb-6 border-b border-gray-100">
          <div className="text-xs font-bold tracking-widest text-[#888]">
            {allProducts.length} PRODUCTS
          </div>
          
          <div className="flex items-center gap-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer text-[#555] hover:text-black transition-colors"
            >
              <option value="name">DEFAULT SORTING</option>
              <option value="price-low-high">PRICE: LOW TO HIGH</option>
              <option value="price-high-low">PRICE: HIGH TO LOW</option>
            </select>
            
            <span className="text-[#eee]">|</span>
            
            <button className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#555] hover:text-black transition-colors">
              <SlidersHorizontal size={14} />
              FILTER
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-gray-100 rounded-lg mb-4" />
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : allProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {paginatedProducts.map((product: ProductProps) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => {
                  setSelectedProduct(product);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <h3 className="text-xl font-bold text-black mb-2">No products found</h3>
            <p className="text-sm text-gray-500 mb-8">No products available in this category at the moment.</p>
            <button
               onClick={() => router.push(`/shop?storeCode=${storeCode}`)}
               className="text-xs font-bold tracking-[0.2em] px-8 py-3 bg-black text-white hover:bg-[#333] transition-colors"
            >
               RETURN TO SHOP
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-8 border-t border-gray-100 pt-12">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 text-xs font-bold tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:text-black text-[#888] transition-colors"
            >
              <ChevronLeft size={16} />
              PREV
            </button>
            
            <div className="flex gap-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`text-xs font-bold tracking-widest transition-colors ${
                    currentPage === page ? 'text-black border-b border-black' : 'text-[#888] hover:text-black'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 text-xs font-bold tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:text-black text-[#888] transition-colors"
            >
              NEXT
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <ProductDetailsModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        product={selectedProduct}
      />
    </div>
  );
}
