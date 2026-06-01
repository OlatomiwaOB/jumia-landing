import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { FormData } from '../SignUpForm'
import { TermsAndConditions } from '@/components/Customer/onboarding/terms-and-conditions'
import { Label } from '@/components/ui/label'

// Static array of major countries with their codes
const countries = [
  // { name: "Afghanistan", code: "AF" },
  // { name: "Argentina", code: "AR" },
  // { name: "Australia", code: "AU" },
  // { name: "Austria", code: "AT" },
  // { name: "Bangladesh", code: "BD" },
  // { name: "Belgium", code: "BE" },
  // { name: "Brazil", code: "BR" },
  // { name: "Canada", code: "CA" },
  // { name: "China", code: "CN" },
  // { name: "Colombia", code: "CO" },
  // { name: "Denmark", code: "DK" },
  // { name: "Egypt", code: "EG" },
  // { name: "Finland", code: "FI" },
  // { name: "France", code: "FR" },
  // { name: "Germany", code: "DE" },
  // { name: "Ghana", code: "GH" },
  // { name: "Greece", code: "GR" },
  // { name: "India", code: "IN" },
  // { name: "Indonesia", code: "ID" },
  // { name: "Ireland", code: "IE" },
  // { name: "Italy", code: "IT" },
  // { name: "Japan", code: "JP" },
  // { name: "Kenya", code: "KE" },
  // { name: "Malaysia", code: "MY" },
  // { name: "Mexico", code: "MX" },
  // { name: "Netherlands", code: "NL" },
  // { name: "New Zealand", code: "NZ" },
  { name: "Nigeria", code: "NG" },
  // { name: "Norway", code: "NO" },
  // { name: "Pakistan", code: "PK" },
  // { name: "Philippines", code: "PH" },
  // { name: "Poland", code: "PL" },
  // { name: "Portugal", code: "PT" },
  // { name: "Russia", code: "RU" },
  // { name: "Saudi Arabia", code: "SA" },
  // { name: "Singapore", code: "SG" },
  // { name: "South Africa", code: "ZA" },
  // { name: "South Korea", code: "KR" },
  // { name: "Spain", code: "ES" },
  // { name: "Sweden", code: "SE" },
  // { name: "Switzerland", code: "CH" },
  // { name: "Thailand", code: "TH" },
  // { name: "Turkey", code: "TR" },
  // { name: "United Arab Emirates", code: "AE" },
  { name: "United Kingdom", code: "GB" },
  // { name: "United States", code: "US" },
  // { name: "Vietnam", code: "VN" }
].sort((a, b) => a.name.localeCompare(b.name));

type Props = {
  register: UseFormRegister<FormData>,
  errors: FieldErrors<FormData>,
  watchedValues: FormData,
  setValue: UseFormSetValue<FormData>
  control: Control<FormData>
}

const LocationDetails = ({ errors, register, setValue, watchedValues, control }: Props) => {
  const isFormValid = () => {
    return (
      watchedValues.country &&
      watchedValues.state &&
      watchedValues.city &&
      watchedValues.address
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="country">
          Country <span className="text-red-500">*</span>
        </Label>
        <Select
          value={watchedValues.country}
          onValueChange={(value) => setValue("country", value, { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">
          State/Province <span className="text-red-500">*</span>
        </Label>
        <Input
          id="state"
          {...register("state", { required: "State/Province is required" })}
          placeholder="Enter your state or province"
        />
        {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">
          City <span className="text-red-500">*</span>
        </Label>
        <Input
          id="city"
          {...register("city", { required: "City is required" })}
          placeholder="Enter your city"
        />
        {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">
          Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="address"
          {...register("address", { required: "Address is required" })}
          placeholder="Enter your business address"
        />
        {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
      </div>

      {isFormValid() && (
        <div className="space-y-2 border-t border-gray-200">
          <TermsAndConditions register={register} errors={errors} control={control} />
        </div>
      )}
    </div>
  );
};

export default LocationDetails;