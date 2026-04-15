'use client';

import Image from 'next/image';
import { ProductProps } from '@/types/index';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { useCart } from '@/store/cart';

interface ProductCardProps {
  product: ProductProps;
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { inCart, addToCart, singleQuantity, increment, decrement } = useCart();
  const discount = product?.salePrice
    ? Math.ceil(((product.oldPrice! - product.salePrice!) / product.oldPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product as any);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    increment(product as any);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    decrement(product as any);
  };

  return (
    <div
      className="bg-white p-3 rounded-lg shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className='flex justify-between h-5'>
        {product.storeCode === "STO0715" && (
          <div className="bg-[#d8480b] text-white text-xs font-semibold px-1 py-0.5 rounded-full inline-block">
            DSH
          </div>
        )}

        {product.storeCode === "STO0715" && (
          <div className='flex gap-2 float-right'>
            {discount > 0 && (
              <div className="bg-[#d8480b] text-white text-xs font-semibold px-1 py-0.5 rounded-full inline-block">
                {discount}% OFF
              </div>
            )}

            {product.onSale && (
              <div className="text-accent border-1 border-accent text-xs font-semibold px-1 py-0.5 rounded-full inline-block">
                On Sale
              </div>
            )}
          </div>
        )}

        {product.storeCode !== "STO0715" && (
          <>
            {discount > 0 && (
              <div className="bg-[#d8480b] text-white text-xs font-semibold px-1 py-0.5 rounded-full inline-block">
                {discount}% OFF
              </div>
            )}

            {product.onSale && (
              <div className="text-accent border-1 border-accent text-xs font-semibold px-1 py-0.5 rounded-full inline-block">
                On Sale
              </div>
            )}
          </>
        )}
      </div>

      <div className="relative w-full h-32 my-2">
        <Image
          src={product.picture! || "/placeholder-image.png"}
          alt={'No Image Available'}
          fill
          className="object-contain rounded-md text-gray-500 text-center"
        />
      </div>

      <h3 className="text-sm mb-1 text-center font-semibold text-[#535357] line-clamp-2">
        {product.name}
      </h3>

      <div className='text-xs mb-1 text-center font-medium text-[#535357]'>
        {`${product.unit}` || 'Pieces'}
      </div>

      <div className="flex flex-col items-center gap-1 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#d8480b]">
            {formatPrice(product.salePrice! || product.oldPrice!, product?.ccy! as CurrencyCode)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-[#88888d] line-through">
              {formatPrice(product.oldPrice!, product?.ccy! as CurrencyCode)}
            </span>
          )}
        </div>
        {/* <span className="text-sm text-[#6b7280]">
          ({formatPrice(product.usdPrice!, 'USD')})
        </span> */}
      </div>

      {singleQuantity(product?.id) <= 0 ? (
        <button
          className="w-full bg-white text-black py-1 px-2 rounded-3xl hover:bg-black hover:text-white transition border-2 border-black hover:border-[#d8480b] font-semibold disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:hover:text-gray-500 disabled:hover:border-gray-300"
          onClick={handleAddToCart}
          disabled={(product.qtyInStore ?? 0) <= 0}
        >
          {(product.qtyInStore ?? 0) <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      ) : (
        <div className="flex items-center justify-between w-full bg-[#d8480b] text-white rounded-3xl overflow-hidden">
          <button
            className="h-full px-3 py-2 hover:bg-[#c23c0a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleDecrement}
            disabled={singleQuantity(product?.id) <= 1}
          >
            -
          </button>
          <span className="flex-1 text-center font-semibold">
            {singleQuantity(product?.id)}
          </span>
          <button
            className="h-full px-3 py-2 hover:bg-[#c23c0a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleIncrement}
            disabled={singleQuantity(product?.id) >= (product.qtyInStore ?? 0)}
          >
            +
          </button>
        </div>
      )}

      <div className="mt-2 flex justify-center">
        {product.storeCode !== "STO0715" && (
          <div className="text-center">
            <span className="text-xs text-gray-500">
              {product.storeName} • {product.storeLocationCity}
            </span>
          </div>
        )}
        {product.storeCode === "STO0715" && (
          <div className="text-center">
            <span className="text-xs text-gray-500">
              {product.storeLocationCity}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};