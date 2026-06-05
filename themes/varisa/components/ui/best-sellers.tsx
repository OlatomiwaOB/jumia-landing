'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import VarisaProductCard from './product-card';
import { ProductProps } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BestSellersProps {
  products?: ProductProps[];
}

export default function BestSellers({ products = [] }: BestSellersProps) {
  const bannerProducts = products.filter(p => p.banner === true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentDesktopSlide, setCurrentDesktopSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxDesktopSlide = Math.max(0, bannerProducts.length - 4);

  const goToPrevDesktop = useCallback(() => {
    setCurrentDesktopSlide((p) => Math.max(0, p - 1));
  }, []);

  const goToNextDesktop = useCallback(() => {
    setCurrentDesktopSlide((p) => Math.min(maxDesktopSlide, p + 1));
  }, [maxDesktopSlide]);

  const goToPrev = useCallback(() => {
    setCurrentSlide((p) => Math.max(0, p - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((p) => Math.min(bannerProducts.length - 1, p + 1));
  }, [bannerProducts.length]);

  const goToDesktop = useCallback((i: number) => {
    setCurrentDesktopSlide(Math.min(i, maxDesktopSlide));
  }, [maxDesktopSlide]);

  // Auto-scroll
  useEffect(() => {
    if (isPaused || bannerProducts.length <= 1) return;
    autoScrollRef.current = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % bannerProducts.length);
      setCurrentDesktopSlide((p) => {
        const next = p + 1;
        return next > maxDesktopSlide ? 0 : next;
      });
    }, 4000);
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [isPaused, bannerProducts.length, maxDesktopSlide]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    pause();
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) goToNext();
    else if (diff < -40) goToPrev();
    touchStartX.current = null;
    resume();
  };

  const visibleDots = Math.min(bannerProducts.length, 4);

  return (
    <section className="w-full bg-accent-foreground">
      <div className="px-4 md:px-8 pt-6 pb-16 md:py-20 max-w-[1500px] mx-auto">
        <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#111] leading-none pb-4 text-center lg:text-left mb-10">Best Products</h2>

        {bannerProducts.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl text-gray-300">🍽️</span>
            </div>
            <p className="text-gray-400 font-medium text-[15px]">
              No banner products available right now. Check back later!
            </p>
          </div>
        ) : (
          <>
            {/* ── DESKTOP CAROUSEL ── */}
            <div
              className="hidden sm:block relative w-full group/desktop-carousel px-1"
              onMouseEnter={pause}
              onMouseLeave={resume}
            >
              <div className="overflow-hidden -mx-3">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentDesktopSlide * 25}%)` }}
                >
                  {bannerProducts.map((product) => (
                    <div key={product.id || product.code} className="w-1/4 flex-shrink-0 px-3 pb-8 pt-4">
                      <VarisaProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>

              {bannerProducts.length > 4 && (
                <>
                  <button
                    onClick={() => { goToPrevDesktop(); pause(); setTimeout(resume, 5000); }}
                    disabled={currentDesktopSlide === 0}
                    className={`absolute top-[40%] -translate-y-1/2 -left-6 w-12 h-12 bg-white text-gray-900 border border-gray-100 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 z-10 opacity-0 group-hover/desktop-carousel:opacity-100 ${currentDesktopSlide === 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-accent hover:border-accent hover:text-accent-foreground cursor-pointer'}`}
                  >
                    <ChevronLeft size={24} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => { goToNextDesktop(); pause(); setTimeout(resume, 5000); }}
                    disabled={currentDesktopSlide === maxDesktopSlide}
                    className={`absolute top-[40%] -translate-y-1/2 -right-6 w-12 h-12 bg-white text-gray-900 border border-gray-100 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 z-10 opacity-0 group-hover/desktop-carousel:opacity-100 ${currentDesktopSlide === maxDesktopSlide ? 'cursor-not-allowed opacity-50' : 'hover:bg-accent hover:border-accent hover:text-accent-foreground cursor-pointer'}`}
                  >
                    <ChevronRight size={24} strokeWidth={2.5} />
                  </button>
                </>
              )}

              {/* Desktop dots */}
              {bannerProducts.length > 4 && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  {Array.from({ length: Math.min(maxDesktopSlide + 1, 4) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { goToDesktop(i); pause(); setTimeout(resume, 5000); }}
                      className="flex items-center justify-center w-4 h-4"
                    >
                      {i === currentDesktopSlide ? (
                        <div className="w-3 h-3 rounded-full border border-accent flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                        </div>
                      ) : (
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full hover:bg-gray-500 transition-colors" />
                      )}
                    </button>
                  ))}
                  {bannerProducts.length > 8 && (
                    <span className="text-xs text-gray-400 ml-1">
                      {currentDesktopSlide + 1}/{maxDesktopSlide + 1}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* ── MOBILE: one-at-a-time carousel ── */}
            <div className="sm:hidden">
              <div
                className="relative overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {bannerProducts.map((product) => (
                    <div
                      key={product.id || product.code}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <VarisaProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2.5 mt-6 h-6 px-4">
                {Array.from({ length: visibleDots }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentSlide(i); pause(); setTimeout(resume, 5000); }}
                    className="flex items-center justify-center w-6 h-6 pointer-events-auto"
                  >
                    {i === currentSlide ? (
                      <div className="w-6 h-6 rounded-full border border-accent flex items-center justify-center">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                      </div>
                    ) : (
                      <div className="w-2 h-2 bg-gray-400 rounded-full hover:bg-gray-500 transition-colors" />
                    )}
                  </button>
                ))}
                {bannerProducts.length > 4 && (
                  <span className="text-xs text-gray-400 ml-1">
                    {currentSlide + 1}/{bannerProducts.length}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}


