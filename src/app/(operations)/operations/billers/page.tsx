// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Plus, Search, RefreshCw } from "lucide-react";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import BillerList from "@/components/Operations/billers/billers-lists";
// import {
//   useFetchBillers,
//   useFetchBillerCategories,
// } from "@/hooks/useBillPayment";
// import { useLocationStore } from "@/store/locationStore";
// import type { Biller } from "@/types/bill-payment-types";
// import { usePermission } from "@/hooks/usePermission";
// import { PermissionButton } from "@/components/Operations/permission/permission-button";
// import { useRouter } from "next/navigation";
// import LocationProvider from "@/components/Operations/billers/location-provider";

// const Billers = () => {
//   const { usePermissionGuard } = usePermission();

//   usePermissionGuard('VIEW_BILLERS', {
//     redirectToNotPermitted: true,
//     toastMessage: "You don't have permission to view billers"
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("ALL");
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const location = useLocationStore((s) => s.location);
//   const router = useRouter();

//   const { data: categories, isLoading: categoriesLoading } =
//     useFetchBillerCategories();

//   useEffect(() => {
//     if (categories && categories.length > 0 && !selectedCategory) {
//       setSelectedCategory(categories[0].billerCategoryCode);
//     }
//   }, [categories, selectedCategory]);

//   const { data: billers, isLoading: billersLoading, refetch } = useFetchBillers(
//     {
//       billerCategory: selectedCategory === "ALL" ? "" : selectedCategory,
//       name: searchTerm || undefined,
//     },
//     location
//   );

//   const handleRefresh = () => {
//     setIsRefreshing(true);
//     refetch().finally(() => setIsRefreshing(false));
//   };

//   const tableData = (billers ?? []).map((b: Biller, index: number) => ({
//     id: b.id ?? index + 1,
//     billerCode: b.billerCode,
//     billerName: b.billerName,
//     shortName: b.billerShortName ?? b.billerCode,
//     category: b.billerCategory ?? b.billerCategoryCode ?? "—",
//     status: b.status ?? "ACTIVE",
//     lookupDesc: b.billerDescription,
//     billerLogo: b.billerLogo ?? b.logoURL,
//   }));

//   const filteredData = tableData.filter(item => {
//     if (!searchTerm) return true;
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       item.billerName?.toLowerCase().includes(searchLower) ||
//       item.billerCode?.toLowerCase().includes(searchLower) ||
//       item.shortName?.toLowerCase().includes(searchLower) ||
//       item.category?.toLowerCase().includes(searchLower)
//     );
//   });

//   return (
//     <LocationProvider>
//       <div className="min-h-screen bg-white">
//         <div className="container mx-auto p-6">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="text-3xl font-bold text-accent-foreground mb-2">
//                 Billers Management
//               </h1>
//               <p className="text-accent-foreground/70">
//                 Manage billers for bill payments and transactions
//               </p>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="text-right">
//                 <p className="text-2xl font-bold text-accent-foreground">{filteredData.length}</p>
//                 <p className="text-sm text-accent-foreground/70">Total Billers</p>
//               </div>
//             </div>
//           </div>

//           <Card className="border-accent/20 shadow-sm mb-6">
//             <CardHeader>
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <CardTitle className="text-lg font-semibold text-accent-foreground">
//                   Billers List
//                 </CardTitle>
//                 <div className="flex items-center gap-2 w-full sm:w-auto">
//                   <div className="relative w-full sm:w-64">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent-foreground/70" />
//                     <Input
//                       placeholder="Search billers..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 border-accent/20 text-accent-foreground"
//                     />
//                   </div>

//                   <Select
//                     value={selectedCategory}
//                     onValueChange={setSelectedCategory}
//                   >
//                     <SelectTrigger className="w-full sm:w-48 border-accent/20">
//                       <SelectValue
//                         placeholder={
//                           categoriesLoading ? "Loading…" : "All Categories"
//                         }
//                       />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="ALL">All Categories</SelectItem>
//                       {(categories ?? []).map((cat) => (
//                         <SelectItem
//                           key={cat.billerCategoryCode}
//                           value={cat.billerCategoryCode}
//                         >
//                           {cat.billerCategoryName}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   <PermissionButton
//                     requiredPermissions={['MANAGE_BILLERS']}
//                     requireAll={true}
//                     hideIfNoPermission={false}
//                     tooltipMessage="You do not have permission to manage billers"
//                     onClick={() => router.push('/operations/billers/add-biller')}
//                   >
//                     <Plus className="w-4 h-4" />
//                     Add Billers
//                   </PermissionButton>
//                 </div>
//               </div>
//             </CardHeader>
//           </Card>

//           <Card className="border-accent/20 shadow-sm">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between mb-4">
//                 <p>
//                   {''}
//                 </p>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handleRefresh}
//                   disabled={isRefreshing}
//                   className="border-accent/20 hover:bg-accent/10"
//                 >
//                   <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
//                   Refresh
//                 </Button>
//               </div>
//               <BillerList
//                 data={filteredData}
//                 isFetching={billersLoading}
//               />
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </LocationProvider>
//   );
// };

// export default Billers;

"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, Eye, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useFetchBillers, useFetchBillerCategories } from "@/hooks/useBillPayment";
import { useLocationStore } from "@/store/locationStore";
import type { Biller } from "@/types/bill-payment-types";
import { usePermission } from "@/hooks/usePermission";
import { PermissionButton } from "@/components/Operations/permission/permission-button";
import { TransInflowIcon, SeperatorIcon, EditIcon } from "@/components/icons/icons";
import { Badge } from "@/components/ui/badge";
import { BillerViewModal } from "@/components/Operations/billers/biller-view-modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Papa from "papaparse";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import LocationProvider from "@/components/Operations/billers/location-provider";
import Image from "next/image";
import placeholder from "@/components/images/placeholder-product.webp";

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case "ACTIVE": return "bg-green-100 text-green-700 border-green-200";
        case "INACTIVE": return "bg-red-100 text-red-700 border-red-200";
        default: return "bg-gray-100 text-gray-600 border-gray-200";
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
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Billers per Page</p>
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

const Billers = () => {
    usePageMetadata('Billers Management', 'Manage billers for bill payments and transactions.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('VIEW_BILLERS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to view billers"
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewBillerCode, setViewBillerCode] = useState<string | null>(null);
    const ITEMS_PER_PAGE = 10;

    const location = useLocationStore((s) => s.location);
    const router = useRouter();

    const { data: categories, isLoading: categoriesLoading } = useFetchBillerCategories();
    const { data: billers, isLoading: billersLoading, refetch } = useFetchBillers(
        { billerCategory: selectedCategory || "", name: searchTerm || undefined },
        location
    );

    const billersList: Biller[] = billers ?? [];

    const filtered = useMemo(() => {
        return billersList.filter((b) => {
            const s = searchTerm.toLowerCase().trim();
            return !s || (
                b.billerName?.toLowerCase().includes(s) ||
                b.billerCode?.toLowerCase().includes(s) ||
                b.billerShortName?.toLowerCase().includes(s) ||
                b.billerCategory?.toLowerCase().includes(s)
            );
        });
    }, [billersList, searchTerm]);

    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleView = (billerCode: string) => {
        setViewBillerCode(billerCode);
        setViewModalOpen(true);
    };

    const handleEdit = (billerCode: string) => {
        router.push(`/operations/billers/create?edit=true&code=${billerCode}`);
    };

    const exportToCSV = () => {
        if (!filtered.length) { toast.error('No data to export'); return; }
        const csv = Papa.unparse(filtered.map((b) => ({
            'Code': b.billerCode,
            'Name': b.billerName,
            'Short Name': b.billerShortName,
            'Category': b.billerCategory,
            'Status': b.status,
        })), { header: true });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = `billers-${new Date().toISOString().split('T')[0]}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Export complete');
    };

    return (
        <LocationProvider>
            <div className="min-h-screen px-2">
                <div className="grid gap-4 mt-3">
                    <div className="mb-2">
                        <h2 className="text-md font-semibold text-dark-gray">Billers List <span className="text-md text-faded-accent">({filtered.length.toLocaleString()})</span></h2>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex flex-wrap justify-between items-center gap-3">
                        <div className="flex relative w-full max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                placeholder="Search billers..."
                                className="pl-9 text-medium-gray"
                            />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <Select value={selectedCategory || 'all'} onValueChange={(v) => { setSelectedCategory(v === 'all' ? '' : v); setCurrentPage(1); }}>
                                <SelectTrigger className="bg-white w-44">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {(categories ?? []).map((cat) => (
                                        <SelectItem key={cat.billerCategoryCode} value={cat.billerCategoryCode}>
                                            {cat.billerCategoryName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {(searchTerm || selectedCategory) && (
                                <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setSelectedCategory(''); setCurrentPage(1); }} className="gap-1 text-xs">
                                    <X className="w-3.5 h-3.5" /> Clear
                                </Button>
                            )}

                            <SeperatorIcon />
                            {/* <Button onClick={exportToCSV} size="lg" variant="outline">
                                <TransInflowIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Export</span>
                            </Button> */}
                            <PermissionButton
                                requiredPermissions={['MANAGE_BILLERS']}
                                requireAll={true} hideIfNoPermission={false}
                                tooltipMessage="No permission to create"
                                onClick={() => router.push('/operations/billers/create')}
                                size="lg"
                                className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                                Create Biller
                            </PermissionButton>
                        </div>
                    </div>
                </div>

                {billersLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="hidden lg:block">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-3">
                                    <p className="text-2xl font-medium text-dark-gray">No billers found</p>
                                    <p className="text-sm text-medium-gray">Try adjusting your search</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="border-b-2 border-[#EEEEEE]">
                                                    {['S/N', 'Logo', 'Code', 'Name', 'Short Name', 'Category', 'Status', ''].map((h) => (
                                                        <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginated.map((b, idx) => (
                                                    <tr key={b.billerCode}
                                                        onClick={() => handleView(b.billerCode)}
                                                        className={`border-b-2 border-[#EEEEEE] cursor-pointer hover:bg-orange-50/40 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
                                                        <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</p></td>
                                                        <td className="px-3 py-3.5">
                                                            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center p-1 border border-gray-200 overflow-hidden">
                                                                {b.logoURL ? (
                                                                    <Image src={b.logoURL} alt={b.billerName} width={36} height={36} className="w-full h-full object-contain" />
                                                                ) : (
                                                                    <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-500 font-bold">
                                                                        {b.billerName?.charAt(0) || 'B'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3.5"><p className="text-sm font-mono font-medium text-dark-gray">{getDisplayValue(b.billerCode)}</p></td>
                                                        <td className="px-3 py-3.5"><p className="text-sm font-semibold text-dark-gray">{getDisplayValue(b.billerName)}</p></td>
                                                        <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{getDisplayValue(b.billerShortName)}</p></td>
                                                        <td className="px-3 py-3.5"><Badge className="text-[10px] px-2 py-0.5 bg-[#FFEACC] text-medium-gray font-semibold border-gray-200">{getDisplayValue(b.billerCategory)}</Badge></td>
                                                        <td className="px-3 py-3.5"><Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(b.status)}`}>{b.status}</Badge></td>
                                                        <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                            <div className="flex items-center gap-1">
                                                                <Button size="xs" variant="action" onClick={() => handleView(b.billerCode)} title="View"><Eye className="w-4 h-4" /></Button>
                                                                <PermissionButton requiredPermissions={['MANAGE_BILLERS']} requireAll={true} hideIfNoPermission={false}
                                                                    tooltipMessage="No permission" onClick={() => handleEdit(b.billerCode)} size="xs" variant="action">
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

                <BillerViewModal
                    open={viewModalOpen}
                    onOpenChange={setViewModalOpen}
                    billerCode={viewBillerCode}
                />
            </div>
        </LocationProvider>
    );
};

export default Billers;