'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight } from 'lucide-react';

interface ReportDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
}

interface ReportsListProps {
  reports: ReportDefinition[];
  onGenerateReport: (report: ReportDefinition) => void;
}

const ReportsList: React.FC<ReportsListProps> = ({ reports, onGenerateReport }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <Card key={report.id} className="border-accent/10 shadow-sm hover:shadow-md transition-all hover:border-accent/30">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent/10 rounded-lg shrink-0">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg font-semibold text-accent-foreground mb-1 line-clamp-1">
                  {report.name}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-accent-foreground/70 mb-4 line-clamp-2 min-h-[40px]">
              {report.description}
            </p>

            <Button
              onClick={() => onGenerateReport(report)}
              className="w-full bg-accent hover:bg-accent/90 text-white"
              size="sm"
            >
              Generate Report
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportsList;