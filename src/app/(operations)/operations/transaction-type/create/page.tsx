// 'use client'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
// import { ArrowLeft, Loader2 } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useForm, Controller } from 'react-hook-form';
// import { useMutation } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import { toast } from 'sonner';
// import useOperations from '@/store/operationsStore';
// import useGetLookup from '@/app/hooks/useGetLookup';
// import { randomNDigitNumber } from '@/utils/helperfns';
// import { usePermission } from '@/hooks/usePermission';

// interface TransactionTypeFormData {
//     tranName: string;
//     tranCode: string;
//     // merchCategory: string;
//     customerType: string;
//     minLimit: number;
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

// export default function CreateTransactionTypePage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('MANAGE_TRANS_TYPE', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to manage transaction type"
//     });

//     const router = useRouter();
//     const { operations } = useOperations();

//     // const merchantCategoryOptions = useGetLookup("MERCHANT_GROUP");
//     const customerTypeOptions = useGetLookup("CUSTOMER_TYPE");
//     const transactionTypeOptions = useGetLookup("TRAN_CODE");

//     const { register, handleSubmit, control, formState: { errors } } = useForm<TransactionTypeFormData>({
//         defaultValues: {
//             tranName: '',
//             tranCode: '',
//             // merchCategory: '',
//             customerType: 'MERCHANT',
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

//     const setUpRefNo = randomNDigitNumber(15);

//     const { mutate: createTransactionType, isPending } = useMutation({
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
//             toast.success('Transaction type created successfully');
//             router.push('/operations/transaction-type');
//         },
//         onError: (error: any) => {
//             toast.error(error?.response?.data?.message || 'Error creating transaction type');
//         },
//     });

//     const onSubmit = (values: TransactionTypeFormData) => {
//         const payload = {
//             id: 0,
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

//         createTransactionType(payload);
//     };

//     return (
//         <div className="min-h-screen bg-white">
//             <div className="container mx-auto p-6 max-w-4xl">
//                 <div className='mb-4'>
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => router.back()}
//                     >
//                         <ArrowLeft className="h-4 w-4 mr-2" />
//                         Back
//                     </Button>
//                 </div>
//                 <div className="flex items-center gap-4 mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-accent-foreground mb-2">
//                             Create Transaction Type
//                         </h1>
//                         <p className="text-accent-foreground/70">
//                             Add a new transaction type configuration
//                         </p>
//                     </div>
//                 </div>

//                 <Card className="border-accent/20 shadow-sm">
//                     <CardHeader className="border-b border-accent/10">
//                         <CardTitle className="text-lg font-semibold text-accent-foreground">
//                             Transaction Type Details
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="p-6">
//                         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {/* <div className="space-y-2">
//                                     <Label htmlFor="merchCategory" className="text-accent-foreground">
//                                         Merchant Category *
//                                     </Label>
//                                     <Controller
//                                         control={control}
//                                         name="merchCategory"
//                                         rules={{ required: true }}
//                                         render={({ field }) => (
//                                             <Select
//                                                 value={field.value}
//                                                 onValueChange={field.onChange}
//                                             >
//                                                 <SelectTrigger id="merchCategory" className="border-accent/20">
//                                                     <SelectValue placeholder="Select merchant category" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {merchantCategoryOptions?.map((option: any) => (
//                                                         <SelectItem key={option.id} value={option.id}>
//                                                             {option.name}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         )}
//                                     />
//                                 </div> */}

//                                 <div className="space-y-2">
//                                     <Label htmlFor="tranCode" className="text-accent-foreground">
//                                         Transaction Code *
//                                     </Label>
//                                     <Controller
//                                         control={control}
//                                         name="tranCode"
//                                         rules={{ required: true }}
//                                         render={({ field }) => (
//                                             <Select
//                                                 value={field.value}
//                                                 onValueChange={field.onChange}
//                                             >
//                                                 <SelectTrigger id="tranCode" className="border-accent/20">
//                                                     <SelectValue placeholder="Select transaction code" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {transactionTypeOptions?.map((option: any) => (
//                                                         <SelectItem key={option.id} value={option.id}>
//                                                             {option.name}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         )}
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="tranName" className="text-accent-foreground">
//                                         Transaction Name *
//                                     </Label>
//                                     <Input
//                                         id="tranName"
//                                         {...register('tranName', { required: true })}
//                                         placeholder="Enter transaction name"
//                                         className="border-accent/20 focus:border-accent"
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="customerType" className="text-accent-foreground">
//                                         Customer Type
//                                     </Label>
//                                     <Controller
//                                         control={control}
//                                         name="customerType"
//                                         rules={{ required: false }}
//                                         render={({ field }) => (
//                                             <Select
//                                                 value={field.value}
//                                                 onValueChange={field.onChange}
//                                             >
//                                                 <SelectTrigger id="customerType" className="border-accent/20">
//                                                     <SelectValue placeholder="Select customer type" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {customerTypeOptions?.map((option: any) => (
//                                                         <SelectItem key={option.id} value={option.id}>
//                                                             {option.name}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         )}
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="minLimit" className="text-accent-foreground">
//                                         Minimum Limit (₦)
//                                     </Label>
//                                     <Input
//                                         id="minLimit"
//                                         type="number"
//                                         {...register('minLimit')}
//                                         placeholder="0.00"
//                                         className="border-accent/20 focus:border-accent"
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="maxLimit" className="text-accent-foreground">
//                                         Maximum Limit (₦)
//                                     </Label>
//                                     <Input
//                                         id="maxLimit"
//                                         type="number"
//                                         {...register('maxLimit')}
//                                         placeholder="0.00"
//                                         className="border-accent/20 focus:border-accent"
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="dailyLimit" className="text-accent-foreground">
//                                         Daily Limit (₦)
//                                     </Label>
//                                     <Input
//                                         id="dailyLimit"
//                                         type="number"
//                                         {...register('dailyLimit')}
//                                         placeholder="0.00"
//                                         className="border-accent/20 focus:border-accent"
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="dailyFreq" className="text-accent-foreground">
//                                         Daily Frequency
//                                     </Label>
//                                     <Input
//                                         id="dailyFreq"
//                                         type="number"
//                                         {...register('dailyFreq')}
//                                         placeholder="0"
//                                         className="border-accent/20 focus:border-accent"
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="sharingType" className="text-accent-foreground">
//                                         Sharing Type
//                                     </Label>
//                                     <Controller
//                                         control={control}
//                                         name="sharingType"
//                                         render={({ field }) => (
//                                             <Select
//                                                 value={field.value}
//                                                 onValueChange={field.onChange}
//                                             >
//                                                 <SelectTrigger id="sharingType" className="border-accent/20">
//                                                     <SelectValue placeholder="Select sharing type" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {sharingTypeOptions.map((option) => (
//                                                         <SelectItem key={option.value} value={option.value}>
//                                                             {option.label}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         )}
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="chargeType" className="text-accent-foreground">
//                                         Charge Type *
//                                     </Label>
//                                     <Controller
//                                         control={control}
//                                         name="chargeType"
//                                         rules={{ required: true }}
//                                         render={({ field }) => (
//                                             <Select
//                                                 value={field.value}
//                                                 onValueChange={field.onChange}
//                                             >
//                                                 <SelectTrigger id="chargeType" className="border-accent/20">
//                                                     <SelectValue placeholder="Select charge type" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {chargeTypeOptions.map((option) => (
//                                                         <SelectItem key={option.value} value={option.value}>
//                                                             {option.label}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         )}
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="charge" className="text-accent-foreground">
//                                         Charge
//                                     </Label>
//                                     <Input
//                                         id="charge"
//                                         type="number"
//                                         step="0.01"
//                                         {...register('charge')}
//                                         placeholder="0.00"
//                                         className="border-accent/20 focus:border-accent"
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="capLimit" className="text-accent-foreground">
//                                         Cap Limit (₦)
//                                     </Label>
//                                     <Input
//                                         id="capLimit"
//                                         type="number"
//                                         step="0.01"
//                                         {...register('capLimit')}
//                                         placeholder="0.00"
//                                         className="border-accent/20 focus:border-accent"
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="agentCommission" className="text-accent-foreground">
//                                         Agent Commission
//                                     </Label>
//                                     <Input
//                                         id="agentCommission"
//                                         type="number"
//                                         step="0.01"
//                                         {...register('agentCommission')}
//                                         placeholder="0.00"
//                                         className="border-accent/20 focus:border-accent"
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="platformCommission" className="text-accent-foreground">
//                                         Platform Commission
//                                     </Label>
//                                     <Input
//                                         id="platformCommission"
//                                         type="number"
//                                         step="0.01"
//                                         {...register('platformCommission')}
//                                         placeholder="0.00"
//                                         className="border-accent/20 focus:border-accent"
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="networkCommission" className="text-accent-foreground">
//                                         Network Commission
//                                     </Label>
//                                     <Input
//                                         id="networkCommission"
//                                         type="number"
//                                         step="0.01"
//                                         {...register('networkCommission')}
//                                         placeholder="0.00"
//                                         className="border-accent/20 focus:border-accent"
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="aggregatorCommission" className="text-accent-foreground">
//                                         Aggregator Commission
//                                     </Label>
//                                     <Input
//                                         id="aggregatorCommission"
//                                         type="number"
//                                         step="0.01"
//                                         {...register('aggregatorCommission')}
//                                         placeholder="0.00"
//                                         className="border-accent/20 focus:border-accent"
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="serviceFee" className="text-accent-foreground">
//                                         Service Fee
//                                     </Label>
//                                     <Input
//                                         id="serviceFee"
//                                         type="number"
//                                         step="0.01"
//                                         {...register('serviceFee')}
//                                         placeholder="0.00"
//                                         className="border-accent/20 focus:border-accent"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="flex justify-end pt-6 border-t border-accent/10">
//                                 <Button
//                                     type="submit"
//                                     disabled={isPending}
//                                     className="bg-accent hover:bg-accent/90 text-white px-8"
//                                 >
//                                     {isPending ? (
//                                         <>
//                                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                             Creating...
//                                         </>
//                                     ) : (
//                                         'Create Transaction Type'
//                                     )}
//                                 </Button>
//                             </div>
//                         </form>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// }

'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import useOperations from '@/store/operationsStore';
import useGetLookup from '@/app/hooks/useGetLookup';
import { randomNDigitNumber } from '@/utils/helperfns';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface TransactionTypeFormData {
    tranName: string;
    tranCode: string;
    customerType: string;
    minLimit: number;
    maxLimit: number;
    dailyLimit: number;
    dailyFreq: number;
    chargeType: string;
    charge: number;
    capLimit: number;
    sharingType: string;
    agentCommission: number;
    platformCommission: number;
    networkCommission: number;
    aggregatorCommission: number;
    serviceFee: number;
}

interface TransactionType {
    id: number;
    tranCode: string;
    tranName: string;
    customerType: string;
    minLimit: number;
    maxLimit: number;
    dailyLimit: number;
    dailyFreq: number;
    chargeType: string;
    charge: number;
    capLimit: number;
    sharingType: string;
    agentCommission: number;
    platformCommission: number;
    networkCommission: number;
    aggregatorCommission: number;
    serviceFee: number;
    entityCode: string;
    status: string;
    branchCode: string;
}

const FormSection = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-100 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1 mt-1">
                <h2 className="text-sm font-semibold text-dark-gray">{title}</h2>
                <p className="text-xs text-medium-gray mt-1">{subtitle}</p>
            </div>
            <div className="md:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
            </div>
        </div>
    </div>
);

const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <Label>{label} {required && <span className="text-red-500">*</span>}</Label>
        {children}
    </div>
);

const chargeTypeOptions = [
    { value: 'fixed', label: 'FIXED' },
    { value: 'percentage', label: 'PERCENTAGE' },
];

const sharingTypeOptions = [
    { value: 'flat', label: 'FLAT' },
    { value: 'percentage', label: 'PERCENTAGE' },
];

export default function CreateTransactionTypePage() {
    usePageMetadata('Transaction Types', 'Create or edit transaction type configurations.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_TRANS_TYPE', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage transaction type"
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const { operations } = useOperations();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isFormInitialized, setIsFormInitialized] = useState(false);

    const customerTypeOptions = useGetLookup("CUSTOMER_TYPE");
    const transactionTypeOptions = useGetLookup("TRAN_CODE");

    const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<TransactionTypeFormData>({
        defaultValues: {
            tranName: '', tranCode: '', customerType: 'MERCHANT',
            minLimit: 0, maxLimit: 0, dailyLimit: 0, dailyFreq: 0,
            chargeType: '', charge: 0, capLimit: 0, sharingType: '',
            agentCommission: 0, platformCommission: 0, networkCommission: 0,
            aggregatorCommission: 0, serviceFee: 0,
        },
    });

    useEffect(() => {
        const editParam = searchParams.get('edit');
        const idParam = searchParams.get('id');
        if (editParam === 'true' && idParam) {
            setIsEditMode(true);
            setEditingId(Number(idParam));
        }
    }, [searchParams]);

    // Fetch all types to find the one being edited
    const { data: allTypesData } = useQuery({
        queryKey: ['transaction-types-all'],
        queryFn: () => axiosOperations.request({
            method: 'GET',
            url: '/transTypeSetup/getTransactionTypes',
            params: { pageNumber: 1, pageSize: 1000, entityCode: operations?.entityCode },
        }).then(res => res.data),
        enabled: !!operations?.entityCode,
    });

    useEffect(() => {
        if (allTypesData?.data && isEditMode && editingId && !isFormInitialized) {
            const found = allTypesData.data.find((t: TransactionType) => t.id === editingId);
            if (found) {
                setValue('tranName', found.tranName || '');
                setValue('tranCode', found.tranCode || '');
                setValue('customerType', found.customerType || '');
                setValue('minLimit', found.minLimit || 0);
                setValue('maxLimit', found.maxLimit || 0);
                setValue('dailyLimit', found.dailyLimit || 0);
                setValue('dailyFreq', found.dailyFreq || 0);
                setValue('chargeType', found.chargeType?.toLowerCase() || '');
                setValue('charge', found.charge || 0);
                setValue('capLimit', found.capLimit || 0);
                setValue('sharingType', found.sharingType?.toLowerCase() || '');
                setValue('agentCommission', found.agentCommission || 0);
                setValue('platformCommission', found.platformCommission || 0);
                setValue('networkCommission', found.networkCommission || 0);
                setValue('aggregatorCommission', found.aggregatorCommission || 0);
                setValue('serviceFee', found.serviceFee || 0);
                setIsFormInitialized(true);
            }
        }
    }, [allTypesData, isEditMode, editingId, setValue, isFormInitialized]);

    const setUpRefNo = randomNDigitNumber(15);

    const { mutate: saveTransactionType, isPending } = useMutation({
        mutationFn: (formData: any) => axiosOperations.request({
            method: 'POST',
            url: '/transTypeSetup/create',
            data: formData,
        }),
        onSuccess: (response) => {
            if (response?.data?.code !== '000') {
                toast.error(response?.data?.desc || 'Operation failed');
                return;
            }
            toast.success(isEditMode ? 'Transaction type updated successfully' : 'Transaction type created successfully');
            router.push('/operations/transaction-type');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Error saving transaction type');
        },
    });

    const onSubmit = (values: TransactionTypeFormData) => {
        const payload = {
            id: isEditMode ? (editingId || 0) : 0,
            tranName: values.tranName,
            chargeType: values.chargeType?.toUpperCase(),
            maxLimit: Number(values.maxLimit),
            minLimit: Number(values.minLimit),
            dailyLimit: Number(values.dailyLimit),
            capLimit: Number(values.capLimit),
            networkCommission: Number(values.networkCommission),
            platformCommission: Number(values.platformCommission),
            aggregatorCommission: Number(values.aggregatorCommission),
            agentCommission: Number(values.agentCommission),
            serviceFee: Number(values.serviceFee),
            charge: Number(values.charge),
            dailyFreq: Number(values.dailyFreq),
            sharingType: values.sharingType?.toUpperCase(),
            entityCode: operations?.entityCode,
            customerType: values.customerType,
            tranCode: values.tranCode,
            status: "ACTIVE",
            bankCommission: 0,
            groupCommission: 0,
            otherCharge: 0,
            tranChannel: "MOBILE",
            roleAllowed: "",
            tax: 0,
            setUpRefNo: `REF${setUpRefNo}`,
            FeeTiers: [{}],
        };
        saveTransactionType(payload);
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl">
                <div className="mb-4">
                    <Button variant="link" onClick={() => router.push('/operations/transaction-type')}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </div>

                <div className='container mx-auto px-20 py-6'>
                    <div className="mb-6">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">
                            {isEditMode ? 'Edit Transaction Type' : 'Create Transaction Type'}
                        </h1>
                        <p className="text-xs lg:text-sm font-normal text-medium-gray">
                            {isEditMode ? 'Update transaction type configuration' : 'Add a new transaction type configuration'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className='bg-white px-6 py-4 rounded-2xl'>
                            <FormSection title="Transaction Information" subtitle="Transaction identity and classification.">
                                <FormField label="Transaction Code" required>
                                    <Controller
                                        control={control} name="tranCode" rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange} disabled={isEditMode}>
                                                <SelectTrigger><SelectValue placeholder="Select transaction code" /></SelectTrigger>
                                                <SelectContent>
                                                    {transactionTypeOptions?.map((option: any) => (
                                                        <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {isEditMode && <p className="text-xs text-medium-gray mt-1">Code cannot be changed</p>}
                                </FormField>
                                <FormField label="Transaction Name" required>
                                    <Input {...register('tranName', { required: true })} placeholder="Enter transaction name" />
                                </FormField>
                                <FormField label="Customer Type">
                                    <Controller
                                        control={control} name="customerType"
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger><SelectValue placeholder="Select customer type" /></SelectTrigger>
                                                <SelectContent>
                                                    {customerTypeOptions?.map((option: any) => (
                                                        <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </FormField>
                                <FormField label="Minimum Limit (₦)">
                                    <Input type="number" {...register('minLimit')} placeholder="0.00" />
                                </FormField>
                                <FormField label="Maximum Limit (₦)">
                                    <Input type="number" {...register('maxLimit')} placeholder="0.00" />
                                </FormField>
                                <FormField label="Daily Limit (₦)">
                                    <Input type="number" {...register('dailyLimit')} placeholder="0.00" />
                                </FormField>
                                <FormField label="Daily Frequency">
                                    <Input type="number" {...register('dailyFreq')} placeholder="0" />
                                </FormField>
                                <FormField label="Sharing Type">
                                    <Controller
                                        control={control} name="sharingType"
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger><SelectValue placeholder="Select sharing type" /></SelectTrigger>
                                                <SelectContent>
                                                    {sharingTypeOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </FormField>
                            </FormSection>

                            <FormSection title="Charge Specification" subtitle="Additional transaction details and attributes.">
                                <FormField label="Charge Type" required>
                                    <Controller
                                        control={control} name="chargeType" rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger><SelectValue placeholder="Select charge type" /></SelectTrigger>
                                                <SelectContent>
                                                    {chargeTypeOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </FormField>
                                <FormField label="Charge">
                                    <Input type="number" step="0.01" {...register('charge')} placeholder="0.00" />
                                </FormField>
                                <FormField label="Cap Limit (₦)">
                                    <Input type="number" step="0.01" {...register('capLimit')} placeholder="0.00" />
                                </FormField>
                                <FormField label="Agent Commission">
                                    <Input type="number" step="0.01" {...register('agentCommission')} placeholder="0.00" />
                                </FormField>
                                <FormField label="Platform Commission">
                                    <Input type="number" step="0.01" {...register('platformCommission')} placeholder="0.00" />
                                </FormField>
                                <FormField label="Network Commission">
                                    <Input type="number" step="0.01" {...register('networkCommission')} placeholder="0.00" />
                                </FormField>
                                <FormField label="Aggregator Commission">
                                    <Input type="number" step="0.01" {...register('aggregatorCommission')} placeholder="0.00" />
                                </FormField>
                                <FormField label="Service Fee">
                                    <Input type="number" step="0.01" {...register('serviceFee')} placeholder="0.00" />
                                </FormField>
                            </FormSection>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : (isEditMode ? 'Update Type' : 'Create Type')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}