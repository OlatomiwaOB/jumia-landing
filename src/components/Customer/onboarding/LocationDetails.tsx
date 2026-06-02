import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { FormData } from '../SignUpForm'
import { TermsAndConditions } from '@/components/Customer/onboarding/terms-and-conditions'
import { Label } from '@/components/ui/label'

const nationalities = [
  // { nationality: "Afghan", code: "AF", phoneCode: "+93" },
  // { nationality: "Argentine", code: "AR", phoneCode: "+54" },
  // { nationality: "Australian", code: "AU", phoneCode: "+61" },
  // { nationality: "Austrian", code: "AT", phoneCode: "+43" },
  // { nationality: "Bangladeshi", code: "BD", phoneCode: "+880" },
  // { nationality: "Belgian", code: "BE", phoneCode: "+32" },
  // { nationality: "Brazilian", code: "BR", phoneCode: "+55" },
  // { nationality: "Canadian", code: "CA", phoneCode: "+1" },
  // { nationality: "Chinese", code: "CN", phoneCode: "+86" },
  // { nationality: "Colombian", code: "CO", phoneCode: "+57" },
  // { nationality: "Danish", code: "DK", phoneCode: "+45" },
  // { nationality: "Egyptian", code: "EG", phoneCode: "+20" },
  // { nationality: "Finnish", code: "FI", phoneCode: "+358" },
  // { nationality: "French", code: "FR", phoneCode: "+33" },
  // { nationality: "German", code: "DE", phoneCode: "+49" },
  // { nationality: "Ghanaian", code: "GH", phoneCode: "+233" },
  // { nationality: "Greek", code: "GR", phoneCode: "+30" },
  // { nationality: "Indian", code: "IN", phoneCode: "+91" },
  // { nationality: "Indonesian", code: "ID", phoneCode: "+62" },
  // { nationality: "Irish", code: "IE", phoneCode: "+353" },
  // { nationality: "Italian", code: "IT", phoneCode: "+39" },
  // { nationality: "Japanese", code: "JP", phoneCode: "+81" },
  // { nationality: "Kenyan", code: "KE", phoneCode: "+254" },
  // { nationality: "Malaysian", code: "MY", phoneCode: "+60" },
  // { nationality: "Mexican", code: "MX", phoneCode: "+52" },
  // { nationality: "Dutch", code: "NL", phoneCode: "+31" },
  // { nationality: "New Zealand", code: "NZ", phoneCode: "+64" },
  { nationality: "Nigerian", code: "NG", phoneCode: "+234" },
  // { nationality: "Norwegian", code: "NO", phoneCode: "+47" },
  // { nationality: "Pakistani", code: "PK", phoneCode: "+92" },
  // { nationality: "Filipino", code: "PH", phoneCode: "+63" },
  // { nationality: "Polish", code: "PL", phoneCode: "+48" },
  // { nationality: "Portuguese", code: "PT", phoneCode: "+351" },
  // { nationality: "Russian", code: "RU", phoneCode: "+7" },
  // { nationality: "Saudi", code: "SA", phoneCode: "+966" },
  // { nationality: "Singaporean", code: "SG", phoneCode: "+65" },
  // { nationality: "South African", code: "ZA", phoneCode: "+27" },
  // { nationality: "South Korean", code: "KR", phoneCode: "+82" },
  // { nationality: "Spanish", code: "ES", phoneCode: "+34" },
  // { nationality: "Swedish", code: "SE", phoneCode: "+46" },
  // { nationality: "Swiss", code: "CH", phoneCode: "+41" },
  // { nationality: "Thai", code: "TH", phoneCode: "+66" },
  // { nationality: "Turkish", code: "TR", phoneCode: "+90" },
  // { nationality: "Emirati", code: "AE", phoneCode: "+971" },
  { nationality: "British", code: "GB", phoneCode: "+44" },
  // { nationality: "American", code: "US", phoneCode: "+1" },
  // { nationality: "Vietnamese", code: "VN", phoneCode: "+84" }
].sort((a, b) => a.nationality.localeCompare(b.nationality));

type Props = {
  register: UseFormRegister<FormData>,
  errors: FieldErrors<FormData>,
  watchedValues: FormData,
  setValue: UseFormSetValue<FormData>
  control: Control<FormData>
}

const LocationDetails = ({ errors, register, setValue, watchedValues, control }: Props) => {
  const getSelectedNationalityDisplay = () => {
    if (!watchedValues.nationality) return "";

    try {
      const nationalityData = JSON.parse(watchedValues.nationality);
      return `${nationalityData.nationality} (${nationalityData.phoneCode})`;
    } catch {
      return "";
    }
  };

  const isFormValid = () => {
    return (
      watchedValues.nationality &&
      watchedValues.city &&
      watchedValues.address
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nationality">
            Nationality <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watchedValues.nationality}
            onValueChange={(value) => setValue("nationality", value, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select nationality">
                {getSelectedNationalityDisplay()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {nationalities.map((item) => (
                <SelectItem
                  key={item.code}
                  value={JSON.stringify(item)}
                >
                  {item.nationality} ({item.phoneCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.nationality && <p className="text-red-500 text-xs">{errors.nationality.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">
            Home Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            {...register("address", { required: "Address is required" })}
            placeholder="Enter address" />
          {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            {...register("city", { required: "City is required" })}
            placeholder="Enter city" />
          {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
        </div>
      </div>

      {isFormValid() && (
        <div className="space-y-2 border-t border-gray-200">
          <TermsAndConditions register={register} errors={errors} control={control} />
        </div>
      )}
    </>
  );
};



export default LocationDetails;