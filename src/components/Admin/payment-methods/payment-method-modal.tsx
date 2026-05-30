import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import { PaymentMethod } from "@/types";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useFileUpload } from "@/app/hooks/useUpload";
import useUser from "@/store/userStore";
import { fileUrlFormatted } from "@/utils/helperfns";
import { StoreCombobox } from "@/components/shared/StoreCombobox";
import axiosInstance from "@/utils/fetch-function";

const paymentMethodSchema = z.object({
    paymentType: z.string().min(1, "Payment type is required"),
    serviceProvider: z.string().min(1, "Service provider is required"),
    code: z.string().min(1, "Code is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    country: z.string().min(1, "Country is required"),
    status: z.string().min(1, "Status is required"),
    fee: z.string().min(1, "Fee is required"),
    capLimit: z.string().min(1, "Cap is required"),
    // vat: z.string().nullable(),
    feeType: z.enum(["FLAT", "PERCENT"]),
    discount: z.string().nullable(),
    logo: z.string().url('Must not be empty'),
    isRecommended: z.boolean(),
    recommendedTitle: z.string().nullable(),
    subTitle: z.string().min(1, "Subtitle is required"),
    features: z.array(z.string()),
    storeCode: z.string().min(1, "Store is required"),
});

type FormValues = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodModalProps {
    open: boolean;
    onClose: () => void;
    editData?: PaymentMethod | null;
    saveMutation?: UseMutationResult<AxiosResponse<any, any>, Error, any, unknown>
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
    open,
    onClose,
    editData,
    saveMutation
}) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            paymentType: "",
            serviceProvider: "",
            code: "",
            name: "",
            description: "",
            country: "ALL",
            status: "ACTIVE",
            fee: "0",
            capLimit: '0',
            // vat: null,
            feeType: "FLAT",
            discount: null,

            logo: "",
            isRecommended: false,
            recommendedTitle: null,
            subTitle: "",
            features: [],
            storeCode: "",
        },
    });

    const [featureInput, setFeatureInput] = React.useState("");
    const { previewUrl, handleFileChange, fileUrl, isUploadingFile, setPreviewUrl, setFileUrl } = useFileUpload()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const features = form.watch("features");
    const logoValue = form.watch("logo");
    const { user } = useUser()


    useEffect(() => {
        if (editData) {
            form.reset({
                ...editData,
                storeCode: editData.storeCode || "",
            });
            setPreviewUrl(editData.logo);
        } else {
            form.reset({
                paymentType: "",
                serviceProvider: "",
                code: "",
                name: "",
                description: "",
                country: "ALL",
                status: "ACTIVE",
                fee: "0",
                capLimit: "0",
                // vat: null,
                feeType: "FLAT",
                discount: null,
                logo: "",
                isRecommended: false,
                recommendedTitle: null,
                subTitle: "",
                features: [],
                storeCode: "",
            });
            setPreviewUrl("");
        }
    }, [editData, form]);

    useEffect(() => {
        if (logoValue && logoValue.startsWith("http")) {
            setPreviewUrl(logoValue);
        }
    }, [logoValue]);

    useEffect(() => {
        if (fileUrl) {
            // const formattedUrl = fileUrlFormatted(fileUrl,user?.entityCode)
            form.setValue("logo", fileUrl)
        }
    }, [fileUrl])

    const handleSubmit = (data: FormValues) => {
        const payload = {
            paymentType: data?.paymentType,
            serviceProvider: data?.serviceProvider,
            code: data?.code,
            name: data?.name,
            description: data?.description,
            country: data?.country,
            status: data?.status,
            fee: data?.fee,
            capLimit: data?.capLimit,
            // vat: data?.vat,
            feeType: data?.feeType,
            discount: data?.discount,
            entityCode: user?.entityCode,
            logo: fileUrl ? fileUrl : logoValue!,
            isRecommended: data?.isRecommended,
            recommendedTitle: data?.recommendedTitle,
            subTitle: data?.subTitle,
            features: data?.features
        }

        saveMutation?.mutate({ payload, storeCode: data?.storeCode }, {
            onSuccess: (data) => {
                if (data?.data?.code === '000') {
                    setFileUrl('')
                    form?.reset()
                    return
                }
            }
        })
    };

    // console.log(fileUrl);



    const addFeature = () => {
        if (featureInput.trim()) {
            form.setValue("features", [...features, featureInput.trim()]);
            setFeatureInput("");
        }
    };

    const removeFeature = (index: number) => {
        form.setValue(
            "features",
            features.filter((_, i) => i !== index)
        );
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-h-[90vh] min-w-[800px] overflow-y-auto"
                style={{
                    scrollbarWidth: 'none',
                    scrollbarColor: 'transparent',
                }}
            >
                <DialogHeader className="flex flex-col items-center gap-4">
                    <DialogTitle className="text-2xl font-bold">
                        {editData ? "Edit Payment Method" : "Add Payment Method"}
                    </DialogTitle>
                    <DialogDescription>
                        {editData
                            ? "Update the payment method details below"
                            : "Fill in the details to add a new payment method"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Card Payment" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., CARD_PAYMENT" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="paymentType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Type</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="serviceProvider"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Service Provider</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., VISA_MASTERCARD" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fee</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 2.5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="feeType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fee Type</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select fee type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="FLAT">Flat</SelectItem>
                                                <SelectItem value="PERCENT">Percent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="capLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cap Limit</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 2000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">Active</SelectItem>
                                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., ALL or GB" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="storeCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Store</FormLabel>
                                        <StoreCombobox
                                            value={field.value}
                                            onChange={field.onChange}
                                            axiosInstance={axiosInstance}
                                            merchantCode={user?.merchantCode}
                                            error={form.formState.errors.storeCode?.message}
                                        />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the payment method"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subtitle</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Visa, Mastercard, Amex" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Logo</FormLabel>
                                    <div className="space-y-4">
                                        {/* Preview */}
                                        {previewUrl && (
                                            <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                                                <div className="w-16 h-16 rounded-lg bg-card flex items-center justify-center p-2 border border-border">
                                                    <img
                                                        src={previewUrl!}
                                                        alt="Logo preview"
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 text-sm text-muted-foreground">
                                                    Logo preview
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        form.setValue("logo", "");
                                                        setPreviewUrl("");
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = "";
                                                        }
                                                    }}
                                                    className="hover:text-destructive"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}

                                        {/* Upload Button */}
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex-1"
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload Image
                                            </Button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"

                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>

                                        {/* URL Input */}
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <ImageIcon className="h-4 w-4" />
                                            </div>
                                            <FormControl>
                                                <Input
                                                    placeholder="Or paste image URL"
                                                    {...field}
                                                    className="pl-10"
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <FormDescription>
                                        Upload an image file or provide a URL
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VAT (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 20"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}

                        <FormField
                            control={form.control}
                            name="isRecommended"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 shadow-soft">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Recommended</FormLabel>
                                        <FormDescription>
                                            Mark this payment method as recommended
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {form.watch("isRecommended") && (
                            <FormField
                                control={form.control}
                                name="recommendedTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recommended Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., AI Recommended"
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormItem>
                            <FormLabel>Features</FormLabel>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a feature"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                                />
                                <Button type="button" onClick={addFeature} size="icon" variant="secondary">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm"
                                    >
                                        {feature}
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </FormItem>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saveMutation?.isPending} className="bg-accent text-white">
                                {saveMutation?.isPending ? `Please wait` : (editData ? "Update" : "Create") + " Payment Method"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
export default PaymentMethodModal