import React from 'react'
import { Button } from '../ui/button';
import { ArrowLeft, Badge, Calendar, Clock, Coins, Currency, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice, timestampToDays } from '@/utils/helperfns';
import { useToast } from '@/app/hooks/use-toast';
import LivenessTrigger from './bnpl/LivenessTrigger';
import { BNPLStep, CheckoutStep, PaymentMethod } from '@/app/checkout/checkoutContent';
import PaymentSchedulePreview from './bnpl/PaymentSchedulePreview';

type Props = {
  setBnplStep: (step: BNPLStep) => void;
  // setCurrentStep: (step: CheckoutStep) => void;
  score: any
  setSelectedPayment: (selectedPayment: PaymentMethod) => void
}

const BNPLApproved = ({ setBnplStep, score, setSelectedPayment }: Props) => {
  const { getCartTotal, mainCcy } = useCart()
  const ccy = mainCcy()
  const { toast } = useToast()

  console.log(score);

  return (
    score
      ? <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBnplStep('registration')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold text-green-600">Credit Processing!</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Credit Score Results */}
          <Card className='h-fit'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Credit Score Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">{Math.ceil(score.score)}</div>
                <h3 className='text-xl font-semibold text-center'>{score?.responseMessage}</h3>
                <div className="text-lg font-semibold text-gray-700">{score.tier}</div>
                <div className={`mt-2 bg-green-100 text-green-800 ${score?.rating === 'GOOD' && 'text-blue-600 bg-blue-100'} ${score?.rating === 'BAD' && 'bg-red-100'} w-fit p-1 mx-auto rounded-sm`}>
                  {score?.rating}
                </div>
              </div>


              <Separator />

              <div className='space-y-3'>
                {
                  score
                    ?
                    <>
                      {
                        score?.scoreParameters?.map((param: any, index: number) => (
                          <div className='w-full flex items-center justify-between' key={index}>
                            <span>{param?.displayName}</span>
                            <span>{param?.score}</span>
                          </div>
                        ))
                      }
                    </>
                    : null
                }
              </div>

              {/* <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Your Approved Limit</h4>
                    <div className="text-2xl font-bold text-green-600">{score?.approvedLimitDisplay}</div>
                    <div className="text-sm text-green-700">Up to {score?.maxInstallments} installments</div>
                  </div> */}

              <LivenessTrigger
                livenessSessionId={score?.livenessSessionId}
              />
            </CardContent>
          </Card>

          {/* Complete Purchase */}
          <PaymentSchedulePreview
            totalAmount={score?.approvedLimit || getCartTotal()}
          />
        </div>
      </div>
      :
      <div>Nothing to show here</div>
  )
}

export default BNPLApproved

