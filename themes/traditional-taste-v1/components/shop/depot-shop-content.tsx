'use client';


import { getClientIdentifiers } from '@/config/client-config';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { ProductCard } from '../utils/products-card';
import { ProductProps } from '@/types';
import ProductDetailsModal from '../utils/product-details-modal';
import { useCategories } from '@/app/hooks/useCategories';
import Image from 'next/image';
import { Search, X, SlidersHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';

export default function DepotShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL Params
  const initialCategory = searchParams?.get('category') || '';
  const initialSearch = searchParams?.get('search') || '';
  const storeCode = searchParams?.get('storeCode') || getClientIdentifiers().storeCode;
  const entityCode = getClientIdentifiers().entityCode;

  // State
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [shopByCategorySelected, setShopByCategorySelected] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  const productsSectionRef = useRef<HTMLDivElement>(null);

  // Sync state with URL
  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setShopByCategorySelected(initialCategory);
  }, [initialCategory]);

  // Fetch Categories
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  // Fetch Products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['depot-products', storeCode, shopByCategorySelected, searchQuery],
    queryFn: async () => {
      const response = await axiosInstanceNoAuth.request({
        method: 'GET',
        url: '/ecommerce/products/list',
        params: {
          name: searchQuery,
          storeCode: storeCode,
          entityCode: entityCode,
          category: shopByCategorySelected,
          tag: '',
          pageNumber: 1,
          pageSize: 200, // Fetch a chunk for client-side pagination
        },
      });
      return response.data;
    },
  });

  const allProducts = productsData?.products || [];
  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = allProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleCategoryClick = (categoryCode: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (categoryCode) {
      params.set('category', categoryCode);
      setShopByCategorySelected(categoryCode);
    } else {
      params.delete('category');
      setShopByCategorySelected('');
    }
    params.delete('search'); // Clear search when picking a category
    setSearchQuery('');
    setCurrentPage(1);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete('search');
    setSearchQuery('');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Category Navigation Bar */}
      <div className="border-b border-gray-100 bg-white sticky top-[68px] z-30">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-8 py-4 whitespace-nowrap">
            <button
              onClick={() => handleCategoryClick('')}
              className={`text-xs font-semibold tracking-widest transition-colors ${
                !shopByCategorySelected ? 'text-black border-b-2 border-black pb-1' : 'text-[#888] hover:text-black'
              }`}
            >
              ALL PRODUCTS
            </button>
            {categoriesData?.categories?.map((category: any) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.code)}
                className={`text-xs font-semibold tracking-widest transition-colors ${
                  shopByCategorySelected === category.code ? 'text-black border-b-2 border-black pb-1' : 'text-[#888] hover:text-black'
                }`}
              >
                {category.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-12">
        {/* Header / Info Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : shopByCategorySelected || 'Shop All'}
            </h1>
            <p className="text-sm text-[#777] max-w-xl">
              {searchQuery 
                ? `Showing results matching your search query. Found ${allProducts.length} items.`
                : 'Browse our collection of curated essentials designed for modern living.'}
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-semibold tracking-wider text-[#555]">
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={14} />
              FILTER
            </span>
            <span className="text-[#eee]">|</span>
            <span>{allProducts.length} PRODUCTS</span>
          </div>
        </div>

        {/* Search Query Pill */}
        {searchQuery && (
          <div className="mb-8 flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs font-medium text-black">
              Search: {searchQuery}
              <button onClick={clearSearch} className="hover:text-red-500">
                <X size={14} />
              </button>
            </span>
          </div>
        )}

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
            {paginatedProducts.map((product) => (
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
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-black mb-2">No products found</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8">
              We couldn't find any products matching your current criteria.
            </p>
            <button
              onClick={() => handleCategoryClick('')}
              className="text-xs font-bold tracking-[0.2em] px-8 py-3 bg-black text-white hover:bg-[#333] transition-colors"
            >
              CLEAR ALL FILTERS
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

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
