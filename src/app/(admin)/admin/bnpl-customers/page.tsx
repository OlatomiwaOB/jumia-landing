'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Edit, Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import Link from 'next/link';
import Loader from '@/components/ui/loader';
import { getStatusBadge } from '@/utils/helperfns';
import { usePermission } from '@/hooks/usePermissionBusiness';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { getClientIdentifiers, getClientFeatures } from '@/config/client-config';

interface CreditRecord {
  id: string;
  username: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  creditScore: number;
  creditLimit: number;
  grading: 'EXCELLENT' | 'VERY GOOD' | 'GOOD' | 'FAIR' | 'POOR';
  status: 'SUCCESS' | 'PENDING' | 'DECLINED';
  applicationDate: string;
  entityCode: string;
}

const getGradingColor = (grading: string) => {
  switch (grading) {
    case 'EXCELLENT':
      return 'text-green-600';
    case 'VERY GOOD':
      return 'text-blue-600';
    case 'GOOD':
      return 'text-yellow-600';
    case 'FAIR':
      return 'text-orange-600';
    case 'POOR':
      return 'text-red-600';
    default:
      return 'text-muted-foreground';
  }
};

const CreditAssessment = () => {
  usePageMetadata('Credit Assessment Record', 'Manage customer credit facilities and assessment records');
  const { usePermissionGuard } = usePermission();

  usePermissionGuard('MANAGE_BNPL', {
    redirectToNotPermitted: true,
    toastMessage: "You don't have permission to manage BNPL customers"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const isEnabled = getClientFeatures().enableBNPL;


  const { data, isLoading, error } = useQuery({
    queryKey: ['bnpl-customers', currentPage, itemsPerPage],
    queryFn: () => axiosInstance.request({
      url: '/credit-assessments/fetchAll',
      method: 'GET',
      params: {
        pageNumber: currentPage,
        pageSize: itemsPerPage
      }
    })
  });

  const creditData = data?.data?.creditAssessmentList || [];
  const totalRecords = data?.data?.totalElements || 0; // Changed to totalElements to match API response
  const totalPages = data?.data?.totalPages || 1; // Use totalPages from API

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'id',
      key: 'no',
      width: 60,
      render: (_: any, __: any, index: number) => (
        <span className="text-sm font-medium text-gray-900">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
      ),
    },
    {
      title: 'User Info',
      key: 'userInfo',
      width: 200,
      render: (record: CreditRecord) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{record?.customerName || 'N/A'}</div>
          <div className="text-xs text-gray-500">@{record.username || 'N/A'}</div>
          <div className="text-xs text-gray-500">{record.customerPhone || 'N/A'}</div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'customerEmail',
      key: 'customerEmail',
      width: 220,
      render: (record: CreditRecord) => (
        <span className="text-sm text-gray-900 truncate block" title={record?.customerEmail}>
          {record?.customerEmail || 'N/A'}
        </span>
      ),
    },
    {
      title: 'Credit Info',
      key: 'creditInfo',
      width: 180,
      render: (record: CreditRecord) => (
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900">
            Score: {record.creditScore?.toFixed(2) || '0.00'}
          </div>
          <div className="text-sm font-semibold text-gray-900">
            Limit: ₦{(record.creditLimit || 0).toLocaleString()}
          </div>
          <div className={`text-sm font-bold ${getGradingColor(record.grading)}`}>
            Grade: {record.grading || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (record: CreditRecord) => (
        <Badge className={`${getStatusBadge(record?.status)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
          {record?.status?.toLowerCase()}
        </Badge>
      ),
    },
    {
      title: 'App Date',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
      width: 120,
      render: (record: CreditRecord) => (
        <span className="text-sm text-gray-500">
          {record?.applicationDate ? new Date(record?.applicationDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: '2-digit'
          }) : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (record: CreditRecord) => (
        <div className="flex items-center gap-1">
          <Link href={`/admin/bnpl-customers/edit/${record.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/admin/bnpl-customers/${record.username}?entityCode=${record.entityCode}`}>
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loader text='Loading credit assessments...' />;
  }

  // Calculate display range
  const showingStart = (currentPage - 1) * itemsPerPage + 1;
  const showingEnd = Math.min(currentPage * itemsPerPage, totalRecords);

  if (!isEnabled) {
    return (
      <div className="flex flex-col items-center justify-center py-16 mt-20 gap-3">
        <p className="text-2xl font-medium text-dark-gray">Coming Soon</p>
        <p className="text-sm text-medium-gray text-center max-w-[300px]">
          We're working hard to bring you a seamless way to access and manage BNPL customers.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Credit Assessment Record</h1>
            <p className="text-muted-foreground">
              Manage customer credit facilities and assessment records
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{totalRecords}</p>
            <p className="text-sm text-muted-foreground">Total Records</p>
          </div>
        </div>

        {/* Table Card */}
        <Card className="w-full border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Customer Credit Records</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="text-left p-3 font-bold text-sm text-gray-700"
                        style={{ width: column.width ? `${column.width}px` : 'auto' }}
                      >
                        {column.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {creditData.map((item: CreditRecord, index: number) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-200 ${index === creditData.length - 1 ? 'border-b-0' : ''}`}
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="p-3 text-sm">
                          {column.render
                            ? column.render(item, item, index)
                            : (item[column.dataIndex as keyof CreditRecord] as any) || 'N/A'
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {creditData.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4 px-6 pb-6">
                <p className="text-sm text-gray-500">
                  Showing {showingStart} to {showingEnd} of {totalRecords} records
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-xs"
                  >
                    Previous
                  </Button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0 text-xs"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {creditData.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No credit records yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Get started by processing credit assessments
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditAssessment;