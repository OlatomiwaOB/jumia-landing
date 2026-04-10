import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, DollarSign, Calendar, CheckCircle, Copy } from "lucide-react";
import { useState } from "react";
import { PaymentRequest } from "@/types/";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosCustomer from "@/utils/fetch-function-customer";
import { copyToClipboard } from "@/utils/helperfns";


interface PaymentButtonProps {
  orderId: string;
  paymentRef: string;
  amount: number;
  amountDisplay: string;
  installmentNumber: number;
  scheduleDate: string;
  isDisabled?: boolean;
  variant?: "default" | "outline" | "secondary";
}

export function PaymentButton({ 
  orderId, 
  paymentRef, 
  amount, 
  amountDisplay, 
  installmentNumber, 
  scheduleDate,
  isDisabled = false,
  variant = "default"
}: PaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient()
  const {isPending,mutate} = useMutation({
    mutationFn: (data:any)=>axiosCustomer.request({
      method: 'POST',
      url: '/ecomm-wallet/repay-loan',
      data
    }),
    onSuccess: (data)=>{
      if(data?.data?.code!== '000'){
        toast.error(data?.data?.desc)
        return
      }

      toast.success(data?.data?.desc)
      queryClient.invalidateQueries({queryKey: ['payment-plan']})
      setIsOpen(false)
    },
    onError: (error)=>{
      toast.error('An error occurred while processing your payment.')
    }
  })

  const onSubmitPayment = ()=>{
    const payload = {
      orderNo: orderId,
      amount : amount
    }

    mutate(payload)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size="sm" 
          disabled={isDisabled}
          className="min-w-[100px] bg-accent"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Pay Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Confirm Payment
          </DialogTitle>
          <DialogDescription>
            Review your payment details before proceeding.
          </DialogDescription>
        </DialogHeader>
        
        <Card className="bg-muted/30">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Installment</span>
              <span className="font-medium">#{installmentNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-xl font-bold text-primary">{amountDisplay}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Due Date</span>
              <span className="font-medium">{new Date(scheduleDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Order ID</span>
              <span className="font-mono text-sm">{orderId}</span>
            </div>
            {
              paymentRef && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment Ref</span>
              <span className="font-mono text-sm">{paymentRef.slice(0,4)}...{paymentRef?.slice(-4)}  <button onClick={()=>copyToClipboard(paymentRef)}><Copy className="w-4 h4"/></button></span>
            </div>
              )
            }
          </CardContent>
        </Card>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={onSubmitPayment} disabled={isPending} className="min-w-[120px] bg-accent">
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}