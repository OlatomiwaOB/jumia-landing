'use client'
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Eye, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermissionBusiness';
import { EditIcon } from '@/components/icons/icons';
import { PickupLocationViewModal } from '@/components/Admin/pickup-locations/pickup-details';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import useUser from '@/store/userStore';
import { formatPrice } from '@/utils/helperfns';

interface PickupLocation {
    id: number;
    name: string;
    location: string;
    distance: number;
    timeframe: string;
    contact: string;
    amount: number;
    status: string;
}

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
        case 'INACTIVE': return 'bg-red-100 text-red-700 border-red-200';
        case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const getDisplayValue = (value: any): string => value?.toString() || 'N/A';

const formatDistance = (distance: number): string => {
    if (distance >= 1000) return `${(distance / 1000).toFixed(1)} km`;
    return `${distance} m`;
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
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Locations per Page</p>
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

export default function AdminPickupLocationsPage() {
    usePageMetadata('Pickup Locations', 'Manage pickup locations for e-commerce orders.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_PICKUP_LOCATIONS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage pickup locations"
    });
    const { user } = useUser()

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<PickupLocation | null>(null);
    const ITEMS_PER_PAGE = 10;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['admin-pickup-locations'],
        queryFn: () => axiosInstance.request({
            url: '/ecommerce/pickup-location/all',
            method: 'GET'
        })
    });

    const pickupLocations: PickupLocation[] = data?.data?.pickupLocations || [];

    const filtered = useMemo(() => {
        return pickupLocations.filter((l) => {
            const s = searchTerm.toLowerCase().trim();
            return !s || (
                l.name?.toLowerCase().includes(s) ||
                l.location?.toLowerCase().includes(s) ||
                l.contact?.toLowerCase().includes(s) ||
                l.timeframe?.toLowerCase().includes(s)
            );
        });
    }, [pickupLocations, searchTerm]);

    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleView = (location: PickupLocation) => {
        setSelectedLocation(location);
        setViewModalOpen(true);
    };

    const handleEdit = (location: PickupLocation) => {
        router.push(`/admin/pickup-locations/create?id=${location.id}`);
    };

    const exportToCSV = () => {
        if (!filtered.length) { toast.error('No data to export'); return; }
        const csv = Papa.unparse(filtered.map((l) => ({
            'Name': l.name,
            'Location': l.location,
            'Distance': formatDistance(l.distance),
            'Timeframe': l.timeframe,
            'Contact': l.contact,
            'Amount': l.amount,
            'Status': l.status,
        })), { header: true });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = `pickup-locations-${new Date().toISOString().split('T')[0]}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Export complete');
    };

    return (
        <div className="min-h-screen px-2">
            <div className="grid gap-4 mt-3">
                <div className="mb-2">
                    <h2 className="text-md font-semibold text-dark-gray">Locations <span className="text-md text-faded-accent">({filtered.length.toLocaleString()})</span></h2>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="Search locations..."
                            className="pl-9 text-medium-gray"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {searchTerm && (
                            <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )}
                        <Button onClick={() => router.push('/admin/pickup-locations/create')} size="lg">
                            + Add Location
                        </Button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-sidebar-accent border-t-transparent animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading locations</div>
            ) : (
                <>
                    <div className="hidden lg:block">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <MapPin className="w-10 h-10 text-gray-300" />
                                <p className="text-2xl font-medium text-dark-gray">No locations found</p>
                                <p className="text-sm text-medium-gray">Try adjusting your search</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#EEEEEE]">
                                                {['S/N', 'Name', 'Location', 'Distance', 'Timeframe', 'Contact', 'Amount', 'Status', ''].map((h) => (
                                                    <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map((l, idx) => (
                                                <tr key={l.id}
                                                    onClick={() => handleView(l)}
                                                    className={`border-b-2 border-[#EEEEEE] cursor-pointer hover:bg-sidebar-accent/10 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm font-semibold text-dark-gray">{getDisplayValue(l.name)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray max-w-[200px] truncate">{getDisplayValue(l.location)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{formatDistance(l.distance)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{getDisplayValue(l.timeframe)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{getDisplayValue(l.contact)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm font-medium text-dark-gray">{getDisplayValue(formatPrice(l.amount))}</p></td>
                                                    <td className="px-3 py-3.5">
                                                        <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(l.status)}`}>{l.status}</Badge>
                                                    </td>
                                                    <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center gap-1">
                                                            <Button size="xs" variant="action" onClick={() => handleView(l)} title="View"><Eye className="w-4 h-4" /></Button>
                                                            <Button size="xs" variant="action" onClick={() => handleEdit(l)} title="Edit">
                                                                <EditIcon className="w-4 h-4" />
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
                        {filtered.map((l) => (
                            <div key={l.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm" onClick={() => handleView(l)}>
                                <div className="flex items-center gap-3 p-4">
                                    <div className="w-10 h-10 shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-dark-gray truncate">{l.name}</p>
                                        <p className="text-xs text-medium-gray mt-0.5">{formatDistance(l.distance)}</p>
                                    </div>
                                    <Badge className={`text-[10px] px-2 py-0.5 border font-medium ${getStatusColor(l.status)}`}>{l.status}</Badge>
                                </div>
                                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                                    <p className="text-xs text-medium-gray">{l.timeframe}</p>
                                    <Button size="xs" variant="action" onClick={() => handleEdit(l)}>
                                        <EditIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <PickupLocationViewModal open={viewModalOpen} onOpenChange={setViewModalOpen} location={selectedLocation} />
        </div>
    );
}
