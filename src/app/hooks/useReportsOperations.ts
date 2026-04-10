import { useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import useUser from '@/store/userStore';

export interface ReportDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  hasFilters: boolean;
  requiresDateRange: boolean;
}

export interface ReportData {
  [key: string]: any;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  transactionType?: string;
  keyword?: string;
  page?: number;
  limit?: number;
  selectedStoreCode?: string;
}

export interface ReportResponse {
  data: ReportData[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const useReports = () => {
  const { user } = useUser();
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || user?.entityCode || 'FTD';

  const formatDate = (date: string | null) => {
    if (!date) return null;
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const generateReportMutation = useMutation({
    mutationFn: async ({ reportCode, filters }: { reportCode: string; filters: ReportFilters }) => {
      const response = await axiosOperations.request({
        url: '/store-dashboard/generateReport',
        method: 'POST',
        params: { entityCode: entityCode },
        data: {
          entityCode: entityCode,
          startDate: formatDate(filters.startDate || '') || '01-01-2025',
          endDate: formatDate(filters.endDate || '') || '19-02-2026',
          datePeriod: 'M',
          tranCode: filters.transactionType || '',
          keyword: filters.keyword || '',
          pageSize: 5000,
          tranStatus: filters.status || '',
          terminalId: '',
          pageNumber: filters.page || 1,
          reportCode: reportCode,
          merchantCode: '',
          offset: ((filters.page || 1) - 1) * (filters.limit || 5000),
          storeCode: filters.selectedStoreCode || ''
        },
      });

      const responseData = Array.isArray(response.data) ? response.data : response.data?.data || [];

      return {
        data: responseData,
        totalCount: responseData.length,
        currentPage: filters.page || 1,
        totalPages: Math.ceil(responseData.length / (filters.limit || 5000))
      };
    }
  });

  const downloadReportMutation = useMutation({
    mutationFn: async ({
      reportCode,
      filters,
      format = 'CSV'
    }: {
      reportCode: string;
      filters: ReportFilters;
      format?: 'CSV' | 'PDF' | 'EXCEL';
    }) => {
      const response = await axiosOperations.request({
        url: '/store-dashboard/exportReport',
        method: 'POST',
        data: {
          reportCode,
          entityCode: entityCode,
          ...filters,
          format,
          datePeriod: 'M',
          tranCode: filters.transactionType || '',
          keyword: filters.keyword || '',
          pageSize: 5000,
          tranStatus: filters.status || '',
          terminalId: '',
          pageNumber: filters.page || 1,
          merchantCode: '',
          offset: ((filters.page || 1) - 1) * (filters.limit || 5000),
          storeCode: filters.selectedStoreCode || ''
        },
        responseType: 'blob'
      });
      return response;
    },
    onSuccess: (response, variables) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const extension = variables.format?.toLowerCase() || 'csv';
      link.setAttribute('download', `${variables.reportCode}_${new Date().toISOString().split('T')[0]}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  });

  return {
    generateReport: generateReportMutation.mutateAsync,
    generateReportData: generateReportMutation.data,
    isGenerating: generateReportMutation.isPending,
    generateError: generateReportMutation.error,

    downloadReport: downloadReportMutation.mutateAsync,
    isDownloading: downloadReportMutation.isPending,
    downloadError: downloadReportMutation.error,

    resetGenerate: generateReportMutation.reset,
    resetDownload: downloadReportMutation.reset
  };
};