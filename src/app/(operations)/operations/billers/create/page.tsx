"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosOperations from "@/utils/fetch-function-op-auth";
import useOperations from "@/store/operationsStore";
import useGetLookup from "@/app/hooks/useGetLookup";
import { useFileUpload } from "@/app/hooks/useUpload";
import { useEffect } from "react";
import { usePermission } from "@/hooks/usePermission";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import Image from "next/image";

interface ProductData {
  productCode: string;
  productName: string;
  productDesc: string;
  amount: number;
  amountType: string;
  charge: number;
  chargeType: string;
  paymentCode: string;
  paymentCode2: string;
  paymentCode3: string;
  costPrice: number;
  agentCommission: number;
  networkCommission: number;
  serviceProviderCommission: number;
  platformCommission: number;
  aggregatorCommission: number;
  status: string;
  minAmount: number;
  maxAmount: number;
}

interface PaymentField {
  fieldID: string;
  fieldName: string;
  fieldValue: string;
  maxLength: number;
  fieldDataType: string;
  mandatoryFlag: string;
  inputOrOutput: string;
}

interface BillerFormData {
  billerCode: string;
  billerName: string;
  bankName: string;
  billerShortName: string;
  billerDescription: string;
  billerCategory: string;
  billerRef: string;
  status: string;
  merchantCode: string;
  validationRequired: string;
  sharingType: string;
  agentCommission: number;
  networkCommission: number;
  serviceProviderCommission: number;
  platformCommission: number;
  aggregatorCommission: number;
  purchaseCommission: number;
  amountType: string;
  serviceProvider: string;
  minAmount: number;
  maxAmount: number;
  logoURL: string;
  products: ProductData[];
  paymentData: PaymentField[];
}

const FormSection = ({ title, subtitle, children, action }: { title: string; subtitle: string; children: React.ReactNode; action?: React.ReactNode }) => (
    <div className="bg-white rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
                <h2 className="text-sm font-semibold text-dark-gray">{title}</h2>
                <p className="text-xs text-medium-gray mt-0.5">{subtitle}</p>
            </div>
            {action}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">{children}</div>
    </div>
);

const FormField = ({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) => (
    <div className={`space-y-1.5 ${className || ''}`}>
        <Label>{label} {required && <span className="text-red-500">*</span>}</Label>
        {children}
    </div>
);

export default function CreateBillerPage() {
    usePageMetadata('Billers', 'Create or edit biller information.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_BILLERS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage billers"
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const { operations } = useOperations();
    const isEditMode = searchParams.get('edit') === 'true';
    const billerCode = searchParams.get('code');

    const billerCategoryOptions = useGetLookup("BILLER_CATEGORY");
    const statusOptions = useGetLookup("STATUS");
    const serviceProviderOptions = useGetLookup("BILLER_SERVICE_PROVIDER");
    const { fileUrl, handleFileChange, fileInputRef, previewUrl, selectedFile, isUploadingFile, fileError } = useFileUpload();

    const { data: merchantsData, isLoading: isMerchantsLoading } = useQuery({
        queryKey: ["merchants-for-biller"],
        queryFn: () => axiosOperations.request({ method: "GET", url: "/merchant/all", params: { pageNumber: 1, pageSize: 100, name: "", merchantId: "" } }),
        select: (res) => res.data?.content?.map((merchant: any) => ({ id: merchant.merchantId, name: merchant.businessName || merchant.merchantId, code: merchant.merchantCode || merchant.merchantId })) || [],
    });

    const { data: billerDetails, isLoading: isLoadingBiller } = useQuery({
        queryKey: ["biller-details-edit", billerCode],
        queryFn: async () => {
            const response = await axiosOperations.get(`billpayment/getbillerdetail?billerCode=${billerCode}`, { params: { pageNumber: 1, pageSize: 20 } });
            return response.data;
        },
        enabled: !!billerCode && isEditMode,
    });

    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<BillerFormData>({
        defaultValues: {
            billerCode: "", billerName: "", bankName: "", billerShortName: "", billerDescription: "",
            billerCategory: "", billerRef: "", status: "", merchantCode: "", validationRequired: "",
            sharingType: "", agentCommission: 0, networkCommission: 0, serviceProviderCommission: 0,
            platformCommission: 0, aggregatorCommission: 0, purchaseCommission: 0, amountType: "",
            serviceProvider: "", minAmount: 0, maxAmount: 0, logoURL: "", products: [], paymentData: [],
        },
    });

    useEffect(() => {
        if (billerDetails && isEditMode) {
            setValue("billerCode", billerDetails.billerCode || "");
            setValue("billerName", billerDetails.billerName || "");
            setValue("bankName", billerDetails.bankName || "");
            setValue("billerShortName", billerDetails.billerShortName || "");
            setValue("billerDescription", billerDetails.billerDescription || "");
            setValue("billerCategory", billerDetails.billerCategory || "");
            setValue("billerRef", billerDetails.billerRef || "");
            setValue("status", billerDetails.status || "");
            setValue("merchantCode", billerDetails.merchantCode || "");
            setValue("validationRequired", billerDetails.validationRequired || "");
            setValue("sharingType", billerDetails.sharingType || "");
            setValue("agentCommission", Number(billerDetails.agentCommission) || 0);
            setValue("networkCommission", Number(billerDetails.networkCommission) || 0);
            setValue("serviceProviderCommission", Number(billerDetails.serviceProviderCommission) || 0);
            setValue("platformCommission", Number(billerDetails.platformCommission) || 0);
            setValue("aggregatorCommission", Number(billerDetails.aggregatorCommission) || 0);
            setValue("purchaseCommission", Number(billerDetails.purchaseCommission) || 0);
            setValue("amountType", billerDetails.amountType || "");
            setValue("serviceProvider", billerDetails.serviceProvider || "");
            setValue("minAmount", Number(billerDetails.minAmount) || 0);
            setValue("maxAmount", Number(billerDetails.maxAmount) || 0);
            setValue("logoURL", billerDetails.logoURL || "");
            if (billerDetails.products?.length > 0) setValue("products", billerDetails.products);
            if (billerDetails.paymentData?.length > 0) setValue("paymentData", billerDetails.paymentData);
        }
    }, [billerDetails, isEditMode, setValue]);

    const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({ control, name: "products" });
    const { fields: paymentDataFields, append: appendPaymentData, remove: removePaymentData } = useFieldArray({ control, name: "paymentData" });

    const { mutate: createBiller, isPending: saving } = useMutation({
        mutationFn: (payload: any) => axiosOperations.request({ method: "POST", url: "billpayment/createBiller", data: payload }),
        onSuccess: (data) => {
            if (data?.data?.code !== "000") { toast.error(data?.data?.desc || "Failed to save biller"); return; }
            toast.success(isEditMode ? "Biller updated successfully!" : "Biller created successfully!");
            router.push("/operations/billers");
        },
        onError: (error: any) => { toast.error(error?.response?.data?.message || "Error saving biller"); },
    });

    const onSubmit = (data: BillerFormData) => {
        const payload = {
            ...data,
            agentCommission: Number(data.agentCommission) || 0,
            networkCommission: Number(data.networkCommission) || 0,
            serviceProviderCommission: Number(data.serviceProviderCommission) || 0,
            platformCommission: Number(data.platformCommission) || 0,
            aggregatorCommission: Number(data.aggregatorCommission) || 0,
            purchaseCommission: Number(data.purchaseCommission) || 0,
            minAmount: Number(data.minAmount) || 0,
            maxAmount: Number(data.maxAmount) || 0,
            logoURL: fileUrl || data.logoURL || "",
            countryCode: "NG", state: "Lagos", businessRegion: "Lagos", bvn: "00000011101",
            userlang: "en", deviceId: "0001", channelType: "WEB", entityCode: operations?.entityCode,
            products: data.products.map((p) => ({ ...p, amount: Number(p.amount) || 0, charge: Number(p.charge) || 0, costPrice: Number(p.costPrice) || 0, agentCommission: Number(p.agentCommission) || 0, networkCommission: Number(p.networkCommission) || 0, serviceProviderCommission: Number(p.serviceProviderCommission) || 0, platformCommission: Number(p.platformCommission) || 0, aggregatorCommission: Number(p.aggregatorCommission) || 0, minAmount: Number(p.minAmount) || 0, maxAmount: Number(p.maxAmount) || 0 })),
            paymentData: data.paymentData.map((f) => ({ ...f, maxLength: Number(f.maxLength) || 0 })),
        };
        createBiller(payload);
    };

    const handleAddProduct = () => { appendProduct({ productCode: "", productName: "", productDesc: "", amount: 0, amountType: "", charge: 0, chargeType: "", paymentCode: "", paymentCode2: "", paymentCode3: "", costPrice: 0, agentCommission: 0, networkCommission: 0, serviceProviderCommission: 0, platformCommission: 0, aggregatorCommission: 0, status: "ACTIVE", minAmount: 0, maxAmount: 0 }); };
    const handleAddPaymentData = () => { appendPaymentData({ fieldID: "", fieldName: "", fieldValue: "", maxLength: 0, fieldDataType: "", mandatoryFlag: "", inputOrOutput: "" }); };

    if (isEditMode && isLoadingBiller) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-medium-gray">Loading biller details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <div className="max-w-6xl mx-auto">
                <div className="mb-4 px-2 pt-4">
                    <Button variant="link" onClick={() => router.push('/operations/billers')}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </div>

                <div className='px-2 pb-6'>
                    <div className="mb-6">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">{isEditMode ? 'Edit Biller' : 'Create Biller'}</h1>
                        <p className="text-xs lg:text-sm font-normal text-medium-gray">{isEditMode ? 'Update biller information' : 'Add new biller information'}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Biller Information */}
                        <FormSection title="Biller Information" subtitle="Basic biller details and classification.">
                            <FormField label="Biller Code" required>
                                <Input {...register("billerCode")} readOnly={isEditMode} />
                                {isEditMode && <p className="text-xs text-medium-gray mt-1">Code cannot be changed</p>}
                            </FormField>
                            <FormField label="Biller Name" required>
                                <Input {...register("billerName")} />
                            </FormField>
                            <FormField label="Biller Category">
                                <Controller control={control} name="billerCategory" render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            {billerCategoryOptions?.map((option) => (
                                                <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )} />
                            </FormField>
                            <FormField label="Biller Description">
                                <Textarea {...register("billerDescription")} rows={3} />
                            </FormField>
                            <FormField label="Biller Short Name">
                                <Input {...register("billerShortName")} />
                            </FormField>
                            <FormField label="Biller Reference">
                                <Input {...register("billerRef")} />
                            </FormField>
                            <FormField label="Status">
                                <Controller control={control} name="status" render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            {statusOptions?.map((option) => (
                                                <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )} />
                            </FormField>
                            <FormField label="Merchant Code">
                                <Controller control={control} name="merchantCode" render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder={isMerchantsLoading ? "Loading..." : "Select..."} /></SelectTrigger>
                                        <SelectContent>
                                            {merchantsData?.map((m: any) => (
                                                <SelectItem key={m.id} value={m.code}>{m.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )} />
                            </FormField>
                            <FormField label="Validation Required">
                                <Controller control={control} name="validationRequired" render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Y">Yes</SelectItem>
                                            <SelectItem value="N">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )} />
                            </FormField>
                            <FormField label="Sharing Type">
                                <Controller control={control} name="sharingType" render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="FIXED">Fixed</SelectItem>
                                            <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )} />
                            </FormField>
                            <FormField label="Agent Commission">
                                <Input type="number" {...register("agentCommission")} placeholder="0" />
                            </FormField>
                            <FormField label="Network Commission">
                                <Input type="number" {...register("networkCommission")} placeholder="0" />
                            </FormField>
                            <FormField label="Service Provider Commission">
                                <Input type="number" {...register("serviceProviderCommission")} placeholder="0" />
                            </FormField>
                            <FormField label="Platform Commission">
                                <Input type="number" {...register("platformCommission")} placeholder="0" />
                            </FormField>
                            <FormField label="Aggregator Commission">
                                <Input type="number" {...register("aggregatorCommission")} placeholder="0" />
                            </FormField>
                            <FormField label="Purchase Commission">
                                <Input type="number" {...register("purchaseCommission")} placeholder="0" />
                            </FormField>
                            <FormField label="Amount Type">
                                <Controller control={control} name="amountType" render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="FIXED">Fixed</SelectItem>
                                            <SelectItem value="VARIABLE">Variable</SelectItem>
                                            <SelectItem value="RANGE">Range</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )} />
                            </FormField>
                            <FormField label="Service Provider">
                                <Controller control={control} name="serviceProvider" render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            {serviceProviderOptions?.map((o) => (
                                                <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )} />
                            </FormField>
                            <FormField label="Minimum Amount">
                                <Input type="number" {...register("minAmount")} placeholder="0" />
                            </FormField>
                            <FormField label="Maximum Amount">
                                <Input type="number" {...register("maxAmount")} placeholder="0" />
                            </FormField>
                            <div className="col-span-3">
                                <FormField label="Upload Biller Logo">
                                    <div className="border-2 border-dashed border-faded-accent rounded-lg p-6 text-center hover:border-orange-300 transition-colors">
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="logo-upload" />
                                        <Label htmlFor="logo-upload" className="cursor-pointer">
                                            <div className="flex flex-col items-center gap-2">
                                                <svg className="w-8 h-8 text-faded-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                <p className="text-sm text-dark-gray"><span className="text-faded-accent font-medium">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-medium-gray">PNG, JPG or WebP (max. 5MB)</p>
                                            </div>
                                        </Label>
                                    </div>
                                    {previewUrl && (
                                        <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                                                <Image src={previewUrl} alt="Preview" width={48} height={48} className="w-full h-full object-contain" />
                                            </div>
                                            <p className="text-sm text-medium-gray">Logo preview</p>
                                        </div>
                                    )}
                                </FormField>
                            </div>
                        </FormSection>

                        {/* Products Sections */}
                        {productFields.map((field, index) => (
                            <FormSection
                                key={field.id}
                                title={`Product #${index + 1}`}
                                subtitle="Product details and pricing."
                                action={
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeProduct(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                                    </Button>
                                }
                            >
                                <FormField label="Product Code"><Input {...register(`products.${index}.productCode`)} /></FormField>
                                <FormField label="Product Name"><Input {...register(`products.${index}.productName`)} /></FormField>
                                <FormField label="Product Description"><Input {...register(`products.${index}.productDesc`)} /></FormField>
                                <FormField label="Amount"><Input type="number" {...register(`products.${index}.amount`)} /></FormField>
                                <FormField label="Amount Type">
                                    <Controller control={control} name={`products.${index}.amountType`} render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="FIXED">Fixed</SelectItem>
                                                <SelectItem value="VARIABLE">Variable</SelectItem>
                                                <SelectItem value="RANGE">Range</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )} />
                                </FormField>
                                <FormField label="Payment Code"><Input {...register(`products.${index}.paymentCode`)} /></FormField>
                                <FormField label="Payment Code 2"><Input {...register(`products.${index}.paymentCode2`)} /></FormField>
                                <FormField label="Payment Code 3"><Input {...register(`products.${index}.paymentCode3`)} /></FormField>
                                <FormField label="Charge"><Input type="number" {...register(`products.${index}.charge`)} /></FormField>
                                <FormField label="Charge Type">
                                    <Controller control={control} name={`products.${index}.chargeType`} render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="FLAT">Flat</SelectItem>
                                                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )} />
                                </FormField>
                                <FormField label="Cost Price"><Input type="number" {...register(`products.${index}.costPrice`)} /></FormField>
                                <FormField label="Agent Commission"><Input type="number" {...register(`products.${index}.agentCommission`)} /></FormField>
                                <FormField label="Network Commission"><Input type="number" {...register(`products.${index}.networkCommission`)} /></FormField>
                                <FormField label="Service Provider Commission"><Input type="number" {...register(`products.${index}.serviceProviderCommission`)} /></FormField>
                                <FormField label="Platform Commission"><Input type="number" {...register(`products.${index}.platformCommission`)} /></FormField>
                                <FormField label="Aggregator Commission"><Input type="number" {...register(`products.${index}.aggregatorCommission`)} /></FormField>
                                <FormField label="Status">
                                    <Controller control={control} name={`products.${index}.status`} render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                {statusOptions?.map((o) => (<SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                    )} />
                                </FormField>
                                <FormField label="Min Amount"><Input type="number" {...register(`products.${index}.minAmount`)} /></FormField>
                                <FormField label="Max Amount"><Input type="number" {...register(`products.${index}.maxAmount`)} /></FormField>
                            </FormSection>
                        ))}

                        {/* Payment Data Sections */}
                        {paymentDataFields.map((field, index) => (
                            <FormSection
                                key={field.id}
                                title={`Payment Data #${index + 1}`}
                                subtitle="Payment field configuration."
                                action={
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removePaymentData(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                                    </Button>
                                }
                            >
                                <FormField label="Field ID"><Input {...register(`paymentData.${index}.fieldID`)} placeholder="e.g. customer_name" /></FormField>
                                <FormField label="Field Name"><Input {...register(`paymentData.${index}.fieldName`)} placeholder="e.g. Full Name" /></FormField>
                                <FormField label="Field Data Type">
                                    <Controller control={control} name={`paymentData.${index}.fieldDataType`} render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="STRING">String</SelectItem>
                                                <SelectItem value="NUMBER">Number</SelectItem>
                                                <SelectItem value="DATE">Date</SelectItem>
                                                <SelectItem value="DROPDOWN">Dropdown</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )} />
                                </FormField>
                                <FormField label="Max Length"><Input type="number" {...register(`paymentData.${index}.maxLength`)} placeholder="0" /></FormField>
                                <FormField label="Mandatory">
                                    <Controller control={control} name={`paymentData.${index}.mandatoryFlag`} render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Is required?" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Y">Yes</SelectItem>
                                                <SelectItem value="N">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )} />
                                </FormField>
                                <FormField label="Input/Output">
                                    <Controller control={control} name={`paymentData.${index}.inputOrOutput`} render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Direction..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="I">Input</SelectItem>
                                                <SelectItem value="O">Output</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )} />
                                </FormField>
                            </FormSection>
                        ))}

                        {/* Add Buttons + Submit */}
                        <div className="flex flex-col md:flex-row justify-between gap-4 pt-4">
                            <div className="flex gap-4">
                                <Button type="button" variant="outline" onClick={handleAddProduct} className="gap-2">
                                    <Plus className="w-4 h-4" /> Add Product
                                </Button>
                                <Button type="button" variant="outline" onClick={handleAddPaymentData} className="gap-2">
                                    <Plus className="w-4 h-4" /> Add Payment Data
                                </Button>
                            </div>
                            <div className="flex gap-4">
                                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit" disabled={saving}>
                                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : (isEditMode ? 'Update Biller' : 'Create Biller')}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}