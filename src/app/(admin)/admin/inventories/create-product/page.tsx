"use client";
import { StoreCombobox } from "@/components/shared/StoreCombobox";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Scale } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useFileUpload } from "@/app/hooks/useUpload";
import { useProductMutation } from "@/components/Admin/inventories/shared-hooks.tsx/useProductMutation";
import { useCategories } from "@/app/hooks/useCategories";
import useUser from "@/store/userStore";
import { fileUrlFormatted } from "@/utils/helperfns";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import { toast } from "sonner";
import Image from "next/image";
import { usePermission } from "@/hooks/usePermissionBusiness";
import { X } from "lucide-react";
import { BannerIcon, CameraIcon, FeaturedIcon, SaleIcon, VatIcon } from "@/components/icons/icons";
import { DatePicker } from "@/components/ui/date-picker";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { parse, isValid } from "date-fns";
import { Day } from "react-day-picker";
import { getClientConfig, getClientIdentifiers } from "@/config/client-config";
import useGetLookup from "@/app/hooks/useGetLookup";
import { MultiSelect } from "@/components/ui/multi-select";

interface ProductFormData {
  productId: string;
  productName: string;
  productDescription: string;
  productCategory: string;
  productCode: string;
  productPrice: string;
  stockQuantity?: number;
  unitQuantity: string;
  imageURL: string;
  costPrice: string;
  oldPrice?: string;
  storeId: string;
  barCode: string;
  brand: string;
  ccy: string;
  color: string;
  itemSize: string;
  model: string;
  expiryDate: string;
  banner: boolean;
  featured: boolean;
  onSale: boolean;
  discount: number;
  vatEligible: boolean;
  variantEnabled?: boolean;
  weight: string;
  weightUnit: string;
  note?: string;
  allowedPreferences?: string[];
}

const extractAllowedPreferences = (raw: any): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((item) => (typeof item === "string" ? item : item?.toString() || "")).filter(Boolean);
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((item) => String(item)).filter(Boolean);
    } catch {
      return raw.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

interface CreateProductPageProps {
  product?: any;
  mode?: 'create' | 'edit';
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

const FormField = ({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) => (
  <div className={`space-y-1.5 ${className || ''}`}>
    <Label>{label} {required && <span className="text-red-500">*</span>}</Label>
    {children}
  </div>
);

const ToggleCard = ({ isActive, onToggle, icon, title, description }: {
  isActive: boolean;
  onToggle: (checked: boolean) => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-[#FFF6F0] border-2 border-[#FEE1CD] rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>{icon}</div>
        <div>
          <p className="text-sm font-semibold text-dark-gray">{title}</p>
          <p className="text-xs text-medium-gray">{description}</p>
        </div>
      </div>
      <Switch checked={isActive} onCheckedChange={onToggle} />
    </div>
  );
};

const CreateProductPage = ({ product, mode = product ? 'edit' : 'create' }: CreateProductPageProps) => {
  usePageMetadata('Products', 'Create or edit product details.');
  const { usePermissionGuard } = usePermission();
  usePermissionGuard('MANAGE_INVENTORY', {
    redirectToNotPermitted: true,
    toastMessage: "You don't have permission to manage inventory"
  });
  const { enableAllowPreferenceSettings, enableQtyInStoreView } = getClientConfig()?.features
  const preferenceOptions = useGetLookup("ITEM_PREFERENCE_OPTION", enableAllowPreferenceSettings)

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(mode === 'edit');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProductCategory, setEditingProductCategory] = useState<string | null>(null);
  const { register, handleSubmit, control, reset, watch, setValue, setError, clearErrors, formState: { errors } } = useForm<ProductFormData>();
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  const isFormInitializedRef = useRef(false);
  const isSelectReadyRef = useRef(false);
  const initialDataLoadedRef = useRef(false);

  const { mutate: saveProduct, isPending } = useProductMutation(isEditMode);
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { user } = useUser();
  const { fileUrl, handleFileChange, fileInputRef, previewUrl, setPreviewUrl, setFileUrl, isUploadingFile } = useFileUpload();

  const watchedImageURL = watch("imageURL");
  const watchedonSale = watch("onSale");

  useEffect(() => {
    const editParam = searchParams.get('edit');
    const idParam = searchParams.get('id');
    const categoryParam = searchParams.get('category');

    if (editParam === 'true' && idParam && categoryParam) {
      setIsEditMode(true);
      setEditingProductId(idParam);
      setEditingProductCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const salePrice = watch("productPrice");
    const costPrice = watch("costPrice");

    if (costPrice && salePrice && parseFloat(salePrice) < parseFloat(costPrice)) {
      setPriceError("Sale price must be greater than or equal to cost price");
    } else {
      setPriceError(null);
    }
  }, [watch("productPrice"), watch("costPrice")]);

  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product-detail', editingProductId],
    queryFn: () => axiosInstance.request({
      url: '/products/getById',
      method: 'GET',
      params: { id: editingProductId }
    }),
    enabled: !!editingProductId && isEditMode,
    staleTime: 0,
    refetchOnMount: true,
  });

  const parseDDMMYYYYToInputDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
      return "";
    } catch (error) {
      return "";
    }
  };

  const formatInputDateToDDMMYYYY = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const parsed = parse(dateString, "dd/MM/yyyy", new Date());
      if (!isValid(parsed)) {
        const fallbackParsed = parse(dateString, "yyyy-MM-dd", new Date());
        if (isValid(fallbackParsed)) {
          const day = fallbackParsed.getDate().toString().padStart(2, '0');
          const month = (fallbackParsed.getMonth() + 1).toString().padStart(2, '0');
          const year = fallbackParsed.getFullYear();
          return `${year}-${month}-${day}`;
        }
        return "";
      }
      const day = parsed.getDate().toString().padStart(2, '0');
      const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
      const year = parsed.getFullYear();
      return `${year}-${month}-${day}`;
    } catch (error) {
      return "";
    }
  };

  useEffect(() => {
    if (!isEditMode && !isFormInitializedRef.current) {
      reset({
        productId: "", productName: "", productDescription: "", productCategory: "",
        productCode: "", productPrice: "", stockQuantity: 0, unitQuantity: "",
        imageURL: "", costPrice: "",
        barCode: "", brand: "", ccy: "NGN", color: "", itemSize: "", model: "",
        expiryDate: "", banner: false, featured: false, onSale: false,
        oldPrice: "", discount: 0, vatEligible: false, weight: "", weightUnit: "", note: "",
        allowedPreferences: []
      });
      isFormInitializedRef.current = true;
      isSelectReadyRef.current = true;
      setIsFormLoading(false);
    }
  }, [isEditMode, reset, user]);

  useEffect(() => {
    if (isEditMode && productData?.data && categories?.categories && !isLoadingCategories && !initialDataLoadedRef.current) {
      setIsFormLoading(true);
      const product = productData.data.productDto;
      const matchedCategory = categories.categories.find((cat: any) => cat.code === product?.category);
      const productObj = {
        productId: product?.id?.toString() || "",
        productName: product?.name || "",
        productDescription: product?.description || "",
        productCategory: matchedCategory?.code || product?.category || "",
        productCode: product?.code || "",
        productPrice: product?.salePrice?.toString() || "",
        stockQuantity: product?.qtyInStore || 0,
        unitQuantity: product?.unit || 'Piece',
        imageURL: product?.picture || "",
        costPrice: product?.costPrice?.toString() || "",
        barCode: product?.barCode || "",
        brand: product?.brand || "",
        ccy: product?.ccy || 'NGN',
        color: product?.color || "",
        itemSize: product?.itemSize || "",
        model: product?.model || "",
        expiryDate: parseDDMMYYYYToInputDate(product?.expiryDate || ""),
        banner: product?.banner || false,
        featured: product?.featured || false,
        onSale: product?.onSale || false,
        oldPrice: product?.oldPrice?.toString() || "",
        discount: product?.discount || 0,
        vatEligible: product?.vat > 0 || false,
        weight: product?.weight?.toString() || "",
        weightUnit: product?.weightUnit || "",
        variantEnabled: !!product?.itemVariants?.length ? true : false,
        note: product?.note || "",
        allowedPreferences: extractAllowedPreferences(product?.allowedPreferences)
      };
      reset(productObj);
      initialDataLoadedRef.current = true;
      isFormInitializedRef.current = true;
      isSelectReadyRef.current = true;
      setIsFormLoading(false);
    }
  }, [isEditMode, productData, categories, isLoadingCategories, reset, user]);

  useEffect(() => {
    if (isEditMode) {
      isFormInitializedRef.current = false;
      isSelectReadyRef.current = false;
      initialDataLoadedRef.current = false;
    }
  }, [isEditMode]);

  const onSubmitForm = async (values: ProductFormData) => {
    try {
      const salePrice = parseFloat(values.productPrice);
      const costPrice = parseFloat(values.costPrice);
      if (costPrice && salePrice < costPrice) {
        toast.error("Sale price must be greater than or equal to cost price");
        return;
      }
      const payload = {
        productId: isEditMode ? (editingProductId || product?.id || product?.productId) : null,
        productName: values?.productName,
        productDescription: values?.productDescription,
        productCategory: values?.productCategory,
        productCode: values?.productCode,
        productPrice: values?.productPrice,
        stockQuantity: values?.stockQuantity,
        unitQuantity: values?.unitQuantity || 'Piece',
        imageURL: fileUrl ? fileUrlFormatted(fileUrl) : (fileUrlFormatted(values?.imageURL) || ""),
        costPrice: values?.costPrice,
        storeId: getClientIdentifiers()?.storeCode || user?.storeCode,
        barCode: values?.barCode,
        brand: values?.brand,
        ccy: values?.ccy || 'NGN',
        color: values?.color || null,
        itemSize: values?.itemSize || null,
        model: values?.model || null,
        expiryDate: formatInputDateToDDMMYYYY(values?.expiryDate) || null,
        banner: values?.banner || false,
        featured: values?.featured || false,
        onSale: values?.onSale || false,
        discount: values?.onSale ? values?.discount : 0,
        vatRate: values?.vatEligible ? 7.5 : 0,
        weight: values.weight ? parseFloat(values.weight) : null,
        weightUnit: values.weightUnit || null,
        variantEnabled: values?.variantEnabled || false,
        note: values?.note || null,
        allowedPreferences: values?.allowedPreferences || []
      };
      await saveProduct(payload);
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} product`);
    }
  };

  const isFormReady = isEditMode
    ? initialDataLoadedRef.current && isSelectReadyRef.current
    : isFormInitializedRef.current;

  if (isLoadingProduct || isFormLoading || (isEditMode && isLoadingCategories) || !isFormReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-sidebar-accent mx-auto mb-4" />
          <p className="text-medium-gray">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl">
        <div className="mb-4">
          <Button variant="link" onClick={() => router.push('/admin/inventories')}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>

        <div className='container mx-auto px-20 py-6'>
          <div className="mb-6">
            <h1 className="text-md lg:text-lg font-medium text-dark-gray">
              {isEditMode ? 'Edit Product' : 'Create Product'}
            </h1>
            <p className="text-xs lg:text-sm font-normal text-medium-gray">
              {isEditMode ? 'Update product information' : 'Add a new product to your inventory'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div className='bg-white px-6 py-4 rounded-2xl'>
              <FormSection title="Basic Information" subtitle="Product identity and classification.">
                <FormField label="Product Name" required>
                  <Input {...register("productName", { required: "Product name is required" })} placeholder="Enter product name" />
                  {errors.productName && <p className="text-xs text-red-500 mt-1">{errors.productName.message}</p>}
                </FormField>

                <FormField label="Category" required>
                  {isEditMode && !isSelectReadyRef.current ? (
                    <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                      <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                      <span className="text-sm text-medium-gray">Loading category...</span>
                    </div>
                  ) : (
                    <Controller
                      name="productCategory"
                      control={control}
                      rules={{ required: "Product category is required" }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            {categories?.categories?.map((category: any, index: number) => (
                              <SelectItem key={index} value={category.code}>{category.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                  {errors.productCategory && <p className="text-xs text-red-500 mt-1">{errors.productCategory.message}</p>}
                </FormField>

                <FormField label="Brand">
                  <Input {...register("brand")} placeholder="Enter brand" />
                </FormField>

                {/* <FormField label="Store" required>
                  <Controller
                    name="storeId"
                    control={control}
                    rules={{ required: "Store is required" }}
                    render={({ field }) => (
                      <StoreCombobox
                        value={field.value}
                        onChange={field.onChange}
                        axiosInstance={axiosInstance}
                        merchantCode={user?.merchantCode}
                        error={errors.storeId?.message}
                      />
                    )}
                  />
                </FormField> */}

                <div className="col-span-2">
                  <FormField label="Description" required>
                    <Textarea {...register("productDescription", { required: "Product description is required" })} placeholder="Enter product description" rows={3} />
                    {errors.productDescription && <p className="text-xs text-red-500 mt-1">{errors.productDescription.message}</p>}
                  </FormField>
                </div>
                <div className="col-span-2">
                  <FormField label="Product Notice">
                    <Textarea
                      {...register("note")}
                      placeholder="Enter product notice"
                      rows={3}
                      className="w-full"
                    />
                    {errors.note && <p className="text-xs text-red-500 mt-1">{errors.note.message}</p>}
                  </FormField>
                </div>
              </FormSection>

              <FormSection title="Product Specifications" subtitle="Additional product details and attributes.">
                <FormField label="Color">
                  <Input {...register("color")} placeholder="e.g., Red, Blue, Black" />
                </FormField>
                <FormField label="Size">
                  <Input {...register("itemSize")} placeholder="e.g., S, M, L, 10x10" />
                </FormField>
                <FormField label="Weight" required>
                  <Input type="number" step="0.01" {...register("weight", { min: { value: 0, message: "Weight must be positive" } })} placeholder="0.00" />
                  {errors.weight && <p className="text-xs text-red-500 mt-1">{errors.weight.message}</p>}
                </FormField>
                <FormField label="Weight Unit" required>
                  <Controller
                    name="weightUnit" control={control}
                    render={({ field }) => (
                      <>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="g">g (Grams)</SelectItem>
                            <SelectItem value="kg">kg (Kilograms)</SelectItem>
                            <SelectItem value="lb">lb (Pounds)</SelectItem>
                            <SelectItem value="oz">oz (Ounces)</SelectItem>
                            <SelectItem value="ltr">ltr (Liters)</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.weightUnit && <p className="text-xs text-red-500 mt-1">{errors.weightUnit.message}</p>}
                      </>
                    )}
                  />
                </FormField>
                <FormField label="Model">
                  <Input {...register("model")} placeholder="Product model number" />
                </FormField>
                <FormField label="Expiry Date">
                  <Input
                    type="date"
                    {...register("expiryDate")}
                  />
                  {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate.message}</p>}
                </FormField>
                {enableAllowPreferenceSettings !== false && (
                  <div className="col-span-2">
                    <FormField label="Allowed Preferences">
                      <Controller
                        name="allowedPreferences"
                        control={control}
                        render={({ field }) => (
                          <MultiSelect
                            options={preferenceOptions}
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Select allowed preferences"
                          />
                        )}
                      />
                    </FormField>
                  </div>
                )}
              </FormSection>

              <FormSection title="Pricing" subtitle="Product pricing information.">
                <FormField label="Selling Price" required>
                  <Input
                    type="number" step="0.01"
                    {...register("productPrice", {
                      required: "Selling price is required",
                      min: { value: 0, message: "Price must be positive" },
                      validate: (value) => {
                        const costPrice = watch("costPrice");
                        if (costPrice && parseFloat(value) < parseFloat(costPrice)) {
                          return "Sale price must be greater than or equal to cost price";
                        }
                        return true;
                      }
                    })}
                    placeholder="0.00"
                  />
                  {errors.productPrice && <p className="text-xs text-red-500 mt-1">{errors.productPrice.message}</p>}
                  {priceError && !errors.productPrice && <p className="text-xs text-red-500 mt-1">{priceError}</p>}
                </FormField>

                <FormField label="Cost Price">
                  <Input
                    type="number" step="0.01"
                    {...register("costPrice", { min: { value: 0, message: "Cost price must be positive" } })}
                    placeholder="0.00"
                  />
                  {errors.costPrice && <p className="text-xs text-red-500 mt-1">{errors.costPrice.message}</p>}
                </FormField>

                <FormField label="Currency">
                  <Controller
                    name="ccy" control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </FormSection>

              <FormSection title="Codes & Inventory" subtitle="Product identification and stock information.">
                {isEditMode && (
                  <FormField label="Product Code">
                    <Input {...register("productCode")} disabled />
                    <p className="text-xs text-medium-gray mt-1">Product code cannot be changed</p>
                  </FormField>
                )}
                {
                  enableQtyInStoreView && (
                    <FormField label="Stock Quantity">
                      <Input
                        type="number"
                        {...register("stockQuantity", {
                          min: { value: 0, message: "Stock quantity must be non-negative" },
                          valueAsNumber: true
                        })}
                      />
                      {errors.stockQuantity && <p className="text-xs text-red-500 mt-1">{errors.stockQuantity.message}</p>}
                    </FormField>
                  )
                }
                <FormField label="Unit">
                  <Controller
                    name="unitQuantity" control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Carton">Carton</SelectItem>
                          <SelectItem value="Piece">Piece</SelectItem>
                          <SelectItem value="Bag">Bag</SelectItem>
                          <SelectItem value="Bowl">Bowl</SelectItem>
                          <SelectItem value="Bottle">Bottle</SelectItem>
                          <SelectItem value="Pack">Pack</SelectItem>
                          <SelectItem value="Crate">Crate</SelectItem>
                          <SelectItem value="Box">Box</SelectItem>
                          <SelectItem value="Sachet">Sachet</SelectItem>
                          <SelectItem value="Pouch">Pouch</SelectItem>
                          <SelectItem value="Jar">Jar</SelectItem>
                          <SelectItem value="Pet bottle">Pet bottle</SelectItem>
                          <SelectItem value="Spout pouch">Spout pouch</SelectItem>
                          <SelectItem value="Plastic bottle">Plastic bottle</SelectItem>
                          <SelectItem value="Dozen">Dozen</SelectItem>
                          <SelectItem value="Pair">Pair</SelectItem>
                          <SelectItem value="Set">Set</SelectItem>
                          <SelectItem value="Roll">Roll</SelectItem>
                          <SelectItem value="Tin">Tin</SelectItem>
                          <SelectItem value="Can">Can</SelectItem>
                          <SelectItem value="Tub">Tub</SelectItem>
                          <SelectItem value="Sack">Sack</SelectItem>
                          <SelectItem value="Pallet">Pallet</SelectItem>
                          <SelectItem value="Liter">Liter</SelectItem>
                          <SelectItem value="ml">ml (Milliliters)</SelectItem>
                          <SelectItem value="g">g (Grams)</SelectItem>
                          <SelectItem value="kg">kg (Kilograms)</SelectItem>
                          <SelectItem value="lb">lb (Pounds)</SelectItem>
                          <SelectItem value="oz">oz (Ounces)</SelectItem>
                          <SelectItem value="cm">cm (Centimeters)</SelectItem>
                          <SelectItem value="m">m (Meters)</SelectItem>
                          <SelectItem value="in">in (Inches)</SelectItem>
                          <SelectItem value="ft">ft (Feet)</SelectItem>
                          <SelectItem value="sqft">sq ft (Square Feet)</SelectItem>
                          <SelectItem value="sqm">sq m (Square Meters)</SelectItem>
                          <SelectItem value="Unit">Unit</SelectItem>
                          <SelectItem value="Each">Each</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
                <FormField label="Bar Code">
                  <Input {...register("barCode")} placeholder="Enter bar code" />
                </FormField>

                <div className="col-span-2 space-y-3 pt-2">
                  <Controller
                    name="onSale" control={control}
                    render={({ field }) => (
                      <ToggleCard
                        isActive={field.value}
                        onToggle={(checked) => field.onChange(checked)}
                        icon={<SaleIcon className="w-5 h-5 text-[#DCD5D0]" />}
                        title="On Sale"
                        description="Enable to offer this product at a discounted price"
                      />
                    )}
                  />

                  {watchedonSale && (
                    <div className="animate-in fade-in duration-300">
                      <FormField label="Discount Percentage" required>
                        <Input
                          type="number" step="0.01" min="0" max="100"
                          {...register("discount", {
                            required: "Discount percentage is required when on sale",
                            min: { value: 0, message: "Discount cannot be negative" },
                            max: { value: 100, message: "Discount cannot exceed 100%" }
                          })}
                          placeholder="Enter discount percentage"
                        />
                        {errors.discount && <p className="text-xs text-red-500 mt-1">{errors.discount.message}</p>}
                      </FormField>
                    </div>
                  )}

                  <Controller
                    name="vatEligible" control={control}
                    render={({ field }) => (
                      <ToggleCard
                        isActive={field.value}
                        onToggle={(checked) => field.onChange(checked)}
                        icon={<VatIcon className="w-5 h-5 text-[#DCD5D0]" />}
                        title="VAT Eligible"
                        description="Enable if this product is subject to 7.5% VAT"
                      />
                    )}
                  />

                  <Controller
                    name="variantEnabled" control={control}
                    render={({ field }) => (
                      <ToggleCard
                        isActive={!!field.value}
                        onToggle={(checked) => field.onChange(checked)}
                        icon={<Scale className="w-5 h-5 text-[#DCD5D0]" />}
                        title="Variant Enabled"
                        description="Enable if this product has different variants"
                      />
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title="Product Visibility" subtitle="Manage how this product is featured.">
                <div className="col-span-2 space-y-3">
                  <Controller
                    name="banner" control={control}
                    render={({ field }) => (
                      <ToggleCard
                        isActive={field.value}
                        onToggle={(checked) => field.onChange(checked)}
                        icon={<BannerIcon className="w-5 h-5 text-[#DCD5D0]" />}
                        title="Banner Product"
                        description="Feature this product in banner sections"
                      />
                    )}
                  />
                  <Controller
                    name="featured" control={control}
                    render={({ field }) => (
                      <ToggleCard
                        isActive={field.value}
                        onToggle={(checked) => field.onChange(checked)}
                        icon={<FeaturedIcon className="w-5 h-5 text-[#DCD5D0]" />}
                        title="Featured Product"
                        description="Highlight this product in featured sections"
                      />
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title="Product Image" subtitle="Upload a product image.">
                <div className="col-span-2">
                  <FormField label="">
                    <div className="space-y-4">
                      {(previewUrl || watchedImageURL) && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-gray-200">
                            <Image src={previewUrl || watchedImageURL} alt="Preview" width={64} height={64} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 text-sm text-medium-gray">Image preview</div>
                          <Button type="button" variant="ghost" size="sm"
                            onClick={() => { setPreviewUrl(''); setFileUrl(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="hover:text-red-500">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="border-2 border-dashed border-faded-accent rounded-lg p-6 text-center hover:border-sidebar-accent/50 transition-colors">
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="photo-upload" disabled={isUploadingFile} />
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
                    <p className="text-medium-gray text-[10px] mt-2">The recommended aspect ratio is 1:1 (square)</p>
                  </FormField>
                </div>
              </FormSection>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isPending || isUploadingFile}>
                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : (isEditMode ? 'Update Product' : 'Create Product')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;