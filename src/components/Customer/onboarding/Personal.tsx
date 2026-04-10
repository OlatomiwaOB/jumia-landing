// import { Input } from '@/components/ui/input'
// import React, { useEffect, useState } from 'react'
// import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { FormData } from '../SignUpForm'
// import { useHandleImageUpload } from '@/app/hooks/handleUpload'
// import { toast } from 'sonner'
// import { Check, Upload, X } from 'lucide-react'

// type Props = {
//   register: UseFormRegister<FormData>,
//   errors: FieldErrors<FormData>,
//   watchedValues: FormData,
//   setValue: UseFormSetValue<FormData>
//   watch: UseFormWatch<FormData>
// }

// const Personal = ({ register, errors, watchedValues, setValue, watch }: Props) => {
//   const getMaxDate = () => {
//     const today = new Date();
//     const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
//     return maxDate.toISOString().split('T')[0];
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

//   return (
//     <div className="space-y-4">
//       <div className="space-y-2">
//         <label htmlFor="firstname" className="text-sm font-medium text-gray-700">
//           First Name <span className="text-red-500">*</span>
//         </label>
//         <Input
//           id="firstname"
//           {...register("firstname", { required: "This field is required" })}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           placeholder="Enter your first name"
//         />
//         {errors.firstname && <p className="text-red-500 text-xs">{errors.firstname.message}</p>}
//       </div>

//       <div className="space-y-2">
//         <label htmlFor="lastname" className="text-sm font-medium text-gray-700">
//           Last Name <span className="text-red-500">*</span>
//         </label>
//         <Input
//           id="lastname"
//           {...register("lastname", { required: "Last name is required" })}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           placeholder="Enter last name"
//         />
//         {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname.message}</p>}
//       </div>

//       <div className="space-y-2">
//         <label htmlFor="gender" className="text-sm font-medium text-gray-700">
//           Gender <span className="text-red-500">*</span>
//         </label>
//         <Select
//           value={watchedValues?.gender}
//           onValueChange={(value) => setValue("gender", value, { shouldValidate: true })}
//         >
//           <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//             <SelectValue placeholder="Select your gender" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value={'Male'}>Male</SelectItem>
//             <SelectItem value={'Female'}>Female</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="space-y-2">
//         <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
//           Date Of Birth <span className="text-red-500">*</span>
//         </label>
//         <Input
//           id="dateOfBirth"
//           {...register("dateOfBirth", {
//             required: "Date of birth is required",
//             validate: {
//               minAge: (value) => {
//                 if (!value) return "Date of birth is required";
//                 const birthDate = new Date(value);
//                 const today = new Date();
//                 const age = today.getFullYear() - birthDate.getFullYear();
//                 const monthDiff = today.getMonth() - birthDate.getMonth();

//                 if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//                   return age - 1 >= 18 || "You must be at least 18 years old";
//                 }
//                 return age >= 18 || "You must be at least 18 years old";
//               }
//             }
//           })}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           type='date'
//           max={getMaxDate()}
//         />
//         {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth.message}</p>}
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
//     </div>
//   )
// }

// export default Personal;


import { Input } from '@/components/ui/input'
import React, { useEffect, useState, useRef } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormData } from '../SignUpForm'
import { useHandleImageUpload } from '@/app/hooks/handleUpload'
import { toast } from 'sonner'
import { Check, Upload, X } from 'lucide-react'

type Props = {
  register: UseFormRegister<FormData>,
  errors: FieldErrors<FormData>,
  watchedValues: FormData,
  setValue: UseFormSetValue<FormData>
  watch: UseFormWatch<FormData>
}

const Personal = ({ register, errors, watchedValues, setValue, watch }: Props) => {
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  const mutateFile = useHandleImageUpload();
  const isUploadingFile = mutateFile?.isPending

  const [filenames, setFilenames] = useState<{ [key: string]: string }>({
    cacDocument: '',
    idFile: '',
    customerPic: '',
  });

  const initializedRef = useRef(false);
  const identificationInputRef = useRef<HTMLInputElement>(null);

  const identificationType = watchedValues.identificationType || '';

  useEffect(() => {
    if (!initializedRef.current && watchedValues.identificationType) {
      initializedRef.current = true;
    }
  }, [watchedValues.identificationType]);

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

  const handleIdentificationTypeChange = (value: string) => {
    const newType = value as 'bvn' | 'nin';
    setValue('identificationType', newType, { shouldValidate: true });

    if (identificationType === 'bvn') {
      setValue('bvn', '');
    } else if (identificationType === 'nin') {
      setValue('nin', '');
    }
  };

  const handleIdentificationValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value.replace(/\D/g, '');

    if (value.length <= 11) {
      if (identificationType === 'bvn') {
        setValue('bvn', value, { shouldValidate: true });
      } else if (identificationType === 'nin') {
        setValue('nin', value, { shouldValidate: true });
      }
    }
  };

  // const getIdentificationValue = () => {
  //   if (identificationType === 'bvn') {
  //     return watchedValues.bvn || '';
  //   } else if (identificationType === 'nin') {
  //     return watchedValues.nin || '';
  //   }
  //   return '';
  // };

  const getIdentificationError = () => {
    if (identificationType === 'bvn') {
      return errors.bvn;
    } else if (identificationType === 'nin') {
      return errors.nin;
    }
    return undefined;
  };

  const getIdentificationValidation = () => {
    if (identificationType === 'bvn') {
      return {
        required: "BVN is required",
        pattern: {
          value: /^[0-9]{4,11}$/,
          message: "BVN must be numeric"
        }
      };
    } else if (identificationType === 'nin') {
      return {
        required: "NIN is required",
        pattern: {
          value: /^[0-9]{4,11}$/,
          message: "NIN must be numeric"
        }
      };
    }
    return {};
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="firstname" className="text-sm font-medium text-gray-700">
          First Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="firstname"
          {...register("firstname", { required: "This field is required" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your first name"
        />
        {errors.firstname && <p className="text-red-500 text-xs">{errors.firstname.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="lastname" className="text-sm font-medium text-gray-700">
          Last Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="lastname"
          {...register("lastname", { required: "Last name is required" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter last name"
        />
        {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="gender" className="text-sm font-medium text-gray-700">
          Gender <span className="text-red-500">*</span>
        </label>
        <Select
          value={watchedValues?.gender}
          onValueChange={(value) => setValue("gender", value, { shouldValidate: true })}
        >
          <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'Male'}>Male</SelectItem>
            <SelectItem value={'Female'}>Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
          Date Of Birth <span className="text-red-500">*</span>
        </label>
        <Input
          id="dateOfBirth"
          {...register("dateOfBirth", {
            required: "Date of birth is required",
            validate: {
              minAge: (value) => {
                if (!value) return "Date of birth is required";
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                  return age - 1 >= 18 || "You must be at least 18 years old";
                }
                return age >= 18 || "You must be at least 18 years old";
              }
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          type='date'
          max={getMaxDate()}
        />
        {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth.message}</p>}
      </div>

      <div className='text-sm font-medium text-gray-700'>Kindly provide a valid means of identification. Alternatively, you may provide the last four digits of any identification number if you prefer.</div>

      <div className="space-y-2">
        <label htmlFor="identificationType" className="text-sm font-medium text-gray-700">
          Identification Type <span className="text-red-500">*</span>
        </label>
        <Select
          value={identificationType}
          onValueChange={handleIdentificationTypeChange}
        >
          <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
          <label htmlFor={identificationType} className="text-sm font-medium text-gray-700">
            {identificationType.toUpperCase()} Number <span className="text-red-500">*</span>
          </label>
          <Input
            id={identificationType}
            {...register(identificationType === 'bvn' ? 'bvn' : 'nin', {
              ...getIdentificationValidation(),
              onChange: handleIdentificationValueChange
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter your ${identificationType.toUpperCase()} number`}
            maxLength={11}
          />
          {getIdentificationError() && (
            <p className="text-red-500 text-xs">{getIdentificationError()?.message}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Personal;