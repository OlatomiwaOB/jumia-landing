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
    <section className="w-full pt-4 md:pt-6 pb-2 max-w-[1600px] mx-auto animate-in fade-in duration-500 overflow-hidden">

      {/* ── ALL SCREENS: Smooth continuous marquee Pills ── */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex gap-3 overflow-hidden px-4 lg:px-10 pb-4 select-none"
      >
        {extendedCategories.map((cat, index) => (
          <Link
            key={`pill-${cat.code}-${index}`}
            href={`/shop/${cat.code}`}
            className={`flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 min-w-[200px] lg:min-w-[220px] rounded-xl shadow-sm shrink-0 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 duration-200 ${pastelBgs[index % pastelBgs.length]}`}
          >
            <span className="font-bold text-[#1C1917] text-[13px] lg:text-[14px] tracking-tight leading-tight mr-3 lg:mr-4 pointer-events-none">
              {cat.name}
            </span>
            <div className="relative w-10 h-10 lg:w-12 lg:h-12 shrink-0 rounded-full overflow-hidden bg-white shadow-md border-2 border-white pointer-events-none">
              {cat.logo && !brokenLogos.has(cat.logo) ? (
                <Image 
                  src={cat.logo} 
                  alt={cat.name || ''} 
                  fill 
                  className="object-cover" 
                  onError={() => setBrokenLogos(prev => new Set(prev).add(cat.logo as string))}
                />
              ) : (
                <Image src={getFallbackImage(cat.name || '')} alt={cat.name || 'Category'} fill className="object-cover" />
              )}
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}
