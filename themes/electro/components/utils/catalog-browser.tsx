'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getCategoryHref } from '@/utils/product-route';

interface CatalogBrowserProps {
  categories: any[];
  storeCode?: string;
}

export default function CatalogBrowser({ categories, storeCode }: CatalogBrowserProps) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fallbacks if data is missing, mimicking the user's screenshot exactly
  const mockCategories = [
    { name: 'Televisions', code: 'tvs', products: 45, image: '/images/mock/cat_tvs.png' },
    { name: 'Washers & Dryers', code: 'washers', products: 12, image: '/images/mock/cat_washers.png' },
    { name: 'Refrigerators', code: 'fridges', products: 24, image: '/images/mock/cat_fridges.png' },
    { name: 'Microwaves', code: 'microwaves', products: 36, image: '/images/mock/cat_microwaves.png' },
    { name: 'Small Appliances', code: 'appliances', products: 89, image: '/images/mock/cat_irons.png' },
    { name: 'Laptops', code: 'laptops', products: 50, image: '/images/mock/cat_laptops.png' },
  ];

  const displayCategories = categories && categories.length > 0 ? categories : mockCategories;

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

      // Calculate progress as the percentage of the total scroll width that is currently visible or scrolled past.
      // This means if 5 out of 6 items are visible initially, it starts at ~83% ("almost full"),
      // and reaches 100% ("full") when scrolled to the end.
      const progress = scrollWidth > 0 ? ((scrollLeft + clientWidth) / scrollWidth) * 100 : 0;
      setScrollProgress(Math.min(100, progress));
    }
  };

  useEffect(() => {
    handleScroll(); // Initial setup
  }, []);

  return (
    <div className="w-full bg-white py-20 text-gray-900 font-sans overflow-hidden">
      <div className="max-w-[100rem] mx-auto px-6 md:px-12">

        {/* Header Text */}
        <div className="mb-10">
          <p className="text-[15px] font-bold tracking-wide text-gray-500 mb-3">Our collections</p>
          <h2 className="text-3xl md:text-[40px] font-bold tracking-tight text-gray-900">Browse our catalog</h2>
        </div>

        {/* Scrolling Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayCategories.map((category, idx) => (
            <button
              key={category.code || idx}
              onClick={() => {
                if (category.code) router.push(getCategoryHref(category.code, storeCode));
              }}
              className="group relative flex-none w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-19.2px)] h-[340px] md:h-[380px] rounded-[1.2rem] overflow-hidden snap-start text-left transition-transform hover:scale-[1.02] bg-[#E8EDF2] shadow-xl"
            >
              {/* Product Image */}
              <div className={`absolute inset-0 flex items-center justify-center ${idx === 0 ? '' : 'p-8'}`}>
                {category.image || category.logo ? (
                  <div className={`relative w-full flex items-center justify-center mix-blend-multiply ${idx === 0 ? 'h-full scale-[1.1] translate-y-8 -translate-x-4' : 'h-[60%]'}`}>
                    <Image
                      src={category.image || category.logo}
                      alt={category.name}
                      fill
                      className={`object-contain transition-transform duration-500 ease-out brightness-[1.15] contrast-[1.3] ${idx === 0 ? 'group-hover:scale-105' : 'group-hover:-translate-y-3'}`}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-black/10 rounded-full" />
                )}
              </div>

              {/* Badge */}
              {category.badge && (
                <div className={`absolute ${idx === 0 ? 'top-10 left-1/2 -translate-x-1/2' : 'top-6 right-6'} bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full z-10 shadow-sm`}>
                  <span className="text-[11px] font-bold text-black tracking-widest">{category.badge}</span>
                </div>
              )}

              {/* Text Bottom Left */}
              <div className="absolute bottom-6 left-6 z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-1.5">{category.name}</h3>
                <p className="text-[13px] font-semibold text-gray-600 tracking-wider">
                  {category.products || Math.floor(Math.random() * 50) + 10} products
                </p>
              </div>
            </button>
          ))}
        </div>


        {/* Custom Scrollbar Progress */}
        <div className="w-full h-[2px] bg-black/10 mt-4 relative rounded-full">
          <div
            className="absolute top-0 left-0 h-full bg-black transition-all duration-100 ease-out rounded-full"
            style={{ width: `${Math.max(scrollProgress, 10)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
