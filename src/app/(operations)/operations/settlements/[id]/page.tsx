// 'use client'
// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { useRouter } from 'next/navigation';
// import { useQuery } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import {
//     ArrowLeft,
//     Copy,
//     CheckCircle,
//     XCircle,
//     User,
//     CreditCard,
//     Building,
//     Calendar,
//     Hash,
//     FileText,
//     Phone,
//     Mail
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { usePermission } from '@/hooks/usePermission';

// interface SettlementDetails {
//     id: number;
//     tranRefNo: string;
//     sourceAccount: string;
//     accountNo: string;
//     senderName: string;
//     senderMobile: string;
//     beneficiaryName: string;
//     beneficiaryMobile: string | null;
//     beneficiaryBankCode: string;
//     beneficiaryAccount: string;
//     tranCode: string;
//     tranType: string;
//     amount: number;
//     charge: number;
//     currencyCode: string;
//     stampDutyFee: number;
//     tax: number;
//     subTotal: number;
//     tranDate: string;
//     narration: string;
//     paymentMethod: string | null;
//     terminalId: string | null;
//     responseCode: string;
//     responseMessage: string;
//     paymentRefNo: string | null;
//     externalRefNo: string | null;
//     rrn: string | null;
//     stan: string | null;
//     cardNo: string;
//     agentCommission: number;
//     networkCommission: number;
//     bankCommission: number;
//     serviceProviderCommission: number;
//     platformCommission: number;
//     aggregatorCommission: number;
//     status: string;
//     createdBy: string;
//     createdDate: string;
//     crDr: string;
//     paymentResponseCode: string;
//     paymentResponseMessage: string | null;
//     provider: string;
//     oldRef: string;
//     bankName: string;
// }

// const getStatusColor = (status: string): string => {
//     const statusUpper = status?.toUpperCase() || '';
//     if (statusUpper === 'SUCCESSFUL' || statusUpper === 'SUCCESS') return 'bg-accent text-white';
//     if (statusUpper === 'PENDING' || statusUpper === 'PROCESSING') return 'bg-amber-500 text-white';
//     if (statusUpper === 'FAILED') return 'bg-red-500 text-white';
//     return 'bg-gray-500 text-white';
// };

// const formatDate = (dateString: string): string => {
//     if (!dateString) return 'N/A';
//     return dateString;
// };

// const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
//     return new Intl.NumberFormat('en-NG', {
//         style: 'currency',
//         currency: currency,
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//     }).format(amount || 0);
// };

// const InfoRow = ({ label, value, copyable = false, icon }: { label: string; value: string | number | null; copyable?: boolean; icon?: React.ReactNode }) => {
//     const [copied, setCopied] = useState(false);
//     const displayValue = value?.toString() || 'N/A';

//     const handleCopy = () => {
//         if (displayValue === 'N/A') return;
//         navigator.clipboard.writeText(displayValue);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//         toast.success('Copied to clipboard');
//     };

//     return (
//         <div className="flex justify-between items-start py-3 border-b border-accent/10 last:border-0">
//             <div className="flex items-center gap-2">
//                 {icon && <span className="text-accent-foreground/50">{icon}</span>}
//                 <span className="text-sm text-accent-foreground/70">{label}</span>
//             </div>
//             <div className="flex items-center gap-2 max-w-[60%]">
//                 <span className="text-sm font-medium text-accent-foreground text-right break-words">
//                     {displayValue}
//                 </span>
//                 {copyable && displayValue !== 'N/A' && (
//                     <button
//                         onClick={handleCopy}
//                         className="text-accent hover:text-accent/70 transition-colors flex-shrink-0"
//                         title="Copy to clipboard"
//                     >
//                         {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// };

// const SectionCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
//     <Card className="border-accent/20 shadow-sm">
//         <CardHeader className="border-b border-accent/10">
//             <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
//                 {icon}
//                 {title}
//             </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//             {children}
//         </CardContent>
//     </Card>
// );

// export default function SettlementDetailsPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('MANAGE_SETTLEMENTS', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to manage settlements"
//     });

//     const router = useRouter();
//     const settlementRef = window.location.pathname.split('/').pop();

//     const { data: settlement, isLoading, error } = useQuery({
//         queryKey: ['settlement-details', settlementRef],
//         queryFn: async () => {
//             const response = await axiosOperations.get(`/transactionmanager/${settlementRef}`);
//             return response.data as SettlementDetails;
//         },
//         enabled: !!settlementRef,
//     });

//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-white flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
//                     <p className="mt-2 text-accent-foreground/70">Loading settlement details...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error || !settlement) {
//         return (
//             <div className="min-h-screen bg-white flex items-center justify-center">
//                 <div className="text-center">
//                     <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//                     <h2 className="text-2xl font-bold text-accent-foreground mb-2">Settlement not found</h2>
//                     <Button
//                         onClick={() => router.back()}
//                         className="bg-accent hover:bg-accent/90 text-white"
//                     >
//                         Go Back
//                     </Button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-white">
//             <div className="container mx-auto p-6 max-w-7xl">
//                 <div className='mb-4'>
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => router.back()}
//                     >
//                         <ArrowLeft className="h-4 w-4 mr-2" />
//                         Back
//                     </Button>
//                 </div>
//                 <div className="flex items-center justify-between mb-8">
//                     <div className="flex items-center gap-4">
//                         <div>
//                             <h1 className="text-3xl font-bold text-accent-foreground mb-2">
//                                 Settlement Details
//                             </h1>
//                             <div className="flex items-center gap-3">
//                                 <p className="text-sm font-mono text-accent-foreground/70">
//                                     {settlement.tranRefNo}
//                                 </p>
//                                 <Badge className={`${getStatusColor(settlement.status)} text-xs px-2 py-1`}>
//                                     {settlement.status || 'UNKNOWN'}
//                                 </Badge>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <Card className="border-accent/20 shadow-sm mb-6">
//                     <CardContent className="p-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                             <div>
//                                 <p className="text-sm text-accent-foreground/70 mb-1">Amount</p>
//                                 <p className="text-2xl font-bold text-green-700">
//                                     {formatCurrency(settlement.amount, settlement.currencyCode)}
//                                 </p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-accent-foreground/70 mb-1">Transaction Type</p>
//                                 <p className="text-lg font-semibold text-accent-foreground">{settlement.tranType || 'N/A'}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-accent-foreground/70 mb-1">Date & Time</p>
//                                 <p className="text-lg font-semibold text-accent-foreground">{settlement.tranDate}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-accent-foreground/70 mb-1">Response</p>
//                                 <p className="text-lg font-semibold text-accent-foreground">{settlement.responseMessage || 'N/A'}</p>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <SectionCard title="Transaction Information" icon={<CreditCard className="w-5 h-5" />}>
//                         <InfoRow label="Transaction Ref No" value={settlement.tranRefNo} copyable icon={<Hash className="w-4 h-4" />} />
//                         <InfoRow label="Transaction Code" value={settlement.tranCode} icon={<Hash className="w-4 h-4" />} />
//                         <InfoRow label="Transaction Type" value={settlement.tranType} />
//                         <InfoRow label="Narration" value={settlement.narration} icon={<FileText className="w-4 h-4" />} />
//                         <InfoRow label="Amount" value={formatCurrency(settlement.amount, settlement.currencyCode)} />
//                         <InfoRow label="Subtotal" value={formatCurrency(settlement.subTotal, settlement.currencyCode)} />
//                         <InfoRow label="Stamp Duty" value={formatCurrency(settlement.stampDutyFee, settlement.currencyCode)} />
//                         <InfoRow label="Tax" value={formatCurrency(settlement.tax, settlement.currencyCode)} />
//                         <InfoRow label="Currency" value={settlement.currencyCode} />
//                         <InfoRow label="Response Code" value={settlement.responseCode} />
//                         <InfoRow label="Response Message" value={settlement.responseMessage} />
//                         <InfoRow label="Status" value={settlement.status} />
//                         <InfoRow label="CR/DR" value={settlement.crDr} />
//                     </SectionCard>

//                     {(settlement.beneficiaryName || settlement.beneficiaryAccount || settlement.beneficiaryBankCode) && (
//                         <SectionCard title="Beneficiary Information" icon={<User className="w-5 h-5" />}>
//                             {settlement.beneficiaryName && <InfoRow label="Beneficiary Name" value={settlement.beneficiaryName} />}
//                             {settlement.beneficiaryMobile && <InfoRow label="Beneficiary Mobile" value={settlement.beneficiaryMobile} copyable icon={<Phone className="w-4 h-4" />} />}
//                             {settlement.beneficiaryAccount && <InfoRow label="Beneficiary Account" value={settlement.beneficiaryAccount} copyable />}
//                             {settlement.beneficiaryBankCode && <InfoRow label="Bank Code" value={settlement.beneficiaryBankCode} />}
//                             {settlement.bankName && <InfoRow label="Bank Name" value={settlement.bankName} />}
//                         </SectionCard>
//                     )}

//                     <SectionCard title="Source Information" icon={<User className="w-5 h-5" />}>
//                         <InfoRow label="Created By" value={settlement.createdBy} icon={<Mail className="w-4 h-4" />} />
//                         <InfoRow label="Created Date" value={settlement.createdDate} icon={<Calendar className="w-4 h-4" />} />
//                     </SectionCard>

//                     <SectionCard title="Payment & Commission" icon={<CreditCard className="w-5 h-5" />}>
//                         {settlement.paymentMethod && <InfoRow label="Payment Method" value={settlement.paymentMethod} />}
//                         {settlement.paymentRefNo && <InfoRow label="Payment Ref No" value={settlement.paymentRefNo} copyable />}
//                         {settlement.externalRefNo && <InfoRow label="External Ref No" value={settlement.externalRefNo} copyable />}
//                         {settlement.oldRef && <InfoRow label="Old Reference" value={settlement.oldRef} copyable />}
//                         {settlement.provider && <InfoRow label="Provider" value={settlement.provider} />}
//                         {settlement.networkCommission > 0 && <InfoRow label="Network Commission" value={formatCurrency(settlement.networkCommission)} />}
//                         {settlement.bankCommission > 0 && <InfoRow label="Bank Commission" value={formatCurrency(settlement.bankCommission)} />}
//                         {settlement.serviceProviderCommission > 0 && <InfoRow label="Service Provider Commission" value={formatCurrency(settlement.serviceProviderCommission)} />}
//                         {settlement.platformCommission > 0 && <InfoRow label="Platform Commission" value={formatCurrency(settlement.platformCommission)} />}
//                         {settlement.aggregatorCommission > 0 && <InfoRow label="Aggregator Commission" value={formatCurrency(settlement.aggregatorCommission)} />}
//                     </SectionCard>

//                     {(settlement.terminalId || settlement.rrn || settlement.stan || settlement.cardNo) && (
//                         <SectionCard title="Additional Details" icon={<Hash className="w-5 h-5" />}>
//                             {settlement.terminalId && <InfoRow label="Device ID" value={settlement.terminalId} copyable />}
//                             {settlement.rrn && <InfoRow label="RRN" value={settlement.rrn} copyable />}
//                             {settlement.stan && <InfoRow label="STAN" value={settlement.stan} copyable />}
//                             {settlement.cardNo && <InfoRow label="Card Number" value={settlement.cardNo ? `****${settlement.cardNo.slice(-4)}` : 'N/A'} />}
//                         </SectionCard>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }


'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { ArrowLeft, Loader2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';

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

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'SUCCESSFUL': case 'SUCCESS': return 'bg-green-100 text-green-700 border-green-200';
        case 'PENDING': case 'PROCESSING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'FAILED': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
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
                    <button onClick={handleCopy} className="text-orange-500 hover:text-orange-600 shrink-0" title="Copy">
                        {copied ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.6654 8.59999V11.4C10.6654 13.7333 9.73203 14.6667 7.3987 14.6667H4.5987C2.26536 14.6667 1.33203 13.7333 1.33203 11.4V8.59999C1.33203 6.26666 2.26536 5.33333 4.5987 5.33333H7.3987C9.73203 5.33333 10.6654 6.26666 10.6654 8.59999Z" fill="#F56B08" stroke="#F56B08" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M14.6654 4.59999V7.39999C14.6654 9.73333 13.732 10.6667 11.3987 10.6667H10.6654V8.59999C10.6654 6.26666 9.73203 5.33333 7.3987 5.33333H5.33203V4.59999C5.33203 2.26666 6.26536 1.33333 8.5987 1.33333H11.3987C13.732 1.33333 14.6654 2.26666 14.6654 4.59999Z" stroke="#F56B08" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        )}
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

export default function SettlementDetailsPage() {
    usePageMetadata('Settlement Details', 'View settlement transaction details.');
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-medium-gray">Loading settlement details...</p>
                </div>
            </div>
        );
    }

    if (error || !settlement) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <XCircle className="w-12 h-12 text-red-400" />
                <p className="text-dark-gray font-semibold">Settlement not found</p>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const ccy = settlement.currencyCode || 'NGN';

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="mb-4 px-2 pt-4">
                    <Button variant="link" onClick={() => router.push('/operations/settlements')}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </div>

                <div className='px-2 pb-6'>
                    {/* <div className="mb-6">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">Settlement Details</h1>
                    </div> */}

                    <div className="bg-white rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#F5F5F5]">
                            <div>
                                <p className="text-sm font-bold text-dark-gray">{formatPrice(settlement.amount, ccy as CurrencyCode)}</p>
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
                                <Field label="Amount" value={formatPrice(settlement.amount, ccy as CurrencyCode)} highlight />
                                <Field label="Subtotal" value={formatPrice(settlement.subTotal, ccy as CurrencyCode)} />
                                <Field label="Charge" value={formatPrice(settlement.charge, ccy as CurrencyCode)} />
                                <Field label="Stamp Duty" value={formatPrice(settlement.stampDutyFee, ccy as CurrencyCode)} />
                                <Field label="Tax" value={formatPrice(settlement.tax, ccy as CurrencyCode)} />
                                <Field label="Currency" value={settlement.currencyCode || 'NGN'} />
                                <Field label="Response Code" value={settlement.responseCode} />
                                <Field label="Response Message" value={settlement.responseMessage} />
                            </SectionCard>

                            <SectionCard title="Commission Breakdown">
                                <Field label="Agent Commission" value={formatPrice(settlement.agentCommission, ccy as CurrencyCode)} />
                                <Field label="Network Commission" value={formatPrice(settlement.networkCommission, ccy as CurrencyCode)} />
                                <Field label="Bank Commission" value={formatPrice(settlement.bankCommission, ccy as CurrencyCode)} />
                                <Field label="Service Provider" value={formatPrice(settlement.serviceProviderCommission, ccy as CurrencyCode)} />
                                <Field label="Platform Commission" value={formatPrice(settlement.platformCommission, ccy as CurrencyCode)} />
                                <Field label="Aggregator Commission" value={formatPrice(settlement.aggregatorCommission, ccy as CurrencyCode)} />
                            </SectionCard>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {settlement.beneficiaryName && (
                                <SectionCard title="Beneficiary Information">
                                    <Field label="Name" value={settlement.beneficiaryName} />
                                    <Field label="Mobile" value={settlement.beneficiaryMobile || ''} />
                                    <Field label="Account" value={settlement.beneficiaryAccount} copyable />
                                    <Field label="Bank Code" value={settlement.beneficiaryBankCode} />
                                    <Field label="Bank Name" value={settlement.bankName} />
                                </SectionCard>
                            )}

                            <SectionCard title="Source Information">
                                <Field label="Created By" value={settlement.createdBy} />
                                <Field label="Created Date" value={settlement.createdDate} />
                                <Field label="Source Account" value={settlement.sourceAccount} copyable />
                                <Field label="Sender Name" value={settlement.senderName} />
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
            </div>
        </div>
    );
}