// 'use client'
// import React, { useState, useEffect } from 'react';
// import { Button, buttonVariants } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { ArrowLeft, Save, User, Phone, Mail, Key, Globe, MapPin, Building, Loader2 } from 'lucide-react';
// import useOperations from '@/store/operationsStore';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import useGetLookup from "@/app/hooks/useGetLookup";
// import { SelectOption } from '@/types';
// import { usePermission } from '@/hooks/usePermission';

// interface UserFormData {
//   id: number;
//   username: string;
//   firstname: string;
//   middlename: string | null;
//   lastname: string;
//   email: string;
//   mobileNo: string;
//   userRole: string;
//   branchCode: string;
//   status: string;
//   password: string;
//   merchantCode: string;
//   storeCode: string;
//   merchantGroupCode: string;
//   entityCode: string;
//   country: string;
//   city: string | null;
//   address: string;
//   language: string;
//   gender: string | null;
//   dob: string;
//   bvn: string | null;
//   nin: string | null;
//   deviceId: string;
//   channelType: string;
//   verifyStatus: string;
//   authStatus: string;
//   referalCode: string;
//   walletNo: string | null;
//   identityNo: string | null;
//   identityType: string | null;
//   residentialAddress: string | null;
//   twoFactorType: string | null;
//   twoFactorLimit: number;
//   businessRegion: string | null;
//   businessName: string | null;
//   lga: string | null;
//   state: string | null;
//   supervisor: string | null;
// }

// export default function CreateUserPage() {
//   const { usePermissionGuard } = usePermission();

//   usePermissionGuard('MANAGE_USERS', {
//     redirectToNotPermitted: true,
//     toastMessage: "You don't have permission to manage users"
//   });

//   const searchParams = useSearchParams();
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingUsername, setEditingUsername] = useState<string | null>(null);
//   const { operations } = useOperations();
//   const router = useRouter();
//   const [isFormInitialized, setIsFormInitialized] = useState(false);

//   const userRolesOptions: SelectOption[] = useGetLookup('USER_ROLE');
//   const branchCodesOptions: SelectOption[] = useGetLookup('BRANCH_CODE');
//   const statusOptions: SelectOption[] = useGetLookup('STATUS');
//   const countryOptions: SelectOption[] = useGetLookup('COUNTRY');
//   const languageOptions: SelectOption[] = useGetLookup('LANGUAGE');
//   const genderOptions: SelectOption[] = useGetLookup('GENDER');
//   const identityTypeOptions: SelectOption[] = useGetLookup('IDENTITY_TYPE');
//   const twoFactorOptions: SelectOption[] = useGetLookup('TWO_FACTOR_TYPE');
//   const verifyStatusOptions: SelectOption[] = useGetLookup('VERIFY_STATUS');
//   const authStatusOptions: SelectOption[] = useGetLookup('AUTH_STATUS');

//   const [areLookupsReady, setAreLookupsReady] = useState(false);

//   useEffect(() => {
//     const requiredLookupsLoaded =
//       userRolesOptions.length > 0 &&
//       statusOptions.length > 0 &&
//       genderOptions.length > 0 &&
//       countryOptions.length > 0;

//     if (requiredLookupsLoaded) {
//       setAreLookupsReady(true);
//     } else {
//       const timer = setTimeout(() => {
//         console.warn('Lookups taking too long, proceeding anyway');
//         setAreLookupsReady(true);
//       }, 5000);

//       return () => clearTimeout(timer);
//     }
//   }, [
//     userRolesOptions,
//     branchCodesOptions,
//     countryOptions,
//     languageOptions,
//     genderOptions,
//     identityTypeOptions,
//     twoFactorOptions,
//     verifyStatusOptions,
//     authStatusOptions,
//     statusOptions,
//   ]);

//   const [formData, setFormData] = useState<UserFormData>({
//     id: 0,
//     username: '',
//     firstname: '',
//     middlename: null,
//     lastname: '',
//     email: '',
//     mobileNo: '',
//     userRole: '',
//     branchCode: '',
//     status: 'Active',
//     password: '',
//     merchantCode: '',
//     storeCode: '',
//     merchantGroupCode: '',
//     entityCode: '',
//     country: 'NG',
//     city: null,
//     address: '',
//     language: 'ENGLISH',
//     gender: '',
//     dob: '',
//     bvn: null,
//     nin: null,
//     deviceId: '0001',
//     channelType: 'POS',
//     verifyStatus: 'Y',
//     authStatus: 'Y',
//     referalCode: '',
//     walletNo: null,
//     identityNo: null,
//     identityType: null,
//     residentialAddress: null,
//     twoFactorType: null,
//     twoFactorLimit: 0.0,
//     businessRegion: null,
//     businessName: null,
//     lga: null,
//     state: null,
//     supervisor: null,
//   });

//   const { data: userData, isLoading: isLoadingUser } = useQuery({
//     queryKey: ['user-detail', editingUsername],
//     queryFn: () => {
//       const params = new URLSearchParams();
//       params.append('username', editingUsername || '');
//       params.append('entityCode', operations?.entityCode || '');

//       let queryString = params.toString();

//       return axiosOperations.request({
//         url: `/usermanager/getUserDetail?${queryString}`,
//         method: 'GET',
//       });
//     },
//     enabled: !!editingUsername && isEditMode,
//   });

//   useEffect(() => {
//     const editParam = searchParams.get('edit');

//     if (editParam === 'true') {
//       setIsEditMode(true);

//       const rawQueryString = window.location.search;
//       const urlParams = new URLSearchParams(rawQueryString);
//       const idParam = urlParams.get('id');

//       if (idParam) {
//         if (rawQueryString.includes('%2B')) {
//           setEditingUsername(decodeURIComponent(idParam));
//         } else if (rawQueryString.includes('+') && idParam.includes(' ')) {
//           const idMatch = rawQueryString.match(/id=([^&]+)/);
//           if (idMatch) {
//             const rawId = idMatch[1];
//             setEditingUsername(decodeURIComponent(rawId));
//           }
//         } else {
//           setEditingUsername(idParam);
//         }
//       }
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     if (userData?.data && isEditMode && !isFormInitialized) {
//       const user = userData.data;

//       setFormData(prev => ({
//         ...prev,
//         id: user.id || 0,
//         username: user.username || '',
//         firstname: user.firstname || '',
//         middlename: user.middlename || null,
//         lastname: user.lastname || '',
//         email: user.email || '',
//         mobileNo: user.mobileNo || '',
//         userRole: user.userRole || '',
//         branchCode: user.branchCode || '',
//         status: user.status || 'Active',
//         merchantCode: user.merchantCode || '',
//         storeCode: user.storeCode || '',
//         merchantGroupCode: user.merchantGroupCode || '',
//         entityCode: user.entityCode || '',
//         country: user.country || 'NG',
//         city: user.city || null,
//         address: user.address || '',
//         language: user.language || 'ENGLISH',
//         gender: user.gender || null,
//         dob: parseDDMMYYYYToInputDate(user.dob || ""),
//         bvn: user.bvn || null,
//         nin: user.nin || null,
//         deviceId: user.deviceId || '0001',
//         channelType: user.channelType || 'POS',
//         verifyStatus: user.verifyStatus || 'Y',
//         authStatus: user.authStatus || 'Y',
//         referalCode: user.referalCode || '',
//         walletNo: user.walletNo || null,
//         identityNo: user.identityNo || null,
//         identityType: user.identityType || null,
//         residentialAddress: user.residentialAddress || null,
//         twoFactorType: user.twoFactorType || null,
//         twoFactorLimit: user.twoFactorLimit || 0.0,
//         businessRegion: user.businessRegion || null,
//         businessName: user.businessName || null,
//         lga: user.lga || null,
//         state: user.state || null,
//         supervisor: user.supervisor || null,
//       }));

//       setIsFormInitialized(true);
//     }
//   }, [userData, isEditMode, operations]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value === '' ? null : value
//     }));
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value === '' ? null : value
//     }));
//   };

//   const createUserMutation = useMutation({
//     mutationFn: (userData: UserFormData) =>
//       axiosOperations.post('/usermanager/saveuser', userData),
//     onSuccess: (data) => {
//       if (data?.data?.code === '000') {
//         toast.success(isEditMode ? 'User updated successfully' : 'User created successfully');
//         router.push('/operations/users');
//       } else {
//         toast.error(data?.data?.desc || `Failed to ${isEditMode ? 'update' : 'create'} user`);
//       }
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} user`);
//     }
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const payload = {
//       ...formData,
//       id: isEditMode ? formData.id : 0,
//       username: isEditMode ? (editingUsername || '') : formData.username,
//       merchantCode: formData?.merchantCode || '',
//       storeCode: formData?.storeCode || '',
//       merchantGroupCode: formData?.merchantGroupCode || '',
//       entityCode: formData?.entityCode || 'FTD',
//     };

//     createUserMutation.mutate(payload);
//   };

//   const findLookupOption = (options: SelectOption[], value: string | null) => {
//     if (!value) return null;
//     return options.find(option => option.id === value);
//   };

//   const getSelectDisplayValue = (options: SelectOption[], value: string | null) => {
//     if (!value) return '';
//     const option = findLookupOption(options, value);
//     return option ? option.name : value;
//   };

//   const parseDDMMYYYYToInputDate = (dateString: string): string => {
//     if (!dateString) return "";

//     try {
//       const parts = dateString.split('-');
//       if (parts.length === 3) {
//         const day = parts[0].padStart(2, '0');
//         const month = parts[1].padStart(2, '0');
//         const year = parts[2];

//         const formattedDate = `${year}-${month}-${day}`;
//         const date = new Date(formattedDate);
//         if (!isNaN(date.getTime())) {
//           return formattedDate;
//         }
//       }

//       console.warn('Invalid date format:', dateString);
//       return "";
//     } catch (error) {
//       console.warn('Error parsing date:', dateString, error);
//       return "";
//     }
//   };

//   const isLookupsLoading = isEditMode && !areLookupsReady;

//   if (isLoadingUser) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
//             <Loader2 className="w-8 h-8 text-accent-foreground animate-spin" />
//           </div>
//           <p className="text-accent-foreground/70">
//             Loading user data...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="container mx-auto p-6">
//         <div className="flex items-center mb-6">
//           <Button
//             variant="ghost"
//             onClick={() => router.push('/operations/users')}
//             className="flex items-center gap-2 text-accent-foreground/70 hover:text-accent-foreground hover:bg-accent/10"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Users
//           </Button>
//         </div>

//         <div className="flex items-center justify-center mb-8">
//           <div className="text-center">
//             <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
//               <User className="w-8 h-8 text-accent-foreground" />
//             </div>
//             <h1 className="text-3xl font-bold text-accent-foreground">
//               {isEditMode ? 'Edit User' : 'Add New User'}
//             </h1>
//             <p className="text-accent-foreground/70 mt-2">
//               {isEditMode ? 'Update user information' : 'Create a new user account'}
//             </p>
//           </div>
//         </div>

//         <div className="max-w-6xl mx-auto">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-sm">
//               <h2 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 Personal Information
//               </h2>
//               <p className="text-accent-foreground/70 mb-6">User personal details and identification</p>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="firstname" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                     <span>First Name</span>
//                     <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-accent-foreground/70" />
//                     <Input
//                       id="firstname"
//                       name="firstname"
//                       value={formData.firstname}
//                       onChange={handleInputChange}
//                       className="pl-10 border-accent/20 text-accent-foreground"
//                       placeholder="Enter first name"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="lastname" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                     <span>Last Name</span>
//                     <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-accent-foreground/70" />
//                     <Input
//                       id="lastname"
//                       name="lastname"
//                       value={formData.lastname}
//                       onChange={handleInputChange}
//                       className="pl-10 border-accent/20 text-accent-foreground"
//                       placeholder="Enter last name"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="middlename" className="text-sm font-medium text-accent-foreground">
//                     Middle Name
//                   </Label>
//                   <Input
//                     id="middlename"
//                     name="middlename"
//                     value={formData.middlename || ''}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter middle name (optional)"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="username" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                     <span>Username</span>
//                     <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-accent-foreground/70" />
//                     <Input
//                       id="username"
//                       name="username"
//                       value={isEditMode ? editingUsername || '' : formData.username}
//                       onChange={handleInputChange}
//                       className="pl-10 border-accent/20 text-accent-foreground"
//                       placeholder="Enter username"
//                       required
//                       disabled={isEditMode}
//                     />
//                   </div>
//                   {isEditMode && (
//                     <p className="text-xs text-accent-foreground/70">Username cannot be changed</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-sm font-medium text-accent-foreground">Email</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 h-4 w-4 text-accent-foreground/70" />
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="pl-10 border-accent/20 text-accent-foreground"
//                       placeholder="Enter email address"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="mobileNo" className="text-sm font-medium text-accent-foreground">Mobile Number</Label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-3 h-4 w-4 text-accent-foreground/70" />
//                     <Input
//                       id="mobileNo"
//                       name="mobileNo"
//                       value={formData.mobileNo}
//                       onChange={handleInputChange}
//                       className="pl-10 border-accent/20 text-accent-foreground"
//                       placeholder="Enter mobile number"
//                     />
//                   </div>
//                 </div>

//                 {!isEditMode && (
//                   <div className="space-y-2">
//                     <Label htmlFor="password" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                       <span>Password</span>
//                       <span className="text-red-500">*</span>
//                     </Label>
//                     <div className="relative">
//                       <Key className="absolute left-3 top-3 h-4 w-4 text-accent-foreground/70" />
//                       <Input
//                         id="password"
//                         name="password"
//                         type="password"
//                         value={formData.password}
//                         onChange={handleInputChange}
//                         className="pl-10 border-accent/20 text-accent-foreground"
//                         placeholder="Enter password"
//                         required={!isEditMode}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 <div className="space-y-2">
//                   <Label htmlFor="dob" className="text-sm font-medium text-accent-foreground">Date of Birth</Label>
//                   <Input
//                     id="dob"
//                     name="dob"
//                     type="date"
//                     value={formData.dob}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="gender" className="text-sm font-medium text-accent-foreground">Gender</Label>
//                   {isLookupsLoading ? (
//                     <div className="flex items-center gap-2 p-3 border border-accent/20 rounded-md bg-accent/5 animate-pulse">
//                       <Loader2 className="h-4 w-4 animate-spin text-accent-foreground/70" />
//                       <span className="text-sm text-accent-foreground/70">Loading gender...</span>
//                     </div>
//                   ) : (
//                     <Select
//                       value={formData.gender || ''}
//                       onValueChange={(value) => handleSelectChange('gender', value)}
//                     >
//                       <SelectTrigger className="border-accent/20">
//                         <SelectValue placeholder="Select gender">
//                           {getSelectDisplayValue(genderOptions, formData.gender) || "Select gender"}
//                         </SelectValue>
//                       </SelectTrigger>
//                       <SelectContent>
//                         {genderOptions.map((gender) => (
//                           <SelectItem key={gender.id} value={gender.id}>
//                             {gender.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-sm">
//               <h2 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                 <Building className="h-5 w-5" />
//                 Role & Status
//               </h2>
//               <p className="text-accent-foreground/70 mb-6">User role, status and organizational details</p>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="userRole" className="text-sm font-medium text-accent-foreground">User Role</Label>
//                   {isLookupsLoading ? (
//                     <div className="flex items-center gap-2 p-3 border border-accent/20 rounded-md bg-accent/5 animate-pulse">
//                       <Loader2 className="h-4 w-4 animate-spin text-accent-foreground/70" />
//                       <span className="text-sm text-accent-foreground/70">Loading roles...</span>
//                     </div>
//                   ) : (
//                     <Select
//                       value={formData.userRole}
//                       onValueChange={(value) => handleSelectChange('userRole', value)}
//                     >
//                       <SelectTrigger className="border-accent/20">
//                         <SelectValue placeholder="Select user role">
//                           {getSelectDisplayValue(userRolesOptions, formData.userRole) || "Select user role"}
//                         </SelectValue>
//                       </SelectTrigger>
//                       <SelectContent>
//                         {userRolesOptions.map((role) => (
//                           <SelectItem key={role.id} value={role.id}>
//                             {role.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="branchCode" className="text-sm font-medium text-accent-foreground">Branch Code</Label>
//                   {isLookupsLoading ? (
//                     <div className="flex items-center gap-2 p-3 border border-accent/20 rounded-md bg-accent/5 animate-pulse">
//                       <Loader2 className="h-4 w-4 animate-spin text-accent-foreground/70" />
//                       <span className="text-sm text-accent-foreground/70">Loading branches...</span>
//                     </div>
//                   ) : (
//                     <Select
//                       value={formData.branchCode}
//                       onValueChange={(value) => handleSelectChange('branchCode', value)}
//                     >
//                       <SelectTrigger className="border-accent/20">
//                         <SelectValue placeholder="Select branch code">
//                           {getSelectDisplayValue(branchCodesOptions, formData.branchCode) || "Select branch code"}
//                         </SelectValue>
//                       </SelectTrigger>
//                       <SelectContent>
//                         {/* FIX: Use "NOT_ASSIGNED" instead of empty string */}
//                         <SelectItem value="NOT_ASSIGNED">Not Assigned</SelectItem>
//                         {branchCodesOptions.map((branch) => (
//                           <SelectItem key={branch.id} value={branch.id}>
//                             {branch.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="status" className="text-sm font-medium text-accent-foreground">Status</Label>
//                   {isLookupsLoading ? (
//                     <div className="flex items-center gap-2 p-3 border border-accent/20 rounded-md bg-accent/5 animate-pulse">
//                       <Loader2 className="h-4 w-4 animate-spin text-accent-foreground/70" />
//                       <span className="text-sm text-accent-foreground/70">Loading status options...</span>
//                     </div>
//                   ) : (
//                     <Select
//                       value={formData.status}
//                       onValueChange={(value) => handleSelectChange('status', value)}
//                     >
//                       <SelectTrigger className="border-accent/20">
//                         <SelectValue placeholder="Select status">
//                           {getSelectDisplayValue(statusOptions, formData.status) || "Select status"}
//                         </SelectValue>
//                       </SelectTrigger>
//                       <SelectContent>
//                         {statusOptions.map((status) => (
//                           <SelectItem key={status.id} value={status.id}>
//                             {status.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 </div>

//                 {/* <div className="space-y-2">
//                   <Label htmlFor="verifyStatus" className="text-sm font-medium text-accent-foreground">Verification Status</Label>
//                   <Select
//                     value={formData.verifyStatus}
//                     onValueChange={(value) => handleSelectChange('verifyStatus', value)}
//                   >
//                     <SelectTrigger className="border-accent/20">
//                       <SelectValue placeholder="Select verification status">
//                         {getSelectDisplayValue(verifyStatusOptions, formData.verifyStatus) || "Select verification status"}
//                       </SelectValue>
//                     </SelectTrigger>
//                     <SelectContent>
//                       {verifyStatusOptions.map((status) => (
//                         <SelectItem key={status.id} value={status.id}>
//                           {status.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="authStatus" className="text-sm font-medium text-accent-foreground">Auth Status</Label>
//                   <Select
//                     value={formData.authStatus}
//                     onValueChange={(value) => handleSelectChange('authStatus', value)}
//                   >
//                     <SelectTrigger className="border-accent/20">
//                       <SelectValue placeholder="Select auth status">
//                         {getSelectDisplayValue(authStatusOptions, formData.authStatus) || "Select auth status"}
//                       </SelectValue>
//                     </SelectTrigger>
//                     <SelectContent>
//                       {authStatusOptions.map((status) => (
//                         <SelectItem key={status.id} value={status.id}>
//                           {status.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div> */}

//                 <div className="space-y-2">
//                   <Label htmlFor="supervisor" className="text-sm font-medium text-accent-foreground">Supervisor</Label>
//                   <Input
//                     id="supervisor"
//                     name="supervisor"
//                     value={formData.supervisor || ''}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter supervisor username"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-sm">
//               <h2 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                 <MapPin className="h-5 w-5" />
//                 Location & Identity
//               </h2>
//               <p className="text-accent-foreground/70 mb-6">User location and identification information</p>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="country" className="text-sm font-medium text-accent-foreground">Country</Label>
//                   <div className="relative">
//                     <Globe className="absolute left-3 top-3 h-4 w-4 text-accent-foreground/70" />
//                     {isLookupsLoading ? (
//                       <div className="flex items-center gap-2 p-3 border border-accent/20 rounded-md bg-accent/5 animate-pulse pl-10">
//                         <Loader2 className="h-4 w-4 animate-spin text-accent-foreground/70" />
//                         <span className="text-sm text-accent-foreground/70">Loading countries...</span>
//                       </div>
//                     ) : (
//                       <Select
//                         value={formData.country}
//                         onValueChange={(value) => handleSelectChange('country', value)}
//                       >
//                         <SelectTrigger className="pl-10 border-accent/20">
//                           <SelectValue placeholder="Select country">
//                             {getSelectDisplayValue(countryOptions, formData.country) || "Select country"}
//                           </SelectValue>
//                         </SelectTrigger>
//                         <SelectContent>
//                           {countryOptions.map((country) => (
//                             <SelectItem key={country.id} value={country.id}>
//                               {country.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="state" className="text-sm font-medium text-accent-foreground">State</Label>
//                   <Input
//                     id="state"
//                     name="state"
//                     value={formData.state || ''}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter state"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="city" className="text-sm font-medium text-accent-foreground">City</Label>
//                   <Input
//                     id="city"
//                     name="city"
//                     value={formData.city || ''}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter city"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="lga" className="text-sm font-medium text-accent-foreground">LGA</Label>
//                   <Input
//                     id="lga"
//                     name="lga"
//                     value={formData.lga || ''}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter Local Government Area"
//                   />
//                 </div>

//                 <div className="space-y-2 col-span-2">
//                   <Label htmlFor="address" className="text-sm font-medium text-accent-foreground">Address</Label>
//                   <Input
//                     id="address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter address"
//                   />
//                 </div>

//                 <div className="space-y-2 col-span-2">
//                   <Label htmlFor="residentialAddress" className="text-sm font-medium text-accent-foreground">Residential Address</Label>
//                   <Input
//                     id="residentialAddress"
//                     name="residentialAddress"
//                     value={formData.residentialAddress || ''}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter residential address"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="bvn" className="text-sm font-medium text-accent-foreground">BVN</Label>
//                   <Input
//                     id="bvn"
//                     name="bvn"
//                     value={formData.bvn || ''}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter BVN"
//                     disabled={isEditMode}
//                     maxLength={11}
//                     onKeyDown={(e) => {
//                       if (
//                         !/\d/.test(e.key) &&
//                         e.key !== 'Backspace' &&
//                         e.key !== 'Delete' &&
//                         e.key !== 'Enter' &&
//                         e.key !== 'Tab' &&
//                         e.key !== 'ArrowLeft' &&
//                         e.key !== 'ArrowRight'
//                       ) {
//                         e.preventDefault();
//                       }
//                     }}
//                   />
//                   {isEditMode && (
//                     <p className="text-xs text-accent-foreground/70">BVN cannot be changed</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="nin" className="text-sm font-medium text-accent-foreground">NIN</Label>
//                   <Input
//                     id="nin"
//                     name="nin"
//                     value={formData.nin || ''}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter nin"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="identityNo" className="text-sm font-medium text-accent-foreground">Identity Number</Label>
//                   <Input
//                     id="identityNo"
//                     name="identityNo"
//                     value={formData.identityNo || ''}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter identity number"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="identityType" className="text-sm font-medium text-accent-foreground">Identity Type</Label>
//                   <Select
//                     value={formData.identityType || ''}
//                     onValueChange={(value) => handleSelectChange('identityType', value)}
//                   >
//                     <SelectTrigger className="border-accent/20">
//                       <SelectValue placeholder="Select identity type">
//                         {getSelectDisplayValue(identityTypeOptions, formData.identityType) || "Select identity type"}
//                       </SelectValue>
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="NOT_SPECIFIED">Not Specified</SelectItem>
//                       {identityTypeOptions.map((type) => (
//                         <SelectItem key={type.id} value={type.id}>
//                           {type.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-sm">
//               <h2 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                 <Building className="h-5 w-5" />
//                 Additional Information
//               </h2>
//               <p className="text-accent-foreground/70 mb-6">Additional user settings and preferences</p>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* <div className="space-y-2">
//                   <Label htmlFor="language" className="text-sm font-medium text-accent-foreground">Language</Label>
//                   <Select
//                     value={formData.language}
//                     onValueChange={(value) => handleSelectChange('language', value)}
//                   >
//                     <SelectTrigger className="border-accent/20">
//                       <SelectValue placeholder="Select language">
//                         {getSelectDisplayValue(languageOptions, formData.language) || "Select language"}
//                       </SelectValue>
//                     </SelectTrigger>
//                     <SelectContent>
//                       {languageOptions.map((language) => (
//                         <SelectItem key={language.id} value={language.id}>
//                           {language.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div> */}

//                 {/* <div className="space-y-2">
//                   <Label htmlFor="referalCode" className="text-sm font-medium text-accent-foreground">Referral Code</Label>
//                   <Input
//                     id="referalCode"
//                     name="referalCode"
//                     value={formData.referalCode}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter referral code"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="walletNo" className="text-sm font-medium text-accent-foreground">Wallet Number</Label>
//                   <Input
//                     id="walletNo"
//                     name="walletNo"
//                     value={formData.walletNo || ''}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter wallet number"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="twoFactorType" className="text-sm font-medium text-accent-foreground">Two-Factor Type</Label>
//                   <Select
//                     value={formData.twoFactorType || ''}
//                     onValueChange={(value) => handleSelectChange('twoFactorType', value)}
//                   >
//                     <SelectTrigger className="border-accent/20">
//                       <SelectValue placeholder="Select two-factor type">
//                         {getSelectDisplayValue(twoFactorOptions, formData.twoFactorType) || "Select two-factor type"}
//                       </SelectValue>
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="NONE">None</SelectItem>
//                       {twoFactorOptions.map((type) => (
//                         <SelectItem key={type.id} value={type.id}>
//                           {type.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="twoFactorLimit" className="text-sm font-medium text-accent-foreground">Two-Factor Limit</Label>
//                   <Input
//                     id="twoFactorLimit"
//                     name="twoFactorLimit"
//                     type="number"
//                     step="0.01"
//                     value={formData.twoFactorLimit}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter two-factor limit"
//                   />
//                 </div> */}

//                 <div className="space-y-2">
//                   <Label htmlFor="businessRegion" className="text-sm font-medium text-accent-foreground">Business Region</Label>
//                   <Input
//                     id="businessRegion"
//                     name="businessRegion"
//                     value={formData.businessRegion || ''}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter business region"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="businessName" className="text-sm font-medium text-accent-foreground">Business Name</Label>
//                   <Input
//                     id="businessName"
//                     name="businessName"
//                     value={formData.businessName || ''}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter business name"
//                     disabled={isEditMode}
//                   />
//                   {isEditMode && (
//                     <p className="text-xs text-accent-foreground/70">Business name cannot be changed</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="deviceId" className="text-sm font-medium text-accent-foreground">Device ID</Label>
//                   <Input
//                     id="deviceId"
//                     name="deviceId"
//                     value={formData.deviceId}
//                     onChange={handleInputChange}
//                     className="border-accent/20 text-accent-foreground"
//                     placeholder="Enter device ID"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end gap-4 pt-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => router.back()}
//                 className="flex items-center gap-2 border-accent/20 hover:bg-accent/10"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={createUserMutation.isPending}
//                 className="gap-2 bg-accent hover:bg-accent/90 text-white"
//               >
//                 <Save className="w-4 h-4" />
//                 {createUserMutation.isPending ? 'Processing...' : (isEditMode ? 'Update User' : 'Create User')}
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import useOperations from '@/store/operationsStore';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import useGetLookup from "@/app/hooks/useGetLookup";
import { SelectOption } from '@/types';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { DatePicker } from '@/components/ui/date-picker';
import { useFileUpload } from "@/app/hooks/useUpload";
import Image from "next/image";
import { X } from "lucide-react";
import { CameraIcon } from '@/components/icons/icons';

interface UserFormData {
  id: number;
  username: string;
  firstname: string;
  middlename: string | null;
  lastname: string;
  email: string;
  mobileNo: string;
  userRole: string;
  branchCode: string;
  status: string;
  password: string;
  merchantCode: string;
  storeCode: string;
  merchantGroupCode: string;
  entityCode: string;
  country: string;
  city: string | null;
  address: string;
  language: string;
  gender: string | null;
  dob: string;
  bvn: string | null;
  nin: string | null;
  deviceId: string;
  channelType: string;
  verifyStatus: string;
  authStatus: string;
  referalCode: string;
  walletNo: string | null;
  identityNo: string | null;
  identityType: string | null;
  residentialAddress: string | null;
  twoFactorType: string | null;
  twoFactorLimit: number;
  businessRegion: string | null;
  businessName: string | null;
  lga: string | null;
  state: string | null;
  supervisor: string | null;
  photoLink: string | null
}

const FormSection = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <div className="border-b border-gray-100 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="md:col-span-1 mt-1">
        <h2 className="text-sm font-semibold text-dark-gray">{title}</h2>
        <p className="text-xs text-medium-gray mt-1">{subtitle}</p>
      </div>
      <div className="md:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
  </div>
);

export default function CreateUserPage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [ageError, setAgeError] = useState<string | null>(null);
  usePageMetadata('User & Access Management', 'Manage users, roles, and access permissions.');

  const { usePermissionGuard } = usePermission();
  usePermissionGuard('MANAGE_USERS', {
    redirectToNotPermitted: true,
    toastMessage: "You don't have permission to manage users"
  });

  const searchParams = useSearchParams();
  const [editingUsername, setEditingUsername] = useState<string | null>(null);
  const { operations } = useOperations();
  const router = useRouter();
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const { fileUrl, handleFileChange, fileInputRef, previewUrl, setPreviewUrl, setFileUrl } = useFileUpload();
  const [photoLink, setPhotoLink] = useState<string | null>(null);

  const userRolesOptions: SelectOption[] = useGetLookup('USER_ROLE');
  const branchCodesOptions: SelectOption[] = useGetLookup('BRANCH_CODE');
  const statusOptions: SelectOption[] = useGetLookup('STATUS');
  const countryOptions: SelectOption[] = useGetLookup('COUNTRY');
  const genderOptions: SelectOption[] = useGetLookup('GENDER');
  const identityTypeOptions: SelectOption[] = useGetLookup('IDENTITY_TYPE');

  const getMaxDate = () => {
    const today = new Date();
    return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  };

  const [areLookupsReady, setAreLookupsReady] = useState(false);

  useEffect(() => {
    const requiredLookupsLoaded = userRolesOptions.length > 0 && statusOptions.length > 0 && genderOptions.length > 0 && countryOptions.length > 0;
    if (requiredLookupsLoaded) {
      setAreLookupsReady(true);
    } else {
      const timer = setTimeout(() => { setAreLookupsReady(true); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userRolesOptions, branchCodesOptions, countryOptions, genderOptions, identityTypeOptions, statusOptions]);

  const [formData, setFormData] = useState<UserFormData>({
    id: 0, username: '', firstname: '', middlename: null, lastname: '', email: '', mobileNo: '',
    userRole: '', branchCode: '', status: 'Active', password: '', merchantCode: '', storeCode: '',
    merchantGroupCode: '', entityCode: '', country: 'NG', city: null, address: '', language: 'ENGLISH',
    gender: '', dob: '', bvn: null, nin: null, deviceId: '0001', channelType: 'POS', verifyStatus: 'Y',
    authStatus: 'Y', referalCode: '', walletNo: null, identityNo: null, identityType: null,
    residentialAddress: null, twoFactorType: null, twoFactorLimit: 0.0, businessRegion: null,
    businessName: null, lga: null, state: null, supervisor: null, photoLink: null,
  });

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user-detail', editingUsername],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('username', editingUsername || '');
      params.append('entityCode', operations?.entityCode || '');
      return axiosOperations.request({ url: `/usermanager/getUserDetail?${params.toString()}`, method: 'GET' });
    },
    enabled: !!editingUsername && isEditMode,
  });

  useEffect(() => {
    const editParam = searchParams.get('edit');
    if (editParam === 'true') {
      setIsEditMode(true);
      const rawQueryString = window.location.search;
      const urlParams = new URLSearchParams(rawQueryString);
      const idParam = urlParams.get('id');
      if (idParam) {
        if (rawQueryString.includes('%2B')) {
          setEditingUsername(decodeURIComponent(idParam));
        } else if (rawQueryString.includes('+') && idParam.includes(' ')) {
          const idMatch = rawQueryString.match(/id=([^&]+)/);
          if (idMatch) setEditingUsername(decodeURIComponent(idMatch[1]));
        } else {
          setEditingUsername(idParam);
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (userData?.data && isEditMode && !isFormInitialized) {
      const user = userData.data;
      setFormData(prev => ({
        ...prev,
        dob: user.dob ? (() => {
          const [day, month, year] = user.dob.split('-');
          return `${year}-${month}-${day}`;
        })() : "",
        id: user.id || 0, username: user.username || '', firstname: user.firstname || '',
        middlename: user.middlename || null, lastname: user.lastname || '', email: user.email || '',
        mobileNo: user.mobileNo || '', userRole: user.userRole || '', branchCode: user.branchCode || '',
        status: user.status || 'Active', merchantCode: user.merchantCode || '', storeCode: user.storeCode || '',
        merchantGroupCode: user.merchantGroupCode || '', entityCode: user.entityCode || '',
        country: user.country || 'NG', city: user.city || null, address: user.address || '',
        language: user.language || 'ENGLISH', gender: user.gender || null,
        bvn: user.bvn || null, nin: user.nin || null, deviceId: user.deviceId || '0001',
        channelType: user.channelType || 'POS', verifyStatus: user.verifyStatus || 'Y',
        authStatus: user.authStatus || 'Y', referalCode: user.referalCode || '',
        walletNo: user.walletNo || null, identityNo: user.identityNo || null,
        identityType: user.identityType || null, residentialAddress: user.residentialAddress || null,
        twoFactorType: user.twoFactorType || null, twoFactorLimit: user.twoFactorLimit || 0.0,
        businessRegion: user.businessRegion || null, businessName: user.businessName || null,
        lga: user.lga || null, state: user.state || null, supervisor: user.supervisor || null, photoLink: user.photoLink || null
      }));
      setIsFormInitialized(true);
    }
  }, [userData, isEditMode, operations]);

  useEffect(() => {
    if (fileUrl) {
      setFormData(prev => ({ ...prev, photoLink: fileUrl }));
    }
  }, [fileUrl]);

  useEffect(() => {
    if (formData.photoLink && formData.photoLink.startsWith('http')) {
      setPreviewUrl(formData.photoLink);
    }
  }, [formData.photoLink]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? null : value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value === '' ? null : value }));
  };

  const createUserMutation = useMutation({
    mutationFn: (userData: UserFormData) => axiosOperations.post('/usermanager/saveuser', userData),
    onSuccess: (data) => {
      if (data?.data?.code === '000') {
        toast.success(isEditMode ? 'User updated successfully' : 'User created successfully');
        router.push('/operations/users');
      } else {
        toast.error(data?.data?.desc || `Failed to ${isEditMode ? 'update' : 'create'} user`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} user`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      id: isEditMode ? formData.id : 0,
      username: isEditMode ? (editingUsername || '') : formData.username,
      merchantCode: formData?.merchantCode || '',
      storeCode: formData?.storeCode || '',
      merchantGroupCode: formData?.merchantGroupCode || '',
      entityCode: formData?.entityCode || 'FTD',
      photoLink: fileUrl || formData.photoLink || null,
    };
    createUserMutation.mutate(payload);
  };

  const findLookupOption = (options: SelectOption[], value: string | null) => {
    if (!value) return null;
    return options.find(option => option.id === value);
  };

  const getSelectDisplayValue = (options: SelectOption[], value: string | null) => {
    if (!value) return '';
    const option = findLookupOption(options, value);
    return option ? option.name : value;
  };

  const validateAge = (dateString: string): string | null => {
    if (!dateString) return null;

    const [day, month, year] = dateString.split('/');
    const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18 ? null : "You must be at least 18 years old";
  };

  const isLookupsLoading = isEditMode && !areLookupsReady;

  const isBvnLocked = isEditMode && (formData.bvn?.length ?? 0) > 0;
  const isNinLocked = isEditMode && (formData.nin?.length ?? 0) > 0;


  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-faded-accent/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-text animate-spin" />
          </div>
          <p className="text-medium-gray">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl">
        <div className="mb-4">
          <Button variant="link" onClick={() => router.push('/operations/users')}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <div className='container mx-auto px-20 py-6'>
          <div className="mb-6">
            <h1 className="text-md lg:text-lg font-medium text-dark-gray">{isEditMode ? 'Edit User' : 'Create User'}</h1>
            <p className="text-xs lg:text-sm font-normal text-medium-gray">{isEditMode ? 'Update user information' : 'Create a new user account'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className='bg-white px-6 py-4 rounded-2xl'>
              <FormSection title="Personal Information" subtitle="User personal details and identification">
                <FormField label="First Name" required>
                  <Input name="firstname" value={formData.firstname} onChange={handleInputChange} placeholder="Enter first name" required />
                </FormField>
                <FormField label="Last Name" required>
                  <Input name="lastname" value={formData.lastname} onChange={handleInputChange} placeholder="Enter last name" required />
                </FormField>
                <FormField label="Middle Name">
                  <Input name="middlename" value={formData.middlename || ''} onChange={handleInputChange} placeholder="Enter middle name" />
                </FormField>
                <FormField label="Username" required>
                  <Input name="username" value={isEditMode ? editingUsername || '' : formData.username} onChange={handleInputChange} placeholder="Enter username" disabled={isEditMode} required />
                  {isEditMode && <p className="text-xs text-medium-gray mt-1">Username cannot be changed</p>}
                </FormField>
                <FormField label="Email">
                  <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter email address" />
                </FormField>
                <FormField label="Phone Number">
                  <Input name="mobileNo" value={formData.mobileNo} onChange={handleInputChange} placeholder="Enter phone number" />
                </FormField>
                {!isEditMode && (
                  <FormField label="Password" required>
                    <Input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Enter password" required={!isEditMode} />
                  </FormField>
                )}
                <FormField label="Date of Birth">
                  <DatePicker
                    value={formData.dob}
                    onChange={(dateString) => {
                      setFormData(prev => ({ ...prev, dob: dateString }));
                      const error = validateAge(dateString);
                      setAgeError(error);
                      if (error) {
                        toast.error(error);
                      }
                    }}
                    placeholder="dd/mm/yyyy"
                    maxDate={getMaxDate()}
                    disabled={isEditMode}
                    error={!!ageError}
                  />
                </FormField>
                <FormField label="Gender">
                  {isLookupsLoading ? (
                    <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-[#F5F5F5]">
                      <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                      <span className="text-sm text-medium-gray">Loading...</span>
                    </div>
                  ) : (
                    <Select value={formData.gender || ''} onValueChange={(value) => handleSelectChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender">
                          {getSelectDisplayValue(genderOptions, formData.gender) || "Select gender"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((gender) => (
                          <SelectItem key={gender.id} value={gender.id}>{gender.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>
              </FormSection>

              <FormSection title="Role and Status" subtitle="User roles, status and organization details">
                <FormField label="User Role">
                  {isLookupsLoading ? (
                    <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-[#F5F5F5]">
                      <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                      <span className="text-sm text-medium-gray">Loading roles...</span>
                    </div>
                  ) : (
                    <Select value={formData.userRole} onValueChange={(value) => handleSelectChange('userRole', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role">
                          {getSelectDisplayValue(userRolesOptions, formData.userRole) || "Select user role"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {userRolesOptions.map((role) => (
                          <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>
                <FormField label="Branch Code">
                  {isLookupsLoading ? (
                    <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-[#F5F5F5]">
                      <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                      <span className="text-sm text-medium-gray">Loading branches...</span>
                    </div>
                  ) : (
                    <Select value={formData.branchCode} onValueChange={(value) => handleSelectChange('branchCode', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch code">
                          {getSelectDisplayValue(branchCodesOptions, formData.branchCode) || "Select branch code"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NOT_ASSIGNED">Not Assigned</SelectItem>
                        {branchCodesOptions.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>
                <FormField label="Status">
                  {isLookupsLoading ? (
                    <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-[#F5F5F5]">
                      <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                      <span className="text-sm text-medium-gray">Loading status...</span>
                    </div>
                  ) : (
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status">
                          {getSelectDisplayValue(statusOptions, formData.status) || "Select status"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>
                <FormField label="Supervisor">
                  <Input name="supervisor" value={formData.supervisor || ''} onChange={handleInputChange} placeholder="Enter supervisor username" />
                </FormField>
              </FormSection>

              <FormSection title="Location and Identity" subtitle="User location and identification information">
                <FormField label="Country">
                  {isLookupsLoading ? (
                    <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-[#F5F5F5]">
                      <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                      <span className="text-sm text-medium-gray">Loading countries...</span>
                    </div>
                  ) : (
                    <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country">
                          {getSelectDisplayValue(countryOptions, formData.country) || "Select country"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {countryOptions.map((country) => (
                          <SelectItem key={country.id} value={country.id}>{country.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>
                <FormField label="State">
                  <Input name="state" value={formData.state || ''} onChange={handleInputChange} placeholder="Enter state" />
                </FormField>
                <FormField label="City">
                  <Input name="city" value={formData.city || ''} onChange={handleInputChange} placeholder="Enter city" />
                </FormField>
                <FormField label="L.G.A">
                  <Input name="lga" value={formData.lga || ''} onChange={handleInputChange} placeholder="Enter Local Government Area" />
                </FormField>
                <FormField label="Address">
                  <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter address" />
                </FormField>
                <FormField label="Residential Address">
                  <Input name="residentialAddress" value={formData.residentialAddress || ''} onChange={handleInputChange} placeholder="Enter residential address" />
                </FormField>
                <FormField label="BVN">
                  <Input
                    name="bvn"
                    value={formData.bvn || ''}
                    onChange={handleInputChange}
                    placeholder="Enter BVN"
                    disabled={isBvnLocked}
                    maxLength={11}
                  />
                  {isBvnLocked && <p className="text-xs text-medium-gray mt-1">BVN cannot be changed</p>}
                </FormField>

                <FormField label="NIN">
                  <Input
                    name="nin"
                    value={formData.nin || ''}
                    onChange={handleInputChange}
                    placeholder="Enter NIN"
                    disabled={isNinLocked}
                    maxLength={11}
                  />
                  {isNinLocked && <p className="text-xs text-medium-gray mt-1">NIN cannot be changed</p>}
                </FormField>
                <FormField label="Identity Type">
                  <Select value={formData.identityType || ''} onValueChange={(value) => handleSelectChange('identityType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select identity type">
                        {getSelectDisplayValue(identityTypeOptions, formData.identityType) || "Select identity type"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOT_SPECIFIED">Not Specified</SelectItem>
                      {identityTypeOptions.map((type) => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Identity Number">
                  <Input name="identityNo" value={formData.identityNo || ''} onChange={handleInputChange} placeholder="Enter identity number" />
                </FormField>
              </FormSection>

              <FormSection title="Additional Information" subtitle="Additional user settings and preferences">
                <FormField label="Business Name">
                  <Input name="businessName" value={formData.businessName || ''} onChange={handleInputChange} placeholder="Enter business name" disabled={isEditMode} />
                  {isEditMode && <p className="text-xs text-medium-gray mt-1">Business name cannot be changed</p>}
                </FormField>
                <FormField label="Business Region">
                  <Input name="businessRegion" value={formData.businessRegion || ''} onChange={handleInputChange} placeholder="Enter business region" />
                </FormField>
                <FormField label="Device ID">
                  <Input name="deviceId" value={formData.deviceId} onChange={handleInputChange} placeholder="Enter device ID" />
                </FormField>
              </FormSection>

              <FormSection title="Profile Photo" subtitle="Upload a profile photo for the user.">
                <div className="col-span-2">
                  <FormField label="Upload Photo">
                    <div className="space-y-4">
                      {previewUrl && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-gray-200">
                            <Image
                              src={previewUrl}
                              alt="Photo preview"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 text-sm text-medium-gray">Photo preview</div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, photoLink: null }));
                              setPreviewUrl('');
                              setFileUrl('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      <div className="border-2 border-dashed border-faded-accent rounded-lg p-6 text-center hover:border-orange-300 transition-colors">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="photo-upload"
                        />
                        <Label htmlFor="photo-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-2">
                            <CameraIcon className="w-8 h-8 text-faded-accent" />
                            <p className="text-sm text-dark-gray">
                              <span className="text-faded-accent font-medium">Click to upload</span>
                            </p>
                            <p className="text-xs text-medium-gray">PNG, JPG or WebP (max. 5MB)</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </FormField>
                </div>
              </FormSection>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="gap-2">
                Cancel
              </Button>
              <Button type="submit" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? 'Processing...' : (isEditMode ? 'Update User' : 'Create User')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}