'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';

interface OptionType {
    id: number;
    typeCode: string;
    typeName: string;
    multiplier: number;
}

interface OptionTypeDeleteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    optionType: OptionType | null;
    onSuccess: () => void;
}

export const OptionTypeDeleteModal: React.FC<OptionTypeDeleteModalProps> = ({ open, onOpenChange, optionType, onSuccess }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: async (payload: { id: number }) => {
            return await axiosOperations.delete(`/delivery-by-weight/option-type/${payload.id}/delete`, { data: payload });
        },
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Option type deleted successfully');
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
        if (!optionType) return;
        setIsDeleting(true);
        deleteMutation.mutate({ id: optionType.id });
    };

    if (!optionType) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                <DialogTitle className="sr-only">Delete Option Type</DialogTitle>
                <div className="px-6 pt-5">
                    <h2 className="text-base font-bold text-dark-gray">Delete Option Type</h2>
                    <p className="text-xs text-medium-gray mt-0.5">This action cannot be undone</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-white rounded-2xl p-4 m-6 space-y-4">
                        <div className="space-y-1.5">
                            <p className="text-xs text-medium-gray">Type Code</p>
                            <p className="text-sm font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{optionType.typeCode}</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-medium-gray">Type Name</p>
                            <p className="text-sm font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{optionType.typeName}</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-medium-gray">Multiplier</p>
                            <p className="text-sm font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{optionType.multiplier}x</p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-xs text-red-600">
                                <span className="font-semibold">Warning:</span> This option type and its configurations will be permanently deleted.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 px-6 py-3 bg-white justify-end rounded-b-2xl">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isDeleting}>
                            {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : <>Delete Option Type</>}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};