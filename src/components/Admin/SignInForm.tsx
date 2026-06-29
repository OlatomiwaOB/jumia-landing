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
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import DynamicAuthLayout from "@/components/shared/dynamic-auth-layout"
import { clientConfig } from '@/config/client-config'

const { branding } = clientConfig()
const clientName = branding.clientName
const logo = branding.logos.primary
const brandColor = branding.colors.accent

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

  const bannerUrl = branding.images.banner

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
    <DynamicAuthLayout
      title="Business Admin"
      subtitle="Welcome back, please sign in to your account."
      leftPanelTitle={<>Manage your business with <span className="font-semibold text-[var(--accent)]">confidence.</span></>}
      leftPanelSubtitle="Secure, efficient, and tailored to your brand's needs."
    // footerNode={
    //   <>
    //     <span className="text-sm text-medium-gray">Don&apos;t have an account? </span>
    //     <Link
    //       href="/business-onboarding"
    //       className="text-sm font-semibold text-[var(--accent)] hover:underline"
    //     >
    //       Sign up
    //     </Link>
    //   </>
    // }
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
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
    </DynamicAuthLayout>
  )
}