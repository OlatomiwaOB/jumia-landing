'use client'
import { BankAccountManagement } from '@/components/Customer/add-bank-account/bank-account-management'
import { usePageMetadata } from '@/hooks/usePageMetadata';
import React from 'react'

const BankAccountManagementPage = () => {
  usePageMetadata('Bank Accounts', 'View and manage bank accounts');
  const isH2P = process.env.NEXT_PUBLIC_ENTITYCODE === 'H2P';
  if (!isH2P) {
    return (
      <div className="flex flex-col items-center justify-center py-16 mt-20 gap-3">
        <p className="text-2xl font-medium text-dark-gray">Coming Soon</p>
        <p className="text-sm text-medium-gray text-center max-w-[300px]">
          We're working hard to bring you a seamless way to add bank accounts securely. Quick setup, secure transactions, multiple currencies.
        </p>
      </div>
    );
  }

  return (
    <BankAccountManagement />
  )
}

export default BankAccountManagementPage