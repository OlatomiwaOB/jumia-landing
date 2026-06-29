'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { TransactionDetailsModal } from '@/components/Customer/transactions/transactions-details';

export interface Transaction {
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

const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'success': case 'completed': case 'paid':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'failed': case 'cancelled':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'reversed':
      return 'bg-purple-100 text-purple-700 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const formatCurrency = (amount: number, currency: string | null): string => {
  const symbol = currency || '₦';
  return `${symbol}${Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
};

const TablePagination: React.FC<{
  current: number;
  total: number;
  perPage: number;
  onChange: (p: number) => void;
}> = ({ current, total, perPage, onChange }) => {
  const pages = Math.ceil(total / perPage);
  const start = (current - 1) * perPage + 1;
  const end = Math.min(current * perPage, total);

  const getPageNumbers = (): (number | '...')[] => {
    if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
    const result: (number | '...')[] = [];
    if (current <= 3) {
      result.push(1, 2, 3, '...', pages);
    } else if (current >= pages - 2) {
      result.push(1, '...', pages - 2, pages - 1, pages);
    } else {
      result.push(1, '...', current, '...', pages);
    }
    return result;
  };

  return (
    <div className="flex items-center justify-between mt-4 pt-4 mb-10">
      <p className="text-sm text-dark-gray">
        Showing {start}–{end} of {total} Transactions per Page
      </p>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 rounded-lg"
          onClick={() => onChange(current - 1)} disabled={current === 1}>
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="text-xs text-gray-400 px-1">···</span>
          ) : (
            <button key={p} onClick={() => onChange(p as number)}
              className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${p === current
                ? 'border-2 border-faded-accent text-faded-accent'
                : 'text-gray-600 hover:bg-gray-100'
                }`}>
              {p}
            </button>
          )
        )}

        <Button variant="ghost" size="sm" className="h-8 rounded-lg"
          onClick={() => onChange(current + 1)} disabled={current === pages}>
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const DesktopRow: React.FC<{
  transaction: Transaction;
  onClick: (t: Transaction) => void;
  isLast: boolean;
}> = ({ transaction, onClick, isLast }) => {

  return (
    <tr
      className={`border-b-2 border-[#EEEEEE] transition-colors cursor-pointer hover:bg-sidebar-accent/10 ${isLast ? 'border-b-0' : ''
        }`}
    >
      <td className="px-3 py-3.5">
        <div className="flex items-center gap-3 max-w-[80px]">
          <div className="min-w-0">
            <p className="text-sm text-medium-gray">{transaction.date}</p>
          </div>
        </div>
      </td>

      <td className="px-3 py-3.5 max-w-[120px]">
        <p className="text-sm font-semibold text-dark-gray">{transaction.name || 'N/A'}</p>
      </td>

      <td className="px-3 py-3.5">
        <p className="text-sm font-medium text-dark-gray">
          {formatCurrency(transaction.amount, transaction.currency)}
        </p>
      </td>

      <td className="px-3 py-3.5">
        <p className="text-sm font-semibold text-dark-gray truncate max-w-[160px]">
          {transaction.tranRefNo || 'N/A'}
        </p>
      </td>

      <td className="px-3 py-3.5">
        <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(transaction.status)}`}>
          {transaction.status}
        </Badge>
      </td>

      <td>
        <Button size="xs" variant="action" onClick={() => onClick(transaction)} title="View Details">
          <Eye className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
};

const MobileCard: React.FC<{
  transaction: Transaction;
  onClick: (t: Transaction) => void;
}> = ({ transaction, onClick }) => {

  return (
    <button
      type="button"
      onClick={() => onClick(transaction)}
      className="w-full flex items-center gap-3 py-3 px-1 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-lg cursor-pointer border-b border-gray-100 last:border-b-0"
    >

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-dark-gray truncate">
          {transaction.tranRefNo || 'N/A'}
        </p>
        <p className="text-xs text-medium-gray mt-0.5">{transaction.date}</p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-dark-gray">
          {formatCurrency(transaction.amount, transaction.currency)}
        </p>
        <Badge className={`mt-1 text-[10px] px-2 py-0.5 border font-medium ${getStatusColor(transaction.status)}`}>
          {transaction.status}
        </Badge>
      </div>
    </button>
  );
};

const TransactionsList: React.FC<TransactionsListProps> = ({
  data,
  itemsPerPage = 15,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginated = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleClick = (t: Transaction) => {
    setSelectedTransaction(t);
    setIsModalOpen(true);
  };

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 mt-20 gap-3">
        <p className="text-2xl font-medium text-dark-gray">No transactions found</p>
        <p className="text-sm text-medium-gray text-center max-w-[200px]">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:block w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-[#EEEEEE]">
              {['Date', 'Customer', 'Amount', 'Transaction ID', 'Status'].map((h) => (
                <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((t, idx) => (
              <DesktopRow
                key={t.tranRefNo + idx}
                transaction={t}
                onClick={handleClick}
                isLast={idx === paginated.length - 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-gray-100">
        {paginated.map((t, idx) => (
          <MobileCard key={t.tranRefNo + idx} transaction={t} onClick={handleClick} />
        ))}
      </div>

      {totalPages > 1 && (
        <TablePagination
          current={currentPage}
          total={data.length}
          perPage={itemsPerPage}
          onChange={setCurrentPage}
        />
      )}

      <TransactionDetailsModal
        transaction={selectedTransaction}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // onShare={(t) => {
        //   console.log('Share receipt for', t.tranRefNo);
        // }}
        // onDownload={(t) => {
        //   console.log('Download receipt for', t.tranRefNo);
        // }}
      />
    </>
  );
};

export default TransactionsList;