import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import axiosCustomer from "@/utils/fetch-function-no-auth"
import { toast } from "sonner"
import { Label } from "../ui/label"
import { PinInput } from "../ui/pin-input"

interface OtpVerificationProps {
  onBack: () => void
  isLoading?: boolean
  email?: string
  phoneNumber?: string
  onSuccess?: () => void
  autoResendOtp?: boolean
}

const useAutoResendOtp = (email: string | undefined, shouldAutoResend: boolean) => {
  const didResend = useRef(false);

  const mutation = useMutation({
    mutationFn: () => axiosCustomer.request({
      url: '/usermanager/resendotp',
      method: 'GET',
      params: {
        username: email || '',
        entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || '',
      },
    }),
    onSuccess: (data) => {
      if (data?.data?.code !== '000') {
        toast.error(data?.data?.desc || 'Failed to resend OTP')
        return
      }
      toast.success(data?.data?.desc || 'OTP sent successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.desc || "Failed to resend OTP")
    }
  });

  useEffect(() => {
    if (shouldAutoResend && email && !didResend.current) {
      didResend.current = true;
      mutation.mutate();
    }
  }, [shouldAutoResend, email]);

  return mutation;
};

export function OtpVerification({
  onBack,
  isLoading = false,
  email,
  phoneNumber,
  onSuccess,
  autoResendOtp = false
}: OtpVerificationProps) {
  const [otp, setOtp] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(30)

  useAutoResendOtp(email, autoResendOtp);

  const resendOTPMutation = useMutation({
    mutationFn: () => axiosCustomer.request({
      url: '/usermanager/resendotp',
      method: 'GET',
      params: {
        username: email || '',
        entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || '',
      },
    }),
    onSuccess: (data) => {
      setIsResending(false)
      if (data?.data?.code !== '000') {
        toast.error(data?.data?.desc || 'Failed to resend OTP')
        return
      }
      toast.success(data?.data?.desc || 'OTP sent successfully')
      setCountdown(30)
    },
    onError: (error: any) => {
      setIsResending(false)
      toast.error(error.response?.data?.desc || "Failed to resend OTP")
    }
  })

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const { isPending, mutate } = useMutation({
    mutationFn: (data: any) => axiosCustomer.request({
      url: `/ecommerce/customer/verify-otp`,
      method: 'POST',
      data
    }),
    onSuccess: (data) => {
      if (data?.data?.code !== '000') {
        toast.error(data?.data?.desc)
        return
      }
      onSuccess?.()
      toast?.success('OTP verified successfully!')
    },
    onError: (error) => {
      toast.error('Something went wrong!')
    }
  })

  const onVerify = () => {
    const payload = {
      email,
      otp: otp
    }
    mutate(payload)
  }

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not available")
      return
    }
    setIsResending(true)
    resendOTPMutation.mutate()
  }

  const isOtpComplete = otp.length === 4

  return (
    <div className="w-full max-w-md space-y-6 p-5 bg-white rounded-lg justify-self-center mt-20">
      <div className="space-y-2">
        <div className="">
          <h1 className="text-lg text-center sm:text-xl font-medium text-dark-gray">Verify OTP</h1>
        </div>
        <p className="text-medium-gray text-center text-xs leading-relaxed">
          We've sent a 4-digit verification code to {""} <br />
          <span className="font-medium text-faded-accent">
            {email && (() => {
              const [username, domain] = email.split('@');
              return `${username[0]}***@${domain}`;
            })()}
            {phoneNumber && ` and ${phoneNumber.slice(0, 3)}***${phoneNumber.slice(-2)}`}
          </span>
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-center block">
            Enter Verification Code
          </Label>

          <PinInput
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
            className="justify-center text-dark-gray"
            inputClassName="w-12 h-12 text-lg font-semibold bg-accent/10 border-accent focus:border-accent focus:ring-accent"
            autoFocus
          />

          <div className="text-xs flex items-center justify-center gap-2">
            <p className="text-medium-gray">
              Didn't get a code?
            </p>

            <div>
              {countdown > 0 ? (
                <p className="text-faded-accent">
                  Resend in {countdown}s
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-xs flex items-center text-faded-accent hover:text-accent/70 font-medium disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      Sending...
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Click to Resend"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Button
            onClick={onVerify}
            disabled={!isOtpComplete || isPending}
            className="w-full"
          >
            {isPending ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </div>
    </div>
  )
}