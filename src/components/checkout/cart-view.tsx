'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { ArrowLeft, Bot } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { CheckoutStep, FormData, PaymentMethod } from '@/app/checkout/checkoutContent';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, UseFormReturn } from 'react-hook-form';
import CardAlert from './card-alert';
import { useQuery } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import useCustomer from '@/store/customerStore';
import Loader from '@/components/ui/loader'

type CartViewProps = {
  handlePaymentSelect: (method: PaymentMethod) => void;
  setCurrentStep: (currentStep: CheckoutStep) => void;
  form: UseFormReturn<FormData>;
  paymentMethod?: PaymentMethod;
  setSelectedPayment?: (method: PaymentMethod) => void;
  setWallets?: any;
  orderTotal: number;
  shippingFee: number;
  totalVat: number;
  // shippingVat: number;
}

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
  // shippingVat

}: CartViewProps) => {
  const { cart, getCartTotal, mainCcy } = useCart()
  const ccy = mainCcy()
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()
  const { customer } = useCustomer()
  const [networks, setNetworks] = useState<any[]>([])
  const searchParams = useSearchParams();
  const storeCode = searchParams ? searchParams.get('storeCode') || '' : '';
  const [wallets, setLocalWallets] = useState<any[]>([])

  // console.log(customer);

  useEffect(() => {
    if (!searchParams?.get('storeCode')) {
      router.push(`?storeCode=${customer?.storeCode || 'STO0813'}`);
    }
  }, [router, searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => axiosCustomer.request({
      method: 'GET',
      url: '/payment-methods/fetch',
      params: {
        // country: customer?.country || 'NG',
        storeCode: customer?.storeCode || storeCode,
      }
    })
  })

  // const paymentMethods = data?.data?.list || [];
  const paymentMethods = data?.data?.list?.filter((method: any) =>
    method?.status?.toUpperCase() === "ACTIVE"
  ) || [];

  useEffect(() => {
    if (data?.data) {
      setNetworks(data.data.networks || []);
      const walletData = data.data.wallets || [];
      setLocalWallets(walletData);
      if (setWallets) {
        setWallets(walletData);
      }
    }
  }, [data, setWallets]);

  const { getValues } = form

  // console.log('Form values:', getValues());

  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    }
  }, []);

  // Check payment method requires modal (CARD or BNPL)
  const requiresModal = (code: string) => {
    return code === 'CARD_PAYMENT' || code === 'BNPL_3_INSTALLMENTS';
  };

  const handlePaymentClick = (method: any) => {
    if (requiresModal(method.code)) {
      setModalOpen(true);
      setSelectedPayment && setSelectedPayment(method.paymentType.toLowerCase());
    } else {
      handlePaymentSelect(method.paymentType.toLowerCase());
      // Update wallets in parent component if setWallets prop is provided
      if (setWallets) {
        setWallets(wallets);
      }
    }
  };

  const CartViewContent = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentStep('info')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-bold">Checkout</h2>
      </div>

      {/* Order Summary */}
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatPrice(orderTotal - shippingFee, ccy as CurrencyCode)}</span>
          </div>
          {/* {totalVat > 0 && (
            <div className="flex justify-between">
              <span>VAT:</span>
              <span>{formatPrice(totalVat, ccy as CurrencyCode)}</span>
            </div>
          )} */}
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{formatPrice(shippingFee, ccy as CurrencyCode)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total:</span>
            <span>{formatPrice(orderTotal, ccy as CurrencyCode)}</span>
          </div>
          {totalVat > 0 && (
            <p className="text-xs text-muted-foreground text-right">
              Includes {formatPrice(totalVat, ccy as CurrencyCode)} VAT
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Choose Payment Method</h3>

        {isLoading ? (
          <Loader text='Loading payment methods..' />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {paymentMethods.map((method: any, index: number) => {
              const isLastOdd =
                index === paymentMethods.length - 1 && index % 2 === 0;

              return (
                <Card
                  key={method.code}
                  className={`
                    cursor-pointer transition-all
                    ${method.isRecommended
                      ? 'border-accent bg-accent/5 shadow-md'
                      : 'hover:shadow-md'}
                    ${isLastOdd ? 'md:col-span-2' : ''}
                  `}
                  onClick={() => handlePaymentClick(method)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center p-2 shadow-soft">
                        <img
                          src={method.logo}
                          alt={method.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{method.name}</h4>
                        {method.isRecommended && method.recommendedTitle && (
                          <Badge
                            variant="secondary"
                            className="bg-accent text-secondary text-xs mt-1"
                          >
                            <Bot className="w-3 h-3 mr-1" />
                            {method.recommendedTitle}
                          </Badge>
                        )}
                        {method.subTitle && !method.isRecommended && (
                          <p className="text-xs text-muted-foreground">
                            {method.subTitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      {method.features?.map((feature: string, i: number) => (
                        <div
                          key={i}
                          className={`flex items-start gap-2 ${method.isRecommended
                            ? 'text-accent'
                            : 'text-muted-foreground'
                            }`}
                        >
                          <span className="mt-0.5">•</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <CartViewContent />
      <CardAlert
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        form={form}
        paymentMethod={paymentMethod!}
        networks={networks}
        wallets={wallets}
        orderTotal={orderTotal}
        totalVat={totalVat}
      />
    </>
  );
}

export default CartView