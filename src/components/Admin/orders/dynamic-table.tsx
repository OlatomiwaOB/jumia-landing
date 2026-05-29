'use client'
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Eye, Truck, Package, MapPin, Receipt, ShoppingCart, BadgeCheck, CreditCard, User, Calendar, ShoppingBag, StarIcon, Clock, } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from 'next/image';
import placeholder from "@/components/images/placeholder-product.webp"
import useUser from '@/store/userStore';
import axiosInstance from '@/utils/fetch-function';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

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
  discountAmount?: number;
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

export interface Order {
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
  taxAmount: number;
  trackingNo: string;
  hasRating: boolean;
  ratingCount: number;
}

interface DynamicTableProps {
  data: Order[];
  itemsPerPage?: number;
  onTrackOrder: (order: Order) => void;
  onUpdateTracking: (order: Order) => void;
  searchTerm: string;
}

interface PickupLocation {
  id: number;
  name: string;
  location: string;
  distance: number;
  timeframe: string;
  contact: string;
  status: string;
}

interface DeliveryRequest {
  id: number;
  orderRefNo: string;
  storeCode: string;
  storeName: string;
  pickupLocation: string;
  deliveryLocation: string;
  packageSize: string;
  weightKg: number;
  length: number;
  width: number;
  height: number;
  deliveredBy: string;
  deliverySpeed: string;
  createdDate: string;
  deliveryDate: string;
  status: string;
  currentLocation: string;
}

interface PickupLocationsResponse {
  responseCode: string;
  responseMessage: string;
  pickupLocations: PickupLocation[];
}

interface DeliveryRequestResponse {
  responseCode: string;
  responseMessage: string;
  deliveryRequests: DeliveryRequest[];
}

// Helper functions
const getStatusColor = (status: string): string => {
  if (!status) return 'bg-gray-500 text-white';

  switch (status.toLowerCase()) {
    case 'delivered':
    case 'completed':
    case 'paid':
    case 'success':
      return 'bg-green-500 text-white';
    case 'processing':
    case 'pending':
      return 'bg-blue-500 text-white';
    case 'shipped':
      return 'bg-orange-500 text-white';
    case 'cancelled':
    case 'failed':
    case 'draft':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getStatusIcon = (status: string): React.ReactNode => {
  if (!status) return null;

  switch (status.toLowerCase()) {
    case 'delivered':
    case 'completed':
    case 'paid':
      return <Eye className="w-3 h-3" />;
    case 'processing':
    case 'pending':
      return <Package className="w-3 h-3" />;
    case 'shipped':
      return <Truck className="w-3 h-3" />;
    case 'cancelled':
    case 'failed':
    case 'draft':
      return <Package className="w-3 h-3" />;
    default:
      return null;
  }
};

const getDisplayValue = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  return value.toString();
};

const DynamicTable: React.FC<DynamicTableProps> = ({
  data,
  itemsPerPage = 15,
  onTrackOrder,
  onUpdateTracking,
  searchTerm
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewRatingModalOpen, setIsViewRatingModalOpen] = useState(false);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  const [isPickupRequestModalOpen, setIsPickupRequestModalOpen] = useState(false);
  const [isLoadingPickupData, setIsLoadingPickupData] = useState(false);
  const [isLoadingDeliveryRequest, setIsLoadingDeliveryRequest] = useState(false);
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [existingDeliveryRequest, setExistingDeliveryRequest] = useState<DeliveryRequest | null>(null);
  const { user } = useUser();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const [pickupRequestForm, setPickupRequestForm] = useState({
    pickupLocation: '',
    packageSize: 'SMALL',
    weightKg: 0,
    length: 0,
    width: 0,
    height: 0,
  });


  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewRating = (order: Order) => {
    setSelectedOrder(order);
    setIsViewRatingModalOpen(true);
  };

  const handleRequestPickup = async (order: Order) => {
    setSelectedOrder(order);
    setIsPickupRequestModalOpen(true);
    await fetchExistingDeliveryRequest(order.cartId);
    await fetchPickupLocations();
  };

  const fetchExistingDeliveryRequest = async (cartId: string) => {
    try {
      setIsLoadingDeliveryRequest(true);
      const response = await axiosInstance.get<DeliveryRequestResponse>(
        `/delivery-request/fetch`,
        {
          params: {
            orderRef: cartId,
            storeCode: user?.storeCode,
          }
        }
      );

      if (response.data.responseCode === '000' &&
        response.data.deliveryRequests &&
        response.data.deliveryRequests.length > 0) {
        const request = response.data.deliveryRequests[0];
        setExistingDeliveryRequest(request);

        setPickupRequestForm({
          pickupLocation: request.pickupLocation || '',
          packageSize: request.packageSize || 'SMALL',
          weightKg: request.weightKg || 0,
          length: request.length || 0,
          width: request.width || 0,
          height: request.height || 0,
        });
      } else {
        setExistingDeliveryRequest(null);
        setPickupRequestForm({
          pickupLocation: '',
          packageSize: 'SMALL',
          weightKg: 0,
          length: 0,
          width: 0,
          height: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching delivery request:', error);
      setExistingDeliveryRequest(null);
      toast.error('Failed to load existing delivery request');
    } finally {
      setIsLoadingDeliveryRequest(false);
    }
  };

  const fetchPickupLocations = async () => {
    try {
      setIsLoadingPickupData(true);
      const response = await axiosInstance.get<PickupLocationsResponse>(
        '/ecommerce/pickup-location/all'
      );

      if (response.data.responseCode === '000' && response.data.pickupLocations) {
        const activeLocations = response.data.pickupLocations.filter(
          location => location?.status?.toUpperCase() === "ACTIVE"
        );
        setPickupLocations(activeLocations);
      }
    } catch (error) {
      console.error('Error fetching pickup locations:', error);
      toast.error('Failed to load pickup locations');
    } finally {
      setIsLoadingPickupData(false);
    }
  };

  const handleSavePickupRequest = async () => {
    if (!selectedOrder) return;

    if (!pickupRequestForm.pickupLocation) {
      toast.error('Please select a pickup location');
      return;
    }

    if (pickupRequestForm.weightKg <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }

    try {
      const requestData = {
        id: existingDeliveryRequest?.id || 0,
        orderRefNo: selectedOrder.cartId,
        storeCode: user?.storeCode || '',
        storeName: user?.businessName || '',
        pickupLocation: pickupRequestForm.pickupLocation,
        deliveryLocation: `${selectedOrder.deliveryAddress?.street || ''}, ${selectedOrder.deliveryAddress?.city || ''}, ${selectedOrder.deliveryAddress?.state || ''}`,
        packageSize: pickupRequestForm.packageSize,
        weightKg: pickupRequestForm.weightKg,
        length: pickupRequestForm.length,
        width: pickupRequestForm.width,
        height: pickupRequestForm.height,
        deliveredBy: existingDeliveryRequest?.deliveredBy || '',
        deliverySpeed: existingDeliveryRequest?.deliverySpeed || '',
        createdDate: existingDeliveryRequest?.createdDate || new Date().toISOString(),
        deliveryDate: existingDeliveryRequest?.deliveryDate || '',
        status: existingDeliveryRequest?.status || 'PENDING',
        currentLocation: user?.address || '',
      };

      const response = await axiosInstance.post(
        '/delivery-request/save',
        requestData
      );

      if (response.data?.code === '000') {
        toast.success('Delivery request saved successfully!');
        setIsPickupRequestModalOpen(false);
        await fetchExistingDeliveryRequest(selectedOrder.cartId);
      } else {
        toast.error(response.data?.desc || 'Failed to save delivery request');
      }
    } catch (error: any) {
      console.error('Error saving delivery request:', error);
      toast.error(error?.response?.data?.message || 'Error saving delivery request');
    }
  };

  const calculateSubtotal = (order: Order) => {
    return order.cartItems?.reduce((sum, item) => sum + item.amount, 0) || 0;
  };

  // const calculateTotalTax = (order: Order) => {
  //   return order.cartItems?.reduce((sum, item) => sum + (item.tax || 0), 0) || 0;
  // };

  const calculateTotalDiscount = (order: Order) => {
    return order.cartItems?.reduce((sum, item) => sum + (item.discountAmount || 0), 0) || 0;
  };

  // const calculateTotal = (order: Order) => {
  //   return calculateSubtotal(order) + calculateTotalTax(order) + (order.deliveryFee || 0);
  // };

  type ColumnType<T> = {
    title: string;
    dataIndex: keyof T | string;
    key: string;
    width?: number;
    render?: (value: any, record: T) => React.ReactNode;
  };

  const columns: ColumnType<Order>[] = [
    {
      title: 'Product',
      dataIndex: 'cartItems',
      key: 'product',
      width: 200,
      render: (items, record) => {
        const cartItems = items as CartItem[];
        const firstItem = cartItems && cartItems.length > 0 ? cartItems[0] : null;

        return (
          <div className="flex items-center gap-3">
            <div className="w-13 h-10 relative rounded-md overflow-hidden">
              {firstItem ? (
                <Image
                  src={firstItem.picture || placeholder.src}
                  alt={firstItem.itemName || 'Product image'}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = placeholder.src;
                  }}
                />
              ) : (
                <Image
                  src={placeholder.src}
                  alt="No product image"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {firstItem ? getDisplayValue(firstItem.itemName) : 'No items in cart'}
              </p>
              <p className="text-xs text-gray-500">
                {cartItems?.length || 0} item{(cartItems?.length || 0) !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Order ID & Date',
      dataIndex: 'cartId',
      key: 'id',
      width: 180,
      render: (text, record) => (
        <div>
          <p className="text-sm font-semibold text-gray-900">{getDisplayValue(text)}</p>
          <p className="text-xs text-gray-500">{getDisplayValue(record.orderDate)}</p>
        </div>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customer',
      width: 150,
      render: (text) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {typeof text === 'string' && text ? text.split(' ').map(n => n[0]).join('') : 'GC'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900">{getDisplayValue(text)}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'amount',
      width: 100,
      render: (text, record) => (
        <span className="text-sm font-semibold text-green-600">
          {record.ccy || 'N/A'} {(typeof text === 'number' ? text.toFixed(2) : '0.00')}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'orderStatus',
      key: 'status',
      width: 120,
      render: (text) => (
        <Badge className={`${getStatusColor(String(text))} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
          {getStatusIcon(String(text))}
          {getDisplayValue(text)}
        </Badge>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'payment',
      width: 120,
      render: (text) => (
        <Badge className={`${getStatusColor(String(text))} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
          {getStatusIcon(String(text))}
          {getDisplayValue(text)}
        </Badge>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => onTrackOrder(record)}
            title="Track Order"
          >
            <Truck className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => onUpdateTracking(record)}
            title="Update Tracking"
          >
            <Package className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => handleViewDetails(record)}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => handleRequestPickup(record)}
            title="Request Pickup"
          >
            <Clock className="w-4 h-4" />
          </Button>

          {record.orderStatus.toLowerCase() === 'completed' && record.hasRating && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={() => handleViewRating(record)}
              title="View Rating"
            >
              <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const packageSizeOptions = [
    { value: 'SMALL', label: 'Small' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LARGE', label: 'Large' },
  ];

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left p-3 font-bold text-sm text-gray-700"
                  style={{ width: column.width ? `${column.width}px` : 'auto' }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={item.cartId}
                className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="p-3 text-sm">
                    {column.render
                      ? column.render(item[column.dataIndex as keyof Order], item)
                      : getDisplayValue(item[column.dataIndex as keyof Order])
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
        <p className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Orders
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-xs"
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className="w-8 h-8 p-0 text-xs"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-xs"
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={isViewRatingModalOpen} onOpenChange={setIsViewRatingModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className='flex flex-col'>
            <DialogTitle className="flex items-center gap-2">
              <StarIcon className="h-5 w-5 text-yellow-500" />
              Order Rating - {selectedOrder?.cartId || 'N/A'}
            </DialogTitle>
            <DialogDescription className='truncate'>
              See how {selectedOrder?.customerName} rated this order.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-10 w-10 ${star <= Math.floor(selectedOrder?.ratingCount || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {selectedOrder?.ratingCount?.toFixed(1) || '0.0'}
                </p>
                <p className="text-sm text-gray-500">
                  out of 5 stars
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsViewRatingModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className='flex flex-col'>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details - {selectedOrder?.cartId || 'N/A'}
            </DialogTitle>
            <DialogDescription>
              Detailed information about the selected order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-accent/5 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-accent/60" />
                    <p className="text-sm font-medium text-accent/90">Order Date</p>
                  </div>
                  <p className="text-sm text-accent/70">{getDisplayValue(selectedOrder.orderDate)}</p>
                </div>

                <div className="bg-accent/5 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-accent/60" />
                    <p className="text-sm font-medium text-accent/90">Customer</p>
                  </div>
                  <p className="text-sm text-accent/70">{getDisplayValue(selectedOrder.customerName)}</p>
                </div>

                <div className="bg-accent/5 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-accent/60" />
                    <p className="text-sm font-medium text-accent/90">Payment Method</p>
                  </div>
                  <p className="text-sm text-accent/70">{getDisplayValue(selectedOrder.paymentMethod)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-accent/5 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4 text-accent/60" />
                    <p className="text-sm font-medium text-accent/90">Delivery Option</p>
                  </div>
                  <p className="text-sm text-accent/70 capitalize">{getDisplayValue(selectedOrder.deliveryOption)}</p>
                </div>

                <div className="bg-accent/5 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="h-4 w-4 text-accent/60" />
                    <p className="text-sm font-medium text-accent/90">Channel</p>
                  </div>
                  <p className="text-sm text-accent/70">{getDisplayValue(selectedOrder.channel)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4" />
                    Order Status
                  </p>
                  <Badge className={`${getStatusColor(selectedOrder.orderStatus)} text-xs px-3 py-1.5 flex items-center gap-1 w-fit`}>
                    {getStatusIcon(selectedOrder.orderStatus)}
                    {getDisplayValue(selectedOrder.orderStatus)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <span className="text-muted-foreground">₦</span>
                    Payment Status
                  </p>
                  <Badge className={`${getStatusColor(selectedOrder.paymentStatus)} text-xs px-3 py-1.5 flex items-center gap-1 w-fit`}>
                    {getStatusIcon(selectedOrder.paymentStatus)}
                    {getDisplayValue(selectedOrder.paymentStatus)}
                  </Badge>
                </div>
              </div>

              <div className="border rounded-lg">
                <div className="p-4 border-b bg-gray-50">
                  <h4 className="font-medium flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Order Items ({selectedOrder.cartItems?.length || 0})
                  </h4>
                </div>
                <div className="p-4 space-y-3">
                  {selectedOrder.cartItems && selectedOrder.cartItems.length > 0 ? (
                    selectedOrder.cartItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden border">
                          <Image
                            src={item.picture || placeholder.src}
                            alt={item.itemName}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = placeholder.src;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{getDisplayValue(item.itemName)}</p>
                          <p className="text-xs text-gray-500 truncate">
                            Code: {getDisplayValue(item.itemCode)}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                            <span>Qty: {getDisplayValue(item.quantity)}</span>
                            <span>•</span>
                            <span>{selectedOrder.ccy || 'NGN'} {item.price?.toFixed(2) || '0.00'}</span>
                            {item.discount > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-green-600">Discount: {item.discount}%</span>
                              </>
                            )}
                            {item.vat > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-gray-600">VAT: {selectedOrder.ccy || 'NGN'} {item.vat.toFixed(2)}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {selectedOrder.ccy || 'NGN'} {item.amount?.toFixed(2) || '0.00'}
                          </p>
                          {item.discount > 0 && (
                            <p className="text-xs text-gray-500 line-through">
                              {selectedOrder.ccy} {item.oldPrice?.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No items in this order</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border rounded-lg">
                <div className="p-4 border-b bg-gray-50">
                  <h4 className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Order Summary
                  </h4>
                </div>
                <div className="p-4">
                  <div className="max-w-md ml-auto space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        {selectedOrder.ccy || 'NGN'} {calculateSubtotal(selectedOrder).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">
                        {selectedOrder.ccy || 'NGN'} {selectedOrder.taxAmount?.toFixed(2) || '0.00'}
                      </span>
                    </div>

                    {/* <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="font-medium">
                        {selectedOrder.ccy || 'NGN'} {selectedOrder.deliveryFee?.toFixed(2) || '0.00'}
                      </span>
                    </div> */}

                    {selectedOrder.totalDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium text-green-600">
                          Saved: {selectedOrder.ccy || 'NGN'} {calculateTotalDiscount(selectedOrder).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">
                          {selectedOrder.ccy || 'NGN'} {selectedOrder.totalAmount?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              {selectedOrder.deliveryAddress && (
                <div className="border rounded-lg">
                  <div className="p-4 border-b bg-gray-50">
                    <h4 className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Information
                    </h4>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{selectedOrder.deliveryAddress.addressType}</p>
                        <p className="text-sm text-gray-600">
                          {getDisplayValue(selectedOrder.deliveryAddress.street)}
                          {selectedOrder.deliveryAddress.landmark && (
                            <><br />Landmark: {selectedOrder.deliveryAddress.landmark}</>
                          )}
                          <br />
                          {selectedOrder.deliveryAddress.city && `${selectedOrder.deliveryAddress.city}, `}
                          {getDisplayValue(selectedOrder.deliveryAddress.state)}
                          {selectedOrder.deliveryAddress.postCode && ` ${selectedOrder.deliveryAddress.postCode}`}
                          <br />
                          {getDisplayValue(selectedOrder.deliveryAddress.country)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPickupRequestModalOpen} onOpenChange={setIsPickupRequestModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className='flex flex-col'>
            <DialogTitle className="flex items-center gap-2">
              {existingDeliveryRequest ? 'View Pickup Request' : 'Request Pickup'} - {selectedOrder?.cartId || 'N/A'}
            </DialogTitle>
            <DialogDescription>
              {existingDeliveryRequest
                ? 'View delivery request details'
                : 'Request pickup for this order'}
            </DialogDescription>
          </DialogHeader>

          {isLoadingDeliveryRequest ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-3 text-gray-600">Loading delivery request information...</p>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              {existingDeliveryRequest && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-700">Status:</span>
                      <Badge className={`ml-2 ${existingDeliveryRequest.status === 'PENDING' ? 'bg-yellow-500' :
                        existingDeliveryRequest.status === 'PICKED' ? 'bg-blue-500' :
                          existingDeliveryRequest.status === 'IN_TRANSIT' ? 'bg-orange-500' :
                            existingDeliveryRequest.status === 'DELIVERED' ? 'bg-green-500' :
                              'bg-gray-500'
                        } text-white text-xs`}>
                        {existingDeliveryRequest.status}
                      </Badge>
                    </div>
                    {/* <div>
                      <span className="text-blue-600">Delivery Speed:</span>
                      <p className="font-medium">{existingDeliveryRequest.deliverySpeed}</p>
                    </div> */}
                    {existingDeliveryRequest.createdDate && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Created:</span>
                        <p className="font-medium">{existingDeliveryRequest.createdDate}</p>
                      </div>
                    )}
                    {existingDeliveryRequest.deliveredBy && (
                      <div>
                        <span className="text-blue-600">Delivered By:</span>
                        <p className="font-medium">{existingDeliveryRequest.deliveredBy}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="pickupLocation">Pickup Location *</Label>
                <Select
                  value={pickupRequestForm.pickupLocation}
                  onValueChange={(value) =>
                    setPickupRequestForm({ ...pickupRequestForm, pickupLocation: value })
                  }
                  disabled={isLoadingPickupData}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      isLoadingPickupData ? "Loading locations..." : "Select pickup location"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {pickupLocations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name} - {location.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {pickupLocations.length === 0 && !isLoadingPickupData && (
                  <p className="text-sm text-red-500">No active pickup locations available</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="packageSize">Package Size *</Label>
                <Select
                  value={pickupRequestForm.packageSize}
                  onValueChange={(value) =>
                    setPickupRequestForm({ ...pickupRequestForm, packageSize: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select package size" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageSizeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weightKg">Weight (Kg) *</Label>
                <Input
                  id="weightKg"
                  type="number"
                  min="0"
                  step="0.1"
                  value={pickupRequestForm.weightKg}
                  onChange={(e) =>
                    setPickupRequestForm({
                      ...pickupRequestForm,
                      weightKg: parseFloat(e.target.value)
                    })
                  }
                  placeholder="Enter weight in kilograms"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input
                    id="length"
                    type="number"
                    min="0"
                    value={pickupRequestForm.length}
                    onChange={(e) =>
                      setPickupRequestForm({
                        ...pickupRequestForm,
                        length: parseFloat(e.target.value)
                      })
                    }
                    placeholder="Length"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input
                    id="width"
                    type="number"
                    min="0"
                    value={pickupRequestForm.width}
                    onChange={(e) =>
                      setPickupRequestForm({
                        ...pickupRequestForm,
                        width: parseFloat(e.target.value)
                      })
                    }
                    placeholder="Width"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    min="0"
                    value={pickupRequestForm.height}
                    onChange={(e) =>
                      setPickupRequestForm({
                        ...pickupRequestForm,
                        height: parseFloat(e.target.value)
                      })
                    }
                    placeholder="Height"
                  />
                </div>
              </div>

              {/* {selectedOrder && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Delivery Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Order ID:</span> {selectedOrder.cartId}</p>
                    <p><span className="text-gray-600">Customer:</span> {selectedOrder.customerName}</p>
                    <p><span className="text-gray-600">Delivery Address:</span>
                      {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city}
                    </p>
                    <p><span className="text-gray-600">Store:</span> {user?.businessName || user?.storeCode}</p>
                  </div>
                </div>
              )} */}
            </div>
          )}

          <DialogFooter>
            {!existingDeliveryRequest && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsPickupRequestModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePickupRequest}
                  disabled={!pickupRequestForm.pickupLocation || pickupRequestForm.weightKg <= 0}
                >
                  {existingDeliveryRequest ? 'Update Request' : 'Save Request'}
                </Button>
              </>
            )}
          </DialogFooter>

        </DialogContent>
      </Dialog>

    </>
  );
};

export default DynamicTable;