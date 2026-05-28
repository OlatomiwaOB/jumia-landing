// 'use client'
// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Plus, Search, ChevronDown, ChevronUp, X } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import useOperations from '@/store/operationsStore';
// import Link from 'next/link';
// import LookupList from '@/components/Operations/lookup-data/lookup-list';
// import LookupTypeFilter from '@/components/Operations/lookup-data/lookup-filter';
// import { any } from 'zod/mini';
// import { usePermission } from '@/hooks/usePermission';

// export default function LookupDataPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('MANAGE_LOOKUP', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to manage lookup data"
//     });
//     const [page, setPage] = useState(1);
//     const [visible, setVisible] = useState(false);
//     const [applyFilter, setApplyFilter] = useState(false);
//     const [categoryCode, setCategoryCode] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const { operations } = useOperations();

//     const isFilterActive = categoryCode !== '' || applyFilter;

//     const { data, isFetching, isError, refetch } = useQuery({
//         queryKey: ['lookup-data', page, applyFilter, categoryCode],
//         queryFn: () => axiosOperations.request({
//             method: 'GET',
//             url: 'lookupdata/getallcategorycode',
//             params: {
//                 entityCode: operations?.entityCode,
//                 categoryCode: categoryCode === 'categoryCode' ? '' : categoryCode || '',
//                 pageNumber: page,
//                 pageSize: 10
//             }
//         }),
//         enabled: !!operations?.entityCode,
//         select: (response: any) => response.data,
//     });

//     const filteredLookups = data?.filter((lookup: any) => {
//         const searchLower = searchTerm.toLowerCase();
//         return (
//             (lookup.categoryCode?.toLowerCase() || '').includes(searchLower) ||
//             (lookup.lookupName?.toLowerCase() || '').includes(searchLower) ||
//             (lookup.lookupCode?.toLowerCase() || '').includes(searchLower) ||
//             (lookup.LookupDesc?.toLowerCase() || '').includes(searchLower)
//         );
//     });

//     const handleSubmit = () => {
//         setApplyFilter((prev) => !prev);
//         setPage(1);
//     };

//     const toggleVisible = () => {
//         setVisible((v) => !v);
//     };

//     const handlePagination = (current: number) => {
//         setPage(current);
//     };

//     const handleClearFilters = () => {
//         setCategoryCode('');
//         setApplyFilter(false);
//         setSearchTerm('');
//         setPage(1);
//     };

//     const paginatorInfo = {
//         currentPage: page,
//         firstPageUrl: '',
//         from: 1,
//         lastPage: data?.data?.totalPages || 1,
//         lastPageUrl: '',
//         links: [],
//         nextPageUrl: null,
//         path: '',
//         perPage: 10,
//         prevPageUrl: null,
//         to: 10,
//         total: data?.data?.totalItems || 0,
//         hasMorePages: data?.data?.totalPages > page,
//     };

//     const handleCodeFilter = (value: string) => {
//         setCategoryCode(value);
//     };

//     return (
//         <div className="min-h-screen bg-gradient-subtle">
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center justify-between mb-8">
//                     <div className="flex items-center gap-4">
//                         <div>
//                             <h1 className="text-3xl font-bold text-foreground mb-2">
//                                 Lookup Data Management
//                             </h1>
//                             <p className="text-muted-foreground">
//                                 Manage and organize your lookup data
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 <Card className=" shadow-sm mb-6">
//                     <CardHeader>
//                         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                             <div className="flex flex-col sm:flex-row gap-4">
//                                 <div className="relative flex-1 max-w-sm w-full">
//                                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/70" />
//                                     <Input
//                                         placeholder="Search lookups..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                         className="pl-10 border-accent/20 text-accent-foreground"
//                                     />
//                                 </div>
//                                 {searchTerm && (
//                                     <Button
//                                         variant="ghost"
//                                         onClick={() => setSearchTerm('')}
//                                         className="whitespace-nowrap"
//                                     >
//                                         <X className="w-4 h-4 mr-1" />
//                                         Clear Search
//                                     </Button>
//                                 )}
//                             </div>
//                             <div className="flex items-center gap-2 w-full sm:w-auto">
//                                 <Link href="/operations/lookup-data/create" className="w-full sm:w-auto">
//                                     <Button className="w-full sm:w-auto gap-2">
//                                         <Plus className="w-4 h-4" />
//                                         Create Lookup Data
//                                     </Button>
//                                 </Link>

//                                 {isFilterActive && (
//                                     <Button
//                                         variant="outline"
//                                         onClick={handleClearFilters}
//                                         className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
//                                     >
//                                         <X className="w-4 h-4" />
//                                         Clear
//                                     </Button>
//                                 )}

//                                 <Button
//                                     variant="outline"
//                                     onClick={toggleVisible}
//                                     className="gap-2"
//                                 >
//                                     {visible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//                                     Filter
//                                 </Button>
//                             </div>
//                         </div>
//                     </CardHeader>

//                     {visible && (
//                         <CardContent className="border-t pt-6">
//                             <LookupTypeFilter
//                                 handleApplyFilter={handleSubmit}
//                                 onCodeFilter={handleCodeFilter}
//                             />
//                         </CardContent>
//                     )}
//                 </Card>

//                 <Card className="border-accent/20 shadow-sm">
//                     <CardHeader>
//                         <div className="flex items-center justify-between">
//                             <CardTitle className="text-lg font-semibold text-accent-foreground">
//                                 Lookup list
//                             </CardTitle>
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => refetch()}
//                                 className="border-accent/20 hover:bg-accent/10"
//                             >
//                                 Refresh
//                             </Button>
//                         </div>
//                     </CardHeader>
//                     <CardContent>
//                         {isError ? (
//                             <div className="flex justify-center items-center h-40">
//                                 <p className="text-red-500">Error loading lookup data</p>
//                             </div>
//                         ) : (
//                             <LookupList
//                                 isFetching={isFetching}
//                                 data={filteredLookups}
//                                 paginatorInfo={paginatorInfo}
//                                 onPagination={handlePagination}
//                                 searchTerm={searchTerm}
//                             />
//                         )}
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// }

'use client'
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import useOperations from '@/store/operationsStore';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';
import { PermissionButton } from '@/components/Operations/permission/permission-button';
import { TransInflowIcon, SeperatorIcon, EditIcon } from '@/components/icons/icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LookupViewModal } from '@/components/Operations/lookup-data/lookup-details';
import { LookupDeleteModal } from '@/components/Operations/lookup-data/lookup-delete';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { usePageMetadata } from '@/hooks/usePageMetadata';

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

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
        case 'INACTIVE': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
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
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Lookups per Page</p>
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

export default function LookupDataPage() {
    usePageMetadata('Lookup Data', 'Manage and organize your lookup data.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_LOOKUP', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage lookup data"
    });

    const router = useRouter();
    const { operations } = useOperations();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedLookup, setSelectedLookup] = useState<LookupData | null>(null);
    const ITEMS_PER_PAGE = 10;

    const { data: categoryData } = useQuery({
        queryKey: ['category-codes'],
        queryFn: () => axiosOperations.request({
            method: 'GET',
            url: 'lookupdata/new-list',
            params: { entityCode: operations?.entityCode, categoryCode: 'CATEGORY_CODE', pageNumber: 1, pageSize: 100 }
        }),
        enabled: !!operations?.entityCode,
    });

    const categoryOptions = categoryData?.data?.list || [];

    const { data, isFetching, isError, refetch } = useQuery({
        queryKey: ['lookup-data'],
        queryFn: () => axiosOperations.request({
            method: 'GET',
            url: 'lookupdata/getallcategorycode',
            params: {
                entityCode: operations?.entityCode,
                categoryCode: '',
                pageNumber: 1,
                pageSize: 1000
            }
        }),
        enabled: !!operations?.entityCode,
    });

    const lookups: LookupData[] = Array.isArray(data?.data?.data?.lookupList || data?.data) 
        ? (data?.data?.data?.lookupList || data?.data) 
        : [];

    const filtered = useMemo(() => {
        return lookups.filter((l) => {
            const s = searchTerm.toLowerCase().trim();
            const matchesSearch = !s || (
                l.lookupName?.toLowerCase().includes(s) ||
                l.lookupCode?.toLowerCase().includes(s) ||
                l.categoryCode?.toLowerCase().includes(s) ||
                l.lookupDesc?.toLowerCase().includes(s)
            );
            const matchesCategory = !categoryFilter || l.categoryCode === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [lookups, searchTerm, categoryFilter]);

    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleView = (lookup: LookupData) => {
        setSelectedLookup(lookup);
        setViewModalOpen(true);
    };

    const handleEdit = (lookup: LookupData) => {
        router.push(`/operations/lookup-data/create?edit=true&id=${lookup.id}`);
    };

    const handleDelete = (lookup: LookupData) => {
        setSelectedLookup(lookup);
        setDeleteModalOpen(true);
    };

    const exportToCSV = () => {
        if (!filtered.length) { toast.error('No data to export'); return; }
        const csv = Papa.unparse(filtered.map((l) => ({
            'Category Code': l.categoryCode,
            'Lookup Code': l.lookupCode,
            'Lookup Name': l.lookupName,
            'Description': l.lookupDesc,
            'Status': l.status,
        })), { header: true });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = `lookup-data-${new Date().toISOString().split('T')[0]}.csv`;
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
                    <h2 className="text-md font-semibold text-dark-gray">Lookups <span className="text-md text-faded-accent">({filtered.length.toLocaleString()})</span></h2>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="Search lookups..."
                            className="pl-9 text-medium-gray"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Select value={categoryFilter || 'all'} onValueChange={(v) => { setCategoryFilter(v === 'all' ? '' : v); setCurrentPage(1); }}>
                            <SelectTrigger className="bg-white w-40">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categoryOptions.map((option: any) => (
                                    <SelectItem key={option.code} value={option.code}>{option.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {(searchTerm || categoryFilter) && (
                            <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setCategoryFilter(''); setCurrentPage(1); }} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )}

                        <SeperatorIcon />
                        {/* <Button onClick={exportToCSV} size="lg" variant="outline">
                            <TransInflowIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button> */}
                        <PermissionButton
                            requiredPermissions={['MANAGE_LOOKUP']}
                            requireAll={true} hideIfNoPermission={false}
                            tooltipMessage="No permission to create"
                            onClick={() => router.push('/operations/lookup-data/create')}
                            size="lg"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            Create Lookup
                        </PermissionButton>
                    </div>
                </div>
            </div>

            {isFetching ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                </div>
            ) : isError ? (
                <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading lookups</div>
            ) : (
                <>
                    <div className="hidden lg:block">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <p className="text-2xl font-medium text-dark-gray">No lookups found</p>
                                <p className="text-sm text-medium-gray">Try adjusting your search</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#EEEEEE]">
                                                {['S/N', 'Category Code', 'Lookup Code', 'Lookup Name', 'Description', 'Status', ''].map((h) => (
                                                    <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map((l, idx) => (
                                                <tr key={l.id}
                                                    onClick={() => handleView(l)}
                                                    className={`border-b-2 border-[#EEEEEE] cursor-pointer hover:bg-orange-50/40 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm font-medium text-dark-gray">{getDisplayValue(l.categoryCode)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm font-mono text-dark-gray">{getDisplayValue(l.lookupCode)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm font-semibold text-dark-gray">{getDisplayValue(l.lookupName)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray max-w-[200px] truncate">{getDisplayValue(l.lookupDesc)}</p></td>
                                                    <td className="px-3 py-3.5">
                                                        <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(l.status)}`}>{l.status}</Badge>
                                                    </td>
                                                    <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center gap-1">
                                                            <Button size="xs" variant="action" onClick={() => handleView(l)} title="View"><Eye className="w-4 h-4" /></Button>
                                                            <PermissionButton requiredPermissions={['MANAGE_LOOKUP']} requireAll={true} hideIfNoPermission={false}
                                                                tooltipMessage="No permission" onClick={() => handleEdit(l)} size="xs" variant="action">
                                                                <EditIcon className="w-4 h-4" />
                                                            </PermissionButton>
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

            <LookupViewModal open={viewModalOpen} onOpenChange={setViewModalOpen} lookup={selectedLookup} />
            <LookupDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => { setDeleteModalOpen(false); setSelectedLookup(null); }}
                lookupData={selectedLookup}
                onSuccess={() => refetch()}
            />
        </div>
    );
}