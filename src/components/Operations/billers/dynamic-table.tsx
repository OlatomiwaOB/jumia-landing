// "use client";
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";

// export interface Column<T> {
//   title: string;
//   dataIndex: string;
//   key: string;
//   width?: number;
//   render?: (value: any, record: T, index: number) => React.ReactNode;
// }

// interface DynamicTableProps<T> {
//   columns: Column<T>[];
//   data: T[];
//   itemsPerPage?: number;
// }

// const getDisplayValue = (value: any): string => {
//   if (value === null || value === undefined || value === "") return "N/A";
//   return value.toString();
// };

// export default function DynamicTable<T extends { id: any }>({
//   columns,
//   data,
//   itemsPerPage = 10,
// }: DynamicTableProps<T>) {
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = Math.ceil(data.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentData = data.slice(startIndex, endIndex);

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   return (
//     <div className="w-full">
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="border-b-2 border-accent/20">
//               {columns.map((column) => (
//                 <th
//                   key={column.key}
//                   className="text-left p-4 font-bold text-sm text-accent-foreground"
//                   style={{ width: column.width ? `${column.width}px` : "auto" }}
//                 >
//                   {column.title}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {currentData.length > 0 ? (
//               currentData.map((item, index) => (
//                 <tr
//                   key={item.id || index}
//                   className="border-b border-accent/10 hover:bg-accent/5 transition-colors"
//                 >
//                   {columns.map((column) => (
//                     <td key={column.key} className="p-4 text-sm text-accent-foreground">
//                       {column.render
//                         ? column.render(
//                             (item as any)[column.dataIndex],
//                             item,
//                             startIndex + index,
//                           )
//                         : getDisplayValue((item as any)[column.dataIndex])}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className="p-10 text-center text-accent-foreground/50"
//                 >
//                   No data available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
      
//       {totalPages > 1 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-accent/10 gap-4 px-4 pb-4">
//           <p className="text-sm text-accent-foreground/70">
//             Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Billers
//           </p>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="text-xs border-accent/20 hover:bg-accent/10"
//             >
//               Previous
//             </Button>

//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <Button
//                 key={page}
//                 variant={currentPage === page ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => handlePageChange(page)}
//                 className={`w-8 h-8 p-0 text-xs ${
//                   currentPage === page 
//                     ? 'bg-accent text-white' 
//                     : 'border-accent/20 hover:bg-accent/10'
//                 }`}
//               >
//                 {page}
//               </Button>
//             ))}

//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="text-xs border-accent/20 hover:bg-accent/10"
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }