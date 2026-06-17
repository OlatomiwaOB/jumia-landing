'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '@/types';

interface FeaturedProductsSliderProps {
  categories?: Category[];
}

export default function FeaturedProductsSlider({ categories = [] }: FeaturedProductsSliderProps) {
  const envBgColor = process.env.NEXT_PUBLIC_ACCENT_COLOR_3;
  const bgColor = envBgColor ? (envBgColor.startsWith('#') ? envBgColor : `#${envBgColor}`) : '#2F3E33';

  const envTextColor = process.env.NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR;
  const textColor = envTextColor ? (envTextColor.startsWith('#') ? envTextColor : `#${envTextColor}`) : '#FFFDF5';

  const envAccentColor = process.env.NEXT_PUBLIC_ACCENT_COLOR;
  const accentColor = envAccentColor ? (envAccentColor.startsWith('#') ? envAccentColor : `#${envAccentColor}`) : '#A0522D';

  const envAccentColor2 = process.env.NEXT_PUBLIC_ACCENT_COLOR_2;
  const accentColor2 = envAccentColor2 ? (envAccentColor2.startsWith('#') ? envAccentColor2 : `#${envAccentColor2}`) : '#967BB6';

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && scrollRef.current) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: 450, behavior: 'smooth' });
          }
        }
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  if (!categories || categories.length === 0) {
    return null;
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="w-full py-4 sm:py-8 relative group overflow-hidden"
      style={{ backgroundColor: bgColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation Arrows */}
      <button
        onClick={scrollLeft}
        className="hidden sm:flex absolute left-2 sm:left-8 lg:left-12 top-[calc(50%-90px)] sm:top-[calc(50%-100px)] z-10 w-8 sm:w-10 h-[180px] sm:h-[200px] bg-black/20 hover:bg-black/40 border border-white/10 items-center justify-center transition-all duration-300 shadow-none"
        style={{ color: textColor }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = textColor;
          e.currentTarget.style.color = bgColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '';
          e.currentTarget.style.color = textColor;
        }}
        aria-label="Scroll left"
      >
        <ChevronLeft size={32} strokeWidth={3} />
      </button>

      <button
        onClick={scrollRight}
        className="hidden sm:flex absolute right-2 sm:right-8 lg:right-12 top-[calc(50%-90px)] sm:top-[calc(50%-100px)] z-10 w-8 sm:w-10 h-[180px] sm:h-[200px] bg-black/20 hover:bg-black/40 border border-white/10 items-center justify-center transition-all duration-300 shadow-none"
        style={{ color: textColor }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = textColor;
          e.currentTarget.style.color = bgColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '';
          e.currentTarget.style.color = textColor;
        }}
        aria-label="Scroll right"
      >
        <ChevronRight size={32} strokeWidth={3} />
      </button>

      {/* Scrolling Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        <style dangerouslySetInnerHTML={{ __html: `.hide-scrollbar::-webkit-scrollbar { display: none; }` }} />

        {categories.map((category, index) => (
          <div
            key={category.id || index}
            className="w-full sm:w-[400px] lg:w-[450px] flex-shrink-0 snap-center"
          >
            <div className="flex flex-col sm:flex-row w-full h-full items-center">
              {/* Image Box */}
              <div className="w-full sm:w-1/2 h-[220px] sm:h-[160px] relative">
                <div className="w-full h-full relative">
                  <Image
                    src={category.logo || '/product-placeholder-borderless.svg'}
                    alt={category.name || 'Category'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 250px"
                  />
                </div>
              </div>

              {/* Text Box */}
              <div className="w-full sm:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                <h3
                  className="text-[16px] sm:text-[16px] font-serif tracking-wide uppercase mb-3"
                  style={{ color: textColor }}
                >
                  {category.name}
                </h3>

                <p
                  className="text-[13px] sm:text-[12px] leading-relaxed mb-6 line-clamp-3 font-light"
                  style={{ color: textColor, opacity: 0.7 }}
                >
                  {category.description || `Enjoy more of our African meals like ${category.name?.toLowerCase() || 'items'} curated just for you.`}
                </p>

                <div className="mt-auto">
                  <Link
                    href={`/shop?category=${category.code}`}
                    className="inline-block font-bold text-[13px] lg:text-[12px] hover:opacity-80 transition-opacity border-b-2 pb-0.5"
                    style={{ color: accentColor, borderColor: accentColor }}
                  >
                    View Shop
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
