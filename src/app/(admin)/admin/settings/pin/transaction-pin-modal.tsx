"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useUser from "@/store/userStore";
import { logout } from '@/utils/auth-utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PinInput from '@/components/ui/pin-input';
import { AlertTriangle } from "lucide-react";
import axiosInstance from "@/utils/fetch-function-no-auth";

type SetPinFormData = {
    newPin: string
    confirmPin: string
}

export type TransactionPinModalProps = {
    isOpen: boolean;
    onClose: () => void;
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

const TransactionPinModal: React.FC<TransactionPinModalProps> = ({ isOpen, onClose }) => {
    const { user } = useUser();
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const setPinMutation = useMutation({
        mutationFn: (data: SetPinFormData) => {
            return axiosInstance.request({
                url: '/ecommerce/setPIN?skipAuth=true',
                method: 'POST',
                data: {
                    username: user?.username || '',
                    newPin: data.newPin,
                    entityCode: user?.entityCode || process.env.NEXT_PUBLIC_ENTITYCODE || '',
                    channel: 'WEB',
                },
            });
        },
        onSuccess: (data) => {
            if (data?.data?.code !== '000') {
                toast.error(data?.data?.desc || 'Failed to set transaction PIN');
                return;
            }
            toast.success('Transaction PIN set successfully! You will be logged out in 5 seconds...');
            handleClose();
            setIsLoggingOut(true);
            setTimeout(() => {
                logout();
                setIsLoggingOut(false);
            }, 5000);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to set transaction PIN');
        },
    });

    const handleSubmitNewPin = () => {
        if (newPin !== confirmPin) {
            toast.error('PINs do not match');
            return;
        }
        if (newPin.length !== 4) {
            toast.error('PIN must be exactly 4 digits');
            return;
        }
        if (isWeakPin(newPin)) {
            toast.error('Please choose a stronger PIN');
            return;
        }
        setPinMutation.mutate({ newPin, confirmPin });
    };

    const isNewPinFormValid = () =>
        newPin.length === 4 &&
        confirmPin.length === 4 &&
        newPin === confirmPin &&
        !isWeakPin(newPin);

    const handleClose = () => {
        setNewPin('');
        setConfirmPin('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-0 rounded-2xl gap-0 border-0 shadow-xl bg-[#F5F5F5]">
                <DialogTitle className="sr-only">Set Transaction PIN</DialogTitle>

                <div className="flex items-center justify-between px-5 pt-5">
                    <h2 className="text-base font-semibold text-dark-gray">Set Transaction PIN</h2>
                </div>

                <div className="px-4 pb-5 pt-3 space-y-3">
                    <SecurityNotice message="Create a 4-digit PIN to secure your transactions. You'll need this PIN to authorize payments and transfers." />

                    <div className="bg-white rounded-2xl p-4 space-y-4">
                        <AccountRow
                            customerName={user?.fullname}
                            username={user?.username}
                        />

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
                        </div>

                        {newPin.length === 4 && !isWeakPin(newPin) && (
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

                    <div className="bg-white rounded-2xl p-4">
                        <h4 className="text-xs font-semibold text-dark-gray mb-2">PIN Requirements:</h4>
                        <ul className="text-xs text-medium-gray space-y-1">
                            <li>• Numbers only (0-9)</li>
                            <li>• Avoid consecutive and repeated numbers (1234, 4321, 1111, 2222)</li>
                            <li>• Do not share your PIN with anyone</li>
                        </ul>
                    </div>
                </div>

                <ModalFooter
                    onCancel={handleClose}
                    onAction={handleSubmitNewPin}
                    actionLabel="Set Transaction PIN"
                    disabled={!isNewPinFormValid()}
                    loading={setPinMutation.isPending || isLoggingOut}
                />
            </DialogContent>
        </Dialog>
    );
};

export default TransactionPinModal;