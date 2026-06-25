'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';

interface OptionType {
    id: number;
    typeCode: string;
    typeName: string;
    multiplier: number;
    description: string;
    status: string;
}

interface OptionTypeFormData {
    id: number;
    typeCode: string;
    typeName: string;
    multiplier: number;
    description: string;
    status: string;
    storeCode?: string;
}

interface CreateEditOptionTypeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    optionType: OptionType | null;
    onSuccess: () => void;
}

const storeCode = process.env.NEXT_PUBLIC_STORE_CODE!;

export const CreateEditOptionTypeModal: React.FC<CreateEditOptionTypeModalProps> = ({ 
    open, 
    onOpenChange, 
    optionType, 
    onSuccess 
}) => {
    const isEditMode = !!optionType;

    const defaultFormData: OptionTypeFormData = {
        id: 0,
        typeCode: '',
        typeName: '',
        multiplier: 1.0,
        description: '',
        status: 'Active'
    };

    const [formData, setFormData] = useState<OptionTypeFormData>(defaultFormData);

    // Reset or populate form when modal opens or optionType changes
    useEffect(() => {
        if (open) {
            if (optionType) {
                setFormData({
                    id: optionType.id || 0,
                    typeCode: optionType.typeCode || '',
                    typeName: optionType.typeName || '',
                    multiplier: optionType.multiplier || 1.0,
                    description: optionType.description || '',
                    status: optionType.status || 'Active'
                });
            } else {
                setFormData(defaultFormData);
            }
        }
    }, [open, optionType]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'multiplier') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const saveMutation = useMutation({
        mutationFn: (data: OptionTypeFormData) =>
            axiosOperations.post('/delivery-by-weight/option-type/save', data),
        onSuccess: (data) => {
            if (data?.data?.code === '000' || data?.data?.responseCode === '000') {
                toast.success(isEditMode ? 'Option type updated successfully' : 'Option type created successfully');
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error(data?.data?.desc || data?.data?.responseMessage || 'Failed to save option type');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || error.response?.data?.desc || 'Failed to save option type');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.typeCode.trim()) { toast.error('Type code is required'); return; }
        if (!formData.typeName.trim()) { toast.error('Type name is required'); return; }
        if (formData.multiplier <= 0) { toast.error('Multiplier must be greater than 0'); return; }
        
        saveMutation.mutate({ ...formData, storeCode: storeCode });
    };

    const isLoading = saveMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Option Type' : 'Create Option Type'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? 'Update delivery option type details.' : 'Create a new delivery option type.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Type Code <span className="text-red-500">*</span></Label>
                            <Input
                                name="typeCode"
                                value={formData.typeCode}
                                onChange={handleInputChange}
                                placeholder="e.g., REGULAR, EXPRESS"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Type Name <span className="text-red-500">*</span></Label>
                            <Input
                                name="typeName"
                                value={formData.typeName}
                                onChange={handleInputChange}
                                placeholder="e.g., Regular, Express"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Multiplier <span className="text-red-500">*</span></Label>
                            <Input
                                name="multiplier"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.multiplier || ""}
                                onChange={handleInputChange}
                                placeholder="e.g., 1.0 for Regular, 1.5 for Express"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Status <span className="text-red-500">*</span></Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleSelectChange('status', value)}
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

                        <div className="col-span-1 sm:col-span-2 space-y-1.5">
                            <Label>Description</Label>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="e.g., 1 hour EST. delivery"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white">
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                            ) : (isEditMode ? 'Update Option Type' : 'Create Option Type')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
