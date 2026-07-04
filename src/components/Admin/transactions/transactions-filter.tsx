// 'use client'
// import { Input } from '@/components/ui/input'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Search, Filter } from 'lucide-react'
// import React, { useState } from 'react'

// const statusOptions = [
//     {id: 'all', label: 'All Status'},
//     {id: 'SUCCESS', label: 'Success'},
//     {id: 'PENDING', label: 'Pending'},
//     {id: 'FAILED', label: 'Failed'}
// ]

// interface TransactionsFilterProps {
//   onFilterChange: (filters: {
//     searchTerm: string;
//     status: string;
//     startDate: string;
//     endDate: string;
//   }) => void;
// }

// const TransactionsFilter = ({ onFilterChange }: TransactionsFilterProps) => {
//   const [isFilterOpen, setIsFilterOpen] = useState(false)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [status, setStatus] = useState('all')
//   const [startDate, setStartDate] = useState('')
//   const [endDate, setEndDate] = useState('')

//   const clearFilters = () => {
//     setSearchTerm('')
//     setStatus('all')
//     setStartDate('')
//     setEndDate('')
//     onFilterChange({
//       searchTerm: '',
//       status: 'all',
//       startDate: '',
//       endDate: ''
//     })
//   }

//   const applyFilters = () => {
//     if (window.innerWidth < 1024) {
//       setIsFilterOpen(false)
//     }
    
//     onFilterChange({
//       searchTerm,
//       status,
//       startDate,
//       endDate
//     })
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       applyFilters()
//     }
//   }

//   return (
//     <>
//       <div className="flex lg:hidden mb-4">
//         <button
//           onClick={() => setIsFilterOpen(!isFilterOpen)}
//           className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//         >
//           <Filter size={16} />
//           <span className="text-sm font-medium">Filters</span>
//         </button>
//       </div>

//       <div className={`
//         bg-gray-50 rounded-lg border transition-all duration-200 ease-in-out
//         ${isFilterOpen ? 'block' : 'hidden'} lg:block
//       `}>
//         <div className="p-4 space-y-4 lg:space-y-0">

//           <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4">

//             <div className="flex-1 max-w-md">
//               <div className="relative flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent/50 transition-all">
//                 <Search size={16} className="text-gray-400 mr-2" />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   className="flex-1 border-none outline-none bg-transparent text-sm placeholder:text-gray-500"
//                   placeholder="Search by transaction ID."
//                 />
//               </div>
//             </div>

//             <div className="flex items-center gap-3">

//               <Select value={status} onValueChange={setStatus}>
//                 <SelectTrigger className="w-[140px] bg-white">
//                   <SelectValue placeholder="Select Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {statusOptions.map((status) => (
//                     <SelectItem key={status.id} value={status.id}>
//                       {status.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <Input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className="w-[140px] bg-white"
//                 />
//                 <span className="px-1">to</span>
//                 <Input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   className="w-[140px] bg-white"
//                 />
//               </div>

//               <div className="flex gap-2">
//                 <button 
//                   onClick={clearFilters}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Clear
//                 </button>
//                 <button 
//                   onClick={applyFilters}
//                   className="px-4 py-2 text-sm font-medium text-white bg-accent border border-accent/60 rounded-lg hover:bg-accent/70 transition-colors"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col space-y-4 lg:hidden">

//             <div className="relative flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent/50 transition-all">
//               <Search size={16} className="text-gray-400 mr-2" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 className="flex-1 border-none outline-none bg-transparent text-sm placeholder:text-gray-500"
//                 placeholder="Search by transaction ID..."
//               />
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="flex-1">
//                 <Select value={status} onValueChange={setStatus}>
//                   <SelectTrigger className="w-full bg-white">
//                     <SelectValue placeholder="Select Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {statusOptions.map((status) => (
//                       <SelectItem key={status.id} value={status.id}>
//                         {status.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
//                 Date Range
//               </label>
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <div className="flex-1">
//                   <Input
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="w-full bg-white"
//                     placeholder="From date"
//                   />
//                 </div>
//                 <div className="flex items-center justify-center sm:px-2">
//                   <span className="text-sm text-gray-500">to</span>
//                 </div>
//                 <div className="flex-1">
//                   <Input
//                     type="date"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                     className="w-full bg-white"
//                     placeholder="To date"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-2 pt-2">
//               <button 
//                 onClick={clearFilters}
//                 className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Clear All
//               </button>
//               <button 
//                 onClick={applyFilters}
//                 className="flex-1 px-4 py-2 text-sm font-medium text-white bg-accent border border-accent rounded-lg hover:bg-accent/70 transition-colors"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default TransactionsFilter

'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

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
  { id: 'REVERSED', label: 'Reversed'  },
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
          <Input 
            type="date" 
            value={startDate} 
            onChange={(e) => emit({ startDate: e.target.value })} 
            className="w-[140px] bg-white"
          />
          <span className="text-xs text-gray-400 shrink-0">to</span>
          <Input 
            type="date" 
            value={endDate} 
            onChange={(e) => emit({ endDate: e.target.value })} 
            max={today.toISOString().split('T')[0]}
            className="w-[140px] bg-white"
          />
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