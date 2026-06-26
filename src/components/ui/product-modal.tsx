'use client'
import { ProductProps } from '@/types';
import React, { Suspense } from 'react'
import { Dialog, DialogContent, DialogTitle } from './dialog';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { useCart } from '@/store/cart';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { Product } from '../gadgets/product';
import { getClientIdentifiers } from '@/config/client-config';
// import { parseHTML } from '@/utils/parsed-html';
// import useBackButtonClose from '@/hooks/useBackButtonClose';

type ProductDetailProps = {
    product: ProductProps | null;
    setIsOpen: (isOpen: boolean) => void;
    setModalProduct: (product: ProductProps | null) => void;
}

const ProductDetail = ({ product, setIsOpen, setModalProduct }: ProductDetailProps) => {
    const { addToCart, decrement, increment, inCart, singleQuantity } = useCart()
    const entityCode = getClientIdentifiers().entityCode;
    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: () => {
            return axiosInstance.request({
                method: "GET",
                url: '/ecommerce/products/list',
                params: {
                    name: '',
                    storeCode: '',
                    entityCode: entityCode,
                    category: product?.category || '',
                    tag: '',
                    pageNumber: 1,
                    pageSize: 200
                }
            })
                .then(response => response.data)
        }
    });

    // useBackButtonClose(!!product, () => setIsOpen(false))
    return (
        <Dialog open={!!product} onOpenChange={setIsOpen}>
            <DialogContent
                className='max-w-[95vw] max-h-[90vh] md:min-w-[80vw] overflow-y-auto rounded-lg p-0 md:p-6'
                style={{
                    scrollbarWidth: 'none',
                    scrollbarColor: 'transparent',
                }}
            >
                <DialogTitle className='sr-only'>{product?.name}</DialogTitle>

                {/* Close button for mobile */}
                <button
                    onClick={() => setIsOpen(false)}
                    className='absolute right-4 top-4 z-50 md:hidden bg-white/80 backdrop-blur-sm rounded-full p-2'
                >
                    ✕
                </button>

                {/* Main Content - Simple column layout for mobile */}
                <div className='flex flex-col h-full'>

                    {/* Image Section - Fixed height on mobile */}
                    <div className='relative w-full h-64 md:h-80 lg:h-96 flex-shrink-0 bg-gray-50'>
                        <Image
                            src={product?.picture!}
                            alt={product?.name!}
                            fill
                            className='object-contain p-4'
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority
                        />
                    </div>

                    {/* Scrollable Content Area */}
                    <div className='flex-1 overflow-y-auto p-4 md:p-6'>

                        {/* Product Info - Simple column */}
                        <div className='space-y-4 mb-6'>
                            <div className='flex items-start justify-between'>
                                <h2 className='text-xl md:text-2xl font-semibold flex-1 pr-2'>
                                    {product?.name}
                                </h2>
                                <button className='flex-shrink-0'>
                                    <Heart size={24} className='text-accent' />
                                </button>
                            </div>

                            {/* Price */}
                            <div className='space-y-1'>
                                <span className='text-accent text-2xl md:text-3xl font-bold block'>
                                    {formatPrice(product?.salePrice! || product?.oldPrice!, product?.ccy! as CurrencyCode)}
                                </span>
                                <span className='text-gray-600 text-sm'>
                                    ({formatPrice(product?.usdPrice!, 'USD')})
                                </span>
                            </div>

                            {/* Stock & Rating */}
                            <div className='flex items-center justify-between'>
                                <span className='text-gray-600'>
                                    {product?.qtyInStore} available
                                </span>
                                <div className='flex items-center gap-1'>
                                    <Star size={16} className='text-yellow-400 fill-yellow-400' />
                                    <span className='text-sm'>4.5</span>
                                </div>
                            </div>

                            {/* Category */}
                            <div className='py-2'>
                                <span className='text-gray-600 text-sm'>
                                    Category:{' '}
                                    <span className='inline-block px-2 py-1 text-xs border bg-gray-100 font-medium rounded'>
                                        {product?.category}
                                    </span>
                                </span>
                            </div>

                            {/* Add to Cart - Mobile Optimized */}
                            <div className='sticky bottom-0 bg-white pt-4 pb-2 border-t'>
                                {singleQuantity(product?.id) <= 0 ? (
                                    <button
                                        className='w-full py-4 bg-accent text-white font-semibold rounded-lg text-lg'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product as any)
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                ) : (
                                    <div className='w-full py-3 bg-accent text-white font-semibold rounded-lg flex items-center justify-between px-4'>
                                        <button
                                            className='w-12 h-12 flex items-center justify-center hover:bg-white/20 rounded-lg'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                decrement(product as any)
                                            }}
                                        >
                                            <span className="text-2xl">-</span>
                                        </button>
                                        <span className='text-xl font-bold'>{singleQuantity(product?.id)}</span>
                                        <button
                                            className='w-12 h-12 flex items-center justify-center hover:bg-white/20 rounded-lg'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                increment(product as any)
                                            }}
                                        >
                                            <span className="text-2xl">+</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details Section - Fixed for Mobile */}
                        <div className='mb-6 min-w-0 w-full'>
                            <h3 className='text-lg font-semibold mb-3'>Details</h3>
                            <div className='w-full break-words break-all overflow-hidden text-sm md:text-base text-gray-700'>
                                {/* {parseHTML(product?.description!)} */}
                            </div>
                        </div>

                        {/* Related Products - Simplified for Mobile */}
                        <div className='mb-6'>
                            <h3 className='text-lg font-semibold mb-3'>Related Products</h3>
                            {isLoading ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div key={item} className="animate-pulse h-48 bg-gray-200 rounded-md"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {data?.products?.slice(0, 4).map((product: ProductProps) => (
                                        <Suspense key={product.id}>
                                            <Product
                                                product={product}
                                                onClick={() => {
                                                    setModalProduct(product);
                                                    setIsOpen(true);
                                                }}
                                            />
                                        </Suspense>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProductDetail