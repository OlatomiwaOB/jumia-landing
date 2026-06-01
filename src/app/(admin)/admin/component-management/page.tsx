"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { StoreCombobox } from "@/components/shared/StoreCombobox";
import { useFileUpload } from "@/app/hooks/useUpload";
import { usePermission } from "@/hooks/usePermissionBusiness";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import useUser from "@/store/userStore";
import axiosInstance from "@/utils/fetch-function";
import { ImageUploadField } from "@/components/Admin/component-management/ImageUploadField";

const componentFormSchema = z.object({
  componentType: z.enum(["BANNER", "CONTENT"]),
  storeCode: z.string().min(1, "Store is required"),
  title: z.string().min(1, "Title is required"),
  detail: z.string().min(1, "Detail is required"),
  link: z.string().optional(),
  image1: z.string().optional(),
  image2: z.string().optional(),
});

type FormValues = z.infer<typeof componentFormSchema>;

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

export default function ComponentManagerPage() {
  usePageMetadata("Component Management", "Create or manage store components.");
  const { usePermissionGuard } = usePermission();
  usePermissionGuard("MANAGE_INVENTORY", {
    redirectToNotPermitted: true,
    toastMessage: "You don't have permission to manage components",
  });

  const router = useRouter();
  const { user } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(componentFormSchema),
    defaultValues: {
      componentType: undefined,
      storeCode: "",
      title: "",
      detail: "",
      link: "",
      image1: "",
      image2: "",
    },
  });

  const upload1 = useFileUpload();
  const upload2 = useFileUpload();

  const { control, handleSubmit, setValue, formState: { errors } } = form;

  useEffect(() => {
    if (upload1.fileUrl) {
      setValue("image1", upload1.fileUrl);
    }
  }, [upload1.fileUrl, setValue]);

  useEffect(() => {
    if (upload2.fileUrl) {
      setValue("image2", upload2.fileUrl);
    }
  }, [upload2.fileUrl, setValue]);

  const onSubmit = (data: FormValues) => {
    const payload = {
      componentType: data.componentType,
      storeCode: data.storeCode,
      title: data.title,
      detail: data.detail,
      link: data.link || "",
      image1: upload1.fileUrl || data.image1 || "",
      image2: upload2.fileUrl || data.image2 || "",
    };
    console.log("Component payload:", payload);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl">
        <div className="mb-4">
          <Button variant="link" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>

        <div className="container mx-auto px-20 py-6">
          <div className="mb-6">
            <h1 className="text-md lg:text-lg font-medium text-dark-gray">
              Component Manager
            </h1>
            <p className="text-xs lg:text-sm font-normal text-medium-gray">
              Create or update store banner/content components
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white px-6 py-4 rounded-2xl">
              <FormSection title="Component Details" subtitle="Basic component information.">
                <FormField label="Component Type" required>
                  <Controller
                    name="componentType"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select component type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BANNER">Banner</SelectItem>
                            <SelectItem value="CONTENT">Content</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.componentType && (
                          <p className="text-xs text-red-500 mt-1">{errors.componentType.message}</p>
                        )}
                      </>
                    )}
                  />
                </FormField>

                <FormField label="Store Code" required>
                  <Controller
                    name="storeCode"
                    control={control}
                    render={({ field }) => (
                      <>
                        <StoreCombobox
                          value={field.value}
                          onChange={field.onChange}
                          axiosInstance={axiosInstance}
                          merchantCode={user?.merchantCode}
                          error={errors.storeCode?.message}
                        />
                      </>
                    )}
                  />
                </FormField>

                <FormField label="Title" required>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input placeholder="Enter component title" {...field} />
                        {errors.title && (
                          <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                        )}
                      </>
                    )}
                  />
                </FormField>

                <FormField label="Link">
                  <Controller
                    name="link"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="https://example.com" {...field} />
                    )}
                  />
                </FormField>

                <div className="col-span-2">
                  <FormField label="Detail" required>
                    <Controller
                      name="detail"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Textarea
                            placeholder="Enter component detail description"
                            rows={4}
                            {...field}
                          />
                          {errors.detail && (
                            <p className="text-xs text-red-500 mt-1">{errors.detail.message}</p>
                          )}
                        </>
                      )}
                    />
                  </FormField>
                </div>
              </FormSection>

              <FormSection title="Images" subtitle="Upload component images.">
                <div className="col-span-2 sm:grid sm:grid-cols-2 sm:gap-5 space-y-5 sm:space-y-0">
                  <ImageUploadField
                    label="Image 1"
                    previewUrl={upload1.previewUrl}
                    fileInputRef={upload1.fileInputRef}
                    isUploading={upload1.isUploadingFile}
                    onFileChange={upload1.handleFileChange}
                    onClear={() => {
                      upload1.setPreviewUrl("");
                      upload1.setFileUrl("");
                      if (upload1.fileInputRef.current) {
                        upload1.fileInputRef.current.value = "";
                      }
                    }}
                  />
                  <ImageUploadField
                    label="Image 2"
                    previewUrl={upload2.previewUrl}
                    fileInputRef={upload2.fileInputRef}
                    isUploading={upload2.isUploadingFile}
                    onFileChange={upload2.handleFileChange}
                    onClear={() => {
                      upload2.setPreviewUrl("");
                      upload2.setFileUrl("");
                      if (upload2.fileInputRef.current) {
                        upload2.fileInputRef.current.value = "";
                      }
                    }}
                  />
                </div>
              </FormSection>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={upload1.isUploadingFile || upload2.isUploadingFile}>
                {(upload1.isUploadingFile || upload2.isUploadingFile) ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</>
                ) : (
                  "Create Component"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
