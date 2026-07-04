import React, { useState } from "react";
import RcTable from "rc-table";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface DynamicReportTableProps {
  data: any[];
  title?: string;
}

const ITEMS_PER_PAGE = 10;

const DynamicReportTable: React.FC<DynamicReportTableProps> = ({
  data,
  title = "Report Data",
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!data || data.length === 0) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground p-4">
            No data available for this report.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Pagination Logic
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatHeader = (key: string) => {
    return key
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatValue = (value: any) => {
    if (Array.isArray(value)) {
      // to check if it's a date array [yyyy, mm, dd, ...]
      if (
        value.length >= 3 &&
        typeof value[0] === "number" &&
        value[0] > 1900
      ) {
        try {
          const date = new Date(
            value[0],
            value[1] - 1, // Month is 0-indexed
            value[2],
            value[3] || 0,
            value[4] || 0,
            value[5] || 0
          );
          return format(date, "PPpp");
        } catch (e) {
          return value.join(", ");
        }
      }
      return value.join(", ");
    }
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  // derive columns from the first item
  const keys = Object.keys(data[0]);
  const rcColumns = keys.map((col) => ({
    title: formatHeader(col),
    dataIndex: col,
    key: col,
    render: (value: any) => formatValue(value),
    onHeaderCell: () => ({
      className: "h-10 px-4 text-left align-middle whitespace-nowrap font-bold text-sidebar-accent",
    }),
    onCell: () => ({
      className: "p-4 align-middle whitespace-nowrap",
    }),
  }));

  return (
    <Card className="w-full mt-6 animate-fade-in flex flex-col h-fit">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <div className="relative w-full">
          <RcTable
            className="w-full text-sm"
            components={{
              table: (props: any) => <table {...props} className="w-full caption-bottom text-sm" />,
              header: {
                wrapper: (props: any) => <thead {...props} className="[&_tr]:border-b bg-secondary/90 backdrop-blur-sm shadow-sm sticky top-0 z-10" />,
              }
            }}
            columns={rcColumns}
            data={currentData}
            rowKey={(record, index) => `${startIndex + (index || 0)}`}
            rowClassName={() => "even:bg-muted/30 border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"}
          />
        </div>
      </CardContent>
      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between border-t p-4 bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, data.length)} of {data.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-sidebar-accent border-sidebar-accent hover:bg-sidebar-accent/10 disabled:opacity-50"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-sidebar-accent border-sidebar-accent hover:bg-sidebar-accent/10 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium w-[80px] text-center text-sidebar-accent">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-sidebar-accent border-sidebar-accent hover:bg-sidebar-accent/10 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-sidebar-accent border-sidebar-accent hover:bg-sidebar-accent/10 disabled:opacity-50"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DynamicReportTable;

