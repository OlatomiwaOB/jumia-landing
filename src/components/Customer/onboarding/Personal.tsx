// import { Input } from '@/components/ui/input'
// import React, { useEffect, useState, useRef } from 'react'
// import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch, UseFormSetError, UseFormClearErrors } from 'react-hook-form'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { FormData } from '../SignUpForm'
// import { useHandleImageUpload } from '@/app/hooks/handleUpload'
// import { toast } from 'sonner'
// import { Label } from '@/components/ui/label'
// import { DatePicker } from "@/components/ui/date-picker"

// type Props = {
//   register: UseFormRegister<FormData>,
//   errors: FieldErrors<FormData>,
//   watchedValues: FormData,
//   setValue: UseFormSetValue<FormData>
//   watch: UseFormWatch<FormData>
//   setError: UseFormSetError<FormData>
//   clearErrors: UseFormClearErrors<FormData>
// }

// const Personal = ({ register, errors, watchedValues, setValue, watch, setError, clearErrors }: Props) => {
//   const getMaxDate = () => {
//     const today = new Date();
//     return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
//   };

//   const mutateFile = useHandleImageUpload();
//   const isUploadingFile = mutateFile?.isPending

//   const [filenames, setFilenames] = useState<{ [key: string]: string }>({
//     cacDocument: '',
//     idFile: '',
//     customerPic: '',
//   });

//   // useEffect(() => {
//   //   const initialFilenames: { [key: string]: string } = {};

//   //   if (watchedValues.customerPic && typeof watchedValues.customerPic === 'string') {
//   //     initialFilenames.customerPic = 'Uploaded a picture';
//   //   }

//   //   setFilenames(prev => ({ ...prev, ...initialFilenames }));
//   // }, []);

//   // useEffect(() => {

//   //   if (watchedValues.customerPic && typeof watchedValues.customerPic === 'string' && !filenames.customerPic) {
//   //     setFilenames(prev => ({ ...prev, customerPic: 'Uploaded a picture' }));
//   //   }
//   // }, [watchedValues.customerPic]);

//   const initializedRef = useRef(false);
//   const identificationInputRef = useRef<HTMLInputElement>(null);

//   const identificationType = watchedValues.identificationType || '';

//   useEffect(() => {
//     if (!initializedRef.current && watchedValues.identificationType) {
//       initializedRef.current = true;
//     }
//   }, [watchedValues.identificationType]);

//   const handleFileChange = async function (e: React.ChangeEvent<HTMLInputElement>) {
//     const name = e.target.name as keyof FormData;
//     const files = e.target.files;

//     if (files?.length) {
//       const filename = files[0].name;
//       setFilenames(prev => ({ ...prev, [name]: filename }));

//       mutateFile.mutate(
//         { image: files[0], fileType: name },
//         {
//           onSuccess: (response) => {
//             if (response?.data.desc.includes('SUCCESS')) {
//               setValue(name, response.data.id);
//               setFilenames(prev => ({ ...prev, [name]: filename }));
//               toast.success('File uploaded successfully');
//             } else {
//               toast.error(response?.data.desc || 'Upload failed');
//               setFilenames(prev => ({ ...prev, [name]: '' }));
//               setValue(name, '');
//               e.target.value = '';
//             }
//           },
//           onError: (error) => {
//             toast.error(error.message || 'Upload failed');
//             setFilenames(prev => ({ ...prev, [name]: '' }));
//             setValue(name, '');
//             e.target.value = '';
//           }
//         }
//       );
//     }
//   };

//   const clearFile = (fieldName: keyof FormData, inputRef: React.RefObject<HTMLInputElement>) => {
//     setFilenames(prev => ({ ...prev, [fieldName]: '' }));
//     setValue(fieldName, '');
//     if (inputRef.current) {
//       inputRef.current.value = '';
//     }
//   };

//   const customerPicRef = React.useRef<HTMLInputElement>(null);

//   const handleIdentificationTypeChange = (value: string) => {
//     const newType = value as 'bvn' | 'nin';
//     setValue('identificationType', newType, { shouldValidate: true });

//     if (identificationType === 'bvn') {
//       setValue('bvn', '');
//     } else if (identificationType === 'nin') {
//       setValue('nin', '');
//     }
//   };

//   const handleIdentificationValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value;

//     value = value.replace(/\D/g, '');

//     if (value.length <= 11) {
//       if (identificationType === 'bvn') {
//         setValue('bvn', value, { shouldValidate: true });
//       } else if (identificationType === 'nin') {
//         setValue('nin', value, { shouldValidate: true });
//       }
//     }
//   };

//   // const getIdentificationValue = () => {
//   //   if (identificationType === 'bvn') {
//   //     return watchedValues.bvn || '';
//   //   } else if (identificationType === 'nin') {
//   //     return watchedValues.nin || '';
//   //   }
//   //   return '';
//   // };

//   const getIdentificationError = () => {
//     if (identificationType === 'bvn') {
//       return errors.bvn;
//     } else if (identificationType === 'nin') {
//       return errors.nin;
//     }
//     return undefined;
//   };

//   const getIdentificationValidation = () => {
//     if (identificationType === 'bvn') {
//       return {
//         required: "BVN is required",
//         pattern: {
//           value: /^[0-9]{4,11}$/,
//           message: "BVN must be numeric"
//         }
//       };
//     } else if (identificationType === 'nin') {
//       return {
//         required: "NIN is required",
//         pattern: {
//           value: /^[0-9]{4,11}$/,
//           message: "NIN must be numeric"
//         }
//       };
//     }
//     return {};
//   };

//   return (
//     <div className="space-y-4">

//       <div className="space-y-2">
//         <label htmlFor="identificationType" className="text-sm font-medium text-gray-700">
//           Identification Type <span className="text-red-500">*</span>
//         </label>
//         <Select
//           value={identificationType}
//           onValueChange={handleIdentificationTypeChange}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select identification type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="bvn">BVN (Bank Verification Number)</SelectItem>
//             <SelectItem value="nin">NIN (National Identification Number)</SelectItem>
//           </SelectContent>
//         </Select>
//         {errors.identificationType && (
//           <p className="text-red-500 text-xs">{errors.identificationType.message}</p>
//         )}
//       </div>

//       {identificationType && (
//         <div className="space-y-2">
//           <label htmlFor={identificationType} className="text-sm font-medium text-gray-700">
//             {identificationType.toUpperCase()} Number <span className="text-red-500">*</span>
//           </label>
//           <Input
//             id={identificationType}
//             {...register(identificationType === 'bvn' ? 'bvn' : 'nin', {
//               ...getIdentificationValidation(),
//               onChange: handleIdentificationValueChange
//             })}
//             placeholder={`Enter ${identificationType.toUpperCase()} number`}
//             maxLength={11}
//           />
//           {getIdentificationError() && (
//             <p className="text-red-500 text-xs">{getIdentificationError()?.message}</p>
//           )}
//         </div>
//       )}

//       <div className='text-xs text-dark-gray bg-faded-accent/5 p-2 rounded-lg'>Kindly provide a valid means of identification. Please note that upon entry, the associated name, gender, and dob will be validated automatically.</div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="firstname">
//             First Name <span className="text-red-500">*</span>
//           </Label>
//           <Input
//             id="firstname"
//             {...register("firstname", { required: "This field is required" })}
//             placeholder="Enter first name"
//           />
//           {errors.firstname && <p className="text-red-500 text-xs">{errors.firstname.message}</p>}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="lastname">
//             Last Name <span className="text-red-500">*</span>
//           </Label>
//           <Input
//             id="lastname"
//             {...register("lastname", { required: "Last name is required" })}
//             placeholder="Enter last name"
//           />
//           {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname.message}</p>}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="gender">
//             Gender <span className="text-red-500">*</span>
//           </Label>
//           <Select
//             value={watchedValues?.gender}
//             onValueChange={(value) => setValue("gender", value, { shouldValidate: true })}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select gender" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={'Male'}>Male</SelectItem>
//               <SelectItem value={'Female'}>Female</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="dateOfBirth">
//             Date Of Birth <span className="text-red-500">*</span>
//           </Label>
//           <DatePicker
//             id="dateOfBirth"
//             value={watchedValues.dateOfBirth}
//             onChange={(value) => {
//               setValue("dateOfBirth", value, { shouldValidate: true })
//               clearErrors("dateOfBirth")
//             }}
//             onValidationError={(message) => {
//               setValue("dateOfBirth", "", { shouldValidate: false })
//               setError("dateOfBirth", { type: "manual", message })
//             }}
//             onValidationClear={() => {
//               clearErrors("dateOfBirth")
//             }}
//             onBlur={() => {
//               const value = watch("dateOfBirth")
//               if (value) {
//                 const birthDate = new Date(value)
//                 const today = new Date()
//                 const age = today.getFullYear() - birthDate.getFullYear()
//                 const monthDiff = today.getMonth() - birthDate.getMonth()

//                 if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//                   return age - 1 >= 18 || "You must be at least 18 years old";
//                 }
//                 return age >= 18 || "You must be at least 18 years old";
//               }
//             }}
//             placeholder="dd/mm/yyyy"
//             error={!!errors.dateOfBirth}
//             maxDate={getMaxDate()}
//           />
//           {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth.message}</p>}
//         </div>
//       </div>

//       {/* <div className="space-y-2 md:col-span-2">
//         <label htmlFor="customerPic" className="text-sm font-medium text-gray-700">
//           Picture <span className="text-red-500">*</span>
//         </label>
//         <div className="relative">
//           <Input
//             id="customerPic"
//             {...register("customerPic", { required: "Picture is required" })}
//             ref={customerPicRef}
//             name="customerPic"
//             accept=".jpg,.jpeg,.png"
//             onChange={handleFileChange}
//             type='file'
//             className="hidden"
//           />
//           <div
//             onClick={() => customerPicRef.current?.click()}
//             className={`relative w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:border-accent hover:bg-accent/5 ${filenames.customerPic ? 'border-green-500 bg-green-50' : errors.customerPic ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
//               }`}
//           >
//             <div className="flex items-center justify-between gap-2">
//               <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
//                 {filenames.customerPic ? (
//                   <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
//                 ) : (
//                   <Upload className="h-5 w-5 text-gray-400 flex-shrink-0" />
//                 )}
//                 <div className="text-left overflow-hidden flex-1 min-w-0">
//                   <p className={`text-sm font-medium truncate ${filenames.customerPic ? 'text-green-700' : 'text-gray-700'}`}>
//                     {filenames.customerPic || 'Upload a picture'}
//                   </p>
//                   {!filenames.customerPic && (
//                     <p className="text-xs text-gray-500">JPG, JPEG or PNG only</p>
//                   )}
//                 </div>
//               </div>
//               {filenames.customerPic && (
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     clearFile('customerPic', customerPicRef);
//                   }}
//                   className="p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
//                 >
//                   <X className="h-4 w-4 text-red-600" />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//         {watchedValues.customerPic && (
//           <p className="text-xs text-green-600 mt-1">✓ picture uploaded</p>
//         )}
//         {errors.customerPic && <p className="text-red-500 text-xs">{errors.customerPic.message}</p>}
//       </div> */}
//     </div >
//   )
// }

// export default Personal;

import { Input } from '@/components/ui/input'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch, UseFormSetError, UseFormClearErrors } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormData } from '../SignUpForm'
import { useHandleImageUpload } from '@/app/hooks/handleUpload'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { DatePicker } from "@/components/ui/date-picker"
import { useValidateIdentity } from '@/hooks/useGetIDType'
import { Loader2 } from 'lucide-react'
import { getClientIdentifiers } from '@/config/client-config'

type Props = {
  register: UseFormRegister<FormData>,
  errors: FieldErrors<FormData>,
  watchedValues: FormData,
  setValue: UseFormSetValue<FormData>
  watch: UseFormWatch<FormData>
  setError: UseFormSetError<FormData>
  clearErrors: UseFormClearErrors<FormData>
}

const Personal = ({ register, errors, watchedValues, setValue, watch, setError, clearErrors }: Props) => {
  const getMaxDate = () => {
    const today = new Date();
    return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  };

  const mutateFile = useHandleImageUpload();
  const isUploadingFile = mutateFile?.isPending
  const validateIdentity = useValidateIdentity();

  const [filenames, setFilenames] = useState<{ [key: string]: string }>({
    cacDocument: '',
    idFile: '',
    customerPic: '',
  });

  // useEffect(() => {
  //   const initialFilenames: { [key: string]: string } = {};

  //   if (watchedValues.customerPic && typeof watchedValues.customerPic === 'string') {
  //     initialFilenames.customerPic = 'Uploaded a picture';
  //   }

  //   setFilenames(prev => ({ ...prev, ...initialFilenames }));
  // }, []);

  // useEffect(() => {

  //   if (watchedValues.customerPic && typeof watchedValues.customerPic === 'string' && !filenames.customerPic) {
  //     setFilenames(prev => ({ ...prev, customerPic: 'Uploaded a picture' }));
  //   }
  // }, [watchedValues.customerPic]);

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
        entityId: getClientIdentifiers().entityCode,
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

  const handleFileChange = async function (e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name as keyof FormData;
    const files = e.target.files;

    if (files?.length) {
      const filename = files[0].name;
      setFilenames(prev => ({ ...prev, [name]: filename }));

      mutateFile.mutate(
        { image: files[0], fileType: name },
        {
          onSuccess: (response) => {
            if (response?.data.desc.includes('SUCCESS')) {
              setValue(name, response.data.id);
              setFilenames(prev => ({ ...prev, [name]: filename }));
              toast.success('File uploaded successfully');
            } else {
              toast.error(response?.data.desc || 'Upload failed');
              setFilenames(prev => ({ ...prev, [name]: '' }));
              setValue(name, '');
              e.target.value = '';
            }
          },
          onError: (error) => {
            toast.error(error.message || 'Upload failed');
            setFilenames(prev => ({ ...prev, [name]: '' }));
            setValue(name, '');
            e.target.value = '';
          }
        }
      );
    }
  };

  const clearFile = (fieldName: keyof FormData, inputRef: React.RefObject<HTMLInputElement>) => {
    setFilenames(prev => ({ ...prev, [fieldName]: '' }));
    setValue(fieldName, '');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const customerPicRef = React.useRef<HTMLInputElement>(null);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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
          Identification Type
          {/* <span className="text-red-500">*</span> */}
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
          <label htmlFor={identificationType} className="text-sm font-medium text-gray-700 flex items-center gap-2">
            {identificationType.toUpperCase()} Number
            {/* <span className="text-red-500">*</span> */}
            {validateIdentity.isPending && (
              <Loader2 className="h-4 w-4 animate-spin text-accent/80" />
            )}
          </label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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
            <Input
              id="dateOfBirth"
              type="date"
              {...register("dateOfBirth", {
                required: "Date of Birth is required",
                validate: (value) => {
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
                  return true;
                }
              })}
              className={`${(isValidated || isAutoFilling) ? 'bg-gray-50 cursor-not-allowed text-muted-foreground' : ''}`}
              disabled={isValidated || isAutoFilling}
              max={`${getMaxDate().getFullYear()}-${(getMaxDate().getMonth() + 1).toString().padStart(2, '0')}-${getMaxDate().getDate().toString().padStart(2, '0')}`}
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

      {/* <div className="space-y-2 md:col-span-2">
        <label htmlFor="customerPic" className="text-sm font-medium text-gray-700">
          Picture <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            id="customerPic"
            {...register("customerPic", { required: "Picture is required" })}
            ref={customerPicRef}
            name="customerPic"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            type='file'
            className="hidden"
          />
          <div
            onClick={() => customerPicRef.current?.click()}
            className={`relative w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:border-accent hover:bg-accent/5 ${filenames.customerPic ? 'border-green-500 bg-green-50' : errors.customerPic ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
              }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                {filenames.customerPic ? (
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Upload className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
                <div className="text-left overflow-hidden flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${filenames.customerPic ? 'text-green-700' : 'text-gray-700'}`}>
                    {filenames.customerPic || 'Upload a picture'}
                  </p>
                  {!filenames.customerPic && (
                    <p className="text-xs text-gray-500">JPG, JPEG or PNG only</p>
                  )}
                </div>
              </div>
              {filenames.customerPic && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile('customerPic', customerPicRef);
                  }}
                  className="p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              )}
            </div>
          </div>
        </div>
        {watchedValues.customerPic && (
          <p className="text-xs text-green-600 mt-1">✓ picture uploaded</p>
        )}
        {errors.customerPic && <p className="text-red-500 text-xs">{errors.customerPic.message}</p>}
      </div> */}
    </div>
  )
}

export default Personal