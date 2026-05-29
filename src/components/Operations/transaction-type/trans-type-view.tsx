// 'use client'
// import React, { useState } from 'react';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
// } from '@/components/ui/dialog';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Copy, CheckCircle, XCircle } from 'lucide-react';
// import { toast } from 'sonner';

// interface TransactionType {
//     id: number;
//     entityCode: string;
//     customerType: string;
//     tranCode: string;
//     tranName: string;
//     maxLimit: number;
//     dailyLimit: number;
//     monthlyLimit: number | null;
//     dailyFreq: number;
//     status: string;
//     agentCommission: number;
//     platformCommission: number;
//     networkCommission: number;
//     bankCommission: number;
//     aggregatorCommission: number;
//     serviceFee: number;
//     groupCommission: null | number;
//     charge: number;
//     chargeType: string;
//     otherCharge: number;
//     tranChannel: string;
//     roleAllowed: null | string;
//     minLimit: number;
//     sharingType: string;
//     glCodeCommission: string | null;
//     glCode: string | null;
//     branchCode: string;
//     tax: number;
//     setupRefNo: string;
//     minHardTokenLimit: number;
//     maxHardTokenLimit: number;
//     dailyHardTokenLimit: number;
//     capLimit: number;
// }

// interface TransactionTypeViewModalProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     transaction: TransactionType | null;
// }

// const getStatusColor = (status: string): string => {
//     const statusUpper = status?.toUpperCase() || '';
//     if (statusUpper === 'ACTIVE') return 'bg-accent text-white';
//     if (statusUpper === 'INACTIVE') return 'bg-red-500 text-white';
//     return 'bg-gray-500 text-white';
// };

// const formatCurrency = (amount: number): string => {
//     return new Intl.NumberFormat('en-NG', {
//         style: 'currency',
//         currency: 'NGN',
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//     }).format(amount || 0);
// };

// const formatNumber = (value: number): string => {
//     return new Intl.NumberFormat('en-NG').format(value || 0);
// };

// const InfoRow = ({ label, value, copyable = false }: { label: string; value: string | number | null; copyable?: boolean }) => {
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
//         <div className="flex justify-between items-start py-2 border-b border-accent/10 last:border-0">
//             <span className="text-sm text-accent-foreground/70">{label}</span>
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

// const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
//     <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
//         <h3 className="text-md font-semibold text-accent-foreground mb-3">{title}</h3>
//         <div className="space-y-1">
//             {children}
//         </div>
//     </div>
// );

// export default function TransactionTypeViewModal({
//     open,
//     onOpenChange,
//     transaction,
// }: TransactionTypeViewModalProps) {
//     if (!transaction) return null;

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent
//                 className="max-w-5xl max-h-[85vh] overflow-y-auto"
//                 style={{
//                     scrollbarWidth: 'none',
//                     scrollbarColor: 'transparent',
//                 }}
//             >
//                 <DialogHeader className="flex flex-col">
//                     <DialogTitle className="text-accent-foreground flex items-center gap-4">
//                         <span>Transaction Type Details</span>
//                         <Badge className={`${getStatusColor(transaction.status)} text-xs px-2 py-1`}>
//                             {transaction.status || 'UNKNOWN'}
//                         </Badge>
//                     </DialogTitle>
//                 </DialogHeader>

//                 <div className="py-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
//                         <div>
//                             <p className="text-xs text-accent-foreground/70">Transaction Code</p>
//                             <p className="text-lg font-bold text-accent-foreground font-mono">
//                                 {transaction.tranCode}
//                             </p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-accent-foreground/70">Transaction Name</p>
//                             <p className="text-lg font-semibold text-accent-foreground">
//                                 {transaction.tranName}
//                             </p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-accent-foreground/70">Branch Code</p>
//                             <p className="text-md font-semibold text-accent-foreground">
//                                 {transaction.branchCode || 'N/A'}
//                             </p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-accent-foreground/70">Customer Type</p>
//                             <p className="text-md font-semibold text-accent-foreground">
//                                 {transaction.customerType}
//                             </p>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <SectionCard title="Limit Information">
//                             <InfoRow label="Minimum Limit" value={formatCurrency(transaction.minLimit)} />
//                             <InfoRow label="Maximum Limit" value={formatCurrency(transaction.maxLimit)} />
//                             <InfoRow label="Daily Limit" value={formatCurrency(transaction.dailyLimit)} />
//                             {transaction.monthlyLimit && (
//                                 <InfoRow label="Monthly Limit" value={formatCurrency(transaction.monthlyLimit)} />
//                             )}
//                             <InfoRow label="Daily Frequency" value={formatNumber(transaction.dailyFreq)} />
//                             <InfoRow label="Cap Limit" value={formatCurrency(transaction.capLimit)} />
//                             <InfoRow label="Min Hard Token Limit" value={formatCurrency(transaction.minHardTokenLimit)} />
//                             <InfoRow label="Max Hard Token Limit" value={formatCurrency(transaction.maxHardTokenLimit)} />
//                             <InfoRow label="Daily Hard Token Limit" value={formatCurrency(transaction.dailyHardTokenLimit)} />
//                         </SectionCard>

//                         <SectionCard title="Commission Information">
//                             <InfoRow label="Agent Commission" value={`${formatCurrency(transaction.agentCommission)}`} />
//                             <InfoRow label="Platform Commission" value={`${formatCurrency(transaction.platformCommission)}`} />
//                             <InfoRow label="Network Commission" value={`${formatCurrency(transaction.networkCommission)}`} />
//                             <InfoRow label="Bank Commission" value={`${formatCurrency(transaction.bankCommission)}`} />
//                             <InfoRow label="Aggregator Commission" value={`${formatCurrency(transaction.aggregatorCommission)}`} />
//                             {transaction.groupCommission && (
//                                 <InfoRow label="Group Commission" value={`${formatCurrency(transaction.groupCommission)}`} />
//                             )}
//                             <InfoRow label="Service Fee" value={`${formatCurrency(transaction.serviceFee)}`} />
//                             <InfoRow label="Tax" value={`${formatCurrency(transaction.tax)}`} />
//                         </SectionCard>

//                         <SectionCard title="Charge Information">
//                             <InfoRow label="Charge Type" value={transaction.chargeType} />
//                             <InfoRow label="Charge" value={`${formatCurrency(transaction.charge)}`} />
//                             <InfoRow label="Other Charge" value={`${formatCurrency(transaction.otherCharge)}`} />
//                             <InfoRow label="Sharing Type" value={transaction.sharingType} />
//                             {transaction.glCodeCommission && (
//                                 <InfoRow label="GL Code Commission" value={transaction.glCodeCommission} copyable />
//                             )}
//                             {transaction.glCode && (
//                                 <InfoRow label="GL Code" value={transaction.glCode} copyable />
//                             )}
//                         </SectionCard>

//                         <SectionCard title="Additional Information">
//                             <InfoRow label="Transaction Channel" value={transaction.tranChannel} />
//                             <InfoRow label="Entity Code" value={transaction.entityCode} copyable />
//                             <InfoRow label="Setup Reference No" value={transaction.setupRefNo} copyable />
//                             {transaction.roleAllowed && (
//                                 <InfoRow label="Role Allowed" value={transaction.roleAllowed} />
//                             )}
//                             <InfoRow label="ID" value={transaction.id.toString()} copyable />
//                         </SectionCard>
//                     </div>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }

'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle } from 'lucide-react';
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

const Field = ({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        if (!value || value === 'N/A') return;
        navigator.clipboard.writeText(value);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
        toast.success('Copied to clipboard');
    };
    return (
        <div className="space-y-0.5">
            <p className="text-xs text-medium-gray">{label}</p>
            <div className="flex items-center gap-1.5">
                <p className="text-xs truncate font-semibold text-dark-gray">{value || 'N/A'}</p>
                {copyable && value && value !== 'N/A' && (
                    <button onClick={handleCopy} className="text-orange-500 hover:text-orange-600 shrink-0">
                        {copied ? <CheckCircle className="w-3 h-3" /> : <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.6654 8.59999V11.4C10.6654 13.7333 9.73203 14.6667 7.3987 14.6667H4.5987C2.26536 14.6667 1.33203 13.7333 1.33203 11.4V8.59999C1.33203 6.26666 2.26536 5.33333 4.5987 5.33333H7.3987C9.73203 5.33333 10.6654 6.26666 10.6654 8.59999Z" fill="#F56B08" stroke="#F56B08" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M14.6654 4.59999V7.39999C14.6654 9.73333 13.732 10.6667 11.3987 10.6667H10.6654V8.59999C10.6654 6.26666 9.73203 5.33333 7.3987 5.33333H5.33203V4.59999C5.33203 2.26666 6.26536 1.33333 8.5987 1.33333H11.3987C13.732 1.33333 14.6654 2.26666 14.6654 4.59999Z" stroke="#F56B08" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>}
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

export default function TransactionTypeViewModal({ open, onOpenChange, transaction }: TransactionTypeViewModalProps) {
    if (!transaction) return null;

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount || 0);
    const getStatusColor = (status: string) => {
        if (status?.toUpperCase() === 'ACTIVE') return 'bg-green-100 text-green-700 border-green-200';
        return 'bg-red-100 text-red-700 border-red-200';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[100vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                <DialogTitle className="sr-only">Transaction Type Details</DialogTitle>

                <div className="px-6 pt-5 pb-4">
                    <h2 className="text-base font-semibold text-dark-gray mb-4">Transaction Type Details</h2>

                    <div className="bg-white rounded-2xl p-4 mb-4">
                        <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-[#F5F5F5]">
                            <div>
                                <p className="text-sm font-bold text-dark-gray">{transaction.tranCode}</p>
                                <p className='text-xs text-medium-gray'>{transaction.tranName}</p>
                            </div>
                            <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full ${getStatusColor(transaction.status)}`}>{transaction.status}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-x-6">
                            <Field label="Transaction Name" value={transaction.tranName} />
                            <Field label="Branch Code" value={transaction.branchCode} />
                            <Field label="Customer Type" value={transaction.customerType} />
                            <Field label="Charge Type" value={transaction.chargeType} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SectionCard title="Limit Information">
                                <Field label="Minimum Limit" value={`₦${formatCurrency(transaction.minLimit)}`} />
                                <Field label="Maximum Limit" value={`₦${formatCurrency(transaction.maxLimit)}`} />
                                <Field label="Daily Limit" value={`₦${formatCurrency(transaction.dailyLimit)}`} />
                                <Field label="Daily Frequency" value={transaction.dailyFreq?.toString()} />
                                <Field label="Cap Limit" value={`₦${formatCurrency(transaction.capLimit)}`} />
                            </SectionCard>

                            <SectionCard title="Commission Information">
                                <Field label="Agent Commission" value={`₦${formatCurrency(transaction.agentCommission)}`} />
                                <Field label="Platform Commission" value={`₦${formatCurrency(transaction.platformCommission)}`} />
                                <Field label="Network Commission" value={`₦${formatCurrency(transaction.networkCommission)}`} />
                                <Field label="Aggregator Commission" value={`₦${formatCurrency(transaction.aggregatorCommission)}`} />
                                <Field label="Service Fee" value={`₦${formatCurrency(transaction.serviceFee)}`} />
                            </SectionCard>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SectionCard title="Charge Information">
                                <Field label="Charge Type" value={transaction.chargeType} />
                                <Field label="Charge" value={`₦${formatCurrency(transaction.charge)}`} />
                                <Field label="Sharing Type" value={transaction.sharingType} />
                            </SectionCard>

                            <SectionCard title="Additional Information">
                                <Field label="Transaction Channel" value={transaction.tranChannel} />
                                <Field label="Entity Code" value={transaction.entityCode} copyable />
                                <Field label="Setup Ref No." value={transaction.setupRefNo} copyable />
                                <Field label="ID" value={transaction.id?.toString()} copyable />
                            </SectionCard>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}