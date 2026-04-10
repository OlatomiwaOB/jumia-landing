'use client'

import axiosInstanceNoAuth from '@/utils/fetch-function-auth'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export const useCategories = (retry?:any) => {
    const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE
    
    const {data,isLoading,error} = useQuery({
        queryKey: ['categories',retry],
        queryFn: ()=>axiosInstanceNoAuth.request({
           url: '/ecommerce/products/categories',
            params: {
            name: "",
            entityCode: entityCode,
            category: '',
            tag: '',
            pageNumber: 1,
            pageSize: 200
        }
        })
    })

    return {data:data?.data, isLoading, error}
}

