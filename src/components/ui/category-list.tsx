'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';

const categories = [
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

export default function CategoryList() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Group categories into pairs for mobile carousel (2 per slide)
  const mobileChunks = [];
  for (let i = 0; i < categories.length; i += 2) {
    mobileChunks.push(categories.slice(i, i + 2));
  }

  const goToPrev = () => setCurrentSlide((p) => Math.max(0, p - 1));
  const goToNext = () => setCurrentSlide((p) => Math.min(mobileChunks.length - 1, p + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) goToNext();
    else if (diff < -40) goToPrev();
    touchStartX.current = null;
  };

  return (
    <div className="w-full bg-accent-foreground">
      <section className="w-full px-4 md:px-8 pt-12 pb-6 md:pt-24 md:pb-20 max-w-[1500px] mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-[44px] font-extrabold tracking-tight text-[#111] mb-4">Food Categories</h2>
          <p className="text-gray-500 text-[16px] max-w-2xl mx-auto">
            Good food brings people together. Browse our collection of mouthwatering meals, snacks, drinks, and recipes made to satisfy every appetite.
          </p>
        </div>

        {/* ── DESKTOP & TABLET GRID ── */}
        <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-8 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="relative w-full aspect-square mb-5 transition-transform duration-400 hover:scale-105">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.title || ''}
                    fill
                    className="object-contain mix-blend-multiply"
                    sizes="(max-width: 1024px) 33vw, 12vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}
              </div>
              <h3 className="text-[#111] font-extrabold text-[16px] mb-1.5 hover:text-accent transition-colors text-center leading-tight tracking-tight">
                {category.title}
              </h3>
              <p className="text-gray-400 font-medium text-[14px]">
                {category.productCount || 0} {(category.productCount === 1) ? 'Product' : 'Products'}
              </p>
            </Link>
          ))}
        </div>

        {/* ── MOBILE CAROUSEL ── */}
        <div className="sm:hidden mt-10">
          <div
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {mobileChunks.map((chunk, index) => (
                <div key={index} className="w-full flex-shrink-0 flex gap-4 px-2">
                  {chunk.map((category) => (
                    <Link
                      key={category.id}
                      href={category.link}
                      className="flex-1 flex flex-col items-center cursor-pointer"
                    >
                      <div className="relative w-full aspect-square mb-5 transition-transform duration-400 hover:scale-105">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.title || ''}
                            fill
                            className="object-contain mix-blend-multiply"
                            sizes="(max-width: 768px) 50vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-[#111] font-extrabold text-[15px] mb-1.5 hover:text-accent transition-colors text-center leading-tight tracking-tight">
                        {category.title}
                      </h3>
                      <p className="text-gray-400 font-medium text-[13px]">
                        {category.productCount || 0} {(category.productCount === 1) ? 'Product' : 'Products'}
                      </p>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Dots only */}
          <div className="flex items-center justify-center gap-2.5 mt-8 h-6">
            {mobileChunks.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
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
          </div>
        </div>
      </section>
    </div>
  );
}
