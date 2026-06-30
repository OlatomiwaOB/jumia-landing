import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ProductProps } from '@/types';
import { clientConfig } from '@/config/client-config';

interface HeroSplashProps {
  products?: ProductProps[];
}

export default function HeroSplash({ products = [] }: HeroSplashProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Safely parse colors from .env, adding '#' if missing
  const getHex = (val?: string, fallback = '') => val ? (val.startsWith('#') ? val : `#${val}`) : fallback;

  const color1 = getHex(clientConfig().branding.colors.accent, '#A0522D');
  const color2 = getHex(clientConfig().branding.colors.accentColor2, '#967BB6');
  const color3 = getHex(clientConfig().branding.colors.accentColor3, '#2F3E33');
  const textColor = getHex(clientConfig().branding.colors.accentForeground, '#FFFDF5');

  const findProduct = (keyword: string) =>
    products.find(p => p.name?.toLowerCase().includes(keyword.toLowerCase()));

  const p1 = findProduct('fish (red bream)') || products[0];
  const p2 = findProduct('jumbo turkey') || products[1];
  const p3 = findProduct('gizdodo') || products[2];

  const signatureDishes = [
    {
      id: p1?.id || 1,
      title: p1?.name || "Red Bream",
      subtitle: p1?.category?.name || p1?.category || "Our Signature",
      image: p1?.picture || "/images/cat_main_meals.png",
      bgColor: color1,
      accent: textColor
    },
    {
      id: p2?.id || 2,
      title: p2?.name || "Jumbo Turkey",
      subtitle: p2?.category?.name || p2?.category || "Hearty Favorite",
      image: p2?.picture || "/images/cat_specials.png",
      bgColor: color2,
      accent: textColor
    },
    {
      id: p3?.id || 3,
      title: p3?.name || "Gizdodo",
      subtitle: p3?.category?.name || p3?.category || "Crowd Pleaser",
      image: p3?.picture || "/images/cat_grills.png",
      bgColor: color3,
      accent: textColor
    }
  ];

  const currentDish = signatureDishes[currentIndex];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % signatureDishes.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + signatureDishes.length) % signatureDishes.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto slide
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative w-full min-h-[50vh] lg:min-h-[75vh] py-8 lg:py-16 flex items-center justify-center overflow-hidden transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: currentDish.bgColor }}
    >
      {/* Massive Background Typography (Reads Dish Name) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] select-none pointer-events-none overflow-hidden">
        <h1 className="text-[20vw] font-black whitespace-nowrap" style={{ color: currentDish.accent }}>
          {currentDish.title.toUpperCase()}
        </h1>
      </div>

      {/* Increased max-width for better desktop spread, removed negative margins */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-16">

        {/* Left Side: Static Brand Text */}
        <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left pt-8 lg:pt-0">
          <div className="transition-colors duration-700 w-full flex flex-col items-center lg:items-start">
            <span
              className="inline-block text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-6 px-5 py-1.5 rounded-full border border-current opacity-80"
              style={{ color: currentDish.accent }}
            >
              Discover Varisa Food
            </span>

            <h2 className="text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-serif lg:font-bold mb-6 tracking-tight" style={{ color: currentDish.accent }}>
              <span className="block whitespace-nowrap">Authentic Nigerian</span>
              <span className="block whitespace-nowrap">Meals <span className="opacity-90">Served Fresh.</span></span>
            </h2>

            <p className="text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 opacity-90" style={{ color: currentDish.accent }}>
              Experience the rich, vibrant flavors of Varisa Food. We pride ourselves in using premium ingredients and authentic recipes passed down through generations to bring the true taste of home straight to your table.
            </p>

            <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto justify-center lg:justify-start">
              <Link
                href="/shop"
                className="inline-flex justify-center items-center gap-3 px-8 py-3.5 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                style={{ backgroundColor: currentDish.accent, color: currentDish.bgColor }}
              >
                Order Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: The "Floating" Plate */}
        <div className="w-full lg:w-[45%] flex justify-center items-center relative h-[350px] sm:h-[450px] lg:h-[600px] mt-8 lg:mt-0">
          {/* Decorative spinning dashed circle */}
          <div
            className="absolute w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] lg:w-[550px] lg:h-[550px] rounded-full border-2 border-dashed animate-[spin_30s_linear_infinite] opacity-30"
            style={{ borderColor: currentDish.accent }}
          />

          {/* The Plate Image */}
          <div
            className={`relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden shadow-2xl border-8 transition-all duration-500 transform ${isAnimating ? 'opacity-0 scale-90 rotate-45' : 'opacity-100 scale-100 rotate-0'}`}
            style={{ borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <Image
              src={currentDish.image}
              alt={currentDish.title}
              fill
              className="object-cover object-center scale-125"
              priority
            />
          </div>

          {/* Slider Controls */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
              style={{ backgroundColor: currentDish.accent, color: currentDish.bgColor }}
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
              style={{ backgroundColor: currentDish.accent, color: currentDish.bgColor }}
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
