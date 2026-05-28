// "use client";

// import React, { useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Eye, Edit } from "lucide-react";
// import DynamicTable from "@/components/Operations/billers/dynamic-table";
// import BillerViewModal from "@/components/Operations/billers/biller-view-modal";
// import { useRouter } from "next/navigation";
// import { PermissionButton } from "../permission/permission-button";

// interface BillerData {
//   id: number;
//   billerCode: string;
//   billerName: string;
//   shortName: string;
//   category: string;
//   status: string;
//   lookupDesc?: string;
//   billerLogo?: string;
// }

// const getStatusColor = (status: string): string => {
//   switch (status?.toUpperCase()) {
//     case "ACTIVE":
//       return "bg-accent text-white";
//     case "PENDING":
//       return "bg-amber-500 text-white";
//     case "INACTIVE":
//       return "bg-red-500 text-white";
//     default:
//       return "bg-gray-500 text-white";
//   }
// };

// export default function BillerList({
//   isFetching,
//   data,
// }: {
//   isFetching: boolean;
//   data: BillerData[];
// }) {
//   const router = useRouter();
//   const [viewBillerCode, setViewBillerCode] = useState<string | null>(null);
//   const [isViewOpen, setIsViewOpen] = useState(false);

//   const handleEdit = (billerCode: string) => {
//     router.push(`/operations/billers/add-biller?edit=true&code=${billerCode}`);
//   };

//   const columns: any[] = [
//     {
//       title: "S/N",
//       dataIndex: "id",
//       key: "serialNo",
//       width: 80,
//       render: (_: any, __: any, index: number) => (
//         <span className="text-accent-foreground">{index + 1}</span>
//       ),
//     },
//     {
//       title: "Biller Code",
//       dataIndex: "billerCode",
//       key: "billerCode",
//       width: 150,
//       render: (billerCode: string) => (
//         <span className="font-mono font-medium text-accent-foreground">
//           {billerCode || "N/A"}
//         </span>
//       ),
//     },
//     {
//       title: "Biller Name",
//       dataIndex: "billerName",
//       key: "billerName",
//       width: 200,
//       render: (billerName: string) => (
//         <span className="font-semibold text-accent-foreground">
//           {billerName || "N/A"}
//         </span>
//       ),
//     },
//     {
//       title: "Short Name",
//       dataIndex: "shortName",
//       key: "shortName",
//       width: 120,
//       render: (shortName: string) => (
//         <span className="text-accent-foreground/80">{shortName || "N/A"}</span>
//       ),
//     },
//     {
//       title: "Category",
//       dataIndex: "category",
//       key: "category",
//       width: 150,
//       render: (category: string) => (
//         <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
//           {category || "N/A"}
//         </Badge>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       width: 120,
//       render: (status: string) => (
//         <Badge className={`${getStatusColor(status)} text-xs px-2 py-1`}>
//           {status || "UNKNOWN"}
//         </Badge>
//       ),
//     },
//     {
//       title: "Actions",
//       dataIndex: "actions",
//       key: "actions",
//       width: 120,
//       render: (_: any, record: BillerData) => (
//         <div className="flex items-center gap-1">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="p-1 hover:bg-accent/10"
//             title="View Details"
//             onClick={(e) => {
//               e.stopPropagation();
//               setViewBillerCode(record.billerCode);
//               setIsViewOpen(true);
//             }}
//           >
//             <Eye className="h-4 w-4 text-accent-foreground" />
//           </Button>
//           <PermissionButton
//             requiredPermissions={['MANAGE_BILLERS']}
//             requireAll={true}
//             hideIfNoPermission={false}
//             tooltipMessage="You do not have permission to manage billers"
//             title="Edit Biller"
//             size="sm"
//             variant="ghost"
//             className="p-1 hover:bg-accent/10"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleEdit(record.billerCode);
//             }}
//           >
//             <Edit className="h-4 w-4 text-accent-foreground" />
//           </PermissionButton>
//         </div>
//       ),
//     },
//   ];

//   if (isFetching) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <DynamicTable columns={columns} data={data || []} />

//       <BillerViewModal
//         open={isViewOpen}
//         onOpenChange={setIsViewOpen}
//         billerCode={viewBillerCode}
//       />
//     </>
//   );
// }