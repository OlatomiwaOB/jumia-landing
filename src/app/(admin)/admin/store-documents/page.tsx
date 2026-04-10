'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, FileText, Upload, CheckCircle, XCircle, AlertCircle, Download, Eye } from 'lucide-react';
import useUser from '@/store/userStore';
import axiosInstance from '@/utils/fetch-function';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import FileUpload from '@/components/Admin/inventories/file-input';
import { useFileUpload } from '@/app/hooks/useUpload';
import { fileUrlFormatted } from '@/utils/helperfns';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    latitude: number;
    longitude: number;
    distanceKm: number;
    telephone: string;
    email: string;
    manager: string;
    website: string;
    merchantCode: string;
    status: string;
    documents: Document[];
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

interface DocumentUploadData {
    file: File | null;
    previewUrl: string | null;
    type: string;
    link: string;
    title: string;
    comment: string;
}

export default function StoreKYCPage() {
    const searchParams = useSearchParams();
    const { user } = useUser();
    const storeCode = user?.storeCode
    const router = useRouter();

    const [formData, setFormData] = useState<StoreFormData>({
        id: 0,
        entityCode: '',
        code: '',
        storeName: '',
        address: '',
        city: '',
        state: '',
        country: '',
        businessType: '',
        logo: '',
        latitude: 0,
        longitude: 0,
        distanceKm: 0,
        telephone: '',
        email: '',
        manager: '',
        website: '',
        merchantCode: '',
        status: 'ACTIVE',
        documents: [],
    });

    const [documentUploads, setDocumentUploads] = useState<{
        cacDocument: DocumentUploadData;
        identification: DocumentUploadData;
    }>({
        cacDocument: {
            file: null,
            previewUrl: null,
            type: 'CAC Document',
            link: '',
            title: 'Company Registration Document',
            comment: '',
        },
        identification: {
            file: null,
            previewUrl: null,
            type: 'NIN/Driver License',
            link: '',
            title: 'Business Owner Identification',
            comment: '',
        },
    });

    const [activeTab, setActiveTab] = useState<'cac' | 'identification'>('cac');
    const [isUploading, setIsUploading] = useState(false);

    const { data: storeData, isLoading: isLoadingStore, refetch } = useQuery({
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
                country: store.country || '',
                businessType: store.businessType || '',
                logo: store.logo || '',
                latitude: store.latitude || 0,
                longitude: store.longitude || 0,
                distanceKm: store.distanceKm || 0,
                telephone: store.telephone || '',
                email: store.email || '',
                manager: store.manager || '',
                website: store.website || '',
                merchantCode: store.merchantCode || user?.merchantCode || '',
                status: store.status || 'ACTIVE',
                documents: store.documents || [],
            });

            if (store.documents && store.documents.length > 0) {
                const cacDoc = store.documents.find(doc => doc.type === 'CAC Document');
                const identificationDoc = store.documents.find(doc => doc.type === 'NIN/Driver License');

                if (cacDoc) {
                    setDocumentUploads(prev => ({
                        ...prev,
                        cacDocument: {
                            ...prev.cacDocument,
                            link: cacDoc.link,
                            previewUrl: cacDoc.link,
                            title: cacDoc.title || 'Company Registration Document',
                            comment: cacDoc.comment || '',
                        }
                    }));
                }

                if (identificationDoc) {
                    setDocumentUploads(prev => ({
                        ...prev,
                        identification: {
                            ...prev.identification,
                            link: identificationDoc.link,
                            previewUrl: identificationDoc.link,
                            title: identificationDoc.title || 'Business Owner Identification',
                            comment: identificationDoc.comment || '',
                        }
                    }));
                }
            }
        }
    }, [storeData, user]);

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

    const uploadDocument = async (file: File, type: 'CAC Document' | 'NIN/Driver License'): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('storeCode', storeCode || '');

        try {
            const response = await axiosInstance.post('/store/upload-document', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data?.code === '000' && response.data?.data?.link) {
                return response.data.data.link;
            } else {
                throw new Error(response.data?.desc || 'Failed to upload document');
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            throw error;
        }
    };

    const handleDocumentFileChange = (type: 'cacDocument' | 'identification', file: File | null) => {
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setDocumentUploads(prev => ({
                ...prev,
                [type]: {
                    ...prev[type],
                    file,
                    previewUrl,
                }
            }));
        }
    };

    const handleDocumentTextChange = (type: 'cacDocument' | 'identification', field: string, value: string) => {
        setDocumentUploads(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value
            }
        }));
    };

    const updateStoreDocuments = useMutation({
        mutationFn: async () => {
            const updatedDocuments = [...formData.documents];

            if (documentUploads.cacDocument.file) {
                try {
                    const cacLink = await uploadDocument(documentUploads.cacDocument.file, 'CAC Document');

                    const existingCacIndex = updatedDocuments.findIndex(doc => doc.type === 'CAC Document');

                    const cacDocument: Document = {
                        id: existingCacIndex >= 0 ? updatedDocuments[existingCacIndex].id : Date.now(),
                        type: 'CAC Document',
                        link: cacLink,
                        title: documentUploads.cacDocument.title,
                        comment: documentUploads.cacDocument.comment,
                        verifier: user?.username || '',
                        createdDate: new Date().toISOString(),
                        verifiedDate: null,
                        verifyStatus: existingCacIndex >= 0 ? updatedDocuments[existingCacIndex].verifyStatus : 'N'
                    };

                    if (existingCacIndex >= 0) {
                        updatedDocuments[existingCacIndex] = cacDocument;
                    } else {
                        updatedDocuments.push(cacDocument);
                    }
                } catch (error) {
                    toast.error('Failed to upload CAC document');
                    throw error;
                }
            }

            if (documentUploads.identification.file) {
                try {
                    const identificationLink = await uploadDocument(documentUploads.identification.file, 'NIN/Driver License');

                    const existingIdIndex = updatedDocuments.findIndex(doc => doc.type === 'NIN/Driver License');

                    const identificationDocument: Document = {
                        id: existingIdIndex >= 0 ? updatedDocuments[existingIdIndex].id : Date.now(),
                        type: 'NIN/Driver License',
                        link: identificationLink,
                        title: documentUploads.identification.title,
                        comment: documentUploads.identification.comment,
                        verifier: user?.username || '',
                        createdDate: new Date().toISOString(),
                        verifiedDate: null,
                        verifyStatus: existingIdIndex >= 0 ? updatedDocuments[existingIdIndex].verifyStatus : 'N'
                    };

                    if (existingIdIndex >= 0) {
                        updatedDocuments[existingIdIndex] = identificationDocument;
                    } else {
                        updatedDocuments.push(identificationDocument);
                    }
                } catch (error) {
                    toast.error('Failed to upload identification document');
                    throw error;
                }
            }

            const updatedStoreData = {
                ...formData,
                documents: updatedDocuments,
            };

            return axiosInstance.put('/store/update', updatedStoreData);
        },
        onSuccess: () => {
            toast.success('Documents updated successfully');
            refetch();
            setIsUploading(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update documents');
            setIsUploading(false);
        }
    });

    const handleSaveDocument = () => {
        setIsUploading(true);
        updateStoreDocuments.mutate();
    };

    const getDocument = (type: 'CAC Document' | 'NIN/Driver License') => {
        return formData.documents.find(doc => doc.type === type);
    };

    const cacDocument = getDocument('CAC Document');
    const identificationDocument = getDocument('NIN/Driver License');

    const missingDocuments = [];
    if (!cacDocument) missingDocuments.push('CAC Document');
    if (!identificationDocument) missingDocuments.push('Identification Document');

    if (isLoadingStore) {
        return (
            <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Loading store data...</p>
                </div>
            </div>
        );
    }

    if (!storeCode) {
        return (
            <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Store code is required</p>
                    <Button onClick={() => router.push('/admin-profile')} className="mt-4">
                        Back to Profile
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    {""}
                    <div className="text-right">
                        <Badge className={`${missingDocuments.length === 0
                                ? 'bg-green-500'
                                : missingDocuments.length === 2
                                    ? 'bg-red-500'
                                    : 'bg-yellow-500'
                            } text-white`}>
                            {missingDocuments.length === 0
                                ? 'KYC Complete'
                                : `${missingDocuments.length} Document${missingDocuments.length > 1 ? 's' : ''} Missing`}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center justify-center mb-8">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-accent-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold text-accent-foreground">
                            Store KYC Documents
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {formData.storeName} - {formData.code}
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto">
                    {missingDocuments.length > 0 && (
                        <Card className="mb-6 border-yellow-200 bg-yellow-50">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-yellow-800">Documents Required</h3>
                                        <p className="text-sm text-yellow-600 mt-1">
                                            The following documents are missing: {missingDocuments.join(', ')}.
                                            Please upload them to complete your store KYC.
                                        </p>
                                        <div className="flex gap-2 mt-3">
                                            {missingDocuments.includes('CAC Document') && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setActiveTab('cac')}
                                                >
                                                    Add CAC Document
                                                </Button>
                                            )}
                                            {missingDocuments.includes('Identification Document') && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setActiveTab('identification')}
                                                >
                                                    Add Identification Document
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Document Status Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Document Status</CardTitle>
                                    <CardDescription>
                                        Review and manage your KYC documents
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className={`p-4 rounded-lg border ${cacDocument ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">CAC Document</h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Company registration document
                                                </p>
                                            </div>
                                            {cacDocument ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                        {cacDocument && (
                                            <div className="mt-3 flex items-center justify-between">
                                                {getDocumentStatusBadge(cacDocument.verifyStatus)}
                                                <span className="text-xs text-muted-foreground">
                                                    Uploaded: {new Date(cacDocument.createdDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`p-4 rounded-lg border ${identificationDocument ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">Identification</h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Business owner identification
                                                </p>
                                            </div>
                                            {identificationDocument ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                        {identificationDocument && (
                                            <div className="mt-3 flex items-center justify-between">
                                                {getDocumentStatusBadge(identificationDocument.verifyStatus)}
                                                <span className="text-xs text-muted-foreground">
                                                    Uploaded: {new Date(identificationDocument.createdDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {cacDocument && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">CAC Document</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">{cacDocument.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Verified by: {cacDocument.verifier || 'Pending'}
                                            </p>
                                            {cacDocument.comment && (
                                                <p className="text-xs text-muted-foreground">
                                                    Comment: {cacDocument.comment}
                                                </p>
                                            )}
                                            <div className="flex gap-2 mt-3">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="gap-1">
                                                            <Eye className="w-3 h-3" />
                                                            View
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-4xl">
                                                        <DialogHeader>
                                                            <DialogTitle>CAC Document</DialogTitle>
                                                            <DialogDescription>
                                                                {cacDocument.title}
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="relative w-full h-[500px]">
                                                            {cacDocument.link.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                                <img
                                                                    src={cacDocument.link}
                                                                    alt="CAC Document"
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex flex-col items-center justify-center">
                                                                    <FileText className="w-16 h-16 text-gray-400 mb-4" />
                                                                    <p className="text-muted-foreground mb-4">
                                                                        Document cannot be previewed. Please download the file.
                                                                    </p>
                                                                    <a
                                                                        href={cacDocument.link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-accent hover:text-accent/80"
                                                                    >
                                                                        Download Document
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                                <a href={cacDocument.link} download>
                                                    <Button variant="outline" size="sm" className="gap-1">
                                                        <Download className="w-3 h-3" />
                                                        Download
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {identificationDocument && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Identification</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">{identificationDocument.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Verified by: {identificationDocument.verifier || 'Pending'}
                                            </p>
                                            {identificationDocument.comment && (
                                                <p className="text-xs text-muted-foreground">
                                                    Comment: {identificationDocument.comment}
                                                </p>
                                            )}
                                            <div className="flex gap-2 mt-3">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="gap-1">
                                                            <Eye className="w-3 h-3" />
                                                            View
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-4xl">
                                                        <DialogHeader>
                                                            <DialogTitle>Identification Document</DialogTitle>
                                                            <DialogDescription>
                                                                {identificationDocument.title}
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="relative w-full h-[500px]">
                                                            {identificationDocument.link.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                                <img
                                                                    src={identificationDocument.link}
                                                                    alt="Identification Document"
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex flex-col items-center justify-center">
                                                                    <FileText className="w-16 h-16 text-gray-400 mb-4" />
                                                                    <p className="text-muted-foreground mb-4">
                                                                        Document cannot be previewed. Please download the file.
                                                                    </p>
                                                                    <a
                                                                        href={identificationDocument.link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-accent hover:text-accent/80"
                                                                    >
                                                                        Download Document
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                                <a href={identificationDocument.link} download>
                                                    <Button variant="outline" size="sm" className="gap-1">
                                                        <Download className="w-3 h-3" />
                                                        Download
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Document Upload Section */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {missingDocuments.length > 0 ? 'Upload Missing Documents' : 'Update Documents'}
                                    </CardTitle>
                                    <CardDescription>
                                        Upload or update your KYC documents
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'cac' | 'identification')}>
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="cac">CAC Document</TabsTrigger>
                                            <TabsTrigger value="identification">Identification</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="cac" className="space-y-6 pt-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Upload CAC Document *</Label>
                                                    <FileUpload
                                                        onFileSelect={(file) => handleDocumentFileChange('cacDocument', file)}
                                                        currentFileUrl={documentUploads.cacDocument.link}
                                                        accept="image/*,.pdf,.doc,.docx"
                                                        label="CAC Document"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Upload CAC certificate or business registration document (PDF, JPG, PNG)
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="cacTitle" className="text-sm font-medium">Document Title</Label>
                                                    <Input
                                                        id="cacTitle"
                                                        value={documentUploads.cacDocument.title}
                                                        onChange={(e) => handleDocumentTextChange('cacDocument', 'title', e.target.value)}
                                                        placeholder="Enter document title"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="cacComment" className="text-sm font-medium">Comments</Label>
                                                    <Textarea
                                                        id="cacComment"
                                                        value={documentUploads.cacDocument.comment}
                                                        onChange={(e) => handleDocumentTextChange('cacDocument', 'comment', e.target.value)}
                                                        placeholder="Add any comments about this document"
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>

                                            {documentUploads.cacDocument.previewUrl && (
                                                <div className="border border-accent/20 rounded-lg p-4">
                                                    <Label className="text-sm font-medium mb-3 block">Preview</Label>
                                                    <div className="relative w-full h-48">
                                                        {documentUploads.cacDocument.previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                            <img
                                                                src={documentUploads.cacDocument.previewUrl}
                                                                alt="CAC Document Preview"
                                                                className="w-full h-full object-contain rounded-md"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center bg-accent/5 rounded-md">
                                                                <FileText className="w-12 h-12 text-accent/30 mb-2" />
                                                                <p className="text-sm text-accent-foreground/70">
                                                                    Document uploaded
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="identification" className="space-y-6 pt-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Upload Identification Document *</Label>
                                                    <FileUpload
                                                        onFileSelect={(file) => handleDocumentFileChange('identification', file)}
                                                        currentFileUrl={documentUploads.identification.link}
                                                        accept="image/*,.pdf,.doc,.docx"
                                                        label="Identification Document"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Upload NIN, Driver's License or International Passport (PDF, JPG, PNG)
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="identificationTitle" className="text-sm font-medium">Document Title</Label>
                                                    <Input
                                                        id="identificationTitle"
                                                        value={documentUploads.identification.title}
                                                        onChange={(e) => handleDocumentTextChange('identification', 'title', e.target.value)}
                                                        placeholder="Enter document title"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="identificationComment" className="text-sm font-medium">Comments</Label>
                                                    <Textarea
                                                        id="identificationComment"
                                                        value={documentUploads.identification.comment}
                                                        onChange={(e) => handleDocumentTextChange('identification', 'comment', e.target.value)}
                                                        placeholder="Add any comments about this document"
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>

                                            {documentUploads.identification.previewUrl && (
                                                <div className="border border-accent/20 rounded-lg p-4">
                                                    <Label className="text-sm font-medium mb-3 block">Preview</Label>
                                                    <div className="relative w-full h-48">
                                                        {documentUploads.identification.previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                            <img
                                                                src={documentUploads.identification.previewUrl}
                                                                alt="Identification Document Preview"
                                                                className="w-full h-full object-contain rounded-md"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center bg-accent/5 rounded-md">
                                                                <FileText className="w-12 h-12 text-accent/30 mb-2" />
                                                                <p className="text-sm text-accent-foreground/70">
                                                                    Document uploaded
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </TabsContent>
                                    </Tabs>

                                    <div className="flex justify-end gap-4 pt-6 border-t">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push('/admin-profile')}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleSaveDocument}
                                            disabled={isUploading || (!documentUploads.cacDocument.file && !documentUploads.identification.file)}
                                            className="gap-2"
                                        >
                                            <Upload className="w-4 h-4" />
                                            {isUploading ? 'Uploading...' : 'Save Document'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}