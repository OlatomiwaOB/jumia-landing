'use client';
import { useState, useEffect } from 'react';
import HeroSlider from "@/components/home/hero-slider";
import TestimonialSlider from "@/components/home/testimonial-slider";
import { ProductCard } from "@/utils/products-card";
import { ProductProps } from '@/types';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import ProductDetailsModal from '@/utils/product-details';
import Image from 'next/image';


type TabType = 'new-arrivals' | 'ongoing-offers' | 'featured-products' | 'best-sellers';

export default function HomeFortitude() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductProps[]>([]);
  const [dealsOfTheWeek, setDealsOfTheWeek] = useState<ProductProps[]>([]);
  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [allBestSeller, setAllBestSeller] = useState<ProductProps[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('new-arrivals');
  const [tabProducts, setTabProducts] = useState<ProductProps[]>([]);
  const [featuredDeals, setFeaturedDeals] = useState<ProductProps[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams ? searchParams.get('category') || '' : '';
  const storeCode = searchParams ? searchParams.get('storeCode') || '' : '';
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE

  // useEffect(() => {
  //   if (!searchParams?.get('storeCode')) {
  //     router.push(`?storeCode=STO0715`);
  //   }
  // }, [router, searchParams]);

  const { data: featuredProductsData, isLoading: featuredProductsLoading } = useQuery({
    queryKey: ["featured-deals-products", storeCode],
    queryFn: () => {
      return axiosInstanceNoAuth.request({
        method: "GET",
        url: '/ecommerce/products/list',
        params: {
          name: '',
          storeCode: storeCode,
          entityCode: entityCode,
          category: '',
          tag: '',
          pageNumber: 1,
          pageSize: 100
        }
      }).then(response => response.data)
    },
    refetchInterval: 30000,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["featured-products", selectedCategory, storeCode],
    queryFn: () => {
      return axiosInstanceNoAuth.request({
        method: "GET",
        url: '/ecommerce/products/list',
        params: {
          name: '',
          storeCode: storeCode,
          entityCode: entityCode,
          category: selectedCategory,
          tag: '',
          pageNumber: 1,
          pageSize: 12
        }
      }).then(response => response.data)
    }
  });

  const { data: allProductsData, isLoading: allProductsLoading } = useQuery({
    queryKey: ["all-products", storeCode],
    queryFn: () => {
      return axiosInstanceNoAuth.request({
        method: "GET",
        url: '/ecommerce/products/list',
        params: {
          name: '',
          storeCode: storeCode,
          entityCode: entityCode,
          category: '',
          tag: '',
          pageNumber: 1,
          pageSize: 100
        }
      }).then(response => response.data)
    }
  });

  const { data: allBestSellerData, isLoading: allBestSellerLoading } = useQuery({
    queryKey: ["all-best-products", storeCode],
    queryFn: () => {
      return axiosInstanceNoAuth.request({
        method: "GET",
        url: '/ecommerce/products/best-selling',
        params: {
          name: '',
          storeCode: storeCode,
          entityCode: entityCode,
          category: '',
          tag: '',
          pageNumber: 1,
          pageSize: 100
        }
      }).then(response => response.data)
    }
  });

  useEffect(() => {
    if (data?.products) {
      setFeaturedProducts(data.products.slice(0, 12));
    }
  }, [data]);

  useEffect(() => {
    if (allProductsData?.products) {
      const onSaleProducts = allProductsData.products.filter(
        (product: ProductProps) => product.onSale === true
      );
      setDealsOfTheWeek(onSaleProducts.slice(0, 4));
    }
  }, [allProductsData]);

  useEffect(() => {
    if (allProductsData?.products) {
      setAllProducts(allProductsData.products);
    }
  }, [allProductsData]);

  useEffect(() => {
    if (allBestSellerData?.products) {
      setAllBestSeller(allBestSellerData.products);
    }
  }, [allBestSellerData]);

  useEffect(() => {
    if (featuredProductsData?.products) {
      const featuredProducts = featuredProductsData.products.filter(
        (product: ProductProps) => product.featured === true
      );

      const initialRandomDeals = featuredProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      setFeaturedDeals(initialRandomDeals);

      const interval = setInterval(() => {
        const randomDeals = featuredProducts
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);
        setFeaturedDeals(randomDeals);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [featuredProductsData]);

  useEffect(() => {
    if (!allProducts.length) return;

    let filteredProducts: ProductProps[] = [];

    switch (activeTab) {
      case 'new-arrivals':
        filteredProducts = [...allProducts].reverse().slice(0, 8);
        break;
      case 'ongoing-offers':
        filteredProducts = allProducts.filter(
          (product: ProductProps) => product.onSale === true
        ).slice(0, 8);
        break;
      case 'featured-products':
        filteredProducts = allProducts.filter(
          (product: ProductProps) => product.featured === true
        ).slice(0, 8);
        break;
      case 'best-sellers':
        filteredProducts = allBestSeller.slice(0, 8);
        break;
      default:
        filteredProducts = allProducts.slice(0, 8);
    }

    setTabProducts(filteredProducts);
  }, [activeTab, allProducts]);

  const deals = featuredDeals.map((product, index) => ({
    title: product.name || "Featured Product",
    description: product.description || "Lorem ipsum dolor sit amet consectetur. Adipiscing id odio at dis morbi turpis.",
    cta: "Buy Now →",
    image: product.picture || "/placeholder-image.png",
    product: product
  }));

  const CategoryFilterIndicator = () => {
    if (!selectedCategory) return null;

    return (
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtered by:</span>
          <span className="px-3 py-1 bg-[#d8480b] text-white text-sm rounded-full">
            {selectedCategory}
          </span>
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams?.toString() || '');
              params.delete('category');
              router.push(`?${params.toString()}`);
            }}
            className="text-sm text-gray-500 hover:text-[#d8480b] ml-2"
          >
            Clear filter
          </button>
        </div>
      </div>
    );
  };

  const handleDealClick = (product: ProductProps) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 animate-pulse">
              <div className="h-6 w-16 bg-gray-200 rounded-full mb-4"></div>
              <div className="w-full h-48 bg-gray-200 mb-4 rounded-md"></div>
              <div className="h-6 bg-gray-200 mb-2 rounded"></div>
              <div className="h-6 bg-gray-200 mb-4 rounded"></div>
              <div className="h-10 bg-gray-200 rounded-3xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 mt-10 text-center">
        <p className="text-red-500">Error loading products. Please try again later.</p>
      </div>
    );
  }

  return (
    <><div className="container mx-auto py-12 px-4 md:px-6">
      <HeroSlider />

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Delivery Card */}
            <div className="bg-[#ffffff] p-6 rounded-xl shadow-md flex items-start gap-4 max-w-md">
              <div className="">
                <svg width="46" height="46" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <rect width="75" height="75" transform="translate(0.333313 0.409912)" fill="url(#pattern0_1410_31698)" />
                  <defs>
                    <pattern id="pattern0_1410_31698" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlinkHref="#image0_1410_31698" transform="scale(0.0104167)" />
                    </pattern>
                    <image id="image0_1410_31698" width="96" height="96" preserveAspectRatio="none" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAcDSURBVHgB7ZxNUttYEMe7Jc2EqeAa3yBmPQNxToA5QWATU9lATgA5AfYJAicIbCZhNjEnwDkBDsys49zAVZCaUJHU060vf8S2ZCxZttO/qkSftmS99/p1/7sFgKIoiqIoiqIoiqIoiqIoiqIoiqIoiqIoyjKCkBKr5d0Kf1kJlgQToNlpvW9DxqTSAKvr1UteVGDJIITXX6/PjyFDpm6AwvruPgG9heWkY5n3a51WowMZYcGUcC8pAQUbSC0kowULDneobV4U/X8rspzfBujHuLi9eV+DBaewXq2Q3wCZY4CSK9oAOaMNkDOxc0CxvF20nUdHvFoedhyJSt05mPbYJd2M+05yzddf//1r4SfrNIhtAMdZYY+ADkcdp/71EiQIxtBw3vBiC5R4E0QEbUgbgk+geMSOgLt/3jeL5d01205HZiAyOmp+uiSKAwJNpA1K6qQciC0fNs9pbAESnz+pgJeOGLfx4ogliC8cBZ/CEsCR8Gd6oLKLnqXAetJnMXUcIGIcC0I1EeQeb1QP4SdHGk6eRWH9xXaS863H5ZdlA9wyJGRQJ+8V4xBwJvrJLEHEdtJz+cEX+b/gGeAbjqGacUqqhY5zOYnwxDaxw1+cqUQ7T5gGbCW160HQ+llWZSTY7opYhNq4z4gJmrTXhhKtMoB0SrYI9WgH0YE0yrjPWAi0w+3wHBLjXnRa521QhiIZtMJG9YAD2BJvhjLO61HnW7c3fzd42QAlNcjFVyyMXQabh+zGnowyY6qGZoCoB7xohtu2Mzplqw2QFYT1nq3K6p+7lWGnaQNkhIwCdsvPoh1IR8POm0iKYFvGrhXs9+0k2uxdX93YrUFKICuxixxdm+a3Q56ExcERT6giQevg75lIipgmRH8wiPW769km+nt/p2Xi2jQFWl6HJL/3i0xhmvfPemOoyUxQanV0E1ySFluFtYxvUtjlPfCe4Kx7HCbANHDrBxOUIQTYubt+dwoLjPR21sjq3JHeeDv84Ow4HAU59On5J00TFLK6Ub3iHhVqbsd3N+decKZe0KxwsTcaPnz8x0uvMbQBZsRgcBYUJvTPAeJmOs5wf/WhEGGbL14HxSvH4Qd/FWx6wVlfA9iuV36yD2nCsw/7v0uTLZsGKUZYXa+K7uYnawyo9Jkgyijx7rqLXzGdFhwdX0QbROW+ESBSKg+LFmLyYIuzQBLphem3Rt8FwH/4WobSxTWdFjpBv0d48kMcEEwWieFIj1OS5DcA4qfbazU14/gFzI4d5HDZOhfnqixFskff3d/2kdxNHoWem+ZV5iF+tAw4ncU7W5NQKHPi3cHn3JMrsi33KnIDmXh210rWkeemAThaPLAdqCG4XgqPukWnMsIqfOyIJ7Bjy7yv552P9l5IZI2fnMBU99yrt+rQPgdzrPtgbD55LuKAwtPqWx6OopnE5ZoPbffXy7g8a5YUNl7s8QO+jBMlPd3Hoasw4BpF7g0gRV3Upy+h6OivrO+4xn7zMz9njc3oMGGZJd4PkANSwsNxzWm0A1lk48SL3KfcL69v9eUAuEOx338p8dWo78zVBHn5BYdq0Q7+MewE1AZOEw+qwd5ZrSepUZHCpyCfPTMMx/kQvQuBLC2zONm57jMxsi7FzDXH5VESJea9lOTQcvxcR4DDdj1c58nrdMjDj/COEZyE26yUHsAMkQYPzU708EfYd9nvJea7VEaZzXRHANHv44bbINwzovI91zRP4s63rPsam589CDJMYhJ+ATf1CZnlmGg9LM7lzvI8mm0p/i16cefZaWhC8AK7ba+wDL17Zg/MHWmbIE7B0UPqQztfW/HBmng/LOu2Q1kXHefKhozhCXfwGjwPnCX5KKFxwS51xdtAqomX13ccsD0XXhBO8iI0ZffSdNoYROPvleDj1CNAAiTbwc1J5Ivo+kQl/z4mKI9EKEbFwBMUzk5Lb+EtXzfR/fb/FQHosIcUNQh7fmcyr+WaEetL8rMLFyeDBF7T53Cbs0ozu//e5DrT4GvvxH2m9/chGDu3N+9+8NpyNUGEXVuKSG/jAqzeCjPxmmCWuN1kCrM9qtAqxItvuhNuxzT/aw47L9cGGKwYcJxHV8O8KGkY9igk+KqE+zjMn2mSZzCjxZPqB+/llCGIrCIvrUQ7CE9GySe5J+VH/LmbhiirUhVhkPuUfLm7OzqGB2yZ42UMuwGWD1JL/kgJGizCOfQU/IRWdK8SM9xen6+N+s65qIoYiHLHk9PDDxnaCKPgxrEMY2dczDA3ZSn+BAs8Eqgy/AzWgwjqk+YrssDPnYO8F7c39ATRiFw8SdJR5q4uSH7cdxe30XVLsk2G0UaXWvPw4AfxG8Itc8BVZjX3CbudX2SytqxvrZ/lFS5FURRFURRFURRFURRFURRFURRFURRFmVv+B7BQFgg1MFMnAAAAAElFTkSuQmCC" />
                  </defs>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Delivery from 30 min</h3>
                <p className="text-gray-600 text-sm">
                  Get your orders delivered quickly and reliably, right to your doorstep. Enjoy fast delivery starting from just 30 minutes.
                </p>
              </div>
            </div>

            {/* Quality Assurance Card */}
            <div className="bg-[#ffffff] p-6 rounded-xl shadow-md flex items-start gap-4 max-w-md">
              <div className="">
                <svg width="46" height="46" viewBox="0 0 75 76" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <rect width="75" height="75" transform="translate(0 0.409912)" fill="url(#pattern0_1410_31718)" />
                  <defs>
                    <pattern id="pattern0_1410_31718" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlinkHref="#image0_1410_31718" transform="scale(0.0104167)" />
                    </pattern>
                    <image id="image0_1410_31718" width="96" height="96" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
                  </defs>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Quality assurance</h3>
                <p className="text-gray-600 text-sm">
                  Each item is carefully selected and inspected to ensure it meets our high standards before reaching you.
                </p>
              </div>
            </div>

            {/* Secure Payment Card */}
            <div className="bg-[#ffffff] p-6 rounded-xl shadow-md flex items-start gap-4 max-w-md">
              <div className="">
                <svg width="46" height="46" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <rect width="75" height="75" transform="translate(0.666718 0.409912)" fill="url(#pattern0_1410_31720)" />
                  <defs>
                    <pattern id="pattern0_1410_31720" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlinkHref="#image0_1410_31720" transform="scale(0.0104167)" />
                    </pattern>
                    <image id="image0_1410_31720" width="96" height="96" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
                  </defs>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">100% Secure Payment</h3>
                <p className="text-gray-600 text-sm">
                  Shop with confidence knowing that your payment information is protected with advanced security measures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <div className="container mx-auto py-12 px-4">
        <div className="mb-8 py-5 border-b border-[#e7eaee] flex justify-between items-center">
          <h1 className="text-3xl font-bold">Deals of the Week</h1>
          <span
            className="font-semibold text-xs md:text-lg text-[#d8480b] cursor-pointer"
            onClick={() => router.push(`/shop?storeCode=${storeCode || ''}#deals-of-the-week`)}
          >
            View All →
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cs-2 lg:grid-cols-4 gap-6">
          {dealsOfTheWeek.slice(0, 4).map((product) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {deals.map((deal, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
              <div className="md:flex items-center gap-4 relative">
                <div className={`h-[350px] md:w-1/2 p-4 flex items-center justify-center relative overflow-hidden bg-white ${index === 0 ? 'bg-[#727be0] rounded-lg px-5' : 'bg-[#e97a80] rounded-lg -x-5'
                  }`}>
                  <div className={`absolute inset-0 ${index === 0 ? 'bg-[#727be0]' : 'bg-[#e97a80]'
                    }`} style={{
                      clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0% 100%)'
                    }}></div>
                  <Image
                    src={deal.image}
                    alt={'No image available'}
                    width={100}
                    height={100}
                    loading="lazy"
                    className="h-auto max-w-[150px] w-auto overflow-hidden rounded-md relative z-10 text-white"
                  />
                </div>

                <div className="p-6 max-w-sm relative z-20 md:max-w-xs">
                  <h3 className="text-xl font-bold mb-4 text-[#0c2d57]">{deal.title}</h3>
                  <p className="mb-6 text-[#5c728e] text-sm">{deal.description}</p>
                  <button
                    className="text-black font-semibold hover:underline flex items-center gap-1 bg-[#d8480b] text-white py-2 px-4 rounded-3xl transition"
                    onClick={() => handleDealClick(deal.product)}
                  >
                    {deal.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="container mx-auto py-8 px-4 mb-12">
        <div className="mb-8 py-5 border-b border-[#e7eaee] flex justify-between items-center">
          <div className="font-semibold text-xs md:text-lg flex items-center md:gap-4 text-[#5c728e]">
            <span
              className={`cursor-pointer ${activeTab === 'new-arrivals' ? 'text-accent' : ''}`}
              onClick={() => setActiveTab('new-arrivals')}
            >
              New Arrivals
            </span>
            <span
              className={`cursor-pointer ${activeTab === 'ongoing-offers' ? 'text-accent' : ''}`}
              onClick={() => setActiveTab('ongoing-offers')}
            >
              Ongoing Offers
            </span>
            <span
              className={`cursor-pointer ${activeTab === 'featured-products' ? 'text-accent' : ''}`}
              onClick={() => setActiveTab('featured-products')}
            >
              Featured Products
            </span>
            <span
              className={`cursor-pointer ${activeTab === 'best-sellers' ? 'text-accent' : ''}`}
              onClick={() => setActiveTab('best-sellers')}
            >
              Best Sellers
            </span>
          </div>

          <span
            className="font-semibold text-xs md:text-lg text-[#d8480b] cursor-pointer"
            onClick={() => router.push(`/shop?storeCode=${storeCode || ''}&tab=${activeTab}#product-tabs`)}
          >
            View All →
          </span>
        </div>

        <CategoryFilterIndicator />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-30">
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


        <div className="mt-20 mb-30">
          <TestimonialSlider />
        </div>
      </div>

      <ProductDetailsModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        product={selectedProduct}
      />
    </>
  );
}