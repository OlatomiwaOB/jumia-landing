'use client'
import TransactionsManager from '@/components/Admin/transactions/transaction-manager'
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { usePermission } from '@/hooks/usePermissionBusiness';
import React from 'react'

const TransactionsPage = () => {
  usePageMetadata('Transactions Management', 'Manage transactions and payment workflows.');
  const { usePermissionGuard } = usePermission();

  usePermissionGuard('CAN_VIEW_TRANS', {
    redirectToNotPermitted: true,
    toastMessage: "You don't have permission to view transactions."
  });
  return (
    <TransactionsManager />
  )
}

export default TransactionsPage