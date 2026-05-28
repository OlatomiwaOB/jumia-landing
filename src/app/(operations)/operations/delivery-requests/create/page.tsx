'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { DatePicker } from '@/components/ui/date-picker';

interface DeliveryRequestFormData {
    id: number;
    orderRefNo: string;
    storeCode: string;
    storeName: string;
    pickupLocation: string;
    deliveryLocation: string;
    packageSize: string;
    weightKg: number;
    length: number;
    width: number;
    height: number;
    deliveredBy: string;
    deliverySpeed: string;
    deliveryDate: string;
    status: string;
    currentLocation: string;
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

export default function EditDeliveryRequestPage() {
    usePageMetadata('Delivery Requests', 'Create or edit delivery requests.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_DELIVERY_REQUESTS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage delivery requests"
    });

    const searchParams = useSearchParams();
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isFormInitialized, setIsFormInitialized] = useState(false);

    const [formData, setFormData] = useState<DeliveryRequestFormData>({
        id: 0, orderRefNo: '', storeCode: '', storeName: '',
        pickupLocation: '', deliveryLocation: '', packageSize: 'SMALL',
        weightKg: 0, length: 0, width: 0, height: 0,
        deliveredBy: '', deliverySpeed: 'MEDIUM', deliveryDate: '',
        status: 'PENDING', currentLocation: ''
    });

    const requestId = searchParams.get('id');

    const { data: requestData, isLoading: isLoadingRequest } = useQuery({
        queryKey: ['delivery-request-detail', requestId],
        queryFn: async () => {
            if (!requestId) throw new Error('Request ID is required');
            const response = await axiosOperations.request({
                url: `/delivery-request/fetch`,
                params: { deliveryRequestId: requestId },
                method: 'GET'
            });
            return response.data;
        },
        enabled: !!requestId,
    });

    useEffect(() => {
        if (requestId) {
            setIsEditMode(true);
            setEditingId(Number(requestId));
        }
    }, [requestId]);

    useEffect(() => {
        if (requestData?.deliveryRequests?.[0] && isEditMode && !isFormInitialized) {
            const request = requestData.deliveryRequests[0];
            setFormData({
                id: request.id || 0,
                orderRefNo: request.orderRefNo || '',
                storeCode: request.storeCode || '',
                storeName: request.storeName || '',
                pickupLocation: request.pickupLocation || '',
                deliveryLocation: request.deliveryLocation || '',
                packageSize: request.packageSize || 'SMALL',
                weightKg: request.weightKg || 0,
                length: request.length || 0,
                width: request.width || 0,
                height: request.height || 0,
                deliveredBy: request.deliveredBy || '',
                deliverySpeed: request.deliverySpeed || 'MEDIUM',
                deliveryDate: request.deliveryDate || '',
                status: request.status || 'PENDING',
                currentLocation: request.currentLocation || ''
            });
            setIsFormInitialized(true);
        }
    }, [requestData, isEditMode, isFormInitialized]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (['weightKg', 'length', 'width', 'height'].includes(name)) {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const saveRequestMutation = useMutation({
        mutationFn: (requestData: DeliveryRequestFormData) =>
            axiosOperations.post('/delivery-request/save', requestData),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success(isEditMode ? 'Delivery request updated successfully' : 'Delivery request created successfully');
                router.push('/operations/delivery-requests');
            } else {
                toast.error(data?.data?.desc || 'Failed to save delivery request');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to save delivery request');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.pickupLocation.trim()) { toast.error('Pickup location is required'); return; }
        if (!formData.deliveryLocation.trim()) { toast.error('Delivery location is required'); return; }
        if (formData.weightKg <= 0) { toast.error('Weight must be greater than 0'); return; }
        saveRequestMutation.mutate(formData);
    };

    const packageSizeOptions = [
        { value: 'SMALL', label: 'Small' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'LARGE', label: 'Large' }
    ];

    const deliverySpeedOptions = [
        { value: 'FAST', label: 'Fast' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'NEXT_DAY', label: 'Next Day' }
    ];

    const statusOptions = [
        { value: 'PENDING', label: 'Pending' },
        { value: 'PICKED', label: 'Picked' },
        { value: 'IN_TRANSIT', label: 'In Transit' },
        { value: 'DELIVERED', label: 'Delivered' },
        { value: 'CANCELLED', label: 'Cancelled' },
        { value: 'RETURNED', label: 'Returned' }
    ];

    const isLoading = isLoadingRequest || saveRequestMutation.isPending;

    if (isLoadingRequest) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-medium-gray">Loading request data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl">
                <div className="mb-4">
                    <Button variant="link" onClick={() => router.push('/operations/delivery-requests')}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </div>

                <div className='container mx-auto px-20 py-6'>
                    <div className="mb-6">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">
                            {isEditMode ? 'Edit Delivery Request' : 'Create Delivery Request'}
                        </h1>
                        <p className="text-xs lg:text-sm font-normal text-medium-gray">
                            {isEditMode ? 'Update delivery request information' : 'Create a new delivery request'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className='bg-white px-6 py-4 rounded-2xl'>
                            <FormSection title="Delivery Request Information" subtitle="Update delivery request details.">
                                {isEditMode && (
                                    <>
                                        <FormField label="Order Reference">
                                            <Input name="orderRefNo" value={formData.orderRefNo} disabled className="bg-gray-50" />
                                            <p className="text-xs text-medium-gray mt-1">Reference cannot be changed</p>
                                        </FormField>
                                        <FormField label="Store Name">
                                            <Input name="storeName" value={formData.storeName} disabled className="bg-gray-50" />
                                            <p className="text-xs text-medium-gray mt-1">Store cannot be changed</p>
                                        </FormField>
                                    </>
                                )}

                                <div className="col-span-2">
                                    <FormField label="Pickup Location" required>
                                        <Input name="pickupLocation" value={formData.pickupLocation} onChange={handleInputChange} placeholder="Enter pickup location" required />
                                    </FormField>
                                </div>
                                <div className="col-span-2">
                                    <FormField label="Delivery Location" required>
                                        <Input name="deliveryLocation" value={formData.deliveryLocation} onChange={handleInputChange} placeholder="Enter delivery location" required />
                                    </FormField>
                                </div>

                                <FormField label="Package Size" required>
                                    <Select value={formData.packageSize} onValueChange={(value) => handleSelectChange('packageSize', value)}>
                                        <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                                        <SelectContent>
                                            {packageSizeOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField label="Delivery Speed" required>
                                    <Select value={formData.deliverySpeed} onValueChange={(value) => handleSelectChange('deliverySpeed', value)}>
                                        <SelectTrigger><SelectValue placeholder="Select speed" /></SelectTrigger>
                                        <SelectContent>
                                            {deliverySpeedOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField label="Status" required>
                                    <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField label="Weight (kg)" required>
                                    <Input name="weightKg" type="number" min="0" step="0.1" value={formData.weightKg} onChange={handleInputChange} placeholder="0.0" required />
                                </FormField>

                                <FormField label="Length (cm)">
                                    <Input name="length" type="number" min="0" value={formData.length} onChange={handleInputChange} placeholder="0" />
                                </FormField>

                                <FormField label="Width (cm)">
                                    <Input name="width" type="number" min="0" value={formData.width} onChange={handleInputChange} placeholder="0" />
                                </FormField>

                                <FormField label="Height (cm)">
                                    <Input name="height" type="number" min="0" value={formData.height} onChange={handleInputChange} placeholder="0" />
                                </FormField>

                                <FormField label="Delivered By">
                                    <Input name="deliveredBy" value={formData.deliveredBy} onChange={handleInputChange} placeholder="Enter rider name" />
                                </FormField>

                                <FormField label="Current Location">
                                    <Input name="currentLocation" value={formData.currentLocation} onChange={handleInputChange} placeholder="Enter current location" />
                                </FormField>

                                <FormField label="Delivery Date">
                                    <DatePicker
                                        value={formData.deliveryDate}
                                        onChange={(dateString) => setFormData(prev => ({ ...prev, deliveryDate: dateString }))}
                                        placeholder="dd/mm/yyyy"
                                    />
                                </FormField>
                            </FormSection>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : (isEditMode ? 'Update Request' : 'Create Request')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}