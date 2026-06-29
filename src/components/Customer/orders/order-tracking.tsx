'use client'
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  XCircle, RefreshCw,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import placeholder from '@/components/images/placeholder-product.webp';
import { CalendarIcon, CheckIcon, OrderIcon3, ShopIcon } from '@/components/icons/icons';

interface TrackingInfo {
  id: number;
  orderNo: string;
  trackingNo: string;
  storeCode: string;
  storeName: string;
  entityCode: string;
  status: string;
  activityDate: string;
  activityType:
  | 'PACKING' | 'DELIVERED' | 'CANCELLED' | 'PAYMENT_RECEIVED'
  | 'ORDER_REVIEW' | 'SHIPPED' | 'IN_TRANSIT' | 'AVAILABLE_FOR_PICKUP';
  comment?: string | null;
  docLink?: string;
  deliveryOption: 'delivery' | 'pickup';
  orderDate: string;
  customerName: string;
  paymentMethod: string;
}

interface TrackingApiResponse {
  code: string;
  desc: string;
  orderTrackInfo: TrackingInfo;
}

export interface CartItemSnap {
  itemName: string;
  picture: string;
}

export interface OrderTrackingModalProps {
  trackingNo?: string;
  orderNo: string;
  storeName?: string;
  isOpen: boolean;
  onClose: () => void;
  firstItem?: CartItemSnap;
  customerName?: string;
  paymentMethod?: string;
  ccy?: string;
}

const DELIVERY_PROGRESSION = [
  'PAYMENT_RECEIVED', 'ORDER_REVIEW', 'PACKING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED',
] as const;

const PICKUP_PROGRESSION = [
  'PAYMENT_RECEIVED', 'ORDER_REVIEW', 'PACKING', 'SHIPPED', 'IN_TRANSIT', 'AVAILABLE_FOR_PICKUP',
] as const;

const STATUS_LABELS: Record<string, string> = {
  PAYMENT_RECEIVED: 'Payment Received',
  ORDER_REVIEW: 'Order Review',
  PACKING: 'Packing',
  SHIPPED: 'Shipped',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  AVAILABLE_FOR_PICKUP: 'Available for Pickup',
  CANCELLED: 'Cancelled',
};

const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  trackingNo,
  orderNo,
  storeName: storeNameProp,
  isOpen,
  onClose,
  firstItem,
  customerName: customerNameProp,
  paymentMethod: paymentMethodProp,
}) => {

  const openCountRef = useRef(0);
  const prevIsOpen = useRef(false);

  if (isOpen && !prevIsOpen.current) {
    openCountRef.current += 1;
  }
  prevIsOpen.current = isOpen;

  const { data, isFetching, isError, refetch } = useQuery<TrackingApiResponse>({
    queryKey: ['order-tracking', orderNo, openCountRef.current],
    queryFn: async () => {
      const res = await axiosCustomer.request({
        method: 'GET',
        url: 'ecommerce/track-sale-order',
        params: {
          ...(trackingNo ? { trackingNo } : {}),
          orderNo,
        },
      });
      return res.data;
    },
    enabled: isOpen && !!orderNo,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const info = data?.orderTrackInfo;

  const displayTrackingNo = info?.trackingNo || trackingNo || '—';
  const displayStoreName = info?.storeName || storeNameProp || '—';
  const displayStoreCode = info?.storeCode || undefined;
  const displayCustomer = info?.customerName || customerNameProp || 'N/A';
  const displayPayment = info?.paymentMethod || paymentMethodProp || 'N/A';
  const displayDelivery = info?.deliveryOption || 'delivery';
  const currentActivity = info?.activityType || '';
  const isCancelled = currentActivity === 'CANCELLED';
  const progression = displayDelivery === 'pickup' ? PICKUP_PROGRESSION : DELIVERY_PROGRESSION;
  const currentIdx = progression.indexOf(currentActivity as any);

  const statusBadge = isCancelled
    ? { label: 'CANCELLED', cls: 'bg-red-100 text-red-600 border-red-200' }
    : info?.status === 'COMPLETED'
      ? { label: 'COMPLETED', cls: 'bg-green-100 text-green-700 border-green-200' }
      : { label: 'IN PROGRESS', cls: 'bg-orange-100 text-orange-600 border-orange-200' };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl gap-0 border-0 shadow-xl bg-[#F5F5F5]">
        <DialogTitle className="sr-only">Order Tracking</DialogTitle>

        <div className="px-2">
          <h2 className="text-md font-bold text-dark-gray">Order Tracking</h2>
        </div>

        {isFetching && !info && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-sidebar-accent border-t-transparent animate-spin" />
            <p className="text-sm text-gray-400">Loading tracking info…</p>
          </div>
        )}

        {!isFetching && isError && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <XCircle className="w-10 h-10 text-red-400" />
            <p className="text-sm text-red-400">Failed to load tracking information.</p>
            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        )}

        {info && !isError && (
          <div className="px-2 pb-6 pt-4 flex flex-col lg:flex-row gap-5">
            <div className="flex-1 space-y-4">
              <div className="bg-white rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
                  <div>
                    <p className="text-xs text-medium-gray tracking-wide">Tracking ID</p>
                    <p className="text-sm font-bold text-dark-gray">#{displayTrackingNo}</p>
                  </div>
                  <Button variant="ghost" size="sm"
                    className="gap-1.5 text-xs border border-border shadow-lg h-8"
                    onClick={() => refetch()} disabled={isFetching}>
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F6F6F6] flex items-center justify-center shrink-0">
                    <ShopIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className='flex justify-between items-center'>
                      <p className="text-sm font-semibold text-dark-gray truncate">{displayStoreName}</p>
                      <Badge className={`${statusBadge.cls} text-[10px] px-2 py-0.5 font-semibold border`}>
                        {statusBadge.label}
                      </Badge>
                    </div>
                    {displayStoreCode && (
                      <p className="text-xs text-medium-gray tracking-wide">Store Code: {displayStoreCode}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-medium text-medium-gray pt-1">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Last update: {info.activityDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <OrderIcon3 className="w-3.5 h-3.5 shrink-0" />
                    <span>{STATUS_LABELS[currentActivity] ?? currentActivity}</span>
                  </div>
                  {info.comment && (
                    <div className="flex items-start gap-2 mt-0.5 bg-gray-50 rounded-lg px-2.5 py-2">
                      <span className="text-gray-400">💬</span>
                      <span className="text-gray-600">{info.comment}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 space-y-4">
                <div className='flex items-center gap-7.5'>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 relative rounded-xl overflow-hidden border border-gray-100 shrink-0">
                      <Image
                        src={firstItem?.picture || placeholder.src}
                        alt={firstItem?.itemName || 'item'}
                        fill className="object-cover" sizes="44px"
                        onError={(e) => { (e.target as HTMLImageElement).src = placeholder.src; }}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-medium-gray tracking-wide">Order ID</p>
                      <p className="text-sm font-medium text-dark-gray">{orderNo}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-medium-gray tracking-wide">Delivery Type</p>
                    <p className={`text-sm font-medium text-dark-gray ${displayDelivery === 'delivery' ? 'text-green-600' : 'text-green-600'}`}>
                      {displayDelivery === 'delivery' ? 'Delivery' : 'Pickup'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-35">
                  <div>
                    <p className="text-xs text-medium-gray tracking-wide">Customer</p>
                    <p className="text-sm font-medium text-dark-gray">{displayCustomer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-medium-gray tracking-wide">Payment Method</p>
                    <p className="text-sm font-medium text-dark-gray">{displayPayment}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-52 shrink-0">
              <div className="bg-white rounded-2xl p-4">
                <p className="text-sm font-semibold text-dark-gray mb-3">Order Status</p>

                {isCancelled ? (
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <XCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-500">Cancelled</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{info.activityDate}</p>
                    </div>
                  </div>
                ) : (
                  <ol className="space-y-0">
                    {progression.map((step, idx) => {
                      const isDone = currentIdx >= 0 && idx < currentIdx;
                      const isCurrent = idx === currentIdx;
                      const isPending = currentIdx < 0 || idx > currentIdx;
                      const isLast = idx === progression.length - 1;
                      const isFirst = idx === 0;

                      return (
                        <li key={step} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${isDone ? 'bg-sidebar-accent text-white' :
                              isCurrent ? 'bg-white border-2 border-faded-accent' :
                                'bg-gray-100'
                              }`}>
                              {isDone ? (
                                <CheckIcon className="w-2 h-2" />
                              ) : isCurrent ? (
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-gray-300" />
                              )}
                            </div>
                            {!isLast && (
                              <div className={`w-0.5 flex-1 my-1 min-h-[20px] rounded-full ${isDone ? 'bg-sidebar-accent' : 'bg-gray-200'
                                }`} />
                            )}
                          </div>
                          <div className="pb-4 min-w-0">
                            <p className={`text-sm text-dark-gray font-medium leading-snug ${isPending ? 'text-gray-400' : 'text-gray-900'
                              }`}>
                              {STATUS_LABELS[step] ?? step}
                            </p>
                            {isFirst && (
                              <p className="text-[10px] text-medium-gray mt-0.5">{info.deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'}</p>
                            )}
                            {isCurrent && (
                              <p className="text-[10px] text-medium-gray mt-0.5">{info.activityDate}</p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}

                {isFetching && (
                  <p className="text-[10px] text-gray-400 mt-3 text-center flex items-center justify-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Updating…
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderTrackingModal;