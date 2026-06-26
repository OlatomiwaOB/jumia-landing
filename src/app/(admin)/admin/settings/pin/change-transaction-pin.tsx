"use client";

import React, { useState } from 'react'
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

export type ChangePinProps = {
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

const PinLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="text-sm font-semibold text-dark-gray text-center mb-4">{children}</p>
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

const ChangePinModal: React.FC<ChangePinProps> = ({ isOpen, setIsOpen }) => {
    const { user } = useUser();
    const [currentStep, setCurrentStep] = useState<'validate-current' | 'set-new-pin'>('validate-current');
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    const validateCurrentPinMutation = useMutation({
        mutationFn: (pin: string) => axiosInstance.request({
            url: '/ecommerce/validateTransactPin?skipAuth=false', method: 'POST',
            params: { username: user?.username || '', entityCode: user?.entityCode || getClientIdentifiers().entityCode, channel: 'WEB', skipAuth: false },
            headers: { 'x-enc-pwd': pin },
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') { toast.error(data?.data?.desc || 'Invalid current PIN'); return; }
            toast.success('Current PIN validated successfully');
            setCurrentStep('set-new-pin');
        },
        onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to validate current PIN'),
    });

    const setPasswordMutation = useMutation({
        mutationFn: (data: SetPasswordFormData) => axiosInstance.request({
            url: '/ecommerce/setPIN?skipAuth=false', method: 'POST',
            data: { username: user?.username || '', newPin: data.newPin, entityCode: user?.entityCode || getClientIdentifiers().entityCode, channel: 'WEB', skipAuth: false },
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') { toast.error(data?.data?.desc); return; }
            toast.success('Transaction PIN changed successfully!');
            handleClose();
        },
        onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to set new PIN'),
    });

    const handleSubmitCurrentPin = () => {
        if (currentPin.length !== 4) { toast.error('Please enter a valid 4-digit PIN'); return; }
        validateCurrentPinMutation.mutate(currentPin);
    };

    const handleSubmitNewPin = () => {
        if (newPin !== confirmPin) { toast.error('PINs do not match'); return; }
        if (newPin.length !== 4) { toast.error('PIN must be exactly 4 digits'); return; }
        if (isWeakPin(newPin)) { toast.error('Please choose a stronger PIN'); return; }
        if (newPin === currentPin) { toast.error('New PIN cannot be the same as current PIN'); return; }
        setPasswordMutation.mutate({ newPin, confirmPin });
    };

    const isNewPinFormValid = () =>
        newPin.length === 4 && confirmPin.length === 4 && newPin === confirmPin && !isWeakPin(newPin) && newPin !== currentPin;

    const handleClose = () => {
        setCurrentPin(''); setNewPin(''); setConfirmPin('');
        setCurrentStep('validate-current'); setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-0 rounded-2xl gap-0 border-0 shadow-xl bg-[#F5F5F5]">
                <DialogTitle className="sr-only">Change Transaction PIN</DialogTitle>

                <div className="flex items-center justify-between px-5 pt-5">
                    <h2 className="text-base font-semibold text-dark-gray">Change Transaction PIN</h2>
                </div>

                <div className="">
                    {currentStep === 'validate-current' && (
                        <>
                            <div className='px-4 pb-5 pt-3 space-y-3'>
                                <SecurityNotice message="You're about to change your transaction PIN. Make sure you remember your current PIN to proceed." />
                                <div className="bg-white rounded-2xl p-4 space-y-4">
                                    <AccountRow customerName={user?.fullname} username={user?.username} />
                                    <div>
                                        <PinLabel>Enter Current PIN</PinLabel>
                                        <PinInput
                                            length={4}
                                            value={currentPin}
                                            onChange={setCurrentPin}
                                            type="password"
                                            secure
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            </div>
                            <ModalFooter
                                onCancel={handleClose}
                                onAction={handleSubmitCurrentPin}
                                actionLabel="Verify Current PIN"
                                disabled={currentPin.length !== 4}
                                loading={validateCurrentPinMutation.isPending}
                            />
                        </>
                    )}

                    {currentStep === 'set-new-pin' && (
                        <>
                            <div className="px-4 pb-5 pt-3 space-y-3">
                                <SecurityNotice message="You're about to change your transaction PIN." />
                                <div className="bg-white rounded-2xl p-4 space-y-4">
                                    <div>
                                        <PinLabel>Enter New PIN</PinLabel>
                                        <PinInput
                                            length={4}
                                            value={newPin}
                                            onChange={setNewPin}
                                            type="password"
                                            secure
                                            autoFocus
                                        />
                                        {newPin.length === 4 && isWeakPin(newPin) && (
                                            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1 justify-center">
                                                <AlertTriangle className="w-3.5 h-3.5" /> {getWeakPinReason(newPin)}
                                            </p>
                                        )}
                                        {newPin.length === 4 && newPin === currentPin && (
                                            <p className="text-xs text-red-500 mt-2 text-center">New PIN cannot be the same as current PIN</p>
                                        )}
                                    </div>

                                    {newPin.length === 4 && !isWeakPin(newPin) && newPin !== currentPin && (
                                        <div>
                                            <PinLabel>Confirm New PIN</PinLabel>
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
                                onAction={handleSubmitNewPin}
                                actionLabel="Confirm New PIN"
                                disabled={!isNewPinFormValid()}
                                loading={setPasswordMutation.isPending}
                            />
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePinModal;