'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Heart, Layers, Eye, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ProductProps } from '@/types';
import { getProductHref } from '@/utils/product-route';
import { formatPrice } from '@/utils/helperfns';
import { useCart } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';

interface VarisaProductCardProps {
  product: ProductProps;
}

export default function VarisaProductCard({ product }: VarisaProductCardProps) {
  const isDiscounted = product.oldPrice && product.salePrice && product.oldPrice > product.salePrice;
  const isOutOfStock = product.qtyInStore === 0;

  const rating = 5;
  const ccy = product.ccy || '$';

  const { addToCart, inCart, openCart, removeItem } = useCart();
  const { toggleWishlist, inWishlist } = useWishlist();

  const [isMounted, setIsMounted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const alreadyInCart = isMounted && inCart(product.id);
  const isProductInWishlist = isMounted && inWishlist(product.id);

  const handleCartToggle = () => {
    if (isOutOfStock) return;
    if (alreadyInCart) {
      removeItem(product.id);
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        salePrice: product.salePrice || 0,
        picture: product.picture,
        category: product.category,
        ccy: product.ccy,
        code: product.code,
        qtyInStore: product.qtyInStore ?? 99,
        storeCode: process.env.NEXT_PUBLIC_STORE_CODE || '',
        vat: product.vat,
      });
      openCart();
    }
  };

  return (
    <div className="bg-white rounded-[20px] p-5 pb-6 flex flex-col h-full shadow-sm hover:shadow-xl transition-shadow duration-300 relative group border border-gray-50">

      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {isDiscounted && !isOutOfStock && (
          <span className="bg-[#E74C3C] text-white text-[11px] font-bold px-2 py-1 rounded-[6px]">
            -{product.discount || '10%'}
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-gray-500 text-white text-[11px] font-bold px-2 py-1 rounded-[6px]">
            Out of stock
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-square mb-6 flex items-center justify-center">
        <Link href={getProductHref(product)} className="block relative w-full h-full scale-[0.95] md:scale-[1.08] group-hover:scale-100 md:group-hover:scale-[1.15] transition-transform duration-500 ease-out">
          <Image
            src={product.picture || '/product-placeholder-borderless.svg'}
            alt={product.name || 'Product Image'}
            fill
            className="object-contain mix-blend-multiply drop-shadow-md hover:drop-shadow-lg transition-all duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>

        {/* Floating Heart Icon (Wishlist) - Mobile Only */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product as any);
          }}
          className={`md:hidden absolute bottom-3 right-3 w-11 h-11 border border-gray-100 rounded-full flex items-center justify-center shadow-sm hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all duration-300 z-20 active:scale-95 ${isProductInWishlist ? 'bg-accent text-accent-foreground border-accent' : 'bg-white text-gray-400'
            }`}
        >
          <Heart size={20} strokeWidth={2.5} className={isProductInWishlist ? 'fill-white' : ''} />
        </button>

        {/* Quick Actions Overlay - Desktop Only */}
        <div className="hidden md:flex absolute bottom-4 left-0 right-0 items-center justify-center gap-3 translate-y-[150%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
          <div className="relative group/btn">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product as any);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-accent hover:text-accent-foreground transition-colors duration-300 ${isProductInWishlist ? 'bg-accent text-accent-foreground' : 'bg-white text-gray-700'
                }`}
            >
              <Heart size={16} className={isProductInWishlist ? 'fill-white' : ''} />
            </button>
            <span className="absolute -top-[34px] left-1/2 -translate-x-1/2 bg-accent3 text-white text-[11px] font-medium px-2.5 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none drop-shadow-md">
              {isProductInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-accent3"></div>
            </span>
          </div>

          <div className="relative group/btn">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-accent hover:text-accent-foreground text-gray-700 transition-colors duration-300">
              <Layers size={16} />
            </button>
            <span className="absolute -top-[34px] left-1/2 -translate-x-1/2 bg-accent3 text-white text-[11px] font-medium px-2.5 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none drop-shadow-md">
              Compare
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-accent3"></div>
            </span>
          </div>

          <div className="relative group/btn">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowQuickView(true);
              }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-accent hover:text-accent-foreground text-gray-700 transition-colors duration-300"
            >
              <Eye size={16} />
            </button>
            <span className="absolute -top-[34px] left-1/2 -translate-x-1/2 bg-accent3 text-white text-[11px] font-medium px-2.5 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none drop-shadow-md">
              Quick view
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-accent3"></div>
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col items-center flex-grow text-center">
        <Link href={getProductHref(product)}>
          <h3 className="text-gray-900 font-bold text-[15px] mb-2 hover:text-accent transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={13}
              className={`${i < rating ? 'text-[#F39C12] fill-[#F39C12]' : 'text-gray-200 fill-gray-200'}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mb-6 mt-auto">
          <span className={`font-black text-[16px] ${isDiscounted ? 'text-[#E74C3C]' : 'text-gray-900'}`}>
            {formatPrice(product.salePrice || 0, ccy as any)}
          </span>
          {isDiscounted && (
            <span className="text-gray-400 text-[13px] line-through font-semibold">
              {formatPrice(product.oldPrice || 0, ccy as any)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleCartToggle}
          disabled={isOutOfStock}
          className={`w-[85%] py-3 rounded-full font-bold text-[13px] border transition-all duration-300 ${isOutOfStock
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : alreadyInCart
              ? 'bg-accent text-accent-foreground border-accent'
              : 'bg-white border-gray-200 text-gray-900 hover:bg-accent3 hover:text-white hover:border-accent3'
            }`}
        >
          {isOutOfStock ? 'Out of Stock' : alreadyInCart ? '✓ Add to Cart' : 'Add to Cart'}
        </button>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              setShowQuickView(false);
            }}
          ></div>

          {/* Modal Content */}
          <div className="bg-white rounded-2xl w-full max-w-4xl relative z-10 flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh]">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowQuickView(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors z-20"
            >
              <X size={18} />
            </button>

            {/* Image side */}
            <div className="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center min-h-[300px]">
              <div className="relative w-full h-full max-w-[300px] aspect-square">
                <Image
                  src={product.picture || '/product-placeholder-borderless.svg'}
                  alt={product.name || 'Product Image'}
                  fill
                  className="object-contain drop-shadow-xl"
                />
              </div>
            </div>

            {/* Details side */}
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h2>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${i < rating ? 'text-[#F39C12] fill-[#F39C12]' : 'text-gray-200 fill-gray-200'}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="font-black text-2xl text-accent">
                  {formatPrice(product.salePrice || 0, ccy as any)}
                </span>
                {isDiscounted && (
                  <span className="text-gray-400 text-lg line-through font-semibold">
                    {formatPrice(product.oldPrice || 0, ccy as any)}
                  </span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                {product.description || "No description available for this item."}
              </p>

              <div className="mt-auto">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleCartToggle();
                  }}
                  disabled={isOutOfStock}
                  className={`w-full py-4 rounded-full font-bold text-base transition-all duration-300 shadow-md ${isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : alreadyInCart
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-[#111] text-white hover:bg-accent'
                    }`}
                >
                  {isOutOfStock ? 'Out of Stock' : alreadyInCart ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
