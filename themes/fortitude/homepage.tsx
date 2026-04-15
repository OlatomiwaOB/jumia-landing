'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function FortitudeHomepage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-50 py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Elevate Your <span className="text-accent italic">Lifestyle</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Discover our curated collection of premium products designed for comfort, style, and reliability.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/shop"
              className="bg-accent text-white px-8 py-4 rounded-lg font-bold hover:bg-accent-foreground transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              SHOP NOW
            </Link>
            <Link
              href="/about"
              className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-lg font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              LEARN MORE
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Placeholder for Featured products or categories */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Categories</h2>
              <p className="text-gray-500">Explore our most sought-after collections.</p>
            </div>
            <Link href="/shop" className="text-accent font-bold hover:underline">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Electronics', 'Fashion', 'Home Decor'].map((cat) => (
              <div key={cat} className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3] flex items-center justify-center cursor-pointer">
                <div className="text-center group-hover:scale-110 transition-transform duration-500">
                   <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">{cat}</h3>
                   <div className="h-1 w-12 bg-accent mx-auto mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
