'use client';

import { useState, useEffect } from 'react';
import { ProductProps } from '@/types';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useCategories } from '@/hooks/useCategories';
import Loader from '@/components/ui/loader';

import HeroSplash from './components/ui/hero-splash';
import FeaturedProductsSlider from './components/ui/featured-products';
import Testimonials from './components/ui/testimonials';
import TopDeals from './components/ui/top-deals';

import FaqSection from './components/ui/faq-section';
import WhyChooseUs from './components/ui/why-choose-us';

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [featuredDeals, setFeaturedDeals] = useState<ProductProps[]>([]);
  const searchParams = useSearchParams();
  const storeCode = searchParams
    ? searchParams.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE || ''
    : process.env.NEXT_PUBLIC_STORE_CODE || '';

  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE;
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

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
          pageSize: 50
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
    <div className="w-full">
      {/* Cinematic Hero Splash */}
      <HeroSplash products={allProducts} />

      {/* Featured Categories Slider (Replaced Featured Products) */}
      <FeaturedProductsSlider categories={categories} />

      {/* Customer Testimonials Section */}
      <Testimonials />

      {/* Top Deals Of The Day Section */}
      <TopDeals products={featuredDeals} />

      {/* FAQ Section */}
      <FaqSection />

      {/* Why Choose Us Section */}
      <WhyChooseUs />
    </div>
  )
}
