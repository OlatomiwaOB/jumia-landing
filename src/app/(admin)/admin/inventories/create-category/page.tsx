"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Save,
    X,
    Tag,
    Hash,
    FileText,
    Layers,
    ImageIcon,
    BookOpen,
    FolderOpen,
    ArrowLeft
} from "lucide-react";
import { Category } from "@/components/Admin/inventories/categories-manager";
import FileUpload from "@/components/Admin/inventories/file-input";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/utils/fetch-function";
import { Controller, useForm } from "react-hook-form";
import { useFileUpload } from "@/app/hooks/useUpload";
import { fileUrlFormatted } from "@/utils/helperfns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useUser from "@/store/userStore";
import { getClientIdentifiers } from '@/config/client-config';

interface CategoryFormProps {
    category?: Category;
    mode?: 'create' | 'edit';
}

const storeCode = getClientIdentifiers().storeCode;

// export const sectorOptions = [
//   { label: 'Electronics', value: 'electronics' },
//   { label: 'Clothing & Fashion', value: 'clothing' },
//   { label: 'Food & Beverages', value: 'food' },
//   { label: 'Home & Garden', value: 'home' },
//   { label: 'Health & Beauty', value: 'health' },
//   { label: 'Sports & Recreation', value: 'sports' },
//   { label: 'Books & Media', value: 'books' },
//   { label: 'Automotive', value: 'automotive' },
//   { label: "Cosmetics", value: 'cosmetics' },
//   { label: 'Other', value: 'other' }
// ];

export const sectorOptions = [
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Clothing & Fashion', value: 'Clothing & Fashion' },
    { label: 'Food & Beverages', value: 'Food & Beverages' },
    { label: 'Home & Garden', value: 'Home & Garden' },
    { label: 'Health & Beauty', value: 'Health & Beauty' },
    { label: 'Sports & Recreation', value: 'Sports & Recreation' },
    { label: 'Books & Media', value: 'Books & Media' },
    { label: 'Automotive', value: 'Automotive' },
    { label: "Cosmetics", value: 'Cosmetics' },
    { label: 'Other', value: 'Other' }
];

const topCategoryOptions = [
    { label: 'Primary', value: 'primary' },
    { label: 'Secondary', value: 'secondary' },
    { label: 'Tertiary', value: 'tertiary' }
];

const CreateCategoryPage = ({
    category,
    mode = category ? 'edit' : 'create'
}: CategoryFormProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();
    const [isEditMode, setIsEditMode] = useState(mode === 'edit');
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingCategoryCode, setEditingCategoryCode] = useState<string | null>(null);
    const { register, watch, handleSubmit, control, reset, formState: { errors } } = useForm<Category>({
        defaultValues: {
            id: 0,
            code: "",
            name: "",
            description: "",
            sector: "",
            logo: "",
            tags: "",
            topCategory: "",
            // qty: ""
        }
    });

    const queryClient = useQueryClient();
    const { fileUrl, handleFileChange, isUploadingFile } = useFileUpload();

    const watchedImageURL = watch("logo");

    useEffect(() => {
        const editParam = searchParams.get('edit');
        const idParam = searchParams.get('id');

        if (editParam === 'true' && idParam) {
            setIsEditMode(true);
            setEditingCategoryId(idParam);
        }
    }, [searchParams]);

    const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
        queryKey: ['category-detail', editingCategoryId],
        queryFn: () => axiosInstance.request({
            url: `/products/category/${editingCategoryId}`,
            method: 'GET',
        }),
        enabled: !!editingCategoryId && isEditMode,
    });

    useEffect(() => {
        if (categoryData?.data && isEditMode) {
            const categories = categoryData.data.categories;
            const category = categories && categories.length > 0 ? categories[0] : null;

            console.log('Category data received:', categories);
            console.log('First category:', category);

            if (category) {
                const categoryObj = {
                    id: category?.id || 0,
                    code: category?.code || "",
                    name: category?.name || "",
                    description: category?.description || "",
                    sector: category?.sector || "",
                    logo: category?.logo || "",
                    tags: category?.tags || "",
                    topCategory: category?.topCategory || "",
                    // qty: category?.qty || ""
                };

                console.log('Form data to be set:', categoryObj); // Debug log
                reset(categoryObj);
            } else {
                console.warn('No category found in response');
                toast.error('Category not found');
            }
        } else if (!isEditMode) {
            reset({
                id: 0,
                code: "",
                name: "",
                description: "",
                sector: "",
                logo: "",
                tags: "",
                topCategory: "",
                // qty: ""
            });
        }
    }, [categoryData, isEditMode, reset]);

    const { mutate: saveCategory, isPending } = useMutation({
        mutationFn: (data: any) => {
            const endpoint = "/products/save-product-category";
            return axiosInstance.request({
                method: "POST",
                url: endpoint,
                data: data,
            });
        },
        onSuccess: (data) => {
            if (data?.data?.code !== "000") {
                toast.error(`Error ${isEditMode ? 'updating' : 'saving'} category`);
            } else {
                toast.success(`Category ${isEditMode ? 'updated' : 'created'} successfully`);

                queryClient.invalidateQueries({ queryKey: ['categories'] });

                router.push('/admin/inventories');

                if (!isEditMode) {
                    reset();
                }
            }
        },
        onError: (error: any) => {
            console.log(error);
            const action = isEditMode ? 'updating' : 'creating';

            if (error?.response?.data) {
                if (error.response.status === 400) {
                    toast.error('Bad request: ' + (error.response.data.message || 'Unknown error'));
                } else if (error.response.status === 422) {
                    toast.error(`Error ${action} category`);
                } else if (error.response.status === 500) {
                    toast.error(`Error ${action} category`);
                }
            } else {
                toast.error(`Error ${action} category`);
            }
        },
    });

    const onSubmitForm = async (values: Category) => {
        try {
            const payload = {
                id: isEditMode ? (editingCategoryId || category?.id) : 0,
                code: values?.code,
                name: values?.name,
                logo: fileUrl ? fileUrlFormatted(fileUrl) : (fileUrlFormatted(values?.logo) || ""),
                tags: values?.tags,
                description: values?.description,
                topCategory: values?.topCategory,
                sector: values?.sector,
                // qty: values?.qty,
                entityCode: user?.entityCode,
                storeCode
            };

            console.log('Submitting category payload:', payload); // Debug log
            await saveCategory(payload);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} category`);
        }
    };

    if (isLoadingCategory) {
        return (
            <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Loading category data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Inventories
                </Button>
            </div>

            <div className="flex items-center justify-center mb-8">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                        <FolderOpen className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold text-accent-foreground">
                        {isEditMode ? 'Edit Category' : 'Create New Category'}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {isEditMode ? 'Update category information' : 'Add a new category to organize your products'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Basic Information */}
                    <div className="space-y-8">
                        <Card className="border-accent/20 border-2 shadow-md">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
                                    <Tag className="h-5 w-5" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>Category identity and details</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-1 text-sm font-medium">
                                        <span>Category Name</span>
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            className="pl-10"
                                            {...register("name", { required: "Category name is required" })}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code" className="flex items-center gap-1 text-sm font-medium">
                                        <span>Category Code</span>
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="code"
                                            className="pl-10"
                                            {...register("code", { required: "Category code is required" })}
                                        />
                                    </div>
                                    {errors.code && (
                                        <p className="text-sm text-destructive mt-1">{errors.code.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Textarea
                                            id="description"
                                            className="pl-10 min-h-[100px]"
                                            {...register("description")}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-accent/20 border-2 shadow-md">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
                                    <Layers className="h-5 w-5" />
                                    Classification
                                </CardTitle>
                                <CardDescription>Category organization and metadata</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sector" className="text-sm font-medium">Sector</Label>
                                        <Controller
                                            name="sector"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select sector" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {sectorOptions?.map((sector, index: number) => (
                                                            <SelectItem key={index} value={sector.value}>
                                                                {sector.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="topCategory" className="text-sm font-medium">Category Level</Label>
                                        <Controller
                                            name="topCategory"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {topCategoryOptions?.map((category, index: number) => (
                                                            <SelectItem key={index} value={category.value}>
                                                                {category.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* <div className="space-y-2">
                  <Label htmlFor="qty" className="text-sm font-medium">Quantity/Unit</Label>
                  <Input
                    id="qty"
                    {...register("qty")}
                  />
                </div> */}

                                <div className="space-y-2">
                                    <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="tags"
                                            className="pl-10"
                                            {...register("tags")}
                                            placeholder="Separate tags with commas"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Classification & Logo */}
                    <div className="space-y-8">
                        {/* Category Logo Card */}
                        <Card className="border-accent/20 border-2 shadow-md">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
                                    <ImageIcon className="h-5 w-5" />
                                    Category Logo
                                </CardTitle>
                                <CardDescription>Upload a category logo image</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* Image Preview */}
                                    {(fileUrl || watchedImageURL) && (
                                        <div className="flex flex-col items-center space-y-3">
                                            <Label className="text-sm font-medium">Logo Preview</Label>
                                            <div className="border-2 border-dashed border-accent/30 rounded-lg p-4 w-full max-w-xs">
                                                <img
                                                    src={fileUrl || watchedImageURL}
                                                    alt="Category logo preview"
                                                    className="w-full h-48 object-contain rounded-md"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground text-center">
                                                Preview of your category logo
                                            </p>
                                        </div>
                                    )}

                                    <FileUpload
                                        onFileSelect={handleFileChange}
                                        currentFileUrl={watchedImageURL}
                                        accept="image/*"
                                        label="Upload Category Logo"
                                        isUploading={isUploadingFile}
                                    />

                                    <div className="text-xs text-muted-foreground">
                                        <p>• Supported formats: JPG, PNG, WebP</p>
                                        <p>• Maximum file size: 5MB</p>
                                        <p>• Recommended aspect ratio: 1:1 (square)</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-8 mt-8 border-t border-accent/20">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-accent hover:bg-accent/90 text-white flex items-center gap-2 px-6 py-2"
                        disabled={isPending || isUploadingFile}
                    >
                        <Save className="h-4 w-4" />
                        {isPending ? 'Processing...' : (isEditMode ? "Update Category" : "Create Category")}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateCategoryPage;