import React, { Suspense } from 'react'
import PaymentPlanContent from './pageContent'

const PaymentPlanPage = () => {
  return (
    <Suspense>
      <PaymentPlanContent/>
    </Suspense>
  )
}

export default PaymentPlanPage