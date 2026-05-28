'use client'
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import useUser from "@/store/userStore";
import { SearchSelect } from "@/components/ui/search-select";
import { BankAccountFormData } from "./accounts-management";

interface BankOption {
    code: string;
    name: string;
    description: string;
    otherInfo: string;
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

export const AddBankAccountForm = () => {
    const queryClient = useQueryClient();
    const { user } = useUser();
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifiedName, setVerifiedName] = useState<string | null>(null);
    const lastVerifiedRef = useRef<string>(''); // Track last verified account+bank combo
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<BankAccountFormData>({
        defaultValues: {
            country: "",
            currency: "",
            accountNo: "",
            finEntityCode: "",
            finEntityName: "",
            entityType: "",
            accountName: "",
            sortCode: "",
            iban: "",
            checksum: "",
        }
    });

    const watchedAccountNo = watch("accountNo");
    const watchedFinEntityCode = watch("finEntityCode");

    // Fetch banks list
    const { data: banksData, isLoading: isLoadingBanks } = useQuery({
        queryKey: ['banks-lookup'],
        queryFn: () => axiosInstance.request({
            url: '/lookupdata/banks',
            method: 'GET',
            params: {
                countryCode: 'NG',
                entityCode: user?.entityCode || 'FTD'
            }
        })
    });

    const banks: BankOption[] = banksData?.data?.list || [];

    const bankOptions = banks.map(bank => ({
        value: bank.name,
        label: bank.name
    }));

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: any) => axiosInstance?.request({
            url: `/bank/add-account`,
            method: 'POST',
            data: payload
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') {
                toast?.error(data?.data?.desc);
                return;
            }
            toast?.success(data?.data?.desc);
            reset();
            setVerifiedName(null);
            lastVerifiedRef.current = '';
            queryClient?.invalidateQueries({ queryKey: ['bank-accounts'] });
        },
        onError: () => {
            toast.error('Something went wrong!');
        }
    });

    const handleBankSelect = (bankName: string) => {
        const selectedBank = banks.find(b => b.name === bankName);
        if (selectedBank) {
            setValue("finEntityName", selectedBank.name, { shouldValidate: true });
            setValue("finEntityCode", selectedBank.code, { shouldValidate: true });
        }
        // Reset verification when bank changes
        setVerifiedName(null);
        lastVerifiedRef.current = '';
    };

    const handleVerifyAccount = async (accountNo: string, finEntityCode: string) => {
        // Prevent duplicate verification for same account+bank combo
        const verifyKey = `${accountNo}_${finEntityCode}`;
        if (lastVerifiedRef.current === verifyKey) return;
        if (!accountNo || !finEntityCode) return;
        if (accountNo.length < 10) return;
        if (isVerifying) return;

        setIsVerifying(true);
        setVerifiedName(null);

        try {
            const response = await axiosInstance.post('/transfer/accountLookUp', {
                finEntityCode: finEntityCode,
                finEntityType: "Bank",
                accountNumber: accountNo,
                accountType: "SAVINGS",
                countryCode: "NG",
                provider: "NIBSS",
                entityCode: user?.entityCode || 'FTD'
            });

            if (response?.data?.responseCode === '00' || response?.data?.responseCode === '000') {
                const apiName = response?.data?.name || '';
                setVerifiedName(apiName);
                setValue("accountName", apiName, { shouldValidate: true });
                lastVerifiedRef.current = verifyKey;
                toast.success('Account verified successfully');
            } else {
                toast.error(response?.data?.responseMessage || 'Account verification failed');
                setVerifiedName(null);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.responseMessage || 'Failed to verify account');
            setVerifiedName(null);
        } finally {
            setIsVerifying(false);
        }
    };

    // Auto-verify when account number reaches 10 digits (debounced)
    useEffect(() => {
        // Clear any existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Reset verification if account number changes and is less than 10 digits
        if (watchedAccountNo.length < 10) {
            setVerifiedName(null);
            lastVerifiedRef.current = '';
            return;
        }

        // Only trigger if we have both account number and bank code
        if (watchedAccountNo.length >= 10 && watchedFinEntityCode) {
            // Debounce: wait 800ms after user stops typing before verifying
            debounceTimerRef.current = setTimeout(() => {
                handleVerifyAccount(watchedAccountNo, watchedFinEntityCode);
            }, 800);
        }

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [watchedAccountNo, watchedFinEntityCode]);

    const onSubmit = (values: BankAccountFormData) => {
        const payload = {
            ownerType: "MERCHANT",
            country: 'NG',
            currency: 'NGN',
            accountNo: values?.accountNo,
            finEntityCode: values?.finEntityCode,
            finEntityName: values?.finEntityName,
            entityType: "Bank",
            accountName: values?.accountName,
            sortCode: "",
            iban: "",
            checksum: "",
            channel: "WEB"
        };
        mutate(payload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className='bg-white px-6 py-4 rounded-2xl'>
                <FormSection title="Financial Institution" subtitle="Bank or financial entity details.">
                    <FormField label="Bank Name" required>
                        <SearchSelect
                            options={bankOptions}
                            value={watch("finEntityName")}
                            onValueChange={handleBankSelect}
                            placeholder={isLoadingBanks ? "Loading banks..." : "Select bank"}
                            disabled={isLoadingBanks}
                            isLoading={isLoadingBanks}
                            loadingMessage="Loading banks..."
                            emptyMessage="No banks found"
                        />
                        {errors.finEntityName && <p className="text-xs text-red-500 mt-1">{errors.finEntityName.message}</p>}
                    </FormField>

                    {/* <FormField label="Bank Code">
                        <Input
                            {...register("finEntityCode")}
                            placeholder="Auto-populated"
                            disabled
                            className="bg-gray-50"
                        />
                    </FormField> */}
                </FormSection>

                <FormSection title="Bank Account Details" subtitle="Add a new bank account to your profile.">
                    <FormField label="Account Number" required>
                        <div className="relative">
                            <Input
                                {...register("accountNo", {
                                    required: "Account number is required",
                                    pattern: {
                                        value: /^\d{10,}$/,
                                        message: "Account number must be at least 10 digits"
                                    }
                                })}
                                placeholder="Enter account number"
                                className="pr-8"
                            />
                            {isVerifying && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-faded-accent" />
                            )}
                            {verifiedName && !isVerifying && (
                                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                            )}
                        </div>
                        {errors.accountNo && <p className="text-xs text-red-500 mt-1">{errors.accountNo.message}</p>}
                        {isVerifying && (
                            <p className="text-xs text-faded-accent">Verifying account details...</p>
                        )}
                        {verifiedName && !isVerifying && (
                            <p className="text-xs text-green-600 mt-1">✓ Account verified: {verifiedName}</p>
                        )}
                    </FormField>

                    <FormField label="Account Name" required>
                        <Input
                            {...register("accountName", { required: "Account name is required" })}
                            placeholder="Auto-populated from verification"
                            className={verifiedName ? "bg-gray-50" : ""}
                            readOnly={!!verifiedName}
                        />
                        {errors.accountName && <p className="text-xs text-red-500 mt-1">{errors.accountName.message}</p>}
                    </FormField>
                </FormSection>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button type="submit" disabled={isPending}>
                    {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : 'Add Bank Account'}
                </Button>
            </div>
        </form>
    );
};