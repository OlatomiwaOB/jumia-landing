// 'use client'
// import React, { useMemo, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from "@/components/ui/input";
// import { Search, Download } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import axiosInstance from '@/utils/fetch-function';
// import useUser from '@/store/userStore';
// import DynamicTable from '../../../../components/Admin/orders/dynamic-table';
// import { OrderTracking, UpdateOrderTracking } from '../../../../components/Admin/orders/order-tracking';
// import MobileOrderCard from '../../../../components/Admin/orders/mobile-order-card';
// import Papa from 'papaparse';
// import OrdersFilter from '@/components/Admin/orders/order-filter';
// import { usePermission } from '@/hooks/usePermissionBusiness';

// interface CartItem {
//   itemCode: string;
//   itemName: string;
//   price: number;
//   unit: string | null;
//   quantity: number;
//   discount: number;
//   amount: number;
//   picture: string;
//   tax?: number;
//   vat: number;
// }

// interface FilterState {
//   searchTerm: string;
//   orderStatus: string;
//   paymentStatus: string;
//   startDate: string;
//   endDate: string;
// }

// interface DeliveryAddress {
//   id: number;
//   street: string;
//   landmark: string | null;
//   postCode: string | null;
//   city: string | null;
//   state: string;
//   country: string | null;
//   addressType: string;
// }

// interface Order {
//   channel: string | null;
//   cartId: string;
//   orderDate: string;
//   totalAmount: number;
//   totalDiscount: number;
//   deliveryOption: string;
//   paymentMethod: string;
//   couponCode: string | null;
//   ccy: string;
//   deliveryFee: number;
//   geolocation: string | null;
//   deviceId: string | null;
//   orderStatus: string;
//   paymentStatus: string;
//   storeCode: string | null;
//   customerName: string;
//   username: string | null;
//   deliveryAddress: DeliveryAddress;
//   cartItems: CartItem[];
//   taxAmount: number;
//   trackingNo: string;
//   hasRating: boolean;
//   ratingCount: number;
// }

// const exportDetailedOrdersToCSV = (orders: Order[]) => {
//   try {
//     if (!orders || orders.length === 0) {
//       alert('No orders available to export');
//       return;
//     }

//     const detailedData = orders.flatMap(order =>
//       order.cartItems.map(item => ({
//         'Order ID': order.cartId,
//         'Order Date': order.orderDate,
//         'Customer Name': order.customerName,
//         'Item Code': item.itemCode,
//         'Item Name': item.itemName,
//         'Quantity': item.quantity,
//         'Unit Price': item.price,
//         'Discount': item.discount,
//         'Item Amount': item.amount,
//         'Currency': order.ccy,
//         'Total Order Amount': order.totalAmount,
//         'Order Status': order.orderStatus,
//         'Payment Status': order.paymentStatus,
//         'Payment Method': order.paymentMethod || 'N/A',
//         'Delivery Option': order.deliveryOption || 'N/A',
//         'Street': order.deliveryAddress?.street || 'N/A',
//         'City': order.deliveryAddress?.city || 'N/A',
//         'State': order.deliveryAddress?.state || 'N/A',
//         'Country': order.deliveryAddress?.country || 'N/A'
//       }))
//     );

//     const csv = Papa.unparse(detailedData, {
//       header: true,
//       delimiter: ','
//     });

//     const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);

//     link.setAttribute('href', url);
//     link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = 'hidden';

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);

//   } catch (error) {
//     console.error('Export failed:', error);
//     alert('Failed to export orders. Please try again.');
//   }
// };

// export default function OrderHistory(): React.ReactElement {
//   const { usePermissionGuard } = usePermission();

//   usePermissionGuard('VIEW_ORDERS', {
//     redirectToNotPermitted: true,
//     toastMessage: "You don't have permission to view orders"
//   });
//   const { user } = useUser();
//   const [filters, setFilters] = useState<FilterState>({
//     searchTerm: '',
//     orderStatus: 'all',
//     paymentStatus: 'all',
//     startDate: '',
//     endDate: ''
//   });
//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ['recent-orders', filters],
//     queryFn: () => {
//       const params: any = {
//         storeCode: user?.storeCode,
//         entityCode: user?.entityCode,
//         pageNumber: 1,
//         pageSize: 50,
//       };

//       if (filters.searchTerm) {
//         params.searchTerm = filters.searchTerm;
//       }
//       if (filters.orderStatus && filters.orderStatus !== 'all') {
//         params.orderStatus = filters.orderStatus;
//       }
//       if (filters.paymentStatus && filters.paymentStatus !== 'all') {
//         params.paymentStatus = filters.paymentStatus;
//       }
//       if (filters.startDate) {
//         params.startDate = filters.startDate;
//       }
//       if (filters.endDate) {
//         params.endDate = filters.endDate;
//       }

//       return axiosInstance.request({
//         url: '/store-dashboard/fetch-recent-orders',
//         method: 'GET',
//         params
//       });
//     },
//     enabled: !!user?.storeCode && !!user?.entityCode
//   });

//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
//   const [isUpdateTrackingModalOpen, setIsUpdateTrackingModalOpen] = useState(false);

//   const allOrders: Order[] = data?.data?.data || [];

//   const filteredOrders = useMemo(() => {
//     let filtered = allOrders;

//     if (filters.searchTerm) {
//       const searchTerm = filters.searchTerm.toLowerCase();
//       filtered = filtered.filter(order =>
//         order.cartId.toLowerCase().includes(searchTerm) ||
//         order.customerName.toLowerCase().includes(searchTerm) ||
//         order.orderDate.toLowerCase().includes(searchTerm) ||
//         (order.paymentMethod && order.paymentMethod.toLowerCase().includes(searchTerm)) ||
//         order.cartItems.some(item =>
//           item.itemName.toLowerCase().includes(searchTerm) ||
//           item.itemCode.toLowerCase().includes(searchTerm)
//         )
//       );
//     }

//     if (filters.orderStatus && filters.orderStatus !== 'all') {
//       filtered = filtered.filter(order =>
//         order.orderStatus.toLowerCase() === filters.orderStatus.toLowerCase()
//       );
//     }

//     if (filters.paymentStatus && filters.paymentStatus !== 'all') {
//       filtered = filtered.filter(order =>
//         order.paymentStatus.toLowerCase() === filters.paymentStatus.toLowerCase()
//       );
//     }

//     if (filters.startDate) {
//       filtered = filtered.filter(order =>
//         new Date(order.orderDate) >= new Date(filters.startDate)
//       );
//     }

//     if (filters.endDate) {
//       const endDate = new Date(filters.endDate);
//       endDate.setHours(23, 59, 59, 999);
//       filtered = filtered.filter(order =>
//         new Date(order.orderDate) <= endDate
//       );
//     }

//     return filtered;
//   }, [allOrders, filters]);

//   const handleFilterChange = (newFilters: FilterState) => {
//     setFilters(newFilters);
//   };

//   const handleExport = () => {
//     exportDetailedOrdersToCSV(filteredOrders);
//   };

//   const handleTrackOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setIsTrackingModalOpen(true);
//   };

//   const handleUpdateTracking = (order: Order) => {
//     setSelectedOrder(order);
//     setIsUpdateTrackingModalOpen(true);
//   };

//   const handleUpdateSuccess = () => {
//     refetch();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-subtle">
//       <div className="container mx-auto p-6">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-foreground mb-2">
//                 Orders Management
//               </h1>
//               <p className="text-muted-foreground">
//                 View and manage customer orders
//               </p>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="text-2xl font-bold text-foreground">{filteredOrders.length}</p>
//             <p className="text-sm text-muted-foreground">Total Orders</p>
//           </div>
//         </div>

//         <div className="space-y-6">

//           <OrdersFilter onFilterChange={handleFilterChange} />

//           <Card className="border-gray-200 shadow-sm">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-base lg:text-lg font-semibold text-gray-900">
//                   Orders
//                 </CardTitle>
//                 <Button variant="outline" size="sm" className="gap-2" onClick={handleExport} disabled={filteredOrders.length === 0}>
//                   <Download className="w-4 h-4" />
//                   <span className="hidden sm:inline">Export</span>
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <div className="flex justify-center items-center h-40">
//                   <p className="text-gray-500">Loading orders...</p>
//                 </div>
//               ) : error ? (
//                 <div className="flex justify-center items-center h-40">
//                   <p className="text-red-500">Error loading orders</p>
//                 </div>
//               ) : filteredOrders.length === 0 ? (
//                 <div className="flex justify-center items-center h-40">
//                   <p className="text-gray-500">No orders found</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="block lg:hidden space-y-4">
//                     {filteredOrders.map((order) => (
//                       <MobileOrderCard
//                         key={order.cartId}
//                         order={order}
//                         onTrackOrder={handleTrackOrder}
//                         onUpdateTracking={handleUpdateTracking}
//                       />
//                     ))}
//                   </div>

//                   <div className="hidden lg:block">
//                     <DynamicTable
//                       data={filteredOrders}
//                       onTrackOrder={handleTrackOrder}
//                       onUpdateTracking={handleUpdateTracking}
//                       searchTerm={filters.searchTerm}
//                     />
//                   </div>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {selectedOrder && (
//         <OrderTracking
//           order={selectedOrder}
//           isOpen={isTrackingModalOpen}
//           onClose={() => setIsTrackingModalOpen(false)}
//         />
//       )}

//       {selectedOrder && (
//         <UpdateOrderTracking
//           order={selectedOrder}
//           isOpen={isUpdateTrackingModalOpen}
//           onClose={() => setIsUpdateTrackingModalOpen(false)}
//           onSuccess={handleUpdateSuccess}
//         />
//       )}
//     </div>
//   );
// }

'use client'
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';
import Papa from 'papaparse';
import Image from 'next/image';
import placeholder from '@/components/images/placeholder-product.webp';
import { Badge } from '@/components/ui/badge';
import { Eye, Star, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { OrderDetailsModal, OrderDetail } from '@/components/Admin/orders/order-details';
import OrderTrackingModal from '@/components/Admin/orders/order-tracking';
import { UpdateOrderTracking } from '@/components/Admin/orders/update-tracking';
import PickupRequestModal from '@/components/Admin/orders/pickup-request';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { CubeIcon, CubeIconGray, ProfileIconGray, RoutingIcon, SeperatorIcon, StarIcon, TransInflowIcon, UserIcon } from '@/components/icons/icons';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { usePermission } from '@/hooks/usePermissionBusiness';
import OrdersTable, { ColumnDef } from '@/components/Customer/orders/dynamic-table';
import { usePageMetadata } from '@/hooks/usePageMetadata';

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
  storeCode?: string | null;
}

interface DeliveryAddress {
  id: number;
  street: string;
  landmark: string | null;
  postCode: string | null;
  city: string | null;
  state: string;
  country: string | null;
  addressType: string;
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
  username?: string | null;
  deliveryAddress: DeliveryAddress;
  cartItems: CartItem[];
  taxAmount: number;
  hasRating: boolean;
  ratingCount: number;
  pickupId?: string | null;
  transactionFee: number;
  trackingNo?: string;
  storeName?: string;
}

interface FilterState {
  searchTerm: string;
  orderStatus: string;
  startDate: string;
  endDate: string;
}

const statusOptions = [
  { id: 'all', label: 'All Status' },
  { id: 'PAID', label: 'Paid' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'CANCELLED', label: 'Cancelled' },
];

const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'delivered': case 'completed': case 'paid': case 'success':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'processing': case 'pending': case 'partially completed':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'shipped':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'cancelled': case 'failed':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const ddmmyyyyToDate = (ddmmyyyy: string): Date | null => {
  if (!ddmmyyyy) return null;
  const datePart = ddmmyyyy.split(' ')[0];
  const separator = datePart.includes('/') ? '/' : '-';
  const [dd, mm, yyyy] = datePart.split(separator);
  if (!dd || !mm || !yyyy) return null;
  const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
};

const ddmmyyyyToISO = (ddmmyyyy: string): string => {
  if (!ddmmyyyy) return '';
  const datePart = ddmmyyyy.split(' ')[0];
  const separator = datePart.includes('/') ? '/' : '-';
  const [dd, mm, yyyy] = datePart.split(separator);
  if (!dd || !mm || !yyyy) return '';
  return `${dd}-${mm}-${yyyy}`;
};

const ViewRatingModal: React.FC<{
  open: boolean;
  onClose: () => void;
  orderId: string | null;
  ratingCount: number;
}> = ({ open, onClose, orderId, ratingCount }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md p-0 overflow-y-auto rounded-2xl gap-0 border-0 shadow-xl bg-[#F5F5F5]">
      <DialogTitle className="sr-only">Order Rating</DialogTitle>
      <div className="mx-6 pt-6">
        <h2 className="text-md font-bold text-dark-gray">Order Rating</h2>
      </div>
      <div className="mx-6 my-2 rounded-2xl bg-white px-2 pb-6 pt-4 space-y-4">
        <div className="text-center space-y-0.5">
          <p className="text-sm font-medium text-medium-gray">Rating for order:</p>
          <p className="text-sm font-bold text-dark-gray">{orderId ?? '—'}</p>
        </div>
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-10 h-10 ${star <= Math.round(ratingCount)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-200 fill-gray-100'
                }`}
            />
          ))}
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-dark-gray">{ratingCount?.toFixed(1) || '0.0'}</p>
        </div>
      </div>
      <div className="flex items-center justify-end bg-white p-4 border-t border-gray-100">
        <Button onClick={onClose}>Close</Button>
      </div>
    </DialogContent>
  </Dialog>
);

const exportToCSV = (orders: Order[]) => {
  if (!orders?.length) { alert('No orders to export'); return; }
  const csv = Papa.unparse(
    orders.flatMap((o) =>
      o.cartItems.map((item) => ({
        'Order ID': o.cartId, 'Order Date': o.orderDate,
        'Customer': o.customerName, 'Item': item.itemName,
        'Qty': item.quantity, 'Price': item.price, 'Discount': item.discount,
        'Amount': item.amount, 'Currency': o.ccy, 'Total': o.totalAmount,
        'Order Status': o.orderStatus, 'Payment Status': o.paymentStatus,
        'Payment Method': o.paymentMethod, 'Delivery': o.deliveryOption,
      }))
    ),
    { header: true }
  );
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
  link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const OrderImageCollage: React.FC<{ items: CartItem[] }> = ({ items }) => {
  const pictures = items.map((i) => i.picture || placeholder.src).slice(0, 3);
  const count = pictures.length;

  if (count === 1) {
    return (
      <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg overflow-hidden shrink-0 relative">
        <Image
          src={pictures[0]} alt="item" fill className="object-cover" sizes="40px"
          onError={(e) => { (e.target as HTMLImageElement).src = placeholder.src; }}
        />
      </div>
    );
  }

  const displayCount = Math.min(count, 3);
  const remainingCount = count - 3;

  const getCascadeStyle = (idx: number, total: number) => {
    if (total === 2) {
      return { left: idx * 12, top: idx * 10, zIndex: total - idx, transform: `rotate(${idx * 8 - 4}deg)` };
    }
    return { left: idx * 10, top: idx * 8, zIndex: total - idx, transform: `rotate(${idx * 6 - 6}deg)` };
  };

  return (
    <div className="relative w-10 h-10 shrink-0">
      <style jsx>{`.cascade-image:hover { z-index: 50 !important; }`}</style>
      {pictures.slice(0, displayCount).map((src, idx) => {
        const style = getCascadeStyle(idx, displayCount);
        return (
          <div key={idx} className="cascade-image absolute w-10 h-10 rounded-lg overflow-hidden shadow-md bg-white transition-all duration-200 hover:scale-105" style={style}>
            <Image src={src} alt="item" fill className="object-cover" sizes="40px"
              onError={(e) => { (e.target as HTMLImageElement).src = placeholder.src; }} />
          </div>
        );
      })}
      {remainingCount > 0 && (
        <div className="absolute w-10 h-10 rounded-lg bg-[#F5F5F5] border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-700 shadow-md"
          style={{ left: displayCount * 10, top: displayCount * 8, zIndex: 0 }}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

const StatsCards: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const total = orders.length;
  const active = orders.filter((o) =>
    !['completed', 'cancelled', 'delivered'].includes(o.orderStatus?.toLowerCase())
  ).length;
  const completed = orders.filter((o) =>
    ['completed', 'delivered'].includes(o.orderStatus?.toLowerCase())
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-3 mb-6">
      {[
        { label: 'Total Orders', value: total },
        { label: 'Active Orders', value: active },
        { label: 'Completed Orders', value: completed },
      ].map(({ label, value }) => (
        <div key={label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
          <p className="text-sm text-medium-gray mb-1">{label}</p>
          <p className="text-2xl font-bold text-dark-gray">{value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

const FilterBar: React.FC<{
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onExport: () => void;
}> = ({ filters, onChange, onExport }) => {
  const hasActive = filters.orderStatus !== 'all' || !!filters.startDate || !!filters.endDate;
  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });
  const clear = () => onChange({ searchTerm: filters.searchTerm, orderStatus: 'all', startDate: '', endDate: '' });

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return (
    <div className="flex flex-wrap justify-between items-center gap-3">
      <div className="flex relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
        <Input value={filters.searchTerm}
          onChange={(e) => update({ searchTerm: e.target.value })}
          placeholder="Search by Cart ID, Item Name..."
          className="pl-9 text-medium-gray" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Select value={filters.orderStatus} onValueChange={(v) => update({ orderStatus: v })}>
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
          <DatePicker value={filters.startDate} onChange={(v) => update({ startDate: v })} />
          <span className="text-xs text-gray-400 shrink-0">to</span>
          <DatePicker value={filters.endDate} onChange={(v) => update({ endDate: v })} maxDate={today} />
        </div>

        {hasActive && (
          <Button variant="ghost" size="sm" onClick={clear} className="gap-1 text-xs">
            <X className="w-3.5 h-3.5" /> Clear
          </Button>
        )}

        <SeperatorIcon />

        <Button onClick={onExport} size='lg'>
          <TransInflowIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
    </div>
  );
};

const MobileOrderCard: React.FC<{
  order: Order;
  onDetails: (o: Order) => void;
  onTrack: (o: Order) => void;
  onUpdateTracking: (o: Order) => void;
  onPickup: (o: Order) => void;
  onViewRating: (o: Order) => void;
}> = ({ order, onDetails, onTrack, onUpdateTracking, onPickup, onViewRating }) => {
  const isCompleted = order.orderStatus?.toLowerCase() === 'completed';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm active:scale-[0.99] transition-transform"
      onClick={() => onDetails(order)}>
      <div className="flex items-center gap-3 p-4">
        <OrderImageCollage items={order.cartItems} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-dark-gray truncate">{order.cartId}</p>
          <p className="text-xs text-medium-gray mt-0.5">{order.orderDate}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-dark-gray">{formatPrice(order.totalAmount, order.ccy as CurrencyCode)}</p>
          <Badge className={`mt-1 text-[10px] px-2 py-0.5 border font-medium ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</Badge>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
        <Badge className={`text-[10px] px-2 py-0.5 border font-medium ${getStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</Badge>
        <div className="flex items-center gap-0.5">
          <button onClick={() => onTrack(order)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors" title="Track Order">
            <RoutingIcon className="w-4 h-4" />
          </button>
          <button onClick={() => onUpdateTracking(order)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors" title="Update Tracking">
            <CubeIconGray className="w-4 h-4" />
          </button>
          <button onClick={() => onPickup(order)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors" title="Request Pickup">
            <ProfileIconGray className="w-4 h-4" />
          </button>
          {isCompleted && order.hasRating && (
            <button onClick={() => onViewRating(order)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors" title="View Rating">
              <StarIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function OrderHistoryPage(): React.ReactElement {
  usePageMetadata('Orders Management', 'View and manage customer orders.');
  const { usePermissionGuard } = usePermission();
  usePermissionGuard('VIEW_ORDERS', { redirectToNotPermitted: true, toastMessage: "You don't have permission to view orders" });

  const { user } = useUser();
  const [filters, setFilters] = useState<FilterState>({ searchTerm: '', orderStatus: 'all', startDate: '', endDate: '' });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isUpdateTrackingOpen, setIsUpdateTrackingOpen] = useState(false);
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [isViewRatingOpen, setIsViewRatingOpen] = useState(false);
  const [viewRatingOrder, setViewRatingOrder] = useState<Order | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-orders-page', filters.orderStatus, filters.startDate, filters.endDate],
    queryFn: () => {
      const params: Record<string, any> = { pageNumber: 1, pageSize: 5000, storeCode: user?.storeCode, entityCode: user?.entityCode };
      if (filters.orderStatus !== 'all') params.orderStatus = filters.orderStatus;
      if (filters.startDate) { const iso = ddmmyyyyToISO(filters.startDate); if (iso) params.startDate = iso; }
      if (filters.endDate) { const iso = ddmmyyyyToISO(filters.endDate); if (iso) params.endDate = iso; }
      if (filters.searchTerm) params.searchTerm = filters.searchTerm;
      return axiosInstance.request({ url: '/store-dashboard/fetch-recent-orders', method: 'GET', params });
    },
    enabled: !!user?.storeCode && !!user?.entityCode,
  });

  const allOrders: Order[] = data?.data?.data || [];

  const filteredOrders = useMemo(() => {
    let r = allOrders;
    const s = filters.searchTerm.toLowerCase().trim();
    if (s) {
      r = r.filter((o) =>
        o.cartId.toLowerCase().includes(s) || o.customerName.toLowerCase().includes(s) ||
        o.cartItems.some((i) => i.itemName.toLowerCase().includes(s))
      );
    }
    if (filters.orderStatus !== 'all') r = r.filter((o) => o.orderStatus.toLowerCase() === filters.orderStatus.toLowerCase());
    const startDate = ddmmyyyyToDate(filters.startDate);
    const endDate = ddmmyyyyToDate(filters.endDate);
    if (startDate) r = r.filter((o) => { const d = ddmmyyyyToDate(o.orderDate) ?? new Date(o.orderDate); return d && !isNaN(d.getTime()) && d >= startDate; });
    if (endDate) { const end = new Date(endDate); end.setHours(23, 59, 59, 999); r = r.filter((o) => { const d = ddmmyyyyToDate(o.orderDate) ?? new Date(o.orderDate); return d && !isNaN(d.getTime()) && d <= end; }); }
    return r;
  }, [allOrders, filters]);

  const openDetails = (o: Order) => { setSelectedOrder(o); setIsDetailsOpen(true); };
  const openTracking = (o: Order) => { setSelectedOrder(o); setIsTrackingOpen(true); };
  const openUpdateTracking = (o: Order) => { setSelectedOrder(o); setIsUpdateTrackingOpen(true); };
  const openPickup = (o: Order) => { setSelectedOrder(o); setIsPickupOpen(true); };
  const openViewRating = (o: Order) => { setViewRatingOrder(o); setIsViewRatingOpen(true); };

  const handleUpdateSuccess = () => { refetch(); };

  const columns: ColumnDef<Order>[] = [
    {
      key: 'product', title: 'Product', width: 200,
      render: (_, record) => {
        const first = record.cartItems?.[0];
        return (
          <div className="flex items-center gap-4">
            <OrderImageCollage items={record.cartItems} />
            <div className="min-w-0 text-dark-gray">
              <p className="text-sm font-semibold truncate max-w-[120px]">{first?.itemName ?? 'N/A'}</p>
              <p className="text-xs font-medium text-medium-gray">Cart: {record.cartItems?.length ?? 0} item{record.cartItems?.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        );
      },
    },
    { key: 'id', title: 'Order ID & Date', width: 190, render: (_, record) => (<div><p className="text-sm font-semibold text-dark-gray">{record.cartId}</p><p className="text-xs text-medium-gray mt-0.5">{record.orderDate}</p></div>) },
    { key: 'customer', title: 'Customer', dataIndex: 'customerName', width: 150, render: (v) => <p className="text-sm font-semibold text-dark-gray">{v ?? 'N/A'}</p> },
    { key: 'amount', title: 'Amount', width: 110, render: (_, record) => <p className="text-sm font-medium text-dark-gray">{formatPrice(record.totalAmount, record.ccy as CurrencyCode)}</p> },
    { key: 'status', title: 'Status', dataIndex: 'orderStatus', width: 110, render: (v) => <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(v)}`}>{v}</Badge> },
    { key: 'payment', title: 'Payment', dataIndex: 'paymentStatus', width: 110, render: (v) => <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(v)}`}>{v}</Badge> },
    {
      key: 'actions', title: '', width: 160,
      render: (_, record) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button size="xs" variant="action" onClick={() => openDetails(record)} title="View Details"><Eye className="w-4 h-4" /></Button>
          <Button size="xs" variant="action" onClick={() => openTracking(record)} title="Track Order"><RoutingIcon /></Button>
          <Button size="xs" variant="action" onClick={() => openUpdateTracking(record)} title="Update Tracking"><CubeIconGray /></Button>
          <Button size="xs" variant="action" onClick={() => openPickup(record)} title="Request Pickup"><ProfileIconGray /></Button>
          {record.orderStatus?.toLowerCase() === 'completed' && record.hasRating && (
            <Button size="xs" variant="action" onClick={() => openViewRating(record)} title="View Rating"><StarIcon className="w-4 h-4" /></Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen px-2">
      {/* <StatsCards orders={filteredOrders} /> */}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-dark-gray">Orders <span className="text-sm font-bold text-faded-accent">({filteredOrders.length})</span></h2>
      </div>

      <div className="mb-4">
        <FilterBar filters={filters} onChange={setFilters} onExport={() => exportToCSV(filteredOrders)} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading orders</div>
      ) : (
        <>
          <div className="hidden lg:block">
            <OrdersTable columns={columns} data={filteredOrders} rowKey="cartId" itemsPerPage={15} />
          </div>
          <div className="lg:hidden space-y-3 py-2">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                <p className="text-sm font-medium text-dark-gray">No orders found</p>
                <p className="text-xs text-center max-w-[200px] text-medium-gray">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              filteredOrders.map((o) => (
                <MobileOrderCard key={o.cartId} order={o} onDetails={openDetails} onTrack={openTracking}
                  onUpdateTracking={openUpdateTracking} onPickup={openPickup} onViewRating={openViewRating} />
              ))
            )}
          </div>
        </>
      )}

      <OrderDetailsModal order={selectedOrder as OrderDetail | null} open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)}
        onTrackOrder={(o) => { setIsDetailsOpen(false); openTracking(o as unknown as Order); }} />

      <OrderTrackingModal trackingNo={selectedOrder?.trackingNo} orderNo={selectedOrder?.cartId ?? ''}
        storeName={selectedOrder?.storeName ?? 'Store'} isOpen={isTrackingOpen} onClose={() => setIsTrackingOpen(false)}
        firstItem={selectedOrder?.cartItems?.[0]} customerName={selectedOrder?.customerName}
        paymentMethod={selectedOrder?.paymentMethod} ccy={selectedOrder?.ccy} />

      {selectedOrder && (
        <UpdateOrderTracking order={selectedOrder} isOpen={isUpdateTrackingOpen}
          onClose={() => setIsUpdateTrackingOpen(false)} onSuccess={handleUpdateSuccess} />
      )}

      {selectedOrder && (
        <PickupRequestModal order={selectedOrder} isOpen={isPickupOpen}
          onClose={() => setIsPickupOpen(false)} onSuccess={() => refetch()} />
      )}

      <ViewRatingModal open={isViewRatingOpen} onClose={() => setIsViewRatingOpen(false)}
        orderId={viewRatingOrder?.cartId ?? null} ratingCount={viewRatingOrder?.ratingCount ?? 0} />
    </div>
  );
}