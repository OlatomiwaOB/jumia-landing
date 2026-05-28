// 'use client'
// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { ArrowLeft, Save, User, Phone, Mail, Key } from 'lucide-react';
// import useUser from '@/store/userStore';
// import axiosInstance from '@/utils/fetch-function';
// import { useRouter, useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import useGetLookup from "@/app/hooks/useGetLookup";
// import { usePermission } from '@/hooks/usePermissionBusiness';


// interface StaffFormData {
//   username: string;
//   firstname: string;
//   lastname: string;
//   email: string;
//   mobileNo: string;
//   userRole: string;
//   branchCode: string;
//   status: string;
//   password: string;
//   merchantCode: string;
//   storeCode: string;
//   countryCode: string;
//   state: string;
//   businessRegion: string;
//   userlang: string;
//   deviceId: string;
//   channelType: string;
//   entityCode: string;
// }

// export default function CreateStaffPage() {
//   const { usePermissionGuard } = usePermission();

//   usePermissionGuard('MANAGE_USERS', {
//     redirectToNotPermitted: true,
//     toastMessage: "You don't have permission to manage users"
//   });
//   const searchParams = useSearchParams();
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingUsername, setEditingUsername] = useState<string | null>(null);
//   const { user } = useUser();
//   const router = useRouter();

//   const userRolesOptions = [{ value: 'CASHIER', name: 'Cashier' }, { value: 'SALES_REP', name: 'Sales Representative' }];
//   const branchCodesOptions = useGetLookup('BRANCH_CODE');
//   const statusOptions = [{ value: 'Active', name: 'Active' }, { value: 'Inactive', name: 'Inactive' }, { value: 'USER_LOCKED', name: 'Suspended' }];

//   const [formData, setFormData] = useState<StaffFormData>({
//     username: '',
//     firstname: '',
//     lastname: '',
//     email: '',
//     mobileNo: '',
//     userRole: '',
//     branchCode: '',
//     status: 'Active',
//     password: '',
//     merchantCode: user?.merchantCode || '',
//     storeCode: user?.storeCode || '',
//     countryCode: 'NG',
//     state: 'Lagos',
//     businessRegion: 'Lagos',
//     userlang: 'en',
//     deviceId: '0001',
//     channelType: 'POS',
//     entityCode: user?.entityCode || '',
//   });

//   const { data: staffData, isLoading: isLoadingStaff } = useQuery({
//     queryKey: ['staff-detail', editingUsername],
//     queryFn: () => axiosInstance.request({
//       url: '/usermanager/getUserDetail',
//       method: 'GET',
//       params: {
//         username: editingUsername,
//         entityCode: user?.entityCode || ''
//       }
//     }),
//     enabled: !!editingUsername && isEditMode,
//   });

//   useEffect(() => {
//     const editParam = searchParams.get('edit');
//     const idParam = searchParams.get('id');

//     if (editParam === 'true' && idParam) {
//       setIsEditMode(true);
//       setEditingUsername(idParam);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     if (staffData?.data && isEditMode) {
//       const staff = staffData.data;
//       setFormData(prev => ({
//         ...prev,
//         username: staff.username || '',
//         firstname: staff.firstname || '',
//         lastname: staff.lastname || '',
//         email: staff.email || '',
//         mobileNo: staff.mobileNo || '',
//         userRole: staff.userRole || '',
//         branchCode: staff.branchCode || '',
//         status: staff.status || 'ACTIVE',
//         merchantCode: staff.merchantCode || user?.merchantCode || '',
//         storeCode: staff.storeCode || user?.storeCode || '',
//       }));
//     }
//   }, [staffData, isEditMode, user]);

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

//   const createStaffMutation = useMutation({
//     mutationFn: (staffData: StaffFormData) =>
//       axiosInstance.post('/usermanager/saveuser', staffData),
//     onSuccess: (data) => {
//       if (data?.data?.code === '000') {
//         toast.success(isEditMode ? 'User updated successfully' : 'User created successfully');
//         router.push('/admin/users');
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
//       username: isEditMode ? (editingUsername || '') : formData.username,
//       merchantCode: user?.merchantCode || '',
//       storeCode: user?.storeCode || '',
//       // bvn: '00000000000', 
//     };

//     createStaffMutation.mutate(payload);
//   };

//   if (isLoadingStaff) {
//     return (
//       <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500">Loading user data...</p>
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
//             className=""
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
//             <p className="text-muted-foreground mt-2">
//               {isEditMode ? 'Update user information' : 'Add a new user member to your store'}
//             </p>
//           </div>
//         </div>

//         <div className="max-w-4xl mx-auto">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-md">
//               <h2 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 Personal Information
//               </h2>
//               <p className="text-muted-foreground mb-6">User personal details and identification</p>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="firstname" className="flex items-center gap-1 text-sm font-medium">
//                     <span>First Name</span>
//                     <span className="text-destructive">*</span>
//                   </Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="firstname"
//                       name="firstname"
//                       value={formData.firstname}
//                       onChange={handleInputChange}
//                       className="pl-10"
//                       placeholder="Enter first name"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="lastname" className="flex items-center gap-1 text-sm font-medium">
//                     <span>Last Name</span>
//                     <span className="text-destructive">*</span>
//                   </Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="lastname"
//                       name="lastname"
//                       value={formData.lastname}
//                       onChange={handleInputChange}
//                       className="pl-10"
//                       placeholder="Enter last name"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="username" className="flex items-center gap-1 text-sm font-medium">
//                     <span>Username</span>
//                     <span className="text-destructive">*</span>
//                   </Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="username"
//                       name="username"
//                       value={isEditMode ? editingUsername || '' : formData.username}
//                       onChange={handleInputChange}
//                       className="pl-10"
//                       placeholder="Enter username"
//                       required
//                       disabled={isEditMode}
//                     />
//                   </div>
//                   {isEditMode && (
//                     <p className="text-xs text-muted-foreground">Username cannot be changed</p>
//                   )}
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

//                 <div className="space-y-2">
//                   <Label htmlFor="mobileNo" className="text-sm font-medium">Mobile Number</Label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="mobileNo"
//                       name="mobileNo"
//                       value={formData.mobileNo}
//                       onChange={handleInputChange}
//                       className="pl-10"
//                       placeholder="Enter mobile number"
//                     />
//                   </div>
//                 </div>

//                 {!isEditMode && (
//                   <div className="space-y-2">
//                     <Label htmlFor="password" className="flex items-center gap-1 text-sm font-medium">
//                       <span>Password</span>
//                       <span className="text-destructive">*</span>
//                     </Label>
//                     <div className="relative">
//                       <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="password"
//                         name="password"
//                         type="password"
//                         value={formData.password}
//                         onChange={handleInputChange}
//                         className="pl-10"
//                         placeholder="Enter password"
//                         required={!isEditMode}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-md">
//               <h2 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 Role & Status
//               </h2>
//               <p className="text-muted-foreground mb-6">User role and account status</p>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="userRole" className="text-sm font-medium">User Role</Label>
//                   <Select
//                     value={formData.userRole}
//                     onValueChange={(value) => handleSelectChange('userRole', value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select user role" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {userRolesOptions.map(role => (
//                         <SelectItem key={role.value} value={role.value}>
//                           {role.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {userRolesOptions.length === 0 && (
//                     <p className="text-xs text-muted-foreground">Loading user roles...</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="branchCode" className="text-sm font-medium">Branch Code</Label>
//                   <Select
//                     value={formData.branchCode}
//                     onValueChange={(value) => handleSelectChange('branchCode', value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select branch code" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {branchCodesOptions.map((branch) => (
//                         <SelectItem key={branch.id} value={branch.id}>
//                           {branch.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {branchCodesOptions.length === 0 && (
//                     <p className="text-xs text-muted-foreground">Loading branch codes...</p>
//                   )}
//                 </div>

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
//                       {statusOptions.map(option => (
//                         <SelectItem key={option.value} value={option.value}>
//                           {option.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {statusOptions.length === 0 && (
//                     <p className="text-xs text-muted-foreground">Loading status options...</p>
//                   )}
//                 </div>
//               </div>
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
//                 disabled={createStaffMutation.isPending}
//                 className="gap-2 bg-accent hover:bg-accent/90 text-white"
//               >
//                 <Save className="w-4 h-4" />
//                 {createStaffMutation.isPending ? 'Processing...' : (isEditMode ? 'Update Staff' : 'Create Staff')}
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
import useUser from '@/store/userStore';
import axiosInstance from '@/utils/fetch-function';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import useGetLookup from "@/app/hooks/useGetLookup";
import { usePermission } from '@/hooks/usePermissionBusiness';

interface StaffFormData {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    mobileNo: string;
    userRole: string;
    branchCode: string;
    status: string;
    password: string;
    merchantCode: string;
    storeCode: string;
    countryCode: string;
    state: string;
    businessRegion: string;
    userlang: string;
    deviceId: string;
    channelType: string;
    entityCode: string;
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

const FormField = ({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) => (
    <div className={`space-y-1.5 ${className || ''}`}>
        <Label>{label} {required && <span className="text-red-500">*</span>}</Label>
        {children}
    </div>
);

export default function CreateStaffPage() {
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_USERS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage users"
    });

    const searchParams = useSearchParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingUsername, setEditingUsername] = useState<string | null>(null);
    const { user } = useUser();
    const router = useRouter();

    const userRolesOptions = [{ value: 'CASHIER', name: 'Cashier' }, { value: 'SALES_REP', name: 'Sales Representative' }];
    const branchCodesOptions = useGetLookup('BRANCH_CODE');
    const statusOptions = [{ value: 'Active', name: 'Active' }, { value: 'Inactive', name: 'Inactive' }, { value: 'USER_LOCKED', name: 'Suspended' }];

    const [formData, setFormData] = useState<StaffFormData>({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        mobileNo: '',
        userRole: '',
        branchCode: '',
        status: 'Active',
        password: '',
        merchantCode: user?.merchantCode || '',
        storeCode: user?.storeCode || '',
        countryCode: 'NG',
        state: 'Lagos',
        businessRegion: 'Lagos',
        userlang: 'en',
        deviceId: '0001',
        channelType: 'POS',
        entityCode: user?.entityCode || '',
    });

    const { data: staffData, isLoading: isLoadingStaff } = useQuery({
        queryKey: ['staff-detail', editingUsername],
        queryFn: () => axiosInstance.request({
            url: '/usermanager/getUserDetail',
            method: 'GET',
            params: {
                username: editingUsername,
                entityCode: user?.entityCode || ''
            }
        }),
        enabled: !!editingUsername && isEditMode,
    });

    useEffect(() => {
        const editParam = searchParams.get('edit');
        const idParam = searchParams.get('id');

        if (editParam === 'true' && idParam) {
            setIsEditMode(true);
            setEditingUsername(idParam);
        }
    }, [searchParams]);

    useEffect(() => {
        if (staffData?.data && isEditMode) {
            const staff = staffData.data;
            setFormData(prev => ({
                ...prev,
                username: staff.username || '',
                firstname: staff.firstname || '',
                lastname: staff.lastname || '',
                email: staff.email || '',
                mobileNo: staff.mobileNo || '',
                userRole: staff.userRole || '',
                branchCode: staff.branchCode || '',
                status: staff.status || 'ACTIVE',
                merchantCode: staff.merchantCode || user?.merchantCode || '',
                storeCode: staff.storeCode || user?.storeCode || '',
            }));
        }
    }, [staffData, isEditMode, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const createStaffMutation = useMutation({
        mutationFn: (staffData: StaffFormData) =>
            axiosInstance.post('/usermanager/saveuser', staffData),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success(isEditMode ? 'User updated successfully' : 'User created successfully');
                router.push('/admin/users');
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
            username: isEditMode ? (editingUsername || '') : formData.username,
            merchantCode: user?.merchantCode || '',
            storeCode: user?.storeCode || '',
        };

        createStaffMutation.mutate(payload);
    };

    if (isLoadingStaff) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-medium-gray">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl">
                <div className="mb-4">
                    <Button variant="link" onClick={() => router.push('/admin/users')}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </div>

                <div className='container mx-auto px-20 py-6'>
                    <div className="mb-6">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">
                            {isEditMode ? 'Edit User' : 'Create User'}
                        </h1>
                        <p className="text-xs lg:text-sm font-normal text-medium-gray">
                            {isEditMode ? 'Update user information' : 'Add a new user member to your store'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className='bg-white px-6 py-4 rounded-2xl'>
                            <FormSection title="Personal Information" subtitle="User personal details and identification.">
                                <FormField label="First Name" required>
                                    <Input
                                        id="firstname"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleInputChange}
                                        placeholder="Enter first name"
                                        required
                                    />
                                </FormField>

                                <FormField label="Last Name" required>
                                    <Input
                                        id="lastname"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleInputChange}
                                        placeholder="Enter last name"
                                        required
                                    />
                                </FormField>

                                <FormField label="Username" required>
                                    <Input
                                        id="username"
                                        name="username"
                                        value={isEditMode ? editingUsername || '' : formData.username}
                                        onChange={handleInputChange}
                                        placeholder="Enter username"
                                        required
                                        disabled={isEditMode}
                                    />
                                    {isEditMode && (
                                        <p className="text-xs text-medium-gray mt-1">Username cannot be changed</p>
                                    )}
                                </FormField>

                                <FormField label="Email">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter email address"
                                    />
                                </FormField>

                                <FormField label="Mobile Number">
                                    <Input
                                        id="mobileNo"
                                        name="mobileNo"
                                        value={formData.mobileNo}
                                        onChange={handleInputChange}
                                        placeholder="Enter mobile number"
                                    />
                                </FormField>

                                {!isEditMode && (
                                    <FormField label="Password" required>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter password"
                                            required={!isEditMode}
                                        />
                                    </FormField>
                                )}
                            </FormSection>

                            <FormSection title="Role & Status" subtitle="User role and account status.">
                                <FormField label="User Role">
                                    <Select
                                        value={formData.userRole}
                                        onValueChange={(value) => handleSelectChange('userRole', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {userRolesOptions.map(role => (
                                                <SelectItem key={role.value} value={role.value}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {userRolesOptions.length === 0 && (
                                        <p className="text-xs text-muted-foreground">Loading user roles...</p>
                                    )}
                                </FormField>

                                <FormField label="Branch Code">
                                    <Select
                                        value={formData.branchCode}
                                        onValueChange={(value) => handleSelectChange('branchCode', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select branch code" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branchCodesOptions.map((branch) => (
                                                <SelectItem key={branch.id} value={branch.id}>
                                                    {branch.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {branchCodesOptions.length === 0 && (
                                        <p className="text-xs text-muted-foreground">Loading branch codes...</p>
                                    )}
                                </FormField>

                                <FormField label="Status">
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleSelectChange('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {statusOptions.length === 0 && (
                                        <p className="text-xs text-muted-foreground">Loading status options...</p>
                                    )}
                                </FormField>
                            </FormSection>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createStaffMutation.isPending}
                            >
                                {createStaffMutation.isPending ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                                ) : (
                                    isEditMode ? 'Update User' : 'Create User'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}