'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/types';
import { useRef, useEffect, useState } from 'react';

const pastelBgs = [
  'bg-[#F2EAD3]',
  'bg-[#EAE4F2]',
  'bg-[#F0F4EC]',
  'bg-[#E3EAF4]',
  'bg-[#EBF3ED]',
  'bg-[#F9E8E8]',
  'bg-[#FFF4E0]',
  'bg-[#E8F4F9]',
];

export default function QuickCategoryPills() {
  const { data: categoriesData, isLoading } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [brokenLogos, setBrokenLogos] = useState<Set<string>>(new Set());

  const getFallbackImage = (categoryName: string) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('drink') || name.includes('beverage') || name.includes('water')) return '/maltina-can-pack.png';
    if (name.includes('meat') || name.includes('beef') || name.includes('goat') || name.includes('chicken') || name.includes('poultry') || name.includes('protein')) return '/naija-goat-meat.jpg';
    if (name.includes('fish') || name.includes('seafood') || name.includes('prawn')) return '/hake-fish-box.jpg';
    if (name.includes('soup') || name.includes('stew') || name.includes('sauce')) return '/three-soups-hero.png';
    if (name.includes('snack') || name.includes('pastry')) return '/grandios-pap.jpg';
    if (name.includes('rice') || name.includes('jollof') || name.includes('grain')) return '/party-jollof.png';
    if (name.includes('swallow') || name.includes('fufu') || name.includes('pound') || name.includes('garri') || name.includes('yam')) return '/olu-olu-poundo-yam.jpg';
    if (name.includes('veg') || name.includes('leaf') || name.includes('fruit')) return '/hands_vegetables.png';
    if (name.includes('spice') || name.includes('season') || name.includes('pepper') || name.includes('oil')) return '/maggi-cubes.png';
    return '/nigerian-food.png';
  };

  const categories: Category[] = (categoriesData?.categories || []).filter(
    (cat: Category) => cat.code && cat.name
  );

  // Duplicate the categories several times to create a seamless infinite loop
  const extendedCategories = Array(6).fill(categories).flat();

  // Ultra-smooth continuous infinite marquee scroll
  useEffect(() => {
    if (isPaused || !categories.length) return;

    let animationFrameId: number;

    const animateScroll = () => {
      const el = scrollRef.current;
      if (el) {
        // Scroll 1 pixel every frame
        el.scrollLeft += 1;

        // If we've scrolled halfway through the duplicated content, instantly reset to 0
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, categories.length]);

  if (isLoading) {
    return (
      <section className="w-full pt-4 md:pt-6 pb-2 max-w-[1600px] mx-auto overflow-hidden">
        <div className="flex gap-4 px-4 lg:px-10 pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shrink-0 w-[200px] lg:w-[220px] h-[64px] lg:h-[72px] rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="w-full py-4 border-b border-gray-300 bg-white max-w-[1600px] mx-auto animate-in fade-in duration-500 overflow-hidden">
      {/* ── ALL SCREENS: Smooth continuous marquee text ── */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex items-center gap-16 overflow-hidden px-4 select-none whitespace-nowrap"
      >
        {extendedCategories.map((cat, index) => (
          <Link
            key={`ticker-${cat.code}-${index}`}
            href={`/shop/${cat.code}`}
            className="flex items-center shrink-0 cursor-pointer hover:opacity-70 transition-opacity duration-200"
          >
            <span className="font-extrabold text-[var(--color-text)] text-[14px] md:text-[16px] tracking-wide pointer-events-none uppercase">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
