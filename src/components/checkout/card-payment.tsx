import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useCart } from '@/store/cart'
import { CurrencyCode, formatPrice } from '@/utils/helperfns'
import { useMutation } from '@tanstack/react-query'
import { CheckoutStep, PaymentMethod } from '@/app/checkout/checkoutContent'
import axiosInstance from '@/utils/fetch-function'
import { toast } from 'sonner'
import useCustomer from '@/store/customerStore'

type CardPaymentProps = {
  setCurrentStep: (step: CheckoutStep) => void;
  setSelectedPayment: (method: PaymentMethod) => void;
}

type method = 'stripe' | 'paystack' | null



const CardPayment = ({ setCurrentStep, setSelectedPayment }: CardPaymentProps) => {
  const [paymentMethod, setPaymentMethod] = useState<method>(null);
  const { getCartTotal, mainCcy, cart } = useCart()
  const currency = mainCcy()
  const total = getCartTotal()
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const { customer } = useCustomer();

  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    }
  }, []);
  const { mutate, isPending } = useMutation({
    mutationFn: () => axiosInstance.request({
      url: '/stripe/checkout-sale',
      method: 'POST',
      params: {
        entityCode: customer?.entityCode || '',
        orderNo: checkoutData?.orderNo,
      },
      // data
    }),
    onSuccess: (data) => {
      if (data?.data?.responseCode !== '000') {
        toast.error(data?.data?.responseMessage || 'An error occurred. Please try again.')
        return
      }
      window.open(data?.data?.paymentLinkUrl, '_blank')
    },
    onError: (error) => {
      toast.error('Something went wrong. Please try again.')
    }
  })

  const handlePayment = () => {
    mutate()
  }




  return (
    <>
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep('cart')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold">Card Payment</h2>
        </div>

        <Card>
          <CardHeader className='flex items-center'>
            <span>Total: {formatPrice(total, currency as CurrencyCode)}</span>
          </CardHeader>

          {!paymentMethod && (
            <CardContent className="space-y-4 flex flex-col">
              <Button onClick={handlePayment} disabled={isPending}>
                {isPending ? 'Processing...' : 'Pay with Stripe'} <CreditCard className="ml-2" />
              </Button>
              {/* <Button onClick={() => setPaymentMethod('paystack')}>
                  Pay with PayStack <CreditCard className="ml-2" />
                </Button> */}
            </CardContent>
          )}

          {/* {paymentMethod === 'stripe' && (
              <CardContent className="space-y-4">
                {isPending && <p>Setting up payment...</p>}
                {error && (
                  <div className="text-red-500 text-sm">
                    Error: {(error as Error).message}
                  </div>
                )}
                {options && (
                  <Elements stripe={stripePromise} options={options}>
                    <StripePaymentForm 
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                )}
              </CardContent>
            )} */}

          {paymentMethod === 'paystack' && (
            <CardContent>
              <p>PayStack integration coming soon...</p>
            </CardContent>
          )}
        </Card>
      </div>
    </>
  )
}

export default CardPayment