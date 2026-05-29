// import { Order, OrderItem } from "@/app/(admin)/admin/orders/page";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";


// interface OrderDetailsProps {
//   order: Order;
// }

// const OrderDetails = ({ order }: OrderDetailsProps) => {
//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "completed":
//       case "delivered":
//         return "bg-success/10 text-success hover:bg-success/20";
//       case "pending":
//       case "processing":
//         return "bg-warning/10 text-warning hover:bg-warning/20";
//       case "cancelled":
//       case "failed":
//         return "bg-destructive/10 text-destructive hover:bg-destructive/20";
//       default:
//         return "bg-muted/50 text-muted-foreground hover:bg-muted";
//     }
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 2
//     }).format(amount);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit"
//     });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Order Header */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg">Order Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Order Number</span>
//               <span className="font-mono font-medium">{order.orderNo}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Reference Number</span>
//               <span className="font-mono">{order.refNo}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Status</span>
//               <Badge className={`${getStatusColor(order.status)} border-0`}>
//                 {order.status}
//               </Badge>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Category</span>
//               <Badge variant="outline">{order.category}</Badge>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Date Created</span>
//               <span className="text-sm">{formatDate(order.dateCreated)}</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg">Customer & Payment</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Customer Name</span>
//               <span className="font-medium">{order.customerName}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Payment Method</span>
//               <span className="capitalize">{order.paymentMethod}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Code</span>
//               <span className="font-mono">{order.code3}</span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Order Items */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg">Order Items</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {order.orderItemInfos && order.orderItemInfos.length > 0 ? (
//               order.orderItemInfos.map((item: OrderItem, index: number) => (
//                 <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
//                   {item.itemLogo && (
//                     <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
//                       <img 
//                         src={item.itemLogo} 
//                         alt={item.itemName}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <h4 className="font-medium text-foreground truncate">{item.itemName}</h4>
//                     <p className="text-sm text-muted-foreground">Code: {item.itemCode}</p>
//                   </div>
//                   <div className="text-right space-y-1">
//                     <div className="flex items-center gap-4 text-sm">
//                       <span className="text-muted-foreground">Qty: {item.qty}</span>
//                       <span className="text-muted-foreground">Unit: {formatCurrency(item.unitPrice)}</span>
//                     </div>
//                     <div className="font-semibold">{formatCurrency(item.amount)}</div>
//                     {item.tax > 0 && (
//                       <div className="text-xs text-muted-foreground">Tax: {formatCurrency(item.tax)}</div>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8 text-muted-foreground">
//                 No items found for this order
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Order Summary */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg">Order Summary</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Subtotal</span>
//               <span>{formatCurrency(order.subTotal)}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Tax</span>
//               <span>{formatCurrency(order.tax)}</span>
//             </div>
//             <Separator />
//             <div className="flex justify-between items-center text-lg font-semibold">
//               <span>Total</span>
//               <span>{formatCurrency(order.total)}</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default OrderDetails;


'use client'
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { MapPin, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { RoutingIcon, StarIcon } from '@/components/icons/icons';

export interface CartItem {
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

export interface DeliveryAddress {
    id: number;
    street: string;
    landmark: string | null;
    postCode: string | null;
    city: string | null;
    state: string;
    country: string | null;
    addressType: string;
}

export interface OrderDetail {
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
    transactionFee: number;
    hasRating?: boolean;
    ratingCount?: number;
    pickupId?: string | null;
}

export interface OrderDetailsModalProps {
    order: OrderDetail | null;
    open: boolean;
    onClose: () => void;
    onTrackOrder?: (order: OrderDetail) => void;
    onRateOrder?: (order: OrderDetail) => void;
    onDownloadReceipt?: (order: OrderDetail) => void;
}

const getDisplayValue = (value: any): string =>
    value === null || value === undefined || value === '' ? 'N/A' : value.toString();

const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
        case 'paid': case 'successful': case 'success': case 'delivered': case 'completed':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'pending': case 'partially completed': case 'processing':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'shipped': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'cancelled': case 'failed': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    order, open, onClose, onTrackOrder, onRateOrder, onDownloadReceipt,
}) => {
    if (!order) return null;

    const subtotal = order.cartItems?.reduce((s, i) => s + i.amount, 0) ?? 0;
    const ccy = order.ccy || '₦';
    const canRate = order.orderStatus?.toLowerCase() === 'completed';

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl gap-0 border-0 shadow-xl bg-[#F5F5F5]"
                style={{
                    scrollbarWidth: 'none',
                    scrollbarColor: 'transparent',
                }}
            >
                <DialogTitle className="sr-only">Order Details</DialogTitle>

                <div className="px-2">
                    <h2 className="text-md font-bold text-dark-gray">Order Details</h2>
                </div>

                <div className="px-2 pb-6 pt-4 flex flex-col lg:flex-row gap-5">

                    <div className="flex-1 space-y-4">

                        <div className="bg-white rounded-2xl p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                                <div>
                                    <p className="text-sm font-semibold text-dark-gray">{order.cartId}</p>
                                    <p className="text-xs text-medium-gray">{order.orderDate}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {onTrackOrder && (
                                        <Button size="xs" className='text-xs'
                                            onClick={() => onTrackOrder(order)}>
                                            <RoutingIcon className="w-3.5 h-3.5" />
                                            Track Order
                                        </Button>
                                    )}
                                    {canRate && onRateOrder && (
                                        <Button onClick={() => onRateOrder(order)}
                                            variant='ghost' className='border-2 border-border text-xs'
                                            title="Rate Order" size='xs'>
                                            <StarIcon className='w-2 h-2' />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                                {[
                                    { label: 'Customer', value: order.customerName, accent: false },
                                    { label: 'Payment Method', value: order.paymentMethod, accent: false },
                                    { label: 'Payment Status', value: order.paymentStatus, accent: true },
                                    { label: 'Delivery Type', value: order.deliveryOption, accent: true },
                                    { label: 'Channel', value: order.channel, accent: false },
                                ].map(({ label, value, accent }) => (
                                    <div key={label} className="space-y-0.5">
                                        <p className="text-xs text-medium-gray">{label}</p>
                                        <p className={`text-sm font-medium ${accent ? 'text-green-600' : 'text-dark-gray'}`}>
                                            {getDisplayValue(value).toLowerCase() === 'delivery' ? 'Delivery' : getDisplayValue(value).toLowerCase() === 'pickup' ? 'Pickup' : getDisplayValue(value).toLowerCase() === 'wallet' ? 'Wallet' : getDisplayValue(value).toLowerCase() === 'rexpay' ? 'Rexpay' : getDisplayValue(value).toLowerCase() === 'web' ? 'Web' : getDisplayValue(value).toLowerCase() === 'mobile' ? 'Mobile' : value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 space-y-3 overflow-hidden">
                            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                                <p className="text-sm font-semibold text-dark-gray">
                                    Order Items ({order.cartItems?.length ?? 0})
                                </p>
                                <Badge className={`text-xs px-2 py-0.5 border font-medium ${getStatusColor(order.paymentStatus)}`}>
                                    {order.orderStatus}
                                </Badge>
                            </div>
                            <div className="">
                                {order.cartItems?.length ? (
                                    order.cartItems.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 mb-2">
                                            <div className="w-12 h-12 relative rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                                <Image src={item.picture || '/images/placeholder-image.png'} alt={item.itemName} fill
                                                    className="object-cover" sizes="48px"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder-image.png'; }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-dark-gray truncate">{item.itemName}</p>
                                                <p className="text-xs text-medium-gray flex flex-wrap gap-x-2">
                                                    <span>Code: {item.itemCode}</span>
                                                    <span className='text-[#9E9E9E]'>•</span>
                                                    <span>Qty: {item.quantity}</span>
                                                    {item.discount > 0 && <><span className='text-[#9E9E9E]'>•</span><span className="text-green-600">Discount: {item.discount}%</span></>}
                                                    {item.vat > 0 && <><span className='text-[#9E9E9E]'>•</span><span>VAT: {formatPrice(item.vat, ccy as CurrencyCode)}</span></>}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-dark-gray shrink-0">{formatPrice(item.amount, ccy as CurrencyCode)}</p>
                                                {item.discount > 0 && (
                                                    <p className="text-xs text-medium-gray line-through">
                                                        {formatPrice(item.oldPrice ?? 0, ccy as CurrencyCode)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                        <ShoppingCart className="w-8 h-8 mb-2 opacity-40" />
                                        <p className="text-sm">No items in this order</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-56 shrink-0 space-y-4">
                        <div className="bg-white rounded-2xl p-4 space-y-3">
                            <p className="text-sm font-semibold text-dark-gray">Order Summary</p>
                            {[
                                { label: 'Subtotal', value: subtotal },
                                { label: 'Tax', value: order.taxAmount },
                                // { label: 'Delivery Fee', value: order.deliveryFee },
                                // { label: 'Transaction Fee', value: order.transactionFee },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between text-sm">
                                    <span className="text-xs text-medium-gray">{label}</span>
                                    <span className="text-xs font-medium text-dark-gray">{formatPrice(value ?? 0, ccy as CurrencyCode)}</span>
                                </div>
                            ))}
                            {(order.totalDiscount ?? 0) > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-xs text-medium-gray">Discount</span>
                                    <span className="text-xs font-medium text-green-600">{formatPrice(order.totalDiscount, ccy as CurrencyCode)}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-gray-100 flex justify-between">
                                <span className="text-sm font-semibold text-medium-gray">Total</span>
                                <span className="text-sm font-bold text-dark-gray">{formatPrice(order.totalAmount, ccy as CurrencyCode)}</span>
                            </div>
                        </div>

                        {order.deliveryAddress && (
                            <div className="bg-white rounded-2xl p-4 space-y-3 overflow-hidden">
                                <p className="text-sm font-semibold text-dark-gray">Delivery Information</p>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-3 h-3 text-medium-gray shrink-0 mt-0.5" />
                                    <div className="text-sm font-semibold text-dark-gray">
                                        <p className="text-medium-gray text-xs">{order.deliveryAddress.addressType || 'Address'}</p>
                                        <p>
                                            {order.deliveryAddress.street}
                                            {order.deliveryAddress.landmark ? `, ${order.deliveryAddress.landmark}` : ''}
                                            {order.deliveryAddress.city ? `, ${order.deliveryAddress.city}` : ''}
                                            {order.deliveryAddress.state ? ` ${order.deliveryAddress.state}` : ''}
                                            {order.deliveryAddress.postCode ? ` ${order.deliveryAddress.postCode}` : ''}
                                            {order.deliveryAddress.country ? `, ${order.deliveryAddress.country}` : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailsModal;