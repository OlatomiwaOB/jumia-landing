'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Loader2, Package, Trash2 } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { usePermission } from '@/hooks/usePermission';

interface DeliveryOption {
    id: number;
    area: string;
    groupCode: string;
    estimatedTime: number;
    estimatedTimeType: string;
    deliveryVatRate: number;
    deliveryVatAmount: number;
    capLimit: number;
    amount: number;
}

interface Column {
    title: string;
    dataIndex: string;
    key: string;
    width?: number;
    render?: (value: any, record: DeliveryOption, index: number) => React.ReactNode;
}

const getDisplayValue = (value: any): string => {
    return value?.toString() || 'N/A';
};

const getStatusColor = (groupCode: string): string => {
    switch (groupCode?.toUpperCase()) {
        case 'STANDARD':
            return 'bg-blue-100 text-blue-800';
        case 'EXPRESS':
            return 'bg-green-100 text-green-800';
        case 'PREMIUM':
            return 'bg-purple-100 text-purple-800';
        case 'ECONOMY':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const DeleteDeliveryOption = ({
    isOpen,
    onClose,
    deliveryData,
    // onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    deliveryData: DeliveryOption | null;
    // onSuccess: () => void;
}) => {
    // const [step, setStep] = useState<'confirmation' | 'otp'>('confirmation');
    // const [otp, setOtp] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteDeliveryOptionMutation = useMutation({
        mutationFn: async (payload: { id: number }) => {
            return await axiosOperations.delete(`/delivery/option/remove/${payload.id}`, {
                data: payload,
            });
        },
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Delivery option deleted successfully');
                // onSuccess();
                handleClose();
            } else {
                toast.error(data?.data?.desc || 'Failed to delete delivery option');
                setIsDeleting(false);
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete delivery option');
            setIsDeleting(false);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!deliveryData) return;

        setIsDeleting(true);

        const payload = {
            id: deliveryData.id,
            // otp: otp
        };

        deleteDeliveryOptionMutation.mutate(payload);
    };

    const handleClose = () => {
        setIsDeleting(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className='flex flex-col'>
                    <DialogTitle className="text-destructive">
                        Delete Delivery Option
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this delivery option?
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="font-medium mb-2">Delivery Option Details:</p>
                            <p><strong>Code:</strong> {deliveryData?.groupCode}</p>
                            <p><strong>Amount:</strong> {deliveryData?.amount}</p>
                        </div>

                        <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                            <p className="text-sm text-red-600">
                                <strong>Warning:</strong> This action cannot be undone. The delivery option data will be permanently deleted.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="border-gray-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700 gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                {isDeleting ? 'Deleting...' : 'Delete Option'}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const DynamicTable = ({
    columns,
    data,
    itemsPerPage = 15,
    onViewDetails,
    onEdit,
    onDeleteDetails,
    searchTerm
}: {
    columns: Column[];
    data: DeliveryOption[];
    itemsPerPage?: number;
    onViewDetails: (option: DeliveryOption) => void;
    onEdit: (option: DeliveryOption) => void;
    onDeleteDetails: (option: DeliveryOption) => void;
    searchTerm: string;
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOption, setSelectedOption] = useState<DeliveryOption | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleViewDetails = (option: DeliveryOption) => {
        setSelectedOption(option);
        setIsModalOpen(true);
        onViewDetails(option);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const columnsWithHandler = columns.map(col => {
        if (col.key === 'actions') {
            return {
                ...col,
                render: (text: string, record: DeliveryOption) => (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-accent/20"
                            onClick={() => handleViewDetails(record)}
                        >
                            <Eye className="w-4 h-4 text-accent-foreground" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-accent/20"
                            onClick={() => onEdit(record)}
                        >
                            <Edit className="w-4 h-4 text-accent-foreground" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-red-50"
                            onClick={() => onDeleteDetails(record)}
                        >
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                    </div>
                )
            };
        }
        return col;
    });

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <>
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                            {columnsWithHandler.map((column) => (
                                <th
                                    key={column.key}
                                    className="text-left p-4 font-semibold text-sm text-gray-700"
                                    style={{ width: column.width ? `${column.width}px` : 'auto' }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((option, index) => (
                            <tr
                                key={option.id}
                                className={`border-b border-gray-100 hover:bg-gray-50 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
                            >
                                {columnsWithHandler.map((column) => (
                                    <td key={column.key} className="p-4 text-sm text-gray-700">
                                        {column.render
                                            ? column.render(option[column.dataIndex as keyof DeliveryOption], option, index)
                                            : getDisplayValue(option[column.dataIndex as keyof DeliveryOption])
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
                <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Options
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="text-xs border-gray-300 hover:bg-gray-100"
                    >
                        Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 p-0 text-xs ${currentPage === page ? 'bg-accent/70 text-white' : 'border-gray-300 hover:bg-gray-100'}`}
                        >
                            {page}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="text-xs border-gray-300 hover:bg-gray-100"
                    >
                        Next
                    </Button>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delivery Option Details</DialogTitle>
                        <DialogDescription>
                            {''}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOption && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Area</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedOption.area}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Group Code</p>
                                    <Badge className={getStatusColor(selectedOption.groupCode)}>
                                        {selectedOption.groupCode}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Amount</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatCurrency(selectedOption.amount)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Estimated Time</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedOption.estimatedTime} {selectedOption.estimatedTimeType.toLowerCase() === 'hour' ? 'hour(s)' : selectedOption.estimatedTimeType.toLowerCase() === 'minute' ? 'minute(s)' : selectedOption.estimatedTimeType.toLowerCase() === 'day' ? 'day(s)' : selectedOption.estimatedTimeType.toLowerCase()}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">VAT</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {`${selectedOption.deliveryVatRate}%`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">VAT Amount</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatCurrency(selectedOption.deliveryVatAmount)}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Cap</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatCurrency(selectedOption.capLimit)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default function DeliveryOptionsPage() {
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('MANAGE_DELIVERY_OPTIONS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage delivery options"
    });
    const router = useRouter();
    const [deletingOption, setDeletingOption] = useState<DeliveryOption | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['delivery-options'],
        queryFn: () => axiosOperations.request({
            url: '/delivery/option/all',
            method: 'GET'
        })
    });

    const [searchTerm, setSearchTerm] = useState("");

    const deliveryOptions: DeliveryOption[] = data?.data?.deliveryOptions || [];

    const filteredOptions = deliveryOptions.filter(option => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (option.area?.toLowerCase() || '').includes(searchLower) ||
            (option.groupCode?.toLowerCase() || '').includes(searchLower) ||
            (option.estimatedTimeType?.toLowerCase() || '').includes(searchLower)
        );
    });

    const handleViewDetails = (option: DeliveryOption) => {
        // console.log('Viewing option:', option);
    };

    const handleEdit = (option: DeliveryOption) => {
        router.push(`/operations/delivery-options/save?id=${option.id}`);
    };

    const handleDelete = (option: DeliveryOption) => {
        setDeletingOption(option);
        setIsDeleteModalOpen(true);
    };

    const columns: Column[] = [
        {
            title: 'S/N',
            dataIndex: 'id',
            key: 'sn',
            width: 80,
            render: (text: string, record: DeliveryOption, index: number) => (
                <p className="text-sm text-gray-700">{index + 1}</p>
            ),
        },
        {
            title: 'Group Code',
            dataIndex: 'groupCode',
            key: 'groupCode',
            width: 120,
            render: (text: string) => (
                <Badge className={getStatusColor(text)}>
                    {getDisplayValue(text)}
                </Badge>
            ),
        },
        {
            title: 'Areas',
            dataIndex: 'area',
            key: 'area',
            width: 150,
            render: (text: string) => (
                <p className="text-sm font-medium text-gray-900">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: 120,
            render: (amount: number) => {
                const formatted = new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                    minimumFractionDigits: 2
                }).format(amount);
                return (
                    <p className="text-sm font-medium text-gray-900">{formatted}</p>
                );
            },
        },
        {
            title: 'VAT',
            dataIndex: 'deliveryVatRate',
            key: 'deliveryVatRate',
            width: 80,
            render: (rate: number) => {
                return (
                    <p className="text-sm font-medium text-gray-900">{rate}</p>
                );
            },
        },
        {
            title: 'Estimated Time',
            dataIndex: 'estimatedTime',
            key: 'estimatedTime',
            width: 150,
            render: (time: number, record: DeliveryOption) => (
                <p className="text-sm text-gray-900">
                    {time} {`${record.estimatedTimeType.toLowerCase() === 'hour' ? 'hour(s)' : record.estimatedTimeType.toLowerCase() === 'minute' ? 'minute(s)' : record.estimatedTimeType.toLowerCase() === 'day' ? 'day(s)' : record.estimatedTimeType.toLowerCase()}`}
                </p>
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: 100,
            render: (text: string, record: DeliveryOption) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-accent/20"
                        onClick={() => handleViewDetails(record)}
                    >
                        <Eye className="w-4 h-4 text-accent-foreground" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-accent/20"
                        onClick={() => handleEdit(record)}
                    >
                        <Edit className="w-4 h-4 text-accent-foreground" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-red-50"
                        onClick={() => handleDelete(record)}
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Delivery Options
                            </h1>
                            <p className="text-gray-600">
                                Manage delivery options and pricing
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{deliveryOptions.length}</p>
                        <p className="text-sm text-gray-600">Total Options</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search areas or group codes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-gray-300 text-gray-900"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <Link href="/operations/delivery-options/save" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto gap-2 bg-accent/70 hover:bg-accent text-white">
                                    <Plus className="w-4 h-4" />
                                    Save Delivery Option
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                className="border-gray-300 hover:bg-gray-100"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
                            </Button>
                        </div>
                    </div>

                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Delivery Options List
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-40">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                                        <p className="text-gray-600">Loading delivery options...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-gray-600">Error loading delivery options</p>
                                </div>
                            ) : deliveryOptions.length === 0 ? (
                                <div className="flex justify-center items-center h-40 flex-col gap-4">
                                    <p className="text-gray-600">No delivery options found</p>
                                    <Link href="/operations/delivery-options/save">
                                        <Button className="gap-2 bg-accent/70 hover:bg-accent text-white">
                                            <Plus className="w-4 h-4" />
                                            Create First Option
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <DynamicTable
                                    columns={columns}
                                    data={filteredOptions}
                                    itemsPerPage={15}
                                    onViewDetails={handleViewDetails}
                                    onEdit={handleEdit}
                                    onDeleteDetails={handleDelete}
                                    searchTerm={searchTerm}
                                />
                            )}

                            <>
                                {deletingOption && (
                                    <DeleteDeliveryOption
                                        isOpen={isDeleteModalOpen}
                                        onClose={() => {
                                            setIsDeleteModalOpen(false);
                                            setDeletingOption(null);
                                        }}
                                        deliveryData={deletingOption}
                                    // onSuccess={handleDeleteSuccess}
                                    />
                                )}
                            </>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}