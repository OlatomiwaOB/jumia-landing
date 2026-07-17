'use client';

import React from 'react';
import Image from 'next/image';

export default function NewsletterSection() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-12 font-sans">
      <div className="max-w-[100rem] mx-auto relative rounded-[32px] overflow-hidden shadow-2xl h-[450px] md:h-[500px]">
        
        {/* Background Image */}
        <Image
          src="/images/mock/newsletter_closed_laptop.png"
          alt="Newsletter Background"
          fill
          className="object-cover object-center"
        />
        
        {/* Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center p-8 md:p-20">
          <div className="max-w-2xl w-full relative z-10">
            <h4 className="text-white text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">
              Exclusive Community
            </h4>
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Newsletter
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-10 max-w-lg leading-relaxed font-medium">
              Be the first to know about new arrivals, sales, and promotions by subscribing to our newsletter today!
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow bg-[#222222]/95 backdrop-blur-md text-white placeholder-gray-400 border border-white/10 focus:border-[#ffca68] focus:outline-none rounded-xl px-6 py-4 md:py-5 text-[15px] shadow-inner"
                required
              />
              <button
                type="submit"
                className="bg-[#ffca68] text-black font-extrabold px-10 py-4 md:py-5 rounded-xl shadow-lg hover:bg-[#e5b55d] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
