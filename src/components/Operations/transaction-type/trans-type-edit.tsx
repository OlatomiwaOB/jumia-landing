// 'use client'
// import React, { useEffect, useState } from 'react';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { Loader2 } from 'lucide-react';
// import { useForm, Controller } from 'react-hook-form';
// import { useMutation } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import { toast } from 'sonner';
// import useOperations from '@/store/operationsStore';
// import useGetLookup from '@/app/hooks/useGetLookup';
// import { randomNDigitNumber } from '@/utils/helperfns';

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

// interface TransactionTypeEditModalProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     transaction: TransactionType | null;
//     onSuccess?: () => void;
// }

// interface FormData {
//     tranName: string;
//     tranCode: string;
//     // merchCategory: string;
//     minLimit: number;
//     customerType: string;
//     maxLimit: number;
//     dailyLimit: number;
//     dailyFreq: number;
//     chargeType: string;
//     charge: number;
//     capLimit: number;
//     sharingType: string;
//     agentCommission: number;
//     platformCommission: number;
//     networkCommission: number;
//     aggregatorCommission: number;
//     serviceFee: number;
// }

// const chargeTypeOptions = [
//     { value: 'fixed', label: 'FIXED' },
//     { value: 'percentage', label: 'PERCENTAGE' },
// ];

// const sharingTypeOptions = [
//     { value: 'flat', label: 'FLAT' },
//     { value: 'percentage', label: 'PERCENTAGE' },
// ];

// export default function TransactionTypeEditModal({
//     open,
//     onOpenChange,
//     transaction,
//     onSuccess,
// }: TransactionTypeEditModalProps) {
//     const { operations } = useOperations();
    
//     // const merchantCategoryOptions = useGetLookup("MERCHANT_GROUP");
//     const customerTypeOptions = useGetLookup("CUSTOMER_TYPE");
//     const transactionTypeOptions = useGetLookup("TRAN_CODE");

//     const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<FormData>({
//         defaultValues: {
//             tranName: '',
//             tranCode: '',
//             customerType: '',
//             // merchCategory: '',
//             minLimit: 0,
//             maxLimit: 0,
//             dailyLimit: 0,
//             dailyFreq: 0,
//             chargeType: '',
//             charge: 0,
//             capLimit: 0,
//             sharingType: '',
//             agentCommission: 0,
//             platformCommission: 0,
//             networkCommission: 0,
//             aggregatorCommission: 0,
//             serviceFee: 0,
//         },
//     });

//     // Reset form when modal closes
//     useEffect(() => {
//         if (!open) {
//             reset();
//         }
//     }, [open, reset]);

//     // Populate form when transaction data and lookup options are available
//     useEffect(() => {
//         if (open && transaction) {
//             // Set all form values from transaction data
//             setValue('tranName', transaction.tranName || '');
//             setValue('tranCode', transaction.tranCode || '');
//             setValue('customerType', transaction.customerType || '');
//             // setValue('merchCategory', transaction.branchCode || '');
//             setValue('minLimit', transaction.minLimit || 0);
//             setValue('maxLimit', transaction.maxLimit || 0);
//             setValue('dailyLimit', transaction.dailyLimit || 0);
//             setValue('dailyFreq', transaction.dailyFreq || 0);
//             setValue('chargeType', transaction.chargeType?.toLowerCase() || '');
//             setValue('charge', transaction.charge || 0);
//             setValue('capLimit', transaction.capLimit || 0);
//             setValue('sharingType', transaction.sharingType?.toLowerCase() || '');
//             setValue('agentCommission', transaction.agentCommission || 0);
//             setValue('platformCommission', transaction.platformCommission || 0);
//             setValue('networkCommission', transaction.networkCommission || 0);
//             setValue('aggregatorCommission', transaction.aggregatorCommission || 0);
//             setValue('serviceFee', transaction.serviceFee || 0);
//         }
//     }, [open, transaction, setValue]);

//     const setUpRefNo = randomNDigitNumber(15);

//     const { mutate: updateTransactionType, isPending } = useMutation({
//         mutationFn: (formData: any) =>
//             axiosOperations.request({
//                 method: 'POST',
//                 url: '/transTypeSetup/create',
//                 data: formData,
//             }),
//         onSuccess: (response) => {
//             if (response?.data?.code !== '000') {
//                 toast.error(response?.data?.desc || 'Operation failed');
//                 return;
//             }
//             toast.success('Transaction type updated successfully');
//             onSuccess?.();
//             onOpenChange(false);
//         },
//         onError: (error: any) => {
//             toast.error(error?.response?.data?.message || 'Error updating transaction type');
//         },
//     });

//     const onSubmit = (values: FormData) => {
//         if (!transaction) return;

//         const payload: any = {
//             id: transaction.id,
//             tranName: values.tranName,
//             chargeType: values.chargeType?.toUpperCase(),
//             maxLimit: Number(values.maxLimit),
//             minLimit: Number(values.minLimit),
//             dailyLimit: Number(values.dailyLimit),
//             capLimit: Number(values.capLimit),
//             networkCommission: Number(values.networkCommission),
//             platformCommission: Number(values.platformCommission),
//             aggregatorCommission: Number(values.aggregatorCommission),
//             agentCommission: Number(values.agentCommission),
//             serviceFee: Number(values.serviceFee),
//             charge: Number(values.charge),
//             dailyFreq: Number(values.dailyFreq),
//             sharingType: values.sharingType?.toUpperCase(),
//             entityCode: operations?.entityCode,
//             customerType: values.customerType,
//             tranCode: values.tranCode,
//             status: "ACTIVE",
//             bankCommission: 0,
//             groupCommission: 0,
//             otherCharge: 0,
//             tranChannel: "MOBILE",
//             roleAllowed: "",
//             // branchCode: values.merchCategory,
//             tax: 0,
//             setUpRefNo: `REF${setUpRefNo}`,
//             FeeTiers: [{}],
//         };

//         updateTransactionType(payload);
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
//                         Edit Transaction Type #{transaction.id}
//                     </DialogTitle>
//                 </DialogHeader>

//                 <form onSubmit={handleSubmit(onSubmit)} className="py-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {/* <div className="space-y-2">
//                             <Label htmlFor="merchCategory" className="text-accent-foreground">
//                                 Merchant Category *
//                             </Label>
//                             <Controller
//                                 control={control}
//                                 name="merchCategory"
//                                 rules={{ required: true }}
//                                 render={({ field }) => (
//                                     <Select
//                                         value={field.value}
//                                         onValueChange={field.onChange}
//                                     >
//                                         <SelectTrigger id="merchCategory" className="border-accent/20">
//                                             <SelectValue placeholder="Select merchant category" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {merchantCategoryOptions?.map((option: any) => (
//                                                 <SelectItem key={option.id} value={option.id}>
//                                                     {option.name}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 )}
//                             />
//                         </div> */}

//                         <div className="space-y-2">
//                             <Label htmlFor="tranCode" className="text-accent-foreground">
//                                 Transaction Code *
//                             </Label>
//                             <Controller
//                                 control={control}
//                                 name="tranCode"
//                                 rules={{ required: true }}
//                                 render={({ field }) => (
//                                     <Select
//                                         value={field.value}
//                                         onValueChange={field.onChange}
//                                     >
//                                         <SelectTrigger id="tranCode" className="border-accent/20">
//                                             <SelectValue placeholder="Select transaction code" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {transactionTypeOptions?.map((option: any) => (
//                                                 <SelectItem key={option.id} value={option.id}>
//                                                     {option.name}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 )}
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="tranName" className="text-accent-foreground">
//                                 Transaction Name *
//                             </Label>
//                             <Input
//                                 id="tranName"
//                                 {...register('tranName', { required: true })}
//                                 placeholder="Enter transaction name"
//                                 className="border-accent/20 focus:border-accent"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="customerType" className="text-accent-foreground">
//                                 Customer Type
//                             </Label>
//                             <Controller
//                                 control={control}
//                                 name="customerType"
//                                 rules={{ required: false }}
//                                 render={({ field }) => (
//                                     <Select
//                                         value={field.value}
//                                         onValueChange={field.onChange}
//                                     >
//                                         <SelectTrigger id="customerType" className="border-accent/20">
//                                             <SelectValue placeholder="Select customer type" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {customerTypeOptions?.map((option: any) => (
//                                                 <SelectItem key={option.id} value={option.id}>
//                                                     {option.name}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 )}
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="minLimit" className="text-accent-foreground">
//                                 Minimum Limit (₦)
//                             </Label>
//                             <Input
//                                 id="minLimit"
//                                 type="number"
//                                 {...register('minLimit')}
//                                 placeholder="0.00"
//                                 className="border-accent/20 focus:border-accent"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="maxLimit" className="text-accent-foreground">
//                                 Maximum Limit (₦)
//                             </Label>
//                             <Input
//                                 id="maxLimit"
//                                 type="number"
//                                 {...register('maxLimit')}
//                                 placeholder="0.00"
//                                 className="border-accent/20 focus:border-accent"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="dailyLimit" className="text-accent-foreground">
//                                 Daily Limit (₦)
//                             </Label>
//                             <Input
//                                 id="dailyLimit"
//                                 type="number"
//                                 {...register('dailyLimit')}
//                                 placeholder="0.00"
//                                 className="border-accent/20 focus:border-accent"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="dailyFreq" className="text-accent-foreground">
//                                 Daily Frequency
//                             </Label>
//                             <Input
//                                 id="dailyFreq"
//                                 type="number"
//                                 {...register('dailyFreq')}
//                                 placeholder="0"
//                                 className="border-accent/20 focus:border-accent"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="sharingType" className="text-accent-foreground">
//                                 Sharing Type
//                             </Label>
//                             <Controller
//                                 control={control}
//                                 name="sharingType"
//                                 render={({ field }) => (
//                                     <Select
//                                         value={field.value}
//                                         onValueChange={field.onChange}
//                                     >
//                                         <SelectTrigger id="sharingType" className="border-accent/20">
//                                             <SelectValue placeholder="Select sharing type" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {sharingTypeOptions.map((option) => (
//                                                 <SelectItem key={option.value} value={option.value}>
//                                                     {option.label}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 )}
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="chargeType" className="text-accent-foreground">
//                                 Charge Type *
//                             </Label>
//                             <Controller
//                                 control={control}
//                                 name="chargeType"
//                                 rules={{ required: true }}
//                                 render={({ field }) => (
//                                     <Select
//                                         value={field.value}
//                                         onValueChange={field.onChange}
//                                     >
//                                         <SelectTrigger id="chargeType" className="border-accent/20">
//                                             <SelectValue placeholder="Select charge type" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {chargeTypeOptions.map((option) => (
//                                                 <SelectItem key={option.value} value={option.value}>
//                                                     {option.label}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 )}
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="charge" className="text-accent-foreground">
//                                 Charge
//                             </Label>
//                             <Input
//                                 id="charge"
//                                 type="number"
//                                 step="0.01"
//                                 {...register('charge')}
//                                 placeholder="0.00"
//                                 className="border-accent/20 focus:border-accent"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="capLimit" className="text-accent-foreground">
//                                 Cap Limit (₦)
//                             </Label>
//                             <Input
//                                 id="capLimit"
//                                 type="number"
//                                 step="0.01"
//                                 {...register('capLimit')}
//                                 placeholder="0.00"
//                                 className="border-accent/20 focus:border-accent"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="agentCommission" className="text-accent-foreground">
//                                 Agent Commission
//                             </Label>
//                             <Input
//                                 id="agentCommission"
//                                 type="number"
//                                 step="0.01"
//                                 {...register('agentCommission')}
//                                 placeholder="0.00"
//                                 className="border-accent/20 focus:border-accent"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="platformCommission" className="text-accent-foreground">
//                                 Platform Commission
//                             </Label>
//                             <Input
//                                 id="platformCommission"
//                                 type="number"
//                                 step="0.01"
//                                 {...register('platformCommission')}
//                                 placeholder="0.00"
//                                 className="border-accent/20 focus:border-accent"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="networkCommission" className="text-accent-foreground">
//                                 Network Commission
//                             </Label>
//                             <Input
//                                 id="networkCommission"
//                                 type="number"
//                                 step="0.01"
//                                 {...register('networkCommission')}
//                                 placeholder="0.00"
//                                 className="border-accent/20 focus:border-accent"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="aggregatorCommission" className="text-accent-foreground">
//                                 Aggregator Commission
//                             </Label>
//                             <Input
//                                 id="aggregatorCommission"
//                                 type="number"
//                                 step="0.01"
//                                 {...register('aggregatorCommission')}
//                                 placeholder="0.00"
//                                 className="border-accent/20 focus:border-accent"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="serviceFee" className="text-accent-foreground">
//                                 Service Fee
//                             </Label>
//                             <Input
//                                 id="serviceFee"
//                                 type="number"
//                                 step="0.01"
//                                 {...register('serviceFee')}
//                                 placeholder="0.00"
//                                 className="border-accent/20 focus:border-accent"
//                             />
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
//                                     Updating...
//                                 </>
//                             ) : (
//                                 'Update Transaction Type'
//                             )}
//                         </Button>
//                     </div>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }