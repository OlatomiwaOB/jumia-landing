import { Input } from '@/components/ui/input'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch, UseFormSetError, UseFormClearErrors } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormData } from '../SignUpForm'
import useGetLookup from "@/app/hooks/useGetLookup";
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { DatePicker } from "@/components/ui/date-picker"
import { useValidateIdentity } from '@/hooks/useGetIDType'
import { Loader2 } from 'lucide-react'

type Props = {
  register: UseFormRegister<FormData>,
  errors: FieldErrors<FormData>,
  watchedValues: FormData,
  setValue: UseFormSetValue<FormData>
  watch: UseFormWatch<FormData>
  setError: UseFormSetError<FormData>
  clearErrors: UseFormClearErrors<FormData>
}

const BusinessInformation = ({ register, errors, watchedValues, setValue, watch, setError, clearErrors }: Props) => {
  const businessTypeOptions = useGetLookup('BUSINESS_TYPE');
  const validateIdentity = useValidateIdentity();

  const identificationType = watchedValues.identificationType || '';
  const lastValidatedRef = useRef<{ idType: string; idNo: string }>({ idType: '', idNo: '' });
  const shouldValidateOnTypeChange = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getIdentificationValue = useCallback(() => {
    if (identificationType === 'bvn') {
      return watchedValues.bvn || '';
    } else if (identificationType === 'nin') {
      return watchedValues.nin || '';
    }
    return '';
  }, [identificationType, watchedValues.bvn, watchedValues.nin]);

  const validateIdentityFn = useCallback((idNo: string, idType: string) => {
    if (!idNo || idNo.length !== 11 || !/^\d+$/.test(idNo)) {
      return;
    }

    if (validateIdentity.isPending) {
      return;
    }

    if (lastValidatedRef.current.idType === idType && lastValidatedRef.current.idNo === idNo) {
      return;
    }

    lastValidatedRef.current = { idType, idNo };

    validateIdentity.mutate(
      {
        entityId: 'FTD',
        idNo: idNo,
        idType: idType as 'BVN' | 'NIN',
        firstname: watchedValues.firstname || '',
        lastname: watchedValues.lastname || ''
      },
      {
        onSuccess: (data) => {
          if (data?.data?.responseCode === '000') {
            setValue('firstname', data?.data?.firstname || '', { shouldValidate: true });
            setValue('lastname', data?.data?.lastname || '', { shouldValidate: true });
            setValue('gender', data?.data?.gender || '', { shouldValidate: true });
            setValue('dateOfBirth', data?.data?.birthdate || '', { shouldValidate: true });
            toast.success(data?.data?.responseMessage || 'Identity validated successfully');
          } else {
            lastValidatedRef.current = { idType: '', idNo: '' };
            clearIdentityFields();
            toast.error(data?.data?.responseMessage || 'Invalid identification number');
          }
        },
        onError: () => {
          lastValidatedRef.current = { idType: '', idNo: '' };
          clearIdentityFields();
          toast.error('Failed to validate identity. Please check your network connection.');
        },
      }
    );
  }, [validateIdentity, watchedValues.firstname, watchedValues.lastname, setValue]);

  const clearIdentityFields = useCallback(() => {
    setValue('firstname', '');
    setValue('lastname', '');
    setValue('gender', '');
    setValue('dateOfBirth', '');
  }, [setValue]);

  const handleIdentificationTypeChange = (value: string) => {
    setValue('identificationType', value as 'bvn' | 'nin', { shouldValidate: true });

    if (identificationType === 'bvn') {
      setValue('bvn', '');
    } else if (identificationType === 'nin') {
      setValue('nin', '');
    }

    lastValidatedRef.current = { idType: '', idNo: '' };
    validateIdentity.reset();
    shouldValidateOnTypeChange.current = true;
  };

  const handleIdentificationValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 11);

    if (identificationType === 'bvn') {
      setValue('bvn', value, { shouldValidate: true });
    } else if (identificationType === 'nin') {
      setValue('nin', value, { shouldValidate: true });
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (lastValidatedRef.current.idNo !== value && lastValidatedRef.current.idNo !== '') {
      lastValidatedRef.current = { idType: '', idNo: '' };
      clearIdentityFields();
    }

    if (value.length === 11) {
      debounceTimerRef.current = setTimeout(() => {
        validateIdentityFn(value, identificationType.toUpperCase());
      }, 500);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const numericText = pastedText.replace(/\D/g, '').slice(0, 11);

    if (numericText.length === 11 && identificationType) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        validateIdentityFn(numericText, identificationType.toUpperCase());
      }, 100);
    }
  };

  const handleBlur = () => {
    const currentValue = getIdentificationValue();
    if (currentValue.length === 11 && !validateIdentity.isPending) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      validateIdentityFn(currentValue, identificationType.toUpperCase());
    }
  };

  useEffect(() => {
    if (identificationType && shouldValidateOnTypeChange.current) {
      shouldValidateOnTypeChange.current = false;
      const currentValue = getIdentificationValue();
      if (currentValue.length === 11) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          validateIdentityFn(currentValue, identificationType.toUpperCase());
        }, 300);
      }
    }
  }, [identificationType, getIdentificationValue, validateIdentityFn]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const getIdentificationError = () => {
    if (identificationType === 'bvn') {
      return errors.bvn;
    } else if (identificationType === 'nin') {
      return errors.nin;
    }
    return undefined;
  };

  const isAutoFilling = validateIdentity.isPending;
  const isValidated = validateIdentity.isSuccess && validateIdentity.data?.data?.responseCode === '000';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstname">
            First Name <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="firstname"
              {...register("firstname", { required: "This field is required" })}
              placeholder="Enter first name"
              className={`${(isValidated || isAutoFilling) ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              disabled={isValidated}
            />
            {isAutoFilling && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-accent/80" />
              </div>
            )}
          </div>
          {errors.firstname && <p className="text-red-500 text-xs">{errors.firstname.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastname">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="lastname"
              {...register("lastname", { required: "Last name is required" })}
              placeholder="Enter last name"
              className={`${(isValidated || isAutoFilling) ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              disabled={isValidated}
            />
            {isAutoFilling && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-accent/80" />
              </div>
            )}
          </div>
          {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname.message}</p>}
        </div>
      </div>

      {!isValidated && (
        <div className='text-xs text-dark-gray bg-faded-accent/5 p-2 rounded-lg'>
          Kindly provide a valid means of identification. Please note that upon entry, the associated first name and last name must match the record on the selected ID type, then the gender and DOB will be auto-populated.
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="identificationType">
          Identification Type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={identificationType}
          onValueChange={handleIdentificationTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select identification type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bvn">BVN (Bank Verification Number)</SelectItem>
            <SelectItem value="nin">NIN (National Identification Number)</SelectItem>
          </SelectContent>
        </Select>
        {errors.identificationType && (
          <p className="text-red-500 text-xs">{errors.identificationType.message}</p>
        )}
      </div>

      {identificationType && (
        <div className="space-y-2">
          <Label htmlFor={identificationType} className="flex items-center gap-2">
            {identificationType.toUpperCase()} Number <span className="text-red-500">*</span>
            {validateIdentity.isPending && (
              <Loader2 className="h-4 w-4 animate-spin text-accent/80" />
            )}
          </Label>
          <div className="relative">
            <Input
              id={identificationType}
              value={getIdentificationValue()}
              onChange={handleIdentificationValueChange}
              onPaste={handlePaste}
              onBlur={handleBlur}
              placeholder={`Enter ${identificationType.toUpperCase()} number`}
              maxLength={11}
              onKeyDown={(e) => {
                if (
                  !/\d/.test(e.key) &&
                  e.key !== 'Backspace' &&
                  e.key !== 'Delete' &&
                  e.key !== 'ArrowLeft' &&
                  e.key !== 'ArrowRight'
                ) {
                  e.preventDefault();
                }
              }}
            />
            {validateIdentity.isPending && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-accent/80" />
              </div>
            )}
          </div>
          {validateIdentity.isPending && (
            <p className="text-xs text-accent/80">Validating {identificationType.toUpperCase()}...</p>
          )}
          {isValidated && (
            <p className="text-xs text-green-500">✓ {identificationType.toUpperCase()} validated successfully</p>
          )}
          {getIdentificationError() && (
            <p className="text-red-500 text-xs">{getIdentificationError()?.message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">
            Gender <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Select
              value={watchedValues?.gender}
              onValueChange={(value) => setValue("gender", value, { shouldValidate: true })}
              disabled={isValidated || isAutoFilling}
            >
              <SelectTrigger className={`${(isValidated || isAutoFilling) ? 'bg-gray-50 cursor-not-allowed' : ''}`}>
                <SelectValue placeholder="Gender to be validated" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'Male'}>Male</SelectItem>
                <SelectItem value={'Female'}>Female</SelectItem>
              </SelectContent>
            </Select>
            {isAutoFilling && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-accent/80" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">
            Date Of Birth <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <DatePicker
              id="dateOfBirth"
              value={watchedValues.dateOfBirth}
              onChange={(value) => {
                if (!isValidated && !isAutoFilling) {
                  setValue("dateOfBirth", value, { shouldValidate: true })
                  clearErrors("dateOfBirth")
                }
              }}
              onValidationError={(message) => {
                if (!isValidated && !isAutoFilling) {
                  setValue("dateOfBirth", "", { shouldValidate: false })
                  setError("dateOfBirth", { type: "manual", message })
                }
              }}
              onValidationClear={() => {
                clearErrors("dateOfBirth")
              }}
              onBlur={() => {
                const value = watch("dateOfBirth")
                if (value) {
                  const birthDate = new Date(value)
                  const today = new Date()
                  const age = today.getFullYear() - birthDate.getFullYear()
                  const monthDiff = today.getMonth() - birthDate.getMonth()

                  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    return age - 1 >= 18 || "You must be at least 18 years old";
                  }
                  return age >= 18 || "You must be at least 18 years old";
                }
              }}
              placeholder="DOB to be validated"
              error={!!errors.dateOfBirth}
              maxDate={(() => {
                const today = new Date();
                return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
              })()}
              disabled={(isValidated || isAutoFilling)}
            />
            {isAutoFilling && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-accent/80" />
              </div>
            )}
          </div>
          {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth.message}</p>}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-dark-gray mb-4">Business Information</h3>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className="space-y-2">
          <Label htmlFor="businessName">
            Business Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="businessName"
            {...register("businessName", { required: "Business name is required" })}
            placeholder="Enter your business name"
          />
          {errors.businessName && <p className="text-red-500 text-xs">{errors.businessName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessRegNo">
            Business Registration No (if any)
          </Label>
          <Input
            id="businessRegNo"
            {...register("businessRegNo")}
            placeholder="Enter Business Registration Number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessType">
            Business Type <span className="text-red-500">*</span>
          </Label>
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
    </div>
  )
}

export default BusinessInformation