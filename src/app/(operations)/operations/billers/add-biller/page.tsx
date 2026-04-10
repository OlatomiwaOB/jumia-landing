"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import Link from "next/link";
import { usePermission } from "@/hooks/usePermission";

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

const amountOptions = [
  { id: "FIXED", name: "Fixed" },
  { id: "VARIABLE", name: "Variable" },
  { id: "RANGE", name: "Range" },
];

const sharingTypeOptions = [
  { id: "FIXED", name: "Fixed" },
  { id: "PERCENTAGE", name: "Percentage" },
];

const chargeTypeOptions = [
  { id: "FLAT", name: "Flat" },
  { id: "PERCENTAGE", name: "Percentage" },
];

const datatypeOptions = [
  { id: "STRING", name: "String" },
  { id: "NUMBER", name: "Number" },
  { id: "DATE", name: "Date" },
  { id: "DROPDOWN", name: "Dropdown" },
];

const mandatoryFlagOptions = [
  { id: "Y", name: "Yes" },
  { id: "N", name: "No" },
];

const inputOrOutputOptions = [
  { id: "I", name: "Input" },
  { id: "O", name: "Output" },
];

export default function CreateBillerPage() {
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
    queryFn: () =>
      axiosOperations.request({
        method: "GET",
        url: "/merchant/all",
        params: { pageNumber: 1, pageSize: 100, name: "", merchantId: "" },
      }),
    select: (res) =>
      res.data?.content?.map((merchant: any) => ({
        id: merchant.merchantId,
        name: merchant.businessName || merchant.merchantId,
        code: merchant.merchantCode || merchant.merchantId,
      })) || [],
  });

  const { data: billerDetails, isLoading: isLoadingBiller } = useQuery({
    queryKey: ["biller-details-edit", billerCode],
    queryFn: async () => {
      const response = await axiosOperations.get(
        `billpayment/getbillerdetail?billerCode=${billerCode}`,
        { params: { pageNumber: 1, pageSize: 20 } }
      );
      return response.data;
    },
    enabled: !!billerCode && isEditMode,
  });

  const { register, control, handleSubmit, setValue, reset, formState: { errors } } =
    useForm<BillerFormData>({
      defaultValues: {
        billerCode: "",
        billerName: "",
        bankName: "",
        billerShortName: "",
        billerDescription: "",
        billerCategory: "",
        billerRef: "",
        status: "",
        merchantCode: "",
        validationRequired: "",
        sharingType: "",
        agentCommission: 0,
        networkCommission: 0,
        serviceProviderCommission: 0,
        platformCommission: 0,
        aggregatorCommission: 0,
        purchaseCommission: 0,
        amountType: "",
        serviceProvider: "",
        minAmount: 0,
        maxAmount: 0,
        logoURL: "",
        products: [],
        paymentData: [],
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

      if (billerDetails.products?.length > 0) {
        setValue("products", billerDetails.products);
      }

      if (billerDetails.paymentData?.length > 0) {
        setValue("paymentData", billerDetails.paymentData);
      }
    }
  }, [billerDetails, isEditMode, setValue]);

  const {
    fields: productFields,
    append: appendProduct,
    remove: removeProduct,
  } = useFieldArray({ control, name: "products" });

  const {
    fields: paymentDataFields,
    append: appendPaymentData,
    remove: removePaymentData,
  } = useFieldArray({ control, name: "paymentData" });

  const { mutate: createBiller, isPending: saving } = useMutation({
    mutationFn: (payload: any) =>
      axiosOperations.request({
        method: "POST",
        url: "billpayment/createBiller",
        data: payload,
      }),
    onSuccess: (data) => {
      if (data?.data?.code !== "000") {
        toast.error(data?.data?.desc || "Failed to create biller");
        return;
      }
      toast.success(isEditMode ? "Biller updated successfully!" : "Biller created successfully!");
      router.push("/operations/billers");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.desc ||
        "Error creating biller"
      );
    },
  });

  const onSubmit = (data: BillerFormData) => {
    const payload = {
      billerCode: data.billerCode,
      billerName: data.billerName,
      bankName: data.bankName,
      billerShortName: data.billerShortName,
      billerDescription: data.billerDescription,
      billerCategory: data.billerCategory,
      billerRef: data.billerRef,
      status: data.status,
      merchantCode: data.merchantCode,
      validationRequired: data.validationRequired,
      sharingType: data.sharingType,
      agentCommission: Number(data.agentCommission) || 0,
      networkCommission: Number(data.networkCommission) || 0,
      serviceProviderCommission: Number(data.serviceProviderCommission) || 0,
      platformCommission: Number(data.platformCommission) || 0,
      aggregatorCommission: Number(data.aggregatorCommission) || 0,
      purchaseCommission: Number(data.purchaseCommission) || 0,
      amountType: data.amountType,
      serviceProvider: data.serviceProvider,
      minAmount: Number(data.minAmount) || 0,
      maxAmount: Number(data.maxAmount) || 0,
      logoURL: fileUrl || data.logoURL || "",
      countryCode: "NG",
      state: "Lagos",
      businessRegion: "Lagos",
      bvn: "00000011101",
      userlang: "en",
      deviceId: "0001",
      channelType: "WEB",
      entityCode: operations?.entityCode,
      products: data.products.map((p) => ({
        ...p,
        amount: Number(p.amount) || 0,
        charge: Number(p.charge) || 0,
        costPrice: Number(p.costPrice) || 0,
        agentCommission: Number(p.agentCommission) || 0,
        networkCommission: Number(p.networkCommission) || 0,
        serviceProviderCommission: Number(p.serviceProviderCommission) || 0,
        platformCommission: Number(p.platformCommission) || 0,
        aggregatorCommission: Number(p.aggregatorCommission) || 0,
        minAmount: Number(p.minAmount) || 0,
        maxAmount: Number(p.maxAmount) || 0,
      })),
      paymentData: data.paymentData.map((f) => ({
        ...f,
        maxLength: Number(f.maxLength) || 0,
      })),
    };

    createBiller(payload);
  };

  const handleAddProduct = () => {
    appendProduct({
      productCode: "",
      productName: "",
      productDesc: "",
      amount: 0,
      amountType: "",
      charge: 0,
      chargeType: "",
      paymentCode: "",
      paymentCode2: "",
      paymentCode3: "",
      costPrice: 0,
      agentCommission: 0,
      networkCommission: 0,
      serviceProviderCommission: 0,
      platformCommission: 0,
      aggregatorCommission: 0,
      status: "ACTIVE",
      minAmount: 0,
      maxAmount: 0,
    });
  };

  const handleAddPaymentData = () => {
    appendPaymentData({
      fieldID: "",
      fieldName: "",
      fieldValue: "",
      maxLength: 0,
      fieldDataType: "",
      mandatoryFlag: "",
      inputOrOutput: "",
    });
  };

  if (isEditMode && isLoadingBiller) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="mt-2 text-accent-foreground/70">Loading biller details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-4">
          <Link href="/operations/billers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-accent-foreground mb-2">
                {isEditMode ? 'Edit Biller' : 'Create New Biller'}
              </h1>
              <p className="text-accent-foreground/70">
                {isEditMode ? 'Update biller information' : 'Add new biller information here'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card className="border-accent/20 shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b border-accent/10 p-6">
              <CardTitle className="text-lg font-bold text-accent-foreground">
                Biller Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Biller Code
                  </Label>
                  <Input
                    {...register("billerCode")}
                    className="w-full border-accent/20 focus:border-accent"
                    readOnly={isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Biller Name
                  </Label>
                  <Input
                    {...register("billerName")}
                    className="w-full border-accent/20 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Biller Category
                  </Label>
                  <Controller
                    control={control}
                    name="billerCategory"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full border-accent/20">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {billerCategoryOptions?.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Biller Description
                  </Label>
                  <Textarea
                    {...register("billerDescription")}
                    className="min-h-[120px] border-accent/20 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Biller Short Name
                  </Label>
                  <Input
                    {...register("billerShortName")}
                    className="w-full border-accent/20 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Biller Reference
                  </Label>
                  <Input
                    {...register("billerRef")}
                    className="w-full border-accent/20 focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">Status</Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full border-accent/20">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions?.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Merchant Code
                  </Label>
                  <Controller
                    control={control}
                    name="merchantCode"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full border-accent/20">
                          <SelectValue
                            placeholder={
                              isMerchantsLoading
                                ? "Loading..."
                                : "Select..."
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {merchantsData?.map((m: any) => (
                            <SelectItem key={m.id} value={m.code}>
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Validation Required
                  </Label>
                  <Controller
                    control={control}
                    name="validationRequired"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full border-accent/20">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mandatoryFlagOptions.map((o) => (
                            <SelectItem key={o.id} value={o.id}>
                              {o.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Sharing Type
                  </Label>
                  <Controller
                    control={control}
                    name="sharingType"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full border-accent/20">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {sharingTypeOptions.map((o) => (
                            <SelectItem key={o.id} value={o.id}>
                              {o.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Agent Commission
                  </Label>
                  <Input
                    type="number"
                    {...register("agentCommission")}
                    placeholder="0"
                    className="border-accent/20 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Network Commission
                  </Label>
                  <Input
                    type="number"
                    {...register("networkCommission")}
                    placeholder="0"
                    className="border-accent/20 focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Service Provider Commission
                  </Label>
                  <Input
                    type="number"
                    {...register("serviceProviderCommission")}
                    placeholder="0"
                    className="border-accent/20 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Platform Commission
                  </Label>
                  <Input
                    type="number"
                    {...register("platformCommission")}
                    placeholder="0"
                    className="border-accent/20 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Aggregator Commission
                  </Label>
                  <Input
                    type="number"
                    {...register("aggregatorCommission")}
                    placeholder="0"
                    className="border-accent/20 focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Purchase Commission
                  </Label>
                  <Input
                    type="number"
                    {...register("purchaseCommission")}
                    placeholder="0"
                    className="border-accent/20 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Amount Type
                  </Label>
                  <Controller
                    control={control}
                    name="amountType"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full border-accent/20">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {amountOptions.map((o) => (
                            <SelectItem key={o.id} value={o.id}>
                              {o.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Service Provider
                  </Label>
                  <Controller
                    control={control}
                    name="serviceProvider"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full border-accent/20">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceProviderOptions?.map((o) => (
                            <SelectItem key={o.id} value={o.id}>
                              {o.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Minimum Amount
                  </Label>
                  <Input
                    type="number"
                    {...register("minAmount")}
                    placeholder="0"
                    className="border-accent/20 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-accent-foreground font-medium">
                    Maximum Amount
                  </Label>
                  <Input
                    type="number"
                    {...register("maxAmount")}
                    placeholder="0"
                    className="border-accent/20 focus:border-accent"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-accent/10">
                <div className="w-full space-y-4">
                  <Label className="text-sm font-bold text-accent-foreground">
                    Upload Biller Logo
                  </Label>
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-accent-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent/10 file:text-accent-foreground hover:file:bg-accent/20 border border-accent/20 rounded-lg cursor-pointer"
                    />
                  </div>
                  {fileError && (
                    <p className="text-sm text-red-600 mt-1">{fileError}</p>
                  )}
                  {isUploadingFile && (
                    <div className="flex items-center gap-2 text-sm text-accent-foreground/70">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </div>
                  )}
                  {selectedFile && !fileError && (
                    <div className="text-sm text-accent-foreground bg-accent/5 p-3 rounded-lg border border-accent/20">
                      <p><strong>Selected:</strong> {selectedFile[0].name}</p>
                      <p><strong>Size:</strong> {(selectedFile[0].size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                  {(previewUrl || billerDetails?.logoURL) && previewUrl !== 'document' && !fileError && (
                    <div className="mt-4">
                      <Label className="text-accent-foreground">Preview:</Label>
                      <div className="mt-2 border border-accent/20 rounded-lg p-4 bg-accent/5">
                        <img
                          src={previewUrl || billerDetails?.logoURL}
                          alt="Biller logo preview"
                          className="max-w-full max-h-32 object-contain mx-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {productFields.map((field, index) => (
            <Card
              key={field.id}
              className="border-accent/20 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
              <CardHeader className="flex flex-row items-center justify-between bg-accent/5 p-6 border-b border-accent/10">
                <CardTitle className="text-sm font-bold text-accent-foreground uppercase tracking-widest">
                  Product #{index + 1}
                </CardTitle>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeProduct(index)}
                  className="bg-red-500 hover:bg-red-600 h-9 px-4"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Remove Product
                </Button>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <Label className="text-accent-foreground font-medium">
                      Product Code
                    </Label>
                    <Input
                      {...register(`products.${index}.productCode`)}
                      className="border-accent/20 focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-accent-foreground font-medium">
                      Product Name
                    </Label>
                    <Input
                      {...register(`products.${index}.productName`)}
                      className="border-accent/20 focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <Label className="text-accent-foreground font-medium">
                      Product Description
                    </Label>
                    <Textarea
                      {...register(`products.${index}.productDesc`)}
                      className="border-accent/20 focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-accent-foreground font-medium">
                      Amount
                    </Label>
                    <Input
                      type="number"
                      {...register(`products.${index}.amount`)}
                      className="border-accent/20 focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-accent-foreground font-medium">
                      Amount Type
                    </Label>
                    <Controller
                      control={control}
                      name={`products.${index}.amountType`}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full border-accent/20">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {amountOptions.map((o) => (
                              <SelectItem key={o.id} value={o.id}>
                                {o.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Payment Code
                    </Label>
                    <Input
                      {...register(`products.${index}.paymentCode`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Payment Code 2
                    </Label>
                    <Input
                      {...register(`products.${index}.paymentCode2`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Payment Code 3
                    </Label>
                    <Input
                      {...register(`products.${index}.paymentCode3`)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-dashed border-slate-200">
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Charge
                    </Label>
                    <Input
                      type="number"
                      {...register(`products.${index}.charge`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Charge Type
                    </Label>
                    <Controller
                      control={control}
                      name={`products.${index}.chargeType`}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {chargeTypeOptions.map((o) => (
                              <SelectItem key={o.id} value={o.id}>
                                {o.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Cost Price
                    </Label>
                    <Input
                      type="number"
                      {...register(`products.${index}.costPrice`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Agent Commission
                    </Label>
                    <Input
                      type="number"
                      {...register(
                        `products.${index}.agentCommission`
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Network Commission
                    </Label>
                    <Input
                      type="number"
                      {...register(
                        `products.${index}.networkCommission`
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Service Provider Commission
                    </Label>
                    <Input
                      type="number"
                      {...register(
                        `products.${index}.serviceProviderCommission`
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Platform Commission
                    </Label>
                    <Input
                      type="number"
                      {...register(
                        `products.${index}.platformCommission`
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Aggregator Commission
                    </Label>
                    <Input
                      type="number"
                      {...register(
                        `products.${index}.aggregatorCommission`
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Status
                    </Label>
                    <Controller
                      control={control}
                      name={`products.${index}.status`}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions?.map((o) => (
                              <SelectItem key={o.id} value={o.id}>
                                {o.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Minimum Amount
                    </Label>
                    <Input
                      type="number"
                      {...register(`products.${index}.minAmount`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Maximum Amount
                    </Label>
                    <Input
                      type="number"
                      {...register(`products.${index}.maxAmount`)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {paymentDataFields.map((field, index) => (
            <Card
              key={field.id}
              className="border-accent/20 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1.5 h-full bg-accent" />
              <CardHeader className="flex flex-row items-center justify-between bg-accent/5 p-6 border-b border-accent/10">
                <CardTitle className="text-sm font-bold text-accent-foreground uppercase tracking-widest">
                  Payment Data #{index + 1}
                </CardTitle>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 h-9 px-4"
                  onClick={() => removePaymentData(index)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Remove Payment Data
                </Button>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                  <div className="space-y-2">
                    <Label className="text-accent-foreground font-medium">
                      Field ID
                    </Label>
                    <Input
                      {...register(`paymentData.${index}.fieldID`)}
                      placeholder="e.g. customer_name"
                      className="border-accent/20 focus:border-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-accent-foreground font-medium">
                      Field Name
                    </Label>
                    <Input
                      {...register(`paymentData.${index}.fieldName`)}
                      placeholder="e.g. Full Name"
                      className="border-accent/20 focus:border-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Field Data Type
                    </Label>
                    <Controller
                      control={control}
                      name={`paymentData.${index}.fieldDataType`}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full bg-slate-50/30">
                            <SelectValue placeholder="Select type..." />
                          </SelectTrigger>
                          <SelectContent>
                            {datatypeOptions.map((o) => (
                              <SelectItem key={o.id} value={o.id}>
                                {o.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Max Length
                    </Label>
                    <Input
                      type="number"
                      {...register(`paymentData.${index}.maxLength`)}
                      placeholder="0"
                      className="bg-slate-50/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Mandatory Flag
                    </Label>
                    <Controller
                      control={control}
                      name={`paymentData.${index}.mandatoryFlag`}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full bg-slate-50/30">
                            <SelectValue placeholder="Is required?" />
                          </SelectTrigger>
                          <SelectContent>
                            {mandatoryFlagOptions.map((o) => (
                              <SelectItem key={o.id} value={o.id}>
                                {o.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">
                      Input/Output
                    </Label>
                    <Controller
                      control={control}
                      name={`paymentData.${index}.inputOrOutput`}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full bg-slate-50/30">
                            <SelectValue placeholder="Direction..." />
                          </SelectTrigger>
                          <SelectContent>
                            {inputOrOutputOptions.map((o) => (
                              <SelectItem key={o.id} value={o.id}>
                                {o.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex flex-col md:flex-row justify-between gap-4 pt-4">
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddProduct}
                className="border-accent text-accent hover:bg-accent/10 px-6 h-12"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10 px-6 h-12"
                onClick={handleAddPaymentData}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Payment Data
              </Button>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="bg-accent hover:bg-accent/90 text-white px-20 h-14 text-lg font-bold shadow-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Biller' : 'Save Biller'
              )}
            </Button>
          </div>
        </form>
      </div >
    </div >
  );
}