import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import axiosCustomer from "@/utils/fetch-function-no-auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface OtpVerificationProps {
  onBack: () => void
  isLoading?: boolean
  email?: string
  phoneNumber?: string
}

export function OtpVerification({
  onBack,
  isLoading = false,
  email,
  phoneNumber
}: OtpVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", ""])
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

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
      toast?.success(data?.data?.desc)
      setTimeout(() => {
        router?.push(`/customer-login`)
      }, 5000)
    },
    onError: (error) => {
      // console.log(error);
      toast.error('Something went wrong!')
    }
  })

  const onVerify = () => {
    const payload = {
      email,
      otp: otp.join('')
    }

    mutate(payload)
  }

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)

    // Focus next input
    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 4)

    if (/^\d+$/.test(pastedData)) {
      const newOtp = Array.from(pastedData.padEnd(4, "")).slice(0, 4)
      setOtp(newOtp)

      // Focus the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex(digit => digit === "")
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
      inputRefs.current[focusIndex]?.focus()
    }
  }

  const resendOTPMutation = useMutation({
    mutationFn: () => axiosCustomer.request({
      url: '/usermanager/resendotp',
      method: 'GET',
      params: {
        username: email || '',
        entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || '',
        action: 'RESEND_OTP'
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

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not available")
      return
    }

    setIsResending(true)
    resendOTPMutation.mutate()
  }

  const isOtpComplete = otp.every(digit => digit !== "")

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">VERIFY OTP</h1>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed ml-11">
          We've sent a 4-digit verification code to {""}
          <span className="font-medium text-gray-900">
            {email && (() => {
              const [username, domain] = email.split('@');
              return `${username[0]}***@${domain}`;
            })()}
            {phoneNumber && ` and ${phoneNumber.slice(0, 3)}***${phoneNumber.slice(-2)}`}
          </span>
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-center text-gray-700">
            Enter verification code
          </label>

          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el) as any}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-accent/60 focus:ring-0"
                disabled={isLoading}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={onVerify}
            disabled={!isOtpComplete || isPending}
            className="w-full bg-accent/60 hover:bg-accent/70 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Verifying..." : "Verify Code"}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Didn't receive the code?
            </p>

            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                Resend in {countdown}s
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-sm text-accent/60 hover:text-accent/70 font-medium disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Enter the 4-digit code to complete verification
        </span>
      </div>
    </div>
  )
}