'use client'
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface DeliveryOption {
    id: number;
    area: string;
    groupCode: string;
    estimatedTime: number;
    estimatedTimeType: string;
    deliveryVatRate: number;
    deliveryVatAmount: number;
    capLimit: number;
    amount: number;
}

interface DeliveryOptionViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    option: DeliveryOption | null;
}

const getGroupCodeColor = (groupCode: string): string => {
    switch (groupCode?.toUpperCase()) {
        case 'STANDARD': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'EXPRESS': return 'bg-green-100 text-green-700 border-green-200';
        case 'PREMIUM': return 'bg-purple-100 text-purple-700 border-purple-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2 }).format(amount || 0);
};

const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-0.5">
        <p className="text-xs text-medium-gray">{label}</p>
        <p className="text-xs font-semibold text-dark-gray">{value || 'N/A'}</p>
    </div>
);

export const DeliveryOptionViewModal: React.FC<DeliveryOptionViewModalProps> = ({ open, onOpenChange, option }) => {
    if (!option) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[100vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                <DialogTitle className="sr-only">Delivery Option Details</DialogTitle>

                <div className="px-6 pt-5 pb-4">
                    <h2 className="text-base font-semibold text-dark-gray mb-4">Delivery Option Details</h2>

                    <div className="bg-white rounded-2xl p-4 space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-[#F5F5F5]">
                            <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full ${getGroupCodeColor(option.groupCode)}`}>{option.groupCode}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <Field label="Amount" value={`₦${formatCurrency(option.amount)}`} />
                            <Field label="VAT Rate" value={`${option.deliveryVatRate}%`} />
                            <Field label="VAT Amount" value={`₦${formatCurrency(option.deliveryVatAmount)}`} />
                            <Field label="Cap Limit" value={`₦${formatCurrency(option.capLimit)}`} />
                            <Field label="Estimated Time" value={`${option.estimatedTime} ${option.estimatedTimeType?.toLowerCase()}`} />
                        </div>
                        <div className="pt-3 border-t border-[#F5F5F5]">
                            <p className="text-xs text-medium-gray mb-1">Areas</p>
                            <p className="text-sm text-dark-gray">{option.area || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};