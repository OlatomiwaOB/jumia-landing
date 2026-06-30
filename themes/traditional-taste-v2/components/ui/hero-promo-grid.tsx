'use client';

import { getClientIdentifiers } from '@/config/client-config';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from "@tanstack/react-query";
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { useSearchParams } from "next/navigation";
import { ProductProps } from '@/types';

export default function HeroPromoGrid() {
  const searchParams = useSearchParams();
  const storeCode = searchParams?.get('storeCode') || getClientIdentifiers().storeCode;
  const entityCode = getClientIdentifiers().entityCode;

  const { data: allProductsData } = useQuery({
    queryKey: ["hero-promo-products", storeCode],
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
          pageSize: 10
        }
      }).then(response => response.data)
    }
  });

  const endpointProducts = allProductsData?.products || [];
  const bannerProducts = endpointProducts.filter((p: ProductProps) => p.banner === true);
  const sourceProducts = bannerProducts.length >= 4 ? bannerProducts : endpointProducts;

  const p1 = sourceProducts[1] || sourceProducts[0] || {};
  const p2 = sourceProducts[1] || {};
  const p3 = sourceProducts[2] || {};
  // Always search ALL products for Bitterleaf by name
  const p4 = endpointProducts.find((p: ProductProps) =>
    p.name?.toLowerCase().includes('bitterleaf')
  ) || sourceProducts[3] || {};

  return (
    <section className="relative w-full h-[75vh] min-h-[550px] max-h-[850px] flex items-center justify-start overflow-hidden bg-[var(--color-bg-main)] animate-in fade-in duration-700">

      {/* Background Image */}
      <Image
        src="/images/nigerian_food_feast.png"
        alt="Nigerian Food Feast Hero Banner"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Subtle Gradient for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent z-0 w-full md:w-2/3" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl flex flex-col items-center md:items-start text-center md:text-left gap-5 mx-auto md:mx-0">

          <h1 className="text-white text-4xl md:text-5xl lg:text-[68px] font-serif italic tracking-wide leading-[1.1] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] uppercase">
            WELCOME TO<br />
            <span className="font-extrabold not-italic text-[var(--color-primary)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              TRADITIONAL TASTE
            </span>
          </h1>

          <p className="text-white text-base md:text-lg lg:text-xl font-medium tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] max-w-xl mt-3 mb-6">
            We are so happy you're here! Get ready to indulge in the most delicious, heartwarming meals crafted just for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            <Link
              href="/shop"
              className="bg-[var(--color-primary)] hover:bg-[#1C1917] hover:text-white text-white font-bold py-4 px-12 rounded-sm text-[15px] uppercase tracking-wider transition-all duration-300 w-full sm:w-max text-center"
            >
              Shop Now
            </Link>

          </div>

        </div>
      </div>

    </section>
  );
}
