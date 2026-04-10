import { Input } from '@/components/ui/input'
import React from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { FormData } from '../SignUpForm'
import useGetLookup from '@/app/hooks/useGetLookup'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


type Props = {
  register: UseFormRegister<FormData>,
  errors: FieldErrors<FormData>,
  watchedValues: FormData,
  setValue: UseFormSetValue<FormData>
}
const ContactDetails = ({ register, errors, watchedValues, setValue }: Props) => {
  const subscriptionTypeOptions = useGetLookup('SUBSCRIPTION_TYPE');
  const tierCodeOptions = useGetLookup('TIER_CODE');


  return (
    <>
      <div className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label htmlFor="tierCode" className="text-sm font-medium text-gray-700">
              Tier Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={watchedValues.tierCode}
              onValueChange={(value) => setValue('tierCode', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tier type" />
              </SelectTrigger>
              <SelectContent>
                {tierCodeOptions.map((tierCode) => (
                  <SelectItem key={tierCode.id} value={tierCode.id}>
                    {tierCode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {tierCodeOptions.length === 0 && (
              <p className="text-xs text-muted-foreground">Loading tier type options...</p>
            )}
            {errors.tierCode && <p className="text-red-500 text-xs">{errors.tierCode.message}</p>}
          </div>

          <div className='space-y-2'>
            <label htmlFor="subscriptionType" className="text-sm font-medium text-gray-700">
              Subscription Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={watchedValues.subscriptionType}
              onValueChange={(value) => setValue('subscriptionType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subscription type" />
              </SelectTrigger>
              <SelectContent>
                {subscriptionTypeOptions.map((subscriptionType) => (
                  <SelectItem key={subscriptionType.id} value={subscriptionType.id}>
                    {subscriptionType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {subscriptionTypeOptions.length === 0 && (
              <p className="text-xs text-muted-foreground">Loading subscription type options...</p>
            )}
            {errors.subscriptionType && <p className="text-red-500 text-xs">{errors.subscriptionType.message}</p>}
          </div>

        </div>
      </div>

      <div>
        <p>
          See more about our <a href="https://www.fortitudedirect.com/pricing" target='_blank' className="text-accent underline">subscription plans</a>.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
      </div>

      <div className="space-y-4">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email address" />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="mobileNo" className="text-sm font-medium text-gray-700">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="mobileNo"
              type="tel"
              maxLength={11}
              {...register("mobileNo", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{11}$/,
                  message: "Mobile number must be 11 digits",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your mobile number" />
            {errors.mobileNo && <p className="text-red-500 text-xs">{errors.mobileNo.message}</p>}
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactDetails