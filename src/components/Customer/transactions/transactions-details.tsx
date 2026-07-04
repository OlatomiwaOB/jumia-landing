// 'use client'
// import React from 'react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Clock } from 'lucide-react';
// import {
//     Dialog,
//     DialogContent,
//     DialogTitle,
// } from '@/components/ui/dialog';
// import { TransFlowIcon } from '@/components/icons/icons';

// export type TranType = 'inward' | 'outward' | 'pending';

// export interface TransactionDetail {
//     tranRefNo: string;
//     date: string;
//     name: string;
//     amount: number;
//     currency: string | null;
//     status: string;
//     fromAddress?: string;
//     [key: string]: any;
// }

// export interface TransactionDetailsModalProps {
//     transaction: TransactionDetail | null;
//     open: boolean;
//     onClose: () => void;
//     getTranType?: (transaction: TransactionDetail) => TranType;
//     extraDetails?: { label: string; value: string }[];
//     onShare?: (transaction: TransactionDetail) => void;
//     onDownload?: (transaction: TransactionDetail) => void;
// }

// const defaultGetTranType = (t: TransactionDetail): TranType => {
//     if (t.status?.toLowerCase() === 'pending') return 'pending';
//     const ref = t.tranRefNo?.toLowerCase() ?? '';
//     if (ref.startsWith('inft') || ref.startsWith('ibft') || ref.startsWith('rr')) return 'inward';
//     return 'outward';
// };

// const getStatusStyles = (type: TranType) => {
//     switch (type) {
//         case 'inward':
//             return {
//                 badge: 'bg-green-100 text-green-700 border-green-200',
//                 amount: 'text-gray-900',
//                 icon: 'bg-green-50 text-green-600',
//                 label: 'Credit',
//             };
//         case 'outward':
//             return {
//                 badge: 'bg-green-100 text-green-700 border-green-200',
//                 amount: 'text-gray-900',
//                 icon: 'bg-red-50 text-red-600',
//                 label: 'Debit',
//             };
//         case 'pending':
//             return {
//                 badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
//                 amount: 'text-gray-900',
//                 icon: 'bg-yellow-50 text-yellow-600',
//                 label: 'Pending',
//             };
//         default:
//             return {
//                 badge: 'bg-gray-100 text-gray-600 border-gray-200',
//                 amount: 'text-gray-900',
//                 icon: 'bg-gray-100 text-gray-500',
//                 label: 'Transaction',
//             };
//     }
// };

// const formatCurrency = (amount: number, currency: string | null): string => {
//     const symbol = currency || '₦';
//     return `${symbol}${Number(amount).toLocaleString('en-NG', {
//         minimumFractionDigits: 2,
//     })}`;
// };

// const getDisplayValue = (value: any): string => {
//     if (value === null || value === undefined || value === '') return 'N/A';
//     return value.toString();
// };

// const TranTypeIcon: React.FC<{ type: TranType; className?: string }> = ({
//     type,
//     className = 'w-5 h-5',
// }) => {
//     if (type === 'inward') return <TransFlowIcon className={className} />;
//     if (type === 'outward') return <TransFlowIcon className={`${className} rotate-180`} />;
//     return <Clock className={className} />;
// };

// export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
//     transaction,
//     open,
//     onClose,
//     getTranType = defaultGetTranType,
//     extraDetails = [],
//     onShare,
//     onDownload,
// }) => {
//     if (!transaction) return null;

//     const type = getTranType(transaction);
//     const styles = getStatusStyles(type);

//     const initials = transaction.name
//         ? transaction.name
//             .split(' ')
//             .map((n: string) => n[0])
//             .join('')
//             .slice(0, 2)
//             .toUpperCase()
//         : '??';

//     const defaultDetails = [
//         { label: 'Transaction ID', value: transaction.tranRefNo },
//         { label: 'Transaction Date', value: transaction.date },
//         {
//             label: 'Customer',
//             value: transaction.name,
//             avatar: initials,
//         },
//         {
//             label: 'Currency',
//             value: transaction.currency
//                 ? `${transaction.currency === 'NGN' ? 'Naira' : transaction.currency} (${transaction.currency})`
//                 : 'Naira (NGN)',
//         },
//     ];

//     const allDetails = [...defaultDetails, ...extraDetails];
//     const showFooter = !!onShare || !!onDownload;

//     return (
//         <Dialog open={open} onOpenChange={onClose}>
//             <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-xl bg-[#F5F5F5]">
//                 <DialogTitle className="sr-only">Transaction Details</DialogTitle>
//                 <div className="flex items-center justify-between px-5 pt-5 pb-4">
//                     <p className="text-base font-semibold text-dark-gray">Transaction Details</p>
//                 </div>

//                 <div className="mx-4 mb-4 rounded-2xl bg-white px-6 py-5 flex flex-col items-center gap-2">
//                     <div className={`flex items-center gap-1.5 text-sm font-medium ${styles.icon} px-3 py-1 rounded-full`}>
//                         <TranTypeIcon type={type} className="w-4 h-4" />
//                         <span>{styles.label}</span>
//                     </div>

//                     <p className="text-3xl font-bold text-dark-gray tracking-tight">
//                         {formatCurrency(transaction.amount, transaction.currency)}
//                     </p>

//                     <Badge
//                         className={`text-xs px-3 py-1 border rounded-full font-medium ${styles.badge}`}
//                     >
//                         {getDisplayValue(transaction.status)}
//                     </Badge>
//                 </div>

//                 <div className="mx-4 mb-4 rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
//                     {allDetails.map(({ label, value, avatar }: any) => (
//                         <div
//                             key={label}
//                             className="flex items-center justify-between px-4 py-3.5 bg-white"
//                         >
//                             <p className="text-sm text-gray-500 shrink-0 mr-4">{label}</p>
//                             <div className="flex items-center gap-2 text-right">
//                                 {avatar && (
//                                     <Avatar className="w-6 h-6 shrink-0">
//                                         <AvatarFallback className="bg-purple-600 text-white text-[10px] font-bold">
//                                             {avatar}
//                                         </AvatarFallback>
//                                     </Avatar>
//                                 )}
//                                 <p className="text-sm font-semibold text-gray-900 break-all">
//                                     {getDisplayValue(value)}
//                                 </p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {showFooter && (
//                     <div className='flex items-center justify-between w-full gap-3 px-4 py-5 bg-white'>
//                         <div>{''}</div>
//                         <div className="flex gap-3">
//                             {onShare && (
//                                 <Button
//                                     variant="outline"
//                                     size='sm'
//                                     onClick={() => onShare(transaction)}
//                                 >
//                                     Share Receipt
//                                 </Button>
//                             )}
//                             {onDownload && (
//                                 <Button
//                                     size='sm'
//                                     onClick={() => onDownload(transaction)}
//                                 >
//                                     Download Receipt
//                                 </Button>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default TransactionDetailsModal;

'use client'
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { TransFlowIcon } from '@/components/icons/icons';
import { useQuery } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';

export type TranType = 'inward' | 'outward' | 'pending';

export interface TransactionDetail {
    tranRefNo: string;
    date: string;
    name: string;
    amount: number;
    currency: string | null;
    status: string;
    fromAddress?: string;
    [key: string]: any;
}

export interface TransactionDetailsModalProps {
    transaction: TransactionDetail | null;
    open: boolean;
    onClose: () => void;
    getTranType?: (transaction: TransactionDetail) => TranType;
    extraDetails?: { label: string; value: string }[];
    onShare?: (transaction: TransactionDetail) => void;
    onDownload?: (transaction: TransactionDetail) => void;
}

interface TransactionDetailResponse {
    tranRefNo: string;
    sourceAccount: string;
    accountNo: string;
    senderName: string;
    senderMobile: string;
    sendBankCode: string;
    sendBankName: string;
    beneficiaryName: string;
    beneficiaryMobile: string;
    beneficiaryBankCode: string;
    beneficiaryAccount: string;
    tranCode: string;
    deviceId: string;
    tranType: string;
    amount: number;
    totalAmount: number;
    subTotal: number;
    charge: number;
    stampDutyFee: number;
    tax: number;
    currencyCode: string;
    tranDate: string;
    narration: string;
    paymentMethod: string;
    terminalId: string;
    merchantCode: string;
    responseCode: string;
    responseMessage: string;
    paymentRefNo: string;
    externalRefNo: string;
    rrn: string;
    stan: string;
    cardNo: string;
    agentCommission: number;
    networkCommission: number;
    bankCommission: number;
    serviceProviderCommission: number;
    platformCommission: number;
    aggregatorCommission: number;
    id: number;
    status: string;
    createdBy: string;
    createdDate: string;
    crDr: string;
    paymentResponseCode: string;
    paymentResponseMessage: string;
    provider: string;
    oldRef: string;
    sessionId: string;
    bankName: string;
    token: string;
    referenceNo: string;
    ccy: string;
    otherCommission: Array<{
        fieldName: string;
        fieldCode: string;
        fieldValue: string;
    }>;
    customerId: string;
    accountName: string;
    collectionTeller: string;
    customerRefNo: string;
    code: string;
    desc: string;
    printLines: string[];
    customerAddress: string;
}

const defaultGetTranType = (t: TransactionDetail): TranType => {
    if (t.status?.toLowerCase() === 'pending') return 'pending';
    const ref = t.tranRefNo?.toLowerCase() ?? '';
    if (ref.startsWith('inft') || ref.startsWith('ordset') || ref.startsWith('rr')) return 'inward';
    return 'outward';
};

const getStatusStyles = (type: TranType) => {
    switch (type) {
        case 'inward':
            return {
                badge: 'bg-green-100 text-green-700 border-green-200',
                amount: 'text-gray-900',
                icon: 'bg-green-50 text-green-600',
                label: 'Credit',
            };
        case 'outward':
            return {
                badge: 'bg-green-100 text-green-700 border-green-200',
                amount: 'text-gray-900',
                icon: 'bg-red-50 text-red-600',
                label: 'Debit',
            };
        case 'pending':
            return {
                badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                amount: 'text-gray-900',
                icon: 'bg-yellow-50 text-yellow-600',
                label: 'Pending',
            };
        default:
            return {
                badge: 'bg-gray-100 text-gray-600 border-gray-200',
                amount: 'text-gray-900',
                icon: 'bg-gray-100 text-gray-500',
                label: 'Transaction',
            };
    }
};

const formatCurrency = (amount: number, currency: string | null): string => {
    const symbol = currency || '₦';
    return `${symbol}${Number(amount).toLocaleString('en-NG', {
        minimumFractionDigits: 2,
    })}`;
};

const getDisplayValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'N/A';
    return value.toString();
};

const TranTypeIcon: React.FC<{ type: TranType; className?: string }> = ({
    type,
    className = 'w-5 h-5',
}) => {
    if (type === 'inward') return <TransFlowIcon className={className} />;
    if (type === 'outward') return <TransFlowIcon className={`${className} rotate-180`} />;
    return <Clock className={className} />;
};

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
    transaction,
    open,
    onClose,
    getTranType = defaultGetTranType,
    extraDetails = [],
    onShare,
    onDownload,
}) => {
    if (!transaction) return null;

    const type = getTranType(transaction);
    const styles = getStatusStyles(type);
    const isInft = transaction.tranRefNo?.toLowerCase()?.startsWith('inft');

    // Fetch detailed transaction info for inft transactions
    const { data: detailData, isLoading: isLoadingDetail } = useQuery({
        queryKey: ['transaction-detail', transaction.tranRefNo],
        queryFn: () => axiosCustomer.request({
            url: '/ecommerce/fetch-transaction-detail',
            method: 'GET',
            params: { tranRefNo: transaction.tranRefNo }
        }),
        enabled: open && isInft,
    });

    const detail: TransactionDetailResponse | null = detailData?.data || null;

    const initials = transaction.name
        ? transaction.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
        : '??';

    const defaultDetails = [
        { label: 'Transaction ID', value: transaction.tranRefNo },
        { label: 'Transaction Date', value: transaction.date },
        {
            label: 'Customer',
            value: transaction.name,
            avatar: initials,
        },
        // {
        //     label: 'Currency',
        //     value: transaction.currency
        //         ? `${transaction.currency === 'NGN' ? 'Naira' : transaction.currency} (${transaction.currency})`
        //         : 'Naira (NGN)',
        // },
    ];

    const allDetails = [...defaultDetails, ...extraDetails];
    const showFooter = !!onShare || !!onDownload;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-xl bg-[#F5F5F5] max-h-[90vh] overflow-y-auto"
                style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                <DialogTitle className="sr-only">Transaction Details</DialogTitle>
                <div className="flex items-center justify-between px-5 pt-5 pb-4">
                    <p className="text-base font-semibold text-dark-gray">Transaction Details</p>
                </div>

                <div className="mx-4 mb-4 rounded-2xl bg-white px-6 py-5 flex flex-col items-center gap-2">
                    {/* <div className={`flex items-center gap-1.5 text-sm font-medium ${styles.icon} px-3 py-1 rounded-full`}>
                        <TranTypeIcon type={type} className="w-4 h-4" />
                        <span>{styles.label}</span>
                    </div> */}

                    <p className="text-3xl font-bold text-dark-gray tracking-tight">
                        {formatPrice(transaction.amount, transaction.currency as CurrencyCode)}
                    </p>

                    <Badge
                        className={`text-xs px-3 py-1 border rounded-full font-medium ${styles.badge}`}
                    >
                        {getDisplayValue(transaction.status)}
                    </Badge>
                </div>

                {/* Basic Details */}
                <div className="mx-4 mb-4 rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                    {allDetails.map(({ label, value, avatar }: any) => (
                        <div
                            key={label}
                            className="flex items-center justify-between px-4 py-3.5 bg-white"
                        >
                            <p className="text-sm text-gray-500 shrink-0 mr-4">{label}</p>
                            <div className="flex items-center gap-2 text-right">
                                {avatar && (
                                    <Avatar className="w-6 h-6 shrink-0">
                                        <AvatarFallback className="bg-purple-600 text-white text-[10px] font-bold">
                                            {avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <p className="text-sm font-semibold text-gray-900 break-all">
                                    {getDisplayValue(value)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Extended Details for inft transactions */}
                {isInft && (
                    <>
                        {isLoadingDetail ? (
                            <div className="mx-4 mb-4 rounded-2xl bg-white p-6 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-faded-accent" />
                                <span className="text-sm text-medium-gray ml-2">Loading details...</span>
                            </div>
                        ) : detail ? (
                            <>
                                {/* Sender Details */}
                                <div className="mx-4 mb-4">
                                    <div className="rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                                        <div className="px-4 py-3 bg-gray-50">
                                            <p className="text-sm font-semibold text-dark-gray">Sender Details</p>
                                        </div>
                                        <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                            <p className="text-sm text-gray-500">Sender Name</p>
                                            <p className="text-sm font-semibold text-dark-gray">{getDisplayValue(detail.senderName)}</p>
                                        </div>
                                        {detail.senderMobile && (
                                            <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                                <p className="text-sm text-gray-500">Sender Mobile</p>
                                                <p className="text-sm font-semibold text-dark-gray">{getDisplayValue(detail.senderMobile)}</p>
                                            </div>
                                        )}
                                        {detail.sendBankName && (
                                            <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                                <p className="text-sm text-gray-500">Sender Bank</p>
                                                <p className="text-sm font-semibold text-dark-gray">{getDisplayValue(detail.sendBankName)}</p>
                                            </div>
                                        )}
                                        {detail.sourceAccount && (
                                            <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                                <p className="text-sm text-gray-500">Source Account</p>
                                                <p className="text-sm font-semibold text-dark-gray">{getDisplayValue(detail.sourceAccount)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Beneficiary Details */}
                                <div className="mx-4 mb-4">
                                    <div className="rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                                        <div className="px-4 py-3 bg-gray-50">
                                            <p className="text-sm font-semibold text-dark-gray">Beneficiary Details</p>
                                        </div>
                                        <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                            <p className="text-sm text-gray-500">Beneficiary Name</p>
                                            <p className="text-sm font-semibold text-dark-gray">{getDisplayValue(detail.beneficiaryName)}</p>
                                        </div>
                                        {detail.beneficiaryAccount && (
                                            <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                                <p className="text-sm text-gray-500">Beneficiary Account</p>
                                                <p className="text-sm font-semibold text-dark-gray">{getDisplayValue(detail.beneficiaryAccount)}</p>
                                            </div>
                                        )}
                                        {detail.beneficiaryBankCode && (
                                            <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                                <p className="text-sm text-gray-500">Beneficiary Bank Code</p>
                                                <p className="text-sm font-semibold text-dark-gray">{getDisplayValue(detail.beneficiaryBankCode)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Charges & Fees */}
                                <div className="mx-4 mb-4">
                                    <div className="rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                                        <div className="px-4 py-3 bg-gray-50">
                                            <p className="text-sm font-semibold text-dark-gray">Charges & Fees</p>
                                        </div>
                                        {detail.subTotal > 0 && (
                                            <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                                <p className="text-sm text-gray-500">Sub Total</p>
                                                <p className="text-sm font-semibold text-dark-gray">{formatCurrency(detail.subTotal, detail.currencyCode)}</p>
                                            </div>
                                        )}
                                        {detail.charge > 0 && (
                                            <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                                <p className="text-sm text-gray-500">Charge</p>
                                                <p className="text-sm font-semibold text-dark-gray">{formatCurrency(detail.charge, detail.currencyCode)}</p>
                                            </div>
                                        )}
                                        {detail.tax > 0 && (
                                            <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                                <p className="text-sm text-gray-500">Tax</p>
                                                <p className="text-sm font-semibold text-dark-gray">{formatCurrency(detail.tax, detail.currencyCode)}</p>
                                            </div>
                                        )}
                                        {detail.stampDutyFee > 0 && (
                                            <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                                <p className="text-sm text-gray-500">Stamp Duty</p>
                                                <p className="text-sm font-semibold text-dark-gray">{formatCurrency(detail.stampDutyFee, detail.currencyCode)}</p>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                            <p className="text-sm font-semibold text-gray-700">Total Amount</p>
                                            <p className="text-sm font-bold text-dark-gray">{formatCurrency(detail.totalAmount || detail.amount, detail.currencyCode)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                {(detail.paymentMethod || detail.narration || detail.paymentRefNo) && (
                                    <div className="mx-4 mb-4">
                                        <div className="rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                                            <div className="px-4 py-3 bg-gray-50">
                                                <p className="text-sm font-semibold text-dark-gray">Payment Information</p>
                                            </div>
                                            {detail.paymentMethod && (
                                                <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                                    <p className="text-sm text-gray-500">Payment Method</p>
                                                    <p className="text-sm font-semibold text-dark-gray">{getDisplayValue(detail.paymentMethod)}</p>
                                                </div>
                                            )}
                                            {detail.narration && (
                                                <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                                    <p className="text-sm text-gray-500">Narration</p>
                                                    <p className="text-sm font-semibold text-dark-gray">{getDisplayValue(detail.narration)}</p>
                                                </div>
                                            )}
                                            {detail.paymentRefNo && (
                                                <div className="flex items-center justify-between px-4 py-3.5 bg-white">
                                                    <p className="text-sm text-gray-500">Payment Ref</p>
                                                    <p className="text-sm font-semibold text-dark-gray">{getDisplayValue(detail.paymentRefNo)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : null}
                    </>
                )}

                {showFooter && (
                    <div className='flex items-center justify-between w-full gap-3 px-4 py-5 bg-white'>
                        <div>{''}</div>
                        <div className="flex gap-3">
                            {onShare && (
                                <Button
                                    variant="outline"
                                    size='sm'
                                    onClick={() => onShare(transaction)}
                                >
                                    Share Receipt
                                </Button>
                            )}
                            {onDownload && (
                                <Button
                                    size='sm'
                                    onClick={() => onDownload(transaction)}
                                >
                                    Download Receipt
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default TransactionDetailsModal;