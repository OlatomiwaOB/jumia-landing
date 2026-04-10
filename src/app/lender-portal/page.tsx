import React from 'react'
import LenderPortalContent from './pageContent'
import { Metadata } from 'next'
import LenderPortalHeader from '@/components/lender-portal/header'
import LenderPortalFooter from '@/components/lender-portal/lender-portal-footer'

export const metadata:Metadata = {
    title: "Lender Portal"
}

const LenderPortalPage = () => {
  return (
    <div className='min-h-screen flex flex-col bg-white'>
        <LenderPortalHeader/>
        <LenderPortalContent/>
        {/* <LenderPortalFooter/> */}
    </div>
  )
}

export default LenderPortalPage