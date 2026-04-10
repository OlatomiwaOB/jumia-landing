import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import React from 'react'
import { Order } from './recent-orders'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import axiosInstance from '@/utils/fetch-function'
import { toast } from 'sonner'

const ConfirmPayment = ({ selectedOrder, setIsAlertOpen } : { selectedOrder: Order | null, setIsAlertOpen: (open: boolean) => void }) => {
   const queryClient = useQueryClient()
    const {isPending,mutate} = useMutation({
        mutationFn: ()=>axiosInstance({
            url: `/ecomm-wallet/confirm-bnpl-order`,
            method: 'POST',
            params: {
                // externalRef: '',
                orderNo: selectedOrder?.cartId
            }
        }),
        onSuccess: (data)=>{
            if (data?.data?.code!== '000') {
                toast.error(data?.data?.desc)
                return
            }
            toast.success('Payment confirmed successfully')
            queryClient.invalidateQueries({queryKey: ['recent-orders']})
            setIsAlertOpen(false)
        },
        onError: (error:any)=>{
            toast.error('An error occurred')
        }
    })
  return (
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Check the details before confirming.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button 
            className='bg-accent text-white p-2 text-sm rounded-md'
            onClick={()=>mutate()}
            disabled= {isPending}
            >
                {isPending ? 'Confirming...' : 'Confirm'}
            </Button>
        </AlertDialogFooter>
    </AlertDialogContent>
  )
}

export default ConfirmPayment