'use client'
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import DynamicTable from '@/components/Customer/orders/dynamic-table';
import MobileOrderCard from '@/components/Customer/orders/mobile-order-card';
import useCustomer from '@/store/customerStore';
import axiosCustomer from '@/utils/fetch-function-customer';
import CustomerOrderTracking from '@/components/Customer/orders/order-tracking';
import Papa from 'papaparse';
import CustomerOrdersFilter from '@/components/Customer/orders/order-filter';
import { Download } from 'lucide-react';

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
  username: string | null;
  deliveryAddress: DeliveryAddress;
  cartItems: CartItem[];
}

interface FilterState {
  searchTerm: string;
  orderStatus: string;
  paymentStatus: string;
  startDate: string;
  endDate: string;
}

const exportDetailedOrdersToCSV = (orders: Order[]) => {
  try {
    if (!orders || orders.length === 0) {
      alert('No orders available to export');
      return;
    }

    const detailedData = orders.flatMap(order =>
      order.cartItems.map(item => ({
        'Order ID': order.cartId,
        'Order Date': order.orderDate,
        'Customer Name': order.customerName,
        'Item Code': item.itemCode,
        'Item Name': item.itemName,
        'Quantity': item.quantity,
        'Unit Price': item.price,
        'Discount': item.discount,
        'Item Amount': item.amount,
        'Currency': order.ccy,
        'Total Order Amount': order.totalAmount,
        'Order Status': order.orderStatus,
        'Payment Status': order.paymentStatus,
        'Payment Method': order.paymentMethod || 'N/A',
        'Delivery Option': order.deliveryOption || 'N/A',
        'Street': order.deliveryAddress?.street || 'N/A',
        'City': order.deliveryAddress?.city || 'N/A',
        'State': order.deliveryAddress?.state || 'N/A',
        'Country': order.deliveryAddress?.country || 'N/A'
      }))
    );

    const csv = Papa.unparse(detailedData, {
      header: true,
      delimiter: ','
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Export failed:', error);
    alert('Failed to export orders. Please try again.');
  }
};

export default function OrderHistory(): React.ReactElement {
  const { customer } = useCustomer()
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    orderStatus: 'all',
    paymentStatus: 'all',
    startDate: '',
    endDate: ''
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['customer-recent-orders', filters],
    queryFn: () => {
      const params: any = {
        pageNumber: 1,
        pageSize: 50
      };

      if (filters.searchTerm) {
        params.searchTerm = filters.searchTerm;
      }
      if (filters.orderStatus && filters.orderStatus !== 'all') {
        params.orderStatus = filters.orderStatus;
      }
      if (filters.paymentStatus && filters.paymentStatus !== 'all') {
        params.paymentStatus = filters.paymentStatus;
      }
      if (filters.startDate) {
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      return axiosCustomer.request({
        url: '/customer-dashboard/fetch-recent-orders',
        method: 'GET',
        params
      });
    }
  });

  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  const allOrders: Order[] = data?.data?.data || [];

  const filteredOrders = useMemo(() => {
    let filtered = allOrders;

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.cartId.toLowerCase().includes(searchTerm) ||
        order.customerName.toLowerCase().includes(searchTerm) ||
        order.orderDate.toLowerCase().includes(searchTerm) ||
        (order.paymentMethod && order.paymentMethod.toLowerCase().includes(searchTerm)) ||
        order.cartItems.some(item =>
          item.itemName.toLowerCase().includes(searchTerm)
        )
      );
    }

    if (filters.orderStatus && filters.orderStatus !== 'all') {
      filtered = filtered.filter(order =>
        order.orderStatus.toLowerCase() === filters.orderStatus.toLowerCase()
      );
    }

    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      filtered = filtered.filter(order =>
        order.paymentStatus.toLowerCase() === filters.paymentStatus.toLowerCase()
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(order =>
        new Date(order.orderDate) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(order =>
        new Date(order.orderDate) <= endDate
      );
    }

    return filtered;
  }, [allOrders, filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleExport = () => {
    exportDetailedOrdersToCSV(filteredOrders);
  };

  const handleTrackOrder = (order: Order) => {
    setTrackingOrder(order);
    setIsTrackingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Orders Management
              </h1>
              <p className="text-muted-foreground">
                View and manage your orders
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{filteredOrders.length}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </div>
        </div>

        <div className="space-y-6">

          <CustomerOrdersFilter onFilterChange={handleFilterChange} />

          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base lg:text-lg font-semibold text-gray-900">
                  Orders
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleExport} disabled={filteredOrders.length === 0}>
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-red-500">Error loading orders</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <>
                  <div className="block lg:hidden space-y-4">
                    {filteredOrders.map((order) => (
                      <MobileOrderCard
                        key={order.cartId}
                        order={order}
                        onTrackOrder={handleTrackOrder}
                      />
                    ))}
                  </div>

                  <div className="hidden lg:block">
                    <DynamicTable
                      data={filteredOrders}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {trackingOrder && (
        <CustomerOrderTracking
          order={trackingOrder}
          isOpen={isTrackingModalOpen}
          onClose={() => {
            setIsTrackingModalOpen(false);
            setTrackingOrder(null);
          }}
        />
      )}
    </div>
  );
}