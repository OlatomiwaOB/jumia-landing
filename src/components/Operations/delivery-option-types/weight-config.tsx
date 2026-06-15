'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Settings } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import useGetLookup from "@/app/hooks/useGetLookup";
import { SelectOption } from '@/types';

interface OptionType {
    id: number;
    typeCode: string;
    typeName: string;
    multiplier: number;
    description: string;
    status: string;
}

interface DeliveryOption {
    id: number;
    area: string;
    groupCode: string;
    estimatedTime: number;
    estimatedTimeType: string;
    deliveryVatRate: number;
    deliveryVatAmount: number;
    capLimit: number;
    amount: number;
}

interface WeightConfigFormData {
    id: number;
    zoneCode: string;
    typeCode: string;
    baseFee: number;
    ratePerKg: number;
    minWeightKg: number;
    maxWeightKg: number;
    estimatedTime: number;
    estimatedTimeType: string;
    status: string;
}

interface WeightConfigModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    optionType: OptionType | null;
    onSuccess: () => void;
}

export const WeightConfigModal: React.FC<WeightConfigModalProps> = ({ open, onOpenChange, optionType, onSuccess }) => {
    const queryClient = useQueryClient();
    const estimatedTimeTypeOptions: SelectOption[] = useGetLookup('ESTIMATED_TIME_TYPE');
    const [hasExistingConfig, setHasExistingConfig] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [renderKey, setRenderKey] = useState(0);

    const zoneSelectRef = useRef<HTMLButtonElement>(null);
    const statusSelectRef = useRef<HTMLButtonElement>(null);
    const timeTypeSelectRef = useRef<HTMLButtonElement>(null);

    const [formData, setFormData] = useState<WeightConfigFormData>({
        id: 0,
        zoneCode: '',
        typeCode: '',
        baseFee: 0,
        ratePerKg: 0,
        minWeightKg: 0,
        maxWeightKg: 0,
        estimatedTime: 0,
        estimatedTimeType: '',
        status: 'Active'
    });

    useEffect(() => {
        if (open && optionType) {
            setIsInitialLoad(true);
            setFormData({
                id: 0,
                zoneCode: '',
                typeCode: optionType.typeCode,
                baseFee: 0,
                ratePerKg: 0,
                minWeightKg: 0,
                maxWeightKg: 0,
                estimatedTime: 0,
                estimatedTimeType: '',
                status: 'Active'
            });
            setHasExistingConfig(false);
            setRenderKey(prev => prev + 1);
        }
    }, [open, optionType]);

    const { data: deliveryOptionsData } = useQuery({
        queryKey: ['delivery-options-for-zones'],
        queryFn: () => axiosOperations.request({
            url: '/delivery/option/all',
            method: 'GET'
        }),
        enabled: open
    });

    const { data: configData, isLoading: isLoadingConfigData, refetch: refetchConfig } = useQuery({
        queryKey: ['weight-config', optionType?.typeCode],
        queryFn: async () => {
            const response = await axiosOperations.request({
                url: `/delivery-by-weight/config/all`,
                method: 'GET'
            });
            return response;
        },
        enabled: false,
    });

    useEffect(() => {
        if (open && optionType?.typeCode) {
            const timer = setTimeout(() => {
                refetchConfig();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [open, optionType?.typeCode, refetchConfig]);

    const deliveryOptions: DeliveryOption[] = deliveryOptionsData?.data?.deliveryOptions || [];
    const uniqueZones: string[] = Array.from(new Set(deliveryOptions.map((o: any) => o.groupCode?.trim())));

    useEffect(() => {
        if (configData?.data && optionType && isInitialLoad && deliveryOptions.length > 0) {
            const configs = configData.data.configs;
            const responseCode = configData.data.responseCode || configData.data.code;

            if (responseCode === 'E20' || configData.data.desc === 'No record found: ' || !configs || configs.length === 0) {
                setHasExistingConfig(false);
                setFormData(prev => ({
                    ...prev,
                    id: 0,
                    typeCode: optionType.typeCode
                }));
                setIsInitialLoad(false);
                setRenderKey(prev => prev + 1);
                return;
            }

            if (configs && Array.isArray(configs)) {
                const existingConfig = configs.find((c: any) =>
                    c.typeCode?.toUpperCase() === optionType.typeCode?.toUpperCase()
                );

                if (existingConfig) {
                    setHasExistingConfig(true);
                    const matchingDeliveryOption = deliveryOptions.find(
                        (opt) => opt.groupCode?.trim().toUpperCase() === existingConfig.zoneCode?.trim().toUpperCase()
                    );

                    const timeTypeValue = existingConfig.estimatedTimeType?.toUpperCase() ||
                        matchingDeliveryOption?.estimatedTimeType?.toUpperCase() || '';

                    setFormData({
                        id: existingConfig.id || 0,
                        zoneCode: existingConfig.zoneCode?.trim() || '',
                        typeCode: existingConfig.typeCode || optionType.typeCode,
                        baseFee: existingConfig.baseFee || 0,
                        ratePerKg: existingConfig.ratePerKg || 0,
                        minWeightKg: existingConfig.minWeightKg || 0,
                        maxWeightKg: existingConfig.maxWeightKg || 0,
                        estimatedTime: existingConfig.estimatedTime || matchingDeliveryOption?.estimatedTime || 0,
                        estimatedTimeType: timeTypeValue,
                        status: existingConfig.status || 'Active'
                    });
                    setRenderKey(prev => prev + 1);
                } else {
                    setHasExistingConfig(false);
                    setFormData(prev => ({
                        ...prev,
                        id: 0,
                        typeCode: optionType.typeCode
                    }));
                }
            }
            setIsInitialLoad(false);
        }
    }, [configData, optionType, deliveryOptions, isInitialLoad]);

    const handleZoneChange = (zoneCode: string) => {
        const selectedDeliveryOption = deliveryOptions.find(
            (opt) => opt.groupCode?.trim() === zoneCode?.trim()
        );

        if (selectedDeliveryOption) {
            const timeTypeValue = selectedDeliveryOption.estimatedTimeType?.toUpperCase() || '';

            setFormData(prev => ({
                ...prev,
                zoneCode: zoneCode,
                baseFee: selectedDeliveryOption.amount || 0,
                estimatedTime: selectedDeliveryOption.estimatedTime || 0,
                estimatedTimeType: timeTypeValue
            }));
            setRenderKey(prev => prev + 1);
        } else {
            setFormData(prev => ({
                ...prev,
                zoneCode: zoneCode
            }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (['baseFee', 'ratePerKg', 'minWeightKg', 'maxWeightKg', 'estimatedTime'].includes(name)) {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const saveConfigMutation = useMutation({
        mutationFn: (data: WeightConfigFormData) => {
            const payload = {
                ...data,
                typeCode: optionType?.typeCode || data.typeCode,
                zoneCode: data.zoneCode?.trim(),
                estimatedTimeType: data.estimatedTimeType?.toUpperCase()
            };
            console.log('Saving weight config payload:', payload);
            return axiosOperations.post('/delivery-by-weight/config/save', payload);
        },
        onSuccess: (data) => {
            console.log('Save response:', data);
            if (data?.data?.code === '000' || data?.data?.responseCode === '000') {
                toast.success(hasExistingConfig ? 'Weight config updated successfully' : 'Weight config created successfully');
                queryClient.invalidateQueries({ queryKey: ['weight-config'] });
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error(data?.data?.desc || data?.data?.responseMessage || 'Failed to save weight config');
            }
        },
        onError: (error: any) => {
            console.error('Save error:', error);
            toast.error(error.response?.data?.message || error.response?.data?.desc || 'Failed to save weight config');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.zoneCode) {
            toast.error('Zone is required');
            return;
        }
        if (!optionType?.typeCode) {
            toast.error('Type code is missing');
            return;
        }
        if (formData.baseFee <= 0) {
            toast.error('Base fee must be greater than 0');
            return;
        }
        if (formData.ratePerKg <= 0) {
            toast.error('Rate per kg must be greater than 0');
            return;
        }

        const saveData = {
            ...formData,
            typeCode: optionType.typeCode,
            zoneCode: formData.zoneCode?.trim(),
            estimatedTimeType: formData.estimatedTimeType?.toUpperCase()
        };

        saveConfigMutation.mutate(saveData);
    };

    const getSelectDisplayValue = (options: SelectOption[], value: string | null): string => {
        if (!value) return '';
        const option = options.find(o =>
            o.id.toUpperCase() === value.toUpperCase() ||
            o.name.toUpperCase() === value.toUpperCase()
        );
        return option ? option.name : value;
    };

    if (!optionType) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                <DialogTitle className="sr-only">
                    {hasExistingConfig ? 'Edit Weight Configuration' : 'Create Weight Configuration'}
                </DialogTitle>

                <div className="px-6 pt-5 pb-4" key={renderKey}>
                    <div className="flex items-center gap-3 mb-4">
                        <div>
                            <h2 className="text-base font-semibold text-dark-gray">
                                {hasExistingConfig ? 'Edit Weight Configuration' : 'Create Weight Configuration'}
                            </h2>
                            <p className="text-xs text-medium-gray mt-0.5">
                                For type: <span className="font-medium">{optionType.typeName}</span> ({optionType.typeCode}) - Multiplier: {optionType.multiplier}x
                            </p>
                        </div>
                    </div>

                    {isLoadingConfigData && isInitialLoad ? (
                        <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
                            <div className="text-center">
                                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                                <p className="text-sm text-medium-gray">Loading existing configuration...</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} key={`form-${renderKey}`}>
                            <div className="bg-white rounded-2xl p-6 space-y-4">
                                {hasExistingConfig && (
                                    <div className='text-xs text-dark-gray bg-faded-accent/5 p-2 rounded-lg'>
                                        <span className="font-semibold">Existing configuration found</span> - Editing will update the current configuration.
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label>Zone <span className="text-red-500">*</span></Label>
                                        <Select
                                            key={`zone-${formData.zoneCode}-${renderKey}`}
                                            value={formData.zoneCode || undefined}
                                            onValueChange={handleZoneChange}
                                        >
                                            <SelectTrigger ref={zoneSelectRef}>
                                                <SelectValue placeholder="Select zone">
                                                    {formData.zoneCode || "Select zone"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {uniqueZones.map((zone: string) => (
                                                    <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Status</Label>
                                        <Select
                                            key={`status-${formData.status}-${renderKey}`}
                                            value={formData.status || undefined}
                                            onValueChange={(value) => handleSelectChange('status', value)}
                                        >
                                            <SelectTrigger ref={statusSelectRef}>
                                                <SelectValue placeholder="Select status">
                                                    {formData.status || "Select status"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Base Fee (₦) <span className="text-red-500">*</span></Label>
                                        <Input
                                            name="baseFee"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.baseFee || ""}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 500"
                                            required
                                        />
                                        {formData.zoneCode && (
                                            <p className="text-xs text-medium-gray">
                                                Auto-populated from delivery option amount
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Rate Per Kg (₦) <span className="text-red-500">*</span></Label>
                                        <Input
                                            name="ratePerKg"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.ratePerKg || ""}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 200"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Min Weight (kg)</Label>
                                        <Input
                                            name="minWeightKg"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.minWeightKg || ""}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 0"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Max Weight (kg)</Label>
                                        <Input
                                            name="maxWeightKg"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.maxWeightKg || ""}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 100"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Estimated Time</Label>
                                        <Input
                                            name="estimatedTime"
                                            type="number"
                                            min="1"
                                            value={formData.estimatedTime || ""}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 1"
                                        />
                                        {formData.zoneCode && (
                                            <p className="text-xs text-medium-gray">
                                                Auto-populated from delivery option
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Time Type</Label>
                                        <Select
                                            key={`timetype-${formData.estimatedTimeType}-${renderKey}`}
                                            value={formData.estimatedTimeType || undefined}
                                            onValueChange={(value) => handleSelectChange('estimatedTimeType', value)}
                                        >
                                            <SelectTrigger ref={timeTypeSelectRef}>
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
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={saveConfigMutation.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={saveConfigMutation.isPending}>
                                    {saveConfigMutation.isPending ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                                    ) : (hasExistingConfig ? 'Update Config' : 'Save Config')}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog >
    );
};