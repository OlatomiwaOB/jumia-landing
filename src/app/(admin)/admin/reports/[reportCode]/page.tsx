// 'use client'
// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from "@/components/ui/input";
// import {
//     ArrowLeft,
//     Download,
//     FileText,
//     Loader2,
//     RefreshCw,
//     Search,
//     Calendar
// } from 'lucide-react';
// import { useReports, ReportFilters } from '@/app/hooks/useReports';
// import DynamicReportTable from '@/components/Admin/reports/dynamic-table';
// import useGetLookup, { ExtendedSelectOption } from '@/app/hooks/useGetReports';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Label } from '@/components/ui/label';
// import { usePermission } from '@/hooks/usePermissionBusiness';

// export default function ReportDetailPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('CAN_VIEW_REPORTS', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to view reports"
//     });
//     const params = useParams();
//     const router = useRouter();
//     const reportCode = params.reportCode as string;

//     const [searchTerm, setSearchTerm] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);

//     useEffect(() => {
//         setCurrentPage(1);
//     }, [searchTerm]);

//     const today = new Date();
//     const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

//     const [filters, setFilters] = useState<ReportFilters>({
//         startDate: firstDayOfYear.toISOString().split('T')[0],
//         endDate: today.toISOString().split('T')[0],
//         status: '',
//         transactionType: '',
//         keyword: ''
//     });

//     const itemsPerPage = 10;
//     const reportCodes = useGetLookup('ECOM_REPORT');

//     const {
//         generateReport,
//         generateReportData,
//         isGenerating,
//         generateError,
//         downloadReport,
//         isDownloading
//     } = useReports();

//     const reportDefinition = reportCodes?.find(
//         (r: ExtendedSelectOption) => r.lookupCode === reportCode
//     );

//     useEffect(() => {
//         if (reportCode) {
//             handleGenerateReport();
//         }
//     }, [reportCode, currentPage]);

//     const handleGenerateReport = async () => {
//         try {
//             await generateReport({
//                 reportCode: reportCode,
//                 filters: {
//                     ...filters,
//                     page: currentPage,
//                     limit: itemsPerPage
//                 }
//             });
//         } catch (error) {
//             console.error('Error generating report:', error);
//         }
//     };

//     const handleDownload = async () => {
//         try {
//             await downloadReport({
//                 reportCode: reportCode,
//                 filters: filters,
//                 format: 'XLSX'
//             });
//         } catch (error) {
//             console.error('Error downloading report:', error);
//         }
//     };

//     const handleFilterChange = (key: keyof ReportFilters, value: string) => {
//         setFilters(prev => ({ ...prev, [key]: value }));
//     };

//     const handleApplyFilters = () => {
//         setCurrentPage(1);
//         handleGenerateReport();
//     };

//     const handleClearFilters = () => {
//         setFilters({
//             startDate: firstDayOfYear.toISOString().split('T')[0],
//             endDate: today.toISOString().split('T')[0],
//             status: '',
//             transactionType: '',
//             keyword: ''
//         });
//         setCurrentPage(1);
//     };

//     const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(e.target.value);
//     };

//     const handleRefresh = () => {
//         handleGenerateReport();
//     };

//     const reportData = generateReportData || {
//         data: [],
//         totalCount: 0,
//         currentPage: 1,
//         totalPages: 1
//     };

//     const totalRecords = reportData.totalCount || 0;
//     const currentData = reportData.data || [];

//     const filteredData = searchTerm
//         ? currentData.filter((item: any) =>
//             Object.values(item).some(
//                 (val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
//             )
//         )
//         : currentData;

//     return (
//         <div className="min-h-screen">
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center mb-6">
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => router.back()}
//                     >
//                         <ArrowLeft className="w-4 h-4 mr-2" />
//                         Back
//                     </Button>
//                 </div>

//                 <div className='mb-6'>
//                     <div>
//                         <h1 className="text-2xl font-bold text-accent-foreground">
//                             {reportDefinition?.lookupName || reportCode}
//                         </h1>
//                         <p className="text-sm text-accent-foreground/70 max-w-md">
//                             {reportDefinition?.lookupDesc || 'Generate and view report data'}
//                         </p>
//                     </div>
//                 </div>

//                 <Card className="border-accent/10 shadow-sm mb-6">
//                     <CardHeader>
//                         <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
//                             <Calendar className="w-5 h-5 text-accent" />
//                             Report Filters
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                             <div className="space-y-2">
//                                 <Label htmlFor="startDate" className="text-accent-foreground">Start Date</Label>
//                                 <Input
//                                     id="startDate"
//                                     type="date"
//                                     value={filters.startDate || ''}
//                                     onChange={(e) => handleFilterChange('startDate', e.target.value)}
//                                     className="bg-white border-accent/20 focus:border-accent"
//                                     max={filters.endDate || today.toISOString().split('T')[0]}
//                                 />
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="endDate" className="text-accent-foreground">End Date</Label>
//                                 <Input
//                                     id="endDate"
//                                     type="date"
//                                     value={filters.endDate || ''}
//                                     onChange={(e) => handleFilterChange('endDate', e.target.value)}
//                                     className="bg-white border-accent/20 focus:border-accent"
//                                     min={filters.startDate || firstDayOfYear.toISOString().split('T')[0]}
//                                     max={today.toISOString().split('T')[0]}
//                                 />
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="status" className="text-accent-foreground">Transaction Status</Label>
//                                 <Select
//                                     value={filters.status || ''}
//                                     onValueChange={(value) => handleFilterChange('status', value)}
//                                 >
//                                     <SelectTrigger className="border-accent/20 focus:border-accent">
//                                         <SelectValue placeholder="Select status" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="all">All</SelectItem>
//                                         <SelectItem value="S">Success</SelectItem>
//                                         <SelectItem value="P">Pending</SelectItem>
//                                         <SelectItem value="R">Reversed</SelectItem>
//                                         <SelectItem value="F">Failed</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="transactionType" className="text-accent-foreground">Transaction Type</Label>
//                                 <Select
//                                     value={filters.transactionType || ''}
//                                     onValueChange={(value) => handleFilterChange('transactionType', value)}
//                                 >
//                                     <SelectTrigger className="border-accent/20 focus:border-accent">
//                                         <SelectValue placeholder="Select type" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="all">All</SelectItem>
//                                         <SelectItem value="PUCH">Purchase</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>

//                         <div className="flex justify-end mt-4 gap-4">
//                             <Button
//                                 variant="outline"
//                                 onClick={handleClearFilters}
//                                 className="border-accent/20 hover:bg-accent/10"
//                             >
//                                 Clear Filters
//                             </Button>
//                             <Button
//                                 onClick={handleApplyFilters}
//                                 disabled={isGenerating}
//                                 className="bg-accent hover:bg-accent/90 text-white"
//                             >
//                                 {isGenerating ? (
//                                     <>
//                                         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                         Generating...
//                                     </>
//                                 ) : (
//                                     'Apply Filters'
//                                 )}
//                             </Button>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card className="border-accent/10 shadow-sm">
//                     <CardHeader>
//                         <div className="flex items-center justify-between">
//                             <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
//                                 <FileText className="w-5 h-5 text-accent" />
//                                 Report Data
//                             </CardTitle>
//                             <div className="flex items-center gap-2">
//                                 <div className="relative">
//                                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/40" />
//                                     <Input
//                                         placeholder="Search in results..."
//                                         value={searchTerm}
//                                         onChange={handleSearch}
//                                         className="pl-10 w-[250px] border-accent/20 focus:border-accent"
//                                     />
//                                 </div>

//                                 <Button
//                                     onClick={handleDownload}
//                                     variant="outline"
//                                     disabled={isDownloading || filteredData.length === 0}
//                                 >
//                                     {isDownloading ? (
//                                         <>
//                                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                             Downloading...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Download className="w-4 h-4 mr-2" />
//                                             Export
//                                         </>
//                                     )}
//                                 </Button>

//                                 <Button
//                                     variant="outline"
//                                     onClick={handleRefresh}
//                                     disabled={isGenerating}
//                                     className="border-accent/20 text-accent-foreground hover:bg-accent/10"
//                                 >
//                                     <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
//                                 </Button>
//                             </div>
//                         </div>
//                     </CardHeader>
//                     <CardContent>
//                         {isGenerating ? (
//                             <div className="flex justify-center items-center h-64">
//                                 <Loader2 className="w-8 h-8 animate-spin text-accent" />
//                                 <p className="ml-3 text-accent-foreground/70">Generating report...</p>
//                             </div>
//                         ) : generateError ? (
//                             <div className="flex flex-col items-center justify-center h-64">
//                                 <p className="text-red-500 mb-4">Error loading report data</p>
//                                 <Button
//                                     variant="outline"
//                                     onClick={handleRefresh}
//                                     className="border-accent/20 text-accent-foreground hover:bg-accent/10"
//                                 >
//                                     Retry
//                                 </Button>
//                             </div>
//                         ) : filteredData.length === 0 ? (
//                             <div className="flex flex-col items-center justify-center h-64">
//                                 <FileText className="w-12 h-12 text-accent/30 mb-2" />
//                                 <p className="text-accent-foreground/50">No data found for the selected criteria</p>
//                             </div>
//                         ) : (
//                             <DynamicReportTable
//                                 data={filteredData}
//                                 totalRecords={filteredData.length}
//                                 currentPage={currentPage}
//                                 itemsPerPage={itemsPerPage}
//                                 totalPages={Math.ceil(filteredData.length / itemsPerPage)}
//                                 onPageChange={setCurrentPage}
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
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    FileText,
    Loader2,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    Eye
} from 'lucide-react';
import { useReports, ReportFilters } from '@/app/hooks/useReports';
import useGetLookup, { ExtendedSelectOption } from '@/app/hooks/useGetReports';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';
import { usePermission } from '@/hooks/usePermissionBusiness';
import { DatePicker } from '@/components/ui/date-picker';
import { SearchSelect } from '@/components/ui/search-select';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { TransInflowIcon, SeperatorIcon } from '@/components/icons/icons';
import { format } from 'date-fns';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const getDisplayValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'N/A';
    return value.toString();
};

const formatColumnHeader = (key: string): string => {
    return key.replace(/_/g, ' ').replace(/^./, str => str.toUpperCase()).trim();
};

const getStatusColor = (status: string): string => {
    if (!status) return 'bg-gray-100 text-gray-600 border-gray-200';
    switch (status.toLowerCase()) {
        case 'success': case 'completed': case 'active': case 'approved':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'failed': case 'cancelled': case 'rejected': case 'inactive':
            return 'bg-red-100 text-red-700 border-red-200';
        case 'pending': case 'processing':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const formatCellValue = (value: any, key: string): React.ReactNode => {
    if (value === null || value === undefined || value === '') {
        return <span className="text-gray-400">—</span>;
    }
    if (typeof value === 'string' && (key.toLowerCase().includes('date') || key.toLowerCase().includes('time'))) {
        return <span className="text-dark-gray">{value}</span>;
    }
    if ((key.toLowerCase().includes('amount') || key.toLowerCase().includes('price') || key.toLowerCase().includes('total')) && !isNaN(Number(value))) {
        return <span className="font-medium text-green-700">₦{Number(value).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
    }
    if (key.toLowerCase().includes('status')) {
        return <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(value)}`}>{getDisplayValue(value)}</Badge>;
    }
    if (typeof value === 'boolean') {
        return <Badge className={`text-[10px] px-2 py-0.5 border font-medium ${value ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{value ? 'Yes' : 'No'}</Badge>;
    }
    return <span className="text-dark-gray truncate max-w-[200px] block">{getDisplayValue(value)}</span>;
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
        <div className="flex items-center justify-between mt-4 pt-4">
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} records</p>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current - 1)} disabled={current === 1}>
                    <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                {getPageNumbers().map((p, i) =>
                    p === '...' ? (
                        <span key={`e-${i}`} className="text-xs text-gray-400 px-1">···</span>
                    ) : (
                        <button key={p} onClick={() => onChange(p as number)}
                            className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${p === current ? 'border-2 border-faded-accent text-faded-accent' : 'text-gray-600 hover:bg-gray-100'}`}>
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

export default function ReportDetailPage() {
    usePageMetadata('Report Detail', 'Generate and view report data.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('CAN_VIEW_REPORTS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to view reports"
    });

    const params = useParams();
    const router = useRouter();
    const reportCode = params.reportCode as string;
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const { user } = useUser();

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewRow, setViewRow] = useState<Record<string, any> | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const [filters, setFilters] = useState<ReportFilters>({
        startDate: format(firstDayOfYear, 'yyyy-MM-dd'),
        endDate: format(today, 'yyyy-MM-dd'),
        status: '',
        transactionType: '',
        keyword: '',
    });

    const ITEMS_PER_PAGE = 10;
    const reportCodes = useGetLookup('ECOM_REPORT');

    const {
        generateReport,
        generateReportData,
        isGenerating,
        generateError,
        downloadReport,
        isDownloading
    } = useReports();

    const reportDefinition = reportCodes?.find(
        (r: ExtendedSelectOption) => r.lookupCode === reportCode
    );

    useEffect(() => {
        if (reportCode) {
            handleGenerateReport();
        }
    }, [reportCode, currentPage]);

    const handleGenerateReport = async () => {
        try {
            await generateReport({
                reportCode: reportCode,
                filters: { ...filters, page: currentPage, limit: ITEMS_PER_PAGE }
            });
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const handleDownload = async () => {
        try {
            await downloadReport({ reportCode: reportCode, filters: filters, format: 'XLSX' });
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    const handleFilterChange = (key: keyof ReportFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
        handleGenerateReport();
    };

    const handleClearFilters = () => {
        setFilters({
            startDate: format(firstDayOfYear, 'yyyy-MM-dd'),
            endDate: format(today, 'yyyy-MM-dd'),
            status: '',
            transactionType: '',
            keyword: '',
        });
        setCurrentPage(1);
    };

    const { data: storesData, isLoading: isLoadingStores } = useQuery({
        queryKey: ['available-stores'],
        queryFn: () => axiosInstance.request({ url: '/store/merchant', method: 'GET' }),
    });

    const stores: any = storesData?.data?.data || [];
    const transactionTypeOptions = useGetLookup('TRAN_CODE');

    const reportData = generateReportData || { data: [], totalCount: 0, currentPage: 1, totalPages: 1 };
    const currentData = reportData.data || [];

    const filteredData = searchTerm
        ? currentData.filter((item: any) =>
            Object.values(item).some((val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : currentData;

    const columns = filteredData.length > 0 ? Object.keys(filteredData[0]) : [];

    const hasActiveFilters = filters.status || filters.transactionType;

    return (
        <div className="min-h-screen px-2">
            <div className="mb-4 pt-4">
                <Button variant="link" onClick={() => router.push('/admin/reports')}>
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
            </div>

            <div className="mb-6">
                <h1 className="text-md lg:text-lg font-medium text-dark-gray">
                    {reportDefinition?.lookupName || reportCode}
                </h1>
                <p className="text-xs lg:text-sm font-normal text-medium-gray max-w-md">
                    {reportDefinition?.lookupDesc || 'Generate and view report data'}
                </p>
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="w-36">
                            <DatePicker
                                value={filters.startDate || ''}
                                onChange={(dateString) => handleFilterChange('startDate', dateString)}
                                placeholder="Start date"
                            />
                        </div>

                        <div className="w-36">
                            <DatePicker
                                value={filters.endDate || ''}
                                onChange={(dateString) => handleFilterChange('endDate', dateString)}
                                placeholder="End date"
                            />
                        </div>

                        <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value)}>
                            <SelectTrigger className="bg-white w-32">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="S">Success</SelectItem>
                                <SelectItem value="P">Pending</SelectItem>
                                <SelectItem value="R">Reversed</SelectItem>
                                <SelectItem value="F">Failed</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filters.transactionType || ''} onValueChange={(value) => handleFilterChange('transactionType', value)}>
                            <SelectTrigger className="bg-white w-40">
                                <SelectValue placeholder="Transaction Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {transactionTypeOptions?.map((option: ExtendedSelectOption) => (
                                    <SelectItem key={option.lookupCode} value={option.lookupCode}>{option.lookupName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex relative w-full max-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                placeholder="Search in results..."
                                className="pl-9 text-medium-gray"
                            />
                        </div>

                        {(hasActiveFilters || searchTerm) && (
                            <Button variant="ghost" size="sm" onClick={() => { handleClearFilters(); setSearchTerm(''); }} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <SeperatorIcon />
                        <Button onClick={handleDownload} size="lg" variant="outline" disabled={isDownloading || filteredData.length === 0}>
                            {isDownloading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Downloading...</> : <><TransInflowIcon className="w-4 h-4" /><span className="hidden sm:inline">Export</span></>}
                        </Button>
                        <Button onClick={handleApplyFilters} size="lg" disabled={isGenerating}>
                            {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : 'Apply Filters'}
                        </Button>
                    </div>
                </div>
            </div>

            {isGenerating ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                </div>
            ) : generateError ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <p className="text-red-400 text-sm">Error loading report data</p>
                    <Button variant="outline" onClick={handleGenerateReport}>Retry</Button>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <FileText className="w-10 h-10 text-gray-300" />
                    <p className="text-2xl font-medium text-dark-gray">No data found</p>
                    <p className="text-sm text-medium-gray">Try adjusting your filters</p>
                </div>
            ) : (
                <>
                    <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b-2 border-[#EEEEEE]">
                                    {columns.map((column) => (
                                        <th key={column} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">
                                            {formatColumnHeader(column)}
                                        </th>
                                    ))}
                                    <th className="text-left px-3 py-3 text-sm font-semibold text-dark-gray"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item: any, idx: number) => (
                                    <tr key={idx} className={`border-b-2 border-[#EEEEEE] hover:bg-orange-50/40 transition-colors ${idx === filteredData.length - 1 ? 'border-b-0' : ''}`}>
                                        {columns.map((column) => (
                                            <td key={column} className="px-3 py-3 text-sm">
                                                {formatCellValue(item[column], column)}
                                            </td>
                                        ))}
                                        <td className="px-3 py-3">
                                            <Button size="xs" variant="action" onClick={() => { setViewRow(item); setIsViewOpen(true); }} title="View">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {Math.ceil(filteredData.length / ITEMS_PER_PAGE) > 1 && (
                        <TablePagination current={currentPage} total={filteredData.length} perPage={ITEMS_PER_PAGE} onChange={setCurrentPage} />
                    )}
                </>
            )}

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                    style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                    <DialogTitle className="sr-only">Record Details</DialogTitle>
                    <div className="px-6 pt-5 pb-4">
                        <h2 className="text-base font-semibold text-dark-gray mb-4">Record Details</h2>
                        <div className="bg-white rounded-2xl p-4">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                {viewRow && Object.entries(viewRow).map(([key, value]) => (
                                    <div key={key} className="space-y-0.5">
                                        <p className="text-xs text-medium-gray">{formatColumnHeader(key)}</p>
                                        <div className="text-xs font-semibold text-dark-gray">{formatCellValue(value, key)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}