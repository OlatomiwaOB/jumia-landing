'use client'

import axiosCustomer from "@/utils/fetch-function-customer"
import { useQuery } from "@tanstack/react-query"

export const useGetDeliveryAddress = () => {
  const {data,error,isLoading,refetch} = useQuery({
    queryKey: ['delivery-addresses'],
    queryFn: ()=>axiosCustomer.request({
        url: '/ecommerce/get-addresses',
        method: 'GET'
    })
  })

  return {
    isLoading,
    error,
    deliveryAddress: data?.data?.deliveryAddress || []
  }
}

// data?.data?.deliveryAddress ||

