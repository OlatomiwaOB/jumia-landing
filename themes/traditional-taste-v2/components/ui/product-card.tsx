'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, Zap, Truck, Check, Eye } from 'lucide-react';
import { useCart } from '@/store/cart';

export interface Product {
  id: number;
  vendor: string;
  title: string;
  price: string;
  originalPrice: string | null;
  discount: string | null;
  image: string;
  badges: { text: string; color: string }[];
  stock: boolean;
  offer: { type: 'flash' | 'shipping'; text: string } | null;
}

interface ProductCardProps {
  product: Product;
  isGrid?: boolean;
}

export default function ProductCard({ product, isGrid = false }: ProductCardProps) {
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

      setQuantity(1);
    }
  };

  const isAdded = inCart(product.id);

  return (
    <div className={`${isGrid ? 'w-full h-full' : 'w-[calc((100%-16px)/2)] md:w-[calc((100%-48px)/4)] lg:w-[calc((100%-80px)/6)]'} flex-none bg-[var(--color-bg-main)] rounded-2xl p-4 flex flex-col snap-start shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden`}>

      {/* Image & Badges */}
      <div className="bg-[var(--color-bg-secondary)] rounded-xl relative aspect-square w-full mb-4 flex items-center justify-center p-4">
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10 transition-opacity duration-300 group-hover:opacity-0">
          {product.badges.map((badge, idx) => (
            <span key={idx} className={`${badge.color} text-[11px] font-bold px-2 py-0.5 rounded-sm shadow-sm inline-block w-max`}>
              {badge.text}
            </span>
          ))}
        </div>
        
        <button className="absolute top-3 right-3 w-10 h-10 md:w-11 md:h-11 bg-[var(--color-primary)] text-[var(--color-foreground)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110 z-20" aria-label="Quick view">
          <Eye size={22} strokeWidth={2.5} />
        </button>

        {/* Using placeholder for now */}
        <div className="relative w-full h-full">
          <Image src={product.image} alt={product.title} fill className="object-contain" />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1">
        <span className="text-[var(--color-text)] opacity-60 text-[13px] font-medium mb-1">{product.vendor}</span>
        <h3 className="text-[var(--color-text)] text-[15px] font-bold leading-tight mb-2 min-h-[40px] line-clamp-2">
          {product.title}
        </h3>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[#F97316] text-xl font-bold">{product.price}</span>
          {product.originalPrice && (
            <span className="text-[var(--color-text)] opacity-50 text-sm font-medium line-through">{product.originalPrice}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_infinite] absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </div>
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
          <Calendar size={14} className="text-[var(--color-text)] opacity-50" />
          <span className="text-[var(--color-text)] opacity-80 text-[13px] font-bold">Receives in 6 days.</span>
        </div>

        {/* Add to Basket Section */}
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border border-[var(--color-text)] border-opacity-20 rounded-md p-1 h-10">
            <button onClick={handleDecrement} className="w-8 h-full flex items-center justify-center text-[var(--color-text)] opacity-60 hover:opacity-100 hover:bg-[var(--color-text)] hover:bg-opacity-10 rounded">-</button>
            <span className="font-bold text-[15px] text-[var(--color-text)]">{quantity}</span>
            <button onClick={handleIncrement} className="w-8 h-full flex items-center justify-center text-[var(--color-text)] opacity-60 hover:opacity-100 hover:bg-[var(--color-text)] hover:bg-opacity-10 rounded">+</button>
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
