import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import useCustomer from '@/store/customerStore'
import { useCart } from '@/store/cart'
import { UseFormReturn } from 'react-hook-form'
import { FormData, PaymentMethod } from '@/app/checkout/checkoutContent'
import { useLocationStore } from '@/store/locationStore'
import { CurrencyCode, formatPrice, getCurrentDate } from '@/utils/helperfns'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import axiosCustomer from '@/utils/fetch-function-customer'
import BnplChainSelector from './bnpl-chain-selector'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useRouter, useSearchParams } from 'next/navigation'
import { useGuestCheckoutStore } from '@/store/guestCheckoutStore'
import { buildGuestOrderPayload } from '@/utils/guest-checkout-helpers'
import axiosInstanceNoAuth from '@/utils/fetch-function-auth'

interface CardAlertProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  form: UseFormReturn<FormData>;
  paymentMethod: PaymentMethod;
  networks?: any[];
  wallets?: any[];
  orderTotal: number;
  totalVat: number;
  onEmailExists?: () => void;
  setStripeLoading?: (loading: boolean) => void;
}

const CardAlert = ({
  modalOpen,
  setModalOpen,
  form,
  paymentMethod,
  networks = [],
  wallets = [],
  orderTotal,
  totalVat,
  onEmailExists,
  setStripeLoading
}: CardAlertProps) => {
  const { cart, clearCart, getVariantCartWeight } = useCart()
  const variantWeight = getVariantCartWeight();
  const { customer } = useCustomer()
  const { getValues } = form
  const { location } = useLocationStore()
  const currentDate = getCurrentDate()
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [showBnplSelector, setShowBnplSelector] = useState(false)
  const [bnplPaymentData, setBnplPaymentData] = useState<any>(null)
  const [bnplSuccessScreen, setBnplSuccessScreen] = useState(false)
  const searchParams = useSearchParams();
  const storeCode = searchParams ? searchParams.get('storeCode') || '' : '';
  const router = useRouter()
  const { mainCcy } = useCart()
  const ccy = mainCcy()



  // useEffect(() => {
  //   if (!searchParams?.get('storeCode')) {
  //     router.push(`?storeCode=STO0715`);
  //   }
  // }, [router, searchParams]);

  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    }
  }, []);

  // Show BNPL selector when modal opens and payment method is BNPL
  useEffect(() => {
    if (modalOpen && paymentMethod === 'bnpl') {
      setShowBnplSelector(true);
    }
  }, [modalOpen, paymentMethod]);

  const { isPending, mutate, data } = useMutation({
    mutationFn: (data: any) => axiosCustomer({
      url: '/ecommerce/submit-guest-order',
      method: 'POST',
      data
    }),
    onSuccess: (data) => {
      if (data?.data?.responseCode !== '000') {
        toast?.error(data?.data?.responseMessage)
        setStripeLoading!(false)
        return
      }
      toast?.success(data?.data?.responseMessage)
      setModalOpen(false)
      setShowBnplSelector(false) // Close BNPL selector
      setBnplPaymentData(null)

      if (paymentMethod === 'bnpl') {
        setBnplSuccessScreen(true) // Show success screen
      }

      if (paymentMethod === 'card' && data?.data?.paymentLinkUrl) {
        // window.open(data?.data?.paymentLinkUrl, '_blank')
        setStripeLoading!(true)
        clearCart()
        router?.replace(data?.data?.paymentLinkUrl)
        return
      }
    },
    onError: (error) => {
      toast.error('Something went wrong!')
    }
  })

  console.log(paymentMethod)

  console.log(getValues('selectedAddressId'));
  const stored = sessionStorage.getItem('selectedWeightOption');

  console.log('stored', stored);


  const buildOrderPayload = (bnplData?: any) => {
    let selectedWeightOption: any = null;
    try {
      const stored = sessionStorage.getItem('selectedWeightOption');
      if (stored) selectedWeightOption = JSON.parse(stored);
    } catch { /* ignore */ }

    console.log('selected weight option', selectedWeightOption);

    const orderItems = cart.map(item => ({
      itemCode: item?.code,
      itemName: item?.name,
      price: item?.salePrice,
      quantity: item?.quantity,
      amount: item?.subTotal,
      discount: item?.discount || 0,
      picture: item?.picture,
      storeCode: item?.storeCode,
      vat: (item as any).vat || 0,
      itemWeight: item?.weight || 1,
      itemWeightUnit: item?.weightUnit || 'ltr',
      variantID: item?.variantId || 0,
      itemNote: item?.note || '',
      bundleSubItems: item?.bundleSelections || [],
      preference: item?.preference
    }))

    const totalAmount = orderTotal;

    const subtotal = cart.reduce((sum, item) => {
      return sum + ((item.salePrice || 0) * item.quantity);
    }, 0);

    const shippingFee = checkoutData?.shippingFee || 0;

    const payload = {
      channel: "WEB",
      userType: 'USER',
      cartId: checkoutData?.orderNo,
      orderDate: currentDate,
      totalAmount: totalAmount,
      totalDiscount: cart?.reduce((sum, item) => sum + (item?.discount || 0), 0),
      deliveryOption: getValues('shippingMethod'),
      deliveryOptionGroup: getValues('shippingMethod') === 'delivery' ? (getValues('deliveryOptionGroup') || '') : '',
      // zoneCode: selectedWeightOption?.zoneCode || "",
      totalWeight: variantWeight || 0,
      weightUnit: "ltr",
      paymentMethod: paymentMethod?.toUpperCase(),
      // paymentMethod: 'STRIPE_CARD',
      couponCode: "",
      subtotal: subtotal,
      totalVat: totalVat,
      ccy: checkoutData?.ccy,
      deliveryFee: shippingFee,
      geolocation: location ? `${location?.latitude}, ${location?.longitude}` : '',
      deviceId: customer?.deviceID,
      orderStatus: "",
      paymentStatus: "",
      storeCode: storeCode,
      customerName: customer?.fullname,
      username: customer?.username,
      deliveryAddress: {
        id: getValues('selectedAddressId'),
        street: getValues('street'),
        landmark: getValues('landmark'),
        postCode: getValues('zipCode'),
        city: getValues('city'),
        state: getValues('state'),
        country: getValues('country'),
        addressType: getValues('addressType') || 'HOME'
      },
      orderNote: getValues('note') || '',
      cartItems: orderItems
    }

    // Add BNPL-specific fields if provided
    if (bnplData && paymentMethod === 'bnpl') {
      return {
        ...payload,
        networkChain: bnplData.networkChain,
        publicAddress: bnplData.publicAddress,
        tokenSymbol: bnplData.tokenSymbol
      }
    }

    return payload
  }

  const isGuestCheckout = !!useGuestCheckoutStore.getState().guestInfo;
  const { mutate: mutateGuest, isPending: isGuestPending } = useMutation({
    mutationFn: (data: any) => axiosInstanceNoAuth({
      url: '/ecommerce/submit-guest-order',
      method: 'POST',
      data
    }),
    onSuccess: (data) => {
      if (data?.data?.responseCode === 'E412' || data?.data?.responseCode === 'E13') {
        toast?.error('An account with this email already exists. Please sign in to continue.');
        if (onEmailExists) onEmailExists();
        setModalOpen(false)
        return;
      }
      if (data?.data?.responseCode !== '000') {
        toast?.error(data?.data?.responseMessage)
        return
      }
      toast?.success(data?.data?.responseMessage)
      setModalOpen(false)
      setShowBnplSelector(false)
      setBnplPaymentData(null)

      if (paymentMethod === 'card' && data?.data?.paymentLinkUrl) {
        clearCart()
        setStripeLoading!(true)
        useGuestCheckoutStore.getState().clear()
        router?.replace(data?.data?.paymentLinkUrl)
        return
      }
    },
    onError: (error) => {
      toast.error('Something went wrong!')
    }
  })

  const getAuthPayload = (basePayload: any) => {
    const authGuestInfo = {
      firstname: null,
      lastname: null,
      email: null,
      mobileNo: null,
      city: null,
      countryCode: null,
      password: null
    };
    const authPayload = buildGuestOrderPayload(authGuestInfo as any, basePayload);
    authPayload.userType = 'USER';
    authPayload.oinfo.customerName = customer?.fullname
    // Preserve the original deliveryAddress for authenticated users
    if (basePayload.deliveryAddress) {
      authPayload.oinfo.deliveryAddress = basePayload.deliveryAddress;
    }
    return authPayload;
  };

  const onSubmit = () => {
    const payload = buildOrderPayload()
    if (isGuestCheckout) {
      const guestInfo = useGuestCheckoutStore.getState().guestInfo;
      if (guestInfo) {
        const guestPayload = buildGuestOrderPayload(guestInfo, payload);
        mutateGuest(guestPayload);
      } else {
        toast.error("Guest info missing");
      }
    } else {
      mutate(getAuthPayload(payload));
    }
  }

  const onBnplConfirm = (bnplData: any) => {
    setBnplPaymentData(bnplData)
    const payload = buildOrderPayload(bnplData)
    if (isGuestCheckout) {
      const guestInfo = useGuestCheckoutStore.getState().guestInfo;
      if (guestInfo) {
        const guestPayload = buildGuestOrderPayload(guestInfo, payload);
        mutateGuest(guestPayload);
      } else {
        toast.error("Guest info missing");
      }
    } else {
      mutate(getAuthPayload(payload));
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setShowBnplSelector(false)
    setBnplPaymentData(null)
  }

  const handleSuccessClose = () => {
    setBnplSuccessScreen(false)
    router.push('/')
    clearCart()
  }

  const subtotal = orderTotal - (checkoutData?.shippingFee || 0) - totalVat;
  const shippingFee = checkoutData?.shippingFee || 0;

  console.log('totalAmount', orderTotal);
  console.log('subtotal', subtotal)


  // Render BNPL selector for BNPL payment method
  if (paymentMethod === 'bnpl') {
    return (
      <>
        <BnplChainSelector
          modalOpen={showBnplSelector}
          setModalOpen={handleModalClose}
          networks={networks}
          wallets={wallets}
          onConfirm={onBnplConfirm}
          isPending={isPending}
          orderTotal={orderTotal}
          totalVat={totalVat}
        />

        {/* BNPL Success Dialog */}
        <Dialog open={bnplSuccessScreen} onOpenChange={setBnplSuccessScreen}>
          <DialogContent className='min-w-[70vw]'>
            <DialogHeader>
              <DialogTitle>
                {data?.data?.responseCode === '000' ? 'Transaction Successful' : 'Transaction Status'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {data?.data?.responseMessage && (
                <div className="rounded-lg w-full border p-3 bg-muted/50">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{data.data.responseMessage}</p>
                </div>
              )}

              {data?.data?.orderNo && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-mono text-sm">{data.data.orderNo}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {data?.data?.totalAmount !== undefined && data?.data?.ccy && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-semibold">
                      {data.data.totalAmount} {data.data.ccy}
                    </p>
                  </div>
                )}

                {totalVat > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">VAT Included</p>
                    <p className="font-semibold">
                      {formatPrice(totalVat, data?.data?.ccy as CurrencyCode || ccy as CurrencyCode)}
                    </p>
                  </div>
                )}

                {data?.data?.payingAmount !== undefined && data?.data?.payingCurrency && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Paid</p>
                    <p className="font-semibold">
                      {data.data.payingAmount.toFixed(2)} {data.data.payingCurrency}
                    </p>
                  </div>
                )}
              </div>

              {data?.data?.paymentLinkUrl && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Payment Link</p>
                  <a
                    href={data.data.paymentLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all block"
                  >
                    {data.data.paymentLinkUrl}
                  </a>
                </div>
              )}

              {data?.data?.paymentLinkId && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Payment Link ID</p>
                  <p className="font-mono text-sm">{data.data.paymentLinkId}</p>
                </div>
              )}

              <Button
                className='bg-accent text-white w-full'
                onClick={handleSuccessClose}
              >
                Back to home
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Render simple confirmation for card payment
  return (
    <AlertDialog onOpenChange={handleModalClose} open={modalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-2">
              <p>Proceed with card payment?</p>

              {/* Order Breakdown */}
              <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal, ccy as CurrencyCode)}</span>
                </div>

                {totalVat > 0 && (
                  <div className="flex justify-between">
                    <span>VAT:</span>
                    <span>{formatPrice(totalVat, ccy as CurrencyCode)}</span>
                  </div>
                )}

                {shippingFee > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{formatPrice(shippingFee, ccy as CurrencyCode)}</span>
                  </div>
                )}

                <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                  <span>Total Amount:</span>
                  <span>{formatPrice(orderTotal, ccy as CurrencyCode)}</span>
                </div>

                {totalVat > 0 && (
                  <p className="text-xs text-muted-foreground text-right">
                    Includes {formatPrice(totalVat, ccy as CurrencyCode)} VAT
                  </p>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            className='bg-accent text-white p-2 text-sm rounded-md'
            onClick={onSubmit}
            disabled={isPending || isGuestPending}
          >
            {(isPending || isGuestPending) ? 'Processing...' : `Pay ${formatPrice(orderTotal, ccy as CurrencyCode)}`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CardAlert