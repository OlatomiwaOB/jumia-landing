'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2, Package } from 'lucide-react';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import useGetLookup from "@/app/hooks/useGetLookup";
import { SelectOption } from '@/types';
import { usePermission } from '@/hooks/usePermission';

interface DeliveryOptionFormData {
    id: number;
    area: string;
    groupCode: string;
    estimatedTime: number;
    estimatedTimeType: string;
    deliveryVatRate: number;
    capLimit: number;
    amount: number;
}

interface DeliveryOptionApiResponse {
    id: number;
    area: string;
    groupCode: string;
    estimatedTime: number;
    estimatedTimeType: string;
    deliveryVatRate: number;
    capLimit: number;
    amount: number;
}

export default function SaveDeliveryOptionPage() {
    // const { usePermissionGuard } = usePermission();

    // usePermissionGuard('MANAGE_DELIVERY_OPTIONS', {
    //     redirectToNotPermitted: true,
    //     toastMessage: "You don't have permission to manage delivery options"
    // });
    const searchParams = useSearchParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const router = useRouter();

    const estimatedTimeTypeOptions: SelectOption[] = useGetLookup('ESTIMATED_TIME_TYPE');

    const isInitializedRef = useRef(false);
    const formDataRef = useRef({
        id: 0,
        area: '',
        groupCode: '',
        estimatedTime: 0,
        estimatedTimeType: '',
        deliveryVatRate: 0,
        capLimit: 0,
        amount: 0
    });

    const [formData, setFormData] = useState<DeliveryOptionFormData>({
        id: 0,
        area: '',
        groupCode: '',
        estimatedTime: 0,
        estimatedTimeType: '',
        deliveryVatRate: 0,
        capLimit: 0,
        amount: 0
    });

    const [isLoadingData, setIsLoadingData] = useState(false);

    const { data: optionData, isLoading: isLoadingOption, refetch } = useQuery({
        queryKey: ['delivery-option-detail', editingId],
        queryFn: () => axiosOperations.request({
            url: `/delivery/option/all`,
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
                isInitializedRef.current = false;
            } else {
                setIsEditMode(false);
                setEditingId(null);
            }
        } else {
            setIsEditMode(false);
            setEditingId(null);
            resetForm();
        }
    }, [searchParams]);

    useEffect(() => {
        if (isEditMode && optionData?.data?.deliveryOptions && !isInitializedRef.current) {
            const options: DeliveryOptionApiResponse[] = optionData.data.deliveryOptions;
            const option = options.find((o: DeliveryOptionApiResponse) => o.id === editingId);

            if (!option) {
                toast.error('Delivery option not found');
                router.push('/operations/delivery-options');
                return;
            }

            if (estimatedTimeTypeOptions.length === 0) {
                // console.log('Waiting for estimated time type lookup to load...');
                return;
            }

            setIsLoadingData(true);

            const estimatedTimeType = (option.estimatedTimeType || '').toLowerCase();
            const estimatedTimeTypeInfo = estimatedTimeTypeOptions.find(opt => opt.id.toLowerCase() === estimatedTimeType);

            const newFormData = {
                id: option.id || 0,
                area: option.area || '',
                groupCode: option.groupCode || '',
                estimatedTime: option.estimatedTime || 0,
                estimatedTimeType: estimatedTimeTypeInfo?.id || option.estimatedTimeType || '',
                deliveryVatRate: option.deliveryVatRate || 0,
                capLimit: option.capLimit || 0,
                amount: option.amount || 0
            };

            formDataRef.current = newFormData;
            setFormData(newFormData);
            isInitializedRef.current = true;
            setIsLoadingData(false);
        }
    }, [optionData, editingId, isEditMode, estimatedTimeTypeOptions, router]);

    useEffect(() => {
        if (isEditMode && estimatedTimeTypeOptions.length > 0 && formData.id > 0 && !isInitializedRef.current) {
            refetch();
        }
    }, [isEditMode, estimatedTimeTypeOptions, formData.id, refetch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        const newFormData = {
            ...formData,
            [name]: name.includes('Time') || name === 'amount'
                ? parseFloat(value) || 0
                : value
        };

        formDataRef.current = newFormData;
        setFormData(newFormData);
    };

    const handleSelectChange = (name: string, value: string) => {

        if (!value && formDataRef.current[name as keyof DeliveryOptionFormData]) {
            return;
        }

        const newFormData = {
            ...formData,
            [name]: value
        };

        formDataRef.current = newFormData;
        setFormData(newFormData);
    };

    const findLookupOption = (options: SelectOption[], value: string | null): SelectOption | null => {
        if (!value || !options.length) return null;

        return options.find(option =>
            option.id.toLowerCase() === value.toLowerCase()
        ) || null;
    };

    const getSelectDisplayValue = (options: SelectOption[], value: string | null): string => {
        if (!value) return '';

        const option = findLookupOption(options, value);
        return option ? option.name : value;
    };

    const resetForm = () => {
        const newFormData = {
            id: 0,
            area: '',
            groupCode: '',
            estimatedTime: 0,
            estimatedTimeType: '',
            deliveryVatRate: 0,
            capLimit: 0,
            amount: 0
        };
        formDataRef.current = newFormData;
        setFormData(newFormData);
        isInitializedRef.current = false;
    };

    const createOptionMutation = useMutation({
        mutationFn: (optionData: DeliveryOptionFormData) =>
            axiosOperations.post('/delivery/option/save', {
                ...optionData,
                id: 0
            }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Delivery option created successfully');
                router.push('/operations/delivery-options');
            } else {
                toast.error(data?.data?.desc || 'Failed to create delivery option');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create delivery option');
        }
    });

    const updateOptionMutation = useMutation({
        mutationFn: (optionData: DeliveryOptionFormData) =>
            axiosOperations.post('/delivery/option/save', {
                ...optionData
            }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Delivery option updated successfully');
                router.push('/operations/delivery-options');
            } else {
                toast.error(data?.data?.desc || 'Failed to update delivery option');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update delivery option');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.area.trim()) {
            toast.error('Area is required');
            return;
        }

        if (!formData.groupCode.trim()) {
            toast.error('Group code is required');
            return;
        }

        if (formData.estimatedTime <= 0) {
            toast.error('Estimated time must be greater than 0');
            return;
        }

        if (!formData.estimatedTimeType) {
            toast.error('Estimated time type is required');
            return;
        }

        if (formData.amount <= 0) {
            toast.error('Amount must be greater than 0');
            return;
        }

        const submitData = {
            ...formData,
            id: isEditMode ? formData.id : 0
        };

        if (isEditMode) {
            updateOptionMutation.mutate(submitData);
        } else {
            createOptionMutation.mutate(submitData);
        }
    };

    const isLoading = isLoadingOption || createOptionMutation.isPending || updateOptionMutation.isPending || isLoadingData;
    const isLookupsLoading = isEditMode && estimatedTimeTypeOptions.length === 0;

    if (isLoadingOption || isLoadingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-accent/70 animate-spin" />
                    </div>
                    <p className="text-gray-600">
                        {isEditMode ? 'Loading delivery option data...' : 'Initializing form...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-6">
                <div className="flex items-center mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/operations/delivery-options')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Delivery Options
                    </Button>
                </div>

                <div className="flex items-center justify-center mb-8">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                            <Package className="w-8 h-8 text-accent/70" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isEditMode ? 'Edit Delivery Option' : 'Create New Delivery Option'}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {isEditMode ? 'Update delivery option details' : 'Create a new delivery option'}
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Configure delivery option details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="groupCode" className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                        <span>Group Code</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="groupCode"
                                        name="groupCode"
                                        type="text"
                                        value={formData.groupCode || ""}
                                        onChange={handleInputChange}
                                        className="border-gray-300 text-gray-900"
                                        placeholder="e.g., Island, Mainland, Express"
                                        required
                                        disabled={isLoading}
                                    />
                                    <p className="text-xs text-gray-500">
                                        Enter group code like "Island" or "Mainland"
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="estimatedTime" className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                        <span>Estimated Time</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="estimatedTime"
                                        name="estimatedTime"
                                        type="number"
                                        min="1"
                                        value={formData.estimatedTime || ""}
                                        onChange={handleInputChange}
                                        className="border-gray-300 text-gray-900"
                                        placeholder="Enter estimated time"
                                        required
                                        disabled={isLoading}
                                    />
                                    <p className="text-xs text-gray-500">
                                        Time value (e.g., 20 for 20 minutes or 1 for 1 hour)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="estimatedTimeType" className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                        <span>Time Type</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                            <span className="text-sm text-gray-600">Loading time types...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.estimatedTimeType || ""}
                                            onValueChange={(value) => handleSelectChange('estimatedTimeType', value)}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className="border-gray-300">
                                                <SelectValue placeholder="Select time type">
                                                    {formData.estimatedTimeType ? getSelectDisplayValue(estimatedTimeTypeOptions, formData.estimatedTimeType) : "Select time type"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {estimatedTimeTypeOptions.map((option) => (
                                                    <SelectItem key={option.id} value={option.id}>
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        Select time unit (MINUTE, HOUR, etc.)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                        <span>Amount (₦)</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            ₦
                                        </span>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.amount || ""}
                                            onChange={handleInputChange}
                                            className="pl-10 border-gray-300 text-gray-900"
                                            placeholder="Enter amount in Naira"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Delivery fee amount
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="deliveryVatRate" className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                        <span>Delivery VAT</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            %
                                        </span>
                                        <Input
                                            id="deliveryVatRate"
                                            name="deliveryVatRate"
                                            type="deliveryVatRate"
                                            step="0.01"
                                            min="0"
                                            value={formData.deliveryVatRate || ""}
                                            onChange={handleInputChange}
                                            className="pl-10 border-gray-300 text-gray-900"
                                            placeholder="Enter value e.g 7.5"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Delivery vat value in percentage
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capLimit" className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                        <span>Cap</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="capLimit"
                                            name="capLimit"
                                            type="capLimit"
                                            step="0.01"
                                            min="0"
                                            value={formData.capLimit || ""}
                                            onChange={handleInputChange}
                                            className="border-gray-300 text-gray-900"
                                            placeholder="Enter value e.g 500"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Cap Limit value in number
                                    </p>
                                </div>
                            </div>



                            <div className="mt-6 space-y-2">
                                <Label htmlFor="area" className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                    <span>Areas (comma-separated)</span>
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="area"
                                    name="area"
                                    value={formData.area || ""}
                                    onChange={handleInputChange}
                                    className="border-gray-300 text-gray-900 min-h-[100px]"
                                    placeholder="Enter areas separated by commas, e.g., Agungi, Elegushi, Ikoyi, Victoria Island"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Preview</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><span className="font-medium">Group Code:</span> {formData.groupCode || 'Not set'}</p>
                                <p><span className="font-medium">Areas:</span> {formData.area ? formData.area.split(',').length + ' areas' : 'Not set'}</p>
                                <p><span className="font-medium">Estimated Time:</span> {formData.estimatedTime || 0} {formData.estimatedTimeType ? getSelectDisplayValue(estimatedTimeTypeOptions, formData.estimatedTimeType) : 'time unit'}</p>
                                <p><span className="font-medium">Amount:</span> ₦{formData.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 }) || '0.00'}</p>
                            </div>
                        </div> */}

                        <div className="flex justify-end gap-4 pt-4">
                            {/* <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (isEditMode) {
                                        refetch();
                                    } else {
                                        resetForm();
                                    }
                                }}
                                className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
                                disabled={isLoading}
                            >
                                {isEditMode ? 'Reload' : 'Reset'}
                            </Button> */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/operations/delivery-options')}
                                className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="gap-2 bg-accent/70 hover:bg-accent/90 text-white"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {isEditMode ? 'Update Option' : 'Create Option'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}