'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import useGetLookup from "@/app/hooks/useGetLookup";
import { SelectOption } from '@/types';

interface Zone {
    zoneId: number;
    zoneCode: string;
    zoneName: string;
}

interface SaveRoutePriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    zones: Zone[];
}

interface RoutePrice {
    id: number;
    fromZoneCode: string;
    toZoneCode: string;
    amount: number;
    estimatedTime: number;
    estimatedTimeType: string;
}

interface CalculateResponse {
    responseCode: string;
    responseMessage: string;
    routePrices: Array<{
        fromZoneCode?: string;
        toZoneCode?: string;
        amount: number;
        id?: number;
        estimatedTime?: number;
        estimatedTimeType?: string;
    }>;
}

export default function SaveRoutePriceModal({ isOpen, onClose, zones }: SaveRoutePriceModalProps) {
    const [formData, setFormData] = useState<RoutePrice>({
        id: 0,
        fromZoneCode: '',
        toZoneCode: '',
        amount: 0,
        estimatedTime: 0,
        estimatedTimeType: ''
    });
    const [existingPrice, setExistingPrice] = useState<RoutePrice | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const estimatedTimeTypeOptions: SelectOption[] = useGetLookup('ESTIMATED_TIME_TYPE');

    useEffect(() => {
        if (formData.fromZoneCode && formData.toZoneCode) {
            checkExistingPrice();
        } else {
            setExistingPrice(null);
        }
    }, [formData.fromZoneCode, formData.toZoneCode]);

    const checkExistingPrice = async () => {
        setIsChecking(true);
        try {
            const response = await axiosOperations.request<CalculateResponse>({
                url: '/delivery/calculate',
                method: 'GET',
                params: {
                    fromZoneCode: formData.fromZoneCode,
                    toZoneCode: formData.toZoneCode
                }
            });

            if (response.data?.responseCode !== '000') {
                if (response.data?.responseCode !== 'E20') {
                    toast.error(response.data?.responseMessage || 'Failed to check existing price');
                }
                if (response.data?.responseCode === 'E20') {
                    // console.log('Route price does not exist, this is a new route');
                }
            }

            if (response.data?.routePrices?.[0]) {
                const price = response.data.routePrices[0];
                setExistingPrice({
                    id: price.id || 0,
                    fromZoneCode: formData.fromZoneCode,
                    toZoneCode: formData.toZoneCode,
                    amount: price.amount || 0,
                    estimatedTime: price.estimatedTime || 0,
                    estimatedTimeType: price.estimatedTimeType || ''
                });

                if (price.id) {
                    setFormData(prev => ({
                        ...prev,
                        amount: price.amount || 0,
                        estimatedTime: price.estimatedTime || 0,
                        estimatedTimeType: price.estimatedTimeType || ''
                    }));
                }
            } else {
                setExistingPrice(null);
            }
        } catch (error: any) {
            console.error('Error checking existing price:', error);
            if (error.response?.status !== 404 && !error.message?.includes('not found')) {
                toast.error('Failed to check existing price');
            }
            setExistingPrice(null);
        } finally {
            setIsChecking(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('Time') ? parseInt(value) || 0 : parseFloat(value) || 0
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const saveRoutePriceMutation = useMutation({
        mutationFn: (priceData: RoutePrice) =>
            axiosOperations.post('/delivery/route-price/save', {
                id: priceData.id || 0,
                fromZoneCode: priceData.fromZoneCode,
                toZoneCode: priceData.toZoneCode,
                amount: priceData.amount,
                estimatedTime: priceData.estimatedTime,
                estimatedTimeType: priceData.estimatedTimeType
            }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success(existingPrice ? 'Route price updated successfully' : 'Route price saved successfully');
                resetForm();
                onClose();
            } else {
                toast.error(data?.data?.desc || 'Failed to save route price');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to save route price');
        }
    });

    const resetForm = () => {
        setFormData({
            id: 0,
            fromZoneCode: '',
            toZoneCode: '',
            amount: 0,
            estimatedTime: 0,
            estimatedTimeType: ''
        });
        setExistingPrice(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fromZoneCode) {
            toast.error('Please select source zone');
            return;
        }

        if (!formData.toZoneCode) {
            toast.error('Please select destination zone');
            return;
        }

        if (formData.amount <= 0) {
            toast.error('Amount must be greater than 0');
            return;
        }

        if (formData.estimatedTime <= 0) {
            toast.error('Estimated time must be greater than 0');
            return;
        }

        if (!formData.estimatedTimeType) {
            toast.error('Please select estimated time type');
            return;
        }

        const submitData = {
            ...formData,
            id: existingPrice?.id || 0
        };

        saveRoutePriceMutation.mutate(submitData);
    };

    const getZoneDisplay = (zoneCode: string) => {
        const zone = zones.find(z => z.zoneCode === zoneCode);
        return zone ? `${zone.zoneCode} - ${zone.zoneName}` : zoneCode;
    };

    const getTimeTypeDisplay = (timeType: string) => {
        const option = estimatedTimeTypeOptions.find(opt => opt.id === timeType);
        return option ? option.name : timeType;
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const zoneCodes = [...new Set(zones.map(z => z.zoneCode))];

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className='flex flex-col'>
                    <DialogTitle>Save Route Price</DialogTitle>
                    <DialogDescription>
                        Configure delivery price between zones
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fromZoneCode" className="text-sm font-medium">
                                From Zone <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.fromZoneCode || ""}
                                onValueChange={(value) => handleSelectChange('fromZoneCode', value)}
                                disabled={saveRoutePriceMutation.isPending}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select source zone">
                                        {formData.fromZoneCode ? getZoneDisplay(formData.fromZoneCode) : "Select zone"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {zoneCodes.map((zoneCode) => {
                                        const zone = zones.find(z => z.zoneCode === zoneCode);
                                        return (
                                            <SelectItem key={zoneCode} value={zoneCode}>
                                                {zoneCode} - {zone?.zoneName || zoneCode}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="toZoneCode" className="text-sm font-medium">
                                To Zone <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.toZoneCode || ""}
                                onValueChange={(value) => handleSelectChange('toZoneCode', value)}
                                disabled={saveRoutePriceMutation.isPending}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select destination zone">
                                        {formData.toZoneCode ? getZoneDisplay(formData.toZoneCode) : "Select zone"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {zoneCodes.map((zoneCode) => {
                                        const zone = zones.find(z => z.zoneCode === zoneCode);
                                        return (
                                            <SelectItem key={zoneCode} value={zoneCode}>
                                                {zoneCode} - {zone?.zoneName || zoneCode}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isChecking && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Checking for existing price...
                        </div>
                    )}

                    {existingPrice && (
                        <div className="bg-accent/20 border-2 border-accent rounded-xl p-3">
                            <p className="text-sm text-accent font-medium">
                                Route price already exists
                            </p>
                            <div className='flex gap-2'>
                                <p className="text-sm text-black mt-1">
                                    Current price: <span className="font-bold">₦{existingPrice.amount.toLocaleString()}</span>
                                </p>
                                {'|'}
                                <p className="text-sm text-black mt-1">
                                    Estimated arrival: <span className="font-bold">{existingPrice.estimatedTime || 0} {`${existingPrice.estimatedTimeType?.toLowerCase()}(s)` || ''}</span>
                                </p>
                            </div>
                            <p className="text-xs text-black mt-1">
                                Enter new values to update
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-sm font-medium">
                                Amount (₦) <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
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
                                    className="pl-10"
                                    placeholder="Enter delivery amount"
                                    required
                                    disabled={saveRoutePriceMutation.isPending}
                                />
                            </div>
                            {existingPrice && (
                                <p className="text-xs text-gray-500">
                                    Original price: ₦{existingPrice.amount.toLocaleString()}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="estimatedTime" className="text-sm font-medium">
                                Estimated Time <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="estimatedTime"
                                name="estimatedTime"
                                type="number"
                                min="1"
                                value={formData.estimatedTime || ""}
                                onChange={handleInputChange}
                                placeholder="Enter estimated time"
                                required
                                disabled={saveRoutePriceMutation.isPending}
                            />
                            {existingPrice && existingPrice.estimatedTime > 0 && (
                                <p className="text-xs text-gray-500">
                                    Original time: {existingPrice.estimatedTime} {getTimeTypeDisplay(existingPrice.estimatedTimeType)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="estimatedTimeType" className="text-sm font-medium">
                            Estimated Time Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.estimatedTimeType || ""}
                            onValueChange={(value) => handleSelectChange('estimatedTimeType', value)}
                            disabled={saveRoutePriceMutation.isPending}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select time type">
                                    {formData.estimatedTimeType ? getTimeTypeDisplay(formData.estimatedTimeType) : "Select time type"}
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
                        {existingPrice && existingPrice.estimatedTimeType && (
                            <p className="text-xs text-gray-500">
                                Original time type: {getTimeTypeDisplay(existingPrice.estimatedTimeType)}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="border-gray-300 hover:bg-gray-100"
                            disabled={saveRoutePriceMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={saveRoutePriceMutation.isPending}
                            className="bg-accent/70 hover:bg-accent/90 text-white"
                        >
                            {saveRoutePriceMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    {existingPrice ? 'Updating...' : 'Saving...'}
                                </>
                            ) : (
                                existingPrice ? 'Update Price' : 'Save Price'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}