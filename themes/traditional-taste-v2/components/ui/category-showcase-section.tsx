'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ProductCard, { Product } from './product-card';

// Mock Data matching the reference image
const vegetables: Product[] = [
  {
    id: 101,
    vendor: 'Mama Put Kitchen',
    title: 'Classic Smoky Party Jollof Rice & Chicken',
    price: '$12.50',
    originalPrice: null,
    discount: null,
    image: '/nigerian-food.png',
    badges: [{ text: 'Best Seller', color: 'bg-[#E53935] text-white' }, { text: 'Spicy', color: 'bg-[#FF9800] text-black' }],
    stock: true,
    offer: null,
  },
  {
    id: 102,
    vendor: 'Mama Put Kitchen',
    title: 'Pounded Yam and Rich Egusi Soup',
    price: '$15.99',
    originalPrice: null,
    discount: null,
    image: '/nigerian-food.png',
    badges: [{ text: 'Authentic', color: 'bg-[#4CAF50] text-white' }],
    stock: true,
    offer: null,
  },
  {
    id: 103,
    vendor: 'Mama Put Kitchen',
    title: 'Spicy Grilled Beef Suya with Onions',
    price: '$8.50',
    originalPrice: null,
    discount: null,
    image: '/nigerian-food.png',
    badges: [{ text: 'Highly rated', color: 'bg-[#673AB7] text-white' }, { text: 'Hot', color: 'bg-[#D32F2F] text-white' }],
    stock: true,
    offer: null,
  },
  {
    id: 104,
    vendor: 'Mama Put Kitchen',
    title: 'Fried Plantain (Dodo) & Beans',
    price: '$9.99',
    originalPrice: null,
    discount: null,
    image: '/nigerian-food.png',
    badges: [],
    stock: true,
    offer: null,
  },
  {
    id: 105,
    vendor: 'Mama Put Kitchen',
    title: 'Ofada Rice & Ayamase Sauce',
    price: '$14.95',
    originalPrice: null,
    discount: null,
    image: '/nigerian-food.png',
    badges: [{ text: 'Chef Special', color: 'bg-[#FFEB3B] text-black' }],
    stock: true,
    offer: null,
  }
];

const categories = ["Rice Dishes", "Soups & Swallows", "Snacks", "Drinks"];

export default function CategoryShowcaseSection() {
  const [activeCategory, setActiveCategory] = useState("Rice Dishes");

  return (
    <section className="w-full px-0 md:px-4 lg:px-10 pt-2 pb-8 md:py-8 max-w-[1640px] mx-auto bg-[var(--color-bg-main)]">
      <div className="w-full bg-[var(--color-bg-secondary)] rounded-none md:rounded-[40px] pt-8 pb-8 px-4 md:px-6 lg:px-12 relative overflow-hidden shadow-sm">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-[#1C1917] dark:text-white text-2xl md:text-[32px] font-bold tracking-tight">Food & Restaurant</h2>
          <button className="bg-[#1e4b85] hover:bg-[#153a6a] text-white font-bold py-2 px-6 rounded-md transition-colors text-[14px]">
            View All
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium text-[13px] md:text-sm whitespace-nowrap transition-colors border ${activeCategory === cat
                  ? 'bg-gray-100 border-gray-200 text-gray-900'
                  : 'bg-transparent border-gray-200 text-[var(--color-text)] hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left Banner */}
          <div className="w-full lg:w-1/4 bg-[#fff7ed] rounded-2xl p-8 flex flex-col items-center text-center relative overflow-hidden min-h-[400px]">
            <h3 className="text-[22px] md:text-[26px] font-bold text-[#431407] mb-4 relative z-10 leading-tight">
              Authentic Nigerian Dishes for Every Occasion
            </h3>
            <a href="#" className="text-[#9a3412] font-bold underline mb-auto relative z-10 hover:text-[#7c2d12] transition-colors">
              Shop All
            </a>
            
            {/* Decorative background curve */}
            <div className="absolute bottom-0 left-0 w-full h-[60%] bg-[#ffedd5] rounded-t-[100%] opacity-80 z-0 scale-[1.3] translate-y-[20%]"></div>
            
            <div className="relative z-10 mt-8 w-[200px] h-[200px] md:w-[250px] md:h-[250px] rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image src="/nigerian-food-banner.png" alt="Delicious Nigerian Food" fill className="object-cover" />
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="w-full lg:w-3/4 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {vegetables.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} isGrid={true} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
