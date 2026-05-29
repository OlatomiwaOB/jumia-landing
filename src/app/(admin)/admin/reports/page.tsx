// 'use client'
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from "@/components/ui/input";
// import { Search, Download, FileText, Loader2 } from 'lucide-react';
// import useGetLookup, { ExtendedSelectOption } from '@/app/hooks/useGetReports';
// import ReportsList from '@/components/Admin/reports/report-list';
// import { usePermission } from '@/hooks/usePermissionBusiness';

// interface ReportDefinition {
//   id: string;
//   code: string;
//   name: string;
//   description: string;
// }

// export default function ReportsPage(): React.ReactElement {
//   const { usePermissionGuard } = usePermission();

//   usePermissionGuard('CAN_VIEW_REPORTS', {
//     redirectToNotPermitted: true,
//     toastMessage: "You don't have permission to view reports"
//   });
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState("");

//   const reportCodes = useGetLookup('ECOM_REPORT');
//   const isLoading = !reportCodes;

//   const reportDefinitions: ReportDefinition[] = reportCodes?.map((report: ExtendedSelectOption) => ({
//     id: report.id.toString(),
//     code: report.lookupCode,
//     name: report.lookupName,
//     description: report.lookupDesc || `Generate ${report.lookupName} report`,
//   })) || [];

//   const handleGenerateReport = (report: ReportDefinition) => {
//     router.push(`/admin/reports/${report.code}`);
//   };

//   const filteredReports = reportDefinitions?.filter((report: ReportDefinition) =>
//     report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     report.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const currentDate = new Date();
//   const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);

//   return (
//     <div className="min-h-screen">
//       <div className="container mx-auto p-6">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-accent-foreground mb-2">
//               Reports Management
//             </h1>
//             <p className="text-accent-foreground/70">
//               Generate and view system reports
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-2xl font-bold text-accent-foreground">{reportDefinitions?.length || 0}</p>
//             <p className="text-sm text-accent-foreground/70">Available Reports</p>
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <div className="relative flex-1 max-w-sm">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/40" />
//               <Input
//                 placeholder="Search reports..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 border-accent/20 focus:border-accent"
//               />
//             </div>

//             <Button
//               variant="outline"
//               className="border-accent/20 text-accent-foreground hover:bg-accent/10"
//             >
//               Refresh
//             </Button>
//           </div>

//           <Card className="border-accent/10 shadow-sm">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-lg font-semibold text-accent-foreground">
//                   Available Reports
//                 </CardTitle>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <div className="flex justify-center items-center h-40">
//                   <Loader2 className="w-8 h-8 animate-spin text-accent" />
//                   <p className="ml-3 text-accent-foreground/70">Loading reports...</p>
//                 </div>
//               ) : !reportDefinitions?.length ? (
//                 <div className="flex justify-center items-center h-40">
//                   <p className="text-accent-foreground/50">No reports available</p>
//                 </div>
//               ) : (
//                 <ReportsList
//                   reports={filteredReports}
//                   onGenerateReport={handleGenerateReport}
//                 />
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import useGetLookup, { ExtendedSelectOption } from '@/app/hooks/useGetReports';
import { usePermission } from '@/hooks/usePermissionBusiness';
import { FolderIcon, FolderIconFilled, TransInflowIcon } from '@/components/icons/icons';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface ReportDefinition {
    id: string;
    code: string;
    name: string;
    description: string;
}

export default function ReportsPage(): React.ReactElement {
    usePageMetadata('Reports', 'Generate and view system reports.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('CAN_VIEW_REPORTS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to view reports"
    });

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const reportCodes = useGetLookup('ECOM_REPORT');

    const reportDefinitions: ReportDefinition[] = reportCodes?.map((report: ExtendedSelectOption) => ({
        id: report.id.toString(),
        code: report.lookupCode,
        name: report.lookupName,
        description: report.lookupDesc || `Generate ${report.lookupName} report`,
    })) || [];

    const filteredReports = reportDefinitions.filter((report) =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleGenerateReport = (report: ReportDefinition) => {
        router.push(`/admin/reports/${report.code}`);
    };

    return (
        <div className="min-h-screen px-2">
            <div className="mb-4">
                <div className="mb-2">
                    <h2 className="text-md font-semibold text-dark-gray">Available Reports</h2>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search reports..."
                            className="pl-9 text-medium-gray h-10"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {searchTerm && (
                            <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportDefinitions.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3">
                        <FolderIcon />
                        <p className="text-2xl font-medium text-dark-gray">No reports available</p>
                        <p className="text-sm text-medium-gray">Reports will appear here once configured</p>
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3">
                        <Search className="w-10 h-10 text-gray-300" />
                        <p className="text-2xl font-medium text-dark-gray">No reports found</p>
                        <p className="text-sm text-medium-gray">
                            No reports match "{searchTerm}"
                        </p>
                        <Button onClick={() => setSearchTerm("")} variant="outline">Clear Search</Button>
                    </div>
                ) : (
                    filteredReports.map((report) => (
                        <div
                            key={report.id}
                            className="bg-white rounded-2xl cursor-pointer overflow-hidden"
                            onClick={() => handleGenerateReport(report)}
                        >
                            <div className="p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-1.5 bg-[#FEF1E7] rounded-full shrink-0">
                                        <FolderIconFilled className="w-5 h-5" />
                                    </div>
                                    <div className="">
                                        <h3 className="text-sm font-semibold text-dark-gray mb-1 line-clamp-1">
                                            {report.name}
                                        </h3>
                                    </div>
                                </div>
                                <p className="text-xs text-medium-gray mb-4 h-[46px]">
                                    {report.description}
                                </p>
                                <Button
                                    size="sm"
                                    onClick={() => handleGenerateReport(report)}
                                >
                                    <TransInflowIcon className="w-3.5 h-3.5 mr-1.5" />
                                    Generate Report
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}