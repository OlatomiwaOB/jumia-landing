// 'use client'
// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { RefreshCw, Search, Filter, Calendar, CheckCircle } from 'lucide-react';
// import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import DynamicTable from '@/components/Operations/transactions/dynamic-table';
// import { formatPrice } from '@/utils/helperfns';
// import { Badge } from '@/components/ui/badge';
// import { useRouter } from 'next/navigation';
// import { Eye } from 'lucide-react';
// import { usePermission } from '@/hooks/usePermission';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { toast } from 'sonner';
// import { PermissionButton } from '@/components/Operations/permission/permission-button';

// interface Transaction {
//     id: number;
//     tranRefNo: string;
//     createdDate: string;
//     tranType: string;
//     amount: number;
//     terminalId: string;
//     createdBy: string;
//     status: string;
//     rrn?: string | null;
//     stan?: string | null;
//     narration?: string;
//     currencyCode?: string;
//     sourceAccount?: string;
//     beneficiaryName?: string;
//     responseMessage?: string;
//     tranCode: string;
// }

// interface TransactionFilter {
//     transactionType: string;
//     status: string;
//     startDate: string;
//     endDate: string;
//     rrn: string;
//     tranRefNo: string;
//     createdBy: string;
// }

// interface ApiResponse {
//     totalCount: number;
//     totalPages: number;
//     responseCode: string | null;
//     responseMessage: string | null;
//     transactions: Transaction[];
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

// const formatDateToDDMMYYYY = (date: Date): string => {
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
// };

// const formatDisplayDate = (dateString: string): string => {
//     if (!dateString) return 'N/A';
//     return dateString;
// };

// const ApproveReversalModal = ({
//     isOpen,
//     onClose,
//     transaction,
//     onSuccess
// }: {
//     isOpen: boolean;
//     onClose: () => void;
//     transaction: Transaction | null;
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

// export default function TransactionsPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('CAN_VIEW_TRANS', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to view transactions"
//     });
//     const router = useRouter();
//     const [page, setPage] = useState(1);
//     const [isRefreshing, setIsRefreshing] = useState(false);
//     const [showFilters, setShowFilters] = useState(false);
//     const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
//     const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
//     const pageSize = 15;

//     const getFirstDayOfYear = () => {
//         const date = new Date();
//         return `${date.getFullYear()}-01-01`;
//     };

//     const today = new Date().toISOString().split('T')[0];

//     const [filters, setFilters] = useState<TransactionFilter>({
//         transactionType: '',
//         status: '',
//         startDate: getFirstDayOfYear(),
//         endDate: today,
//         rrn: '',
//         tranRefNo: '',
//         createdBy: '',
//     });

//     const [transactionTypes, setTransactionTypes] = useState<{ value: string; label: string }[]>([]);
//     const [statusOptions] = useState([
//         { value: 'S', label: 'Successful' },
//         { value: 'P', label: 'Pending' },
//         { value: 'F', label: 'Failed' },
//         { value: 'R', label: 'Reversed' },
//     ]);

//     const { data: typesData, isLoading: typesLoading } = useQuery({
//         queryKey: ['transaction-types'],
//         queryFn: () =>
//             axiosOperations.request({
//                 method: 'GET',
//                 url: '/lookupdata/new-list',
//                 params: {
//                     categoryCode: 'TRAN_CODE',
//                     entityCode: process.env.NEXT_PUBLIC_ENTITYCODE
//                 }
//             }),
//         enabled: true,
//     });

//     useEffect(() => {
//         if (typesData?.data?.list) {
//             const types = typesData.data.list.map((item: { code: string; name: string }) => ({
//                 value: item.code,
//                 label: item.name
//             }));
//             setTransactionTypes(types);
//         }
//     }, [typesData]);

//     const {
//         data: response,
//         isLoading: transactionsLoading,
//         error: transactionsError,
//         refetch: refetchTransactions
//     } = useQuery<ApiResponse>({
//         queryKey: ['transactions', page, filters],
//         queryFn: async () => {
//             const params: any = {
//                 startDate: formatDateToDDMMYYYY(new Date(filters.startDate)),
//                 endDate: formatDateToDDMMYYYY(new Date(filters.endDate)),
//                 pageNumber: page,
//                 pageSize: pageSize,
//             };

//             if (filters.rrn) params.rrn = filters.rrn;
//             if (filters.status) params.status = filters.status;
//             if (filters.transactionType && filters.transactionType !== 'all') params.tranCode = filters.transactionType;
//             if (filters.createdBy) params.createdBy = filters.createdBy;
//             if (filters.tranRefNo) params.tranRefNo = filters.tranRefNo;

//             const response = await axiosOperations.request({
//                 method: 'GET',
//                 url: '/transactionmanager/tranmasterlist',
//                 params,
//             });

//             return response.data;
//         },
//         placeholderData: keepPreviousData,
//     });

//     const handleRefresh = () => {
//         setIsRefreshing(true);
//         refetchTransactions().finally(() => setIsRefreshing(false));
//     };

//     const handleFilterChange = (key: keyof TransactionFilter, value: string) => {
//         setFilters(prev => ({ ...prev, [key]: value === 'all' ? '' : value }));
//         setPage(1);
//     };

//     const handleClearFilters = () => {
//         setFilters({
//             transactionType: '',
//             status: '',
//             startDate: getFirstDayOfYear(),
//             endDate: today,
//             rrn: '',
//             tranRefNo: '',
//             createdBy: '',
//         });
//         setPage(1);
//     };

//     const handleViewDetails = (transactionRef: string) => {
//         router.push(`/operations/transactions/${transactionRef}`);
//     };

//     const handleApproveReversal = (transaction: Transaction) => {
//         setSelectedTransaction(transaction);
//         setIsApproveModalOpen(true);
//     };

//     const handleCloseApproveModal = () => {
//         setIsApproveModalOpen(false);
//         setSelectedTransaction(null);
//     };

//     const transactions: Transaction[] = response?.transactions || [];
//     const totalCount = response?.totalCount || 0;
//     const totalPages = response?.totalPages || Math.ceil(totalCount / pageSize);

//     const columns: Array<any> = [
//         {
//             title: 'S/N',
//             dataIndex: 'id',
//             key: 'sn',
//             width: 80,
//             render: (_: any, record: Transaction, index: number) => (
//                 <span className="text-accent-foreground">{(page - 1) * pageSize + index + 1}</span>
//             ),
//         },
//         {
//             title: 'Transaction Ref',
//             dataIndex: 'tranRefNo',
//             key: 'tranRefNo',
//             width: 180,
//             render: (ref: string, record: Transaction) => (
//                 <span className="font-mono text-accent-foreground whitespace-nowrap">{ref || 'N/A'}</span>
//             ),
//         },
//         {
//             title: 'Posted Date',
//             dataIndex: 'createdDate',
//             key: 'createdDate',
//             width: 180,
//             render: (date: string, record: Transaction) => (
//                 <span className="text-accent-foreground/80 whitespace-nowrap">{formatDisplayDate(date)}</span>
//             ),
//         },
//         {
//             title: 'Transaction Type',
//             dataIndex: 'tranType',
//             key: 'tranType',
//             width: 120,
//             render: (type: string, record: Transaction) => {
//                 const displayValue = type || 'N/A';
//                 const truncated = displayValue !== 'N/A' && displayValue.length > 15
//                     ? `${displayValue.substring(0, 15)}...`
//                     : displayValue;

//                 return (
//                     <span
//                         className="text-accent-foreground/80 whitespace-nowrap cursor-help"
//                         title={displayValue !== 'N/A' ? displayValue : ''}
//                     >
//                         {truncated}
//                     </span>
//                 );
//             },
//         },
//         {
//             title: 'Amount',
//             dataIndex: 'amount',
//             key: 'amount',
//             width: 120,
//             render: (amount: number, record: Transaction) => (
//                 <span className="font-semibold text-green-700 whitespace-nowrap">
//                     {formatPrice(amount || 0, (record.currencyCode || 'NGN') as any)}
//                 </span>
//             ),
//         },
//         {
//             title: 'Status',
//             dataIndex: 'status',
//             key: 'status',
//             width: 100,
//             render: (status: string, record: Transaction) => (
//                 <Badge className={`${getStatusColor(status)} text-xs px-2 py-1 whitespace-nowrap`}>
//                     {status || 'UNKNOWN'}
//                 </Badge>
//             ),
//         },
//         {
//             title: 'Payment Method',
//             dataIndex: 'paymentMethod',
//             key: 'paymentMethod',
//             width: 100,
//             render: (method: string, record: Transaction) => (
//                 <span className="font-mono text-accent-foreground whitespace-nowrap">{method || 'N/A'}</span>
//             ),
//         },
//         {
//             title: 'Device ID',
//             dataIndex: 'terminalId',
//             key: 'terminalId',
//             width: 120,
//             render: (terminalId: string, record: Transaction) => {
//                 const displayValue = terminalId || 'N/A';
//                 const truncated = displayValue !== 'N/A' && displayValue.length > 10
//                     ? `${displayValue.substring(0, 10)}...`
//                     : displayValue;

//                 return (
//                     <span
//                         className="text-accent-foreground/80 whitespace-nowrap cursor-help"
//                         title={displayValue !== 'N/A' ? displayValue : ''}
//                     >
//                         {truncated}
//                     </span>
//                 );
//             },
//         },
//         {
//             title: 'Posted By',
//             dataIndex: 'senderName',
//             key: 'senderName',
//             width: 120,
//             render: (name: string, record: Transaction) => {
//                 const displayValue = name || 'N/A';
//                 const truncated = displayValue !== 'N/A' && displayValue.length > 10
//                     ? `${displayValue.substring(0, 10)}...`
//                     : displayValue;

//                 return (
//                     <span
//                         className="text-accent-foreground/80 whitespace-nowrap cursor-help"
//                         title={displayValue !== 'N/A' ? displayValue : ''}
//                     >
//                         {truncated}
//                     </span>
//                 );
//             },
//         },
//         {
//             title: 'Actions',
//             key: 'actions',
//             width: 100,
//             render: (_: any, record: Transaction) => (
//                 <div className="flex gap-1">
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-1 hover:bg-accent/10"
//                         onClick={() => handleViewDetails(record.tranRefNo)}
//                         title="View Details"
//                     >
//                         <Eye className="w-4 h-4 text-accent-foreground" />
//                     </Button>

//                     {record.status?.toUpperCase() === 'PENDING REVERSAL' && (
//                         <PermissionButton
//                             requiredPermissions={['MANAGE_TRANS']}
//                             requireAll={true}
//                             hideIfNoPermission={false}
//                             tooltipMessage="You do not have permission to approve reversals"
//                             onClick={() => handleApproveReversal(record)}
//                             variant="ghost"
//                             size="sm"
//                             className="p-1 hover:bg-accent/10"
//                             title="Approve Reversal"
//                         >
//                             <CheckCircle className="w-4 h-4 text-purple-600" />
//                         </PermissionButton>
//                     )}
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <div className="min-h-screen bg-white">
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center justify-between mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-accent-foreground mb-2">
//                             Transactions
//                         </h1>
//                         <p className="text-accent-foreground/70">
//                             View and manage all transaction records
//                         </p>
//                     </div>
//                     <div className="flex items-center gap-4">
//                         <div className="text-right">
//                             <p className="text-2xl font-bold text-accent-foreground">{totalCount}</p>
//                             <p className="text-sm text-accent-foreground/70">Total Transactions</p>
//                         </div>
//                     </div>
//                 </div>

//                 <Card className="border-accent/20 shadow-sm mb-6">
//                     <CardHeader className="border-b border-accent/10">
//                         <div className="flex items-center justify-between">
//                             <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
//                                 <Filter className="w-5 h-5" />
//                                 Filters
//                             </CardTitle>
//                             <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => setShowFilters(!showFilters)}
//                                 className="text-accent hover:bg-accent/10 hover:text-accent"
//                             >
//                                 {showFilters ? 'Hide Filters' : 'Show Filters'}
//                             </Button>
//                         </div>
//                     </CardHeader>
//                     {showFilters && (
//                         <CardContent className="p-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="transactionType" className="text-accent-foreground">Transaction Type</Label>
//                                     <Select
//                                         value={filters.transactionType || 'all'}
//                                         onValueChange={(value) => handleFilterChange('transactionType', value)}
//                                     >
//                                         <SelectTrigger id="transactionType" className="border-accent/20">
//                                             <SelectValue placeholder="All Types" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="all">All Types</SelectItem>
//                                             {transactionTypes.map((type) => (
//                                                 <SelectItem key={type.value} value={type.value}>
//                                                     {type.label}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="status" className="text-accent-foreground">Status</Label>
//                                     <Select
//                                         value={filters.status || 'all'}
//                                         onValueChange={(value) => handleFilterChange('status', value)}
//                                     >
//                                         <SelectTrigger id="status" className="border-accent/20">
//                                             <SelectValue placeholder="All Status" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="all">All Status</SelectItem>
//                                             {statusOptions.map((option) => (
//                                                 <SelectItem key={option.value} value={option.value}>
//                                                     {option.label}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="startDate" className="text-accent-foreground">Start Date</Label>
//                                     <div className="relative">
//                                         <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent-foreground/50" />
//                                         <Input
//                                             id="startDate"
//                                             type="date"
//                                             value={filters.startDate}
//                                             onChange={(e) => handleFilterChange('startDate', e.target.value)}
//                                             className="pl-10 bg-white border-accent/20 focus:border-accent"
//                                             max={filters.endDate || today}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="endDate" className="text-accent-foreground">End Date</Label>
//                                     <div className="relative">
//                                         <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent-foreground/50" />
//                                         <Input
//                                             id="endDate"
//                                             type="date"
//                                             value={filters.endDate}
//                                             onChange={(e) => handleFilterChange('endDate', e.target.value)}
//                                             className="pl-10 bg-white border-accent/20 focus:border-accent"
//                                             min={filters.startDate}
//                                             max={today}
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* <div className="space-y-2">
//                                     <Label htmlFor="rrn" className="text-accent-foreground">RRN</Label>
//                                     <Input
//                                         id="rrn"
//                                         placeholder="Enter RRN"
//                                         value={filters.rrn}
//                                         onChange={(e) => handleFilterChange('rrn', e.target.value)}
//                                         className="bg-white border-accent/20 focus:border-accent"
//                                     />
//                                 </div> */}

//                                 <div className="space-y-2">
//                                     <Label htmlFor="tranRefNo" className="text-accent-foreground">Trans Ref</Label>
//                                     <Input
//                                         id="tranRefNo"
//                                         placeholder="Enter transaction reference"
//                                         value={filters.tranRefNo}
//                                         onChange={(e) => handleFilterChange('tranRefNo', e.target.value)}
//                                         className="bg-white border-accent/20 focus:border-accent"
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="createdBy" className="text-accent-foreground">Customer Email</Label>
//                                     <Input
//                                         id="createdBy"
//                                         placeholder="Enter customer email"
//                                         value={filters.createdBy}
//                                         onChange={(e) => handleFilterChange('createdBy', e.target.value)}
//                                         className="bg-white border-accent/20 focus:border-accent"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-accent/10">
//                                 <Button
//                                     variant="outline"
//                                     onClick={handleClearFilters}
//                                     className="border-accent/20 hover:bg-accent/10"
//                                 >
//                                     Clear Filters
//                                 </Button>
//                                 <Button
//                                     onClick={() => refetchTransactions()}
//                                     className="bg-accent hover:bg-accent/90 text-white"
//                                 >
//                                     <Search className="w-4 h-4 mr-2" />
//                                     Apply Filters
//                                 </Button>
//                             </div>
//                         </CardContent>
//                     )}
//                 </Card>

//                 <Card className="border-accent/20 shadow-sm">
//                     <CardHeader className="border-b border-accent/10">
//                         <div className="flex justify-between">
//                             <CardTitle className="text-lg font-semibold text-accent-foreground">
//                                 Transaction List
//                             </CardTitle>
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={handleRefresh}
//                                 disabled={isRefreshing}
//                                 className="border-accent/20 hover:bg-accent/10"
//                             >
//                                 <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
//                                 Refresh
//                             </Button>
//                         </div>
//                     </CardHeader>
//                     <CardContent className="p-0">
//                         {transactionsError ? (
//                             <div className="p-12 text-center">
//                                 <p className="text-red-500 mb-2">Error loading transactions</p>
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => refetchTransactions()}
//                                     className="border-accent/20 hover:bg-accent/10"
//                                 >
//                                     Try Again
//                                 </Button>
//                             </div>
//                         ) : transactionsLoading ? (
//                             <div className="p-12 text-center">
//                                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
//                                 <p className="mt-2 text-accent-foreground/70">Loading transactions...</p>
//                             </div>
//                         ) : transactions.length > 0 ? (
//                             <>
//                                 <DynamicTable
//                                     columns={columns}
//                                     data={transactions}
//                                     itemsPerPage={pageSize}
//                                 />

//                                 {totalPages > 1 && (
//                                     <div className="flex justify-end p-4 border-t border-accent/10">
//                                         <div className="flex items-center gap-2">
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 onClick={() => setPage(Math.max(1, page - 1))}
//                                                 disabled={page === 1}
//                                                 className="border-accent/20 hover:bg-accent/10"
//                                             >
//                                                 Previous
//                                             </Button>
//                                             <span className="text-sm text-accent-foreground/70 px-2">
//                                                 Page {page} of {totalPages}
//                                             </span>
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 onClick={() => setPage(Math.min(totalPages, page + 1))}
//                                                 disabled={page === totalPages}
//                                                 className="border-accent/20 hover:bg-accent/10"
//                                             >
//                                                 Next
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </>
//                         ) : (
//                             <div className="p-12 text-center">
//                                 <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
//                                     <Search className="h-12 w-12 text-accent-foreground/50" />
//                                 </div>
//                                 <h3 className="text-lg font-medium text-accent-foreground mb-2">
//                                     No transactions found
//                                 </h3>
//                                 <p className="text-accent-foreground/70 mb-4">
//                                     Try adjusting your filters or clear them to see more results
//                                 </p>
//                                 <Button
//                                     onClick={handleClearFilters}
//                                     variant="outline"
//                                     className="border-accent/20 hover:bg-accent/10"
//                                 >
//                                     Clear Filters
//                                 </Button>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>
//             </div>

//             <ApproveReversalModal
//                 isOpen={isApproveModalOpen}
//                 onClose={handleCloseApproveModal}
//                 transaction={selectedTransaction}
//                 onSuccess={() => {
//                     refetchTransactions();
//                 }}
//             />
//         </div>
//     );
// }

'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Eye, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { formatPrice } from '@/utils/helperfns';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/hooks/usePermission';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { DatePicker } from '@/components/ui/date-picker';
import { TransactionDetailsModal } from '@/components/Operations/transactions/transaction-details';
import { TransInflowIcon, SeperatorIcon, SettingIconGray } from '@/components/icons/icons';
import Papa from 'papaparse';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { format, parse } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Transaction {
    id: number;
    tranRefNo: string;
    createdDate: string;
    tranType: string;
    amount: number;
    terminalId: string;
    createdBy: string;
    status: string;
    rrn?: string | null;
    stan?: string | null;
    narration?: string;
    currencyCode?: string;
    sourceAccount?: string;
    beneficiaryName?: string;
    responseMessage?: string;
    tranCode: string;
    paymentMethod?: string;
    senderName?: string;
}

interface TransactionFilter {
    transactionType: string;
    status: string;
    startDate: string;
    endDate: string;
    tranRefNo: string;
    createdBy: string;
}

interface ApiResponse {
    totalCount: number;
    totalPages: number;
    responseCode: string | null;
    responseMessage: string | null;
    transactions: Transaction[];
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

const getDisplayValue = (value: any): string => value?.toString() || 'N/A';

const datePickerToAPI = (dateString: string): string => {
    if (!dateString) return '';
    if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            return `${parts[0]}-${parts[1]}-${parts[2]}`;
        }
    } else if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
            if (parts[0].length === 4) {
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            return dateString;
        }
    }
    return dateString;
};

const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return dateString;
};

const TablePagination = ({
    current, total, perPage, onChange,
}: { current: number; total: number; perPage: number; onChange: (p: number) => void }) => {
    const pages = Math.ceil(total / perPage);
    const start = (current - 1) * perPage + 1;
    const end = Math.min(current * perPage, total);

    const getPageNumbers = () => {
        if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
        const result: (number | '...')[] = [];
        if (current <= 3) result.push(1, 2, 3, '...', pages);
        else if (current >= pages - 2) result.push(1, '...', pages - 2, pages - 1, pages);
        else result.push(1, '...', current, '...', pages);
        return result;
    };

    return (
        <div className="flex items-center justify-between mt-4 pt-4 mb-10">
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Transactions per Page</p>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current - 1)} disabled={current === 1}>
                    <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                {getPageNumbers().map((p, i) =>
                    p === '...' ? (
                        <span key={`e-${i}`} className="text-xs text-gray-400 px-1">···</span>
                    ) : (
                        <button key={p} onClick={() => onChange(p as number)}
                            className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${p === current ? 'border-2 border-orange-400 text-orange-500' : 'text-gray-600 hover:bg-gray-100'}`}>
                            {p}
                        </button>
                    )
                )}
                <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current + 1)} disabled={current === pages}>
                    Next <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

const ApproveReversalModal = ({
    isOpen,
    onClose,
    transaction,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
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
                            <p className="text-xs text-amber-800">
                                <span className="font-semibold">Note:</span> Approving this reversal will reverse the transaction and refund the amount.
                            </p>
                        </div>
                        {transaction && (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-1.5">
                                    <span className="text-medium-gray">Reference:</span>
                                    <span className="text-dark-gray font-mono">{transaction.tranRefNo}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-medium-gray">Amount:</span>
                                    <span className="font-semibold text-red-600">{formatPrice(transaction.amount || 0, (transaction.currencyCode || 'NGN') as any)}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-medium-gray">Status:</span>
                                    <Badge className={`text-[10px] px-2 py-0.5 border font-medium ${getStatusColor(transaction.status)}`}>{transaction.status}</Badge>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 px-6 py-3 bg-white justify-end rounded-b-2xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                        <Button type="button" onClick={handleConfirm} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                            <CheckCircle className="w-4 h-4" /> {isLoading ? 'Processing...' : 'Confirm Approval'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default function TransactionsPage() {
    usePageMetadata('Transaction & Payment Management', 'Manage transactions and payment workflows.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('CAN_VIEW_TRANS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to view transactions"
    });

    const router = useRouter();
    const [page, setPage] = useState(1);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    // const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedTransactionRef, setSelectedTransactionRef] = useState<string | null>(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const pageSize = 10;

    const today = format(new Date(), 'yyyy-MM-dd');
    const firstDayOfYear = `${new Date().getFullYear()}-01-01`;

    const [filters, setFilters] = useState<TransactionFilter>({
        transactionType: '',
        status: '',
        startDate: firstDayOfYear,
        endDate: today,
        tranRefNo: '',
        createdBy: '',
    });

    const [transactionTypes, setTransactionTypes] = useState<{ value: string; label: string }[]>([]);
    const [statusOptions] = useState([
        { value: 'all', label: 'All Status' },
        { value: 'S', label: 'Successful' },
        { value: 'P', label: 'Pending' },
        { value: 'F', label: 'Failed' },
        { value: 'R', label: 'Reversed' },
    ]);

    const { data: typesData } = useQuery({
        queryKey: ['transaction-types'],
        queryFn: () => axiosOperations.request({
            method: 'GET',
            url: '/lookupdata/new-list',
            params: { categoryCode: 'TRAN_CODE', entityCode: process.env.NEXT_PUBLIC_ENTITYCODE }
        }),
        enabled: true,
    });

    useEffect(() => {
        if (typesData?.data?.list) {
            const types = typesData.data.list.map((item: { code: string; name: string }) => ({
                value: item.code,
                label: item.name
            }));
            setTransactionTypes(types);
        }
    }, [typesData]);

    const {
        data: response,
        isLoading: transactionsLoading,
        error: transactionsError,
        refetch: refetchTransactions
    } = useQuery<ApiResponse>({
        queryKey: ['transactions', page, filters.transactionType, filters.status, filters.startDate, filters.endDate, filters.tranRefNo, filters.createdBy],
        queryFn: async () => {
            const params: any = {
                startDate: datePickerToAPI(filters.startDate),
                endDate: datePickerToAPI(filters.endDate),
                pageNumber: page,
                pageSize: pageSize,
            };
            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.transactionType && filters.transactionType !== 'all') params.tranCode = filters.transactionType;
            if (filters.createdBy) params.createdBy = filters.createdBy;
            if (filters.tranRefNo) params.tranRefNo = filters.tranRefNo;

            const response = await axiosOperations.request({
                method: 'GET',
                url: '/transactionmanager/tranmasterlist',
                params,
            });
            return response.data;
        },
        placeholderData: keepPreviousData,
    });

    const updateFilter = (key: keyof TransactionFilter, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value === 'all' ? '' : value }));
        setPage(1);
    };

    const handleClearFilters = () => {
        setFilters({
            transactionType: '',
            status: '',
            startDate: firstDayOfYear,
            endDate: today,
            tranRefNo: '',
            createdBy: '',
        });
        setPage(1);
    };

    const handleViewDetails = (transactionRef: string) => {
        setSelectedTransactionRef(transactionRef);
        setIsDetailsOpen(true);
    };

    const handleApproveReversal = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsApproveModalOpen(true);
    };

    const handleSettings = (tranRefNo: string) => {
        router.push(`/operations/transactions/${tranRefNo}`);
    };

    const transactions: Transaction[] = response?.transactions || [];
    const totalCount = response?.totalCount || 0;
    const totalPages = response?.totalPages || Math.ceil(totalCount / pageSize);

    const exportToCSV = () => {
        if (!transactions.length) { toast.error('No data to export'); return; }
        const csv = Papa.unparse(transactions.map((t) => ({
            'Reference': t.tranRefNo,
            'Date': t.createdDate,
            'Type': t.tranType,
            'Amount': t.amount,
            'Status': t.status,
            'Terminal': t.terminalId,
            'Sender': t.senderName || t.createdBy,
        })), { header: true });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Export complete');
    };

    const hasActiveFilters = filters.transactionType || filters.status || filters.tranRefNo || filters.createdBy;

    return (
        <div className="min-h-screen px-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                    <p className="text-sm text-medium-gray mb-1">Total Transactions</p>
                    <p className="text-2xl font-semibold text-dark-gray">{totalCount.toLocaleString()}</p>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                            value={filters.tranRefNo || filters.createdBy || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.includes('@')) {
                                    updateFilter('createdBy', val);
                                } else {
                                    updateFilter('tranRefNo', val);
                                }
                            }}
                            placeholder="Search by reference or email..."
                            className="pl-9 text-medium-gray"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Select value={filters.transactionType || 'all'} onValueChange={(v) => updateFilter('transactionType', v)}>
                            <SelectTrigger className="bg-white w-36">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {transactionTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={filters.status || 'all'} onValueChange={(v) => updateFilter('status', v)}>
                            <SelectTrigger className="bg-white w-32">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="w-32">
                            <DatePicker
                                value={filters.startDate}
                                onChange={(dateString) => updateFilter('startDate', dateString)}
                                placeholder="Start date"
                            />
                        </div>

                        <div className="w-32">
                            <DatePicker
                                value={filters.endDate}
                                onChange={(dateString) => updateFilter('endDate', dateString)}
                                placeholder="End date"
                            />
                        </div>

                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )}

                        <SeperatorIcon />
                        <Button onClick={exportToCSV} size="lg">
                            <TransInflowIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                    </div>
                </div>
            </div>

            {transactionsLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                </div>
            ) : transactionsError ? (
                <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading transactions</div>
            ) : (
                <>
                    <div className="hidden lg:block">
                        {transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <p className="text-2xl font-medium text-dark-gray">No transactions found</p>
                                <p className="text-sm text-medium-gray">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#EEEEEE]">
                                                {['Reference', 'Date', 'Trans. Type', 'Amount', 'Status', 'Channel', 'Device ID', 'Sender', ''].map((h) => (
                                                    <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((t, idx) => (
                                                <tr key={t.id}
                                                    onClick={() => handleViewDetails(t.tranRefNo)}
                                                    className={`border-b-2 border-[#EEEEEE] cursor-pointer hover:bg-orange-50/40 transition-colors ${idx === transactions.length - 1 ? 'border-b-0' : ''}`}>
                                                    <td className="px-3 py-3.5"><p className="text-sm font-mono font-medium text-dark-gray">{getDisplayValue(t.tranRefNo)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray max-w-20">{formatDisplayDate(t.createdDate)}</p></td>
                                                    <td className="px-3 py-3.5 max-w-[120px]"><p className="text-sm text-dark-gray truncate">{getDisplayValue(t.tranType)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm font-semibold text-dark-gray">{formatPrice(t.amount || 0, (t.currencyCode || 'NGN') as any)}</p></td>
                                                    <td className="px-3 py-3.5">
                                                        <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(t.status)}`}>{t.status}</Badge>
                                                    </td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{getDisplayValue(t.paymentMethod)}</p></td>
                                                    <td className="px-3 py-3.5 max-w-[120px]">
                                                        <p className="text-sm text-dark-gray truncate">{getDisplayValue(t.terminalId)}</p>
                                                    </td>
                                                    <td className="px-3 py-3.5 max-w-[150px]">
                                                        <p className="text-sm text-dark-gray truncate">{getDisplayValue(t.senderName || t.createdBy)}</p>
                                                    </td>
                                                    <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center gap-1">
                                                            <Button size="xs" variant="action" onClick={() => handleViewDetails(t.tranRefNo)} title="View Details">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="xs" variant="action" onClick={() => handleSettings(t.tranRefNo)} title="Settings"><SettingIconGray className="w-4 h-4" /></Button>
                                                            {t.status?.toUpperCase() === 'PENDING REVERSAL' && (
                                                                <Button size="xs" variant="action" onClick={() => handleApproveReversal(t)} title="Approve Reversal" className="text-purple-600">
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 1 && (
                                    <TablePagination current={page} total={totalCount} perPage={pageSize} onChange={setPage} />
                                )}
                            </>
                        )}
                    </div>
                </>
            )}

            <TransactionDetailsModal
                transactionRef={selectedTransactionRef}
                open={isDetailsOpen}
                onClose={() => { setIsDetailsOpen(false); setSelectedTransactionRef(null); }}
                onRefetch={refetchTransactions}
            />

            <ApproveReversalModal
                isOpen={isApproveModalOpen}
                onClose={() => { setIsApproveModalOpen(false); setSelectedTransaction(null); }}
                transaction={selectedTransaction}
                onSuccess={() => refetchTransactions()}
            />
        </div>
    );
}