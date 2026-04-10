"use client"

import { useState } from "react"
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
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import ForgotPasswordModal from "../forgot-pasword"
import PinInput from "@/components/ui/pin-input"

export function SignInForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [loginData, setLoginData] = useState<any>(null)
  const [step, setStep] = useState<"credentials" | "otp">("credentials")

  const { setOperations } = useOperations()
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const bannerUrl = process.env.NEXT_PUBLIC_BANNER_URL || "https://mmcpdocs.s3.eu-west-2.amazonaws.com/16574_ecommerce-svg.jpg"

  const returnUrl = searchParams.get('returnUrl') || '/operations/dashboard'

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
      setLoginData(data.data)

      if (data?.data?.responseCode !== '00') {
        toast.error(data?.data?.responseMessage)
        return
      }

      if (data?.data?.userRole !== 'PLATFORM_ADMIN') {
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

          if (hasAccess([loginData.userRole], ["PLATFORM_ADMIN", "OPERATIONS"])) {
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

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true)
  }

  const handleBackToCredentials = () => {
    setStep("credentials")
    setOtp("")
  }

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="absolute top-0 left-0 right-0 h-2 bg-accent"></div>

        <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center p-8">
          <Image
            src={bannerUrl}
            alt="POS System Illustration"
            width={600}
            height={600}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
          <div className="w-full max-w-md space-y-6">
            {step === "credentials" ? (
              <>
                <div className="space-y-2 text-center lg:text-left">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Operations admin.</h1>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Welcome back, sign in to access your account.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleCredentialSubmit}>
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={loginMutation?.isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loginMutation?.isPending}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleForgotPasswordClick}
                      className="text-sm relative right-0 text-accent underline cursor-pointer"
                    >
                      Forgot your password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent-foreground text-white py-3 rounded-md font-medium"
                    disabled={loginMutation?.isPending}
                  >
                    {loginMutation?.isPending ? "Please wait" : "Proceed"}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <div className="space-y-2 text-center lg:text-left">
                  <button
                    onClick={handleBackToCredentials}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </button>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Two-Factor Authentication</h1>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Enter the 6-digit verification code from your authenticator app.
                  </p>
                </div>

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

                    <p className="text-center text-sm text-gray-500">
                      Please enter the OTP code saved as {username} on your authenticator app
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent-foreground text-white py-3 rounded-md font-medium"
                    disabled={verifyOtpMutation?.isPending || otp.length !== 6}
                  >
                    {verifyOtpMutation?.isPending ? "Verifying..." : "Verify & Continue"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        setIsOpen={setShowForgotPassword}
      />
    </>
  )
}