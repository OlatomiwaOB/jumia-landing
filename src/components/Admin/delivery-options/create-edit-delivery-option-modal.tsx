'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { toast } from 'sonner';
import { getClientIdentifiers } from '@/config/client-config';

interface DeliveryOption {
    id: number;
    area: string;
    groupCode: string;
    storeCode: string;
    estimatedTime: number;
    estimatedTimeType: string;
    amount: number;
    weightBasedConfig: boolean;
    ratePerWeightUnit: number;
    weightUnit: string;
    minWeight: number;
    maxWeight: number;
    deliveryVatRate: number;
    capLimit: number;
    status: string;
}

interface DeliveryOptionFormData {
    id: number;
    area: string;
    groupCode: string;
    storeCode: string;
    estimatedTime: number;
    estimatedTimeType: string;
    amount: number;
    weightBasedConfig: boolean;
    ratePerWeightUnit: number;
    weightUnit: string;
    minWeight: number;
    maxWeight: number;
    deliveryVatRate: number;
    capLimit: number;
    status: string;
}

interface CreateEditDeliveryOptionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    deliveryOption: DeliveryOption | null;
    onSuccess: () => void;
}

const defaultStoreCode = getClientIdentifiers().storeCode;

const DEFAULT_FORM: DeliveryOptionFormData = {
    id: 0,
    area: '',
    groupCode: '',
    storeCode: defaultStoreCode || '',
    estimatedTime: 0,
    estimatedTimeType: 'DAY',
    amount: 0,
    weightBasedConfig: false,
    ratePerWeightUnit: 0,
    weightUnit: 'kg',
    minWeight: 0,
    maxWeight: 0,
    deliveryVatRate: 0,
    capLimit: 0,
    status: 'Active',
};

export const CreateEditDeliveryOptionModal: React.FC<CreateEditDeliveryOptionModalProps> = ({
    open,
    onOpenChange,
    deliveryOption,
    onSuccess,
}) => {
    const isEditMode = !!deliveryOption;
    const [formData, setFormData] = useState<DeliveryOptionFormData>(DEFAULT_FORM);

    useEffect(() => {
        if (open) {
            if (deliveryOption) {
                setFormData({
                    id: deliveryOption.id ?? 0,
                    area: deliveryOption.area ?? '',
                    groupCode: deliveryOption.groupCode ?? '',
                    storeCode: deliveryOption.storeCode ?? defaultStoreCode ?? '',
                    estimatedTime: deliveryOption.estimatedTime ?? 0,
                    estimatedTimeType: deliveryOption.estimatedTimeType ?? 'DAY',
                    amount: deliveryOption.amount ?? 0,
                    weightBasedConfig: deliveryOption.weightBasedConfig ?? false,
                    ratePerWeightUnit: deliveryOption.ratePerWeightUnit ?? 0,
                    weightUnit: deliveryOption.weightUnit ?? 'kg',
                    minWeight: deliveryOption.minWeight ?? 0,
                    maxWeight: deliveryOption.maxWeight ?? 0,
                    deliveryVatRate: deliveryOption.deliveryVatRate ?? 0,
                    capLimit: deliveryOption.capLimit ?? 0,
                    status: deliveryOption.status ?? 'Active',
                });
            } else {
                setFormData({ ...DEFAULT_FORM, storeCode: defaultStoreCode || '' });
            }
        }
    }, [open, deliveryOption]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleWeightBased = () => {
        setFormData(prev => ({ ...prev, weightBasedConfig: !prev.weightBasedConfig }));
    };

    const saveMutation = useMutation({
        mutationFn: (data: DeliveryOptionFormData) =>
            axiosInstance.post('/delivery/option/save', data),
        onSuccess: (data) => {
            if (data?.data?.responseCode === '000' || data?.data?.code === '000') {
                toast.success(isEditMode ? 'Delivery option updated successfully' : 'Delivery option created successfully');
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error(data?.data?.responseMessage || data?.data?.desc || 'Failed to save delivery option');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.responseMessage || error.response?.data?.desc || 'Failed to save delivery option');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.area.trim()) { toast.error('Area is required'); return; }
        if (!formData.groupCode.trim()) { toast.error('Group Code is required'); return; }
        if (formData.amount < 0) { toast.error('Amount cannot be negative'); return; }
        saveMutation.mutate(formData);
    };

    const isLoading = saveMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Delivery Option' : 'Add Delivery Option'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? 'Update delivery option details.' : 'Create a new delivery option.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {/* Core fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Area <span className="text-red-500">*</span></Label>
                            <Input
                                name="area"
                                value={formData.area}
                                onChange={handleInputChange}
                                placeholder="e.g., London, Camden"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Group Code <span className="text-red-500">*</span></Label>
                            <Input
                                name="groupCode"
                                value={formData.groupCode}
                                onChange={handleInputChange}
                                placeholder="e.g., STANDARD, EXPRESS"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Store Code</Label>
                            <Input
                                name="storeCode"
                                value={formData.storeCode}
                                onChange={handleInputChange}
                                readOnly
                                placeholder="e.g., STO0001"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Amount <span className="text-red-500">*</span></Label>
                            <Input
                                name="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.amount || ''}
                                onChange={handleInputChange}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Estimated Time</Label>
                            <Input
                                name="estimatedTime"
                                type="number"
                                min="0"
                                value={formData.estimatedTime || ''}
                                onChange={handleInputChange}
                                placeholder="e.g., 2"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Estimated Time Type</Label>
                            <Select
                                value={formData.estimatedTimeType}
                                onValueChange={(v) => handleSelectChange('estimatedTimeType', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select time type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MINUTE">Minute</SelectItem>
                                    <SelectItem value="HOUR">Hour</SelectItem>
                                    <SelectItem value="DAY">Day</SelectItem>
                                    <SelectItem value="WEEK">Week</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Delivery VAT Rate (%)</Label>
                            <Input
                                name="deliveryVatRate"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.deliveryVatRate || ''}
                                onChange={handleInputChange}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Cap Limit</Label>
                            <Input
                                name="capLimit"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.capLimit || ''}
                                onChange={handleInputChange}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Status <span className="text-red-500">*</span></Label>
                            <Select
                                value={formData.status}
                                onValueChange={(v) => handleSelectChange('status', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Weight-based config toggle */}
                    <div className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-dark-gray">Weight-Based Pricing</p>
                                <p className="text-xs text-gray-500 mt-0.5">Enable to configure pricing based on package weight</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleToggleWeightBased}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.weightBasedConfig ? 'bg-sidebar-accent' : 'bg-gray-200'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.weightBasedConfig ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {formData.weightBasedConfig && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                                <div className="space-y-1.5">
                                    <Label>Rate Per Weight Unit</Label>
                                    <Input
                                        name="ratePerWeightUnit"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.ratePerWeightUnit || ''}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 5.00"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Weight Unit</Label>
                                    <Input
                                        name="weightUnit"
                                        value={formData.weightUnit}
                                        onChange={handleInputChange}
                                        placeholder="e.g., kg"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Min Weight</Label>
                                    <Input
                                        name="minWeight"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.minWeight || ''}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Max Weight</Label>
                                    <Input
                                        name="maxWeight"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.maxWeight || ''}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-sidebar-accent hover:bg-sidebar-accent/90 text-[var(--sidebar-text)] font-bold">
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                            ) : (isEditMode ? 'Update Option' : 'Save Option')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
