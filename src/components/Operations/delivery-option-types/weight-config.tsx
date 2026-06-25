'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Settings, Package, Pencil, Plus } from 'lucide-react';
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

interface WeightConfig {
    id: number;
    zoneCode: string;
    area?: string[];
    typeCode: string;
    typeName: string | null;
    multiplier: number | null;
    baseFee: number;
    ratePerKg: number;
    minWeightKg: number;
    maxWeightKg: number;
    estimatedTime: number;
    estimatedTimeType: string;
    status: string;
}

interface WeightConfigFormData {
    id: number;
    zoneCode: string;
    area: string[];
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

const defaultFormData: WeightConfigFormData = {
    id: 0,
    zoneCode: '',
    area: [],
    typeCode: '',
    baseFee: 0,
    ratePerKg: 0,
    minWeightKg: 0,
    maxWeightKg: 0,
    estimatedTime: 0,
    estimatedTimeType: '',
    status: 'Active'
};

const storeCode = process.env.NEXT_PUBLIC_STORE_CODE!;

export const WeightConfigModal: React.FC<WeightConfigModalProps> = ({ open, onOpenChange, optionType, onSuccess }) => {
    const queryClient = useQueryClient();
    const estimatedTimeTypeOptions: SelectOption[] = useGetLookup('ESTIMATED_TIME_TYPE');
    const areaOptions = useGetLookup('AREAS');

    const [activeTab, setActiveTab] = useState<'add' | 'view'>('add');
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [renderKey, setRenderKey] = useState(0);

    const [formData, setFormData] = useState<WeightConfigFormData>({ ...defaultFormData });

    // Reset state when modal opens/closes or option type changes
    useEffect(() => {
        if (open && optionType) {
            resetForm();
            setActiveTab('add');
            setRenderKey(prev => prev + 1);
        }
    }, [open, optionType]);

    // Fetch ALL configs (not filtered by typeCode — API returns all)
    const { data: configData, isLoading: isLoadingConfigs, refetch: refetchConfigs } = useQuery({
        queryKey: ['weight-config-all'],
        queryFn: async () => {
            const response = await axiosOperations.request({
                url: `/delivery-by-weight/config/all`,
                method: 'GET',
                params: {
                    storeCode
                }
            });
            return response;
        },
        enabled: false,
    });

    useEffect(() => {
        if (open && optionType?.typeCode) {
            const timer = setTimeout(() => {
                refetchConfigs();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [open, optionType?.typeCode, refetchConfigs]);

    // Extract configs for this option type
    const allConfigs: WeightConfig[] = configData?.data?.configs || [];
    // const typeConfigs = allConfigs.filter(
    //     (c: WeightConfig) => c.typeCode?.toUpperCase() === optionType?.typeCode?.toUpperCase()
    // );

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

    const handleZoneChange = (zoneCode: string) => {
        setFormData(prev => ({ ...prev, zoneCode }));
    };

    const saveConfigMutation = useMutation({
        mutationFn: (data: WeightConfigFormData) => {
            const payload = {
                ...data,
                typeCode: optionType?.typeCode || data.typeCode,
                zoneCode: data.zoneCode?.trim(),
                area: data.area,
                estimatedTimeType: data.estimatedTimeType?.toUpperCase()
            };
            console.log('Saving weight config payload:', payload);
            return axiosOperations.post('/delivery-by-weight/config/save', payload);
        },
        onSuccess: (data) => {
            console.log('Save response:', data);
            if (data?.data?.code === '000' || data?.data?.responseCode === '000') {
                toast.success(isEditMode ? 'Weight config updated successfully' : 'Weight config created successfully');
                queryClient.invalidateQueries({ queryKey: ['weight-config-all'] });
                refetchConfigs();
                onSuccess();
                resetForm();
                setActiveTab('view');
            } else {
                toast.error(data?.data?.desc || data?.data?.responseMessage || 'Failed to save weight config');
                setIsLoading(false);
            }
        },
        onError: (error: any) => {
            console.error('Save error:', error);
            toast.error(error.response?.data?.message || error.response?.data?.desc || 'Failed to save weight config');
            setIsLoading(false);
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

        setIsLoading(true);
        const saveData = {
            ...formData,
            storeCode: storeCode,
            typeCode: optionType.typeCode,
            zoneCode: formData.zoneCode?.trim(),
            area: formData.area,
            estimatedTimeType: formData.estimatedTimeType?.toUpperCase()
        };

        saveConfigMutation.mutate(saveData);
    };

    const handleEditConfig = (config: WeightConfig) => {
        setIsEditMode(true);
        setFormData({
            id: config.id || 0,
            zoneCode: config.zoneCode?.trim() || '',
            area: config.area || [],
            typeCode: config.typeCode || optionType?.typeCode || '',
            baseFee: config.baseFee || 0,
            ratePerKg: config.ratePerKg || 0,
            minWeightKg: config.minWeightKg || 0,
            maxWeightKg: config.maxWeightKg || 0,
            estimatedTime: config.estimatedTime || 0,
            estimatedTimeType: config.estimatedTimeType || '',
            status: config.status || 'Active'
        });
        setRenderKey(prev => prev + 1);
        setActiveTab('add');
    };

    const resetForm = () => {
        setIsLoading(false);
        setIsEditMode(false);
        setFormData({
            ...defaultFormData,
            typeCode: optionType?.typeCode || ''
        });
    };

    const handleClose = () => {
        resetForm();
        setActiveTab('add');
        onOpenChange(false);
    };

    const getSelectDisplayValue = (options: SelectOption[], value: string | null): string => {
        if (!value) return '';
        const option = options.find(o =>
            o.id.toUpperCase() === value.toUpperCase() ||
            o.name.toUpperCase() === value.toUpperCase()
        );
        return option ? option.name : value;
    };

    const getAreaNames = (areaIds?: string[]): string => {
        if (!areaIds || !areaIds.length) return 'N/A';
        if (!areaOptions) return areaIds.join(', ');
        return areaIds.map(id => areaOptions.find((a: any) => a.id === id)?.name || id).join(', ');
    };

    if (!optionType) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                style={{ scrollbarWidth: 'none' }}>
                <DialogTitle className="sr-only">Weight Configuration</DialogTitle>

                <div className="px-6 pt-5 pb-2">
                    <h2 className="text-base font-bold text-dark-gray">Weight Configuration</h2>
                    <p className="text-xs text-medium-gray mt-0.5">
                        Manage configs for <span className="font-medium">{optionType.typeName}</span> ({optionType.typeCode}) — Multiplier: {optionType.multiplier}x
                    </p>
                </div>

                {/* Tab Buttons */}
                <div className="px-6 flex gap-2 mb-2">
                    <button
                        type="button"
                        onClick={() => { setActiveTab('add'); if (!isEditMode) resetForm(); }}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'add'
                            ? 'bg-orange-500 text-white'
                            : 'bg-white text-medium-gray hover:text-dark-gray'
                            }`}
                    >
                        {isEditMode ? 'Edit Config' : 'Add Config'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('view')}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'view'
                            ? 'bg-orange-500 text-white'
                            : 'bg-white text-medium-gray hover:text-dark-gray'
                            }`}
                    >
                        View Configs {allConfigs.length > 0 && <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">({allConfigs.length})</span>}
                    </button>
                </div>

                {/* Add/Edit Config Tab */}
                {activeTab === 'add' && (
                    <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4" key={`form-${renderKey}`}>
                        {isEditMode && (
                            <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg p-2">
                                <p className="text-xs text-orange-700"><span className="font-semibold">Editing config</span> — modify and save to update.</p>
                                <button type="button" onClick={resetForm} className="text-xs text-orange-600 hover:text-orange-800 font-semibold underline">
                                    Cancel Edit
                                </button>
                            </div>
                        )}
                        <div className="bg-white rounded-2xl p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Zone <span className="text-red-500">*</span></Label>
                                    <Select
                                        key={`zone-${formData.zoneCode}-${renderKey}`}
                                        value={formData.zoneCode || undefined}
                                        onValueChange={handleZoneChange}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Select zone">
                                                {formData.zoneCode || "Select zone"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {areaOptions?.map((area: any) => (
                                                <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
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
                                        <SelectTrigger>
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

                                <div className="space-y-1.5 col-span-2">
                                    <Label>Area(s)</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3 border rounded-lg max-h-48 overflow-y-auto bg-gray-50/50">
                                        {areaOptions?.map((area: any) => (
                                            <label key={area.id} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.area?.includes(area.id) || false}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            area: checked
                                                                ? [...(prev.area || []), area.id]
                                                                : (prev.area || []).filter(a => a !== area.id)
                                                        }));
                                                    }}
                                                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700 truncate" title={area.name}>{area.name}</span>
                                            </label>
                                        ))}
                                        {(!areaOptions || areaOptions.length === 0) && (
                                            <div className="col-span-full text-xs text-gray-500 p-2">No areas available</div>
                                        )}
                                    </div>
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
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Rate Per Kg (ccy) </Label>
                                    <Input
                                        name="ratePerKg"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.ratePerKg || ""}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 200"
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
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Time Type</Label>
                                    <Select
                                        key={`timetype-${formData.estimatedTimeType}-${renderKey}`}
                                        value={formData.estimatedTimeType || undefined}
                                        onValueChange={(value) => handleSelectChange('estimatedTimeType', value)}
                                    >
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
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end pt-1">
                            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>Cancel</Button>
                            <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white">
                                {isLoading
                                    ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
                                    : isEditMode
                                        ? <><Pencil className="w-4 h-4 mr-2" /> Update Config</>
                                        : <><Plus className="w-4 h-4 mr-2" /> Save Config</>
                                }
                            </Button>
                        </div>
                    </form>
                )}

                {/* View Configs Tab */}
                {activeTab === 'view' && (
                    <div className="px-6 pb-6">
                        {isLoadingConfigs ? (
                            <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
                                <div className="text-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto mb-2" />
                                    <p className="text-xs text-medium-gray">Loading configurations...</p>
                                </div>
                            </div>
                        ) : allConfigs.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
                                <div className="text-center">
                                    <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-medium-gray font-medium">No configurations yet</p>
                                    <p className="text-xs text-medium-gray mt-1">Add your first config using the &quot;Add Config&quot; tab.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl overflow-hidden">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left px-4 py-3 text-medium-gray font-semibold">Zone</th>
                                            <th className="text-left px-4 py-3 text-medium-gray font-semibold">Area</th>
                                            <th className="text-left px-4 py-3 text-medium-gray font-semibold">Base Fee</th>
                                            <th className="text-left px-4 py-3 text-medium-gray font-semibold">Rate/Kg</th>
                                            <th className="text-left px-4 py-3 text-medium-gray font-semibold">Weight Range</th>
                                            <th className="text-left px-4 py-3 text-medium-gray font-semibold">Est. Time</th>
                                            <th className="text-left px-4 py-3 text-medium-gray font-semibold">Status</th>
                                            <th className="text-right px-4 py-3 text-medium-gray font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allConfigs.map((config: WeightConfig, index: number) => (
                                            <tr key={config.id || index} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-dark-gray">
                                                    {config.zoneCode || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-dark-gray truncate max-w-[120px]" title={getAreaNames(config.area)}>
                                                    {getAreaNames(config.area)}
                                                </td>
                                                <td className="px-4 py-3 text-dark-gray">
                                                    {config.baseFee != null ? config.baseFee.toFixed(2) : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-dark-gray">
                                                    {config.ratePerKg != null ? config.ratePerKg.toFixed(2) : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-dark-gray">
                                                    {config.minWeightKg != null && config.maxWeightKg != null
                                                        ? `${config.minWeightKg}–${config.maxWeightKg} kg`
                                                        : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-dark-gray">
                                                    {config.estimatedTime
                                                        ? `${config.estimatedTime} ${config.estimatedTimeType || ''}`
                                                        : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${config.status?.toUpperCase() === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {config.status || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditConfig(config)}
                                                        className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-700 font-semibold transition-colors"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};