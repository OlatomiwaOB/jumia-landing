'use client'


import { OtpVerification } from '@/components/twofa_setup/customer/otp-verification'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useCustomer from '@/store/customerStore'
import { logout } from '@/utils/auth-utils-customer'

import { CUSTOMER } from '@/utils/constants'
import PrivateRoute from '@/utils/private-route-customer'


import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'
import QRCode from 'react-qr-code'

const TwoFaSetupPage = () => {
    const {customer} = useCustomer()
    const {replace} = useRouter()
    // console.log(user);
    
    useEffect(()=>{
        document.title = 'Two Factor Authentication Setup'
    },[])

    useEffect(()=>{
        if (customer?.twoFaSetupRequired === 'N') {
        replace(`/dashboard`)
        return
    }
    },[])
  return (
    <PrivateRoute requiredPermissions={[CUSTOMER]}>
        <div className='min-h-screen flex items-center justify-center'>
            <Card className='w-[min(100%,500px)]'>
                <CardHeader>
                    <div className='flex items-center gap-1'>
                        <button onClick={logout}>
                        <ArrowLeft/>
                    </button>
                    <CardTitle className=''>Two-Factor Authentication</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                        <h3 className='font-semibold'>Setup two-factor authentication</h3>
                        <p className='text-[14px]'>To be able to authorize transactions and perform some secured operations you need to scan this QR Code with your Google Authentication App and enter the verification code below.</p>
                        <p className='font-bold text-[14px]'>NB: This session expires in 15 minutes.</p>
                    </div>


                    <div className='space-y-2'>
                        <Suspense>
                            <OtpVerification/>
                        </Suspense>
                    </div>
                </CardContent>
            </Card>
        </div>
    </PrivateRoute>
  )
}

export default TwoFaSetupPage