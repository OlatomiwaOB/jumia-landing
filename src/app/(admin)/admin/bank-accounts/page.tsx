'use client'
import { BankAccountManagement } from '@/components/Admin/bank-accounts/accounts-management'
import { usePageMetadata } from '@/hooks/usePageMetadata';
import React from 'react'

const BankAccountManagementPage = () => {
  usePageMetadata('Bank Accounts', 'View and manage bank accounts');
  return (
    <BankAccountManagement />
  )
}

export default BankAccountManagementPage