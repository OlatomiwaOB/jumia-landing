'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/utils/fetch-function-no-auth'
import { toast } from 'sonner'
import PinInput from '@/components/ui/pin-input'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { getClientIdentifiers } from '@/config/client-config';

type ForgotPasswordFormData = {
  username: string
}

type SetPasswordFormData = {
  newPassword: string
  confirmPassword: string
}

const validateStrongPassword = (password: string): { isValid: boolean; strength: 'weak' | 'medium' | 'strong'; message: string } => {
  if (password.length < 8) {
    return { isValid: false, strength: 'weak', message: 'Password must be at least 8 characters long' };
  }
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const requirementsMet = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  if (requirementsMet === 4) return { isValid: true, strength: 'strong', message: 'Strong password' };
  else if (requirementsMet >= 3) return { isValid: true, strength: 'medium', message: 'Medium strength password' };
  else return { isValid: false, strength: 'weak', message: 'Include uppercase, lowercase, numbers, and special characters' };
}

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  if (!password) return null;
  const validation = validateStrongPassword(password);
  const getStrengthColor = () => {
    switch (validation.strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-[#111]';
      default: return 'bg-gray-300';
    }
  };
  const getStrengthText = () => {
    switch (validation.strength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return '';
    }
  };
  const getStrengthTextColor = () => {
    switch (validation.strength) {
      case 'weak': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-[#111]';
      default: return 'text-gray-500';
    }
  };
  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-gray-500">Strength:</span>
        <span className={`font-semibold ${getStrengthTextColor()}`}>{getStrengthText()}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: validation.strength === 'weak' ? '33%' : validation.strength === 'medium' ? '66%' : '100%' }}
        />
      </div>
      <p className={`text-[13px] ${validation.isValid ? 'text-green-600' : 'text-red-500'}`}>{validation.message}</p>
    </div>
  );
};

const PasswordInput: React.FC<{
  placeholder: string;
  error?: string;
  showStrength?: boolean;
  password: string;
  register: any;
  name: 'newPassword' | 'confirmPassword';
}> = ({ placeholder, error, showStrength = false, password, register, name }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          {...register(name, {
            required: `Password is required`,
            minLength: showStrength ? { value: 8, message: 'Password must be at least 8 characters long' } : undefined,
            validate: !showStrength ? (value: string) => value === password || 'Password does not match' : undefined
          })}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="rounded-full px-6 py-6 text-[15px] border-gray-200 focus-visible:ring-[#111] pr-12 w-full"
        />
        <button
          type="button"
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#111] transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error && <p className="text-sm text-red-500 px-2">{error}</p>}
      {showStrength && password && <PasswordStrengthIndicator password={password} />}
    </div>
  );
};

export default function LostPasswordPage() {
  const [currentStep, setCurrentStep] = useState<'initiate' | 'validate-otp' | 'set-password'>('initiate')
  const [username, setUsername] = useState('')
  const [otp, setOtp] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(45)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const { register: registerInitiate, handleSubmit: handleSubmitInitiate, formState: { errors: initiateErrors }, watch: watchInitiate, reset: resetInitiate } = useForm<ForgotPasswordFormData>()
  const { register: registerPassword, handleSubmit: handleSubmitPassword, watch: watchPassword, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<SetPasswordFormData>()

  const initiateMutation = useMutation({
    mutationFn: (data: ForgotPasswordFormData) => axiosInstance.request({
      url: '/ecommerce/initiatePasswordReset',
      method: 'GET',
      params: { username: data.username, entityCode: getClientIdentifiers().entityCode },
    }),
    onSuccess: (data) => {
      if (data?.data?.code !== '000') {
        toast.error(data?.data?.desc)
        return
      }
      setUsername(watchInitiate('username'))
      toast.success("OTP sent to your registered email")
      setCurrentStep('validate-otp')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to initiate password reset")
    }
  })

  const validateOTPMutation = useMutation({
    mutationFn: (otp: string) => axiosInstance.request({
      url: '/ecommerce/validatePinResetOtp',
      method: 'POST',
      params: { username: username, entityCode: getClientIdentifiers().entityCode, action: 'PASSWORD_RESET' },
      headers: { 'x-otp': otp }
    }),
    onSuccess: (data) => {
      if (data?.data?.code !== '000') {
        toast.error(data?.data?.desc)
        return
      }
      toast.success(data?.data?.desc || 'OTP validated successfully')
      setCurrentStep('set-password')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Invalid OTP")
    }
  })

  const setPasswordMutation = useMutation({
    mutationFn: (data: SetPasswordFormData) => axiosInstance.request({
      url: '/ecommerce/selfPasswordReset',
      method: 'POST',
      data: { username: username, newPwd: data.newPassword, entityCode: getClientIdentifiers().entityCode, channel: "WEB" },
    }),
    onSuccess: (data) => {
      toast.success("Password reset successfully!")
      resetInitiate()
      resetPassword()
      setCurrentStep('initiate')
      setOtp('')
      window.location.href = '/' // Redirect to home so they can login
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to set new password")
    }
  })

  const resendOTPMutation = useMutation({
    mutationFn: () => axiosInstance.request({
      url: '/usermanager/resendotp',
      method: 'GET',
      params: { username: username || '', entityCode: getClientIdentifiers().entityCode, action: 'PASSWORD_RESET' },
    }),
    onSuccess: (data) => {
      setIsResending(false)
      if (data?.data?.code !== '000') {
        toast.error(data?.data?.desc || 'Failed to resend OTP')
        return
      }
      toast.success(data?.data?.desc || 'OTP sent successfully')
      setCountdown(45)
    },
    onError: (error: any) => {
      setIsResending(false)
      toast.error(error.response?.data?.desc || "Failed to resend OTP")
    }
  })

  const handleResendOtp = async () => {
    if (!username) return toast.error("Email not available")
    setIsResending(true)
    resendOTPMutation.mutate()
  }

  const onSubmitInitiate = (data: ForgotPasswordFormData) => initiateMutation.mutate(data)
  const onSubmitOTP = () => {
    if (otp.length !== 4) return toast.error("Please enter a valid 4-digit OTP")
    validateOTPMutation.mutate(otp)
  }
  const onSubmitPassword = (data: SetPasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) return toast.error("Password does not match")
    const validation = validateStrongPassword(data.newPassword)
    if (!validation.isValid) return toast.error(validation.message)
    setPasswordMutation.mutate(data)
  }

  const newPassword = watchPassword('newPassword')
  const confirmPassword = watchPassword('confirmPassword')
  const isPasswordStrongEnough = newPassword && validateStrongPassword(newPassword).strength !== 'weak'
  const canSubmitPassword = newPassword && confirmPassword && newPassword === confirmPassword && isPasswordStrongEnough

  return (
    <div className="min-h-[70vh] flex flex-col items-center pt-16 px-4 pb-24">
      <div className="flex gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-[#111] transition-colors">Home</Link>
        <span>•</span>
        <span className="text-[#111]">My account</span>
      </div>

      <h1 className="text-[40px] font-bold text-[#111] mb-8 text-center">
        {currentStep === 'initiate' && 'Lost Password'}
        {currentStep === 'validate-otp' && 'Verify OTP'}
        {currentStep === 'set-password' && 'New Password'}
      </h1>

      <div className="w-full max-w-[600px] text-center mb-8">
        {currentStep === 'initiate' && (
          <p className="text-[15px] text-gray-600">
            Lost your password? Please enter your username or email address. You will receive an OTP to create a new password via email.
          </p>
        )}
        {currentStep === 'validate-otp' && (
          <p className="text-[15px] text-gray-600">
            Please enter the 4-digit security code we sent to your registered email address.
          </p>
        )}
        {currentStep === 'set-password' && (
          <p className="text-[15px] text-gray-600">
            Create a new strong password for your account.
          </p>
        )}
      </div>

      <div className="w-full max-w-[700px]">
        {currentStep === 'initiate' && (
          <form onSubmit={handleSubmitInitiate(onSubmitInitiate)} className="flex flex-col gap-5">
            <Input
              {...registerInitiate('username', {
                required: 'Username or email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[a-zA-Z0-9_]+$/, message: 'Please enter a valid username or email' }
              })}
              type="text"
              placeholder="Username or email *"
              className="rounded-full px-6 py-7 text-[15px] border-gray-200 focus-visible:ring-[#111] shadow-sm w-full"
            />
            {initiateErrors.username && <p className="text-sm text-red-500 px-4 -mt-2 text-left">{initiateErrors.username.message}</p>}

            <Button type="submit" className="bg-[#111] hover:bg-black text-white rounded-full py-7 font-bold text-[16px] w-full mt-2 shadow-xl transition-all" disabled={initiateMutation.isPending}>
              {initiateMutation.isPending ? 'Sending...' : 'Reset password'}
            </Button>
          </form>
        )}

        {currentStep === 'validate-otp' && (
          <div className="flex flex-col items-center gap-6">
            <PinInput
              length={4}
              value={otp}
              onChange={setOtp}
              type="text"
              className="justify-center gap-3"
              inputClassName="w-16 h-16 text-2xl font-bold bg-white border border-gray-200 rounded-2xl focus:border-[#111] focus:ring-[#111] shadow-sm"
              autoFocus
            />

            <div className="text-center space-y-2 mb-4">
              <p className="text-[15px] text-gray-600">Didn't receive the code?</p>
              {countdown > 0 ? (
                <p className="text-sm font-semibold text-gray-400">Resend in {countdown}s</p>
              ) : (
                <button onClick={handleResendOtp} disabled={isResending} className="text-sm font-bold text-[#111] hover:text-black hover:underline transition-all disabled:opacity-50">
                  {isResending ? "Sending..." : "Resend Code"}
                </button>
              )}
            </div>

            <div className="flex w-full gap-4">
              <Button type="button" variant="outline" className="flex-1 rounded-full py-7 font-bold text-[15px] border-gray-300 hover:bg-gray-50 hover:text-black" onClick={() => setCurrentStep('initiate')}>
                Back
              </Button>
              <Button type="button" className="flex-[2] bg-[#111] hover:bg-black text-white rounded-full py-7 font-bold text-[16px] shadow-xl transition-all" onClick={onSubmitOTP} disabled={validateOTPMutation.isPending || otp.length !== 4}>
                {validateOTPMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'set-password' && (
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="flex flex-col gap-6">
            <PasswordInput
              placeholder="New Password *"
              error={passwordErrors.newPassword?.message}
              showStrength={true}
              password={newPassword || ''}
              register={registerPassword}
              name="newPassword"
            />
            <PasswordInput
              placeholder="Confirm New Password *"
              error={passwordErrors.confirmPassword?.message}
              password={newPassword || ''}
              register={registerPassword}
              name="confirmPassword"
            />

            <div className="flex w-full gap-4 mt-4">
              <Button type="button" variant="outline" className="flex-1 rounded-full py-7 font-bold text-[15px] border-gray-300 hover:bg-gray-50 hover:text-black" onClick={() => setCurrentStep('validate-otp')}>
                Back
              </Button>
              <Button type="submit" className="flex-[2] bg-[#111] hover:bg-black text-white rounded-full py-7 font-bold text-[16px] shadow-xl transition-all" disabled={setPasswordMutation.isPending || !canSubmitPassword}>
                {setPasswordMutation.isPending ? 'Updating...' : 'Set New Password'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
