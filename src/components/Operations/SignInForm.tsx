"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { hasAccess, setAuthCredentials } from "@/utils/auth-utils-operations"
import useOperations from "@/store/operationsStore"
import axiosInstanceNoAuth from "@/utils/fetch-function-auth"
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"
import PinInput from "@/components/ui/pin-input"
import loginBanner from "@/components/images/auth-banner.png"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { OPERATIONS, REVENUE_ASSURANCE } from '@/utils/constants'

const clientName = process.env.NEXT_PUBLIC_CLIENT_NAME!
const logo = process.env.NEXT_PUBLIC_LOGO_URL! || 'https://mmcpdocs.s3.eu-west-2.amazonaws.com/80254_varisa.jpeg';
export function SignInForm() {
  const currentYear = new Date().getFullYear()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [loginData, setLoginData] = useState<any>(null)
  const [step, setStep] = useState<"credentials" | "otp">("credentials")
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  console.log(clientName);


  const { setOperations } = useOperations()
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const bannerUrl = process.env.NEXT_PUBLIC_BANNER_URL || "https://mmcpdocs.s3.eu-west-2.amazonaws.com/16574_ecommerce-svg.jpg"

  const returnUrl = searchParams.get('returnUrl') || '/operations/dashboard'

  useEffect(() => {
    const savedUsername = localStorage.getItem('remembered_operations_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      axiosInstanceNoAuth.post("/usermanager/weblogin", {
        username: username,
        password: password,
        userlang: "en",
        deviceId: "000",
        channelType: "WEB",
      }),

    onSuccess: (data) => {
      if (rememberMe) {
        localStorage.setItem('remembered_operations_username', username);
      } else {
        localStorage.removeItem('remembered_operations_username');
      }

      setLoginData(data.data)

      if (data?.data?.responseCode !== '00') {
        toast.error(data?.data?.responseMessage)
        return
      }

      if (data?.data?.userRole !== 'PLATFORM_ADMIN' && data?.data?.userRole !== 'OPERATIONS' && data?.data?.userRole !== 'REVENUE_ASSURANCE') {
        toast.error('Not enough permission')
        return
      }

      if (data?.data?.twoFaSetupRequired === 'Y') {
        const tempUserData = {
          ...data.data,
          username: username,
          twoFaSetupRequired: 'Y',
          twoFaReferenceNo: data.data.twoFaReferenceNo,
          twoFaLinkData: data.data.twoFaLinkData
        }

        localStorage.setItem("temp_operations_data", JSON.stringify(tempUserData))

        push('/twofa_setup/operations')
        return
      }

      if (data?.data?.ticketID) {
        toast.success("Please enter OTP from your authenticator app")
        setStep("otp")
      } else {
        toast.error("Wrong credentials")
      }
    },
    onError: (error) => {
      toast.error("Login failed. Please check your credentials.")
    }
  })

  const verifyOtpMutation = useMutation({
    mutationFn: ({ username, otp }: { username: string; otp: string }) =>
      axiosInstanceNoAuth.post("/usermanager/validateLoginOTP", {
        username: username,
        otp: otp,
        mobileNo: "",
        entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || "",
        language: "en",
        externalRefNo: "",
        tranCode: "",
        generateToken: false,
      }),

    onSuccess: (data) => {
      if (data?.data?.code === '000') {
        if (loginData?.ticketID) {
          localStorage.setItem("token_operations", loginData.ticketID)
          localStorage.setItem("operations_store", JSON.stringify({
            ...loginData,
            username: username
          }))
          setOperations({
            ...loginData,
            username: username
          })

          if (hasAccess([loginData.userRole], ["PLATFORM_ADMIN", "OPERATIONS", 'REVENUE_ASSURANCE'])) {
            setAuthCredentials(loginData.ticketID, ['OPERATIONS'])
            push(decodeURIComponent(returnUrl))
            toast.success('Login successful!')
            return
          }
          toast.error("Not enough permission")
        }
      } else {
        toast.error(data?.data?.desc || "Invalid OTP")
      }
    },
    onError: (error) => {
      toast.error("OTP verification failed")
    }
  })

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ password, username })
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }
    verifyOtpMutation.mutate({ username, otp })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleBackToCredentials = () => {
    setStep("credentials")
    setOtp("")
  }

  const isFormValid = username.trim() !== "" && password.trim() !== ""

  return (
    <>
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
              alt="Operations Illustration"
              width={600}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center py-6 sm:px-6 lg:px-12">
          <div className="w-full max-w-md space-y-6">
            {step === "credentials" ? (
              <>
                <div className="space-y-1 text-center">
                  <h1 className="text-xl sm:text-2xl font-medium text-dark-gray">Operations admin.</h1>
                  <p className="text-medium-gray text-sm leading-relaxed">
                    Welcome back, sign in to access your account.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-lg">
                  <form className="space-y-4" onSubmit={handleCredentialSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="username">
                        Username
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loginMutation?.isPending}
                      />
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
                          disabled={loginMutation?.isPending}
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
                      disabled={!isFormValid || loginMutation?.isPending}
                    >
                      {loginMutation?.isPending ? (
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
              </>
            ) : (
              <>
                <div className="space-y-1 text-center">
                  {/* <Button
                    onClick={handleBackToCredentials}
                    variant='link'
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button> */}
                  <h1 className="text-xl sm:text-2xl font-medium text-dark-gray">Two-Factor Authentication</h1>
                  <p className="text-medium-gray text-sm leading-relaxed">
                    Enter the 6-digit verification code from your authenticator app.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-lg">
                  <form className="space-y-6" onSubmit={handleOtpSubmit}>
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <PinInput
                          length={6}
                          value={otp}
                          onChange={setOtp}
                          type="text"
                          className="justify-center"
                          inputClassName="w-12 h-12 text-lg font-semibold bg-accent/10 border-accent focus:border-accent focus:ring-accent"
                          autoFocus
                        />
                      </div>

                      <p className="text-center text-sm text-medium-gray">
                        Please enter the OTP code saved as <span className="text-text">{username}</span> on your authenticator app
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size='lg'
                      className="w-full"
                      disabled={verifyOtpMutation?.isPending || otp.length !== 6}
                    >
                      {verifyOtpMutation?.isPending ? (
                        <>
                          Verifying...
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        "Verify & Continue"
                      )}
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>

          <div className="fixed bottom-4 text-center w-full text-xs text-[#9E9E9E]">
            © {currentYear} {clientName}. All Right Reserved
          </div>
        </div>
      </div>
    </>
  )
}