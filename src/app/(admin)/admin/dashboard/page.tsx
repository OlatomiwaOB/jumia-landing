'use client'
import TransactionHistory from '@/components/Admin/dashboard/recent-transactions'
import OrderHistory from '@/components/Admin/dashboard/recent-orders'
import { WalletOverview } from '@/components/Admin/dashboard/wallet-overview'
import React from 'react'
import { usePermission } from '@/hooks/usePermissionBusiness'
import { usePageMetadata } from '@/hooks/usePageMetadata'

const AdminDashboard = () => {
  usePageMetadata('Business Dashboard', `Overview of key metrics and performance indicators.`);
  const { usePermissionGuard } = usePermission();

  usePermissionGuard('VIEW_DASHBOARD', {
    redirectToNotPermitted: true,
    toastMessage: "You don't have permission to view the dashboard"
  });

  return (
    <>
      <WalletOverview />
      <div className='grid grid-cols-1 lg:grid-cols-2 px-2 gap-4 lg:gap-6 mt-10'>
        <TransactionHistory />
        <OrderHistory />
      </div>
    </>
  )
}

export default AdminDashboard