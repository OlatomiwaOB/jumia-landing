import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BankAccountFormData } from "./bank-account-management";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosCustomer from "@/utils/fetch-function-customer";
import { toast } from "sonner";


const bankAccountSchema = z.object({
//   ownerType: z.string().min(1, "Owner type is required"),
  country: z.string().min(1, "Country is required"),
  currency: z.string().min(1, "Currency is required"),
  accountNo: z.string().min(1, "Account number is required"),
  finEntityCode: z.string().min(1, "Financial entity code is required"),
  finEntityName: z.string().min(1, "Financial entity name is required"),
  entityType: z.string().min(1, "Entity type is required"),
  accountName: z.string().min(1, "Account name is required"),
  sortCode: z.string().optional(),
  iban: z.string().optional(),
  checksum: z.string().optional(),
//   channel: z.string().min(1, "Channel is required"),
});


export const AddBankAccountForm = () => {
    const queryClient = useQueryClient()
  const form = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
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
    },
  });
  
  const {mutate,isPending} = useMutation({
    mutationFn: (data: any)=>axiosCustomer?.request({
        url: `/bank/add-account`,
        method: 'POST',
        data
    }),
    onSuccess: (data)=>{
        if (data?.data?.code!=='000') {
            toast?.error(data?.data?.desc)
            return
        }
        toast?.success(data?.data?.desc)
        form.reset()
        queryClient?.invalidateQueries({
            queryKey: ['bank-accounts']
        })
        return
    },
    onError: (error)=>{
        toast.error('Something went wrong!')
        return
    }
  })

  const onSubmit = (value: BankAccountFormData)=>{
    const payload = {
            ownerType: "USER",
            country: value?.country,
            currency: value?.currency,
            accountNo: value?.accountNo,
            finEntityCode: value?.finEntityCode,
            finEntityName: value?.finEntityName,
            entityType: value?.entityType,
            accountName: value?.accountName,
            sortCode: value?.sortCode,
            iban: value?.iban,
            checksum: value?.checksum,
            channel: "WEB"
    }

    mutate(payload)
     
  }



  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form?.handleSubmit(onSubmit)}>
        {/* <FormField
          control={form.control}
          name="ownerType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select owner type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., US, GB" {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., USD, GBP" {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John's Savings" {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter account number" {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="finEntityCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Financial Entity Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter code" {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="finEntityName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Financial Entity Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., ABC Bank" {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="entityType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entity Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="BANK">Bank</SelectItem>
                  <SelectItem value="CREDIT_UNION">Credit Union</SelectItem>
                  <SelectItem value="BUILDING_SOCIETY">Building Society</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sortCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Code (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 12-34-56" {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="iban"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IBAN (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter IBAN" {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <FormField
          control={form.control}
          name="channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channel</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="WEB">Web</SelectItem>
                  <SelectItem value="MOBILE">Mobile</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <Button 
        type="submit" 
        className="w-full bg-accent hover:bg-accent/90 text-primary-foreground"
        disabled= {isPending}
        >
          {isPending ? `Please wait..` : `Submit`}
        </Button>
      </form>
    </Form>
  );
};
