"use client";

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/utils/fetch-function'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import PinInput from '@/components/ui/pin-input'
import useCustomer from '@/store/customerStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Eye, EyeOff, AlertTriangle } from "lucide-react"
import axiosCustomer from "@/utils/fetch-function-customer";
import { getClientIdentifiers } from '@/config/client-config';


type SetPasswordFormData = {
    newPin: string
    confirmPin: string
}

export type ChangePinProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChangePinModal: React.FC<ChangePinProps> = ({ isOpen, setIsOpen }) => {
    const { customer } = useCustomer()
    const [currentStep, setCurrentStep] = useState<'validate-current' | 'set-new-pin'>('validate-current')
    const [currentPin, setCurrentPin] = useState('')
    const [newPin, setNewPin] = useState('')
    const [confirmPin, setConfirmPin] = useState('')
    const [showCurrentPin, setShowCurrentPin] = useState(false)
    const [showNewPin, setShowNewPin] = useState(false)
    const [showConfirmPin, setShowConfirmPin] = useState(false)

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

    const validateCurrentPinMutation = useMutation({
        mutationFn: (pin: string) => axiosInstance.request({
            url: '/ecommerce/validateTransactPin',
            method: 'POST',
            params: {
                username: customer?.username || '',
                entityCode: customer?.entityCode || getClientIdentifiers().entityCode,
                channel: 'WEB'
            },
            headers: {
                'x-enc-pwd': pin
            }
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') {
                toast.error(data?.data?.desc || 'Invalid current PIN')
                return
            }
            toast.success('Current PIN validated successfully')
            setCurrentStep('set-new-pin')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to validate current PIN")
        }
    })

    const setPasswordMutation = useMutation({
        mutationFn: (data: SetPasswordFormData) => axiosCustomer.request({
            url: '/ecommerce/setPIN',
            method: 'POST',
            data: {
                username: customer?.username || '',
                newPin: data.newPin,
                entityCode: customer?.entityCode || getClientIdentifiers().entityCode,
                channel: "WEB",
            },
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') {
                toast.error(data?.data?.desc)
                return
            }
            toast.success("Transaction PIN changed successfully!")

            setCurrentPin('')
            setNewPin('')
            setConfirmPin('')
            setShowCurrentPin(false)
            setShowNewPin(false)
            setShowConfirmPin(false)
            setCurrentStep('validate-current')
            setIsOpen(false)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to set new PIN")
        }
    })

    const handleSubmitCurrentPin = () => {
        if (currentPin.length !== 4) {
            toast.error("Please enter a valid 4-digit PIN")
            return
        }
        validateCurrentPinMutation.mutate(currentPin)
    }

    const handleSubmitNewPin = () => {
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

        if (newPin === currentPin) {
            toast.error("New PIN cannot be the same as current PIN")
            return
        }

        setPasswordMutation.mutate({ newPin, confirmPin })
    }

    const isNewPinFormValid = () => {
        return newPin.length === 4 &&
            confirmPin.length === 4 &&
            newPin === confirmPin &&
            !isWeakPin(newPin) &&
            newPin !== currentPin;
    }

    const handleClose = () => {
        setCurrentPin('')
        setNewPin('')
        setConfirmPin('')
        setShowCurrentPin(false)
        setShowNewPin(false)
        setShowConfirmPin(false)
        setCurrentStep('validate-current')
        setIsOpen(false)
    }

    const toggleCurrentPinVisibility = () => {
        setShowCurrentPin(!showCurrentPin)
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
                            {currentStep === 'validate-current' && 'Change Transaction PIN'}
                            {currentStep === 'set-new-pin' && 'Set New PIN'}
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            {currentStep === 'validate-current' && 'Enter your current PIN to continue'}
                            {currentStep === 'set-new-pin' && 'Create a new 4-digit transaction PIN'}
                        </DialogDescription>
                    </DialogHeader>

                    <Card className="bg-muted/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Account Details</CardTitle>
                            <CardDescription>
                                {currentStep === 'validate-current' && 'Verify your identity with current PIN'}
                                {currentStep === 'set-new-pin' && 'Set new PIN for this account'}
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

                    {currentStep === 'validate-current' && (
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Current PIN</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                        onClick={toggleCurrentPinVisibility}
                                    >
                                        {showCurrentPin ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">
                                            {showCurrentPin ? 'Hide PIN' : 'Show PIN'}
                                        </span>
                                    </Button>
                                </div>
                                <PinInput
                                    length={4}
                                    value={currentPin}
                                    onChange={setCurrentPin}
                                    type={showCurrentPin ? "text" : "password"}
                                    secure={!showCurrentPin}
                                    className="justify-center"
                                    inputClassName="w-12 h-12 text-lg"
                                />
                            </div>

                            <div className="rounded-lg bg-muted/50 p-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">Security Notice</h4>
                                        <p className="text-xs text-muted-foreground">
                                            You're about to change your transaction PIN. Make sure you remember your current PIN to proceed.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleSubmitCurrentPin}
                                className="w-full"
                                disabled={validateCurrentPinMutation.isPending || currentPin.length !== 4}
                            >
                                {validateCurrentPinMutation.isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Current PIN"
                                )}
                            </Button>
                        </div>
                    )}

                    {currentStep === 'set-new-pin' && (
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
                                {newPin.length === 4 && newPin === currentPin && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span>New PIN cannot be the same as current PIN</span>
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
                                            <p className="text-yellow-600">PIN match, but we recommend using a stronger PIN.</p>
                                        ) : newPin === currentPin ? (
                                            <p className="text-red-600">PIN match, but cannot be same as current PIN</p>
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
                                    <li>• Cannot be the same as current PIN</li>
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
                                    onClick={() => setCurrentStep('validate-current')}
                                    disabled={setPasswordMutation.isPending}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    className="flex-1"
                                    onClick={handleSubmitNewPin}
                                    disabled={setPasswordMutation.isPending || !isNewPinFormValid()}
                                >
                                    {setPasswordMutation.isPending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                            Changing PIN...
                                        </>
                                    ) : (
                                        "Change PIN"
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

export default ChangePinModal