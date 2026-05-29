import { useEffect, useState } from 'react';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { CheckoutStep } from '@/app/checkout/checkoutContent';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import Image from 'next/image';
import placeholder from '@/components/images/placeholder-product.webp';
import { DeleteIcon, SecurePaymentIcon } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';

interface PickupLocation {
    id: number; name: string; status: string; location: string;
    distance?: number; timeframe?: string; contact?: string; amount: number;
}

interface DeliveryOption {
    id: string; name: string; price: number; description: string;
    icon: string; estimatedArrival: string; area: string; groupCode: string;
    estimatedTime: number; estimatedTimeType: string; amount: number; deliveryVatAmount: number;
}

interface CartSidebarProps {
    selectedShippingOption?: DeliveryOption | null;
    shippingMethod?: 'delivery' | 'pickup' | null;
    setCurrentStep: (step: CheckoutStep) => void;
    form: UseFormReturn<any>;
    selectedStore?: number | null;
    selectedAddressId?: number | null;
    onVatUpdate?: (vat: number) => void;
    onSubtotalUpdate?: (subtotal: number) => void;
    onTotalUpdate?: (total: number) => void;
}

export const CartSidebar = ({
    selectedShippingOption,
    shippingMethod = null,
    setCurrentStep,
    form,
    selectedStore,
    onVatUpdate,
    onSubtotalUpdate,
    onTotalUpdate,
}: CartSidebarProps) => {
    const { cart, getCartTotal, mainCcy, decrement, increment, removeItem } = useCart();
    const [checkoutData, setCheckoutData] = useState<any>(null);

    const { getValues } = form;

    const { data: pickupData } = useQuery({
        queryKey: ['pickup-locations'],
        queryFn: () => axiosCustomer.request({ url: '/ecommerce/pickup-location/all', method: 'GET' }),
        enabled: shippingMethod === 'pickup',
    });

    const activePickupLocations = pickupData?.data?.pickupLocations?.filter(
        (l: PickupLocation) => l?.status?.toUpperCase() === 'ACTIVE'
    ) || [];

    const getSelectedPickupLocation = (): PickupLocation | null => {
        if (!selectedStore) return null;
        return activePickupLocations.find((l: PickupLocation) => l.id === selectedStore) || null;
    };

    const isSelectedStoreActive = () => {
        if (shippingMethod !== 'pickup' || !selectedStore) return true;
        return activePickupLocations.some((l: any) => l.id === selectedStore);
    };

    useEffect(() => {
        const stored = sessionStorage.getItem('checkout');
        if (stored) setCheckoutData(JSON.parse(stored));
    }, []);

    const totalVat = cart.reduce((t, item) => t + ((item as any).vat || 0) * item.quantity, 0);

    const totalDiscountAmount = cart.reduce((t, item) => {
        if (item.oldPrice && item.salePrice && item.oldPrice > item.salePrice) {
            return t + (item.oldPrice - item.salePrice) * item.quantity;
        }
        return t;
    }, 0);

    const subtotal = getCartTotal();
    const selectedPickupLocation = getSelectedPickupLocation();
    const pickupAmount = selectedPickupLocation?.amount || 0;

    const shipping = shippingMethod === 'delivery' && selectedShippingOption
        ? selectedShippingOption.price
        : shippingMethod === 'pickup' && selectedStore ? pickupAmount : 0;

    const shippingVat = shippingMethod === 'delivery' && selectedShippingOption
        ? selectedShippingOption.deliveryVatAmount || 0 : 0;

    const total = subtotal + shipping + totalVat;
    const totalVatWithShippingVat = totalVat + shippingVat


    const shippingName = shippingMethod === 'delivery' && selectedShippingOption
        ? selectedShippingOption.name
        : shippingMethod === 'pickup' && selectedStore
            ? `Store Pickup - ${selectedPickupLocation?.name || ''}`
            : 'No shipping method';

    const isDeliveryAddressComplete = () => {
        const v = getValues();
        if (!v.selectedAddressId) return false;
        return !!v.street?.trim() && !!v.city?.trim() && !!v.country?.trim();
    };

    const isPickupDataPresent = () => {
        const v = getValues();
        return !!v.pickupStore || v.addressType === 'WAREHOUSE' ||
            v.fullName?.includes('Store') || v.fullName?.includes('Hub');
    };

    const validateContinue = (): boolean => {
        if (!shippingMethod) return false;
        const v = getValues();
        if (shippingMethod === 'delivery') {
            return isDeliveryAddressComplete() && !!v.shippingOption && !isPickupDataPresent();
        }
        if (shippingMethod === 'pickup') {
            return !!v.pickupStore && !v.shippingOption && isSelectedStoreActive();
        }
        return false;
    };

    const isButtonDisabled = !validateContinue();

    const handlePay = () => {
        if (!validateContinue()) {
            if (!shippingMethod) { toast.error('Please select a shipping method'); return; }
            if (shippingMethod === 'delivery') {
                const v = getValues();
                if (!v.selectedAddressId) toast.error('Please select a delivery address');
                else if (!isDeliveryAddressComplete()) toast.error('Selected delivery address is incomplete');
                else if (!v.shippingOption) toast.error('Please select a shipping option');
                else if (isPickupDataPresent()) toast.error('Please select a delivery address properly');
            }
            if (shippingMethod === 'pickup') {
                if (!selectedStore) toast.error('Please select a pickup store');
                else if (!isSelectedStoreActive()) toast.error('Selected pickup location is unavailable');
            }
            return;
        }

        const formValues = getValues();
        const shippingAmount = shippingMethod === 'delivery' && selectedShippingOption
            ? selectedShippingOption.price
            : shippingMethod === 'pickup' && selectedStore ? pickupAmount : 0;

        const updatedCheckout = {
            ...checkoutData,
            subtotal, shippingFee: shippingAmount, shippingName,
            totalAmount: subtotal + shippingAmount + totalVat,
            totalVat: totalVat + shippingVat,
            totalDiscount: totalDiscountAmount,
            shippingMethod, selectedShippingOption, selectedStore,
            fullName: formValues.fullName,
        };

        sessionStorage.setItem('checkout', JSON.stringify(updatedCheckout));
        onVatUpdate?.(totalVat + shippingVat);
        onSubtotalUpdate?.(subtotal);
        onTotalUpdate?.(total);
        setCurrentStep('cart');
    };

    const formatShipping = () => {
        if (!shippingMethod) return '—';
        if (shippingMethod === 'delivery') {
            return selectedShippingOption ? formatPrice(shipping, mainCcy() as any) : '—';
        }
        return selectedStore ? formatPrice(shipping, mainCcy() as any) : '—';
    };

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-100 sticky">
            <div className="px-5 pt-4">
                <h3 className="text-sm font-semibold text-dark-gray">Your cart</h3>
            </div>

            <div className="px-5 py-4 space-y-4 max-h-[200px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                {cart.map((item, idx) => {
                    const qty = item.quantity;
                    const itemVat = (item as any).vat || 0;
                    const itemTotalVat = itemVat * item.quantity;
                    const itemDiscountAmount = item.oldPrice && item.salePrice
                        ? (item.oldPrice - item.salePrice) * item.quantity
                        : 0;

                    const isLast = idx === cart.length - 1;
                    return (
                        <div key={`${item.id}-${idx}`} className={`flex items-center gap-3 pb-4 ${isLast ? 'border-none' : 'border-b-1 border-gray-100'}`}>
                            <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden shrink-0 relative border border-gray-100">
                                <Image
                                    src={item.picture || placeholder.src}
                                    alt={item.name || ''}
                                    fill className="object-contain p-1" sizes="48px"
                                    onError={(e) => { (e.target as HTMLImageElement).src = placeholder.src; }}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-dark-gray truncate">{item.name}</p>
                                <div className="flex items-center max-w-fit gap-1.5 border-1 border-gray-100 rounded-full px-2 py-0.5">
                                    <button
                                        onClick={() => decrement(item as any)}
                                        disabled={qty <= 1}
                                        className="w-5 h-5 flex items-center justify-center rounded-full text-dark-gray hover:bg-gray-200 transition-colors disabled:opacity-40"
                                    >
                                        <span className="text-sm leading-none">−</span>
                                    </button>
                                    <span className="text-sm font-semibold text-dark-gray min-w-[16px] text-center">
                                        {qty}
                                    </span>
                                    <button
                                        onClick={() => increment(item as any)}
                                        disabled={qty >= (item.qtyInStore ?? 0)}
                                        className="w-5 h-5 flex items-center justify-center rounded-full text-dark-gray hover:bg-gray-200 transition-colors disabled:opacity-40"
                                    >
                                        <span className="text-sm leading-none">+</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                    <DeleteIcon className="w-3.5 h-3.5" />
                                </button>
                                <div className='flex tems-center gap-1'>
                                    <div className='flex flex-col gap-0.5 text-end'>
                                        <div className='flex flex-row gap-1'>
                                            <div className='text-xs flex items-center gap-1 text-medium-gray font-light'>
                                                <span>
                                                    {qty}x pcs
                                                </span>
                                                <span>−</span>
                                            </div>
                                            <span className="text-sm font-semibold text-dark-gray">
                                                {formatPrice(item.subTotal, (item.ccy) as CurrencyCode)}
                                            </span>
                                            {(item.oldPrice ?? 0) > item.subTotal && (
                                                <span className="text-[10px] text-medium-gray font-light line-through">
                                                    {formatPrice(item.oldPrice ?? 0, item.ccy as CurrencyCode)}
                                                </span>
                                            )}
                                        </div>
                                        {itemVat > 0 && (
                                            <div className="text-xs font-medium text-dark-gray">
                                                VAT: {formatPrice(itemTotalVat, mainCcy() as any)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="px-5 py-4 border-t border-gray-100 space-y-2">
                {[
                    { label: 'Subtotal', value: formatPrice(subtotal, mainCcy() as any) },
                    { label: 'Shipping', value: formatShipping() },
                    { label: 'Total Discount', value: formatPrice(totalDiscountAmount, mainCcy() as any) },
                ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                        <span className="text-sm text-medium-gray font-medium">{label}</span>
                        <span className="text-sm font-bold text-dark-gray">{value}</span>
                    </div>
                ))}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm font-semibold text-dark-gray">Total</span>
                    <span className="text-sm font-bold text-dark-gray">
                        {shippingMethod && (shippingMethod === 'delivery' ? selectedShippingOption : selectedStore)
                            ? formatPrice(total, mainCcy() as any)
                            : '—'
                        }
                    </span>
                </div>
                {totalVat > 0 && (
                    <p className="text-xs text-dark-gray mt-1 text-right">
                        Includes {formatPrice(totalVatWithShippingVat, mainCcy() as any)} Total VAT
                    </p>
                )}
            </div>

            <div className="px-5 pb-5">
                <Button
                    onClick={handlePay}
                    disabled={isButtonDisabled}
                    className='w-full h-12'
                >
                    {isButtonDisabled
                        ? 'Complete Shipping Info'
                        : `Pay ${shippingMethod && (shippingMethod === 'delivery' ? selectedShippingOption : selectedStore)
                            ? formatPrice(total, mainCcy() as any)
                            : ''
                        }`
                    }
                </Button>

                <div className="flex gap-2 mt-3 justify-center items-center text-center ">
                    <div className='max-w-xs'>
                        <div className='flex gap-2 items-center justify-center'>
                            <SecurePaymentIcon />
                            <p className="text-sm font-medium text-dark-gray">Your Payment is Secure</p>
                        </div>
                        <p className="text-xs text-medium-gray font-semibold leading-tight mt-0.5">
                            We protect your payment information with industry standard security measures.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};