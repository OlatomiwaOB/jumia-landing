"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";

export default function StripeSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm"
          style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 15%, transparent)' }}
        >
          <CheckCircle2
            className="w-10 h-10"
            style={{ color: 'var(--accent)' }}
          />
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
          Payment Successful!
        </h1>

        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
          Thank you for your purchase. Your payment has been processed securely. We have received your order and will begin processing it right away.
        </p>

        <div className="w-full space-y-3">
          <button
            onClick={() => router.replace("/")}
            className="w-full flex items-center justify-center text-white font-medium h-12 rounded-xl transition-all hover:opacity-90 shadow-sm hover:shadow-md"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>

          <button
            onClick={() => router.replace("/dashboard")}
            className="w-full flex items-center justify-center h-12 rounded-xl border-2 border-gray-100 text-gray-600 font-medium hover:bg-gray-50 transition-colors hover:text-gray-900"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
