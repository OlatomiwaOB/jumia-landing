'use client';
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { ProductProps } from '@/types/index';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';

interface ProductDetailsModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product: ProductProps | null;
}

const ProductDetailsModal = ({ isOpen, setIsOpen, product }: ProductDetailsModalProps) => {
  const { inCart, addToCart, singleQuantity, increment, decrement } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product as any);
  };

  const handleIncrement = () => {
    increment(product as any);
  };

  const handleDecrement = () => {
    decrement(product as any);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle className="sr-only">
        {product.name}
      </DialogTitle>
      <DialogContent
        className="max-w-5xl max-h-[90vh] md:h-[600px] overflow-hidden p-0 rounded-none border-none"
      >
        <div className="flex flex-col md:flex-row w-full h-full bg-white">
          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-[#f4f4f4] relative p-8 flex items-center justify-center">
            {product.picture ? (
              <div className="relative w-full h-full min-h-[300px]">
                <Image
                  src={product.picture}
                  alt={product.name || 'Product'}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="text-gray-400">No Image Available</div>
            )}
            
            {(product.onSale || product.featured) && (
              <div className="absolute top-6 left-6 flex flex-col space-y-2 text-xs font-semibold tracking-widest text-[#555]">
                {product.featured && <span>FEATURED</span>}
                {product.onSale && <span>SALE</span>}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-start overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <h2 className="text-2xl md:text-3xl font-bold text-black uppercase tracking-widest mb-4">
              {product.name}
            </h2>
            
            <p className="text-xl text-[#666] mb-8 font-light">
               ${product.salePrice ?? product.price ?? product.oldPrice ?? 160}
            </p>

            <div className="mb-10 text-[#777] leading-relaxed text-sm font-light flex-grow">
              <p className="mb-6">{product.description || 'A minimal contemporary piece for your specific needs.'}</p>
              
              <div className="space-y-3 pt-6 border-t border-gray-100">
                {product.brand && (
                  <p className="flex justify-between w-64"><span className="font-semibold text-black uppercase text-xs tracking-widest">Brand:</span> <span>{product.brand}</span></p>
                )}
                {product.category && (
                  <p className="flex justify-between w-64"><span className="font-semibold text-black uppercase text-xs tracking-widest">Category:</span> <span>{product.category}</span></p>
                )}
                {product.color && (
                  <p className="flex justify-between w-64"><span className="font-semibold text-black uppercase text-xs tracking-widest">Color:</span> <span>{product.color}</span></p>
                )}
                {product.itemSize && (
                  <p className="flex justify-between w-64"><span className="font-semibold text-black uppercase text-xs tracking-widest">Size:</span> <span>{product.itemSize}</span></p>
                )}
                {product.qtyInStore !== undefined && (
                  <p className="flex justify-between w-64"><span className="font-semibold text-black uppercase text-xs tracking-widest">Availability:</span> <span>{(product.qtyInStore > 0) ? `${product.qtyInStore} IN STOCK` : 'OUT OF STOCK'}</span></p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto">
              {singleQuantity(product.id) <= 0 ? (
                <button
                  className="w-full bg-[#111] text-white py-4 font-semibold tracking-widest text-xs hover:bg-black transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={handleAddToCart}
                  disabled={(product.qtyInStore ?? 0) <= 0}
                >
                  ADD TO CART
                </button>
              ) : (
                <div className="flex items-center justify-between w-full border border-[#111] h-[52px]">
                  <button
                    className="w-16 h-full flex items-center justify-center hover:bg-[#f4f4f4] transition-colors disabled:opacity-50"
                    onClick={handleDecrement}
                    disabled={singleQuantity(product.id) <= 1}
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-semibold text-sm">
                    {singleQuantity(product.id)}
                  </span>
                  <button
                    className="w-16 h-full flex items-center justify-center hover:bg-[#f4f4f4] transition-colors disabled:opacity-50"
                    onClick={handleIncrement}
                    disabled={singleQuantity(product.id) >= (product.qtyInStore ?? 0)}
                  >
                    +
                  </button>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
