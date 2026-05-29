// 'use client'
// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { ArrowLeft, Save, MapPin, Phone, Mail, User } from 'lucide-react';
// import useUser from '@/store/userStore';
// import axiosInstance from '@/utils/fetch-function';
// import { useRouter, useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import FileUpload from '@/components/Admin/inventories/file-input';
// import { useFileUpload } from '@/app/hooks/useUpload';
// import { fileUrlFormatted } from '@/utils/helperfns';
// import { format } from 'path';
// import { usePermission } from '@/hooks/usePermissionBusiness';

// interface StoreFormData {
//   id: number;
//   entityCode: string;
//   code: string;
//   storeName: string;
//   address: string;
//   logo: string;
//   telephone: string;
//   email: string;
//   manager: string;
//   status: string;
//   merchantCode: string;
// }

// export default function CreateStorePage() {
//   const { usePermissionGuard } = usePermission();

//   usePermissionGuard('MANAGE_STORES', {
//     redirectToNotPermitted: true,
//     toastMessage: "You don't have permission to manage stores"
//   });
//   const searchParams = useSearchParams();
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingStoreCode, setEditingStoreCode] = useState<string | null>(null);
//   const { user } = useUser();
//   const router = useRouter();
//   const { fileUrl, handleFileChange } = useFileUpload();

//   const [formData, setFormData] = useState<StoreFormData>({
//     id: 0,
//     entityCode: user?.entityCode || '',
//     code: '',
//     storeName: '',
//     address: '',
//     logo: '',
//     telephone: '',
//     email: '',
//     manager: '',
//     status: 'ACTIVE',
//     merchantCode: user?.merchantCode || '',
//   });

//   // Fetch store details for editing
//   const { data: storeData, isLoading: isLoadingStore } = useQuery({
//     queryKey: ['store-detail', editingStoreCode],
//     queryFn: () => axiosInstance.request({
//       url: '/store/fetch-store-detail',
//       method: 'GET',
//       params: {
//         storeCode: editingStoreCode
//       }
//     }),
//     enabled: !!editingStoreCode && isEditMode,
//   });

//   useEffect(() => {
//     const editParam = searchParams.get('edit');
//     const idParam = searchParams.get('id');

//     if (editParam === 'true' && idParam) {
//       setIsEditMode(true);
//       setEditingStoreCode(idParam);
//     }
//   }, [searchParams]);

//   // Populate form when store data is fetched
//   useEffect(() => {
//     if (storeData?.data && isEditMode) {
//       const store = storeData.data;
//       setFormData({
//         id: store.id || 0,
//         entityCode: store.entityCode || user?.entityCode || '',
//         code: store.code || '',
//         storeName: store.storeName || '',
//         address: store.address || '',
//         logo: store.logo || '',
//         telephone: store.telephone || '',
//         email: store.email || '',
//         manager: store.manager || '',
//         status: store.status || 'ACTIVE',
//         merchantCode: store.merchantCode || user?.merchantCode || '',
//       });
//     }
//   }, [storeData, isEditMode, user]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const createStoreMutation = useMutation({
//     mutationFn: (storeData: StoreFormData) =>
//       axiosInstance.post('/store/save', storeData),
//     onSuccess: () => {
//       toast.success(isEditMode ? 'Store updated successfully' : 'Store created successfully');
//       router.push('/admin/stores');
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} store`);
//     }
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const finalLogoUrl = fileUrl ? fileUrlFormatted(fileUrl) : formData.logo;
//     const editingLogoUrl = formData.logo ? fileUrlFormatted(formData.logo) : formData.logo;

//     // For edit mode, preserve original code and merchantCode
//     const payload = {
//       ...formData,
//       logo: editingLogoUrl || finalLogoUrl,
//       // Preserve original values for edit mode, ensuring strings
//       code: isEditMode ? (editingStoreCode ?? '') : formData.code,
//       merchantCode: isEditMode ? (user?.merchantCode ?? '') : formData.merchantCode,
//       entityCode: isEditMode ? (user?.entityCode ?? '') : formData.entityCode
//     };

//     createStoreMutation.mutate(payload);
//   };

//   if (isLoadingStore) {
//     return (
//       <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500">Loading store data...</p>
//         </div>
//       </div>
//     );
//   }

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
//             Back to Stores
//           </Button>
//         </div>

//         <div className="flex items-center justify-center mb-8">
//           <div className="text-center">
//             <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
//               <MapPin className="w-8 h-8 text-accent-foreground" />
//             </div>
//             <h1 className="text-3xl font-bold text-accent-foreground">
//               {isEditMode ? 'Edit Store' : 'Create New Store'}
//             </h1>
//             <p className="text-muted-foreground mt-2">
//               {isEditMode ? 'Update store information' : 'Add a new store to your merchant account'}
//             </p>
//           </div>
//         </div>

//         <div className="max-w-4xl mx-auto">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-md">
//               <h2 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 Basic Information
//               </h2>
//               <p className="text-muted-foreground mb-6">Store identity and classification</p>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="storeName" className="flex items-center gap-1 text-sm font-medium">
//                     <span>Store Name</span>
//                     <span className="text-destructive">*</span>
//                   </Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="storeName"
//                       name="storeName"
//                       value={formData.storeName}
//                       onChange={handleInputChange}
//                       className="pl-10"
//                       placeholder="Enter store name"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="manager" className="text-sm font-medium">Manager</Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="manager"
//                       name="manager"
//                       value={formData.manager}
//                       onChange={handleInputChange}
//                       className="pl-10"
//                       placeholder="Enter manager name"
//                     />
//                   </div>
//                 </div>

//                 {isEditMode && (
//                   <div className="space-y-2">
//                     <Label htmlFor="code" className="text-sm font-medium">Store Code</Label>
//                     <div className="relative">
//                       <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="code"
//                         name="code"
//                         value={editingStoreCode || ''}
//                         className="pl-10 bg-gray-100"
//                         disabled
//                       />
//                     </div>
//                     <p className="text-xs text-muted-foreground">Store code cannot be changed</p>
//                   </div>
//                 )}

//                 <div className="space-y-2">
//                   <Label htmlFor="status" className="text-sm font-medium">Status</Label>
//                   <Select
//                     value={formData.status}
//                     onValueChange={(value) => handleSelectChange('status', value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="ACTIVE">Active</SelectItem>
//                       <SelectItem value="INACTIVE">Inactive</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2 md:col-span-2">
//                   <Label htmlFor="address" className="flex items-center gap-1 text-sm font-medium">
//                     <span>Address</span>
//                     <span className="text-destructive">*</span>
//                   </Label>
//                   <div className="relative">
//                     <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="address"
//                       name="address"
//                       value={formData.address}
//                       onChange={handleInputChange}
//                       className="pl-10"
//                       placeholder="Enter store address"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="telephone" className="text-sm font-medium">Telephone</Label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="telephone"
//                       name="telephone"
//                       value={formData.telephone}
//                       onChange={handleInputChange}
//                       className="pl-10"
//                       placeholder="Enter telephone number"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-sm font-medium">Email</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="pl-10"
//                       placeholder="Enter email address"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-md">
//               <h2 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                 <MapPin className="h-5 w-5" />
//                 Store Logo
//               </h2>
//               <p className="text-muted-foreground mb-6">Upload a store logo</p>

//               <FileUpload
//                 onFileSelect={handleFileChange}
//                 currentFileUrl={formData.logo}
//                 accept="image/*"
//                 label="Store Logo"
//               />
//               <p className="text-xs text-muted-foreground mt-2">
//                 Upload an image or enter a URL for the store logo
//               </p>
//             </div>

//             <div className="flex justify-end gap-4 pt-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => router.back()}
//                 className="flex items-center gap-2"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={createStoreMutation.isPending}
//                 className="gap-2 bg-accent hover:bg-accent/90 text-white"
//               >
//                 <Save className="w-4 h-4" />
//                 {createStoreMutation.isPending ? 'Processing...' : (isEditMode ? 'Update Store' : 'Create Store')}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }