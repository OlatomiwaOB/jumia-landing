'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VarisaProductCard from './product-card';
import { ProductProps } from '@/types';
import { ShoppingBag } from 'lucide-react';

interface TopDealsProps {
    products?: ProductProps[];
}

export default function TopDeals({ products: dynamicProducts = [] }: TopDealsProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 3,
        hours: 7,
        minutes: 50,
        seconds: 47
    });

    // Simple countdown timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else {
                    seconds = 59;
                    if (minutes > 0) minutes--;
                    else {
                        minutes = 59;
                        if (hours > 0) hours--;
                        else {
                            hours = 23;
                            if (days > 0) days--;
                        }
                    }
                }
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (num: number) => num.toString().padStart(2, '0');

    // Display only the first 6 products as per the grid design
    const productsToDisplay = dynamicProducts.slice(0, 6);

    if (productsToDisplay.length === 0) {
        return null;
    }

    return (
        <section className="w-full bg-accent-foreground py-16 md:py-24">
            <div className="max-w-[1500px] mx-auto px-4 md:px-8">
                {/* Header section with Title and Timer */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#111]">
                        Top Deals Of The Day
                    </h2>
                    
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-[#111] text-sm md:text-base hidden sm:block">Hurry up! Offer ends in:</span>
                        <div className="flex gap-2">
                            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-accent text-white font-bold text-lg md:text-xl rounded shadow-sm">
                                {formatTime(timeLeft.days)}
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-accent text-white font-bold text-lg md:text-xl rounded shadow-sm">
                                {formatTime(timeLeft.hours)}
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-accent text-white font-bold text-lg md:text-xl rounded shadow-sm">
                                {formatTime(timeLeft.minutes)}
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-accent text-white font-bold text-lg md:text-xl rounded shadow-sm">
                                {formatTime(timeLeft.seconds)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col xl:flex-row gap-6">
                    {/* Promotional Banner */}
                    <div className="w-full xl:w-1/3 rounded-2xl overflow-hidden relative min-h-[400px] xl:min-h-auto shadow-lg flex flex-col items-center justify-center text-center p-8 group">
                        {/* Background Image (using a fallback from mock images) */}
                        <div className="absolute inset-0 z-0">
                            <Image 
                                src="/images/mock/jollof_rice.png" 
                                alt="Promotional Banner" 
                                fill 
                                className="object-cover brightness-[0.4] transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        
                        {/* Overlay Content */}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                            <div className="w-16 h-16 border-2 border-white/40 rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag size={28} className="text-white" />
                            </div>
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/80">GREAT DEALS!</h4>
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-8 text-center max-w-[90%]">
                                Place Your Orders with Ease<br/>and Let Us Handle the Rest
                            </h3>
                            <Link href="/shop">
                                <button className="bg-white text-[#111] font-bold px-8 py-3.5 rounded-full hover:bg-accent hover:text-white transition-colors duration-300 shadow-md">
                                    Order Now
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="w-full xl:w-2/3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {productsToDisplay.map((product, idx) => (
                                <VarisaProductCard key={product.id || idx} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
