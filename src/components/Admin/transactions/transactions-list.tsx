'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Type definitions
interface Transaction {
  date: string;
  amount: number;
  currency: string | null;
  status: string;
  fromAddress: string;
  name: string;
  tranRefNo: string;
  externalRefNo: string | null;
}

interface TransactionsListProps {
  data: Transaction[];
  itemsPerPage?: number;
}

// Helper functions
const getStatusColor = (status: string): string => {
  if (!status) return 'bg-gray-500 text-white';

  switch (status.toLowerCase()) {
    case 'success':
    case 'completed':
    case 'paid':
      return 'bg-green-500 text-white';
    case 'processing':
    case 'pending':
      return 'bg-blue-500 text-white';
    case 'failed':
    case 'cancelled':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getDisplayValue = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  return value.toString();
};

const formatCurrency = (amount: number, currency: string | null = null): string => {
  const currencySymbol = currency || '₦'; // Default to Naira if no currency provided
  return `${currencySymbol} ${amount.toFixed(2)}`;
};

const TransactionsList: React.FC<TransactionsListProps> = ({
  data,
  itemsPerPage = 15,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  type ColumnType<T> = {
    title: string;
    dataIndex: keyof T | string;
    key: string;
    width?: number;
    render?: (value: any, record: T) => React.ReactNode;
  };

  const columns: ColumnType<Transaction>[] = [
    {
      title: 'Transaction ID',
      dataIndex: 'tranRefNo',
      key: 'tranRefNo',
      width: 180,
      render: (text, record) => (
        <div>
          <p className="text-sm font-semibold text-gray-900">{getDisplayValue(text)}</p>
          {/* <p className="text-xs text-gray-500">{getDisplayValue(record.date)}</p> */}
        </div>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      render: (text) => (
        <p className="text-sm text-gray-900 truncate" title={text}>
          {getDisplayValue(text)}
        </p>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'customer',
      width: 150,
      render: (text) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {typeof text === 'string' && text ? text.split(' ').map(n => n[0]).join('') : 'GC'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900">{getDisplayValue(text)}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (text, record) => (
        <span className="text-sm font-semibold text-green-600">
          {formatCurrency(text, record.currency)}
        </span>
      ),
    },
    // {
    //   title: 'Address',
    //   dataIndex: 'fromAddress',
    //   key: 'address',
    //   width: 150,
    //   render: (text) => (
    //     <p className="text-sm text-gray-900 truncate" title={text}>
    //       {getDisplayValue(text)}
    //     </p>
    //   ),
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (text) => (
        <Badge className={`${getStatusColor(String(text))} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
          {getDisplayValue(text)}
        </Badge>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => handleViewDetails(record)}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
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
            {currentData.map((item, index) => (
              <tr
                key={item.tranRefNo}
                className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="p-3 text-sm">
                    {column.render
                      ? column.render(item[column.dataIndex as keyof Transaction], item)
                      : getDisplayValue(item[column.dataIndex as keyof Transaction])
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
        <p className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Transactions
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

      {/* Transaction Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader className='flex flex-col'>
            <DialogTitle>Transaction Details - {selectedTransaction?.tranRefNo || 'N/A'}</DialogTitle>
            <DialogDescription>
              Detailed information about the selected transaction
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="py-4 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Transaction Date:</p>
                  <p className="text-sm">{getDisplayValue(selectedTransaction.date)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Customer:</p>
                  <p className="text-sm">{getDisplayValue(selectedTransaction.name)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Amount:</p>
                  <p className="text-sm font-semibold text-green-600">
                    {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status:</p>
                  <Badge className={`${getStatusColor(selectedTransaction.status)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
                    {getDisplayValue(selectedTransaction.status)}
                  </Badge>
                </div>
                {/* <div className="space-y-2">
                  <p className="text-sm font-medium">External Reference:</p>
                  <p className="text-sm">{getDisplayValue(selectedTransaction.externalRefNo)}</p>
                </div> */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Currency:</p>
                  <p className="text-sm">{getDisplayValue(selectedTransaction.currency || 'NGN')}</p>
                </div>
              </div>

              {/* <div className="border-t pt-4">
                <h4 className="font-medium mb-2">From Address</h4>
                <p className="text-sm bg-gray-50 p-3 rounded-md">
                  {selectedTransaction.fromAddress ? (
                    selectedTransaction.fromAddress
                  ) : (
                    <span className="text-gray-500">No address provided</span>
                  )}
                </p>
              </div> */}

              {/* Transaction Summary */}
              <div className="border-t-2 border-gray-300 pt-4">
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between py-2 text-gray-700">
                      <span>Transaction Amount:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 text-lg font-bold text-green-600 border-t border-gray-300">
                      <span>Total:</span>
                      <span>
                        {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionsList;