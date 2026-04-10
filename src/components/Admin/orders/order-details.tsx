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