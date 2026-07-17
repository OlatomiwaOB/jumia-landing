'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductProps } from '@/types';
import { useRouter } from 'next/navigation';
import { getProductHref } from '@/utils/product-route';

interface HeroSliderProps {
  products: ProductProps[];
  storeCode?: string;
}

export default function HeroSlider({ products, storeCode }: HeroSliderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  // Fallback dummy slides to exactly match the requested design even if no products are passed yet
  const fallbackSlides = [
    {
      name: "Ultra-HD Smart TVs",
      description: "Experience cinematic brilliance with our massive, crystal-clear displays.",
      picture: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=2000&auto=format&fit=crop",
    },
    {
      name: "High-Performance Laptops",
      description: "Sleek, powerful, and ready for any professional workflow.",
      picture: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2000&auto=format&fit=crop",
    },
    {
      name: "PlayStation 5 Console",
      description: "Next-gen gaming with lightning-fast loading and immersive 3D audio.",
      picture: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=2000&auto=format&fit=crop",
    },
    {
      name: "Electric Guitars",
      description: "Unleash your inner rockstar with our premium solid-body guitars.",
      picture: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?q=80&w=2000&auto=format&fit=crop",
    },
    {
      name: "Portable Bluetooth Speakers",
      description: "Take your music everywhere you go with robust, bass-heavy sound.",
      picture: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=2000&auto=format&fit=crop",
    }
  ];

  const sliderProducts = products && products.length > 0 ? products.slice(0, 5) : fallbackSlides;
  const stepsCount = Math.max(sliderProducts.length, 1);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (sliderProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % stepsCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [stepsCount, sliderProducts.length]);

  const activeProduct = sliderProducts[currentStep];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden bg-black">

      {/* Full-bleed Background Image */}
      {activeProduct?.picture && (
        <div className="absolute inset-0 z-0">
          <Image
            src={activeProduct.picture}
            alt={activeProduct.name || "Hero Product"}
            fill
            className="object-cover object-center animate-fade-in"
            priority
          />
          {/* Subtle overlay to ensure text is readable */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      )}

      {/* Centered Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto mt-12">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white mb-6 tracking-wide drop-shadow-lg">
          {activeProduct?.name}
        </h1>
        <p className="text-lg md:text-xl text-white mb-10 drop-shadow-md font-light">
          {activeProduct?.description ? activeProduct.description.substring(0, 120) + (activeProduct.description.length > 120 ? '...' : '') : ""}
        </p>
        <button
          className="bg-[#0abedb] hover:bg-[#09aac4] text-white font-bold py-4 px-10 text-[22px] rounded-md transition-colors"
          onClick={() => {
            // Only route if it's a real product (has an id)
            if (activeProduct && 'id' in activeProduct) {
              router.push(getProductHref(activeProduct as ProductProps, storeCode));
            }
          }}
        >
          Shop Collection
        </button>
      </div>

      {/* Bottom Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        {sliderProducts.map((_, idx) => {
          const isActive = currentStep === idx;
          return (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`rounded-full transition-all duration-300 ${isActive
                ? 'w-[18px] h-[18px] border-[4.5px] border-white bg-transparent scale-110'
                : 'w-[16px] h-[16px] bg-white hover:opacity-80'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
