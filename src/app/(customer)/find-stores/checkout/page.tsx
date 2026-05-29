'use client'
import React, { Suspense } from 'react'
import CheckoutContent from './checkout-content'
import PrivateRoute from '@/utils/private-route-customer'
import { Metadata } from 'next'
import TwoFaWrapper from '@/app/TwoFaWrapper'
import { usePageMetadata } from '@/hooks/usePageMetadata'


const Checkout = () => {
    usePageMetadata('Checkout', 'Kindly complete your shipping info to proceed.');
    return (
        <>
            <Suspense>
                <PrivateRoute requiredPermissions={['CUSTOMER']} fallbackPath='/'>
                    <TwoFaWrapper>
                        <CheckoutContent />
                    </TwoFaWrapper>
                </PrivateRoute>
            </Suspense>
        </>
    )
}

export default Checkout