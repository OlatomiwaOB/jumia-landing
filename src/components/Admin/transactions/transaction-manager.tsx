// 'use client'
// import React, { useState } from 'react'
// import TransactionsFilter from './transactions-filter'
// import { useQuery } from '@tanstack/react-query'
// import axiosInstance from '@/utils/fetch-function';
// import TransactionsList from './transactions-list'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import useUser from '@/store/userStore';
// import Papa from 'papaparse';
// import { Download } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// interface FilterState {
//   searchTerm: string;
//   status: string;
//   startDate: string;
//   endDate: string;
// }

// interface Transaction {
//   date: string;
//   amount: number;
//   currency: string | null;
//   status: string;
//   fromAddress: string;
//   name: string;
//   tranRefNo: string;
//   externalRefNo: string;
// }

// const exportToCSV = (transactions: Transaction[]) => {
//   if (!transactions || transactions.length === 0) {
//     alert('No data to export');
//     return;
//   }

//   const csvData = transactions.map(transaction => ({
//     'Reference No': transaction.tranRefNo,
//     'Date': transaction.date,
//     'Customer Name': transaction.name,
//     'Amount': transaction.amount,
//     'Currency': transaction.currency || 'N/A',
//     'Status': transaction.status,
//     // 'From Address': transaction.fromAddress || 'N/A',
//     'External Reference': transaction.externalRefNo || 'N/A'
//   }));

//   const csv = Papa.unparse(csvData);

//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   const url = URL.createObjectURL(blob);

//   link.setAttribute('href', url);
//   link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
//   link.style.visibility = 'hidden';

//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// const TransactionsManager = () => {
//   const { user } = useUser();
//   const [filters, setFilters] = useState<FilterState>({
//     searchTerm: '',
//     status: 'all',
//     startDate: '',
//     endDate: ''
//   });

//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ['fetch-trans', filters],
//     queryFn: () => {
//       const params: any = {
//         storeCode: user?.storeCode,
//         entityCode: user?.entityCode,
//         pageNumber: 1,
//         pageSize: 50
//       };

//       if (filters.searchTerm) {
//         params.tranRefNo = filters.searchTerm;
//       }
//       if (filters.status && filters.status !== 'all') {
//         params.status = filters.status;
//       }
//       if (filters.startDate) {
//         params.startDate = filters.startDate;
//       }
//       if (filters.endDate) {
//         params.endDate = filters.endDate;
//       }

//       return axiosInstance.request({
//         url: '/store-dashboard/fetchRecentTrans',
//         method: 'GET',
//         params
//       });
//     },
//     enabled: !!user?.storeCode && !!user?.entityCode
//   });

//   const handleFilterChange = (newFilters: FilterState) => {
//     setFilters(newFilters);
//   };

//   const transactions = data?.data?.transactions || [];

//   const handleExport = () => {
//     exportToCSV(transactions);
//   };

//   return (
//     <main className='space-y-5'>
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground mb-2">
//               Transactions
//             </h1>
//             <p className="text-muted-foreground">
//               Accurate tracking for your transactions
//             </p>
//           </div>
//         </div>
//         <div className="text-right">
//           <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
//           <p className="text-sm text-muted-foreground">Total Transactions</p>
//         </div>
//       </div>

//       <TransactionsFilter onFilterChange={handleFilterChange} />

//       <Card className="border-gray-200 shadow-sm">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-base lg:text-lg font-semibold text-gray-900">
//               Transactions
//             </CardTitle>
//             <Button variant="outline" size="sm" className="gap-2" onClick={handleExport} disabled={transactions.length === 0}>
//               <Download className="w-4 h-4" />
//               <span className="hidden sm:inline">Export</span>
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="flex justify-center items-center h-40">
//               <p className="text-gray-500">Loading transactions...</p>
//             </div>
//           ) : error ? (
//             <div className="flex justify-center items-center h-40">
//               <p className="text-red-500">Error loading transactions</p>
//             </div>
//           ) : transactions.length === 0 ? (
//             <div className="flex justify-center items-center h-40">
//               <p className="text-gray-500">No transactions found</p>
//             </div>
//           ) : (
//             <TransactionsList data={transactions} />
//           )}
//         </CardContent>
//       </Card>
//     </main >
//   )
// }

// export default TransactionsManager


'use client'
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';
import Papa from 'papaparse';
import TransactionsFilter, { TransactionFilterState } from './transactions-filter';
import TransactionsList, { Transaction } from './transactions-list';
import { formatDateToDDMMYYYY } from '@/utils/helperfns';

const ddmmyyyyToDate = (ddmmyyyy: string): Date | null => {
  if (!ddmmyyyy) return null;
  const datePart = ddmmyyyy.split(' ')[0];
  const separator = datePart.includes('/') ? '/' : '-';
  const [dd, mm, yyyy] = datePart.split(separator);
  if (!dd || !mm || !yyyy) return null;
  const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
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
  link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
  link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const TransactionsManager: React.FC = () => {
  const { user } = useUser();

  const [filters, setFilters] = useState<TransactionFilterState>({
    searchTerm: '',
    status: 'all',
    startDate: '',
    endDate: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-transactions', filters.status, filters.startDate, filters.endDate],
    queryFn: () => {
      const params: Record<string, any> = {
        storeCode: user?.storeCode,
        entityCode: user?.entityCode,
        pageNumber: 1,
        pageSize: 5000,
      };
      if (filters.searchTerm) params.tranRefNo = filters.searchTerm;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.startDate) params.startDate = formatDateToDDMMYYYY(filters.startDate);
      if (filters.endDate) params.endDate = formatDateToDDMMYYYY(filters.endDate);
      return axiosInstance.request({
        url: '/store-dashboard/fetchRecentTrans',
        method: 'GET',
        params,
      });
    },
    enabled: !!user?.storeCode && !!user?.entityCode,
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