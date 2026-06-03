'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import BigHero from "./components/layout/big-hero";
import { ProductCard } from "./components/utils/products-card";
import { ProductProps } from '@/types';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import ProductDetailsModal from './components/utils/product-details-modal';
import { useCategories } from '@/hooks/useCategories';
import { getCategoryHref, getProductHref } from '@/utils/product-route';
import { SlidersHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';
import LimitedOffer from './components/layout/limited-offer';

export default function DepotHome() {
  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [featuredDeals, setFeaturedDeals] = useState<ProductProps[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const storeCode = searchParams
    ? searchParams.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE || ''
    : process.env.NEXT_PUBLIC_STORE_CODE || '';
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');

  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE;
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  // We reuse the api fetching logic from ftd
  const { data: featuredProductsData, isLoading: featuredLoading } = useQuery({
    queryKey: ["testapp-featured", storeCode],
    queryFn: () => {
      return axiosInstanceNoAuth.request({
        method: "GET",
        url: '/ecommerce/products/list',
        params: {
          storeCode: storeCode,
          entityCode: entityCode,
          name: '',
          category: '',
          tag: '',
          pageNumber: 1,
          pageSize: 20
        }
      }).then(response => response.data)
    },
    refetchInterval: 30000,
  });

  const { data: allProductsData, isLoading: productsLoading } = useQuery({
    queryKey: ["testapp-all-products", storeCode],
    queryFn: () => {
      return axiosInstanceNoAuth.request({
        method: "GET",
        url: '/ecommerce/products/list',
        params: {
          storeCode: storeCode,
          entityCode: entityCode,
          name: '',
          category: '',
          tag: '',
          pageNumber: 1,
          pageSize: 100
        }
      }).then(response => response.data)
    }
  });

  useEffect(() => {
    if (allProductsData?.products) {
      setAllProducts(allProductsData.products);
    }
  }, [allProductsData]);

  useEffect(() => {
    if (featuredProductsData?.products) {
      const featured = featuredProductsData.products.filter(
        (product: ProductProps) => product.featured === true
      );
      // fallback to any products if no featured
      setFeaturedDeals(featured.length > 0 ? featured : featuredProductsData.products);
    }
  }, [featuredProductsData]);

  const itemsPerPage = 24;
  let showcaseProducts: any[] = allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Custom override for the first six lines of cards on Page 1

  // Import mock products
  const mockedProducts = require('@/utils/mocked-products').getMockedProducts(allProducts[0] || {});
  
  if (currentPage >= 1 && currentPage <= 5) {
     const startIndex = (currentPage - 1) * itemsPerPage;
     const endIndex = startIndex + itemsPerPage;
     showcaseProducts = mockedProducts.slice(startIndex, endIndex);
  }
  const totalPages = Math.max(5, Math.ceil(allProducts.length / itemsPerPage));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const categories = (categoriesData?.categories || []).filter(
    (category: { code?: string; name?: string }) => category.code && category.name
  );
  const isLoading = featuredLoading || productsLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f9f9f9]">
        <div className="text-sm font-semibold tracking-widest animate-pulse">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <BigHero products={featuredDeals} />

      <div className="container mx-auto py-16 px-4 md:px-16">
        <section className="mb-24 flex flex-col items-center">
          <div className="mb-14 text-center flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/50 text-accent text-xs font-bold tracking-[0.2em] uppercase mb-4 shadow-sm border border-orange-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
              Discover
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-gray-900 drop-shadow-sm">
              Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400 italic">Category</span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-gray-500 max-w-2xl font-medium leading-relaxed">
              Explore our wide range of authentic African products, handpicked just for you.
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
              {categories.slice(0, 4).map((category, index) => {
                const isLarge = index === 0;
                const customImages = [
                  '/cat-groceries.png',
                  '/cat-meat-seafood.png',
                  '/cat-oil-seasoning.png',
                  '/cat-dried-foods.png'
                ];
                const customNames = [
                  'Groceries',
                  'Meat & Seafood',
                  'Oil & Seasoning',
                  'Dried Foods'
                ];
                const customSlugs = [
                  'groceries',
                  'meat-seafood',
                  'oil-seasoning',
                  'dried-foods'
                ];

                return (
                  <button
                    key={category.code}
                    type="button"
                    className={`relative cursor-default group rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(249,115,22,0.25)] block w-full h-full text-left bg-gray-100 border border-black/5 ${isLarge ? 'lg:col-span-2 lg:row-span-2' : 'lg:col-span-1 lg:row-span-1'
                      }`}
                  >
                    <Image
                      src={customImages[index] || category.logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80'}
                      alt={customNames[index] || category.name || 'Category'}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                    <div className={`absolute ${isLarge ? 'bottom-5 left-5 max-w-[85%] py-4 px-6 rounded-[1.5rem]' : 'bottom-3 left-3 max-w-[90%] py-2 px-3.5 rounded-xl'} bg-black/30 backdrop-blur-md border border-white/10 flex flex-col items-start transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 overflow-hidden shadow-xl`}>
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative z-10 flex w-full justify-between items-end">
                        <div>
                          <h3 className={`${isLarge ? 'text-3xl' : 'text-base sm:text-lg'} font-serif font-bold text-white tracking-wide group-hover:text-accent transition-colors duration-300 flex items-center ${isLarge ? 'gap-3' : 'gap-1.5'}`}>
                            {customNames[index] || category.name}
                            <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                              <svg width={isLarge ? "20" : "14"} height={isLarge ? "20" : "14"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </span>
                          </h3>
                          <p className={`text-gray-200 ${isLarge ? 'text-sm mt-1.5 gap-2' : 'text-[10px] sm:text-xs mt-0.5 gap-1.5'} font-medium flex items-center`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                            {[
                              '80+ Products', // Groceries (Index 0)
                              '30+ Products', // Bags (Index 1)
                              '20+ Products', // Watch (Index 2)
                              '15+ Products'  // Kitchen (Index 3)
                            ][index] || '30+ Products'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-black/10 px-6 py-10 text-sm text-[#777] w-full text-center">
              Categories will appear here as soon as they are available.
            </div>
          )}
        </section>
      </div>

      <div className="w-full bg-gray-950 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-16 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">Why Choose Us</h2>
            <p className="text-gray-400 text-lg font-medium">The traditional taste experience, delivered with modern convenience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Fresh Products',
                desc: 'Sourced directly from trusted suppliers for guaranteed freshness.',
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
              },
              {
                title: 'Fast Delivery',
                desc: 'UK-wide delivery within 24–48 hours directly to your doorstep.',
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>
              },
              {
                title: 'Best Prices',
                desc: 'Competitive wholesale prices with great discounts for everyone.',
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42l-8.704-8.704z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" /></svg>
              },
              {
                title: '24/7 Support',
                desc: 'Dedicated customer support available anytime via WhatsApp & chat.',
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 flex flex-col items-start border border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2 transition-all duration-500 group shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center text-white mb-8 shadow-lg shadow-accent/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-[15px] text-gray-400 leading-relaxed font-medium group-hover:text-gray-300 transition-colors duration-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-16 px-4 md:px-16 bg-[#fbf9f6]/50">
        <section id="shop-section" className="scroll-mt-8">
          {/* Filters Bar */}
          <div className="bg-white border border-gray-100 rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-12 overflow-hidden transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center p-5">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 transition-all duration-300 font-bold text-sm ${
                    isFiltersOpen
                      ? 'bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-[0_4px_15px_rgba(26,92,56,0.2)] hover:shadow-[0_6px_20px_rgba(26,92,56,0.3)] hover:-translate-y-0.5'
                      : 'border-2 border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-gray-200 hover:-translate-y-0.5'
                  }`}
                >
                  <SlidersHorizontal size={18} />
                  <span>Filters</span>
                </button>
                <span className="text-gray-500 font-medium">{Math.max(120, allProducts.length)} products</span>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                <span className="text-gray-500 font-medium">Sort by:</span>
                <div className="relative">
                  <select className="appearance-none border border-gray-200 rounded-xl px-4 py-2 pr-10 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer">
                    <option>Default</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable Filter Panel */}
            <div 
              className={`transition-all duration-500 ease-in-out origin-top ${
                isFiltersOpen ? 'max-h-[800px] opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95 pointer-events-none'
              }`}
            >
              <div className="border-t border-gray-100 px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50/30">
                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Category</label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 pr-10 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
                    >
                      <option>All Categories</option>
                      <option>Groceries</option>
                      <option>Meat</option>
                      <option>Oil</option>
                      <option>Dried Foods</option>
                      <option>Beverages</option>
                      <option>Snacks</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Min Price */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Min Price (£)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                {/* Max Price */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Max Price (£)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                {/* Min Rating */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Min Rating</label>
                  <div className="relative">
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(e.target.value)}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 pr-10 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="2">2+ Stars</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Clear All Filters */}
                <div className={`col-span-1 sm:col-span-2 lg:col-span-4 flex items-center pt-2 transition-all duration-300 ${
                  (selectedCategory !== 'All Categories' || minPrice !== '' || maxPrice !== '' || minRating !== '') 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-2 pointer-events-none absolute'
                }`}>
                  <button
                    onClick={() => {
                      setSelectedCategory('All Categories');
                      setMinPrice('');
                      setMaxPrice('');
                      setMinRating('');
                    }}
                    className="flex items-center gap-1.5 text-red-500 hover:text-red-600 font-bold text-sm transition-all duration-300 hover:bg-red-50 px-3 py-1.5 rounded-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Clear all filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">
                Popular Products
              </h2>
              <p className="text-gray-500 font-medium mt-2">
                Discover our most loved Nigerian food items
              </p>
            </div>
            <a href="#" className="font-semibold text-accent hover:text-orange-600 transition-colors flex items-center gap-1 group">
              View All <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {showcaseProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {showcaseProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    storeCode={storeCode}
                    onClick={() => {
                      router.push(getProductHref(product, storeCode));
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages >= 1 && (
                <div className="flex justify-center items-center gap-3 mt-16 mb-8">
                  {/* Back arrow - only show when not on first page */}
                  {currentPage > 1 && (
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className="w-10 h-10 rounded-full bg-white text-[#0F5A3E] border border-gray-200 hover:border-[#E35920] hover:text-[#E35920] hover:bg-orange-50 flex items-center justify-center transition-all shadow-sm"
                    >
                      <ChevronLeft size={16} strokeWidth={2.5} />
                    </button>
                  )}
                  {pages.slice(0, 5).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentPage === page
                        ? 'bg-[#E35920] text-white shadow-[0_4px_10px_rgba(227,89,32,0.4)]'
                        : 'bg-white text-[#0F5A3E] border border-gray-200 hover:border-[#E35920] hover:text-[#E35920] hover:bg-orange-50 shadow-sm'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className="w-10 h-10 rounded-full bg-white text-[#0F5A3E] border border-gray-200 hover:border-[#E35920] hover:text-[#E35920] hover:bg-orange-50 flex items-center justify-center transition-all shadow-sm"
                  >
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-[#888] tracking-widest text-sm">NO PRODUCTS FOUND</div>
          )}
        </section>
      </div>

      <LimitedOffer />

      {selectedProduct && (
        <ProductDetailsModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          product={selectedProduct}
          onClick={() => setIsModalOpen(false)}
          storeCode={storeCode}
        />
      )}
    </div>
  );
}
