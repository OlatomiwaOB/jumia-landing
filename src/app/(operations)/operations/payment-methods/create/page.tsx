'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { useFileUpload } from '@/app/hooks/useUpload';
import useUser from '@/store/userStore';
import { PaymentMethod } from '@/types';
import { CameraIcon } from '@/components/icons/icons';

interface PaymentMethodFormData {
    name: string;
    code: string;
    paymentType: string;
    serviceProvider: string;
    fee: string;
    feeType: string;
    capLimit: string;
    status: string;
    country: string;
    description: string;
    subTitle: string;
    logo: string;
    isRecommended: boolean;
    recommendedTitle: string;
    features: string[];
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

export default function CreatePaymentMethodPage() {
    usePageMetadata('Payment Methods', 'Create or edit payment method configurations.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_PAYMENT_METHODS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage payment methods"
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingCode, setEditingCode] = useState<string | null>(null);
    const [isFormInitialized, setIsFormInitialized] = useState(false);
    const [featureInput, setFeatureInput] = useState('');
    const { previewUrl, handleFileChange, fileUrl, isUploadingFile, setPreviewUrl, setFileUrl } = useFileUpload();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useUser();

    const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm<PaymentMethodFormData>({
        defaultValues: {
            name: '', code: '', paymentType: '', serviceProvider: '',
            fee: '0', feeType: 'FLAT', capLimit: '0', status: 'ACTIVE',
            country: 'ALL', description: '', subTitle: '', logo: '',
            isRecommended: false, recommendedTitle: '', features: [],
        },
    });

    const features = watch("features");
    const isRecommended = watch("isRecommended");
    const logoValue = watch("logo");

    useEffect(() => {
        const editParam = searchParams.get('edit');
        const codeParam = searchParams.get('code');
        if (editParam === 'true' && codeParam) {
            setIsEditMode(true);
            setEditingCode(codeParam);
        }
    }, [searchParams]);

    const { data: methodsData } = useQuery({
        queryKey: ['payment-methods'],
        queryFn: () => axiosOperations.request({
            url: '/payment-methods/fetch',
            method: 'GET',
            params: { storeCode: 'STO0715' }
        }),
    });

    useEffect(() => {
        if (methodsData?.data?.list && isEditMode && editingCode && !isFormInitialized) {
            const found = methodsData.data.list.find((m: PaymentMethod) => m.code === editingCode);
            if (found) {
                setValue('name', found.name || '');
                setValue('code', found.code || '');
                setValue('paymentType', found.paymentType || '');
                setValue('serviceProvider', found.serviceProvider || '');
                setValue('fee', found.fee?.toString() || '0');
                setValue('feeType', found.feeType || 'FLAT');
                setValue('capLimit', found.capLimit?.toString() || '0');
                setValue('status', found.status || 'ACTIVE');
                setValue('country', found.country || 'ALL');
                setValue('description', found.description || '');
                setValue('subTitle', found.subTitle || '');
                setValue('logo', found.logo || '');
                setValue('isRecommended', found.isRecommended || false);
                setValue('recommendedTitle', found.recommendedTitle || '');
                setValue('features', found.features || []);
                if (found.logo) setPreviewUrl(found.logo);
                setIsFormInitialized(true);
            }
        }
    }, [methodsData, isEditMode, editingCode, setValue, setPreviewUrl, isFormInitialized]);

    useEffect(() => {
        if (logoValue && logoValue.startsWith("http")) {
            setPreviewUrl(logoValue);
        }
    }, [logoValue]);

    useEffect(() => {
        if (fileUrl) {
            setValue("logo", fileUrl);
        }
    }, [fileUrl, setValue]);

    const saveMutation = useMutation({
        mutationFn: (data: any) => axiosOperations.request({
            url: '/payment-methods/save',
            method: 'POST',
            params: { storeCode: 'STO0715' },
            data
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') {
                toast.error(data?.data?.desc || 'Failed to save payment method');
                return;
            }
            queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
            toast.success(isEditMode ? "Payment method updated successfully" : "Payment method created successfully");
            router.push('/operations/payment-methods');
        },
        onError: () => {
            toast.error("Failed to save payment method");
        },
    });

    const addFeature = () => {
        if (featureInput.trim()) {
            setValue("features", [...features, featureInput.trim()]);
            setFeatureInput("");
        }
    };

    const removeFeature = (index: number) => {
        setValue("features", features.filter((_, i) => i !== index));
    };

    const onSubmit = (data: PaymentMethodFormData) => {
        const payload = {
            paymentType: data.paymentType,
            serviceProvider: data.serviceProvider,
            code: data.code,
            name: data.name,
            description: data.description,
            country: data.country,
            status: data.status,
            fee: data.fee,
            capLimit: data.capLimit,
            feeType: data.feeType,
            discount: null,
            entityCode: user?.entityCode,
            logo: fileUrl || logoValue || '',
            isRecommended: data.isRecommended,
            recommendedTitle: data.recommendedTitle,
            subTitle: data.subTitle,
            features: data.features,
        };
        saveMutation.mutate(payload);
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl">
                <div className="mb-4">
                    <Button variant="link" onClick={() => router.push('/operations/payment-methods')}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </div>

                <div className='container mx-auto px-20 py-6'>
                    <div className="mb-6">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">
                            {isEditMode ? 'Edit Payment Method' : 'Create Payment Method'}
                        </h1>
                        <p className="text-xs lg:text-sm font-normal text-medium-gray">
                            {isEditMode ? 'Update payment method configuration' : 'Add a new payment method'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className='bg-white px-6 py-4 rounded-2xl'>
                            <FormSection title="Transaction Information" subtitle="Transaction identity and classification.">
                                <FormField label="Name" required>
                                    <Input {...register('name', { required: true })} placeholder="e.g., Card Payment" />
                                </FormField>
                                <FormField label="Code" required>
                                    <Input {...register('code', { required: true })} placeholder="e.g., CARD_PAYMENT" disabled={isEditMode} />
                                    {isEditMode && <p className="text-xs text-medium-gray mt-1">Code cannot be changed</p>}
                                </FormField>
                                <FormField label="Payment Type" required>
                                    <Controller
                                        control={control} name="paymentType" rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="CARD">Card</SelectItem>
                                                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                                    <SelectItem value="CRYPTO_TOKEN">Crypto Token</SelectItem>
                                                    <SelectItem value="STABLECOIN">Stablecoin</SelectItem>
                                                    <SelectItem value="WALLET">Wallet</SelectItem>
                                                    <SelectItem value="BNPL">Buy Now Pay Later</SelectItem>
                                                    <SelectItem value="REXPAY">RexPay</SelectItem>
                                                    <SelectItem value="SOLANA_PAY">Solana Pay</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </FormField>
                                <FormField label="Service Provider" required>
                                    <Input {...register('serviceProvider', { required: true })} placeholder="e.g., VISA_MASTERCARD" />
                                </FormField>
                                <FormField label="Fee" required>
                                    <Input {...register('fee', { required: true })} placeholder="e.g., 2.5" />
                                </FormField>
                                <FormField label="Fee Type" required>
                                    <Controller
                                        control={control} name="feeType" rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger><SelectValue placeholder="Select fee type" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="FLAT">Flat</SelectItem>
                                                    <SelectItem value="PERCENT">Percent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </FormField>
                                <FormField label="Cap Limit" required>
                                    <Input {...register('capLimit', { required: true })} placeholder="e.g., 2000" />
                                </FormField>
                                <FormField label="Status" required>
                                    <Controller
                                        control={control} name="status" rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </FormField>
                                <FormField label="Country" required>
                                    <Input {...register('country', { required: true })} placeholder="e.g., ALL or GB" />
                                </FormField>
                                <div className="col-span-2">
                                    <FormField label="Description" required>
                                        <Textarea {...register('description', { required: true })} placeholder="Describe the payment method" rows={3} />
                                    </FormField>
                                </div>
                                <div className="col-span-2">
                                    <FormField label="Subtitle" required>
                                        <Input {...register('subTitle', { required: true })} placeholder="e.g., Visa, Mastercard, Amex" />
                                    </FormField>
                                </div>
                            </FormSection>

                            <FormSection title="Logo & Features" subtitle="Upload logo and add features.">
                                <div className="col-span-2">
                                    <FormField label="Upload Logo">
                                        <div className="space-y-4">
                                            {/* Preview */}
                                            {previewUrl && (
                                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center p-2 border border-gray-200">
                                                        <img src={previewUrl} alt="Logo preview" className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="flex-1 text-sm text-medium-gray">Logo preview</div>
                                                    <Button
                                                        type="button" variant="ghost" size="sm"
                                                        onClick={() => { setValue("logo", ""); setPreviewUrl(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                                        className="hover:text-red-500"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}

                                            <div className="border-2 border-dashed border-faded-accent rounded-lg p-6 text-center hover:border-orange-300 transition-colors">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    id="logo-upload"
                                                />
                                                <Label htmlFor="logo-upload" className="cursor-pointer">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <CameraIcon />
                                                        <p className="text-sm text-dark-gray">
                                                            <span className="text-faded-accent font-medium">Click to upload</span>
                                                        </p>
                                                        <p className="text-xs text-medium-gray">PNG, JPG or WebP (max. 5MB)</p>
                                                    </div>
                                                </Label>
                                            </div>

                                            <div className="relative">
                                                <Input
                                                    placeholder="Or paste image URL"
                                                    {...register('logo')}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                    </FormField>
                                </div>

                                <div className="col-span-2">
                                    <FormField label="Recommended">
                                        <div className="flex items-center justify-between p-4 bg-[#FFF6F0] rounded-lg border border-[#FEE1CD]">
                                            <div>
                                                <p className="text-sm font-medium text-dark-gray">Recommended</p>
                                                <p className="text-xs text-medium-gray">Mark this payment method as recommended</p>
                                            </div>
                                            <Controller
                                                control={control} name="isRecommended"
                                                render={({ field }) => (
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                )}
                                            />
                                        </div>
                                    </FormField>
                                </div>

                                {isRecommended && (
                                    <FormField label="Recommended Title">
                                        <Input {...register('recommendedTitle')} placeholder="e.g., AI Recommended" />
                                    </FormField>
                                )}

                                <div className="col-span-2">
                                    <FormField label="Features">
                                        <div className="space-y-3">
                                            <div className="flex gap-2 items-center">
                                                <Input
                                                    placeholder="Add a new feature"
                                                    value={featureInput}
                                                    onChange={(e) => setFeatureInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                                                />
                                                <Button type="button" onClick={addFeature} size="icon">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {features.map((feature, index) => (
                                                    <div key={index} className="flex items-center gap-1 bg-[#E9CCF4] text-[#9200C7] px-3 py-1 rounded-full text-sm">
                                                        {feature}
                                                        <button type="button" onClick={() => removeFeature(index)} className="ml-1 hover:text-red-500">
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </FormField>
                                </div>
                            </FormSection>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={saveMutation.isPending}>
                                {saveMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : (isEditMode ? 'Update Method' : 'Create Method')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}