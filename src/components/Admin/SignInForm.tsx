"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
// import posIcon from "@/assets/ecommerce-svg.jpg"
import { useMutation } from "@tanstack/react-query"

// import { hasAccess, setAuthCredentials } from "@/utils/auth-utils"
import { toast } from "sonner"
// import useUser from "@/global_states/userStore"
import { useRouter, useSearchParams } from "next/navigation"
import { hasAccess, setAuthCredentials } from "@/utils/auth-utils"
import useUser from "@/store/userStore"
import axiosInstanceNoAuth from "@/utils/fetch-function-auth"
import { Eye, EyeOff } from "lucide-react"
import ForgotPasswordModal from "../forgot-pasword"

export function SignInForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { setUser } = useUser()
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const bannerUrl = process.env.NEXT_PUBLIC_BANNER_URL || "https://mmcpdocs.s3.eu-west-2.amazonaws.com/16574_ecommerce-svg.jpg";

  const returnUrl = searchParams.get('returnUrl') || '/admin/dashboard'
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
      localStorage.setItem("token_store_admin", data.data.ticketID)
      localStorage.setItem("user_store", JSON.stringify(data.data))
      setUser(data?.data)
      if (data?.data?.ticketID) {
        if (hasAccess([data?.data.userRole], ["BUSINESS_MANAGER", "CASHIER", "SALES_REP"])) {
          setAuthCredentials(data?.data.ticketID, [data?.data.userRole])
          push(decodeURIComponent(returnUrl))
          toast.success('Login successful!')
          return
        }
        toast.error("Not enough permission")
      }
      if (data?.data?.responseCode !== '00') {
        toast.error(data?.data?.responseMessage)
      }
      else {
        toast.error("An error occurred")
      }
    },
  })
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ password, username })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true)
  }
  return (
    <><div className="min-h-screen flex flex-col lg:flex-row">

      <div className="absolute top-0 left-0 right-0 h-2 bg-accent"></div>

      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center p-8">
        <Image
          src={bannerUrl}
          alt="POS System Illustration"
          width={600}
          height={600}
          className="max-w-full max-h-full object-contain" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Business admin.</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Welcome back, sign in to access your account.
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required />
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
                  required />
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
              {loginMutation?.isPending ? "Please wait" : "Sign In"}
            </Button>
          </form>

          <div className="text-center">
            <span className="text-sm text-gray-600">Don&apos;t have an account? </span>
            <Link
              href="/business-onboarding"
              className="text-sm text-accent hover:text-accent/70"
            >
              Sign up
            </Link>
          </div>
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