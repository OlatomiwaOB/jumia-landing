'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Eye,
  Package,
  Calendar,
  User,
  CreditCard,
  BadgeCheck,
  ShoppingCart,
  Calculator,
  MapPin,
  Truck,
  ShoppingBag,
  Tag,
  StarIcon,
  Download
} from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axiosCustomer from '@/utils/fetch-function-customer';
import useCustomer from '@/store/customerStore'
// import { CustomerOrderTracking } from './order-tracking';

// Type definitions
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
  storeCode: string | null;
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
  taxAmount: number
  hasRating: boolean;
  ratingCount: number;
  pickupId: string | null;
  transactionFee: number;
}

interface RatingPayload {
  productCode: string;
  reviewType: string;
  comment: string;
  rating: number;
  channel: string;
}

interface DynamicTableProps {
  data: Order[];
  itemsPerPage?: number;
  // onTrackOrder: (order: Order) => void;
  // onUpdateTracking: (order: Order) => void;
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
      return <Eye className="w-3 h-3" />;
    case 'processing':
    case 'pending':
      return <Package className="w-3 h-3" />;
    case 'shipped':
      return <Truck className="w-3 h-3" />;
    case 'cancelled':
    case 'failed':
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
  itemsPerPage = 5,
  // onTrackOrder,
  // onUpdateTracking
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRateProductModalOpen, setIsRateProductModalOpen] = useState(false);
  const [isViewRatingModalOpen, setIsViewRatingModalOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const { customer } = useCustomer();

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleRateOrder = (order: Order) => {
    setSelectedOrder(order);
    setRating(0);
    setComment('');
    setIsRateProductModalOpen(true);
  };

  const handleViewRating = (order: Order) => {
    setSelectedOrder(order);
    setIsViewRatingModalOpen(true);
  };

  const handleTrackOrder = (order: Order) => {
    setTrackingOrder(order);
    setIsTrackingModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // const handleReceipt = (order: Order) => {
  //   setSelectedOrder(order);
  //   handleDownloadReceipt();
  // };

  const calculateSubtotal = (order: Order) => {
    return order.cartItems?.reduce((sum, item) => sum + item.amount, 0) || 0;
  };

  const router = useRouter();

  // const calculateTotalTax = (order: Order) => {
  //   return order.cartItems?.reduce((sum, item) => sum + (item.tax || 0), 0) || 0;
  // };

  // const calculateTotal = (order: Order) => {
  //   return calculateSubtotal(order) + calculateTotalTax(order) + (order.deliveryFee || 0);
  // };

  const handleSubmitRating = async () => {
    if (!selectedOrder || rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: RatingPayload = {
        productCode: selectedOrder.cartId,
        reviewType: '',
        comment: comment.trim(),
        rating: rating,
        channel: selectedOrder.channel || 'WEB'
      };

      const response = await axiosCustomer.request({
        method: 'POST',
        url: 'rating/rate-order',
        data: payload
      });

      if (response.data?.code === '000') {
        toast.success('Rating submitted successfully');
        setIsRateProductModalOpen(false);
        if (selectedOrder) {
          selectedOrder.hasRating = true;
          selectedOrder.ratingCount = rating;
        }
      } else {
        toast.error(response.data?.desc || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('An error occurred while submitting your rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = async (order: Order) => {
    try {

      const isDelivery = order?.deliveryOption?.toLowerCase() === 'delivery';

      const receiptPayload = {
        orderNo: order?.cartId,
        entityCode: "FTD",
        customerEmail: customer?.username || "",
        ordDate: order.orderDate,
        storeCode: order?.storeCode || "STO0715",
        delivery: isDelivery,
        pickupId: isDelivery ? undefined : order?.pickupId,
      };

      // console.log('Downloading receipt with payload:', receiptPayload);

      const response = await axiosCustomer.post(
        '/sale-receipt/generate-pdf?download=true',
        receiptPayload,
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${order?.cartId}.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Receipt downloaded successfully');

    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('An error occurred while downloading the receipt');
    }
  };


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
        const firstItem = cartItems[0];
        return (
          <div className="flex items-center gap-3">
            <div className="w-13 h-10 relative rounded-md overflow-hidden">
              <Image
                src={firstItem.picture || `${placeholder.src}`}
                alt={firstItem.itemName}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${placeholder.src}`;
                }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{getDisplayValue(firstItem.itemName)}</p>
              <p className="text-xs text-gray-500">Cart: {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
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
            onClick={() => handleDownloadReceipt(record)}
            title="Download Receipt"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => router.push(`/orders/track/${record.cartId}`)}
            title="Track Order"
          >
            <Truck className="w-4 h-4" />
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
          {record.orderStatus.toLowerCase() === 'completed' && (
            record.hasRating ? (
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={() => handleViewRating(record)}
                title="View Rating"
              >
                <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={() => handleRateOrder(record)}
                title="Rate Order"
              >
                <StarIcon className="w-4 h-4" />
              </Button>
            )
          )}
        </div>
      ),
    },
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

      {/* Pagination */}
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

                {/* <div className="bg-accent/5 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-accent/60" />
                    <p className="text-sm font-medium text-accent/90">Coupon Code</p>
                  </div>
                  {selectedOrder.couponCode ? (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {selectedOrder.couponCode}
                    </Badge>
                  ) : (
                    <p className="text-sm text-accent/70">None</p>
                  )}
                </div> */}
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
                            sizes="64px"
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
                    <Calculator className="h-4 w-4" />
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

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="font-medium">
                        {selectedOrder.ccy || 'NGN'} {selectedOrder.deliveryFee?.toFixed(2) || '0.00'}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transaction Fee:</span>
                      <span className="font-medium">
                        {selectedOrder.ccy || 'NGN'} {selectedOrder.transactionFee?.toFixed(2) || '0.00'}
                      </span>
                    </div>

                    {selectedOrder.totalDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium text-green-600">
                          Saved: {selectedOrder.ccy || 'NGN'} {selectedOrder.totalDiscount?.toFixed(2) || '0.00'}
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
                        <p className="text-sm font-medium">{selectedOrder.deliveryAddress.addressType || 'Primary Address'}</p>
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

      <Dialog open={isViewRatingModalOpen} onOpenChange={setIsViewRatingModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className='flex flex-col'>
            <DialogTitle className="flex items-center gap-2">
              <StarIcon className="h-5 w-5 text-yellow-500" />
              Order Rating
            </DialogTitle>
            <DialogDescription>
              Rating for order: {selectedOrder?.cartId}
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

      <Dialog open={isRateProductModalOpen} onOpenChange={setIsRateProductModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className='flex flex-col'>
            <DialogTitle className="flex items-center gap-2">
              <StarIcon className="h-5 w-5" />
              Rate Order
            </DialogTitle>
            <DialogDescription>
              Rate your experience with order: {selectedOrder?.cartId}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div>
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <StarIcon
                      className={`h-10 w-10 transition-colors ${star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                        }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500">
                {rating === 0 ? 'Select a rating' : `${rating} star${rating > 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Add a comment (optional)
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this order..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRateProductModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRating}
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DynamicTable;