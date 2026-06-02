'use client';
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { ProductProps } from '@/types/index';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { useRouter } from "next/navigation";
import { ExternalLink } from 'lucide-react';

interface ProductDetailsModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    product: ProductProps | null;
}

const ProductDetailsModal = ({ isOpen, setIsOpen, product }: ProductDetailsModalProps) => {
    const { inCart, addToCart, singleQuantity, increment, decrement } = useCart();

    if (!product) return null;

    const discount = product?.salePrice && product.oldPrice
        ? Math.ceil(((product.oldPrice - product.salePrice) / product.oldPrice) * 100)
        : 0;

    const handleAddToCart = () => {
        addToCart(product as any);
    };

    const handleIncrement = () => {
        increment(product as any);
    };

    const handleDecrement = () => {
        decrement(product as any);
    };

    const router = useRouter();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTitle className="sr-only">
                {product.name}
            </DialogTitle>
            <DialogContent
                className="max-w-4xl max-h-[90vh] overflow-y-auto"
                style={{
                    scrollbarWidth: 'none',
                    scrollbarColor: 'transparent',
                }}
            >
                {/* <DialogContent
                className='max-w-[95vw] max-h-[90vh] md:min-w-[80vw] overflow-y-auto rounded-lg p-0 md:p-6'
                style={{
                    scrollbarWidth: 'none',
                    scrollbarColor: 'transparent',
                }}
            > */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
                    <div className="space-y-4">
                        <div className="relative aspect-square">
                            <Image
                                src={product.picture! || "/images/placeholder-image.png"}
                                alt={`No image of ${product.name} available`}
                                fill
                                className="object-cover rounded-lg"
                            />
                            {discount > 0 && (
                                <div className="absolute top-4 right-0 bg-accent text-white px-2 py-1 rounded-md text-sm font-semibold">
                                    {discount}% OFF
                                </div>
                            )}
                            {/* {discount > 0 && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                                    {discount}% OFF
                                </div>
                            )}
                            {product.featured && (
                                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                                    Featured
                                </div>
                            )}
                            {product.onSale && (
                                <div className="absolute top-12 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                                    On Sale
                                </div>
                            )} */}
                        </div>

                        {/* Additional Images */}
                        {/* {product.pictureList && product.pictureList.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.pictureList.map((picture, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <Image
                                            src={picture || product.picture ||''}
                                            alt={`${product.name} view ${index + 1}`}
                                            fill
                                            className="object-cover rounded-md border border-gray-200"
                                            onError={(e) => {
                                                e.currentTarget.src = '';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )} */}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                            <div className="mb-3">
                                <div className=''>
                                    <span className='text-sm text-accent font-semibold'>Category:</span> <span className="text-xs text-gray-500 truncate">{product.category}</span>
                                </div>
                                {product.brand && (
                                    <div>
                                        <span className='text-sm text-accent font-semibold'>Brand:</span> <span className="text-xs text-gray-500 truncate">{product.brand}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-[#d8480b]">
                                    {formatPrice((product.salePrice ?? product.oldPrice)!, product.ccy as CurrencyCode)}
                                </span>
                                {discount > 0 && (
                                    <span className="text-lg text-gray-500 line-through">
                                        {formatPrice(product.oldPrice!, product.ccy as CurrencyCode)}
                                    </span>
                                )}
                            </div>
                            {/* {product.usdPrice && product.usdPrice > 0 && (
                                <p className="text-sm text-gray-600">
                                    {formatPrice(product.usdPrice, 'USD')}
                                </p>
                            )} */}
                            {/* {product.discount && product.discount !== "0.0" && (
                                <p className="text-sm text-green-600 font-semibold">
                                    {product.discount}% discount applied
                                </p>
                            )} */}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <span className={`font-semibold ${(product.qtyInStore ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {(product.qtyInStore ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                            {/* <span className="text-gray-500">
                                {product.qtyInStore ?? 0} units available
                            </span> */}
                            {product.itemSize && (
                                <div className="text-sm text-gray-500">
                                    <span className='text-sm text-accent font-semibold'>Size:</span> <span className="text-xs text-gray-500">{product.itemSize}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {product.description || 'No description available.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Product Information</h4>

                        <div>
                            <span className="text-sm font-medium text-gray-500">Product Code</span>
                            <p className="text-sm text-gray-900">{product.code}</p>
                        </div>

                        {/* {product.brand && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Brand</span>
                                <p className="text-sm text-gray-900">{product.brand}</p>
                            </div>
                        )} */}

                        {product.model && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Model</span>
                                <p className="text-sm text-gray-900">{product.model}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Additional Details</h4>

                        <div>
                            <span className="text-sm font-medium text-gray-500">Stock Available</span>
                            <p className="text-sm text-gray-900">{product.qtyInStore || 0} {`${product.unit}` || 'Pieces'} </p>
                        </div>

                        {product.color && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Color</span>
                                <p className="text-sm text-gray-900">{product.color}</p>
                            </div>
                        )}

                        {/* {product.unit && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Unit</span>
                                <p className="text-sm text-gray-900">{product.unit}</p>
                            </div>
                        )} */}

                        {/* {product.barCode && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Barcode</span>
                                <p className="text-sm text-gray-900">{product.barCode}</p>
                            </div>
                        )} */}
                    </div>
                </div>

                {product.featured || product.onSale ? (
                    <div className="grid gap-6 pt-4 border-t border-gray-200">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 mb-2">Product Status</h4>
                            <div className="flex gap-4">
                                {/* <span className={`font-semibold ${(product.qtyInStore ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(product.qtyInStore ?? 0) > 0 ? 'In stock' : 'Out of stock'}
                        </span> */}
                                {product.featured && (
                                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        Featured
                                    </span>
                                )}
                                {product.onSale && (
                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                        On Sale
                                    </span>
                                )}
                                {product.banner && (
                                    <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                        Banner Product
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className="grid gap-6 pt-4 border-t border-gray-200">
                    <div className="space-y-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Seller's Information</h4>
                        <div className="flex gap-4">
                            <span className="text-sm text-gray-500 flex items-center gap-3">
                                <span
                                    className='flex items-center gap-2'
                                    onClick={() => router.push(`/stores/${product.storeCode}`)}
                                >
                                    <span className='text-accent underline cursor-pointer'>{product.storeName}</span>
                                    <ExternalLink className='text-accent h-4 w-4' />
                                </span>
                                {product.storeLocationCity && (
                                    <>
                                        <span>•</span>
                                        <span>{product.storeLocationCity}</span>
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-6">
                    {singleQuantity(product.id) <= 0 ? (
                        <button
                            className="flex-1 bg-accent text-white py-3 px-6 rounded-lg hover:bg-[#c23d09] transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                            onClick={handleAddToCart}
                            disabled={(product.qtyInStore ?? 0) <= 0}
                        >
                            {(product.qtyInStore ?? 0) <= 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    ) : (
                        <div className="flex items-center justify-between w-full bg-accent text-white rounded-lg overflow-hidden">
                            <button
                                className="h-full px-4 py-3 hover:bg-[#c23c0a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                onClick={handleDecrement}
                                disabled={singleQuantity(product.id) <= 1}
                            >
                                -
                            </button>
                            <span className="flex-1 text-center font-semibold">
                                {singleQuantity(product.id)}
                            </span>
                            <button
                                className="h-full px-4 py-3 hover:bg-[#c23c0a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                onClick={handleIncrement}
                                disabled={singleQuantity(product.id) >= (product.qtyInStore ?? 0)}
                            >
                                +
                            </button>
                        </div>
                    )}
                    <button
                        className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetailsModal;