'use client'
import useOperations from '@/store/operationsStore'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'

const TwoFaWrapper = ({children}: {children:ReactNode}) => {
    const {operations} = useOperations()
    const router = useRouter()
    
    useEffect(()=>{
      if (operations && operations?.twoFaSetupRequired === 'Y') {
     router?.replace('/twofa_setup/operations')
  }
    return
    },[router])

    
    
  return children
}

export default TwoFaWrapper