'use client'
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Truck, CheckCircle, XCircle, Clock, Store } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TrackingStep {
  id: number;
  orderNo: string;
  entityCode: string;
  status: string;
  orderDate: string;
  customerName: string;
  ccy: string;
  totalAmount: string;
  paymentMethod: string;
  activityDate: string;
  activityType: 'PACKING' | 'DELIVERED' | 'CANCELLED' | 'PAYMENT_RECEIVED' | 'ORDER_REVIEW' | 'SHIPPED' | 'IN_TRANSIT' | 'AVAILABLE_FOR_PICKUP';
  comment?: string;
  docLink?: string;
  deliveryOption?: 'delivery' | 'pickup';
}

interface OrderTrackingData {
  orderTrackInfo: TrackingStep;
}

interface CustomerOrderTrackingModalProps {
  trackingNo: string;
  orderNo: string;
  storeName: string;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusMapping = (deliveryOption: 'delivery' | 'pickup' = 'delivery') => ({
  PAYMENT_RECEIVED: { label: 'Payment Received', icon: <CheckCircle className="w-6 h-6" /> },
  ORDER_REVIEW: { label: 'Order Review', icon: <Clock className="w-6 h-6" /> },
  PACKING: { label: 'Packing', icon: <Package className="w-6 h-6" /> },
  IN_TRANSIT: { label: 'In Transit', icon: <Truck className="w-6 h-6" /> },
  SHIPPED: { label: 'Shipped', icon: <Truck className="w-6 h-6" /> },
  DELIVERED: {
    label: deliveryOption === 'pickup' ? 'Available for Pickup' : 'Delivered',
    icon: deliveryOption === 'pickup' ? <Store className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />
  },
  AVAILABLE_FOR_PICKUP: {
    label: 'Available for Pickup',
    icon: <Store className="w-6 h-6" />
  },
  CANCELLED: { label: 'Cancelled', icon: <XCircle className="w-6 h-6" /> },
  COMPLETED: { label: 'Completed', icon: <CheckCircle className="w-6 h-6" /> }
});

const statusColors = {
  PAYMENT_RECEIVED: 'bg-green-100 text-green-800',
  ORDER_REVIEW: 'bg-blue-100 text-blue-800',
  PACKING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  IN_TRANSIT: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  AVAILABLE_FOR_PICKUP: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

const CustomerOrderTrackingModal: React.FC<CustomerOrderTrackingModalProps> = ({
  trackingNo,
  orderNo,
  storeName,
  isOpen,
  onClose
}) => {
  const { data: trackingData, isFetching, isError, refetch } = useQuery<OrderTrackingData>({
    queryKey: ['customer-order-tracking', trackingNo, orderNo],
    queryFn: () => axiosCustomer.request({
      method: 'GET',
      url: 'ecommerce/track-sale-order',
      params: { trackingNo, orderNo }
    }),
    enabled: isOpen && !!trackingNo,
    select: (response) => response.data,
  });

  React.useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const trackingInfo = trackingData?.orderTrackInfo;
  const currentStatus = trackingInfo?.status || 'PENDING';
  const currentActivityType = trackingInfo?.activityType;
  const isCancelled = currentActivityType === 'CANCELLED';
  const isCompleted = currentStatus === 'COMPLETED';

  const deliveryOption = trackingInfo?.deliveryOption || 'delivery' as 'delivery' | 'pickup';

  const STATUS_MAPPING = getStatusMapping(deliveryOption);

  const getStatusProgression = () => {
    const allStatuses = ['PAYMENT_RECEIVED', 'ORDER_REVIEW', 'PACKING', 'SHIPPED', 'IN_TRANSIT'];

    if (deliveryOption === 'pickup') {
      allStatuses.push('AVAILABLE_FOR_PICKUP');
    } else {
      allStatuses.push('DELIVERED');
    }

    if (isCancelled) {
      return ['CANCELLED'];
    }

    return allStatuses;
  };

  const getStatusIndex = (status: string) => {
    const statusOrder = getStatusProgression();
    return statusOrder.indexOf(status);
  };

  const getDisplayActivityType = (activityType: string) => {
    if (deliveryOption === 'pickup' && activityType === 'DELIVERED') {
      return 'AVAILABLE_FOR_PICKUP';
    }
    return activityType;
  };

  const renderStatusSteps = () => {
    if (isCancelled) {
      return (
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white">
            <XCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-800">Cancelled</h4>
                {trackingInfo && (
                  <p className="text-sm text-gray-500 mt-1">
                    {trackingInfo.activityDate}
                  </p>
                )}
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Cancelled
              </span>
            </div>
          </div>
        </div>
      );
    }

    const statusProgression = getStatusProgression();

    return statusProgression.map((status, index) => {
      const displayStatus = getDisplayActivityType(status);
      const currentDisplayActivityType = getDisplayActivityType(currentActivityType || 'PAYMENT_RECEIVED');
      const currentIndex = getStatusIndex(currentDisplayActivityType);
      const isCompletedStep = currentIndex >= index;
      const isCurrent = displayStatus === currentDisplayActivityType;
      const statusConfig = STATUS_MAPPING[displayStatus as keyof typeof STATUS_MAPPING] || { label: displayStatus, icon: <Package className="w-5 h-5" /> };

      return (
        <div key={displayStatus} className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
            ${isCompletedStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
            {isCompletedStep ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              statusConfig.icon
            )}
          </div>

          <div className={`flex-1 pt-1 ${index === statusProgression.length - 1 ? '' : 'pb-6'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className={`font-medium ${isCompletedStep ? 'text-gray-800' : 'text-gray-500'}`}>
                  {statusConfig.label}
                </h4>
                {isCurrent && trackingInfo && (
                  <p className="text-sm text-gray-500 mt-1">
                    {trackingInfo.activityDate}
                  </p>
                )}
              </div>
              {isCurrent && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                  ${statusColors[displayStatus as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                  {isCompleted ? 'Completed' : 'In Progress'}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  const displayCurrentActivityType = getDisplayActivityType(currentActivityType || '');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className='flex flex-col'>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            {storeName} - Order Tracking
          </DialogTitle>
          <DialogDescription>
            Tracking #{trackingNo} • Order: {orderNo}
          </DialogDescription>
        </DialogHeader>

        {isFetching ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading tracking information...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">
            <p>Failed to load tracking information. Please try again later.</p>
          </div>
        ) : (

          <div className="py-4">

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">
                    {trackingInfo?.orderDate || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{trackingInfo?.customerName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Type</p>
                  <p className="font-medium">
                    <Badge className={`${deliveryOption === 'pickup' ? 'bg-orange-500' : 'bg-blue-500'} text-white text-xs px-2 py-1`}>
                      {deliveryOption === 'pickup' ? 'Pickup' : 'Delivery'}
                    </Badge>
                  </p>
                </div>
                {/* <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium">{trackingInfo?.ccy || 'N/A'} {parseFloat(trackingInfo?.totalAmount || '0').toFixed(2)}</p>
                </div> */}
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{trackingInfo?.paymentMethod || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {isCancelled ? 'Cancellation Details' : isCompleted ? 'Completion Details' : 'Order Status'}
              </h3>

              <div className="relative">
                {!isCancelled && !isCompleted && (
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 -z-10"></div>
                )}
                <div className="space-y-8">
                  {renderStatusSteps()}
                </div>
              </div>
            </div>

            {trackingInfo && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Latest Update</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
                      ${statusColors[displayCurrentActivityType as keyof typeof statusColors] || 'bg-gray-100'}`}>
                        {STATUS_MAPPING[displayCurrentActivityType as keyof typeof STATUS_MAPPING]?.icon || <Package className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {STATUS_MAPPING[displayCurrentActivityType as keyof typeof STATUS_MAPPING]?.label || displayCurrentActivityType}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {trackingInfo.activityDate}
                        </p>
                        {trackingInfo.comment && (
                          <p className="text-sm text-gray-600 mt-2">{trackingInfo.comment}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${statusColors[currentStatus as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                      {currentStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CustomerOrderTrackingModal;


// 'use client'
// import React, { useState, useMemo } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { useQuery } from '@tanstack/react-query';
// import DynamicTable from '@/components/Customer/orders/dynamic-table';
// import MobileOrderCard from '@/components/Customer/orders/mobile-order-card';
// import useCustomer from '@/store/customerStore';
// import axiosCustomer from '@/utils/fetch-function-customer';
// import { CustomerOrderTracking } from '@/components/Customer/orders/order-tracking';
// import Papa from 'papaparse';
// import CustomerOrdersFilter from '@/components/Customer/orders/order-filter';
// import { Download } from 'lucide-react';

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
//   orderSatus: string;
//   paymentStatus: string;
//   storeCode: string | null;
//   customerName: string;
//   username: string | null;
//   deliveryAddress: DeliveryAddress;
//   cartItems: CartItem[];
// }

// interface FilterState {
//     searchTerm: string;
//     orderStatus: string;
//     paymentStatus: string;
//     startDate: string;
//     endDate: string;
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
//         'Order Status': order.orderSatus,
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
//   const { customer } = useCustomer()
//   const [filters, setFilters] = useState<FilterState>({
//     searchTerm: '',
//     orderStatus: 'all',
//     paymentStatus: 'all',
//     startDate: '',
//     endDate: ''
//   });

//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ['customer-recent-orders', filters],
//     queryFn: () => {
//       const params: any = {
//         pageNumber: 1,
//         pageSize: 50
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

//       return axiosCustomer.request({
//         url: '/customer-dashboard/fetch-recent-orders',
//         method: 'GET',
//         params
//       });
//     }
//   });

//   const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
//   const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

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
//           item.itemName.toLowerCase().includes(searchTerm)
//         )
//       );
//     }

//     if (filters.orderStatus && filters.orderStatus !== 'all') {
//       filtered = filtered.filter(order =>
//         order.orderSatus.toLowerCase() === filters.orderStatus.toLowerCase()
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
//     setTrackingOrder(order);
//     setIsTrackingModalOpen(true);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-subtle">
//       <div className="container mx-auto p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-foreground mb-2">
//                 Orders Management
//               </h1>
//               <p className="text-muted-foreground">
//                 View and manage your orders
//               </p>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="text-2xl font-bold text-foreground">{filteredOrders.length}</p>
//             <p className="text-sm text-muted-foreground">Total Orders</p>
//           </div>
//         </div>

//         <div className="space-y-6">

//           <CustomerOrdersFilter onFilterChange={handleFilterChange} />

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
//                       />
//                     ))}
//                   </div>

//                   <div className="hidden lg:block">
//                     <DynamicTable
//                       data={filteredOrders}
//                     />
//                   </div>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {trackingOrder && (
//         <CustomerOrderTracking
//           order={trackingOrder}
//           isOpen={isTrackingModalOpen}
//           onClose={() => {
//             setIsTrackingModalOpen(false);
//             setTrackingOrder(null);
//           }}
//         />
//       )}
//     </div>
//   );
// } : 'use client'
// import React from 'react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Package, Truck, CheckCircle, XCircle, Clock, Store } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import axiosCustomer from '@/utils/fetch-function-customer';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// interface TrackingStep {
//   id: number;
//   orderNo: string;
//   entityCode: string;
//   status: string;
//   activityDate: string;
//   activityType: 'PACKING' | 'DELIVERED' | 'CANCELLED' | 'PAYMENT_RECEIVED' | 'ORDER_REVIEW' | 'SHIPPED' | 'IN_TRANSIT' | 'AVAILABLE_FOR_PICKUP';
//   comment?: string;
//   docLink?: string;
//   deliveryOption?: 'delivery' | 'pickup';
// }

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

// export interface Order {
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
//   orderSatus: string;
//   paymentStatus: string;
//   storeCode: string | null;
//   customerName: string;
//   username: string | null;
//   deliveryAddress: DeliveryAddress;
//   cartItems: CartItem[];
//   taxAmount: number;
// }

// interface CustomerOrderTrackingProps {
//   order: Order;
//   isOpen: boolean;
//   onClose: () => void;
// }

// const getStatusMapping = (deliveryOption: 'delivery' | 'pickup' = 'delivery') => ({
//   PAYMENT_RECEIVED: { label: 'Payment Received', icon: <CheckCircle className="w-6 h-6" /> },
//   ORDER_REVIEW: { label: 'Order Review', icon: <Clock className="w-6 h-6" /> },
//   PACKING: { label: 'Packing', icon: <Package className="w-6 h-6" /> },
//   IN_TRANSIT: { label: 'In Transit', icon: <Truck className="w-6 h-6" /> },
//   SHIPPED: { label: 'Shipped', icon: <Truck className="w-6 h-6" /> },
//   DELIVERED: { 
//     label: deliveryOption === 'pickup' ? 'Available for Pickup' : 'Delivered', 
//     icon: deliveryOption === 'pickup' ? <Store className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />
//   },
//   AVAILABLE_FOR_PICKUP: { 
//     label: 'Available for Pickup', 
//     icon: <Store className="w-6 h-6" />
//   },
//   CANCELLED: { label: 'Cancelled', icon: <XCircle className="w-6 h-6" /> },
//   COMPLETED: { label: 'Completed', icon: <CheckCircle className="w-6 h-6" /> }
// });

// const statusColors = {
//   PAYMENT_RECEIVED: 'bg-green-100 text-green-800',
//   ORDER_REVIEW: 'bg-blue-100 text-blue-800',
//   PACKING: 'bg-blue-100 text-blue-800',
//   SHIPPED: 'bg-purple-100 text-purple-800',
//   IN_TRANSIT: 'bg-purple-100 text-purple-800',
//   DELIVERED: 'bg-green-100 text-green-800',
//   AVAILABLE_FOR_PICKUP: 'bg-green-100 text-green-800',
//   CANCELLED: 'bg-red-100 text-red-800',
//   COMPLETED: 'bg-green-100 text-green-800',
// };

// export const CustomerOrderTracking: React.FC<CustomerOrderTrackingProps> = ({
//   order,
//   isOpen,
//   onClose
// }) => {

//   const { data: trackingData, isFetching, isError, refetch } = useQuery({
//     queryKey: ['customer-order-tracking', order.cartId],
//     queryFn: () => axiosCustomer.request({
//       method: 'GET',
//       url: 'ecommerce/track-sale-order',
//       params: {
//         orderNo: order.cartId
//       }
//     }),
//     enabled: isOpen && !!order.cartId,
//     select: (response: any) => response.data,
//   });

//   React.useEffect(() => {
//     if (isOpen) {
//       refetch();
//     }
//   }, [isOpen, refetch]);

//   const calculateSubtotal = () => {
//     return order.cartItems?.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0) || 0;
//   };

//   const calculateTotalTax = () => {
//     return order.cartItems?.reduce((sum: number, item: { tax?: number }) => sum + (item.tax || 0), 0) || 0;
//   };

//   const calculateTotal = () => {
//     return calculateSubtotal() + order.taxAmount + (order.deliveryFee || 0);
//   };

//   const trackingInfo = trackingData?.orderTrackInfo;
//   const currentStatus = trackingInfo?.status || order.orderSatus;
//   const currentActivityType = trackingInfo?.activityType;
//   const isCancelled = currentActivityType === 'CANCELLED';
//   const isCompleted = currentStatus === 'COMPLETED';

//   const deliveryOption = trackingInfo?.deliveryOption || (order.deliveryOption?.toLowerCase() === 'pickup' ? 'pickup' : 'delivery') as 'delivery' | 'pickup';
  
//   const STATUS_MAPPING = getStatusMapping(deliveryOption);

//   const getStatusProgression = () => {
//     const allStatuses = ['PAYMENT_RECEIVED', 'ORDER_REVIEW', 'PACKING', 'SHIPPED', 'IN_TRANSIT'];

//     if (deliveryOption === 'pickup') {
//       allStatuses.push('AVAILABLE_FOR_PICKUP');
//     } else {
//       allStatuses.push('DELIVERED');
//     }

//     if (isCancelled) {
//       return ['CANCELLED'];
//     }

//     return allStatuses;
//   };

//   const getStatusIndex = (status: string) => {
//     const statusOrder = getStatusProgression();
//     return statusOrder.indexOf(status);
//   };

//   const getDisplayActivityType = (activityType: string) => {
//     if (deliveryOption === 'pickup' && activityType === 'DELIVERED') {
//       return 'AVAILABLE_FOR_PICKUP';
//     }
//     return activityType;
//   };

//   const renderStatusSteps = () => {
//     if (isCancelled) {
//       return (
//         <div className="flex items-start gap-4">
//           <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white">
//             <XCircle className="w-5 h-5" />
//           </div>
//           <div className="flex-1 pt-1">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h4 className="font-medium text-gray-800">Cancelled</h4>
//                 {trackingInfo && (
//                   <p className="text-sm text-gray-500 mt-1">
//                     {trackingInfo.activityDate}
//                   </p>
//                 )}
//               </div>
//               <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                 Cancelled
//               </span>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     const statusProgression = getStatusProgression();

//     return statusProgression.map((status, index) => {
//       const displayStatus = getDisplayActivityType(status);
//       const currentDisplayActivityType = getDisplayActivityType(currentActivityType || 'PAYMENT_RECEIVED');
//       const currentIndex = getStatusIndex(currentDisplayActivityType);
//       const isCompletedStep = currentIndex >= index;
//       const isCurrent = displayStatus === currentDisplayActivityType;
//       const statusConfig = STATUS_MAPPING[displayStatus as keyof typeof STATUS_MAPPING] || { label: displayStatus, icon: <Package className="w-5 h-5" /> };

//       return (
//         <div key={displayStatus} className="flex items-start gap-4">
//           <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
//             ${isCompletedStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
//             {isCompletedStep ? (
//               <CheckCircle className="w-5 h-5" />
//             ) : (
//               statusConfig.icon
//             )}
//           </div>

//           <div className={`flex-1 pt-1 ${index === statusProgression.length - 1 ? '' : 'pb-6'}`}>
//             <div className="flex justify-between items-start">
//               <div>
//                 <h4 className={`font-medium ${isCompletedStep ? 'text-gray-800' : 'text-gray-500'}`}>
//                   {statusConfig.label}
//                 </h4>
//                 {isCurrent && trackingInfo && (
//                   <p className="text-sm text-gray-500 mt-1">
//                     {trackingInfo.activityDate}
//                   </p>
//                 )}
//               </div>
//               {isCurrent && (
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium 
//                   ${statusColors[displayStatus as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
//                   {isCompleted ? 'Completed' : 'In Progress'}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       );
//     });
//   };

//   const displayCurrentActivityType = getDisplayActivityType(currentActivityType || '');

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader className='flex flex-col'>
//           <DialogTitle>
//             {isCancelled ? 'Order Cancelled' : isCompleted ? 'Order Completed' : 'Order Tracking'} - {order.cartId}
//           </DialogTitle>
//           <DialogDescription>
//             Track your order status and delivery progress
//           </DialogDescription>
//         </DialogHeader>

//         {isFetching ? (
//           <div className="text-center py-8">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//             <p className="mt-3 text-gray-600">Loading tracking information...</p>
//           </div>
//         ) : isError ? (
//           <div className="text-center py-8 text-red-500">
//             <p>Failed to load tracking information. Please try again later.</p>
//           </div>
//         ) : (
//           <div className="py-4">
//             <div className="bg-gray-50 rounded-lg p-4 mb-6">
//               <div className="grid grid-cols-2 gap-4 md:gap-5">
//                 <div>
//                   <p className="text-sm text-gray-500">Order Date</p>
//                   <p className="font-medium">
//                     {order.orderDate}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Customer</p>
//                   <p className="font-medium">{order.customerName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Delivery Type</p>
//                   <p className="font-medium">
//                     <Badge className={`${deliveryOption === 'pickup' ? 'bg-orange-500' : 'bg-blue-500'} text-white text-xs px-2 py-1`}>
//                       {deliveryOption === 'pickup' ? 'Pickup' : 'Delivery'}
//                     </Badge>
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Total Amount</p>
//                   <p className="font-medium">{order.ccy} {calculateTotal().toFixed(2)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Payment Method</p>
//                   <p className="font-medium">{order.paymentMethod}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-8">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">
//                 {isCancelled ? 'Cancellation Details' : isCompleted ? 'Completion Details' : 'Order Status'}
//               </h3>

//               <div className="relative">
//                 {!isCancelled && !isCompleted && (
//                   <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 -z-10"></div>
//                 )}
//                 <div className="space-y-8">
//                   {renderStatusSteps()}
//                 </div>
//               </div>
//             </div>

//             {trackingInfo && (
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Latest Update</h3>
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <div className="flex justify-between items-start">
//                     <div className="flex items-start gap-3">
//                       <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
//                         ${statusColors[displayCurrentActivityType as keyof typeof statusColors] || 'bg-gray-100'}`}>
//                         {STATUS_MAPPING[displayCurrentActivityType as keyof typeof STATUS_MAPPING]?.icon || <Package className="w-5 h-5" />}
//                       </div>
//                       <div>
//                         <h4 className="font-medium text-gray-800">
//                           {STATUS_MAPPING[displayCurrentActivityType as keyof typeof STATUS_MAPPING]?.label || displayCurrentActivityType}
//                         </h4>
//                         <p className="text-sm text-gray-600 mt-1">
//                           {trackingInfo.activityDate}
//                         </p>
//                         {trackingInfo.comment && (
//                           <p className="text-sm text-gray-600 mt-2">{trackingInfo.comment}</p>
//                         )}
//                       </div>
//                     </div>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium 
//                       ${statusColors[currentStatus as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
//                       {currentStatus}
//                     </span>
//                   </div>
//                   {/* {trackingInfo.docLink && (
//                     <a href={trackingInfo.docLink} target="_blank" rel="noopener noreferrer"
//                       className="inline-block text-sm text-blue-500 mt-2 hover:underline">
//                       View Document
//                     </a>
//                   )} */}
//                 </div>
//               </div>
//             )}

//             {order.deliveryAddress && (
//               <div className="mt-6 border-t pt-4">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-3">Delivery Address</h3>
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <p className="text-sm">
//                     {order.deliveryAddress.street}<br />
//                     {order.deliveryAddress.city && `${order.deliveryAddress.city}, `}
//                     {order.deliveryAddress.state}<br />
//                     {order.deliveryAddress.postCode && `${order.deliveryAddress.postCode}, `}
//                     {order.deliveryAddress.country}
//                     {order.deliveryAddress.landmark && (
//                       <span className="block mt-1 text-gray-500">
//                         Landmark: {order.deliveryAddress.landmark}
//                       </span>
//                     )}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CustomerOrderTracking;