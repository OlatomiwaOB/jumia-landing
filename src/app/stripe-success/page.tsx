"use client";

import { useRouter } from "next/navigation";
import { Check, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function StripeSuccessPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4 overflow-hidden relative font-sans">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full opacity-[0.04] blur-3xl" style={{ backgroundColor: 'var(--accent)' }} />
        <div className="absolute top-[60%] -right-[10%] w-[30%] h-[30%] rounded-full opacity-[0.04] blur-3xl" style={{ backgroundColor: 'var(--accent)' }} />
      </div>

      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-gray-100/50 p-8 sm:p-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Animated Checkmark */}
        <div className="flex justify-center mb-8 relative">
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: 'var(--accent)' }}></div>
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--accent)' }}>
            <Check className="w-12 h-12 text-white animate-in zoom-in duration-500 delay-300" strokeWidth={3} />
          </div>
          {/* <Sparkles className="absolute -top-2 -right-2 w-8 h-8 opacity-70 animate-pulse" style={{ color: 'var(--accent)' }} /> */}
        </div>

        {/* Text content */}
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Payment Successful
          </h1>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
            Thank you for your order! Your payment has been processed securely, and a receipt has been sent to your email.
          </p>
        </div>

        {/* Order Details Placeholder */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100/50">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Order Status</span>
            <span className="font-bold flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }}></span> Processing
            </span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium text-gray-900">Secured Checkout</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => router.replace('/')}
            className="w-full h-14 rounded-2xl text-white font-bold text-[17px] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:scale-[0.98]"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => router.replace('/dashboard')}
            className="w-full h-14 rounded-2xl bg-white border-2 border-gray-100 text-gray-700 font-bold text-[17px] flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-200 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-gray-400" />
            View Order History
          </button>
        </div>

      </div>
    </div>
  );
}
