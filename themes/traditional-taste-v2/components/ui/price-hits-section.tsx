'use client';


import { getClientIdentifiers } from '@/config/client-config';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard, { Product } from './product-card';

import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, CurrencyCode } from '@/utils/helperfns';
import { useQuery } from "@tanstack/react-query";
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { useSearchParams } from "next/navigation";
import { ProductProps } from '@/types';

export default function PriceHitsSection() {
  const searchParams = useSearchParams();
  const storeCode = searchParams?.get('storeCode') || getClientIdentifiers().storeCode;
  const entityCode = getClientIdentifiers().entityCode;

  const { data: allProductsData, isLoading } = useQuery({
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

  const endpointProducts = allProductsData?.products || [];
  const bannerProducts = endpointProducts.filter((p: ProductProps) => p.banner === true);
  // Fallback to all products if no banner products are set
  const sourceProducts = bannerProducts.length > 0 ? bannerProducts : endpointProducts;

  const displayProducts: Product[] = sourceProducts
    .filter((p: ProductProps) => !!p.picture)
    .map((p: ProductProps, i: number) => ({
      id: p.id || i,
      vendor: p.storeName || 'Restaurant',
      title: p.name || 'Unknown',
      price: p.salePrice ? formatPrice(p.salePrice, (p.ccy as CurrencyCode) || 'GBP') : formatPrice(0, (p.ccy as CurrencyCode) || 'GBP'),
      originalPrice: p.oldPrice ? formatPrice(p.oldPrice, (p.ccy as CurrencyCode) || 'GBP') : null,
      discount: p.discount ? `-${p.discount}%` : null,
      image: p.picture,
      badges: [],
      stock: (p.qtyInStore ?? 1) > 0,
      offer: null
    }));

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Scroll by the full visible width + the gap to snap perfectly to the next set
      const scrollAmount = direction === 'left' ? -(container.clientWidth + 16) : (container.clientWidth + 16);
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 6,
    minutes: 49,
    seconds: 36
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              } else {
                clearInterval(timer);
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let autoPlayInterval: NodeJS.Timeout;

    autoPlayInterval = setInterval(() => {
      if (typeof window !== 'undefined' && scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 6000);

    return () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    };
  }, []);

  return (
    <section className="w-full px-0 md:px-4 lg:px-10 pt-2 pb-8 md:py-8 max-w-[1640px] mx-auto bg-[var(--color-bg-main)]">
      <div className="w-full bg-[var(--color-bg-secondary)] rounded-none md:rounded-[40px] pt-6 md:pt-10 pb-8 px-4 md:px-6 lg:px-12 relative overflow-hidden shadow-sm">
        {/* Background SVG wave pattern placeholder (Optional faint overlay) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-10">

          {/* Header */}
          <div className="flex flex-col items-center md:items-end md:flex-row justify-between mb-6 md:mb-8 gap-4 md:gap-4">
            <h2 className="text-[#1C1917] dark:text-white text-2xl md:text-[40px] font-bold tracking-tight text-center md:text-left">Price hits of the week</h2>

            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
              <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3">
                <span className="text-[#1C1917] dark:text-white font-medium text-[13px] md:text-base text-center">Gone in 24 Hours</span>
                <div className="flex items-center gap-1.5">
                  <div className="bg-[var(--color-primary)] text-white font-bold text-sm md:text-lg px-2 md:px-3 py-1 md:py-1.5 rounded md:rounded-md min-w-[36px] md:min-w-[48px] text-center">{timeLeft.days}</div>
                  <span className="text-[var(--color-primary)] md:text-[#1C1917] dark:md:text-white font-bold">:</span>
                  <div className="bg-[var(--color-primary)] text-white font-bold text-sm md:text-lg px-2 md:px-3 py-1 md:py-1.5 rounded md:rounded-md min-w-[32px] md:min-w-[40px] text-center">{timeLeft.hours}</div>
                  <span className="text-[var(--color-primary)] md:text-[#1C1917] dark:md:text-white font-bold">:</span>
                  <div className="bg-[var(--color-primary)] text-white font-bold text-sm md:text-lg px-2 md:px-3 py-1 md:py-1.5 rounded md:rounded-md min-w-[32px] md:min-w-[40px] text-center">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <span className="text-[var(--color-primary)] md:text-[#1C1917] dark:md:text-white font-bold">:</span>
                  <div className="bg-[var(--color-primary)] text-white font-bold text-sm md:text-lg px-2 md:px-3 py-1 md:py-1.5 rounded md:rounded-md min-w-[32px] md:min-w-[40px] text-center">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="py-12 text-center text-[var(--color-text)] opacity-60">
              No products available right now.
            </div>
          ) : (
            <div className="relative group/carousel">
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {displayProducts.map((product) => (
                  <div key={product.id} className="w-full sm:w-[calc(50%-8px)] md:w-[calc(25%-12px)] lg:w-[calc(16.666%-13.33px)] shrink-0 snap-start h-[310px] sm:h-[340px] md:h-auto">
                    <ProductCard product={product} isGrid={true} />
                  </div>
                ))}
              </div>

              {/* Desktop Carousel Arrows */}
              <button onClick={() => scroll('left')} className="absolute left-[-20px] top-[40%] -translate-y-1/2 w-12 h-12 bg-[var(--color-bg-main)] text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white rounded-full flex items-center justify-center shadow-md z-10 hidden md:flex transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 pointer-events-none group-hover/carousel:pointer-events-auto">
                <ChevronLeft size={24} />
              </button>
              <button onClick={() => scroll('right')} className="absolute right-[-20px] top-[40%] -translate-y-1/2 w-12 h-12 bg-[var(--color-bg-main)] text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white rounded-full flex items-center justify-center shadow-md z-10 hidden md:flex transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 pointer-events-none group-hover/carousel:pointer-events-auto">
                <ChevronRight size={24} />
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
