'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ProductProps } from '@/types';
import { getProductHref } from '@/utils/product-route';
import { formatPrice } from '@/utils/helperfns';


interface VarisaProductCardProps {
  product: ProductProps;
}

export default function VarisaProductCard({ product }: VarisaProductCardProps) {
  const isDiscounted = product.oldPrice && product.salePrice && product.oldPrice > product.salePrice;
  const isOutOfStock = product.qtyInStore === 0;

  const rating = 5;
  const ccy = product.ccy || '$';



  return (
    <div className="bg-white rounded-[12px] md:rounded-[20px] p-3 pb-4 md:p-5 md:pb-6 flex flex-col h-full shadow-sm hover:shadow-xl transition-shadow duration-300 relative group border border-gray-50">

      {/* Full Card Click Overlay */}
      <Link href={getProductHref(product)} className="absolute inset-0 z-0 rounded-[12px] md:rounded-[20px]" aria-label={product.name}></Link>

      {/* Badges */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 flex flex-col gap-1.5 md:gap-2 pointer-events-none">
        {isDiscounted && (
          <span className="bg-[#E74C3C] text-white text-[9px] md:text-[11px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-[4px] md:rounded-[6px]">
            {product.discount}
          </span>
        )}
        {/* {isOutOfStock && (
          <span className="bg-gray-500 text-white text-[9px] md:text-[11px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-[4px] md:rounded-[6px]">
            Out of stock
          </span>
        )} */}
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-square mb-4 md:mb-6 rounded-lg md:rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center pointer-events-none">
        <div className="block relative w-full h-full">
          <Image
            src={product.picture || '/product-placeholder-borderless.svg'}
            alt={product.name || 'Product Image'}
            fill
            className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col items-center flex-grow text-center relative z-10 pointer-events-none">
        <h3 className="text-gray-900 font-bold text-[12px] md:text-[15px] mb-1 md:mb-2 group-hover:text-accent transition-colors line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Stars */}
        {/* <div className="flex items-center gap-0.5 mb-2 md:mb-3 scale-75 md:scale-100">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={13}
              className={`${i < rating ? 'text-[#F39C12] fill-[#F39C12]' : 'text-gray-200 fill-gray-200'}`}
            />
          ))}
        </div> */}

        <div className="flex items-center justify-center gap-1 md:gap-2 mb-3 md:mb-6 mt-auto">
          <span className={`font-black text-[13px] md:text-[16px] ${isDiscounted ? 'text-[#E74C3C]' : 'text-gray-900'}`}>
            {formatPrice(product.salePrice || 0, ccy as any)}
          </span>
          {isDiscounted && (
            <span className="text-gray-400 text-[11px] md:text-[13px] line-through font-semibold">
              {formatPrice(product.oldPrice || 0, ccy as any)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <Link
          href={getProductHref(product)}
          className={`pointer-events-auto w-full md:w-[85%] py-2 md:py-3 rounded-[8px] md:rounded-full font-bold text-[11px] md:text-[13px] border transition-all duration-300 flex items-center justify-center ${isOutOfStock
            ? 'border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
            : 'bg-white border-gray-200 text-gray-900 hover:bg-accent3 hover:text-white hover:border-accent3'
            }`}
        >
          {'Select Options'}
        </Link>
      </div>
    </div>
  );
}
