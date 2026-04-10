
import OrderHistory from '@/components/Customer/dashboard/recent-orders'
import TransactionHistory from '@/components/Customer/dashboard/recent-transactions'
import { WalletOverview } from '@/components/Customer/dashboard/wallet-overview'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Customer Dashboard'
}
const CustomerDashboard = () => {

  return (
    <>
      <WalletOverview />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6'>
        <TransactionHistory />
        <OrderHistory />
        
      </div>
    </>
  )
}

export default CustomerDashboard