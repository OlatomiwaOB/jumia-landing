'use client'
import { TransferForm } from '@/components/Customer/send-money/send-money-from'
import { usePageMetadata } from '@/hooks/usePageMetadata';
import React from 'react'

const SendMoneyPage = () => {
  usePageMetadata('Send Money', 'View and manage financial transactions');
  const isH2P = process.env.NEXT_PUBLIC_ENTITYCODE === 'H2P';

  if (!isH2P) {
    return (
      <div className="flex flex-col items-center justify-center py-16 mt-20 gap-3">
        <p className="text-2xl font-medium text-dark-gray">Coming Soon</p>
        <p className="text-sm text-medium-gray text-center max-w-[300px]">
          We're working hard to bring you a seamless way to send money securely. Quick transfers, secure transactions, multiple currencies
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Crypto Transfer</h1>
          <p className="text-xl text-muted-foreground">Send cryptocurrency quickly and securely</p>
        </div>
        <TransferForm />
      </div>
    </div>
  )
}

export default SendMoneyPage