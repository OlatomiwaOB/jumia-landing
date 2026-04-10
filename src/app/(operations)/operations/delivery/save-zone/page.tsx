'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Loader2, MapPin } from 'lucide-react';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import useGetLookup from "@/app/hooks/useGetLookup";
import { SelectOption } from '@/types';

interface Area {
    id: number;
    areaName: string;
}

interface ZoneFormData {
    id: number;
    zoneCode: string;
    zoneName: string;
    status: string;
    areas: Area[];
}

interface ZoneApiResponse {
    zoneId: number;
    zoneCode: string;
    zoneName: string;
    status: string;
    areaList: Area[];
}

export default function SaveZonePage() {
    const searchParams = useSearchParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const router = useRouter();
    
    const zoneCodeOptions: SelectOption[] = useGetLookup('ZONE_CODE');
    const zoneNameOptions: SelectOption[] = useGetLookup('ZONE_NAME');
    const statusOptions: SelectOption[] = useGetLookup('STATUS');
    const areaOptions: SelectOption[] = useGetLookup('AREAS');

    const isInitializedRef = useRef(false);
    const formDataRef = useRef({
        id: 0,
        zoneCode: '',
        zoneName: '',
        status: 'ACTIVE',
        areas: [] as Area[]
    });

    const [formData, setFormData] = useState<ZoneFormData>({
        id: 0,
        zoneCode: '',
        zoneName: '',
        status: 'ACTIVE',
        areas: []
    });

    const [originalAreas, setOriginalAreas] = useState<Area[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const { data: zoneData, isLoading: isLoadingZone } = useQuery({
        queryKey: ['zone-detail', editingId],
        queryFn: () => axiosOperations.request({
            url: `/delivery/zones`,
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
        if (isEditMode && zoneData?.data?.zoneList && !isInitializedRef.current) {
            const zones: ZoneApiResponse[] = zoneData.data.zoneList;
            const zone = zones.find((z: ZoneApiResponse) => z.zoneId === editingId);
            
            if (!zone) {
                toast.error('Zone not found');
                router.push('/operations/delivery');
                return;
            }

            if (zoneCodeOptions.length === 0 || zoneNameOptions.length === 0 || statusOptions.length === 0 || areaOptions.length === 0) {
                return;
            }

            setIsLoadingData(true);

            const zoneCode = (zone.zoneCode || '').toLowerCase();
            const zoneName = (zone.zoneName || '').toLowerCase();
            const status = (zone.status || '').toLowerCase();

            const zoneCodeInfo = zoneCodeOptions.find(option => option.id.toLowerCase() === zoneCode);
            const zoneNameInfo = zoneNameOptions.find(option => option.id.toLowerCase() === zoneName);
            const statusInfo = statusOptions.find(option => option.id.toLowerCase() === status);

            const areas = zone.areaList || [];
            
            // Store original areas with their IDs
            setOriginalAreas(areas);

            const newFormData = {
                id: zone.zoneId || 0,
                zoneCode: zoneCodeInfo?.id || zone.zoneCode || '',
                zoneName: zoneNameInfo?.id || zone.zoneName || '',
                status: statusInfo?.id || zone.status || 'ACTIVE',
                areas: areas
            };

            formDataRef.current = newFormData;
            setFormData(newFormData);
            isInitializedRef.current = true;
            setIsLoadingData(false);
        }
    }, [zoneData, editingId, isEditMode, zoneCodeOptions, zoneNameOptions, statusOptions, areaOptions, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        formDataRef.current = newFormData;
        setFormData(newFormData);
    };

    const handleSelectChange = (name: string, value: string) => {

        if (!value && formDataRef.current[name as keyof ZoneFormData]) {
            return;
        }

        const newFormData = {
            ...formData,
            [name]: value
        };

        formDataRef.current = newFormData;
        setFormData(newFormData);
    };

    const handleAreaToggle = (areaName: string, checked: boolean) => {
        setFormData(prev => {
            const areaId = areaName.toLowerCase();
            const existingAreaIndex = prev.areas.findIndex(a => a.areaName.toLowerCase() === areaId);
            
            if (checked) {
                // Check if area exists in original areas to get its ID
                const originalArea = originalAreas.find(a => a.areaName.toLowerCase() === areaId);
                
                if (existingAreaIndex >= 0) {
                    // Area already in the list, nothing to do
                    return prev;
                } else {
                    // Add new area
                    const newArea: Area = {
                        id: originalArea?.id || 0, // Use original ID if exists, otherwise 0 for new area
                        areaName: areaOptions.find(a => a.id.toLowerCase() === areaId)?.name || areaName
                    };
                    
                    return {
                        ...prev,
                        areas: [...prev.areas, newArea]
                    };
                }
            } else {
                // Remove area
                if (existingAreaIndex >= 0) {
                    const newAreas = [...prev.areas];
                    newAreas.splice(existingAreaIndex, 1);
                    return {
                        ...prev,
                        areas: newAreas
                    };
                }
                return prev;
            }
        });
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

    const createZoneMutation = useMutation({
        mutationFn: (zoneData: ZoneFormData) =>
            axiosOperations.post('/delivery/zone/save', {
                ...zoneData,
                areas: zoneData.areas.map(area => ({
                    id: area.id || 0,
                    areaName: area.areaName
                }))
            }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Delivery zone created successfully');
                router.push('/operations/delivery');
            } else {
                toast.error(data?.data?.desc || 'Failed to create delivery zone');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create delivery zone');
        }
    });

    const updateZoneMutation = useMutation({
        mutationFn: (zoneData: ZoneFormData) =>
            axiosOperations.post('/delivery/zone/save', {
                ...zoneData,
                id: zoneData.id,
                areas: zoneData.areas.map(area => {
                    // Find the original area to get the correct ID
                    const originalArea = originalAreas.find(a => 
                        a.areaName.toLowerCase() === area.areaName.toLowerCase()
                    );
                    
                    return {
                        id: originalArea?.id || area.id || 0,
                        areaName: area.areaName
                    };
                })
            }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Delivery zone updated successfully');
                router.push('/operations/delivery');
            } else {
                toast.error(data?.data?.desc || 'Failed to update delivery zone');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update delivery zone');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.zoneCode) {
            toast.error('Zone code is required');
            return;
        }

        if (!formData.zoneName) {
            toast.error('Zone name is required');
            return;
        }

        if (!formData.status) {
            toast.error('Status is required');
            return;
        }

        const submitData = {
            ...formData,
            areas: formData.areas.map(area => {
                // For edit mode, preserve original IDs
                if (isEditMode) {
                    const originalArea = originalAreas.find(a => 
                        a.areaName.toLowerCase() === area.areaName.toLowerCase()
                    );
                    return {
                        id: originalArea?.id || area.id || 0,
                        areaName: area.areaName
                    };
                }
                return {
                    id: area.id || 0,
                    areaName: area.areaName
                };
            })
        };

        if (isEditMode) {
            updateZoneMutation.mutate(submitData);
        } else {
            createZoneMutation.mutate(submitData);
        }
    };

    const isLoading = isLoadingZone || createZoneMutation.isPending || updateZoneMutation.isPending || isLoadingData;
    const isLookupsLoading = isEditMode && (zoneCodeOptions.length === 0 || zoneNameOptions.length === 0 || statusOptions.length === 0 || areaOptions.length === 0);

    if (isLoadingZone || isLoadingData) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-accent/70 animate-spin" />
                    </div>
                    <p className="text-gray-600">
                        Loading delivery zone data...
                    </p>
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
                        onClick={() => router.push('/operations/delivery')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Delivery
                    </Button>
                </div>

                <div className="flex items-center justify-center mb-8">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-accent/70" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isEditMode ? 'Edit Delivery Zone' : 'Create New Delivery Zone'}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {isEditMode ? 'Update delivery zone details' : 'Create a new delivery zone with areas'}
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Zone Information
                            </h2>
                            <p className="text-gray-600 mb-6">Basic zone details and configuration</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="zoneCode" className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                        <span>Zone Code</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                            <span className="text-sm text-gray-600">Loading zone codes...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.zoneCode || ""}
                                            onValueChange={(value) => handleSelectChange('zoneCode', value)}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className="border-gray-300">
                                                <SelectValue placeholder="Select zone code">
                                                    {formData.zoneCode ? getSelectDisplayValue(zoneCodeOptions, formData.zoneCode) : "Select zone code"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {zoneCodeOptions.map((option) => (
                                                    <SelectItem key={option.id} value={option.id}>
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="zoneName" className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                        <span>Zone Name</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                            <span className="text-sm text-gray-600">Loading zone names...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.zoneName || ""}
                                            onValueChange={(value) => handleSelectChange('zoneName', value)}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className="border-gray-300">
                                                <SelectValue placeholder="Select zone name">
                                                    {formData.zoneName ? getSelectDisplayValue(zoneNameOptions, formData.zoneName) : "Select zone name"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {zoneNameOptions.map((option) => (
                                                    <SelectItem key={option.id} value={option.id}>
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status" className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                        <span>Status</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                            <span className="text-sm text-gray-600">Loading status options...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.status || ""}
                                            onValueChange={(value) => handleSelectChange('status', value)}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className="border-gray-300">
                                                <SelectValue placeholder="Select status">
                                                    {getSelectDisplayValue(statusOptions, formData.status)}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((option) => (
                                                    <SelectItem key={option.id} value={option.id}>
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Areas Configuration
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Select the areas included in this delivery zone
                            </p>

                            {isLookupsLoading ? (
                                <div className="flex items-center justify-center p-8">
                                    <div className="text-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">Loading area options...</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {areaOptions.map((area) => {
                                            const isSelected = formData.areas.some(a => 
                                                a.areaName.toLowerCase() === area.id.toLowerCase()
                                            );
                                            const originalArea = originalAreas.find(a => 
                                                a.areaName.toLowerCase() === area.id.toLowerCase()
                                            );
                                            
                                            return (
                                                <div key={area.id} className="flex items-center justify-center space-x-3">
                                                    <Checkbox
                                                        id={`area-${area.id}`}
                                                        checked={isSelected}
                                                        onCheckedChange={(checked) => 
                                                            handleAreaToggle(area.id, checked as boolean)
                                                        }
                                                        className="border-gray-300 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                                                    />
                                                    <Label 
                                                        htmlFor={`area-${area.id}`}
                                                        className="text-sm text-gray-700 cursor-pointer flex-1"
                                                    >
                                                        {area.name}
                                                    </Label>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {areaOptions.length === 0 && (
                                        <div className="text-center py-8">
                                            <p className="text-gray-600">No areas available. Please configure areas first.</p>
                                        </div>
                                    )}

                                    <div className="mt-4 text-sm text-gray-600">
                                        <p>Selected areas: {formData.areas.length} / {areaOptions.length}</p>
                                        {isEditMode && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Original area IDs are preserved for updates
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/operations/delivery')}
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
                                        {isEditMode ? 'Update Zone' : 'Create Zone'}
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