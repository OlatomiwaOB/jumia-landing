'use client'
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionType {
    id: number;
    entityCode: string;
    customerType: string;
    tranCode: string;
    tranName: string;
    maxLimit: number;
    dailyLimit: number;
    monthlyLimit: number | null;
    dailyFreq: number;
    status: string;
    agentCommission: number;
    platformCommission: number;
    networkCommission: number;
    bankCommission: number;
    aggregatorCommission: number;
    serviceFee: number;
    groupCommission: null | number;
    charge: number;
    chargeType: string;
    otherCharge: number;
    tranChannel: string;
    roleAllowed: null | string;
    minLimit: number;
    sharingType: string;
    glCodeCommission: string | null;
    glCode: string | null;
    branchCode: string;
    tax: number;
    setupRefNo: string;
    minHardTokenLimit: number;
    maxHardTokenLimit: number;
    dailyHardTokenLimit: number;
    capLimit: number;
}

interface TransactionTypeViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: TransactionType | null;
}

const getStatusColor = (status: string): string => {
    const statusUpper = status?.toUpperCase() || '';
    if (statusUpper === 'ACTIVE') return 'bg-accent text-white';
    if (statusUpper === 'INACTIVE') return 'bg-red-500 text-white';
    return 'bg-gray-500 text-white';
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount || 0);
};

const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-NG').format(value || 0);
};

const InfoRow = ({ label, value, copyable = false }: { label: string; value: string | number | null; copyable?: boolean }) => {
    const [copied, setCopied] = useState(false);
    const displayValue = value?.toString() || 'N/A';

    const handleCopy = () => {
        if (displayValue === 'N/A') return;
        navigator.clipboard.writeText(displayValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Copied to clipboard');
    };

    return (
        <div className="flex justify-between items-start py-2 border-b border-accent/10 last:border-0">
            <span className="text-sm text-accent-foreground/70">{label}</span>
            <div className="flex items-center gap-2 max-w-[60%]">
                <span className="text-sm font-medium text-accent-foreground text-right break-words">
                    {displayValue}
                </span>
                {copyable && displayValue !== 'N/A' && (
                    <button
                        onClick={handleCopy}
                        className="text-accent hover:text-accent/70 transition-colors flex-shrink-0"
                        title="Copy to clipboard"
                    >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    );
};

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
        <h3 className="text-md font-semibold text-accent-foreground mb-3">{title}</h3>
        <div className="space-y-1">
            {children}
        </div>
    </div>
);

export default function TransactionTypeViewModal({
    open,
    onOpenChange,
    transaction,
}: TransactionTypeViewModalProps) {
    if (!transaction) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-5xl max-h-[85vh] overflow-y-auto"
                style={{
                    scrollbarWidth: 'none',
                    scrollbarColor: 'transparent',
                }}
            >
                <DialogHeader className="flex flex-col">
                    <DialogTitle className="text-accent-foreground flex items-center gap-4">
                        <span>Transaction Type Details</span>
                        <Badge className={`${getStatusColor(transaction.status)} text-xs px-2 py-1`}>
                            {transaction.status || 'UNKNOWN'}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
                        <div>
                            <p className="text-xs text-accent-foreground/70">Transaction Code</p>
                            <p className="text-lg font-bold text-accent-foreground font-mono">
                                {transaction.tranCode}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-accent-foreground/70">Transaction Name</p>
                            <p className="text-lg font-semibold text-accent-foreground">
                                {transaction.tranName}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-accent-foreground/70">Branch Code</p>
                            <p className="text-md font-semibold text-accent-foreground">
                                {transaction.branchCode || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-accent-foreground/70">Customer Type</p>
                            <p className="text-md font-semibold text-accent-foreground">
                                {transaction.customerType}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SectionCard title="Limit Information">
                            <InfoRow label="Minimum Limit" value={formatCurrency(transaction.minLimit)} />
                            <InfoRow label="Maximum Limit" value={formatCurrency(transaction.maxLimit)} />
                            <InfoRow label="Daily Limit" value={formatCurrency(transaction.dailyLimit)} />
                            {transaction.monthlyLimit && (
                                <InfoRow label="Monthly Limit" value={formatCurrency(transaction.monthlyLimit)} />
                            )}
                            <InfoRow label="Daily Frequency" value={formatNumber(transaction.dailyFreq)} />
                            <InfoRow label="Cap Limit" value={formatCurrency(transaction.capLimit)} />
                            <InfoRow label="Min Hard Token Limit" value={formatCurrency(transaction.minHardTokenLimit)} />
                            <InfoRow label="Max Hard Token Limit" value={formatCurrency(transaction.maxHardTokenLimit)} />
                            <InfoRow label="Daily Hard Token Limit" value={formatCurrency(transaction.dailyHardTokenLimit)} />
                        </SectionCard>

                        <SectionCard title="Commission Information">
                            <InfoRow label="Agent Commission" value={`${formatCurrency(transaction.agentCommission)}`} />
                            <InfoRow label="Platform Commission" value={`${formatCurrency(transaction.platformCommission)}`} />
                            <InfoRow label="Network Commission" value={`${formatCurrency(transaction.networkCommission)}`} />
                            <InfoRow label="Bank Commission" value={`${formatCurrency(transaction.bankCommission)}`} />
                            <InfoRow label="Aggregator Commission" value={`${formatCurrency(transaction.aggregatorCommission)}`} />
                            {transaction.groupCommission && (
                                <InfoRow label="Group Commission" value={`${formatCurrency(transaction.groupCommission)}`} />
                            )}
                            <InfoRow label="Service Fee" value={`${formatCurrency(transaction.serviceFee)}`} />
                            <InfoRow label="Tax" value={`${formatCurrency(transaction.tax)}`} />
                        </SectionCard>

                        <SectionCard title="Charge Information">
                            <InfoRow label="Charge Type" value={transaction.chargeType} />
                            <InfoRow label="Charge" value={`${formatCurrency(transaction.charge)}`} />
                            <InfoRow label="Other Charge" value={`${formatCurrency(transaction.otherCharge)}`} />
                            <InfoRow label="Sharing Type" value={transaction.sharingType} />
                            {transaction.glCodeCommission && (
                                <InfoRow label="GL Code Commission" value={transaction.glCodeCommission} copyable />
                            )}
                            {transaction.glCode && (
                                <InfoRow label="GL Code" value={transaction.glCode} copyable />
                            )}
                        </SectionCard>

                        <SectionCard title="Additional Information">
                            <InfoRow label="Transaction Channel" value={transaction.tranChannel} />
                            <InfoRow label="Entity Code" value={transaction.entityCode} copyable />
                            <InfoRow label="Setup Reference No" value={transaction.setupRefNo} copyable />
                            {transaction.roleAllowed && (
                                <InfoRow label="Role Allowed" value={transaction.roleAllowed} />
                            )}
                            <InfoRow label="ID" value={transaction.id.toString()} copyable />
                        </SectionCard>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}