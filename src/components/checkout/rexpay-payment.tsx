import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Building2, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice, getCurrentDate } from '@/utils/helperfns';
import { CheckoutStep, PaymentMethod, FormData } from '@/app/checkout/checkoutContent';
import { toast } from 'sonner';
import RexPayClient from '@/lib/rexpay-client';
import rexpay from '@/components/images/rexpay.png'
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import useCustomer from '@/store/customerStore';
import { useLocationStore } from '@/store/locationStore';
import { UseFormReturn } from 'react-hook-form';
import { useGuestCheckoutStore } from '@/store/guestCheckoutStore';
import { buildGuestOrderPayload } from '@/utils/guest-checkout-helpers';

type RexpayPaymentProps = {
    setCurrentStep: (step: CheckoutStep) => void;
    setSelectedPayment: (method: PaymentMethod) => void;
    isCallback?: boolean;
    onSuccess?: () => void;
    onEmailExists?: () => void;
    form: UseFormReturn<FormData>;
    orderTotal: number;
    totalVat: number;
}

const RexpayVerificationManager = {
    isVerifying: false,
    hasCompleted: false,
    transactionId: null as string | null,

    reset() {
        this.isVerifying = false;
        this.hasCompleted = false;
        this.transactionId = null;
    },

    canVerify(): boolean {
        return !this.hasCompleted && !this.isVerifying;
    },

    startVerification(tranId: string): boolean {
        if (!this.canVerify()) {
            return false;
        }

        this.isVerifying = true;
        this.transactionId = tranId;
        return true;
    },

    completeVerification() {
        this.isVerifying = false;
        this.hasCompleted = true;
    }
};

const RexpayPayment = ({
    setCurrentStep,
    setSelectedPayment,
    isCallback = false,
    onSuccess,
    onEmailExists,
    form,
    orderTotal,
    totalVat
}: RexpayPaymentProps) => {
    const { cart, clearCart, mainCcy } = useCart();
    const { customer } = useCustomer();
    const { location } = useLocationStore();
    const currency = mainCcy();
    const total = orderTotal;
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [formData, setFormData] = useState<FormData | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentDate = getCurrentDate();

    const hasSubmittedOrder = useRef(false);
    const storeCode = searchParams.get('storeCode') || '';
    const orderNo = searchParams.get('orderNo') || '';
    const hasHandledCallback = useRef(false);

    const clearRexpaySession = useCallback(() => {
        try {
            sessionStorage.removeItem('rexpay_tranId');
            sessionStorage.removeItem('rexpay_reference');
            sessionStorage.removeItem('rexpay_clientId');
            sessionStorage.removeItem('checkoutFormData');
            // console.log('RexPay session cleared');
        } catch (e) {
            console.warn('Failed to clear RexPay session:', e);
        }
    }, []);

    const handleSubmitOrder = useCallback(() => {
        if (hasSubmittedOrder.current) {
            // console.log('Order submission already completed, skipping');
            return;
        }

        if (isSubmitting) {
            // console.log('Order submission already in progress, skipping');
            return;
        }

        if (!checkoutData && !orderNo) {
            // console.error('Missing checkout data and order number');
            toast.error('Missing order information. Please try again.');
            setVerificationStatus('failed');
            return;
        }

        if (!customer) {
            // console.error('Customer information not available');
            toast.error('Customer information not found. Please login again.');
            setVerificationStatus('failed');
            return;
        }

        const subTotal = cart.reduce((sum, item) => {
            return sum + ((item.salePrice || 0) * item.quantity);
        }, 0);

        const shippingFee = checkoutData?.shippingFee || 0;

        const orderItems = cart.map(item => ({
            itemCode: item?.code,
            itemName: item?.name,
            storeCode: item?.storeCode,
            price: item?.salePrice,
            quantity: item?.quantity,
            amount: (item?.salePrice || 0) * item.quantity,
            discount: item?.discount || 0,
            picture: item?.picture,
            vat: (item as any).vat || 0,
            vatRate: (item as any).vatRate || 0,
        }));

        const currentFormData = formData || form.getValues();
        // console.log('Using form data for order:', currentFormData);

        const payload = {
            channel: "WEB",
            cartId: checkoutData?.orderNo || orderNo,
            orderDate: currentDate,
            totalAmount: total,
            subTotal: subTotal,
            taxAmount: totalVat,
            totalDiscount: checkoutData?.totalDiscount || 0,
            deliveryOption: currentFormData.shippingMethod || "delivery",
            paymentMethod: 'REXPAY',
            couponCode: "",
            ccy: currency,
            deliveryFee: shippingFee,
            deliveryOptionGroup: checkoutData?.shippingName || '',
            geolocation: location ? `${location?.latitude}, ${location?.longitude}` : '',
            deviceId: customer?.deviceID,
            orderStatus: "COMPLETED",
            paymentStatus: "PAID",
            storeCode: storeCode || customer?.storeCode || storeCode,
            customerName: customer?.fullname,
            username: customer?.username,
            deliveryAddress: {
                id: currentFormData.selectedAddressId || 0,
                street: currentFormData.street || "",
                landmark: currentFormData.landmark || "",
                postCode: currentFormData.zipCode || "",
                city: currentFormData.city || "",
                state: currentFormData.state || "",
                country: currentFormData.country || "",
                addressType: currentFormData.addressType || "WAREHOUSE"
            },
            cartItems: orderItems
        };

        // console.log('Submitting RexPay order payload:', payload);
        // console.log('Breakdown:', {
        //     subTotal: subTotal,
        //     taxAmount: totalVat,
        //     deliveryFee: shippingFee,
        //     totalAmount: total,
        //     calculatedTotal: subTotal + totalVat + shippingFee
        // });

        hasSubmittedOrder.current = true;
        submitOrder(payload);
    }, [
        checkoutData, orderNo, customer, cart, formData, form,
        currentDate, total, currency, location, storeCode, totalVat
    ]);

    const isGuestCheckout = !!useGuestCheckoutStore.getState().guestInfo;
    const { mutate: submitGuestOrder, isPending: isSubmittingGuest } = useMutation({
        mutationFn: (data: any) => axiosCustomer({
            url: '/ecommerce/submit-guest-order',
            method: 'POST',
            data
        }),
        onSuccess: (data) => {
            if (data?.data?.responseCode === 'E412') {
                toast.error('An account with this email already exists. Please sign in to continue.');
                hasSubmittedOrder.current = false;
                if (onEmailExists) onEmailExists();
                return;
            }
            if (data?.data?.responseCode !== '000') {
                toast.error(data?.data?.responseMessage || 'Failed to save order');
                setVerificationStatus('failed');
                hasSubmittedOrder.current = false;
                return;
            }
            toast.success('Order submitted successfully!');
            clearRexpaySession();
            clearCart();
            useGuestCheckoutStore.getState().clearGuestInfo();
            sessionStorage.removeItem('orderNo');
            RexpayVerificationManager.reset();

            hasSubmittedOrder.current = true;

            if (onSuccess) {
                onSuccess();
            } else {
                const successOrderNo = data?.data?.orderNo || checkoutData?.orderNo || orderNo;
                router.push(`/rexpay-success?storeCode=${storeCode}&orderNo=${successOrderNo}&status=success`);
            }
        },
        onError: (error) => {
            console.error('Submit order error:', error);
            toast.error('Failed to save order!');
            setVerificationStatus('failed');
            hasSubmittedOrder.current = false;
            RexpayVerificationManager.reset();
        }
    });

    const { mutate: submitAuthOrder, isPending: isSubmittingAuth } = useMutation({
        mutationFn: (data: any) => axiosCustomer({
            url: '/ecommerce/submit-order',
            method: 'POST',
            data
        }),
        onSuccess: (data) => {
            // console.log('Submit order response:', data);
            if (data?.data?.responseCode !== '000') {
                toast.error(data?.data?.responseMessage || 'Failed to save order');
                setVerificationStatus('failed');
                hasSubmittedOrder.current = false;
                return;
            }
            toast.success('Order submitted successfully!');
            clearRexpaySession();
            clearCart();
            sessionStorage.removeItem('orderNo');
            RexpayVerificationManager.reset();

            hasSubmittedOrder.current = true;

            if (onSuccess) {
                onSuccess();
            } else {
                const successOrderNo = data?.data?.orderNo || checkoutData?.orderNo || orderNo;
                router.push(`/rexpay-success?storeCode=${storeCode}&orderNo=${successOrderNo}&status=success`);
            }
        },
        onError: (error) => {
            console.error('Submit order error:', error);
            toast.error('Failed to save order!');
            setVerificationStatus('failed');
            hasSubmittedOrder.current = false;
            RexpayVerificationManager.reset();
        }
    });

    const isSubmitting = isGuestCheckout ? isSubmittingGuest : isSubmittingAuth;
    const submitOrder = (payload: any) => {
        if (isGuestCheckout) {
            const guestInfo = useGuestCheckoutStore.getState().guestInfo;
            if (guestInfo) {
                submitGuestOrder(buildGuestOrderPayload(guestInfo, payload));
            } else {
                toast.error("Guest info missing");
            }
        } else {
            submitAuthOrder(payload);
        }
    };

    const verifyRexpayPayment = useCallback(async (): Promise<boolean> => {
        const tranId = sessionStorage.getItem('rexpay_tranId');
        // console.log('Attempting single-attempt verification with transaction ID:', tranId);

        if (!tranId) {
            console.error('No transaction ID found in session storage');
            setVerificationStatus('failed');
            toast.error('Payment verification failed: No transaction reference');
            return false;
        }

        if (!RexpayVerificationManager.startVerification(tranId)) {
            // console.log('Verification already attempted or in progress');
            return false;
        }

        // console.log('Starting single verification attempt');

        try {
            setVerificationStatus('verifying');
            const mode = process.env.NEXT_PUBLIC_REXPAY_MODE === 'PROD' ? 'live' : 'test';
            const rexpayClient = new RexPayClient(mode);
            const verificationResponse = await rexpayClient.verifyPayment(tranId);

            // console.log('RexPay verification response:', verificationResponse);

            if (verificationResponse?.status === 404 || verificationResponse?.error === 'Not Found') {
                console.error('Transaction not found in RexPay system');
                toast.error('Payment verification failed: Transaction not found');
                setVerificationStatus('failed');
                RexpayVerificationManager.completeVerification();
                return false;
            }

            if (verificationResponse?.responseCode === '00') {
                // console.log('Payment verification successful');
                toast.success('Payment verified successfully!');
                setVerificationStatus('success');
                RexpayVerificationManager.completeVerification();
                handleSubmitOrder();
                return true;
            } else {
                console.error('Payment verification failed with response:', verificationResponse);
                const errorMessage = verificationResponse?.responseDescription ||
                    verificationResponse?.responseMessage ||
                    'Payment verification failed';
                toast.error(errorMessage);
                setVerificationStatus('failed');
                RexpayVerificationManager.completeVerification();
                return false;
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed due to network error');
            setVerificationStatus('failed');
            RexpayVerificationManager.completeVerification();
            return false;
        }
    }, [handleSubmitOrder]);

    const handleRexpayCallback = useCallback(async () => {
        if (hasHandledCallback.current) {
            // console.log('Callback already handled, skipping');
            return;
        }

        // console.log('Starting RexPay callback handling...');
        // console.log('Available data - storeCode:', storeCode, 'orderNo:', orderNo);

        hasHandledCallback.current = true;
        hasSubmittedOrder.current = false;

        await verifyRexpayPayment();
    }, [storeCode, orderNo, verifyRexpayPayment]);

    const initializeRexpayPayment = async () => {
        if (!checkoutData && !orderNo) {
            toast.error('Checkout data not found. Please restart checkout process.');
            return;
        }

        RexpayVerificationManager.reset();
        hasHandledCallback.current = false;
        hasSubmittedOrder.current = false;

        const currentFormData = form.getValues();
        sessionStorage.setItem('checkoutFormData', JSON.stringify(currentFormData));
        // console.log('Saved form data before redirect:', currentFormData);

        setIsProcessing(true);

        try {
            const mode = process.env.NEXT_PUBLIC_REXPAY_MODE === 'PROD' ? 'live' : 'test';
            const rexpayClient = new RexPayClient(mode);
            const transactionId = `REX${Date.now()}${Math.floor(Math.random() * 1000)}`;

            const currentOrderNo = checkoutData?.orderNo || orderNo;
            const currentStoreCode = storeCode || customer?.storeCode || storeCode;

            const callbackUrl = new URL(`${window.location.origin}/checkout`);
            callbackUrl.searchParams.set('status', 'rexpay_callback');
            callbackUrl.searchParams.set('storeCode', currentStoreCode || '');
            callbackUrl.searchParams.set('orderNo', currentOrderNo);

            const paymentData = {
                reference: transactionId,
                amount: total,
                currency: currency === 'USD' ? 'USD' : 'NGN',
                userId: customer?.email || checkoutData?.customerEmail || 'customer@example.com',
                mode: "Debug",
                callbackUrl: callbackUrl.toString(),
                metadata: {
                    email: customer?.email || checkoutData?.customerEmail || '',
                    customerName: customer?.fullname || checkoutData?.customerName || 'Customer',
                    orderNo: currentOrderNo,
                    storeCode: currentStoreCode,
                    subTotal: cart.reduce((sum, item) => sum + ((item.salePrice || 0) * item.quantity), 0),
                    taxAmount: totalVat,
                },
                paymentChannel: 'DEFAULT',
                country: 'NGA',
                feeBearer: 'Merchant',
                isV2: false,
            };

            // console.log('RexPay Payment Data:', paymentData);
            // console.log('Callback URL:', callbackUrl.toString());

            const response = await rexpayClient.initializePayment(paymentData);

            if (response.status === 'CREATED' && response.paymentUrl) {
                // console.log('RexPay initialization successful, redirecting to:', response.paymentUrl);
                sessionStorage.setItem('rexpay_tranId', transactionId);
                sessionStorage.setItem('rexpay_reference', response.paymentUrlReference);
                sessionStorage.setItem('rexpay_clientId', response.clientId);

                window.location.href = response.paymentUrl;
            } else {
                const errorMessage = response.responseMessage ||
                    response.responseDescription ||
                    'Failed to initialize payment';
                console.error('RexPay API Error:', response);
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('RexPay payment error:', error);
            toast.error('Payment initialization failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        // console.log('RexpayPayment component mounted, isCallback:', isCallback);

        const stored = sessionStorage.getItem('checkout');
        if (stored) {
            setCheckoutData(JSON.parse(stored));
        }

        const savedFormData = sessionStorage.getItem('checkoutFormData');
        if (savedFormData) {
            try {
                const parsedFormData = JSON.parse(savedFormData);
                setFormData(parsedFormData);
                // console.log('Loaded form data from sessionStorage:', parsedFormData);
            } catch (error) {
                console.error('Error loading form data:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (isCallback && !hasHandledCallback.current) {
            // console.log('RexPay callback detected, preparing verification...');

            const timer = setTimeout(() => {
                handleRexpayCallback();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isCallback, handleRexpayCallback]);

    useEffect(() => {
        // console.log('Verification status:', verificationStatus);
        // console.log('Verification manager status:', RexpayVerificationManager);
    }, [verificationStatus]);

    const shippingFee = checkoutData?.shippingFee || 0;
    const subTotal = total - shippingFee - totalVat;

    if (isCallback && verificationStatus === 'verifying') {
        const status = RexpayVerificationManager;
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto" />
                <h2 className="text-2xl font-bold">Verifying Payment</h2>
                <p>Please wait while we confirm your payment...</p>
                <div className="text-xs text-muted-foreground">
                    <p>Store: {storeCode}</p>
                    <p>Order: {orderNo}</p>
                    <p>Transaction: {status.transactionId || 'Not set'}</p>
                </div>
            </div>
        );
    }

    if (verificationStatus === 'verifying') {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto" />
                <h2 className="text-2xl font-bold">Verifying Payment</h2>
                <p>Please wait while we confirm your payment...</p>
            </div>
        );
    }

    if (verificationStatus === 'success') {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold">Saving Your Order</h2>
                        <p>Please wait while we save your order details...</p>
                    </>
                ) : (
                    <>
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
                        <p className="text-muted-foreground">Your order has been placed successfully.</p>
                        <Button onClick={() => setCurrentStep('success')}>
                            Continue
                        </Button>
                    </>
                )}
            </div>
        );
    }

    if (verificationStatus === 'failed') {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-red-600">Payment Verification Failed</h2>
                <p className="text-muted-foreground">
                    Payment verification failed. Please try another payment method or contact support.
                </p>
                <div className="text-xs text-muted-foreground p-2 bg-red-50 rounded">
                    <p>Debug Info:</p>
                    <p>Store: {storeCode || 'Not found'}</p>
                    <p>Order: {orderNo || 'Not found'}</p>
                    <p>Customer: {customer ? 'Available' : 'Not available'}</p>
                </div>
                <Button onClick={() => setSelectedPayment(null)} variant="outline">
                    Try Another Payment Method
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep('cart')}
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <Image src={rexpay} alt="RexPay Logo" className="w-[30%] h-[30%]" />
                        Payment Gateway
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Enhanced Order Breakdown */}
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Subtotal:</span>
                            <span>{formatPrice(subTotal, currency as CurrencyCode)}</span>
                        </div>
                        {totalVat > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="font-medium">VAT:</span>
                                <span>{formatPrice(totalVat, currency as CurrencyCode)}</span>
                            </div>
                        )}
                        {shippingFee > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Shipping:</span>
                                <span>{formatPrice(shippingFee, currency as CurrencyCode)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                            <span>Total Amount:</span>
                            <span>{formatPrice(total, currency as CurrencyCode)}</span>
                        </div>
                        {totalVat > 0 && (
                            <p className="text-xs text-muted-foreground text-right">
                                Includes {formatPrice(totalVat, currency as CurrencyCode)} VAT
                            </p>
                        )}
                    </div>

                    <div className="text-sm space-y-3">
                        <h4 className="font-semibold">How to pay with RexPay:</h4>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Click "Proceed to RexPay" below</li>
                            <li>You'll be redirected to RexPay secure page</li>
                            <li>Choose your preferred payment method</li>
                            <li>Complete the payment</li>
                            <li>You'll be redirected back automatically</li>
                        </ol>
                    </div>

                    <Button
                        onClick={initializeRexpayPayment}
                        disabled={isProcessing}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Initializing Payment...
                            </>
                        ) : (
                            <>
                                Proceed to RexPay
                                <Building2 className="ml-2 w-4 h-4" />
                            </>
                        )}
                    </Button>

                    <div className="text-xs text-muted-foreground text-center">
                        <p>🔒 Secure payment processed by RexPay</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RexpayPayment;