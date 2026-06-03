import React, { useEffect, useState } from 'react'
import { SheetContent, SheetFooter, SheetHeader, SheetTitle } from './sheet'
import { ShoppingBag, Plus, Minus, X, ShoppingBagIcon, Trash2, AlertCircle } from 'lucide-react'
import { Button } from './button'
import { useCart } from '@/store/cart'
import { CurrencyCode, formatPrice, generateRandomNumber, getCurrentDate } from '@/utils/helperfns'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import useCustomer from '@/store/customerStore'
import CustomerLoginModal from './customer-login-modal'
import { getAuthCredentials } from '@/utils/auth-utils-customer'
import axiosCustomer from '@/utils/fetch-function-customer'
import useUser from '@/store/userStore'
import { AxiosError } from 'axios'
import axiosInstanceNoAuth from '@/utils/fetch-function-auth'

interface Product {
    storeCode: string
    storeName: string
    id?: number
    code: string
    name: string
    qtyInStore: number
    salePrice: number
    oldPrice?: number
    ccy: string
    picture?: string
    discount?: string,
    vat?: number | null | undefined | string
}

interface CartItem {
    id?: number
    code: string
    name: string
    qtyInStore: number
    salePrice: number
    oldPrice?: number
    ccy: string
    picture?: string
    discount?: string
    quantity: number
    subTotal: number,
    vat?: number | null | undefined | string
}

interface CartItemWithStore extends CartItem {
    storeCode?: string
    storeName?: string
}

const Cart = () => {
    const { cart, decrement, increment, removeItem, mainCcy, getCartTotal, singleQuantity, totalVat } = useCart();
    const ccy = mainCcy();
    const totalAmount = getCartTotal();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { customer } = useCustomer();
    const { user } = useUser();
    const rand = generateRandomNumber(15);
    const { token, permissions } = getAuthCredentials();
    const isUserAuthenticated = !!token && Array.isArray(permissions) && permissions.length > 0;
    const currentDate = getCurrentDate();
    const searchParams = useSearchParams();
    const storeCode = searchParams.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE;

    const { data: allProductsData, refetch: refetchProducts } = useQuery({
        queryKey: ["all-products-cart", storeCode],
        queryFn: () => {
            return axiosInstanceNoAuth.request({
                method: "GET",
                url: '/ecommerce/products/list',
                params: {
                    name: '',
                    storeCode,
                    entityCode: process.env.NEXT_PUBLIC_ENTITYCODE,
                    category: '',
                    tag: '',
                    pageNumber: 1,
                    pageSize: 2000
                }
            }).then(response => response.data)
        },
        enabled: cart.length > 0,
    });

    const [enhancedCart, setEnhancedCart] = useState<CartItemWithStore[]>([]);

    const itemsExceedingStock = enhancedCart.filter(item => {
        const currentQuantity = singleQuantity(item.id);
        return currentQuantity > (item.qtyInStore ?? 0);
    });

    const hasItemsExceedingStock = itemsExceedingStock.length > 0;

    const outOfStockItems = enhancedCart.filter(item => (item.qtyInStore ?? 0) <= 0);
    const hasOutOfStockItems = outOfStockItems.length > 0;
    const isCartEmpty = enhancedCart.length === 0;

    useEffect(() => {
        if (allProductsData?.products && cart.length > 0) {
            const productsMap = new Map<string, Product>();
            allProductsData.products.forEach((product: Product) => {
                productsMap.set(product.code, product);
            });

            const updatedCart = cart.map(item => {
                const freshProduct = item.code ? productsMap.get(item.code) : undefined;
                if (freshProduct) {
                    return {
                        ...item,
                        storeCode: freshProduct.storeCode,
                        storeName: freshProduct.storeName,
                        qtyInStore: freshProduct.qtyInStore,
                        salePrice: freshProduct.salePrice,
                        oldPrice: freshProduct.oldPrice,
                        picture: freshProduct.picture,
                        discount: freshProduct.discount,
                        ccy: freshProduct.ccy,
                        subTotal: freshProduct.salePrice * item.quantity,
                        vat: freshProduct.vat
                    };
                }
                return {
                    ...item,
                    storeCode: 'UNKNOWN',
                    storeName: 'Unknown Store'
                };
            });

            setEnhancedCart(updatedCart);
        } else {
            setEnhancedCart(cart.filter(item => item.id !== undefined).map(item => ({
                ...item,
                storeCode: 'UNKNOWN',
                storeName: 'Unknown Store'
            })));
        }
    }, [cart, allProductsData]);

    useEffect(() => {
        if (cart.length > 0) {
            refetchProducts();
        }
    }, [cart, refetchProducts]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => axiosCustomer.request({
            url: '/store/save-cart',
            method: 'POST',
            params: {
                entityCode: customer?.entityCode,
                storeCode
            },
            data
        }),
        onSuccess: (data) => {
            if (data?.data?.responseCode !== '000') {
                toast.error(data?.data?.desc || data?.data?.responseMessage || 'Something went wrong!')
                return
            }

            const cartData = {
                ...data.data,
                cartItems: enhancedCart.map(item => ({
                    itemCode: item?.code,
                    itemName: item?.name,
                    price: item?.salePrice,
                    quantity: item?.quantity,
                    amount: item?.subTotal,
                    discount: item?.discount,
                    picture: item?.picture,
                    vat: item?.vat
                })),
                subtotal: totalAmount,
                totalVat: totalVat?.(),
                shippingFee: 0,
                totalAmount: totalAmount
            };

            sessionStorage.setItem('checkout', JSON.stringify(cartData))
            toast.success(data?.data?.desc || data?.data?.responseMessage || 'Order submitted successfully!')
            router.push(`/checkout?storeCode=${storeCode || process.env.NEXT_PUBLIC_STORE_CODE}&orderNo=${data?.data?.orderNo}`)
        },
        onError: (error: AxiosError) => {
            if (error.response?.status === 400) {
                toast.error('Please ensure you are logged in!')
                return
            }
            else {
                toast.error('An error occurred while submitting the order.')
            }
        }
    })

    const submitOrder = () => {
        if (!isUserAuthenticated) {
            setIsOpen(true)
            return
        }

        // if (hasMultipleStores) {
        //     toast.error('Multiple stores detected. Please order from one store at a time.')
        //     return;
        // }

        if (hasOutOfStockItems) {
            toast.error('Cannot checkout with out-of-stock items')
            return
        }

        if (hasItemsExceedingStock) {
            toast.error('Some items exceed available stock. Please reduce quantities.')
            return;
        }

        const storeCodes = new Set(enhancedCart.map(item => item.storeCode));
        // if (storeCodes.size > 1) {
        //     toast.error('Please order from one store at a time. Multiple stores detected.')
        //     return;
        // }

        const orderItems = enhancedCart.map(item => ({
            itemCode: item?.code,
            itemName: item?.name,
            price: item?.salePrice,
            quantity: item?.quantity,
            amount: item?.subTotal,
            discount: item?.discount,
            picture: item?.picture,
            vat: item?.vat,
        }))

        const payload = {
            channel: "WEB",
            cartId: `CART${rand}`,
            orderDate: currentDate,
            totalAmount: totalAmount,
            totalDiscount: 0,
            deliveryOption: "",
            paymentMethod: "",
            couponCode: "",
            ccy,
            deliveryFee: 0,
            geolocation: "",
            deviceId: "",
            orderStatus: "",
            paymentStatus: "",
            deliveryAddress: {
                id: 0,
                street: "",
                landmark: "",
                postCode: "",
                city: "",
                state: "",
                country: "",
                addressType: ""
            },
            cartItems: orderItems
        }

        mutate(payload)
    }


    return (
        <>
            <SheetContent className='w-screen lg:min-w-[450px] px-2'>
                <SheetTitle className="sr-only">Cart</SheetTitle>
                <SheetHeader className='w-full items-center border-b gap-1 text-accent text-[18px] font-semibold'>
                    <span><ShoppingBag size={20} strokeWidth={2.5} /></span>
                    <span>{enhancedCart.length > 1 ? `${enhancedCart.length} items` : `${enhancedCart.length} item`}</span>
                </SheetHeader>


                <div className='flex-1 h-full overflow-y-auto py-4'
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#d1d5db transparent',
                        msOverflowStyle: 'none'
                    }}>
                    <style jsx>{`
                        .flex-1::-webkit-scrollbar {
                            width: 6px;
                        }
                        .flex-1::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        .flex-1::-webkit-scrollbar-thumb {
                            background-color: #d1d5db;
                            border-radius: 3px;
                        }
                        .flex-1::-webkit-scrollbar-thumb:hover {
                            background-color: #9ca3af;
                        }
                    `}</style>

                    {enhancedCart.length === 0 && (
                        <div className='flex flex-col items-center justify-center h-full gap-4'>
                            <ShoppingBagIcon className='w-30 h-30 mx-auto text-accent' />
                            <h3 className='font-semibold'>No items in cart</h3>
                        </div>
                    )}

                    <div className="border-t border-gray-100 mt-2">
                        {enhancedCart.map((item, index) => {
                            const isOutOfStock = (item.qtyInStore ?? 0) <= 0;
                            const currentQuantity = singleQuantity(item.id);
                            const exceedsStock = currentQuantity > (item.qtyInStore ?? 0);
                            const overQuantity = currentQuantity - (item.qtyInStore ?? 0);

                            return (
                                <div
                                    key={`${item.id}-${item.quantity}-${index}`}
                                    className={`${enhancedCart.length === index + 1 ? 'border-b-0' : 'border-b'} border-gray-200 relative`}
                                >
                                    {(isOutOfStock || exceedsStock) && (
                                        <div className="absolute inset-0 bg-gray-100 bg-opacity-80 z-10 rounded flex flex-col items-center justify-center gap-2">
                                            {isOutOfStock ? (
                                                <>
                                                    <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                        Out of Stock
                                                    </div>
                                                    <div className="text-red-700 text-sm font-medium text-center px-2">
                                                        {item.name}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                        Exceeds Stock
                                                    </div>
                                                    <div className="text-orange-700 text-sm font-medium text-center px-2">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-orange-600 text-xs text-center px-2">
                                                        You have {overQuantity} more than available stock
                                                    </div>
                                                </>
                                            )}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-medium transition-colors"
                                            >
                                                <Trash2 size={14} />
                                                Remove from cart
                                            </button>
                                        </div>
                                    )}
                                    <div className='p-4 flex items-center gap-3'>
                                        <div className='flex flex-col items-center gap-2'>
                                            <button
                                                onClick={() => !isOutOfStock && !exceedsStock && increment(item)}
                                                disabled={isOutOfStock || exceedsStock || currentQuantity >= (item.qtyInStore ?? 0)}
                                                className={`w-6 h-6 rounded-sm border border-gray-300 flex items-center justify-center hover:bg-gray-100 ${isOutOfStock || exceedsStock || currentQuantity >= (item.qtyInStore ?? 0)
                                                    ? 'bg-gray-200 cursor-not-allowed opacity-50'
                                                    : 'bg-[#f3f4f6]'
                                                    }`}
                                            >
                                                <Plus size={12} />
                                            </button>
                                            <span className={`text-sm font-medium ${(isOutOfStock || exceedsStock) ? 'text-gray-500' : ''}`}>
                                                {currentQuantity}
                                            </span>
                                            <button
                                                onClick={() => !isOutOfStock && !exceedsStock && decrement(item)}
                                                disabled={isOutOfStock || exceedsStock || currentQuantity <= 1}
                                                className={`w-6 h-6 rounded-sm border border-gray-300 flex items-center justify-center hover:bg-gray-100 ${isOutOfStock || exceedsStock || currentQuantity <= 1
                                                    ? 'bg-gray-200 cursor-not-allowed opacity-50'
                                                    : 'bg-[#f3f4f6]'
                                                    }`}
                                            >
                                                <Minus size={12} />
                                            </button>
                                        </div>

                                        <div className={`w-12 h-12 rounded flex items-center justify-center flex-shrink-0 ${(isOutOfStock || exceedsStock) ? 'bg-gray-100' : 'bg-gray-100'
                                            }`}>
                                            {item.picture ? (
                                                <img
                                                    src={item.picture}
                                                    alt={item.name}
                                                    className='w-full h-full object-cover rounded'
                                                />
                                            ) : (
                                                <div className='w-8 h-8 bg-gray-300 rounded'></div>
                                            )}
                                        </div>

                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-center gap-3'>
                                                <h3 className={`font-medium text-sm truncate ${(isOutOfStock || exceedsStock) ? 'text-gray-600' : 'text-gray-900'
                                                    }`}>
                                                    {item.name}
                                                </h3>
                                            </div>
                                            <div className='flex flex-col space-y-1 mt-1'>
                                                <span className={`font-medium text-sm ${(isOutOfStock || exceedsStock) ? 'text-gray-500' : 'text-accent'
                                                    }`}>
                                                    {formatPrice(item.salePrice, item?.ccy as CurrencyCode)}
                                                </span>
                                                <span className={`text-xs ${(isOutOfStock || exceedsStock) ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    1 X {item.quantity} pcs
                                                </span>
                                                {exceedsStock && !isOutOfStock && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <AlertCircle className="w-3 h-3 text-orange-500" />
                                                        <span className="text-xs text-orange-600">
                                                            Stock: {item.qtyInStore} units available
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className='flex flex-col items-end gap-2'>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className={`hover:text-gray-600 ${(isOutOfStock || exceedsStock) ? 'text-gray-400' : 'text-gray-400'
                                                    }`}
                                            >
                                                <X size={16} />
                                            </button>
                                            <div className='flex flex-col items-end'>
                                                <span className={`font-semibold text-sm ${(isOutOfStock || exceedsStock) ? 'text-gray-500' : ''
                                                    }`}>
                                                    {formatPrice(item.subTotal, item?.ccy as CurrencyCode)}
                                                </span>
                                                {item.oldPrice && item.oldPrice > item.salePrice && !isOutOfStock && !exceedsStock && (
                                                    <span className='text-xs text-gray-500 line-through'>
                                                        {formatPrice(item.oldPrice * item.quantity, item?.ccy as CurrencyCode)}
                                                    </span>
                                                )}
                                                <div className='flex justify-between items-center gap-2'>
                                                    {(Number(item?.discount ?? 0) > 0) && !isOutOfStock && !exceedsStock && (
                                                        <>
                                                            <div className="text-accent text-xs font-semibold inline-block">
                                                                {Number(item?.discount ?? 0)}% off {(item.quantity > 1) && (
                                                                    <span>each</span>
                                                                )}
                                                            </div><span>•</span>
                                                        </>
                                                    )}
                                                    {item.oldPrice && item.oldPrice > item.salePrice && !isOutOfStock && !exceedsStock && (
                                                        <span className='text-xs text-green-600'>
                                                            Saved: {formatPrice((item.oldPrice * item.quantity) - item.subTotal, item?.ccy as CurrencyCode)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <SheetFooter>
                    <div className="w-full space-y-3">
                        {hasItemsExceedingStock && (
                            <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                <p className="text-orange-800 text-sm font-medium flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Some items exceed available stock
                                </p>
                                <p className="text-orange-700 text-xs mt-1">
                                    Please reduce quantities to match available stock before checkout.
                                </p>
                                <ul className="text-orange-700 text-xs mt-2 space-y-1">
                                    {itemsExceedingStock.slice(0, 3).map((item, index) => {
                                        const currentQuantity = singleQuantity(item.id);
                                        const overQuantity = currentQuantity - (item.qtyInStore ?? 0);
                                        return (
                                            <li key={index} className="flex items-center justify-between">
                                                <span className="truncate">{item.name}</span>
                                                <span className="font-medium ml-2">
                                                    {currentQuantity} in cart ({item.qtyInStore} available)
                                                </span>
                                            </li>
                                        );
                                    })}
                                    {itemsExceedingStock.length > 3 && (
                                        <li className="text-orange-600">
                                            and {itemsExceedingStock.length - 3} more...
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {hasOutOfStockItems && (
                            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-sm font-medium">
                                    Cannot checkout with out-of-stock items:
                                </p>
                                <ul className="text-red-700 text-xs mt-1 list-disc list-inside">
                                    {outOfStockItems.slice(0, 3).map((item, index) => (
                                        <li key={index}>{item.name}</li>
                                    ))}
                                    {outOfStockItems.length > 3 && (
                                        <li>and {outOfStockItems.length - 3} more...</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="w-full">
                        <Button
                            className={`w-full rounded-full text-white font-semibold p-3 h-full flex items-center text-center justify-between px-4 ${
                                // isCartEmpty || hasOutOfStockItems || hasMultipleStores || hasItemsExceedingStock
                                isCartEmpty || hasOutOfStockItems || hasItemsExceedingStock
                                    ? 'bg-accent-foreground cursor-not-allowed hover:bg-accent-foreground'
                                    : 'bg-accent hover:bg-accent3 transition-colors duration-300'
                                }`}
                            // disabled={isCartEmpty || hasOutOfStockItems || hasMultipleStores || hasItemsExceedingStock || isPending}
                            disabled={isCartEmpty || hasOutOfStockItems || hasItemsExceedingStock || isPending}
                            onClick={submitOrder}
                        >
                            {isPending ? 'Processing Order...' : (
                                <>
                                    <span className=''>
                                        {/* {hasMultipleStores
                                            ? 'Multiple stores detected'
                                            : hasOutOfStockItems
                                                ? 'Remove out-of-stock items'
                                                : hasItemsExceedingStock
                                                    ? 'Reduce quantities to match stock'
                                                    : 'Checkout'
                                        } */}

                                        {hasOutOfStockItems
                                            ? 'Remove out-of-stock items'
                                            : hasItemsExceedingStock
                                                ? 'Reduce quantities to match stock'
                                                : 'Checkout'
                                        }
                                    </span>
                                    {/* {!isCartEmpty && !hasOutOfStockItems && !hasMultipleStores && !hasItemsExceedingStock && ( */}
                                    {!isCartEmpty && !hasOutOfStockItems && !hasItemsExceedingStock && (
                                        <span className="px-4 py-2 rounded-full bg-white text-accent">
                                            {formatPrice(totalAmount, ccy as CurrencyCode)}
                                        </span>
                                    )}
                                </>
                            )}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>

            <CustomerLoginModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    )
}

export default Cart