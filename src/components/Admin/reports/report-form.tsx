'use client';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import { toast } from "sonner";
import { AxiosError } from "axios";
import useUser from "@/store/userStore";
import DynamicReportTable from "./dynamic-table";
import { formatDateToDDMMYYYY } from "@/utils/helperfns";


type FormData = {
    reportCode: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    datePeriod: string;
    tranStatus: string;
    keyword: string;
};

const defaultTranStatusOptions = [
    { id: 'S', name: "Successful" },
    { id: 'F', name: "Failed" },
    { id: 'R', name: "Reversed" }
];

const salesReportTranStatusOptions = [
    { id: 'PAID', name: "Paid" },
    { id: 'CANCELLED', name: "Cancelled" },
    { id: 'COMPLETED', name: "Completed" }
];

const datePeriodOptions = [
    { id: 'TODAY', name: 'Today' },
    { id: 'YESTERDAY', name: 'Yesterday' },
    { id: 'THIS_WEEK', name: 'This Week' },
    { id: 'THIS_MONTH', name: 'This Month' },
]


export default function ReportForm() {
    const [reportData, setReportData] = useState<any[]>([]);
    const reportCodes = [
        // { lookupCode: 'PURCHASE_ORDER_REPORT', lookupName: 'Purchase Order Report' },
        { lookupCode: 'SALE_ORDER_REPORT', lookupName: 'Sales Report' }
    ];

    const { user } = useUser()

    const { register, handleSubmit, setValue, watch } = useForm<FormData>({
        defaultValues: {
            reportCode: "",
            startDate: undefined,
            endDate: undefined,
            datePeriod: "",
            tranStatus: "",
            keyword: ""
        },
    });

    const reportCode = watch("reportCode");
    const startDate = watch("startDate");
    const endDate = watch("endDate");
    const datePeriod = watch("datePeriod");
    const tranStatus = watch("tranStatus");

    const tranStatusOptions = reportCode === 'SALES_REPORT'
        ? salesReportTranStatusOptions
        : defaultTranStatusOptions;

    const currentReportName = reportCodes?.find(r => r.lookupCode === reportCode)?.lookupName || "Generated Report";

    const { mutate: generateReport, isPending: isGenerating } = useMutation({
        mutationFn: (data: any) => axiosInstance.request({
            url: '/store-dashboard/generateReport',
            method: 'POST',
            data
        }),
        onSuccess: (data) => {
            if (data?.data?.length > 0) {
                setReportData(data.data);
                toast.success(`${data?.data?.length} records found!`)
                return
            }
            setReportData([]);
            toast.error('No record found!')
            return
        },
        onError: (error: AxiosError) => {
            toast.error(error?.message || "Something went wrong")
        }
    })

    const { mutate: downloadReport, isPending: isDownloading } = useMutation({
        mutationFn: (data: any) =>
            axiosInstance.request({
                url: '/store-dashboard/exportReport',
                method: 'POST',
                data,
                responseType: 'blob',
            }),
        onSuccess: (response) => {
            if (response.data?.size <= 0) {
                toast.error('No record found')
                return
            }
            try {
                const blob = new Blob([response.data], {
                    type: response.headers['content-type'] || 'application/octet-stream'
                });

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;

                const contentDisposition = response.headers['content-disposition'];
                let fileName = 'report.xlsx';

                if (contentDisposition) {
                    const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                    if (fileNameMatch && fileNameMatch[1]) {
                        fileName = fileNameMatch[1].replace(/['"]/g, '');
                    }
                }

                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();

                link.remove();
                window.URL.revokeObjectURL(url);

                toast.success('Report downloaded successfully!');
            } catch (error) {
                console.error('Download error:', error);
                toast.error('Failed to download report');
            }
        },
        onError: (error: AxiosError) => {
            toast.error(error?.message || "Failed to download report");
        }
    });

    const getPayload = (data: FormData) => {
        return {
            entityCode: user?.entityCode,
            startDate: formatDateToDDMMYYYY(data?.startDate),
            endDate: formatDateToDDMMYYYY(data?.endDate),
            datePeriod: data?.datePeriod,
            keyword: data?.keyword,
            tranStatus: data?.tranStatus,
            reportCode: data?.reportCode,
            storeCode: user?.storeCode || user?.branchID,
            pageSize: 100,
            pageNumber: 1,
            offset: '0',
            tranCode: ""
        }
    }

    const onSubmit = (data: FormData) => {
        if (!data.reportCode) {
            toast.error("Please select a report type");
            return;
        }
        generateReport(getPayload(data))
    }

    const handleDownload = (data: FormData) => {
        if (!data.reportCode) {
            toast.error("Please select a report type");
            return;
        }
        downloadReport(getPayload(data))
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-wrap items-center gap-4">

                        <div className="w-[180px]">
                            <Select onValueChange={(val) => {
                                setValue("reportCode", val);
                                setValue("tranStatus", ""); // Reset status when report changes
                            }} value={reportCode}>
                                <SelectTrigger className="h-11 bg-white">
                                    <SelectValue placeholder="Report Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reportCodes?.map((opt) => (
                                        <SelectItem key={opt.lookupCode} value={opt.lookupCode}>{opt.lookupName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-[180px]">
                            <Input
                                type="date"
                                className="h-11 bg-white text-muted-foreground w-full"
                                value={startDate?.toISOString().split('T')[0] ?? ''}
                                onChange={(e) => {
                                    setValue("startDate", e.target.value ? new Date(e.target.value) : undefined);
                                }}
                            />
                        </div>

                        <div className="w-[180px]">
                            <Input
                                type="date"
                                className="h-11 bg-white text-muted-foreground w-full"
                                value={endDate?.toISOString().split('T')[0] ?? ''}
                                onChange={(e) => {
                                    setValue("endDate", e.target.value ? new Date(e.target.value) : undefined);
                                }}
                            />
                        </div>

                        <div className="w-[180px]">
                            <Select onValueChange={(val) => setValue("datePeriod", val)} value={datePeriod}>
                                <SelectTrigger className="h-11 bg-white">
                                    <SelectValue placeholder="Date period" />
                                </SelectTrigger>
                                <SelectContent>
                                    {datePeriodOptions.map((opt) => (
                                        <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid md:grid-cols-2 items-center gap-4">
                            <div className="w-full">
                                <Select onValueChange={(val) => setValue("tranStatus", val)} value={tranStatus}>
                                    <SelectTrigger className="h-11 bg-white">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tranStatusOptions.map((status) => (
                                            <SelectItem key={status.id} value={status.id}>
                                                {status.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full">
                                <Input
                                    {...register("keyword")}
                                    placeholder="Search in results..."
                                    className="h-11 bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSubmit(handleDownload)}
                            disabled={isDownloading}
                            className="h-11 px-6 text-(var(--sidebar-text)) border-(var(--sidebar-accent)) hover:bg-(var(--sidebar-accent)/10)"
                        >
                            {isDownloading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Exporting</>
                            ) : (
                                <><Download className="mr-2 h-4 w-4" /> Export</>
                            )}
                        </Button>

                        <Button
                            type="submit"
                            disabled={isGenerating}
                            className="h-11 px-6 bg-sidebar-accent hover:bg-sidebar-accent/90 text-[var(--sidebar-text)]"
                        >
                            {isGenerating ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying</>
                            ) : (
                                "Apply filters"
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <p className="text-sm text-gray-500 mb-2">Total records</p>
                    <h3 className="text-3xl font-bold text-gray-900">{reportData.length || 0}</h3>
                </div>
                {/* <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <p className="text-sm text-gray-500 mb-2">Report status</p>
                    <h3 className="text-3xl font-bold text-gray-900">100%</h3>
                    <p className="text-xs text-gray-400 mt-1">Generated successfully</p>
                </div> */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <p className="text-sm text-gray-500 mb-2">Report type</p>
                    <h3 className="text-2xl font-bold text-gray-900 line-clamp-1">{currentReportName}</h3>
                    <p className="text-xs text-gray-400 mt-1">{reportCode || 'None selected'}</p>
                </div>
            </div>

            <DynamicReportTable data={reportData} title={currentReportName || "Generated Report"} />
        </div>
    );
}
