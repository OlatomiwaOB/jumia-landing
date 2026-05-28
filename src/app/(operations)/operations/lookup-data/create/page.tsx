// 'use client'
// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { ArrowLeft, Save } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import useOperations from '@/store/operationsStore';
// import FileUpload from '@/components/Admin/inventories/file-input';
// import { usePermission } from '@/hooks/usePermission';

// interface LookupFormData {
//   categoryCode: string;
//   lookupCode: string;
//   lookupName: string;
//   lookupDesc: string;
//   status: string;
// }

// export default function CreateLookupDataPage() {
//   const { usePermissionGuard } = usePermission();

//   usePermissionGuard('MANAGE_LOOKUP', {
//     redirectToNotPermitted: true,
//     toastMessage: "You don't have permission to manage lookup data"
//   });

//   const router = useRouter();
//   const { operations } = useOperations();

//   const { data: categoryData } = useQuery({
//     queryKey: ['category-codes'],
//     queryFn: () => axiosOperations.request({
//       method: 'GET',
//       url: 'lookupdata/new-list',
//       params: {
//         entityCode: operations?.entityCode,
//         categoryCode: 'CATEGORY_CODE',
//         pageNumber: 1,
//         pageSize: 100
//       }
//     }),
//     enabled: !!operations?.entityCode,
//   });

//   const categoryOptions = categoryData?.data?.list || [];

//   const {
//     register,
//     handleSubmit,
//     control,
//     setValue,
//     watch,
//     formState: { errors }
//   } = useForm<LookupFormData>({
//     defaultValues: {
//       categoryCode: '',
//       lookupCode: '',
//       lookupName: '',
//       lookupDesc: '',
//       status: 'ACTIVE'
//     }
//   });

//   const createLookupMutation = useMutation({
//     mutationFn: (formData: any) =>
//       axiosOperations.request({
//         method: 'POST',
//         url: 'lookupdata/save',
//         data: formData
//       }),
//     onSuccess: (data) => {
//       if (data?.data?.responseCode === '000') {
//         toast.success('Lookup Data created successfully!');
//         router.push('/operations/lookup-data');
//       } else {
//         toast.error(data?.data?.responseMessage || 'Failed to create lookup data');
//       }
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || 'Error creating lookup data');
//     }
//   });

//   const onSubmit = (data: LookupFormData) => {
//     const payload = {
//       id: 0,
//       entityCode: operations?.entityCode,
//       countryCode: 'NG',
//       lookupDesc: data.lookupDesc,
//       lookupName: data.lookupName,
//       lookupCode: data.lookupCode,
//       status: data.status,
//       categoryCode: data.categoryCode,
//       usageAccess: 'All'
//     };

//     createLookupMutation.mutate(payload);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-subtle">
//       <div className="container mx-auto p-6">
//         <div className="flex items-center mb-6">
//           <Button
//             variant="ghost"
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Lookup Data
//           </Button>
//         </div>

//         <div className="flex items-center justify-center mb-8">
//           <div className="text-center">
//             <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
//               <Save className="w-8 h-8 text-accent-foreground" />
//             </div>
//             <h1 className="text-3xl font-bold text-accent-foreground">
//               Create Lookup Data
//             </h1>
//             <p className="text-muted-foreground mt-2">
//               Add new lookup data to your system
//             </p>
//           </div>
//         </div>

//         <div className="max-w-4xl mx-auto">
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <Card className="border-gray-200 shadow-sm mb-6">
//               <CardHeader>
//                 <CardTitle className="text-lg font-semibold text-gray-900">
//                   Lookup Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="lookupName">Lookup Name *</Label>
//                     <Input
//                       id="lookupName"
//                       {...register('lookupName', { required: 'Lookup name is required' })}
//                       placeholder="Enter lookup name"
//                     />
//                     {errors.lookupName && (
//                       <p className="text-sm text-red-500">{errors.lookupName.message}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="categoryCode">Category Code *</Label>
//                     <Select
//                       onValueChange={(value) => setValue('categoryCode', value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select category code" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {categoryOptions.map((option: any) => (
//                           <SelectItem key={option.code} value={option.code}>
//                             {option.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     {errors.categoryCode && (
//                       <p className="text-sm text-red-500">{errors.categoryCode.message}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="status">Status *</Label>
//                     <Select
//                       onValueChange={(value) => setValue('status', value)}
//                       defaultValue="ACTIVE"
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="ACTIVE">Active</SelectItem>
//                         <SelectItem value="INACTIVE">Inactive</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="lookupCode">Lookup Code *</Label>
//                     <Input
//                       id="lookupCode"
//                       {...register('lookupCode', { required: 'Lookup code is required' })}
//                       placeholder="Enter lookup code"
//                     />
//                     {errors.lookupCode && (
//                       <p className="text-sm text-red-500">{errors.lookupCode.message}</p>
//                     )}
//                   </div>

//                   <div className="md:col-span-2 space-y-2">
//                     <Label htmlFor="lookupDesc">Lookup Description *</Label>
//                     <Textarea
//                       id="lookupDesc"
//                       {...register('lookupDesc', { required: 'Lookup description is required' })}
//                       placeholder="Enter lookup description"
//                       className="min-h-[100px]"
//                     />
//                     {errors.lookupDesc && (
//                       <p className="text-sm text-red-500">{errors.lookupDesc.message}</p>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="flex justify-end gap-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => router.back()}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={createLookupMutation.isPending}
//                 className="gap-2"
//               >
//                 <Save className="w-4 h-4" />
//                 {createLookupMutation.isPending ? 'Creating...' : 'Create Lookup Data'}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import useOperations from '@/store/operationsStore';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface LookupFormData {
    categoryCode: string;
    lookupCode: string;
    lookupName: string;
    lookupDesc: string;
    status: string;
}

interface LookupData {
    id: number;
    entityCode: string;
    countryCode: string;
    categoryCode: string;
    lookupCode: string;
    lookupName: string;
    lookupDesc: string;
    status: string;
    usageAccess: string;
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

export default function CreateLookupDataPage() {
    usePageMetadata('Lookup Data', 'Create or edit lookup data.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_LOOKUP', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage lookup data"
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const { operations } = useOperations();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isFormInitialized, setIsFormInitialized] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LookupFormData>({
        defaultValues: {
            categoryCode: '',
            lookupCode: '',
            lookupName: '',
            lookupDesc: '',
            status: 'ACTIVE'
        }
    });

    const statusValue = watch('status');
    const categoryCodeValue = watch('categoryCode');

    const { data: categoryData } = useQuery({
        queryKey: ['category-codes'],
        queryFn: () => axiosOperations.request({
            method: 'GET',
            url: 'lookupdata/new-list',
            params: { entityCode: operations?.entityCode, categoryCode: 'CATEGORY_CODE', pageNumber: 1, pageSize: 100 }
        }),
        enabled: !!operations?.entityCode,
    });

    const categoryOptions = categoryData?.data?.list || [];

    useEffect(() => {
        const editParam = searchParams.get('edit');
        const idParam = searchParams.get('id');
        if (editParam === 'true' && idParam) {
            setIsEditMode(true);
            setEditingId(Number(idParam));
        }
    }, [searchParams]);

    // Fetch all lookups to find the one being edited
    const { data: lookupsData } = useQuery({
        queryKey: ['lookup-data-all'],
        queryFn: () => axiosOperations.request({
            method: 'GET',
            url: 'lookupdata/getallcategorycode',
            params: { entityCode: operations?.entityCode, categoryCode: '', pageNumber: 1, pageSize: 1000 }
        }),
        enabled: !!operations?.entityCode,
    });

    useEffect(() => {
        if (lookupsData?.data && isEditMode && editingId && !isFormInitialized) {
            const lookups = Array.isArray(lookupsData.data?.data?.lookupList || lookupsData.data)
                ? (lookupsData.data?.data?.lookupList || lookupsData.data)
                : [];
            const found = lookups.find((l: LookupData) => l.id === editingId);
            if (found) {
                setValue('categoryCode', found.categoryCode || '');
                setValue('lookupCode', found.lookupCode || '');
                setValue('lookupName', found.lookupName || '');
                setValue('lookupDesc', found.lookupDesc || '');
                setValue('status', found.status || 'ACTIVE');
                setIsFormInitialized(true);
            }
        }
    }, [lookupsData, isEditMode, editingId, setValue, isFormInitialized]);

    const saveLookupMutation = useMutation({
        mutationFn: (formData: any) => axiosOperations.request({
            method: 'POST',
            url: 'lookupdata/save',
            data: formData
        }),
        onSuccess: (data) => {
            if (data?.data?.responseCode === '000') {
                toast.success(isEditMode ? 'Lookup Data updated successfully!' : 'Lookup Data created successfully!');
                router.push('/operations/lookup-data');
            } else {
                toast.error(data?.data?.responseMessage || 'Failed to save lookup data');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Error saving lookup data');
        }
    });

    const onSubmit = (data: LookupFormData) => {
        const payload = {
            id: isEditMode ? (editingId || 0) : 0,
            entityCode: operations?.entityCode,
            countryCode: 'NG',
            lookupDesc: data.lookupDesc,
            lookupName: data.lookupName,
            lookupCode: data.lookupCode,
            status: data.status,
            categoryCode: data.categoryCode,
            usageAccess: 'All'
        };
        saveLookupMutation.mutate(payload);
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl">
                <div className="mb-4">
                    <Button variant="link" onClick={() => router.push('/operations/lookup-data')}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </div>

                <div className='container mx-auto px-20 py-6'>
                    <div className="mb-6">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">
                            {isEditMode ? 'Edit Lookup Data' : 'Create Lookup Data'}
                        </h1>
                        <p className="text-xs lg:text-sm font-normal text-medium-gray">
                            {isEditMode ? 'Update lookup data information' : 'Add new lookup data to your system'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className='bg-white px-6 py-4 rounded-2xl'>
                            <FormSection title="Lookup Information" subtitle="Lookup data details and classification.">
                                <FormField label="Lookup Name" required>
                                    <Input {...register('lookupName', { required: 'Lookup name is required' })} placeholder="Enter lookup name" />
                                    {errors.lookupName && <p className="text-xs text-red-500">{errors.lookupName.message}</p>}
                                </FormField>

                                <FormField label="Lookup Code" required>
                                    <Input {...register('lookupCode', { required: 'Lookup code is required' })} placeholder="Enter lookup code" disabled={isEditMode} />
                                    {isEditMode && <p className="text-xs text-medium-gray mt-1">Code cannot be changed</p>}
                                    {errors.lookupCode && <p className="text-xs text-red-500">{errors.lookupCode.message}</p>}
                                </FormField>

                                <FormField label="Category Code" required>
                                    {isEditMode ? (
                                        <div>
                                            <Input value={categoryCodeValue || ''} disabled className="bg-gray-50" />
                                            <p className="text-xs text-medium-gray mt-1">Category code cannot be changed</p>
                                        </div>
                                    ) : (
                                        <Select onValueChange={(value) => setValue('categoryCode', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category code" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categoryOptions.map((option: any) => (
                                                    <SelectItem key={option.code} value={option.code}>{option.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    {errors.categoryCode && <p className="text-xs text-red-500">{errors.categoryCode.message}</p>}
                                </FormField>

                                <FormField label="Status" required>
                                    <Select value={statusValue || 'ACTIVE'} onValueChange={(value) => setValue('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <div className="col-span-2">
                                    <FormField label="Lookup Description" required>
                                        <Textarea {...register('lookupDesc', { required: 'Lookup description is required' })} placeholder="Enter lookup description" rows={4} />
                                        {errors.lookupDesc && <p className="text-xs text-red-500">{errors.lookupDesc.message}</p>}
                                    </FormField>
                                </div>
                            </FormSection>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={saveLookupMutation.isPending}>
                                {saveLookupMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : (isEditMode ? 'Update Lookup' : 'Create Lookup')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}