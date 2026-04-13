'use client';

import { ProductProps } from "@/types";
import { useCart } from "@/store/cart";
import { CurrencyCode, formatPrice } from "@/utils/helperfns";
import Image from "next/image";
import { MouseEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getProductHref } from "@/utils/product-route";

interface CardProps {
  product: ProductProps;
  onClick: () => void;
  storeCode?: string;
}

export function ProductCard({ product, onClick, storeCode }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, singleQuantity, increment, decrement } = useCart();
  const router = useRouter();
  const quantity = singleQuantity(product.id);
  const inStock = (product.qtyInStore ?? 0) > 0;
  const currentPrice = product.salePrice ?? product.oldPrice ?? 160;
  const hasDiscount =
    typeof product.oldPrice === "number" &&
    typeof product.salePrice === "number" &&
    product.oldPrice > product.salePrice;
  const discount = hasDiscount
    ? Math.ceil(((product.oldPrice! - product.salePrice!) / product.oldPrice!) * 100)
    : 0;
  const showAction = quantity > 0 || isHovered;

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    addToCart(product as any);
  };

  const handleIncrement = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    increment(product as any);
  };

  const handleDecrement = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    decrement(product as any);
  };

  const handleProductNavigation = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    router.push(getProductHref(product, storeCode));
  };

  const handleQuickLook = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick();
  };

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
          {product.onSale && discount > 0 && <span>-{discount}%</span>}
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
          <button
            type="button"
            className="flex-1 bg-[#111] text-white text-xs font-semibold tracking-widest py-4 text-center hover:bg-black transition-colors"
            onClick={handleQuickLook}
          >
            QUICK LOOK
          </button>
          <button
            type="button"
            className="w-12 bg-accent/50 cursor-pointer flex items-center justify-center text-accent-foreground hover:opacity-90 transition-colors"
            onClick={handleProductNavigation}
            aria-label={`Open ${product.name} page`}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="text-center flex flex-col space-y-3">
        <h3 className="text-sm font-semibold tracking-widest text-black uppercase">{product.name}</h3>
        <div className="relative h-10 overflow-hidden">
          <div
            className={`absolute inset-x-0 top-0 flex items-center justify-center gap-2 transition-all duration-300 ${showAction ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
          >
            <span className="text-sm text-[#888]">
              {formatPrice(currentPrice, ((product.ccy as CurrencyCode) || "NGN"))}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#bbb] line-through">
                {formatPrice(product.oldPrice!, ((product.ccy as CurrencyCode) || "NGN"))}
              </span>
            )}
          </div>

          <div
            className={`absolute inset-x-0 top-0 flex items-center justify-center transition-all duration-300 ${showAction ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
          >
            {quantity <= 0 ? (
              <button
                type="button"
                className="text-sm font-semibold tracking-widest text-[#aaa] uppercase transition-colors hover:text-black disabled:cursor-not-allowed disabled:text-[#c9c9c9]"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                {inStock ? "Add To Cart" : "Out Of Stock"}
              </button>
            ) : (
              <div className="mx-auto flex h-10 w-full max-w-[168px] items-center border border-[#111] text-xs font-semibold tracking-[0.35em] text-black">
                <button
                  type="button"
                  className="flex h-full w-10 items-center justify-center transition-colors hover:bg-[#111] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="flex-1 text-center tracking-[0.35em]">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="flex h-full w-10 items-center justify-center transition-colors hover:bg-[#111] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
                  onClick={handleIncrement}
                  disabled={quantity >= (product.qtyInStore ?? 0)}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
