'use client'
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import Papa from 'papaparse';
import TransactionsFilter, { TransactionFilterState } from './transactions-filter';
import TransactionsList, { Transaction } from './transactions-list';

const ddmmyyyyToDate = (ddmmyyyy: string): Date | null => {
  if (!ddmmyyyy) return null;
  const datePart = ddmmyyyy.split(' ')[0];
  const separator = datePart.includes('/') ? '/' : '-';
  const [dd, mm, yyyy] = datePart.split(separator);

  if (!dd || !mm || !yyyy) return null;
  const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
};

const ddmmyyyyToISO = (ddmmyyyy: string): string => {
  if (!ddmmyyyy) return '';

  const datePart = ddmmyyyy.split(' ')[0];
  const separator = datePart.includes('/') ? '/' : '-';
  const [dd, mm, yyyy] = datePart.split(separator);

  if (!dd || !mm || !yyyy) return '';
  return `${dd}-${mm}-${yyyy}`;
};

const exportToCSV = (transactions: Transaction[]) => {
  if (!transactions?.length) { alert('No data to export'); return; }
  const csv = Papa.unparse(
    transactions.map((t) => ({
      'Reference No': t.tranRefNo,
      'Date': t.date,
      'Customer Name': t.name,
      'Amount': t.amount,
      'Currency': t.currency || 'N/A',
      'Status': t.status,
      'External Ref': t.externalRefNo || 'N/A',
    }))
  );
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const TransactionsManager: React.FC = () => {

  const [filters, setFilters] = useState<TransactionFilterState>({
    searchTerm: '',
    status: 'all',
    startDate: '',
    endDate: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['customer-transactions', filters.status, filters.startDate, filters.endDate],
    queryFn: () => {
      const params: Record<string, any> = { pageNumber: 1, pageSize: 5000 };
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.startDate) params.startDate = ddmmyyyyToISO(filters.startDate);
      if (filters.endDate) params.endDate = ddmmyyyyToISO(filters.endDate);
      return axiosCustomer.request({
        url: '/customer-dashboard/fetchRecentTrans',
        method: 'GET',
        params,
      });
    },
  });

  const allTransactions: Transaction[] = data?.data?.transactions || [];

  const filteredTransactions = useMemo(() => {
    let r = allTransactions;

    const s = filters.searchTerm.toLowerCase().trim();
    if (s) {
      r = r.filter((t) =>
        t.tranRefNo?.toLowerCase().includes(s) ||
        t.name?.toLowerCase().includes(s)
      );
    }

    if (filters.status !== 'all') {
      r = r.filter((t) => t.status?.toLowerCase() === filters.status.toLowerCase());
    }

    const startDate = ddmmyyyyToDate(filters.startDate);
    const endDate = ddmmyyyyToDate(filters.endDate);

    if (startDate) {
      r = r.filter((t) => {
        const dateStr = t.date.split(' ')[0];
        const separator = dateStr.includes('/') ? '/' : '-';
        const [dd, mm, yyyy] = dateStr.split(separator);
        const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
        return !isNaN(d.getTime()) && d >= startDate;
      });
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      r = r.filter((t) => {
        const dateStr = t.date.split(' ')[0];
        const separator = dateStr.includes('/') ? '/' : '-';
        const [dd, mm, yyyy] = dateStr.split(separator);
        const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
        return !isNaN(d.getTime()) && d <= end;
      });
    }

    return r;
  }, [allTransactions, filters]);

  return (
    <div className="min-h-screen px-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-dark-gray">Transactions</h2>
      </div>

      <div className="mb-4">
        <TransactionsFilter
          onFilterChange={setFilters}
          onExport={() => exportToCSV(filteredTransactions)}
          totalCount={filteredTransactions.length}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-sidebar-accent border-t-transparent animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20 text-red-400 text-sm">
          Error loading transactions
        </div>
      ) : (
        <TransactionsList data={filteredTransactions} itemsPerPage={15} />
      )}
    </div>
  );
};

export default TransactionsManager;