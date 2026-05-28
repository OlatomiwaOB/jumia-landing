// 'use client'
// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { useRouter } from 'next/navigation';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import { toast } from 'sonner';
// import {
//     ArrowLeft,
//     RefreshCw,
//     RotateCcw,
//     Send,
//     Copy,
//     CheckCircle,
//     XCircle,
//     User,
//     CreditCard,
//     Banknote,
// } from 'lucide-react';
// import Loader from '@/components/ui/loader/loader';
// import { usePermission } from '@/hooks/usePermission';
// import { PermissionButton } from '@/components/Operations/permission/permission-button';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { formatPrice } from '@/utils/helperfns';
// import { Transaction } from 'viem';

// interface TransactionDetails {
//     tranRefNo: string;
//     tranDate: string;
//     tranType: string;
//     narration: string;
//     amount: number;
//     charge: number;
//     currencyCode: string;
//     responseMessage: string;
//     status: string;
//     senderName: string;
//     senderMobile: string;
//     sourceAccount: string;
//     createdBy: string;
//     createdDate: string;
//     beneficiaryName: string;
//     beneficiaryMobile: string;
//     beneficiaryAccount: string;
//     beneficiaryBankCode: string;
//     paymentMethod: string;
//     cardNo: string;
//     terminalId: string;
//     rrn: string;
//     stan: string;
//     paymentRefNo: string;
//     externalRefNo: string;
//     bankName: string;
//     agentCommission?: number;
//     networkCommission?: number;
//     bankCommission?: number;
//     serviceProviderCommission?: number;
//     platformCommission?: number;
//     aggregatorCommission?: number;
//     tranCode: string;
// }

// const getStatusColor = (status: string): string => {
//     const statusUpper = status?.toUpperCase() || '';
//     if (statusUpper === 'SUCCESSFUL' || statusUpper === 'SUCCESS') return 'bg-accent text-white';
//     if (statusUpper === 'PENDING' || statusUpper === 'PROCESSING') return 'bg-amber-500 text-white';
//     if (statusUpper === 'FAILED') return 'bg-red-500 text-white';
//     if (statusUpper === 'REVERSED') return 'bg-purple-500 text-white';
//     if (statusUpper === 'PENDING REVERSAL') return 'bg-amber-500 text-white';
//     return 'bg-gray-500 text-white';
// };

// const formatDate = (dateString: string): string => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleString('en-NG', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit'
//     });
// };

// const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
//     return new Intl.NumberFormat('en-NG', {
//         style: 'currency',
//         currency: currency,
//         minimumFractionDigits: 2
//     }).format(amount || 0);
// };

// const InfoRow = ({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) => {
//     const [copied, setCopied] = useState(false);

//     const handleCopy = () => {
//         navigator.clipboard.writeText(value);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//         toast.success('Copied to clipboard');
//     };

//     return (
//         <div className="flex justify-between items-start py-2 border-b border-accent/10 last:border-0">
//             <span className="text-sm text-accent-foreground/70">{label}</span>
//             <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium text-accent-foreground text-right">{value || 'N/A'}</span>
//                 {copyable && value && value !== 'N/A' && (
//                     <button
//                         onClick={handleCopy}
//                         className="text-accent hover:text-accent/70 transition-colors"
//                         title="Copy to clipboard"
//                     >
//                         {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// };

// const ApproveReversalModal = ({
//     isOpen,
//     onClose,
//     transaction,
//     onSuccess
// }: {
//     isOpen: boolean;
//     onClose: () => void;
//     transaction: TransactionDetails | null;
//     onSuccess?: () => void;
// }) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const queryClient = useQueryClient();

//     const approveReversalMutation = useMutation({
//         mutationFn: async (referenceNo: string) => {
//             const response = await axiosOperations.get(
//                 `/transactionmanager/approve-reversal/${referenceNo}`,
//                 {}
//             );
//             return response.data;
//         },
//         onSuccess: (data) => {
//             if (data?.code === '000' || data?.responseCode === '000') {
//                 toast.success('Reversal approved successfully');
//                 onClose();
//                 queryClient.invalidateQueries({ queryKey: ['transactions'] });
//                 if (onSuccess) onSuccess();
//             } else {
//                 toast.error(data?.desc || data?.responseMessage || 'Failed to approve reversal');
//             }
//         },
//         onError: (error: any) => {
//             toast.error(error.response?.data?.message || 'Failed to approve reversal');
//         },
//         onSettled: () => {
//             setIsLoading(false);
//         }
//     });

//     const handleConfirm = () => {
//         if (!transaction?.tranRefNo) {
//             toast.error('Transaction reference not found');
//             return;
//         }
//         setIsLoading(true);
//         approveReversalMutation.mutate(transaction.tranRefNo);
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onClose}>
//             <DialogContent className="sm:max-w-md">
//                 <DialogHeader className="flex flex-col items-start">
//                     <DialogTitle className="text-accent-foreground">Approve Reversal Request</DialogTitle>
//                     <DialogDescription>
//                         Please confirm that you want to approve this reversal request
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className="py-4">
//                     <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
//                         <p className="text-sm text-amber-800">
//                             <span className="font-semibold">Note:</span> Approving this reversal will reverse the transaction and refund the amount to the customer.
//                         </p>
//                     </div>

//                     {transaction && (
//                         <div className="space-y-3 text-sm">
//                             <div className="flex justify-between py-2 border-b border-accent/10">
//                                 <span className="font-medium text-accent-foreground">Transaction Reference:</span>
//                                 <span className="text-accent-foreground font-mono">{transaction.tranRefNo}</span>
//                             </div>
//                             <div className="flex justify-between py-2 border-b border-accent/10">
//                                 <span className="font-medium text-accent-foreground">Amount:</span>
//                                 <span className="font-semibold text-red-600">
//                                     {formatPrice(transaction.amount || 0, (transaction.currencyCode || 'NGN') as any)}
//                                 </span>
//                             </div>
//                             <div className="flex justify-between py-2 border-b border-accent/10">
//                                 <span className="font-medium text-accent-foreground">Transaction Type:</span>
//                                 <span className="text-accent-foreground">{transaction.tranType || 'N/A'}</span>
//                             </div>
//                             <div className="flex justify-between py-2 border-b border-accent/10">
//                                 <span className="font-medium text-accent-foreground">Current Status:</span>
//                                 <Badge className={`${getStatusColor(transaction.status)} text-xs px-2 py-1`}>
//                                     {transaction.status || 'UNKNOWN'}
//                                 </Badge>
//                             </div>
//                             <div className="flex justify-between py-2">
//                                 <span className="font-medium text-accent-foreground">Customer Email:</span>
//                                 <span className="text-accent-foreground">{transaction.createdBy || 'N/A'}</span>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <div className="flex justify-end gap-3 pt-4 border-t border-accent/10">
//                     <Button
//                         type="button"
//                         variant="outline"
//                         onClick={onClose}
//                         disabled={isLoading}
//                         className="border-accent/20 hover:bg-accent/10"
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         type="button"
//                         onClick={handleConfirm}
//                         disabled={isLoading}
//                         className="bg-accent hover:bg-accent/90 text-white gap-2"
//                     >
//                         <CheckCircle className="w-4 h-4" />
//                         {isLoading ? 'Processing...' : 'Confirm Approval'}
//                     </Button>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default function TransactionDetailsPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('MANAGE_TRANS', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to manage transactions"
//     });

//     const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
//     const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetails | null>(null);

//     const router = useRouter();
//     const transactionRef = window.location.pathname.split('/').pop();

//     const { data, isLoading, refetch } = useQuery({
//         queryKey: ['transaction-details', transactionRef],
//         queryFn: () =>
//             axiosOperations.get(`/transactionmanager/${transactionRef}`),
//         enabled: !!transactionRef,
//     });

//     const repushMutation = useMutation({
//         mutationFn: () =>
//             axiosOperations.get(`/transactionmanager/repush/${transactionRef}`,
//                 //     {
//                 //     params: { tranRefNo: transactionRef },
//                 // }
//             ),
//         onSuccess: (res) => {
//             if (res.data.code === '000' || res.data.code === '00') {
//                 toast.success(res?.data?.desc ?? 'Repush successful!');
//                 refetch();
//             } else {
//                 toast.error(res?.data?.desc ?? 'Repush failed');
//             }
//         },
//         onError: () => toast.error('Repush failed!'),
//     });

//     const requeryMutation = useMutation({
//         mutationFn: () =>
//             axiosOperations.get(`/transactionmanager/requery/${transactionRef}`,
//                 {
//                     params: { tranRefNo: transactionRef, provider: '' },
//                 }
//             ),
//         onSuccess: (res) => {
//             if (res.data.code === '000' || res.data.code === '00') {
//                 toast.success(res?.data?.desc ?? 'Requery successful!');
//                 refetch();
//             } else {
//                 toast.error(res?.data?.desc ?? 'Requery failed');
//             }
//         },
//         onError: () => toast.error('Requery failed!'),
//     });

//     const reverseMutation = useMutation({
//         mutationFn: () =>
//             axiosOperations.get(`/transactionmanager/reverse/${transactionRef}`,
//                 // {
//                 //     params: { tranRefNo: transactionRef },
//                 // }
//             ),
//         onSuccess: (res) => {
//             if (res.data.code === '000' || res.data.code === '00') {
//                 toast.success(res?.data?.desc ?? 'Reverse successful!');
//                 refetch();
//             } else {
//                 toast.error(res?.data?.desc ?? 'Reverse failed');
//             }
//         },
//         onError: () => toast.error('Reverse failed!'),
//     });

//     const transaction: TransactionDetails = data?.data;
//     const isSuccessful = transaction?.status?.toLowerCase() === 'successful' || transaction?.status?.toLowerCase() === 'success';


//     const handleApproveReversal = (transaction: TransactionDetails) => {
//         setSelectedTransaction(transaction);
//         setIsApproveModalOpen(true);
//     };

//     const handleCloseApproveModal = () => {
//         setIsApproveModalOpen(false);
//         setSelectedTransaction(null);
//     };

//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-white flex items-center justify-center">
//                 <Loader text="Loading transaction details..." />
//             </div>
//         );
//     }

//     if (!transaction) {
//         return (
//             <div className="min-h-screen bg-white flex items-center justify-center">
//                 <div className="text-center">
//                     <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//                     <h2 className="text-2xl font-bold text-accent-foreground mb-2">Transaction not found</h2>
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

//     const isProcessing = reverseMutation.isPending || repushMutation.isPending || requeryMutation.isPending;

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
//                                 Transaction Details
//                             </h1>
//                             <div className="flex items-center gap-3">
//                                 <p className="text-sm font-mono text-accent-foreground/70">
//                                     {transaction.tranRefNo}
//                                 </p>
//                                 <Badge className={`${getStatusColor(transaction.status)} text-xs px-2 py-1`}>
//                                     {transaction.status || 'UNKNOWN'}
//                                 </Badge>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex gap-2">
//                         <PermissionButton
//                             requiredPermissions={['MANAGE_TRANS']}
//                             requireAll={true}
//                             hideIfNoPermission={false}
//                             tooltipMessage="You do not have permission to manage transactions"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => reverseMutation.mutate()}
//                             disabled={isProcessing}
//                             className="border-accent/20 hover:bg-accent/10"
//                             title='Reverse transaction'
//                         >
//                             <RotateCcw className="w-4 h-4 mr-2" />
//                             Reverse
//                         </PermissionButton>
//                         <PermissionButton
//                             requiredPermissions={['MANAGE_TRANS']}
//                             requireAll={true}
//                             hideIfNoPermission={false}
//                             tooltipMessage="You do not have permission to manage transactions"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => requeryMutation.mutate()}
//                             disabled={isProcessing}
//                             className="border-accent/20 hover:bg-accent/10"
//                             title='Requery transaction'
//                         >
//                             <RefreshCw className={`w-4 h-4 mr-2 ${requeryMutation.isPending ? 'animate-spin' : ''}`} />
//                             Requery
//                         </PermissionButton>
//                         {transaction.status?.toUpperCase() === 'PENDING REVERSAL' && (
//                             <PermissionButton
//                                 requiredPermissions={['MANAGE_TRANS']}
//                                 requireAll={true}
//                                 hideIfNoPermission={false}
//                                 tooltipMessage="You do not have permission to approve reversals"
//                                 onClick={() => handleApproveReversal(transaction)}
//                                 variant="outline"
//                                 size="sm"
//                                 className="border-accent/20 hover:bg-accent/10"
//                                 title="Approve Reversal"
//                             >
//                                 <CheckCircle className="w-4 h-4 text-purple-600" />
//                                 Approve Reversal
//                             </PermissionButton>
//                         )}
//                         {/* <PermissionButton
//                             requiredPermissions={['MANAGE_TRANS']}
//                             requireAll={true}
//                             hideIfNoPermission={false}
//                             tooltipMessage="You do not have permission to manage transactions"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => repushMutation.mutate()}
//                             disabled={isProcessing}
//                             className="border-accent/20 hover:bg-accent/10"
//                             title='Repush transaction'
//                         >
//                             <Send className="w-4 h-4 mr-2" />
//                             Repush
//                         </PermissionButton> */}
//                     </div>
//                 </div>

//                 <Card className="border-accent/20 shadow-sm mb-6">
//                     <CardContent className="p-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                             <div>
//                                 <p className="text-sm text-accent-foreground/70 mb-1">Amount</p>
//                                 <p className="text-2xl font-bold text-green-700">
//                                     {formatCurrency(transaction.amount, transaction.currencyCode)}
//                                 </p>
//                                 {transaction.charge > 0 && (
//                                     <p className="text-xs text-accent-foreground/60 mt-1">
//                                         Charge: {formatCurrency(transaction.charge, transaction.currencyCode)}
//                                     </p>
//                                 )}
//                             </div>
//                             <div>
//                                 <p className="text-sm text-accent-foreground/70 mb-1">Transaction Type</p>
//                                 <p className="text-lg font-semibold text-accent-foreground">{transaction.tranType || 'N/A'}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-accent-foreground/70 mb-1">Date & Time</p>
//                                 <p className="text-lg font-semibold text-accent-foreground">{transaction.tranDate}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-accent-foreground/70 mb-1">Response</p>
//                                 <p className="text-lg font-semibold text-accent-foreground">{transaction.responseMessage || 'N/A'}</p>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <Card className="border-accent/20 shadow-sm">
//                         <CardHeader className="border-b border-accent/10">
//                             <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
//                                 <CreditCard className="w-5 h-5" />
//                                 Transaction Information
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-6">
//                             <InfoRow label="Reference No" value={transaction.tranRefNo} copyable />
//                             <InfoRow label="Transaction Type" value={transaction.tranType} />
//                             <InfoRow label="Narration" value={transaction.narration} />
//                             <InfoRow label="Amount" value={formatCurrency(transaction.amount, transaction.currencyCode)} />
//                             <InfoRow label="Charge" value={formatCurrency(transaction.charge, transaction.currencyCode)} />
//                             <InfoRow label="Currency" value={transaction.currencyCode || 'NGN'} />
//                             <InfoRow label="Response Message" value={transaction.responseMessage} />
//                             <InfoRow label="Status" value={transaction.status} />
//                         </CardContent>
//                     </Card>

//                     <Card className="border-accent/20 shadow-sm">
//                         <CardHeader className="border-b border-accent/10">
//                             <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
//                                 <User className="w-5 h-5" />
//                                 Sender Information
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-6">
//                             <InfoRow label="Sender Name" value={transaction.senderName} />
//                             <InfoRow label="Sender Mobile" value={transaction.senderMobile} copyable />
//                             <InfoRow label="Account No" value={transaction.sourceAccount} copyable />
//                             <InfoRow label="Bank Name" value={transaction.bankName} />
//                             <InfoRow label="Sender Email" value={transaction.createdBy} />
//                             <InfoRow label="Created Date" value={transaction.createdDate} />
//                         </CardContent>
//                     </Card>

//                     <Card className="border-accent/20 shadow-sm">
//                         <CardHeader className="border-b border-accent/10">
//                             <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
//                                 <User className="w-5 h-5" />
//                                 Beneficiary Information
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-6">
//                             <InfoRow label="Beneficiary Name" value={transaction.beneficiaryName} />
//                             <InfoRow label="Beneficiary Mobile" value={transaction.beneficiaryMobile} copyable />
//                             <InfoRow label="Beneficiary Account" value={transaction.beneficiaryAccount} copyable />
//                         </CardContent>
//                     </Card>

//                     <Card className="border-accent/20 shadow-sm">
//                         <CardHeader className="border-b border-accent/10">
//                             <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
//                                 <Banknote className="w-5 h-5" />
//                                 Payment Information
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-6">
//                             <InfoRow label="Payment Method" value={transaction.paymentMethod} />
//                             <InfoRow label="Card Number" value={transaction.cardNo ? `****${transaction.cardNo.slice(-4)}` : 'N/A'} />
//                             <InfoRow label="Device ID" value={transaction.terminalId} copyable />
//                             <InfoRow label="RRN" value={transaction.rrn} copyable />
//                             <InfoRow label="STAN" value={transaction.stan} copyable />
//                             <InfoRow label="Payment Ref No" value={transaction.paymentRefNo} copyable />
//                             <InfoRow label="External Ref No" value={transaction.externalRefNo} copyable />
//                             {(transaction.agentCommission ?? 0) > 0 && <InfoRow label="Agent Commission" value={formatCurrency(transaction.agentCommission ?? 0)} />}
//                             {(transaction.networkCommission ?? 0) > 0 && <InfoRow label="Network Commission" value={formatCurrency(transaction.networkCommission ?? 0)} />}
//                             {(transaction.bankCommission ?? 0) > 0 && <InfoRow label="Bank Commission" value={formatCurrency(transaction.bankCommission ?? 0)} />}
//                             {(transaction.serviceProviderCommission ?? 0) > 0 && <InfoRow label="Service Provider Commission" value={formatCurrency(transaction.serviceProviderCommission ?? 0)} />}
//                             {(transaction.platformCommission ?? 0) > 0 && <InfoRow label="Platform Commission" value={formatCurrency(transaction.platformCommission ?? 0)} />}
//                             {(transaction.aggregatorCommission ?? 0) > 0 && <InfoRow label="Aggregator Commission" value={formatCurrency(transaction.aggregatorCommission ?? 0)} />}
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>

//             <ApproveReversalModal
//                 isOpen={isApproveModalOpen}
//                 onClose={handleCloseApproveModal}
//                 transaction={selectedTransaction}
//                 onSuccess={() => {
//                     refetch();
//                 }}
//             />
//         </div>
//     );
// }

'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import {
    ArrowLeft,
    RefreshCw,
    RotateCcw,
    CheckCircle,
    XCircle,
    Loader2,
} from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';
import { PermissionButton } from '@/components/Operations/permission/permission-button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatPrice, CurrencyCode } from '@/utils/helperfns';
import { usePageMetadata } from '@/hooks/usePageMetadata';

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

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'SUCCESSFUL': case 'SUCCESS': return 'bg-green-100 text-green-700 border-green-200';
        case 'PENDING': case 'PROCESSING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'FAILED': return 'bg-red-100 text-red-700 border-red-200';
        case 'REVERSED': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'PENDING REVERSAL': return 'bg-orange-100 text-orange-700 border-orange-200';
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

const ApproveReversalModal = ({
    isOpen,
    onClose,
    transaction,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    transaction: TransactionDetails | null;
    onSuccess?: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const approveReversalMutation = useMutation({
        mutationFn: async (referenceNo: string) => {
            const response = await axiosOperations.get(`/transactionmanager/approve-reversal/${referenceNo}`, {});
            return response.data;
        },
        onSuccess: (data) => {
            if (data?.code === '000' || data?.responseCode === '000') {
                toast.success('Reversal approved successfully');
                onClose();
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
                if (onSuccess) onSuccess();
            } else {
                toast.error(data?.desc || data?.responseMessage || 'Failed to approve reversal');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to approve reversal');
        },
        onSettled: () => { setIsLoading(false); }
    });

    const handleConfirm = () => {
        if (!transaction?.tranRefNo) { toast.error('Transaction reference not found'); return; }
        setIsLoading(true);
        approveReversalMutation.mutate(transaction.tranRefNo);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                <DialogTitle className="sr-only">Approve Reversal</DialogTitle>
                <div className="px-6 pt-5">
                    <h2 className="text-base font-bold text-dark-gray">Approve Reversal Request</h2>
                    <p className="text-xs text-medium-gray mt-0.5">Confirm reversal approval for this transaction</p>
                </div>
                <div className="space-y-4">
                    <div className="bg-white m-6 rounded-2xl p-4 space-y-3">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-xs text-amber-800"><span className="font-semibold">Note:</span> Approving this reversal will reverse the transaction and refund the amount.</p>
                        </div>
                        {transaction && (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-1.5"><span className="text-medium-gray">Reference:</span><span className="text-dark-gray font-mono">{transaction.tranRefNo}</span></div>
                                <div className="flex justify-between py-1.5"><span className="text-medium-gray">Amount:</span><span className="font-semibold text-red-600">{formatPrice(transaction.amount || 0, (transaction.currencyCode || 'NGN') as any)}</span></div>
                                <div className="flex justify-between py-1.5"><span className="text-medium-gray">Type:</span><span className="text-dark-gray">{transaction.tranType || 'N/A'}</span></div>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 px-6 py-3 bg-white justify-end rounded-b-2xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                        <Button type="button" onClick={handleConfirm} disabled={isLoading}>
                            <CheckCircle className="w-4 h-4" /> {isLoading ? 'Processing...' : 'Confirm Approval'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default function TransactionDetailsPage() {
    usePageMetadata('Transaction Details', 'View transaction details.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_TRANS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage transactions"
    });

    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetails | null>(null);
    const router = useRouter();
    const transactionRef = window.location.pathname.split('/').pop();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['transaction-details', transactionRef],
        queryFn: () => axiosOperations.get(`/transactionmanager/${transactionRef}`),
        enabled: !!transactionRef,
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

    const transaction: TransactionDetails = data?.data;

    const handleApproveReversal = (transaction: TransactionDetails) => {
        setSelectedTransaction(transaction);
        setIsApproveModalOpen(true);
    };

    const isProcessing = reverseMutation.isPending || requeryMutation.isPending;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-medium-gray">Loading transaction details...</p>
                </div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <XCircle className="w-12 h-12 text-red-400" />
                <p className="text-dark-gray font-semibold">Transaction not found</p>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const ccy = transaction.currencyCode || 'NGN';

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="mb-4 px-2 pt-4">
                    <Button variant="link" onClick={() => router.push('/operations/transactions')}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </div>

                <div className='px-2 pb-6'>
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">{''}</h1>
                        <div className="flex gap-2">
                            <PermissionButton
                                requiredPermissions={['MANAGE_TRANS']} requireAll={true} hideIfNoPermission={false}
                                tooltipMessage="No permission" variant="outline" size="sm"
                                onClick={() => reverseMutation.mutate()} disabled={isProcessing} className="gap-1">
                                <RotateCcw className="w-3.5 h-3.5" /> Reverse
                            </PermissionButton>
                            <PermissionButton
                                requiredPermissions={['MANAGE_TRANS']} requireAll={true} hideIfNoPermission={false}
                                tooltipMessage="No permission" variant="outline" size="sm"
                                onClick={() => requeryMutation.mutate()} disabled={isProcessing} className="gap-1">
                                <RefreshCw className={`w-3.5 h-3.5 ${requeryMutation.isPending ? 'animate-spin' : ''}`} /> Requery
                            </PermissionButton>
                            {transaction.status?.toUpperCase() === 'PENDING REVERSAL' && (
                                <Button size="sm" onClick={() => handleApproveReversal(transaction)} className="bg-purple-600 hover:bg-purple-700 text-white gap-1">
                                    <CheckCircle className="w-3.5 h-3.5" /> Approve Reversal
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-white rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#F5F5F5]">
                            <div>
                                <p className="text-sm font-bold text-dark-gray">{formatPrice(transaction.amount, ccy as CurrencyCode)}</p>
                                <p className="text-xs text-medium-gray font-mono">{transaction.tranRefNo}</p>
                            </div>
                            <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full ml-auto ${getStatusColor(transaction.status)}`}>{transaction.status}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-x-6">
                            <Field label="Transaction Type" value={transaction.tranType || 'N/A'} />
                            <Field label="Date" value={transaction.tranDate || 'N/A'} />
                            <Field label="Response" value={transaction.responseMessage || 'N/A'} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <SectionCard title="Transaction Information">
                                <Field label="Reference Number" value={transaction.tranRefNo} copyable />
                                <Field label="Transaction Type" value={transaction.tranType} />
                                <Field label="Narration" value={transaction.narration} />
                                <Field label="Amount" value={formatPrice(transaction.amount, ccy as CurrencyCode)} highlight />
                                <Field label="Charge" value={formatPrice(transaction.charge, ccy as CurrencyCode)} />
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

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <SectionCard title="Beneficiary Information">
                                <Field label="Name" value={transaction.beneficiaryName} />
                                <Field label="Mobile" value={transaction.beneficiaryMobile} copyable />
                                <Field label="Account Number" value={transaction.beneficiaryAccount} copyable />
                                <Field label="Bank Code" value={transaction.beneficiaryBankCode} />
                            </SectionCard>

                            <SectionCard title="Payment Information">
                                <Field label="Payment Method" value={transaction.paymentMethod} />
                                <Field label="Card Number" value={transaction.cardNo ? `****${transaction.cardNo.slice(-4)}` : 'N/A'} />
                                <Field label="Device ID" value={transaction.terminalId} copyable />
                                <Field label="RRN" value={transaction.rrn} copyable />
                                <Field label="STAN" value={transaction.stan} copyable />
                                <Field label="Payment Ref No." value={transaction.paymentRefNo} copyable />
                                <Field label="External Ref No." value={transaction.externalRefNo} copyable />
                                {(transaction.agentCommission ?? 0) > 0 && <Field label="Agent Commission" value={formatPrice(transaction.agentCommission ?? 0, ccy as CurrencyCode)} />}
                                {(transaction.networkCommission ?? 0) > 0 && <Field label="Network Commission" value={formatPrice(transaction.networkCommission ?? 0, ccy as CurrencyCode)} />}
                                {(transaction.bankCommission ?? 0) > 0 && <Field label="Bank Commission" value={formatPrice(transaction.bankCommission ?? 0, ccy as CurrencyCode)} />}
                                {(transaction.platformCommission ?? 0) > 0 && <Field label="Platform Commission" value={formatPrice(transaction.platformCommission ?? 0, ccy as CurrencyCode)} />}
                            </SectionCard>
                        </div>
                    </div>
                </div>
            </div>

            <ApproveReversalModal
                isOpen={isApproveModalOpen}
                onClose={() => { setIsApproveModalOpen(false); setSelectedTransaction(null); }}
                transaction={selectedTransaction}
                onSuccess={() => refetch()}
            />
        </div>
    );
}