import { Input } from '@/components/ui/input'
import React, { useState, useEffect } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { FormData } from '../SignUpForm'
import { useHandleImageUpload } from '@/app/hooks/handleUpload'
import { toast } from 'sonner'
import { Loader2, Upload, X, Check } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import useGetLookup from '@/app/hooks/useGetLookup'
import { CameraIcon } from '@/components/icons/icons'

type Props = {
  register: UseFormRegister<FormData>,
  errors: FieldErrors<FormData>,
  watchedValues: FormData,
  setValue: UseFormSetValue<FormData>,
  watch: UseFormWatch<FormData>
}

const BusinessDocuments = ({ errors, register, setValue, watchedValues, watch }: Props) => {
  const docIdentificationTypes = useGetLookup('IDENTITY_TYPE');
  const mutateFile = useHandleImageUpload();
  const isUploadingFile = mutateFile?.isPending

  const allWatchedValues = watch();

  const [filenames, setFilenames] = useState<{ [key: string]: string }>({
    cacDocument: '',
    idFile: '',
    merchantLogo: '',
  });

  useEffect(() => {
    const initialFilenames: { [key: string]: string } = {};
    
    if (watchedValues.cacDocument && typeof watchedValues.cacDocument === 'string') {
      initialFilenames.cacDocument = 'Uploaded document';
    }
    
    if (watchedValues.idFile && typeof watchedValues.idFile === 'string') {
      initialFilenames.idFile = 'Uploaded ID document';
    }
    
    if (watchedValues.merchantLogo && typeof watchedValues.merchantLogo === 'string') {
      initialFilenames.merchantLogo = 'Uploaded business logo';
    }
    
    setFilenames(prev => ({ ...prev, ...initialFilenames }));
  }, []);

  useEffect(() => {
    if (watchedValues.cacDocument && typeof watchedValues.cacDocument === 'string' && !filenames.cacDocument) {
      setFilenames(prev => ({ ...prev, cacDocument: 'Uploaded document' }));
    }
    
    if (watchedValues.idFile && typeof watchedValues.idFile === 'string' && !filenames.idFile) {
      setFilenames(prev => ({ ...prev, idFile: 'Uploaded ID document' }));
    }
    
    if (watchedValues.merchantLogo && typeof watchedValues.merchantLogo === 'string' && !filenames.merchantLogo) {
      setFilenames(prev => ({ ...prev, merchantLogo: 'Uploaded business logo' }));
    }
  }, [watchedValues.cacDocument, watchedValues.idFile, watchedValues.merchantLogo]);

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

  const clearFile = (fieldName: keyof FormData, inputRef: React.RefObject<HTMLInputElement | null>) => {
    setFilenames(prev => ({ ...prev, [fieldName]: '' }));
    setValue(fieldName, '');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const cacDocumentRef = React.useRef<HTMLInputElement | null>(null);
  const idFileRef = React.useRef<HTMLInputElement | null>(null);
  const merchantLogoRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <>
      {isUploadingFile && (
        <div className='fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black/50'>
          <Loader2 className="animate-spin text-white h-10 w-10" />
        </div>
      )}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cacDocument">
            CAC Document
          </Label>
          <div className="relative">
            <Input
              id="cacDocument"
              {...register("cacDocument")}
              ref={cacDocumentRef}
              name="cacDocument"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              type='file'
              className="hidden"
            />
            <div
              onClick={() => cacDocumentRef.current?.click()}
              className={`relative w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:border-accent hover:bg-accent/15 ${filenames.cacDocument ? 'border-green-500 bg-green-50' : 'border-faded-accent bg-accent/10'
                }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                  {filenames.cacDocument ? (
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <CameraIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="text-left overflow-hidden flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${filenames.cacDocument ? 'text-green-700' : 'text-gray-700'}`}>
                      {filenames.cacDocument || 'Upload CAC document'}
                    </p>
                    {!filenames.cacDocument && (
                      <p className="text-xs text-gray-500">PDF, JPG, JPEG or PNG</p>
                    )}
                  </div>
                </div>
                {filenames.cacDocument && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile('cacDocument', cacDocumentRef);
                    }}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
          {watchedValues.cacDocument && (
            <p className="text-xs text-green-600 mt-1">✓ Document uploaded</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="docIdentificationType">
            Identification Type <span className="text-red-500">*</span>
          </Label>
          <Select
            required
            value={watchedValues?.docIdentificationType}
            onValueChange={(value) => setValue('docIdentificationType', value as FormData['docIdentificationType'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select identification type" />
            </SelectTrigger>
            <SelectContent>
              {docIdentificationTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.docIdentificationType && <p className="text-red-500 text-xs">{errors.docIdentificationType.message}</p>}
        </div>

        {watchedValues.docIdentificationType  && (
          <div className="space-y-2">
            <Label htmlFor="idFile">
              {docIdentificationTypes.find(t => t.id === watchedValues.docIdentificationType )?.name || 'ID Document'} <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="idFile"
                {...register("idFile", {
                  required: watchedValues.docIdentificationType  ? "ID document is required" : false
                })}
                ref={idFileRef}
                name="idFile"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                type='file'
                className="hidden"
              />
              <div
                onClick={() => idFileRef.current?.click()}
                className={`relative w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:border-accent hover:bg-accent/15 ${filenames.idFile ? 'border-green-500 bg-green-50' : errors.idFile ? 'border-red-500 bg-red-50' : 'border-faded-accent bg-accent/10'
                  }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                    {filenames.idFile ? (
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <CameraIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="text-left overflow-hidden flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${filenames.idFile ? 'text-green-700' : 'text-gray-700'}`}>
                        {filenames.idFile || `Upload ${docIdentificationTypes.find(t => t.id === watchedValues.docIdentificationType)?.name || 'ID document'}`}
                      </p>
                      {!filenames.idFile && (
                        <p className="text-xs text-gray-500">PDF, JPG, JPEG or PNG</p>
                      )}
                    </div>
                  </div>
                  {filenames.idFile && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile('idFile', idFileRef);
                      }}
                      className="p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            {watchedValues.idFile && (
              <p className="text-xs text-green-600 mt-1">✓ ID document uploaded</p>
            )}
            {errors.idFile && <p className="text-red-500 text-xs">{errors.idFile.message}</p>}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="merchantLogo">
            Business Logo <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="merchantLogo"
              {...register("merchantLogo", { required: "Business logo is required" })}
              ref={merchantLogoRef}
              name="merchantLogo"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              type='file'
              className="hidden"
            />
            <div
              onClick={() => merchantLogoRef.current?.click()}
              className={`relative w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:border-accent hover:bg-accent/15 ${filenames.merchantLogo ? 'border-green-500 bg-green-50' : errors.merchantLogo ? 'border-red-500 bg-red-50' : 'border-faded-accent bg-accent/10'
                }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                  {filenames.merchantLogo ? (
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <CameraIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="text-left overflow-hidden flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${filenames.merchantLogo ? 'text-green-700' : 'text-gray-700'}`}>
                      {filenames.merchantLogo || 'Upload business logo'}
                    </p>
                    {!filenames.merchantLogo && (
                      <p className="text-xs text-gray-500">JPG, JPEG or PNG only</p>
                    )}
                  </div>
                </div>
                {filenames.merchantLogo && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile('merchantLogo', merchantLogoRef);
                    }}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
          {watchedValues.merchantLogo && (
            <p className="text-xs text-green-600 mt-1">✓ Business logo uploaded</p>
          )}
          {errors.merchantLogo && <p className="text-red-500 text-xs">{errors.merchantLogo.message}</p>}
        </div>
      </div>
    </>
  )
}

export default BusinessDocuments