'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Eye, Edit, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermissionBusiness';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import type { EcomComponent, EcomComponentListResponse } from '@/types';
import useUser from '@/store/userStore';

interface Column {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  render?: (value: any, record: EcomComponent, index: number) => React.ReactNode;
}

const getDisplayValue = (value: any): string => {
  return value?.toString() || 'N/A';
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-sm text-gray-900">{value}</p>
  </div>
);

export default function ComponentManagementPage() {
  usePageMetadata('Component Management', 'View and manage your components');
  const { usePermissionGuard } = usePermission();
  usePermissionGuard('MANAGE_INVENTORY', {
    redirectToNotPermitted: true,
    toastMessage: "You don't have permission to manage components"
  });

  const router = useRouter();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [selectedComponent, setSelectedComponent] = useState<EcomComponent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser()
  console.log('user object', user)
  const { data, isLoading, error, refetch } = useQuery<EcomComponentListResponse>({
    queryKey: ['ecom-components-list', pageNumber, pageSize, filterType],
    queryFn: () => axiosInstance.get('/ecom-components/list', {
      params: {
        pageNumber,
        pageSize,
        componentType: filterType || undefined,
      }
    }).then(res => res.data),
  });

  const components = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 0;

  const filteredComponents = components.filter(c =>
    !searchTerm ||
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.storeCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (component: EcomComponent) => {
    setSelectedComponent(component);
    setIsModalOpen(true);
  };

  const handleEditDetails = (component: EcomComponent) => {
    router.push(`/admin/component-management/create?id=${component.id}`);
  };

  const columns: Column[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text: string) => (
        <p className="text-sm font-medium text-gray-900">{getDisplayValue(text)}</p>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'componentType',
      key: 'componentType',
      width: 100,
      render: (text: string) => (
        <Badge variant="outline" className="text-xs">
          {getDisplayValue(text)}
        </Badge>
      ),
    },
    {
      title: 'Store',
      dataIndex: 'storeCode',
      key: 'storeCode',
      width: 120,
      render: (text: string) => (
        <p className="text-sm text-gray-600">{getDisplayValue(text)}</p>
      ),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (text: string) => (
        <p className="text-sm text-gray-500 font-mono">{getDisplayValue(text)}</p>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      render: (text: string) => (
        <p className="text-sm text-gray-500">
          {text ? new Date(text).toLocaleDateString() : 'N/A'}
        </p>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: 100,
      render: (_text: string, record: EcomComponent) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => handleViewDetails(record)}
          >
            <Eye className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => handleEditDetails(record)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Component Management
              </h1>
              <p className="text-muted-foreground">
                View and manage your store components
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{totalCount}</p>
            <p className="text-sm text-muted-foreground">Total Components</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-40">
                <Select value={filterType || "ALL"} onValueChange={(v) => { setFilterType(v === "ALL" ? "" : v); setPageNumber(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="BANNER">Banner</SelectItem>
                    <SelectItem value="CONTENT">Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link href="/admin/component-management/create" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto gap-2">
                  <Plus className="w-4 h-4" />
                  Create Component
                </Button>
              </Link>
            </div>
          </div>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Component List
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-red-500">Error loading components</p>
                </div>
              ) : components.length === 0 ? (
                <div className="flex justify-center items-center h-40 flex-col gap-4">
                  <p className="text-gray-500">No components found</p>
                  <Link href="/admin/component-management/create">
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Your First Component
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
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
                        {filteredComponents.map((item, index) => (
                          <tr
                            key={item.id}
                            className={`border-b border-gray-200 ${index === filteredComponents.length - 1 ? 'border-b-0' : ''}`}
                          >
                            {columns.map((column) => (
                              <td key={column.key} className="p-3 text-sm">
                                {column.render
                                  ? column.render(item[column.dataIndex as keyof EcomComponent], item, index)
                                  : getDisplayValue(item[column.dataIndex as keyof EcomComponent])
                                }
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
                    <p className="text-sm text-gray-500">
                      Showing {(pageNumber - 1) * pageSize + 1} to {Math.min(pageNumber * pageSize, totalCount)} of {totalCount} Components
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                        disabled={pageNumber === 1}
                        className="text-xs"
                      >
                        Previous
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={pageNumber === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPageNumber(page)}
                          className="w-8 h-8 p-0 text-xs"
                        >
                          {page}
                        </Button>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
                        disabled={pageNumber === totalPages}
                        className="text-xs"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Component Details - {selectedComponent?.title || 'N/A'}</DialogTitle>
            <DialogDescription>
              Detailed information about the selected component
            </DialogDescription>
          </DialogHeader>

          {selectedComponent && (
            <div className="py-4 space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {selectedComponent.componentType}
                </Badge>
                <Badge className="text-xs">
                  {getDisplayValue(selectedComponent.code)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow label="Title" value={getDisplayValue(selectedComponent.title)} />
                <DetailRow label="Subtitle" value={getDisplayValue(selectedComponent.subTitle)} />
                <DetailRow label="Store Code" value={getDisplayValue(selectedComponent.storeCode)} />
                <DetailRow label="Entity Code" value={getDisplayValue(selectedComponent.entityCode)} />
                <DetailRow label="Merchant ID" value={getDisplayValue(selectedComponent.merchantId)} />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Link</p>
                  {selectedComponent.link ? (
                    <a href={selectedComponent.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      {selectedComponent.link}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400">N/A</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Detail</p>
                <p className="text-sm text-gray-900">{getDisplayValue(selectedComponent.detail)}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                <DetailRow label="Created By" value={getDisplayValue(selectedComponent.createdBy)} />
                <DetailRow label="Created Date" value={selectedComponent.createdDate ? new Date(selectedComponent.createdDate).toLocaleString() : 'N/A'} />
                <DetailRow label="Modified By" value={getDisplayValue(selectedComponent.modifiedBy)} />
                <DetailRow label="Modified Date" value={selectedComponent.modifiedDate ? new Date(selectedComponent.modifiedDate).toLocaleString() : 'N/A'} />
              </div>

              {(selectedComponent.image1 || selectedComponent.image2) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                  {selectedComponent.image1 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Image 1</p>
                      <img src={selectedComponent.image1} alt="Image 1" className="w-full h-32 object-cover rounded-lg border" />
                    </div>
                  )}
                  {selectedComponent.image2 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Image 2</p>
                      <img src={selectedComponent.image2} alt="Image 2" className="w-full h-32 object-cover rounded-lg border" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
