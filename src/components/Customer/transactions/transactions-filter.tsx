'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { SeperatorIcon, TransInflowIcon } from '@/components/icons/icons';

export interface TransactionFilterState {
  searchTerm: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface TransactionsFilterProps {
  onFilterChange: (filters: TransactionFilterState) => void;
  onExport: () => void;
  totalCount: number;
}

const statusOptions = [
  { id: 'all',     label: 'All Status' },
  { id: 'SUCCESS', label: 'Success'    },
  { id: 'PENDING', label: 'Pending'    },
  { id: 'FAILED',  label: 'Failed'     },
  { id: 'REVERSED', label: 'Reversed'}
];

const TransactionsFilter: React.FC<TransactionsFilterProps> = ({
  onFilterChange,
  onExport,
  totalCount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status,     setStatus]     = useState('all');
  const [startDate,  setStartDate]  = useState('');
  const [endDate,    setEndDate]    = useState('');

  const hasActive = status !== 'all' || !!startDate || !!endDate;

  const emit = (patch: Partial<TransactionFilterState>) => {
    const next = { searchTerm, status, startDate, endDate, ...patch };
    onFilterChange(next);
    if ('searchTerm' in patch) setSearchTerm(patch.searchTerm!);
    if ('status'     in patch) setStatus(patch.status!);
    if ('startDate'  in patch) setStartDate(patch.startDate!);
    if ('endDate'    in patch) setEndDate(patch.endDate!);
  };

  const clear = () => {
    setStatus('all');
    setStartDate('');
    setEndDate('');
    onFilterChange({ searchTerm, status: 'all', startDate: '', endDate: '' });
  };

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return (
    <div className="flex flex-wrap justify-between items-center gap-3">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
        <Input
          value={searchTerm}
          onChange={(e) => emit({ searchTerm: e.target.value })}
          placeholder="Search by transaction ID..."
          className="pl-9 text-medium-gray"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Select value={status} onValueChange={(v) => emit({ status: v })}>
          <SelectTrigger className="bg-white w-36">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="hidden sm:flex max-w-xs items-center gap-2">
          <DatePicker value={startDate} onChange={(v) => emit({ startDate: v })} />
          <span className="text-xs text-gray-400 shrink-0">to</span>
          <DatePicker value={endDate} onChange={(v) => emit({ endDate: v })} maxDate={today} />
        </div>

        {hasActive && (
          <Button variant="ghost" size="sm" onClick={clear} className="gap-1 text-xs">
            <X className="w-3.5 h-3.5" /> Clear
          </Button>
        )}

        <SeperatorIcon />

        <Button onClick={onExport} size="lg" disabled={totalCount === 0}>
          <TransInflowIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
    </div>
  );
};

export default TransactionsFilter;