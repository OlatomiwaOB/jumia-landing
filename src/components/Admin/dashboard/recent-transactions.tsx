// 'use client'
// import React, { useState } from 'react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { MoreHorizontal, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import axiosInstance from '@/utils/fetch-function';
// import useUser from '@/store/userStore';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import Papa from 'papaparse';

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

// interface DynamicTableProps {
//   columns: Column[];
//   data: Transaction[];
//   itemsPerPage?: number;
//   onViewDetails: (transaction: Transaction) => void;
// }

// interface Column {
//   title: string;
//   dataIndex: string;
//   key: string;
//   render?: (value: any, record: Transaction, index: number) => React.ReactNode;
// }

// const getStatusColor = (status: string): string => {
//   switch (status.toLowerCase()) {
//     case 'success':
//       return 'bg-green-100 text-green-800 border-green-200';
//     case 'failed':
//       return 'bg-red-100 text-red-800 border-red-200';
//     case 'pending':
//       return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//     default:
//       return 'bg-gray-100 text-gray-800 border-gray-200';
//   }
// };

// const DynamicTable: React.FC<DynamicTableProps> = ({
//   columns,
//   data,
//   itemsPerPage = 5,
//   onViewDetails
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const totalPages = Math.ceil(data.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentData = data.slice(startIndex, endIndex);

//   const handleViewDetails = (transaction: Transaction) => {
//     setSelectedTransaction(transaction);
//     setIsModalOpen(true);
//     onViewDetails(transaction);
//   };

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const getDisplayValue = (value: any): string => {
//     if (value === null || value === undefined || value === '') {
//       return 'N/A';
//     }
//     return value.toString();
//   };

//   const formatCurrency = (amount: number, currency: string | null = null): string => {
//     const currencySymbol = currency || '₦';
//     return `${currencySymbol} ${amount.toFixed(2)}`;
//   };

//   const columnsWithHandler = columns.map(col => {
//     if (col.key === 'actions') {
//       return {
//         ...col,
//         render: (text: string, record: Transaction) => (
//           <Button
//             variant="ghost"
//             size="sm"
//             className="p-1"
//             onClick={() => handleViewDetails(record)}
//           >
//             <Eye className="w-4 h-4" />
//           </Button>
//         )
//       };
//     }
//     return col;
//   });

//   return (
//     <>
//       <div className="w-full overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="border-b-2 border-gray-200">
//               {columnsWithHandler.map((column) => (
//                 <th
//                   key={column.key}
//                   className="text-left p-3 font-bold text-sm text-gray-700"
//                 >
//                   {column.title}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {currentData.map((item, index) => (
//               <tr
//                 key={index}
//                 className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
//               >
//                 {columnsWithHandler.map((column) => (
//                   <td key={column.key} className="p-3 text-sm">
//                     {column.render
//                       ? column.render(item[column.dataIndex as keyof Transaction], item, index)
//                       : item[column.dataIndex as keyof Transaction]
//                     }
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
//         <p className="text-sm text-gray-500">
//           Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
//         </p>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="text-xs"
//           >
//             <ChevronLeft className="w-4 h-4" />
//           </Button>

//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <Button
//               key={page}
//               variant={currentPage === page ? "default" : "outline"}
//               size="sm"
//               onClick={() => handlePageChange(page)}
//               className="w-8 h-8 p-0 text-xs"
//             >
//               {page}
//             </Button>
//           ))}

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="text-xs"
//           >
//             <ChevronRight className="w-4 h-4" />
//           </Button>
//         </div>
//       </div>

//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
//           <DialogHeader className='flex flex-col'>
//             <DialogTitle>Transaction Details - {selectedTransaction?.tranRefNo || 'N/A'}</DialogTitle>
//             <DialogDescription>
//               Detailed information about the selected transaction
//             </DialogDescription>
//           </DialogHeader>

//           {selectedTransaction && (
//             <div className="py-4 space-y-6">
//               {/* Basic Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Transaction Date:</p>
//                   <p className="text-sm">{getDisplayValue(selectedTransaction.date)}</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Customer:</p>
//                   <p className="text-sm">{getDisplayValue(selectedTransaction.name)}</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Amount:</p>
//                   <p className="text-sm font-semibold text-green-600">
//                     {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Status:</p>
//                   <Badge className={`${getStatusColor(selectedTransaction.status)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
//                     {getDisplayValue(selectedTransaction.status)}
//                   </Badge>
//                 </div>
//                 {/* <div className="space-y-2">
//                   <p className="text-sm font-medium">External Reference:</p>
//                   <p className="text-sm">{getDisplayValue(selectedTransaction.externalRefNo)}</p>
//                 </div> */}
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Currency:</p>
//                   <p className="text-sm">{getDisplayValue(selectedTransaction.currency || 'NGN')}</p>
//                 </div>
//               </div>

//               {/* <div className="border-t pt-4">
//                       <h4 className="font-medium mb-2">From Address</h4>
//                       <p className="text-sm bg-gray-50 p-3 rounded-md">
//                         {selectedTransaction.fromAddress ? (
//                           selectedTransaction.fromAddress
//                         ) : (
//                           <span className="text-gray-500">No address provided</span>
//                         )}
//                       </p>
//                     </div> */}

//               {/* Transaction Summary */}
//               <div className="border-t-2 border-gray-300 pt-4">
//                 <div className="flex justify-end">
//                   <div className="w-64">
//                     <div className="flex justify-between py-2 text-gray-700">
//                       <span>Transaction Amount:</span>
//                       <span className="font-medium text-green-600">
//                         {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between py-3 text-lg font-bold text-green-600 border-t border-gray-300">
//                       <span>Total:</span>
//                       <span>
//                         {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

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

// export default function TransactionHistory(): React.ReactElement {
//   const { user } = useUser();
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['recent-trans'],
//     queryFn: () => axiosInstance.request({
//       url: '/store-dashboard/fetchRecentTrans',
//       method: 'GET',
//       params: {
//         storeCode: user?.storeCode || '',
//         entityCode: user?.entityCode || process.env.NEXT_PUBLIC_ENTITYCODE,
//         pageNumber: 1,
//         pageSize: 10
//       }
//     })
//   });

//   const transactions: Transaction[] = data?.data?.transactions || [];

//   const handleExport = () => {
//     exportToCSV(transactions);
//   };

//   const handleViewDetails = (transaction: Transaction) => {
//     // console.log('Transaction details:', transaction);
//   };

//   const columns: Column[] = [
//     {
//       title: 'Ref. No',
//       dataIndex: 'tranRefNo',
//       key: 'tranRefNo',
//       render: (text: string) => (
//         <p className="text-sm font-semibold text-gray-900 truncate">{text}</p>
//       ),
//     },
//     {
//       title: 'Date',
//       dataIndex: 'date',
//       key: 'date',
//       render: (text: string) => (
//         <p className="text-sm text-gray-900 min-w-[80px]">{text}</p>
//       ),
//     },
//     {
//       title: 'Customer',
//       dataIndex: 'name',
//       key: 'name',
//       render: (text: string, record: Transaction) => (
//         <div className="flex items-center gap-3">
//           <Avatar className="w-8 h-8">
//             <AvatarFallback className="bg-blue-500 text-white text-xs">
//               {text ? text.split(' ').map(n => n[0]).join('') : 'N/A'}
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <p className="text-sm font-medium text-gray-900">{text || 'N/A'}</p>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'amount',
//       key: 'amount',
//       render: (text: number) => (
//         <span className="text-sm font-semibold text-green-600">{text}</span>
//       ),
//     },
//     // {
//     //   title: 'Address',
//     //   dataIndex: 'fromAddress',
//     //   key: 'fromAddress',
//     //   render: (text: string) => (
//     //     <p className="text-sm text-gray-900 max-w-[120px] truncate" title={text}>
//     //       {text || 'N/A'}
//     //     </p>
//     //   ),
//     // },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (text: string) => (
//         <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 border`}>
//           {text}
//         </Badge>
//       ),
//     },
//     {
//       title: 'Actions',
//       dataIndex: 'actions',
//       key: 'actions',
//       render: (text: string, record: Transaction) => (
//         <Button
//           variant="ghost"
//           size="sm"
//           className="p-1"
//           onClick={() => handleViewDetails(record)}
//         >
//           <Eye className="w-4 h-4" />
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <Card className="border-gray-200 shadow-sm">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-base lg:text-lg font-semibold text-gray-900">
//             Recent Transactions
//           </CardTitle>
//           <Button variant="outline" size="sm" className="gap-2" onClick={handleExport} disabled={transactions.length === 0}>
//             <Download className="w-4 h-4" />
//             <span className="hidden sm:inline">Export</span>
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <div className="flex justify-center items-center h-40">
//             <p className="text-gray-500">Loading transactions...</p>
//           </div>
//         ) : error ? (
//           <div className="flex justify-center items-center h-40">
//             <p className="text-red-500">Error loading transactions</p>
//           </div>
//         ) : transactions.length === 0 ? (
//           <div className="flex justify-center items-center h-40">
//             <p className="text-gray-500">No transactions found</p>
//           </div>
//         ) : (
//           <DynamicTable
//             columns={columns}
//             data={transactions}
//             onViewDetails={handleViewDetails}
//           />
//         )}
//       </CardContent>
//     </Card>
//   );
// }


'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useUser from '@/store/userStore';
import axiosInstance from '@/utils/fetch-function';
import { TransInflowIcon, TransOutflowIcon } from '@/components/icons/icons';
import { TransactionDetailsModal } from '../transactions/transactions-details';
import Link from 'next/link';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';

interface Transaction {
  date: string;
  amount: number;
  currency: string | null;
  status: string;
  fromAddress?: string;
  name: string;
  tranRefNo: string;
}

type TranType = 'inward' | 'outward' | 'pending';

const getTranType = (transaction: Transaction): TranType => {
  if (transaction.status.toLowerCase() === 'pending') return 'pending';
  const ref = transaction.tranRefNo?.toLowerCase() ?? '';
  if (ref.startsWith('inft') || ref.startsWith('ordset') || ref.startsWith('rr')) return 'inward';
  return 'outward';
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'success':
    case 'successful':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'failed':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'reversed':
      return 'bg-purple-100 text-purple-700 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const getDisplayValue = (value: any): string => {
  if (value === null || value === undefined || value === '') return 'N/A';
  return value.toString();
};

const TranIcon: React.FC<{ type: TranType }> = ({ type }) => {
  const base =
    'flex items-center justify-center w-8 h-8 rounded-full shrink-0';

  if (type === 'inward') {
    return (
      <div className='p-1 border-2 border-[#BDE2C7] rounded-full'>
        <span className={`${base} bg-[#EBFFEE]`}>
          <TransInflowIcon className="w-5 h-5 text-[#018E25]" />
        </span>
      </div>
    );
  }
  if (type === 'outward') {
    return (
      <div className='p-1 border-2 border-[#FFCCCD] rounded-full'>
        <span className={`${base} bg-[#FEE9E7]`}>
          <TransOutflowIcon className="w-5 h-5 text-[#FF383C]" />
        </span>
      </div>
    );
  }

  return (
    <div className='p-1 border-2 border-yellow-100 rounded-full'>
      <span className={`${base} bg-yellow-50`}>
        <Clock className="w-5 h-5 text-yellow-600" />
      </span>
    </div>
  );
};

const TransactionRow: React.FC<{
  transaction: Transaction;
  onClick: (t: Transaction) => void;
  isLast: boolean;
}> = ({ transaction, onClick, isLast }) => {
  const type = getTranType(transaction);

  return (
    <button
      type="button"
      onClick={() => onClick(transaction)}
      className={`w-full flex items-center gap-3 py-3 px-1 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer ${!isLast ? 'border-b-1 border-[#EEEEEE]' : ''
        }`}
    >
      <TranIcon type={type} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-dark-gray truncate">
          {getDisplayValue(transaction.tranRefNo)}
        </p>
        <p className="text-xs text-medium-gray mt-0.5">
          {getDisplayValue(transaction.date)}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-dark-gray">
          {formatPrice(transaction.amount, transaction.currency as CurrencyCode)}
        </p>
        <Badge
          className={`mt-1 text-[10px] px-2 py-0.5 border font-medium ${getStatusColor(
            transaction.status
          )}`}
        >
          {transaction.status}
        </Badge>
      </div>
    </button>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
  onChange: (p: number) => void;
}> = ({ currentPage, totalPages, total, perPage, onChange }) => {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, total);

  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t-1 border-[#EEEEEE]">
      <p className="text-xs text-medium-gray">
        {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-xs px-2.5 py-1 rounded-md border border-medium-gray disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`text-xs w-7 h-7 rounded-md border transition-colors ${p === currentPage
              ? 'bg-faded-accent text-white border-border'
              : 'border-border hover:bg-gray-50'
              }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-xs px-2.5 py-1 rounded-md border border-medium-gray disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
};

const ITEMS_PER_PAGE = 5;

export default function TransactionHistory(): React.ReactElement {
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['recent-trans'],
    queryFn: () => axiosInstance.request({
      url: '/store-dashboard/fetchRecentTrans',
      method: 'GET',
      params: {
        storeCode: user?.storeCode || '',
        entityCode: user?.entityCode || process.env.NEXT_PUBLIC_ENTITYCODE,
        pageNumber: 1,
        pageSize: 10
      }
    })
  });

  const transactions: Transaction[] = data?.data?.transactions || [];

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const paginated = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  if (!transactions.length && !isLoading)
    return (
      <Card>
        <CardHeader className='border-b-1 border-[#EEEEEE] py-3'>
          <div className="flex items-center justify-between">
            <CardTitle className="text-dark-gray text-md font-semibold">
              Recent Transactions
            </CardTitle>
            <div className="flex items-center gap-2">
              <Link href='/admin/transactions'>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-faded-accent hover:text-accent px-0 font-semibold"
                >
                  See All
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-1">
          <div className="flex justify-center items-center h-40">
            <p className="text-medium-gray text-sm">No recent transactions found</p>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <>
      <Card>
        <CardHeader className='border-b-1 border-[#EEEEEE] py-3'>
          <div className="flex items-center justify-between">
            <CardTitle className="text-dark-gray text-md font-semibold">
              Recent Transactions
            </CardTitle>
            <div className="flex items-center gap-2">
              <Link href='/admin/transactions'>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-faded-accent hover:text-accent px-0 font-semibold"
                >
                  See All
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-sm text-gray-400">Loading transactions…</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-sm text-red-400">Error loading transactions</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {paginated.map((t, idx) => (
                  <TransactionRow
                    key={t.tranRefNo + idx}
                    transaction={t}
                    onClick={handleRowClick}
                    isLast={idx === paginated.length - 1}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  total={transactions.length}
                  perPage={ITEMS_PER_PAGE}
                  onChange={setCurrentPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <TransactionDetailsModal
        transaction={selectedTransaction}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        getTranType={getTranType}
      />
    </>
  );
}