
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import axiosCustomer from '@/utils/fetch-function-customer'
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const MerchantWithdrawButton = () => {
    const [isAlertOpen,setIsAlertOpen] = useState(false)
    const {mutate,isPending} = useMutation({
        mutationFn: ()=> axiosCustomer.request({
            url: '/store/withdraw-fund-merchant',
            method: 'GET',
            params: {
                storeCode: 'STO445',
                chain: 'ARC',
                symbol: 'USDC'
            },
        }),
        onSuccess: (data)=>{
            if (data?.data?.code!=='000') {
                toast.error(data?.data?.desc)
                return
            }

            toast.success(data?.data?.desc)
            setIsAlertOpen(false)
        },
        onError: (error)=>{
            toast.error('An error occured!')
        }
    })
  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger className='text-white bg-accent p-2 rounded-full items-center flex justify-center'>
            <Download className='w-4 h-4'/>
        </AlertDialogTrigger>

        <AlertDialogContent>
            <AlertDialogDescription>Make merchant withdrawal?</AlertDialogDescription>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button 
                className='bg-accent font-semibold'
                onClick={()=>mutate()}
                disabled= {isPending}
                >
                    {isPending? 'Please wait..': 'Withdraw'}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default MerchantWithdrawButton