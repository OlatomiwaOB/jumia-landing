'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Loader2, Clock, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface OptionType {
    id: number;
    typeCode: string;
    typeName: string;
    multiplier: number;
    description: string;
    status: string;
}

interface CalculateSummaryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    optionType: OptionType | null;
}

export const CalculateSummaryModal: React.FC<CalculateSummaryModalProps> = ({ open, onOpenChange, optionType }) => {
    const [zoneCode, setZoneCode] = useState('');
    const [totalWeightKg, setTotalWeightKg] = useState('');
    const [calculationResult, setCalculationResult] = useState<any>(null);
    const [summaryResults, setSummaryResults] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'summary' | 'calculate'>('summary');

    const { data: deliveryOptionsData } = useQuery({
        queryKey: ['delivery-options-for-zones-calc'],
        queryFn: () => axiosOperations.request({
            url: '/delivery/option/all',
            method: 'GET'
        }),
        enabled: open
    });

    const deliveryOptions = deliveryOptionsData?.data?.deliveryOptions || [];
    const uniqueZones: string[] = Array.from(new Set(deliveryOptions.map((o: any) => o.groupCode)));

    const handleGetSummary = async () => {
        if (!zoneCode || !totalWeightKg) return;

        try {
            const response = await axiosOperations.request({
                url: `/delivery-by-weight/options-summary?zoneCode=${zoneCode}&totalWeightKg=${parseFloat(totalWeightKg)}`,
                method: 'GET'
            });

            if (response?.data?.options.responseCode === '000') {
                setSummaryResults(response.data.options || []);
            } else {
                toast.error(response?.data?.options?.responseMessage || 'Failed to fetch summary');
            }
        } catch (error) {
            console.error('Failed to fetch summary:', error);
        }
    };

    const handleCalculate = async () => {
        if (!zoneCode || !totalWeightKg || !optionType) return;

        try {
            const response = await axiosOperations.request({
                url: '/delivery-by-weight/calculate',
                method: 'POST',
                data: {
                    zoneCode,
                    typeCode: optionType.typeCode,
                    totalWeightKg: parseFloat(totalWeightKg)
                }
            });

            if (response?.data?.responseCode === '000') {
                setCalculationResult(response.data);
            } else {
                toast.error(response?.data?.responseMessage || 'Failed to calculate');
            }
        } catch (error) {
            console.error('Failed to calculate:', error);
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2 }).format(amount || 0);
    };

    if (!optionType) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                <DialogTitle className="sr-only">Calculate & Summary</DialogTitle>

                <div className="px-6 pt-5 pb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <Calculator className="w-5 h-5 text-orange-500" />
                        <div>
                            <h2 className="text-base font-semibold text-dark-gray">Delivery Calculator</h2>
                            <p className="text-xs text-medium-gray mt-0.5">
                                Type: {optionType.typeName} ({optionType.typeCode}) - Multiplier: {optionType.multiplier}x
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Zone</Label>
                                <Select value={zoneCode} onValueChange={setZoneCode}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {uniqueZones.map((zone: string) => (
                                            <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Total Weight (kg)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={totalWeightKg}
                                    onChange={(e) => setTotalWeightKg(e.target.value)}
                                    placeholder="e.g., 3"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={() => { setActiveTab('summary'); handleGetSummary(); }} variant={activeTab === 'summary' ? 'default' : 'outline'}>
                                Get Summary
                            </Button>
                            <Button onClick={() => { setActiveTab('calculate'); handleCalculate(); }} variant={activeTab === 'calculate' ? 'default' : 'outline'}>
                                Calculate
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 space-y-4">
                        {activeTab === 'summary' && summaryResults.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-dark-gray">Summary for {zoneCode} - {totalWeightKg}kg</h3>
                                {summaryResults.map((result: any, index: number) => (
                                    <div key={index} className="bg-white rounded-xl p-4 border border-gray-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <Badge className={`text-xs px-3 py-1 ${result.typeCode === 'REGULAR' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                {result.typeName}
                                            </Badge>
                                            <div className="flex items-center gap-2 text-xs text-medium-gray">
                                                <Clock className="w-3.5 h-3.5" />
                                                {result.estimatedTime} {result.estimatedTimeType?.toLowerCase()}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-xs text-medium-gray">Base Fee</p>
                                                <p className="font-medium">₦{formatCurrency(result.baseFee)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-medium-gray">Weight Fee</p>
                                                <p className="font-medium">₦{formatCurrency(result.weightFee)}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-dark-gray">Final Fee</p>
                                                <p className="text-lg font-bold text-orange-500">₦{formatCurrency(result.finalFee)}</p>
                                            </div>
                                            <p className="text-xs text-medium-gray mt-2">{result.breakdown}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'calculate' && calculationResult && (
                            <div className="bg-white rounded-xl p-4 border border-gray-100">
                                <h3 className="text-sm font-semibold text-dark-gray mb-3">Calculation Result</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Badge className={`text-xs px-3 py-1 ${calculationResult.typeCode === 'REGULAR' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {calculationResult.typeName}
                                        </Badge>
                                        <div className="flex items-center gap-2 text-xs text-medium-gray">
                                            <Clock className="w-3.5 h-3.5" />
                                            {calculationResult.estimatedTime} {calculationResult.estimatedTimeType?.toLowerCase()}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-xs text-medium-gray">Base Fee</p>
                                            <p className="font-medium">₦{formatCurrency(calculationResult.baseFee)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-medium-gray">Weight Fee</p>
                                            <p className="font-medium">₦{formatCurrency(calculationResult.weightFee)}</p>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-dark-gray">Final Fee</p>
                                            <p className="text-lg font-bold text-orange-500">₦{formatCurrency(calculationResult.finalFee)}</p>
                                        </div>
                                        <p className="text-xs text-medium-gray mt-2">{calculationResult.breakdown}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};