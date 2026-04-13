'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import HeroSlider from "./components/hero-slider";
import { ProductCard } from "./components/products-card";
import { ProductProps } from '@/types';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import ProductDetailsModal from './components/product-details-modal';
import { useCategories } from '@/hooks/useCategories';
import { getCategoryHref } from '@/utils/product-route';

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
    <div className="bg-white min-h-screen">
      <HeroSlider products={featuredDeals} storeCode={storeCode} />

      <div className="container mx-auto py-16 px-4 md:px-16">
        <section className="mb-20">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.35em] text-accent uppercase">
                Shop by category
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-black">
                Explore the catalog
              </h2>
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {categories.slice(0, 12).map((category) => (
                <button
                  key={category.code}
                  type="button"
                  className="cursor-pointer group rounded-lg border border-black/8 bg-white px-5 py-6 text-left transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground"
                  onClick={() => router.push(getCategoryHref(category.code || '', storeCode))}
                >
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <Image
                      src={category.logo || 'placeholder-category.png'}
                      alt={category.name || 'Category'}
                      fill
                      className="object-contain bg-white rounded-full p-2"
                    />
                  </div>
                  <span className="mt-3 text-xs block text-center font-semibold tracking-wide text-black transition-colors group-hover:text-accent-foreground">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-black/10 px-6 py-10 text-sm text-[#777]">
              Categories will appear here as soon as they are available.
            </div>
          )}
        </section>

        <section>
          <div className="mb-10 flex flex-col gap-4 border-t border-black/8 pt-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.35em] text-accent uppercase">
                Featured selection
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-black">
                Products worth a closer look
              </h2>
            </div>
          </div>

          {showcaseProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
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
