import BNPL from '@/components/checkout/bnpl'
import { CUSTOMER } from '@/utils/constants'
import PrivateRoute from '@/utils/private-route-customer'
import React, { Suspense } from 'react'

const BnplApplicationPage = () => {
  return (
    <PrivateRoute requiredPermissions={[CUSTOMER]} fallbackPath='/customer-login'>
        <div>
            <Suspense>
              <BNPL/>
            </Suspense>
        </div>
    </PrivateRoute>
  )
}

export default BnplApplicationPage