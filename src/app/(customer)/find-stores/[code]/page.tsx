'use client';
import React, { useState, useRef, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import placeholder from '@/components/images/placeholder-product.webp';
import { Button } from '@/components/ui/button';
import {
    MapPin, Phone, Mail, User, Store,
    Globe, Facebook, Instagram, Search
} from 'lucide-react';
import { ProductCard } from './product-card';
import { ProductProps } from '@/types';

import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice, generateRandomNumber, getCurrentDate } from '@/utils/helperfns';
import { toast } from 'sonner';
import { getAuthCredentials } from '@/utils/auth-utils-customer';
import useCustomer from '@/store/customerStore';
import { AxiosError } from 'axios';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { ArrowIcon, CartIcon, ShopIcon, TiktokIcon } from '@/components/icons/icons';
import { Input } from '@/components/ui/input';
import ProductDetailsModal from '@/utils/product-details';
import { CartDropdown } from '@/components/ui/cart-dropdown';

interface StoreDetail {
    id: number;
    entityCode: string;
    code: string;
    storeName: string;
    address: string;
    logo: string;
    backgroundLogo: string;
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
    workingTime?: string
}

const CategoryPill: React.FC<{
    label: string;
    active: boolean;
    onClick: () => void;
}> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${active
            ? 'bg-faded-accent text-white'
            : 'bg-white border border-gray-200 text-dark-gray hover:border-faded-accent hover:text-faded-accent'
            }`}
    >
        {label}
    </button>
);

const FloatingBar: React.FC<{
    show: boolean;
    count: number;
    total: number;
    ccy: string;
    onClick: () => void;
}> = ({ show, count, total, ccy, onClick }) => {
    if (!show) return null;
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-full flex justify-start px-8 lg:pl-[calc(33.333%+2rem)]">
            <button
                onClick={onClick}
                className="pointer-events-auto flex items-center gap-3 bg-dark-gray text-white text-sm font-semibold rounded-full px-6 py-4 shadow-xl hover:bg-black transition-colors"
            >
                <CartIcon className="w-4 h-4" />
                <span>Proceed to order {count} item{count !== 1 ? 's' : ''}</span>
                <span className="opacity-70">—</span>
                <span>{formatPrice(total, ccy as CurrencyCode)}</span>
            </button>
        </div>
    );
};


const CartButton = React.forwardRef<HTMLButtonElement, {
    count: number;
    onClick: () => void;
}>(({ count, onClick }, ref) => (
    <button
        ref={ref}
        onClick={onClick}
        className="relative rounded-2xl bg-faded-accent gap-1 px-3 py-2 text-white flex items-center justify-center hover:bg-[#c23c0a] transition-colors"
    >
        <CartIcon className="w-5 h-5" />
        {count > 9 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-dark-gray text-white text-[10px] font-bold flex items-center justify-center">
                {count > 9 ? '9+' : count}
            </span>
        )}
        {count <= 9 && (
            <div className="text-white text-sm font-bold flex items-center justify-center">
                {count > 9 ? '9+' : count}
            </div>
        )}
    </button>
));
CartButton.displayName = 'CartButton';


export default function StoreDetailPage() {
    usePageMetadata('Find Stores', 'Explore stores around you and shop from their available products.');
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { customer } = useCustomer();
    const storeCode = params.code as string;

    const cartBtnRef = useRef<HTMLButtonElement>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const {
        cart, getCartTotal, mainCcy, clearCart,
    } = useCart();

    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    const totalAmount = getCartTotal();
    const ccy = mainCcy() || '';

    const { data: storeData, isLoading: storeLoading } = useQuery({
        queryKey: ['store-detail', storeCode],
        queryFn: () => axiosCustomer.request({
            url: '/store/fetch-store-detail', method: 'GET', params: { storeCode },
        }),
    });

    const { data: productsData, isLoading: productsLoading } = useQuery({
        queryKey: ['store-products', storeCode],
        queryFn: () => axiosCustomer.request({
            url: '/ecommerce/products/list', method: 'GET', params: {
                storeCode, entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || 'FTD',
                name: '', category: '', tag: '', pageNumber: 1, pageSize: 1000,
            },
        }),
    });

    const store: StoreDetail = storeData?.data || {};
    const allProducts: ProductProps[] = productsData?.data?.products || [];

    const categories = useMemo(() => {
        const cats = Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean))) as string[];
        return ['All', ...cats];
    }, [allProducts]);

    const products = useMemo(() => {
        const byCategory = activeCategory === 'All'
            ? allProducts
            : allProducts.filter((p) => p.category === activeCategory);

        if (!productSearch.trim()) return byCategory;

        const q = productSearch.toLowerCase();
        return byCategory.filter((p) =>
            p.name?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.storeLocationCity?.toLowerCase().includes(q)
        );
    }, [allProducts, activeCategory, productSearch]);

    const checkoutStoreCode = searchParams.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE;
    const rand = generateRandomNumber(15);
    const currentDate = getCurrentDate();
    const { token, permissions } = getAuthCredentials();
    const isAuth = !!token && Array.isArray(permissions) && permissions.length > 0;

    const { mutate: submitOrder, isPending } = useMutation({
        mutationFn: (data: any) => axiosCustomer.request({
            url: '/store/save-cart', method: 'POST',
            params: { entityCode: customer?.entityCode, storeCode: checkoutStoreCode },
            data,
        }),
        onSuccess: (data) => {
            if (data?.data?.responseCode !== '000') {
                toast.error(data?.data?.desc || 'Something went wrong!');
                return;
            }
            const cartData = {
                ...data.data,
                cartItems: cart.map((item) => ({
                    itemCode: item?.code, itemName: item?.name, price: item?.salePrice,
                    quantity: item?.quantity, amount: item?.subTotal,
                    discount: item?.discount, picture: item?.picture,
                })),
                subtotal: totalAmount, shippingFee: 0, totalAmount,
            };
            sessionStorage.setItem('checkout', JSON.stringify(cartData));
            toast.success(data?.data?.desc || 'Order submitted!');
            router.push(`/find-stores/checkout?storeCode=${checkoutStoreCode}&orderNo=${data?.data?.orderNo}`);
        },
        onError: (err: AxiosError) => {
            if (err.response?.status === 400) toast.error('Please log in first!');
            else toast.error('An error occurred.');
        },
    });

    const handleCheckout = () => {
        const orderItems = cart.map((item) => ({
            itemCode: item?.code, itemName: item?.name, price: item?.salePrice,
            quantity: item?.quantity, amount: item?.subTotal,
            discount: item?.discount, picture: item?.picture,
        }));
        submitOrder({
            channel: 'WEB', cartId: `CART${rand}`, orderDate: currentDate,
            totalAmount, totalDiscount: 0, deliveryOption: '', paymentMethod: '',
            couponCode: '', ccy, deliveryFee: 0, geolocation: '', deviceId: '',
            orderStatus: '', paymentStatus: '',
            deliveryAddress: { id: 0, street: '', landmark: '', postCode: '', city: '', state: '', country: '', addressType: '' },
            cartItems: orderItems,
        });
    };

    if (storeLoading) {
        return (
            <div className="min-h-screen flex flex-col lg:flex-row animate-pulse p-6 space-y-4">
                <div className='w-full lg:w-1/3 lg:sticky lg:top-20 lg:self-start space-y-3'>
                    <div className="h-6 bg-gray-200 rounded w-24" />
                    <div className="h-48 bg-gray-200 rounded-2xl" />
                </div>
                <div className='flex-1 min-w-0 space-y-3 p-4'>
                    <div className="grid grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => <div key={i} className="h-40 bg-gray-200 rounded-xl" />)}
                    </div>
                </div>
            </div>
        );
    }

    if (!store?.code) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-dark-gray mb-1">Store not found</p>
                    <p className="text-xs text-medium-gray font-light mb-4">This store doesn't exist or has been removed.</p>
                    <Button size="sm" onClick={() => router.push('/find-stores')}>Browse All Stores</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <div className="max-w-7xl mx-auto px-2 flex flex-col lg:flex-row gap-6">
                <aside className="w-full lg:w-1/3 lg:sticky lg:top-20 lg:self-start space-y-3">
                    <Button
                        variant='link'
                        onClick={() => router.push('/find-stores')}
                    >
                        <ArrowIcon className="w-3 h-3 rotate-90" />
                        Back
                    </Button>

                    <div className="bg-white rounded-2xl overflow-hidden">
                        <div className="relative w-full h-44">
                            <Image
                                src={store.backgroundLogo || store.logo || placeholder.src}
                                alt={store.storeName}
                                fill className="object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = placeholder.src; }}
                            />
                            {store.workingTime && (
                                <div className='bg-white absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium'>
                                    {store.workingTime}
                                </div>
                            )}
                        </div>

                        <div className="p-4 space-y-2">
                            {store.address && (
                                <div className="flex items-start gap-1.5">
                                    <MapPin className="w-3 h-3 text-medium-gray shrink-0 mt-0.5" />
                                    <p className="text-xs text-medium-gray font-medium">{store.address}</p>
                                </div>
                            )}
                            <p className="text-sm font-semibold text-dark-gray">{store.storeName}</p>
                            {store.businessDescription && (
                                <p className="text-xs text-medium-gray font-normal leading-relaxed">
                                    {store.businessDescription}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 space-y-3">
                        <div className='flex items-center gap-3'>
                            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                <ShopIcon />
                            </div>
                            <div className='flex gap-1 text-xs text-medium-gray font-semibold items-center'>
                                <p>{store.code}</p>
                                <span>•</span>
                                <p>{store.businessType}</p>
                            </div>
                        </div>
                        {[
                            store.manager && { icon: User, label: 'Manager', value: store.manager },
                            store.telephone && { icon: Phone, label: 'Phone', value: store.telephone },
                            store.email && { icon: Mail, label: 'Email', value: store.email },
                        ].filter(Boolean).map(({ icon: Icon, label, value }: any) => (
                            <div key={label} className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                    <Icon className="w-3.5 h-3.5 text-medium-gray" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-medium-gray font-light uppercase tracking-wide">{label}</p>
                                    <p className="text-sm font-medium text-dark-gray">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {(store.website || store.instagram || store.facebook || store.tiktok) && (
                        <div className="bg-white rounded-2xl p-4 space-y-2.5">
                            {store.website && (
                                <a href={store.website.startsWith('http') ? store.website : `https://${store.website}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs text-medium-gray hover:text-faded-accent transition-colors">
                                    <Globe className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate font-light">{store.website}</span>
                                </a>
                            )}
                            {store.instagram && (
                                <div className="flex items-center gap-2 text-xs text-medium-gray">
                                    <Instagram className="w-3.5 h-3.5 shrink-0" />
                                    <span className="font-light">{store.instagram}</span>
                                </div>
                            )}
                            {store.facebook && (
                                <div className="flex items-center gap-2 text-xs text-medium-gray">
                                    <Facebook className="w-3.5 h-3.5 shrink-0" />
                                    <span className="font-light">{store.facebook}</span>
                                </div>
                            )}
                            {store.tiktok && (
                                <div className="flex items-center gap-2 text-xs text-medium-gray">
                                    <TiktokIcon className="w-3.5 h-3.5 shrink-0" />
                                    <span className="font-light">{store.tiktok}</span>
                                </div>
                            )}
                        </div>
                    )}
                </aside>

                <main className="flex-1 min-w-0 bg-white rounded-2xl p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-md font-semibold text-dark-gray">Products from {store.storeName}</p>
                            <p className="text-sm text-medium-gray font-light">
                                Browse through our collection of quality products
                            </p>
                        </div>
                        <div>
                            <CartButton
                                ref={cartBtnRef}
                                count={totalItems}
                                onClick={() => setIsCartOpen((v) => !v)}
                            />

                            <CartDropdown
                                isOpen={isCartOpen}
                                onClose={() => setIsCartOpen(false)}
                                anchorRef={cartBtnRef as React.RefObject<HTMLElement>}
                                onCheckout={() => { setIsCartOpen(false); handleCheckout(); }}
                                isPending={isPending}
                            />
                        </div>
                    </div>

                    {categories.length > 1 && (
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                            {categories.map((cat) => (
                                <CategoryPill
                                    key={cat}
                                    label={cat}
                                    active={activeCategory === cat}
                                    onClick={() => setActiveCategory(cat)}
                                />
                            ))}
                        </div>
                    )}

                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                            type="text"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            placeholder="Search by name, brand, city..."
                            className="w-full pl-9 pr-4 py-2.5 text-sm text-dark-gray placeholder:text-medium-gray"
                        />
                    </div>

                    {productsLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-44 bg-gray-200 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Store className="w-10 h-10 text-medium-gray" />
                            <p className="text-sm font-medium text-dark-gray">
                                {productSearch ? 'No products match your search' : 'No products available'}
                            </p>
                            <p className="text-xs text-medium-gray font-light">
                                {productSearch ? 'Try a different keyword or clear the search' : 'Check back soon for updates'}
                            </p>
                            {productSearch && (
                                <Button variant="link" size="sm" onClick={() => setProductSearch('')}>
                                    Clear search
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={() => { setSelectedProduct(product); setIsProductModalOpen(true); }}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <FloatingBar
                show={totalItems > 0 && !isCartOpen}
                count={totalItems}
                total={totalAmount}
                ccy={ccy}
                onClick={() => setIsCartOpen(true)}
            />

            {isCartOpen && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="w-16 h-16 rounded-full bg-dark-gray text-white flex items-center justify-center shadow-xl hover:bg-black transition-colors"
                    >
                        <span className="text-4xl leading-none">×</span>
                    </button>
                </div>
            )}

            {/* ── Product modal ── */}
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