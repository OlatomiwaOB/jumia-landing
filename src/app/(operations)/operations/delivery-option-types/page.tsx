'use client'
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { Search, X, Settings, Calculator, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';
import { PermissionButton } from '@/components/Operations/permission/permission-button';
import { EditIcon, DeleteIconGray } from '@/components/icons/icons';

import { toast } from 'sonner';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { OptionTypeDeleteModal } from '@/components/Operations/delivery-option-types/delete-option-type';
import { WeightConfigModal } from '@/components/Operations/delivery-option-types/weight-config';
import { CalculateSummaryModal } from '@/components/Operations/delivery-option-types/calculate-summary';

interface OptionType {
    id: number;
    typeCode: string;
    typeName: string;
    multiplier: number;
    description: string;
    status: string;
}

const getMultiplierColor = (multiplier: number): string => {
    if (multiplier === 1.0) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (multiplier > 1.0) return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
};

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

export default function DeliveryOptionTypesPage() {
    usePageMetadata('Delivery Option Types', 'Manage delivery option types and weight-based configurations.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_DELIVERY_OPTIONS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage delivery option types"
    });

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [configModalOpen, setConfigModalOpen] = useState(false);
    const [calculateModalOpen, setCalculateModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<OptionType | null>(null);
    const ITEMS_PER_PAGE = 10;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['delivery-option-types'],
        queryFn: () => axiosOperations.request({
            url: '/delivery-by-weight/option-type/all',
            method: 'GET'
        })
    });

    const optionTypes: OptionType[] = data?.data?.types || [];

    const filtered = useMemo(() => {
        return optionTypes.filter((t) => {
            const s = searchTerm.toLowerCase().trim();
            return !s || (
                t.typeCode?.toLowerCase().includes(s) ||
                t.typeName?.toLowerCase().includes(s) ||
                t.description?.toLowerCase().includes(s)
            );
        });
    }, [optionTypes, searchTerm]);

    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleEdit = (type: OptionType) => {
        router.push(`/operations/delivery-option-types/create?id=${type.id}`);
    };

    const handleDelete = (type: OptionType) => {
        setSelectedType(type);
        setDeleteModalOpen(true);
    };

    const handleConfig = (type: OptionType) => {
        setSelectedType(type);
        setConfigModalOpen(true);
    };

    const handleCalculate = (type: OptionType) => {
        setSelectedType(type);
        setCalculateModalOpen(true);
    };

    return (
        <div className="min-h-screen px-2">
            <div className="grid gap-4 mt-3">
                <div className="mb-2">
                    <h2 className="text-md font-semibold text-dark-gray">
                        Option Types <span className="text-md text-faded-accent">({filtered.length.toLocaleString()})</span>
                    </h2>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="Search option types..."
                            className="pl-9 text-medium-gray"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {searchTerm && (
                            <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )}

                        <PermissionButton
                            requiredPermissions={['MANAGE_DELIVERY_OPTIONS']}
                            requireAll={true} hideIfNoPermission={false}
                            tooltipMessage="No permission to create"
                            onClick={() => router.push('/operations/delivery-option-types/create')}
                            size="lg"
                        >
                            + Add Option Type
                        </PermissionButton>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading option types</div>
            ) : (
                <>
                    <div className="hidden lg:block">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <p className="text-2xl font-medium text-dark-gray">No option types found</p>
                                <p className="text-sm text-medium-gray">Try adjusting your search</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#EEEEEE]">
                                                {['S/N', 'Type Code', 'Type Name', 'Multiplier', 'Description', 'Status', ''].map((h) => (
                                                    <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map((t, idx) => (
                                                <tr key={t.id}
                                                    className={`border-b-2 border-[#EEEEEE] hover:bg-orange-50/40 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm text-dark-gray">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</p>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getMultiplierColor(t.multiplier)}`}>
                                                            {t.typeCode}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm font-medium text-dark-gray">{t.typeName}</p>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm text-dark-gray">{t.multiplier}x</p>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm text-dark-gray max-w-[250px] truncate" title={t.description}>
                                                            {t.description || 'N/A'}
                                                        </p>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(t.status)}`}>
                                                            {t.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <div className="flex items-center gap-1">
                                                            <Button size="xs" variant="ghost" onClick={() => handleConfig(t)} title="Weight Config">
                                                                <Settings className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="xs" variant="ghost" onClick={() => handleCalculate(t)} title="Calculate">
                                                                <Calculator className="w-4 h-4" />
                                                            </Button>
                                                            <PermissionButton
                                                                requiredPermissions={['MANAGE_DELIVERY_OPTIONS']}
                                                                requireAll={true}
                                                                hideIfNoPermission={false}
                                                                tooltipMessage="No permission"
                                                                onClick={() => handleEdit(t)}
                                                                size="xs"
                                                                variant="ghost"
                                                            >
                                                                <EditIcon className="w-4 h-4" />
                                                            </PermissionButton>
                                                            <Button size="xs" variant="ghost" onClick={() => handleDelete(t)} title="Delete" className="text-red-500 hover:text-red-700">
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
                </>
            )}

            <OptionTypeDeleteModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                optionType={selectedType}
                onSuccess={() => refetch()}
            />

            <WeightConfigModal
                open={configModalOpen}
                onOpenChange={setConfigModalOpen}
                optionType={selectedType}
                onSuccess={() => refetch()}
            />

            <CalculateSummaryModal
                open={calculateModalOpen}
                onOpenChange={setCalculateModalOpen}
                optionType={selectedType}
            />
        </div>
    );
}