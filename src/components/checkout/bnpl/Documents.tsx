import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import { RegistrationData } from '../bnpl'
import { useHandleImageUpload } from '@/app/hooks/handleUpload'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

type PersonalProps = {
    form: UseFormReturn<RegistrationData, any, RegistrationData>
}
const Documents = ({ form }: PersonalProps) => {
    const mutateFile = useHandleImageUpload();
    const isUploadingFile = mutateFile?.isPending
  const handleFileChange = async function (e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const files = e.target.files;
    // setImgType(name);
    if (files?.length)
      mutateFile.mutate(
        { image: files[0], fileType: name },
        {
          onSuccess: (response) => {
            if (response) {
              if (response?.data.desc.includes('SUCCESS')) {
                form.setValue(name as any, response.data.id);
              } else {
                toast.error(response.data.desc);
              }
            }
          },
        }
      );
  };
  return (
    <>
        {
      isUploadingFile && (
        <div className='w-screen h-screen flex items-center justify-center bg-black/50 fixed top-0 left-0 z-50'>
          <Loader2 className="animate-spin text-white h-10 w-10" />
        </div>
      )
    }

        <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground">Required Documents</h4>
            
            <FormField
                control={form.control}
                name="payslip"
                render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                    <FormLabel>Current Payslip</FormLabel>
                    <FormControl>
                    <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        {...field}
                    />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Upload PDF, JPG, or PNG (max 5MB)</p>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="idDocument"
                render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                    <FormLabel>ID (Upload a clear form of identification)</FormLabel>
                    <FormControl>
                    <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        {...field}
                    />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Upload PDF, JPG, or PNG (max 5MB)</p>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="bankStatement"
                render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                    <FormLabel>Current Bank Statement</FormLabel>
                    <FormControl>
                    <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        {...field}
                    />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Upload last 3 months statement</p>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="utilityBill"
                render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                    <FormLabel>Utility Bill</FormLabel>
                    <FormControl>
                    <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        {...field}
                    />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Recent utility bill for address verification</p>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
    </>
  )
}

export default Documents