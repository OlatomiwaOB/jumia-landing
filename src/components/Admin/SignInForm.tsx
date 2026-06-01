"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import useUser from "@/store/userStore"
import { hasAccess, setAuthCredentials } from "@/utils/auth-utils"
import axiosInstanceNoAuth from "@/utils/fetch-function-auth"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import loginBanner from "@/components/images/auth-banner.png"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"

const clientName = process.env.NEXT_PUBLIC_CLIENT_NAME!
const logo = process.env.NEXT_PUBLIC_LOGO_URL! || 'https://mmcpdocs.s3.eu-west-2.amazonaws.com/80254_varisa.jpeg';
const brandColor = process.env.NEXT_PUBLIC_ACCENT_COLOR!

export function SignInForm() {
  const currentYear = new Date().getFullYear()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { push } = useRouter()
  const { setUser } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()

  const returnUrl = searchParams.get('returnUrl') || '/admin/dashboard'

  const bannerUrl = process.env.NEXT_PUBLIC_BANNER_URL || "https://mmcpdocs.s3.eu-west-2.amazonaws.com/16574_ecommerce-svg.jpg"

  useEffect(() => {
    const savedUsername = localStorage.getItem('remembered_admin_username')
    if (savedUsername) {
      setUsername(savedUsername)
      setRememberMe(true)
    }
  }, [])

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axiosInstanceNoAuth.post("/usermanager/weblogin", data),
    onSuccess: (data) => {
      if (rememberMe) {
        localStorage.setItem('remembered_admin_username', username)
      } else {
        localStorage.removeItem('remembered_admin_username')
      }
      localStorage.setItem("token_store_admin", data.data.ticketID)
      localStorage.setItem("user_store", JSON.stringify(data.data))
      setUser(data?.data)

      if (data?.data?.ticketID) {
        if (hasAccess([data?.data.userRole], ["BUSINESS_MANAGER", "CASHIER", "SALES_REP"])) {
          setAuthCredentials(data?.data.ticketID, [data?.data.userRole])
          // if (data?.data?.twoFaSetupRequired === 'Y') {
          //   push(`/twofa_setup/admin`)
          //   return
          // }
          toast.success('Login successful!')
          push(decodeURIComponent(returnUrl))
          return
        }
        toast.error("Not enough permission")
      }
      if (data?.data?.responseCode !== '00') {
        toast.error(data?.data?.responseMessage)
      } else {
        toast.error("An error occurred")
      }
    },
    onError: () => {
      toast.error("Login failed. Please try again.")
    }
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      username: username,
      password: password,
      userlang: "en",
      deviceId: "000",
      channelType: "WEB",
    }
    mutate(payload)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const isFormValid = username.trim() !== "" && password.trim() !== ""

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F9FAFB]">
      <div className='h-screen hidden lg:flex lg:w-1/2 items-center justify-center p-4'>
        <div className={`bg-gradient-to-b from-[#F9FAFB] to-[var(--accent)] shadow-0 rounded-2xl w-full h-full flex items-center justify-center relative`}>
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
            <h1 className="text-xl sm:text-2xl font-medium text-dark-gray">Business admin.</h1>
            <p className="text-medium-gray text-sm leading-relaxed">
              Welcome back, sign in to access your account.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg">
            <form className="space-y-4" onSubmit={onSubmit}>
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

                  <Button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    variant="link"
                    className="text-sm"
                  >
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
              href="/business-onboarding"
              className="text-sm font-semibold text-text hover:text-accent/70"
            >
              Sign up
            </Link>
          </div>
        </div>

        <div className="fixed bottom-4 text-center w-full text-xs text-[#9E9E9E]">
          © {currentYear} {clientName}. All Right Reserved
        </div>
      </div>
    </div>
  )
}