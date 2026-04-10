'use client'
import { PaymentPlanCard } from "@/components/Customer/payment-plan/payment-plan-card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader"

// import useCustomer from "@/store/customerStore";
// import { PaymentPlanResponse } from "@/types";
import axiosCustomer from "@/utils/fetch-function-customer";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";


// Mock data that matches your backend structure


const PaymentPlanContent = () => {
   const [retry,setRetry] = useState(false)
   const searchParams = useSearchParams()

   const orderId = searchParams?.get('orderId')
  
  const {data,isLoading} = useQuery({
     queryKey: ['payment-plan',retry],
     queryFn: ()=>axiosCustomer({
      method: 'GET',
      url: '/payment-plans/generate',
      params: {
        orderNo: orderId || ''
      }
     })
  })

  const retryFn = () =>{
    setRetry(!retry)
  }

  if (data?.data?.responseCode === 'E20') {
    return <div className="min-h-screen flex items-center justify-center">
      <h1 className="font-bold text-xl">No active payment plan!</h1>
    </div>
  }

  if (data?.data?.responseCode === 'E06') {
    return <div className='lg:flex flex-col items-center justify-center'>
          <div className="p-4">Error loading payment plan</div>
          <Button className='bg-accent text-white' onClick={retryFn}>Retry</Button>
        </div>
  }

  if (!orderId) {
    return <div className='lg:flex flex-col items-center justify-center'>
          <div className="p-4">Error loading payment plan</div>
           <h2>Invalid order ID</h2>
        </div>
  }

  if (isLoading) {
    return <Loader text="Loading Payment Details"/>
  }

  const paymentSummary = data?.data?.paymentPlanSummary
  
  return (
    <div className="min-h-screen bg-background">
    
      <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-accent">Buy Now, Pay Later</h1>
            <p className="text-gray-500">Flexible payment plans made simple</p>
    </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <PaymentPlanCard paymentPlan={paymentSummary} />
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Secure payments powered by advanced encryption</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentPlanContent;
