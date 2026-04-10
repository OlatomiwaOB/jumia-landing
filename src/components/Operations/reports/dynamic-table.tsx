'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Eye
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReportData {
  [key: string]: any;
}

interface DynamicReportTableProps {
  data: ReportData[];
  totalRecords: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
}

const getDisplayValue = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  return value.toString();
};

const formatColumnHeader = (key: string): string => {
  return key
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

const getStatusColor = (status: string): string => {
  if (!status) return 'bg-gray-100 text-gray-800';

  switch (status.toLowerCase()) {
    case 'success':
    case 'completed':
    case 'active':
    case 'approved':
    case 'in stock':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'failed':
    case 'cancelled':
    case 'rejected':
    case 'inactive':
    case 'out of stock':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatCellValue = (value: any, key: string): React.ReactNode => {
  if (value === null || value === undefined || value === '') {
    return <span className="text-accent-foreground/40">—</span>;
  }

  if (typeof value === 'string' && (key.toLowerCase().includes('date') || key.toLowerCase().includes('time'))) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-GB');
      }
    } catch {
      return value;
    }
  }

  if ((key.toLowerCase().includes('amount') || 
       key.toLowerCase().includes('price') || 
       key.toLowerCase().includes('total')) && 
      !isNaN(Number(value))) {
    return (
      <span className="font-medium text-accent-foreground">
        ₦{Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    );
  }

  if (key.toLowerCase().includes('status')) {
    return (
      <Badge className={`${getStatusColor(value)} text-xs px-2 py-1 font-medium`} variant="outline">
        {getDisplayValue(value)}
      </Badge>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <Badge variant="outline" className={value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {value ? 'Yes' : 'No'}
      </Badge>
    );
  }

  if (typeof value === 'string' && value.length > 30) {
    return (
      <span title={value} className="truncate max-w-[200px] block text-accent-foreground">
        {value}
      </span>
    );
  }

  return <span className="text-accent-foreground">{getDisplayValue(value)}</span>;
};

const DynamicReportTable: React.FC<DynamicReportTableProps> = ({
  data,
  totalRecords,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange, 
  searchTerm
}) => {
  const [selectedRow, setSelectedRow] = useState<ReportData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const generateColumns = (): string[] => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const columns = generateColumns();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRecords);
  const currentData = data.slice(startIndex, endIndex);

  const handleViewDetails = (row: ReportData) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-gray-50">
        <p className="text-accent-foreground/50">No data available</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="border border-accent/10 rounded-lg overflow-hidden bg-white">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-accent/20 bg-accent/5">
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="text-left p-4 font-semibold text-sm text-accent-foreground uppercase tracking-wider"
                    >
                      {formatColumnHeader(column)}
                    </th>
                  ))}
                  <th className="text-left p-4 font-semibold text-sm text-accent-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr
                    key={`${startIndex + index}`}
                    className={`border-b border-accent/10 hover:bg-accent/5 transition-colors ${
                      index === currentData.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    {columns.map((column) => (
                      <td key={column} className="p-4 text-sm">
                        {formatCellValue(item[column], column)}
                      </td>
                    ))}
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(item)}
                        className="hover:bg-accent/10 text-accent-foreground"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-accent-foreground/70">
            Showing {startIndex + 1} to {endIndex} of {totalRecords} records
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="w-8 h-8 p-0 border-accent/20 hover:bg-accent/10"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 p-0 border-accent/20 hover:bg-accent/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 p-0 text-xs ${
                  currentPage === page 
                    ? 'bg-accent text-white hover:bg-accent/90' 
                    : 'border-accent/20 hover:bg-accent/10'
                }`}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 p-0 border-accent/20 hover:bg-accent/10"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 p-0 border-accent/20 hover:bg-accent/10"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-sm text-accent-foreground/70">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className='flex flex-col'>
            <DialogTitle className="text-accent-foreground">Record Details</DialogTitle>
            <DialogDescription>
              Detailed information for the selected record
            </DialogDescription>
          </DialogHeader>

          {selectedRow && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedRow).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm font-medium text-accent-foreground/70">
                      {formatColumnHeader(key)}:
                    </p>
                    <div className="text-sm text-accent-foreground">
                      {formatCellValue(value, key)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DynamicReportTable;