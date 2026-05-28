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
// import { Badge } from '@/components/ui/badge';
// import { RefreshCw, Search, Filter, Eye } from 'lucide-react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import { toast } from 'sonner';
// import { useDebounce } from '@/hooks/useDebounce';
// import DynamicTable from '@/components/Operations/settlements/dynamic-table';
// import { useRouter } from 'next/navigation';
// import { usePermission } from '@/hooks/usePermission';

// interface SettlementTransaction {
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

// interface Merchant {
//     id: string;
//     merchantId: string;
//     businessName: string;
//     name: string;
// }

// interface ApiResponse {
//     totalCount: number;
//     totalPages: number;
//     responseCode: string | null;
//     responseMessage: string | null;
//     transactions: SettlementTransaction[];
// }

// const getStatusColor = (status: string): string => {
//     const statusUpper = status?.toUpperCase() || '';
//     if (statusUpper === 'SUCCESSFUL' || statusUpper === 'SUCCESS') return 'bg-accent text-white';
//     if (statusUpper === 'PENDING' || statusUpper === 'PROCESSING') return 'bg-amber-500 text-white';
//     if (statusUpper === 'FAILED') return 'bg-red-500 text-white';
//     return 'bg-gray-500 text-white';
// };

// const formatDateToDDMMYYYY = (date: Date): string => {
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
// };

// const truncateString = (str: string | null | undefined, maxLength: number = 15): string => {
//     if (!str) return 'N/A';
//     return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
// };

// export default function SweepSettlementPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('VIEW_SETTLEMENTS', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to view settlements"
//     });
//     const router = useRouter();
//     const queryClient = useQueryClient();

//     const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
//     const [tranDate, setTranDate] = useState<Date>(new Date());
//     const [page, setPage] = useState(1);
//     const [isRefreshing, setIsRefreshing] = useState(false);
//     const pageSize = 1000;

//     const [merchantSearch, setMerchantSearch] = useState('');
//     const debouncedMerchantSearch = useDebounce(merchantSearch, 300);

//     const {
//         data: merchantsData,
//         isLoading: merchantsLoading,
//         error: merchantsError,
//         refetch: refetchMerchants
//     } = useQuery({
//         queryKey: ['merchants-for-sweep', debouncedMerchantSearch],
//         queryFn: () =>
//             axiosOperations.request({
//                 method: 'GET',
//                 url: '/merchant/all',
//                 params: {
//                     pageNumber: 1,
//                     pageSize: 100,
//                     name: debouncedMerchantSearch || undefined,
//                 },
//             }).then(res => res.data),
//         staleTime: 5 * 60 * 1000,
//     });

//     const {
//         data: settlementData,
//         isLoading: settlementLoading,
//         error: settlementError,
//         refetch: refetchSettlements
//     } = useQuery<ApiResponse>({
//         queryKey: ['settlement-transactions', selectedMerchant?.merchantId, tranDate, page],
//         queryFn: async () => {
//             const params: any = {
//                 tranDate: formatDateToDDMMYYYY(tranDate),
//                 status: '',
//                 pageNumber: page,
//                 pageSize: pageSize,
//             };

//             if (selectedMerchant?.merchantId) {
//                 params.merchantCode = selectedMerchant.merchantId;
//             }

//             const response = await axiosOperations.request({
//                 method: 'GET',
//                 url: '/ecommerce-settlement/list',
//                 params,
//             });
//             return response.data;
//         },
//         enabled: true,
//         retry: 1,
//     });

//     useEffect(() => {
//         refetchSettlements();
//     }, [tranDate, refetchSettlements]);

//     const generateMutation = useMutation({
//         mutationFn: () => {
//             const params: any = {
//                 tranDate: formatDateToDDMMYYYY(tranDate),
//             };

//             if (selectedMerchant?.merchantId) {
//                 params.merchantCode = selectedMerchant.merchantId;
//             }

//             return axiosOperations.request({
//                 method: 'GET',
//                 url: '/ecommerce-settlement/generate',
//                 params,
//             });
//         },
//         onSuccess: (response) => {
//             const data = response.data;
//             if (data?.code === '000' || data?.responseCode === '00') {
//                 toast.success(selectedMerchant
//                     ? `Settlements generated for ${selectedMerchant.businessName}`
//                     : 'Settlements generated successfully for all merchants'
//                 );
//                 refetchSettlements();
//             } else {
//                 toast.error(data?.desc || data?.responseMessage || 'Failed to generate settlements');
//             }
//         },
//         onError: (error: any) => {
//             toast.error(error?.response?.data?.message || 'Error generating settlement transactions');
//         },
//     });

//     const postToBankMutation = useMutation({
//         mutationFn: () => {
//             const params: any = {
//                 tranDate: formatDateToDDMMYYYY(tranDate),
//             };

//             if (selectedMerchant?.merchantId) {
//                 params.merchantCode = selectedMerchant.merchantId;
//             }

//             return axiosOperations.request({
//                 method: 'GET',
//                 url: '/sweep/postToBank',
//                 params,
//             });
//         },
//         onSuccess: (response) => {
//             const data = response.data;
//             if (data?.code === '000' || data?.responseCode === '00') {
//                 toast.success(selectedMerchant
//                     ? `Settlements posted to bank for ${selectedMerchant.businessName}`
//                     : 'Settlements posted to bank successfully for all merchants'
//                 );
//                 refetchSettlements();
//             } else {
//                 toast.error(data?.desc || data?.responseMessage || 'Failed to post settlements to bank');
//             }
//         },
//         onError: (error: any) => {
//             toast.error(error?.response?.data?.message || 'Error posting settlements to bank');
//         },
//     });

//     const handleRefresh = () => {
//         setIsRefreshing(true);
//         Promise.all([
//             refetchMerchants(),
//             refetchSettlements()
//         ]).finally(() => setIsRefreshing(false));
//     };

//     const handlePageChange = (newPage: number) => {
//         setPage(newPage);
//     };

//     const handleGenerateSettlements = () => {
//         if (!tranDate) {
//             toast.error('Please select a transaction date');
//             return;
//         }
//         generateMutation.mutate();
//     };

//     const handlePostToBank = () => {
//         if (!tranDate) {
//             toast.error('Please select a transaction date');
//             return;
//         }
//         postToBankMutation.mutate();
//     };

//     const handleClearMerchantFilter = () => {
//         setSelectedMerchant(null);
//         setPage(1);
//     };

//     const handleViewDetails = (tranRefNo: string) => {
//         router.push(`/operations/settlements/${tranRefNo}`);
//     };

//     const merchants: Merchant[] = merchantsData?.content?.map((merchant: any) => ({
//         id: merchant.merchantId,
//         merchantId: merchant.merchantId,
//         businessName: merchant.businessName,
//         name: merchant.businessName,
//     })) || [];

//     const transactions: SettlementTransaction[] = settlementData?.transactions || [];
//     const totalCount = settlementData?.totalCount || 0;
//     const totalPages = settlementData?.totalPages || Math.ceil(totalCount / pageSize);

//     const columns: any[] = [
//         {
//             title: 'S/N',
//             dataIndex: 'id',
//             key: 'sn',
//             width: 80,
//             render: (_: any, __: any, index: number) => (
//                 <span className="text-accent-foreground">{(page - 1) * pageSize + index + 1}</span>
//             ),
//         },
//         {
//             title: 'Tran Ref No',
//             dataIndex: 'tranRefNo',
//             key: 'tranRefNo',
//             width: 180,
//             render: (text: string) => (
//                 <span className="font-mono text-accent-foreground" title={text}>
//                     {truncateString(text, 12)}
//                 </span>
//             ),
//         },
//         {
//             title: 'Tran Date',
//             dataIndex: 'tranDate',
//             key: 'tranDate',
//             width: 150,
//             render: (text: string) => (
//                 <span className="text-accent-foreground/80 whitespace-nowrap">{text}</span>
//             ),
//         },
//         {
//             title: 'Tran Type',
//             dataIndex: 'tranType',
//             key: 'tranType',
//             width: 180,
//             render: (type: string) => (
//                 <span className="text-accent-foreground/80" title={type}>
//                     {truncateString(type, 15)}
//                 </span>
//             ),
//         },
//         {
//             title: 'Amount',
//             dataIndex: 'amount',
//             key: 'amount',
//             width: 120,
//             render: (amount: number) => (
//                 <span className="font-semibold text-green-700 whitespace-nowrap">
//                     ₦{(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </span>
//             ),
//         },
//         {
//             title: 'Status',
//             dataIndex: 'status',
//             key: 'status',
//             width: 120,
//             render: (status: string) => (
//                 <Badge className={`${getStatusColor(status)} text-xs px-2 py-1 whitespace-nowrap`}>
//                     {status || 'UNKNOWN'}
//                 </Badge>
//             ),
//         },
//         {
//             title: 'Beneficiary',
//             dataIndex: 'beneficiaryName',
//             key: 'beneficiaryName',
//             width: 150,
//             render: (name: string) => (
//                 <span className="text-accent-foreground/80" title={name}>
//                     {truncateString(name, 12) || 'N/A'}
//                 </span>
//             ),
//         },
//         {
//             title: 'Actions',
//             key: 'actions',
//             width: 100,
//             render: (_: any, record: SettlementTransaction) => (
//                 <Button
//                     variant="ghost"
//                     size="sm"
//                     className="p-1 hover:bg-accent/10"
//                     onClick={() => handleViewDetails(record.tranRefNo)}
//                     title="View Details"
//                 >
//                     <Eye className="w-4 h-4 text-accent-foreground" />
//                 </Button>
//             ),
//         },
//     ];

//     const isLoading = merchantsLoading || settlementLoading || generateMutation.isPending || postToBankMutation.isPending;

//     return (
//         <div className="min-h-screen bg-white">
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center justify-between mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-accent-foreground mb-2">
//                             Sweep Settlement
//                         </h1>
//                         <p className="text-accent-foreground/70">
//                             Manage and process settlement transactions
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
//                         <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
//                             <Filter className="w-5 h-5" />
//                             Filters & Actions
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="p-6">
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                             <div className="space-y-2">
//                                 <Label className="text-accent-foreground font-medium flex items-center justify-between">
//                                     <span>Merchant</span>
//                                     {selectedMerchant && (
//                                         <button
//                                             onClick={handleClearMerchantFilter}
//                                             className="text-xs text-accent hover:underline"
//                                         >
//                                             Clear filter
//                                         </button>
//                                     )}
//                                 </Label>
//                                 <Select
//                                     value={selectedMerchant?.merchantId || ''}
//                                     onValueChange={(value) => {
//                                         const merchant = merchants.find(m => m.merchantId === value);
//                                         setSelectedMerchant(merchant || null);
//                                         setPage(1);
//                                     }}
//                                 >
//                                     <SelectTrigger className="border-accent/20">
//                                         <SelectValue placeholder="All Merchants" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="all">All Merchants</SelectItem>
//                                         {merchants.map((merchant) => (
//                                             <SelectItem key={merchant.id} value={merchant.merchantId}>
//                                                 {merchant.businessName} • {merchant.merchantId}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="tranDate" className="text-accent-foreground">Transaction Date</Label>
//                                 <Input
//                                     id="tranDate"
//                                     type="date"
//                                     value={tranDate.toISOString().split('T')[0]}
//                                     onChange={(e) => {
//                                         setTranDate(new Date(e.target.value));
//                                         setPage(1);
//                                     }}
//                                     className="bg-white border-accent/20 focus:border-accent"
//                                     max={new Date().toISOString().split('T')[0]}
//                                 />
//                             </div>

//                             <div className="space-y-2">
//                                 <Label className="text-accent-foreground font-medium opacity-0">Actions</Label>
//                                 <div className="flex gap-2">
//                                     <Button
//                                         onClick={handleGenerateSettlements}
//                                         disabled={generateMutation.isPending}
//                                         className="flex-1 bg-accent hover:bg-accent/90 text-white"
//                                     >
//                                         {generateMutation.isPending ? (
//                                             <>
//                                                 <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
//                                                 Generating...
//                                             </>
//                                         ) : (
//                                             'Generate'
//                                         )}
//                                     </Button>
//                                     {/* <Button
//                                         onClick={handlePostToBank}
//                                         disabled={postToBankMutation.isPending}
//                                         variant="outline"
//                                         className="flex-1"
//                                     >
//                                         {postToBankMutation.isPending ? (
//                                             <>
//                                                 <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
//                                                 Posting...
//                                             </>
//                                         ) : (
//                                             'Post to Bank'
//                                         )}
//                                     </Button> */}
//                                 </div>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card className="border-accent/20 shadow-sm">
//                     <CardHeader className="border-b border-accent/10">
//                         <div className="flex items-center justify-between">
//                             <div className='flex gap-4'>
//                                 <CardTitle className="text-lg font-semibold text-accent-foreground">
//                                     Settlement Transactions
//                                 </CardTitle>
//                                 {selectedMerchant && (
//                                     <Badge className="bg-accent/20 text-accent-foreground">
//                                         Filter: {selectedMerchant.businessName}
//                                     </Badge>
//                                 )}
//                             </div>
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={handleRefresh}
//                                 disabled={isRefreshing}
//                                 className=""
//                             >
//                                 <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
//                                 Refresh
//                             </Button>
//                         </div>
//                     </CardHeader>
//                     <CardContent className="p-0">
//                         {settlementError ? (
//                             <div className="p-12 text-center">
//                                 <p className="text-red-500 mb-2">Error loading settlement transactions</p>
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => refetchSettlements()}
//                                     className="border-accent/20 hover:bg-accent/10"
//                                 >
//                                     Try Again
//                                 </Button>
//                             </div>
//                         ) : settlementLoading ? (
//                             <div className="p-12 text-center">
//                                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
//                                 <p className="mt-2 text-accent-foreground/70">Loading transactions...</p>
//                             </div>
//                         ) : transactions.length > 0 ? (
//                             <>
//                                 <DynamicTable
//                                     columns={columns}
//                                     data={transactions.map(t => ({ ...t, id: t.id }))}
//                                     itemsPerPage={pageSize}
//                                 />

//                                 {totalPages > 1 && (
//                                     <div className="flex justify-end p-4 border-t border-accent/10">
//                                         <div className="flex items-center gap-2">
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 onClick={() => handlePageChange(page - 1)}
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
//                                                 onClick={() => handlePageChange(page + 1)}
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
//                                     No settlement transactions found
//                                 </h3>
//                                 <p className="text-accent-foreground/70 mb-4">
//                                     {selectedMerchant
//                                         ? `No transactions found for ${selectedMerchant.businessName} on ${formatDateToDDMMYYYY(tranDate)}`
//                                         : `No transactions found for ${formatDateToDDMMYYYY(tranDate)}`}
//                                 </p>
//                                 <Button
//                                     onClick={handleGenerateSettlements}
//                                     className="bg-accent hover:bg-accent/90 text-white"
//                                 >
//                                     Generate New Settlements
//                                 </Button>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// }

'use client'
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Eye, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';
import { TransInflowIcon, SeperatorIcon, SettingIconGray } from '@/components/icons/icons';
import { SettlementDetailsModal } from '@/components/Operations/settlements/settlement-details';
import { DatePicker } from '@/components/ui/date-picker';
import { format, parse } from 'date-fns';
import Papa from 'papaparse';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface SettlementTransaction {
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

interface Merchant {
    id: string;
    merchantId: string;
    businessName: string;
    name: string;
}

interface ApiResponse {
    totalCount: number;
    totalPages: number;
    responseCode: string | null;
    responseMessage: string | null;
    transactions: SettlementTransaction[];
}

const getStatusColor = (status: string): string => {
    const statusUpper = status?.toUpperCase() || '';
    if (statusUpper === 'SUCCESSFUL' || statusUpper === 'SUCCESS') return 'bg-green-100 text-green-700 border-green-200';
    if (statusUpper === 'PENDING' || statusUpper === 'PROCESSING') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (statusUpper === 'FAILED') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
};

const getDisplayValue = (value: any): string => value?.toString() || 'N/A';

const formatCurrency = (amount: number): string => {
    return `₦${(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

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
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Settlements per Page</p>
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

export default function SweepSettlementPage() {
    usePageMetadata('Sweep Settlement', 'Manage and process settlement transactions.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('VIEW_SETTLEMENTS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to view settlements"
    });

    const router = useRouter();
    const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
    const [tranDate, setTranDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [currentPage, setCurrentPage] = useState(1);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedRef, setSelectedRef] = useState<string | null>(null);
    const ITEMS_PER_PAGE = 10;

    const { data: merchantsData } = useQuery({
        queryKey: ['merchants-for-sweep'],
        queryFn: () => axiosOperations.request({
            method: 'GET',
            url: '/merchant/all',
            params: { pageNumber: 1, pageSize: 5000, name: '' },
        }).then(res => res.data),
    });

    const {
        data: settlementData,
        isLoading: settlementLoading,
        error: settlementError,
        refetch: refetchSettlements
    } = useQuery<ApiResponse>({
        queryKey: ['settlement-transactions', selectedMerchant?.merchantId, tranDate],
        queryFn: async () => {
            const params: any = {
                tranDate: datePickerToAPI(tranDate),
                status: '',
                pageNumber: 1,
                pageSize: 1000,
            };

            if (selectedMerchant?.merchantId) {
                params.merchantCode = selectedMerchant.merchantId;
            }

            const response = await axiosOperations.request({
                method: 'GET',
                url: '/ecommerce-settlement/list',
                params,
            });
            return response.data;
        },
        enabled: true,
        retry: 1,
        throwOnError: false,
    });

    const merchants: Merchant[] = merchantsData?.content?.map((merchant: any) => ({
        id: merchant.merchantId,
        merchantId: merchant.merchantId,
        businessName: merchant.businessName,
        name: merchant.businessName,
    })) || [];

    const transactions: SettlementTransaction[] = settlementData?.transactions || [];
    const totalCount = settlementData?.totalCount || 0;

    const paginated = transactions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const generateMutation = useMutation({
        mutationFn: () => {
            const params: any = {
                tranDate: datePickerToAPI(tranDate),
            };

            if (selectedMerchant?.merchantId) {
                params.merchantCode = selectedMerchant.merchantId;
            }

            return axiosOperations.request({
                method: 'GET',
                url: '/ecommerce-settlement/generate',
                params,
            });
        },
        onSuccess: (response) => {
            const data = response.data;
            if (data?.code === '000' || data?.responseCode === '00') {
                toast.success(selectedMerchant
                    ? `Settlements generated for ${selectedMerchant.businessName}`
                    : 'Settlements generated successfully for all merchants'
                );
                refetchSettlements();
            } else {
                toast.error(data?.desc || data?.responseMessage || 'Failed to generate settlements');
            }
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Error generating settlement transactions');
        },
    });

    const handleViewDetails = (tranRefNo: string) => {
        setSelectedRef(tranRefNo);
        setIsDetailsOpen(true);
    };

    const handleSettings = (tranRefNo: string) => {
        router.push(`/operations/settlements/${tranRefNo}`);
    };

    const exportToCSV = () => {
        if (!transactions.length) { toast.error('No data to export'); return; }
        const csv = Papa.unparse(transactions.map((t) => ({
            'Ref No': t.tranRefNo, 'Date': t.tranDate, 'Type': t.tranType,
            'Amount': t.amount, 'Status': t.status, 'Beneficiary': t.beneficiaryName,
        })), { header: true });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = `settlements-${new Date().toISOString().split('T')[0]}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Export complete');
    };

    return (
        <div className="min-h-screen px-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                    <p className="text-sm text-medium-gray mb-1">Total Settlements</p>
                    <p className="text-2xl font-semibold text-dark-gray">{totalCount.toLocaleString()}</p>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Select
                            value={selectedMerchant?.merchantId || 'all'}
                            onValueChange={(value) => {
                                const merchant = merchants.find(m => m.merchantId === value);
                                setSelectedMerchant(merchant || null);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="bg-white w-48">
                                <SelectValue placeholder="All Merchants" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Merchants</SelectItem>
                                {merchants.map((merchant) => (
                                    <SelectItem key={merchant.id} value={merchant.merchantId}>
                                        {merchant.businessName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="w-36">
                            <DatePicker
                                value={tranDate}
                                onChange={(dateString) => { setTranDate(dateString); setCurrentPage(1); }}
                                placeholder="Select date"
                            />
                        </div>

                        {selectedMerchant && (
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedMerchant(null); setCurrentPage(1); }} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Button onClick={exportToCSV} size="lg" variant="outline">
                            <TransInflowIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                        <Button
                            onClick={() => generateMutation.mutate()}
                            disabled={generateMutation.isPending}
                            size="lg"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            {generateMutation.isPending ? 'Generating...' : 'Generate'}
                        </Button>
                    </div>
                </div>
            </div>

            {settlementLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                </div>
            ) : settlementError ? (
                <div className="flex items-center justify-center py-20">
                    <p className="text-red-400 text-sm">Error loading settlement transactions</p>
                </div>
            ) : transactions.length > 0 ? (
                <div className="hidden lg:block">
                    <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b-2 border-[#EEEEEE]">
                                    {['S/N', 'Ref No', 'Date', 'Type', 'Amount', 'Status', 'Beneficiary', ''].map((h) => (
                                        <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((t, idx) => (
                                    <tr key={t.id || idx}
                                        onClick={() => handleViewDetails(t.tranRefNo)}
                                        className={`border-b-2 border-[#EEEEEE] cursor-pointer hover:bg-orange-50/40 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
                                        <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</p></td>
                                        <td className="px-3 py-3.5"><p className="text-sm font-mono font-medium text-dark-gray max-w-[150px] truncate">{getDisplayValue(t.tranRefNo)}</p></td>
                                        <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{getDisplayValue(t.tranDate)}</p></td>
                                        <td className="px-3 py-3.5"><p className="text-sm text-dark-gray max-w-[150px] truncate">{getDisplayValue(t.tranType)}</p></td>
                                        <td className="px-3 py-3.5"><p className="text-sm font-semibold text-green-700">{formatCurrency(t.amount)}</p></td>
                                        <td className="px-3 py-3.5"><Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(t.status)}`}>{t.status}</Badge></td>
                                        <td className="px-3 py-3.5"><p className="text-sm text-dark-gray max-w-[120px] truncate">{getDisplayValue(t.beneficiaryName)}</p></td>
                                        <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center gap-1">
                                                <Button size="xs" variant="action" onClick={() => handleViewDetails(t.tranRefNo)} title="View"><Eye className="w-4 h-4" /></Button>
                                                <Button size="xs" variant="action" onClick={() => handleSettings(t.tranRefNo)} title="Settings"><SettingIconGray className="w-4 h-4" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {Math.ceil(transactions.length / ITEMS_PER_PAGE) > 1 && (
                        <TablePagination current={currentPage} total={transactions.length} perPage={ITEMS_PER_PAGE} onChange={setCurrentPage} />
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <p className="text-2xl font-medium text-dark-gray">No settlement transactions found</p>
                    <p className="text-sm text-medium-gray">
                        {selectedMerchant
                            ? `No transactions found for ${selectedMerchant.businessName} on ${tranDate}`
                            : `No transactions found for ${tranDate}`}
                    </p>
                    <Button
                        onClick={() => generateMutation.mutate()}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                        Generate New Settlements
                    </Button>
                </div>
            )}

            <SettlementDetailsModal
                settlementRef={selectedRef}
                open={isDetailsOpen}
                onClose={() => { setIsDetailsOpen(false); setSelectedRef(null); }}
            />
        </div>
    );
}