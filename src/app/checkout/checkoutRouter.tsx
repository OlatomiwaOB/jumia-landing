'use client'
import React, { useEffect, useState } from 'react'
import { getAuthCredentials } from '@/utils/auth-utils-customer'
import CheckoutContent from './checkoutContent'

import TwoFaWrapper from '@/app/TwoFaWrapper'
import Loader from '@/components/ui/loader'
import { useGuestCheckoutStore } from '@/store/guestCheckoutStore'
import GuestCheckoutContent from './guestCheckoutContent'

const CheckoutRouter = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { setGuestCheckout, clear } = useGuestCheckoutStore()

  useEffect(() => {
    const { token, permissions } = getAuthCredentials()
    const authenticated = !!token && Array.isArray(permissions) && permissions.length > 0

    setIsAuthenticated(authenticated)

    if (authenticated) {
      // Clear any leftover guest state when an authenticated user visits
      clear()
    } else {
      // Mark this as a guest checkout
      setGuestCheckout(true)
    }

    setIsLoading(false)
  }, [clear, setGuestCheckout])

  if (isLoading) {
    return <Loader text='Loading checkout...' />
  }

  if (isAuthenticated) {
    return (
      <TwoFaWrapper>
        <CheckoutContent />
      </TwoFaWrapper>
    )
  }

  return <GuestCheckoutContent />
}

export default CheckoutRouter
