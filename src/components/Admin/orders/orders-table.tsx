// import { useState } from "react";
// import Table from "rc-table";
// import type { ColumnsType } from "rc-table/lib/interface";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Eye, MoreHorizontal } from "lucide-react";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Order } from "@/app/(admin)/admin/orders/page";

// interface OrdersTableProps {
//   orders: Order[];
//   onViewOrder: (order: Order) => void;
// }

// const OrdersTable = ({ orders, onViewOrder }: OrdersTableProps) => {
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

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit"
//     });
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 2
//     }).format(amount);
//   };

//   const columns: ColumnsType<Order> = [
//     {
//       title: "Order No",
//       dataIndex: "orderNo",
//       key: "orderNo",
//       width: 150,
//       render: (orderNo: string, record: Order) => (
//         <div>
//           <p className="font-medium text-foreground">{orderNo}</p>
//           <p className="text-xs text-muted-foreground">Ref: {record.refNo}</p>
//         </div>
//       ),
//     },
//     {
//       title: "Customer",
//       dataIndex: "customerName",
//       key: "customerName",
//       width: 180,
//       render: (customerName: string) => (
//         <span className="font-medium">{customerName}</span>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       width: 120,
//       render: (status: string) => (
//         <Badge className={`${getStatusColor(status)} border-0`}>
//           {status}
//         </Badge>
//       ),
//     },
//     {
//       title: "Category",
//       dataIndex: "category",
//       key: "category",
//       width: 120,
//       render: (category: string) => (
//         <Badge variant="outline">{category}</Badge>
//       ),
//     },
//     {
//       title: "Payment Method",
//       dataIndex: "paymentMethod",
//       key: "paymentMethod",
//       width: 140,
//       render: (method: string) => (
//         <span className="text-sm capitalize">{method}</span>
//       ),
//     },
//     {
//       title: "Items",
//       dataIndex: "orderItemInfos",
//       key: "items",
//       width: 80,
//       render: (items: any[]) => (
//         <span className="text-sm font-medium text-center block">
//           {items?.length || 0}
//         </span>
//       ),
//     },
//     {
//       title: "Subtotal",
//       dataIndex: "subTotal",
//       key: "subTotal",
//       width: 100,
//       render: (amount: number) => (
//         <span className="text-muted-foreground">
//           {formatCurrency(amount)}
//         </span>
//       ),
//     },
//     {
//       title: "Tax",
//       dataIndex: "tax",
//       key: "tax",
//       width: 80,
//       render: (tax: number) => (
//         <span className="text-muted-foreground">
//           {formatCurrency(tax)}
//         </span>
//       ),
//     },
//     {
//       title: "Total",
//       dataIndex: "total",
//       key: "total",
//       width: 120,
//       render: (total: number) => (
//         <span className="font-semibold text-lg">
//           {formatCurrency(total)}
//         </span>
//       ),
//     },
//     {
//       title: "Date Created",
//       dataIndex: "dateCreated",
//       key: "dateCreated",
//       width: 150,
//       render: (date: string) => (
//         <span className="text-sm text-muted-foreground">
//           {formatDate(date)}
//         </span>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       width: 100,
//       fixed: "right" as const,
//       render: (_, record: Order) => (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="sm">
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onClick={() => onViewOrder(record)}>
//               <Eye className="h-4 w-4 mr-2" />
//               View Details
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-card rounded-lg border">
//       <Table
//         columns={columns}
//         data={orders}
//         rowKey="id"
//         scroll={{ x: 1400 }}
//         className="rc-table-custom"
//         emptyText={
//           <div className="text-center py-8">
//             <p className="text-muted-foreground">No orders found</p>
//           </div>
//         }
//       />
//     </div>
//   );
// };

// export default OrdersTable;