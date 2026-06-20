'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useCustomer from '@/store/customerStore';
import axiosCustomer from '@/utils/fetch-function-customer';
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
  if (ref.startsWith('inft') || ref.startsWith('ibft') || ref.startsWith('rr')) return 'inward';
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
  const amountColor =
    type === 'inward'
      ? 'text-dark-gray'
      : type === 'outward'
        ? 'text-dark-gray'
        : 'text-dark-gray';

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
        <p className={`text-sm font-bold ${amountColor}`}>
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
  const { customer } = useCustomer();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['customer-recent-trans'],
    queryFn: () =>
      axiosCustomer.request({
        url: '/customer-dashboard/fetchRecentTrans',
        method: 'GET',
        params: { pageNumber: 1, pageSize: 10 },
      }),
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
      <>
      <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-4 lg:p-6">
        <div className='pb-4 mb-4 border-b border-[#EEEEEE]'>
          <div className="flex items-center justify-between">
            <h2 className="text-dark-gray text-lg font-semibold">
              Recent Transactions
            </h2>
            <Link href='/customer/transactions'>
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

        <div className="pt-1">
          <div className="flex justify-center items-center h-40">
            <p className="text-medium-gray text-sm">No recent transactions found</p>
          </div>
        </div>
      </div>
      </>
    );

  return (
    <>
      <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-4 lg:p-6">
        <div className='pb-4 mb-4 border-b border-[#EEEEEE]'>
          <div className="flex items-center justify-between">
            <h2 className="text-dark-gray text-lg font-semibold">
              Recent Transactions
            </h2>
            <Link href='/customer/transactions'>
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

        <div className="pt-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-sm text-gray-400">Loading transactions…</p>
            </div>
          ) : (
            <>
              <div>
                {paginated.map((txn, idx) => (
                  <TransactionRow
                    key={idx}
                    transaction={txn}
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
        </div>
      </div>

      <TransactionDetailsModal
        transaction={selectedTransaction}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        getTranType={getTranType}
        // onShare={(t) => {
        //   console.log('Share receipt for', t.tranRefNo);
        // }}
        // onDownload={(t) => {
        //   console.log('Download receipt for', t.tranRefNo);
        // }}
      />
    </>
  );
}