'use client';

import { getClientIdentifiers } from '@/config/client-config';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import HeroSlider from "./components/utils/hero-slider";
import CatalogBrowser from "./components/utils/catalog-browser";
import FeaturedCollection from "./components/utils/featured-collection";
import FeatureHighlights from "./components/utils/feature-highlights";
import FaqSection from "./components/utils/faq-section";
import NewsletterSection from "./components/utils/newsletter-section";
import ScrollingTicker from "./components/utils/scrolling-ticker";
import FeaturesGrid from "./components/utils/features-grid";

import { ProductProps } from '@/types';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import ProductDetailsModal from './components/utils/product-details-modal';
import { useCategories } from '@/hooks/useCategories';
import { getCategoryHref } from '@/utils/product-route';

export default function ElectroHome() {
  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [featuredDeals, setFeaturedDeals] = useState<ProductProps[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const storeCode = searchParams
    ? searchParams.get('storeCode') || getClientIdentifiers().storeCode
    : getClientIdentifiers().storeCode;
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const entityCode = getClientIdentifiers().entityCode;
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

  const showcaseProducts = allProducts.slice(0, 12);
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
    <div className="bg-[#1c1c1c] min-h-screen">
      <HeroSlider products={featuredDeals} storeCode={storeCode} />

      <CatalogBrowser categories={categories} storeCode={storeCode} />
      
      <FeaturedCollection />
      
      <FeatureHighlights />
      
      <FaqSection />
      
      <NewsletterSection />
      
      <ScrollingTicker />
      
      <FeaturesGrid />


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
