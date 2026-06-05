'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import type { EcomComponentListResponse } from '@/types';

export default function PromotionalCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery<EcomComponentListResponse>({
    queryKey: ['ecom-components-list', 'BANNER'],
    queryFn: () => axiosInstanceNoAuth.get('/ecom-components/list', {
      params: {
        pageNumber: 1,
        pageSize: 4,
        componentType: 'BANNER',
        storeCode: process.env.NEXT_PUBLIC_STORE_CODE,
        entityCode: process.env.NEXT_PUBLIC_ENTITYCODE
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

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const clientWidth = scrollRef.current.clientWidth;
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  const directionRef = useRef(1);

  // Auto-play functionality for mobile
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;

        // Only auto-scroll if the container is actually scrollable (i.e., on mobile)
        if (scrollWidth > clientWidth) {
          const currentIndex = Math.round(scrollLeft / clientWidth);
          let nextIndex = currentIndex + directionRef.current;

          // Reverse direction at the ends
          if (nextIndex >= banners.length) {
            directionRef.current = -1;
            nextIndex = currentIndex - 1;
          } else if (nextIndex < 0) {
            directionRef.current = 1;
            nextIndex = currentIndex + 1;
          }

          scrollTo(nextIndex);
        }
      }
    }, 4000); // Scroll every 4 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="w-full bg-accent-foreground">
      <section className="w-full px-4 md:px-6 pt-12 pb-6 max-w-[1600px] mx-auto">

        {/* Cards Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide pb-4 md:pb-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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
                {index === 1 ? (
                  <div className="absolute inset-0 w-full h-full bg-[#A45025] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop"
                      alt="Party Jollof"
                      className="absolute -inset-[25%] w-[150%] h-[150%] max-w-none object-cover opacity-60 mix-blend-overlay group-hover:animate-[spin_15s_linear_infinite] transition-transform duration-700"
                    />
                  </div>
                ) : banner.image1 && (
                  <Image
                    src={banner.image1}
                    alt={banner.title || 'Promotion'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                )}

                {/* Special Overlay for the Second Card (Food Website Design) */}
                {index === 1 && (
                  <>
                    {/* Darker gradient specifically for the second card so white text pops out perfectly */}
                    <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 pb-16 pointer-events-none z-10">
                      <div className="mb-2">
                        {/* Flame Icon */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md text-white">
                          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                        </svg>
                      </div>
                      <p className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] mb-2 drop-shadow-md uppercase text-white/90">
                        Weekend Special
                      </p>
                      <h3 className="text-[40px] md:text-[46px] leading-[1.05] font-black tracking-tight drop-shadow-lg mb-3">
                        Party<br />Jollof
                      </h3>
                      <p className="text-[12px] md:text-[13px] font-medium px-4 drop-shadow-md max-w-[280px] text-white/90">
                        15% off on party jollof days.
                      </p>
                    </div>
                  </>
                )}

                {/* Subtle gradient overlay to ensure text/button visibility */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${index === 1 ? 'hidden' : ''}`} />

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] z-20">
                  <Link href={banner.link || "/shop"}>
                    <button className="w-full bg-white text-gray-900 py-4 rounded-full font-extrabold text-[14px] md:text-[15px] shadow-xl hover:bg-accent3 hover:text-white transition-all duration-300">
                      {index === 1 ? 'Order Now' : (banner.title || 'Shop Now')}
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
