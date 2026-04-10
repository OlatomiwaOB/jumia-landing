'use client'
import React, { useState } from 'react'
import TransactionsFilter from './transactions-filter'
import { useQuery } from '@tanstack/react-query'
import axiosCustomer from '@/utils/fetch-function-customer'
import TransactionsList from './transactions-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Papa from 'papaparse';
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface FilterState {
  searchTerm: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface Transaction {
  date: string;
  amount: number;
  currency: string | null;
  status: string;
  fromAddress: string;
  name: string;
  tranRefNo: string;
  externalRefNo: string;
}

const exportToCSV = (transactions: Transaction[]) => {
  if (!transactions || transactions.length === 0) {
    alert('No data to export');
    return;
  }

  const csvData = transactions.map(transaction => ({
    'Reference No': transaction.tranRefNo,
    'Date': transaction.date,
    'Customer Name': transaction.name,
    'Amount': transaction.amount,
    'Currency': transaction.currency || 'N/A',
    'Status': transaction.status,
    // 'From Address': transaction.fromAddress || 'N/A',
    'External Reference': transaction.externalRefNo || 'N/A'
  }));

  const csv = Papa.unparse(csvData);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const TransactionsManager = () => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    status: 'all',
    startDate: '',
    endDate: ''
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['customer-recent-trans', filters],
    queryFn: () => {
      const params: any = {
          pageNumber: 1,
          pageSize: 50
      };

      if (filters.searchTerm) {
        params.tranRefNo = filters.searchTerm;
      }
      if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
      }
      if (filters.startDate) {
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      return axiosCustomer.request({
        url: '/customer-dashboard/fetchRecentTrans',
        method: 'GET',
        params
      });
    }
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const transactions = data?.data?.transactions || [];

  const handleExport = () => {
    exportToCSV(transactions);
  };

  return (
    <main className='space-y-5'>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Transactions
            </h1>
            <p className="text-muted-foreground">
              Accurate tracking for your transactions
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
          <p className="text-sm text-muted-foreground">Total Transactions</p>
        </div>
      </div>

      <TransactionsFilter onFilterChange={handleFilterChange} />

      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base lg:text-lg font-semibold text-gray-900">
              Transactions
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExport} disabled={transactions.length === 0}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-red-500">Error loading transactions</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            <TransactionsList data={transactions} />
          )}
        </CardContent>
      </Card>
    </main >
  )
}

export default TransactionsManager