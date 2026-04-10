import { Input } from '@/components/ui/input'
import React, { FocusEvent, useEffect, useState } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { FormData } from '../SignUpForm'
import useGetLookup from "@/app/hooks/useGetLookup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetBvnInfo } from '@/hooks/useGetBvnInfo'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

type Props = {
  register: UseFormRegister<FormData>,
  errors: FieldErrors<FormData>,
  watchedValues: FormData,
  setValue: UseFormSetValue<FormData>
}

const BusinessInformation = ({ register, errors, watchedValues, setValue }: Props) => {
  const businessTypeOptions = useGetLookup('BUSINESS_TYPE');
  const getBvnInfo = useGetBvnInfo();

  const [debouncedBvn, setDebouncedBvn] = useState<string>('');

  const validateBvn = async (bvn: string) => {
    if (bvn.length !== 11 || !/^\d+$/.test(bvn)) {
      return;
    }

    if (getBvnInfo.data?.data?.bvn === bvn) {
      return;
    }

    try {
      getBvnInfo.mutate(bvn, {
        onSuccess: (data) => {
          if (data?.data?.responseCode === '000') {
            setValue('firstname', data?.data?.firstname || '');
            setValue('lastname', data?.data?.lastname || '');
            setValue('gender', data?.data?.gender || '');
            setValue('dateOfBirth', data?.data?.birthdate || '');
            setValue('bvnPhoto', data?.data?.photo || '');
            toast.success(data?.data?.message || 'BVN validated successfully');
          } else {
            setValue('firstname', '');
            setValue('lastname', '');
            setValue('gender', '');
            setValue('dateOfBirth', '');
            toast.error(data?.data?.message || 'Invalid BVN');
          }
        },
        onError: () => {
          setValue('firstname', '');
          setValue('lastname', '');
          setValue('gender', '');
          setValue('dateOfBirth', '');
          toast.error('Failed to validate BVN. Please check your network connection.');
        },
      });
    } catch (error) {
      console.error('BVN validation error:', error);
    }
  };

  const handleBvnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setValue('bvn', value.slice(0, 11));

    setDebouncedBvn(value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedBvn.length === 11) {
        validateBvn(debouncedBvn);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedBvn]);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const numericText = pastedText.replace(/\D/g, '');

    if (numericText.length === 11) {
      setTimeout(() => {
        validateBvn(numericText);
      }, 100);
    }
  };

  const onBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    const value = watchedValues?.bvn;
    if (value?.length === 11 && !getBvnInfo.isPending) {
      validateBvn(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className="space-y-2">
          <label htmlFor="businessName" className="text-sm font-medium text-gray-700">
            Business Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="businessName"
            {...register("businessName", { required: "Business name is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/80 focus:border-transparent"
            placeholder="Enter your business name"
          />
          {errors.businessName && <p className="text-red-500 text-xs">{errors.businessName.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="businessRegNo" className="text-sm font-medium text-gray-700">
            Business Registration No (if any)
          </label>
          <Input
            id="businessRegNo"
            {...register("businessRegNo")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/80 focus:border-transparent"
            placeholder="Enter Business Registration Number"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="businessType" className="text-sm font-medium text-gray-700">
            Business Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={watchedValues.businessType}
            onValueChange={(value) => setValue('businessType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypeOptions.map((businessType) => (
                <SelectItem key={businessType.id} value={businessType.id}>
                  {businessType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {businessTypeOptions.length === 0 && (
            <p className="text-xs text-muted-foreground">Loading business type options...</p>
          )}
          {errors.businessType && <p className="text-red-500 text-xs">{errors.businessType.message}</p>}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900">Owner's Information</h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className="space-y-2">
          <label htmlFor="bvn" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            BVN
            {getBvnInfo.isPending && (
              <Loader2 className="h-4 w-4 animate-spin text-accent/80" />
            )}
          </label>
          <div className="relative">
            <Input
              id="bvn"
              value={watchedValues.bvn || ''}
              onChange={handleBvnChange}
              onPaste={handlePaste}
              onBlur={onBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Enter 11-digit BVN"
              maxLength={11}
              onKeyDown={(e) => {
                if (
                  !/\d/.test(e.key) &&
                  e.key !== 'Backspace' &&
                  e.key !== 'Delete' &&
                  e.key !== 'Enter' &&
                  e.key !== 'Tab' &&
                  e.key !== 'ArrowLeft' &&
                  e.key !== 'ArrowRight'
                ) {
                  e.preventDefault();
                }
              }}
            />
            {getBvnInfo.isPending && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-accent/80" />
              </div>
            )}
          </div>
          {getBvnInfo.isPending && (
            <p className="text-xs text-accent/80">Validating BVN...</p>
          )}
          {getBvnInfo.isSuccess && getBvnInfo.data?.data?.responseCode === '000' && (
            <p className="text-xs text-green-500">✓ BVN validated</p>
          )}
          {errors.bvn && <p className="text-red-500 text-xs">{errors.bvn.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="firstname" className="text-sm font-medium text-gray-700">
            First Name
          </label>
          <div className="relative">
            <Input
              id="firstname"
              {...register("firstname", { required: "First name is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50"
              placeholder="Auto-filled from BVN"
              readOnly
            />
            {getBvnInfo.isPending && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-accent/80" />
              </div>
            )}
          </div>
          {errors.firstname && <p className="text-red-500 text-xs">{errors.firstname.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastname" className="text-sm font-medium text-gray-700">
            Last Name
          </label>
          <div className="relative">
            <Input
              id="lastname"
              {...register("lastname", { required: "Last name is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50"
              placeholder="Auto-filled from BVN"
              readOnly
            />
            {getBvnInfo.isPending && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-accent/80" />
              </div>
            )}
          </div>
          {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="gender" className="text-sm font-medium text-gray-700">
            Gender
          </label>
          <div className="relative">
            <Input
              id="gender"
              {...register("gender", { required: "Gender is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50"
              placeholder="Auto-filled from BVN"
              readOnly
            />
            {getBvnInfo.isPending && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-accent/80" />
              </div>
            )}
          </div>
          {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="dob" className="text-sm font-medium text-gray-700">
            Date Of Birth
          </label>
          <div className="relative">
            <Input
              id="dob"
              {...register("dateOfBirth", { required: "Date of birth is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50"
              placeholder="Auto-filled from BVN"
              readOnly
            />
            {getBvnInfo.isPending && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-accent/80" />
              </div>
            )}
          </div>
          {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth.message}</p>}
        </div>
      </div>
    </div>
  )
}

export default BusinessInformation