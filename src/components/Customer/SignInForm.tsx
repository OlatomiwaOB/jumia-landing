"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import useCustomer from "@/store/customerStore"
import { hasAccess, setAuthCredentials } from "@/utils/auth-utils-customer"
import axiosCustomer from "@/utils/fetch-function-no-auth"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { OtpVerification } from "./otp-verification"
import DynamicAuthLayout from "@/components/shared/dynamic-auth-layout"
import { clientConfig, getClientIdentifiers } from '@/config/client-config'

const { branding } = clientConfig()
const clientName = branding.clientName
const logo = branding.logos.primary

export function SignInForm() {
  const currentYear = new Date().getFullYear()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [pendingEmail, setPendingEmail] = useState("")
  const { push } = useRouter()
  const { setCustomer } = useCustomer()
  const searchParams = useSearchParams()
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter();

  const returnUrl = searchParams.get('returnUrl') || '/dashboard'

  const bannerUrl = branding.images.banner
  const entityCode = getClientIdentifiers().entityCode;

  useEffect(() => {
    const savedUsername = localStorage.getItem('remembered_customer_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axiosCustomer.request({
      url: '/ecommerce/login',
      method: 'POST',
      data,
    }),
    onSuccess: (data) => {
      if (data?.data?.responseCode === 'E70'
        // &&
        // data?.data?.responseMessage?.toLowerCase().includes('otp')
      ) {
        toast.error('Please verify the OTP sent to your email to complete login.')
        setPendingEmail(username)
        setShowOtpVerification(true)
        return
      }
      if (rememberMe) {
        localStorage.setItem('remembered_customer_username', username);
      } else {
        localStorage.removeItem('remembered_customer_username');
      }
      localStorage.setItem("token_customer", data.data.ticketID)
      localStorage.setItem("customer_store", JSON.stringify(data.data))


      if (data?.data?.ticketID) {
        if (hasAccess([data?.data.userRole], ["CUSTOMER"])) {
          setCustomer(data?.data)
          setAuthCredentials(data?.data.ticketID, ['CUSTOMER'])
          if (data?.data?.twoFaSetupRequired === 'Y') {
            push(`/twofa_setup/customer`)
            return
          }
          toast.success('Login successful!')
          push(decodeURIComponent(returnUrl))
          return
        }
      }
      else {
        toast.error(data?.data?.responseMessage)
      }
    },
    onError: (error) => {
      toast.error("Login failed. Please try again.")
    }
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      username: username,
      password: password,
      entityCode: entityCode,
      language: 'en',
      channelType: 'WEB',
      deviceId: ''
    }

    mutate(payload)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true)
  }

  const handleOtpSuccess = () => {
    setShowOtpVerification(false)
    // toast.success('OTP verified successfully! Please sign in.')
  }

  const handleOtpBack = () => {
    setShowOtpVerification(false)
    setPendingEmail("")
  }

  const isFormValid = username.trim() !== "" && password.trim() !== ""

  return (
    <DynamicAuthLayout
      title={showOtpVerification ? undefined : "Customer Login"}
      subtitle={showOtpVerification ? undefined : "Welcome back, please sign in to your account."}
      leftPanelSubtitle="Manage your orders, profile and many more."
      footerNode={
        !showOtpVerification && (
          <>
            <span className="text-sm text-medium-gray">Don&apos;t have an account? </span>
            <Link
              href="/customer-onboarding"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              Create account
            </Link>
          </>
        )
      }
    >
      {showOtpVerification ? (
        <OtpVerification
          onBack={handleOtpBack}
          email={pendingEmail}
          onSuccess={handleOtpSuccess}
          autoResendOtp={true}
        />
      ) : (
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">Email address</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter email address"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-gray-700 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm text-medium-gray cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>

              <Button type="button" onClick={() => router.push('/forgot-password')} variant="link" className="text-sm">
                Forgot your password?
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-8 w-full bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white shadow-none font-medium h-12 rounded-lg"
            disabled={!isFormValid || isPending}
          >
            {isPending ? (
              <>
                Signing in...
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      )}
    </DynamicAuthLayout>
  )
}