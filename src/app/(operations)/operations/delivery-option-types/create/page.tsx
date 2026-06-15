'use client'
import React, { useState, useEffect } from 'react';
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
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface OptionTypeFormData {
    id: number;
    typeCode: string;
    typeName: string;
    multiplier: number;
    description: string;
    status: string;
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

export default function CreateOptionTypePage() {
    usePageMetadata('Option Types', 'Create or edit delivery option types.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_DELIVERY_OPTIONS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage delivery option types"
    });

    const searchParams = useSearchParams();
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isFormInitialized, setIsFormInitialized] = useState(false);

    const [formData, setFormData] = useState<OptionTypeFormData>({
        id: 0,
        typeCode: '',
        typeName: '',
        multiplier: 1.0,
        description: '',
        status: 'Active'
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

    const { data: typeData, isLoading: isLoadingType } = useQuery({
        queryKey: ['delivery-option-type-detail', editingId],
        queryFn: () => axiosOperations.request({
            url: `/delivery-by-weight/option-type/all`,
            method: 'GET'
        }),
        enabled: !!editingId && isEditMode,
    });

    useEffect(() => {
        if (isEditMode && typeData?.data?.types && !isFormInitialized) {
            const types = typeData.data.types;
            const type = types.find((t: any) => t.id === editingId);
            if (type) {
                setFormData({
                    id: type.id || 0,
                    typeCode: type.typeCode || '',
                    typeName: type.typeName || '',
                    multiplier: type.multiplier || 1.0,
                    description: type.description || '',
                    status: type.status || 'Active'
                });
                setIsFormInitialized(true);
            }
        }
    }, [typeData, editingId, isEditMode, isFormInitialized]);

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
            if (data?.data?.code === '000') {
                toast.success(isEditMode ? 'Option type updated successfully' : 'Option type created successfully');
                router.push('/operations/delivery-option-types');
            } else {
                toast.error(data?.data?.desc || 'Failed to save option type');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to save option type');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.typeCode.trim()) { toast.error('Type code is required'); return; }
        if (!formData.typeName.trim()) { toast.error('Type name is required'); return; }
        if (formData.multiplier <= 0) { toast.error('Multiplier must be greater than 0'); return; }
        saveMutation.mutate(formData);
    };

    const isLoading = isLoadingType || saveMutation.isPending;

    if (isLoadingType) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-medium-gray">Loading option type data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl">
                <div className="mb-4">
                    <Button variant="link" onClick={() => router.push('/operations/delivery-option-types')}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </div>

                <div className='container mx-auto px-20 py-6'>
                    <div className="mb-6">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">
                            {isEditMode ? 'Edit Option Type' : 'Create Option Type'}
                        </h1>
                        <p className="text-xs lg:text-sm font-normal text-medium-gray">
                            {isEditMode ? 'Update delivery option type details' : 'Create a new delivery option type'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className='bg-white px-6 py-4 rounded-2xl'>
                            <FormSection title="Option Type Details" subtitle="Configure delivery option type parameters.">
                                <FormField label="Type Code" required>
                                    <Input
                                        name="typeCode"
                                        value={formData.typeCode}
                                        onChange={handleInputChange}
                                        placeholder="e.g., REGULAR, EXPRESS"
                                        required
                                    />
                                </FormField>

                                <FormField label="Type Name" required>
                                    <Input
                                        name="typeName"
                                        value={formData.typeName}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Regular, Express"
                                        required
                                    />
                                </FormField>

                                <FormField label="Multiplier" required>
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
                                </FormField>

                                <FormField label="Status" required>
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
                                </FormField>

                                <div className="col-span-2">
                                    <FormField label="Description">
                                        <Textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 1 hour EST. delivery"
                                            rows={3}
                                        />
                                    </FormField>
                                </div>
                            </FormSection>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                                ) : (isEditMode ? 'Update Option Type' : 'Create Option Type')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}