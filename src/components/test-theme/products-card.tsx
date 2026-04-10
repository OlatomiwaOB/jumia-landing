'use client';

import { ProductProps } from "@/types";
import Image from "next/image";
import { useState } from "react";

interface CardProps {
  product: ProductProps;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex flex-col group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-[#f4f4f4] mb-6 mt-2 overflow-hidden flex items-center justify-center">
        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10 font-sans text-xs tracking-widest text-[#555]">
          <span>NEW</span>
          {product.onSale && <span>-19%</span>}
        </div>

        {/* Product Image */}
        {product.picture ? (
          <div className="relative w-3/4 h-3/4 transition-transform duration-500 ease-out group-hover:scale-105">
             <Image
                src={product.picture}
                alt={product.name || 'Product'}
                fill
                className="object-contain"
             />
          </div>
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
        )}

        {/* Quick Look overlay button */}
        <div className={`absolute bottom-0 left-0 right-0 flex transition-transform duration-300 ease-out ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex-1 bg-[#111] text-white text-xs font-semibold tracking-widest py-4 text-center hover:bg-black transition-colors">
            QUICK LOOK
          </div>
          <div className="w-12 bg-[#333] flex items-center justify-center text-white hover:bg-black transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Info Container */}
      <div className="text-center flex flex-col space-y-2">
        <h3 className="text-sm font-semibold tracking-widest text-black uppercase">{product.name}</h3>
        <div className="h-5 flex items-center justify-center overflow-hidden">
          <div className={`flex flex-col items-center transition-transform duration-300 ${isHovered ? '-translate-y-full' : 'translate-y-0'}`}>
             <span className="text-sm text-[#888]">${product.price || 160}</span>
             <span className="text-sm font-semibold tracking-widest text-[#aaa] hover:text-black uppercase mt-1">Add To Cart</span>
          </div>
        </div>
      </div>
    </div>
  );
}
