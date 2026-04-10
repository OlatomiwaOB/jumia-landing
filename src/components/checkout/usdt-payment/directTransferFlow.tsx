"use client"

import { useEffect, useState } from "react"
import { Copy, Check, Clock, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import axiosCustomer from "@/utils/fetch-function-customer"
import { useMutation } from "@tanstack/react-query"
import useCustomer from "@/store/customerStore"
import { useSearchParams } from "next/navigation"
import QRCode from "react-qr-code"
import { UseFormReturn } from "react-hook-form"
import { FormData } from "@/app/checkout/checkoutContent"
import { PaymentPendingScreen, PaymentSuccessScreen } from "./payment-states"
import { PaymentStatus } from "../usdt-payment"

interface DirectTransferFlowProps {
  amount: number
  orderNo: string
  selectedNetwork: any
  form?: UseFormReturn<FormData>
  paymentStatus: PaymentStatus,
  setPaymentStatus: (paymentStatus: PaymentStatus) => void
  subTotal?: number;
  totalVat?: number;
  shippingFee?: number;
}

export default function DirectTransferFlow({ 
  amount, 
  orderNo, 
  selectedNetwork, 
  form, 
  paymentStatus, 
  setPaymentStatus,
  subTotal,
  totalVat,
  shippingFee
}: DirectTransferFlowProps) {
  const [copied, setCopied] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const { customer } = useCustomer()
  const searchParams = useSearchParams()
  const storeCode = searchParams.get('storeCode') || ''
  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedNetwork?.publicAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    setPaymentStatus?.('idle')
  }, [])

  const { mutate: checkPaymentStatus, isPending: checkingPaymentStatus, data } = useMutation({
    mutationFn: (data: any) => axiosCustomer.request({
      url: '/store/payment-status',
      method: 'POST',
      data
    }),
    onSuccess: (data) => {
      setPaymentResponse(data?.data);

      if (data?.data?.responseCode === '000') {
        setPaymentStatus('confirmed');
        toast.success('Payment confirmed successfully!');
      }
      else if (data?.data?.responseCode === 'PP') {
        setPaymentStatus('pending')
        toast('Transaction is processing!')
      }
      else {
        setPaymentStatus('failed');
        toast.error(data?.data?.responseMessage || 'Payment verification failed');
      }
    },
    onError: (error: any) => {
      setPaymentStatus('failed');
      setPaymentResponse({
        responseCode: 'ERROR',
        responseMessage: error?.message || 'Network error occurred'
      });
      toast.error('Failed to check payment status');
    }
  });

  const makepayMent = () => {
    const payload = {
      symbol: selectedNetwork?.symbol,
      chain: selectedNetwork?.chain,
      orderNo,
      storeCode,
      entityCode: customer?.entityCode,
      txId: "",
      username: customer?.username,
      publicAddress: selectedNetwork?.publicAddress,
      totalAmount: amount?.toFixed(2),
      subTotal: subTotal?.toFixed(2),
      taxAmount: totalVat?.toFixed(2),
      deliveryFee: shippingFee?.toFixed(2),
      paymentMethod: "CRYPTO_TOKEN",
      deliveryAddressDto: {
        id: form?.getValues('selectedAddressId'),
        street: form?.getValues('street'),
        landmark: form?.getValues('landmark'),
        postCode: form?.getValues('zipCode'),
        city: form?.getValues('city'),
        state: form?.getValues('state'),
        country: form?.getValues('country'),
        addressType: form?.getValues('addressType'),
        orderNo
      }
    }

    console.log('DirectTransferFlow payload:', payload);
    checkPaymentStatus(payload);
  }

  return (
    <>
      {/* Payment states */}
      {paymentStatus === 'confirmed' && (
        <div className="rounded-lg bg-card p-8 border border-border shadow-sm text-center">
          <PaymentSuccessScreen
            paymentResponse={data?.data}
          />
        </div>
      )}

      {paymentStatus === 'pending' && (
        <div className="rounded-lg bg-card p-8 border border-border shadow-sm text-center">
          <PaymentPendingScreen
            amount={amount}
            checkingPaymentStatus={checkingPaymentStatus}
            network={selectedNetwork?.chain}
            orderNo={orderNo}
            retryPaymentCheck={makepayMent}
          />
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="rounded-lg bg-card p-8 border border-border shadow-sm text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Failed Transaction</h2>
              <p className="text-muted-foreground">{data?.data?.responseMessage}</p>
            </div>
          </div>

          <button className="border rounded-sm w-full flex bg-black text-white font-semibold justify-center gap-x-1 items-center p-2 text-center" onClick={() => setPaymentStatus('idle')}>
            <RefreshCw /> Start over
          </button>
        </div>
      )}

      {paymentStatus === 'idle' && (
        <div className="space-y-6">
          {/* Recipient Address Card */}
          <div className="rounded-lg bg-card p-6 border border-border shadow-sm">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">RECIPIENT ADDRESS</h3>
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
              <code className="flex-1 font-mono text-sm text-foreground break-all">{selectedNetwork?.publicAddress}</code>
              <button
                onClick={copyToClipboard}
                className="flex-shrink-0 rounded-lg p-2 hover:bg-secondary transition-colors"
                title="Copy address"
              >
                {copied ? <Check className="h-5 w-5 text-accent" /> : <Copy className="h-5 w-5 text-muted-foreground" />}
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-card p-6 border border-border shadow-sm">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Scan Address</h3>
            <div className="flex items-center gap-3 justify-center rounded-lg bg-secondary/50 p-4">
              {selectedNetwork ? (
                <QRCode
                  value={selectedNetwork?.publicAddress}
                  className="h-30 w-30"
                />
              ) : (
                <div className="h-30 w-30 bg-gray-100 animate-pulse" />
              )}
            </div>
          </div>

          {/* Transfer Details */}
          {selectedNetwork && (
            <div className="rounded-lg bg-card p-6 border border-border shadow-sm">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">TRANSFER DETAILS</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-semibold text-foreground">
                    {amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <span className="font-semibold text-foreground">{selectedNetwork?.chain}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-muted-foreground">Order ID</span>
                  <span className="font-mono text-sm text-foreground">{orderNo}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={makepayMent}
            disabled={checkingPaymentStatus}
            className="w-full rounded-lg bg-accent text-white font-semibold py-3 px-4 hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {checkingPaymentStatus ? (
              <span className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 animate-spin" />
                Checking Status...
              </span>
            ) : (
              "I Have Made the Payment"
            )}
          </button>

          {/* Info Box */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-900">
              💡 <strong>Tip:</strong> After sending USDT to the address above, click the button to verify your payment
              status on the blockchain.
            </p>
          </div>
        </div>
      )}
    </>
  )
}