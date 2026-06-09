'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/utils/fetch-function-no-auth'
import { toast } from 'sonner'
import PinInput from '@/components/ui/pin-input'
import { Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type ForgotPasswordFormData = {
  username: string
}

type SetPasswordFormData = {
  newPassword: string
  confirmPassword: string
}

const validateStrongPassword = (
  password: string
): { isValid: boolean; strength: 'weak' | 'medium' | 'strong'; message: string } => {
  if (password.length < 8) {
    return { isValid: false, strength: 'weak', message: 'At least 8 characters required' }
  }
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  const requirementsMet = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length
  if (requirementsMet === 4) return { isValid: true, strength: 'strong', message: 'Strong password' }
  if (requirementsMet >= 3) return { isValid: true, strength: 'medium', message: 'Add a special character to strengthen' }
  return { isValid: false, strength: 'weak', message: 'Include uppercase, lowercase, numbers & special characters' }
}

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  if (!password) return null
  const validation = validateStrongPassword(password)
  const segments = [
    validation.strength === 'weak' || validation.strength === 'medium' || validation.strength === 'strong',
    validation.strength === 'medium' || validation.strength === 'strong',
    validation.strength === 'strong',
  ]
  const activeColor =
    validation.strength === 'weak'
      ? 'bg-red-400'
      : validation.strength === 'medium'
        ? 'bg-amber-400'
        : 'bg-accent'

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-1.5">
        {segments.map((active, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${active ? activeColor : 'bg-gray-100'
              }`}
          />
        ))}
      </div>
      <p
        className={`text-[12px] font-medium tracking-wide uppercase ${validation.isValid ? 'text-accent-foreground/70' : 'text-red-400'
          }`}
      >
        {validation.message}
      </p>
    </div>
  )
}

const PasswordInput: React.FC<{
  placeholder: string
  label: string
  error?: string
  showStrength?: boolean
  password: string
  register: any
  name: 'newPassword' | 'confirmPassword'
}> = ({ placeholder, label, error, showStrength = false, password, register, name }) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-muted-foreground/60">
        {label}
      </label>
      <div className="relative">
        <input
          {...register(name, {
            required: 'This field is required',
            minLength: showStrength
              ? { value: 8, message: 'At least 8 characters required' }
              : undefined,
            validate: !showStrength
              ? (value: string) => value === password || 'Passwords do not match'
              : undefined,
          })}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={`w-full bg-transparent border-0 border-b-2 pb-3 pt-1 text-[15px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-colors pr-10 ${error ? 'border-red-400' : 'border-border focus:border-foreground'
            }`}
        />
        <button
          type="button"
          className="absolute right-0 top-1 text-muted-foreground/40 hover:text-foreground transition-colors"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-[12px] text-red-400 pt-1">{error}</p>}
      {showStrength && <PasswordStrengthIndicator password={password} />}
    </div>
  )
}

export default function ForgotPasswordContent() {
  const [step, setStep] = useState<'initiate' | 'reset'>('initiate')
  const [username, setUsername] = useState('')
  const [otp, setOtp] = useState('')

  const {
    register: registerInitiate,
    handleSubmit: handleSubmitInitiate,
    watch: watchInitiate,
    formState: { errors: initiateErrors },
  } = useForm<ForgotPasswordFormData>()

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm<SetPasswordFormData>()

  const initiateMutation = useMutation({
    mutationFn: (data: ForgotPasswordFormData) =>
      axiosInstance.request({
        url: '/ecommerce/initiatePasswordReset',
        method: 'GET',
        params: { username: data.username, entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || '' },
      }),
    onSuccess: (data) => {
      const code = data?.data?.code
      if (code !== '000' && code !== '00') {
        toast.error(data?.data?.desc || 'Failed to send OTP')
        return
      }
      setUsername(watchInitiate('username'))
      toast.success('OTP sent to your registered email')
      setStep('reset')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send OTP')
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: (data: SetPasswordFormData) =>
      axiosInstance.request({
        url: '/ecommerce/selfPasswordReset',
        method: 'POST',
        data: {
          otp,
          username,
          entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || '',
          newPwd: data.newPassword,
        },
      }),
    onSuccess: () => {
      toast.success('Password updated successfully')
      setStep('initiate')
      setOtp('')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    },
  })

  const onSubmitInitiate = (data: ForgotPasswordFormData) => initiateMutation.mutate(data)

  const onSubmitReset = (data: SetPasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    const validation = validateStrongPassword(data.newPassword)
    if (!validation.isValid) {
      toast.error(validation.message)
      return
    }
    if (otp.length !== 4) {
      toast.error('Please enter the 4-digit OTP')
      return
    }
    resetPasswordMutation.mutate(data)
  }

  const newPassword = watchPassword('newPassword')
  const confirmPassword = watchPassword('confirmPassword')
  const isPasswordStrongEnough = newPassword && validateStrongPassword(newPassword).strength !== 'weak'
  const canSubmit =
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword &&
    isPasswordStrongEnough &&
    otp.length === 4

  return (
    <div className="min-h-[80vh] flex flex-col items-center px-4 pb-24">
      {/* Breadcrumb */}
      <div className="w-full max-w-[560px] pt-12 mb-12">
        <nav className="flex items-center gap-2 text-[12px] font-medium tracking-wide">
          <Link
            href="/"
            className="text-muted-foreground/50 hover:text-foreground transition-colors uppercase tracking-[0.08em]"
          >
            Home
          </Link>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-foreground uppercase tracking-[0.08em]">
            {step === 'initiate' ? 'Forgot Password' : 'Reset Password'}
          </span>
        </nav>
      </div>

      {/* Main card */}
      <div className="w-full max-w-[560px]">
        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-12">
          {/* Step 1 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${step === 'initiate'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-foreground text-background'
                  }`}
              >
                {step === 'reset' ? '✓' : '1'}
              </div>
              <span
                className={`text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors ${step === 'initiate' ? 'text-foreground' : 'text-muted-foreground/50'
                  }`}
              >
                Identify
              </span>
            </div>
            {step === 'initiate' && (
              <div className="h-0.5 w-16 bg-accent rounded-full ml-0" />
            )}
          </div>

          {/* Connector line */}
          <div className="flex-1 h-px bg-border mx-4" />

          {/* Step 2 */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-3">
              <span
                className={`text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors ${step === 'reset' ? 'text-foreground' : 'text-muted-foreground/30'
                  }`}
              >
                New Password
              </span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${step === 'reset'
                  ? 'bg-accent text-accent-foreground'
                  : 'border-2 border-border text-muted-foreground/30'
                  }`}
              >
                2
              </div>
            </div>
            {step === 'reset' && (
              <div className="h-0.5 w-16 bg-accent rounded-full ml-auto" />
            )}
          </div>
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-[36px] font-bold text-foreground leading-tight tracking-tight">
            {step === 'initiate' ? (
              <>
                Recover your<br />
                <span className="text-accent">account access</span>
              </>
            ) : (
              <>
                Create a new<br />
                <span className="text-accent">password</span>
              </>
            )}
          </h1>
          <p className="mt-3 text-[14px] text-muted-foreground leading-relaxed max-w-[400px]">
            {step === 'initiate'
              ? 'Enter your username or email and we\'ll send a one-time code to your registered address.'
              : `A 4-digit code was sent to the email linked to ${username ? `"${username}"` : 'your account'}.`}
          </p>
        </div>

        {/* ── STEP 1: Initiate ── */}
        {step === 'initiate' && (
          <form onSubmit={handleSubmitInitiate(onSubmitInitiate)} className="flex flex-col gap-8">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-muted-foreground/60">
                Username or Email
              </label>
              <input
                {...registerInitiate('username', {
                  required: 'Username or email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[a-zA-Z0-9_]+$/,
                    message: 'Enter a valid username or email address',
                  },
                })}
                type="text"
                placeholder="e.g. john.doe or john@example.com"
                className={`w-full bg-transparent border-0 border-b-2 pb-3 pt-1 text-[15px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-colors ${initiateErrors.username ? 'border-red-400' : 'border-border focus:border-foreground'
                  }`}
              />
              {initiateErrors.username && (
                <p className="text-[12px] text-red-400 pt-1">{initiateErrors.username.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={initiateMutation.isPending}
              className="group flex items-center justify-between w-full bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-4 rounded-xl font-semibold text-[14px] tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{initiateMutation.isPending ? 'Sending code…' : 'Send one-time code'}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* <p className="text-center text-[13px] text-muted-foreground">
              Remembered it?{' '}
              <Link href="/login" className="text-foreground font-semibold hover:text-accent transition-colors underline underline-offset-4">
                Sign in
              </Link>
            </p> */}
          </form>
        )}

        {/* ── STEP 2: Reset ── */}
        {step === 'reset' && (
          <form onSubmit={handleSubmitPassword(onSubmitReset)} className="flex flex-col gap-8">
            {/* OTP */}
            <div className="space-y-3">
              <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-muted-foreground/60">
                One-time code
              </label>
              <PinInput
                length={4}
                value={otp}
                onChange={setOtp}
                type="text"
                className="flex gap-3"
                inputClassName="w-14 h-14 text-xl font-bold bg-transparent border-2 border-border rounded-xl text-center text-foreground focus:border-accent focus:outline-none focus:ring-0 transition-colors"
                autoFocus
              />
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Passwords */}
            <div className="flex flex-col gap-7">
              <PasswordInput
                label="New Password"
                placeholder="Min. 8 characters"
                error={passwordErrors.newPassword?.message}
                showStrength
                password={newPassword || ''}
                register={registerPassword}
                name="newPassword"
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter your new password"
                error={passwordErrors.confirmPassword?.message}
                password={newPassword || ''}
                register={registerPassword}
                name="confirmPassword"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('initiate')}
                className="flex items-center gap-2 px-5 py-4 rounded-xl border-2 border-border text-foreground text-[13px] font-semibold hover:border-foreground transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={resetPasswordMutation.isPending || !canSubmit}
                className="group flex flex-1 items-center justify-between bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-4 rounded-xl font-semibold text-[14px] tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{resetPasswordMutation.isPending ? 'Updating password…' : 'Update password'}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}