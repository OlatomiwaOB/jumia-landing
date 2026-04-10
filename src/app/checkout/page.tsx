import React, { Suspense } from 'react'
import CheckoutContent from './checkoutContent'
import PrivateRoute from '@/utils/private-route-customer'
import { Metadata } from 'next'
import TwoFaWrapper from '@/app/TwoFaWrapper'


export const metadata: Metadata ={
  title: 'Checkout'
}

const Checkout = () => {
  return (
    <>
      <Suspense>
        <PrivateRoute requiredPermissions={['CUSTOMER']} fallbackPath='/'>
          <TwoFaWrapper>
            <CheckoutContent/>
          </TwoFaWrapper>
        </PrivateRoute>
      </Suspense>
    </>
  )
}

export default Checkout