'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import EditLookupModal from './edit-lookup'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';

interface LookupData {
    id: number;
    entityCode: string;
    countryCode: string;
    categoryCode: string;
    lookupCode: string;
    lookupName: string;
    lookupDesc: string;
    status: string;
    usageAccess: string;
}

interface LookupListProps {
    isFetching: boolean;
    data: any;
    paginatorInfo: any;
    onPagination: (page: number) => void;
    searchTerm: string;
}

interface Column {
    title: string;
    dataIndex: string;
    key: string;
    width?: number;
    render?: (value: any, record: LookupData, index: number) => React.ReactNode;
}

const groupAndOrderLookups = (lookups: LookupData[]): LookupData[] => {
    const grouped: Record<string, LookupData[]> = {};

    lookups.forEach(lookup => {
        if (!grouped[lookup.categoryCode]) {
            grouped[lookup.categoryCode] = [];
        }
        grouped[lookup.categoryCode].push(lookup);
    });

    const sortedCategories = Object.keys(grouped).sort();
    const result: LookupData[] = [];
    sortedCategories.forEach(category => {
        result.push(...grouped[category]);
    });

    return result;
};

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE':
            return 'bg-green-500 text-white';
        case 'INACTIVE':
            return 'bg-red-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

const getDisplayValue = (value: any): string => {
    return value?.toString() || 'N/A';
};

const DeleteLookupModal = ({
    isOpen,
    onClose,
    lookupData,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    lookupData: LookupData | null;
    onSuccess: () => void;
}) => {
    const [step, setStep] = useState<'confirmation' | 'otp'>('confirmation');
    const [otp, setOtp] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteLookupMutation = useMutation({
        mutationFn: async (payload: { id: number; otp: string }) => {
            return await axiosOperations.delete(`/lookupdata/delete-by-id/${payload.id}?otp=${payload.otp}`, {
                data: payload,
            });
        },
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Lookup deleted successfully');
                onSuccess();
                handleClose();
            } else {
                toast.error(data?.data?.desc || 'Failed to delete lookup');
                setIsDeleting(false);
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete lookup');
            setIsDeleting(false);
        }
    });

    const handleConfirm = () => {
        setStep('otp');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!lookupData) return;

        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setIsDeleting(true);

        const payload = {
            id: lookupData.id,
            otp: otp
        };

        deleteLookupMutation.mutate(payload);
    };

    const handleClose = () => {
        setStep('confirmation');
        setOtp('');
        setIsDeleting(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className='flex flex-col'>
                    <DialogTitle className="text-destructive">
                        {step === 'confirmation' ? 'Delete Lookup' : 'Confirm Deletion'}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'confirmation'
                            ? 'Are you sure you want to delete this lookup?'
                            : 'Enter OTP to confirm deletion'
                        }
                    </DialogDescription>
                </DialogHeader>

                {step === 'confirmation' ? (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="font-medium mb-2">Lookup Details:</p>
                            <p><strong>Name:</strong> {lookupData?.lookupName}</p>
                            <p><strong>Code:</strong> {lookupData?.lookupCode}</p>
                            <p><strong>Category:</strong> {lookupData?.categoryCode}</p>
                        </div>

                        <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                            <p className="text-sm text-red-600">
                                <strong>Warning:</strong> This action cannot be undone. The lookup data will be permanently deleted.
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
                                type="button"
                                variant="destructive"
                                onClick={handleConfirm}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="otp" className="text-destructive font-medium">
                                Enter OTP *
                            </Label>
                            <Input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Enter 6-digit OTP"
                                className="border-gray-300"
                                required
                                maxLength={6}
                                disabled={isDeleting}
                            />
                            <p className="text-sm text-gray-500">
                                Please enter the OTP from your authenticator app to confirm deletion.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep('confirmation')}
                                disabled={isDeleting}
                                className="border-gray-300"
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={isDeleting || !otp || otp.length !== 6}
                                className="bg-red-600 hover:bg-red-700 gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                {isDeleting ? 'Deleting...' : 'Delete Lookup'}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

const DynamicTable = ({
    columns,
    groupedLookups,
    itemsPerPage = 15,
    onViewDetails,
    onEditDetails,
    onDeleteDetails,
    searchTerm
}: {
    columns: Column[];
    groupedLookups: LookupData[];
    itemsPerPage?: number;
    onViewDetails: (lookup: LookupData) => void;
    onEditDetails: (lookup: LookupData) => void;
    onDeleteDetails: (lookup: LookupData) => void;
    searchTerm: string;
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLookup, setSelectedLookup] = useState<LookupData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalPages = Math.ceil(groupedLookups.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = groupedLookups.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleViewDetails = (lookup: LookupData) => {
        setSelectedLookup(lookup);
        setIsModalOpen(true);
        onViewDetails(lookup);
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
                render: (text: string, record: LookupData) => (
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-accent/10"
                            onClick={() => handleViewDetails(record)}
                        >
                            <Eye className="w-5 h-5 text-accent-foreground" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-accent/10"
                            onClick={() => onEditDetails(record)}
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

    return (
        <>
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            {columnsWithHandler.map((column) => (
                                <th
                                    key={column.key}
                                    className="text-left p-3 font-bold text-sm text-gray-700"
                                    style={{ width: column.width ? `${column.width}px` : 'auto' }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr
                                key={item.id}
                                className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
                            >
                                {columnsWithHandler.map((column) => (
                                    <td key={column.key} className="p-3 text-sm">
                                        {column.render
                                            ? column.render(item[column.dataIndex as keyof LookupData], item, index)
                                            : getDisplayValue(item[column.dataIndex as keyof LookupData])
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
                <p className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(endIndex, groupedLookups.length)} of {groupedLookups.length} Lookups
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="text-xs"
                    >
                        Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0 text-xs"
                        >
                            {page}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="text-xs"
                    >
                        Next
                    </Button>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle>Lookup Details - {selectedLookup?.lookupName || 'N/A'}</DialogTitle>
                        <DialogDescription>
                            Detailed information about the selected lookup data
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLookup && (
                        <div className="py-4">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Category Code:</p>
                                    <p className="text-sm">{getDisplayValue(selectedLookup.categoryCode)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Lookup Code:</p>
                                    <p className="text-sm">{getDisplayValue(selectedLookup.lookupCode)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Country Code:</p>
                                    <p className="text-sm">{getDisplayValue(selectedLookup.countryCode)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Usage Access:</p>
                                    <p className="text-sm">{getDisplayValue(selectedLookup.usageAccess)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Status:</p>
                                    <Badge className={`${getStatusColor(selectedLookup.status)} text-xs px-2 py-1 w-fit`}>
                                        {getDisplayValue(selectedLookup.status)}
                                    </Badge>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-medium mb-3">Description</h4>
                                <p className="text-sm whitespace-pre-wrap">{getDisplayValue(selectedLookup.lookupDesc)}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default function LookupList({ isFetching, data, paginatorInfo, onPagination, searchTerm }: LookupListProps) {
    const [selectedLookup, setSelectedLookup] = useState<LookupData | null>(null);
    const [editingLookup, setEditingLookup] = useState<LookupData | null>(null);
    const [deletingLookup, setDeletingLookup] = useState<LookupData | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const lookups = Array.isArray(data?.data?.lookupList || data) ? (data?.data?.lookupList || data) : [];

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const groupedAndOrderedLookups = useMemo(() => {
        return groupAndOrderLookups(lookups);
    }, [lookups]);

    const handleViewDetails = (lookup: LookupData) => {
        setSelectedLookup(lookup);
        setIsViewModalOpen(true);
    };

    const handleEdit = (lookup: LookupData) => {
        setEditingLookup(lookup);
        setIsEditModalOpen(true);
    };

    const handleDelete = (lookup: LookupData) => {
        setDeletingLookup(lookup);
        setIsDeleteModalOpen(true);
    };

    const handleEditSuccess = () => {
        if (paginatorInfo.currentPage) {
            onPagination(paginatorInfo.currentPage);
        }
    };

    const handleDeleteSuccess = () => {
        if (paginatorInfo.currentPage) {
            onPagination(paginatorInfo.currentPage);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (lookups.length === 0) {
        return (
            <div className="flex justify-center items-center h-40 flex-col gap-4">
                <p className="text-gray-500">No lookup data found</p>
                <Button asChild>
                    <a href="/operations/lookup-data/create">Create Your First Lookup</a>
                </Button>
            </div>
        );
    }

    const columns: Column[] = [
        {
            title: 'S/N',
            dataIndex: 'serialNo',
            key: 'serialNo',
            width: 80,
            render: (text: string, record: LookupData, index: number) => {
                const globalIndex = groupedAndOrderedLookups.findIndex(l => l.id === record.id);
                return globalIndex + 1;
            },
        },
        {
            title: 'Category Code',
            dataIndex: 'categoryCode',
            key: 'categoryCode',
            width: 150,
            render: (text: string) => (
                <span className="font-medium">{getDisplayValue(text)}</span>
            ),
        },
        {
            title: 'Lookup Code',
            dataIndex: 'lookupCode',
            key: 'lookupCode',
            width: 150,
            render: (text: string) => (
                <p className="text-sm">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Lookup Name',
            dataIndex: 'lookupName',
            key: 'lookupName',
            width: 200,
            render: (text: string) => (
                <p className="text-sm font-medium text-gray-900">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'lookupDesc',
            key: 'description',
            width: 250,
            render: (text: string) => (
                <p className="text-sm line-clamp-2">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (text: string) => (
                <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 w-fit`}>
                    {getDisplayValue(text)}
                </Badge>
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: 140,
            render: (text: string, record: LookupData) => (
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-accent/10"
                        onClick={() => handleViewDetails(record)}
                    >
                        <Eye className="w-5 h-5 text-accent-foreground" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-accent/10"
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
        <>
            <DynamicTable
                columns={columns}
                groupedLookups={groupedAndOrderedLookups}
                onViewDetails={handleViewDetails}
                onEditDetails={handleEdit}
                onDeleteDetails={handleDelete}
                searchTerm={searchTerm}
            />

            {editingLookup && (
                <EditLookupModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingLookup(null);
                    }}
                    lookupData={editingLookup}
                    onSuccess={handleEditSuccess}
                />
            )}

            {deletingLookup && (
                <DeleteLookupModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setDeletingLookup(null);
                    }}
                    lookupData={deletingLookup}
                    onSuccess={handleDeleteSuccess}
                />
            )}
        </>
    );
}