'use client'
import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { CheckoutStep, FormData, PaymentMethod } from '@/app/checkout/checkoutContent';
import { useRouter, useSearchParams } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import useCustomer from '@/store/customerStore';
import Loader from '@/components/ui/loader';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type CartViewProps = {
    handlePaymentSelect: (method: PaymentMethod) => void;
    setCurrentStep: (currentStep: CheckoutStep) => void;
    form: UseFormReturn<FormData>;
    paymentMethod?: PaymentMethod;
    setSelectedPayment?: Dispatch<SetStateAction<PaymentMethod>>;
    setWallets?: any;
    orderTotal: number;
    shippingFee: number;
    totalVat: number;
};

const CartView = ({
    handlePaymentSelect,
    setCurrentStep,
    form,
    paymentMethod,
    setSelectedPayment,
    setWallets,
    orderTotal,
    shippingFee,
    totalVat,
}: CartViewProps) => {
    const { cart, getCartTotal, mainCcy } = useCart();
    const ccy = mainCcy();
    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
    const router = useRouter();
    const { customer } = useCustomer();
    const [networks, setNetworks] = useState<any[]>([]);
    const searchParams = useSearchParams();
    const storeCode = searchParams ? searchParams.get('storeCode') || '' : '';
    const [wallets, setLocalWallets] = useState<any[]>([]);

    useEffect(() => {
        if (!searchParams?.get('storeCode')) router.push(`?storeCode=STO0715`);
    }, [router, searchParams]);

    const { data, isLoading } = useQuery({
        queryKey: ['payment-methods'],
        queryFn: () => axiosCustomer.request({
            method: 'GET', url: '/payment-methods/fetch',
            params: { storeCode: customer?.storeCode || storeCode },
        }),
    });

    const allPaymentMethods = data?.data?.list?.filter(
        (m: any) => m?.status?.toUpperCase() === 'ACTIVE'
    ) || [];

    const paymentMethods = allPaymentMethods.filter((m: any) =>
        ['REXPAY', 'WALLET'].includes(m.paymentType?.toUpperCase())
    );

    useEffect(() => {
        if (data?.data) {
            setNetworks(data.data.networks || []);
            const walletData = data.data.wallets || [];
            setLocalWallets(walletData);
            if (setWallets) setWallets(walletData);
        }
    }, [data, setWallets]);

    useEffect(() => {
        const stored = sessionStorage.getItem('checkout');
        if (stored) setCheckoutData(JSON.parse(stored));
    }, []);

    const requiresModal = (code: string) =>
        code === 'CARD_PAYMENT' || code === 'BNPL_3_INSTALLMENTS';

    const handlePaymentClick = (method: any) => {
        setSelectedPaymentMethod(method);
    };

    const handleProceedToPay = () => {
        if (!selectedPaymentMethod) return;

        if (requiresModal(selectedPaymentMethod.code)) {
            setModalOpen(true);
            setSelectedPayment && setSelectedPayment(selectedPaymentMethod.paymentType.toLowerCase());
        } else {
            handlePaymentSelect(selectedPaymentMethod.paymentType.toLowerCase());
            if (setWallets) setWallets(wallets);
        }
    };

    const handleClose = () => {
        setCurrentStep('info');
    };

    const subtotal = orderTotal - shippingFee;

    const totalDiscount = cart.reduce((t, i) => t + (i.oldPrice && i.salePrice && i.oldPrice > i.salePrice
        ? (i.oldPrice - i.salePrice) * i.quantity : 0), 0)

    return (
        <>
            <Dialog open={true} onOpenChange={(open) => {
                if (!open) {
                    handleClose();
                }
            }}>
                <DialogContent
                    className="sm:max-w-md max-h-[90vh] p-0 overflow-y-auto rounded-2xl gap-0 border-0 shadow-xl bg-[#F5F5F5]"
                    showCloseButton={true}
                    onPointerDownOutside={(e) => {
                        e.preventDefault();
                        handleClose();
                    }}
                >
                    <DialogHeader className="sr-only">
                        <DialogTitle>Checkout - Choose Payment Method</DialogTitle>
                    </DialogHeader>

                    <div className="">
                        <h2 className="text-lg font-semibold text-dark-gray mb-4 mx-6 pt-6">Checkout</h2>
                        <div className="bg-white rounded-2xl p-5 mb-4 mx-6">
                            <h3 className="text-sm font-bold text-dark-gray mb-4">Order Summary</h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Subtotal', value: formatPrice(subtotal, ccy as CurrencyCode) },
                                    { label: 'Shipping', value: formatPrice(shippingFee, ccy as CurrencyCode) },
                                    {
                                        label: 'Total Discount',
                                        value: formatPrice(totalDiscount, ccy as CurrencyCode),
                                    },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between">
                                        <span className="text-sm font-semibold text-medium-gray">{label}</span>
                                        <span className="text-sm font-bold text-dark-gray">{value}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between pt-3 border-t-1 border-gray-100">
                                    <span className="text-sm font-bold text-dark-gray">Total</span>
                                    <span className="text-sm font-bold text-dark-gray">
                                        {formatPrice(orderTotal, ccy as CurrencyCode)}
                                    </span>
                                </div>
                                {totalVat > 0 && (
                                    <p className="text-xs text-dark-gray mt-1 text-right">
                                        Includes {formatPrice(totalVat, mainCcy() as any)} Total VAT
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mb-4 mx-6">
                            <h3 className="text-sm font-bold text-dark-gray mb-4">Choose Payment Method</h3>

                            {isLoading ? (
                                <Loader text="Loading payment methods…" />
                            ) : (
                                <div className="flex gap-2">
                                    {paymentMethods.map((method: any) => {
                                        const isSelected = selectedPaymentMethod?.code === method.code;
                                        const isRecommended = method.isRecommended;

                                        return (
                                            <button
                                                key={method.code}
                                                onClick={() => handlePaymentClick(method)}
                                                className={`relative w-full overflow-hidden flex items-start gap-3 p-2 rounded-2xl shadow-md text-left transition-all ${isSelected
                                                    ? 'border-2 border-faded-accent bg-faded-accent/10'
                                                    : 'bg-white hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className={`mt-4.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-faded-accent' : 'border-gray-300'
                                                    }`}>
                                                    {isSelected && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-faded-accent" />
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-1">
                                                        <div className="flex items-center gap-1 mt-4">
                                                            <div className="flex items-center">
                                                                {method.paymentType?.toLowerCase() === 'rexpay' ? (
                                                                    method.logo ? (
                                                                        <img
                                                                            src={method.logo}
                                                                            alt={method.name}
                                                                            className="h-5 object-contain"
                                                                        />
                                                                    ) : (
                                                                        <p className="text-sm font-semibold text-dark-gray">{method.name}</p>
                                                                    )
                                                                ) : (
                                                                    <p className="text-sm font-semibold text-dark-gray">{method.name}</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-1 shrink-0">
                                                            {isRecommended && (
                                                                <span className=" absolute -top-2 -right-2 pt-2 pr-5 bg-faded-accent text-white text-[8px] font-semibold px-1 rounded-sm">
                                                                    {method.recommendedTitle}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {method.features && method.features.length > 0 && (
                                                        <p className="text-xs text-medium-gray font-medium">
                                                            {method.features.join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end bg-white p-4 border-t border-gray-100">
                            <Button
                                onClick={handleProceedToPay}
                                disabled={!selectedPaymentMethod}
                            >
                                Proceed to Payment
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* <CardAlert
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        form={form}
        paymentMethod={paymentMethod!}
        networks={networks}
        wallets={wallets}
        orderTotal={orderTotal}
        totalVat={totalVat}
      /> */}
        </>
    );
};

export default CartView;