'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Calendar, Zap, Truck, ChevronLeft, ChevronRight, Check, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/store/cart';

// Mock Data matching the reference image
const products = [
  {
    id: 1,
    vendor: 'Mama\'s Kitchen',
    title: 'Premium Pounded Yam & Egusi',
    price: '$18.99',
    originalPrice: null,
    discount: null,
    image: '/pounded_yam_egusi.jpg',
    badges: [{ text: 'Highly rated', color: 'bg-[#673AB7] text-white' }, { text: 'Top Choice', color: 'bg-[#F97316] text-white' }],
    stock: true,
    offer: null,
  },
  {
    id: 2,
    vendor: 'Lagos Vibes',
    title: 'Authentic Party Jollof Rice',
    price: '$15.50',
    originalPrice: null,
    discount: null,
    image: '/party-jollof.png',
    badges: [{ text: 'Best Seller', color: 'bg-[#FFEBEE] text-[#D32F2F]' }, { text: 'Spicy', color: 'bg-red-600 text-white' }],
    stock: true,
    offer: null,
  },
  {
    id: 3,
    vendor: 'Suya Spot',
    title: 'Spicy Nigerian Suya (Beef)',
    price: '$12.99',
    originalPrice: null,
    discount: null,
    image: '/suya_transparent.png',
    badges: [{ text: 'Chef\'s Special', color: 'bg-[#FFEB3B] text-black' }],
    stock: true,
    offer: { type: 'flash', text: 'Freshly grilled' },
  },
  {
    id: 4,
    vendor: 'Ibadan Flavors',
    title: 'Classic Amala & Ewedu',
    price: '$16.00',
    originalPrice: '$20.00',
    discount: '-20%',
    image: '/amala_ewedu.png',
    badges: [{ text: 'Deal', color: 'bg-[#FFEB3B] text-black' }, { text: 'Highly rated', color: 'bg-[#673AB7] text-white' }],
    stock: true,
    offer: { type: 'flash', text: 'Up to 20% discount' },
  },
  {
    id: 5,
    vendor: 'Eastern Delights',
    title: 'Traditional Igbo Abacha (African Salad)',
    price: '$14.50',
    originalPrice: null,
    discount: null,
    image: '/igbo_abacha.jpg',
    badges: [{ text: 'Best Buy', color: 'bg-[#FFEBEE] text-[#D32F2F]' }],
    stock: true,
    offer: { type: 'shipping', text: 'Free delivery available' },
  },
  {
    id: 6,
    vendor: 'Mama\'s Kitchen',
    title: 'Assorted Meat Pepper Soup',
    price: '$22.99',
    originalPrice: '$25.99',
    discount: '-10%',
    image: '/assorted-meat.jpg',
    badges: [{ text: 'Hot', color: 'bg-red-600 text-white' }, { text: 'Highly rated', color: 'bg-[#673AB7] text-white' }],
    stock: true,
    offer: { type: 'flash', text: 'Weekend Special' },
  }
];

// Duplicate products to have 18 items (3 pages of 6) for testing the arrows
const extendedProducts = [...products, ...products.map(p => ({ ...p, id: p.id + 6 })), ...products.map(p => ({ ...p, id: p.id + 12 }))];

function ProductCard({ product, isGrid = false }: { product: typeof products[0], isGrid?: boolean }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, inCart, removeItem } = useCart();

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleToggleCart = () => {
    if (inCart(product.id)) {
      removeItem(product.id);
    } else {
      addToCart({
        id: product.id,
        name: product.title,
        salePrice: parseFloat(product.price.replace('$', '')),
        picture: product.image,
        qtyInStore: 100,
        storeCode: 'WEB',
        ccy: '$'
      }, quantity);

      // Optionally reset quantity after adding
      setQuantity(1);
    }
  };

  const isAdded = inCart(product.id);

  return (
    <div className={`${isGrid ? 'w-full h-full' : 'w-[calc((100%-16px)/2)] md:w-[calc((100%-48px)/4)] lg:w-[calc((100%-80px)/6)]'} flex-none bg-white rounded-2xl p-4 flex flex-col snap-start shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden`}>

      {/* Image & Badges */}
      <div className="bg-[#F5F5F5] rounded-xl relative aspect-square w-full mb-4 flex items-center justify-center p-4">
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {product.badges.map((badge, idx) => (
            <span key={idx} className={`${badge.color} text-[11px] font-bold px-2 py-0.5 rounded-sm shadow-sm inline-block w-max`}>
              {badge.text}
            </span>
          ))}
        </div>
        {/* Using placeholder for now */}
        <div className="relative w-full h-full">
          <Image src={product.image} alt={product.title} fill className="object-contain" />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1">
        <span className="text-gray-500 text-[13px] font-medium mb-1">{product.vendor}</span>
        <h3 className="text-[#1C1917] text-[15px] font-bold leading-tight mb-2 min-h-[40px] line-clamp-2">
          {product.title}
        </h3>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[#F97316] text-xl font-bold">{product.price}</span>
          {product.originalPrice && (
            <span className="text-gray-400 text-sm font-medium line-through">{product.originalPrice}</span>
          )}
          {product.discount && (
            <span className="bg-[#FFEDD5] text-[#F97316] text-xs font-bold px-1.5 py-0.5 rounded ml-1">{product.discount}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          <span className="text-green-600 text-[13px] font-bold">In stock</span>
        </div>

        {product.offer && (
          <div className="flex items-center gap-1.5 mb-3">
            {product.offer.type === 'shipping' ? (
              <Truck size={14} className="text-[#F97316]" />
            ) : (
              <Zap size={14} className="text-[#F97316]" />
            )}
            <span className={`text-[13px] font-bold text-[#F97316]`}>
              {product.offer.text}
            </span>
          </div>
        )}

        <div className="mt-auto pt-3 flex items-center gap-2">
          <Calendar size={14} className="text-gray-500" />
          <span className="text-gray-700 text-[13px] font-bold">Receives in 6 days.</span>
        </div>

        {/* Add to Basket Section */}
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border border-gray-200 rounded-md p-1 h-10">
            <button onClick={handleDecrement} className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded">-</button>
            <span className="font-bold text-[15px]">{quantity}</span>
            <button onClick={handleIncrement} className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded">+</button>
          </div>
          <button
            onClick={handleToggleCart}
            className={`w-full font-bold py-2.5 rounded-md transition-colors text-sm flex items-center justify-center gap-2 ${isAdded ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-[#F97316] hover:bg-[#1C1917] text-white'
              }`}
          >
            {isAdded ? <><Check size={16} /> Added</> : 'Add to basket'}
          </button>
        </div>
      </div>

    </div>
  );
}

export default function PriceHitsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isViewAll, setIsViewAll] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -scrollContainerRef.current.clientWidth : scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 6,
    minutes: 49,
    seconds: 36
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              } else {
                clearInterval(timer);
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full px-4 lg:px-10 py-8 max-w-[1640px] mx-auto bg-[#FAFAF9]">
      <div className="w-full bg-[#FFEDD5] rounded-[32px] md:rounded-[40px] pt-10 pb-8 px-6 lg:px-12 relative overflow-hidden shadow-sm">
        {/* Background SVG wave pattern placeholder (Optional faint overlay) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #F97316 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <h2 className="text-[#1C1917] text-3xl md:text-[40px] font-bold tracking-tight">Price hits of the week</h2>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[#1C1917] font-medium">Gone in 24 Hours</span>
                <div className="flex items-center gap-1.5">
                  <div className="bg-[#F97316] text-white font-bold text-lg px-3 py-1.5 rounded-md min-w-[48px] text-center">{timeLeft.days}</div>
                  <span className="text-[#1C1917] font-bold">:</span>
                  <div className="bg-[#F97316] text-white font-bold text-lg px-3 py-1.5 rounded-md min-w-[40px] text-center">{timeLeft.hours}</div>
                  <span className="text-[#1C1917] font-bold">:</span>
                  <div className="bg-[#F97316] text-white font-bold text-lg px-3 py-1.5 rounded-md min-w-[40px] text-center">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <span className="text-[#1C1917] font-bold">:</span>
                  <div className="bg-[#F97316] text-white font-bold text-lg px-3 py-1.5 rounded-md min-w-[40px] text-center">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                </div>
              </div>
              <button
                onClick={() => setIsViewAll(!isViewAll)}
                className="bg-[#1C1917] hover:bg-[#F97316] text-white font-bold py-2.5 px-8 rounded-lg transition-colors"
              >
                {isViewAll ? 'Show Less' : 'View All'}
              </button>
            </div>
          </div>

          {/* Product Content */}
          {isViewAll ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-8">
              {extendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} isGrid={true} />
              ))}
            </div>
          ) : (
          <div className="relative group/carousel">
            <div 
              ref={scrollContainerRef} 
              onScroll={handleScroll}
              className="flex overflow-hidden gap-4 pb-8 snap-x snap-mandatory scrollbar-hide scroll-smooth" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {extendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Mobile Scroll Controls (Arrows + Line) */}
            <div className="flex md:hidden items-center justify-center gap-6 mt-2 pb-4">
              <button onClick={() => scroll('left')} className="p-2 text-gray-400 hover:text-black transition-colors">
                <ChevronLeft size={20} />
              </button>
              
              <div className="w-16 h-0.5 bg-gray-200 relative rounded-full">
                <div 
                  className="absolute top-0 h-full bg-black rounded-full transition-all duration-150"
                  style={{ width: '33.33%', left: `${scrollProgress * 0.6667}%` }}
                ></div>
              </div>

              <button onClick={() => scroll('right')} className="p-2 text-gray-400 hover:text-black transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
            
            {/* Desktop Carousel Arrows */}
            <button onClick={() => scroll('left')} className="absolute left-[-20px] top-[40%] -translate-y-1/2 w-12 h-12 bg-[#F1EADC] text-black hover:bg-[#F97316] hover:text-white rounded-full flex items-center justify-center shadow-md z-10 hidden md:flex transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 pointer-events-none group-hover/carousel:pointer-events-auto">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scroll('right')} className="absolute right-[-20px] top-[40%] -translate-y-1/2 w-12 h-12 bg-white text-black hover:bg-[#F97316] hover:text-white rounded-full flex items-center justify-center shadow-md z-10 hidden md:flex transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 pointer-events-none group-hover/carousel:pointer-events-auto">
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        </div>
      </div>
    </section>
  );
}
