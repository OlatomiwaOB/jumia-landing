'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Download, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import axiosInstance from "@/utils/fetch-function";
import useUser from '@/store/userStore';

interface UploadBulkFormProps {
  uploadType: 'products' | 'categories';
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface UploadFormData {
  file: FileList;
}

interface FileUploadResponse {
  code: string;
  desc: string;
  refNo?: string;
}

const UploadBulkForm = ({ uploadType, onSuccess, onCancel }: UploadBulkFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useUser();

  const { register, handleSubmit, watch, formState: { errors }, setValue, resetField } = useForm<UploadFormData>({
    mode: 'onChange'
  });

  const selectedFile = watch('file')?.[0];

  const downloadTemplate = () => {
    const templateFileName = uploadType === 'products'
      ? 'product-upload-template.csv'
      : 'category-upload-template.csv';

    const templateUrl = `/templates/${templateFileName}`;
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = templateFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadInstructions = () => {
    const templateFileName = 'bulk-upload-instructions-manual.docx';
    const templateUrl = `/templates/${templateFileName}`;
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = templateFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validateFile = (file: File) => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      return 'Please select a valid Excel or CSV file';
    }

    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const onSubmit = async (data: UploadFormData) => {
    const file = data.file[0];
    const validationError = validateFile(file);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUploading(true);

    try {
      const fileUploadFormData = new FormData();
      fileUploadFormData.append('file', file);

      const headers = {
        'x-source-code': 'WEB',
        'FileType': uploadType === 'products' ? 'PRODUCT' : 'PRODUCT_CATEGORY',
        'Content-Type': 'multipart/form-data'
      };

      const fileUploadResponse = await axiosInstance.post<FileUploadResponse>(
        '/fileuploadservice/uploadfile',
        fileUploadFormData,
        {
          headers,
          params: {
            entityCode: user?.entityCode,
            storeCode: user?.storeCode,
            FILETYPE: uploadType === 'products' ? 'PRODUCT' : 'PRODUCT_CATEGORY',
          }
        }
      );

      if (fileUploadResponse.data?.code !== '00') {
        throw new Error(fileUploadResponse.data?.desc || 'File upload failed');
      }

      resetField('file');
      toast.success(`${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} uploaded successfully`);

      setTimeout(() => {
        onSuccess?.();
      }, 1500);

    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.desc || error.message || `Error uploading ${uploadType}`;
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const getTitle = () => {
    return uploadType === 'products'
      ? 'Bulk Upload Products'
      : 'Bulk Upload Categories';
  };

  const getButtonLabel = () => {
    return uploadType === 'products'
      ? 'Upload Products'
      : 'Upload Categories';
  };

  const getFileTypeLabel = () => {
    return uploadType === 'products'
      ? 'PRODUCT'
      : 'PRODUCT CATEGORY';
  };

  const handleCancel = () => {
    resetField('file');
    onCancel?.();
  };

  return (
    <div className="space-y-6">
      <DialogHeader className='flex flex-col items-start'>
        <DialogTitle className="text-2xl font-bold text-center">
          {getTitle()}
        </DialogTitle>
        <DialogDescription className="text-center">
          Upload a file to bulk {uploadType === 'products' ? 'add products' : 'create categories'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="file" className="text-sm font-medium">
              Upload File
            </Label>
            <button
              type="button"
              onClick={downloadTemplate}
              className="flex items-center text-sm text-accent/80 hover:text-accent transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 mr-1" />
              Download Template
            </button>
          </div>

          <div className="space-y-2">
            <input
              type="file"
              id="file"
              accept=".xlsx,.xls,.csv"
              {...register('file', {
                required: 'Please select a file to upload',
                validate: {
                  validFile: (files) => {
                    if (!files || files.length === 0) return 'Please select a file';
                    const file = files[0];
                    return validateFile(file) || true;
                  }
                }
              })}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent/20 file:text-accent/80 hover:file:bg-accent hover:file:text-white border border-gray-300 rounded-lg cursor-pointer"
            />

            {errors.file && (
              <p className="text-sm text-red-600 mt-1">{errors.file.message}</p>
            )}

            {selectedFile && !errors.file && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Selected File: {selectedFile.name}</p>
                <p className="text-sm text-gray-600">Size:
                  {selectedFile.size > 1024 * 1024
                    ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                    : `${(selectedFile.size / 1024).toFixed(2)} KB`
                  }
                </p>
                <p className="text-sm text-gray-600">Type: {getFileTypeLabel()}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUploading || !selectedFile}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Uploading...' : getButtonLabel()}
          </Button>
        </div>
        <div className='space-y-2'>
          <p className='text-xs'>NB: For uploaded images to match the respective {uploadType === 'products' ? 'product' : 'category'}, the file name of each image uploaded must match the {uploadType === 'products' ? 'product' : 'category'} code.</p>
          <button
            type="button"
            onClick={downloadInstructions}
            className="flex items-center text-sm text-accent/80 hover:text-accent transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 mr-1" />
            Download Instructions
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadBulkForm;