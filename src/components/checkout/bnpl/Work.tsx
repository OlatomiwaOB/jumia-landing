import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UseFormReturn } from 'react-hook-form'
import { RegistrationData } from '../bnpl'

type PersonalProps = {
    form: UseFormReturn<RegistrationData, any, RegistrationData>
}
const Work = ({ form }: PersonalProps) => {
  return (
    <>
        <div className="grid lg:grid-cols-2 gap-4">
        <FormField
            control={form.control}
            name="employer"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Employer</FormLabel>
                <FormControl>
                <Input placeholder="Acme Corp" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

            <FormField
            control={form.control}
            name="workEmail"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Work Email</FormLabel>
                <FormControl>
                <Input placeholder="john@org.xyz" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <FormField
        control={form.control}
        name="employmentStatus"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Employment Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder="Select Employment Status" />
                </SelectTrigger>
                </FormControl>
                <SelectContent>
                <SelectItem value="SELF_EMPLOYED">Self Employed</SelectItem>
                <SelectItem value="EMPLOYED">Employed</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="UNEMPLOYED">Unemployed</SelectItem>
                </SelectContent>
            </Select>
            <FormMessage />
            </FormItem>
        )}
        />

        <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                <Input placeholder="Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="employerWebsite"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Employer Website</FormLabel>
                <FormControl>
                <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="employmentStartDate"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Employment Start Date</FormLabel>
                <FormControl>
                <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        </div>

        <FormField
        control={form.control}
        name="annualIncome"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Annual Income</FormLabel>
            <FormControl>
                <Input type="number" placeholder="3000" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />

        <FormField
        control={form.control}
        name="linkedinUrl"
        render={({ field }) => (
            <FormItem>
            <FormLabel>LinkedIn Profile (Optional)</FormLabel>
            <FormControl>
                <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />

        <FormField
        control={form.control}
        name="socialUsername"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Linkedin Username (Optional)</FormLabel>
            <FormControl>
                <Input type="text" placeholder="john@company.com" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />

        <FormField
        control={form.control}
        name="nationality"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Nationality</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder="Select your nationality" />
                </SelectTrigger>
                </FormControl>
                <SelectContent>
                <SelectItem value="nigerian">Nigerian</SelectItem>
                <SelectItem value="kenyan">Kenyan</SelectItem>
                <SelectItem value="ghanaian">Ghanaian</SelectItem>
                <SelectItem value="south-african">South African</SelectItem>
                <SelectItem value="british">British</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                </SelectContent>
            </Select>
            <FormMessage />
            </FormItem>
        )}
        />

        <FormField
        control={form.control}
        name="totalAmount"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Loan Amount</FormLabel>
            <FormControl>
                <Input type="number" placeholder="1000" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />

        {/* Nigerian specific fields */}
        {form.watch("nationality") === 'nigerian' && (
        <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground">Nigerian Verification</h4>
            <FormField
            control={form.control}
            name="bvn"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Bank Verification Number (BVN)</FormLabel>
                <FormControl>
                    <Input
                    placeholder="Enter your 11-digit BVN"
                    maxLength={11}
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="nin"
            render={({ field }) => (
                <FormItem>
                <FormLabel>National Identification Number (NIN)</FormLabel>
                <FormControl>
                    <Input
                    placeholder="Enter your 11-digit NIN"
                    maxLength={11}
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        )}

    </>
  )
}

export default Work