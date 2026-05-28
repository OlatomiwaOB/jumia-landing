'use client'
import CreditScoreContent from '@/components/Customer/credit-score/credit-score-content'
import { usePageMetadata } from '@/hooks/usePageMetadata';
import React from 'react'

const CreditScorePage = () => {
  usePageMetadata('Financial & Credit', 'Monitor your credit score and financial health');
  const isH2P = process.env.NEXT_PUBLIC_ENTITYCODE === 'H2P';
  if (!isH2P) {
    return (
      <div className="flex flex-col items-center justify-center py-16 mt-20 gap-3">
        <p className="text-2xl font-medium text-dark-gray">Coming Soon</p>
        <p className="text-sm text-medium-gray text-center max-w-[300px]">
          We're working hard to bring you a seamless way to monitor your credit score and financial health.
        </p>
      </div>
    );
  }
  return (
    <CreditScoreContent />
  )
}

export default CreditScorePage