import { ProductProps } from "@/types";
import { useCart } from "@/store/cart";
import { CurrencyCode, formatPrice } from "@/utils/helperfns";
import Image from "next/image";
import { MouseEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Star } from "lucide-react";
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
  const currentPrice = product.salePrice ?? product.oldPrice ?? 19.99;

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    addToCart(product as any);
  };

  const handleProductNavigation = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    router.push(getProductHref(product, storeCode));
  };

  return (
    <div
      className="flex flex-col bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 group cursor-pointer border border-gray-50 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Wishlist Button */}
      <button className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#E35920] hover:border-[#E35920] transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-sm border border-gray-100">
        <Heart size={16} />
      </button>

      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] bg-white mb-4 rounded-2xl overflow-hidden flex items-center justify-center">
        {product.picture ? (
          <Image
            src={product.picture}
            alt={product.name || 'Product'}
            fill
            className={`object-cover transition-transform duration-500 ease-out ${product.imageClass || 'group-hover:scale-110'}`}
          />
        ) : (
          <div className="w-20 h-20 bg-gray-100 rounded-full"></div>
        )}

        {/* View Details Pill */}
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={handleProductNavigation}
            className="px-5 py-2 bg-white text-gray-900 text-xs font-bold rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="flex flex-col flex-1 px-1">
        <h3 className="text-[15px] font-bold text-gray-800 line-clamp-1 mb-1.5">{product.name}</h3>

        {/* Rating Stars */}
        <div className="flex items-center gap-0.5 mb-2 text-[#F4B41A]">
          {Array.from({ length: 5 }).map((_, i) => {
            const rating = (product as any).rating ?? 5;
            return (
              <Star
                key={i}
                size={14}
                className={`fill-current ${i < rating ? '' : 'text-gray-200'}`}
              />
            );
          })}
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-[1.35rem] font-black text-gray-900">
            {formatPrice(currentPrice, "GBP")}
          </span>
        </div>

        <div className="mt-auto pt-2">
          {quantity <= 0 ? (
            <button
              className="w-full h-[3rem] bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 hover:shadow-[0_8px_20px_rgba(26,92,56,0.25)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed group"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingBag size={18} className="transition-transform duration-300 group-hover:scale-110" />
              {inStock ? "Add to bag" : "Out Of Stock"}
            </button>
          ) : (
            <div className="flex w-full h-[3rem] items-center justify-between border-2 border-accent rounded-xl px-2 font-semibold text-accent bg-accent/5">
              <button onClick={(e) => { e.stopPropagation(); decrement(product as any); }} className="w-10 h-full flex items-center justify-center hover:bg-accent/10 rounded-lg text-lg transition-colors">-</button>
              <span>{quantity}</span>
              <button onClick={(e) => { e.stopPropagation(); increment(product as any); }} className="w-10 h-full flex items-center justify-center hover:bg-accent/10 rounded-lg text-lg transition-colors">+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
