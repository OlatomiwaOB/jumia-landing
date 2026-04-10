import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axiosCustomer from "@/utils/fetch-function-customer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { UseFormReset } from "react-hook-form";
import { toast } from "sonner";
import { TransferFormData } from "./send-money-from";

interface SuccessModalProps {
  onLogin: () => void;
  onCancel: () => void;
  payloadInfo: any;
  setCurrentStep: (currentStep:"form" | "confirm" | "verify" | "success" | "pending") =>void
  reset: UseFormReset<TransferFormData>
}

export const PendingModal = ({ onLogin, onCancel, payloadInfo,setCurrentStep,reset}: SuccessModalProps) => {
  const [step,setStep] = useState<'pending'|'success'>('pending')
  const queryClient = useQueryClient()
    const {mutate,isPending,data} = useMutation({
        mutationFn: ()=>axiosCustomer({
            url: 'tran-master/tsq',
            params: {
                externalRefNo: payloadInfo?.externalRefNo
            }
        }),
        onSuccess: (data)=>{
            if (data?.data?.responseCode === 'PP') {
              return
            }
            if (data?.data?.responseCode!=='000') {
                toast?.error(data?.data?.responseMessage)
                return
            }
            // setCurrentStep('success')
            setStep('success')
            reset()
            queryClient?.invalidateQueries({
              queryKey: ['customer-balances','customer-recent-trans']
            })
            toast.success(data?.data?.responseMessage)
        },
        onError: ()=>{
            toast.error('something went wrong')
        }
    })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {
        step === 'success' ? <>
          <Card className="w-full max-w-md">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Transaction Successful</h2>
                    
                  </CardHeader>
                  <CardContent className="space-y-6">
          
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">You Sent</span>
                        <div className="text-right">
                          <div className="font-semibold">
                            {data?.data?.amount} {data?.data?.currencyCode}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            From {data?.data?.provider}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recipient Network</span>
                        <span className="font-semibold">{data?.data?.beneficiaryBankCode}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recipient Address</span>
                        <div className="text-right max-w-48">
                          <span className="font-semibold text-xs break-all">
                            {data?.data?.beneficiaryAccount.slice(0, 6)}...{data?.data?.beneficiaryAccount.slice(-4)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-semibold">{data?.data?.createdDate}</span>
                      </div>
                      
                      {/* <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction ID</span>
                        <span className="font-semibold">{transactionId}</span>
                      </div> */}
                      
                      <div className="flex justify-between">
                          <span className="text-muted-foreground">ExternalRefNo</span>
                          <span className="font-semibold max-w-48 text-right">{data?.data?.externalRefNo}</span>
                        </div>
                      
                      {data?.data?.narration && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Purpose</span>
                          <span className="font-semibold max-w-48 text-right">{data.data?.narration}</span>
                        </div>
                      )}
                    </div>
          
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={onCancel} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={onLogin} className="flex-1 bg-accent">
                        Next
                      </Button>
                    </div>
                  </CardContent>
                </Card>
        </>
        :
        <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Clock className="w-16 h-16 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold">Transaction Processing</h2>
          
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="flex gap-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button disabled = {isPending} onClick={()=>mutate()} className="flex-1 bg-accent">
              {isPending ? `Please wait..` : `Check Transaction Status`}
            </Button>
          </div>
        </CardContent>
      </Card>
      }
    </div>
  );
};