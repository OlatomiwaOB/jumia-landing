import axiosCustomer from '@/utils/fetch-function-customer'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'

const useSubmitOrder = () => {

    const {isPending,mutate,data} = useMutation({
    mutationFn: (data:any)=>axiosCustomer({
        url: '/ecommerce/submit-order',
        method: 'POST',
        data
    }),
    onSuccess: (data)=>{
        if (data?.data?.responseCode!=='000') {
            // if (data?.data?.responseCode==='PP') {
            //   setPendingModal(true)
            //   return
            // }
            toast?.error(data?.data?.responseMessage)
            return
        }
        toast?.success(data?.data?.responseMessage)
        // reset({
        //         agreeTerms:false,
        //         city: '',
        //         country:'',
        //         fullName:'',
        //         landmark:'',
        //         shippingMethod:'delivery',
        //         state:'',
        //         street:'',
        //         zipCode:''
        //       })
    },
    onError: (error)=>{
        toast.error('Something went wrong!')
    }
  })
  return {
    isPending,
    mutate
  }
}

export default useSubmitOrder