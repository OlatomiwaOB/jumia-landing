'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, Calendar, Loader2, Shield, TrendingUp, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useCart } from '@/store/cart';
import { useToast } from '@/app/hooks/use-toast';
import { useFileUpload } from '@/app/hooks/useUpload';
import Personal from './bnpl/Personal'
import Work from './bnpl/Work'
import Documents from './bnpl/Documents'
import PaymentSchedulePreview from './bnpl/PaymentSchedulePreview'
import LivenessTrigger from './bnpl/LivenessTrigger'
import { useMutation } from '@tanstack/react-query'

import { toast } from 'sonner'
import { fileUrlFormatted, formatDateToDDMMYYYY, getCurrentDate } from '@/utils/helperfns'
import { useRouter, useSearchParams } from 'next/navigation'
import BNPLApproved from './bnpl-approved'
import { BNPLStep, CheckoutStep, CreditScoreData } from '@/app/checkout/checkoutContent'
import axiosCustomer from '@/utils/fetch-function-customer'
import useCustomer from '@/store/customerStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import WorkEmailOtpValidation from './bnpl/work-email-otp-validation'
import { getClientIdentifiers } from '@/config/client-config';

export interface RegistrationData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  employer: string;
  jobTitle: string;
  annualIncome: string;
  annualIncomeRange: string;
  employerWebsite: string;
  employmentStatus: string;
  employmentStartDate?: string;
  password: string;
  linkedinUrl: string;
  socialUsername: string;
  hasExistingCredit: string;
  workEmail: string;
  nationality: string;
  bvn?: string;
  nin?: string;
  payslip?: File | null;
  bankStatement?: File | null;
  idDocument?: File | null;
  utilityBill?: File | null;
  livenessCompleted?: boolean;
  totalAmount?: number
}

const BNPL = () => {
  const form = useForm<RegistrationData>()
  const router = useRouter()
  const [score, setScore] = useState(null)
  const searchParams = useSearchParams()
  const storeCode = searchParams.get('storeCode') || ''
  const [bnplStep, setBnplStep] = useState<"registration" | "scoring" | "approved" | "rejected">('registration')
  // const [checkoutData,setCheckoutData] = useState<any>(null)
  const { customer } = useCustomer()
  const [workEmailConfirmed,setWorkEmailConfirmed] = useState(false)
  const [isOpen,setIsOpen] = useState(false)
  useEffect(() => {
    router?.push(`?storeCode=${getClientIdentifiers().storeCode}`)
  }, [router])
  // console.log(customer);
  const totalAmount = form.watch('totalAmount')
  // console.log(totalAmount);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axiosCustomer.request({
      url: '/ecomm-wallet/apply-bnpl',
      method: 'POST',
      params: {
        currency: customer?.ccy || 'GBP'
      },
      data
    }),
    onSuccess: (data) => {
      if (data?.data?.responseCode !== '000') {
        toast.error(data?.data?.responseMessage || 'An error occurred')
        return
      }
      toast.success('Registration successful! Please complete the liveness check.')
      setScore(data?.data)
      setBnplStep('approved')
    },
    onError: (error) => {
      toast.error('Something went wrong')
    }
  })

  const handleSubmit = () => {
    const dets = form.getValues();
    const onboardDocs = []
    if (dets?.payslip) {
      onboardDocs.push({
        link: fileUrlFormatted(dets?.payslip as any),
        documentType: 'PAY_SLIP',
        comment: '',
        name: 'PAY_SLIP'
      })
    }
    if (dets?.bankStatement) {
      onboardDocs.push({
        link: fileUrlFormatted(dets?.bankStatement as any),
        documentType: 'BANK_STATEMENT',
        comment: '',
        name: 'BANK_STATEMENT'
      })
    }
    if (dets?.utilityBill) {
      onboardDocs.push({
        link: fileUrlFormatted(dets?.utilityBill as any),
        documentType: 'UTILITY_BILL',
        comment: '',
        name: 'UTILITY_BILL'
      })
    }

    if (dets?.idDocument) {
      onboardDocs.push({
        link: fileUrlFormatted(dets?.idDocument as any),
        documentType: 'IDENTITY_CARD',
        comment: '',
        name: 'IDENTITY_CARD'
      })
    }

    const payload = {
      incomeData: {
        annualIncomeRange: "2M - 5M",
        employmentStatus: dets?.employmentStatus,
        employerName: dets?.employer,
        workEmail: dets?.workEmail,
        annualSalary: dets?.annualIncome,
        workPhoneNumber: "",
        jobTitle: dets?.jobTitle,
        employmentStartDate: formatDateToDDMMYYYY(dets?.employmentStartDate)
      },
      socialMediaList: [
        {
          link: dets?.linkedinUrl,
          username: dets?.socialUsername,
          createdDate: "string",
          followers: 0,
          company: "LINKEDIN"
        }
      ],
      documentUploads: onboardDocs,
      channel: 'WEB',
      storeCode: storeCode,
      entityCode: customer?.entityCode,
      // orderNo: checkoutData?.orderNo,
      // currency: customer?.ccy || 'GBP',
      totalAmount: Number(dets?.totalAmount) || 0
    }

    mutate(payload)
  }

  const workEmail = form.watch('workEmail')

  // func to send OTP to customers work email

  const {mutate:sendOtp,isPending:sendingOtp} = useMutation({
     mutationFn: (data)=>axiosCustomer.request({
      url: '/customer-kyc/work-email/send-otp',
      method: 'POST',
      params: {
        email: workEmail
      },
      data
     }),
     onSuccess: (data)=>{
      if (data?.data?.code !== '000') {
        toast.error(data?.data?.desc)
        return
      }
      toast.success(data?.data?.desc)
      setIsOpen(true)
     },
     onError: (error)=>{
      toast.error('Something went wrong!')
     }
  })


  return (
    <>
      
      <Dialog open = {isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
          </DialogHeader>
          <WorkEmailOtpValidation
           email = {workEmail}
           setWorkEmailConfirmed = {setWorkEmailConfirmed}
           setIsOpen = {setIsOpen}
          />
        </DialogContent>
      </Dialog>
      <Suspense>
        {
          bnplStep === 'approved'
            ?
            <BNPLApproved
              score={score}

            />
            :
            <div className="max-w-6xl mx-auto space-y-6 py-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router?.back()}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-2xl font-bold">Buy Now Pay Later - Registration</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 relative">
                {/* Registration Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      KYC & Registration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>

                        {/* <Personal
                      form={form}
                      /> */}
                        <Work
                          form={form}
                        />
                        {/* Document uploads */}
                        <Documents
                          form={form}
                        />

                        <Button disabled={sendingOtp||!workEmail || workEmailConfirmed} type="button" className="w-full bg-blue-600 hover:bg-blue-700" onClick={()=>sendOtp()}>
                          {sendingOtp ? 'Please wait...' : <>
                            <Shield className="w-4 h-4 mr-2" />
                            Validate Work Email
                          </>}
                        </Button>

                        <Button disabled={isPending || !workEmailConfirmed} type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                          {isPending ? 'Please wait...' : <>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Submit for Credit Assessment
                          </>}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Payment Schedule Preview */}
                <PaymentSchedulePreview
                  totalAmount={totalAmount}
                />
              </div>
            </div>
        }
      </Suspense>
    </>
  )
}

export default BNPL