// 'use client'
// import React, { useState } from 'react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { MoreHorizontal, Download, Package, ShoppingCart, Truck, CheckCircle, Eye, Calendar, User, CreditCard, BadgeCheck, MapPin, ShoppingBag } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import axiosInstance from '@/utils/fetch-function';
// import useUser from '@/store/userStore';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import Image from 'next/image';
// import placeholder from "@/components/images/placeholder-product.webp"
// import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
// import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
// import ConfirmPayment from './confirmPayment';
// import Papa from 'papaparse';

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
//   oldPrice?: number;
//   vat: number;
//   discountAmount?: number;
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
//   orderStatus: string;
//   paymentStatus: string;
//   storeCode: string | null;
//   customerName: string;
//   deliveryAddress: DeliveryAddress;
//   cartItems: CartItem[];
//   taxAmount: number

// }
// interface DynamicTableProps {
//   columns: Column[];
//   data: Order[];
//   itemsPerPage?: number;
//   onViewDetails: (order: Order) => void;
// }

// interface Column {
//   title: string;
//   dataIndex: string;
//   key: string;
//   width?: number;
//   render?: (value: any, record: Order, index: number) => React.ReactNode;
// }

// interface MobileOrderCardProps {
//   order: Order;
//   onViewDetails: (order: Order) => void;
// }

// const getStatusColor = (status: string): string => {
//   switch (status.toLowerCase()) {
//     case 'delivered':
//     case 'completed':
//     case 'success':
//     case 'paid':
//       return 'bg-green-500 text-white';
//     case 'processing':
//     case 'pending':
//       return 'bg-blue-500 text-white';
//     case 'shipped':
//       return 'bg-sidebar-accent text-white';
//     case 'cancelled':
//     case 'failed':
//     case 'draft':
//       return 'bg-red-500 text-white';
//     default:
//       return 'bg-gray-500 text-white';
//   }
// };

// const getStatusIcon = (status: string): React.ReactNode => {
//   switch (status.toLowerCase()) {
//     case 'delivered':
//     case 'completed':
//       return <CheckCircle className="w-3 h-3" />;
//     case 'processing':
//     case 'pending':
//       return <Package className="w-3 h-3" />;
//     case 'shipped':
//       return <Truck className="w-3 h-3" />;
//     case 'cancelled':
//     case 'failed':
//       return <ShoppingCart className="w-3 h-3" />;
//     default:
//       return null;
//   }
// };

// const DynamicTable: React.FC<DynamicTableProps> = ({
//   columns,
//   data,
//   itemsPerPage = 5,
//   onViewDetails
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isAlertOpen, setIsAlertOpen] = useState(false);

//   const totalPages = Math.ceil(data.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentData = data.slice(startIndex, endIndex);

//   const handleViewDetails = (order: Order) => {
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//     onViewDetails(order);
//   };

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const getDisplayValue = (value: any): string => {
//     if (value === null || value === undefined || value === '') {
//       return 'N/A';
//     }
//     return value.toString();
//   };

//   const calculateSubtotal = (order: Order) => {
//     return order.cartItems?.reduce((sum, item) => sum + item.amount, 0) || 0;
//   };

//   // const calculateTotalTax = (order: Order) => {
//   //   return order.cartItems?.reduce((sum, item) => sum + (item.tax || 0), 0) || 0;
//   // };

//   const calculateTotalDiscount = (order: Order) => {
//     return order.cartItems?.reduce((sum, item) => sum + (item.discountAmount || 0), 0) || 0;
//   };

//   // const calculateTotal = (order: Order) => {
//   //   return calculateSubtotal(order) + calculateTotalTax(order) + (order.deliveryFee || 0);
//   // };

//   const columnsWithHandler = columns.map(col => {
//     if (col.key === 'actions') {
//       return {
//         ...col,
//         render: (text: string, record: Order) => (
//           <Button
//             variant="ghost"
//             size="sm"
//             className="p-1"
//             onClick={() => handleViewDetails(record)}
//           >
//             <Eye className="w-4 h-4" />
//           </Button>
//         )
//       };
//     }
//     return col;
//   });

//   return (
//     <>
//       <div className="w-full overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="border-b-2 border-gray-200">
//               {columnsWithHandler.map((column) => (
//                 <th
//                   key={column.key}
//                   className="text-left p-3 font-bold text-sm text-gray-700"
//                   style={{ width: column.width ? `${column.width}px` : 'auto' }}
//                 >
//                   {column.title}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {currentData.map((item, index) => (
//               <tr
//                 key={item.cartId}
//                 className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
//               >
//                 {columnsWithHandler.map((column: any) => (
//                   <td key={column.key} className="p-3 text-sm">
//                     {column?.render
//                       ? column.render(item[column.dataIndex as keyof Order], item, index)
//                       : item[column.dataIndex as keyof Order]
//                     }
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
//         <p className="text-sm text-gray-500">
//           Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Orders
//         </p>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="text-xs"
//           >
//             Previous
//           </Button>

//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <Button
//               key={page}
//               variant={currentPage === page ? "default" : "outline"}
//               size="sm"
//               onClick={() => handlePageChange(page)}
//               className="w-8 h-8 p-0 text-xs"
//             >
//               {page}
//             </Button>
//           ))}

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="text-xs"
//           >
//             Next
//           </Button>
//         </div>
//       </div>

//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader className='flex flex-col'>
//             <DialogTitle className="flex items-center gap-2">
//               <Package className="h-5 w-5" />
//               Order Details - {selectedOrder?.cartId || 'N/A'}
//             </DialogTitle>
//             <DialogDescription>
//               Detailed information about the selected order
//             </DialogDescription>
//           </DialogHeader>

//           {selectedOrder && (
//             <div className="py-4 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-accent/5 p-4 rounded-lg border">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Calendar className="h-4 w-4 text-accent/60" />
//                     <p className="text-sm font-medium text-accent/90">Order Date</p>
//                   </div>
//                   <p className="text-sm text-accent/70">{getDisplayValue(selectedOrder.orderDate)}</p>
//                 </div>

//                 <div className="bg-accent/5 p-4 rounded-lg border">
//                   <div className="flex items-center gap-2 mb-2">
//                     <User className="h-4 w-4 text-accent/60" />
//                     <p className="text-sm font-medium text-accent/90">Customer</p>
//                   </div>
//                   <p className="text-sm text-accent/70">{getDisplayValue(selectedOrder.customerName)}</p>
//                 </div>

//                 <div className="bg-accent/5 p-4 rounded-lg border">
//                   <div className="flex items-center gap-2 mb-2">
//                     <CreditCard className="h-4 w-4 text-accent/60" />
//                     <p className="text-sm font-medium text-accent/90">Payment Method</p>
//                   </div>
//                   <p className="text-sm text-accent/70">{getDisplayValue(selectedOrder.paymentMethod)}</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-accent/5 p-4 rounded-lg border">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Truck className="h-4 w-4 text-accent/60" />
//                     <p className="text-sm font-medium text-accent/90">Delivery Option</p>
//                   </div>
//                   <p className="text-sm text-accent/70 capitalize">{getDisplayValue(selectedOrder.deliveryOption)}</p>
//                 </div>

//                 <div className="bg-accent/5 p-4 rounded-lg border">
//                   <div className="flex items-center gap-2 mb-2">
//                     <ShoppingBag className="h-4 w-4 text-accent/60" />
//                     <p className="text-sm font-medium text-accent/90">Channel</p>
//                   </div>
//                   <p className="text-sm text-accent/70">{getDisplayValue(selectedOrder.channel)}</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium flex items-center gap-2">
//                     <BadgeCheck className="h-4 w-4" />
//                     Order Status
//                   </p>
//                   <Badge className={`${getStatusColor(selectedOrder.orderStatus)} text-xs px-3 py-1.5 flex items-center gap-1 w-fit`}>
//                     {getStatusIcon(selectedOrder.orderStatus)}
//                     {getDisplayValue(selectedOrder.orderStatus)}
//                   </Badge>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium flex items-center gap-2">
//                     <span className="text-muted-foreground">₦</span>
//                     Payment Status
//                   </p>
//                   <Badge className={`${getStatusColor(selectedOrder.paymentStatus)} text-xs px-3 py-1.5 flex items-center gap-1 w-fit`}>
//                     {getStatusIcon(selectedOrder.paymentStatus)}
//                     {getDisplayValue(selectedOrder.paymentStatus)}
//                   </Badge>
//                 </div>
//               </div>

//               <div className="border rounded-lg">
//                 <div className="p-4 border-b bg-gray-50">
//                   <h4 className="font-medium flex items-center gap-2">
//                     <ShoppingCart className="h-4 w-4" />
//                     Order Items ({selectedOrder.cartItems?.length || 0})
//                   </h4>
//                 </div>
//                 <div className="p-4 space-y-3">
//                   {selectedOrder.cartItems && selectedOrder.cartItems.length > 0 ? (
//                     selectedOrder.cartItems.map((item, index) => (
//                       <div key={index} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
//                         <div className="w-16 h-16 relative rounded-lg overflow-hidden border">
//                           <Image
//                             src={item.picture || placeholder.src}
//                             alt={item.itemName}
//                             fill
//                             className="object-cover"
//                             onError={(e) => {
//                               (e.target as HTMLImageElement).src = placeholder.src;
//                             }}
//                           />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium truncate">{getDisplayValue(item.itemName)}</p>
//                           <p className="text-xs text-gray-500 truncate">
//                             Code: {getDisplayValue(item.itemCode)}
//                           </p>
//                           <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
//                             <span>Qty: {getDisplayValue(item.quantity)}</span>
//                             <span>•</span>
//                             <span>{selectedOrder.ccy || 'NGN'} {item.price?.toFixed(2) || '0.00'}</span>
//                             {item.discount > 0 && (
//                               <>
//                                 <span>•</span>
//                                 <span className="text-green-600">Discount: {item.discount}%</span>
//                               </>
//                             )}
//                             {item.vat > 0 && (
//                               <>
//                                 <span>•</span>
//                                 <span className="text-gray-600">VAT: {selectedOrder.ccy || 'NGN'} {item.vat.toFixed(2)}</span>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-sm font-semibold">
//                             {selectedOrder.ccy || 'NGN'} {item.amount?.toFixed(2) || '0.00'}
//                           </p>
//                           {item.discount > 0 && (
//                             <p className="text-xs text-gray-500 line-through">
//                               {selectedOrder.ccy} {item.oldPrice?.toFixed(2)}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-8 text-gray-500">
//                       <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                       <p>No items in this order</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="border rounded-lg">
//                 <div className="p-4 border-b bg-gray-50">
//                   <h4 className="font-medium flex items-center gap-2">
//                     <Calendar className="h-4 w-4" />
//                     Order Summary
//                   </h4>
//                 </div>
//                 <div className="p-4">
//                   <div className="max-w-md ml-auto space-y-3">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Subtotal:</span>
//                       <span className="font-medium">
//                         {selectedOrder.ccy || 'NGN'} {calculateSubtotal(selectedOrder).toFixed(2)}
//                       </span>
//                     </div>

//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Tax:</span>
//                       <span className="font-medium">
//                         {selectedOrder.ccy || 'NGN'} {selectedOrder.taxAmount?.toFixed(2) || '0.00'}
//                       </span>
//                     </div>

//                     {/* <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Delivery Fee:</span>
//                       <span className="font-medium">
//                         {selectedOrder.ccy || 'NGN'} {selectedOrder.deliveryFee?.toFixed(2) || '0.00'}
//                       </span>
//                     </div> */}

//                     {selectedOrder.totalDiscount > 0 && (
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Discount:</span>
//                         <span className="font-medium text-green-600">
//                           Saved: {selectedOrder.ccy || 'NGN'} {calculateTotalDiscount(selectedOrder).toFixed(2)}
//                         </span>
//                       </div>
//                     )}

//                     <div className="border-t pt-3">
//                       <div className="flex justify-between text-lg font-bold">
//                         <span>Total:</span>
//                         <span className="text-green-600">
//                           {selectedOrder.ccy || 'NGN'} {selectedOrder.totalAmount?.toFixed(2) || '0.00'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Delivery Information */}
//               {selectedOrder.deliveryAddress && (
//                 <div className="border rounded-lg">
//                   <div className="p-4 border-b bg-gray-50">
//                     <h4 className="font-medium flex items-center gap-2">
//                       <MapPin className="h-4 w-4" />
//                       Delivery Information
//                     </h4>
//                   </div>
//                   <div className="p-4">
//                     <div className="flex items-start gap-3">
//                       <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
//                       <div className="space-y-1">
//                         <p className="text-sm font-medium">{selectedOrder.deliveryAddress.addressType}</p>
//                         <p className="text-sm text-gray-600">
//                           {getDisplayValue(selectedOrder.deliveryAddress.street)}
//                           {selectedOrder.deliveryAddress.landmark && (
//                             <><br />Landmark: {selectedOrder.deliveryAddress.landmark}</>
//                           )}
//                           <br />
//                           {selectedOrder.deliveryAddress.city && `${selectedOrder.deliveryAddress.city}, `}
//                           {getDisplayValue(selectedOrder.deliveryAddress.state)}
//                           {selectedOrder.deliveryAddress.postCode && ` ${selectedOrder.deliveryAddress.postCode}`}
//                           <br />
//                           {getDisplayValue(selectedOrder.deliveryAddress.country)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

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

// const MobileOrderCard: React.FC<MobileOrderCardProps> = ({ order, onViewDetails }) => {
//   const firstItem = order?.cartItems[0];

//   return (
//     <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-semibold text-gray-900">{order?.cartId}</p>
//           <p className="text-xs text-gray-500">{order.orderDate}</p>
//         </div>
//         <Badge className={`${getStatusColor(order?.orderStatus)} text-xs px-2 py-1 flex items-center gap-1`}>
//           {getStatusIcon(order?.orderStatus)}
//           {order?.orderStatus}
//         </Badge>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 relative rounded-md overflow-hidden">
//           <Image
//             src={firstItem?.picture || `${placeholder.src}`}
//             alt={firstItem?.itemName}
//             fill
//             className="object-cover"
//             onError={(e) => {
//               (e.target as HTMLImageElement).src = `${placeholder.src}`;
//             }}
//           />
//         </div>
//         <div className="flex-1">
//           <p className="text-sm font-medium text-gray-900">{firstItem?.itemName}</p>
//           <p className="text-xs text-gray-500">
//             {order?.cartItems?.length} item{order?.cartItems?.length !== 1 ? 's' : ''} • {order?.ccy} {order?.totalAmount?.toFixed(2)}
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center justify-between pt-2 border-t border-gray-200">
//         <div className="flex items-center gap-3">
//           <Avatar className="w-6 h-6">
//             <AvatarFallback className="bg-blue-500 text-white text-xs">
//               {order?.customerName.split(' ').map(n => n[0]).join('')}
//             </AvatarFallback>
//           </Avatar>
//           <p className="text-xs text-gray-600">{order?.customerName}</p>
//         </div>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="p-1"
//           onClick={() => onViewDetails(order)}
//         >
//           <Eye className="w-4 h-4" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default function OrderHistory(): React.ReactElement {
//   const { user } = useUser();
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['recent-orders'],
//     queryFn: () => axiosInstance.request({
//       url: '/store-dashboard/fetch-recent-orders',
//       method: 'GET',
//       params: {
//         pageNumber: 1,
//         pageSize: 10,
//         storeCode: user?.storeCode || '',
//         entityCode: user?.entityCode || getClientIdentifiers().entityCode,
//       }
//     })
//   });

//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const orders: Order[] = data?.data?.data || [];

//   const handleExport = () => {
//     exportDetailedOrdersToCSV(orders);
//   };

//   const handleViewDetails = (order: Order) => {
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//   };

//   const columns: Column[] = [
//     {
//       title: 'Product',
//       dataIndex: 'cartItems',
//       key: 'product',
//       width: 200,
//       render: (items: CartItem[], record: Order) => {
//         const firstItem = items[0];
//         return (
//           <div className="flex items-center gap-3">
//             <div className="w-20 h-10 relative rounded-md overflow-hidden">
//               <Image
//                 src={firstItem?.picture || `${placeholder.src}`}
//                 alt={firstItem?.itemName}
//                 fill
//                 className="object-cover"
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src = `${placeholder?.src}`;
//                 }}
//               />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-900">{firstItem?.itemName}</p>
//               <p className="text-xs text-gray-500">Cart: {items?.length} item{items?.length !== 1 ? 's' : ''}</p>
//             </div>
//           </div>
//         );
//       },
//     },
//     {
//       title: 'Order ID & Date',
//       dataIndex: 'cartId',
//       key: 'id',
//       width: 180,
//       render: (text: string, record: Order) => (
//         <div>
//           <p className="text-sm font-semibold text-gray-900">{text}</p>
//           <p className="text-xs text-gray-500">{record?.orderDate}</p>
//         </div>
//       ),
//     },
//     {
//       title: 'Customer',
//       dataIndex: 'customerName',
//       key: 'customer',
//       width: 150,
//       render: (text: string) => (
//         <div className="flex items-center gap-3 whitespace-nowrap">
//           <Avatar className="w-8 h-8">
//             <AvatarFallback className="bg-blue-500 text-white text-xs">
//               {text.split(' ').map(n => n[0]).join('')}
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <p className="text-sm font-medium text-gray-900">{text}</p>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'totalAmount',
//       key: 'amount',
//       width: 100,
//       render: (text: number, record: Order) => (
//         <span className="text-sm font-semibold text-green-600 whitespace-nowrap">
//           {record?.ccy} {text.toFixed(2)}
//         </span>
//       ),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'orderStatus',
//       key: 'status',
//       width: 120,
//       render: (text: string) => (
//         <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
//           {getStatusIcon(text)}
//           {text}
//         </Badge>
//       ),
//     },
//     {
//       title: 'Payment',
//       dataIndex: 'paymentStatus',
//       key: 'payment',
//       width: 120,
//       render: (text: string) => (
//         <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
//           {getStatusIcon(text)}
//           {text}
//         </Badge>
//       ),
//     },
//     {
//       title: 'Actions',
//       dataIndex: 'actions',
//       key: 'actions',
//       width: 80,
//       render: (text: string, record: Order) => (
//         <Button
//           variant="ghost"
//           size="sm"
//           className="p-1"
//           onClick={() => handleViewDetails(record)}
//         >
//           <Eye className="w-4 h-4" />
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <Card className="border-gray-200 shadow-sm">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-base lg:text-lg font-semibold text-gray-900">
//             Recent Orders
//           </CardTitle>
//           <Button variant="outline" size="sm" className="gap-2" onClick={handleExport} disabled={orders.length === 0}>
//             <Download className="w-4 h-4" />
//             <span className="hidden sm:inline">Export</span>
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <div className="flex justify-center items-center h-40">
//             <p className="text-gray-500">Loading orders...</p>
//           </div>
//         ) : error ? (
//           <div className="flex justify-center items-center h-40">
//             <p className="text-red-500">Error loading orders</p>
//           </div>
//         ) : orders.length === 0 ? (
//           <div className="flex justify-center items-center h-40">
//             <p className="text-gray-500">No orders found</p>
//           </div>
//         ) : (
//           <>
//             {/* Mobile view - Stack layout */}
//             <div className="block lg:hidden space-y-4">
//               {orders.map((order) => (
//                 <MobileOrderCard
//                   key={order?.cartId}
//                   order={order}
//                   onViewDetails={handleViewDetails}
//                 />
//               ))}
//             </div>

//             {/* Desktop view - Dynamic Table */}
//             <div className="hidden lg:block">
//               <DynamicTable
//                 columns={columns}
//                 data={orders}
//                 onViewDetails={handleViewDetails}
//               />
//             </div>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';
import { OrderDetailsModal } from '@/components/Admin/orders/order-details';
import type { OrderDetail } from '@/components/Admin/orders/order-details';
import OrderTrackingModal from '@/components/Admin/orders/order-tracking';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import Image from 'next/image';
import placeholder from '@/components/images/placeholder-product.webp';
import Link from 'next/link';
import { RoutingIcon, StarIcon } from '@/components/icons/icons';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Star } from 'lucide-react';
import { getClientIdentifiers } from '@/config/client-config';

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
  hasRating?: boolean;
  ratingCount?: number;
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
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

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
  onTrack: (o: Order) => void;
  onViewRating: (o: Order) => void;
}> = ({ order, onClick, isLast, onTrack, onViewRating }) => {
  const isCompleted = order.orderStatus?.toLowerCase() === 'completed';

  return (
    <div
      onClick={() => onClick(order)}
      className={`w-full flex items-center hover:bg-gray-50 gap-3 py-3 px-1 active:bg-gray-100 transition-colors cursor-pointer ${!isLast ? 'border-b-1 border-[#EEEEEE]' : ''
        }`}
    >
      <button
        type="button"
        className="flex items-center gap-4 flex-1 min-w-0 text-left cursor-pointer hover:bg-gray-50 active:bg-gray-100"
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

      {/* <div className="flex items-center gap-0.5 shrink-0 ml-1" onClick={(e) => e.stopPropagation()}>
        <Button size="xs" variant="action" onClick={() => onTrack(order)} title="Track Order">
          <RoutingIcon className="w-4 h-4" />
        </Button>
        {isCompleted && order.hasRating && (
          <Button size="xs" variant="action" onClick={() => onViewRating(order)} title="View Rating">
            <StarIcon className="w-4 h-4" />
          </Button>
        )}
      </div> */}
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
      <p className="text-xs text-medium-gray">
        {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-xs px-2.5 py-1 rounded-md border border-medium-gray disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`text-xs w-7 h-7 rounded-md border transition-colors ${p === currentPage
              ? 'bg-faded-accent text-white border-border'
              : 'border-border hover:bg-gray-50'
              }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-xs px-2.5 py-1 rounded-md border border-medium-gray disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
};

const ITEMS_PER_PAGE = 5;

export default function OrderHistory(): React.ReactElement {
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isViewRatingOpen, setIsViewRatingOpen] = useState(false);
  const [viewRatingOrder, setViewRatingOrder] = useState<Order | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: () => axiosInstance.request({
      url: '/store-dashboard/fetch-recent-orders',
      method: 'GET',
      params: {
        pageNumber: 1,
        pageSize: 10,
        storeCode: user?.storeCode || '',
        entityCode: user?.entityCode || getClientIdentifiers().entityCode,
      }
    })
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

  const openTracking = (o: Order) => {
    setSelectedOrder(o);
    setIsTrackingOpen(true);
  };

  const openViewRating = (o: Order) => {
    setViewRatingOrder(o);
    setIsViewRatingOpen(true);
  };

  if (!orders.length && !isLoading) {
    return (
      <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-4 lg:p-6">
        <div className='pb-4 mb-4 border-b border-[#EEEEEE]'>
          <div className="flex items-center justify-between">
            <h2 className="text-dark-gray text-lg font-semibold">
              Recent Orders
            </h2>
            <Link href='/admin/orders'>
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
            <Link href='/admin/orders'>
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
                    onTrack={openTracking}
                    onViewRating={openViewRating}
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
        onTrackOrder={(o) => {
          setIsDetailsOpen(false);
          openTracking(o as unknown as Order);
        }}
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

      <ViewRatingModal
        open={isViewRatingOpen}
        onClose={() => setIsViewRatingOpen(false)}
        orderId={viewRatingOrder?.cartId ?? null}
        ratingCount={viewRatingOrder?.ratingCount ?? 0}
      />
    </>
  );
}