import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useCustomer from '@/store/customerStore'
import axiosCustomer from '@/utils/fetch-function-customer'

import { useQuery } from '@tanstack/react-query'
import { Calendar, CheckCircle, Clock, Shield, TrendingUp } from 'lucide-react'
import React from 'react'

const PaymentSchedulePreview = ({totalAmount}:{totalAmount:any}) => {
    const {customer} = useCustomer()

    
    const {data,isLoading} = useQuery({
      queryKey: ['payment-plan-preview',totalAmount],
      queryFn: ()=>axiosCustomer({
        method: 'POST',
        url: '/payment-plans/preview',
        params: {
          totalAmount:totalAmount||1,
          currency: customer?.ccy
        }
      })
    })


    if (isLoading) {
      return <Card className='h-[524px] sticky top-0 bg-gray-100 animate-pulse rounded-md'>

      </Card>
    }

    console.log(data);
    const installments = data?.data?.paymentPlanSummary?.installments
    

  return (
    <>
        <Card className='h-fit sticky top-0'>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Payment Schedule Preview
                  </CardTitle>

                  <h3 className='font-semibold'>NB: This is just a preview and not your calculated payment plan.</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Interest-Free Installments</h4>
                    <div className="space-y-3">
                          {
                        installments?.map((plan:any,index:any)=>(
                          plan?.scheduleDisplayText === 'Today'? <div className="flex justify-between items-center p-3 bg-white rounded">
                          <div className="flex items-center gap-2" key={index}>
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                            <div className='flex flex-col gap-y-1'>
                              <span className="text-sm font-medium">{plan?.scheduleDisplayText}</span>
                              <span className='text-sm'>{plan?.scheduleDate}</span>
                            </div>
                          </div>
                          <span className="font-bold text-accent">{plan?.amountDisplay}</span>
                        </div>
                        :
                         <div className="flex justify-between items-center p-3 bg-white rounded" key={index}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div className='flex flex-col gap-y-1'>
                            <span className="text-sm font-medium">{plan?.scheduleDisplayText}</span>
                            <span className='text-sm'>{plan?.scheduleDate}</span>
                          </div>
                        </div>
                        <span className="font-medium">{plan?.amountDisplay}</span>
                      </div>
                        ))
                      }
                      
                      {/* <div className="flex justify-between items-center p-3 bg-white rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-sm font-medium">Today</span>
                        </div>
                        <span className="font-bold text-blue-600">{formatPrice(getCartTotal()/3,ccy as CurrencyCode)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">In 30 days</span>
                        </div>
                        <span className="font-medium">{formatPrice(getCartTotal()/3, ccy as CurrencyCode)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">In 60 days</span>
                        </div>
                        <span className="font-medium">{formatPrice(getCartTotal()/3, ccy as CurrencyCode)}</span>
                      </div> */}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Shield className="w-4 h-4" />
                      <span>0% Interest Rate</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>No Hidden Fees</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>Build Credit History</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded text-xs">
                    <strong>Credit Assessment:</strong> We use AI-powered scoring including income verification, 
                    digital payment history, and social/professional signals for instant approval.
                  </div>

                  {/* <div className="text-xs text-muted-foreground">
                    Approval limits range from ₦150 to ₦750 based on your credit tier.
                  </div> */}
                </CardContent>
              </Card>
    </>
  )
}

export default PaymentSchedulePreview