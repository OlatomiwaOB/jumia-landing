'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Package, Truck, Ruler, Weight, MapPin, Loader2 } from 'lucide-react';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePermission } from '@/hooks/usePermission';

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

export default function EditDeliveryRequestPage() {
    // const { usePermissionGuard } = usePermission();

    // usePermissionGuard('MANAGE_DELIVERY_REQUESTS', {
    //     redirectToNotPermitted: true,
    //     toastMessage: "You don't have permission to manage delivery requests"
    // });
    const searchParams = useSearchParams();
    const requestId = searchParams.get('id');
    const router = useRouter();

    const packageSizeSelectRef = React.useRef<HTMLButtonElement>(null);
    const deliverySpeedSelectRef = React.useRef<HTMLButtonElement>(null);
    const statusSelectRef = React.useRef<HTMLButtonElement>(null);

    const [formData, setFormData] = useState<DeliveryRequestFormData>({
        id: 0,
        orderRefNo: '',
        storeCode: '',
        storeName: '',
        pickupLocation: '',
        deliveryLocation: '',
        packageSize: 'SMALL',
        weightKg: 0,
        length: 0,
        width: 0,
        height: 0,
        deliveredBy: '',
        deliverySpeed: 'MEDIUM',
        deliveryDate: '',
        status: 'PENDING',
        currentLocation: ''
    });

    const { data: requestData, isLoading: isLoadingRequest, error: requestError } = useQuery({
        queryKey: ['delivery-request-detail', requestId],
        queryFn: async () => {
            if (!requestId) throw new Error('Request ID is required');
            const response = await axiosOperations.request({
                url: `/delivery-request/fetch`,
                params: {
                    deliveryRequestId: requestId
                },
                method: 'GET'
            });
            return response.data;
        },
        enabled: !!requestId,
    });

    useEffect(() => {
        if (requestData?.deliveryRequests?.[0]) {
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
        }
    }, [requestData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (['weightKg', 'length', 'width', 'height'].includes(name)) {
            setFormData(prev => ({
                ...prev,
                [name]: parseFloat(value) || 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const updateRequestMutation = useMutation({
        mutationFn: (requestData: DeliveryRequestFormData) =>
            axiosOperations.post('/delivery-request/save', requestData),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Delivery request updated successfully');
                router.push('/operations/delivery-requests');
            } else {
                toast.error(data?.data?.desc || 'Failed to update delivery request');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update delivery request');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.pickupLocation.trim()) {
            toast.error('Pickup location is required');
            return;
        }

        if (!formData.deliveryLocation.trim()) {
            toast.error('Delivery location is required');
            return;
        }

        if (formData.weightKg <= 0) {
            toast.error('Weight must be greater than 0');
            return;
        }

        updateRequestMutation.mutate(formData);
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

    const isLoading = isLoadingRequest || updateRequestMutation.isPending;

    if (requestError) {
        return (
            <div className="min-h-screen bg-white">
                <div className="container mx-auto p-6">
                    <div className="flex items-center mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Delivery Requests
                        </Button>
                    </div>
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 mx-auto text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Request</h2>
                        <p className="text-gray-600 mb-6">Failed to load delivery request details.</p>
                        <Button onClick={() => router.back()}>
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!requestId) {
        return (
            <div className="min-h-screen bg-white">
                <div className="container mx-auto p-6">
                    <div className="flex items-center mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Delivery Requests
                        </Button>
                    </div>
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Request ID Provided</h2>
                        <p className="text-gray-600 mb-6">Please select a delivery request to edit.</p>
                        <Button onClick={() => router.back()}>
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="flex items-center mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Delivery Requests
                    </Button>
                </div>

                <div className="flex items-center justify-center mb-8">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                            <Package className="w-8 h-8 text-accent/80" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Edit Delivery Request
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Update delivery request information
                        </p>
                        {requestData?.deliveryRequests?.[0] && (
                            <p className="text-sm text-gray-500 mt-1">
                                Request ID: {requestData.deliveryRequests[0].id}
                            </p>
                        )}
                    </div>
                </div>

                <div className="max-w-3xl mx-auto">
                    {isLoadingRequest ? (
                        <div className="flex justify-center items-center h-64 flex-col gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <p className="text-gray-600">Loading delivery request details...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <Truck className="w-5 h-5" />
                                    Delivery Request Information
                                </h2>
                                <p className="text-gray-600 mb-6">Update delivery request details</p>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="orderRefNo" className="text-sm font-medium text-gray-700">
                                                Order Reference
                                            </Label>
                                            <Input
                                                id="orderRefNo"
                                                name="orderRefNo"
                                                value={formData.orderRefNo}
                                                onChange={handleInputChange}
                                                disabled
                                                className="bg-gray-50 text-gray-700"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="storeName" className="text-sm font-medium text-gray-700">
                                                Store Name
                                            </Label>
                                            <Input
                                                id="storeName"
                                                name="storeName"
                                                value={formData.storeName}
                                                onChange={handleInputChange}
                                                disabled
                                                className="bg-gray-50 text-gray-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pickupLocation" className="text-sm font-medium text-gray-700">
                                            Pickup Location
                                        </Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="pickupLocation"
                                                name="pickupLocation"
                                                value={formData.pickupLocation}
                                                onChange={handleInputChange}
                                                className="pl-10"
                                                placeholder="Enter pickup location"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="deliveryLocation" className="text-sm font-medium text-gray-700">
                                            Delivery Location
                                        </Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="deliveryLocation"
                                                name="deliveryLocation"
                                                value={formData.deliveryLocation}
                                                onChange={handleInputChange}
                                                className="pl-10"
                                                placeholder="Enter delivery location"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="packageSize" className="text-sm font-medium text-gray-700">
                                                Package Size
                                            </Label>
                                            <Select
                                                value={formData.packageSize}
                                                onValueChange={(value) => handleSelectChange('packageSize', value)}
                                            >
                                                <SelectTrigger ref={packageSizeSelectRef}>
                                                    <SelectValue placeholder="Select size" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {packageSizeOptions.map(option => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="deliverySpeed" className="text-sm font-medium text-gray-700">
                                                Delivery Speed
                                            </Label>
                                            <Select
                                                value={formData.deliverySpeed}
                                                onValueChange={(value) => handleSelectChange('deliverySpeed', value)}
                                            >
                                                <SelectTrigger ref={deliverySpeedSelectRef}>
                                                    <SelectValue placeholder="Select speed" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {deliverySpeedOptions.map(option => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                                Status
                                            </Label>
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value) => handleSelectChange('status', value)}
                                            >
                                                <SelectTrigger ref={statusSelectRef}>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statusOptions.map(option => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="weightKg" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                                <Weight className="w-4 h-4" />
                                                Weight (kg)
                                            </Label>
                                            <Input
                                                id="weightKg"
                                                name="weightKg"
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={formData.weightKg}
                                                onChange={handleInputChange}
                                                placeholder="0.0"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="length" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                                <Ruler className="w-4 h-4" />
                                                Length (cm)
                                            </Label>
                                            <Input
                                                id="length"
                                                name="length"
                                                type="number"
                                                min="0"
                                                value={formData.length}
                                                onChange={handleInputChange}
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="width" className="text-sm font-medium text-gray-700">
                                                Width (cm)
                                            </Label>
                                            <Input
                                                id="width"
                                                name="width"
                                                type="number"
                                                min="0"
                                                value={formData.width}
                                                onChange={handleInputChange}
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="height" className="text-sm font-medium text-gray-700">
                                                Height (cm)
                                            </Label>
                                            <Input
                                                id="height"
                                                name="height"
                                                type="number"
                                                min="0"
                                                value={formData.height}
                                                onChange={handleInputChange}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="deliveredBy" className="text-sm font-medium text-gray-700">
                                                Delivered By
                                            </Label>
                                            <Input
                                                id="deliveredBy"
                                                name="deliveredBy"
                                                value={formData.deliveredBy}
                                                onChange={handleInputChange}
                                                placeholder="Enter rider name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="currentLocation" className="text-sm font-medium text-gray-700">
                                                Current Location
                                            </Label>
                                            <Input
                                                id="currentLocation"
                                                name="currentLocation"
                                                value={formData.currentLocation}
                                                onChange={handleInputChange}
                                                placeholder="Enter current location"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="deliveryDate" className="text-sm font-medium text-gray-700">
                                            Delivery Date
                                        </Label>
                                        <Input
                                            id="deliveryDate"
                                            name="deliveryDate"
                                            type="datetime-local"
                                            value={formData.deliveryDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="border-gray-300 hover:bg-gray-100"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Save className="w-4 h-4" />
                                    {isLoading ? 'Updating...' : 'Update Request'}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}