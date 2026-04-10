'use client'
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { any, z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpDown, Bitcoin, DollarSign } from "lucide-react";
import { CurrencySelector } from "./currency-selector";
import { ConfirmationModal } from "./confirmation-modal";
import { VerificationModal } from "./verification-modal";
import { SuccessModal } from "./success-modal";
import { useLocationStore } from "@/store/locationStore";
import useCustomer from "@/store/customerStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosCustomer from "@/utils/fetch-function-customer";
import { toast } from "sonner";
import { generateRandomNumber } from "@/utils/helperfns";
import { PendingModal } from "./pending-modal";

interface Coin {
  id: string | null;
  accountNo: string;
  accountType: string;
  entityCode: string | null;
  symbol: string;
  chain: string;
  username: string | null;
  publicAddress: string;
  name: string;
  label: string | null;
  balance: number;
  usdBalance: number | null;
  lcyBalance: number | null;
  lcyCcy: string | null;
  logo: string;
  status: string | null;
}

const transferSchema = z.object({
  fromAmount: z.string().trim().min(1, "Amount is required"),
  fromCurrency: z.object({
    id: z.number().nullable().optional(),
    accountNo: z.string(),
    accountType: z.string(),
    entityCode: z.string().nullable(),
    symbol: z.string(),
    chain: z.string(),
    username: z.string().nullable(),
    publicAddress: z.string(),
    name: z.string(),
    label: z.string().nullable(),
    balance: z.number(),
    usdBalance: z.number().nullable(),
    lcyBalance: z.number().nullable(),
    lcyCcy: z.string().nullable(),
    logo: z.string(),
    status: z.string().nullable(),
  }),
  recipientNetwork: z.string().min(1, "Network is required"),
  recipientAddress: z.string().min(1, "Address is required"),
  purposeOfPayment: z.string().optional(),
  saveBeneficiary: z.boolean(),
});

export type TransferFormData = z.infer<typeof transferSchema>;

export const TransferForm = () => {
  const [currentStep, setCurrentStep] = useState<"form" | "confirm" | "verify" | "success" | "pending">("form");
  const [selectedFromCoin, setSelectedFromCoin] = useState<Coin | null>(null);
  const {customer} = useCustomer()
  const [payloadInfo,setPayloadInfo] = useState<any>(null)

  console.log(customer);

 useEffect(()=>{
    setValue('recipientNetwork', selectedFromCoin?.chain || '')
 },[selectedFromCoin])
  
  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromAmount: '',
      recipientNetwork: "",
      recipientAddress: "",
      purposeOfPayment: "",
      saveBeneficiary: false,
    },
  });
  const queryClient = useQueryClient()

  const {location} = useLocationStore()

  console.log(location);
  

  const { handleSubmit, watch, setValue, getValues, reset, formState:{errors} } = form;

  console.log(getValues());

  console.log(errors);
  


  const onSubmit = (data: TransferFormData) => {
    // Add the selected coin objects to the form data
    console.log(`Transfer form data:`, data);
    
    const finalData = {
      ...data,
      fromCurrency: selectedFromCoin,
      // toCurrency: selectedToCoin,
    };
    console.log("Form submitted with full coin data:", finalData);
    setCurrentStep("confirm");
  };


  console.log(selectedFromCoin);
  

  const {mutate,isPending} = useMutation({
    mutationFn: (data:any) => axiosCustomer.request({
      url: '/tran-master/submit',
      method: 'POST',
      data
    }),
    onSuccess: (data)=>{
      if (data?.data?.responseCode === 'PP') {
        setCurrentStep('pending')
        toast.warning(data?.data?.responseMessage)
        return
      }
      
      if (data?.data?.responseCode!=='000') {
        toast?.error(data?.data?.responseMessage)
        reset()
        queryClient?.invalidateQueries({
              queryKey: ['customer-balances','customer-recent-trans']
            })
        return
      }
      toast.success(data?.data?.responseMessage)
      setCurrentStep('success')
    },
    onError: (error)=>{
      console.log(error);
    }
  })

  const handleConfirm = () => {
    const payload = {
      externalRefNo: `CNCN${generateRandomNumber(10)}`,
      deviceId: '111',
      sourceAccount: getValues('fromCurrency.publicAddress'),
      senderCcy: getValues('fromCurrency.symbol'),
      senderNetwork: getValues('fromCurrency.chain'),
      senderAccountType: "COIN",
      exchRate: 1.0,
      tranCode: "",
      senderName: `${customer?.fullname}`,
      senderMobile: customer?.mobileNo,
      senderBankCode: getValues('fromCurrency.chain'),
      beneficiaryAccount: getValues('recipientAddress'),
      beneficiaryName: `${customer?.fullname}-RECIPIENT`,
      beneficiaryEntityCode: selectedFromCoin?.chain || '',
      beneficiaryAccountType: "COIN",
      beneficiaryCcy: selectedFromCoin?.symbol || '',
      geolocation: `${location?.latitude}, ${location?.longitude}`,
      amount: getValues('fromAmount'),
      charge: 5.00,
      narration: getValues('purposeOfPayment'),
      channelType: "WEB",
      username: customer?.username
    }
    setPayloadInfo({...payload})
    mutate(payload)
  };

  const handleVerification = () => {
    setCurrentStep("success");
  };

  const handleFromCurrencyChange = (coin: Coin) => {
    setSelectedFromCoin(coin);
    // You can also update the form if needed
    setValue("fromCurrency", coin);
  };

 

  if (currentStep === "confirm") {
    return (
      <ConfirmationModal
        data={{
          ...form.getValues(),
          fromCurrency: selectedFromCoin,
          // toCurrency: selectedToCoin,
        }}
        onConfirm={handleConfirm}
        onCancel={() => {
          setCurrentStep("form")
          setPayloadInfo(null)
        }}
        isPending= {isPending}
      />
    );
  }

  if (currentStep === "verify") {
    return (
      <VerificationModal
        onVerify={handleVerification}
        onCancel={() => setCurrentStep("confirm")}
      />
    );
  }

  if (currentStep === "success") {
    return (
      <SuccessModal
        data={{
          ...form.getValues(),
          fromCurrency: selectedFromCoin,
          // toCurrency: selectedToCoin,
          payloadInfo: payloadInfo
        }}
        onLogin={() => setCurrentStep("form")}
        onCancel={() => setCurrentStep("form")}
      />
    );
  }

  if (currentStep === 'pending') {
    return (
      <PendingModal
    onCancel={() => {
          setCurrentStep("form")
          setPayloadInfo(null)
        }}
    onLogin={() => {
          setCurrentStep("form")
          setPayloadInfo(null)
        }}
     payloadInfo = {payloadInfo}
     setCurrentStep = {setCurrentStep}
     reset = {reset}
    />
    )
  }
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Send Money</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Enter Amount Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 items-center">
              <div className="space-y-2">
                <Label htmlFor="fromAmount">Amount to send</Label>
                <div className="flex gap-2">
                  <CurrencySelector
                    value={selectedFromCoin}
                    onChange={handleFromCurrencyChange}
                  />
                  <Input
                    id="fromAmount"
                    type="text"
                    {...form.register("fromAmount")}
                    className="flex-1"
                    disabled= {!getValues('fromCurrency')}
                    max={selectedFromCoin?.balance || undefined}
                  />
                </div>
                {selectedFromCoin && (
                  <div className="text-sm text-muted-foreground">
                    Available: {selectedFromCoin.balance} {selectedFromCoin.symbol} on {selectedFromCoin.chain}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Select Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Details</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipientNetwork">Recipient Network</Label>
                <Input
                  id="recipientNetwork"
                  placeholder="Select Recipient Network"
                  {...form.register("recipientNetwork")}
                  readOnly
                />
              </div>
              
              <div>
                <Label htmlFor="recipientAddress">Paste Address</Label>
                <Input
                  id="recipientAddress"
                  placeholder="Paste Address"
                  {...form.register("recipientAddress")}
                />
              </div>
              
              <div>
                <Label htmlFor="purposeOfPayment">Purpose Of Payment</Label>
                <Textarea
                  id="purposeOfPayment"
                  placeholder="Enter Description"
                  {...form.register("purposeOfPayment")}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {currentStep !== 'form' && (
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1 bg-accent">
              Next
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};