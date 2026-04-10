'use client'
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
    const router = useRouter()
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-accent hover:bg-accent-foreground text-white font-semibold py-3 px-6 rounded-lg transition-colors" onClick={()=>router?.push(`/dashboard`)}>
            View Order
          </button>
          <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors" onClick={()=>router?.push(`/`)}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}