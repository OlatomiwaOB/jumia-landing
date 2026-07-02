'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Package, Layers, ChevronRight, Tag } from 'lucide-react';

export interface BundleSubItem {
  id?: number;
  subItemCode: string;
  subItemName: string;
  minQty: number;
  maxQty: number;
  price: number;
  bundlePrice?: number | null;
  qtyChosen: number;
}

interface BundleItemsModalProps {
  open: boolean;
  onClose: () => void;
  bundleName: string;
  bundlePrice: number;
  ccy: string;
  subItems: BundleSubItem[];
}

/** Groups sub-items by their subItemCode (used as a category key) */
function groupByCategory(items: BundleSubItem[]): Record<string, BundleSubItem[]> {
  return items.reduce<Record<string, BundleSubItem[]>>((acc, item) => {
    const cat = item.subItemCode || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
}

const CATEGORY_COLORS = [
  { bg: 'bg-purple-50', border: 'border-purple-100', badge: 'bg-purple-100 text-purple-700', icon: 'text-purple-400' },
  { bg: 'bg-amber-50', border: 'border-amber-100', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-400' },
  { bg: 'bg-emerald-50', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700', icon: 'text-emerald-400' },
  { bg: 'bg-sky-50', border: 'border-sky-100', badge: 'bg-sky-100 text-sky-700', icon: 'text-sky-400' },
  { bg: 'bg-rose-50', border: 'border-rose-100', badge: 'bg-rose-100 text-rose-700', icon: 'text-rose-400' },
  { bg: 'bg-indigo-50', border: 'border-indigo-100', badge: 'bg-indigo-100 text-indigo-700', icon: 'text-indigo-400' },
];

export const BundleItemsModal: React.FC<BundleItemsModalProps> = ({
  open,
  onClose,
  bundleName,
  bundlePrice,
  ccy,
  subItems,
}) => {
  const grouped = groupByCategory(subItems);
  const categories = Object.keys(grouped);
  const totalItems = subItems.reduce((sum, i) => sum + i.qtyChosen, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col rounded-2xl gap-0 border-0 shadow-2xl p-0"
        style={{ scrollbarWidth: 'none' }}
      >
        <DialogTitle className="sr-only">Bundle Contents – {bundleName}</DialogTitle>

        {/* Header with primary brand color */}
        <div className="relative overflow-hidden rounded-t-2xl bg-primary p-5 pb-10">
          {/* Decorative circles */}
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute bottom-0 -left-6 w-20 h-20 rounded-full bg-white/10" />

          <div className="relative flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Bundle Contents</p>
              <h2 className="text-white text-base font-bold truncate mt-0.5">{bundleName}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-white/80 text-xs">
                  {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/80 text-xs">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} included
                </span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-white/70 text-xs">Bundle Price</p>
              <p className="text-white text-sm font-bold mt-0.5">{ccy} {bundlePrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div
          className="flex-1 overflow-y-auto -mt-6 bg-[#F5F5F5] rounded-t-2xl px-4 pt-8 pb-5 space-y-3"
          style={{ scrollbarWidth: 'none' }}
        >
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Package className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">No bundle items found</p>
            </div>
          ) : (
            categories.map((cat, catIdx) => {
              const colors = CATEGORY_COLORS[catIdx % CATEGORY_COLORS.length];
              const items = grouped[cat];

              return (
                <div
                  key={cat}
                  className={`rounded-xl border ${colors.bg} ${colors.border} overflow-hidden`}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-inherit">
                    <Tag className={`w-3.5 h-3.5 ${colors.icon} shrink-0`} />
                    <p className="text-xs font-semibold text-gray-700 flex-1">{cat}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors.badge}`}>
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Items list */}
                  <div className="divide-y divide-inherit">
                    {items.map((item, itemIdx) => (
                      <div
                        key={`${item.subItemCode}-${itemIdx}`}
                        className="flex items-center gap-3 px-3 py-2.5 bg-white/60"
                      >
                        {/* Quantity pill */}
                        <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-gray-700">{item.qtyChosen}</span>
                        </div>

                        {/* Name */}
                        <p className="flex-1 text-sm font-medium text-gray-800">{item.subItemName}</p>

                        {/* Price or "Included" */}
                        {item.price > 0 ? (
                          <span className="text-xs font-semibold text-gray-600 shrink-0">
                            {ccy} {item.price.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-600 shrink-0">
                            Included
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between bg-white border-t border-gray-100 px-4 py-3 rounded-b-2xl">
          <p className="text-xs text-gray-400">
            All items are included in the bundle price
          </p>
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/** Small trigger badge shown on a cart item row when it has bundle sub-items */
export const BundleTriggerBadge: React.FC<{
  count: number;
  onClick: (e: React.MouseEvent) => void;
}> = ({ count, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all group shrink-0"
  >
    <Layers className="w-2.5 h-2.5" />
    {count} bundle {count === 1 ? 'item' : 'items'}
    <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
  </button>
);

export default BundleItemsModal;
