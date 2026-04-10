'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/utils/fetch-function-no-auth'
import { toast } from 'sonner'
import { Label } from '@radix-ui/react-dropdown-menu'
import PinInput from '@/components/ui/pin-input'
import { Eye, EyeOff } from 'lucide-react'

type ForgotPasswordFormData = {
  username: string
}

type OTPFormData = {
  otp: string
}

type SetPasswordFormData = {
  newPassword: string
  confirmPassword: string
}

export type ForgotPasswordProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  // switchToLogin: () => void
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

  if (requirementsMet === 4) {
    return { isValid: true, strength: 'strong', message: 'Strong password' };
  } else if (requirementsMet >= 3) {
    return { isValid: true, strength: 'medium', message: 'Medium strength password' };
  } else {
    return {
      isValid: false,
      strength: 'weak',
      message: 'Include uppercase, lowercase, numbers, and special characters'
    };
  }
}

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  if (!password) return null;

  const validation = validateStrongPassword(password);

  const getStrengthColor = () => {
    switch (validation.strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
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
      case 'strong': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="mt-1 space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Strength:</span>
        <span className={`font-medium ${getStrengthTextColor()}`}>
          {getStrengthText()}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{
            width: validation.strength === 'weak' ? '33%' :
              validation.strength === 'medium' ? '66%' : '100%'
          }}
        />
      </div>
      <p className={`text-xs ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
        {validation.message}
      </p>
    </div>
  );
};

const PasswordInput: React.FC<{
  label: string;
  placeholder: string;
  error?: string;
  showStrength?: boolean;
  password: string;
  register: any;
  name: 'newPassword' | 'confirmPassword';
}> = ({ label, placeholder, error, showStrength = false, password, register, name }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          {...register(name, {
            required: `${label} is required`,
            minLength: showStrength ? {
              value: 8,
              message: 'Password must be at least 8 characters long'
            } : undefined,
            validate: !showStrength ? (value: string) => value === password || 'Password does not match' : undefined
          })}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="mt-1 pr-10"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
      {showStrength && password && (
        <PasswordStrengthIndicator password={password} />
      )}
    </div>
  );
};

const ForgotPasswordModal: React.FC<ForgotPasswordProps> = ({ isOpen, setIsOpen }) => {
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

  const {
    register: registerInitiate,
    handleSubmit: handleSubmitInitiate,
    formState: { errors: initiateErrors },
    watch: watchInitiate,
    reset: resetInitiate
  } = useForm<ForgotPasswordFormData>()

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm<SetPasswordFormData>()

  const initiateMutation = useMutation({
    mutationFn: (data: ForgotPasswordFormData) => axiosInstance.request({
      url: '/ecommerce/initiatePasswordReset',
      method: 'GET',
      params: {
        username: data.username,
        entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || '',
      },
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
      params: {
        username: username,
        entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || '',
        action: 'PASSWORD_RESET'
      },
      headers: {
        'x-otp': otp
      }
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
      data: {
        username: username,
        newPwd: data.newPassword,
        entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || '',
        channel: "WEB",
      },
    }),
    onSuccess: (data) => {
      toast.success("Password reset successfully!")
      resetInitiate()
      resetPassword()
      setCurrentStep('initiate')
      setOtp('')
      setIsOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to set new password")
    }
  })

  const resendOTPMutation = useMutation({
    mutationFn: () => axiosInstance.request({
      url: '/usermanager/resendotp',
      method: 'GET',
      params: {
        username: username || '',
        entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || '',
        action: 'PASSWORD_RESET'
      },
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
    if (!username) {
      toast.error("Email not available")
      return
    }

    setIsResending(true)
    resendOTPMutation.mutate()
  }

  const onSubmitInitiate = (data: ForgotPasswordFormData) => {
    initiateMutation.mutate(data)
  }

  const onSubmitOTP = () => {
    if (otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP")
      return
    }
    validateOTPMutation.mutate(otp)
  }

  const onSubmitPassword = (data: SetPasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Password does not match")
      return
    }

    const passwordValidation = validateStrongPassword(data.newPassword)
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.message)
      return
    }

    setPasswordMutation.mutate(data)
  }

  const handleClose = () => {
    resetInitiate()
    resetPassword()
    setCurrentStep('initiate')
    setUsername('')
    setOtp('')
    setIsOpen(false)
  }

  const newPassword = watchPassword('newPassword')
  const confirmPassword = watchPassword('confirmPassword')

  // Check if password strength is at least medium
  const isPasswordStrongEnough = newPassword && validateStrongPassword(newPassword).strength !== 'weak'
  const canSubmitPassword = newPassword && confirmPassword && newPassword === confirmPassword && isPasswordStrongEnough

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <div className='space-y-3'>
          <DialogHeader className='flex flex-col'>
            <DialogTitle className="text-2xl text-center font-medium">
              {currentStep === 'initiate' && 'Forgot Password'}
              {currentStep === 'validate-otp' && 'Enter OTP'}
              {currentStep === 'set-password' && 'Set New Password'}
            </DialogTitle>
            <DialogDescription className="text-sm text-center">
              {currentStep === 'initiate' && 'Enter your username/email to reset your password'}
              {currentStep === 'validate-otp' && 'Enter the 4-digit OTP sent to your registered email'}
              {currentStep === 'set-password' && 'Create a new strong password'}
            </DialogDescription>
          </DialogHeader>

          {currentStep === 'initiate' && (
            <form onSubmit={handleSubmitInitiate(onSubmitInitiate)} className="space-y-4">
              <div>
                <Label>Username/Email</Label>
                <Input
                  {...registerInitiate('username', {
                    required: 'Username or email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[a-zA-Z0-9_]+$/,
                      message: 'Please enter a valid username or email'
                    }
                  })}
                  type="text"
                  placeholder="Enter your username or email"
                  className="mt-2"
                />
                {initiateErrors.username && (
                  <p className="text-sm text-destructive mt-1">{initiateErrors.username.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="bg-accent text-white w-full"
                disabled={initiateMutation.isPending}
              >
                {initiateMutation.isPending ? 'Sending...' : 'Send OTP'}
              </Button>

              {/* <button
                type="button"
                className="text-sm relative text-accent underline cursor-pointer"
                onClick={switchToLogin}
              >
                Back to Login
              </button> */}
            </form>
          )}

          {currentStep === 'validate-otp' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-center block"></Label>
                <PinInput
                  length={4}
                  value={otp}
                  onChange={setOtp}
                  type="text"
                  className="justify-center text-black"
                  inputClassName="w-12 h-12 text-lg font-semibold bg-accent/10 border-accent focus:border-accent focus:ring-accent"
                  autoFocus
                />

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?
                  </p>

                  {countdown > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend in {countdown}s
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="text-sm text-accent/60 hover:text-accent/70 font-medium disabled:opacity-50"
                    >
                      {isResending ? "Sending..." : "Resend Code"}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCurrentStep('initiate')}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="bg-accent text-white flex-1"
                  onClick={onSubmitOTP}
                  disabled={validateOTPMutation.isPending || otp.length !== 4}
                >
                  {validateOTPMutation.isPending ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'set-password' && (
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
              <PasswordInput
                label="New Password"
                placeholder="Enter new password"
                error={passwordErrors.newPassword?.message}
                showStrength={true}
                password={newPassword || ''}
                register={registerPassword}
                name="newPassword"
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm new password"
                error={passwordErrors.confirmPassword?.message}
                password={newPassword || ''}
                register={registerPassword}
                name="confirmPassword"
              />

              {confirmPassword && newPassword === confirmPassword && newPassword && (
                <p className="text-sm text-green-600 text-center">Password match</p>
              )}

              {confirmPassword && newPassword !== confirmPassword && newPassword && confirmPassword && (
                <p className="text-sm text-red-600 text-center">Password does not match</p>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCurrentStep('validate-otp')}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-accent text-white flex-1"
                  disabled={setPasswordMutation.isPending || !canSubmitPassword}
                >
                  {setPasswordMutation.isPending ? 'Setting...' : 'Set Password'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ForgotPasswordModal