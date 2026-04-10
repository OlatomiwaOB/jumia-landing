import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { uploadClient } from '@/data/client/upload';

export const useBulkUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [fileUrl, setFileUrl] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setFileError('');
    
    if (!files || files.length === 0) {
      resetFileInput();
      return;
    }

    const file = files[0];

    const validTypes = [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/csv',
      'application/csv'
    ];

    if (!validTypes.includes(file.type)) {
      setFileError('Only Excel (.xls, .xlsx) or CSV files are allowed');
      resetFileInput();
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('File size must be less than 10MB');
      resetFileInput();
      return;
    }

    setSelectedFile(files);
  };

  const uploadFile = async () => {
    if (!selectedFile || selectedFile.length === 0) {
      setFileError('No file selected');
      return null;
    }

    setIsUploadingFile(true);
    try {
      const response = await uploadClient.upload(Array.from(selectedFile));
      const filename = (response.data as { refNo?: any })?.refNo;
      setFileUrl(filename);
      toast.success("File uploaded successfully");
      return filename;
    } catch (err) {
      console.error('Upload error:', err);
      toast.error("File upload failed!");
      setFileUrl('');
      return null;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const resetFileInput = () => {
    setSelectedFile(null);
    setFileUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    fileInputRef,
    selectedFile,
    fileError,
    fileUrl,
    isUploadingFile,
    setFileError,
    handleFileChange,
    uploadFile,
    resetFileInput
  };
};