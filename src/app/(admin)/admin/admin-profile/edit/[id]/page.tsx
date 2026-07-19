'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, MapPin, User, FileText, Trash2, Eye, Image as ImageIcon, Globe, Building, Info, AlertCircle, X, Upload, File, Loader2 } from 'lucide-react';
import useUser from '@/store/userStore';
import axiosInstance from '@/utils/fetch-function';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useGetLookup from '@/app/hooks/useGetLookup';
import { SelectOption } from '@/types';
import { logout } from '@/utils/auth-utils';
import { usePermission } from '@/hooks/usePermissionBusiness';
import { useLocationStore } from '@/store/locationStore'
import { Checkbox } from '@/components/ui/checkbox'

const extractFilenameFromUrl = (url: string): string => {
  if (!url) return '';

  if (url.startsWith('/') && !url.startsWith('http')) {
    return url;
  }

  if (url.startsWith('http')) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname;
    } catch (e) {
      console.error('Error parsing URL:', e);
      const matches = url.match(/\/([^\/]+)$/);
      return matches ? `/${matches[1]}` : url;
    }
  }

  return url;
};

const getPreviewUrl = (filePath: string): string => {
  if (!filePath) return '';

  if (filePath.startsWith('http')) {
    return filePath;
  }

  if (filePath.startsWith('/')) {
    return `${S3_BASE_URL}${filePath}`;
  }

  return `${S3_BASE_URL}/${filePath}`;
};

const S3_BASE_URL = 'https://mmcpdocs.s3.eu-west-2.amazonaws.com';

const SimpleFileUpload = ({
  onFileSelect,
  currentFileUrl,
  accept = "image/*",
  label = "File",
  isUploading = false
}: {
  onFileSelect: (file: File | null) => void;
  currentFileUrl?: string;
  accept?: string;
  label?: string;
  isUploading?: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (currentFileUrl) {
      setPreview(getPreviewUrl(currentFileUrl));
    }
  }, [currentFileUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const fileType = file.type;
      const isImage = fileType.startsWith('image/');
      const isPdf = fileType === 'application/pdf';
      const isDoc = fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      if (!isImage && !isPdf && !isDoc) {
        toast.error('Only images, PDF, and DOC files are allowed');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      if (isImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview('document');
      }

      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      <div
        className="border-2 border-dashed border-accent/20 rounded-lg p-4 hover:border-accent/40 transition-colors cursor-pointer relative"
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        )}

        {preview ? (
          <div className="relative">
            {preview === 'document' ? (
              <div className="flex flex-col items-center justify-center py-8">
                <File className="w-12 h-12 text-accent/50 mb-2" />
                <p className="text-sm text-accent-foreground/70">Document uploaded</p>
                <p className="text-xs text-muted-foreground mt-1">Click to change</p>
              </div>
            ) : (
              <div className="relative w-full h-32 bg-accent/5 rounded-lg overflow-hidden">
                <img
                  src={getPreviewUrl(preview)}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error('Image failed to load:', preview);
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                  }}
                />
                {!isUploading && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove();
                    }}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Upload className="w-8 h-8 mx-auto mb-2 text-accent/50" />
            <p className="text-sm text-accent-foreground/70">Click to upload {label}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {accept.includes('image') ? 'JPG, PNG, GIF' : 'PDF, DOC, Images'}
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

interface StoreFormData {
  id: number;
  entityCode: string;
  code: string;
  storeName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  businessType: string;
  logo: string;
  backgroundLogo: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number;
  telephone: string | null;
  email: string;
  manager: string;
  website: string | null;
  merchantCode: string | null;
  status: string;
  documents: Document[];
  businessDescription?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  following?: string;
  followers?: string;
  likes?: string;
  subscriptionType?: string;
  subscriptionTierCode?: string;
  backgroundColor?: string | null;
  workingTime?: string | null;
  tags?: string | null;
}

interface Document {
  id: number;
  type: string;
  link: string;
  title: string;
  comment: string | null;
  verifier: string;
  createdDate: string;
  verifiedDate: string | null;
  verifyStatus: string;
}

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];

const COUNTRY_OPTIONS = [
  { value: 'NG', label: 'Nigeria' },
  { value: 'GH', label: 'Ghana' },
  { value: 'KE', label: 'Kenya' },
  { value: 'ZA', label: 'South Africa' }
];

export default function EditStorePage() {
  // const { usePermissionGuard } = usePermission();

  // usePermissionGuard('EDIT_PROFILE', {
  //   redirectToNotPermitted: true,
  //   toastMessage: "You don't have permission to edit profile."
  // });
  const searchParams = useSearchParams();
  const storeCode = searchParams.get('id');
  const { user } = useUser();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const [isUploadingCac, setIsUploadingCac] = useState(false);
  const [isUploadingId, setIsUploadingId] = useState(false);

  const [activeTab, setActiveTab] = useState('basic');

  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const {
    location,
    isLocationLoading,
    locationError,
    setLocation,
    setLocationLoading,
    setLocationError,
    setLocationPermission
  } = useLocationStore()

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    setLocationLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        }

        setLocation(locationData)
        setLocationPermission(true)

        setFormData(prev => ({
          ...prev,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        }))

        setUseCurrentLocation(false)
      },
      (error) => {
        setLocationPermission(false)
        setUseCurrentLocation(false)

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access in your browser settings.')
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.')
            break
          case error.TIMEOUT:
            setLocationError('The request to get your location timed out.')
            break
          default:
            setLocationError('An unknown error occurred while getting your location.')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleUseCurrentLocationChange = (checked: boolean) => {
    setUseCurrentLocation(checked)
    if (checked) {
      getCurrentLocation()
    }
  }

  useEffect(() => {
    if (location && !formData.latitude && !formData.longitude) {
      setFormData(prev => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      }))
    }
  }, [location])

  const businessTypeOptions: SelectOption[] = useGetLookup('BUSINESS_TYPE');
  const [areLookupsReady, setAreLookupsReady] = useState(false);

  useEffect(() => {
    const requiredLookupsLoaded =
      businessTypeOptions.length > 0;

    if (requiredLookupsLoaded) {
      setAreLookupsReady(true);
    } else {
      const timer = setTimeout(() => {
        console.warn('Lookups taking too long, proceeding anyway');
        setAreLookupsReady(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [
    businessTypeOptions,
  ]);

  const [formData, setFormData] = useState<StoreFormData>({
    id: 0,
    entityCode: '',
    code: '',
    storeName: '',
    address: '',
    city: '',
    state: '',
    country: 'NG',
    businessType: '',
    logo: '',
    backgroundLogo: null,
    latitude: null,
    longitude: null,
    distanceKm: 0,
    telephone: null,
    email: '',
    manager: '',
    website: null,
    merchantCode: null,
    status: 'Active',
    documents: [],
    businessDescription: null,
    instagram: null,
    facebook: null,
    tiktok: null,
    following: '0',
    followers: '0',
    likes: '0',
    subscriptionType: 'YEARLY',
    subscriptionTierCode: 'PREMIUM',
    backgroundColor: null,
    workingTime: null,
    tags: null,
  });

  const { data: storeData, isLoading: isLoadingStore } = useQuery({
    queryKey: ['store-detail', storeCode],
    queryFn: () => axiosInstance.request({
      url: '/store/fetch-store-detail',
      method: 'GET',
      params: {
        storeCode: storeCode
      }
    }),
    enabled: !!storeCode,
  });

  useEffect(() => {
    if (storeData?.data) {
      const store = storeData.data;

      setFormData({
        id: store.id || 0,
        entityCode: store.entityCode || user?.entityCode || '',
        code: store.code || '',
        storeName: store.storeName || '',
        address: store.address || '',
        city: store.city || '',
        state: store.state || '',
        country: store.country || 'NG',
        businessType: store.businessType || '',
        logo: extractFilenameFromUrl(store.logo || ''),
        backgroundLogo: extractFilenameFromUrl(store.backgroundLogo || ''),
        latitude: store.latitude || null,
        longitude: store.longitude || null,
        distanceKm: store.distanceKm || 0,
        telephone: store.telephone || null,
        email: store.email || '',
        manager: store.manager || '',
        website: store.website || null,
        merchantCode: store.merchantCode || null,
        status: store.status || 'Active',
        documents: store.documents?.map((doc: Document) => ({
          ...doc,
          link: extractFilenameFromUrl(doc.link)
        })) || [],
        businessDescription: store.businessDescription || null,
        instagram: store.instagram || null,
        facebook: store.facebook || null,
        tiktok: store.tiktok || null,
        following: store.following || '0',
        followers: store.followers || '0',
        likes: store.likes || '0',
        subscriptionType: store.subscriptionType || 'YEARLY',
        subscriptionTierCode: store.subscriptionTierCode || 'PREMIUM',
        backgroundColor: store.backgroundColor || null,
        workingTime: store.workingTime || null,
        tags: store.tags || null,
      });
    }
  }, [storeData, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseFloat(value) : null
    }));
  };

  const isLookupsLoading = !areLookupsReady;


  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/fileuploadservice/uploadfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          entityCode: user?.entityCode,
          storeCode: storeCode,
          FILETYPE: 'STORE_IMAGE'
        }
      });

      if (response.data?.code === '000') {
        return `/${response.data.id}`;
      } else {
        throw new Error(response.data?.desc || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const uploadDocument = async (file: File, type: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/fileuploadservice/uploadfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          entityCode: user?.entityCode,
          storeCode: storeCode,
          FILETYPE: 'STORE_DOCUMENT'
        }
      });

      if (response.data?.code === '000') {
        return `/${response.data.id}`;
      } else {
        throw new Error(response.data?.desc || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  const handleLogoSelect = async (file: File | null) => {
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const uploadedUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, logo: uploadedUrl }));
      toast.success('Logo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleBackgroundSelect = async (file: File | null) => {
    if (!file) return;

    setIsUploadingBackground(true);
    try {
      const uploadedUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, backgroundLogo: uploadedUrl }));
      toast.success('Background image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload background image');
    } finally {
      setIsUploadingBackground(false);
    }
  };

  const handleCacDocumentSelect = async (file: File | null) => {
    if (!file) return;

    setIsUploadingCac(true);
    try {
      const uploadedUrl = await uploadDocument(file, 'CAC Document');

      const existingCacIndex = formData.documents.findIndex(doc => doc.type === 'CAC Document');

      const cacDocument: Document = {
        id: existingCacIndex >= 0 ? formData.documents[existingCacIndex].id : Date.now(),
        type: 'CAC Document',
        link: uploadedUrl,
        title: 'Company Registration Document',
        comment: '',
        verifier: user?.username || '',
        createdDate: new Date().toLocaleDateString('en-GB'),
        verifiedDate: null,
        verifyStatus: existingCacIndex >= 0 ? formData.documents[existingCacIndex].verifyStatus : 'N'
      };

      setFormData(prev => {
        const updatedDocuments = [...prev.documents];
        if (existingCacIndex >= 0) {
          updatedDocuments[existingCacIndex] = cacDocument;
        } else {
          updatedDocuments.push(cacDocument);
        }
        return { ...prev, documents: updatedDocuments };
      });

      toast.success('CAC document uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload CAC document');
    } finally {
      setIsUploadingCac(false);
    }
  };

  const handleIdentificationSelect = async (file: File | null) => {
    if (!file) return;

    setIsUploadingId(true);
    try {
      const uploadedUrl = await uploadDocument(file, 'NIN/Driver License');

      const existingIdIndex = formData.documents.findIndex(doc => doc.type === 'NIN/Driver License');

      const identificationDocument: Document = {
        id: existingIdIndex >= 0 ? formData.documents[existingIdIndex].id : Date.now(),
        type: 'NIN/Driver License',
        link: uploadedUrl,
        title: 'Business Owner Identification',
        comment: '',
        verifier: user?.username || '',
        createdDate: new Date().toLocaleDateString('en-GB'),
        verifiedDate: null,
        verifyStatus: existingIdIndex >= 0 ? formData.documents[existingIdIndex].verifyStatus : 'N'
      };

      setFormData(prev => {
        const updatedDocuments = [...prev.documents];
        if (existingIdIndex >= 0) {
          updatedDocuments[existingIdIndex] = identificationDocument;
        } else {
          updatedDocuments.push(identificationDocument);
        }
        return { ...prev, documents: updatedDocuments };
      });

      toast.success('Identification document uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload identification document');
    } finally {
      setIsUploadingId(false);
    }
  };

  const handleDocumentTextChange = (type: 'cacDocument' | 'identification', field: string, value: string) => {
    const documentType = type === 'cacDocument' ? 'CAC Document' : 'NIN/Driver License';
    const existingDocIndex = formData.documents.findIndex(doc => doc.type === documentType);

    if (existingDocIndex >= 0) {
      setFormData(prev => {
        const updatedDocuments = [...prev.documents];
        updatedDocuments[existingDocIndex] = {
          ...updatedDocuments[existingDocIndex],
          [field]: value
        };
        return { ...prev, documents: updatedDocuments };
      });
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case 'Y':
        return <Badge className="bg-green-500 text-white text-xs">Approved</Badge>;
      case 'N':
        return <Badge className="bg-yellow-500 text-white text-xs">Pending</Badge>;
      case 'R':
        return <Badge className="bg-red-500 text-white text-xs">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white text-xs">Unknown</Badge>;
    }
  };

  const updateStoreMutation = useMutation({
    mutationFn: async (storeData: StoreFormData) => {
      const updatedStoreData = {
        ...storeData,
        id: storeData.id,
      };

      Object.keys(updatedStoreData).forEach(key => {
        if (updatedStoreData[key as keyof typeof updatedStoreData] === undefined) {
          (updatedStoreData as any)[key] = null;
        }
      });

      return axiosInstance.post('/store/save', updatedStoreData);
    },
    onSuccess: (response) => {
      if (response.data?.code !== '000') {
        toast.error(response.data?.desc || 'Failed to update store');
      } else {
        toast.success('Store updated successfully');
        router.push('/admin-profile');
        setTimeout(() => {
          toast.message('You will be logged out shortly')
        }, 3000);
        setTimeout(() => {
          logout();
        }, 7000);
      }
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update store');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreMutation.mutate(formData);
  };

  const findLookupOption = (options: SelectOption[], value: string | null) => {
    if (!value) return null;
    return options.find(option => option.id === value);
  };

  const getSelectDisplayValue = (options: SelectOption[], value: string | null) => {
    if (!value) return '';
    const option = findLookupOption(options, value);
    return option ? option.name : value;
  };

  if (isLoadingStore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              <p className="text-gray-500">Loading store data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!storeCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
            <CardDescription className="text-center">
              Store code is required
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => router.push('/admin/admin-profile')} className="mt-4">
              Back to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (storeCode !== user?.storeCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-600">NOT YOUR STORE!</CardTitle>
            <CardDescription className="text-center">
              Please reach out to support if this is a mistake, else you will be restricted for fraud suspicions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => router.push('/admin-profile')} className="mt-4">
              Back to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cacDocument = formData.documents.find(doc => doc.type === 'CAC Document');
  const identificationDocument = formData.documents.find(doc => doc.type === 'NIN/Driver License');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className='mb-4'>
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/admin-profile')}
            className="flex items-center gap-2 text-muted-foreground hover:text-white w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Building className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Edit Store: {formData.storeName || 'Store'}
              </h1>
              <p className="text-sm text-gray-500">Store Code: {formData.code}</p>
            </div>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:w-auto lg:inline-flex mb-6">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">Basic Info</span>
              </TabsTrigger>
              <TabsTrigger value="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Location</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Media</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Documents</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Social</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Update the core details of your store
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="storeName" className="flex items-center gap-1 text-sm font-medium">
                        <span>Store Name</span>
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="storeName"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleInputChange}
                        placeholder="Enter store name"
                        required
                        className="focus-visible:ring-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessType" className="text-sm font-medium">Business Type</Label>
                      {isLookupsLoading ? (
                        <div className="flex items-center gap-2 p-3 border border-accent/20 rounded-md bg-accent/5 animate-pulse">
                          <Loader2 className="h-4 w-4 animate-spin text-accent-foreground/70" />
                          <span className="text-sm text-accent-foreground/70">Loading roles...</span>
                        </div>
                      ) : (
                        <Select
                          value={formData.businessType}
                          onValueChange={(value) => handleSelectChange('businessType', value)}
                        >
                          <SelectTrigger className="border-accent/20">
                            <SelectValue placeholder="Select business type">
                              {getSelectDisplayValue(businessTypeOptions, formData.businessType) || "Select business type"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {businessTypeOptions.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="businessDescription" className="text-sm font-medium">Store Description</Label>
                      <Textarea
                        id="businessDescription"
                        name="businessDescription"
                        value={formData.businessDescription || ''}
                        onChange={handleInputChange}
                        placeholder="Describe your store, products, and services"
                        rows={4}
                        maxLength={200}
                        className="focus-visible:ring-accent resize-none"
                      />
                      <p className="text-xs text-gray-500">
                        A brief description of your store (max 200 characters)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        className="focus-visible:ring-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telephone" className="text-sm font-medium">Telephone</Label>
                      <Input
                        id="telephone"
                        name="telephone"
                        value={formData.telephone || ''}
                        onChange={handleInputChange}
                        placeholder="Enter telephone number"
                        className="focus-visible:ring-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manager" className="text-sm font-medium">Manager</Label>
                      <Input
                        id="manager"
                        name="manager"
                        value={formData.manager || ''}
                        onChange={handleInputChange}
                        placeholder="Enter manager name"
                        className="focus-visible:ring-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        value={formData.website || ''}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        className="focus-visible:ring-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleSelectChange('status', value)}
                      >
                        <SelectTrigger className="focus-visible:ring-accent">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="workingTime" className="text-sm font-medium">Working Hours</Label>
                      <Input
                        id="workingTime"
                        name="workingTime"
                        value={formData.workingTime || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., Mon-Fri 9am-6pm"
                        className="focus-visible:ring-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
                      <Input
                        id="tags"
                        name="tags"
                        value={formData.tags || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., popular, new, featured"
                        className="focus-visible:ring-accent"
                      />
                      <p className="text-xs text-gray-500">Comma-separated tags</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    Location Information
                  </CardTitle>
                  <CardDescription>
                    Update your store's physical location and coordinates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="flex items-center gap-1 text-sm font-medium">
                        <span>Address</span>
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter store address"
                        required
                        className="focus-visible:ring-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        className="focus-visible:ring-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state || ''}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                        className="focus-visible:ring-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => handleSelectChange('country', value)}
                      >
                        <SelectTrigger className="focus-visible:ring-accent">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRY_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="use-current-location"
                          checked={useCurrentLocation}
                          onCheckedChange={handleUseCurrentLocationChange}
                          className="border-accent data-[state=checked]:bg-accent data-[state=checked]:text-white"
                        />
                        <Label
                          htmlFor="use-current-location"
                          className="text-sm font-medium cursor-pointer"
                        >
                          Use my current location
                        </Label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="latitude" className="text-sm font-medium">
                            Latitude
                            {isLocationLoading && (
                              <Loader2 className="ml-2 h-3 w-3 inline animate-spin" />
                            )}
                          </Label>
                          <Input
                            id="latitude"
                            name="latitude"
                            type="number"
                            step="any"
                            value={formData.latitude || ''}
                            onChange={handleNumberChange}
                            placeholder="e.g., 6.5244"
                            className="focus-visible:ring-accent"
                            disabled={isLocationLoading}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="longitude" className="text-sm font-medium">
                            Longitude
                            {isLocationLoading && (
                              <Loader2 className="ml-2 h-3 w-3 inline animate-spin" />
                            )}
                          </Label>
                          <Input
                            id="longitude"
                            name="longitude"
                            type="number"
                            step="any"
                            value={formData.longitude || ''}
                            onChange={handleNumberChange}
                            placeholder="e.g., 3.3792"
                            className="focus-visible:ring-accent"
                            disabled={isLocationLoading}
                          />
                        </div>
                      </div>

                      {locationError && (
                        <p className="text-sm text-destructive">{locationError}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-accent" />
                    Store Media
                  </CardTitle>
                  <CardDescription>
                    Upload store logo and background image
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-md font-medium text-accent-foreground mb-2">Store Logo</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Upload a square image for best results
                        </p>
                      </div>

                      <SimpleFileUpload
                        onFileSelect={handleLogoSelect}
                        currentFileUrl={formData.logo}
                        accept="image/*"
                        label="Store Logo"
                        isUploading={isUploadingLogo}
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-md font-medium text-accent-foreground mb-2">Background Image</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Upload a cover image for your store
                        </p>
                      </div>

                      <SimpleFileUpload
                        onFileSelect={handleBackgroundSelect}
                        currentFileUrl={formData.backgroundLogo || ''}
                        accept="image/*"
                        label="Background Image"
                        isUploading={isUploadingBackground}
                      />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-accent/5 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-accent-foreground">Image Guidelines</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended sizes: Logo - 500x500px, Background - 1920x400px.
                          Supported formats: JPG, PNG, GIF, WebP
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    Store Documents
                  </CardTitle>
                  <CardDescription>
                    Upload and manage verification documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-accent" />
                      </div>
                      <h3 className="text-lg font-medium">CAC Document</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Upload CAC Document</Label>
                          <SimpleFileUpload
                            onFileSelect={handleCacDocumentSelect}
                            currentFileUrl={cacDocument?.link}
                            accept="image/*,.pdf,.doc,.docx"
                            label="CAC Document"
                            isUploading={isUploadingCac}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cacTitle" className="text-sm font-medium">Document Title</Label>
                          <Input
                            id="cacTitle"
                            value={cacDocument?.title || ''}
                            onChange={(e) => handleDocumentTextChange('cacDocument', 'title', e.target.value)}
                            placeholder="Enter document title"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cacComment" className="text-sm font-medium">Comments</Label>
                          <Textarea
                            id="cacComment"
                            value={cacDocument?.comment || ''}
                            onChange={(e) => handleDocumentTextChange('cacDocument', 'comment', e.target.value)}
                            placeholder="Add any comments about this document"
                            rows={3}
                          />
                        </div>
                      </div> */}

                      <div className="space-y-4">
                        {cacDocument?.link && (
                          <>
                            <Label className="text-sm font-medium">Preview</Label>
                            <div className="border border-accent/20 rounded-lg p-4 bg-accent/5">
                              <div className="relative w-full h-48 bg-white rounded-md overflow-hidden">
                                {cacDocument.link.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                  <img
                                    src={getPreviewUrl(cacDocument.link)}
                                    alt="CAC Document Preview"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      console.error('Failed to load image:', cacDocument.link);
                                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center">
                                    <FileText className="w-12 h-12 text-accent/30 mb-2" />
                                    <p className="text-sm text-accent-foreground/70">Document uploaded</p>
                                  </div>
                                )}
                              </div>

                              <div className="mt-3 flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-1">
                                      <Eye className="w-3 h-3" />
                                      View Full
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle>CAC Document Preview</DialogTitle>
                                      <DialogDescription>
                                        Existing document
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="relative w-full h-[500px]">
                                      {cacDocument.link.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                        <img
                                          src={getPreviewUrl(cacDocument.link)}
                                          alt="CAC Document Full Preview"
                                          className="w-full h-full object-contain"
                                          onError={(e) => {
                                            console.error('Failed to load image:', cacDocument.link);
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500?text=Error';
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                          <p className="text-muted-foreground">
                                            Document cannot be previewed. Please download the file.
                                          </p>
                                          <a
                                            href={getPreviewUrl(cacDocument.link)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 text-accent hover:text-accent/80"
                                          >
                                            Download Document
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-accent" />
                      </div>
                      <h3 className="text-lg font-medium">Identification Document</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Upload Identification Document</Label>
                          <SimpleFileUpload
                            onFileSelect={handleIdentificationSelect}
                            currentFileUrl={identificationDocument?.link}
                            accept="image/*,.pdf,.doc,.docx"
                            label="Identification Document"
                            isUploading={isUploadingId}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="identificationTitle" className="text-sm font-medium">Document Title</Label>
                          <Input
                            id="identificationTitle"
                            value={identificationDocument?.title || ''}
                            onChange={(e) => handleDocumentTextChange('identification', 'title', e.target.value)}
                            placeholder="Enter document title"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="identificationComment" className="text-sm font-medium">Comments</Label>
                          <Textarea
                            id="identificationComment"
                            value={identificationDocument?.comment || ''}
                            onChange={(e) => handleDocumentTextChange('identification', 'comment', e.target.value)}
                            placeholder="Add any comments about this document"
                            rows={3}
                          />
                        </div>
                      </div> */}

                      <div className="space-y-4">
                        {identificationDocument?.link && (
                          <>
                            <Label className="text-sm font-medium">Preview</Label>
                            <div className="border border-accent/20 rounded-lg p-4 bg-accent/5">
                              <div className="relative w-full h-48 bg-white rounded-md overflow-hidden">
                                {identificationDocument.link.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                  <img
                                    src={getPreviewUrl(identificationDocument.link)}
                                    alt="Identification Document Preview"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      console.error('Failed to load image:', identificationDocument.link);
                                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center">
                                    <FileText className="w-12 h-12 text-accent/30 mb-2" />
                                    <p className="text-sm text-accent-foreground/70">Document uploaded</p>
                                  </div>
                                )}
                              </div>

                              <div className="mt-3 flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-1">
                                      <Eye className="w-3 h-3" />
                                      View Full
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle>Identification Document Preview</DialogTitle>
                                      <DialogDescription>
                                        Existing document
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="relative w-full h-[500px]">
                                      {identificationDocument.link.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                        <img
                                          src={getPreviewUrl(identificationDocument.link)}
                                          alt="Identification Document Full Preview"
                                          className="w-full h-full object-contain"
                                          onError={(e) => {
                                            console.error('Failed to load image:', identificationDocument.link);
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500?text=Error';
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                          <p className="text-muted-foreground">
                                            Document cannot be previewed. Please download the file.
                                          </p>
                                          <a
                                            href={getPreviewUrl(identificationDocument.link)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 text-accent hover:text-accent/80"
                                          >
                                            Download Document
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {formData.documents.filter(doc => doc.type !== 'CAC Document' && doc.type !== 'NIN/Driver License').length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Other Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formData.documents
                            .filter(doc => doc.type !== 'CAC Document' && doc.type !== 'NIN/Driver License')
                            .map((doc, index) => (
                              <div key={doc.id} className="border border-accent/20 rounded-lg p-4 bg-white">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <p className="text-sm font-medium text-accent-foreground">{doc.type}</p>
                                    <p className="text-xs text-accent-foreground/70 mt-1">
                                      Created: {doc.createdDate}
                                    </p>
                                    {doc.verifiedDate && (
                                      <p className="text-xs text-accent-foreground/70 mt-1">
                                        Verified: {doc.verifiedDate}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getDocumentStatusBadge(doc.verifyStatus)}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeDocument(index)}
                                      className="h-8 w-8 p-0 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                </div>

                                {doc.title && (
                                  <p className="text-sm text-accent-foreground mb-2">{doc.title}</p>
                                )}

                                {doc.comment && (
                                  <div className="mb-2 p-2 bg-gray-50 rounded">
                                    <p className="text-xs font-medium text-accent-foreground">Comment:</p>
                                    <p className="text-xs text-accent-foreground/70">{doc.comment}</p>
                                  </div>
                                )}

                                {doc.link && (
                                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-accent/10">
                                    <a
                                      href={getPreviewUrl(doc.link)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-accent hover:text-accent/80 flex items-center gap-1"
                                    >
                                      <Eye className="w-3 h-3" />
                                      View Document
                                    </a>
                                    <Badge variant="outline" className="text-xs">
                                      {doc.link.split('.').pop()?.toUpperCase() || 'FILE'}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-accent" />
                    Social Media Links
                  </CardTitle>
                  <CardDescription>
                    Add your store's social media profiles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-sm font-medium">Instagram</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                        <Input
                          id="instagram"
                          name="instagram"
                          value={formData.instagram || ''}
                          onChange={handleInputChange}
                          placeholder="username"
                          className="pl-8 focus-visible:ring-accent"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facebook" className="text-sm font-medium">Facebook</Label>
                      <Input
                        id="facebook"
                        name="facebook"
                        value={formData.facebook || ''}
                        onChange={handleInputChange}
                        placeholder="facebook.com/yourpage"
                        className="focus-visible:ring-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tiktok" className="text-sm font-medium">TikTok</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                        <Input
                          id="tiktok"
                          name="tiktok"
                          value={formData.tiktok || ''}
                          onChange={handleInputChange}
                          placeholder="username"
                          className="pl-8 focus-visible:ring-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-accent/5 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-accent-foreground">Social Media Tips</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Add your social media handles to help customers connect with you on their preferred platforms.
                          This will be displayed on your store profile.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/admin-profile')}
              className="flex items-center gap-2 order-2 sm:order-1 hover:text-(var[--sidebar-text])"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateStoreMutation.isPending || isUploadingLogo || isUploadingBackground || isUploadingCac || isUploadingId}
              className="gap-2 bg-accent hover:bg-accent/90 text-(var[--sidebar-text]) order-1 sm:order-2"
            >
              {updateStoreMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Store
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}