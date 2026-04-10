import React from 'react'
import { Button } from '../ui/button';
import { ArrowLeft, Banknote, Building2, Copy, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { useToast } from '@/app/hooks/use-toast';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { CheckoutStep } from '@/app/checkout/checkoutContent';

type BankPaymentProps = {
  setCurrentStep: (step: CheckoutStep) => void;
  copyToClipboard: (text: string) => void;
  orderTotal: number;
  totalVat: number;
}

const BankPayment = ({ setCurrentStep, copyToClipboard, orderTotal, totalVat }: BankPaymentProps) => {
  const { toast } = useToast()
  const { mainCcy } = useCart()

  const ccy = mainCcy()

  const checkoutData = sessionStorage.getItem('checkout');
  const parsedCheckoutData = checkoutData ? JSON.parse(checkoutData) : {};
  const shippingFee = parsedCheckoutData?.shippingFee || 0;
  const subTotal = orderTotal - shippingFee - totalVat;

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
        <h2 className="text-2xl font-bold">Bank Transfer</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            Virtual Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>{formatPrice(subTotal, ccy as CurrencyCode)}</span>
            </div>
            {totalVat > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">VAT:</span>
                <span>{formatPrice(totalVat, ccy as CurrencyCode)}</span>
              </div>
            )}
            {shippingFee > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Shipping:</span>
                <span>{formatPrice(shippingFee, ccy as CurrencyCode)}</span>
              </div>
            )}
            <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
              <span>Total Amount:</span>
              <span>{formatPrice(orderTotal, ccy as CurrencyCode)}</span>
            </div>
            {totalVat > 0 && (
              <p className="text-xs text-muted-foreground text-right">
                Includes {formatPrice(totalVat, ccy as CurrencyCode)} VAT
              </p>
            )}
          </div>

          <div className="bg-purple-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white font-bold">
                NW
              </div>
              <div>
                <h4 className="font-semibold">NatWest Bank</h4>
                <p className="text-sm text-muted-foreground">Sort Code: 60-40-05</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">ACCOUNT NUMBER</Label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <code className="text-lg font-mono flex-1">31926819</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard('31926819')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">ACCOUNT NAME</Label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <span className="flex-1 font-medium">TransBridge Payments Ltd</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard('TransBridge Payments Ltd')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">REFERENCE</Label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <code className="text-sm flex-1">ORDER-TB{Date.now()}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(`ORDER-TB${Date.now()}`)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded text-xs space-y-2">
              <div className="font-semibold text-yellow-800">Payment Instructions:</div>
              <div className="space-y-1 text-yellow-700">
                <div><strong>Amount to Transfer:</strong> {formatPrice(orderTotal, ccy as CurrencyCode)}</div>
                {totalVat > 0 && (
                  <div><strong>VAT Included:</strong> {formatPrice(totalVat, ccy as CurrencyCode)}</div>
                )}
                <div><strong>Important:</strong> Include the reference for instant processing</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4" />
              <span>Transfers typically take 2-4 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Protected by UK banking regulations</span>
            </div>
          </div>

          <Button
            onClick={() => {
              setCurrentStep('processing');
              setTimeout(() => {
                setCurrentStep('success');
                toast({
                  title: "Transfer Received",
                  description: `Bank transfer of ${formatPrice(orderTotal, ccy as CurrencyCode)} confirmed successfully`,
                });
              }, 3000);
            }}
            className="w-full bg-accent hover:bg-accent-foreground"
            size="lg"
          >
            I've Made the Transfer
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default BankPayment