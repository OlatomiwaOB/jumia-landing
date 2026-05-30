// 'use client'
// import React, { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Plus, CreditCard, AlertCircle } from "lucide-react";
// import { PaymentMethod, PaymentMethodsResponse } from "@/types";
// import { useToast } from "@/components/ui/use-toast";
// import { PaymentMethodsTable } from "@/components/Admin/payment-methods/payment-methods-table";
// import { PaymentMethodModal } from "@/components/Admin/payment-methods/payment-method-modal";
// import axiosOperations from "@/utils/fetch-function-op-auth";
// import { usePermission } from "@/hooks/usePermission";

// const PaymentMethods: React.FC = () => {
//   const { usePermissionGuard } = usePermission();

//   usePermissionGuard('MANAGE_PAYMENT_METHODS', {
//     redirectToNotPermitted: true,
//     toastMessage: "You don't have permission to manage payment methods"
//   });

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editData, setEditData] = useState<PaymentMethod | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
//   const isH2P = process.env.NEXT_PUBLIC_ENTITYCODE === 'H2P';


//   const { data, isLoading } = useQuery({
//     queryKey: ["payment-methods"],
//     queryFn: () => axiosOperations.request<PaymentMethodsResponse>({
//       url: '/payment-methods/fetch',
//       method: 'GET',
//       params: {
//         storeCode: 'STO0715',
//       }
//     })
//   });

//   const saveMutation = useMutation({
//     mutationFn: (data: any) => axiosOperations.request({
//       url: '/payment-methods/save',
//       method: 'POST',
//       params: {
//         storeCode: 'STO0715',
//       },
//       data
//     }),
//     onSuccess: (data) => {
//       if (data?.data?.code !== '000') {
//         toast({
//           title: 'Error',
//           description: data?.data?.desc || 'Failed to save payment method',
//         })
//         return
//       }

//       queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
//       toast({
//         title: "Success",
//         description: editData
//           ? "Payment method updated successfully"
//           : "Payment method created successfully",
//       });
//       setModalOpen(false);
//       setEditData(null);
//       return
//     },
//     onError: () => {
//       toast({
//         title: "Error",
//         description: "Failed to save payment method",
//         variant: "destructive",
//       });
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: async (code: string): Promise<void> => {
//       // Simulate API call
//       // console.log("Deleting payment method:", code);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
//       toast({
//         title: "Success",
//         description: "Payment method deleted successfully",
//       });
//     },
//     onError: () => {
//       toast({
//         title: "Error",
//         description: "Failed to delete payment method",
//         variant: "destructive",
//       });
//     },
//   });

//   const handleEdit = (method: PaymentMethod) => {
//     setEditData(method);
//     setModalOpen(true);
//   };

//   const handleDelete = (code: string) => {
//     if (confirm("Are you sure you want to delete this payment method?")) {
//       deleteMutation.mutate(code);
//     }
//   };

//   const handleAddNew = () => {
//     setEditData(null);
//     setModalOpen(true);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const paymentMethods = data?.data?.list || [];
//   const totalRecords = paymentMethods.length;

//   // if (!isH2P && user?.storeCode !== 'STO0715') {
//   //   return (
//   //     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
//   //       <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
//   //         <div className="flex justify-center mb-4">
//   //           <div className="bg-accent/10 rounded-full p-4">
//   //             <AlertCircle className="w-8 h-8 text-accent/60" />
//   //           </div>
//   //         </div>
//   //         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//   //           Payment Methods
//   //         </h1>

//   //         <p className="text-gray-600 mb-6">
//   //           This feature is coming soon. We're working hard to bring you a seamless way to manage payments with your preffered payment methods.
//   //         </p>

//   //         <div className="space-y-3">
//   //           <p className="text-sm text-gray-500">
//   //             ✓ Payment management<br />
//   //             ✓ User-friendly features<br />
//   //             ✓ Multiple payment methods
//   //           </p>
//   //         </div>

//   //         <p className="text-xs text-gray-400 mt-8">
//   //           Stay tuned for updates
//   //         </p>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center gap-3">
//               <div>
//                 <h1 className="text-4xl font-bold text-foreground">
//                   Payment Methods
//                 </h1>
//                 <p className="text-muted-foreground mt-1">
//                   Manage your store's payment options
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="text-right">
//                 <p className="text-2xl font-bold text-foreground">{totalRecords}</p>
//                 <p className="text-sm text-muted-foreground">Total Methods</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-card rounded-xl shadow-elevated p-6">
//           <div className="flex float-right py-4">
//             <Button
//               onClick={handleAddNew}
//               className="bg-accent text-white hover:opacity-90 transition-opacity shadow-elevated"
//               size="lg"
//             >
//               <Plus className="w-5 h-5 mr-2" />
//               Add Payment Method
//             </Button>
//           </div>
//           {isLoading ? (
//             <div className="flex items-center justify-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//             </div>
//           ) : (
//             <PaymentMethodsTable
//               data={paymentMethods}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//               currentPage={currentPage}
//               onPageChange={handlePageChange}
//             />
//           )}
//         </div>

//         <PaymentMethodModal
//           open={modalOpen}
//           onClose={() => {
//             setModalOpen(false);
//             setEditData(null);
//           }}
//           editData={editData}
//           saveMutation={saveMutation}
//         />
//       </div>
//     </div>
//   );
// };

// export default PaymentMethods;

'use client'
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Search, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { PaymentMethod, PaymentMethodsResponse } from "@/types";
import { toast } from "sonner";
import { PaymentMethodViewModal } from "@/components/Admin/payment-methods/payment-method-details";
import axiosOperations from "@/utils/fetch-function-op-auth";
import { usePermission } from "@/hooks/usePermission";
import { PermissionButton } from "@/components/Operations/permission/permission-button";
import { EditIcon } from "@/components/icons/icons";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { usePageMetadata } from "@/hooks/usePageMetadata";

const getDisplayValue = (value: any): string => value?.toString() || 'N/A';

const TablePagination = ({
    current, total, perPage, onChange,
}: { current: number; total: number; perPage: number; onChange: (p: number) => void }) => {
    const pages = Math.ceil(total / perPage);
    const start = (current - 1) * perPage + 1;
    const end = Math.min(current * perPage, total);

    const getPageNumbers = () => {
        if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
        const result: (number | '...')[] = [];
        if (current <= 3) result.push(1, 2, 3, '...', pages);
        else if (current >= pages - 2) result.push(1, '...', pages - 2, pages - 1, pages);
        else result.push(1, '...', current, '...', pages);
        return result;
    };

    return (
        <div className="flex items-center justify-between mt-4 pt-4 mb-10">
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Methods per Page</p>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current - 1)} disabled={current === 1}>
                    <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                {getPageNumbers().map((p, i) =>
                    p === '...' ? (
                        <span key={`e-${i}`} className="text-xs text-gray-400 px-1">···</span>
                    ) : (
                        <button key={p} onClick={() => onChange(p as number)}
                            className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${p === current ? 'border-2 border-orange-400 text-orange-500' : 'text-gray-600 hover:bg-gray-100'}`}>
                            {p}
                        </button>
                    )
                )}
                <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current + 1)} disabled={current === pages}>
                    Next <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

const PaymentMethods: React.FC = () => {
    usePageMetadata('Payment Methods', 'Manage payment methods and configurations.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_PAYMENT_METHODS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage payment methods"
    });

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const ITEMS_PER_PAGE = 10;
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["payment-methods"],
        queryFn: () => axiosOperations.request<PaymentMethodsResponse>({
            url: '/payment-methods/fetch',
            method: 'GET',
            // params: { storeCode: 'STO4430' }
        })
    });

    const deleteMutation = useMutation({
        mutationFn: async (code: string): Promise<void> => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
            toast.success("Payment method deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete payment method");
        },
    });

    const paymentMethods: PaymentMethod[] = data?.data?.list || [];

    const filtered = useMemo(() => {
        return paymentMethods.filter((m) => {
            const s = searchTerm.toLowerCase().trim();
            return !s || (
                m.name?.toLowerCase().includes(s) ||
                m.code?.toLowerCase().includes(s) ||
                m.paymentType?.toLowerCase().includes(s) ||
                m.serviceProvider?.toLowerCase().includes(s)
            );
        });
    }, [paymentMethods, searchTerm]);

    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleView = (method: PaymentMethod) => {
        setSelectedMethod(method);
        setViewModalOpen(true);
    };

    const handleEdit = (method: PaymentMethod) => {
        router.push(`/operations/payment-methods/create?edit=true&code=${method.code}`);
    };

    const handleDelete = (code: string) => {
        if (confirm("Are you sure you want to delete this payment method?")) {
            deleteMutation.mutate(code);
        }
    };

    const exportToCSV = () => {
        if (!filtered.length) { toast.error('No data to export'); return; }
        const csv = Papa.unparse(filtered.map((m) => ({
            'Name': m.name, 'Code': m.code, 'Type': m.paymentType,
            'Provider': m.serviceProvider, 'Status': m.status, 'Fee': m.fee,
            'Fee Type': m.feeType, 'Country': m.country,
        })), { header: true });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = `payment-methods-${new Date().toISOString().split('T')[0]}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Export complete');
    };

    return (
        <div className="min-h-screen px-2">
            <div className="flex justify-between">
                <div className="grid grid-cols-1">
                    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                        <p className="text-sm text-medium-gray mb-1">Total Methods</p>
                        <p className="text-2xl font-semibold text-dark-gray">{filtered.length.toLocaleString()}</p>
                    </div>
                </div>
                <PermissionButton
                    requiredPermissions={['MANAGE_PAYMENT_METHODS']}
                    requireAll={true} hideIfNoPermission={false}
                    tooltipMessage="No permission to create"
                    onClick={() => router.push('/operations/payment-methods/create')}
                    size="lg"
                >
                    Add Method
                </PermissionButton>
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    {/* <div className="flex relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="Search payment methods..."
                            className="pl-9 text-medium-gray"
                        />
                    </div> */}

                    <div className="flex items-center justify-end gap-2">
                        {/* {searchTerm && (
                            <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )} */}

                        {/* <Button onClick={exportToCSV} size="lg" variant="outline">
                            <TransInflowIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button> */}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                </div>
            ) : (
                <>
                    <div className="hidden lg:block">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <CreditCard className="w-10 h-10 text-gray-300" />
                                <p className="text-2xl font-medium text-dark-gray">No methods found</p>
                                <p className="text-sm text-medium-gray">Try adjusting your search</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#EEEEEE]">
                                                {['Name', 'Type', 'Provider', 'Fee', 'Status', ''].map((h) => (
                                                    <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map((m, idx) => (
                                                <tr key={m.code}
                                                    onClick={() => handleView(m)}
                                                    className={`border-b-2 border-[#EEEEEE] cursor-pointer hover:bg-orange-50/40 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
                                                    <td className="px-3 py-3.5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center p-1.5 border border-gray-200">
                                                                {m.logo ? (
                                                                    <img src={m.logo} alt={m.name} className="w-full h-full object-contain" />
                                                                ) : (
                                                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-dark-gray flex items-center gap-1.5">
                                                                    {m.name}
                                                                    {m.isRecommended && <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-[#9200C7]">{m.paymentType?.replace(/_/g, " ")}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{m.serviceProvider?.replace(/_/g, " ") || 'N/A'}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{m.feeType === 'PERCENT' ? `${m.fee}%` : `₦${m.fee}`}</p></td>
                                                    <td className="px-3 py-3.5">
                                                        <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${m.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                                            {m.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center gap-1">
                                                            <Button size="xs" variant="action" onClick={() => handleView(m)} title="View"><Eye className="w-4 h-4" /></Button>
                                                            <PermissionButton requiredPermissions={['MANAGE_PAYMENT_METHODS']} requireAll={true} hideIfNoPermission={false}
                                                                tooltipMessage="No permission" onClick={() => handleEdit(m)} size="xs" variant="action">
                                                                <EditIcon className="w-4 h-4" />
                                                            </PermissionButton>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {Math.ceil(filtered.length / ITEMS_PER_PAGE) > 1 && (
                                    <TablePagination current={currentPage} total={filtered.length} perPage={ITEMS_PER_PAGE} onChange={setCurrentPage} />
                                )}
                            </>
                        )}
                    </div>
                </>
            )}

            <PaymentMethodViewModal open={viewModalOpen} onOpenChange={setViewModalOpen} method={selectedMethod} />
        </div>
    );
};

export default PaymentMethods;