'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import type { EcomComponentListResponse } from '@/types';

export default function PromotionalCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery<EcomComponentListResponse>({
    queryKey: ['ecom-components-list', 'BANNER'],
    queryFn: () => axiosInstance.get('/ecom-components/list', {
      params: {
        pageNumber: 1,
        pageSize: 4,
        componentType: 'BANNER',
        storeCode: process.env.NEXT_PUBLIC_STORE_CODE
      }
    }).then(res => res.data),
  });

  const banners = data?.data || [];

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    setActiveIndex(index);
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: index * (width + 16), // 16px is the gap
      behavior: 'smooth'
    });
  };

  return (
    <div className="w-full bg-accent-foreground">
      <section className="w-full px-4 md:px-6 pt-12 pb-6 max-w-[1600px] mx-auto">

        {/* Cards Container */}
        <div
          ref={scrollRef}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-hidden pb-4 md:pb-0"
        >
          {isLoading ? (
            // Skeleton Loading State
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="relative aspect-[3/4] rounded-[32px] overflow-hidden bg-gray-200/20 animate-pulse min-w-full md:min-w-0 snap-center shrink-0">
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-14 bg-white/50 rounded-full" />
              </div>
            ))
          ) : error || banners.length === 0 ? (
            // Fallback or Empty State
            <div className="col-span-4 text-center py-20 text-gray-500 font-medium">
              No promotions available at the moment.
            </div>
          ) : (
            // Dynamic Banners
            banners.map((banner, index) => (
              <div key={banner.id || index} className="relative aspect-[3/4] rounded-[32px] overflow-hidden group min-w-full md:min-w-0 snap-center shrink-0 bg-gray-100/10">
                {banner.image1 && (
                  <Image
                    src={banner.image1}
                    alt={banner.title || 'Promotion'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                )}
                {/* Subtle gradient overlay to ensure text/button visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%]">
                  <Link href={banner.link || "/shop"}>
                    <button className="w-full bg-white text-gray-900 py-4 rounded-full font-extrabold text-[15px] shadow-xl hover:bg-accent3 hover:text-white transition-all duration-300">
                      {banner.title || 'Shop Now'}
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Mobile Pagination Dots */}
        {!isLoading && banners.length > 0 && (
          <div className="md:hidden flex items-center justify-center gap-2 mt-4 pb-2 h-6">
            {banners.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => scrollTo(dotIndex)}
                className="flex items-center justify-center w-6 h-6"
                aria-label={`Go to slide ${dotIndex + 1}`}
              >
                {activeIndex === dotIndex ? (
                  <div className="w-6 h-6 rounded-full border border-accent flex items-center justify-center">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                  </div>
                ) : (
                  <div className="w-2 h-2 bg-gray-400 rounded-full hover:bg-gray-500 transition-colors" />
                )}
              </button>
            ))}
          </div>
        )}

      </section>
    </div>
  );
}
