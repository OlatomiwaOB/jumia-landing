"use client";

import Image from 'next/image';
import { ProductProps } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface BigHeroProps {
  products: ProductProps[];
}

export default function BigHero({ products }: BigHeroProps) {
  const router = useRouter();
  const heroImages = [
    "/three-soups-semo-white-cloth.png",
    "/amala_ewedu.png",
    "/white_rice_stew.png"
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="relative bg-gray-950 overflow-hidden w-full pt-28 pb-44 px-4 md:px-16 text-white">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none z-0"></div>

      <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

        {/* Left Column (Now visually on the left on desktop) */}
        <div className="space-y-10 order-2 md:order-1 flex flex-col justify-center relative z-20">

          {/* Title Area */}
          <div className="space-y-5 relative">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-[2px] bg-accent"></div>
              <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold">100% Authentic</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-[7rem] font-serif font-extrabold leading-[1] tracking-tight text-white drop-shadow-2xl">
              Traditional <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-orange-300 to-accent italic font-serif relative">
                Taste
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-xl leading-relaxed font-light pt-4 border-l-2 border-white/20 pl-6">
              A meal that takes you <span className="font-semibold text-white">home.</span>
            </p>
          </div>

          {/* Actions Area */}
          <div className="space-y-8 pt-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-sm font-medium tracking-wide shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-gray-200">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M7 8V6a5 5 0 0 1 10 0v2" /></svg>
              </div>
              <span className="font-semibold text-white tracking-wide">Same Day Delivery Available</span>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-5 bg-gradient-to-r from-accent to-orange-500 text-white font-bold text-lg rounded-full transition-all duration-500 flex items-center gap-2 shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_50px_rgba(249,115,22,0.5)] hover:-translate-y-2 group"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:scale-110 transition-transform"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                Shop Now
              </button>
              <button className="px-10 py-5 bg-transparent border-2 border-white/20 hover:border-white hover:bg-white/5 text-white font-bold text-lg rounded-full transition-all duration-300 flex items-center gap-2 group">
                Learn More
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-2"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>

          {/* Stats Glass Cards */}
          <div className="flex gap-4 pt-8 mt-4">
            <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl xl:text-4xl font-serif font-black text-white flex items-baseline gap-1 drop-shadow-md">
                200<span className="text-accent text-2xl">+</span>
              </div>
              <div className="text-[10px] xl:text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Products</div>
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl xl:text-4xl font-serif font-black text-white flex items-baseline gap-1 drop-shadow-md">
                5K<span className="text-accent text-2xl">+</span>
              </div>
              <div className="text-[10px] xl:text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Customers</div>
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl xl:text-4xl font-serif font-black text-white flex items-baseline gap-1 drop-shadow-md">
                24<span className="text-accent text-2xl">h</span>
              </div>
              <div className="text-[10px] xl:text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Fast Delivery</div>
            </div>
          </div>
        </div>

        <div className="relative order-1 md:order-2 flex justify-center items-center w-full z-20">
          
          {/* Left Arrow (Outside) */}
          <button 
            onClick={prevImage}
            className="absolute left-0 md:-left-8 lg:-left-16 xl:-left-20 top-1/2 -translate-y-1/2 z-30 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#fbf9f6] flex items-center justify-center text-gray-900 shadow-xl hover:scale-110 transition-transform border border-gray-200"
          >
            <ArrowLeft size={28} strokeWidth={1.5} />
          </button>

          <div className="relative h-[450px] md:h-[650px] w-full max-w-[600px] rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-[6px] border-white/5 transform transition-all duration-700 group">
            {/* Inner vignette shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none group-hover:opacity-70 transition-opacity duration-500"></div>

            <Image
              src={heroImages[currentImageIndex]}
              alt="African Dish"
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
            />
          </div>

          {/* Right Arrow (Outside) */}
          <button 
            onClick={nextImage}
            className="absolute right-0 md:-right-8 lg:-right-16 xl:-right-20 top-1/2 -translate-y-1/2 z-30 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#fbf9f6] flex items-center justify-center text-gray-900 shadow-xl hover:scale-110 transition-transform border border-gray-200"
          >
            <ArrowRight size={28} strokeWidth={1.5} />
          </button>

          {/* Floating Rated Badge */}
          <div 
            className="absolute -bottom-6 md:-bottom-8 left-2 md:-left-4 z-30 bg-gradient-to-r from-accent to-orange-500 rounded-[1.5rem] p-3 md:py-3 md:px-5 shadow-[0_20px_50px_rgba(249,115,22,0.4)] flex items-center gap-3 group/badge"
            style={{ animation: 'floatUpDown 4s ease-in-out infinite' }}
          >
            <style>{`
              @keyframes floatUpDown {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
            `}</style>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-accent flex items-center justify-center group-hover/badge:scale-110 group-hover/badge:rotate-[15deg] transition-all duration-500 shadow-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div className="flex flex-col pr-1 text-white">
              <span className="text-[9px] md:text-[10px] font-bold text-white/80 tracking-[0.2em] uppercase mb-0.5">Rated</span>
              <span className="text-sm md:text-base font-bold leading-tight drop-shadow-sm whitespace-nowrap">4.9/5 by Customers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Divider - Double Layer for 3D effect */}
      <svg className="absolute bottom-0 left-0 w-full text-white pointer-events-none drop-shadow-2xl z-30" viewBox="0 0 1440 120" fill="currentColor" preserveAspectRatio="none" style={{ height: '8vw', minHeight: '60px' }}>
        <path d="M0,30 C320,130 1120,-30 1440,90 L1440,120 L0,120 Z" opacity="0.3"></path>
        <path d="M0,45 C320,140 1120,-20 1440,100 L1440,120 L0,120 Z"></path>
      </svg>
    </div>
  );
}
