'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import useOperations from '@/store/operationsStore';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import useGetLookup from "@/app/hooks/useGetLookup";
import { SelectOption } from '@/types';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { useFileUpload } from "@/app/hooks/useUpload";
import Image from "next/image";
import { X } from "lucide-react";
import { CameraIcon } from '@/components/icons/icons';
import { Badge } from '@/components/ui/badge';

interface BusinessFormData {
    id: number;
    businessName: string;
    merchantGroupCode: string;
    businessType: string;
    merchantServiceCharge: number;
    mscType: string;
    platformFee: number;
    transferFee: number;
    mscCapLimit: number;
    firstname: string;
    lastname: string;
    username: string;
    bvn: string;
    mobileNo: string;
    address: string;
    createdDate: string;
    merchantType: string;
    email: string;
    status: string;
    countryCode: string;
    state: string;
    city: string;
    bankAccountName: string;
    bankName: string;
    accountNo: string;
    settlementPeriodType: string;
    splitSettlementEnabled: string;
    settlementAccountType: string;
    entityCode: string;
    merchantId: string;
    photoLink: string | null
}

interface Document {
    id: number;
    type: string;
    link: string;
    createdDate: string;
    verifyStatus: string;
    comment?: string;
}

const FormSection = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-100 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1 mt-1">
                <h2 className="text-sm font-semibold text-dark-gray">{title}</h2>
                <p className="text-xs text-medium-gray mt-1">{subtitle}</p>
            </div>
            <div className="md:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {children}
                </div>
            </div>
        </div>
    </div>
);

const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <Label>
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {children}
    </div>
);

const getDocStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'Y': return 'bg-green-100 text-green-700 border-green-200';
        case 'R': return 'bg-red-100 text-red-700 border-red-200';
        case 'N': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

export default function CreateBusinessPage() {
    const [isEditMode, setIsEditMode] = useState(false);
    usePageMetadata('Business Management', 'Manage business accounts and details.');

    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_MERCHANTS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage businesses"
    });

    const searchParams = useSearchParams();
    const [editingMerchantCode, setEditingMerchantCode] = useState<string | null>(null);
    const { operations } = useOperations();
    const router = useRouter();
    const [isFormInitialized, setIsFormInitialized] = useState(false);
    const { fileUrl, handleFileChange, fileInputRef, previewUrl, setPreviewUrl, setFileUrl } = useFileUpload();
    const [photoLink, setPhotoLink] = useState<string | null>(null);

    const businessTypeOptions: SelectOption[] = useGetLookup('BUSINESS_TYPE');
    const mscTypeOptions: SelectOption[] = useGetLookup('MSC_TYPE');
    const merchantTypeOptions: SelectOption[] = useGetLookup('MERCHANT_TYPE');
    const statusOptions: SelectOption[] = useGetLookup('STATUS');
    const countryOptions: SelectOption[] = useGetLookup('COUNTRY');
    const settlementPeriodOptions: SelectOption[] = useGetLookup('SETTLEMENT_PERIOD');
    const settlementAccountOptions: SelectOption[] = useGetLookup('SETTLEMENT_ACCOUNT_TYPE');
    const merchantGroupOptions: SelectOption[] = useGetLookup('MERCHANT_GROUP');

    const [areLookupsReady, setAreLookupsReady] = useState(false);

    useEffect(() => {
        const requiredLookupsLoaded =
            businessTypeOptions.length > 0 &&
            statusOptions.length > 0 &&
            countryOptions.length > 0 &&
            settlementPeriodOptions.length > 0 &&
            settlementAccountOptions.length > 0;

        if (requiredLookupsLoaded) {
            setAreLookupsReady(true);
        } else {
            const timer = setTimeout(() => { setAreLookupsReady(true); }, 5000);
            return () => clearTimeout(timer);
        }
    }, [businessTypeOptions, mscTypeOptions, merchantTypeOptions, statusOptions, countryOptions, settlementPeriodOptions, settlementAccountOptions, merchantGroupOptions]);

    const [formData, setFormData] = useState<BusinessFormData>({
        id: 0,
        businessName: '',
        merchantGroupCode: '',
        businessType: '',
        merchantServiceCharge: 0,
        mscType: '',
        platformFee: 0,
        transferFee: 0,
        mscCapLimit: 0,
        firstname: '',
        lastname: '',
        username: '',
        bvn: '',
        mobileNo: '',
        address: '',
        createdDate: '',
        merchantType: '',
        email: '',
        status: '',
        countryCode: 'NG',
        state: '',
        city: '',
        bankAccountName: '',
        bankName: '',
        accountNo: '',
        settlementPeriodType: '',
        splitSettlementEnabled: '',
        settlementAccountType: '',
        entityCode: 'FTD',
        merchantId: '',
        photoLink: null,
    });

    const { data: businessData, isLoading: isLoadingBusiness } = useQuery({
        queryKey: ['business-detail', editingMerchantCode],
        queryFn: () => axiosOperations.request({
            url: `/merchant/${editingMerchantCode}`,
            method: 'GET',
            params: {
                merchantCode: editingMerchantCode,
                entityCode: operations?.entityCode || 'FTD'
            }
        }),
        enabled: !!editingMerchantCode && isEditMode,
    });

    useEffect(() => {
        const editParam = searchParams.get('edit');
        if (editParam === 'true') {
            setIsEditMode(true);
            const rawQueryString = window.location.search;
            const urlParams = new URLSearchParams(rawQueryString);
            const idParam = urlParams.get('id');
            if (idParam) {
                if (rawQueryString.includes('%2B')) {
                    setEditingMerchantCode(decodeURIComponent(idParam));
                } else if (rawQueryString.includes('+') && idParam.includes(' ')) {
                    const idMatch = rawQueryString.match(/id=([^&]+)/);
                    if (idMatch) setEditingMerchantCode(decodeURIComponent(idMatch[1]));
                } else {
                    setEditingMerchantCode(idParam);
                }
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (businessData?.data?.merchantDto && isEditMode && !isFormInitialized) {
            const merchant = businessData.data.merchantDto;
            setFormData(prev => ({
                ...prev,
                id: merchant.id || 0,
                businessName: merchant.businessName || '',
                merchantGroupCode: merchant.merchantGroupCode || '',
                businessType: merchant.businessType || '',
                merchantServiceCharge: merchant.merchantServiceCharge || 0,
                mscType: merchant.mscType || '',
                platformFee: merchant.platformFee || 0,
                transferFee: merchant.transferFee || 0,
                mscCapLimit: merchant.mscCapLimit || 0,
                firstname: merchant.firstname || '',
                lastname: merchant.lastname || '',
                username: merchant.username || '',
                bvn: merchant.bvn || '',
                mobileNo: merchant.mobileNo || '',
                address: merchant.address || '',
                createdDate: merchant.createdDate || '',
                merchantType: merchant.merchantType || '',
                email: merchant.email || '',
                status: merchant.status || '',
                countryCode: merchant.countryCode || 'NG',
                state: merchant.state || '',
                city: merchant.city || '',
                bankAccountName: merchant.bankAccountName || '',
                bankName: merchant.bankName || '',
                accountNo: merchant.virtualAccountNo || merchant.accountNo || '',
                settlementPeriodType: merchant.settlementPeriodType || '',
                splitSettlementEnabled: merchant.splitSettlementEnabled || '',
                settlementAccountType: merchant.settlementAccountType || '',
                entityCode: merchant.entityCode || 'FTD',
                merchantId: merchant.merchantId || '',
                photoLink: merchant.photoLink || null,
            }));
            setIsFormInitialized(true);
        }
    }, [businessData, isEditMode, operations]);

    useEffect(() => {
        if (fileUrl) {
            setFormData(prev => ({ ...prev, photoLink: fileUrl }));
        }
    }, [fileUrl]);

    useEffect(() => {
        if (formData.photoLink && formData.photoLink.startsWith('http')) {
            setPreviewUrl(formData.photoLink);
        }
    }, [formData.photoLink]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = value === '' ? 0 : parseFloat(value);
        setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value === 'NOT_SPECIFIED' ? '' : value }));
    };

    const saveBusinessMutation = useMutation({
        mutationFn: (businessData: BusinessFormData) =>
            axiosOperations.post('/merchant/update', businessData),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success(isEditMode ? 'Business updated successfully' : 'Business created successfully');
                router.push('/operations/business');
            } else {
                toast.error(data?.data?.desc || `Failed to ${isEditMode ? 'update' : 'create'} business`);
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} business`);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            entityCode: operations?.entityCode || 'FTD',
            photoLink: fileUrl || formData.photoLink || null,
        };
        saveBusinessMutation.mutate(payload);
    };

    const getSelectDisplayValue = (options: SelectOption[], value: string | null | undefined) => {
        if (!value) return '';
        const option = options.find(opt => opt.id === value);
        return option ? option.name : value;
    };

    const { data: documentsData } = useQuery({
        queryKey: ['business-documents', editingMerchantCode],
        queryFn: () => axiosOperations.request({
            url: `/merchant/${editingMerchantCode}`,
            method: 'GET',
            params: {
                merchantCode: editingMerchantCode,
                entityCode: operations?.entityCode || 'FTD'
            }
        }),
        enabled: !!editingMerchantCode && isEditMode,
    });

    const documents: Document[] = documentsData?.data?.documents || [];

    const isLookupsLoading = isEditMode && !areLookupsReady;

    if (isLoadingBusiness) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-faded-accent/10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-text animate-spin" />
                    </div>
                    <p className="text-medium-gray">Loading business data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl">
                <div className="mb-4">
                    <Button variant="link" onClick={() => router.push('/operations/business')}>
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>

                <div className='container mx-auto px-20 py-6'>
                    <div className="mb-6">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">
                            {isEditMode ? 'Edit Business' : 'Create Business'}
                        </h1>
                        <p className="text-xs lg:text-sm font-normal text-medium-gray">
                            {isEditMode ? 'Update business information.' : 'Create a new business account'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className='bg-white px-6 py-4 rounded-2xl'>

                            <FormSection title="Business Information" subtitle="Business details and fee structure.">
                                <FormField label="Business Name" required>
                                    <Input
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleInputChange}
                                        placeholder="Enter business name"
                                        disabled={isEditMode}
                                        required
                                    />
                                    {isEditMode && <p className="text-xs text-medium-gray mt-1">Business name cannot be changed</p>}
                                </FormField>

                                <FormField label="Merchant Group">
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-[#F5F5F5]">
                                            <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                                            <span className="text-sm text-medium-gray">Loading...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.merchantGroupCode || ''}
                                            onValueChange={(value) => handleSelectChange('merchantGroupCode', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select merchant group">
                                                    {getSelectDisplayValue(merchantGroupOptions, formData.merchantGroupCode) || "Select merchant group"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NOT_SPECIFIED">Not Specified</SelectItem>
                                                {merchantGroupOptions.map((group) => (
                                                    <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </FormField>

                                <FormField label="Business Type">
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-[#F5F5F5]">
                                            <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                                            <span className="text-sm text-medium-gray">Loading business types...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.businessType}
                                            onValueChange={(value) => handleSelectChange('businessType', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select business type">
                                                    {getSelectDisplayValue(businessTypeOptions, formData.businessType) || "Select business type"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {businessTypeOptions.map((type) => (
                                                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </FormField>

                                <FormField label="Merchant Service Charge">
                                    <Input
                                        name="merchantServiceCharge"
                                        type="number"
                                        step="0.01"
                                        value={formData.merchantServiceCharge}
                                        onChange={handleNumberInputChange}
                                        placeholder="0.00"
                                    />
                                </FormField>

                                <FormField label="MSC Charge Type">
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-[#F5F5F5]">
                                            <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                                            <span className="text-sm text-medium-gray">Loading...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.mscType || ''}
                                            onValueChange={(value) => handleSelectChange('mscType', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select MSC type">
                                                    {getSelectDisplayValue(mscTypeOptions, formData.mscType) || "Select MSC type"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NOT_SPECIFIED">Not Specified</SelectItem>
                                                {mscTypeOptions.map((type) => (
                                                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </FormField>

                                <FormField label="Platform Fee">
                                    <Input
                                        name="platformFee"
                                        type="number"
                                        step="0.01"
                                        value={formData.platformFee}
                                        onChange={handleNumberInputChange}
                                        placeholder="0.00"
                                    />
                                </FormField>

                                <FormField label="Transfer Fee">
                                    <Input
                                        name="transferFee"
                                        type="number"
                                        step="0.01"
                                        value={formData.transferFee}
                                        onChange={handleNumberInputChange}
                                        placeholder="0.00"
                                    />
                                </FormField>

                                <FormField label="MSC Cap Limit">
                                    <Input
                                        name="mscCapLimit"
                                        type="number"
                                        step="0.01"
                                        value={formData.mscCapLimit}
                                        onChange={handleNumberInputChange}
                                        placeholder="0.00"
                                    />
                                </FormField>
                            </FormSection>

                            <FormSection title="Personal Information" subtitle="Name, contact, location and other information.">
                                <FormField label="Personal Name">
                                    <Input
                                        name="firstname"
                                        value={`${formData.firstname} ${formData.lastname}`.trim()}
                                        onChange={(e) => {
                                            const [first, ...last] = e.target.value.split(' ');
                                            setFormData(prev => ({
                                                ...prev,
                                                firstname: first || '',
                                                lastname: last.join(' ') || ''
                                            }));
                                        }}
                                        placeholder="Enter full name"
                                        disabled={isEditMode}
                                    />
                                    {isEditMode && <p className="text-xs text-medium-gray mt-1">Name cannot be changed</p>}
                                </FormField>

                                <FormField label="Username">
                                    <Input
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="Enter username"
                                        disabled={isEditMode}
                                    />
                                    {isEditMode && <p className="text-xs text-medium-gray mt-1">Username cannot be changed</p>}
                                </FormField>

                                <FormField label="BVN">
                                    <Input
                                        name="bvn"
                                        value={formData.bvn}
                                        onChange={handleInputChange}
                                        placeholder="Enter BVN"
                                        maxLength={11}
                                        disabled={isEditMode}
                                    />
                                    {isEditMode && <p className="text-xs text-medium-gray mt-1">BVN cannot be changed</p>}
                                </FormField>

                                <FormField label="Contact Email Address">
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter email address"
                                    />
                                </FormField>

                                <FormField label="Contact Phone Number">
                                    <Input
                                        name="mobileNo"
                                        value={formData.mobileNo}
                                        onChange={handleInputChange}
                                        placeholder="Enter phone number"
                                    />
                                </FormField>

                                <FormField label="Contact Address">
                                    <Input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter address"
                                    />
                                </FormField>

                                <FormField label="Registration Date">
                                    <Input
                                        name="createdDate"
                                        value={formData.createdDate}
                                        onChange={handleInputChange}
                                        placeholder="DD-MM-YYYY"
                                        disabled={isEditMode}
                                    />
                                    {isEditMode && <p className="text-xs text-medium-gray mt-1">Registration date cannot be changed</p>}
                                </FormField>

                                <FormField label="Merchant Type">
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-[#F5F5F5]">
                                            <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                                            <span className="text-sm text-medium-gray">Loading...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.merchantType}
                                            onValueChange={(value) => handleSelectChange('merchantType', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select merchant type">
                                                    {getSelectDisplayValue(merchantTypeOptions, formData.merchantType) || "Select merchant type"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {merchantTypeOptions.map((type) => (
                                                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </FormField>

                                <FormField label="Email Address">
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter email address"
                                    />
                                </FormField>

                                <FormField label="Status">
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-[#F5F5F5]">
                                            <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                                            <span className="text-sm text-medium-gray">Loading status...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value) => handleSelectChange('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status">
                                                    {getSelectDisplayValue(statusOptions, formData.status) || "Select status"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((status) => (
                                                    <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </FormField>

                                <FormField label="Country/State">
                                    <div className="grid grid-cols-2 gap-2">
                                        {isLookupsLoading ? (
                                            <>
                                                <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-[#F5F5F5]">
                                                    <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                                                    <span className="text-sm text-medium-gray">Loading...</span>
                                                </div>
                                                <Input disabled placeholder="Loading..." />
                                            </>
                                        ) : (
                                            <>
                                                <Select
                                                    value={formData.countryCode}
                                                    onValueChange={(value) => handleSelectChange('countryCode', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Country">
                                                            {getSelectDisplayValue(countryOptions, formData.countryCode) || "Country"}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {countryOptions.map((country) => (
                                                            <SelectItem key={country.id} value={country.id}>{country.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Input
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    placeholder="State"
                                                />
                                            </>
                                        )}
                                    </div>
                                </FormField>

                                <FormField label="City">
                                    <Input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter city"
                                    />
                                </FormField>
                            </FormSection>

                            <FormSection title="Banking & Settlement" subtitle="Payment and settlement information.">
                                <FormField label="Account Name">
                                    <Input
                                        name="bankAccountName"
                                        value={formData.bankAccountName}
                                        onChange={handleInputChange}
                                        placeholder="Enter account name"
                                        disabled={isEditMode}
                                    />
                                    {isEditMode && <p className="text-xs text-medium-gray mt-1">Account name cannot be changed</p>}
                                </FormField>

                                <FormField label="Bank Name">
                                    <Input
                                        name="bankName"
                                        value={formData.bankName || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter bank name"
                                    />
                                </FormField>

                                <FormField label="Account Number">
                                    <Input
                                        name="accountNo"
                                        value={formData.accountNo}
                                        onChange={handleInputChange}
                                        placeholder="Enter account number"
                                        disabled={isEditMode}
                                    />
                                    {isEditMode && <p className="text-xs text-medium-gray mt-1">Account number cannot be changed</p>}
                                </FormField>

                                <FormField label="Settlement Period Type">
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-[#F5F5F5]">
                                            <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                                            <span className="text-sm text-medium-gray">Loading...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.settlementPeriodType}
                                            onValueChange={(value) => handleSelectChange('settlementPeriodType', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select settlement period">
                                                    {getSelectDisplayValue(settlementPeriodOptions, formData.settlementPeriodType) || "Select settlement period"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {settlementPeriodOptions.map((period) => (
                                                    <SelectItem key={period.id} value={period.id}>{period.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </FormField>

                                <FormField label="Split Settlement Enabled">
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-[#F5F5F5]">
                                            <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                                            <span className="text-sm text-medium-gray">Loading...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.splitSettlementEnabled || ''}
                                            onValueChange={(value) => handleSelectChange('splitSettlementEnabled', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select option">
                                                    {formData.splitSettlementEnabled === 'Y' ? 'Yes' :
                                                        formData.splitSettlementEnabled === 'N' ? 'No' :
                                                            "Select option"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Y">Yes</SelectItem>
                                                <SelectItem value="N">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                </FormField>

                                <FormField label="Settle Account Type">
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-[#F5F5F5]">
                                            <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                                            <span className="text-sm text-medium-gray">Loading...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.settlementAccountType}
                                            onValueChange={(value) => handleSelectChange('settlementAccountType', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select account type">
                                                    {getSelectDisplayValue(settlementAccountOptions, formData.settlementAccountType) || "Select account type"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {settlementAccountOptions.map((type) => (
                                                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </FormField>
                            </FormSection>

                            <FormSection title="Business Logo" subtitle="Upload a business logo for the user.">
                                <div className="col-span-2">
                                    <FormField label="Upload Photo">
                                        <div className="space-y-4">
                                            {previewUrl && (
                                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-gray-200">
                                                        <Image
                                                            src={previewUrl}
                                                            alt="Photo preview"
                                                            width={64}
                                                            height={64}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 text-sm text-medium-gray">Photo preview</div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, photoLink: null }));
                                                            setPreviewUrl('');
                                                            setFileUrl('');
                                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                                        }}
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
                                                    id="photo-upload"
                                                />
                                                <Label htmlFor="photo-upload" className="cursor-pointer">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <CameraIcon className="w-8 h-8 text-faded-accent" />
                                                        <p className="text-sm text-dark-gray">
                                                            <span className="text-faded-accent font-medium">Click to upload</span>
                                                        </p>
                                                        <p className="text-xs text-medium-gray">PNG, JPG or WebP (max. 5MB)</p>
                                                    </div>
                                                </Label>
                                            </div>
                                        </div>
                                    </FormField>
                                </div>
                            </FormSection>

                            <FormSection title="Documents" subtitle="View and manage business documents.">
                                <div className="col-span-2">
                                    {isEditMode && documents.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {documents.map((doc, i) => (
                                                <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="text-xs font-medium text-dark-gray">{doc.type || 'Document'}</p>
                                                            <p className="text-xs text-medium-gray mt-0.5">{doc.createdDate}</p>
                                                        </div>
                                                        <Badge className={`text-[10px] border ${getDocStatusColor(doc.verifyStatus)}`}>
                                                            {doc.verifyStatus === 'Y' ? 'Approved' : doc.verifyStatus === 'R' ? 'Rejected' : 'Pending'}
                                                        </Badge>
                                                    </div>
                                                    {doc.link ? (
                                                        <div className="relative h-36 rounded-lg overflow-hidden border border-gray-200">
                                                            <Image
                                                                src={doc.link}
                                                                alt={doc.type || 'Document'}
                                                                fill
                                                                className="object-contain"
                                                                sizes="200px"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="h-36 flex items-center justify-center bg-gray-50 rounded-lg">
                                                            <p className="text-xs text-medium-gray">No preview</p>
                                                        </div>
                                                    )}
                                                    {doc.comment && (
                                                        <div className="pt-2 border-t border-gray-200">
                                                            <p className="text-xs font-medium text-dark-gray">Comment:</p>
                                                            <p className="text-xs text-medium-gray mt-1">{doc.comment}</p>
                                                        </div>
                                                    )}
                                                    {doc.link && (
                                                        <a
                                                            href={doc.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block text-center text-xs text-orange-500 py-1.5 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                                                        >
                                                            View Full Document
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <FormField label="Upload Document">
                                            <div className="border-2 border-dashed border-faded-accent rounded-lg p-6 text-center hover:border-orange-300 transition-colors">
                                                <Input
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    className="hidden"
                                                    id="document-upload"
                                                />
                                                <Label htmlFor="document-upload" className="cursor-pointer">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <CameraIcon className="w-8 h-8 text-faded-accent" />
                                                        <p className="text-sm text-dark-gray">
                                                            <span className="text-faded-accent font-medium">Click to upload</span>
                                                        </p>
                                                        <p className="text-xs text-medium-gray">PNG, JPG or WebP (max. 5MB)</p>
                                                    </div>
                                                </Label>
                                            </div>
                                        </FormField>
                                    )}
                                    {isEditMode && documents.length === 0 && (
                                        <p className="text-xs text-medium-gray text-center mt-2">No documents found for this business</p>
                                    )}
                                </div>
                            </FormSection>

                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()} className="gap-2">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                // disabled={saveBusinessMutation.isPending}
                                disabled
                            >
                                {saveBusinessMutation.isPending ? 'Processing...' : (isEditMode ? 'Update Business' : 'Create Business')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}