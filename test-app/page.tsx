'use client';
import { useState, useEffect } from 'react';
import HeroSlider from "@/components/test-theme/hero-slider";
import { ProductCard } from "@/components/test-theme/products-card";
import { ProductProps } from '@/types';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import ProductDetailsModal from '@/components/test-theme/product-details-modal';

type TabType = 'all' | 'home-decor' | 'lighting' | 'decoration' | 'vases' | 'basics';

export default function HomeTestApp() {
  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [tabProducts, setTabProducts] = useState<ProductProps[]>([]);
  const [featuredDeals, setFeaturedDeals] = useState<ProductProps[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const storeCode = searchParams ? searchParams.get('storeCode') || '' : '';
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE;

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

  useEffect(() => {
    if (!allProducts.length) return;

    let filtered = allProducts;
    // Basic mock logic for tabs
    if (activeTab !== 'all') {
      // Trying to match category in string, or just slice to mock filter behavior
      filtered = allProducts.filter(p => p.category?.toLowerCase().includes(activeTab.split('-')[0]) || false);
      if (filtered.length === 0) {
        // Mock fallback if names don't match exactly
        filtered = allProducts.slice(0, 8);
      }
    }

    setTabProducts(filtered.slice(0, 12)); // limits to a grid size
  }, [activeTab, allProducts]);

  const isLoading = featuredLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f9f9f9]">
        <div className="text-sm font-semibold tracking-widest animate-pulse">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <HeroSlider products={featuredDeals} />

      <div className="container mx-auto py-16 px-4 md:px-16">

        {/* Minimalist Filter Navigation */}
        <div className="flex flex-wrap items-center justify-between mb-12 border-b border-white pb-4">
          <div className="flex flex-wrap gap-8 text-xs font-semibold tracking-widest text-[#888]">
            <button
              className={`hover:text-black uppercase ${activeTab === 'all' ? 'text-black' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              ALL
            </button>
            <button
              className={`hover:text-black uppercase ${activeTab === 'home-decor' ? 'text-black' : ''}`}
              onClick={() => setActiveTab('home-decor')}
            >
              HOME DECOR
            </button>
            <button
              className={`hover:text-black uppercase ${activeTab === 'lighting' ? 'text-black' : ''}`}
              onClick={() => setActiveTab('lighting')}
            >
              LIGHTING
            </button>
            <button
              className={`hover:text-black uppercase ${activeTab === 'decoration' ? 'text-black' : ''}`}
              onClick={() => setActiveTab('decoration')}
            >
              DECORATION
            </button>
            <button
              className={`hover:text-black uppercase ${activeTab === 'vases' ? 'text-black' : ''}`}
              onClick={() => setActiveTab('vases')}
            >
              VASES
            </button>
            <button
              className={`hover:text-black uppercase ${activeTab === 'basics' ? 'text-black' : ''}`}
              onClick={() => setActiveTab('basics')}
            >
              BASICS
            </button>
          </div>

          <div className="text-xs font-semibold tracking-widest text-black flex items-center cursor-pointer mt-4 md:mt-0 group">
            FILTER
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="ml-2 transition-transform group-hover:rotate-180" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        {/* Product Grid */}
        {tabProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {tabProducts.map((product) => (
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
          <div className="py-20 text-center text-[#888] tracking-widest text-sm">NO PRODUCTS FOUND</div>
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
