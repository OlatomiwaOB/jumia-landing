'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import useGetLookup from "@/app/hooks/useGetLookup";
import { SelectOption } from '@/types';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { StoreCombobox } from '@/components/shared/StoreCombobox';

interface DeliveryOptionFormData {
    id: number;
    area: string;
    groupCode: string;
    estimatedTime: number;
    estimatedTimeType: string;
    deliveryVatRate: number;
    capLimit: number;
    amount: number;
    storeCode: string;
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

export default function CreateDeliveryOptionPage() {
    usePageMetadata('Delivery Options', 'Create or edit delivery options.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_DELIVERY_OPTIONS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage delivery options"
    });

    const searchParams = useSearchParams();
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isFormInitialized, setIsFormInitialized] = useState(false);
    const estimatedTimeTypeOptions: SelectOption[] = useGetLookup('ESTIMATED_TIME_TYPE');

    const [formData, setFormData] = useState<DeliveryOptionFormData>({
        id: 0, area: '', groupCode: '', estimatedTime: 0,
        estimatedTimeType: '', deliveryVatRate: 0, capLimit: 0, amount: 0, storeCode: ''
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

    const { data: optionData, isLoading: isLoadingOption } = useQuery({
        queryKey: ['delivery-option-detail', editingId],
        queryFn: () => axiosOperations.request({
            url: `/delivery/option/all`,
            method: 'GET'
        }),
        enabled: !!editingId && isEditMode,
    });

    useEffect(() => {
        if (isEditMode && optionData?.data?.deliveryOptions && estimatedTimeTypeOptions.length > 0 && !isFormInitialized) {
            const options = optionData.data.deliveryOptions;
            const option = options.find((o: any) => o.id === editingId);
            if (option) {
                const estimatedTimeType = (option.estimatedTimeType || '').toLowerCase();
                const typeInfo = estimatedTimeTypeOptions.find(opt => opt.id.toLowerCase() === estimatedTimeType);
                setFormData({
                    id: option.id || 0,
                    area: option.area || '',
                    groupCode: option.groupCode || '',
                    estimatedTime: option.estimatedTime || 0,
                    estimatedTimeType: typeInfo?.id || option.estimatedTimeType || '',
                    deliveryVatRate: option.deliveryVatRate || 0,
                    capLimit: option.capLimit || 0,
                    amount: option.amount || 0,
                    storeCode: option.storeCode || ''
                });
                setIsFormInitialized(true);
            }
        }
    }, [optionData, editingId, isEditMode, estimatedTimeTypeOptions, isFormInitialized]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (['estimatedTime', 'amount', 'deliveryVatRate', 'capLimit'].includes(name)) {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getSelectDisplayValue = (options: SelectOption[], value: string | null): string => {
        if (!value) return '';
        const option = options.find(o => o.id.toLowerCase() === value.toLowerCase());
        return option ? option.name : value;
    };

    const saveOptionMutation = useMutation({
        mutationFn: (optionData: DeliveryOptionFormData) =>
            axiosOperations.post('/delivery/option/save', { ...optionData, id: isEditMode ? optionData.id : 0 }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success(isEditMode ? 'Delivery option updated successfully' : 'Delivery option created successfully');
                router.push('/operations/delivery-options');
            } else {
                toast.error(data?.data?.desc || 'Failed to save delivery option');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to save delivery option');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.area.trim()) { toast.error('Area is required'); return; }
        if (!formData.groupCode.trim()) { toast.error('Group code is required'); return; }
        if (!formData.storeCode.trim()) { toast.error('Store code is required'); return; }
        if (formData.estimatedTime <= 0) { toast.error('Estimated time must be greater than 0'); return; }
        if (!formData.estimatedTimeType) { toast.error('Estimated time type is required'); return; }
        if (formData.amount <= 0) { toast.error('Amount must be greater than 0'); return; }
        saveOptionMutation.mutate(formData);
    };

    const isLoading = isLoadingOption || saveOptionMutation.isPending;
    const isLookupsLoading = isEditMode && estimatedTimeTypeOptions.length === 0;

    if (isLoadingOption) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-medium-gray">Loading option data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl">
                <div className="mb-4">
                    <Button variant="link" onClick={() => router.push('/operations/delivery-options')}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </div>

                <div className='container mx-auto px-20 py-6'>
                    <div className="mb-6">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">
                            {isEditMode ? 'Edit Delivery Option' : 'Create Delivery Option'}
                        </h1>
                        <p className="text-xs lg:text-sm font-normal text-medium-gray">
                            {isEditMode ? 'Update delivery option details' : 'Create a new delivery option'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className='bg-white px-6 py-4 rounded-2xl'>
                            <FormSection title="Delivery Option Details" subtitle="Configure delivery option details.">
                                <FormField label="Store Code" required>
                                    <StoreCombobox
                                        onChange={(value) => handleSelectChange('storeCode', value)}
                                        axiosInstance={axiosOperations}
                                        value={formData.storeCode}
                                    />
                                </FormField>

                                <FormField label="Group Code" required>
                                    <Input name="groupCode" value={formData.groupCode} onChange={handleInputChange} placeholder="e.g., Island, Mainland, Express" required />
                                </FormField>

                                <FormField label="Amount (₦)" required>
                                    <Input name="amount" type="number" step="0.01" min="0" value={formData.amount || ""} onChange={handleInputChange} placeholder="Enter amount" required />
                                </FormField>

                                <FormField label="Estimated Time" required>
                                    <Input name="estimatedTime" type="number" min="1" value={formData.estimatedTime || ""} onChange={handleInputChange} placeholder="e.g., 20" required />
                                </FormField>

                                <FormField label="Time Type" required>
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                                            <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                                            <span className="text-sm text-medium-gray">Loading...</span>
                                        </div>
                                    ) : (
                                        <Select value={formData.estimatedTimeType} onValueChange={(value) => handleSelectChange('estimatedTimeType', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select time type">
                                                    {getSelectDisplayValue(estimatedTimeTypeOptions, formData.estimatedTimeType) || "Select time type"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {estimatedTimeTypeOptions.map((option) => (
                                                    <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </FormField>

                                <FormField label="Delivery VAT (%)">
                                    <Input name="deliveryVatRate" type="number" step="0.01" min="0" value={formData.deliveryVatRate || ""} onChange={handleInputChange} placeholder="e.g., 7.5" />
                                </FormField>

                                <FormField label="Cap Limit">
                                    <Input name="capLimit" type="number" step="0.01" min="0" value={formData.capLimit || ""} onChange={handleInputChange} placeholder="e.g., 500" />
                                </FormField>

                                <div className="col-span-2">
                                    <FormField label="Areas (comma-separated)" required>
                                        <Textarea
                                            name="area"
                                            value={formData.area}
                                            onChange={handleInputChange}
                                            placeholder="Enter areas separated by commas, e.g., Agungi, Elegushi, Ikoyi"
                                            rows={4}
                                            required
                                        />
                                    </FormField>
                                </div>
                            </FormSection>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : (isEditMode ? 'Update Option' : 'Create Option')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}