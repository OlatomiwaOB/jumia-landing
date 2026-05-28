// 'use client'
// import React, { useState } from 'react';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { ArrowLeft, Building, Mail, Phone, MapPin, Calendar, Banknote, FileText, CreditCard, CheckCircle, CheckCheck } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import { useRouter, useParams } from 'next/navigation';
// import Link from 'next/link';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useMutation } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { usePermission } from '@/hooks/usePermission';

// interface Merchant {
//     id: number;
//     merchantId: string;
//     businessName: string;
//     email: string | null;
//     businessType: string;
//     status: string;
//     mobileNo: string | null;
//     address: string | null;
//     city: string | null;
//     countryCode: string | null;
//     createdDate: string;
//     accountNo: string;
//     virtualAccountNo: string;
//     bankAccountName: string;
//     bankName: string | null;
//     merchantType: string;
//     settlementAccountType: string;
//     settlementPeriodType: string;
//     sweepSessions: string[] | null;
//     businessLogo: string;
//     username: string | null;
//     firstname: string | null;
//     lastname: string | null;
//     bvn: string | null;
//     businessRegNo: string | null;
//     dob: string | null;
//     gender: string | null;
//     identityNo: string | null;
//     identityType: string | null;
//     state: string | null;
//     lga: string | null;
//     merchantServiceCharge: number;
//     transferFee: number;
//     mscCapLimit: number;
//     platformFee: number;
//     merchantGroupCode: string | null;
//     splitSettlementEnabled: string | null;
//     merchantCollectionAccount: string | null;
//     photoLink: string | null;
//     subscriptionTierCode: string | null;
//     subscriptionType: string | null;
//     mscType: string | null;
// }

// interface Document {
//     id: number;
//     type: string;
//     link: string;
//     createdDate: string;
//     verifyStatus: string;
//     comment?: string;
// }

// const getStatusColor = (status: string): string => {
//     if (!status) return 'bg-accent text-white';
//     const statusUpper = status.toUpperCase();
//     switch (statusUpper) {
//         case 'ACTIVE':
//         case 'APPROVED':
//         case 'Y':
//             return 'bg-accent text-white';
//         case 'PENDING':
//             return 'bg-accent text-white opacity-70';
//         case 'REJECTED':
//         case 'INACTIVE':
//         case 'R':
//         case 'N':
//             return 'bg-accent text-white opacity-50';
//         default:
//             return 'bg-accent text-white';
//     }
// };

// const getDisplayValue = (value: any): string => {
//     return value?.toString() || 'N/A';
// };

// const getInitials = (businessName: string): string => {
//     if (!businessName) return 'NA';
//     const names = businessName.split(' ');
//     const firstInitial = names[0]?.charAt(0) || '';
//     const secondInitial = names[1]?.charAt(0) || '';
//     return `${firstInitial}${secondInitial}`.toUpperCase();
// };

// const DocumentApprovalModal = ({
//     isOpen,
//     onClose,
//     document,
//     onSuccess
// }: {
//     isOpen: boolean;
//     onClose: () => void;
//     document: Document | null;
//     onSuccess: () => void;
// }) => {
//     const [otp, setOtp] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const approveDocumentMutation = useMutation({
//         mutationFn: (payload: { documents: { id: number }[], otp: string }) =>
//             axiosOperations.post('/merchant/approve-document', payload.documents, {
//                 params: { otp: payload.otp }
//             }),
//         onSuccess: (data) => {
//             if (data?.data?.code === '000') {
//                 toast.success('Document approved successfully');
//                 onSuccess();
//                 onClose();
//                 setOtp('');
//             } else {
//                 toast.error(data?.data?.desc || 'Failed to approve document');
//             }
//         },
//         onError: (error: any) => {
//             toast.error(error.response?.data?.message || 'Failed to approve document');
//         },
//         onSettled: () => {
//             setIsSubmitting(false);
//         }
//     });

//     const handleApprove = () => {
//         if (!document) return;

//         if (!otp || otp.length !== 6) {
//             toast.error('Please enter a valid 6-digit OTP');
//             return;
//         }

//         setIsSubmitting(true);
//         approveDocumentMutation.mutate({
//             documents: [{ id: document.id }],
//             otp: otp
//         });
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onClose}>
//             <DialogContent className="sm:max-w-md">
//                 <DialogHeader className='flex flex-col'>
//                     <DialogTitle className="text-accent-foreground">
//                         Approve Document
//                     </DialogTitle>
//                     <DialogDescription>
//                         Please confirm you want to approve this document.
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className="py-4">
//                     <div className="space-y-4">
//                         <div className="space-y-3">
//                             <div>
//                                 <p className="text-sm font-medium text-accent-foreground">Document Type</p>
//                                 <p className="text-sm text-accent-foreground/70 mt-1">
//                                     {document?.type || 'N/A'}
//                                 </p>
//                             </div>
//                             <div>
//                                 <p className="text-sm font-medium text-accent-foreground">Created Date</p>
//                                 <p className="text-sm text-accent-foreground/70 mt-1">
//                                     {document?.createdDate || 'N/A'}
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="space-y-2 pt-2">
//                             <Label htmlFor="documentOtp" className="text-accent-foreground">Enter OTP *</Label>
//                             <Input
//                                 id="documentOtp"
//                                 type="text"
//                                 value={otp}
//                                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                                 placeholder="Enter 6-digit OTP"
//                                 className="border-accent/20 text-accent-foreground"
//                                 required
//                                 maxLength={6}
//                             />
//                         </div>

//                         <div className="pt-4">
//                             <p className="text-sm text-accent-foreground/70">
//                                 Once approved, this document will be marked as verified and cannot be undone.
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 <DialogFooter>
//                     <div className="flex justify-end gap-3">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={onClose}
//                             disabled={isSubmitting}
//                             className="border-accent/20 hover:bg-accent/10"
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             type="button"
//                             onClick={handleApprove}
//                             disabled={isSubmitting || !otp || otp.length !== 6}
//                             className="bg-accent hover:bg-accent/90 text-white gap-2"
//                         >
//                             <CheckCircle className="w-4 h-4" />
//                             {isSubmitting ? 'Approving...' : 'Approve Document'}
//                         </Button>
//                     </div>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };

// const ApproveAllDocumentsModal = ({
//     isOpen,
//     onClose,
//     documentIds,
//     onSuccess
// }: {
//     isOpen: boolean;
//     onClose: () => void;
//     documentIds: number[];
//     onSuccess: () => void;
// }) => {
//     const [otp, setOtp] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const approveAllDocumentsMutation = useMutation({
//         mutationFn: (payload: { documents: { id: number }[], otp: string }) =>
//             axiosOperations.post('/merchant/approve-document', payload.documents, {
//                 params: { otp: payload.otp }
//             }),
//         onSuccess: (data) => {
//             if (data?.data?.code === '000') {
//                 toast.success(`${documentIds.length} document(s) approved successfully`);
//                 onSuccess();
//                 onClose();
//                 setOtp('');
//             } else {
//                 toast.error(data?.data?.desc || 'Failed to approve documents');
//             }
//         },
//         onError: (error: any) => {
//             toast.error(error.response?.data?.message || 'Failed to approve documents');
//         },
//         onSettled: () => {
//             setIsSubmitting(false);
//         }
//     });

//     const handleApproveAll = () => {
//         if (!otp || otp.length !== 6) {
//             toast.error('Please enter a valid 6-digit OTP');
//             return;
//         }

//         setIsSubmitting(true);
//         const documents = documentIds.map(id => ({ id }));
//         approveAllDocumentsMutation.mutate({
//             documents,
//             otp: otp
//         });
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onClose}>
//             <DialogContent className="sm:max-w-md">
//                 <DialogHeader className='flex flex-col'>
//                     <DialogTitle className="text-accent-foreground">
//                         Approve All Pending Documents
//                     </DialogTitle>
//                     <DialogDescription>
//                         Approve all {documentIds.length} pending documents at once.
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className="py-4">
//                     <div className="space-y-4">
//                         <div className="p-4 bg-accent/5 rounded-lg">
//                             <p className="text-sm font-medium text-accent-foreground mb-2">Documents to approve:</p>
//                             <p className="text-sm text-accent-foreground/70">
//                                 You are about to approve {documentIds.length} document(s). This action cannot be undone.
//                             </p>
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="approveAllOtp" className="text-accent-foreground">Enter OTP *</Label>
//                             <Input
//                                 id="approveAllOtp"
//                                 type="text"
//                                 value={otp}
//                                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                                 placeholder="Enter 6-digit OTP"
//                                 className="border-accent/20 text-accent-foreground"
//                                 required
//                                 maxLength={6}
//                             />
//                         </div>

//                         <div className="pt-2">
//                             <p className="text-sm text-accent-foreground/70">
//                                 All selected documents will be marked as verified once approved.
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 <DialogFooter>
//                     <div className="flex justify-end gap-3">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={onClose}
//                             disabled={isSubmitting}
//                             className="border-accent/20 hover:bg-accent/10"
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             type="button"
//                             onClick={handleApproveAll}
//                             disabled={isSubmitting || !otp || otp.length !== 6}
//                             className="bg-accent hover:bg-accent/90 text-white gap-2"
//                         >
//                             <CheckCheck className="w-4 h-4" />
//                             {isSubmitting ? 'Approving All...' : `Approve All (${documentIds.length})`}
//                         </Button>
//                     </div>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };


// export default function MerchantDetailsPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('MANAGE_MERCHANTS', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to manage merchants"
//     });

//     const router = useRouter();
//     const params = useParams();
//     const merchantCode = params.id as string;
//     const [activeTab, setActiveTab] = useState('overview');
//     const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
//     const [verifyStatus, setVerifyStatus] = useState<string>('');
//     const [reviewComment, setReviewComment] = useState<string>('');
//     const [otp, setOtp] = useState('');
//     const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
//     const [isDocumentApprovalModalOpen, setIsDocumentApprovalModalOpen] = useState(false);
//     const [isApproveAllModalOpen, setIsApproveAllModalOpen] = useState(false);

//     const { data, isLoading, error, refetch } = useQuery({
//         queryKey: ['merchant-details', merchantCode],
//         queryFn: () => axiosOperations.request({
//             url: `/merchant/${merchantCode}`,
//             method: 'GET',
//             params: {
//                 merchantCode: merchantCode,
//                 entityCode: 'FTD'
//             }
//         }),
//         enabled: !!merchantCode
//     });

//     const merchant: Merchant = data?.data?.merchantDto || {};
//     const documents = data?.data?.documents || [];
//     const splitFees = data?.data?.splitFees || [];

//     const pendingDocumentIds = documents
//         .filter(doc => doc.verifyStatus === 'N')
//         .map(doc => doc.id);

//     const handleApproveDocument = (document: Document) => {
//         setSelectedDocument(document);
//         setIsDocumentApprovalModalOpen(true);
//     };

//     const handleApproveAllDocuments = () => {
//         if (pendingDocumentIds.length === 0) {
//             toast.info('No pending documents to approve');
//             return;
//         }
//         setIsApproveAllModalOpen(true);
//     };

//     const handleDocumentApprovalSuccess = () => {
//         refetch();
//     };

//     const approveMerchantMutation = useMutation({
//         mutationFn: (payload: any) =>
//             axiosOperations.post('/merchant/authorize', payload, {
//                 params: { otp }
//             }),
//         onSuccess: (data) => {
//             if (data?.data?.code === '000') {
//                 toast.success(verifyStatus === 'Y' ? 'Merchant approved successfully' : 'Merchant rejected successfully');
//                 setIsApprovalModalOpen(false);
//                 setVerifyStatus('');
//                 setReviewComment('');
//                 setOtp('');
//                 refetch();
//             } else {
//                 toast.error(data?.data?.desc || 'Operation failed');
//             }
//         },
//         onError: (error: any) => {
//             toast.error(error.response?.data?.message || 'Operation failed');
//         }
//     });

//     const handleApproveSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!otp || otp.length !== 6) {
//             toast.error('Please enter a valid 6-digit OTP');
//             return;
//         }

//         if (verifyStatus === 'R' && !reviewComment) {
//             toast.error('Review comment is required for rejection');
//             return;
//         }

//         const payload = [{
//             id: merchant?.id,
//             verifyStatus: verifyStatus,
//             requestType: 'USER',
//             referenceNo: merchant?.merchantId,
//             comment: reviewComment,
//             otp: otp
//         }];

//         approveMerchantMutation.mutate(payload);
//     };

//     const getTierColor = (tierCode: string): string => {
//         switch (tierCode?.toUpperCase()) {
//             case 'BASIC':
//                 return 'bg-blue-100 text-blue-800 border-blue-200';
//             case 'STANDARD':
//                 return 'bg-green-100 text-green-800 border-green-200';
//             case 'PREMIUM':
//                 return 'bg-purple-100 text-purple-800 border-purple-200';
//             default:
//                 return 'bg-gray-100 text-gray-800 border-gray-200';
//         }
//     };

//     const getTypeColor = (type: string): string => {
//         switch (type?.toUpperCase()) {
//             case 'YEARLY':
//                 return 'bg-yellow-100 text-yellow-800';
//             case 'WEEKLY':
//                 return 'bg-orange-100 text-orange-800';
//             case 'MONTHLY':
//                 return 'bg-blue-100 text-blue-800';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-white flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-accent-foreground/70">Loading business details...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-white flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-accent-foreground/70">Error loading business details</p>
//                     <Button onClick={() => router.back()} className="mt-4">
//                         Go Back
//                     </Button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-white">
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center justify-between mb-6">
//                     <Button
//                         variant="ghost"
//                         onClick={() => router.back()}
//                         className="flex items-center gap-2 text-accent-foreground/70 hover:text-accent-foreground hover:bg-accent/10"
//                     >
//                         <ArrowLeft className="w-4 h-4" />
//                         Back
//                     </Button>

//                     {merchant?.status === 'PENDING' && (
//                         <Button
//                             onClick={() => setIsApprovalModalOpen(true)}
//                             className="bg-accent hover:bg-accent/90 text-white"
//                         >
//                             Verify Merchant
//                         </Button>
//                     )}
//                 </div>

//                 <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
//                     <Avatar className="w-24 h-24">
//                         <AvatarImage src={merchant.photoLink || "/lovable-uploads/02ad6048-41c8-4298-9103-f9760c690183.png"} />
//                         <AvatarFallback className="text-xl bg-accent text-white">
//                             {getInitials(merchant.businessName)}
//                         </AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1">
//                         <h1 className="text-3xl font-bold text-accent-foreground">
//                             {getDisplayValue(merchant.businessName)}
//                         </h1>
//                         <p className="text-accent-foreground/70 mt-1">{getDisplayValue(merchant.merchantId)}</p>
//                         <div className="flex gap-2 mt-3">
//                             <Badge className={`${getStatusColor(merchant.status)} text-sm px-3 py-1`}>
//                                 {getDisplayValue(merchant.status)}
//                             </Badge>
//                             <Badge className="bg-accent/20 text-accent-foreground text-sm px-3 py-1">
//                                 {getDisplayValue(merchant.businessType)}
//                             </Badge>
//                             <div className='flex gap-2 items-center'>
//                                 <Badge className={getTierColor(merchant.subscriptionTierCode || '')}>
//                                     {merchant?.subscriptionTierCode ? `${merchant.subscriptionTierCode}` : 'No active subscription'}
//                                 </Badge>
//                                 <Badge className={getTypeColor(merchant?.subscriptionType || '')}>
//                                     {merchant?.subscriptionType ? `${merchant.subscriptionType}` : ''}
//                                 </Badge>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//                     <TabsList className="border-b border-accent/20 w-full justify-start h-auto p-0 bg-transparent">
//                         <TabsTrigger
//                             value="overview"
//                             className="outline-none rounded-none border-b-2 border-transparent data-[state=active]:border-b-accent data-[state=active]:text-accent-foreground data-[state=active]:bg-transparent px-4 py-3"
//                         >
//                             Overview
//                         </TabsTrigger>
//                         <TabsTrigger
//                             value="business"
//                             className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-accent data-[state=active]:text-accent-foreground data-[state=active]:bg-transparent px-4 py-3"
//                         >
//                             Business Info
//                         </TabsTrigger>
//                         <TabsTrigger
//                             value="banking"
//                             className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-accent data-[state=active]:text-accent-foreground data-[state=active]:bg-transparent px-4 py-3"
//                         >
//                             Banking & Settlement
//                         </TabsTrigger>
//                         <TabsTrigger
//                             value="documents"
//                             className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-accent data-[state=active]:text-accent-foreground data-[state=active]:bg-transparent px-4 py-3"
//                         >
//                             Documents
//                         </TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="overview" className="space-y-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <Card className="border-accent/20">
//                                 <CardContent className="p-6">
//                                     <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                                         <Mail className="w-5 h-5" />
//                                         Contact Information
//                                     </h3>
//                                     <div className="space-y-4">
//                                         {merchant.email && (
//                                             <div>
//                                                 <p className="text-sm font-medium text-accent-foreground">Email</p>
//                                                 <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.email)}</p>
//                                             </div>
//                                         )}
//                                         {merchant.mobileNo && (
//                                             <div>
//                                                 <p className="text-sm font-medium text-accent-foreground">Phone</p>
//                                                 <div className="flex items-center gap-2 mt-1">
//                                                     <Phone className="w-4 h-4 text-accent-foreground/70" />
//                                                     <p className="text-sm text-accent-foreground/70">{getDisplayValue(merchant.mobileNo)}</p>
//                                                 </div>
//                                             </div>
//                                         )}
//                                         {merchant.address && (
//                                             <div>
//                                                 <p className="text-sm font-medium text-accent-foreground">Address</p>
//                                                 <div className="flex items-center gap-2 mt-1">
//                                                     <MapPin className="w-4 h-4 text-accent-foreground/70" />
//                                                     <p className="text-sm text-accent-foreground/70">{getDisplayValue(merchant.address)}</p>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             <Card className="border-accent/20">
//                                 <CardContent className="p-6">
//                                     <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                                         <Calendar className="w-5 h-5" />
//                                         Registration Information
//                                     </h3>
//                                     <div className="space-y-4">
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Created Date</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.createdDate)}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Merchant Type</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.merchantType)}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Status</p>
//                                             <Badge className={`${getStatusColor(merchant.status)} text-xs px-2 py-1 w-fit mt-1`}>
//                                                 {getDisplayValue(merchant.status)}
//                                             </Badge>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             <Card className="border-accent/20">
//                                 <CardContent className="p-6">
//                                     <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                                         <MapPin className="w-5 h-5" />
//                                         Location Information
//                                     </h3>
//                                     <div className="space-y-4">
//                                         {merchant.city && (
//                                             <div>
//                                                 <p className="text-sm font-medium text-accent-foreground">City</p>
//                                                 <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.city)}</p>
//                                             </div>
//                                         )}
//                                         {merchant.state && (
//                                             <div>
//                                                 <p className="text-sm font-medium text-accent-foreground">State</p>
//                                                 <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.state)}</p>
//                                             </div>
//                                         )}
//                                         {merchant.countryCode && (
//                                             <div>
//                                                 <p className="text-sm font-medium text-accent-foreground">Country Code</p>
//                                                 <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.countryCode)}</p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             <Card className="border-accent/20">
//                                 <CardContent className="p-6">
//                                     <h3 className="text-lg font-semibold text-accent-foreground mb-4">
//                                         Personal Information
//                                     </h3>
//                                     <div className="space-y-4">
//                                         {(merchant.firstname || merchant.lastname) && (
//                                             <div>
//                                                 <p className="text-sm font-medium text-accent-foreground">Name</p>
//                                                 <p className="text-sm text-accent-foreground/70 mt-1">
//                                                     {getDisplayValue(merchant.firstname)} {getDisplayValue(merchant.lastname)}
//                                                 </p>
//                                             </div>
//                                         )}
//                                         {merchant.username && (
//                                             <div>
//                                                 <p className="text-sm font-medium text-accent-foreground">Username</p>
//                                                 <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.username)}</p>
//                                             </div>
//                                         )}
//                                         {merchant.bvn && (
//                                             <div>
//                                                 <p className="text-sm font-medium text-accent-foreground">BVN</p>
//                                                 <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.bvn)}</p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>
//                     </TabsContent>

//                     <TabsContent value="business" className="space-y-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <Card className="border-accent/20">
//                                 <CardContent className="p-6">
//                                     <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                                         <Building className="w-5 h-5" />
//                                         Business Details
//                                     </h3>
//                                     <div className="space-y-4">
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Business Name</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.businessName)}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Business Type</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.businessType)}</p>
//                                         </div>
//                                         {merchant.businessRegNo && (
//                                             <div>
//                                                 <p className="text-sm font-medium text-accent-foreground">Registration Number</p>
//                                                 <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.businessRegNo)}</p>
//                                             </div>
//                                         )}
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Merchant Group</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.merchantGroupCode)}</p>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             <Card className="border-accent/20">
//                                 <CardContent className="p-6">
//                                     <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                                         <Banknote className="w-5 h-5" />
//                                         Fee Structure
//                                     </h3>
//                                     <div className="space-y-4">
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Merchant Service Charge</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.merchantServiceCharge)}%</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">MSC Charge Type</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.mscType)}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">MSC Cap Limit</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.mscCapLimit)}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Platform Fee</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.platformFee)}%</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Transfer Fee</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.transferFee)}</p>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>
//                     </TabsContent>

//                     <TabsContent value="banking" className="space-y-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <Card className="border-accent/20">
//                                 <CardContent className="p-6">
//                                     <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                                         <CreditCard className="w-5 h-5" />
//                                         Bank Account
//                                     </h3>
//                                     <div className="space-y-4">
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Account Name</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.bankAccountName)}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Account Number</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.virtualAccountNo || merchant.accountNo)}</p>
//                                         </div>
//                                         {merchant.bankName && (
//                                             <div>
//                                                 <p className="text-sm font-medium text-accent-foreground">Bank Name</p>
//                                                 <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.bankName)}</p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             <Card className="border-accent/20">
//                                 <CardContent className="p-6">
//                                     <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                                         <Banknote className="w-5 h-5" />
//                                         Settlement Configuration
//                                     </h3>
//                                     <div className="space-y-4">
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Settlement Account Type</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.settlementAccountType)}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Settlement Period Type</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.settlementPeriodType)}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Split Settlement Enabled</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.splitSettlementEnabled)}</p>
//                                         </div>
//                                         {merchant.merchantCollectionAccount && (
//                                             <div>
//                                                 <p className="text-sm font-medium text-accent-foreground">Collection Account</p>
//                                                 <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(merchant.merchantCollectionAccount)}</p>
//                                             </div>
//                                         )}
//                                         {merchant.sweepSessions && merchant.sweepSessions.length > 0 && (
//                                             <div>
//                                                 <p className="text-sm font-medium text-accent-foreground">Sweep Sessions</p>
//                                                 <div className="flex flex-wrap gap-1 mt-1">
//                                                     {merchant.sweepSessions.map((session, index) => (
//                                                         <Badge key={index} className="bg-accent/10 text-accent-foreground text-xs">
//                                                             {session}
//                                                         </Badge>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             {splitFees.length > 0 && (
//                                 <Card className="md:col-span-2 border-accent/20">
//                                     <CardContent className="p-6">
//                                         <h3 className="text-lg font-semibold text-accent-foreground mb-4">
//                                             Split Settlement Fees
//                                         </h3>
//                                         <div className="overflow-x-auto">
//                                             <table className="w-full border-collapse">
//                                                 <thead>
//                                                     <tr className="border-b-2 border-accent/20">
//                                                         <th className="text-left p-3 font-bold text-sm text-accent-foreground">Partner Type</th>
//                                                         <th className="text-left p-3 font-bold text-sm text-accent-foreground">Account Number</th>
//                                                         <th className="text-left p-3 font-bold text-sm text-accent-foreground">Bank Name</th>
//                                                         <th className="text-left p-3 font-bold text-sm text-accent-foreground">Account Name</th>
//                                                         <th className="text-left p-3 font-bold text-sm text-accent-foreground">Sharing Type</th>
//                                                         <th className="text-left p-3 font-bold text-sm text-accent-foreground">Amount/Fee</th>
//                                                         <th className="text-left p-3 font-bold text-sm text-accent-foreground">Status</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {splitFees.map((split: any, index: number) => (
//                                                         <tr key={index} className="border-b border-accent/10">
//                                                             <td className="p-3 text-sm text-accent-foreground">{getDisplayValue(split.partnerType)}</td>
//                                                             <td className="p-3 text-sm text-accent-foreground">{getDisplayValue(split.accountNumber)}</td>
//                                                             <td className="p-3 text-sm text-accent-foreground">{getDisplayValue(split.bankName)}</td>
//                                                             <td className="p-3 text-sm text-accent-foreground">{getDisplayValue(split.accountName)}</td>
//                                                             <td className="p-3 text-sm text-accent-foreground">{getDisplayValue(split.sharingType)}</td>
//                                                             <td className="p-3 text-sm text-accent-foreground">
//                                                                 {split.tranAmount || split.feeAmount}
//                                                             </td>
//                                                             <td className="p-3 text-sm">
//                                                                 <Badge className={`${getStatusColor(split.status)} text-xs px-2 py-1 w-fit`}>
//                                                                     {getDisplayValue(split.status)}
//                                                                 </Badge>
//                                                             </td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             )}
//                         </div>
//                     </TabsContent>

//                     <TabsContent value="documents" className="space-y-6">
//                         <Card className="border-accent/20">
//                             <CardContent className="p-6">
//                                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                                     <div className="flex items-center gap-2">
//                                         <FileText className="w-5 h-5" />
//                                         <h3 className="text-lg font-semibold text-accent-foreground">
//                                             Documents
//                                         </h3>
//                                         {pendingDocumentIds.length > 0 && (
//                                             <Badge className="bg-accent text-white">
//                                                 {pendingDocumentIds.length} pending
//                                             </Badge>
//                                         )}
//                                     </div>

//                                     {pendingDocumentIds.length > 0 && (
//                                         <Button
//                                             onClick={handleApproveAllDocuments}
//                                             className="bg-green-600 hover:bg-green-700 text-white gap-2"
//                                         >
//                                             <CheckCheck className="w-4 h-4" />
//                                             Approve All
//                                         </Button>
//                                     )}
//                                 </div>

//                                 {documents.length > 0 ? (
//                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                         {documents.map((doc: Document, index: number) => (
//                                             <div key={index} className="border border-accent/20 rounded-lg p-4 flex flex-col">
//                                                 <div className="flex justify-between items-start mb-2">
//                                                     <div>
//                                                         <p className="text-sm font-medium text-accent-foreground">{doc.type || 'Document'}</p>
//                                                         <p className="text-xs text-accent-foreground/70 mt-1">
//                                                             Created: {doc.createdDate || 'N/A'}
//                                                         </p>
//                                                     </div>
//                                                     <div className="flex items-center gap-2">
//                                                         <Badge className={`${getStatusColor(doc.verifyStatus)} text-xs px-2 py-1`}>
//                                                             {doc.verifyStatus === 'Y' ? 'Approved' :
//                                                                 doc.verifyStatus === 'R' ? 'Rejected' : 'Pending'}
//                                                         </Badge>
//                                                         {doc.verifyStatus === 'N' && (
//                                                             <Button
//                                                                 variant="ghost"
//                                                                 size="sm"
//                                                                 className="p-1 h-8 w-8 hover:bg-green-50 hover:text-green-600"
//                                                                 onClick={() => handleApproveDocument(doc)}
//                                                                 title="Approve Document"
//                                                             >
//                                                                 <CheckCircle className="w-4 h-4" />
//                                                             </Button>
//                                                         )}
//                                                     </div>
//                                                 </div>

//                                                 <div className="mt-4 mb-3 flex-1">
//                                                     {doc.link ? (
//                                                         <div className="relative w-full h-40 border border-accent/10 rounded overflow-hidden">
//                                                             <Image
//                                                                 src={doc.link}
//                                                                 alt={doc.type || 'Document'}
//                                                                 fill
//                                                                 className="object-contain"
//                                                                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                                                             />
//                                                         </div>
//                                                     ) : (
//                                                         <div className="w-full h-40 flex items-center justify-center border border-accent/10 rounded bg-accent/5">
//                                                             <p className="text-sm text-accent-foreground/50">No preview available</p>
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 {doc.comment && (
//                                                     <div className="mt-2 pt-2 border-t border-accent/10">
//                                                         <p className="text-xs font-medium text-accent-foreground">Comment:</p>
//                                                         <p className="text-xs text-accent-foreground/70 mt-1">{doc.comment}</p>
//                                                     </div>
//                                                 )}

//                                                 {doc.link && (
//                                                     <a
//                                                         href={doc.link}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="inline-block mt-3 text-sm text-accent hover:text-accent/80 text-center w-full py-2 border border-accent/20 rounded hover:bg-accent/5 transition-colors"
//                                                     >
//                                                         View Full Document
//                                                     </a>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <div className="text-center py-8">
//                                         <FileText className="w-12 h-12 text-accent-foreground/20 mx-auto mb-3" />
//                                         <p className="text-accent-foreground/70">No documents found for this merchant</p>
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>
//                     </TabsContent>
//                 </Tabs>
//             </div>

//             <DocumentApprovalModal
//                 isOpen={isDocumentApprovalModalOpen}
//                 onClose={() => {
//                     setIsDocumentApprovalModalOpen(false);
//                     setSelectedDocument(null);
//                 }}
//                 document={selectedDocument}
//                 onSuccess={handleDocumentApprovalSuccess}
//             />

//             <ApproveAllDocumentsModal
//                 isOpen={isApproveAllModalOpen}
//                 onClose={() => setIsApproveAllModalOpen(false)}
//                 documentIds={pendingDocumentIds}
//                 onSuccess={handleDocumentApprovalSuccess}
//             />

//             <Dialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
//                 <DialogContent className="sm:max-w-md">
//                     <DialogHeader className='flex flex-col'>
//                         <DialogTitle className="text-accent-foreground">Verify Business</DialogTitle>
//                         <DialogDescription>
//                             Approve or reject the business application
//                         </DialogDescription>
//                     </DialogHeader>

//                     <form onSubmit={handleApproveSubmit} className="space-y-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="verifyStatus" className="text-accent-foreground">Verify Status *</Label>
//                             <Select value={verifyStatus} onValueChange={setVerifyStatus}>
//                                 <SelectTrigger className="border-accent/20">
//                                     <SelectValue placeholder="Select status" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="Y">Approve</SelectItem>
//                                     <SelectItem value="R">Reject</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="otp" className="text-accent-foreground">Enter OTP *</Label>
//                             <Input
//                                 id="otp"
//                                 type="text"
//                                 value={otp}
//                                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                                 placeholder="Enter 6-digit OTP"
//                                 className="border-accent/20 text-accent-foreground"
//                                 required
//                                 maxLength={6}
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="reviewComment" className="text-accent-foreground">
//                                 Review Comment {verifyStatus === 'R' && <span className="text-red-500">*</span>}
//                             </Label>
//                             <Textarea
//                                 id="reviewComment"
//                                 value={reviewComment}
//                                 onChange={(e) => setReviewComment(e.target.value)}
//                                 placeholder={verifyStatus === 'Y'
//                                     ? "Add a note for approving this business..."
//                                     : "Provide a reason for rejecting this business..."}
//                                 rows={3}
//                                 className="border-accent/20 text-accent-foreground"
//                                 maxLength={500}
//                                 required={verifyStatus === 'R'}
//                             />
//                             <div className="flex justify-between text-xs text-accent-foreground/70">
//                                 <span>
//                                     {verifyStatus === 'R'
//                                         ? 'Comment is required for rejection'
//                                         : 'Optional comment'}
//                                 </span>
//                                 <span>{reviewComment.length}/500</span>
//                             </div>
//                         </div>

//                         <div className="flex justify-end gap-3 pt-4">
//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={() => setIsApprovalModalOpen(false)}
//                                 disabled={approveMerchantMutation.isPending}
//                                 className="border-accent/20 hover:bg-accent/10"
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 type="submit"
//                                 disabled={approveMerchantMutation.isPending || !verifyStatus || !otp}
//                                 className="bg-accent hover:bg-accent/90 text-white"
//                             >
//                                 {approveMerchantMutation.isPending ? 'Processing...' : 'Submit'}
//                             </Button>
//                         </div>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }


'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, CheckCircle, CheckCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PermissionButton } from '../permission/permission-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';

interface Merchant {
    id: number;
    merchantId: string;
    businessName: string;
    email: string | null;
    businessType: string;
    status: string;
    mobileNo: string | null;
    address: string | null;
    city: string | null;
    countryCode: string | null;
    createdDate: string;
    accountNo: string;
    virtualAccountNo: string;
    bankAccountName: string;
    bankName: string | null;
    merchantType: string;
    settlementAccountType: string;
    settlementPeriodType: string;
    sweepSessions: string[] | null;
    businessLogo: string;
    username: string | null;
    firstname: string | null;
    lastname: string | null;
    photoLink: string | Blob;
    subscriptionTierCode: string | null;
    subscriptionType: string | null;
    merchantServiceCharge?: number;
    mscCapLimit?: number;
    mscType?: string;
    merchantGroupCode?: string | null;
    platformFee?: number;
    transferFee?: number;
    splitSettlementEnabled?: string | null;
    bvn?: string | null;
    state?: string | null;
}

interface Document {
    id: number;
    type: string;
    link: string;
    createdDate: string;
    verifyStatus: string;
    comment?: string;
}

interface BusinessDetailsModalProps {
    merchant: Merchant | null;
    open: boolean;
    onClose: () => void;
    merchantCode?: string;
    documents?: Document[];
}

type TabKey = 'overview' | 'business' | 'banking' | 'documents';

const getStatusColor = (status: string): string => {
    if (!status) return 'bg-gray-100 text-gray-600 border-gray-200';
    switch (status.toUpperCase()) {
        case 'ACTIVE': case 'APPROVED': case 'Y':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'REJECTED': case 'INACTIVE': case 'R': case 'N': case 'FAILED':
            return 'bg-red-100 text-red-700 border-red-200';
        default:
            return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const getDisplayValue = (value: any): string => value?.toString() || 'N/A';

const getInitials = (name: string): string => {
    if (!name) return 'NA';
    const parts = name.trim().split(' ');
    return `${parts[0]?.charAt(0) || ''}${parts[1]?.charAt(0) || ''}`.toUpperCase();
};

const Field = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
    <div className="space-y-0.5">
        <p className="text-xs text-medium-gray">{label}</p>
        <p className={`text-xs truncate font-semibold ${highlight ? 'text-[#018E25]' : 'text-dark-gray'}`}>{value}</p>
    </div>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="p-4 rounded-2xl border border-[#F5F5F5] space-y-4">
        <p className="text-sm font-semibold text-dark-gray">{title}</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
);

const TABS: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'business', label: 'Business Information' },
    { key: 'banking', label: 'Banking & Settlement' },
    { key: 'documents', label: 'Document' },
];

const DocumentApprovalModal = ({
    isOpen,
    onClose,
    document,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    document: Document | null;
    onSuccess: () => void;
}) => {
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const approveDocumentMutation = useMutation({
        mutationFn: (payload: { documents: { id: number }[], otp: string }) =>
            axiosOperations.post('/merchant/approve-document', payload.documents, {
                params: { otp: payload.otp }
            }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Document approved successfully');
                onSuccess();
                onClose();
                setOtp('');
            } else {
                toast.error(data?.data?.desc || 'Failed to approve document');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to approve document');
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });

    const handleApprove = () => {
        if (!document) return;

        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setIsSubmitting(true);
        approveDocumentMutation.mutate({
            documents: [{ id: document.id }],
            otp: otp
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                <DialogTitle className="sr-only">Approve Document</DialogTitle>

                <div className="px-6 pt-4">
                    <h2 className="text-md font-bold text-dark-gray">Approve Document</h2>
                    <p className="text-xs text-medium-gray mt-0.5">Please confirm you want to approve this document</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-white rounded-2xl p-4 space-y-4">
                        {document && (
                            <div className="flex items-center gap-3 pb-3 border-b border-[#F5F5F5]">
                                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-dark-gray">{document.type || 'N/A'}</p>
                                    <p className="text-xs text-medium-gray">{document.createdDate || 'N/A'}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label>OTP <span className='text-red-500'>*</span></Label>
                            <Input
                                id="documentOtp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                            />
                            <p className="text-xs text-medium-gray">{otp.length}/6 digits</p>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                            <p className="text-xs text-amber-800">
                                Once approved, this document will be marked as verified and cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-1 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleApprove}
                            disabled={isSubmitting || !otp || otp.length !== 6}
                        >
                            <CheckCircle className="w-4 h-4" />
                            {isSubmitting ? 'Approving...' : 'Approve Document'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const ApproveAllDocumentsModal = ({
    isOpen,
    onClose,
    documentIds,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    documentIds: number[];
    onSuccess: () => void;
}) => {
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const approveAllDocumentsMutation = useMutation({
        mutationFn: (payload: { documents: { id: number }[], otp: string }) =>
            axiosOperations.post('/merchant/approve-document', payload.documents, {
                params: { otp: payload.otp }
            }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success(`${documentIds.length} document(s) approved successfully`);
                onSuccess();
                onClose();
                setOtp('');
            } else {
                toast.error(data?.data?.desc || 'Failed to approve documents');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to approve documents');
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });

    const handleApproveAll = () => {
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setIsSubmitting(true);
        const documents = documentIds.map(id => ({ id }));
        approveAllDocumentsMutation.mutate({
            documents,
            otp: otp
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                <DialogTitle className="sr-only">Approve All Pending Documents</DialogTitle>

                <div className="px-6 pt-4">
                    <h2 className="text-md font-bold text-dark-gray">Approve All Pending Documents</h2>
                    <p className="text-xs text-medium-gray mt-0.5">Approve all {documentIds.length} pending documents at once</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-white rounded-2xl p-4 space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                                <CheckCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-dark-gray">Batch Approval</p>
                                <p className="text-xs text-medium-gray">{documentIds.length} document(s) selected</p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>OTP <span className='text-red-500'>*</span></Label>
                            <Input
                                id="approveAllOtp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                            />
                            <p className="text-xs text-medium-gray">{otp.length}/6 digits</p>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                            <p className="text-xs text-amber-800">
                                All selected documents will be marked as verified once approved. This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-1 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleApproveAll}
                            disabled={isSubmitting || !otp || otp.length !== 6}
                            className="bg-green-600 hover:bg-green-700 text-white gap-2"
                        >
                            <CheckCheck className="w-4 h-4" />
                            {isSubmitting ? 'Approving All...' : `Approve All (${documentIds.length})`}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({
    merchant: propMerchant,
    open,
    onClose,
    merchantCode,
    documents: propDocuments = [],
}) => {
    const [activeTab, setActiveTab] = useState<TabKey>('overview');
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [verifyStatus, setVerifyStatus] = useState<string>('');
    const [reviewComment, setReviewComment] = useState<string>('');
    const [otp, setOtp] = useState('');
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [isDocumentApprovalModalOpen, setIsDocumentApprovalModalOpen] = useState(false);
    const [isApproveAllModalOpen, setIsApproveAllModalOpen] = useState(false);
    const router = useRouter();

    const { data: fetchedData, refetch } = useQuery({
        queryKey: ['merchant-details', merchantCode],
        queryFn: () => axiosOperations.request({
            url: `/merchant/${merchantCode}`,
            method: 'GET',
            params: {
                merchantCode: merchantCode,
                entityCode: 'FTD'
            }
        }),
        enabled: !!merchantCode && open,
    });

    const merchant = (fetchedData?.data?.merchantDto as Merchant) || propMerchant;
    const documents = fetchedData?.data?.documents || propDocuments || [];

    console.log('Documents in modal:', documents);
    console.log('Fetched data:', fetchedData?.data);

    const pendingDocumentIds = documents
        .filter((doc: any) => doc.verifyStatus === 'N')
        .map((doc: any) => doc.id);

    const handleApproveDocument = (document: Document) => {
        setSelectedDocument(document);
        setIsDocumentApprovalModalOpen(true);
    };

    const handleApproveAllDocuments = () => {
        if (pendingDocumentIds.length === 0) {
            toast.info('No pending documents to approve');
            return;
        }
        setIsApproveAllModalOpen(true);
    };

    const handleDocumentApprovalSuccess = () => {
        refetch();
    };

    const approveMerchantMutation = useMutation({
        mutationFn: (payload: any) =>
            axiosOperations.post('/merchant/authorize', payload, {
                params: { otp }
            }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success(verifyStatus === 'Y' ? 'Merchant approved successfully' : 'Merchant rejected successfully');
                setIsApprovalModalOpen(false);
                setVerifyStatus('');
                setReviewComment('');
                setOtp('');
                refetch();
            } else {
                toast.error(data?.data?.desc || 'Operation failed');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    });

    const handleApproveSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        if (verifyStatus === 'R' && !reviewComment) {
            toast.error('Review comment is required for rejection');
            return;
        }

        const payload = [{
            id: merchant?.id,
            verifyStatus: verifyStatus,
            requestType: 'USER',
            referenceNo: merchant?.merchantId,
            comment: reviewComment,
            otp: otp
        }];

        approveMerchantMutation.mutate(payload);
    };

    if (!merchant) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-3xl max-h-[100vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                    style={{
                        scrollbarWidth: 'none',
                        scrollbarColor: 'transparent',
                    }}
                >
                    <DialogTitle className="sr-only">Business Details</DialogTitle>

                    <div className="px-6 pt-5 pb-4">
                        <h2 className="text-base font-semibold text-dark-gray mb-4">Business Details</h2>

                        <div className="bg-white rounded-2xl p-4">
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F5F5F5]">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-11 h-11">
                                        <AvatarImage src={merchant.photoLink as string} />
                                        <AvatarFallback className="bg-[#F5F5F5] text-dark-gray font-semibold text-sm">
                                            {getInitials(merchant.businessName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-bold text-dark-gray">{merchant.businessName}</p>
                                        <p className="text-xs text-medium-gray">{merchant.merchantId}</p>
                                    </div>
                                    <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full ml-2 ${getStatusColor(merchant.status)}`}>
                                        {merchant.status}
                                    </Badge>
                                </div>
                                <div className='flex items-center gap-2'>
                                    {merchant?.status === 'PENDING' && (
                                        <PermissionButton
                                            onClick={() => setIsApprovalModalOpen(true)}
                                            requiredPermissions={['MANAGE_MERCHANTS']}
                                            requireAll={true} hideIfNoPermission={false}
                                            tooltipMessage="No permission to manage business"
                                            variant='outline'
                                        >
                                            Verify Merchant
                                        </PermissionButton>
                                    )}
                                    <PermissionButton
                                        requiredPermissions={['MANAGE_MERCHANTS']}
                                        requireAll={true} hideIfNoPermission={false}
                                        tooltipMessage="No permission to manage business"
                                        onClick={() => router.push(`/operations/business/create?edit=true&id=${merchant.merchantId}`)}
                                    >
                                        Edit User
                                    </PermissionButton>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-x-6">
                                <Field label="Business Type" value={getDisplayValue(merchant.businessType)} />
                                <Field label="Subscription Tier" value={getDisplayValue(merchant.subscriptionTierCode)} />
                                <Field label="Subscription Type" value={getDisplayValue(merchant.subscriptionType)} />
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-2xl mx-6 mb-4'>
                        <div className="p-4 pb-1">
                            <div className="flex gap-2 flex-wrap">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${activeTab === tab.key
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-white text-medium-gray font-semibold border-2 border-[#F5F5F5] hover:bg-gray-50'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 pt-2 space-y-4">

                            {activeTab === 'overview' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <SectionCard title="Contact Information">
                                            <Field label="Email" value={getDisplayValue(merchant.email)} />
                                            <Field label="Phone Number" value={getDisplayValue(merchant.mobileNo)} />
                                            <div className="col-span-2 space-y-0.5">
                                                <p className="text-xs text-medium-gray">Address</p>
                                                <p className="text-sm font-semibold text-dark-gray">{getDisplayValue(merchant.address)}</p>
                                            </div>
                                        </SectionCard>

                                        <SectionCard title="Registration Information">
                                            <Field label="Date Created" value={merchant.createdDate ? new Date(merchant.createdDate).toLocaleString() : 'N/A'} />
                                            <Field label="Merchant Type" value={getDisplayValue(merchant.merchantType)} />
                                            <Field label="Status" value={getDisplayValue(merchant.status)} highlight={merchant.status?.toUpperCase() === 'ACTIVE'} />
                                        </SectionCard>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <SectionCard title="Location Information">
                                            <Field label="City" value={getDisplayValue(merchant.city)} />
                                            <Field label="State" value={getDisplayValue(merchant.state)} />
                                            <div className="col-span-2">
                                                <Field label="Country" value={getDisplayValue(merchant.countryCode)} />
                                            </div>
                                        </SectionCard>

                                        <SectionCard title="Personal Information">
                                            <div className="col-span-2 space-y-0.5">
                                                <p className="text-xs text-medium-gray">Name</p>
                                                <p className="text-sm font-semibold text-dark-gray">
                                                    {[merchant.firstname, merchant.lastname].filter(Boolean).join(' ') || 'N/A'}
                                                </p>
                                            </div>
                                            <Field label="Username" value={getDisplayValue(merchant.username)} />
                                            <Field label="BVN" value={getDisplayValue(merchant.bvn)} />
                                        </SectionCard>
                                    </div>
                                </>
                            )}

                            {activeTab === 'business' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <SectionCard title="Business Details">
                                        <Field label="Business Name" value={getDisplayValue(merchant.businessName)} />
                                        <Field label="Business Type" value={getDisplayValue(merchant.businessType)} />
                                        <div className="col-span-2">
                                            <Field label="Merchant Group" value={getDisplayValue(merchant.merchantGroupCode)} />
                                        </div>
                                    </SectionCard>

                                    <SectionCard title="Fee Structure">
                                        <Field label="Merchant Service Charge" value={`${getDisplayValue(merchant.merchantServiceCharge)}%`} />
                                        <Field label="MSC Charge Type" value={getDisplayValue(merchant.mscType)} />
                                        <Field label="MSC Cap Limit" value={getDisplayValue(merchant.mscCapLimit)} highlight />
                                        <Field label="Platform Fee" value={`${getDisplayValue(merchant.platformFee)}%`} />
                                        <div className="col-span-2">
                                            <Field label="Transfer Fee" value={getDisplayValue(merchant.transferFee)} />
                                        </div>
                                    </SectionCard>
                                </div>
                            )}

                            {activeTab === 'banking' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <SectionCard title="Bank Account">
                                        <Field label="Account Name" value={getDisplayValue(merchant.bankAccountName)} />
                                        <Field label="Account Number" value={getDisplayValue(merchant.virtualAccountNo || merchant.accountNo)} />
                                        <div className="col-span-2">
                                            <Field label="Bank Name" value={getDisplayValue(merchant.bankName)} />
                                        </div>
                                    </SectionCard>

                                    <SectionCard title="Settlement Configuration">
                                        <Field label="Settle Account Type" value={getDisplayValue(merchant.settlementAccountType)} />
                                        <Field label="Settlement Period Type" value={getDisplayValue(merchant.settlementPeriodType)} />
                                        <div className="col-span-2">
                                            <Field label="Split Settlement Enabled" value={getDisplayValue(merchant.splitSettlementEnabled)} />
                                        </div>
                                    </SectionCard>
                                </div>
                            )}

                            {activeTab === 'documents' && (
                                <div className="bg-white rounded-2xl p-4">
                                    {documents.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 gap-2">
                                            <p className="text-md font-semibold text-dark-gray">Documents</p>
                                            <p className="text-sm text-medium-gray">No document found for this Merchant</p>
                                        </div>
                                    ) : (
                                        <div className='flex justify-between items-start'>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {documents.map((doc: any, i: any) => (
                                                    <div key={i} className="border border-[#F5F5F5] rounded-xl p-3 space-y-3">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <div className='flex items-center gap-16'>
                                                                    <p className="text-xs font-medium text-dark-gray">{doc.type || 'Document'}</p>
                                                                    <div className="flex items-center gap-2">
                                                                        {doc.verifyStatus === 'N' && (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="p-1 h-7 w-7 hover:bg-green-50 hover:text-green-600"
                                                                                onClick={() => handleApproveDocument(doc)}
                                                                                title="Approve Document"
                                                                            >
                                                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className='flex items-center justify-between'>
                                                                    <p className="text-xs text-medium-gray mt-0.5">{doc.createdDate}</p>
                                                                    <Badge className={`text-[10px] border ${getStatusColor(doc.verifyStatus)}`}>
                                                                        {doc.verifyStatus === 'Y' ? 'Approved' : doc.verifyStatus === 'R' ? 'Rejected' : 'Pending'}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {doc.link ? (
                                                            <div className="relative h-36 rounded-lg overflow-hidden border border-[#F5F5F5]">
                                                                <Image src={doc.link} alt={doc.type} fill className="object-contain" sizes="200px" />
                                                            </div>
                                                        ) : (
                                                            <div className="h-36 flex items-center justify-center bg-gray-50 rounded-lg">
                                                                <p className="text-xs text-medium-gray">No preview</p>
                                                            </div>
                                                        )}
                                                        {doc.comment && (
                                                            <div className="pt-2 border-t border-[#F5F5F5]">
                                                                <p className="text-xs font-medium text-dark-gray">Comment:</p>
                                                                <p className="text-xs text-medium-gray mt-1">{doc.comment}</p>
                                                            </div>
                                                        )}
                                                        {doc.link && (
                                                            <a href={doc.link} target="_blank" rel="noopener noreferrer"
                                                                className="block text-center text-white text-xs text-text py-2 bg-faded-accent rounded-lg hover:bg-faded-accent/50 transition-colors">
                                                                View Full Document
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-between mb-4">
                                                {pendingDocumentIds.length > 0 && (
                                                    <Button
                                                        onClick={handleApproveAllDocuments}
                                                        size='xs'
                                                        className="bg-green-600 hover:bg-green-700 text-white gap-2 text-sm"
                                                    >
                                                        Approve All ({pendingDocumentIds.length})
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <DocumentApprovalModal
                isOpen={isDocumentApprovalModalOpen}
                onClose={() => {
                    setIsDocumentApprovalModalOpen(false);
                    setSelectedDocument(null);
                }}
                document={selectedDocument}
                onSuccess={handleDocumentApprovalSuccess}
            />

            <ApproveAllDocumentsModal
                isOpen={isApproveAllModalOpen}
                onClose={() => setIsApproveAllModalOpen(false)}
                documentIds={pendingDocumentIds}
                onSuccess={handleDocumentApprovalSuccess}
            />

            <Dialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                    <DialogTitle className="sr-only">Verify Business</DialogTitle>

                    <div className="px-6 pt-4">
                        <h2 className="text-md font-bold text-dark-gray">Verify Business</h2>
                        <p className="text-xs text-medium-gray mt-0.5">Approve or reject the business application</p>
                    </div>

                    <form onSubmit={handleApproveSubmit} className="p-6 space-y-4">
                        <div className="bg-white rounded-2xl p-4 space-y-4">
                            <div className="space-y-1.5">
                                <Label>Decision <span className='text-red-500'>*</span></Label>
                                <Select value={verifyStatus} onValueChange={setVerifyStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Y">Approve</SelectItem>
                                        <SelectItem value="R">Reject</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label>OTP <span className='text-red-500'>*</span></Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                />
                                <p className="text-xs text-medium-gray">{otp.length}/6 digits</p>
                            </div>

                            <div className="space-y-1.5">
                                <Label>
                                    Review Comment {verifyStatus === 'R' && <span className="text-red-500">*</span>}
                                </Label>
                                <Textarea
                                    id="reviewComment"
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder={verifyStatus === 'Y'
                                        ? "Add an optional note for approval..."
                                        : "Provide a reason for rejection..."}
                                    rows={3}
                                    maxLength={500}
                                />
                                <div className="flex justify-between text-xs text-medium-gray">
                                    <span>
                                        {verifyStatus === 'R'
                                            ? 'Required for rejection'
                                            : 'Optional'}
                                    </span>
                                    <span>{reviewComment.length}/500</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-1 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsApprovalModalOpen(false)}
                                disabled={approveMerchantMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={approveMerchantMutation.isPending || !verifyStatus || !otp}
                                className={`${verifyStatus === 'R' ? 'bg-red-600 hover:bg-red-700' : 'bg-faded-accent hover:bg-faded-accent/50'}`}
                            >
                                <CheckCircle className="w-4 h-4" />
                                {approveMerchantMutation.isPending ? 'Processing...' : verifyStatus === 'R' ? 'Reject Business' : 'Approve Business'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};