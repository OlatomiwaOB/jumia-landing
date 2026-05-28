'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';

interface DeliveryOption {
    id: number;
    groupCode: string;
    amount: number;
}

interface DeliveryOptionDeleteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    option: DeliveryOption | null;
    onSuccess: () => void;
}

export const DeliveryOptionDeleteModal: React.FC<DeliveryOptionDeleteModalProps> = ({ open, onOpenChange, option, onSuccess }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: async (payload: { id: number }) => {
            return await axiosOperations.delete(`/delivery/option/remove/${payload.id}`, { data: payload });
        },
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Delivery option deleted successfully');
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error(data?.data?.desc || 'Failed to delete');
                setIsDeleting(false);
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete');
            setIsDeleting(false);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!option) return;
        setIsDeleting(true);
        deleteMutation.mutate({ id: option.id });
    };

    if (!option) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                <DialogTitle className="sr-only">Delete Delivery Option</DialogTitle>
                <div className="px-6 pt-5">
                    <h2 className="text-base font-bold text-dark-gray">Delete Delivery Option</h2>
                    <p className="text-xs text-medium-gray mt-0.5">This action cannot be undone</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-white rounded-2xl p-4 m-6 space-y-4">
                        <div className="space-y-1.5">
                            <p className="text-xs text-medium-gray">Group Code</p>
                            <p className="text-sm font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{option.groupCode}</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-medium-gray">Amount</p>
                            <p className="text-sm font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">₦{option.amount?.toLocaleString()}</p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-xs text-red-600"><span className="font-semibold">Warning:</span> This option will be permanently deleted.</p>
                        </div>
                    </div>
                    <div className="flex gap-3 px-6 py-3 bg-white justify-end rounded-b-2xl">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>Cancel</Button>
                        <Button type="submit" disabled={isDeleting}>
                            {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : <> Delete Option</>}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};