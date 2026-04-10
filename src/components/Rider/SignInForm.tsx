"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"


import useRider from "@/store/ridersStore"
import { hasAccess, setAuthCredentials } from "@/utils/auth-utils-riders"
import axiosRider from "@/utils/fetch-function-rider-auth"
import { Eye, EyeOff } from "lucide-react"
import ForgotPasswordModal from "../forgot-pasword"


export function SignInForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { push } = useRouter()
  const { setRider } = useRider()
  const searchParams = useSearchParams()

  const returnUrl = searchParams.get('returnUrl') || '/rider/dashboard'

  const bannerUrl = process.env.NEXT_PUBLIC_BANNER_URL || "https://mmcpdocs.s3.eu-west-2.amazonaws.com/16574_ecommerce-svg.jpg";
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || '';

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axiosRider.request({
      url: '/ecommerce/login',
      method: 'POST',
      data,
    }),
    onSuccess: (data) => {
      localStorage.setItem("token_riders", data.data.ticketID)
      localStorage.setItem("riders_store", JSON.stringify(data.data))
      setRider(data?.data)

      if (data?.data?.ticketID) {
        if (hasAccess([data?.data.userRole], ["RIDER"])) {
          setAuthCredentials(data?.data.ticketID, ['RIDER'])
          // if (data?.data?.twoFaSetupRequired === 'Y') {
          //   push(`/twofa_setup/customer`)
          //   return
          // }
          // Redirect to the original intended page or dashboard
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
      // console.log(error);
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
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Rider login.</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Welcome back, sign in to access your account.
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username/Email
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
              className="w-full bg-accent hover:bg-accent/70 text-white py-3 rounded-md font-medium"
              disabled={isPending}
            >
              {isPending ? "Please wait" : "Sign In"}
            </Button>
          </form>

          <div className="text-center">
            <span className="text-sm text-gray-600">Don&apos;t have an account? </span>
            <Link
              href="/rider-onboarding"
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