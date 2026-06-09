import React, { Suspense } from 'react'
import CheckoutRouter from './checkoutRouter'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Checkout'
}

const Checkout = () => {
  return (
    <>
      <Suspense>
        <CheckoutRouter />
      </Suspense>
    </>
  )
}

export default Checkout