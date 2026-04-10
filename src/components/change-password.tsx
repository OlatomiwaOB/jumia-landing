'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { logout } from '@/utils/auth-utils-customer'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/utils/fetch-function-no-auth'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import PinInput from '@/components/ui/pin-input'
import { Eye, EyeOff, Shield } from 'lucide-react'
import useCustomer from '@/store/customerStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type SetPasswordFormData = {
    newPassword: string
    confirmPassword: string
}

export type ChangePasswordProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
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
    value: string;
    onChange: (value: string) => void;
    name: 'newPassword' | 'confirmPassword';
}> = ({ label, placeholder, error, showStrength = false, password, value, onChange, name }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="relative">
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
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

const ChangePasswordModal: React.FC<ChangePasswordProps> = ({ isOpen, setIsOpen }) => {
    const { customer } = useCustomer()
    const [currentStep, setCurrentStep] = useState<'initiate' | 'validate-otp' | 'set-password'>('initiate')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isResending, setIsResending] = useState(false)
    const [countdown, setCountdown] = useState(45)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const initiateMutation = useMutation({
        mutationFn: () => axiosInstance.request({
            url: '/ecommerce/initiatePasswordReset',
            method: 'GET',
            params: {
                username: customer?.username || '',
                entityCode: customer?.entityCode || process.env.NEXT_PUBLIC_ENTITYCODE || '',
            },
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') {
                toast.error(data?.data?.desc)
                return
            }
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
                username: customer?.username || '',
                entityCode: customer?.entityCode || process.env.NEXT_PUBLIC_ENTITYCODE || '',
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
                username: customer?.username || '',
                newPwd: data.newPassword,
                entityCode: customer?.entityCode || process.env.NEXT_PUBLIC_ENTITYCODE || '',
                channel: "WEB",
            },
        }),
        onSuccess: (data) => {
            toast.success("Password reset successfully! You will be logged out in 5 seconds...")
            setOtp('')
            setNewPassword('')
            setConfirmPassword('')
            setCurrentStep('initiate')
            setIsOpen(false)
        },
        onSettled: () => {
            setIsLoggingOut(true);
            setTimeout(() => {
                logout();
                setIsLoggingOut(false);
            }, 5000);
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
                username: customer?.username || '',
                entityCode: customer?.entityCode || process.env.NEXT_PUBLIC_ENTITYCODE || '',
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
        if (!customer?.username) {
            toast.error("Email not available")
            return
        }

        setIsResending(true)
        resendOTPMutation.mutate()
    }

    const handleInitiateReset = () => {
        if (!customer?.username) {
            toast.error("Customer information not available")
            return
        }
        initiateMutation.mutate()
    }

    const handleSubmitOTP = () => {
        if (otp.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP")
            return
        }
        validateOTPMutation.mutate(otp)
    }

    const handleSubmitPassword = () => {
        if (newPassword !== confirmPassword) {
            toast.error("Password does not match")
            return
        }

        const passwordValidation = validateStrongPassword(newPassword)
        if (!passwordValidation.isValid) {
            toast.error(passwordValidation.message)
            return
        }

        setPasswordMutation.mutate({ newPassword, confirmPassword })
    }

    const handleClose = () => {
        setOtp('')
        setNewPassword('')
        setConfirmPassword('')
        setCurrentStep('initiate')
        setIsOpen(false)
    }

    const isPasswordStrongEnough = newPassword && validateStrongPassword(newPassword).strength !== 'weak'
    const canSubmitPassword = newPassword && confirmPassword && newPassword === confirmPassword && isPasswordStrongEnough

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <div className='space-y-3'>
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle className="text-xl text-center font-medium">
                            {currentStep === 'initiate' && 'Change Password'}
                            {currentStep === 'validate-otp' && 'Enter OTP'}
                            {currentStep === 'set-password' && 'Set New Password'}
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            {currentStep === 'initiate' && 'Secure your account with a new password'}
                            {currentStep === 'validate-otp' && 'Enter the 4-digit OTP sent to your registered email'}
                            {currentStep === 'set-password' && 'Create a new strong password'}
                        </DialogDescription>
                    </DialogHeader>

                    <Card className="bg-muted/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Account Details</CardTitle>
                            <CardDescription>
                                {currentStep === 'initiate' && 'You are about to initiate a password reset request for this account'}
                                {currentStep === 'validate-otp' && 'Verify OTP for this account'}
                                {currentStep === 'set-password' && 'Set new password for this account'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Username</Label>
                                    <p className="font-medium">{customer?.username}</p>
                                </div>
                                {/* <div>
                                    <Label className="text-xs text-muted-foreground">Tier</Label>
                                    <p className="font-medium">{customer?.customerTier || "N/A"}</p>
                                </div> */}
                            </div>
                        </CardContent>
                    </Card>

                    {currentStep === 'initiate' && (
                        <div className="space-y-4">
                            <div className="rounded-lg bg-muted/50 p-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">Security Notice</h4>
                                        <p className="text-xs text-muted-foreground">
                                            You're about to initiate a password reset request for your account.
                                            An OTP will be sent to your registered email address for verification.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleInitiateReset}
                                className="w-full"
                                disabled={initiateMutation.isPending || !customer?.username}
                            >
                                {initiateMutation.isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                        Initiating Reset...
                                    </>
                                ) : (
                                    "Send Reset OTP"
                                )}
                            </Button>
                        </div>
                    )}

                    {currentStep === 'validate-otp' && (
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Enter OTP</Label>
                                <PinInput
                                    length={4}
                                    value={otp}
                                    onChange={setOtp}
                                    type="text"
                                    className="justify-center"
                                    inputClassName="w-12 h-12 text-lg"
                                    autoFocus
                                />
                            </div>

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

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setCurrentStep('initiate')}
                                    disabled={validateOTPMutation.isPending}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    className="flex-1"
                                    onClick={handleSubmitOTP}
                                    disabled={validateOTPMutation.isPending || otp.length !== 4}
                                >
                                    {validateOTPMutation.isPending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify OTP"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {currentStep === 'set-password' && (
                        <div className="space-y-4">
                            <PasswordInput
                                label="New Password"
                                placeholder="Enter new password"
                                showStrength={true}
                                password={newPassword}
                                value={newPassword}
                                onChange={setNewPassword}
                                name="newPassword"
                            />

                            <PasswordInput
                                label="Confirm Password"
                                placeholder="Confirm new password"
                                password={newPassword}
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                                name="confirmPassword"
                            />

                            {confirmPassword && newPassword === confirmPassword && newPassword && (
                                <p className="text-sm text-green-600 text-center">Password match</p>
                            )}

                            {confirmPassword && newPassword !== confirmPassword && newPassword && confirmPassword && (
                                <p className="text-sm text-red-600 text-center">Password does not match</p>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setCurrentStep('validate-otp')}
                                    disabled={setPasswordMutation.isPending}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    className="flex-1"
                                    onClick={handleSubmitPassword}
                                    disabled={setPasswordMutation.isPending || !canSubmitPassword}
                                >
                                    {setPasswordMutation.isPending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                            Setting...
                                        </>
                                    ) : (
                                        "Set Password"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ChangePasswordModal