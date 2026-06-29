'use client'
import OrderHistory from '@/components/Customer/dashboard/recent-orders'
import TransactionHistory from '@/components/Customer/dashboard/recent-transactions'
import { WalletOverview } from '@/components/Customer/dashboard/wallet-overview'
import { usePageMetadata } from '@/hooks/usePageMetadata'
import useCustomer from '@/store/customerStore'
import { Metadata } from 'next'
import React from 'react'

const CustomerDashboard = () => {
  const { customer } = useCustomer();
  usePageMetadata('Dashboard', `Welcome back, ${customer?.firstname}! View account overview.`);

  return (
    <>
      <div>
        <WalletOverview />
        <div className='grid grid-cols-1 xl:grid-cols-5 px-2 gap-4 xl:gap-6 mt-10'>
          {/* <div className="xl:col-span-3">
            <TransactionHistory />
          </div> */}
          <div className="xl:col-span-5">
            <OrderHistory />
          </div>
        </div>
      </div>
    </>
  )
}

export default CustomerDashboard