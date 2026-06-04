'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Calendar, Zap, Truck, ChevronLeft, ChevronRight, Check, CheckCircle2, Eye } from 'lucide-react';
import { useCart } from '@/store/cart';
import ProductCard, { Product } from './product-card';

// Mock Data matching the reference image
const products = [
  {
    id: 1,
    vendor: 'Mama\'s Kitchen',
    title: 'Premium Pounded Yam & Egusi',
    price: '$18.99',
    originalPrice: null,
    discount: null,
    image: '/pounded_yam_egusi.jpg',
    badges: [{ text: 'Highly rated', color: 'bg-[#673AB7] text-white' }, { text: 'Top Choice', color: 'bg-[#F97316] text-white' }],
    stock: true,
    offer: null,
  },
  {
    id: 2,
    vendor: 'Lagos Vibes',
    title: 'Authentic Party Jollof Rice',
    price: '$15.50',
    originalPrice: null,
    discount: null,
    image: '/party-jollof.png',
    badges: [{ text: 'Best Seller', color: 'bg-[#FFEBEE] text-[#D32F2F]' }, { text: 'Spicy', color: 'bg-red-600 text-white' }],
    stock: true,
    offer: null,
  },
  {
    id: 3,
    vendor: 'Suya Spot',
    title: 'Spicy Nigerian Suya (Beef)',
    price: '$12.99',
    originalPrice: null,
    discount: null,
    image: '/suya_transparent.png',
    badges: [{ text: 'Chef\'s Special', color: 'bg-[#FFEB3B] text-black' }],
    stock: true,
    offer: { type: 'flash', text: 'Freshly grilled' },
  },
  {
    id: 4,
    vendor: 'Ibadan Flavors',
    title: 'Classic Amala & Ewedu',
    price: '$16.00',
    originalPrice: '$20.00',
    discount: '-20%',
    image: '/amala_ewedu.png',
    badges: [{ text: 'Deal', color: 'bg-[#FFEB3B] text-black' }, { text: 'Highly rated', color: 'bg-[#673AB7] text-white' }],
    stock: true,
    offer: { type: 'flash', text: 'Up to 20% discount' },
  },
  {
    id: 5,
    vendor: 'Eastern Delights',
    title: 'Traditional Igbo Abacha (African Salad)',
    price: '$14.50',
    originalPrice: null,
    discount: null,
    image: '/igbo_abacha.jpg',
    badges: [{ text: 'Best Buy', color: 'bg-[#FFEBEE] text-[#D32F2F]' }],
    stock: true,
    offer: { type: 'shipping', text: 'Free delivery available' },
  },
  {
    id: 6,
    vendor: 'Mama\'s Kitchen',
    title: 'Assorted Meat Pepper Soup',
    price: '$22.99',
    originalPrice: '$25.99',
    discount: '-10%',
    image: '/assorted-meat.jpg',
    badges: [{ text: 'Hot', color: 'bg-red-600 text-white' }, { text: 'Highly rated', color: 'bg-[#673AB7] text-white' }],
    stock: true,
    offer: { type: 'flash', text: 'Weekend Special' },
  }
];

// Duplicate products to have 18 items (3 pages of 6) for testing the arrows
const extendedProducts = [...products, ...products.map(p => ({ ...p, id: p.id + 6 })), ...products.map(p => ({ ...p, id: p.id + 12 }))];

export default function PriceHitsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isViewAll, setIsViewAll] = useState(false);
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
      const firstChild = container.children[0] as HTMLElement;
      const itemWidth = firstChild ? firstChild.offsetWidth + 16 : container.clientWidth;
      const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;
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
    
    if (!isViewAll) {
      autoPlayInterval = setInterval(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 768 && scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
          
          if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
            scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scroll('right');
          }
        }
      }, 3000);
    }

    return () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    };
  }, [isViewAll]);

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
              <button
                onClick={() => setIsViewAll(!isViewAll)}
                className="bg-[var(--color-primary)] md:bg-[#1C1917] dark:md:bg-white hover:opacity-90 md:hover:bg-[var(--color-primary)] text-white dark:md:text-[#1C1917] font-bold py-1.5 md:py-2.5 px-6 md:px-8 rounded-md md:rounded-lg transition-all text-[13px] md:text-base mt-1 md:mt-0"
              >
                {isViewAll ? 'Show Less' : 'View All'}
              </button>
            </div>
          </div>

          {/* Product Content */}
          {isViewAll ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-8">
              {extendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} isGrid={true} />
              ))}
            </div>
          ) : (
            <div className="relative group/carousel">
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex overflow-hidden gap-4 pb-8 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {extendedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Mobile Scroll Controls (Arrows + Line) */}
              <div className="flex md:hidden items-center justify-center gap-6 mt-2 pb-4">
                <button onClick={() => scroll('left')} className="p-2 text-gray-400 hover:text-black transition-colors">
                  <ChevronLeft size={20} />
                </button>

                <div className="w-16 h-0.5 bg-gray-200 relative rounded-full">
                  <div
                    className="absolute top-0 h-full bg-black rounded-full transition-all duration-150"
                    style={{ width: '33.33%', left: `${scrollProgress * 0.6667}%` }}
                  ></div>
                </div>

                <button onClick={() => scroll('right')} className="p-2 text-gray-400 hover:text-black transition-colors">
                  <ChevronRight size={20} />
                </button>
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
