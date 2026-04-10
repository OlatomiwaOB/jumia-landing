"use client";

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/utils/fetch-function'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import PinInput from '@/components/ui/pin-input'
import useCustomer from '@/store/customerStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Eye, EyeOff, AlertTriangle } from "lucide-react"
import axiosCustomer from "@/utils/fetch-function-customer";


type SetPasswordFormData = {
    newPin: string
    confirmPin: string
}

export type ResetPinProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ForgotPinModal: React.FC<ResetPinProps> = ({ isOpen, setIsOpen }) => {
    const { customer } = useCustomer()
    const [currentStep, setCurrentStep] = useState<'initiate' | 'validate-otp' | 'set-password'>('initiate')
    const [otp, setOtp] = useState('')
    const [newPin, setNewPin] = useState('')
    const [confirmPin, setConfirmPin] = useState('')
    const [showNewPin, setShowNewPin] = useState(false)
    const [showConfirmPin, setShowConfirmPin] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [countdown, setCountdown] = useState(45)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const isWeakPin = (pin: string): boolean => {
        if (pin.length !== 4) return false;

        const isConsecutive = (pin: string): boolean => {
            for (let i = 0; i < pin.length - 1; i++) {
                if (parseInt(pin[i + 1]) !== parseInt(pin[i]) + 1) {
                    return false;
                }
            }
            return true;
        };

        const isReverseConsecutive = (pin: string): boolean => {
            for (let i = 0; i < pin.length - 1; i++) {
                if (parseInt(pin[i + 1]) !== parseInt(pin[i]) - 1) {
                    return false;
                }
            }
            return true;
        };

        const isRepeated = (pin: string): boolean => {
            return new Set(pin.split('')).size === 1;
        };

        const commonWeakPins = [
            '1234', '1111', '0000', '2222', '3333', '4444', '5555',
            '6666', '7777', '8888', '9999', '4321', '1212', '1004',
            '2000', '3000', '1234', '2345', '3456', '4567', '5678',
            '6789', '9876', '8765', '7654', '6543', '5432', '4321'
        ];

        return isConsecutive(pin) ||
            isReverseConsecutive(pin) ||
            isRepeated(pin) ||
            commonWeakPins.includes(pin);
    };

    const getWeakPinReason = (pin: string): string => {
        if (pin.length !== 4) return '';

        if (new Set(pin.split('')).size === 1) {
            return 'PIN contains repeated digits';
        }

        let isConsecutive = true;
        for (let i = 0; i < pin.length - 1; i++) {
            if (parseInt(pin[i + 1]) !== parseInt(pin[i]) + 1) {
                isConsecutive = false;
                break;
            }
        }
        if (isConsecutive) return 'PIN contains consecutive numbers';

        let isReverseConsecutive = true;
        for (let i = 0; i < pin.length - 1; i++) {
            if (parseInt(pin[i + 1]) !== parseInt(pin[i]) - 1) {
                isReverseConsecutive = false;
                break;
            }
        }
        if (isReverseConsecutive) return 'PIN contains reverse consecutive numbers';

        return 'PIN is too common or predictable';
    };

    const initiateMutation = useMutation({
        mutationFn: () => axiosInstance.request({
            url: '/ecommerce/initiateForgotPin',
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
            toast.error(error.response?.data?.message || "Failed to initiate PIN reset")
        }
    })

    const validateOTPMutation = useMutation({
        mutationFn: (otp: string) => axiosInstance.request({
            url: '/ecommerce/validatePinResetOtp',
            method: 'POST',
            params: {
                username: customer?.username || '',
                entityCode: customer?.entityCode || process.env.NEXT_PUBLIC_ENTITYCODE || '',
                action: 'PIN_RESET'
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
        mutationFn: (data: SetPasswordFormData) => axiosCustomer.request({
            url: '/ecommerce/setPIN',
            method: 'POST',
            data: {
                username: customer?.username || '',
                newPin: data.newPin,
                entityCode: customer?.entityCode || process.env.NEXT_PUBLIC_ENTITYCODE || '',
                channel: "WEB",
            },
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') {
                toast.error(data?.data?.desc)
                return
            }
            toast.success("Transaction PIN reset successfully!")

            setOtp('')
            setNewPin('')
            setConfirmPin('')
            setShowNewPin(false)
            setShowConfirmPin(false)
            setCurrentStep('initiate')
            setIsOpen(false)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to set new PIN")
        }
    })

    const resendOTPMutation = useMutation({
        mutationFn: () => axiosCustomer.request({
            url: '/usermanager/resendotp',
            method: 'GET',
            params: {
                username: customer?.username || '',
                entityCode: customer?.entityCode || process.env.NEXT_PUBLIC_ENTITYCODE || '',
                action: 'PIN_RESET'
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
        if (newPin !== confirmPin) {
            toast.error("PINs do not match")
            return
        }

        if (newPin.length !== 4) {
            toast.error("PIN must be exactly 4 digits")
            return
        }

        if (isWeakPin(newPin)) {
            toast.error("Please choose a stronger PIN")
            return
        }

        setPasswordMutation.mutate({ newPin, confirmPin })
    }

    const isFormValid = () => {
        return newPin.length === 4 &&
            confirmPin.length === 4 &&
            newPin === confirmPin &&
            !isWeakPin(newPin);
    }

    const handleClose = () => {

        setOtp('')
        setNewPin('')
        setConfirmPin('')
        setShowNewPin(false)
        setShowConfirmPin(false)
        setCurrentStep('initiate')
        setIsOpen(false)
    }

    const toggleNewPinVisibility = () => {
        setShowNewPin(!showNewPin)
    }

    const toggleConfirmPinVisibility = () => {
        setShowConfirmPin(!showConfirmPin)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <div className='space-y-3'>
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle className="text-xl text-center font-medium">
                            {currentStep === 'initiate' && 'Forgot Transaction PIN'}
                            {currentStep === 'validate-otp' && 'Enter OTP'}
                            {currentStep === 'set-password' && 'Set New PIN'}
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            {currentStep === 'initiate' && 'Secure your transactions with a new PIN'}
                            {currentStep === 'validate-otp' && 'Enter the 4-digit OTP sent to your registered email'}
                            {currentStep === 'set-password' && 'Create a new 4-digit transaction PIN'}
                        </DialogDescription>
                    </DialogHeader>

                    <Card className="bg-muted/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Account Details</CardTitle>
                            <CardDescription>
                                {currentStep === 'initiate' && 'You are about to initiate a PIN reset request for this account'}
                                {currentStep === 'validate-otp' && 'Verify OTP for this account'}
                                {currentStep === 'set-password' && 'Set new PIN for this account'}
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
                                            You're about to initiate a PIN reset request for your account.
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
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">New PIN</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                        onClick={toggleNewPinVisibility}
                                    >
                                        {showNewPin ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">
                                            {showNewPin ? 'Hide PIN' : 'Show PIN'}
                                        </span>
                                    </Button>
                                </div>
                                <PinInput
                                    length={4}
                                    value={newPin}
                                    onChange={setNewPin}
                                    type={showNewPin ? "text" : "password"}
                                    secure={!showNewPin}
                                    className="justify-center"
                                    inputClassName="w-12 h-12 text-lg"
                                />
                                {newPin.length === 4 && isWeakPin(newPin) && (
                                    <div className="flex items-center gap-2 text-amber-600 text-sm">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span>{getWeakPinReason(newPin)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Confirm PIN</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                        onClick={toggleConfirmPinVisibility}
                                    >
                                        {showConfirmPin ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">
                                            {showConfirmPin ? 'Hide PIN' : 'Show PIN'}
                                        </span>
                                    </Button>
                                </div>
                                <PinInput
                                    length={4}
                                    value={confirmPin}
                                    onChange={setConfirmPin}
                                    type={showConfirmPin ? "text" : "password"}
                                    secure={!showConfirmPin}
                                    className="justify-center"
                                    inputClassName="w-12 h-12 text-lg"
                                />
                            </div>

                            {confirmPin && newPin.length === 4 && confirmPin.length === 4 && (
                                <div className="text-sm text-center">
                                    {newPin === confirmPin ? (
                                        isWeakPin(newPin) ? (
                                            <p className="text-yellow-600">PIN match, but we recommend using a stronger pin.</p>
                                        ) : (
                                            <p className="text-green-600">PIN match and meet security requirements.</p>
                                        )
                                    ) : (
                                        <p className="text-red-600">PIN does not match!</p>
                                    )}
                                </div>
                            )}

                            <div className="rounded-lg bg-muted/50 p-3">
                                <h4 className="text-xs font-medium mb-2">PIN Requirements:</h4>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                    <li>• Must be exactly 4 digits</li>
                                    <li>• Numbers only (0-9)</li>
                                    <li>• Avoid consecutive numbers (1234, 4321)</li>
                                    <li>• Avoid repeated digits (1111, 2222)</li>
                                    <li>• Avoid common patterns</li>
                                    <li>• Do not share your PIN with anyone</li>
                                </ul>
                            </div>

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
                                    disabled={setPasswordMutation.isPending || !isFormValid()}
                                >
                                    {setPasswordMutation.isPending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                            Setting PIN...
                                        </>
                                    ) : (
                                        "Set PIN"
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

export default ForgotPinModal