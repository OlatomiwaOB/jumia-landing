'use client'
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Edit, Star } from "lucide-react";
import { PaymentMethod } from "@/types";

interface PaymentMethodsTableProps {
  data: PaymentMethod[];
  onEdit: (method: PaymentMethod) => void;
  onDelete: (code: string) => void;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export const PaymentMethodsTable: React.FC<PaymentMethodsTableProps> = ({
  data,
  onEdit,
  onDelete,
  itemsPerPage = 5,
  currentPage = 1,
  onPageChange
}) => {
  const getDisplayValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return value.toString();
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  const columns = [
    {
      title: "Payment Method",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (_: any, record: PaymentMethod) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center p-2 shadow-soft">
            {record.logo ? (
              <img
                src={record.logo}
                alt={record.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900 flex items-center gap-2">
              {getDisplayValue(record.name)}
              {record.isRecommended && (
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            <div className="text-sm text-gray-500">
              {getDisplayValue(record.description)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "paymentType",
      key: "paymentType",
      width: 150,
      render: (type: string) => (
        <Badge variant="secondary" className="font-medium">
          {type ? type.replace(/_/g, " ") : 'N/A'}
        </Badge>
      ),
    },
    {
      title: "Provider",
      dataIndex: "serviceProvider",
      key: "serviceProvider",
      width: 150,
      render: (provider: string) => (
        <span className="text-sm text-gray-900">
          {provider ? provider.replace(/_/g, " ") : 'N/A'}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Badge className={`text-xs px-2 py-1 flex items-center gap-1 w-fit ${
          status === "ACTIVE" 
            ? "bg-green-500 text-white" 
            : "bg-gray-500 text-white"
        }`}>
          {getDisplayValue(status)}
        </Badge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_: any, record: PaymentMethod) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => onEdit(record)}
            title="Edit Payment Method"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
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
            {currentData.map((item, index) => (
              <tr
                key={item.code}
                className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="p-3 text-sm">
                    {column.render
                      ? column.render(item[column.dataIndex as keyof PaymentMethod], item)
                      : getDisplayValue(item[column.dataIndex as keyof PaymentMethod])
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Payment Methods
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

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-8 h-8 p-0 text-xs"
              >
                {page}
              </Button>
            ))}

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
      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <CreditCard className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No payment methods yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first payment method
          </p>
        </div>
      )}
    </div>
  );
};