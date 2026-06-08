'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Zap, Truck, Check, Eye } from 'lucide-react';
import { useCart } from '@/store/cart';
import { getProductHref } from '@/utils/product-route';

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
    <div className={`${isGrid ? 'w-full h-full flex-1' : 'w-[calc((100%-16px)/2)] md:w-[calc((100%-48px)/4)] lg:w-[calc((100%-80px)/6)]'} flex-none bg-[var(--color-bg-main)] rounded-2xl p-3 flex flex-col snap-start shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group relative border border-gray-100 hover:border-transparent`}>

      {/* Image & Badges */}
      <div className="bg-[var(--color-bg-secondary)] rounded-xl relative aspect-square w-full mb-2 flex items-center justify-center overflow-hidden">
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10 transition-opacity duration-300 group-hover:opacity-0">
          {product.badges.map((badge, idx) => (
            <span key={idx} className={`${badge.color} text-[11px] font-bold px-2 py-0.5 rounded-sm shadow-sm inline-block w-max`}>
              {badge.text}
            </span>
          ))}
        </div>

        <Link href={getProductHref({ name: product.title } as any)} className="absolute top-3 right-3 w-10 h-10 md:w-11 md:h-11 bg-[var(--color-primary)] text-[var(--color-foreground)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110 z-20" aria-label="Quick view">
          <Eye size={22} strokeWidth={2.5} />
        </Link>

        {/* Using placeholder for now */}
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <Image src={product.image} alt={product.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1">
        <h3 className="text-[var(--color-text)] text-[13px] font-bold leading-tight mb-1 line-clamp-2">
          {product.title}
        </h3>

        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[#F97316] text-base font-bold">{product.price}</span>
          {product.originalPrice && (
            <span className="text-[var(--color-text)] opacity-40 text-xs font-medium line-through">{product.originalPrice}</span>
          )}
        </div>

        <div className="flex items-center gap-1 mb-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span className="text-green-600 text-[11px] font-semibold">In stock</span>
        </div>

        {product.offer && (
          <div className="flex items-center gap-1 mb-2">
            {product.offer.type === 'shipping' ? (
              <Truck size={12} className="text-[#F97316]" />
            ) : (
              <Zap size={12} className="text-[#F97316]" />
            )}
            <span className="text-[11px] font-bold text-[#F97316]">{product.offer.text}</span>
          </div>
        )}

        {/* Add to Basket Section */}
        <div className="mt-auto pt-2 flex flex-col gap-2">
          <div className="flex items-center justify-between border border-[var(--color-text)] border-opacity-15 rounded-lg p-0.5 h-8">
            <button onClick={handleDecrement} className="w-7 h-full flex items-center justify-center text-[var(--color-text)] opacity-60 hover:opacity-100 hover:bg-[var(--color-text)] hover:bg-opacity-10 rounded-md text-sm">−</button>
            <span className="font-bold text-[13px] text-[var(--color-text)]">{quantity}</span>
            <button onClick={handleIncrement} className="w-7 h-full flex items-center justify-center text-[var(--color-text)] opacity-60 hover:opacity-100 hover:bg-[var(--color-text)] hover:bg-opacity-10 rounded-md text-sm">+</button>
          </div>
          <button
            onClick={handleToggleCart}
            className={`w-full font-bold py-2 rounded-lg transition-colors text-[12px] flex items-center justify-center gap-1.5 ${isAdded ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-[#F97316] hover:bg-[#1C1917] text-white'}`}
          >
            {isAdded ? <><Check size={13} /> Added</> : 'Add to basket'}
          </button>
        </div>
      </div>

    </div>
  );
}
