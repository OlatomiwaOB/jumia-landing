// hooks/useFileUpload.ts
import { useState, useRef, useEffect } from 'react';
import { useHandleImageUpload } from '@/app/hooks/handleUpload';
import { toast } from 'sonner';

export const useFileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [fileUrl, setFileUrl] = useState('');
  const [hasNewImage, setHasNewImage] = useState(false);
  const [fileType, setFileType] = useState<'image' | 'document' | null>(null); // Add this state
  const mutateFile = useHandleImageUpload()
  const isUploadingFile = mutateFile?.isPending

  // console.log(fileUrl);
  
  // Helper function to determine if file is an image
  const isImageFile = (mimeType: string) => {
    return ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'].includes(mimeType);
  };

   // ✅ Prevent SSR mismatch by running browser-only logic after hydration
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    originalImageUrl?: string
  ) => {
    const file = event?.target?.files;
    const name = event?.target?.name
    if (file?.length) {
      mutateFile?.mutate(
        {image:file[0],fileType:file[0].type},
        {
          onSuccess: (response) => {
            if (response) {
              if (response?.data.desc.includes('SUCCESS')) {
                setFileUrl(response?.data?.refNo)
                toast.success(response?.data?.desc)
              } else {
                toast.error(response.data.desc);
              }
            }
          },
        }
      )
    }
    setFileError('');
    
    if (!file || file.length === 0) {
      setSelectedFile(null);
      setFileUrl('');
      setHasNewImage(false);
      setFileType(null); // Reset file type
      
      // Revert to original image if available
      if (originalImageUrl) {
        setPreviewUrl(originalImageUrl);
        setFileType('image');
      } else {
        setPreviewUrl(null);
      }
      return;
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file[0].type)) {
      toast.error("'Only JPG, PNG, PDF, and DOC files are allowed'")
      setFileError('Only JPG, PNG, PDF, and DOC files are allowed');
      resetFileInput(originalImageUrl);
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file[0].size > maxSize) {
      setFileError('File size must be less than 5MB');
      resetFileInput(originalImageUrl);
      return;
    }

    setSelectedFile(file);
    
    // Determine file type and set preview accordingly
    if (isImageFile(file[0].type)) {
      setFileType('image');
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file[0]);
    } else {
      setFileType('document');
      // For documents, set a placeholder or document icon
      setPreviewUrl('document'); // You can use this as a flag to show document icon
    }
    
    setHasNewImage(true);
  };

  const resetFileInput = (originalImageUrl?: string) => {
    setSelectedFile(null);
    setFileUrl('');
    setHasNewImage(false);
    setFileType(null); // Reset file type
    
    if (originalImageUrl) {
      setPreviewUrl(originalImageUrl);
      setFileType('image');
    } else {
      setPreviewUrl(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const setInitialImage = (imageUrl: string) => {
    setPreviewUrl(imageUrl);
    setSelectedFile(null);
    setFileUrl('');
    setHasNewImage(false);
    setFileError('');
    setFileType('image'); // Set as image type
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    fileInputRef,
    selectedFile,
    previewUrl,
    fileError,
    fileUrl,
    isUploadingFile,
    hasNewImage,
    setFileError,
    fileType,
    handleFileChange,
    resetFileInput,
    setInitialImage,
    setPreviewUrl,
    setFileUrl
  };
};