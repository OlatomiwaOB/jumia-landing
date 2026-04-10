'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Search, Filter, Truck, Package, CheckCircle, Clock, XCircle, MapPin, ShoppingBag, User, Calendar, CreditCard, Star, Eye, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import placeholder from "@/components/images/placeholder-product.webp";
import { toast } from 'sonner';
import cn from 'classnames';
import { usePermission } from '@/hooks/usePermission';

interface CartItem {
    itemCode: string;
    itemName: string;
    price: number;
    unit: string | null;
    quantity: number;
    discount: number;
    discountAmount?: number;
    amount: number;
    picture: string;
    vat: number;
    oldPrice?: number;
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
    updatedAt: string;
    totalAmount: number;
    totalDiscount: number;
    deliveryOption: string;
    deliveryOptionGroup?: string;
    pickupId: number;
    paymentMethod: string;
    transactionFee: number;
    couponCode: string | null;
    ccy: string;
    subTotal: number;
    deliveryFee: number;
    taxAmount: number;
    geolocation: string | null;
    deviceId: string | null;
    orderStatus: string;
    paymentStatus: string;
    storeCode: string | null;
    customerName: string;
    username: string | null;
    networkChain: string | null;
    publicAddress: string | null;
    tokenSymbol: string | null;
    hasRating: boolean;
    ratingCount: number;
    reviewComment: string;
    deliveryAddress: DeliveryAddress;
    cartItems: CartItem[];
    chain: string | null;
    symbol: string | null;
    txId: string | null;
    walletAddress: string | null;
}

interface OrderSummaryCards {
    responseCode: string;
    responseMessage: string;
    totalOrders: number;
    assignedOrders: number;
    deliveredOrders: number;
    ordersInTransit: number;
    pendingOrders: number;
    cancelledOrders: number;
}

interface OrdersResponse {
    responseCode: string;
    responseMessage: string;
    totalCount: number;
    totalPages: number;
    data: Order[];
}

const getStatusColor = (status: string): string => {
    if (!status) return 'bg-gray-500 text-white';
    const statusLower = status.toLowerCase();
    switch (statusLower) {
        case 'completed':
        case 'delivered':
        case 'paid':
            return 'bg-green-500 text-white';
        case 'processing':
        case 'pending':
            return 'bg-blue-500 text-white';
        case 'intransit':
        case 'shipped':
            return 'bg-orange-500 text-white';
        case 'cancelled':
        case 'failed':
            return 'bg-red-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

const getStatusIcon = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'completed' || statusLower === 'delivered') return <CheckCircle className="w-3 h-3" />;
    if (statusLower === 'processing' || statusLower === 'pending') return <Clock className="w-3 h-3" />;
    if (statusLower === 'intransit' || statusLower === 'shipped') return <Truck className="w-3 h-3" />;
    if (statusLower === 'cancelled') return <XCircle className="w-3 h-3" />;
    return <Package className="w-3 h-3" />;
};

const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return dateString;
};

const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
    return `${currency} ${amount?.toFixed(2) || '0.00'}`;
};

const getInitials = (name: string): string => {
    if (!name || name === 'Anonymous User') return 'GU';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const ImageCollage = ({ items }: { items: CartItem[] }) => {
    const displayItems = items.slice(0, 3);
    const remainingCount = items.length - 3;
    const firstItem = items[0];

    return (
        <div className="flex items-center gap-2">
            <div className="relative w-14 h-14">
                {displayItems.map((item, index) => (
                    <div
                        key={index}
                        className="absolute w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-md bg-white"
                        style={{
                            left: index * 8,
                            top: index * 6,
                            zIndex: 3 - index,
                            transform: `rotate(${index * 6 - 6}deg)`,
                        }}
                    >
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
                ))}
                {remainingCount > 0 && (
                    <div
                        className="absolute w-12 h-12 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-700 shadow-md"
                        style={{
                            left: 16,
                            top: 12,
                            zIndex: 0,
                        }}
                    >
                        +{remainingCount}
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-accent-foreground truncate max-w-[120px]">
                    {firstItem?.itemName || 'No items'}
                </p>
                <p className="text-xs text-accent-foreground/60">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, isPrimary = false }: { title: string; value: number; isPrimary?: boolean }) => (
    <Card className={cn(
        'relative overflow-hidden border-accent/20 shadow-sm transition-all hover:shadow-md',
        isPrimary ? 'bg-accent text-white' : 'bg-white text-accent-foreground'
    )}>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
            <div className={cn(
                "absolute rounded-2xl w-14 h-12 rotate-15 transform origin-center",
                isPrimary ? "bg-white/10" : "bg-accent/5"
            )} />
            <div className={cn(
                "absolute rounded-2xl w-18 h-18 rotate-50 transform origin-center",
                isPrimary ? "bg-white/10" : "bg-accent/5"
            )} />
        </div>
        <CardContent className="p-6 relative z-10">
            <p className={cn(
                "text-sm font-medium mb-2",
                isPrimary ? "text-white/80" : "text-accent-foreground/70"
            )}>
                {title}
            </p>
            <p className={cn(
                "text-3xl font-bold",
                isPrimary ? "text-white" : "text-accent-foreground"
            )}>
                {value.toLocaleString()}
            </p>
        </CardContent>
    </Card>
);

const MobileOrderCard = ({ order, onViewDetails }: { order: Order; onViewDetails: (order: Order) => void }) => {
    const firstItem = order.cartItems?.[0];
    const itemCount = order.cartItems?.length || 0;

    return (
        <div className="bg-white rounded-lg p-4 space-y-3 border border-accent/20">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-accent-foreground">{order.cartId}</p>
                    <p className="text-xs text-accent-foreground/60">{formatDate(order.orderDate)}</p>
                </div>
                <Badge className={`${getStatusColor(order.orderStatus)} text-xs px-2 py-1 flex items-center gap-1`}>
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus}
                </Badge>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                    {firstItem ? (
                        <Image
                            src={firstItem.picture || placeholder.src}
                            alt={firstItem.itemName}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <Image src={placeholder.src} alt="No image" fill className="object-cover" />
                    )}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-accent-foreground">
                        {firstItem ? firstItem.itemName : 'No items'}
                        {itemCount > 1 && ` +${itemCount - 1} more`}
                    </p>
                    <p className="text-xs text-accent-foreground/60">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'} • {formatCurrency(order.totalAmount, order.ccy)}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-accent/10">
                <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-accent text-white text-xs">
                            {getInitials(order.customerName)}
                        </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-accent-foreground/70">{order.customerName}</p>
                </div>
                <Button variant="ghost" size="sm" className="p-1 hover:bg-accent/10" onClick={() => onViewDetails(order)}>
                    <Eye className="w-4 h-4 text-accent-foreground" />
                </Button>
            </div>
        </div>
    );
};

const OrderDetailsModal = ({ order, open, onOpenChange }: { order: Order | null; open: boolean; onOpenChange: (open: boolean) => void }) => {
    if (!order) return null;

    const calculateSubtotal = () => {
        return order.cartItems?.reduce((sum, item) => sum + item.amount, 0) || 0;
    };

    const calculateTotalDiscount = () => {
        return order.cartItems?.reduce((sum, item) => sum + (item.discountAmount || 0), 0) || 0;
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-accent/10 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/10">
                            <Package className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-accent-foreground">Order Details</h2>
                            <p className="text-xs text-accent-foreground/60">{order.cartId}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        className="hover:bg-accent/10 h-8 w-8 p-0 rounded-full"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="overflow-y-auto p-6 space-y-6 max-h-[calc(90vh-80px)]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-accent/5 rounded-xl p-3 text-center border border-accent/10">
                            <p className="text-xs text-accent-foreground/60">Order Status</p>
                            <Badge className={`${getStatusColor(order.orderStatus)} mt-1 text-xs px-2 py-1`}>
                                {getStatusIcon(order.orderStatus)}
                                {order.orderStatus}
                            </Badge>
                        </div>
                        <div className="bg-accent/5 rounded-xl p-3 text-center border border-accent/10">
                            <p className="text-xs text-accent-foreground/60">Payment Status</p>
                            <Badge className={`${getStatusColor(order.paymentStatus)} mt-1 text-xs px-2 py-1`}>
                                {getStatusIcon(order.paymentStatus)}
                                {order.paymentStatus}
                            </Badge>
                        </div>
                        <div className="bg-accent/5 rounded-xl p-3 text-center border border-accent/10">
                            <p className="text-xs text-accent-foreground/60">Delivery</p>
                            <p className="text-sm font-semibold text-accent-foreground mt-1">{order.deliveryOption}</p>
                        </div>
                        <div className="bg-accent/5 rounded-xl p-3 text-center border border-accent/10">
                            <p className="text-xs text-accent-foreground/60">Payment Method</p>
                            <p className="text-sm font-semibold text-accent-foreground mt-1">{order.paymentMethod}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">
                            <div className="flex items-center gap-2 mb-3">
                                <User className="w-4 h-4 text-accent" />
                                <h3 className="text-sm font-semibold text-accent-foreground">Customer Information</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-accent-foreground/60">Name:</span>
                                    <span className="font-medium text-accent-foreground">{order.customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-accent-foreground/60">Channel:</span>
                                    <span className="font-medium text-accent-foreground">{order.channel || 'Web'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="w-4 h-4 text-accent" />
                                <h3 className="text-sm font-semibold text-accent-foreground">Order Timeline</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-accent-foreground/60">Order Date:</span>
                                    <span className="font-medium text-accent-foreground">{formatDate(order.orderDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-accent-foreground/60">Last Update:</span>
                                    <span className="font-medium text-accent-foreground">{formatDate(order.updatedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {order.deliveryAddress && (
                        <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="w-4 h-4 text-accent" />
                                <h3 className="text-sm font-semibold text-accent-foreground">Delivery Address</h3>
                            </div>
                            <div className="text-sm text-accent-foreground/80">
                                <p>{order.deliveryAddress.street}</p>
                                {order.deliveryAddress.landmark && <p className="text-xs text-accent-foreground/60 mt-1">Landmark: {order.deliveryAddress.landmark}</p>}
                                <p className="mt-1">
                                    {order.deliveryAddress.city && `${order.deliveryAddress.city}, `}
                                    {order.deliveryAddress.state}
                                    {order.deliveryAddress.postCode && `, ${order.deliveryAddress.postCode}`}
                                </p>
                                <p>{order.deliveryAddress.country}</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl border border-accent/10 overflow-hidden">
                        <div className="bg-accent/5 px-4 py-3 border-b border-accent/10">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-accent" />
                                <h3 className="text-sm font-semibold text-accent-foreground">Order Items ({order.cartItems?.length || 0})</h3>
                            </div>
                        </div>
                        <div className="divide-y divide-accent/10">
                            {order.cartItems?.map((item, idx) => (
                                <div key={idx} className="p-4 flex gap-4 hover:bg-accent/5 transition-colors">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-accent/5 flex-shrink-0 border border-accent/10">
                                        <Image
                                            src={item.picture || placeholder.src}
                                            alt={item.itemName}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-medium text-accent-foreground truncate">{item.itemName}</p>
                                                <p className="text-xs text-accent-foreground/60 mt-0.5">Code: {item.itemCode}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-semibold text-accent-foreground">{formatCurrency(item.amount, order.ccy)}</p>
                                                {item.discount > 0 && (
                                                    <p className="text-xs text-green-600">-{item.discount}%</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-accent-foreground/60">
                                            <span>Qty: {item.quantity}</span>
                                            <span>•</span>
                                            <span>Price: {formatCurrency(item.price, order.ccy)}</span>
                                            {item.vat > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span>VAT: {formatCurrency(item.vat, order.ccy)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">
                        <h3 className="text-sm font-semibold text-accent-foreground mb-3">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-accent-foreground/60">Subtotal:</span>
                                <span className="text-accent-foreground">{formatCurrency(calculateSubtotal(), order.ccy)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-accent-foreground/60">Tax:</span>
                                <span className="text-accent-foreground">{formatCurrency(order.taxAmount, order.ccy)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-accent-foreground/60">Delivery Fee:</span>
                                <span className="text-accent-foreground">{formatCurrency(order.deliveryFee, order.ccy)}</span>
                            </div>
                            {order.totalDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount:</span>
                                    <span>- {formatCurrency(calculateTotalDiscount(), order.ccy)}</span>
                                </div>
                            )}
                            <div className="border-t border-accent/10 pt-2 mt-2">
                                <div className="flex justify-between font-bold">
                                    <span className="text-accent-foreground">Total:</span>
                                    <span className="text-accent-foreground text-lg">{formatCurrency(order.totalAmount, order.ccy)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {order.hasRating && order.ratingCount > 0 && (
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <h3 className="text-sm font-semibold text-yellow-800">Customer Rating</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 ${star <= Math.floor(order.ratingCount) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-yellow-800">{order.ratingCount.toFixed(1)} / 5</span>
                            </div>
                            {order.reviewComment && (
                                <p className="mt-2 text-sm text-yellow-800/80 italic">"{order.reviewComment}"</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function OrdersPage() {
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('VIEW_ORDERS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to view orders"
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [orderStatus, setOrderStatus] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pageSize = 15;

    const { data: summaryData, isLoading: summaryLoading } = useQuery({
        queryKey: ['order-summary'],
        queryFn: () => axiosOperations.get('/store-dashboard/orderSummaryCards').then(res => res.data),
    });

    const { data: ordersData, isLoading: ordersLoading, error, refetch } = useQuery<OrdersResponse>({
        queryKey: ['orders', page, searchTerm, orderStatus, startDate, endDate],
        queryFn: async () => {
            const params: any = {
                storeCode: 'STO0715',
                entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || 'FTD',
                pageNumber: page,
                pageSize: pageSize,
            };
            if (searchTerm) params.search = searchTerm;
            if (orderStatus !== 'all') params.orderStatus = orderStatus;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await axiosOperations.get('/store-dashboard/fetch-recent-orders', { params });
            return response.data;
        },
    });

    const summary = summaryData as OrderSummaryCards;
    const orders = ordersData?.data || [];
    const totalCount = ordersData?.totalCount || 0;
    const totalPages = ordersData?.totalPages || Math.ceil(totalCount / pageSize);

    const handleRefresh = () => {
        setIsRefreshing(true);
        refetch().finally(() => setIsRefreshing(false));
    };

    const handlePageChange = (newPage: number) => setPage(newPage);
    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };
    const handleClearFilters = () => {
        setSearchTerm('');
        setOrderStatus('all');
        setStartDate('');
        setEndDate('');
        setPage(1);
    };
    const handleApplyFilters = () => {
        setPage(1);
        refetch();
    };

    const metrics = [
        { title: 'Total Orders', value: summary?.totalOrders || 0, isPrimary: true },
        { title: 'Assigned Orders', value: summary?.assignedOrders || 0, isPrimary: false },
        { title: 'Delivered', value: summary?.deliveredOrders || 0, isPrimary: false },
        { title: 'In Transit', value: summary?.ordersInTransit || 0, isPrimary: false },
        { title: 'Pending', value: summary?.pendingOrders || 0, isPrimary: false },
        { title: 'Cancelled', value: summary?.cancelledOrders || 0, isPrimary: false },
    ];

    const columns = [
        { key: 'products', title: 'Products', width: 150, render: (order: Order) => <ImageCollage items={order.cartItems} /> },
        { key: 'orderId', title: 'Order ID', width: 180, render: (order: Order) => <div><p className="font-semibold">{order.cartId}</p><p className="text-xs text-gray-500">{formatDate(order.orderDate)}</p></div> },
        { key: 'customer', title: 'Customer', width: 150, render: (order: Order) => <div className="flex items-center gap-2"><Avatar className="w-8 h-8"><AvatarFallback className="bg-accent text-white text-xs">{getInitials(order.customerName)}</AvatarFallback></Avatar><span className="text-sm">{order.customerName}</span></div> },
        { key: 'amount', title: 'Amount', width: 100, render: (order: Order) => <span className="font-semibold text-green-600">{formatCurrency(order.totalAmount, order.ccy)}</span> },
        { key: 'status', title: 'Status', width: 120, render: (order: Order) => <Badge className={`${getStatusColor(order.orderStatus)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>{getStatusIcon(order.orderStatus)}{order.orderStatus}</Badge> },
        { key: 'payment', title: 'Payment', width: 120, render: (order: Order) => <Badge className={`${getStatusColor(order.paymentStatus)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>{getStatusIcon(order.paymentStatus)}{order.paymentStatus}</Badge> },
        { key: 'actions', title: 'Actions', width: 80, render: (order: Order) => <Button variant="ghost" size="sm" className="p-1 hover:bg-accent/10" onClick={() => handleViewDetails(order)}><Eye className="w-4 h-4 text-accent-foreground" /></Button> },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-accent-foreground mb-2">Order Management</h1>
                        <p className="text-accent-foreground/70">View and manage all customer orders</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {metrics.map((metric, idx) => (
                        <MetricCard
                            key={idx}
                            title={metric.title}
                            value={metric.value}
                            isPrimary={metric.isPrimary}
                        />
                    ))}
                </div>

                <Card className="border-accent/20 shadow-sm mb-6">
                    <CardHeader className="border-b border-accent/10">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
                                <Filter className="w-5 h-5" /> Filters
                            </CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="text-accent hover:bg-accent/10">
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </Button>
                        </div>
                    </CardHeader>
                    {showFilters && (
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-accent-foreground">Search</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent-foreground/50" />
                                        <Input
                                            placeholder="Order ID, Customer, Item..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 border-accent/20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-accent-foreground">Order Status</Label>
                                    <Select value={orderStatus} onValueChange={setOrderStatus}>
                                        <SelectTrigger className="border-accent/20"><SelectValue placeholder="All Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="COMPLETED">Completed</SelectItem>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="INTRANSIT">In Transit</SelectItem>
                                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-accent-foreground">Start Date</Label>
                                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border-accent/20" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-accent-foreground">End Date</Label>
                                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border-accent/20" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-accent/10">
                                <Button variant="outline" onClick={handleClearFilters} className="border-accent/20 hover:bg-accent/10">Clear Filters</Button>
                                <Button onClick={handleApplyFilters} className="bg-accent hover:bg-accent/90 text-white"><Search className="w-4 h-4 mr-2" /> Apply Filters</Button>
                            </div>
                        </CardContent>
                    )}
                </Card>

                <Card className="border-accent/20 shadow-sm">
                    <CardHeader className="border-b border-accent/10">
                        <CardTitle className="text-lg font-semibold text-accent-foreground">Orders List</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {ordersLoading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                                <p className="mt-2 text-accent-foreground/70">Loading orders...</p>
                            </div>
                        ) : error ? (
                            <div className="p-12 text-center">
                                <p className="text-red-500 mb-2">Error loading orders</p>
                                <Button variant="outline" onClick={() => refetch()} className="border-accent/20 hover:bg-accent/10">Try Again</Button>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                                    <Search className="h-12 w-12 text-accent-foreground/50" />
                                </div>
                                <h3 className="text-lg font-medium text-accent-foreground mb-2">No orders found</h3>
                                <p className="text-accent-foreground/70 mb-4">Try adjusting your filters</p>
                                <Button onClick={handleClearFilters} variant="outline" className="border-accent/20 hover:bg-accent/10">Clear Filters</Button>
                            </div>
                        ) : (
                            <>
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-accent/20">
                                                {columns.map(col => (
                                                    <th key={col.key} className="text-left p-3 font-bold text-sm text-accent-foreground" style={{ width: col.width }}>
                                                        {col.title}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr key={order.cartId} className="border-b border-accent/10 hover:bg-accent/5 transition-colors">
                                                    {columns.map(col => (
                                                        <td key={col.key} className="p-3 text-sm">
                                                            {col.render(order)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="lg:hidden space-y-4 p-4">
                                    {orders.map(order => (
                                        <MobileOrderCard key={order.cartId} order={order} onViewDetails={handleViewDetails} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex justify-end p-4 border-t border-accent/10">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(page - 1)}
                                                disabled={page === 1}
                                                className="border-accent/20 hover:bg-accent/10"
                                            >
                                                Previous
                                            </Button>
                                            <span className="text-sm text-accent-foreground/70 px-2">
                                                Page {page} of {totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={page === totalPages}
                                                className="border-accent/20 hover:bg-accent/10"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                <OrderDetailsModal
                    order={selectedOrder}
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                />
            </div>
        </div>
    );
}