'use client';

import { clientConfig } from '@/config/client-config';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VarisaProductCard from './product-card';
import { ProductProps } from '@/types';

interface TopDealsProps {
    products?: ProductProps[];
}

export default function TopDeals({ products: dynamicProducts = [] }: TopDealsProps) {
    const envBgColor = clientConfig().branding.colors.accentForeground;
    const sectionBg = envBgColor ? (envBgColor.startsWith('#') ? envBgColor : `#${envBgColor}`) : '#FCFBF8';

    const envAccentColor = clientConfig().branding.colors.accent;
    const accentColor = envAccentColor ? (envAccentColor.startsWith('#') ? envAccentColor : `#${envAccentColor}`) : '#A0522D';

    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Display only 3 products
    const productsToDisplay = dynamicProducts.slice(0, 3);

    const scrollTo = (index: number) => {
        if (scrollRef.current && scrollRef.current.children[index]) {
            const element = scrollRef.current.children[index] as HTMLElement;
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            setActiveIndex(index);
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const index = Math.round(scrollLeft / clientWidth);
            if (index !== activeIndex && index >= 0 && index < productsToDisplay.length) {
                setActiveIndex(index);
            }
        }
    };

    if (productsToDisplay.length === 0) {
        return null;
    }

    return (
        <section 
            className="w-full py-12 md:py-24 border-t border-b border-gray-100"
            style={{ backgroundColor: sectionBg }}
        >
            <style dangerouslySetInnerHTML={{ __html: `.hide-scrollbar::-webkit-scrollbar { display: none; }` }} />
            <div className="max-w-[1500px] mx-auto px-4 md:px-8">
                {/* Header section with Title */}
                <div className="mb-10">
                    <h2 className="text-[28px] sm:text-[32px] md:text-[42px] font-serif font-black tracking-tight text-gray-900 leading-none">
                        Top Deals Of The Day
                    </h2>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
                    {/* Promotional Banner */}
                    <div className="w-full lg:w-[35%] xl:w-1/3 rounded-[24px] overflow-hidden relative min-h-[300px] sm:min-h-[380px] lg:min-h-auto shadow-md flex flex-col justify-end p-6 sm:p-8 group border border-gray-100 bg-[#1a2e1a]">
                        {/* Background Image with Tint */}
                        <div className="absolute inset-0 z-0">
                            <Image 
                                src="/images/mock/jollof_rice.png" 
                                alt="Promotional Banner" 
                                fill 
                                className="object-cover brightness-[0.35] transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Color overlay to blend the image with the theme's background color */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                        </div>
                        
                        {/* Overlay Content */}
                        <div className="relative z-10 flex flex-col items-start text-white w-full">
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold leading-tight mb-2 sm:mb-3 text-left">
                                Place Your Orders with Ease & Passion
                            </h3>
                            <p className="text-[11px] sm:text-[12px] text-gray-200/80 mb-4 sm:mb-6 font-light leading-relaxed text-left max-w-[90%]">
                                Indulge in our carefully selected daily specials prepared with the freshest ingredients at unbeatable prices.
                            </p>
                            <Link href="/shop" className="w-full">
                                <button className="w-full bg-white text-gray-900 font-extrabold px-6 py-3 sm:py-3.5 rounded-full hover:bg-accent hover:text-white transition-all duration-300 shadow-md text-xs sm:text-sm tracking-wide">
                                    Order Now
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="w-full lg:w-[65%] xl:w-2/3 flex flex-col justify-center">
                        <div 
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="flex overflow-x-auto snap-x snap-mandatory gap-0 pb-4 hide-scrollbar lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 -mx-4 px-0 sm:mx-0 sm:px-0"
                        >
                            {productsToDisplay.map((product, idx) => (
                                <div key={product.id || idx} className="w-full sm:w-[280px] lg:w-auto shrink-0 snap-center px-4 sm:px-0">
                                    <VarisaProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        {/* Mobile/Tablet Pagination Dots */}
                        <div className="lg:hidden flex items-center justify-center gap-2 mt-4 pb-2 h-6">
                            {productsToDisplay.map((_, dotIndex) => (
                                <button
                                    key={dotIndex}
                                    onClick={() => scrollTo(dotIndex)}
                                    className="flex items-center justify-center w-6 h-6 focus:outline-none"
                                    aria-label={`Go to slide ${dotIndex + 1}`}
                                >
                                    {activeIndex === dotIndex ? (
                                        <div className="w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300" style={{ borderColor: accentColor }}>
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                                        </div>
                                    ) : (
                                        <div className="w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-all duration-300" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
