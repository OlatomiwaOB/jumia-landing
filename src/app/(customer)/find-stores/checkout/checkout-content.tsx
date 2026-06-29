'use client';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useToast } from '@/app/hooks/use-toast';
import { useCart } from '@/store/cart';
import { useForm } from 'react-hook-form';
import CartView from './cart-view';
import { useSearchParams, useRouter } from 'next/navigation';
import CheckoutManager from './checkout-manager';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RexpayPayment from '@/components/checkout/rexpay-payment';
import WalletPayment from '@/components/checkout/wallet-payment';
import { Button } from '@/components/ui/button';
import axiosCustomer from '@/utils/fetch-function-customer';
import useCustomer from '@/store/customerStore'
import Link from 'next/link';
import { usePageMetadata } from '@/hooks/usePageMetadata';

export type PaymentMethod = 'card' | 'card2' | 'crypto_token' | 'bnpl' | 'bank_transfer' | 'tron' | 'rexpay' | 'solana_pay' | 'wallet' | null;
export type CheckoutStep = 'cart' | 'payment' | 'processing' | 'success' | 'info' | 'retry';

export interface CreditScoreData {
    incomeStability: number;
    digitalPaymentHistory: number;
    ecommerceHistory: number;
    creatorIncome: number;
    identityConsistency: number;
    onchainWallet: number;
    behavioralScoring: number;
    socialPresence: number;
    employerVerification: number;
    totalScore: number;
    tier: 'A' | 'B' | 'C';
    limit: number;
    installments: number;
}

const formSchema = z.object({
    shippingMethod: z.enum(["delivery", "pickup"]).optional(),
    shippingOption: z.string().optional(),
    pickupStore: z.number().optional(),
    fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
    country: z.string().min(1, "Please select a country"),
    addressType: z.string().min(1, "Please select address type").optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    street: z.string().optional(),
    selectedAddressId: z.number().optional(),
    landmark: z.string().optional(),
    agreeTerms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms and conditions",
    }),
});

export type FormData = z.infer<typeof formSchema>;

const CheckoutContent = () => {
    usePageMetadata('Checkout', 'Kindly complete your shipping info to proceed.');
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('info');
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
    const [wallets, setWallets] = useState<any | null>(null)
    const [checkoutData, setCheckoutData] = useState<any>(null)
    const [isRexpayCallback, setIsRexpayCallback] = useState(false);
    const [orderTotal, setOrderTotal] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const [totalVat, setTotalVat] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const clientIdentifier = getClientIdentifiers();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            shippingMethod: "delivery",
            fullName: "",
            country: "",
            city: "",
            state: "",
            zipCode: "",
            agreeTerms: false,
        },
    });

    const searchParams = useSearchParams()
    const router = useRouter();
    const storeCode = searchParams.get('storeCode') || ''
    const { toast } = useToast();
    const { getCartTotal } = useCart();
    const { customer } = useCustomer();

    const handleVatUpdate = useCallback((vat: number) => {
        if (vat === totalVat) {
            return;
        }

        setTotalVat(vat);
        updateCheckoutWithAllValues(subtotal, shippingFee, vat);
    }, [totalVat, subtotal, shippingFee]);

    const handleSubtotalUpdate = useCallback((newSubtotal: number) => {
        if (newSubtotal === subtotal) {
            return;
        }

        setSubtotal(newSubtotal);
        updateCheckoutWithAllValues(newSubtotal, shippingFee, totalVat);
    }, [subtotal, shippingFee, totalVat]);

    const handleTotalUpdate = useCallback((newTotal: number) => {
        if (newTotal === orderTotal) {
            return;
        }

        setOrderTotal(newTotal);
    }, [orderTotal]);

    const updateCheckoutWithAllValues = useCallback((subtotalVal: number, shippingVal: number, vatVal: number) => {
        const totalAmount = subtotalVal + shippingVal + vatVal;

        const stored = sessionStorage.getItem('checkout');
        const parsedData = stored ? JSON.parse(stored) : {};

        const formValues = form.getValues();

        const updatedData = {
            ...parsedData,
            subtotal: subtotalVal,
            shippingFee: shippingVal,
            totalVat: vatVal,
            totalAmount: totalAmount,

            deliveryAddress: {
                id: formValues.selectedAddressId || 0,
                street: formValues.street || "",
                landmark: formValues.landmark || "",
                postCode: formValues.zipCode || "",
                city: formValues.city || "",
                state: formValues.state || "",
                country: formValues.country || "",
                addressType: formValues.addressType || ""
            },
            shippingMethod: formValues.shippingMethod || "delivery",
            selectedStore: formValues.pickupStore || 0
        };

        sessionStorage.setItem('checkout', JSON.stringify(updatedData));
        setCheckoutData(updatedData);

    }, [selectedPayment, form]);

    useEffect(() => {
        const stored = sessionStorage.getItem('checkout');
        if (stored) {
            const parsedData = JSON.parse(stored);
            setCheckoutData(parsedData);

            const subtotalVal = parsedData.subtotal || getCartTotal();
            const shippingVal = parsedData.shippingFee || 0;
            const vatVal = parsedData.totalVat || 0;
            const totalAmount = subtotalVal + shippingVal + vatVal;

            setSubtotal(subtotalVal);
            setShippingFee(shippingVal);
            setTotalVat(vatVal);
            setOrderTotal(totalAmount);
        } else {
            const subtotalVal = getCartTotal();
            const shippingVal = 0;
            const vatVal = 0;
            const totalAmount = subtotalVal + shippingVal + vatVal;

            const initialCheckoutData = {
                subtotal: subtotalVal,
                shippingFee: shippingVal,
                totalVat: vatVal,
                totalAmount: totalAmount
            };

            sessionStorage.setItem('checkout', JSON.stringify(initialCheckoutData));
            setCheckoutData(initialCheckoutData);
            setSubtotal(subtotalVal);
            setShippingFee(shippingVal);
            setTotalVat(vatVal);
            setOrderTotal(totalAmount);
        }
    }, [getCartTotal]);

    useEffect(() => {
        if (!checkoutData) return;

        const subtotal = checkoutData.subtotal || getCartTotal();
        const shipping = checkoutData.shippingFee || 0;
        const vat = checkoutData.totalVat || 0;

    }, [selectedPayment, checkoutData, getCartTotal]);

    useEffect(() => {
        const status = searchParams.get('status');
        if (status === 'rexpay_callback') {
            setIsRexpayCallback(true);
            setSelectedPayment('rexpay');
            setCurrentStep('payment');

            const url = new URL(window.location.href);
            url.searchParams.delete('status');
            window.history.replaceState({}, '', url.toString());
        }
    }, [searchParams]);

    useEffect(() => {
        const savedFormData = sessionStorage.getItem('checkoutFormData');
        if (savedFormData) {
            try {
                const formData = JSON.parse(savedFormData);
                form.reset(formData);
            } catch (error) {
                console.error('Error loading saved form data:', error);
            }
        }

        const subscription = form.watch((value) => {
            sessionStorage.setItem('checkoutFormData', JSON.stringify(value));
        });

        return () => subscription.unsubscribe();
    }, [form]);

    const updateCheckoutData = useCallback((shippingCost: number) => {
        if (shippingCost === shippingFee) {
            return;
        }

        setShippingFee(shippingCost);
        updateCheckoutWithAllValues(subtotal, shippingCost, totalVat);
    }, [subtotal, totalVat, updateCheckoutWithAllValues, shippingFee]);

    useEffect(() => {
        if (!checkoutData) return;

        const subtotalVal = checkoutData.subtotal || getCartTotal();
        const shippingVal = checkoutData.shippingFee || 0;
        const vatVal = checkoutData.totalVat || 0;

    }, [selectedPayment, checkoutData, getCartTotal]);

    const handlePaymentSelect = (method: PaymentMethod) => {
        setSelectedPayment(method);
        setCurrentStep('payment');
    };

    const handleRexpaySuccess = () => {
        setCurrentStep('success');
        setIsRexpayCallback(false);
    };

    const handleDownloadReceipt = async () => {
        try {
            if (!checkoutData?.orderNo) {
                toast({
                    title: "Error",
                    description: "Order information not found",
                    variant: "destructive",
                });
                return;
            }

            const isDelivery = checkoutData.shippingMethod === 'delivery';

            const receiptPayload = {
                orderNo: checkoutData.orderNo,
                entityCode: customer?.entityCode || clientIdentifier?.entityCode,
                customerEmail: customer?.username || "",
                ordDate: checkoutData.orderDate,
                // salePerson: "",
                storeCode: storeCode || checkoutData.storeCode || "STO0715",
                delivery: isDelivery,
                pickupId: isDelivery ? undefined : checkoutData.selectedStore,
            };

            const response = await axiosCustomer.post(
                '/sale-receipt/generate-pdf?download=true',
                receiptPayload,
                {
                    responseType: 'blob',
                }
            );

            const blob = new Blob([response.data], { type: 'application/pdf' });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `receipt-${checkoutData.orderNo}.pdf`;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast({
                title: "Success",
                description: "Receipt downloaded successfully",
            });

        } catch (error) {
            console.error('Error downloading receipt:', error);
            toast({
                title: "Error",
                description: "Failed to download receipt. Please try again.",
                variant: "destructive",
            });
        }
    };

    const PaymentView = () => {

        if (selectedPayment === 'rexpay') {
            return (
                <RexpayPayment
                    setCurrentStep={setCurrentStep}
                    setSelectedPayment={setSelectedPayment}
                    isCallback={isRexpayCallback}
                    onSuccess={handleRexpaySuccess}
                    form={form}
                    orderTotal={orderTotal}
                    totalVat={totalVat}

                />
            );
        }

        if (selectedPayment === 'wallet') {
            return (
                <WalletPayment
                    setCurrentStep={setCurrentStep}
                    setSelectedPayment={setSelectedPayment}
                    orderTotal={orderTotal}
                    form={form}
                    totalVat={totalVat}
                />
            );
        }

        return null;
    };

    const SuccessView = () => (
        <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-muted-foreground">Your order has been placed successfully.</p>
            <Button onClick={() => router.push('/orders')} className="w-full">
                View Orders
            </Button>
            <div className='flex w-full'>
                <Button
                    variant="outline"
                    onClick={handleDownloadReceipt}
                    className="w-1/2"
                >
                    Download Receipt
                </Button>
                <Button asChild variant="outline" className="w-1/2">
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen px-2 bg-[#f7f7f7]">
            <div className="max-w-7xl mx-auto">
                {(currentStep === 'info' || currentStep === 'cart') && (
                    <CheckoutManager
                        setCurrentStep={setCurrentStep}
                        form={form}
                        onShippingUpdate={updateCheckoutData}
                        onVatUpdate={handleVatUpdate}
                        onSubtotalUpdate={handleSubtotalUpdate}
                        onTotalUpdate={handleTotalUpdate}
                    />
                )}

                {currentStep === 'cart' && (
                    <CartView
                        handlePaymentSelect={handlePaymentSelect}
                        setCurrentStep={setCurrentStep}
                        paymentMethod={selectedPayment}
                        setSelectedPayment={setSelectedPayment}
                        setWallets={setWallets}
                        form={form}
                        orderTotal={orderTotal}
                        shippingFee={shippingFee}
                        totalVat={totalVat}
                    />
                )}

                {currentStep === 'payment' && <PaymentView />}
                {currentStep === 'success' && <SuccessView />}
            </div>
        </div>
    );
};

export default CheckoutContent;