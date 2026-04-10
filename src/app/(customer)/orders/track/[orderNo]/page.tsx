'use client'
import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Store, Truck, ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import CustomerOrderTrackingModal from '@/components/Customer/orders/order-tracking';

interface TrackingItem {
  id: number;
  orderNo: string;
  trackingNo: string;
  storeCode: string;
  storeName: string;
  entityCode: string;
  status: string;
  activityDate: string;
  activityType: string;
  comment: string | null;
  docLink: string;
  deliveryOption: string | null;
}

interface OrderTrackResponse {
  responseCode: string;
  responseMessage: string;
  orderTrackInfos: TrackingItem[];
}

export default function OrderTrackingListPage() {
  const params = useParams();
  const orderNo = params.orderNo as string;

  const [selectedTracking, setSelectedTracking] = React.useState<TrackingItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data, isLoading, error, refetch } = useQuery<OrderTrackResponse>({
    queryKey: ['order-track-list', orderNo],
    queryFn: () => axiosCustomer.request({
      method: 'GET',
      url: 'ecommerce/sale-order-tracklist',
      params: { orderNo }
    }),
    select: (response) => response.data,
    enabled: !!orderNo
  });

  const handleOpenTracking = (trackingItem: TrackingItem) => {
    setSelectedTracking(trackingItem);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'ORDER_REVIEW':
      case 'PACKING':
        return <Package className="w-5 h-5" />;
      case 'SHIPPED':
      case 'IN_TRANSIT':
        return <Truck className="w-5 h-5" />;
      default:
        return <Store className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-lg font-medium">Failed to load tracking information</p>
          <p className="mt-2">Please try again later</p>
          <Link href="/orders">
            <Button className="mt-4" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const trackingItems = data?.orderTrackInfos || [];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link href="/orders">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
              <p className="text-gray-600 mt-2">
                Track your order: {orderNo}
              </p>
            </div>
          </div>

          {/* <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Order: {orderNo}</h2>
                  <p className="text-gray-600 mt-1">
                    Track shipments from {trackingItems.length} store{trackingItems.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {trackingItems.length > 1 && (
                  <div className="hidden md:block">
                    <Badge variant="outline" className="px-4 py-2 bg-white">
                      <Truck className="w-4 h-4 mr-2" />
                      Multi-Store Order
                    </Badge>
                  </div>
                )}
                {trackingItems.length === 1 && (
                  <div className="hidden md:block">
                    <Badge variant="outline" className="px-4 py-2 bg-white">
                      <Truck className="w-4 h-4 mr-2" />
                      Single Store Order
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card> */}
          <div className='mt-4'>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        </div>

        {trackingItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tracking information available</h3>
            <p className="text-gray-600 mb-6">Tracking information will appear here once available</p>
            <Link href="/orders">
              <Button>Back to Orders</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trackingItems.map((tracking) => (
              <Card
                key={tracking.id}
                className="overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Store className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className='truncate flex-1'>
                          <CardTitle className="text-lg">{tracking.storeName}</CardTitle>
                          <CardDescription>Store Code: {tracking.storeCode}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(tracking.status)}>
                        {tracking.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    {tracking.trackingNo && (
                      <Badge variant="outline" className="ml-2">
                        #{tracking.trackingNo}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Last update: {tracking.activityDate}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="p-1 bg-gray-100 rounded">
                        {getActivityIcon(tracking.activityType)}
                      </div>
                      <span className="capitalize">
                        {tracking.activityType?.toLowerCase().replace('_', ' ')}
                      </span>
                    </div>

                    {tracking.comment && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{tracking.comment}</p>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-3 border-t">
                  <Button
                    className="w-full"
                    onClick={() => handleOpenTracking(tracking)}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Track Order
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {trackingItems.length > 1 && (
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">Multi-Store Order Tracking</h3>
                    <p className="text-sm text-gray-600">
                      Your order contains items from multiple stores. Each store ships separately,
                      so you can track each shipment independently. Click "Track Order" on any card
                      to view detailed tracking information for that specific store.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {selectedTracking && (
        <CustomerOrderTrackingModal
          trackingNo={selectedTracking.trackingNo}
          orderNo={selectedTracking.orderNo}
          storeName={selectedTracking.storeName}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTracking(null);
          }}
        />
      )}
    </div>
  );
}