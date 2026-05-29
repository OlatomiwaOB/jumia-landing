'use client'
import TransactionsManager from '@/components/Admin/transactions/transaction-manager'
import { usePermission } from '@/hooks/usePermissionBusiness';
import React from 'react'

const TransactionsPage = () => {
  // const { usePermissionGuard } = usePermission();

  // usePermissionGuard('CAN_VIEW_TRANS', {
  //   redirectToNotPermitted: true,
  //   toastMessage: "You don't have permission to view transactions."
  // });
  return (
    <TransactionsManager />
  )
}

export default TransactionsPage