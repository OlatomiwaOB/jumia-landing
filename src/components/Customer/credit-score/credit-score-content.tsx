'use client'
import axiosCustomer from '@/utils/fetch-function-customer'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import CreditScoreDashboard from './credit-score-dashboard'

const CreditScoreContent = () => {
    const {data} = useQuery({
        queryKey: ['customer-credit-info'],
        queryFn: ()=>axiosCustomer.request({
            method: 'GET',
            url: `/credit-assessments/fetch-credit-detail`
        })
    })

    console.log(data);
    
  return (
    <div>
      <CreditScoreDashboard data={data?.data} />
    </div>
  )
}

export default CreditScoreContent