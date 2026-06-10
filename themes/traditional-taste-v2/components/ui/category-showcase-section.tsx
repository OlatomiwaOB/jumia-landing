'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard, { Product } from './product-card';
import { useSearchParams } from "next/navigation";
import { useProducts } from '@/hooks/useProducts';
import { ProductProps } from '@/types';

export default function CategoryShowcaseSection() {
  const searchParams = useSearchParams();
  const storeCode = searchParams?.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE || '';
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || '';

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const directionRef = useRef<'forward' | 'backward'>('forward');

  const { data: productsData, isLoading: productsLoading } = useProducts(
    storeCode,
    entityCode,
    '', // Empty string fetches all categories automatically
    '',
    'showcase',
    1,
    10 // Fetch 10 products for the scroll
  );

  // Auto-scroll logic
  useEffect(() => {
    if (isHovered || !productsData || productsData.products.length === 0) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        if (directionRef.current === 'forward') {
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            // Reached the end, switch to scrolling backward
            directionRef.current = 'backward';
            scrollRef.current.scrollBy({ left: -(clientWidth + 16), behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: clientWidth + 16, behavior: 'smooth' });
          }
        } else {
          if (scrollLeft <= 10) {
            // Reached the start, switch to scrolling forward
            directionRef.current = 'forward';
            scrollRef.current.scrollBy({ left: clientWidth + 16, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: -(clientWidth + 16), behavior: 'smooth' });
          }
        }
      }
    }, 2000); // Scrolls every 2 seconds

    return () => clearInterval(interval);
  }, [isHovered, productsData]);

  const displayProducts: Product[] = (productsData?.products || [])
    .filter((p: ProductProps) => !!p.picture)
    .map((p: ProductProps) => ({
      id: p.id || Math.random(),
      vendor: p.storeName || 'Restaurant',
      title: p.name || 'Unknown',
      price: p.salePrice ? `$${p.salePrice}` : '$0.00',
      originalPrice: p.oldPrice ? `$${p.oldPrice}` : null,
      discount: p.discount ? `-${p.discount}%` : null,
      image: p.picture,
      badges: [],
      stock: (p.qtyInStore ?? 1) > 0,
      offer: null
    }));

  return (
    <section className="w-full px-0 md:px-4 lg:px-10 py-2 md:py-4 max-w-[1640px] mx-auto bg-[var(--color-bg-main)]">
      <div className="w-full bg-[var(--color-bg-secondary)] rounded-none md:rounded-[40px] py-4 md:py-6 px-4 md:px-6 lg:px-12 relative overflow-hidden shadow-sm">

        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h2 className="text-[#1C1917] dark:text-white text-2xl md:text-[32px] font-bold tracking-tight">Home made</h2>
        </div>

        {/* Layout Flex */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left Banner */}
          <div className="w-full lg:w-1/4 shrink-0 bg-[#fff7ed] rounded-2xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 relative min-h-[320px] flex flex-col">

            {/* Top text area */}
            <div className="px-6 pt-6 pb-4 z-10 relative">
              <span className="inline-block bg-[#F97316] text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 uppercase tracking-wide">🍽 Nigerian Cuisine</span>
              <h3 className="text-[20px] md:text-[22px] font-extrabold text-[#431407] leading-tight mb-3">
                Authentic Nigerian Dishes for Every Occasion
              </h3>
              <Link href="/shop" className="inline-flex items-center gap-1.5 bg-[#431407] hover:bg-[#F97316] text-white text-[12px] font-bold px-4 py-2 rounded-full transition-colors duration-300">
                Shop All →
              </Link>
            </div>

            {/* Image fills bottom */}
            <div className="relative flex-1 min-h-[200px] mt-2">
              {/* Gradient overlay blending top of image into the card bg */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#fff7ed] to-transparent z-10 pointer-events-none"></div>
              <Image
                src="/nigerian-food-banner.png"
                alt="Delicious Nigerian Food"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right Product Horizontal Scroll */}
          <div className="w-full lg:w-3/4 relative">
            {productsLoading ? (
              <div className="flex items-center justify-center h-full min-h-[250px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
              </div>
            ) : displayProducts.length > 0 ? (
              <div
                ref={scrollRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsHovered(true)}
                onTouchEnd={() => setIsHovered(false)}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 pt-2 w-full h-full items-start [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {displayProducts.map((product) => (
                  <div key={product.id} className="w-[calc(50%-8px)] sm:w-[calc(33.333%-10.66px)] lg:w-[calc(25%-12px)] shrink-0 snap-start h-[310px] sm:h-[340px] md:h-auto">
                    <ProductCard product={product} isGrid={true} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[250px] text-[var(--color-text)] opacity-60">
                No items found for this category.
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
