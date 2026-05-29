// "use client";
// import { useEffect, useRef, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import {
//   Save,
//   X,
//   Package,
//   Barcode,
//   Warehouse,
//   ImageIcon,
//   Tag,
//   BookOpen,
//   Box,
//   Hash,
//   ArrowLeft,
//   Palette,
//   Ruler,
//   Calendar,
//   Loader2,
//   Star,
//   Megaphone,
//   BadgePercent
// } from "lucide-react";
// import FileUpload from "@/components/Operations/inventories/file-input";
// import { useForm, Controller } from "react-hook-form";
// import { useFileUpload } from "@/app/hooks/useUpload";
// import { useProductMutation } from "@/components/Operations/inventories/shared-hooks/useProductMutation";
// import { useCategories } from "@/app/hooks/useCategories";
// import useOperations from "@/store/operationsStore"
// import { fileUrlFormatted } from "@/utils/helperfns";
// import { useQuery } from "@tanstack/react-query";
// import axiosOperations from "@/utils/fetch-function-op-auth";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { Badge } from "@/components/ui/badge";
// import { usePermission } from "@/hooks/usePermission";

// interface ProductFormData {
//   productId: string;
//   productName: string;
//   productDescription: string;
//   productCategory: string;
//   productCode: string;
//   productPrice: string;
//   stockQuantity: number;
//   unitQuantity: string;
//   imageURL: string;
//   costPrice: string;
//   oldPrice?: string;
//   storeId: string;
//   barCode: string;
//   brand: string;
//   ccy: string;
//   color: string;
//   itemSize: string;
//   model: string;
//   expiryDate: string;
//   banner: boolean;
//   featured: boolean;
//   onSale: boolean;
//   discount: number;
//   vatEligible: boolean;
//   weight: string;
//   weightUnit: string;
// }

// interface CreateProductPageProps {
//   product?: any;
//   mode?: 'create' | 'edit';
// }

// interface ToggleCardProps {
//   isActive: boolean;
//   onToggle: () => void;
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   className?: string;
// }

// const ToggleCard = ({ isActive, onToggle, icon, title, description, className }: ToggleCardProps) => {
//   return (
//     <Card
//       className={cn(
//         'relative overflow-hidden border border-border rounded-xl transition-all duration-300 cursor-pointer group',
//         'hover:shadow-lg hover:-translate-y-1',
//         isActive
//           ? 'bg-accent text-white'
//           : 'bg-white text-foreground',
//         className
//       )}
//       onClick={onToggle}
//     >
//       {isActive && (
//         <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden">
//           <div className="rounded-xl absolute top-4 -right-22 rotate-40 w-44 h-25 bg-white/20 transform origin-center"></div>
//           <div className="rounded-xl absolute top-8 -right-24 rotate-40 w-44 h-30 bg-white/20 transform origin-center"></div>
//         </div>
//       )}

//       {!isActive && (
//         <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden">
//           <div className="rounded-xl absolute top-4 -right-22 rotate-40 w-44 h-25 bg-accent/30 transform origin-center"></div>
//           <div className="rounded-xl absolute top-8 -right-24 rotate-40 w-44 h-30 bg-accent/30 transform origin-center"></div>
//         </div>
//       )}

//       <CardContent className="p-5 relative z-10">
//         <div className="flex items-center mb-4">
//           <div className={cn(
//             "w-10 h-10 rounded-full border-2 flex items-center justify-center mr-3",
//             isActive ? "border-white bg-white/20" : "border-accent/30 bg-accent/10"
//           )}>
//             {icon}
//           </div>
//           <span className="text-sm font-medium">{title}</span>
//         </div>

//         <div className="mb-2">
//           <p className={cn(
//             "text-xs",
//             isActive ? "text-white/90" : "text-muted-foreground"
//           )}>
//             {description}
//           </p>
//         </div>

//         <div className="mt-4">
//           <Badge variant="secondary" className={cn(
//             "text-xs",
//             isActive ? "bg-white text-accent" : "bg-accent/10 text-accent-foreground"
//           )}>
//             {isActive ? "Active" : "Inactive"}
//           </Badge>
//         </div>

//         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
//           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const CreateProductPage = ({ product, mode = product ? 'edit' : 'create' }: CreateProductPageProps) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isEditMode, setIsEditMode] = useState(mode === 'edit');
//   const [editingProductId, setEditingProductId] = useState<string | null>(null);
//   const [editingProductCategory, setEditingProductCategory] = useState<string | null>(null);
//   const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<ProductFormData>();
//   const [isFormLoading, setIsFormLoading] = useState(false);
//   const [priceError, setPriceError] = useState<string | null>(null);

//   const isFormInitializedRef = useRef(false);
//   const isSelectReadyRef = useRef(false);
//   const initialDataLoadedRef = useRef(false);

//   const { mutate: saveProduct, isPending } = useProductMutation(isEditMode);
//   const { data: categories, isLoading: isLoadingCategories } = useCategories();
//   const { operations } = useOperations();
//   const { fileUrl, handleFileChange } = useFileUpload();

//   const watchedImageURL = watch("imageURL");
//   const watchedonSale = watch("onSale");

//   useEffect(() => {
//     const editParam = searchParams.get('edit');
//     const idParam = searchParams.get('id');
//     const categoryParam = searchParams.get('category');

//     if (editParam === 'true' && idParam && categoryParam) {
//       setIsEditMode(true);
//       setEditingProductId(idParam);
//       setEditingProductCategory(categoryParam);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     const salePrice = watch("productPrice");
//     const costPrice = watch("costPrice");

//     if (costPrice && salePrice && parseFloat(salePrice) < parseFloat(costPrice)) {
//       setPriceError("Sale price must be greater than or equal to cost price");
//     } else {
//       setPriceError(null);
//     }
//   }, [watch("productPrice"), watch("costPrice")]);

//   const { data: productData, isLoading: isLoadingProduct } = useQuery({
//     queryKey: ['product-detail', editingProductId],
//     queryFn: () => axiosOperations.request({
//       url: '/products/getById',
//       method: 'GET',
//       params: {
//         id: editingProductId
//       }
//     }),
//     enabled: !!editingProductId && isEditMode,
//     staleTime: 0,
//     refetchOnMount: true,
//   });

//   const parseDDMMYYYYToInputDate = (dateString: string): string => {
//     if (!dateString) return "";

//     try {
//       const parts = dateString.split('-');
//       if (parts.length === 3) {
//         const day = parts[0].padStart(2, '0');
//         const month = parts[1].padStart(2, '0');
//         const year = parts[2];

//         const formattedDate = `${year}-${month}-${day}`;
//         const date = new Date(formattedDate);
//         if (!isNaN(date.getTime())) {
//           return formattedDate;
//         }
//       }

//       console.warn('Invalid date format:', dateString);
//       return "";
//     } catch (error) {
//       console.warn('Error parsing date:', dateString, error);
//       return "";
//     }
//   };

//   const formatInputDateToDDMMYYYY = (dateString: string): string => {
//     if (!dateString) return "";

//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return "";

//       const day = date.getDate().toString().padStart(2, '0');
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const year = date.getFullYear();

//       return `${year}-${month}-${day}`;
//     } catch (error) {
//       console.warn('Error formatting date:', dateString, error);
//       return "";
//     }
//   };

//   useEffect(() => {
//     if (!isEditMode && !isFormInitializedRef.current) {
//       reset({
//         productId: "",
//         productName: "",
//         productDescription: "",
//         productCategory: "",
//         productCode: "",
//         productPrice: "",
//         stockQuantity: 0,
//         unitQuantity: "",
//         imageURL: "",
//         costPrice: "",
//         storeId: operations?.storeCode || "",
//         barCode: "",
//         brand: "",
//         ccy: "NGN",
//         color: "",
//         itemSize: "",
//         model: "",
//         expiryDate: "",
//         banner: false,
//         featured: false,
//         onSale: false,
//         oldPrice: "",
//         discount: 0,
//         vatEligible: false,
//         weight: "",
//         weightUnit: ""
//       });
//       isFormInitializedRef.current = true;
//       isSelectReadyRef.current = true;
//       setIsFormLoading(false);
//     }
//   }, [isEditMode, reset, operations]);

//   useEffect(() => {
//     if (isEditMode && productData?.data && categories?.categories && !isLoadingCategories && !initialDataLoadedRef.current) {
//       setIsFormLoading(true);

//       const product = productData.data.productDto;

//       console.log('Loading product data:', {
//         unit: product?.unit,
//         name: product?.name
//       });

//       const matchedCategory = categories.categories.find(
//         (cat: any) => cat.code === product?.category
//       );

//       const productObj = {
//         productId: product?.id?.toString() || "",
//         productName: product?.name || "",
//         productDescription: product?.description || "",
//         productCategory: matchedCategory?.code || product?.category || "",
//         productCode: product?.code || "",
//         productPrice: product?.salePrice?.toString() || "",
//         stockQuantity: product?.qtyInStore || 0,
//         unitQuantity: product?.unit || 'Piece',
//         imageURL: product?.picture || "",
//         costPrice: product?.costPrice?.toString() || "",
//         storeId: operations?.storeCode || "",
//         barCode: product?.barCode || "",
//         brand: product?.brand || "",
//         ccy: product?.ccy || 'NGN',
//         color: product?.color || "",
//         itemSize: product?.itemSize || "",
//         model: product?.model || "",
//         expiryDate: parseDDMMYYYYToInputDate(product?.expiryDate || ""),
//         banner: product?.banner || false,
//         featured: product?.featured || false,
//         onSale: product?.onSale || false,
//         oldPrice: product?.oldPrice?.toString() || "",
//         discount: product?.discount || 0,
//         vatEligible: product?.vat > 0 || false,
//         weight: product?.weight?.toString() || "",
//         weightUnit: product?.weightUnit || ""
//       };

//       console.log('Resetting form with:', productObj);
//       reset(productObj);

//       // Mark as initialized and ready
//       initialDataLoadedRef.current = true;
//       isFormInitializedRef.current = true;
//       isSelectReadyRef.current = true;
//       setIsFormLoading(false);
//     }
//   }, [
//     isEditMode,
//     productData,
//     categories,
//     isLoadingCategories,
//     reset,
//     operations
//   ]);

//   useEffect(() => {
//     if (isEditMode) {
//       isFormInitializedRef.current = false;
//       isSelectReadyRef.current = false;
//       initialDataLoadedRef.current = false;
//     }
//   }, [isEditMode]);

//   const onSubmitForm = async (values: ProductFormData) => {
//     try {
//       const salePrice = parseFloat(values.productPrice);
//       const costPrice = parseFloat(values.costPrice);

//       if (costPrice && salePrice < costPrice) {
//         toast.error("Sale price must be greater than or equal to cost price");
//         return;
//       }

//       const payload = {
//         productId: isEditMode ? (editingProductId || product?.id || product?.productId) : null,
//         productName: values?.productName,
//         productDescription: values?.productDescription,
//         productCategory: values?.productCategory,
//         productCode: values?.productCode,
//         productPrice: values?.productPrice,
//         stockQuantity: values?.stockQuantity,
//         unitQuantity: values?.unitQuantity || 'Piece',
//         imageURL: fileUrl ? fileUrlFormatted(fileUrl) : (fileUrlFormatted(values?.imageURL) || ""),
//         costPrice: values?.costPrice,
//         storeId: operations?.storeCode,
//         barCode: values?.barCode,
//         brand: values?.brand,
//         ccy: values?.ccy || 'NGN',
//         color: values?.color || null,
//         itemSize: values?.itemSize || null,
//         model: values?.model || null,
//         expiryDate: formatInputDateToDDMMYYYY(values?.expiryDate) || null,
//         banner: values?.banner || false,
//         featured: values?.featured || false,
//         onSale: values?.onSale || false,
//         discount: values?.onSale ? values?.discount : 0,
//         vatRate: values?.vatEligible ? 7.5 : 0,
//         weight: values.weight ? parseFloat(values.weight) : null,
//         weightUnit: values.weightUnit || null
//       };

//       console.log('Submitting payload:', payload);
//       await saveProduct(payload);

//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error(`Failed to ${isEditMode ? 'update' : 'create'} product`);
//     }
//   };

//   const isFormReady = isEditMode
//     ? initialDataLoadedRef.current && isSelectReadyRef.current
//     : isFormInitializedRef.current;

//   if (isLoadingProduct || isFormLoading || (isEditMode && isLoadingCategories) || !isFormReady) {
//     return (
//       <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
//             <Loader2 className="h-8 w-8 text-accent-foreground animate-spin" />
//           </div>
//           <p className="text-gray-500">Loading product data...</p>
//           <p className="text-sm text-muted-foreground mt-2">
//             {isLoadingCategories ? "Loading categories..." : "Preparing form..."}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-6xl">
//       <div className="flex items-center mb-6">
//         <Button
//           variant="ghost"
//           onClick={() => router.back()}
//           className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Inventories
//         </Button>
//       </div>

//       <div className="flex items-center justify-center mb-8">
//         <div className="text-center">
//           <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
//             <Package className="h-8 w-8 text-accent-foreground" />
//           </div>
//           <h1 className="text-3xl font-bold text-accent-foreground">
//             {isEditMode ? 'Edit Product' : 'Create New Product'}
//           </h1>
//           <p className="text-muted-foreground mt-2">
//             {isEditMode ? 'Update product information' : 'Add a new product to your inventory'}
//           </p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit(onSubmitForm)}>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <div className="space-y-8">
//             <Card className="border-accent/20 border-2 shadow-md">
//               <CardHeader className="pb-4">
//                 <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
//                   <Tag className="h-5 w-5" />
//                   Basic Information
//                 </CardTitle>
//                 <CardDescription>Product identity and classification</CardDescription>
//               </CardHeader>
//               <CardContent className="p-6 space-y-5">
//                 <div className="space-y-2">
//                   <Label htmlFor="productName" className="flex items-center gap-1 text-sm font-medium">
//                     <span>Product Name</span>
//                     <span className="text-destructive">*</span>
//                   </Label>
//                   <div className="relative">
//                     <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="productName"
//                       className="pl-10"
//                       {...register("productName", { required: "Product name is required" })}
//                     />
//                   </div>
//                   {errors.productName && (
//                     <p className="text-sm text-destructive mt-1">{errors.productName.message}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="productDescription" className="flex items-center gap-1 text-sm font-medium">
//                     <span>Description</span>
//                     <span className="text-destructive">*</span>
//                   </Label>
//                   <Textarea
//                     id="productDescription"
//                     {...register("productDescription", { required: "Product description is required" })}
//                     className="min-h-[100px]"
//                   />
//                   {errors.productDescription && (
//                     <p className="text-sm text-destructive mt-1">{errors.productDescription.message}</p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="productCategory" className="text-sm font-medium">Category <span className="text-destructive">*</span></Label>

//                     {isEditMode && !isSelectReadyRef ? (
//                       <div className="flex items-center gap-2 p-3 border border-border rounded-md bg-muted/50 animate-pulse">
//                         <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//                         <span className="text-sm text-muted-foreground">Loading category...</span>
//                       </div>
//                     ) : (
//                       <Controller
//                         name="productCategory"
//                         control={control}
//                         rules={{ required: "Product category is required" }}
//                         render={({ field }) => (
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value}
//                           >
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select category" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {categories?.categories?.map((category: any, index: number) => (
//                                 <SelectItem key={index} value={category.code}>
//                                   {category.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         )}
//                       />
//                     )}
//                     {errors.productCategory && (
//                       <p className="text-sm text-destructive mt-1">{errors.productCategory.message}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="brand" className="text-sm font-medium">Brand</Label>
//                     <Input
//                       id="brand"
//                       {...register("brand")}
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-accent/20 border-2 shadow-md">
//               <CardHeader className="pb-4">
//                 <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
//                   <span className="text-muted-foreground">₦</span>
//                   Pricing
//                 </CardTitle>
//                 <CardDescription>Product pricing information</CardDescription>
//               </CardHeader>
//               <CardContent className="p-6 space-y-5">
//                 {/* {product?.onSale && (
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="oldPrice" className="text-sm font-medium">Old Price</Label>
//                       <div className="relative">
//                         <span className="absolute left-2 top-2 text-muted-foreground">₦</span>
//                         <Input
//                           id="oldPrice"
//                           type="number"
//                           step="0.01"
//                           className="pl-8"
//                           {...register("oldPrice", {
//                             min: { value: 0, message: "Old price must be positive" }
//                           })}
//                         />
//                       </div>
//                       {errors.oldPrice && (
//                         <p className="text-sm text-destructive mt-1">{errors.oldPrice.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 )} */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="productPrice" className="flex items-center gap-1 text-sm font-medium">
//                       <span>Selling Price</span>
//                       <span className="text-destructive">*</span>
//                     </Label>
//                     <div className="relative">
//                       <span className="absolute left-2 top-2 text-muted-foreground">₦</span>
//                       <Input
//                         id="productPrice"
//                         type="number"
//                         step="0.01"
//                         className="pl-8"
//                         {...register("productPrice", {
//                           required: "Selling price is required",
//                           min: { value: 0, message: "Price must be positive" },
//                           validate: (value) => {
//                             const costPrice = watch("costPrice");
//                             if (costPrice && parseFloat(value) < parseFloat(costPrice)) {
//                               return "Sale price must be greater than or equal to cost price";
//                             }
//                             return true;
//                           }
//                         })}
//                       />
//                     </div>
//                     {errors.productPrice && (
//                       <p className="text-sm text-destructive mt-1">{errors.productPrice.message}</p>
//                     )}
//                     {priceError && !errors.productPrice && (
//                       <p className="text-sm text-destructive mt-1">{priceError}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="costPrice" className="flex items-center gap-1 text-sm font-medium">
//                       <span>Cost Price</span>
//                       <span className="text-destructive"></span>
//                     </Label>
//                     <div className="relative">
//                       <span className="absolute left-2 top-2 text-muted-foreground">₦</span>
//                       <Input
//                         id="costPrice"
//                         type="number"
//                         step="0.01"
//                         className="pl-8"
//                         {...register("costPrice", {
//                           min: { value: 0, message: "Cost price must be positive" }
//                         })}
//                       />
//                     </div>
//                     {errors.costPrice && (
//                       <p className="text-sm text-destructive mt-1">{errors.costPrice.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="ccy" className="text-sm font-medium">Currency</Label>
//                   <Controller
//                     name="ccy"
//                     control={control}
//                     render={({ field }) => (
//                       <Select onValueChange={field.onChange} value={field.value}>
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Select currency" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
//                           <SelectItem value="USD">USD - US Dollar</SelectItem>
//                           <SelectItem value="EUR">EUR - Euro</SelectItem>
//                           <SelectItem value="GBP">GBP - British Pound</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-4 pt-4 border-t border-border">
//                     <div className="space-y-2">
//                       <Controller
//                         name="onSale"
//                         control={control}
//                         render={({ field }) => (
//                           <ToggleCard
//                             isActive={field.value}
//                             onToggle={() => field.onChange(!field.value)}
//                             icon={<BadgePercent className="h-5 w-5" />}
//                             title="On Sale"
//                             description="Enable to offer this product at a discounted price"
//                           />
//                         )}
//                       />
//                     </div>

//                     {watchedonSale && (
//                       <div className="space-y-2 animate-in fade-in duration-300">
//                         <Label htmlFor="discount" className="flex items-center gap-1 text-sm font-medium">
//                           <span>Discount Percentage</span>
//                           <span className="text-destructive">*</span>
//                         </Label>
//                         <div className="relative">
//                           <span className="absolute left-3 top-3 text-muted-foreground">%</span>
//                           <Input
//                             id="discount"
//                             type="number"
//                             step="0.01"
//                             min="0"
//                             max="100"
//                             className="pl-10"
//                             {...register("discount", {
//                               required: "Discount percentage is required when on sale",
//                               min: { value: 0, message: "Discount cannot be negative" },
//                               max: { value: 100, message: "Discount cannot exceed 100%" }
//                             })}
//                             placeholder="Enter discount percentage"
//                           />
//                         </div>
//                         {errors.discount && (
//                           <p className="text-sm text-destructive mt-1">{errors.discount.message}</p>
//                         )}
//                         <p className="text-xs text-muted-foreground">
//                           Enter the percentage discount for this product (0-100%)
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-4 pt-4 border-t border-border">
//                     <div className="space-y-2">
//                       <Controller
//                         name="vatEligible"
//                         control={control}
//                         render={({ field }) => (
//                           <ToggleCard
//                             isActive={field.value}
//                             onToggle={() => field.onChange(!field.value)}
//                             icon={<span className="text-sm font-bold">VAT</span>}
//                             title="VAT Eligible"
//                             description="Enable if this product is subject to 7.5% VAT"
//                           />
//                         )}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="border-accent/20 border-2 shadow-md">
//               <CardHeader className="pb-4">
//                 <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
//                   <Star className="h-5 w-5" />
//                   Product Visibility
//                 </CardTitle>
//                 <CardDescription>Manage how this product is featured across your store</CardDescription>
//               </CardHeader>
//               <CardContent className="p-6 space-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Controller
//                     name="banner"
//                     control={control}
//                     render={({ field }) => (
//                       <ToggleCard
//                         isActive={field.value}
//                         onToggle={() => field.onChange(!field.value)}
//                         icon={<Megaphone className="h-5 w-5" />}
//                         title="Banner Product"
//                         description="Feature this product in banner sections"
//                       />
//                     )}
//                   />

//                   <Controller
//                     name="featured"
//                     control={control}
//                     render={({ field }) => (
//                       <ToggleCard
//                         isActive={field.value}
//                         onToggle={() => field.onChange(!field.value)}
//                         icon={<Star className="h-5 w-5" />}
//                         title="Featured Product"
//                         description="Highlight this product in featured sections"
//                       />
//                     )}
//                   />
//                 </div>

//                 <div className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
//                   <p>• <strong>Banner Product:</strong> Will be displayed in prominent banner areas</p>
//                   <p>• <strong>Featured Product:</strong> Will be highlighted in featured product sections</p>
//                   {/* <p>• <strong>On Sale:</strong> Will be shown with discount pricing and sale badges</p> */}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="space-y-8">
//             <Card className="border-accent/20 border-2 shadow-md">
//               <CardHeader className="pb-4">
//                 <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
//                   <Warehouse className="h-5 w-5" />
//                   Product Specifications
//                 </CardTitle>
//                 <CardDescription>Additional product details and attributes</CardDescription>
//               </CardHeader>
//               <CardContent className="p-6 space-y-5">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="color" className="text-sm font-medium">Color</Label>
//                     <div className="relative">
//                       <Palette className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="color"
//                         className="pl-10"
//                         {...register("color")}
//                         placeholder="e.g., Red, Blue, Black"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="itemSize" className="text-sm font-medium">Size</Label>
//                     <div className="relative">
//                       <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="itemSize"
//                         className="pl-10"
//                         {...register("itemSize")}
//                         placeholder="e.g., S, M, L, 10x10"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="weight" className="text-sm font-medium">Weight</Label>
//                     <div className="relative">
//                       <Box className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="weight"
//                         type="number"
//                         step="0.01"
//                         className="pl-10"
//                         {...register("weight", {
//                           min: { value: 0, message: "Weight must be positive" }
//                         })}
//                         placeholder="0.00"
//                       />
//                     </div>
//                     {errors.weight && (
//                       <p className="text-sm text-destructive mt-1">{errors.weight.message}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="weightUnit" className="text-sm font-medium">Weight Unit</Label>
//                     <Controller
//                       name="weightUnit"
//                       control={control}
//                       render={({ field }) => (
//                         <Select onValueChange={field.onChange} value={field.value}>
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select unit" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="g">g (Grams)</SelectItem>
//                             <SelectItem value="kg">kg (Kilograms)</SelectItem>
//                             <SelectItem value="lb">lb (Pounds)</SelectItem>
//                             <SelectItem value="oz">oz (Ounces)</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       )}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="model" className="text-sm font-medium">Model</Label>
//                   <div className="relative">
//                     <Warehouse className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="model"
//                       className="pl-10"
//                       {...register("model")}
//                       placeholder="Product model number"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="expiryDate" className="text-sm font-medium">Expiry Date</Label>
//                   <div className="relative">
//                     <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="expiryDate"
//                       type="date"
//                       className="pl-10"
//                       min={new Date().toISOString().split('T')[0]}
//                       {...register("expiryDate", {
//                         validate: (value) => {
//                           if (!value) return true;
//                           const selectedDate = new Date(value);
//                           const today = new Date();
//                           today.setHours(0, 0, 0, 0);
//                           return selectedDate >= today || "Expiry date must be today or in the future";
//                         }
//                       })}
//                     // {...register("expiryDate", !isEditMode ? {
//                     //   validate: (value) => {
//                     //     if (!value) return true;
//                     //     const selectedDate = new Date(value);
//                     //     const today = new Date();
//                     //     today.setHours(0, 0, 0, 0);
//                     //     return selectedDate >= today || "Expiry date must be today or in the future";
//                     //   }
//                     // } : {})}
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-accent/20 border-2 shadow-md">
//               <CardHeader className="pb-4">
//                 <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
//                   <Barcode className="h-5 w-5" />
//                   Codes & Inventory
//                 </CardTitle>
//                 <CardDescription>Product identification and stock information</CardDescription>
//               </CardHeader>
//               <CardContent className="p-6 space-y-5">
//                 <div className="grid grid-cols-2 gap-4">
//                   {isEditMode && (
//                     <div className="space-y-2">
//                       <Label htmlFor="productCode" className="flex items-center gap-1 text-sm font-medium">
//                         <span>Product Code</span>
//                       </Label>
//                       <div className="relative">
//                         <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                         <Input
//                           id="productCode"
//                           className="pl-10"
//                           {...register("productCode")}
//                           disabled
//                         />
//                       </div>
//                     </div>
//                   )}

//                   <div className="space-y-2">
//                     <Label htmlFor="stockQuantity" className="flex items-center gap-1 text-sm font-medium">
//                       <span>Stock Quantity</span>
//                       <span className="text-destructive">*</span>
//                     </Label>
//                     <div className="relative">
//                       <Box className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="stockQuantity"
//                         type="number"
//                         className="pl-10"
//                         {...register("stockQuantity", {
//                           required: "Stock quantity is required",
//                           min: { value: 0, message: "Stock quantity must be non-negative" },
//                           valueAsNumber: true
//                         })}
//                       />
//                     </div>
//                     {errors.stockQuantity && (
//                       <p className="text-sm text-destructive mt-1">{errors.stockQuantity.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="unitQuantity" className="text-sm font-medium">Unit</Label>
//                     <Controller
//                       name="unitQuantity"
//                       control={control}
//                       render={({ field }) => (
//                         <Select onValueChange={field.onChange} value={field.value}>
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select unit" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="Carton">Carton</SelectItem>
//                             <SelectItem value="Piece">Piece</SelectItem>
//                             <SelectItem value="Bag">Bag</SelectItem>
//                             <SelectItem value="Bottle">Bottle</SelectItem>
//                             <SelectItem value="Pack">Pack</SelectItem>
//                             <SelectItem value="Crate">Crate</SelectItem>
//                             <SelectItem value="Box">Box</SelectItem>
//                             <SelectItem value="Sachet">Sachet</SelectItem>
//                             <SelectItem value="Pouch">Pouch</SelectItem>
//                             <SelectItem value="Jar">Jar</SelectItem>
//                             <SelectItem value="Pet bottle">Pet bottle</SelectItem>
//                             <SelectItem value="Spout pouch">Spout pouch</SelectItem>
//                             <SelectItem value="Plastic bottle">Plastic bottle</SelectItem>
//                             <SelectItem value="Dozen">Dozen</SelectItem>
//                             <SelectItem value="Pair">Pair</SelectItem>
//                             <SelectItem value="Set">Set</SelectItem>
//                             <SelectItem value="Roll">Roll</SelectItem>
//                             <SelectItem value="Tin">Tin</SelectItem>
//                             <SelectItem value="Can">Can</SelectItem>
//                             <SelectItem value="Tub">Tub</SelectItem>
//                             <SelectItem value="Sack">Sack</SelectItem>
//                             <SelectItem value="Pallet">Pallet</SelectItem>
//                             <SelectItem value="Liter">Liter</SelectItem>
//                             <SelectItem value="ml">ml (Milliliters)</SelectItem>
//                             <SelectItem value="g">g (Grams)</SelectItem>
//                             <SelectItem value="kg">kg (Kilograms)</SelectItem>
//                             <SelectItem value="lb">lb (Pounds)</SelectItem>
//                             <SelectItem value="oz">oz (Ounces)</SelectItem>
//                             <SelectItem value="cm">cm (Centimeters)</SelectItem>
//                             <SelectItem value="m">m (Meters)</SelectItem>
//                             <SelectItem value="in">in (Inches)</SelectItem>
//                             <SelectItem value="ft">ft (Feet)</SelectItem>
//                             <SelectItem value="sqft">sq ft (Square Feet)</SelectItem>
//                             <SelectItem value="sqm">sq m (Square Meters)</SelectItem>
//                             <SelectItem value="Unit">Unit</SelectItem>
//                             <SelectItem value="Each">Each</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       )}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="barCode" className="text-sm font-medium">Bar Code</Label>
//                     <div className="relative">
//                       <Barcode className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="barCode"
//                         className="pl-10"
//                         {...register("barCode")}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-accent/20 border-2 shadow-md">
//               <CardHeader className="pb-4">
//                 <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
//                   <ImageIcon className="h-5 w-5" />
//                   Product Image
//                 </CardTitle>
//                 <CardDescription>Upload a product image</CardDescription>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <div className="space-y-4">
//                   {(fileUrl || watchedImageURL) && (
//                     <div className="flex flex-col items-center space-y-3">
//                       <Label className="text-sm font-medium">Image Preview</Label>
//                       <div className="border-2 border-dashed border-accent/30 rounded-lg p-4 w-full max-w-xs">
//                         <img
//                           src={fileUrl || watchedImageURL}
//                           alt="No Image Uploaded"
//                           className="w-full h-48 object-contain rounded-md"
//                         />
//                       </div>
//                       <p className="text-xs text-muted-foreground text-center">
//                         Preview of your product image
//                       </p>
//                     </div>
//                   )}

//                   <FileUpload
//                     onFileSelect={handleFileChange}
//                     currentFileUrl={watchedImageURL}
//                     accept="image/*"
//                     label="Product Image"
//                   />

//                   <div className="text-xs text-muted-foreground">
//                     <p>• Supported formats: JPG, PNG, WebP</p>
//                     <p>• Maximum file size: 5MB</p>
//                     <p>• Recommended aspect ratio: 1:1 (square)</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         <div className="flex justify-end gap-4 pt-8 mt-8 border-t border-accent/20">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => router.back()}
//             className="flex items-center gap-2"
//           >
//             <X className="h-4 w-4" />
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             className="bg-accent hover:bg-accent/90 text-white flex items-center gap-2 px-6 py-2"
//             disabled={isPending}
//           >
//             <Save className="h-4 w-4" />
//             {isPending ? 'Processing...' : (isEditMode ? "Update Product" : "Create Product")}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateProductPage;


"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useFileUpload } from "@/app/hooks/useUpload";
import { useProductMutation } from "@/components/Operations/inventories/shared-hooks/useProductMutation";
import { useCategories } from "@/app/hooks/useCategories";
import useOperations from "@/store/operationsStore";
import { fileUrlFormatted } from "@/utils/helperfns";
import { useQuery } from "@tanstack/react-query";
import axiosOperations from "@/utils/fetch-function-op-auth";
import { toast } from "sonner";
import Image from "next/image";
import { usePermission } from "@/hooks/usePermission";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { X } from "lucide-react";
import { BannerIcon, CameraIcon, FeaturedIcon, SaleIcon, VatIcon } from "@/components/icons/icons";
import { DatePicker } from "@/components/ui/date-picker";
import { format, parse } from "date-fns";

interface ProductFormData {
  productId: string;
  productName: string;
  productDescription: string;
  productCategory: string;
  productCode: string;
  productPrice: string;
  stockQuantity: number;
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
  weight: string;
  weightUnit: string;
}

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

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(mode === 'edit');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProductCategory, setEditingProductCategory] = useState<string | null>(null);
  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<ProductFormData>();
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  const isFormInitializedRef = useRef(false);
  const isSelectReadyRef = useRef(false);
  const initialDataLoadedRef = useRef(false);

  const { mutate: saveProduct, isPending } = useProductMutation(isEditMode);
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { operations } = useOperations();
  const { fileUrl, handleFileChange, fileInputRef, previewUrl, setPreviewUrl, setFileUrl } = useFileUpload();

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
    queryFn: () => axiosOperations.request({
      url: '/products/getById',
      method: 'GET',
      params: { id: editingProductId }
    }),
    enabled: !!editingProductId && isEditMode,
    staleTime: 0,
    refetchOnMount: true,
  });

  const parseExpiryDateForPicker = (dateString: string): string => {
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

  useEffect(() => {
    if (!isEditMode && !isFormInitializedRef.current) {
      reset({
        productId: "", productName: "", productDescription: "", productCategory: "",
        productCode: "", productPrice: "", stockQuantity: 0, unitQuantity: "",
        imageURL: "", costPrice: "", storeId: operations?.storeCode || "",
        barCode: "", brand: "", ccy: "NGN", color: "", itemSize: "", model: "",
        expiryDate: "", banner: false, featured: false, onSale: false,
        oldPrice: "", discount: 0, vatEligible: false, weight: "", weightUnit: ""
      });
      isFormInitializedRef.current = true;
      isSelectReadyRef.current = true;
      setIsFormLoading(false);
    }
  }, [isEditMode, reset, operations]);

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
        storeId: operations?.storeCode || "",
        barCode: product?.barCode || "",
        brand: product?.brand || "",
        ccy: product?.ccy || 'NGN',
        color: product?.color || "",
        itemSize: product?.itemSize || "",
        model: product?.model || "",
        expiryDate: parseExpiryDateForPicker(product?.expiryDate || ""),
        banner: product?.banner || false,
        featured: product?.featured || false,
        onSale: product?.onSale || false,
        oldPrice: product?.oldPrice?.toString() || "",
        discount: product?.discount || 0,
        vatEligible: product?.vat > 0 || false,
        weight: product?.weight?.toString() || "",
        weightUnit: product?.weightUnit || ""
      };
      reset(productObj);
      initialDataLoadedRef.current = true;
      isFormInitializedRef.current = true;
      isSelectReadyRef.current = true;
      setIsFormLoading(false);
    }
  }, [isEditMode, productData, categories, isLoadingCategories, reset, operations]);

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
        storeId: operations?.storeCode,
        barCode: values?.barCode,
        brand: values?.brand,
        ccy: values?.ccy || 'NGN',
        color: values?.color || null,
        itemSize: values?.itemSize || null,
        model: values?.model || null,
        expiryDate: values?.expiryDate || null,
        banner: values?.banner || false,
        featured: values?.featured || false,
        onSale: values?.onSale || false,
        discount: values?.onSale ? values?.discount : 0,
        vatRate: values?.vatEligible ? 7.5 : 0,
        weight: values.weight ? parseFloat(values.weight) : null,
        weightUnit: values.weightUnit || null
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
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-medium-gray">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl">
        <div className="mb-4">
          <Button variant="link" onClick={() => router.push('/operations/inventories')}>
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

                <div className="col-span-2">
                  <FormField label="Description" required>
                    <Textarea {...register("productDescription", { required: "Product description is required" })} placeholder="Enter product description" rows={3} />
                    {errors.productDescription && <p className="text-xs text-red-500 mt-1">{errors.productDescription.message}</p>}
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
                  <DatePicker
                    value={watch("expiryDate")}
                    onChange={(dateString) => setValue("expiryDate", dateString)}
                    placeholder="dd/mm/yyyy"
                  />
                </FormField>
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
                <FormField label="Stock Quantity" required>
                  <Input
                    type="number"
                    {...register("stockQuantity", {
                      required: "Stock quantity is required",
                      min: { value: 0, message: "Stock quantity must be non-negative" },
                      valueAsNumber: true
                    })}
                  />
                  {errors.stockQuantity && <p className="text-xs text-red-500 mt-1">{errors.stockQuantity.message}</p>}
                </FormField>
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
                          <SelectItem value="Bottle">Bottle</SelectItem>
                          <SelectItem value="Pack">Pack</SelectItem>
                          <SelectItem value="Crate">Crate</SelectItem>
                          <SelectItem value="Box">Box</SelectItem>
                          <SelectItem value="Dozen">Dozen</SelectItem>
                          <SelectItem value="Pair">Pair</SelectItem>
                          <SelectItem value="Set">Set</SelectItem>
                          <SelectItem value="Liter">Liter</SelectItem>
                          <SelectItem value="ml">ml (Milliliters)</SelectItem>
                          <SelectItem value="g">g (Grams)</SelectItem>
                          <SelectItem value="kg">kg (Kilograms)</SelectItem>
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
                      {previewUrl && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-gray-200">
                            <Image src={previewUrl} alt="Preview" width={64} height={64} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 text-sm text-medium-gray">Image preview</div>
                          <Button type="button" variant="ghost" size="sm"
                            onClick={() => { setPreviewUrl(''); setFileUrl(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="hover:text-red-500">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="border-2 border-dashed border-faded-accent rounded-lg p-6 text-center hover:border-orange-300 transition-colors">
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="photo-upload" />
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
              <Button type="submit" disabled={isPending}>
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