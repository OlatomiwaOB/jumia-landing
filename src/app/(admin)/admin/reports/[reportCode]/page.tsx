'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import {
    ArrowLeft,
    Download,
    FileText,
    Loader2,
    RefreshCw,
    Search,
    Calendar
} from 'lucide-react';
import { useReports, ReportFilters } from '@/app/hooks/useReports';
import DynamicReportTable from '@/components/Admin/reports/dynamic-table';
import useGetLookup, { ExtendedSelectOption } from '@/app/hooks/useGetReports';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { usePermission } from '@/hooks/usePermissionBusiness';

export default function ReportDetailPage() {
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('CAN_VIEW_REPORTS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to view reports"
    });
    const params = useParams();
    const router = useRouter();
    const reportCode = params.reportCode as string;

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    const [filters, setFilters] = useState<ReportFilters>({
        startDate: firstDayOfYear.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
        status: '',
        transactionType: '',
        keyword: ''
    });

    const itemsPerPage = 10;
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
                filters: {
                    ...filters,
                    page: currentPage,
                    limit: itemsPerPage
                }
            });
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const handleDownload = async () => {
        try {
            await downloadReport({
                reportCode: reportCode,
                filters: filters,
                format: 'CSV'
            });
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
            startDate: firstDayOfYear.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0],
            status: '',
            transactionType: '',
            keyword: ''
        });
        setCurrentPage(1);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleRefresh = () => {
        handleGenerateReport();
    };

    const reportData = generateReportData || {
        data: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 1
    };

    const totalRecords = reportData.totalCount || 0;
    const currentData = reportData.data || [];

    const filteredData = searchTerm
        ? currentData.filter((item: any) =>
            Object.values(item).some(
                (val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        : currentData;

    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-6">
                <div className="flex items-center mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </div>

                <div className='mb-6'>
                    <div>
                        <h1 className="text-2xl font-bold text-accent-foreground">
                            {reportDefinition?.lookupName || reportCode}
                        </h1>
                        <p className="text-sm text-accent-foreground/70 max-w-md">
                            {reportDefinition?.lookupDesc || 'Generate and view report data'}
                        </p>
                    </div>
                </div>

                <Card className="border-accent/10 shadow-sm mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-accent" />
                            Report Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate" className="text-accent-foreground">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={filters.startDate || ''}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                    className="bg-white border-accent/20 focus:border-accent"
                                    max={filters.endDate || today.toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endDate" className="text-accent-foreground">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={filters.endDate || ''}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                    className="bg-white border-accent/20 focus:border-accent"
                                    min={filters.startDate || firstDayOfYear.toISOString().split('T')[0]}
                                    max={today.toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-accent-foreground">Transaction Status</Label>
                                <Select
                                    value={filters.status || ''}
                                    onValueChange={(value) => handleFilterChange('status', value)}
                                >
                                    <SelectTrigger className="border-accent/20 focus:border-accent">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="S">Success</SelectItem>
                                        <SelectItem value="P">Pending</SelectItem>
                                        <SelectItem value="R">Reversed</SelectItem>
                                        <SelectItem value="F">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="transactionType" className="text-accent-foreground">Transaction Type</Label>
                                <Select
                                    value={filters.transactionType || ''}
                                    onValueChange={(value) => handleFilterChange('transactionType', value)}
                                >
                                    <SelectTrigger className="border-accent/20 focus:border-accent">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="PUCH">Purchase</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4 gap-4">
                            <Button
                                variant="outline"
                                onClick={handleClearFilters}
                                className="border-accent/20 hover:bg-accent/10"
                            >
                                Clear Filters
                            </Button>
                            <Button
                                onClick={handleApplyFilters}
                                disabled={isGenerating}
                                className="bg-accent hover:bg-accent/90 text-white"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    'Apply Filters'
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-accent/10 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
                                <FileText className="w-5 h-5 text-accent" />
                                Report Data
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/40" />
                                    <Input
                                        placeholder="Search in results..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="pl-10 w-[250px] border-accent/20 focus:border-accent"
                                    />
                                </div>

                                <Button
                                    onClick={handleDownload}
                                    variant="outline"
                                    disabled={isDownloading || filteredData.length === 0}
                                >
                                    {isDownloading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4 mr-2" />
                                            Export CSV
                                        </>
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={handleRefresh}
                                    disabled={isGenerating}
                                    className="border-accent/20 text-accent-foreground hover:bg-accent/10"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isGenerating ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                                <p className="ml-3 text-accent-foreground/70">Generating report...</p>
                            </div>
                        ) : generateError ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <p className="text-red-500 mb-4">Error loading report data</p>
                                <Button
                                    variant="outline"
                                    onClick={handleRefresh}
                                    className="border-accent/20 text-accent-foreground hover:bg-accent/10"
                                >
                                    Retry
                                </Button>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <FileText className="w-12 h-12 text-accent/30 mb-2" />
                                <p className="text-accent-foreground/50">No data found for the selected criteria</p>
                            </div>
                        ) : (
                            <DynamicReportTable
                                data={filteredData}
                                totalRecords={filteredData.length}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                totalPages={Math.ceil(filteredData.length / itemsPerPage)}
                                onPageChange={setCurrentPage}
                                searchTerm={searchTerm}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}