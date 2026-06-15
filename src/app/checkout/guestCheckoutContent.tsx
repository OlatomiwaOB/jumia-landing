'use client';
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/app/hooks/use-toast';
import { useCart } from '@/store/cart';
import { useForm } from 'react-hook-form';
import CartView from '@/components/checkout/cart-view';
import BankPayment from '@/components/checkout/bank-payment';
import { useSearchParams, useRouter } from 'next/navigation';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RexpayPayment from '@/components/checkout/rexpay-payment';
import WalletPayment from '@/components/checkout/wallet-payment';
import { Button } from '@/components/ui/button';
import CustomerLoginModal from '@/components/ui/customer-login-modal';
import { useGuestCheckoutStore } from '@/store/guestCheckoutStore';
import { CheckoutStep, PaymentMethod, FormData } from './checkoutContent';
import { ShoppingBag } from 'lucide-react';
import GuestInfoForm from '@/components/checkout/guest-info-form';

/**
 * Extended form schema for guest checkout.
 * Includes the same shipping/address fields as the authenticated checkout FormData,
 * plus guest personal info fields. The payment components only access the shared fields.
 */
const guestFormSchema = z.object({
  // --- Same fields as authenticated FormData ---
  shippingMethod: z.enum(["delivery", "pickup"]).optional(),
  shippingOption: z.string().optional(),
  pickupStore: z.number().optional(),
  fullName: z.string().optional(),
  country: z.string().min(1, "Please select a country").optional(),
  addressType: z.string().optional(),
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
  // --- Guest-specific fields ---
  firstname: z.string().min(2, "First name is required"),
  lastname: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  mobileNo: z.string().min(6, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  cPassword: z.string().min(6, "Password must be at least 6 characters"),
  // nationality: z.string().min(1, "Nationality is required"),
  // dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export type GuestFormData = z.infer<typeof guestFormSchema>;

const GuestCheckoutContent = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep | 'guest-info'>('guest-info');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [wallets, setWallets] = useState<any | null>(null)
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [isRexpayCallback, setIsRexpayCallback] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [totalVat, setTotalVat] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const checkoutInitialized = useRef(false);

  const { setGuestInfo } = useGuestCheckoutStore();

  console.log('checkout data', checkoutData);


  const latestValues = useRef({ subtotal: 0, shippingFee: 0, totalVat: 0 });
  useEffect(() => {
    latestValues.current = { subtotal, shippingFee, totalVat };
  }, [subtotal, shippingFee, totalVat]);

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      shippingMethod: "delivery",
      fullName: "",
      country: "",
      city: "",
      state: "",
      zipCode: "",
      agreeTerms: false,
      firstname: "",
      lastname: "",
      email: "",
      mobileNo: "",
      password: "",
      // nationality: "",
      // dateOfBirth: "",
    },
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const storeCode = process.env.NEXT_PUBLIC_STORE_CODE || '';
  const { toast } = useToast();
  const { getCartTotal, totalVat: cartVat, cart } = useCart();

  // Ensure storeCode is in URL for payment components that read from URL
  useEffect(() => {
    if (!searchParams?.get('storeCode') && storeCode) {
      router.push(`?storeCode=${storeCode}`);
    }
  }, [router, searchParams, storeCode]);

  const updateCheckoutWithAllValues = useCallback((subtotalVal: number, shippingVal: number, vatVal: number) => {
    const totalAmount = subtotalVal + shippingVal + vatVal;

    const stored = sessionStorage.getItem('checkout');
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
    if (newTotal === orderTotal) return;
    setOrderTotal(newTotal);
  }, [orderTotal]);

  // Run only once on mount. Using empty deps [] is intentional: getCartTotal is
  // an unstable reference (changes on every render) — putting it in deps caused
  // this effect to re-run constantly, overwriting saved sessionStorage checkout
  // data (with shipping / VAT) with fresh zeroed values on every re-render.
  useEffect(() => {
    if (checkoutInitialized.current) return;
    checkoutInitialized.current = true;

    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        setCheckoutData(parsedData);

        const subtotalVal = parsedData.subtotal ?? 0;
        const shippingVal = parsedData.shippingFee ?? 0;
        const vatVal = parsedData.totalVat ?? 0;
        const totalAmount = subtotalVal + shippingVal + vatVal;

        // CRITICAL: update the ref synchronously BEFORE setting state.
        // React state updates are async — if a child callback (e.g. onShippingUpdate)
        // fires before the next render, latestValues.current would still be all-zeros,
        // causing updateCheckoutWithAllValues to overwrite sessionStorage with subtotal:0.
        latestValues.current = { subtotal: subtotalVal, shippingFee: shippingVal, totalVat: vatVal };

        setSubtotal(subtotalVal);
        setShippingFee(shippingVal);
        setTotalVat(vatVal);
        setOrderTotal(totalAmount);

        // Restore step and payment method so refresh lands the user back where they were
        if (parsedData.currentStep) {
          setCurrentStep(parsedData.currentStep as CheckoutStep | 'guest-info');
        }
        if (parsedData.selectedPayment) {
          setSelectedPayment(parsedData.selectedPayment as PaymentMethod);
        }

        // Pre-fill guest info form from persisted Zustand store (avoids empty form on refresh)
        const savedGuestInfo = useGuestCheckoutStore.getState().guestInfo;
        if (savedGuestInfo) {
          form.reset({
            ...form.getValues(),
            firstname: savedGuestInfo.firstname,
            lastname: savedGuestInfo.lastname,
            email: savedGuestInfo.email,
            mobileNo: savedGuestInfo.mobileNo,
            password: savedGuestInfo.password,
            // nationality: savedGuestInfo.nationality,
            // dateOfBirth: savedGuestInfo.dateOfBirth || '',
            city: savedGuestInfo.city || '',
            country: savedGuestInfo.countryCode || '',
            agreeTerms: true,
          });
        }

        return;
      } catch {
        // Fall through to initialise fresh below
      }
    }

    // No saved data — initialise from cart
    const subtotalVal = getCartTotal();
    const initialCheckoutData = {
      subtotal: subtotalVal,
      shippingFee: 0,
      totalVat: 0,
      totalAmount: subtotalVal,
    };
    // Immediately sync the ref (same reason as the stored-data branch above)
    latestValues.current = { subtotal: subtotalVal, shippingFee: 0, totalVat: 0 };
    sessionStorage.setItem('checkout', JSON.stringify(initialCheckoutData));
    setCheckoutData(initialCheckoutData);
    setSubtotal(subtotalVal);
    setOrderTotal(subtotalVal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setIsRexpayCallback(true);
      setSelectedPayment('rexpay');
      setCurrentStep('payment');

      const url = new URL(window.location.href);
      url.searchParams.delete('status');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  // Persist form data in sessionStorage
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('guestCheckoutFormData');
    if (savedFormData) {
      try {
        const formData = JSON.parse(savedFormData);
        form.reset(formData);
      } catch (error) {
        console.error('Error loading saved guest form data:', error);
      }
    }

    const subscription = form.watch((value) => {
      sessionStorage.setItem('guestCheckoutFormData', JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const updateCheckoutData = useCallback((shippingCost: number) => {
    if (shippingCost === latestValues.current.shippingFee) return;
    setShippingFee(shippingCost);
    updateCheckoutWithAllValues(latestValues.current.subtotal, shippingCost, latestValues.current.totalVat);
  }, [updateCheckoutWithAllValues]);

  /** Persist step + payment to sessionStorage so they survive a page refresh */
  const saveStepToSession = useCallback((step: CheckoutStep | 'guest-info', payment?: PaymentMethod) => {
    try {
      const stored = sessionStorage.getItem('checkout');
      const parsedData = stored ? JSON.parse(stored) : {};
      sessionStorage.setItem('checkout', JSON.stringify({
        ...parsedData,
        currentStep: step,
        ...(payment !== undefined ? { selectedPayment: payment } : {}),
      }));
    } catch { }
  }, []);

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
    setCurrentStep('payment');
    saveStepToSession('payment', method);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  const handleRexpaySuccess = () => {
    setCurrentStep('success');
    setIsRexpayCallback(false);
    saveStepToSession('success');
  };

  /**
   * Called when the guest completes the info form and proceeds to payment selection.
   * Stores guest info in the Zustand store for use by payment components.
   */
  const handleGuestInfoComplete = () => {
    const values = form.getValues();

    // Store guest personal info in the Zustand store
    setGuestInfo({
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      mobileNo: values.mobileNo,
      city: values.city || '',
      countryCode: values.country || '',
      password: values.password,
      // nationality: values.nationality,
      // dateOfBirth: values.dateOfBirth,
    });

    setCurrentStep('cart');
    saveStepToSession('cart');
  };

  const PaymentView = () => {
    // Cast form to FormData type for compatibility with existing payment components.
    // The payment components only access the shared fields (shippingMethod, street, city, etc.)
    const formAsFormData = form as any;
    const handleEmailExists = () => setShowLoginModal(true);

    if (selectedPayment === 'rexpay') {
      return (
        <RexpayPayment
          setCurrentStep={setCurrentStep}
          setSelectedPayment={setSelectedPayment}
          isCallback={isRexpayCallback}
          onSuccess={handleRexpaySuccess}
          onEmailExists={handleEmailExists}
          form={formAsFormData}
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
          form={formAsFormData}
          onEmailExists={handleEmailExists}
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
          onEmailExists={handleEmailExists}
          form={formAsFormData}
          orderTotal={orderTotal}
          totalVat={totalVat}
        />
      );
    }

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

  const SuccessView = () => (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-green-600">Order Placed Successfully!</h2>
      <p className="text-muted-foreground">
        Thank you for your purchase. An account has been created for you — check your email for login details.
      </p>
      <Button onClick={() => router.push('/')} className="w-full bg-accent hover:bg-accent/90 text-white">
        <ShoppingBag className="w-4 h-4 mr-2" />
        Continue Shopping
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen p-2 bg-[#f7f7f7]">
      <div className="max-w-6xl mx-auto py-8">
        {currentStep === 'guest-info' && (
          <GuestInfoForm
            form={form}
            onContinue={handleGuestInfoComplete}
            onShippingUpdate={updateCheckoutData}
            onVatUpdate={handleVatUpdate}
            onSubtotalUpdate={handleSubtotalUpdate}
            onTotalUpdate={handleTotalUpdate}
          />
        )}
        {currentStep === 'cart' && (
          <CartView
            handlePaymentSelect={handlePaymentSelect}
            setCurrentStep={setCurrentStep as (step: CheckoutStep) => void}
            paymentMethod={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            setWallets={setWallets}
            form={form as any}
            orderTotal={orderTotal}
            shippingFee={shippingFee}
            totalVat={totalVat}
            onEmailExists={() => setShowLoginModal(true)}
          />
        )}

        {currentStep === 'payment' && <PaymentView />}
        {currentStep === 'success' && <SuccessView />}
      </div>

      {/* Email-already-exists login dialog — triggered by E412 from submit-guest-order */}
      <CustomerLoginModal
        isOpen={showLoginModal}
        setIsOpen={setShowLoginModal}
        onLoginSuccess={() => window.location.reload()}
      />
    </div>
  );
};

export default GuestCheckoutContent;
