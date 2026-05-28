'use client'
import TransactionsManager from '@/components/Customer/transactions/transaction-manager'
import { usePageMetadata } from '@/hooks/usePageMetadata';
import React from 'react'

const TransactionsPage = () => {
  usePageMetadata('Transactions & Payments', 'Access your full transaction and payment records');
  return (
    <TransactionsManager />
  )
}

export default TransactionsPage