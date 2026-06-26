"use client";

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/utils/fetch-function-no-auth'
import { toast } from 'sonner'
import PinInput from '@/components/ui/pin-input'
import useUser from '@/store/userStore'
import { AlertTriangle } from "lucide-react"
import { getClientIdentifiers } from '@/config/client-config';

type SetPasswordFormData = {
    newPin: string
    confirmPin: string
}

export type ResetPinProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const isWeakPin = (pin: string): boolean => {
    if (pin.length !== 4) return false;
    const digits = pin.split('').map(Number);
    const isConsecutive = digits.every((d, i) => i === 0 || d === digits[i - 1] + 1);
    const isReverse = digits.every((d, i) => i === 0 || d === digits[i - 1] - 1);
    const isRepeated = new Set(pin.split('')).size === 1;
    const weak = ['1234', '1111', '0000', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '4321', '1212', '1004', '2000', '3000', '2345', '3456', '4567', '5678', '6789', '9876', '8765', '7654', '6543', '5432'];
    return isConsecutive || isReverse || isRepeated || weak.includes(pin);
};

const getWeakPinReason = (pin: string): string => {
    if (pin.length !== 4) return '';
    if (new Set(pin.split('')).size === 1) return 'PIN contains repeated digits';
    const digits = pin.split('').map(Number);
    if (digits.every((d, i) => i === 0 || d === digits[i - 1] + 1)) return 'PIN contains consecutive numbers';
    if (digits.every((d, i) => i === 0 || d === digits[i - 1] - 1)) return 'PIN contains reverse consecutive numbers';
    return 'PIN is too common or predictable';
};

const SecurityNotice: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-faded-accent/10 rounded-xl pl-4 py-5 pr-5">
        <p className="text-sm font-bold text-dark-gray">Security Notice</p>
        <p className="text-sm text-medium-gray font-medium mt-0.5">{message}</p>
    </div>
);

const AccountRow: React.FC<{ customerName?: string; username?: string }> = ({ customerName, username }) => (
    <div className="flex items-start justify-between gap-4">
        <div>
            <p className="text-xs text-medium-gray font-light">Account Details</p>
            <p className="text-sm font-semibold text-dark-gray mt-0.5">{customerName || '—'}</p>
        </div>
        <div className="text-right">
            <p className="text-xs text-medium-gray font-light">Username</p>
            <p className="text-sm font-semibold text-dark-gray mt-0.5">{username || '—'}</p>
        </div>
    </div>
);

const ModalFooter: React.FC<{
    onCancel: () => void;
    onAction: () => void;
    actionLabel: string;
    disabled?: boolean;
    loading?: boolean;
}> = ({ onCancel, onAction, actionLabel, disabled, loading }) => (
    <div className="flex items-center rounded-b-2xl justify-end gap-3 p-4 bg-white">
        <Button variant="outline" onClick={onCancel}>
            Cancel
        </Button>
        <Button onClick={onAction} disabled={disabled || loading}>
            {loading ? 'Please wait…' : actionLabel}
        </Button>
    </div>
);

const ForgotPinModal: React.FC<ResetPinProps> = ({ isOpen, setIsOpen }) => {
    const { user } = useUser();
    const [currentStep, setCurrentStep] = useState<'initiate' | 'validate-otp' | 'set-password'>('initiate');
    const [otp, setOtp] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(69);

    useEffect(() => {
        if (currentStep !== 'validate-otp' || countdown <= 0) return;
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [currentStep, countdown]);

    const initiateMutation = useMutation({
        mutationFn: () => axiosInstance.request({
            url: '/ecommerce/initiateForgotPin?skipAuth=true', method: 'GET',
            params: { username: user?.username || '', entityCode: user?.entityCode || getClientIdentifiers().entityCode, skipAuth: false },
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') { toast.error(data?.data?.desc); return; }
            toast.success('OTP sent to your registered email');
            setCurrentStep('validate-otp');
        },
        onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to initiate PIN reset'),
    });

    const validateOTPMutation = useMutation({
        mutationFn: () => axiosInstance.request({
            url: '/ecommerce/validatePinResetOtp?skipAuth=true', method: 'POST',
            params: { username: user?.username || '', entityCode: user?.entityCode || getClientIdentifiers().entityCode, action: 'PIN_RESET', skipAuth: false },
            headers: { 'x-otp': otp },
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') { toast.error(data?.data?.desc); return; }
            toast.success(data?.data?.desc || 'OTP validated');
            setCurrentStep('set-password');
        },
        onError: (error: any) => toast.error(error.response?.data?.message || 'Invalid OTP'),
    });

    const setPasswordMutation = useMutation({
        mutationFn: (data: SetPasswordFormData) => axiosInstance.request({
            url: '/ecommerce/setPIN?skipAuth=false', method: 'POST',
            data: { username: user?.username || '', newPin: data.newPin, entityCode: user?.entityCode || getClientIdentifiers().entityCode, channel: 'WEB', skipAuth: false },
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') { toast.error(data?.data?.desc); return; }
            toast.success('Transaction PIN reset successfully!');
            handleClose();
        },
        onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to set new PIN'),
    });

    const resendOTPMutation = useMutation({
        mutationFn: () => axiosInstance.request({
            url: '/usermanager/resendotp?skipAuth=false', method: 'GET', 
            params: { username: user?.username || '', entityCode: user?.entityCode || getClientIdentifiers().entityCode, skipAuth: false },
        }),
        onSuccess: (data) => {
            setIsResending(false);
            if (data?.data?.code !== '000') { toast.error(data?.data?.desc || 'Failed to resend OTP'); return; }
            toast.success(data?.data?.desc || 'OTP resent');
            setCountdown(69);
        },
        onError: (error: any) => { setIsResending(false); toast.error(error.response?.data?.desc || 'Failed to resend OTP'); },
    });

    const handleInitiateReset = () => {
        if (!user?.username) { toast.error('User information not available'); return; }
        initiateMutation.mutate();
    };

    const handleSubmitOTP = () => {
        if (otp.length !== 4) { toast.error('Please enter a valid 4-digit OTP'); return; }
        validateOTPMutation.mutate();
    };

    const handleSubmitPassword = () => {
        if (newPin !== confirmPin) { toast.error('PINs do not match'); return; }
        if (newPin.length !== 4) { toast.error('PIN must be exactly 4 digits'); return; }
        if (isWeakPin(newPin)) { toast.error('Please choose a stronger PIN'); return; }
        setPasswordMutation.mutate({ newPin, confirmPin });
    };

    const isFormValid = () =>
        newPin.length === 4 && confirmPin.length === 4 && newPin === confirmPin && !isWeakPin(newPin);

    const handleClose = () => {
        setOtp(''); setNewPin(''); setConfirmPin('');
        setCurrentStep('initiate'); setCountdown(69); setIsOpen(false);
    };

    const fmtCountdown = () => `${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(countdown % 60).padStart(2, '0')}`;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-0 rounded-2xl gap-0 border-0 shadow-xl bg-[#F5F5F5]">
                <DialogTitle className="sr-only">Forgot Transaction PIN</DialogTitle>

                <div className="flex items-center justify-between px-5 pt-5">
                    <h2 className="text-base font-semibold text-dark-gray">Forgot Transaction PIN</h2>
                </div>

                <div className="">
                    {currentStep === 'initiate' && (
                        <>
                            <div className="px-4 pb-5 pt-3 space-y-3">
                                <SecurityNotice message="You're about to initiate a PIN reset request for your account. An OTP will be sent to your registered email address." />
                                <div className="bg-white rounded-2xl p-4 space-y-4">
                                    <AccountRow customerName={user?.fullname} username={user?.username} />
                                </div>
                            </div>
                            <ModalFooter
                                onCancel={handleClose}
                                onAction={handleInitiateReset}
                                actionLabel="Send Reset OTP"
                                loading={initiateMutation.isPending}
                            />
                        </>
                    )}

                    {currentStep === 'validate-otp' && (
                        <>
                            <div className="px-4 pb-5 pt-3 space-y-3">
                                <SecurityNotice message="OTP has been sent to your registered email address." />
                                <div className="bg-white rounded-2xl p-4 space-y-4">
                                    <div>
                                        <p className="text-sm font-semibold text-dark-gray text-center mb-4">Enter Verification Code</p>
                                        <PinInput
                                            length={4}
                                            value={otp}
                                            onChange={setOtp}
                                            type="text"
                                            autoFocus
                                        />
                                        <div className="text-center mt-4">
                                            <span className="text-xs text-medium-gray">Didn't receive the code? </span>
                                            {countdown > 0 ? (
                                                <span className="text-xs font-semibold text-text">{fmtCountdown()}</span>
                                            ) : (
                                                <button
                                                    onClick={() => { setIsResending(true); resendOTPMutation.mutate(); }}
                                                    disabled={isResending}
                                                    className="text-xs font-semibold text-text hover:text-[#c23c0a] disabled:opacity-50"
                                                >
                                                    {isResending ? 'Sending…' : 'Resend Code'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ModalFooter
                                onCancel={handleClose}
                                onAction={handleSubmitOTP}
                                actionLabel="Verify OTP"
                                disabled={otp.length < 4}
                                loading={validateOTPMutation.isPending}
                            />
                        </>
                    )}

                    {currentStep === 'set-password' && (
                        <>
                            <div className="px-4 pb-5 pt-3 space-y-3">
                                <SecurityNotice message="You're about to change your transaction PIN." />
                                <div className="bg-white rounded-2xl p-4 space-y-4">
                                    <div>
                                        <p className="text-sm font-semibold text-dark-gray text-center mb-4">Enter New PIN</p>
                                        <PinInput
                                            length={4}
                                            value={newPin}
                                            onChange={setNewPin}
                                            type="password"
                                            secure
                                            autoFocus
                                        />
                                        {newPin.length === 4 && isWeakPin(newPin) && (
                                            <p className="text-xs text-amber-600 mt-2 text-center flex items-center justify-center gap-1">
                                                <AlertTriangle className="w-3.5 h-3.5" /> {getWeakPinReason(newPin)}
                                            </p>
                                        )}
                                    </div>

                                    {newPin.length === 4 && !isWeakPin(newPin) && (
                                        <div>
                                            <p className="text-sm font-medium text-dark-gray text-center mb-3">Confirm New PIN</p>
                                            <PinInput
                                                length={4}
                                                value={confirmPin}
                                                onChange={setConfirmPin}
                                                type="password"
                                                secure
                                            />
                                            {confirmPin.length === 4 && (
                                                <p className={`text-xs mt-2 text-center ${newPin === confirmPin ? 'text-green-600' : 'text-red-500'}`}>
                                                    {newPin === confirmPin ? 'PINs match ✓' : 'PINs do not match'}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <ModalFooter
                                onCancel={handleClose}
                                onAction={handleSubmitPassword}
                                actionLabel="Set PIN"
                                disabled={!isFormValid()}
                                loading={setPasswordMutation.isPending}
                            />
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPinModal;