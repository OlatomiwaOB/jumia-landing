'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import { RefreshCw, RotateCcw, CheckCircle, Loader2, Copy } from 'lucide-react';
import { PermissionButton } from '@/components/Operations/permission/permission-button';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { Dialog as ApproveDialog, DialogContent as ApproveDialogContent, DialogTitle as ApproveDialogTitle } from '@/components/ui/dialog';
import { CopyIcon } from '@/components/icons/icons';

interface TransactionDetails {
    tranRefNo: string;
    tranDate: string;
    tranType: string;
    narration: string;
    amount: number;
    charge: number;
    currencyCode: string;
    responseMessage: string;
    status: string;
    senderName: string;
    senderMobile: string;
    sourceAccount: string;
    createdBy: string;
    createdDate: string;
    beneficiaryName: string;
    beneficiaryMobile: string;
    beneficiaryAccount: string;
    beneficiaryBankCode: string;
    paymentMethod: string;
    cardNo: string;
    terminalId: string;
    rrn: string;
    stan: string;
    paymentRefNo: string;
    externalRefNo: string;
    bankName: string;
    agentCommission?: number;
    networkCommission?: number;
    bankCommission?: number;
    serviceProviderCommission?: number;
    platformCommission?: number;
    aggregatorCommission?: number;
    tranCode: string;
}

interface TransactionDetailsModalProps {
    transactionRef: string | null;
    open: boolean;
    onClose: () => void;
    onRefetch?: () => void;
}

const getStatusColor = (status: string): string => {
    const statusUpper = status?.toUpperCase() || '';
    if (statusUpper === 'SUCCESSFUL' || statusUpper === 'SUCCESS') return 'bg-green-100 text-green-700 border-green-200';
    if (statusUpper === 'PENDING' || statusUpper === 'PROCESSING') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (statusUpper === 'FAILED') return 'bg-red-100 text-red-700 border-red-200';
    if (statusUpper === 'REVERSED') return 'bg-purple-100 text-purple-700 border-purple-200';
    if (statusUpper === 'PENDING REVERSAL') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
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

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl p-4 space-y-4">
        <p className="text-sm font-semibold text-dark-gray">{title}</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
);

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ transactionRef, open, onClose, onRefetch }) => {
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['transaction-details', transactionRef],
        queryFn: () => axiosOperations.get(`/transactionmanager/${transactionRef}`),
        enabled: !!transactionRef && open,
    });

    const transaction: TransactionDetails = data?.data;

    const repushMutation = useMutation({
        mutationFn: () => axiosOperations.get(`/transactionmanager/repush/${transactionRef}`),
        onSuccess: (res) => {
            if (res.data.code === '000' || res.data.code === '00') { toast.success(res?.data?.desc ?? 'Repush successful!'); refetch(); }
            else { toast.error(res?.data?.desc ?? 'Repush failed'); }
        },
        onError: () => toast.error('Repush failed!'),
    });

    const requeryMutation = useMutation({
        mutationFn: () => axiosOperations.get(`/transactionmanager/requery/${transactionRef}`, { params: { tranRefNo: transactionRef, provider: '' } }),
        onSuccess: (res) => {
            if (res.data.code === '000' || res.data.code === '00') { toast.success(res?.data?.desc ?? 'Requery successful!'); refetch(); }
            else { toast.error(res?.data?.desc ?? 'Requery failed'); }
        },
        onError: () => toast.error('Requery failed!'),
    });

    const reverseMutation = useMutation({
        mutationFn: () => axiosOperations.get(`/transactionmanager/reverse/${transactionRef}`),
        onSuccess: (res) => {
            if (res.data.code === '000' || res.data.code === '00') { toast.success(res?.data?.desc ?? 'Reverse successful!'); refetch(); }
            else { toast.error(res?.data?.desc ?? 'Reverse failed'); }
        },
        onError: () => toast.error('Reverse failed!'),
    });

    const approveReversalMutation = useMutation({
        mutationFn: async (referenceNo: string) => {
            const response = await axiosOperations.get(`/transactionmanager/approve-reversal/${referenceNo}`, {});
            return response.data;
        },
        onSuccess: (data) => {
            if (data?.code === '000' || data?.responseCode === '000') {
                toast.success('Reversal approved successfully');
                setIsApproveModalOpen(false);
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
                refetch();
                onRefetch?.();
            } else { toast.error(data?.desc || data?.responseMessage || 'Failed to approve reversal'); }
        },
        onError: (error: any) => { toast.error(error.response?.data?.message || 'Failed to approve reversal'); },
    });

    const isProcessing = reverseMutation.isPending || repushMutation.isPending || requeryMutation.isPending;

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-3xl max-h-[100vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                    <DialogTitle className="sr-only">Transaction Details</DialogTitle>
                    <div className="flex items-center justify-center py-20">
                        Loading trans. details <Loader2 className="w-8 h-8 animate-spin text-faded-accent" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!transaction) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-3xl rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                    <DialogTitle className="sr-only">Transaction Details</DialogTitle>
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <p className="text-base font-semibold text-dark-gray">Transaction not found</p>
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-3xl max-h-[100vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                    style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                    <DialogTitle className="sr-only">Transaction Details</DialogTitle>

                    <div className="px-6 pt-5 pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold text-dark-gray">Transaction Details</h2>
                        </div>

                        <div className="bg-white rounded-2xl p-4 mb-4">
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F5F5F5]">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className='text-xs text-dark-gray font-semibold'>{formatPrice(transaction.amount, transaction.currencyCode as CurrencyCode)} </p>
                                        <p className='text-xs text-medium-gray'>{transaction.tranRefNo}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full ${getStatusColor(transaction.status)}`}>{transaction.status}</Badge>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <PermissionButton
                                        requiredPermissions={['MANAGE_TRANS']} requireAll={true} hideIfNoPermission={false}
                                        tooltipMessage="No permission" variant="outline" size="sm"
                                        onClick={() => reverseMutation.mutate()} disabled={isProcessing}
                                        className="gap-1">
                                        <RotateCcw className="w-3.5 h-3.5" /> Reverse
                                    </PermissionButton>
                                    <PermissionButton
                                        requiredPermissions={['MANAGE_TRANS']} requireAll={true} hideIfNoPermission={false}
                                        tooltipMessage="No permission" size="sm"
                                        onClick={() => requeryMutation.mutate()} disabled={isProcessing}
                                        className="gap-1">
                                        <RefreshCw className={`w-3.5 h-3.5 ${requeryMutation.isPending ? 'animate-spin' : ''}`} /> Requery
                                    </PermissionButton>
                                    {transaction.status?.toUpperCase() === 'PENDING REVERSAL' && (
                                        <Button size="sm" onClick={() => setIsApproveModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white gap-1">
                                            <CheckCircle className="w-3.5 h-3.5" /> Approve Reversal
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-x-6">
                                <Field label="Transaction Type" value={transaction.tranType || 'N/A'} />
                                <Field label="Date" value={transaction.tranDate || 'N/A'} />
                                <Field label="Response" value={transaction.responseMessage || 'N/A'} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6'>
                                <SectionCard title="Transaction Information">
                                    <Field label="Reference Number" value={transaction.tranRefNo} copyable />
                                    <Field label="Transaction Type" value={transaction.tranType} />
                                    <Field label="Narration" value={transaction.narration} />
                                    <Field label="Amount" value={formatPrice(transaction.amount, transaction.currencyCode as CurrencyCode)} highlight />
                                    <Field label="Charge" value={formatPrice(transaction.charge, transaction.currencyCode as CurrencyCode)} />
                                    <Field label="Currency" value={transaction.currencyCode || 'NGN'} />
                                    <Field label="Response" value={transaction.responseMessage} />
                                </SectionCard>

                                <SectionCard title="Sender Information">
                                    <Field label="Name" value={transaction.senderName} />
                                    <Field label="Mobile" value={transaction.senderMobile} copyable />
                                    <Field label="Account Number" value={transaction.sourceAccount} copyable />
                                    <Field label="Bank Name" value={transaction.bankName} />
                                    <Field label="Email" value={transaction.createdBy} />
                                    <Field label="Date" value={transaction.createdDate} />
                                </SectionCard>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6'>
                                <SectionCard title="Beneficiary Information">
                                    <Field label="Name" value={transaction.beneficiaryName} />
                                    <Field label="Mobile" value={transaction.beneficiaryMobile} copyable />
                                    <Field label="Account Number" value={transaction.beneficiaryAccount} copyable />
                                    <Field label="Bank Name" value={transaction.beneficiaryBankCode} />
                                </SectionCard>

                                <SectionCard title="Payment Information">
                                    <Field label="Payment Method" value={transaction.paymentMethod} />
                                    <Field label="Card Number" value={transaction.cardNo ? `****${transaction.cardNo.slice(-4)}` : 'N/A'} />
                                    <Field label="Device ID" value={transaction.terminalId} copyable />
                                    <Field label="RRN" value={transaction.rrn} copyable />
                                    <Field label="STAN" value={transaction.stan} copyable />
                                    <Field label="Payment Ref No." value={transaction.paymentRefNo} copyable />
                                    <Field label="External Ref No." value={transaction.externalRefNo} copyable />
                                    {(transaction.agentCommission ?? 0) > 0 && <Field label="Agent Commission" value={formatPrice(transaction.agentCommission ?? 0, transaction.currencyCode as CurrencyCode)} />}
                                    {(transaction.networkCommission ?? 0) > 0 && <Field label="Network Commission" value={formatPrice(transaction.networkCommission ?? 0, transaction.currencyCode as CurrencyCode)} />}
                                    {(transaction.bankCommission ?? 0) > 0 && <Field label="Bank Commission" value={formatPrice(transaction.bankCommission ?? 0, transaction.currencyCode as CurrencyCode)} />}
                                    {(transaction.platformCommission ?? 0) > 0 && <Field label="Platform Commission" value={formatPrice(transaction.platformCommission ?? 0, transaction.currencyCode as CurrencyCode)} />}
                                </SectionCard>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ApproveDialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
                <ApproveDialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                    <ApproveDialogTitle className="sr-only">Approve Reversal</ApproveDialogTitle>
                    <div className="px-6 pt-5">
                        <h2 className="text-base font-bold text-dark-gray">Approve Reversal Request</h2>
                        <p className="text-xs text-medium-gray mt-0.5">Confirm reversal approval</p>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl m-6 p-4 space-y-3">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <p className="text-xs text-amber-800"><span className="font-semibold">Note:</span> This will reverse the transaction and refund the amount.</p>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-1.5"><span className="text-medium-gray">Reference:</span><span className="text-dark-gray font-mono">{transaction.tranRefNo}</span></div>
                                <div className="flex justify-between py-1.5"><span className="text-medium-gray">Amount:</span><span className="font-semibold text-red-600">{formatPrice(transaction.amount, transaction.currencyCode as CurrencyCode)}</span></div>
                            </div>
                        </div>
                        <div className="flex gap-3 px-6 py-3 bg-white justify-end rounded-b-2xl">
                            <Button variant="outline" onClick={() => setIsApproveModalOpen(false)} disabled={approveReversalMutation.isPending}>Cancel</Button>
                            <Button onClick={() => approveReversalMutation.mutate(transaction.tranRefNo)} disabled={approveReversalMutation.isPending}>
                                <CheckCircle className="w-4 h-4" /> {approveReversalMutation.isPending ? 'Processing...' : 'Confirm Approval'}
                            </Button>
                        </div>
                    </div>
                </ApproveDialogContent>
            </ApproveDialog>
        </>
    );
};