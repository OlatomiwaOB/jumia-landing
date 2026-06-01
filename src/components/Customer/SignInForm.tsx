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
import loginBanner from "@/components/images/auth-banner.png"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { OtpVerification } from "./otp-verification"

const clientName = process.env.NEXT_PUBLIC_CLIENT_NAME!
const logo = process.env.NEXT_PUBLIC_LOGO_URL! || 'https://mmcpdocs.s3.eu-west-2.amazonaws.com/80254_varisa.jpeg';

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

  const bannerUrl = process.env.NEXT_PUBLIC_BANNER_URL || "https://mmcpdocs.s3.eu-west-2.amazonaws.com/16574_ecommerce-svg.jpg";
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || '';

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
      setCustomer(data?.data)

      if (data?.data?.ticketID) {
        if (hasAccess([data?.data.userRole], ["CUSTOMER"])) {
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
    <>
      {showOtpVerification ? (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#F9FAFB]">
          <div className='h-screen hidden lg:flex lg:w-1/2 items-center justify-center p-4'>
            <div className="bg-gradient-to-b from-[#F9FAFB] to-[#FE7211] shadow-0 rounded-2xl w-full h-full flex items-center justify-center relative">
              <Image
                src={logo}
                alt="Logo"
                width={600}
                height={600}
                className="absolute top-0 left-0 p-5 max-w-[250px] h-auto object-contain"
              />
              <Image
                src={loginBanner}
                alt="POS System Illustration"
                width={600}
                height={600}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-6 sm:px-6 lg:px-12">
            <OtpVerification
              onBack={handleOtpBack}
              email={pendingEmail}
              onSuccess={handleOtpSuccess}
              autoResendOtp={true}
            />
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#F9FAFB]">
          <div className=' h-screen hidden lg:flex lg:w-1/2  items-center justify-center p-4'>
            <div className="bg-gradient-to-b from-[#F9FAFB] to-[var(--accent)] shadow-0 rounded-2xl w-full h-full flex items-center justify-center relative">
              <Image
                src={logo}
                alt="Logo"
                width={100}
                height={100}
                className="absolute top-0 left-0 p-5 max-w-[250px] h-auto object-contain"
              />
              <Image
                src={loginBanner}
                alt="POS System Illustration"
                width={600}
                height={600}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-6 sm:px-6 lg:px-12">
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-1 text-center">
                <h1 className="text-xl sm:text-2xl font-medium text-dark-gray">Customer login.</h1>
                <p className="text-medium-gray text-sm leading-relaxed">
                  Welcome back, sign in to access your account.
                </p>
              </div>

              <div className="bg-white p-5 rounded-lg">
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="username">
                      Email address
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter email address"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password
                    </Label>
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
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
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
                    size='lg'
                    className="mt-10 w-full"
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
              </div>

              <div className="text-center">
                <span className="text-sm text-medium-gray">Don&apos;t have an account? </span>
                <Link
                  href="/customer-onboarding"
                  className="text-sm font-semibold text-text hover:text-accent/70"
                >
                  Create account
                </Link>
              </div>
            </div>

            <div className="fixed bottom-4 text-center w-full text-xs text-[#9E9E9E]">
              © {currentYear} {clientName}. All Right Reserved
            </div>
          </div>
        </div>
      )}
    </>
  )
}