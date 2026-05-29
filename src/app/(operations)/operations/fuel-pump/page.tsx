'use client'
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Fuel, Receipt, Search, ChevronLeft, ChevronRight, Hash, User, Zap, X, Building2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Pump {
  id: number;
  entityCode: string;
  storeCode: string;
  pumpCode: string;
  serialNo: string;
  name: string;
  operatorId: number;
  createdBy: string;
  createdDate: number[] | null;
}

interface FuelTransaction {
  id: number;
  accountNo: string;
  tranCode: string;
  tranType: string;
  tranDesc: string;
  amount: number;
  crDr: string;
  entityCode: string;
  tranRefNo: string;
  tranUniqRefNo: string;
  billRspRef: string;
  billRspCode: string;
  billRspMsg: string;
  paymentRspCode: string;
  paymentRspMsg: string;
  paymentChannel: string | null;
  provider: string;
  match: string;
  tranDate: number;
  valueDate: number;
}

const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDateFromArray = (dateArray: number[] | null): string => {
  if (!dateArray || dateArray.length < 3) return 'N/A';

  const [year, month, day] = dateArray;
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatFullDateFromArray = (dateArray: number[] | null): string => {
  if (!dateArray || dateArray.length < 3) return 'N/A';

  const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusBadge = (billRspCode: string, paymentRspCode: string) => {
  if (billRspCode === '000' && paymentRspCode === '000') {
    return (
      <Badge className="bg-green-50 text-green-700 border-green-200 text-[10px] font-semibold border">
        Success
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-50 text-red-700 border-red-200 text-[10px] font-semibold border">
      Failed
    </Badge>
  );
};

const MiniPagination: React.FC<{
  page: number;
  total: number;
  perPage: number;
  onChange: (p: number) => void;
}> = ({ page, total, perPage, onChange }) => {
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) {
      range.push(i);
    }
    if (page - delta > 2) range.unshift('...');
    if (page + delta < pages - 1) range.push('...');
    range.unshift(1);
    if (pages > 1) range.push(pages);
    return range;
  };

  return (
    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
      <p className="text-xs text-medium-gray font-light">
        {total > 0 ? `${start}–${end} of ${total}` : '0 records'}
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page === 1}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40">
          <ChevronLeft className="w-3.5 h-3.5 text-dark-gray" />
        </button>
        {getVisiblePages().map((p, i) => (
          typeof p === 'number' ? (
            <button key={i} onClick={() => onChange(p)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-[#d8480b] text-white' : 'text-dark-gray hover:bg-gray-100'
                }`}>
              {p}
            </button>
          ) : (
            <span key={i} className="px-1 text-xs text-medium-gray">...</span>
          )
        ))}
        <button onClick={() => onChange(page + 1)} disabled={page >= pages}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40">
          <ChevronRight className="w-3.5 h-3.5 text-dark-gray" />
        </button>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}> = ({ label, value, sub, accent }) => (
  <div className={`rounded-2xl border px-5 py-4 ${accent
    ? 'bg-[#d8480b] border-[#d8480b] text-white'
    : 'bg-white border-gray-100'
    }`}>
    <p className={`text-xs font-light ${accent ? 'text-orange-100' : 'text-medium-gray'}`}>
      {label}
    </p>
    <p className={`text-xl font-bold mt-0.5 ${accent ? 'text-white' : 'text-dark-gray'}`}>
      {value}
    </p>
    {sub && (
      <p className={`text-[11px] font-light mt-0.5 ${accent ? 'text-orange-100' : 'text-medium-gray'}`}>
        {sub}
      </p>
    )}
  </div>
);

const PumpDetailsDialog: React.FC<{
  pump: Pump | null;
  open: boolean;
  onClose: () => void;
}> = ({ pump, open, onClose }) => {
  if (!pump) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Fuel className="w-5 h-5 text-[#d8480b]" />
            Pump Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-orange-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-dark-gray">{pump.name}</h3>
            <p className="text-sm text-medium-gray mt-1">{pump.pumpCode}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-medium-gray font-light">Serial Number</p>
              <p className="text-sm font-semibold text-dark-gray mt-1">{pump.serialNo}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-medium-gray font-light">Store Code</p>
              <p className="text-sm font-semibold text-dark-gray mt-1">{pump.storeCode}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-medium-gray font-light">Entity Code</p>
              <p className="text-sm font-semibold text-dark-gray mt-1">{pump.entityCode}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-medium-gray font-light">Operator ID</p>
              <p className="text-sm font-semibold text-dark-gray mt-1">{pump.operatorId}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-medium-gray font-light">Created By</p>
              <p className="text-sm font-semibold text-dark-gray mt-1">{pump.createdBy}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-medium-gray font-light">Created Date</p>
              <p className="text-sm font-semibold text-dark-gray mt-1">
                {formatFullDateFromArray(pump.createdDate)}
              </p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-sm font-medium text-green-700">Active Pump</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TransactionDetailsDialog: React.FC<{
  transaction: FuelTransaction | null;
  open: boolean;
  onClose: () => void;
}> = ({ transaction, open, onClose }) => {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto"
        style={{
          scrollbarWidth: 'none',
          scrollbarColor: 'transparent',
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#d8480b]" />
            Transaction Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-dark-gray">{transaction.tranType}</h3>
                <p className="text-sm text-medium-gray mt-1">{transaction.tranDesc}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-dark-gray">
                  ₦{Number(transaction.amount ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-medium-gray mt-0.5">{transaction.crDr === 'D' ? 'Debit' : 'Credit'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(transaction.billRspCode, transaction.paymentRspCode)}
              {transaction.provider && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-semibold border">
                  {transaction.provider}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-medium-gray font-light">Transaction Ref</p>
              <p className="text-sm font-semibold text-dark-gray mt-1 font-mono">{transaction.tranRefNo}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-medium-gray font-light">Account No</p>
              <p className="text-sm font-semibold text-dark-gray mt-1">{transaction.accountNo}</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-medium-gray font-light">Bill Ref</p>
              <p className="text-sm font-semibold text-dark-gray mt-1 font-mono">{transaction.billRspRef}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-medium-gray font-light">Transaction Code</p>
              <p className="text-sm font-semibold text-dark-gray mt-1">{transaction.tranCode}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-dark-gray mb-3">Timestamps</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-medium-gray font-light">Transaction Date</p>
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-sm font-semibold text-dark-gray">
                    {formatTimestamp(transaction.tranDate)}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-medium-gray font-light">Value Date</p>
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-sm font-semibold text-dark-gray">
                    {formatTimestamp(transaction.valueDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PumpsTable: React.FC<{
  pumps: Pump[];
  total: number;
  page: number;
  onPage: (p: number) => void;
  isLoading: boolean;
  search: string;
  onSearch: (s: string) => void;
  onPumpClick: (pump: Pump) => void;
}> = ({ pumps, total, page, onPage, isLoading, search, onSearch, onPumpClick }) => (
  <div className="bg-white rounded-2xl border border-gray-100 flex flex-col h-full">
    <div className="px-5 py-4 border-b border-gray-100">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Fuel className="w-4 h-4 text-[#d8480b]" />
          <h3 className="text-sm font-semibold text-dark-gray">Fuel Pumps</h3>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-medium-gray" />
        <Input
          value={search}
          onChange={(e) => {
            onSearch(e.target.value);
            onPage(1);
          }}
          placeholder="Search pump name, code…"
          className="pl-8 h-9 text-xs rounded-xl border-gray-200 bg-gray-50"
        />
        {search && (
          <button
            onClick={() => {
              onSearch('');
              onPage(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-3.5 h-3.5 text-medium-gray hover:text-dark-gray" />
          </button>
        )}
      </div>
    </div>

    <div className="flex-1 overflow-y-auto px-5 py-3" style={{ scrollbarWidth: 'thin' }}>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 rounded-full border-2 border-[#d8480b] border-t-transparent animate-spin" />
        </div>
      ) : pumps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Fuel className="w-8 h-8 text-gray-200" />
          <p className="text-sm text-medium-gray font-light">
            {search ? 'No pumps match your search' : 'No pumps found'}
          </p>
          {search && (
            <button
              onClick={() => onSearch('')}
              className="text-xs text-[#d8480b] hover:underline mt-1"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {pumps.map((pump) => (
            <div
              key={pump.id}
              onClick={() => onPumpClick(pump)}
              className="flex items-start justify-between gap-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50/40 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#d8480b]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Fuel className="w-4 h-4 text-[#d8480b]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark-gray truncate">{pump.name}</p>
                  <p className="text-xs text-medium-gray font-light mt-0.5">
                    {pump.pumpCode} · {pump.serialNo}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-medium-gray">
                      <Hash className="w-3 h-3" /> {pump.storeCode}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-medium-gray">
                      <User className="w-3 h-3" /> {pump.createdBy}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-medium-gray font-light">
                  {formatDateFromArray(pump.createdDate)}
                </p>
                <Badge className="mt-1 text-[10px] px-1.5 py-0 border bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="px-5 pb-4">
      <MiniPagination page={page} total={total} perPage={25} onChange={onPage} />
    </div>
  </div>
);

const TransactionsTable: React.FC<{
  transactions: FuelTransaction[];
  total: number;
  page: number;
  onPage: (p: number) => void;
  isLoading: boolean;
  search: string;
  onSearch: (s: string) => void;
  onTransactionClick: (tx: FuelTransaction) => void;
}> = ({ transactions, total, page, onPage, isLoading, search, onSearch, onTransactionClick }) => (
  <div className="bg-white rounded-2xl border border-gray-100 flex flex-col h-full">
    <div className="px-5 py-4 border-b border-gray-100">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-[#d8480b]" />
          <h3 className="text-sm font-semibold text-dark-gray">Transactions</h3>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-medium-gray" />
        <Input
          value={search}
          onChange={(e) => {
            onSearch(e.target.value);
            onPage(1);
          }}
          placeholder="Search ref, account, provider…"
          className="pl-8 h-9 text-xs rounded-xl border-gray-200 bg-gray-50"
        />
        {search && (
          <button
            onClick={() => {
              onSearch('');
              onPage(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-3.5 h-3.5 text-medium-gray hover:text-dark-gray" />
          </button>
        )}
      </div>
    </div>

    <div className="flex-1 overflow-y-auto px-5 py-3" style={{ scrollbarWidth: 'thin' }}>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 rounded-full border-2 border-[#d8480b] border-t-transparent animate-spin" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Receipt className="w-8 h-8 text-gray-200" />
          <p className="text-sm text-medium-gray font-light">
            {search ? 'No transactions match your search' : 'No transactions found'}
          </p>
          {search && (
            <button
              onClick={() => onSearch('')}
              className="text-xs text-[#d8480b] hover:underline mt-1"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx, idx) => (
            <div
              key={`${tx.tranRefNo}-${idx}`}
              onClick={() => onTransactionClick(tx)}
              className="flex items-start justify-between gap-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50/40 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-dark-gray truncate">
                      {tx.tranType}
                    </p>
                    {getStatusBadge(tx.billRspCode, tx.paymentRspCode)}
                  </div>
                  <p className="text-xs text-medium-gray font-light mt-0.5 truncate">
                    {tx.accountNo} · {tx.tranDesc}
                  </p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-[10px] text-medium-gray">
                      <Hash className="w-3 h-3" />
                      <span className="font-mono">{tx.tranRefNo.slice(0, 12)}...</span>
                    </span>
                    {tx.provider && (
                      <span className="flex items-center gap-1 text-[10px] text-medium-gray">
                        <Building2 className="w-3 h-3" />
                        {tx.provider}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-dark-gray">
                  ₦{Number(tx.amount ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-medium-gray font-light mt-0.5">
                  {formatTimestamp(tx.tranDate)?.split(',')[0] || '—'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="px-5 pb-4">
      <MiniPagination page={page} total={total} perPage={25} onChange={onPage} />
    </div>
  </div>
);

export default function FuelPumpPage(): React.ReactElement {
  const [pumpsPage, setPumpsPage] = useState(1);
  const [txPage, setTxPage] = useState(1);
  const [pumpSearch, setPumpSearch] = useState('');
  const [txSearch, setTxSearch] = useState('');

  const [selectedPump, setSelectedPump] = useState<Pump | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<FuelTransaction | null>(null);

  const { data: pumpsData, isLoading: pumpsLoading } = useQuery({
    queryKey: ['iot-pumps', pumpsPage],
    queryFn: async () => {
      const res = await axiosOperations.request({
        url: '/iot/pumps',
        method: 'GET',
        params: { page: pumpsPage, size: 25 },
      });
      return res.data;
    },
    staleTime: 30000,
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ['iot-transactions', txPage],
    queryFn: async () => {
      const res = await axiosOperations.request({
        url: '/iot/pms-transactions',
        method: 'GET',
        params: { page: txPage, size: 25 },
      });
      return res.data;
    },
    staleTime: 30000,
  });

  const allPumps: Pump[] = useMemo(() => {
    if (!pumpsData) return [];
    if (Array.isArray(pumpsData)) return pumpsData;
    if (pumpsData.data && Array.isArray(pumpsData.data)) return pumpsData.data;
    return [];
  }, [pumpsData]);

  const allTx: FuelTransaction[] = useMemo(() => {
    if (!txData) return [];
    if (Array.isArray(txData)) return txData;
    if (txData.data && Array.isArray(txData.data)) return txData.data;
    return [];
  }, [txData]);

  const totalPumps = useMemo(() => {
    if (!pumpsData) return 0;
    return pumpsData.totalRecords || allPumps.length;
  }, [pumpsData, allPumps]);

  const totalTx = useMemo(() => {
    if (!txData) return 0;
    return txData.totalRecords || allTx.length;
  }, [txData, allTx]);

  const filteredPumps = useMemo(() => {
    const q = pumpSearch.toLowerCase().trim();
    if (!q) return allPumps;
    return allPumps.filter((p) =>
      p.name?.toLowerCase().includes(q) ||
      p.pumpCode?.toLowerCase().includes(q) ||
      p.serialNo?.toLowerCase().includes(q) ||
      p.storeCode?.toLowerCase().includes(q) ||
      p.entityCode?.toLowerCase().includes(q)
    );
  }, [allPumps, pumpSearch]);

  const filteredTx = useMemo(() => {
    const q = txSearch.toLowerCase().trim();
    if (!q) return allTx;
    return allTx.filter((t) =>
      t.tranRefNo?.toLowerCase().includes(q) ||
      t.tranType?.toLowerCase().includes(q) ||
      t.accountNo?.toLowerCase().includes(q) ||
      t.provider?.toLowerCase().includes(q) ||
      t.tranDesc?.toLowerCase().includes(q) ||
      t.tranUniqRefNo?.toLowerCase().includes(q) ||
      t.billRspRef?.toLowerCase().includes(q)
    );
  }, [allTx, txSearch]);

  const totalRevenue = useMemo(() =>
    allTx.reduce((s, t) => s + (Number(t.amount) || 0), 0),
    [allTx]
  );

  const successfulTx = useMemo(() =>
    allTx.filter(t => t.billRspCode === '000' && t.paymentRspCode === '000').length,
    [allTx]
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-2 rounded-2xl">
      <div className="max-w-7xl mx-auto space-y-5">
        <div>
          <h1 className="text-lg font-bold text-dark-gray">Fuel Pump Management</h1>
          <p className="text-xs text-medium-gray font-light mt-0.5">
            Monitor virtual pumps and QR scan-to-pay transactions
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Pumps"
            value={totalPumps.toLocaleString()}
            sub="Registered pumps"
            accent
          />
          <StatCard
            label="Total Transactions"
            value={totalTx.toLocaleString()}
            sub={`${successfulTx} successful`}
          />
          <StatCard
            label="Success Rate"
            value={totalTx > 0 ? `${((successfulTx / totalTx) * 100).toFixed(1)}%` : '0%'}
            sub="Payment success rate"
          />
          <StatCard
            label="Total Revenue"
            value={`₦${totalRevenue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`}
            sub="All-time earnings"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" style={{ minHeight: 520 }}>
          <PumpsTable
            pumps={filteredPumps}
            total={pumpSearch ? filteredPumps.length : totalPumps}
            page={pumpsPage}
            onPage={setPumpsPage}
            isLoading={pumpsLoading}
            search={pumpSearch}
            onSearch={setPumpSearch}
            onPumpClick={setSelectedPump}
          />
          <TransactionsTable
            transactions={filteredTx}
            total={txSearch ? filteredTx.length : totalTx}
            page={txPage}
            onPage={setTxPage}
            isLoading={txLoading}
            search={txSearch}
            onSearch={setTxSearch}
            onTransactionClick={setSelectedTransaction}
          />
        </div>
      </div>

      <PumpDetailsDialog
        pump={selectedPump}
        open={selectedPump !== null}
        onClose={() => setSelectedPump(null)}
      />

      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={selectedTransaction !== null}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}