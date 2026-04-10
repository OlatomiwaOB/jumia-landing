import CreditScoreContent from '@/components/Customer/credit-score/credit-score-content'
import { Metadata } from 'next'
import React from 'react'

export const metadata:Metadata = {
    title: 'My Credit Score'
}

const CreditScorePage = () => {
  return (
    <CreditScoreContent/>
  )
}

export default CreditScorePage