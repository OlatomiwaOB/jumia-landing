'use client';

import { useRecentPurchase } from '@/hooks/useRecentPurchase';
import { getProductHref } from '@/utils/product-route';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface RecentPurchaseToastProps {
  entityCode: string;
  storeCode: string;
}

export function RecentPurchaseToast({
  entityCode,
  storeCode,
}: RecentPurchaseToastProps) {
  const { notice, dismiss } = useRecentPurchase(storeCode, entityCode);
  const router = useRouter();

  if (!notice) {
    return null;
  }

  const href = getProductHref(notice.product, storeCode);

  return (
    <div className="pointer-events-none fixed bottom-6 left-4 z-40 max-w-sm animate-in slide-in-from-left-4 fade-in duration-300 sm:left-6">
      <div className="pointer-events-auto flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#f4f4f4]"
          onClick={() => router.push(href)}
        >
          <Image
            src={notice.product.picture || '/placeholder-image.png'}
            alt={notice.product.name || 'Product'}
            fill
            className="object-contain p-2"
            sizes="56px"
          />
        </button>

        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => router.push(href)}
        >
          <p className="text-sm text-black/65">Someone purchased a</p>
          <p className="line-clamp-1 text-base font-semibold text-black">
            {notice.product.name}
          </p>
          <p className="text-sm text-black/55">
            {notice.purchasedAt} from {notice.location.city}, {notice.location.country}
          </p>
        </button>

        <button
          type="button"
          className="self-start text-black/40 transition-colors hover:text-accent"
          onClick={dismiss}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
