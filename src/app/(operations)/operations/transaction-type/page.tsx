'use client'
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RefreshCw, Search, Filter, Plus, Eye, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import DynamicTable from '@/components/Operations/transaction-type/dynamic-table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import useOperations from '@/store/operationsStore';
import TransactionTypeViewModal from '@/components/Operations/transaction-type/trans-type-view';
import TransactionTypeEditModal from '@/components/Operations/transaction-type/trans-type-edit';
import { usePermission } from '@/hooks/usePermission';

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
    feeDetail: null | any;
    glCodeCommission: string | null;
    glCode: string | null;
    branchCode: string;
    tax: number;
    setupRefNo: string;
    feeTiers: null | any;
    commissionParties: null | any;
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
    if (statusUpper === 'ACTIVE') return 'bg-accent text-white';
    if (statusUpper === 'INACTIVE') return 'bg-red-500 text-white';
    return 'bg-gray-500 text-white';
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount || 0);
};

const truncateString = (str: string | null | undefined, maxLength: number = 15): string => {
    if (!str) return 'N/A';
    return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
};

export default function TransactionTypePage() {
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('MANAGE_TRANS_TYPE', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage transaction type"
    });

    const router = useRouter();
    const { operations } = useOperations();

    const [page, setPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTranCode, setSelectedTranCode] = useState<string>('');
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);
    const pageSize = 15;

    const [transactionCodeOptions, setTransactionCodeOptions] = useState<{ value: string; label: string }[]>([]);

    const { data: tranCodeData, isLoading: tranCodeLoading } = useQuery({
        queryKey: ['tran-code-options'],
        queryFn: () =>
            axiosOperations.request({
                method: 'GET',
                url: '/lookupdata/new-list',
                params: {
                    categoryCode: 'TRAN_CODE',
                    entityCode: process.env.NEXT_PUBLIC_ENTITYCODE
                }
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

    const {
        data: response,
        isLoading: loading,
        error,
        refetch: refetchTypes
    } = useQuery<ApiResponse>({
        queryKey: ['transaction-types', page, selectedTranCode],
        queryFn: () =>
            axiosOperations.request({
                method: 'GET',
                url: '/transTypeSetup/getTransactionTypes',
                params: {
                    pageNumber: page,
                    pageSize: 100,
                    entityCode: operations?.entityCode,
                    tranCode: selectedTranCode || undefined,
                },
            }).then(res => res.data),
    });

    const handleRefresh = () => {
        setIsRefreshing(true);
        refetchTypes().finally(() => setIsRefreshing(false));
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleFilterChange = (value: string) => {
        setSelectedTranCode(value === 'all' ? '' : value);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSelectedTranCode('');
        setPage(1);
    };

    const handleCreate = () => {
        router.push('/operations/transaction-type/create');
    };

    const handleView = (record: TransactionType) => {
        setSelectedTransaction(record);
        setViewModalOpen(true);
    };

    const handleEdit = (record: TransactionType) => {
        setSelectedTransaction(record);
        setEditModalOpen(true);
    };

    const allTransactionTypes: TransactionType[] = response?.data || [];

    const filteredTypes = selectedTranCode
        ? allTransactionTypes.filter(t => t.tranCode === selectedTranCode)
        : allTransactionTypes;

    const totalCount = filteredTypes.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    const paginatedTypes = filteredTypes.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const columns: any[] = [
        {
            title: 'S/N',
            dataIndex: 'id',
            key: 'sn',
            width: 80,
            render: (_: any, __: any, index: number) => (
                <span className="text-accent-foreground">{(page - 1) * pageSize + index + 1}</span>
            ),
        },
        {
            title: 'Transaction Code',
            dataIndex: 'tranCode',
            key: 'tranCode',
            width: 150,
            render: (code: string) => (
                <span className="font-mono text-accent-foreground">{code || 'N/A'}</span>
            ),
        },
        {
            title: 'Transaction Name',
            dataIndex: 'tranName',
            key: 'tranName',
            width: 200,
            render: (name: string) => (
                <span className="text-accent-foreground" title={name}>
                    {truncateString(name, 20)}
                </span>
            ),
        },
        {
            title: 'Min Limit (₦)',
            dataIndex: 'minLimit',
            key: 'minLimit',
            width: 120,
            render: (limit: number) => (
                <span className="text-accent-foreground/80">{formatCurrency(limit)}</span>
            ),
        },
        {
            title: 'Max Limit (₦)',
            dataIndex: 'maxLimit',
            key: 'maxLimit',
            width: 120,
            render: (limit: number) => (
                <span className="text-accent-foreground/80">{formatCurrency(limit)}</span>
            ),
        },
        {
            title: 'Daily Limit (₦)',
            dataIndex: 'dailyLimit',
            key: 'dailyLimit',
            width: 120,
            render: (limit: number) => (
                <span className="text-accent-foreground/80">{formatCurrency(limit)}</span>
            ),
        },
        {
            title: 'Charge Type',
            dataIndex: 'chargeType',
            key: 'chargeType',
            width: 120,
            render: (type: string) => (
                <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
                    {type?.toUpperCase() || 'N/A'}
                </Badge>
            ),
        },
        {
            title: 'Charge (₦/%)',
            dataIndex: 'charge',
            key: 'charge',
            width: 100,
            render: (charge: number) => (
                <span className="text-accent-foreground">{formatCurrency(charge)}</span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => (
                <Badge className={`${getStatusColor(status)} text-xs px-2 py-1 whitespace-nowrap`}>
                    {status || 'UNKNOWN'}
                </Badge>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_: any, record: TransactionType) => (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-accent/10"
                        onClick={() => handleView(record)}
                        title="View Details"
                    >
                        <Eye className="w-4 h-4 text-accent-foreground" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-accent/10"
                        onClick={() => handleEdit(record)}
                        title="Edit"
                    >
                        <Edit className="w-4 h-4 text-accent-foreground" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-accent-foreground mb-2">
                            Transaction Types
                        </h1>
                        <p className="text-accent-foreground/70">
                            Manage transaction types and their configurations
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-2xl font-bold text-accent-foreground">{totalCount}</p>
                            <p className="text-sm text-accent-foreground/70">Total Types</p>
                        </div>
                    </div>
                </div>

                <Card className="border-accent/20 shadow-sm mb-6">
                    <CardHeader className="border-b border-accent/10">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Filters
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </Button>
                        </div>
                    </CardHeader>
                    {showFilters && (
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tranCode" className="text-accent-foreground">Transaction Code</Label>
                                    <Select
                                        value={selectedTranCode || 'all'}
                                        onValueChange={handleFilterChange}
                                    >
                                        <SelectTrigger id="tranCode" className="border-accent/20">
                                            <SelectValue placeholder="All Codes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Codes</SelectItem>
                                            {transactionCodeOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-accent/10">
                                <Button
                                    variant="outline"
                                    onClick={handleClearFilters}
                                    className="border-accent/20 hover:bg-accent/10"
                                >
                                    Clear Filters
                                </Button>
                                <Button
                                    onClick={() => refetchTypes()}
                                    className="bg-accent hover:bg-accent/90 text-white"
                                >
                                    <Search className="w-4 h-4 mr-2" />
                                    Apply Filters
                                </Button>
                            </div>
                        </CardContent>
                    )}
                </Card>

                <Card className="border-accent/20 shadow-sm">
                    <CardHeader className="border-b border-accent/10">
                        <div className='flex items-center justify-between'>
                            <div className="">
                                <CardTitle className="text-lg font-semibold text-accent-foreground">
                                    Transaction Types List
                                </CardTitle>
                            </div>
                            <div className='flex items-center gap-4'>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="border-accent/20 hover:bg-accent/10"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                                <Button
                                    onClick={handleCreate}
                                    className="bg-accent hover:bg-accent/90 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Transaction Type
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {error ? (
                            <div className="p-12 text-center">
                                <p className="text-red-500 mb-2">Error loading transaction types</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetchTypes()}
                                    className="border-accent/20 hover:bg-accent/10"
                                >
                                    Try Again
                                </Button>
                            </div>
                        ) : loading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                                <p className="mt-2 text-accent-foreground/70">Loading transaction types...</p>
                            </div>
                        ) : paginatedTypes.length > 0 ? (
                            <>
                                <DynamicTable
                                    columns={columns}
                                    data={paginatedTypes}
                                    itemsPerPage={pageSize}
                                />

                                {totalPages > 1 && (
                                    <div className="flex justify-end p-4 border-t border-accent/10">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(page - 1)}
                                                disabled={page === 1}
                                                className="border-accent/20 hover:bg-accent/10"
                                            >
                                                Previous
                                            </Button>
                                            <span className="text-sm text-accent-foreground/70 px-2">
                                                Page {page} of {totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={page === totalPages}
                                                className="border-accent/20 hover:bg-accent/10"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                                    <Search className="h-12 w-12 text-accent-foreground/50" />
                                </div>
                                <h3 className="text-lg font-medium text-accent-foreground mb-2">
                                    No transaction types found
                                </h3>
                                <p className="text-accent-foreground/70 mb-4">
                                    {selectedTranCode
                                        ? `No types found for code: ${selectedTranCode}`
                                        : 'Get started by creating your first transaction type'}
                                </p>
                                <Button
                                    onClick={handleCreate}
                                    className="bg-accent hover:bg-accent/90 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Transaction Type
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <TransactionTypeViewModal
                    open={viewModalOpen}
                    onOpenChange={setViewModalOpen}
                    transaction={selectedTransaction}
                />

                <TransactionTypeEditModal
                    open={editModalOpen}
                    onOpenChange={setEditModalOpen}
                    transaction={selectedTransaction}
                    onSuccess={() => {
                        refetchTypes();
                    }}
                />
            </div>
        </div>
    );
}