// "use client";
// import React from "react";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
// } from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Loader2, Package, CreditCard } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import axiosOperations from "@/utils/fetch-function-op-auth";

// interface BillerViewModalProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     billerCode: string | null;
// }

// const getStatusColor = (status: string) => {
//     switch (status?.toUpperCase()) {
//         case "ACTIVE":
//             return "bg-accent text-white";
//         case "PENDING":
//             return "bg-amber-500 text-white";
//         case "INACTIVE":
//             return "bg-red-500 text-white";
//         default:
//             return "bg-gray-500 text-white";
//     }
// };

// export default function BillerViewModal({
//     open,
//     onOpenChange,
//     billerCode,
// }: BillerViewModalProps) {
//     const { data: billerDetails, isLoading } = useQuery({
//         queryKey: ["biller-details-view", billerCode],
//         queryFn: async () => {
//             const response = await axiosOperations.get(
//                 `billpayment/getbillerdetail?billerCode=${billerCode}`,
//                 { params: { pageNumber: 1, pageSize: 20 } }
//             );
//             return response.data;
//         },
//         enabled: !!billerCode && open,
//     });

//     const products = billerDetails?.products || [];
//     const paymentData = billerDetails?.paymentData || [];

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="max-w-4xl max-h-[85vh] min-w-[70vw] overflow-y-auto">
//                 <DialogHeader className='flex flex-col'>
//                     <DialogTitle className="text-accent-foreground">Biller Details</DialogTitle>
//                     <DialogDescription>
//                         Viewing information for {billerDetails?.billerName || billerCode}
//                     </DialogDescription>
//                 </DialogHeader>

//                 {isLoading ? (
//                     <div className="flex justify-center items-center h-40">
//                         <Loader2 className="h-8 w-8 animate-spin text-accent" />
//                     </div>
//                 ) : (
//                     <>
//                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
//                             <div>
//                                 <p className="text-xs font-medium text-accent-foreground/70">
//                                     Biller Code
//                                 </p>
//                                 <p className="font-mono text-sm font-semibold text-accent-foreground">
//                                     {billerDetails?.billerCode}
//                                 </p>
//                             </div>
//                             <div>
//                                 <p className="text-xs font-medium text-accent-foreground/70">Name</p>
//                                 <p className="text-sm font-semibold text-accent-foreground">
//                                     {billerDetails?.billerName}
//                                 </p>
//                             </div>
//                             <div>
//                                 <p className="text-xs font-medium text-accent-foreground/70">Category</p>
//                                 <p className="text-sm text-accent-foreground/80">
//                                     {billerDetails?.billerCategory || "—"}
//                                 </p>
//                             </div>
//                             <div>
//                                 <p className="text-xs font-medium text-accent-foreground/70">Status</p>
//                                 <Badge
//                                     className={`${getStatusColor(billerDetails?.status)} text-xs px-2 py-1`}
//                                 >
//                                     {billerDetails?.status || "UNKNOWN"}
//                                 </Badge>
//                             </div>
//                         </div>

//                         {/* Tabs */}
//                         <Tabs defaultValue="products" className="w-full">
//                             <TabsList className="grid w-full grid-cols-2 bg-accent/5 mb-6">
//                                 <TabsTrigger 
//                                     value="products" 
//                                     className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-white"
//                                 >
//                                     <Package className="h-4 w-4" />
//                                     Products ({products.length})
//                                 </TabsTrigger>
//                                 <TabsTrigger 
//                                     value="paymentData" 
//                                     className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-white"
//                                 >
//                                     <CreditCard className="h-4 w-4" />
//                                     Payment Data ({paymentData.length})
//                                 </TabsTrigger>
//                             </TabsList>

//                             <TabsContent value="products">
//                                 {products.length === 0 ? (
//                                     <p className="text-center text-accent-foreground/50 py-8">
//                                         No products found for this biller.
//                                     </p>
//                                 ) : (
//                                     <div className="overflow-x-auto">
//                                         <table className="w-full border-collapse">
//                                             <thead>
//                                                 <tr className="border-b-2 border-accent/20">
//                                                     <th className="text-left p-3 font-bold text-sm text-accent-foreground">#</th>
//                                                     <th className="text-left p-3 font-bold text-sm text-accent-foreground">Product Code</th>
//                                                     <th className="text-left p-3 font-bold text-sm text-accent-foreground">Product Name</th>
//                                                     <th className="text-left p-3 font-bold text-sm text-accent-foreground">Amount</th>
//                                                     <th className="text-left p-3 font-bold text-sm text-accent-foreground">Type</th>
//                                                     <th className="text-left p-3 font-bold text-sm text-accent-foreground">Status</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {products.map((p: any, i: number) => (
//                                                     <tr
//                                                         key={p.productCode || i}
//                                                         className="border-b border-accent/10 hover:bg-accent/5 transition-colors"
//                                                     >
//                                                         <td className="p-3 text-sm text-accent-foreground">{i + 1}</td>
//                                                         <td className="p-3 font-mono text-sm text-accent-foreground">
//                                                             {p.productCode}
//                                                         </td>
//                                                         <td className="p-3 text-sm font-medium text-accent-foreground">
//                                                             {p.productName}
//                                                         </td>
//                                                         <td className="p-3 text-sm text-accent-foreground">
//                                                             {p.amount ?? "—"}
//                                                         </td>
//                                                         <td className="p-3 text-sm text-accent-foreground">
//                                                             {p.amountType || "—"}
//                                                         </td>
//                                                         <td className="p-3">
//                                                             <Badge
//                                                                 className={`${getStatusColor(p.status)} text-xs px-2 py-1`}
//                                                             >
//                                                                 {p.status || "—"}
//                                                             </Badge>
//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 )}
//                             </TabsContent>

//                             <TabsContent value="paymentData">
//                                 {paymentData.length === 0 ? (
//                                     <p className="text-center text-accent-foreground/50 py-8">
//                                         No payment data fields found for this biller.
//                                     </p>
//                                 ) : (
//                                     <div className="overflow-x-auto">
//                                         <table className="w-full border-collapse">
//                                             <thead>
//                                                 <tr className="border-b-2 border-accent/20">
//                                                     <th className="text-left p-3 font-bold text-sm text-accent-foreground">#</th>
//                                                     <th className="text-left p-3 font-bold text-sm text-accent-foreground">Field ID</th>
//                                                     <th className="text-left p-3 font-bold text-sm text-accent-foreground">Field Name</th>
//                                                     <th className="text-left p-3 font-bold text-sm text-accent-foreground">Data Type</th>
//                                                     <th className="text-left p-3 font-bold text-sm text-accent-foreground">Max Length</th>
//                                                     <th className="text-left p-3 font-bold text-sm text-accent-foreground">Mandatory</th>
//                                                     <th className="text-left p-3 font-bold text-sm text-accent-foreground">I/O</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {paymentData.map((f: any, i: number) => (
//                                                     <tr
//                                                         key={f.fieldID || i}
//                                                         className="border-b border-accent/10 hover:bg-accent/5 transition-colors"
//                                                     >
//                                                         <td className="p-3 text-sm text-accent-foreground">{i + 1}</td>
//                                                         <td className="p-3 font-mono text-sm text-accent-foreground">
//                                                             {f.fieldID}
//                                                         </td>
//                                                         <td className="p-3 text-sm font-medium text-accent-foreground">
//                                                             {f.fieldName}
//                                                         </td>
//                                                         <td className="p-3 text-sm text-accent-foreground">
//                                                             {f.fieldDataType}
//                                                         </td>
//                                                         <td className="p-3 text-sm text-accent-foreground">
//                                                             {f.maxLength}
//                                                         </td>
//                                                         <td className="p-3 text-sm text-accent-foreground">
//                                                             {f.mandatoryFlag === "Y" ? "Yes" : "No"}
//                                                         </td>
//                                                         <td className="p-3 text-sm text-accent-foreground">
//                                                             {f.inputOrOutput === "I" ? "Input" : "Output"}
//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 )}
//                             </TabsContent>
//                         </Tabs>
//                     </>
//                 )}
//             </DialogContent>
//         </Dialog>
//     );
// }

"use client";
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosOperations from "@/utils/fetch-function-op-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BillerViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    billerCode: string | null;
}

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case "ACTIVE": return "bg-green-100 text-green-700 border-green-200";
        case "INACTIVE": return "bg-red-100 text-red-700 border-red-200";
        default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
};

const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-0.5">
        <p className="text-xs text-medium-gray">{label}</p>
        <p className="text-xs font-semibold text-dark-gray">{value || 'N/A'}</p>
    </div>
);

export const BillerViewModal: React.FC<BillerViewModalProps> = ({ open, onOpenChange, billerCode }) => {
    const { data: billerDetails, isLoading } = useQuery({
        queryKey: ["biller-details-view", billerCode],
        queryFn: async () => {
            const response = await axiosOperations.get(
                `billpayment/getbillerdetail?billerCode=${billerCode}`,
                { params: { pageNumber: 1, pageSize: 20 } }
            );
            return response.data;
        },
        enabled: !!billerCode && open,
    });

    const products = billerDetails?.products || [];
    const paymentData = billerDetails?.paymentData || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[100vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                <DialogTitle className="sr-only">Biller Details</DialogTitle>

                <div className="px-6 pt-5 pb-4">
                    <h2 className="text-base font-semibold text-dark-gray mb-4">Biller Details</h2>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-2xl p-4 mb-4">
                                <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#F5F5F5]">
                                    <p className="text-sm font-bold text-dark-gray font-mono">{billerDetails?.billerCode}</p>
                                    <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full ${getStatusColor(billerDetails?.status)}`}>{billerDetails?.status}</Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-x-6">
                                    <Field label="Name" value={billerDetails?.billerName} />
                                    <Field label="Category" value={billerDetails?.billerCategory} />
                                    <Field label="Short Name" value={billerDetails?.billerShortName} />
                                </div>
                            </div>

                            <Tabs defaultValue="products" className="w-full">
                                <div className="p-0 pb-1">
                                    <TabsList className="flex gap-2 flex-wrap bg-transparent p-0 mb-4">
                                        <TabsTrigger
                                            value="products"
                                        >
                                            Products ({products.length})
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="paymentData"
                                        >
                                            Payment Data ({paymentData.length})
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="bg-white rounded-2xl p-4">

                                    <TabsContent value="products" className="pt-4">
                                        {products.length === 0 ? (
                                            <p className="text-center text-medium-gray py-8">No products found for this biller.</p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr className="border-b-2 border-[#EEEEEE]">
                                                            {['#', 'Product Code', 'Product Name', 'Amount', 'Type', 'Status'].map((h) => (
                                                                <th key={h} className="text-left px-3 pt-0.5 pb-1 text-sm font-semibold text-dark-gray">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {products.map((p: any, i: number) => (
                                                            <tr key={p.productCode || i} className="border-b border-gray-100">
                                                                <td className="px-3 py-3 text-sm text-dark-gray">{i + 1}</td>
                                                                <td className="px-3 py-3 font-mono text-sm text-dark-gray">{p.productCode}</td>
                                                                <td className="px-3 py-3 text-sm font-medium text-dark-gray">{p.productName}</td>
                                                                <td className="px-3 py-3 text-sm text-dark-gray">{p.amount ?? "—"}</td>
                                                                <td className="px-3 py-3 text-sm text-dark-gray">{p.amountType || "—"}</td>
                                                                <td className="px-3 py-3"><Badge className={`text-[10px] px-2 py-0.5 border font-medium ${getStatusColor(p.status)}`}>{p.status || "—"}</Badge></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="paymentData" className="pt-4">
                                        {paymentData.length === 0 ? (
                                            <p className="text-center text-medium-gray py-8">No payment data fields found.</p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr className="border-b-2 border-[#EEEEEE]">
                                                            {['#', 'Field ID', 'Field Name', 'Data Type', 'Max Length', 'Mandatory', 'I/O'].map((h) => (
                                                                <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {paymentData.map((f: any, i: number) => (
                                                            <tr key={f.fieldID || i} className="border-b border-gray-100">
                                                                <td className="px-3 py-3 text-sm text-dark-gray">{i + 1}</td>
                                                                <td className="px-3 py-3 font-mono text-sm text-dark-gray">{f.fieldID}</td>
                                                                <td className="px-3 py-3 text-sm font-medium text-dark-gray">{f.fieldName}</td>
                                                                <td className="px-3 py-3 text-sm text-dark-gray">{f.fieldDataType}</td>
                                                                <td className="px-3 py-3 text-sm text-dark-gray">{f.maxLength}</td>
                                                                <td className="px-3 py-3 text-sm text-dark-gray">{f.mandatoryFlag === "Y" ? "Yes" : "No"}</td>
                                                                <td className="px-3 py-3 text-sm text-dark-gray">{f.inputOrOutput === "I" ? "Input" : "Output"}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};