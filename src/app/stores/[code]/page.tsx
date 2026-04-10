'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import placeholder from "@/components/images/placeholder-product.webp";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    MapPin,
    Phone,
    Mail,
    User,
    Store,
    ArrowLeft,
    Package,
    Globe,
    Facebook,
    Link,
    Instagram,
    ExternalLink,
} from 'lucide-react';
import { ProductCard } from "@/utils/products-card";
import { ProductProps } from '@/types';
import { CartIconWithBadge } from '@/utils/cart-with-badge';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Cart from '@/components/ui/cart';
import ProductDetailsModal from '@/utils/product-details';

interface StoreDetail {
    id: number;
    entityCode: string;
    code: string;
    storeName: string;
    address: string;
    logo: string;
    telephone: string;
    email: string;
    manager: string;
    status: string;
    merchantCode: string;
    website?: string;
    businessType?: string;
    businessDescription?: string;
    instagram?: string;
    tiktok?: string;
    facebook?: string;
}

export default function StoreDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [displayCount, setDisplayCount] = useState(6);
    const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const storeCode = params.code as string;

    const { data: storeData, isLoading: storeLoading } = useQuery({
        queryKey: ['store-detail', storeCode],
        queryFn: () => axiosCustomer.request({
            url: '/store/fetch-store-detail',
            method: 'GET',
            params: { storeCode }
        })
    });

    const { data: productsData, isLoading: productsLoading } = useQuery({
        queryKey: ['store-products', storeCode],
        queryFn: () => axiosCustomer.request({
            url: '/ecommerce/products/list',
            method: 'GET',
            params: {
                storeCode,
                entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || 'FTD',
                name: '',
                category: '',
                tag: '',
                pageNumber: 1,
                pageSize: 1000
            }
        })
    });

    const store: StoreDetail = storeData?.data || {};
    const products: ProductProps[] = productsData?.data?.products || [];
    const displayedProducts = products.slice(0, displayCount);

    const getDisplayValue = (value: any): string => {
        return value?.toString() || 'Not provided';
    };

    const getStatusColor = (status: string): string => {
        if (!status) return 'bg-gray-500 text-white';
        switch (status.toUpperCase()) {
            case 'ACTIVE':
                return 'bg-green-500 text-white';
            case 'INACTIVE':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const loadMoreProducts = () => {
        setDisplayCount(prev => Math.min(prev + 6, products.length));
    };

    const handleProductClick = (product: ProductProps) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    if (storeLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                        <div className="space-y-6">
                            <div className="h-48 bg-gray-300 rounded-2xl"></div>
                            <div className="h-64 bg-gray-300 rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!store || !store.code) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Store not found</h2>
                    <p className="text-gray-600 mb-6">The store you're looking for doesn't exist or has been removed.</p>
                    <Button onClick={() => router.push('/stores')}>
                        Browse All Stores
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/stores')}
                                className="flex items-center space-x-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back to Stores</span>
                            </Button>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                                <SheetTrigger asChild>
                                    <button className="relative p-2 hover:bg-gray-100 rounded-full">
                                        <CartIconWithBadge />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-full sm:max-w-md p-0">
                                    <Cart />
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center space-x-6">
                            <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                                <Image
                                    src={store.logo || `${placeholder.src}`}
                                    alt={store.storeName}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `${placeholder.src}`;
                                    }}
                                />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    {getDisplayValue(store.storeName)}
                                </h1>
                                <div className="flex items-center flex-wrap gap-3 mb-4">
                                    <Badge className={`${getStatusColor(store.status)} px-3 py-1`}>
                                        {getDisplayValue(store.status)}
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center px-3 py-1">
                                        <Store className="h-4 w-4 mr-1" />
                                        {getDisplayValue(store.code)}
                                    </Badge>
                                    <Badge variant="default" className="flex items-center px-3 py-1">
                                        {getDisplayValue(store.businessType)}
                                    </Badge>
                                </div>
                                <p className="text-gray-600">
                                    {getDisplayValue(store.businessDescription || 'Discover amazing products from this store. Browse through their collection and find what you need.')}
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={() => router.push(`/shop`)}
                            className="bg-accent hover:bg-accent/90 text-white whitespace-nowrap"
                            size="lg"
                        >
                            <Package className="h-5 w-5 mr-2" />
                            Browse All Products
                        </Button>
                    </div>
                </div>

                <Card className="border-gray-200 shadow-sm mb-12">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                            Store Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-3">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <User className="h-6 w-6 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Manager</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {getDisplayValue(store.manager)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <MapPin className="h-6 w-6 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {getDisplayValue(store.address)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {store.telephone && (
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-accent/10 rounded-lg">
                                            <Phone className="h-6 w-6 text-accent" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {getDisplayValue(store.telephone)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {store.email && (
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-accent/10 rounded-lg">
                                            <Mail className="h-6 w-6 text-accent" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {getDisplayValue(store.email)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Products from {store.storeName}
                            </h2>
                            <p className="text-gray-600 mt-2">
                                Browse through our collection of quality products
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-accent">{products.length}</p>
                            <p className="text-sm text-gray-600">Total Products</p>
                        </div>
                    </div>

                    {productsLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse">
                                    <div className="h-56 bg-gray-300 rounded-t-xl"></div>
                                    <div className="p-6 space-y-4">
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                        <div className="h-10 bg-gray-300 rounded-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <Card className="border-gray-200">
                            <CardContent className="p-12 text-center">
                                <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                                <h3 className="text-xl font-medium text-gray-900 mb-3">
                                    No products available yet
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    This store hasn't added any products to their collection yet. Check back soon!
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/stores')}
                                >
                                    Browse Other Stores
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {displayedProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onClick={() => handleProductClick(product)}
                                    />
                                ))}
                            </div>

                            {displayCount < products.length && (
                                <div className="text-center mt-12 pt-8 border-t border-gray-200">
                                    <Button
                                        onClick={loadMoreProducts}
                                        variant="outline"
                                        size="lg"
                                        className="border-accent text-accent hover:bg-accent/10 px-8 py-6"
                                    >
                                        View More Products ({products.length - displayCount} remaining)
                                    </Button>
                                </div>
                            )}

                            {displayCount >= products.length && products.length > 0 && (
                                <div className="text-center mt-12 pt-8 border-t border-gray-200">
                                    <p className="text-gray-600 mb-4">
                                        You've viewed all {products.length} products from this store.
                                    </p>
                                    <Button
                                        onClick={() => router.push(`/shop`)}
                                        className="bg-accent hover:bg-accent/90 text-white"
                                    >
                                        Explore More in Shop
                                    </Button>
                                </div>
                            )}

                            {(store.website || store.instagram || store.facebook || store.tiktok) && (
                                <div className="mt-12 pt-8 border-t border-gray-200">
                                    <div className='flex items-center justify-between'>
                                        {store.website && (
                                            <div className='flex items-center gap-2'>
                                                <Globe className='text-xs text-accent' />
                                                <a
                                                    href={store.website.startsWith('http') ? store.website : `https://${store.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-600 text-underline hover:text-accent transition-colors"
                                                >
                                                    {store.website}
                                                </a>
                                            </div>
                                        )}
                                        <div className='flex items-center gap-3'>
                                            {store.instagram && (
                                                <div className='flex items-center gap-2'>
                                                    <Instagram className='text-xs text-accent' />
                                                    <p className="text-gray-600">{store.instagram}</p>
                                                </div>
                                            )}
                                            {store.facebook && (
                                                <div className='flex items-center gap-2'>
                                                    <Facebook className='text-xs text-accent' />
                                                    <p className="text-gray-600">{store.facebook}</p>
                                                </div>
                                            )}
                                            {store.tiktok && (
                                                <div className='flex items-center gap-2'>
                                                    <Link className='text-xs text-accent' />
                                                    <p className="text-gray-600">{store.tiktok}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {selectedProduct && (
                <ProductDetailsModal
                    isOpen={isProductModalOpen}
                    setIsOpen={setIsProductModalOpen}
                    product={selectedProduct}
                />
            )}
        </div>
    );
}