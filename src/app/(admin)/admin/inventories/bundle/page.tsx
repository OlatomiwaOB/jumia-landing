'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Loader2,
  Package,
  Save,
  Pencil,
} from 'lucide-react';
import Table from 'rc-table';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import axiosInstance from '@/utils/fetch-function';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getClientIdentifiers } from '@/config/client-config';
import { BundleSubItem, BundleSavePayload } from '@/types';

const TablePagination = ({
  current, total, perPage, onChange,
}: { current: number; total: number; perPage: number; onChange: (p: number) => void }) => {
  const pages = Math.ceil(total / perPage);
  const start = (current - 1) * perPage + 1;
  const end = Math.min(current * perPage, total);

  const getPageNumbers = () => {
    if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
    const result: (number | '...')[] = [];
    if (current <= 3) result.push(1, 2, 3, '...', pages);
    else if (current >= pages - 2) result.push(1, '...', pages - 2, pages - 1, pages);
    else result.push(1, '...', current, '...', pages);
    return result;
  };

  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} items</p>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current - 1)} disabled={current === 1}>
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>
        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <span key={`e-${i}`} className="text-xs text-gray-400 px-1">···</span>
          ) : (
            <button key={p} onClick={() => onChange(p as number)}
              className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${p === current ? 'border-2 border-faded-accent text-faded-accent' : 'text-gray-600 hover:bg-gray-100'}`}>
              {p}
            </button>
          )
        )}
        <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current + 1)} disabled={current === pages}>
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const defaultForm = (): Omit<BundleSubItem, 'id'> => ({
  subItemCode: '',
  subItemName: '',
  minQty: 1,
  maxQty: 1,
  price: 0,
  qtyChosen: 1,
});

// ─── Component ───────────────────────────────────────────────────────────────

export default function BundleManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId') || '';
  const queryClient = useQueryClient();
  const { entityCode } = getClientIdentifiers();

  // ── Fetch parent product ──────────────────────────────────────────────────
  const { data: productApiData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['bundle-product', productId, entityCode],
    queryFn: async () => {
      const res = await axiosInstanceNoAuth.request({
        method: 'GET',
        url: '/products/getById',
        params: { id: productId, entityCode },
      });
      return res.data;
    },
    enabled: !!productId,
  });

  const product = productApiData?.productDto || productApiData?.data;

  // ── Staging table (pre-populate from existing bundleSubItems) ─────────────
  const [stagingItems, setStagingItems] = useState<BundleSubItem[]>([]);
  const [nextLocalId, setNextLocalId] = useState(-1); // negative IDs = new (unsaved)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Pre-populate when product loads
  useEffect(() => {
    const existing: BundleSubItem[] = productApiData?.productDto?.bundleSubItems || [];
    if (existing.length > 0) {
      setStagingItems(existing);
    }
  }, [productApiData]);

  // ── Sub-item form ─────────────────────────────────────────────────────────
  const [form, setForm] = useState(defaultForm());
  const [formErrors, setFormErrors] = useState<{ subItemCode?: string; subItemName?: string }>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const setField = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const validateForm = () => {
    const errs: typeof formErrors = {};
    if (!form.subItemCode.trim()) errs.subItemCode = 'Item Code is required';
    if (!form.subItemName.trim()) errs.subItemName = 'Item Name is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddItem = () => {
    if (!validateForm()) return;

    if (editingId !== null) {
      setStagingItems(prev => prev.map(item => 
        item.id === editingId 
          ? {
              ...item,
              subItemCode: form.subItemCode.trim(),
              subItemName: form.subItemName.trim(),
              minQty: form.minQty || 1,
              maxQty: form.maxQty || 1,
              price: form.price || 0,
              qtyChosen: form.qtyChosen || 1,
            }
          : item
      ));
      setEditingId(null);
    } else {
      const newItem: BundleSubItem = {
        id: nextLocalId,
        subItemCode: form.subItemCode.trim(),
        subItemName: form.subItemName.trim(),
        minQty: form.minQty || 1,
        maxQty: form.maxQty || 1,
        price: form.price || 0,
        qtyChosen: form.qtyChosen || 1,
      };
      setStagingItems(prev => [...prev, newItem]);
      setNextLocalId(prev => prev - 1);
    }

    setForm(defaultForm());
    setFormErrors({});
  };

  const handleRemoveItem = (id: number) =>
    setStagingItems(prev => prev.filter(item => item.id !== id));

  // ── Save bundle ───────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async (payload: BundleSavePayload) =>
      axiosInstance.post('/bundles/save', payload),
    onSuccess: data => {
      if (data?.data?.code === '000') {
        toast.success('Bundle saved successfully');
        queryClient.invalidateQueries({ queryKey: ['products'] });
        router.push('/admin/inventories');
      } else {
        toast.error(data?.data?.desc || 'Failed to save bundle');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to save bundle');
    },
  });

  const handleSave = () => {
    if (stagingItems.length === 0) {
      toast.error('Add at least one sub-item before saving');
      return;
    }
    if (!product) return;

    const payload: BundleSavePayload = {
      bundleItemCode: product.code,
      storeCode: product.storeCode,
      subItems: stagingItems.map(item => ({
        id: item.id < 0 ? 0 : item.id, // new items get id=0, existing keep their id
        subItemCode: item.subItemCode,
        subItemName: item.subItemName,
        minQty: item.minQty,
        maxQty: item.maxQty,
        price: item.price,
        qtyChosen: item.qtyChosen,
      })),
    };
    saveMutation.mutate(payload);
  };

  // ── rc-table columns ──────────────────────────────────────────────────────
  const columns = [
    {
      title: <span className="text-xs font-semibold text-dark-gray">Item Code</span>,
      dataIndex: 'subItemCode',
      key: 'subItemCode',
      render: (val: string) => <span className="text-xs font-mono text-dark-gray">{val}</span>,
    },
    {
      title: <span className="text-xs font-semibold text-dark-gray">Item Name</span>,
      dataIndex: 'subItemName',
      key: 'subItemName',
      render: (val: string) => <span className="text-xs text-dark-gray">{val}</span>,
    },
    {
      title: <span className="text-xs font-semibold text-dark-gray">Min Qty</span>,
      dataIndex: 'minQty',
      key: 'minQty',
      width: 80,
      render: (val: number) => <span className="text-xs text-medium-gray">{val}</span>,
    },
    {
      title: <span className="text-xs font-semibold text-dark-gray">Max Qty</span>,
      dataIndex: 'maxQty',
      key: 'maxQty',
      width: 80,
      render: (val: number) => <span className="text-xs text-medium-gray">{val}</span>,
    },
    {
      title: <span className="text-xs font-semibold text-dark-gray">Qty Chosen</span>,
      dataIndex: 'qtyChosen',
      key: 'qtyChosen',
      width: 90,
      render: (val: number) => <span className="text-xs text-medium-gray">{val}</span>,
    },
    {
      title: '',
      key: 'remove',
      width: 80,
      render: (_: any, record: BundleSubItem) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingId(record.id);
              setForm({
                subItemCode: record.subItemCode,
                subItemName: record.subItemName,
                minQty: record.minQty,
                maxQty: record.maxQty,
                price: record.price,
                qtyChosen: record.qtyChosen,
              });
              setFormErrors({});
            }}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-700 transition-colors"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleRemoveItem(record.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors"
            title="Remove"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 rounded-full border-2 border-sidebar-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product && !isLoadingProduct) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Package className="w-12 h-12 text-gray-300" />
        <p className="text-sm text-medium-gray">Product not found</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-2 pb-10">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/admin/inventories')}
          className="flex items-center gap-1.5 text-xs font-semibold text-medium-gray hover:text-dark-gray transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory
        </button>
      </div>

      {/* Parent product info */}
      <div className="bg-white rounded-2xl p-5 mb-6 flex items-center gap-4 shadow-sm border border-gray-100">
        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
          <Package className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-medium-gray mb-0.5">Bundle Product</p>
          <h1 className="text-base font-bold text-dark-gray truncate">{product?.name || '—'}</h1>
          <p className="text-xs font-mono text-medium-gray">Code: {product?.code || '—'}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
            BUNDLE
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 items-start">
        {/* Left: Add sub-item form */}
        <div className="lg:col-span-2 lg:sticky lg:top-24 self-start">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-dark-gray mb-4">Add Sub-Item</h2>

            <div className="space-y-3">
              {/* Item Code */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-medium-gray">
                  Item Code <span className="text-red-500">*</span>
                </label>
                <Input
                  value={form.subItemCode}
                  onChange={e => setField('subItemCode', e.target.value)}
                  placeholder="e.g. DRINK001"
                  className={`h-9 text-sm ${formErrors.subItemCode ? 'border-red-400' : ''}`}
                />
                {formErrors.subItemCode && (
                  <p className="text-[11px] text-red-500">{formErrors.subItemCode}</p>
                )}
              </div>

              {/* Item Name */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-medium-gray">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={form.subItemName}
                  onChange={e => setField('subItemName', e.target.value)}
                  placeholder="e.g. Coca Cola Classic"
                  className={`h-9 text-sm ${formErrors.subItemName ? 'border-red-400' : ''}`}
                />
                {formErrors.subItemName && (
                  <p className="text-[11px] text-red-500">{formErrors.subItemName}</p>
                )}
              </div>

              {/* Min / Max Qty row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-medium-gray">Min Qty</label>
                  <Input
                    type="number"
                    min={0}
                    value={form.minQty}
                    onChange={e => setField('minQty', Number(e.target.value))}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-medium-gray">Max Qty</label>
                  <Input
                    type="number"
                    min={0}
                    value={form.maxQty}
                    onChange={e => setField('maxQty', Number(e.target.value))}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {/* Qty Chosen */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-medium-gray">Qty Chosen</label>
                <Input
                  type="number"
                  min={0}
                  value={form.qtyChosen}
                  onChange={e => setField('qtyChosen', Number(e.target.value))}
                  className="h-9 text-sm"
                />
              </div>

              <div className="flex flex-col gap-2 mt-1">
                <Button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full h-9 text-sm font-semibold"
                >
                  {editingId !== null ? <Pencil className="w-4 h-4 mr-1.5" /> : <Plus className="w-4 h-4 mr-1.5" />}
                  {editingId !== null ? 'Update Sub-Item' : 'Add to Bundle'}
                </Button>
                
                {editingId !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setForm(defaultForm());
                      setFormErrors({});
                    }}
                    className="w-full h-9 text-sm font-semibold"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Staging table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-dark-gray">Bundle Sub-Items</h2>
                <p className="text-xs text-medium-gray mt-0.5">
                  {stagingItems.length} item{stagingItems.length !== 1 ? 's' : ''} staged
                </p>
              </div>

            </div>

            {stagingItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
                <Package className="w-10 h-10 text-gray-200" />
                <p className="text-sm font-medium text-medium-gray">No sub-items yet</p>
                <p className="text-xs text-gray-400">Use the form to add items to this bundle</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  data={stagingItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
                  rowKey="id"
                  className="w-full"
                  components={{
                    table: ({ children, ...props }: any) => (
                      <table {...props} className="w-full border-collapse">{children}</table>
                    ),
                    header: {
                      wrapper: ({ children, ...props }: any) => <thead {...props}>{children}</thead>,
                      row: ({ children, ...props }: any) => (
                        <tr {...props} className="border-b-2 border-gray-100">{children}</tr>
                      ),
                      cell: ({ children, ...props }: any) => (
                        <th {...props} className="text-left px-4 py-3 text-xs font-semibold text-dark-gray whitespace-nowrap">
                          {children}
                        </th>
                      ),
                    },
                    body: {
                      wrapper: ({ children, ...props }: any) => <tbody {...props}>{children}</tbody>,
                      row: ({ children, ...props }: any) => (
                        <tr {...props} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                          {children}
                        </tr>
                      ),
                      cell: ({ children, ...props }: any) => (
                        <td {...props} className="px-4 py-3">{children}</td>
                      ),
                    },
                  }}
                />
                
                {stagingItems.length > ITEMS_PER_PAGE && (
                  <div className="p-4 border-t border-gray-100 flex justify-end">
                    <TablePagination
                      current={currentPage}
                      total={stagingItems.length}
                      perPage={ITEMS_PER_PAGE}
                      onChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom save button (always visible when items exist) */}
          {stagingItems.length > 0 && (
            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/inventories')}
                disabled={saveMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="font-semibold"
              >
                {saveMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-1.5" />Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-1.5" />Save Bundle</>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
