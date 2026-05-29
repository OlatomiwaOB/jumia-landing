// 'use client'
// import React, { useState } from 'react';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Loader2 } from 'lucide-react';
// import { useMutation } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import { toast } from 'sonner';
// import useOperations from '@/store/operationsStore';

// interface TransactionType {
//     id: number;
//     entityCode: string;
//     customerType: string;
//     tranCode: string;
//     tranName: string;
//     maxLimit: number;
//     dailyLimit: number;
//     monthlyLimit: number | null;
//     dailyFreq: number;
//     status: string;
//     agentCommission: number;
//     platformCommission: number;
//     networkCommission: number;
//     bankCommission: number;
//     aggregatorCommission: number;
//     serviceFee: number;
//     groupCommission: null | number;
//     charge: number;
//     chargeType: string;
//     otherCharge: number;
//     tranChannel: string;
//     roleAllowed: null | string;
//     minLimit: number;
//     sharingType: string;
//     glCodeCommission: string | null;
//     glCode: string | null;
//     branchCode: string;
//     tax: number;
//     setupRefNo: string;
//     minHardTokenLimit: number;
//     maxHardTokenLimit: number;
//     dailyHardTokenLimit: number;
//     capLimit: number;
// }

// interface TransactionTypeDeleteModalProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     transaction: TransactionType | null;
//     onSuccess?: () => void;
// }

// export default function TransactionTypeDeleteModal({
//     open,
//     onOpenChange,
//     transaction,
//     onSuccess,
// }: TransactionTypeDeleteModalProps) {
//     const { operations } = useOperations();
//     const [isDeleting, setIsDeleting] = useState(false);

//     const { mutate: deleteTransactionType, isPending } = useMutation({
//         mutationFn: (transaction: any) =>
//             axiosOperations.request({
//                 method: 'DELETE',
//                 url: `transTypeSetup/deleteTranTypeSetup?id=${transaction.id}&tranCode=${transaction.tranCode}&entityCode=${operations?.entityCode}`,
//                 data: transaction,
//             }),
//         onSuccess: (response) => {
//             if (response?.data?.code !== '000') {
//                 toast.error(response?.data?.desc || 'Operation failed');
//                 return;
//             }
//             toast.success('Transaction type deleted successfully');
//             onSuccess?.();
//             onOpenChange(false);
//         },
//         onError: (error: any) => {
//             toast.error(error?.response?.data?.message || 'Error deleting transaction type');
//         },
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!transaction) return;

//         setIsDeleting(true);

//         const payload: any = {
//             id: transaction.id,
//             tranCode: transaction.tranCode,
//             entityCode: operations?.entityCode,
//         };

//         deleteTransactionType(payload);
//     };

//     if (!transaction) return null;

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent
//                 className="max-w-5xl md:w-4xl lg:w-5xl max-h-[85vh] overflow-y-auto"
//                 style={{
//                     scrollbarWidth: 'none',
//                     scrollbarColor: 'transparent',
//                 }}
//             >
//                 <DialogHeader className="flex flex-col">
//                     <DialogTitle className="text-accent-foreground">
//                         Delete Transaction Type #{transaction.id}
//                     </DialogTitle>
//                 </DialogHeader>

//                 <form onSubmit={handleSubmit} className="py-4">
//                     <div className="space-y-4">
//                         <div className="bg-gray-50 p-4 rounded-md">
//                             <p className="font-medium mb-2">Trans. Type Details:</p>
//                             <p><strong>Name:</strong> {transaction?.tranName}</p>
//                             <p><strong>Code:</strong> {transaction?.tranCode}</p>
//                         </div>

//                         <div className="bg-red-50 border border-red-200 p-3 rounded-md">
//                             <p className="text-sm text-red-600">
//                                 <strong>Warning:</strong> This action cannot be undone. The transaction type data will be permanently deleted.
//                             </p>
//                         </div>
//                     </div>

//                     <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-accent/10">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={() => onOpenChange(false)}
//                             className="border-accent/20 hover:bg-accent/10"
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             type="submit"
//                             disabled={isPending}
//                             className="bg-accent hover:bg-accent/90 text-white"
//                         >
//                             {isPending ? (
//                                 <>
//                                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                     Deleting...
//                                 </>
//                             ) : (
//                                 'Delete Transaction Type'
//                             )}
//                         </Button>
//                     </div>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }


'use client'
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import useOperations from '@/store/operationsStore';

interface TransactionType {
    id: number;
    entityCode: string;
    customerType: string;
    tranCode: string;
    tranName: string;
    maxLimit: number;
    dailyLimit: number;
    monthlyLimit: number | null;
    dailyFreq: number;
    status: string;
    agentCommission: number;
    platformCommission: number;
    networkCommission: number;
    bankCommission: number;
    aggregatorCommission: number;
    serviceFee: number;
    groupCommission: null | number;
    charge: number;
    chargeType: string;
    otherCharge: number;
    tranChannel: string;
    roleAllowed: null | string;
    minLimit: number;
    sharingType: string;
    glCodeCommission: string | null;
    glCode: string | null;
    branchCode: string;
    tax: number;
    setupRefNo: string;
    minHardTokenLimit: number;
    maxHardTokenLimit: number;
    dailyHardTokenLimit: number;
    capLimit: number;
}

interface TransactionTypeDeleteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: TransactionType | null;
    onSuccess?: () => void;
}

export default function TransactionTypeDeleteModal({ open, onOpenChange, transaction, onSuccess }: TransactionTypeDeleteModalProps) {
    const { operations } = useOperations();

    const { mutate: deleteTransactionType, isPending } = useMutation({
        mutationFn: () => axiosOperations.request({
            method: 'DELETE',
            url: `transTypeSetup/deleteTranTypeSetup?id=${transaction?.id}&tranCode=${transaction?.tranCode}&entityCode=${operations?.entityCode}`,
        }),
        onSuccess: (response) => {
            if (response?.data?.code !== '000') {
                toast.error(response?.data?.desc || 'Operation failed');
                return;
            }
            toast.success('Transaction type deleted successfully');
            onSuccess?.();
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Error deleting transaction type');
        },
    });

    if (!transaction) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                <DialogTitle className="sr-only">Delete Transaction Type</DialogTitle>
                <div className="px-6 pt-5">
                    <h2 className="text-base font-bold text-dark-gray">Delete Transaction Type</h2>
                </div>

                <div className="space-y-4">
                    <div className="bg-[#F6EDE7] m-6 rounded-lg p-3">
                        <p className="text-xs text-medium-gray"><span className="font-semibold text-dark-gray">Warning:</span> <br /> This action cannot be undone. The transaction type data will be permanently deleted.</p>
                    </div>
                    <div className="bg-white rounded-2xl m-6 p-4 space-y-4">
                        <div className="space-y-1.5">
                            <p className="text-xs text-medium-gray">Transaction Code</p>
                            <p className="text-sm h-12 my-auto flex items-center font-mono font-semibold text-dark-gray bg-white border border-[#EEEEEE] p-2 rounded-lg">{transaction.tranCode}</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-medium-gray">Transaction Name</p>
                            <p className="text-sm h-12 my-auto flex items-center font-mono font-semibold text-dark-gray bg-white border border-[#EEEEEE] p-2 rounded-lg">{transaction.tranName}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 px-6 py-3 bg-white justify-end rounded-b-2xl">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                        <Button onClick={() => deleteTransactionType()} disabled={isPending}>
                            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : 'Delete Transaction Type'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}