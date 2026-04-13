'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductProps } from '@/types';

interface HeroSliderProps {
  products: ProductProps[];
}

export default function HeroSlider({ products }: HeroSliderProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Default to 3 steps, or however many products we have (up to 3)
  const sliderProducts = products.slice(0, 3);
  const stepsCount = Math.max(sliderProducts.length, 1);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (sliderProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % stepsCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [stepsCount, sliderProducts.length]);

  if (!products || products.length === 0) return <div className="h-[70vh] bg-[#f4f4f4] flex items-center justify-center">Loading...</div>;

  const activeProduct = sliderProducts[currentStep];

  return (
    <div className="relative w-full h-[80vh] bg-white flex items-center overflow-hidden">
      
      {/* Background with left gutter */}
      <div className="absolute top-0 right-0 h-full w-[90%] md:w-[94%] bg-[#f4f4f4] z-0"></div>

      {/* Left Navigation Steps */}
      <div className="absolute left-4 md:left-8 flex flex-col space-y-6 z-20">
        {sliderProducts.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentStep(idx)}
            className={`flex items-center space-x-4 transition-all duration-300 ${currentStep === idx ? 'opacity-100 text-black' : 'opacity-60 text-gray-500 hover:opacity-100'}`}
          >
            <span className="font-semibold text-sm">0{idx + 1}</span>
            <div className={`transition-all duration-300 ${currentStep === idx ? 'h-[2px] w-16 bg-black' : 'h-[1px] w-6 bg-gray-400'}`}></div>
          </button>
        ))}
      </div>
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-24 flex flex-col md:flex-row items-center w-full h-full relative z-10 pt-16">
        
        {/* Text Area */}
        <div className="w-full md:w-1/2 flex flex-col justify-center pl-10 md:pl-20 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold tracking-widest text-[#111] mb-6 uppercase">
            {activeProduct?.name || "CONTEMPORARY DESIGN."}
          </h1>
          <p className="text-[#777] text-md max-w-md leading-relaxed font-light mb-10">
            {activeProduct?.description ? activeProduct.description.substring(0, 100) + '...' : "A large set of beautiful & fully flexible homepage layouts lets you create your website quickly & easily."}
          </p>
          <div>
            <button className="text-xs tracking-widest border-b-2 border-black pb-1 hover:text-[#555] hover:border-[#555] transition-colors font-semibold">
              DISCOVER MORE
            </button>
          </div>
        </div>
        
        {/* Image Area */}
        <div className="w-full md:w-1/2 h-full flex items-center justify-center relative">
          {activeProduct?.picture && (
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
              <Image 
                src={activeProduct.picture} 
                alt={activeProduct.name || "Hero Product"} 
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
