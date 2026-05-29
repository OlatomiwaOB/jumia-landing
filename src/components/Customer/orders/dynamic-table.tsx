'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: number;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface OrdersTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  rowKey: keyof T;
  itemsPerPage?: number;
  onRowClick?: (record: T) => void;
}

const TablePagination: React.FC<{
  current: number;
  total: number;
  perPage: number;
  onChange: (p: number) => void;
}> = ({ current, total, perPage, onChange }) => {
  const pages = Math.ceil(total / perPage);
  const start = (current - 1) * perPage + 1;
  const end = Math.min(current * perPage, total);

  const getPageNumbers = () => {
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
      <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Orders per Page</p>
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

function OrdersTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  itemsPerPage = 15,
  onRowClick,
}: OrdersTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginated = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 mt-20 gap-3">
        <p className="text-2xl font-medium text-dark-gray">No orders found</p>
        <p className="text-sm text-medium-gray text-center max-w-[200px]">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-[#EEEEEE]">
              {columns.map((col) => (
                <th key={col.key}
                  className="text-left px-3 py-3 text-sm font-semibold  text-dark-gray tracking-wide"
                  style={{ width: col.width ? `${col.width}px` : 'auto' }}>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((item, idx) => (
              <tr key={String(item[rowKey]) + idx}
                onClick={() => onRowClick?.(item)}
                className={`border-b-2 border-[#EEEEEE] transition-colors ${onRowClick ? 'cursor-pointer hover:bg-orange-50/40' : ''
                  } ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-3.5 text-sm">
                    {col.render
                      ? col.render(col.dataIndex ? item[col.dataIndex] : undefined, item, idx)
                      : col.dataIndex
                        ? <span className="text-gray-700">{String(item[col.dataIndex] ?? 'N/A')}</span>
                        : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <TablePagination current={currentPage} total={data.length}
          perPage={itemsPerPage} onChange={setCurrentPage} />
      )}
    </>
  );
}

export default OrdersTable;