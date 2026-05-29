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

    const qty = singleQuantity(product?.id);
    const isOutOfStock = (product.qtyInStore ?? 0) <= 0;

    const discount = product?.salePrice && product?.oldPrice && product.oldPrice > product.salePrice
        ? Math.ceil(((product.oldPrice - product.salePrice) / product.oldPrice) * 100)
        : 0;

    const handleAdd = (e: React.MouseEvent) => {
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
            className="bg-white rounded-xl border-1 border-gray-100 cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
            onClick={onClick}
        >
            <div className="relative w-full h-36 bg-gray-50 border-b-1 border-gray-100 flex items-center justify-center">
                <Image
                    src={product.picture || '/images/placeholder-image.png'}
                    alt={product.name || 'Product'}
                    fill
                    className="object-contain p-3"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder-image.png'; }}
                />

                {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-[#d8480b] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                        {discount}% OFF
                    </span>
                )}

                <div className="absolute bottom-2 right-2" onClick={(e) => e.stopPropagation()}>
                    {qty <= 0 ? (
                        <button
                            onClick={handleAdd}
                            disabled={isOutOfStock}
                            className="w-8 h-8 rounded-full bg-dark-gray text-white flex items-center justify-center hover:bg-black transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            <span className="text-lg leading-none">+</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-1.5 bg-dark-gray text-white rounded-full px-2.5 py-1">
                            <button
                                onClick={handleDecrement}
                                disabled={qty <= 1}
                                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors disabled:opacity-40"
                            >
                                <span className="text-sm leading-none">−</span>
                            </button>
                            <span className="text-sm font-semibold min-w-[14px] text-center">{qty}</span>
                            <button
                                onClick={handleIncrement}
                                disabled={qty >= (product.qtyInStore ?? 0)}
                                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors disabled:opacity-40"
                            >
                                <span className="text-sm leading-none">+</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-3 py-2.5">
                <div className='flex items-center gap-2'>
                    <p className="text-sm font-medium text-medium-gray line-clamp-2 leading-snug">
                        {product.name}
                    </p>
                    {isOutOfStock && (
                        <p className="text-[10px] text-red-400 font-light">Out of stock</p>
                    )}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm font-semibold text-dark-gray">
                        {formatPrice(product.salePrice || product.oldPrice || 0, product.ccy as CurrencyCode)}
                    </span>
                    {discount > 0 && product.oldPrice && (
                        <span className="text-xs text-medium-gray font-light line-through">
                            {formatPrice(product.oldPrice, product.ccy as CurrencyCode)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};