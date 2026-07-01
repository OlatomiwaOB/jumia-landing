'use client'
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { usePermission } from '@/hooks/usePermissionBusiness';
import { EditIcon } from '@/components/icons/icons';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { CreateEditDeliveryOptionModal } from '@/components/Admin/delivery-options/create-edit-delivery-option-modal';
import { getClientIdentifiers } from '@/config/client-config';
import { formatPrice } from '@/utils/helperfns';

interface DeliveryOption {
    id: number;
    area: string;
    groupCode: string;
    storeCode: string;
    estimatedTime: number;
    estimatedTimeType: string;
    amount: number;
    weightBasedConfig: boolean;
    ratePerWeightUnit: number;
    weightUnit: string;
    minWeight: number;
    maxWeight: number;
    status: string;
    deliveryVatRate: number;
    deliveryVatAmount: number;
    capLimit: number;
}

const storeCode = getClientIdentifiers().storeCode;

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
        case 'INACTIVE': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
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
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} options per page</p>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current - 1)} disabled={current === 1}>
                    <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                {getPageNumbers().map((p, i) =>
                    p === '...' ? (
                        <span key={`e-${i}`} className="text-xs text-gray-400 px-1">···</span>
                    ) : (
                        <button key={p} onClick={() => onChange(p as number)}
                            className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${p === current ? 'border-2 border-sidebar-accent text-sidebar-accent' : 'text-gray-600 hover:bg-gray-100'}`}>
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

export default function AdminDeliveryOptionsPage() {
    usePageMetadata('Delivery Options', 'Manage delivery options for your store.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_DELIVERY_OPTIONS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage delivery options",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [createEditModalOpen, setCreateEditModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<DeliveryOption | null>(null);
    const ITEMS_PER_PAGE = 10;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['admin-delivery-options'],
        queryFn: () =>
            axiosInstance.request({
                url: '/delivery/option/all',
                method: 'GET',
                params: { storeCode },
            }),
    });

    const deliveryOptions: DeliveryOption[] = data?.data?.deliveryOptions || [];

    const paginated = useMemo(
        () => deliveryOptions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
        [deliveryOptions, currentPage]
    );

    const handleEdit = (option: DeliveryOption) => {
        setSelectedOption(option);
        setCreateEditModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedOption(null);
        setCreateEditModalOpen(true);
    };

    const formatEstimatedTime = (time: number, type: string) => {
        if (!time || !type) return '—';
        const t = type.toLowerCase();
        const plural = time > 1 ? 's' : '';
        if (t.includes('hour')) return `${time} hour${plural}`;
        if (t.includes('day')) return `${time} day${plural}`;
        if (t.includes('week')) return `${time} week${plural}`;
        if (t.includes('minute')) return `${time} min${plural}`;
        return `${time} ${type}`;
    };

    return (
        <div className="min-h-screen px-2">
            <div className="grid gap-4 mt-3">
                <div className="mb-2">
                    <h2 className="text-md font-semibold text-dark-gray">
                        Delivery Options <span className="text-md text-faded-accent">({deliveryOptions.length.toLocaleString()})</span>
                    </h2>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button onClick={handleCreate} size="lg">
                            + Add Delivery Option
                        </Button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-sidebar-accent border-t-transparent animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading delivery options</div>
            ) : (
                <>
                    <div className="hidden lg:block">
                        {deliveryOptions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <p className="text-2xl font-medium text-dark-gray">No delivery options found</p>
                                <p className="text-sm text-medium-gray">Click "Add Delivery Option" to create one</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#EEEEEE]">
                                                {['S/N', 'Area', 'Group Code', 'Est. Time', 'Amount', 'Min / Max Weight', 'Status', 'action'].map((h) => (
                                                    <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map((opt, idx) => (
                                                <tr
                                                    key={opt.id}
                                                    className={`border-b-2 border-[#EEEEEE] hover:bg-sidebar-accent/10 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}
                                                >
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm text-dark-gray">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</p>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm text-dark-gray max-w-[150px] truncate" title={opt.area}>{opt.area || '—'}</p>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <Badge className="text-[10px] px-2.5 py-0.5 border font-medium bg-blue-100 text-blue-700 border-blue-200">
                                                            {opt.groupCode || '—'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm text-dark-gray">{formatEstimatedTime(opt.estimatedTime, opt.estimatedTimeType)}</p>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm font-medium text-dark-gray">{opt.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                    </td>

                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm text-dark-gray whitespace-nowrap text-center">
                                                            {`${opt.minWeight ?? 0} – ${opt.maxWeight ?? 0}`}
                                                        </p>
                                                    </td>

                                                    <td className="px-3 py-3.5">
                                                        <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(opt.status)}`}>
                                                            {opt.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <div className="flex items-center gap-1">
                                                            <Button size="xs" variant="ghost" onClick={() => handleEdit(opt)} title="Edit">
                                                                <EditIcon className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {Math.ceil(deliveryOptions.length / ITEMS_PER_PAGE) > 1 && (
                                    <TablePagination current={currentPage} total={deliveryOptions.length} perPage={ITEMS_PER_PAGE} onChange={setCurrentPage} />
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile card view */}
                    <div className="lg:hidden space-y-3">
                        {deliveryOptions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <p className="text-xl font-medium text-dark-gray">No delivery options found</p>
                            </div>
                        ) : (
                            paginated.map((opt) => (
                                <div key={opt.id} className="bg-white rounded-xl p-4 shadow-sm border border-[#EEEEEE]">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-sm font-semibold text-dark-gray">{opt.area || '—'}</p>
                                            <Badge className="text-[10px] px-2 py-0.5 border font-medium bg-blue-100 text-blue-700 border-blue-200 mt-1">
                                                {opt.groupCode || '—'}
                                            </Badge>
                                        </div>
                                        <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(opt.status)}`}>
                                            {opt.status}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-medium-gray mb-3">
                                        <span>Amount: <span className="font-medium text-dark-gray">{opt.amount?.toLocaleString()}</span></span>
                                        <span>Est. Time: <span className="font-medium text-dark-gray">{formatEstimatedTime(opt.estimatedTime, opt.estimatedTimeType)}</span></span>
                                        <span>Weight Based: <span className="font-medium text-dark-gray">{opt.weightBasedConfig ? 'Yes' : 'No'}</span></span>
                                        {opt.weightBasedConfig && (
                                            <span>Weight: <span className="font-medium text-dark-gray">{opt.minWeight}–{opt.maxWeight} {opt.weightUnit || 'kg'}</span></span>
                                        )}
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => handleEdit(opt)} className="w-full gap-2">
                                        <EditIcon className="w-3.5 h-3.5" /> Edit
                                    </Button>
                                </div>
                            ))
                        )}
                        {Math.ceil(deliveryOptions.length / ITEMS_PER_PAGE) > 1 && (
                            <TablePagination current={currentPage} total={deliveryOptions.length} perPage={ITEMS_PER_PAGE} onChange={setCurrentPage} />
                        )}
                    </div>
                </>
            )}

            <CreateEditDeliveryOptionModal
                open={createEditModalOpen}
                onOpenChange={setCreateEditModalOpen}
                deliveryOption={selectedOption}
                onSuccess={() => refetch()}
            />
        </div>
    );
}
