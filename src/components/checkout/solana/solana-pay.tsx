import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createQR } from '@solana/pay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, QrCode, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { CheckoutStep } from '@/app/checkout/checkoutContent';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';

interface PaymentResponse {
  url: string;
  ref: string;
}

interface VerifyResponse {
  status: string;
}

interface SolanaPayProps {
  setCurrentStep: (currentStep: CheckoutStep) => void;
  orderTotal: number;
  totalVat: number;
}

const SolanaPay = ({ setCurrentStep, orderTotal }: SolanaPayProps) => {
  const [qrCode, setQrCode] = useState<string>();
  const [reference, setReference] = useState<string>();
  const { cart, mainCcy } = useCart();
  const currency = mainCcy();

  const checkoutData = sessionStorage.getItem('checkout');
  const parsedCheckoutData = checkoutData ? JSON.parse(checkoutData) : {};
  const shippingFee = parsedCheckoutData?.shippingFee || 0;
  // const subTotal = orderTotal - shippingFee - totalVat;

  const generatePaymentMutation = useMutation({
    mutationFn: async (): Promise<PaymentResponse> => {
      const res = await fetch('/api/solana-pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: orderTotal,
          // subTotal: subTotal,
          // taxAmount: totalVat,
          shippingFee: shippingFee,
          currency: currency,
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.salePrice,
            total: (item.salePrice || 0) * item.quantity,
          }))
        })
      });
      if (!res.ok) throw new Error('Failed to generate payment');
      return res.json();
    },
    onSuccess: async (data) => {
      try {
        const qr = createQR(data.url);
        const qrBlob = await qr.getRawData('png');

        if (!qrBlob) {
          throw new Error('Failed to generate QR code');
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target?.result === 'string') {
            setQrCode(event.target.result);
            setReference(data.ref);
            toast.success('Payment order generated successfully');
          }
        };
        reader.readAsDataURL(qrBlob);
      } catch (error) {
        toast.error('Failed to generate QR code');
        console.error(error);
      }
    },
    onError: (error) => {
      toast.error('Failed to generate payment order');
      console.error(error);
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: async (): Promise<VerifyResponse> => {
      if (!reference) {
        throw new Error('No reference available');
      }
      const res = await fetch(`/api/solana-pay?reference=${reference}`);
      if (!res.ok) throw new Error('Failed to verify payment');
      return res.json();
    },
    onSuccess: (data) => {
      if (data.status === 'verified') {
        toast.success('Transaction verified successfully!', {
          description: 'Your payment has been confirmed on the blockchain.',
        });
        setQrCode(undefined);
        setReference(undefined);
      } else {
        toast.error('Transaction not found', {
          description: 'Please ensure the payment has been completed.',
        });
      }
    },
    onError: (error) => {
      toast.error('Failed to verify transaction');
      console.error(error);
    },
  });

  const handleGenerate = () => {
    generatePaymentMutation.mutate();
  };

  const handleVerify = () => {
    if (!reference) {
      toast.error('Please generate a payment order first');
      return;
    }
    verifyPaymentMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Button onClick={() => setCurrentStep('cart')} className='absolute top-3 left-3'>
        <ArrowLeft className='w-5 h-5' />
      </Button>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-[0_0_30px_rgba(139,92,246,0.5)]">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Solana Pay
          </h1>
          <p className="text-muted-foreground">
            Generate and verify payments on Solana
          </p>
          <div className="mt-2 text-sm font-medium">
            Amount: ${orderTotal.toFixed(2)}
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-card/50 border-border/50 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <CardHeader>
            <CardTitle>Payment Terminal</CardTitle>
            <CardDescription>
              Create a payment request and scan with your Solana wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Display */}
            {qrCode ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative p-4 bg-white rounded-2xl shadow-lg">
                  <img
                    src={qrCode}
                    alt="Payment QR Code"
                    className="w-48 h-48"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl pointer-events-none" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>QR Code ready to scan</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-12">
                <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-border/50 flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No payment generated
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={handleGenerate}
                disabled={generatePaymentMutation.isPending}
              >
                {generatePaymentMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <QrCode />
                    Generate Payment Order
                  </>
                )}
              </Button>

              {qrCode && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleVerify}
                  disabled={verifyPaymentMutation.isPending}
                >
                  {verifyPaymentMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 />
                      Verify Transaction
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Info Alert */}
            {reference && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-foreground mb-1">
                    Payment Order Active
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Reference: {reference.slice(0, 8)}...{reference.slice(-8)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Powered by Solana Pay • Secure • Fast • Low Fees
        </p>
      </div>
    </div>
  );
};

export default SolanaPay;