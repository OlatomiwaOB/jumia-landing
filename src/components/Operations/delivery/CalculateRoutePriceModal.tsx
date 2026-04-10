'use client'
import React, { useState, useEffect } from 'react';
import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useQuery } from '@tanstack/react-query';
import useGetLookup from "@/app/hooks/useGetLookup";
import { SelectOption } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { fromBlobs } from 'viem';
import { toLowerCase } from 'zod';

interface CalculateRoutePriceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface RoutePrice {
    fromAreaName?: string;
    toAreaName?: string;
    fromZoneCode?: string;
    toZoneCode?: string;
    amount: number;
    fromZoneName?: string;
    toZoneName?: string;
    estimatedTime?: number;
    estimatedTimeType?: string;
}

export default function CalculateRoutePriceModal({ isOpen, onClose }: CalculateRoutePriceModalProps) {
    const [calculationType, setCalculationType] = useState<'zones' | 'areas'>('zones');
    const [fromZone, setFromZone] = useState('');
    const [toZone, setToZone] = useState('');
    const [fromArea, setFromArea] = useState('');
    const [toArea, setToArea] = useState('');

    const zoneCodeOptions: SelectOption[] = useGetLookup('ZONE_CODE');
    const areaOptions: SelectOption[] = useGetLookup('AREAS');

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['calculate-route-price', calculationType, fromZone, toZone, fromArea, toArea],
        queryFn: async () => {
            const params: any = {};

            if (calculationType === 'zones') {
                if (fromZone) params.fromZoneCode = fromZone;
                if (toZone) params.toZoneCode = toZone;
            } else {
                if (fromArea) params.fromArea = fromArea;
                if (toArea) params.toArea = toArea;
            }

            const response = await axiosOperations.request({
                url: '/delivery/calculate',
                method: 'GET',
                params
            });

            if (response.data?.responseCode !== '000') {
                if (response.data?.responseCode !== 'E20') {
                    toast.error(response.data?.responseMessage || 'Failed to check existing price');
                }
                if (response.data?.responseCode === 'E20') {
                    toast.error(response.data?.responseMessage || 'Route price does not exist');
                }
            } else {
                toast.success('Route price calculated successfully');
            }

            return response;
        },

        enabled: false,
        retry: false
    });

    const handleCalculate = () => {
        if (calculationType === 'zones') {
            if (!fromZone.trim()) {
                toast.error('Please select source zone');
                return;
            }
            if (!toZone.trim()) {
                toast.error('Please select destination zone');
                return;
            }
        } else {
            if (!fromArea.trim()) {
                toast.error('Please select source area');
                return;
            }
            if (!toArea.trim()) {
                toast.error('Please select destination area');
                return;
            }
        }

        refetch();
    };

    const resetForm = () => {
        setFromZone('');
        setToZone('');
        setFromArea('');
        setToArea('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const routePrices: RoutePrice[] = data?.data?.routePrices || [];
    const hasResult = routePrices.length > 0;
    const totalAmount = routePrices.reduce((sum, price) => sum + price.amount, 0);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className='flex flex-col'>
                    <DialogTitle>Calculate Route Price</DialogTitle>
                    <DialogDescription>
                        Calculate delivery price between zones or areas
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Calculation Type Toggle */}
                    <div className="flex border border-gray-200 rounded-lg p-1">
                        <button
                            type="button"
                            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${calculationType === 'zones'
                                ? 'bg-accent/70 text-white'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            onClick={() => setCalculationType('zones')}
                        >
                            <div className="flex items-center justify-center gap-2">
                                Zone to Zone
                            </div>
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${calculationType === 'areas'
                                ? 'bg-accent/70 text-white'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            onClick={() => setCalculationType('areas')}
                        >
                            <div className="flex items-center justify-center gap-2">
                                Area to Area
                            </div>
                        </button>
                    </div>

                    {calculationType === 'zones' ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="fromZone" className="text-sm font-medium">
                                    From Zone <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={fromZone}
                                    onValueChange={setFromZone}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select source zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {zoneCodeOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="toZone" className="text-sm font-medium">
                                    To Zone <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={toZone}
                                    onValueChange={setToZone}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select destination zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {zoneCodeOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="fromArea" className="text-sm font-medium">
                                    From Area <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={fromArea}
                                    onValueChange={setFromArea}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select source area" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {areaOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="toArea" className="text-sm font-medium">
                                    To Area <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={toArea}
                                    onValueChange={setToArea}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select destination area" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {areaOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {isLoading && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Calculating route price...
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-800">
                                Error calculating route price. Please try again.
                            </p>
                        </div>
                    )}

                    {hasResult && (
                        <div className="space-y-3">
                            <div className="p-4 bg-green-50 border border-green-200 rounded">
                                <h4 className="text-sm font-semibold text-green-800 mb-2">Route Price Result</h4>
                                <div className="space-y-2">
                                    {routePrices.map((price, index) => (
                                        <div key={index} className="text-sm">
                                            {calculationType === 'zones' ? (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-700">
                                                        {price.fromZoneName} → {price.toZoneName}
                                                    </span>
                                                    <span className="font-semibold text-green-700">
                                                        ₦{price.amount.toLocaleString()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-700">
                                                        {price.fromAreaName} → {price.toAreaName}
                                                    </span>
                                                    <span className="font-semibold text-green-700">
                                                        ₦{price.amount.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}

                                            <div>
                                                <hr className="my-2 border-dashed border-green-500" />
                                                Estimated to arrive within {price.estimatedTime || ''} {`${(price.estimatedTimeType)?.toLowerCase()}(s)` || ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {routePrices.length > 1 && (
                                    <div className="mt-3 pt-3 border-t border-green-200 flex items-center justify-between">
                                        <span className="text-sm font-semibold text-green-800">Total:</span>
                                        <span className="text-lg font-bold text-green-800">
                                            ₦{totalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="text-xs text-gray-500">
                                <p>
                                    {calculationType === 'zones'
                                        ? 'This is the calculated delivery price between the specified zones.'
                                        : 'This is the calculated delivery price between the specified areas.'
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="border-gray-300 hover:bg-gray-100"
                        disabled={isLoading}
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={handleCalculate}
                        disabled={isLoading ||
                            (calculationType === 'zones' ? (!fromZone || !toZone) : (!fromArea || !toArea))
                        }
                        className="bg-accent/70 hover:bg-accent/90 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Calculating...
                            </>
                        ) : (
                            'Calculate'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}