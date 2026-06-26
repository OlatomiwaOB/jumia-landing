'use client'
import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogContent, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function-no-auth';
import { logout } from '@/utils/auth-utils';
import useUser from '@/store/userStore';
import PinInput from '@/components/ui/pin-input';
import { getClientIdentifiers } from '@/config/client-config';

const validatePassword = (p: string) => {
    if (p.length < 8) return { ok: false, strength: 'weak' as const, msg: 'At least 8 characters required' };
    const score = [/[A-Z]/, /[a-z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(p)).length;
    if (score === 4) return { ok: true, strength: 'strong' as const, msg: 'Strong password' };
    if (score >= 3) return { ok: true, strength: 'medium' as const, msg: 'Medium strength' };
    return { ok: false, strength: 'weak' as const, msg: 'Include uppercase, lowercase, numbers & special chars' };
};

const StrengthBar: React.FC<{ value: string }> = ({ value }) => {
    if (!value) return null;
    const { strength, msg } = validatePassword(value);
    const colors = { weak: 'bg-red-400', medium: 'bg-yellow-400', strong: 'bg-green-500' };
    const widths = { weak: 'w-1/3', medium: 'w-2/3', strong: 'w-full' };
    return (
        <div className="mt-1.5 space-y-1">
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${colors[strength]} ${widths[strength]}`} />
            </div>
            <p className={`text-[11px] ${strength === 'weak' ? 'text-red-500' : strength === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                {msg}
            </p>
        </div>
    );
};

const PasswordField: React.FC<{
    label: string; placeholder: string; value: string;
    onChange: (v: string) => void; showStrength?: boolean;
}> = ({ label, placeholder, value, onChange, showStrength }) => {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label className="text-xs font-medium text-dark-gray block mb-1">{label}</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex h-12 w-full font-normal text-sm text-dark-gray rounded-lg border-2 border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-normal file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-medium-gray hover:text-dark-gray transition-colors">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {showStrength && <StrengthBar value={value} />}
        </div>
    );
};

type Step = 'initiate' | 'otp' | 'set-password';

interface Props { isOpen: boolean; setIsOpen: (v: boolean) => void; }

const ChangePasswordModal: React.FC<Props> = ({ isOpen, setIsOpen }) => {
    const { user } = useUser();
    const [step, setStep] = useState<Step>('initiate');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [countdown, setCountdown] = useState(69);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (step !== 'otp') return;
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [step, countdown]);

    const reset = () => {
        setStep('initiate'); setOtp(''); setNewPassword(''); setConfirmPassword(''); setCountdown(69);
    };
    const handleClose = () => { reset(); setIsOpen(false); };

    const initiateMutation = useMutation({
        mutationFn: () => axiosInstance.request({
            url: '/ecommerce/initiatePasswordReset', method: 'GET',
            params: { username: user?.username || '', entityCode: user?.entityCode || getClientIdentifiers().entityCode },
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') { toast.error(data?.data?.desc); return; }
            toast.success('OTP sent to your registered email');
            setStep('otp');
        },
        onError: () => toast.error('Failed to initiate password reset'),
    });

    const validateOTPMutation = useMutation({
        mutationFn: () => axiosInstance.request({
            url: '/ecommerce/validatePinResetOtp', method: 'POST',
            params: { username: user?.username || '', entityCode: user?.entityCode || '', action: 'PASSWORD_RESET' },
            headers: { 'x-otp': otp },
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') { toast.error(data?.data?.desc); return; }
            toast.success('OTP verified');
            setStep('set-password');
        },
        onError: () => toast.error('Invalid OTP'),
    });

    const setPasswordMutation = useMutation({
        mutationFn: () => axiosInstance.request({
            url: '/ecommerce/selfPasswordReset', method: 'POST',
            data: { username: user?.username || '', newPwd: newPassword, entityCode: user?.entityCode || '', channel: 'WEB' },
        }),
        onSuccess: () => {
            toast.success('Password changed! Logging out in 5 seconds…');
            handleClose();
            setTimeout(() => logout(), 5000);
        },
        onError: () => toast.error('Failed to set new password'),
    });

    const resendMutation = useMutation({
        mutationFn: () => axiosInstance.request({
            url: '/usermanager/resendotp', method: 'GET',
            params: { username: user?.username || '', entityCode: user?.entityCode || '' },
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') { toast.error(data?.data?.desc); return; }
            toast.success('OTP resent'); setCountdown(69);
        },
        onError: () => toast.error('Failed to resend OTP'),
    });

    const passwordValid = validatePassword(newPassword);
    const canSubmit = newPassword && confirmPassword && newPassword === confirmPassword && passwordValid.ok;

    const titleMap: Record<Step, string> = {
        'initiate': 'Change Password',
        'otp': 'Change Password',
        'set-password': 'Change Password',
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-0 rounded-2xl gap-0 border-0 shadow-xl bg-[#F5F5F5]">
                <DialogTitle className="sr-only">Change Password</DialogTitle>

                <div className="flex items-center justify-between px-5 pt-5">
                    <h2 className="text-base font-semibold text-dark-gray">{titleMap[step]}</h2>
                </div>

                <div className="p-0 space-y-3">

                    {step === 'initiate' && (
                        <>
                            <div className='px-5 pb-5 pt-3 space-y-3'>
                                <div className="bg-faded-accent/10 rounded-xl pl-5 py-5">
                                    <p className="text-sm font-bold text-dark-gray">Security Notice</p>
                                    <p className="text-sm text-medium-gray font-medium mt-0.5">
                                        You're about to initiate a password reset request for your account. An OTP will be sent to your registered email address for verification.
                                    </p>
                                </div>
                                <div className="bg-white rounded-2xl p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-4 pt-1">
                                        <div>
                                            <p className="text-sm text-medium-gray">Username</p>
                                            <p className="text-sm font-semibold text-dark-gray mt-0.5">{user?.username}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end rounded-b-2xl bg-white p-4">
                                <Button variant="outline" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button onClick={() => initiateMutation.mutate()}
                                    disabled={initiateMutation.isPending}>
                                    {initiateMutation.isPending ? 'Sending…' : 'Send Reset OTP'}
                                </Button>
                            </div>
                        </>
                    )}

                    {step === 'otp' && (
                        <>
                            <div className='px-5 pb-5 pt-3 space-y-3'>
                                <div className="bg-faded-accent/10 rounded-xl pl-5 py-5">
                                    <p className="text-sm font-bold text-dark-gray">Security Notice</p>
                                    <p className="text-sm text-medium-gray  font-medium mt-0.5">
                                        OTP has been sent to your registered email address.
                                    </p>
                                </div>
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
                                            <span className="text-xs text-medium-gray font-medium">Didn't receive the code? </span>
                                            {countdown > 0 ? (
                                                <span className="text-xs font-semibold text-text">
                                                    {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
                                                </span>
                                            ) : (
                                                <button onClick={() => resendMutation.mutate()} disabled={resendMutation.isPending}
                                                    className="text-xs font-semibold text-text hover:text-[#c23c0a] disabled:opacity-50">
                                                    Resend Code
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end rounded-b-2xl bg-white p-4">
                                <Button variant="outline" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button onClick={() => validateOTPMutation.mutate()}
                                    disabled={validateOTPMutation.isPending || otp.length < 4}>
                                    {validateOTPMutation.isPending ? 'Verifying…' : 'Verify OTP'}
                                </Button>
                            </div>
                        </>
                    )}

                    {step === 'set-password' && (
                        <>
                            <div className='px-5 pb-5 pt-3 space-y-3'>
                                <p className='text-xs text-medium-gray'>Set your new password to login your account</p>
                                <div className="bg-white rounded-2xl p-4 space-y-3">
                                    <PasswordField
                                        label="New Password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={setNewPassword}
                                        showStrength
                                    />
                                    <PasswordField
                                        label="Confirm New Password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={setConfirmPassword}
                                    />
                                    {confirmPassword && (
                                        <p className={`text-xs text-center ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                                            {newPassword === confirmPassword ? 'Password match' : 'Passwords do not match'}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end rounded-b-2xl bg-white p-4">
                                <Button variant="outline" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button onClick={() => setPasswordMutation.mutate()}
                                    disabled={setPasswordMutation.isPending || !canSubmit}>
                                    {setPasswordMutation.isPending ? 'Saving…' : 'Save Changes'}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordModal;