'use client';
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/app/hooks/use-toast';
import { useCart } from '@/store/cart';
import { useForm } from 'react-hook-form';
import CartView from '@/components/checkout/cart-view';
import BankPayment from '@/components/checkout/bank-payment';
import { useSearchParams, useRouter } from 'next/navigation';
import BnplManager from '@/components/checkout/bnpl_checkout/bnpl-manager';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RexpayPayment from '@/components/checkout/rexpay-payment';
import WalletPayment from '@/components/checkout/wallet-payment';
import { Button } from '@/components/ui/button';
import axiosCustomer from '@/utils/fetch-function-customer';
import useCustomer from '@/store/customerStore'
import { getClientIdentifiers } from '@/config/client-config';

export type PaymentMethod = 'card' | 'card2' | 'crypto_token' | 'bnpl' | 'bank_transfer' | 'tron' | 'rexpay' | 'solana_pay' | 'wallet' | null;
export type CheckoutStep = 'cart' | 'payment' | 'processing' | 'success' | 'guest-info' | 'retry';
export type BNPLStep = 'registration' | 'scoring' | 'approved' | 'rejected'

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
  deliveryOptionGroup: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

const entityCode = getClientIdentifiers()?.entityCode
const CheckoutContent = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('guest-info');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [wallets, setWallets] = useState<any | null>(null)
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [isRexpayCallback, setIsRexpayCallback] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [totalVat, setTotalVat] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  // Ref to always hold current values, avoiding stale closures in useCallback
  const latestValues = useRef({ subtotal: 0, shippingFee: 0, totalVat: 0 });
  useEffect(() => {
    latestValues.current = { subtotal, shippingFee, totalVat };
  }, [subtotal, shippingFee, totalVat]);

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
  const clientIdentifier = getClientIdentifiers()
  const storeCode = searchParams.get('storeCode') || clientIdentifier?.storeCode
  const { toast } = useToast();
  const { getCartTotal, totalVat: cartVat, cart } = useCart();

  console.log('cart data', cart)
  const { customer } = useCustomer();

  console.log(checkoutData);

  console.log('cartVat', cartVat?.());


  const updateCheckoutWithAllValues = useCallback((subtotalVal: number, shippingVal: number, vatVal: number) => {
    const totalAmount = subtotalVal + shippingVal + vatVal;

    const stored = sessionStorage.getItem('checkout');

    // console.log('stored', JSON.parse(stored!));

    const parsedData = stored ? JSON.parse(stored) : {};

    const updatedData = {
      ...parsedData,
      subtotal: subtotalVal,
      shippingFee: shippingVal,
      totalVat: vatVal,
      totalAmount: totalAmount
    };

    sessionStorage.setItem('checkout', JSON.stringify(updatedData));
    setCheckoutData(updatedData);

    if (selectedPayment === 'crypto_token') {
      const cryptoAmount = updatedData.payingAmount || 0;
      setOrderTotal(cryptoAmount + shippingVal + vatVal);
    } else {
      setOrderTotal(totalAmount);
    }
  }, [selectedPayment]);

  const handleVatUpdate = useCallback((vat: number) => {
    if (vat === latestValues.current.totalVat) return;

    setTotalVat(vat);
    updateCheckoutWithAllValues(latestValues.current.subtotal, latestValues.current.shippingFee, vat);
  }, [updateCheckoutWithAllValues]);

  const handleSubtotalUpdate = useCallback((newSubtotal: number) => {
    if (newSubtotal === latestValues.current.subtotal) return;

    setSubtotal(newSubtotal);
    updateCheckoutWithAllValues(newSubtotal, latestValues.current.shippingFee, latestValues.current.totalVat);
  }, [updateCheckoutWithAllValues]);

  const handleTotalUpdate = useCallback((newTotal: number) => {
    if (newTotal === orderTotal) {
      // console.log('Total unchanged, skipping update');
      return;
    }

    // console.log('Total updated to:', newTotal);
    setOrderTotal(newTotal);
  }, [orderTotal]);

  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      const parsedData = JSON.parse(stored);
      setCheckoutData(parsedData);

      const subtotalVal = parsedData.subtotal ?? getCartTotal();
      const shippingVal = parsedData.shippingFee ?? 0;
      const vatVal = parsedData.totalVat ?? 0;
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

    const subtotalVal = checkoutData.subtotal ?? getCartTotal();
    const shipping = checkoutData.shippingFee ?? 0;
    const vat = checkoutData.totalVat ?? 0;

    if (selectedPayment === 'crypto_token') {
      const cryptoAmount = checkoutData.payingAmount ?? 0;
      setOrderTotal(cryptoAmount + shipping + vat);
    } else {
      setOrderTotal(subtotalVal + shipping + vat);
    }
  }, [selectedPayment, checkoutData, getCartTotal]);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'rexpay_callback') {
      // console.log('RexPay callback detected in parent component');
      // console.log('StoreCode:', storeCode, 'OrderNo:', searchParams.get('orderNo'));
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
    if (shippingCost === latestValues.current.shippingFee) return;

    setShippingFee(shippingCost);
    updateCheckoutWithAllValues(latestValues.current.subtotal, shippingCost, latestValues.current.totalVat);
  }, [updateCheckoutWithAllValues]);

  // console.log('Updated checkoutData:', checkoutData);
  // console.log('Order Total:', orderTotal);
  // console.log('Shipping Fee:', shippingFee);
  // console.log('Shipping Name:', checkoutData?.shippingName);
  // console.log('Total VAT: ', totalVat)
  // console.log('Selected Payment:', selectedPayment);

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
    setCurrentStep('payment');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  const handleRexpaySuccess = () => {
    // console.log('RexPay success handled in parent');
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
        entityCode: customer?.entityCode || entityCode,
        customerEmail: customer?.username || "",
        ordDate: checkoutData.orderDate,
        // salePerson: "",
        storeCode: storeCode || checkoutData.storeCode || "STO0813",
        delivery: isDelivery,
        pickupId: isDelivery ? undefined : checkoutData.selectedStore,
      };

      // console.log('Downloading receipt with payload:', receiptPayload);

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

    if (selectedPayment === 'card2') {
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

    // console.log('Selected payment:', selectedPayment);

    if (selectedPayment == 'bank_transfer') {
      return (
        <BankPayment
          setCurrentStep={setCurrentStep}
          copyToClipboard={copyToClipboard}
          orderTotal={orderTotal}
          totalVat={totalVat}

        />
      );
    }

    return null;
  };

  const ProcessingView = () => (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="animate-spin text-6xl">⚡</div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
        <p className="text-muted-foreground">Waiting for blockchain confirmation...</p>
      </div>
      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm">Expected confirmation: ~3 seconds</p>
      </div>
    </div>
  );

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
      <Button
        variant="outline"
        onClick={handleDownloadReceipt}
        className="w-full"
      >
        Download Receipt
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen p-2 bg-[#f7f7f7]">
      <div className="max-w-6xl mx-auto py-8">
        {currentStep === 'guest-info' && (
          <BnplManager
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
          // shippingVat={shippingVat}
          />
        )}

        {currentStep === 'payment' && <PaymentView />}
        {currentStep === 'processing' && <ProcessingView />}
        {currentStep === 'success' && <SuccessView />}
      </div>
    </div>
  );
};

export default CheckoutContent;