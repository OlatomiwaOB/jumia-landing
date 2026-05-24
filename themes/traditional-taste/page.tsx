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
import { getCategoryHref } from '@/utils/product-route';
import { SlidersHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';

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
  let showcaseProducts = allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Custom override for the first six lines of cards on Page 1
  if (currentPage === 1 && showcaseProducts.length >= 4) {
    const customFirstRow = [
      { ...showcaseProducts[0], name: "Disha Rice 5kg", salePrice: 9.99, oldPrice: undefined, rating: 5, picture: "/disha-rice.png", id: "mock-disha" },
      { ...showcaseProducts[0], name: "Tilda Basmati Rice 5kg", salePrice: 11.99, oldPrice: undefined, rating: 5, picture: "/tilda-5kg.png", id: "mock-tilda-5" },
      { ...showcaseProducts[0], name: "Tilda Long Grain Rice 10kg", salePrice: 16.99, oldPrice: undefined, rating: 4, picture: "/tilda-10kg.png", id: "mock-tilda-10" },
      { ...showcaseProducts[0], name: "Tilda Long Grain Rice 20kg", salePrice: 28.99, oldPrice: undefined, rating: 4, picture: "/tilda-20kg.png", id: "mock-tilda-20" },
    ];

    let customSecondRow = [
      { ...showcaseProducts[0], name: "Aani Basmati Rice 10kg", salePrice: 19.50, oldPrice: undefined, rating: 4, picture: "/aani-10kg.png", id: "mock-aani-10", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "Aani Basmati Rice 20kg", salePrice: 35.99, oldPrice: undefined, rating: 4, picture: "/aani-20kg.png", id: "mock-aani-20", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "African Finest Jollof Rice 10kg", salePrice: 19.99, oldPrice: undefined, rating: 5, picture: "/african-finest.png", id: "mock-african", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "Tolly Boy Rice 5kg", salePrice: 8.99, oldPrice: undefined, rating: 4, picture: "/tolly-boy.png", id: "mock-tolly-5", imageClass: "scale-125 group-hover:scale-[1.35]" },
    ];

    let customThirdRow = [
      { ...showcaseProducts[0], name: "Tolly Boy Rice 10kg", salePrice: 15.99, oldPrice: undefined, rating: 4, picture: "/tolly-10kg.png", id: "mock-tolly-10", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "Tolly Boy Rice 20kg", salePrice: 28.99, oldPrice: undefined, rating: 4, picture: "/tolly-20kg.png", id: "mock-tolly-20", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "Tropical Sun Basmati Rice 10kg", salePrice: 19.99, oldPrice: undefined, rating: 5, picture: "/tropical-sun.png", id: "mock-tropical", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "Knorr Beef Cubes", salePrice: 2.20, oldPrice: undefined, rating: 5, picture: "/knorr-beef.png", id: "mock-knorr", imageClass: "scale-125 group-hover:scale-[1.35]" },
    ];

    let customFourthRow = [
      { ...showcaseProducts[0], name: "Maggi Star Cubes", salePrice: 2.20, oldPrice: undefined, rating: 5, picture: "/maggi-cubes.png", id: "mock-maggi", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "Tasty Cube", salePrice: 3.50, oldPrice: undefined, rating: 4, picture: "/tasty-cube.png", id: "mock-tasty", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "Rajah Curry Powder", salePrice: 1.50, oldPrice: undefined, rating: 4, picture: "/rajah-curry.png", id: "mock-rajah-curry", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "Rajah Chicken Seasoning 100g", salePrice: 1.50, oldPrice: undefined, rating: 4, picture: "/rajah-chicken.png", id: "mock-rajah-chicken", imageClass: "scale-125 group-hover:scale-[1.35]" },
    ];

    let customFifthRow = [
      { ...showcaseProducts[0], name: "Rajah White Pepper 100g", salePrice: 3.50, oldPrice: undefined, rating: 4, picture: "/rajah-white.jpg", id: "mock-rajah-white", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "Tropical Sun Garlic Powder 500g", salePrice: 5.50, oldPrice: undefined, rating: 4, picture: "/tropical-garlic.jpg", id: "mock-tropical-garlic", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "Tropical Sun Chicken Seasoning", salePrice: 1.99, oldPrice: undefined, rating: 4, picture: "/tropical-chicken.png", id: "mock-tropical-chicken", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "Ducros Thyme 80g", salePrice: 8.00, oldPrice: undefined, rating: 5, picture: "/ducros-thyme.png", id: "mock-ducros-thyme", imageClass: "scale-125 group-hover:scale-[1.35]" },
    ];

    let customSixthRow = [
      { ...showcaseProducts[0], name: "Lasor Pepper Soup Spice", salePrice: 1.99, oldPrice: undefined, rating: 5, picture: "/lasor-pepper.png", id: "mock-lasor-pepper", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "Spice City Fried Rice Seasoning", salePrice: 1.99, oldPrice: undefined, rating: 4, picture: "/spicity-fried.png", id: "mock-spicity-fried", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "Spice City Jollof Rice Seasoning", salePrice: 1.99, oldPrice: undefined, rating: 4, picture: "/spicity-jollof.png", id: "mock-spicity-jollof", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...showcaseProducts[0], name: "Tiger Curry Masala Roll", salePrice: 2.00, oldPrice: undefined, rating: 4, picture: "/tiger-masala.png", id: "mock-tiger-masala", imageClass: "scale-125 group-hover:scale-[1.35]" },
    ];

    showcaseProducts = [...customFirstRow, ...customSecondRow, ...customThirdRow, ...customFourthRow, ...customFifthRow, ...customSixthRow];
  }

  // Custom override for Page 2 cards
  if (currentPage === 2) {
    const page2BaseProduct = allProducts[0] || {};
    const customPage2Row1 = [
      { ...page2BaseProduct, name: "Page 2 Product 1", salePrice: 1.99, oldPrice: undefined, rating: 4, picture: "/placeholder-image.png", id: "p2-mock-1", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...page2BaseProduct, name: "Page 2 Product 2", salePrice: 1.99, oldPrice: undefined, rating: 4, picture: "/placeholder-image.png", id: "p2-mock-2", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...page2BaseProduct, name: "Page 2 Product 3", salePrice: 1.99, oldPrice: undefined, rating: 4, picture: "/placeholder-image.png", id: "p2-mock-3", imageClass: "scale-125 group-hover:scale-[1.35]" },
      { ...page2BaseProduct, name: "Page 2 Product 4", salePrice: 1.99, oldPrice: undefined, rating: 4, picture: "/placeholder-image.png", id: "p2-mock-4", imageClass: "scale-125 group-hover:scale-[1.35]" },
    ];
    showcaseProducts = [...customPage2Row1];
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
        <section>
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-12">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors">
                <SlidersHorizontal size={18} className="text-gray-600" />
                <span className="font-semibold text-gray-800">Filters</span>
              </button>
              <span className="text-gray-500 font-medium">{allProducts.length} products</span>
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
                      setSelectedProduct(product);
                      setIsModalOpen(true);
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
                      className="w-10 h-10 rounded-full bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all"
                    >
                      <ChevronLeft size={16} strokeWidth={2.5} />
                    </button>
                  )}
                  {pages.slice(0, 5).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentPage === page
                        ? 'bg-[#0F5A3E] text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className="w-10 h-10 rounded-full bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all"
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
