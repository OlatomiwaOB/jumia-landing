'use client'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import {
    ArrowLeft,
    Copy,
    CheckCircle,
    XCircle,
    User,
    CreditCard,
    Building,
    Calendar,
    Hash,
    FileText,
    Phone,
    Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/usePermission';

interface SettlementDetails {
    id: number;
    tranRefNo: string;
    sourceAccount: string;
    accountNo: string;
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

const getStatusColor = (status: string): string => {
    const statusUpper = status?.toUpperCase() || '';
    if (statusUpper === 'SUCCESSFUL' || statusUpper === 'SUCCESS') return 'bg-accent text-white';
    if (statusUpper === 'PENDING' || statusUpper === 'PROCESSING') return 'bg-amber-500 text-white';
    if (statusUpper === 'FAILED') return 'bg-red-500 text-white';
    return 'bg-gray-500 text-white';
};

const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return dateString;
};

const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount || 0);
};

const InfoRow = ({ label, value, copyable = false, icon }: { label: string; value: string | number | null; copyable?: boolean; icon?: React.ReactNode }) => {
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
        <div className="flex justify-between items-start py-3 border-b border-accent/10 last:border-0">
            <div className="flex items-center gap-2">
                {icon && <span className="text-accent-foreground/50">{icon}</span>}
                <span className="text-sm text-accent-foreground/70">{label}</span>
            </div>
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

const SectionCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <Card className="border-accent/20 shadow-sm">
        <CardHeader className="border-b border-accent/10">
            <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
                {icon}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
            {children}
        </CardContent>
    </Card>
);

export default function SettlementDetailsPage() {
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('MANAGE_SETTLEMENTS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage settlements"
    });

    const router = useRouter();
    const settlementRef = window.location.pathname.split('/').pop();

    const { data: settlement, isLoading, error } = useQuery({
        queryKey: ['settlement-details', settlementRef],
        queryFn: async () => {
            const response = await axiosOperations.get(`/transactionmanager/${settlementRef}`);
            return response.data as SettlementDetails;
        },
        enabled: !!settlementRef,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                    <p className="mt-2 text-accent-foreground/70">Loading settlement details...</p>
                </div>
            </div>
        );
    }

    if (error || !settlement) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-accent-foreground mb-2">Settlement not found</h2>
                    <Button
                        onClick={() => router.back()}
                        className="bg-accent hover:bg-accent/90 text-white"
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6 max-w-7xl">
                <div className='mb-4'>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </div>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-accent-foreground mb-2">
                                Settlement Details
                            </h1>
                            <div className="flex items-center gap-3">
                                <p className="text-sm font-mono text-accent-foreground/70">
                                    {settlement.tranRefNo}
                                </p>
                                <Badge className={`${getStatusColor(settlement.status)} text-xs px-2 py-1`}>
                                    {settlement.status || 'UNKNOWN'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <Card className="border-accent/20 shadow-sm mb-6">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <p className="text-sm text-accent-foreground/70 mb-1">Amount</p>
                                <p className="text-2xl font-bold text-green-700">
                                    {formatCurrency(settlement.amount, settlement.currencyCode)}
                                </p>
                                {settlement.charge > 0 && (
                                    <p className="text-xs text-accent-foreground/60 mt-1">
                                        Charge: {formatCurrency(settlement.charge, settlement.currencyCode)}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-accent-foreground/70 mb-1">Transaction Type</p>
                                <p className="text-lg font-semibold text-accent-foreground">{settlement.tranType || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-accent-foreground/70 mb-1">Date & Time</p>
                                <p className="text-lg font-semibold text-accent-foreground">{settlement.tranDate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-accent-foreground/70 mb-1">Response</p>
                                <p className="text-lg font-semibold text-accent-foreground">{settlement.responseMessage || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SectionCard title="Transaction Information" icon={<CreditCard className="w-5 h-5" />}>
                        <InfoRow label="Transaction Ref No" value={settlement.tranRefNo} copyable icon={<Hash className="w-4 h-4" />} />
                        <InfoRow label="Transaction Code" value={settlement.tranCode} icon={<Hash className="w-4 h-4" />} />
                        <InfoRow label="Transaction Type" value={settlement.tranType} />
                        <InfoRow label="Narration" value={settlement.narration} icon={<FileText className="w-4 h-4" />} />
                        <InfoRow label="Amount" value={formatCurrency(settlement.amount, settlement.currencyCode)} />
                        <InfoRow label="Charge" value={formatCurrency(settlement.charge, settlement.currencyCode)} />
                        <InfoRow label="Currency" value={settlement.currencyCode} />
                        <InfoRow label="Response Code" value={settlement.responseCode} />
                        <InfoRow label="Response Message" value={settlement.responseMessage} />
                        <InfoRow label="Status" value={settlement.status} />
                        <InfoRow label="CR/DR" value={settlement.crDr} />
                    </SectionCard>

                    <SectionCard title="Source Information" icon={<User className="w-5 h-5" />}>
                        <InfoRow label="Source Account" value={settlement.sourceAccount} copyable icon={<Building className="w-4 h-4" />} />
                        <InfoRow label="Account No" value={settlement.accountNo} copyable />
                        {settlement.senderName && <InfoRow label="Sender Name" value={settlement.senderName} />}
                        {settlement.senderMobile && <InfoRow label="Sender Mobile" value={settlement.senderMobile} copyable icon={<Phone className="w-4 h-4" />} />}
                        <InfoRow label="Created By" value={settlement.createdBy} icon={<Mail className="w-4 h-4" />} />
                        <InfoRow label="Created Date" value={settlement.createdDate} icon={<Calendar className="w-4 h-4" />} />
                    </SectionCard>

                    {(settlement.beneficiaryName || settlement.beneficiaryAccount || settlement.beneficiaryBankCode) && (
                        <SectionCard title="Beneficiary Information" icon={<User className="w-5 h-5" />}>
                            {settlement.beneficiaryName && <InfoRow label="Beneficiary Name" value={settlement.beneficiaryName} />}
                            {settlement.beneficiaryMobile && <InfoRow label="Beneficiary Mobile" value={settlement.beneficiaryMobile} copyable icon={<Phone className="w-4 h-4" />} />}
                            {settlement.beneficiaryAccount && <InfoRow label="Beneficiary Account" value={settlement.beneficiaryAccount} copyable />}
                            {settlement.beneficiaryBankCode && <InfoRow label="Bank Code" value={settlement.beneficiaryBankCode} />}
                            {settlement.bankName && <InfoRow label="Bank Name" value={settlement.bankName} />}
                        </SectionCard>
                    )}

                    <SectionCard title="Payment & Commission" icon={<CreditCard className="w-5 h-5" />}>
                        {settlement.paymentMethod && <InfoRow label="Payment Method" value={settlement.paymentMethod} />}
                        {settlement.paymentRefNo && <InfoRow label="Payment Ref No" value={settlement.paymentRefNo} copyable />}
                        {settlement.externalRefNo && <InfoRow label="External Ref No" value={settlement.externalRefNo} copyable />}
                        {settlement.oldRef && <InfoRow label="Old Reference" value={settlement.oldRef} copyable />}
                        {settlement.provider && <InfoRow label="Provider" value={settlement.provider} />}
                        {settlement.agentCommission > 0 && <InfoRow label="Agent Commission" value={formatCurrency(settlement.agentCommission)} />}
                        {settlement.networkCommission > 0 && <InfoRow label="Network Commission" value={formatCurrency(settlement.networkCommission)} />}
                        {settlement.bankCommission > 0 && <InfoRow label="Bank Commission" value={formatCurrency(settlement.bankCommission)} />}
                        {settlement.serviceProviderCommission > 0 && <InfoRow label="Service Provider Commission" value={formatCurrency(settlement.serviceProviderCommission)} />}
                        {settlement.platformCommission > 0 && <InfoRow label="Platform Commission" value={formatCurrency(settlement.platformCommission)} />}
                        {settlement.aggregatorCommission > 0 && <InfoRow label="Aggregator Commission" value={formatCurrency(settlement.aggregatorCommission)} />}
                    </SectionCard>

                    {(settlement.terminalId || settlement.rrn || settlement.stan || settlement.cardNo) && (
                        <SectionCard title="Additional Details" icon={<Hash className="w-5 h-5" />}>
                            {settlement.terminalId && <InfoRow label="Device ID" value={settlement.terminalId} copyable />}
                            {settlement.rrn && <InfoRow label="RRN" value={settlement.rrn} copyable />}
                            {settlement.stan && <InfoRow label="STAN" value={settlement.stan} copyable />}
                            {settlement.cardNo && <InfoRow label="Card Number" value={settlement.cardNo ? `****${settlement.cardNo.slice(-4)}` : 'N/A'} />}
                        </SectionCard>
                    )}
                </div>
            </div>
        </div>
    );
}