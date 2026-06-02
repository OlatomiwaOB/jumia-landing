'use client'
// import useCustomer from '@/store/customerStore'
import useUser from '@/store/userStore'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'

const TwoFaWrapper = ({ children }: { children: ReactNode }) => {
    const { user } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (user && user?.twoFaSetupRequired === 'Y') {
            router?.replace('/twofa_setup/admin')
        }
        return
    }, [router])



    return children
}

export default TwoFaWrapper