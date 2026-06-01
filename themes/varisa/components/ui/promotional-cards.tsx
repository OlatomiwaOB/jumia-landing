'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Flame } from 'lucide-react';
import { useState, useRef } from 'react';

export default function PromotionalCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    // Scroll listener is no longer needed since native swipe is disabled
    // But we keep the function body empty to avoid breaking any refs
  };

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
          {/* Card 1: Traditional Soups */}
          <div className="relative h-[480px] rounded-[32px] overflow-hidden group min-w-full md:min-w-0 snap-center shrink-0">
            <Image
              src="/images/mock/varisa_banner_eforiro.png"
              alt="Traditional Soups"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Subtle gradient overlay to ensure text/button visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%]">
              <Link href="/shop">
                <button className="w-full bg-white text-gray-900 py-4 rounded-full font-extrabold text-[15px] shadow-xl hover:bg-accent3 hover:text-white transition-all duration-300">
                  Traditional Soups
                </button>
              </Link>
            </div>
          </div>

          {/* Card 2: Weekend Special */}
          <div className="relative h-[480px] rounded-[32px] overflow-hidden group min-w-full md:min-w-0 snap-center shrink-0">
            <Image
              src="/images/mock/varisa_banner_jollof.png"
              alt="Weekend Special Jollof"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Heavy Red/Sienna Overlay */}
            <div className="absolute inset-0 bg-accent/80 group-hover:bg-accent/90 transition-colors duration-300" />

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 -mt-10 pointer-events-none">
              <Flame size={32} strokeWidth={2} className="mb-4 text-white opacity-90" />
              <span className="text-[13px] font-bold tracking-wider uppercase mb-1">Weekend Special</span>
              <span className="text-[60px] font-black leading-[1.1] mb-2" style={{ letterSpacing: '-0.03em' }}>Party<br/>Jollof</span>
              <span className="text-[13px] font-semibold opacity-90 mt-2">15% off all party size trays.</span>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%]">
              <Link href="/shop">
                <button className="w-full bg-white text-gray-900 py-4 rounded-full font-extrabold text-[15px] shadow-xl hover:bg-accent3 hover:text-white transition-all duration-300">
                  Order Now
                </button>
              </Link>
            </div>
          </div>

          {/* Card 3: Porridge & Sides */}
          <div className="relative h-[480px] rounded-[32px] overflow-hidden group min-w-full md:min-w-0 snap-center shrink-0">
            <Image
              src="/images/mock/varisa_banner_gizdodo.png"
              alt="Porridge and Sides"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%]">
              <Link href="/shop">
                <button className="w-full bg-white text-gray-900 py-4 rounded-full font-extrabold text-[15px] shadow-xl hover:bg-accent3 hover:text-white transition-all duration-300">
                  Porridge & Sides
                </button>
              </Link>
            </div>
          </div>

          {/* Card 4: Peppered Proteins */}
          <div className="relative h-[480px] rounded-[32px] overflow-hidden group min-w-full md:min-w-0 snap-center shrink-0">
            <Image
              src="/images/mock/varisa_banner_turkey.png"
              alt="Peppered Proteins"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%]">
              <Link href="/shop">
                <button className="w-full bg-white text-gray-900 py-4 rounded-full font-extrabold text-[15px] shadow-xl hover:bg-accent3 hover:text-white transition-all duration-300">
                  Peppered Proteins
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Pagination Dots */}
        <div className="md:hidden flex items-center justify-center gap-2 mt-4 pb-2 h-6">
          {[0, 1, 2, 3].map((dotIndex) => (
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

      </section>
    </div>
  );
}
