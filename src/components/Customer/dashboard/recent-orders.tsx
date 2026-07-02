'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Repeat, ExternalLink } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import placeholder from '@/components/images/placeholder-product.webp';
import { OrderDetailsModal } from '@/components/Customer/orders/order-details';
import RateOrderModal from '@/components/Customer/orders/rate-order';
import type { OrderDetail } from '@/components/Customer/orders/order-details';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import OrderTrackingModal from '../orders/order-tracking';

interface CartItem {
  itemCode: string;
  itemName: string;
  price: number;
  unit: string | null;
  quantity: number;
  discount: number;
  amount: number;
  picture: string;
  tax?: number;
  oldPrice?: number;
  vat: number;
  bundleSubItems?: {
    id?: number;
    subItemCode: string;
    subItemName: string;
    minQty: number;
    maxQty: number;
    price: number;
    bundlePrice?: number | null;
    qtyChosen: number;
  }[];
}

interface Order {
  channel: string | null;
  cartId: string;
  orderDate: string;
  totalAmount: number;
  totalDiscount: number;
  deliveryOption: string;
  paymentMethod: string;
  couponCode: string | null;
  ccy: string;
  deliveryFee: number;
  geolocation: string | null;
  deviceId: string | null;
  orderStatus: string;
  paymentStatus: string;
  storeCode: string | null;
  customerName: string;
  deliveryAddress: any;
  cartItems: CartItem[];
  taxAmount: number;
  transactionFee: number;
  hasRating: boolean;
  ratingCount: number;
  trackingNo?: string;
  storeName?: string;
}

const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'delivered':
    case 'completed':
    case 'success':
    case 'paid':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'processing':
    case 'pending':
    case 'partially completed':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'shipped':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'cancelled':
    case 'failed':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const useProcessPayment = (setIsAlertOpen: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (orderNo: string) =>
      axiosCustomer.request({
        url: '/ecomm-wallet/process-pay',
        method: 'GET',
        params: { orderNo },
      }),
    onSuccess: (data) => {
      if (data?.data?.code !== '000') { toast.error(data?.data?.desc); return; }
      toast.success(data?.data?.desc);
      setIsAlertOpen(false);
      queryClient.invalidateQueries({ queryKey: ['customer-recent-orders'] });
    },
    onError: () => toast.error('Something went wrong!'),
  });
  return { mutate, isPending };
};

const OrderImageCollage: React.FC<{ items: CartItem[] }> = ({ items }) => {
  const pictures = items.map((i) => i.picture || placeholder.src).slice(0, 3);
  const count = pictures.length;

  if (count === 1) {
    return (
      <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg overflow-hidden shrink-0 relative">
        <Image
          src={pictures[0]}
          alt="item"
          fill
          className="object-cover"
          sizes="40px"
          onError={(e) => { (e.target as HTMLImageElement).src = placeholder.src; }}
        />
      </div>
    );
  }

  const displayCount = Math.min(count, 3);
  const remainingCount = count - 3;

  const getCascadeStyle = (idx: number, total: number) => {
    if (total === 2) {
      return {
        left: idx * 12,
        top: idx * 10,
        zIndex: total - idx,
        transform: `rotate(${idx * 8 - 4}deg)`,
      };
    }
    return {
      left: idx * 10,
      top: idx * 8,
      zIndex: total - idx,
      transform: `rotate(${idx * 6 - 6}deg)`,
    };
  };

  return (
    <div className="relative w-10 h-10 shrink-0">
      <style jsx>{`
      .cascade-image:hover {
        z-index: 50 !important;
      }
    `}</style>
      {pictures.slice(0, displayCount).map((src, idx) => {
        const style = getCascadeStyle(idx, displayCount);
        return (
          <div
            key={idx}
            className="cascade-image absolute w-10 h-10 rounded-lg overflow-hidden shadow-md bg-white transition-all duration-200 hover:scale-105"
            style={style}
          >
            <Image
              src={src}
              alt="item"
              fill
              className="object-cover"
              sizes="40px"
              onError={(e) => { (e.target as HTMLImageElement).src = placeholder.src; }}
            />
          </div>
        );
      })}
      {remainingCount > 0 && (
        <div
          className="absolute w-10 h-10 rounded-lg bg-[#F5F5F5] border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-700 shadow-md"
          style={{
            left: displayCount * 10,
            top: displayCount * 8,
            zIndex: 0,
          }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

const OrderRow: React.FC<{
  order: Order;
  onClick: (o: Order) => void;
  isLast: boolean;
}> = ({ order, onClick, isLast }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { mutate, isPending } = useProcessPayment(setIsAlertOpen);
  const isBNPLPending = order.paymentMethod === 'BNPL' && order.orderStatus === 'Payment Pending';

  return (
    <div
      onClick={() => onClick(order)}
      className={`w-full flex items-center hover:bg-gray-50 gap-3 py-3 px-1 active:bg-gray-100 transition-colors cursor-pointer ${!isLast ? 'border-b-1 border-[#EEEEEE]' : ''
        }`}
    >
      <button
        type="button"
        className="flex items-center gap-4 flex-1 min-w-0 text-left cursor-pointer hover:bg-gray-50 active:bg-gray-100 "
      >
        <OrderImageCollage items={order.cartItems} />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-dark-gray truncate">
            {order.cartId}
          </p>
          <p className="text-xs text-medium-gray mt-0.5">{order.orderDate}</p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-dark-gray">
            {formatPrice(order.totalAmount, order.ccy as CurrencyCode)}
          </p>
          <Badge
            className={`mt-1 text-[10px] px-2 py-0.5 border font-medium ${getStatusColor(order.orderStatus)}`}
          >
            {order.orderStatus}
          </Badge>
        </div>
      </button>

      {isBNPLPending && (
        <div className="flex items-center gap-1 shrink-0 ml-1">
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1">
                <Repeat className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
                <AlertDialogDescription>Proceed with payment?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  className="bg-accent text-white px-4 py-2 text-sm rounded-md"
                  onClick={() => mutate(order.cartId)}
                  disabled={isPending}
                >
                  {isPending ? 'Please wait…' : 'Make Payment'}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Link href={`/payment-plan?orderId=${order.cartId}`} className="p-1">
            <ExternalLink className="w-4 h-4 text-gray-500" />
          </Link>
        </div>
      )}
    </div>
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
      <p className="text-xs text-medium-gray">{start}–{end} of {total}</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(currentPage - 1)} disabled={currentPage === 1}
          className="text-xs px-2.5 py-1 rounded-md border border-medium-gray disabled:opacity-40 hover:bg-gray-50 transition-colors">‹</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => onChange(p)}
            className={`text-xs w-7 h-7 rounded-md border transition-colors ${p === currentPage ? 'bg-faded-accent text-white border-border' : 'border-border hover:bg-gray-50'
              }`}>{p}</button>
        ))}
        <button onClick={() => onChange(currentPage + 1)} disabled={currentPage === totalPages}
          className="text-xs px-2.5 py-1 rounded-md border border-medium-gray disabled:opacity-40 hover:bg-gray-50 transition-colors">›</button>
      </div>
    </div>
  );
};

const ITEMS_PER_PAGE = 5;

export default function OrderHistory(): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRateOpen, setIsRateOpen] = useState(false);
  const [rateOrderId, setRateOrderId] = useState<string | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['customer-recent-orders'],
    queryFn: () =>
      axiosCustomer.request({
        url: '/customer-dashboard/fetch-recent-orders',
        method: 'GET',
        params: { pageNumber: 1, pageSize: 10 },
      }),
  });

  const orders: Order[] = data?.data?.data || [];
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginated = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleRateOrder = (order: OrderDetail) => {
    setRateOrderId(order.cartId);
    setIsDetailsOpen(false);
    setIsRateOpen(true);
  };

  const openTracking = (o: Order) => { setSelectedOrder(o); setIsTrackingOpen(true); };

  const handleSubmitRating = async (payload: { orderId: string; rating: number; comment: string }) => {
    try {
      const response = await axiosCustomer.request({
        method: 'POST',
        url: 'rating/rate-order',
        data: {
          productCode: payload.orderId,
          reviewType: '',
          comment: payload.comment,
          rating: payload.rating,
          channel: selectedOrder?.channel || 'WEB',
        },
      });
      if (response.data?.code === '000') {
        toast.success('Rating submitted successfully');
        if (selectedOrder) {
          selectedOrder.hasRating = true;
          selectedOrder.ratingCount = payload.rating;
        }
      } else {
        toast.error(response.data?.desc || 'Failed to submit rating');
      }
    } catch {
      toast.error('An error occurred while submitting your rating');
    }
  };

  if (!orders.length && !isLoading) {
    return (
      <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-4 lg:p-6">
        <div className='pb-4 mb-4 border-b border-[#EEEEEE]'>
          <div className="flex items-center justify-between">
            <h2 className="text-dark-gray text-lg font-semibold">
              Recent Orders
            </h2>
            <Link href='/orders'>
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
            <p className="text-medium-gray text-sm">No recent orders found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-4 lg:p-6">
        <div className='pb-4 mb-4 border-b border-[#EEEEEE]'>
          <div className="flex items-center justify-between">
            <h2 className="text-dark-gray text-lg font-semibold">
              Recent Orders
            </h2>
            <Link href='/orders'>
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
              <p className="text-sm text-gray-400">Loading orders…</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-sm text-red-400">Error loading orders</p>
            </div>
          ) : (
            <>
              <div>
                {paginated.map((order, idx) => (
                  <OrderRow
                    key={order.cartId + idx}
                    order={order}
                    onClick={handleRowClick}
                    isLast={idx === paginated.length - 1}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  total={orders.length}
                  perPage={ITEMS_PER_PAGE}
                  onChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      <OrderDetailsModal
        order={selectedOrder as OrderDetail | null}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onTrackOrder={(o) => { setIsDetailsOpen(false); openTracking(o as unknown as Order); }}
        onRateOrder={handleRateOrder}
      />

      <RateOrderModal
        open={isRateOpen}
        onClose={() => setIsRateOpen(false)}
        orderId={rateOrderId}
        onSubmit={handleSubmitRating}
      />

      <OrderTrackingModal
        trackingNo={selectedOrder?.trackingNo}
        orderNo={selectedOrder?.cartId ?? ''}
        storeName={selectedOrder?.storeName ?? 'Store'}
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        firstItem={selectedOrder?.cartItems?.[0]}
        customerName={selectedOrder?.customerName}
        paymentMethod={selectedOrder?.paymentMethod}
        ccy={selectedOrder?.ccy}
      />
    </>
  );
}