// 'use client'
// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { ArrowLeft, Save, MapPin, Clock, Phone, Ruler, Loader2 } from 'lucide-react';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import useGetLookup from "@/app/hooks/useGetLookup";
// import { SelectOption } from '@/types';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { usePermission } from '@/hooks/usePermission';


// interface PickupLocationFormData {
//     id: number;
//     name: string;
//     location: string;
//     distance: number;
//     timeframe: string;
//     contact: string;
//     status: string;
//     amount: number;
// }

// export default function CreateEditPickupLocationPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('MANAGE_PICKUP_LOCATIONS', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to manage pickup locations"
//     });
//     const searchParams = useSearchParams();
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [editingId, setEditingId] = useState<number | null>(null);
//     const router = useRouter();
//     const statusOptions: SelectOption[] = useGetLookup('STATUS');
//     const [areLookupsReady, setAreLookupsReady] = useState(false);

//     const [formData, setFormData] = useState<PickupLocationFormData>({
//         id: 0,
//         name: '',
//         location: '',
//         distance: 0,
//         timeframe: '',
//         contact: '',
//         status: 'Active',
//         amount: 0,
//     });

//     const { data: locationData, isLoading: isLoadingLocation } = useQuery({
//         queryKey: ['pickup-location-detail', editingId],
//         queryFn: () => axiosOperations.request({
//             url: `/ecommerce/pickup-location/${editingId}`,
//             method: 'GET'
//         }),
//         enabled: !!editingId && isEditMode,
//     });

//     useEffect(() => {
//         const requiredLookupsLoaded =
//             statusOptions.length > 0;

//         if (requiredLookupsLoaded) {
//             setAreLookupsReady(true);
//         } else {
//             const timer = setTimeout(() => {
//                 console.warn('Lookups taking too long, proceeding anyway');
//                 setAreLookupsReady(true);
//             }, 5000);

//             return () => clearTimeout(timer);
//         }
//     }, [
//         statusOptions,
//     ]);

//     useEffect(() => {
//         const idParam = searchParams.get('id');

//         if (idParam) {
//             const id = parseInt(idParam);
//             if (!isNaN(id)) {
//                 setIsEditMode(true);
//                 setEditingId(id);
//             }
//         }
//     }, [searchParams]);

//     useEffect(() => {
//         if (locationData?.data?.pickupLocations?.[0] && isEditMode) {
//             const location = locationData.data.pickupLocations[0];
//             setFormData({
//                 id: location.id || 0,
//                 name: location.name || '',
//                 location: location.location || '',
//                 distance: location.distance || 0,
//                 timeframe: location.timeframe || '',
//                 contact: location.contact || '',
//                 status: location.status || 'Active',
//                 amount: location.amount || 0
//             });
//         }
//     }, [locationData, isEditMode]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;

//         if (name === 'distance') {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: parseFloat(value) || 0
//             }));
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }
//     };

//     const createLocationMutation = useMutation({
//         mutationFn: (locationData: PickupLocationFormData) =>
//             axiosOperations.post('/ecommerce/pickup-location/create', {
//                 id: 0,
//                 name: locationData.name,
//                 location: locationData.location,
//                 distance: locationData.distance,
//                 timeframe: locationData.timeframe,
//                 contact: locationData.contact,
//                 status: locationData.status,
//                 amount: locationData.amount
//             }),
//         onSuccess: (data) => {
//             if (data?.data?.code === '000') {
//                 toast.success('Pickup location created successfully');
//                 router.push('/operations/pickup-locations');
//             } else {
//                 toast.error(data?.data?.desc || 'Failed to create pickup location');
//             }
//         },
//         onError: (error: any) => {
//             toast.error(error.response?.data?.message || 'Failed to create pickup location');
//         }
//     });

//     const updateLocationMutation = useMutation({
//         mutationFn: (locationData: PickupLocationFormData) =>
//             axiosOperations.post('/ecommerce/pickup-location/create', {
//                 id: locationData.id,
//                 name: locationData.name,
//                 location: locationData.location,
//                 distance: locationData.distance,
//                 timeframe: locationData.timeframe,
//                 contact: locationData.contact,
//                 status: locationData.status,
//                 amount: locationData.amount
//             }),
//         onSuccess: (data) => {
//             if (data?.data?.code === '000') {
//                 toast.success('Pickup location updated successfully');
//                 router.push('/operations/pickup-locations');
//             } else {
//                 toast.error(data?.data?.desc || 'Failed to update pickup location');
//             }
//         },
//         onError: (error: any) => {
//             toast.error(error.response?.data?.message || 'Failed to update pickup location');
//         }
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!formData.name.trim()) {
//             toast.error('Name is required');
//             return;
//         }

//         if (!formData.location.trim()) {
//             toast.error('Location is required');
//             return;
//         }

//         if (formData.distance <= 0) {
//             toast.error('Distance must be greater than 0');
//             return;
//         }

//         if (!formData.timeframe.trim()) {
//             toast.error('Timeframe is required');
//             return;
//         }

//         if (!formData.contact.trim()) {
//             toast.error('Contact is required');
//             return;
//         }

//         if (isEditMode) {
//             updateLocationMutation.mutate(formData);
//         } else {
//             createLocationMutation.mutate(formData);
//         }
//     };

//     const handleSelectChange = (name: string, value: string) => {
//         setFormData(prev => ({
//             ...prev,
//             [name]: value === '' ? null : value
//         }));
//     };

//     const findLookupOption = (options: SelectOption[], value: string | null) => {
//         if (!value) return null;
//         return options.find(option => option.id === value);
//     };

//     const getSelectDisplayValue = (options: SelectOption[], value: string | null) => {
//         if (!value) return '';
//         const option = findLookupOption(options, value);
//         return option ? option.name : value;
//     };

//     const isLoading = isLoadingLocation || createLocationMutation.isPending || updateLocationMutation.isPending;

//     const isLookupsLoading = isEditMode && !areLookupsReady;

//     return (
//         <div className="min-h-screen bg-white">
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center mb-6">
//                     <Button
//                         variant="ghost"
//                         onClick={() => router.back()}
//                         className="flex items-center gap-2 text-accent-foreground/70 hover:text-accent-foreground hover:bg-accent/10"
//                     >
//                         <ArrowLeft className="w-4 h-4" />
//                         Back to Locations
//                     </Button>
//                 </div>

//                 <div className="flex items-center justify-center mb-8">
//                     <div className="text-center">
//                         <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
//                             <MapPin className="w-8 h-8 text-accent-foreground" />
//                         </div>
//                         <h1 className="text-3xl font-bold text-accent-foreground">
//                             {isEditMode ? 'Edit Pickup Location' : 'Add New Pickup Location'}
//                         </h1>
//                         <p className="text-accent-foreground/70 mt-2">
//                             {isEditMode ? 'Update pickup location information' : 'Add a new pickup location for e-commerce orders'}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="max-w-2xl mx-auto">
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-sm">
//                             <h2 className="text-lg font-semibold text-accent-foreground mb-2 flex items-center gap-2">
//                                 Location Information
//                             </h2>
//                             <p className="text-accent-foreground/70 mb-6">Enter pickup location details</p>

//                             <div className="space-y-6">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="name" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                                         <span>Location Name</span>
//                                         <span className="text-red-500">*</span>
//                                     </Label>
//                                     <div className="relative">
//                                         <MapPin className="absolute left-3 top-3 h-4 w-4 text-accent-foreground/70" />
//                                         <Input
//                                             id="name"
//                                             name="name"
//                                             value={formData.name}
//                                             onChange={handleInputChange}
//                                             className="pl-10 border-accent/20 text-accent-foreground"
//                                             placeholder="Enter location name"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="amount" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                                         <span>Amount (₦)</span>
//                                         <span className="text-red-500">*</span>
//                                     </Label>
//                                     <div className="relative">
//                                         <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                                             ₦
//                                         </span>
//                                         <Input
//                                             id="amount"
//                                             name="amount"
//                                             type="number"
//                                             step="0.01"
//                                             min="0"
//                                             value={formData.amount || ""}
//                                             onChange={handleInputChange}
//                                             className="pl-10 border-accent/20 text-accent-foreground"
//                                             placeholder="Enter amount in Naira"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="location" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                                         <span>Full Address</span>
//                                         <span className="text-red-500">*</span>
//                                     </Label>
//                                     <div className="relative">
//                                         <MapPin className="absolute left-3 top-3 h-4 w-4 text-accent-foreground/70" />
//                                         <Input
//                                             id="location"
//                                             name="location"
//                                             value={formData.location}
//                                             onChange={handleInputChange}
//                                             className="pl-10 border-accent/20 text-accent-foreground"
//                                             placeholder="Enter full address"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="distance" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                                             <span>Distance (meters)</span>
//                                             <span className="text-red-500">*</span>
//                                         </Label>
//                                         <div className="relative">
//                                             <Ruler className="absolute left-3 top-3 h-4 w-4 text-accent-foreground/70" />
//                                             <Input
//                                                 id="distance"
//                                                 name="distance"
//                                                 type="number"
//                                                 min="0"
//                                                 step="0.1"
//                                                 value={formData.distance}
//                                                 onChange={handleInputChange}
//                                                 className="pl-10 border-accent/20 text-accent-foreground"
//                                                 placeholder="Enter distance in meters"
//                                                 required
//                                             />
//                                         </div>
//                                         <p className="text-xs text-accent-foreground/70">
//                                             {formData.distance >= 1000
//                                                 ? `${(formData.distance / 1000).toFixed(1)} kilometers`
//                                                 : `${formData.distance} meters`}
//                                         </p>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="timeframe" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                                             <span>Timeframe</span>
//                                             <span className="text-red-500">*</span>
//                                         </Label>
//                                         <div className="relative">
//                                             <Clock className="absolute left-3 top-3 h-4 w-4 text-accent-foreground/70" />
//                                             <Input
//                                                 id="timeframe"
//                                                 name="timeframe"
//                                                 value={formData.timeframe}
//                                                 onChange={handleInputChange}
//                                                 className="pl-10 border-accent/20 text-accent-foreground"
//                                                 placeholder="e.g., 9AM-5PM, Mon-Fri"
//                                                 required
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className='space-y-4 grid grid-cols-1 md:grid-cols-2 items-center gap-6'>
//                                     <div className="space-y-2">
//                                         <Label htmlFor="contact" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                                             <span>Contact Information</span>
//                                             <span className="text-red-500">*</span>
//                                         </Label>
//                                         <div className="relative">
//                                             <Phone className="absolute left-3 top-3 h-4 w-4 text-accent-foreground/70" />
//                                             <Input
//                                                 id="contact"
//                                                 name="contact"
//                                                 value={formData.contact}
//                                                 onChange={handleInputChange}
//                                                 className="pl-10 border-accent/20 text-accent-foreground"
//                                                 placeholder="Enter phone number or contact details"
//                                                 required
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="status" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                                             <span>Status</span>
//                                             <span className="text-red-500">*</span>
//                                         </Label>
//                                         {isLookupsLoading ? (
//                                             <div className="flex items-center gap-2 p-3 border border-accent/20 rounded-md bg-accent/5 animate-pulse">
//                                                 <Loader2 className="h-4 w-4 animate-spin text-accent-foreground/70" />
//                                                 <span className="text-sm text-accent-foreground/70">Loading status options...</span>
//                                             </div>
//                                         ) : (
//                                             <Select
//                                                 value={formData.status}
//                                                 onValueChange={(value) => handleSelectChange('status', value)}
//                                             >
//                                                 <SelectTrigger className="border-accent/20">
//                                                     <SelectValue placeholder="Select status">
//                                                         {getSelectDisplayValue(statusOptions, formData.status) || "Select status"}
//                                                     </SelectValue>
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {statusOptions.map((status) => (
//                                                         <SelectItem key={status.id} value={status.id}>
//                                                             {status.name}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex justify-end gap-4 pt-4">
//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={() => router.back()}
//                                 className="flex items-center gap-2 border-accent/20 hover:bg-accent/10"
//                                 disabled={isLoading}
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 type="submit"
//                                 disabled={isLoading}
//                                 className="gap-2 bg-accent hover:bg-accent/90 text-white"
//                             >
//                                 <Save className="w-4 h-4" />
//                                 {isLoading ? 'Processing...' : (isEditMode ? 'Update Location' : 'Create Location')}
//                             </Button>
//                         </div>
//                     </form>
//                 </div>
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
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { toast } from 'sonner';
import useGetLookup from "@/app/hooks/useGetLookup";
import { SelectOption } from '@/types';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { getClientConfig } from '@/config/client-config';

interface PickupLocationFormData {
    id: number;
    name: string;
    location: string;
    distance: number;
    timeframe: string;
    contact: string;
    status: string;
    amount: number;
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

export default function CreateEditPickupLocationPage() {
    usePageMetadata('Pickup Locations', 'Create or edit pickup locations.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_PICKUP_LOCATIONS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage pickup locations"
    });

    const { enablePickupLocationDistance } = getClientConfig()?.features
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isFormInitialized, setIsFormInitialized] = useState(false);
    const statusOptions: SelectOption[] = useGetLookup('STATUS');

    const [formData, setFormData] = useState<PickupLocationFormData>({
        id: 0, name: '', location: '', distance: 0,
        timeframe: '', contact: '', status: 'ACTIVE', amount: 0,
    });

    const { data: locationData, isLoading: isLoadingLocation } = useQuery({
        queryKey: ['pickup-location-detail', editingId],
        queryFn: () => axiosInstance.request({
            url: `/ecommerce/pickup-location/${editingId}`,
            method: 'GET'
        }),
        enabled: !!editingId && isEditMode,
    });

    useEffect(() => {
        const idParam = searchParams.get('id');
        if (idParam) {
            const id = parseInt(idParam);
            if (!isNaN(id)) {
                setIsEditMode(true);
                setEditingId(id);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (locationData?.data?.pickupLocations?.[0] && isEditMode && !isFormInitialized) {
            const location = locationData.data.pickupLocations[0];
            setFormData({
                id: location.id || 0,
                name: location.name || '',
                location: location.location || '',
                distance: location.distance || 0,
                timeframe: location.timeframe || '',
                contact: location.contact || '',
                status: location.status || 'ACTIVE',
                amount: location.amount || 0
            });
            setIsFormInitialized(true);
        }
    }, [locationData, isEditMode, isFormInitialized]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'distance' || name === 'amount') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const saveLocationMutation = useMutation({
        mutationFn: (locationData: PickupLocationFormData) =>
            axiosInstance.post('/ecommerce/pickup-location/create', {
                id: locationData.id,
                name: locationData.name,
                location: locationData.location,
                distance: locationData.distance,
                timeframe: locationData.timeframe,
                contact: locationData.contact,
                status: locationData.status,
                amount: locationData.amount
            }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success(isEditMode ? 'Pickup location updated successfully' : 'Pickup location created successfully');
                router.push('/admin/pickup-locations');
            } else {
                toast.error(data?.data?.desc || 'Failed to save pickup location');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to save pickup location');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) { toast.error('Name is required'); return; }
        if (!formData.location.trim()) { toast.error('Location is required'); return; }
        if (formData.distance <= 0 && enablePickupLocationDistance) { toast.error('Distance must be greater than 0'); return; }
        if (!formData.timeframe.trim()) { toast.error('Timeframe is required'); return; }
        if (!formData.contact.trim()) { toast.error('Contact is required'); return; }
        saveLocationMutation.mutate(formData);
    };

    const isLoading = isLoadingLocation || saveLocationMutation.isPending;

    if (isLoadingLocation) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-medium-gray">Loading location data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl">
                <div className="mb-4">
                    <Button variant="link" onClick={() => router.push('/admin/pickup-locations')}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </div>

                <div className='container mx-auto px-20 py-6'>
                    <div className="mb-6">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">
                            {isEditMode ? 'Edit Pickup Location' : 'Add Pickup Location'}
                        </h1>
                        <p className="text-xs lg:text-sm font-normal text-medium-gray">
                            {isEditMode ? 'Update pickup location information' : 'Add a new pickup location for e-commerce orders'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className='bg-white px-6 py-4 rounded-2xl'>
                            <FormSection title="Location Information" subtitle="Pickup location details and address.">
                                <FormField label="Location Name" required>
                                    <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter location name" required />
                                </FormField>

                                <FormField label="Amount">
                                    <Input name="amount" type="number" step="0.01" min="0" value={formData.amount || ""} onChange={handleInputChange} placeholder="Enter amount" />
                                </FormField>

                                <div className="col-span-2">
                                    <FormField label="Full Address" required>
                                        <Input name="location" value={formData.location} onChange={handleInputChange} placeholder="Enter full address" required />
                                    </FormField>
                                </div>

                                {
                                    enablePickupLocationDistance && (
                                        <FormField label="Distance (meters)" required>
                                            <Input name="distance" type="number" min="0" step="0.1" value={formData.distance} onChange={handleInputChange} placeholder="Enter distance in meters" required />
                                            {formData.distance > 0 && (
                                                <p className="text-xs text-medium-gray">
                                                    {formData.distance >= 1000 ? `${(formData.distance / 1000).toFixed(1)} kilometers` : `${formData.distance} meters`}
                                                </p>
                                            )}
                                        </FormField>
                                    )
                                }

                                <FormField label="Timeframe" required>
                                    <Input name="timeframe" value={formData.timeframe} onChange={handleInputChange} placeholder="e.g., 9AM-5PM, Mon-Fri" required />
                                </FormField>

                                <FormField label="Contact Information" required>
                                    <Input name="contact" value={formData.contact} onChange={handleInputChange} placeholder="Enter phone number or contact details" required />
                                </FormField>

                                <FormField label="Status" required>
                                    <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((status) => (
                                                <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            </FormSection>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : (isEditMode ? 'Update Location' : 'Create Location')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}