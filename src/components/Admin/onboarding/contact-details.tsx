import { Input } from '@/components/ui/input'
import React from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { FormData } from '../SignUpForm'
import useGetLookup from '@/app/hooks/useGetLookup'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

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
    <div className="space-y-4">
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className="space-y-2">
          <Label htmlFor="tierCode">
            Tier Type <span className="text-red-500">*</span>
          </Label>
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

        <div className="space-y-2">
          <Label htmlFor="subscriptionType">
            Subscription Type <span className="text-red-500">*</span>
          </Label>
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

      <div>
        <p className="text-xs text-dark-gray">
          See more about our{' '}
          <a href="https://www.fortitudedirect.com/pricing" target='_blank' className="text-faded-accent underline">
            subscription plans
          </a>
          .
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-dark-gray mb-4">Contact Details</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
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
            placeholder="Enter your email address"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobileNo">
            Mobile Number <span className="text-red-500">*</span>
          </Label>
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
            placeholder="Enter your mobile number"
          />
          {errors.mobileNo && <p className="text-red-500 text-xs">{errors.mobileNo.message}</p>}
        </div>
      </div>
    </div>
  )
}

export default ContactDetails