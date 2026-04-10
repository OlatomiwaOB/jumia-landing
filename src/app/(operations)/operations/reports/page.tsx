'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Search, Download, FileText, Loader2 } from 'lucide-react';
import useGetLookup, { ExtendedSelectOption } from '@/app/hooks/useGetReports';
import ReportsList from '@/components/Operations/reports/report-list';
import { usePermission } from '@/hooks/usePermission';

interface ReportDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
}

export default function ReportsPage(): React.ReactElement {
  const { usePermissionGuard } = usePermission();

  usePermissionGuard('CAN_VIEW_REPORTS', {
    redirectToNotPermitted: true,
    toastMessage: "You don't have permission to view reports"
  });
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const reportCodes = useGetLookup('ECOM_REPORT');
  const isLoading = !reportCodes;

  const reportDefinitions: ReportDefinition[] = reportCodes?.map((report: ExtendedSelectOption) => ({
    id: report.id.toString(),
    code: report.lookupCode,
    name: report.lookupName,
    description: report.lookupDesc || `Generate ${report.lookupName} report`,
  })) || [];

  const handleGenerateReport = (report: ReportDefinition) => {
    router.push(`/operations/reports/${report.code}`);
  };

  const filteredReports = reportDefinitions?.filter((report: ReportDefinition) =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentDate = new Date();
  const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-accent-foreground mb-2">
              Reports Management
            </h1>
            <p className="text-accent-foreground/70">
              Generate and view system reports
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent-foreground">{reportDefinitions?.length || 0}</p>
            <p className="text-sm text-accent-foreground/70">Available Reports</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/40" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-accent/20 focus:border-accent"
              />
            </div>

            <Button
              variant="outline"
              className="border-accent/20 text-accent-foreground hover:bg-accent/10"
            >
              Refresh
            </Button>
          </div>

          <Card className="border-accent/10 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-accent-foreground">
                  Available Reports
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  <p className="ml-3 text-accent-foreground/70">Loading reports...</p>
                </div>
              ) : !reportDefinitions?.length ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-accent-foreground/50">No reports available</p>
                </div>
              ) : (
                <ReportsList
                  reports={filteredReports}
                  onGenerateReport={handleGenerateReport}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}