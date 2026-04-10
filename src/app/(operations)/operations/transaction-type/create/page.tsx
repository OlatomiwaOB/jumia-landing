'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import useOperations from '@/store/operationsStore';
import useGetLookup from '@/app/hooks/useGetLookup';
import { randomNDigitNumber } from '@/utils/helperfns';
import { usePermission } from '@/hooks/usePermission';

interface TransactionTypeFormData {
    tranName: string;
    tranCode: string;
    // merchCategory: string;
    minLimit: number;
    maxLimit: number;
    dailyLimit: number;
    dailyFreq: number;
    chargeType: string;
    charge: number;
    capLimit: number;
    sharingType: string;
    agentCommission: number;
    platformCommission: number;
    networkCommission: number;
    aggregatorCommission: number;
    serviceFee: number;
}

const chargeTypeOptions = [
    { value: 'fixed', label: 'FIXED' },
    { value: 'percentage', label: 'PERCENTAGE' },
];

const sharingTypeOptions = [
    { value: 'flat', label: 'FLAT' },
    { value: 'percentage', label: 'PERCENTAGE' },
];

export default function CreateTransactionTypePage() {
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('MANAGE_TRANS_TYPE', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage transaction type"
    });

    const router = useRouter();
    const { operations } = useOperations();

    // const merchantCategoryOptions = useGetLookup("MERCHANT_GROUP");
    const transactionTypeOptions = useGetLookup("TRAN_CODE");

    const { register, handleSubmit, control, formState: { errors } } = useForm<TransactionTypeFormData>({
        defaultValues: {
            tranName: '',
            tranCode: '',
            // merchCategory: '',
            minLimit: 0,
            maxLimit: 0,
            dailyLimit: 0,
            dailyFreq: 0,
            chargeType: '',
            charge: 0,
            capLimit: 0,
            sharingType: '',
            agentCommission: 0,
            platformCommission: 0,
            networkCommission: 0,
            aggregatorCommission: 0,
            serviceFee: 0,
        },
    });

    const setUpRefNo = randomNDigitNumber(15);

    const { mutate: createTransactionType, isPending } = useMutation({
        mutationFn: (formData: any) =>
            axiosOperations.request({
                method: 'POST',
                url: '/transTypeSetup/create',
                data: formData,
            }),
        onSuccess: (response) => {
            if (response?.data?.code !== '000') {
                toast.error(response?.data?.desc || 'Operation failed');
                return;
            }
            toast.success('Transaction type created successfully');
            router.push('/operations/transaction-type');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Error creating transaction type');
        },
    });

    const onSubmit = (values: TransactionTypeFormData) => {
        const payload = {
            id: 0,
            tranName: values.tranName,
            chargeType: values.chargeType?.toUpperCase(),
            maxLimit: Number(values.maxLimit),
            minLimit: Number(values.minLimit),
            dailyLimit: Number(values.dailyLimit),
            capLimit: Number(values.capLimit),
            networkCommission: Number(values.networkCommission),
            platformCommission: Number(values.platformCommission),
            aggregatorCommission: Number(values.aggregatorCommission),
            agentCommission: Number(values.agentCommission),
            serviceFee: Number(values.serviceFee),
            charge: Number(values.charge),
            dailyFreq: Number(values.dailyFreq),
            sharingType: values.sharingType?.toUpperCase(),
            entityCode: operations?.entityCode,
            customerType: "MERCHANT",
            tranCode: values.tranCode,
            status: "ACTIVE",
            bankCommission: 0,
            groupCommission: 0,
            otherCharge: 0,
            tranChannel: "MOBILE",
            roleAllowed: "",
            // branchCode: values.merchCategory,
            tax: 0,
            setUpRefNo: `REF${setUpRefNo}`,
            FeeTiers: [{}],
        };

        createTransactionType(payload);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6 max-w-4xl">
                <div className='mb-4'>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </div>
                <div className="flex items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-accent-foreground mb-2">
                            Create Transaction Type
                        </h1>
                        <p className="text-accent-foreground/70">
                            Add a new transaction type configuration
                        </p>
                    </div>
                </div>

                <Card className="border-accent/20 shadow-sm">
                    <CardHeader className="border-b border-accent/10">
                        <CardTitle className="text-lg font-semibold text-accent-foreground">
                            Transaction Type Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* <div className="space-y-2">
                                    <Label htmlFor="merchCategory" className="text-accent-foreground">
                                        Merchant Category *
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="merchCategory"
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger id="merchCategory" className="border-accent/20">
                                                    <SelectValue placeholder="Select merchant category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {merchantCategoryOptions?.map((option: any) => (
                                                        <SelectItem key={option.id} value={option.id}>
                                                            {option.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div> */}

                                <div className="space-y-2">
                                    <Label htmlFor="tranCode" className="text-accent-foreground">
                                        Transaction Code *
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="tranCode"
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger id="tranCode" className="border-accent/20">
                                                    <SelectValue placeholder="Select transaction code" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {transactionTypeOptions?.map((option: any) => (
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
                                    <Label htmlFor="tranName" className="text-accent-foreground">
                                        Transaction Name *
                                    </Label>
                                    <Input
                                        id="tranName"
                                        {...register('tranName', { required: true })}
                                        placeholder="Enter transaction name"
                                        className="border-accent/20 focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="minLimit" className="text-accent-foreground">
                                        Minimum Limit (₦)
                                    </Label>
                                    <Input
                                        id="minLimit"
                                        type="number"
                                        {...register('minLimit')}
                                        placeholder="0.00"
                                        className="border-accent/20 focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maxLimit" className="text-accent-foreground">
                                        Maximum Limit (₦)
                                    </Label>
                                    <Input
                                        id="maxLimit"
                                        type="number"
                                        {...register('maxLimit')}
                                        placeholder="0.00"
                                        className="border-accent/20 focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dailyLimit" className="text-accent-foreground">
                                        Daily Limit (₦)
                                    </Label>
                                    <Input
                                        id="dailyLimit"
                                        type="number"
                                        {...register('dailyLimit')}
                                        placeholder="0.00"
                                        className="border-accent/20 focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dailyFreq" className="text-accent-foreground">
                                        Daily Frequency
                                    </Label>
                                    <Input
                                        id="dailyFreq"
                                        type="number"
                                        {...register('dailyFreq')}
                                        placeholder="0"
                                        className="border-accent/20 focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sharingType" className="text-accent-foreground">
                                        Sharing Type
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="sharingType"
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger id="sharingType" className="border-accent/20">
                                                    <SelectValue placeholder="Select sharing type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {sharingTypeOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="chargeType" className="text-accent-foreground">
                                        Charge Type *
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="chargeType"
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger id="chargeType" className="border-accent/20">
                                                    <SelectValue placeholder="Select charge type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {chargeTypeOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="charge" className="text-accent-foreground">
                                        Charge
                                    </Label>
                                    <Input
                                        id="charge"
                                        type="number"
                                        step="0.01"
                                        {...register('charge')}
                                        placeholder="0.00"
                                        className="border-accent/20 focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capLimit" className="text-accent-foreground">
                                        Cap Limit (₦)
                                    </Label>
                                    <Input
                                        id="capLimit"
                                        type="number"
                                        step="0.01"
                                        {...register('capLimit')}
                                        placeholder="0.00"
                                        className="border-accent/20 focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="agentCommission" className="text-accent-foreground">
                                        Agent Commission
                                    </Label>
                                    <Input
                                        id="agentCommission"
                                        type="number"
                                        step="0.01"
                                        {...register('agentCommission')}
                                        placeholder="0.00"
                                        className="border-accent/20 focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="platformCommission" className="text-accent-foreground">
                                        Platform Commission
                                    </Label>
                                    <Input
                                        id="platformCommission"
                                        type="number"
                                        step="0.01"
                                        {...register('platformCommission')}
                                        placeholder="0.00"
                                        className="border-accent/20 focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="networkCommission" className="text-accent-foreground">
                                        Network Commission
                                    </Label>
                                    <Input
                                        id="networkCommission"
                                        type="number"
                                        step="0.01"
                                        {...register('networkCommission')}
                                        placeholder="0.00"
                                        className="border-accent/20 focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="aggregatorCommission" className="text-accent-foreground">
                                        Aggregator Commission
                                    </Label>
                                    <Input
                                        id="aggregatorCommission"
                                        type="number"
                                        step="0.01"
                                        {...register('aggregatorCommission')}
                                        placeholder="0.00"
                                        className="border-accent/20 focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="serviceFee" className="text-accent-foreground">
                                        Service Fee
                                    </Label>
                                    <Input
                                        id="serviceFee"
                                        type="number"
                                        step="0.01"
                                        {...register('serviceFee')}
                                        placeholder="0.00"
                                        className="border-accent/20 focus:border-accent"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t border-accent/10">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-accent hover:bg-accent/90 text-white px-8"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Transaction Type'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}