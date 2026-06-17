'use client'
import { Suspense } from 'react'
import CheckoutRouter from './checkoutRouter'

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