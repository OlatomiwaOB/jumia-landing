'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { Loader2, MapPin, User, CreditCard, CheckCircle } from 'lucide-react';
import { formatPrice, CurrencyCode } from '@/utils/helperfns';
import { toast } from 'sonner';

interface SettlementDetails {
    id: number;
    tranRefNo: string;
    senderName: string;
    senderMobile: string;
    beneficiaryName: string;
    beneficiaryMobile: string | null;
    beneficiaryBankCode: string;
    beneficiaryAccount: string;
    tranCode: string;
    tranType: string;
    amount: number;
    charge: number;
    currencyCode: string;
    stampDutyFee: number;
    tax: number;
    subTotal: number;
    tranDate: string;
    narration: string;
    paymentMethod: string | null;
    terminalId: string | null;
    responseCode: string;
    responseMessage: string;
    paymentRefNo: string | null;
    externalRefNo: string | null;
    rrn: string | null;
    stan: string | null;
    cardNo: string;
    agentCommission: number;
    networkCommission: number;
    bankCommission: number;
    serviceProviderCommission: number;
    platformCommission: number;
    aggregatorCommission: number;
    status: string;
    createdBy: string;
    createdDate: string;
    crDr: string;
    paymentResponseCode: string;
    paymentResponseMessage: string | null;
    provider: string;
    oldRef: string;
    bankName: string;
}

interface SettlementDetailsModalProps {
    settlementRef: string | null;
    open: boolean;
    onClose: () => void;
}

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'SUCCESSFUL': case 'SUCCESS': return 'bg-green-100 text-green-700 border-green-200';
        case 'PENDING': case 'PROCESSING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'FAILED': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount || 0);
};

const Field = ({ label, value, copyable, highlight }: { label: string; value: string; copyable?: boolean; highlight?: boolean }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        if (!value || value === 'N/A') return;
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Copied to clipboard');
    };
    return (
        <div className="space-y-0.5">
            <p className="text-xs text-medium-gray">{label}</p>
            <div className="flex items-center gap-1.5">
                <p className={`text-xs truncate font-semibold ${highlight ? 'text-[#018E25]' : 'text-dark-gray'}`}>{value || 'N/A'}</p>
                {copyable && value && value !== 'N/A' && (
                    <button onClick={handleCopy} className="cursor-pointer text-faded-accent hover:text-faded-accent/60 shrink-0" title="Copy">
                        {copied ? <CheckCircle className="w-3 h-3" /> : <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.6654 8.59999V11.4C10.6654 13.7333 9.73203 14.6667 7.3987 14.6667H4.5987C2.26536 14.6667 1.33203 13.7333 1.33203 11.4V8.59999C1.33203 6.26666 2.26536 5.33333 4.5987 5.33333H7.3987C9.73203 5.33333 10.6654 6.26666 10.6654 8.59999Z" fill="#F56B08" stroke="#F56B08" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M14.6654 4.59999V7.39999C14.6654 9.73333 13.732 10.6667 11.3987 10.6667H10.6654V8.59999C10.6654 6.26666 9.73203 5.33333 7.3987 5.33333H5.33203V4.59999C5.33203 2.26666 6.26536 1.33333 8.5987 1.33333H11.3987C13.732 1.33333 14.6654 2.26666 14.6654 4.59999Z" stroke="#F56B08" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        }
                    </button>
                )}
            </div>
        </div>
    );
};
;

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl p-4 space-y-4">
        <p className="text-sm font-semibold text-dark-gray">{title}</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
);

export const SettlementDetailsModal: React.FC<SettlementDetailsModalProps> = ({ settlementRef, open, onClose }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['settlement-details', settlementRef],
        queryFn: async () => {
            const response = await axiosOperations.get(`/transactionmanager/${settlementRef}`);
            return response.data as SettlementDetails;
        },
        enabled: !!settlementRef && open,
    });

    const settlement = data;

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-3xl max-h-[100vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                    <DialogTitle className="sr-only">Settlement Details</DialogTitle>
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!settlement) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-3xl rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                    <DialogTitle className="sr-only">Settlement Details</DialogTitle>
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <p className="text-base font-semibold text-dark-gray">Settlement not found</p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    const ccy = settlement.currencyCode || 'NGN';

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl max-h-[100vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                <DialogTitle className="sr-only">Settlement Details</DialogTitle>

                <div className="px-6 pt-5 pb-4">
                    <h2 className="text-base font-semibold text-dark-gray mb-4">Settlement Details</h2>

                    <div className="bg-white rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#F5F5F5]">
                            <div>
                                <p className="text-sm font-bold text-dark-gray">{formatCurrency(settlement.amount, ccy as CurrencyCode)}</p>
                                <p className="text-xs text-medium-gray font-mono">{settlement.tranRefNo}</p>
                            </div>
                            <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full ml-auto ${getStatusColor(settlement.status)}`}>{settlement.status}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-x-6">
                            <Field label="Transaction Type" value={settlement.tranType || 'N/A'} />
                            <Field label="Date" value={settlement.tranDate || 'N/A'} />
                            <Field label="Response" value={settlement.responseMessage || 'N/A'} />
                            <Field label="CR/DR" value={settlement.crDr || 'N/A'} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <SectionCard title="Transaction Information">
                                <Field label="Reference Number" value={settlement.tranRefNo} copyable />
                                <Field label="Transaction Code" value={settlement.tranCode} />
                                <Field label="Transaction Type" value={settlement.tranType} />
                                <Field label="Narration" value={settlement.narration} />
                                <Field label="Amount" value={formatCurrency(settlement.amount, ccy as CurrencyCode)} highlight />
                                <Field label="Subtotal" value={formatCurrency(settlement.subTotal, ccy as CurrencyCode)} />
                                <Field label="Currency" value={settlement.currencyCode || 'NGN'} />
                            </SectionCard>

                            <SectionCard title="Commission Breakdown">
                                <Field label="Service Provider" value={formatCurrency(settlement.serviceProviderCommission, ccy as CurrencyCode)} />
                                <Field label="Platform Commission" value={formatCurrency(settlement.platformCommission, ccy as CurrencyCode)} />
                                <Field label="Stamp Duty" value={formatCurrency(settlement.stampDutyFee, ccy as CurrencyCode)} />
                                <Field label="Tax" value={formatCurrency(settlement.tax, ccy as CurrencyCode)} />
                            </SectionCard>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {settlement.beneficiaryName && (
                                <SectionCard title="Beneficiary Information">
                                    <Field label="Name" value={settlement.beneficiaryName || ''} />
                                    <Field label="Account" value={settlement.beneficiaryAccount} copyable />
                                    <Field label="Bank Code" value={settlement.beneficiaryBankCode} />
                                </SectionCard>
                            )}

                            <SectionCard title="Source Information">
                                <Field label="Created By" value={settlement.createdBy} />
                                <Field label="Created Date" value={settlement.createdDate} />
                                {settlement.senderMobile && <Field label="Sender Mobile" value={settlement.senderMobile} />}
                            </SectionCard>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <SectionCard title="Payment Information">
                                <Field label="Payment Method" value={settlement.paymentMethod || ''} />
                                {settlement.paymentRefNo && <Field label="Payment Ref No." value={settlement.paymentRefNo} copyable />}
                                {settlement.externalRefNo && <Field label="External Ref No." value={settlement.externalRefNo} copyable />}
                                {settlement.oldRef && <Field label="Old Reference" value={settlement.oldRef} copyable />}
                                {settlement.provider && <Field label="Provider" value={settlement.provider} />}
                            </SectionCard>

                            {(settlement.terminalId || settlement.rrn || settlement.stan) && (
                                <SectionCard title="Additional Details">
                                    {settlement.terminalId && <Field label="Device ID" value={settlement.terminalId} copyable />}
                                    {settlement.rrn && <Field label="RRN" value={settlement.rrn} copyable />}
                                    {settlement.stan && <Field label="STAN" value={settlement.stan} copyable />}
                                    {settlement.cardNo && <Field label="Card Number" value={settlement.cardNo ? `****${settlement.cardNo.slice(-4)}` : 'N/A'} />}
                                </SectionCard>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};