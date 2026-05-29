'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';

interface LookupData {
    id: number;
    lookupName: string;
    lookupCode: string;
    categoryCode: string;
}

interface LookupDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    lookupData: LookupData | null;
    onSuccess: () => void;
}

export const LookupDeleteModal: React.FC<LookupDeleteModalProps> = ({ isOpen, onClose, lookupData, onSuccess }) => {
    const [step, setStep] = useState<'confirm' | 'otp'>('confirm');
    const [otp, setOtp] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteLookupMutation = useMutation({
        mutationFn: async (payload: { id: number; otp: string }) => {
            return await axiosOperations.delete(`/lookupdata/delete-by-id/${payload.id}?otp=${payload.otp}`, { data: payload });
        },
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Lookup deleted successfully');
                onSuccess();
                handleClose();
            } else {
                toast.error(data?.data?.desc || 'Failed to delete lookup');
                setIsDeleting(false);
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete lookup');
            setIsDeleting(false);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!lookupData) return;
        if (!otp || otp.length !== 6) { toast.error('Please enter a valid 6-digit OTP'); return; }
        setIsDeleting(true);
        deleteLookupMutation.mutate({ id: lookupData.id, otp });
    };

    const handleClose = () => {
        setStep('confirm');
        setOtp('');
        setIsDeleting(false);
        onClose();
    };

    if (!lookupData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                <DialogTitle className="sr-only">Delete Lookup</DialogTitle>
                <div className="px-6 pt-5 pb-2">
                    <h2 className="text-base font-bold text-dark-gray">Delete Lookup</h2>
                    <p className="text-xs text-medium-gray mt-0.5">This action cannot be undone</p>
                </div>

                {step === 'confirm' ? (
                    <div className="p-6 space-y-4">
                        <div className="bg-white rounded-2xl p-4 space-y-4">
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <p className="text-xs text-medium-gray">Lookup Name</p>
                                    <p className="text-sm font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{lookupData.lookupName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-medium-gray">Lookup Code</p>
                                    <p className="text-sm font-mono font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{lookupData.lookupCode}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-medium-gray">Category Code</p>
                                    <p className="text-sm font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{lookupData.categoryCode}</p>
                                </div>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-xs text-red-600"><span className="font-semibold">Warning:</span> This lookup will be permanently deleted.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end pt-1">
                            <Button variant="outline" onClick={handleClose}>Cancel</Button>
                            <Button onClick={() => setStep('otp')} className="bg-red-600 hover:bg-red-700 text-white">Continue</Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="bg-white rounded-2xl p-4 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-dark-gray">Enter OTP *</Label>
                                <Input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit OTP"
                                    required
                                    maxLength={6}
                                    disabled={isDeleting}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end pt-1">
                            <Button type="button" variant="outline" onClick={() => setStep('confirm')} disabled={isDeleting}>Back</Button>
                            <Button type="submit" disabled={isDeleting || !otp || otp.length !== 6} className="bg-red-600 hover:bg-red-700 text-white gap-2">
                                {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : <><Trash2 className="w-4 h-4" /> Delete Lookup</>}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};