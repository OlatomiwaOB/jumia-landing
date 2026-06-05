'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { getCategoryHref } from '@/utils/product-route';
import { useSearchParams } from 'next/navigation';

const mockCategories = [
  {
    id: 1,
    title: 'Traditional Soups',
    productCount: 8,
    image: '/category_soups_1779923083280.png',
    link: '/shop?category=traditional-soups',
  },
  {
    id: 2,
    title: 'Rice Dishes',
    productCount: 6,
    image: '/category_rice_1779923098621.png',
    link: '/shop?category=rice-dishes',
  },
  {
    id: 3,
    title: 'Porridges',
    productCount: 3,
    image: '/category_porridge_1779923113158.png',
    link: '/shop?category=porridges',
  },
  {
    id: 4,
    title: 'Proteins',
    productCount: 4,
    image: '/category_proteins_1779923126020.png',
    link: '/shop?category=proteins',
  },
  {
    id: 5,
    title: 'Classic Stews',
    productCount: 3,
    image: '/category_stews_1779923152340.png',
    link: '/shop?category=classic-stews',
  },
  {
    id: 6,
    title: 'Small Chops',
    productCount: 2,
    image: '/category_chops_1779923165944.png',
    link: '/shop?category=small-chops',
  },
  {
    id: 7,
    title: 'Sides & Extras',
    productCount: 3,
    image: '/category_sides_1779923179408.png',
    link: '/shop?category=sides',
  },
  {
    id: 8,
    title: 'Bundles',
    productCount: 1,
    image: '/category_bundles_1779923196026.png',
    link: '/shop?category=bundles',
  },
];

interface CategoryListProps {
  categories?: { code?: string; name?: string; logo?: string }[];
}

export default function CategoryList({ categories: dynamicCategories }: CategoryListProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(1);

  const searchParams = useSearchParams();
  const storeCode = searchParams
    ? searchParams.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE || ''
    : process.env.NEXT_PUBLIC_STORE_CODE || '';

  const displayCategories = dynamicCategories && dynamicCategories.length > 0
    ? dynamicCategories.map((c, i) => ({
      id: c.code || i,
      title: c.name,
      productCount: null,
      image: c.logo || '',
      link: getCategoryHref(c.code || '', storeCode),
    }))
    : [];

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    setCurrentSlide(index);
    const width = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: index * width,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const clientWidth = scrollRef.current.clientWidth;
      if (clientWidth > 0) {
        const newIndex = Math.round(scrollLeft / clientWidth);
        if (newIndex !== currentSlide) {
          setCurrentSlide(newIndex);
        }
      }
    }
  };

  // Auto-play functionality for mobile
  useEffect(() => {
    if (displayCategories.length <= 1) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
        if (scrollWidth > clientWidth && clientWidth > 0) {
          const currentIndex = Math.round(scrollLeft / clientWidth);
          let nextIndex = currentIndex + directionRef.current;
          
          if (nextIndex >= displayCategories.length) {
            directionRef.current = -1;
            nextIndex = currentIndex - 1;
          } else if (nextIndex < 0) {
            directionRef.current = 1;
            nextIndex = currentIndex + 1;
          }
          
          scrollTo(nextIndex);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [displayCategories.length]);

  // Group categories into pairs for mobile carousel (2 per slide)
  const mobileChunks = [];
  for (let i = 0; i < displayCategories.length; i += 2) {
    mobileChunks.push(displayCategories.slice(i, i + 2));
  }

  const goToPrev = () => setCurrentSlide((p) => Math.max(0, p - 1));
  const goToNext = () => setCurrentSlide((p) => Math.min(mobileChunks.length - 1, p + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) goToPrev();
    else if (diff < -40) goToNext();
    touchStartX.current = null;
  };

  return (
    <div className="w-full bg-accent-foreground">
      <section className="w-full px-4 md:px-8 pt-4 pb-6 md:pt-24 md:pb-20 max-w-[1500px] mx-auto">
        <div className="text-center mb-2 md:mb-6">
          <h2 className="text-[44px] font-extrabold tracking-tight text-[#111] mb-2 md:mb-4">Categories</h2>
          {/* <p className="text-gray-500 text-[16px] max-w-2xl mx-auto">
            Good food brings people together. Browse our collection of mouthwatering meals, snacks, drinks, and recipes made to satisfy every appetite.
          </p> */}
        </div>

        {/* ── DESKTOP & TABLET GRID ── */}
        <div className="hidden sm:flex sm:flex-wrap sm:justify-center gap-8 md:gap-6">
          {
            displayCategories.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-16">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <p className="text-gray-400 text-lg font-semibold mb-1">No categories available</p>
                <p className="text-gray-400 text-sm">Check back later for new categories.</p>
              </div>
            ) : (
              displayCategories.map((category) => (
                <Link
                  key={category.id}
                  href={category.link}
                  className="flex flex-col items-center cursor-pointer group w-[calc(45%-1rem)] md:w-[calc(33.33%-1.5rem)] lg:w-[calc(16.66%-1.5rem)]"
                >
                  <div className="relative w-full mx-auto aspect-square mb-5 transition-all duration-400 group-hover:scale-105 rounded-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-gray-200/60 group-hover:ring-accent/30 bg-white">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.title || ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 33vw, 12vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-[#111] font-extrabold text-[16px] mb-1.5 group-hover:text-accent transition-colors text-center leading-tight tracking-tight">
                    {category.title}
                  </h3>
                  {category.productCount !== null && (
                    <p className="text-gray-400 font-medium text-[14px]">
                      {category.productCount || 0} {(category.productCount === 1) ? 'Product' : 'Products'}
                    </p>
                  )}
                </Link>
              )))
          }
        </div>

        {/* ── MOBILE CAROUSEL ── */}
        <div className="sm:hidden mt-2 px-4">
          {displayCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-400 text-sm font-semibold">No categories available</p>
            </div>
          ) : (
            <>
              <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {displayCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.link}
                    className="flex flex-col items-center cursor-pointer group min-w-full w-full snap-center shrink-0 px-1"
                  >
                    <div className="relative w-full aspect-[4/3] mx-auto transition-all duration-300 active:scale-95 rounded-[24px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.08)] bg-white">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.title || ''}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <span className="text-gray-400 text-[12px]">No image available</span>
                        </div>
                      )}
                      
                      {/* Dark gradient so white text is always readable */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                      
                      <div className="absolute bottom-6 left-0 w-full text-center px-4 pointer-events-none">
                        <h3 className="text-white font-black text-[28px] leading-tight tracking-tight drop-shadow-md">
                          {category.title}
                        </h3>
                        {category.productCount !== null && (
                          <p className="text-white/80 font-medium text-[14px] mt-1 drop-shadow-md">
                            {category.productCount || 0} {(category.productCount === 1) ? 'Product' : 'Products'}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Dots Pagination */}
              <div className="flex items-center justify-center gap-2.5 mt-2 h-6">
                {displayCategories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className="flex items-center justify-center w-6 h-6"
                  >
                    {i === currentSlide ? (
                      <div className="w-6 h-6 rounded-full border border-accent flex items-center justify-center">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                      </div>
                    ) : (
                      <div className="w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
