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
// import { RefreshCw, Search, Filter, Plus, Eye, Edit, Trash2 } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import DynamicTable from '@/components/Operations/transaction-type/dynamic-table';
// import { Badge } from '@/components/ui/badge';
// import { useRouter } from 'next/navigation';
// import useOperations from '@/store/operationsStore';
// import TransactionTypeViewModal from '@/components/Operations/transaction-type/trans-type-view';
// import TransactionTypeEditModal from '@/components/Operations/transaction-type/trans-type-edit';
// import { usePermission } from '@/hooks/usePermission';
// import TransactionTypeDeleteModal from '@/components/Operations/transaction-type/trans-type-delete';

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
//     feeDetail: null | any;
//     glCodeCommission: string | null;
//     glCode: string | null;
//     branchCode: string;
//     tax: number;
//     setupRefNo: string;
//     feeTiers: null | any;
//     commissionParties: null | any;
//     minHardTokenLimit: number;
//     maxHardTokenLimit: number;
//     dailyHardTokenLimit: number;
//     capLimit: number;
// }

// interface ApiResponse {
//     code: string;
//     description: string;
//     data: TransactionType[];
// }

// const getStatusColor = (status: string): string => {
//     const statusUpper = status?.toUpperCase() || '';
//     if (statusUpper === 'ACTIVE') return 'bg-accent text-white';
//     if (statusUpper === 'INACTIVE') return 'bg-red-500 text-white';
//     return 'bg-gray-500 text-white';
// };

// const formatCurrency = (amount: number): string => {
//     return new Intl.NumberFormat('en-NG', {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//     }).format(amount || 0);
// };

// const truncateString = (str: string | null | undefined, maxLength: number = 15): string => {
//     if (!str) return 'N/A';
//     return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
// };

// export default function TransactionTypePage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('MANAGE_TRANS_TYPE', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to manage transaction type"
//     });

//     const router = useRouter();
//     const { operations } = useOperations();

//     const [page, setPage] = useState(1);
//     const [isRefreshing, setIsRefreshing] = useState(false);
//     const [showFilters, setShowFilters] = useState(false);
//     const [selectedTranCode, setSelectedTranCode] = useState<string>('');
//     const [viewModalOpen, setViewModalOpen] = useState(false);
//     const [editModalOpen, setEditModalOpen] = useState(false);
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);
//     const pageSize = 15;

//     const [transactionCodeOptions, setTransactionCodeOptions] = useState<{ value: string; label: string }[]>([]);

//     const { data: tranCodeData, isLoading: tranCodeLoading } = useQuery({
//         queryKey: ['tran-code-options'],
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
//         if (tranCodeData?.data?.list) {
//             const codes = tranCodeData.data.list.map((item: { code: string; name: string }) => ({
//                 value: item.code,
//                 label: `${item.code} - ${item.name}`
//             }));
//             setTransactionCodeOptions(codes);
//         }
//     }, [tranCodeData]);

//     const {
//         data: response,
//         isLoading: loading,
//         error,
//         refetch: refetchTypes
//     } = useQuery<ApiResponse>({
//         queryKey: ['transaction-types', page, selectedTranCode],
//         queryFn: () =>
//             axiosOperations.request({
//                 method: 'GET',
//                 url: '/transTypeSetup/getTransactionTypes',
//                 params: {
//                     pageNumber: page,
//                     pageSize: 100,
//                     entityCode: operations?.entityCode,
//                     tranCode: selectedTranCode || undefined,
//                 },
//             }).then(res => res.data),
//     });

//     const handleRefresh = () => {
//         setIsRefreshing(true);
//         refetchTypes().finally(() => setIsRefreshing(false));
//     };

//     const handlePageChange = (newPage: number) => {
//         setPage(newPage);
//     };

//     const handleFilterChange = (value: string) => {
//         setSelectedTranCode(value === 'all' ? '' : value);
//         setPage(1);
//     };

//     const handleClearFilters = () => {
//         setSelectedTranCode('');
//         setPage(1);
//     };

//     const handleCreate = () => {
//         router.push('/operations/transaction-type/create');
//     };

//     const handleView = (record: TransactionType) => {
//         setSelectedTransaction(record);
//         setViewModalOpen(true);
//     };

//     const handleEdit = (record: TransactionType) => {
//         setSelectedTransaction(record);
//         setEditModalOpen(true);
//     };

//     const handleDelete = (record: TransactionType) => {
//         setSelectedTransaction(record);
//         setDeleteModalOpen(true);
//     };

//     const allTransactionTypes: TransactionType[] = response?.data || [];

//     const filteredTypes = selectedTranCode
//         ? allTransactionTypes.filter(t => t.tranCode === selectedTranCode)
//         : allTransactionTypes;

//     const totalCount = filteredTypes.length;
//     const totalPages = Math.ceil(totalCount / pageSize);

//     const paginatedTypes = filteredTypes.slice(
//         (page - 1) * pageSize,
//         page * pageSize
//     );

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
//             title: 'Transaction Code',
//             dataIndex: 'tranCode',
//             key: 'tranCode',
//             width: 150,
//             render: (code: string) => (
//                 <span className="font-mono text-accent-foreground">{code || 'N/A'}</span>
//             ),
//         },
//         {
//             title: 'Transaction Name',
//             dataIndex: 'tranName',
//             key: 'tranName',
//             width: 200,
//             render: (name: string) => (
//                 <span className="text-accent-foreground" title={name}>
//                     {truncateString(name, 20)}
//                 </span>
//             ),
//         },
//         {
//             title: 'Min Limit (₦)',
//             dataIndex: 'minLimit',
//             key: 'minLimit',
//             width: 120,
//             render: (limit: number) => (
//                 <span className="text-accent-foreground/80">{formatCurrency(limit)}</span>
//             ),
//         },
//         {
//             title: 'Max Limit (₦)',
//             dataIndex: 'maxLimit',
//             key: 'maxLimit',
//             width: 120,
//             render: (limit: number) => (
//                 <span className="text-accent-foreground/80">{formatCurrency(limit)}</span>
//             ),
//         },
//         {
//             title: 'Daily Limit (₦)',
//             dataIndex: 'dailyLimit',
//             key: 'dailyLimit',
//             width: 120,
//             render: (limit: number) => (
//                 <span className="text-accent-foreground/80">{formatCurrency(limit)}</span>
//             ),
//         },
//         {
//             title: 'Charge Type',
//             dataIndex: 'chargeType',
//             key: 'chargeType',
//             width: 120,
//             render: (type: string) => (
//                 <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
//                     {type?.toUpperCase() || 'N/A'}
//                 </Badge>
//             ),
//         },
//         {
//             title: 'Charge (₦/%)',
//             dataIndex: 'charge',
//             key: 'charge',
//             width: 100,
//             render: (charge: number) => (
//                 <span className="text-accent-foreground">{formatCurrency(charge)}</span>
//             ),
//         },
//         {
//             title: 'Status',
//             dataIndex: 'status',
//             key: 'status',
//             width: 100,
//             render: (status: string) => (
//                 <Badge className={`${getStatusColor(status)} text-xs px-2 py-1 whitespace-nowrap`}>
//                     {status || 'UNKNOWN'}
//                 </Badge>
//             ),
//         },
//         {
//             title: 'Actions',
//             key: 'actions',
//             width: 120,
//             render: (_: any, record: TransactionType) => (
//                 <div className="flex items-center gap-1">
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-1 hover:bg-accent/10"
//                         onClick={() => handleView(record)}
//                         title="View Details"
//                     >
//                         <Eye className="w-4 h-4 text-accent-foreground" />
//                     </Button>
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-1 hover:bg-accent/10"
//                         onClick={() => handleEdit(record)}
//                         title="Edit"
//                     >
//                         <Edit className="w-4 h-4 text-accent-foreground" />
//                     </Button>
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-1 hover:bg-accent/10"
//                         onClick={() => handleDelete(record)}
//                         title="Delete"
//                     >
//                         <Trash2 className="w-4 h-4 text-accent-foreground" />
//                     </Button>

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
//                             Transaction Types
//                         </h1>
//                         <p className="text-accent-foreground/70">
//                             Manage transaction types and their configurations
//                         </p>
//                     </div>
//                     <div className="flex items-center gap-4">
//                         <div className="text-right">
//                             <p className="text-2xl font-bold text-accent-foreground">{totalCount}</p>
//                             <p className="text-sm text-accent-foreground/70">Total Types</p>
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
//                             >
//                                 {showFilters ? 'Hide Filters' : 'Show Filters'}
//                             </Button>
//                         </div>
//                     </CardHeader>
//                     {showFilters && (
//                         <CardContent className="p-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="tranCode" className="text-accent-foreground">Transaction Code</Label>
//                                     <Select
//                                         value={selectedTranCode || 'all'}
//                                         onValueChange={handleFilterChange}
//                                     >
//                                         <SelectTrigger id="tranCode" className="border-accent/20">
//                                             <SelectValue placeholder="All Codes" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="all">All Codes</SelectItem>
//                                             {transactionCodeOptions.map((option) => (
//                                                 <SelectItem key={option.value} value={option.value}>
//                                                     {option.label}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
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
//                                     onClick={() => refetchTypes()}
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
//                         <div className='flex items-center justify-between'>
//                             <div className="">
//                                 <CardTitle className="text-lg font-semibold text-accent-foreground">
//                                     Transaction Types List
//                                 </CardTitle>
//                             </div>
//                             <div className='flex items-center gap-4'>
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={handleRefresh}
//                                     disabled={isRefreshing}
//                                     className="border-accent/20 hover:bg-accent/10"
//                                 >
//                                     <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
//                                     Refresh
//                                 </Button>
//                                 <Button
//                                     onClick={handleCreate}
//                                     className="bg-accent hover:bg-accent/90 text-white"
//                                 >
//                                     <Plus className="w-4 h-4 mr-2" />
//                                     Create Transaction Type
//                                 </Button>
//                             </div>
//                         </div>
//                     </CardHeader>
//                     <CardContent className="p-0">
//                         {error ? (
//                             <div className="p-12 text-center">
//                                 <p className="text-red-500 mb-2">Error loading transaction types</p>
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => refetchTypes()}
//                                     className="border-accent/20 hover:bg-accent/10"
//                                 >
//                                     Try Again
//                                 </Button>
//                             </div>
//                         ) : loading ? (
//                             <div className="p-12 text-center">
//                                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
//                                 <p className="mt-2 text-accent-foreground/70">Loading transaction types...</p>
//                             </div>
//                         ) : paginatedTypes.length > 0 ? (
//                             <>
//                                 <DynamicTable
//                                     columns={columns}
//                                     data={paginatedTypes}
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
//                                     No transaction types found
//                                 </h3>
//                                 <p className="text-accent-foreground/70 mb-4">
//                                     {selectedTranCode
//                                         ? `No types found for code: ${selectedTranCode}`
//                                         : 'Get started by creating your first transaction type'}
//                                 </p>
//                                 <Button
//                                     onClick={handleCreate}
//                                     className="bg-accent hover:bg-accent/90 text-white"
//                                 >
//                                     <Plus className="w-4 h-4 mr-2" />
//                                     Create Transaction Type
//                                 </Button>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>

//                 <TransactionTypeViewModal
//                     open={viewModalOpen}
//                     onOpenChange={setViewModalOpen}
//                     transaction={selectedTransaction}
//                 />

//                 <TransactionTypeEditModal
//                     open={editModalOpen}
//                     onOpenChange={setEditModalOpen}
//                     transaction={selectedTransaction}
//                     onSuccess={() => {
//                         refetchTypes();
//                     }}
//                 />

//                 <TransactionTypeDeleteModal
//                     open={deleteModalOpen}
//                     onOpenChange={setDeleteModalOpen}
//                     transaction={selectedTransaction}
//                     onSuccess={() => {
//                         refetchTypes();
//                     }}
//                 />
//             </div>
//         </div>
//     );
// }


'use client'
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Search, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import useOperations from '@/store/operationsStore';
import TransactionTypeViewModal from '@/components/Operations/transaction-type/trans-type-view';
import TransactionTypeDeleteModal from '@/components/Operations/transaction-type/trans-type-delete';
import { usePermission } from '@/hooks/usePermission';
import { PermissionButton } from '@/components/Operations/permission/permission-button';
import { TransInflowIcon, SeperatorIcon, EditIcon, DeleteIconGray } from '@/components/icons/icons';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { usePageMetadata } from '@/hooks/usePageMetadata';

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

interface ApiResponse {
    code: string;
    description: string;
    data: TransactionType[];
}

const getStatusColor = (status: string): string => {
    const statusUpper = status?.toUpperCase() || '';
    if (statusUpper === 'ACTIVE') return 'bg-green-100 text-green-700 border-green-200';
    if (statusUpper === 'INACTIVE') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount || 0);
};

const getDisplayValue = (value: any): string => value?.toString() || 'N/A';

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
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Types per Page</p>
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

export default function TransactionTypePage() {
    usePageMetadata('Transaction Types', 'Manage transaction types and their configurations.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_TRANS_TYPE', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage transaction type"
    });

    const router = useRouter();
    const { operations } = useOperations();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTranCode, setSelectedTranCode] = useState('');
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);
    const ITEMS_PER_PAGE = 10;

    const [transactionCodeOptions, setTransactionCodeOptions] = useState<{ value: string; label: string }[]>([]);

    const { data: tranCodeData } = useQuery({
        queryKey: ['tran-code-options'],
        queryFn: () => axiosOperations.request({
            method: 'GET',
            url: '/lookupdata/new-list',
            params: { categoryCode: 'TRAN_CODE', entityCode: process.env.NEXT_PUBLIC_ENTITYCODE }
        }),
        enabled: true,
    });

    useEffect(() => {
        if (tranCodeData?.data?.list) {
            const codes = tranCodeData.data.list.map((item: { code: string; name: string }) => ({
                value: item.code,
                label: `${item.code} - ${item.name}`
            }));
            setTransactionCodeOptions(codes);
        }
    }, [tranCodeData]);

    const { data: response, isLoading: loading, error, refetch: refetchTypes } = useQuery<ApiResponse>({
        queryKey: ['transaction-types'],
        queryFn: () => axiosOperations.request({
            method: 'GET',
            url: '/transTypeSetup/getTransactionTypes',
            params: {
                pageNumber: 1,
                pageSize: 1000,
                entityCode: operations?.entityCode,
            },
        }).then(res => res.data),
    });

    const allTransactionTypes: TransactionType[] = response?.data || [];

    const filtered = useMemo(() => {
        return allTransactionTypes.filter((t) => {
            const s = searchTerm.toLowerCase().trim();
            const matchesSearch = !s || (
                t.tranName?.toLowerCase().includes(s) ||
                t.tranCode?.toLowerCase().includes(s) ||
                t.customerType?.toLowerCase().includes(s)
            );
            const matchesCode = !selectedTranCode || t.tranCode === selectedTranCode;
            return matchesSearch && matchesCode;
        });
    }, [allTransactionTypes, searchTerm, selectedTranCode]);

    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleView = (record: TransactionType) => {
        setSelectedTransaction(record);
        setViewModalOpen(true);
    };

    const handleEdit = (record: TransactionType) => {
        router.push(`/operations/transaction-type/create?edit=true&id=${record.id}`);
    };

    const handleDelete = (record: TransactionType) => {
        setSelectedTransaction(record);
        setDeleteModalOpen(true);
    };

    const exportToCSV = () => {
        if (!filtered.length) { toast.error('No data to export'); return; }
        const csv = Papa.unparse(filtered.map((t) => ({
            'Code': t.tranCode,
            'Name': t.tranName,
            'Min Limit': t.minLimit,
            'Max Limit': t.maxLimit,
            'Daily Limit': t.dailyLimit,
            'Charge Type': t.chargeType,
            'Charge': t.charge,
            'Status': t.status,
        })), { header: true });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = `transaction-types-${new Date().toISOString().split('T')[0]}.csv`;
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
                    <p className="text-sm text-medium-gray mb-1">Total Types</p>
                    <p className="text-2xl font-semibold text-dark-gray">{filtered.length.toLocaleString()}</p>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="Search by name or code..."
                            className="pl-9 text-medium-gray"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Select value={selectedTranCode || 'all'} onValueChange={(v) => { setSelectedTranCode(v === 'all' ? '' : v); setCurrentPage(1); }}>
                            <SelectTrigger className="bg-white w-44">
                                <SelectValue placeholder="All Codes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Codes</SelectItem>
                                {transactionCodeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {(searchTerm || selectedTranCode) && (
                            <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setSelectedTranCode(''); setCurrentPage(1); }} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )}

                        <SeperatorIcon />
                        <Button onClick={exportToCSV} size="lg" variant="outline">
                            <TransInflowIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                        <PermissionButton
                            requiredPermissions={['MANAGE_TRANS_TYPE']}
                            requireAll={true} hideIfNoPermission={false}
                            tooltipMessage="No permission to create"
                            onClick={() => router.push('/operations/transaction-type/create')}
                            size="lg"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            Create Type
                        </PermissionButton>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading types</div>
            ) : (
                <>
                    <div className="hidden lg:block">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <p className="text-2xl font-medium text-dark-gray">No types found</p>
                                <p className="text-sm text-medium-gray">Try adjusting your search</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#EEEEEE]">
                                                {['Trans. Code', 'Name', 'Min Limit (₦)', 'Max Limit (₦)', 'Daily Limit (₦)', 'Charge Type', 'Charge (₦/%)', 'Status', ''].map((h) => (
                                                    <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map((t, idx) => (
                                                <tr key={t.id}
                                                    onClick={() => handleView(t)}
                                                    className={`border-b-2 border-[#EEEEEE] cursor-pointer hover:bg-orange-50/40 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
                                                    <td className="px-3 py-3.5"><p className="text-sm font-mono font-medium text-dark-gray">{getDisplayValue(t.tranCode)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray max-w-[200px] truncate">{getDisplayValue(t.tranName)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">₦{formatCurrency(t.minLimit)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">₦{formatCurrency(t.maxLimit)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">₦{formatCurrency(t.dailyLimit)}</p></td>
                                                    <td className="px-3 py-3.5"><Badge className="text-[10px] px-2 py-0.5 bg-[#E9CCF4] text-[#9200C7]">{t.chargeType?.toUpperCase() || 'N/A'}</Badge></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">₦{formatCurrency(t.charge)}</p></td>
                                                    <td className="px-3 py-3.5"><Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(t.status)}`}>{t.status}</Badge></td>
                                                    <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center gap-1">
                                                            <Button size="xs" variant="action" onClick={() => handleView(t)} title="View"><Eye className="w-4 h-4" /></Button>
                                                            <PermissionButton requiredPermissions={['MANAGE_TRANS_TYPE']} requireAll={true} hideIfNoPermission={false}
                                                                tooltipMessage="No permission" onClick={() => handleEdit(t)} size="xs" variant="action">
                                                                <EditIcon className="w-4 h-4" />
                                                            </PermissionButton>
                                                            <Button size="xs" variant="action" onClick={() => handleDelete(t)} title="Delete" className="text-red-500 hover:text-red-700">
                                                                <DeleteIconGray className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {Math.ceil(filtered.length / ITEMS_PER_PAGE) > 1 && (
                                    <TablePagination current={currentPage} total={filtered.length} perPage={ITEMS_PER_PAGE} onChange={setCurrentPage} />
                                )}
                            </>
                        )}
                    </div>

                    <div className="lg:hidden space-y-3 py-2">
                        {filtered.map((t) => (
                            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm" onClick={() => handleView(t)}>
                                <div className="flex items-center gap-3 p-4">
                                    <div className="w-10 h-10 shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                                        <span className="text-sm font-bold text-orange-600">{t.tranCode?.charAt(0) || 'T'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-dark-gray truncate">{t.tranName}</p>
                                        <p className="text-xs text-medium-gray mt-0.5 font-mono">{t.tranCode}</p>
                                    </div>
                                    <Badge className={`text-[10px] px-2 py-0.5 border font-medium ${getStatusColor(t.status)}`}>{t.status}</Badge>
                                </div>
                                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                                    <p className="text-xs text-medium-gray">₦{formatCurrency(t.minLimit)} - ₦{formatCurrency(t.maxLimit)}</p>
                                    <div className="flex items-center gap-1">
                                        <Button size="xs" variant="action" onClick={() => handleEdit(t)}><EditIcon className="w-4 h-4" /></Button>
                                        <Button size="xs" variant="action" onClick={() => handleDelete(t)} className="text-red-500"><DeleteIconGray className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <TransactionTypeViewModal open={viewModalOpen} onOpenChange={setViewModalOpen} transaction={selectedTransaction} />
            <TransactionTypeDeleteModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} transaction={selectedTransaction} onSuccess={() => refetchTypes()} />
        </div>
    );
}