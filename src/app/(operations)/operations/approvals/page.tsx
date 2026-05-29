// 'use client'
// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Download, Search, Eye, CheckCircle, XCircle, Building, Mail, Phone, View, Edit } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import Link from 'next/link';
// import { toast } from 'sonner';
// import { Badge } from '@/components/ui/badge';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useMutation } from '@tanstack/react-query';
// import { usePermission } from '@/hooks/usePermission';
// import { PermissionButton } from '@/components/Operations/permission/permission-button';
// import { useRouter } from 'next/navigation';

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
//     photoLink: string | null;
//     subscriptionTierCode: string | null;
//     subscriptionType: string | null;
// }

// interface Column {
//     title: string;
//     dataIndex: string;
//     key: string;
//     width?: number;
//     render?: (value: any, record: Merchant, index: number) => React.ReactNode;
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

// const DynamicTable = ({
//     columns,
//     data,
//     itemsPerPage = 15,
//     onViewDetails,
//     onApproveMerchant,
//     searchTerm
// }: {
//     columns: Column[];
//     data: Merchant[];
//     itemsPerPage?: number;
//     onViewDetails: (merchant: Merchant) => void;
//     onApproveMerchant: (merchant: Merchant) => void;
//     searchTerm: string;
// }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const totalPages = Math.ceil(data.length / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const currentData = data.slice(startIndex, endIndex);
//     const router = useRouter();

//     useEffect(() => {
//         setCurrentPage(1);
//     }, [searchTerm]);

//     const handleViewDetails = (merchant: Merchant) => {
//         setSelectedMerchant(merchant);
//         setIsModalOpen(true);
//         onViewDetails(merchant);
//     };

//     const handlePageChange = (page: number) => {
//         if (page >= 1 && page <= totalPages) {
//             setCurrentPage(page);
//         }
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

//     const columnsWithHandler = columns.map(col => {
//         if (col.key === 'actions') {
//             return {
//                 ...col,
//                 render: (text: string, record: Merchant) => (
//                     <div className="flex gap-2">
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="p-1 hover:bg-accent/10"
//                             onClick={() => handleViewDetails(record)}
//                         >
//                             <Eye className="w-5 h-5 text-accent-foreground" />
//                         </Button>
//                         <PermissionButton
//                             requiredPermissions={['MANAGE_MERCHANTS']}
//                             requireAll={true}
//                             hideIfNoPermission={false}
//                             tooltipMessage="You do not have permission to manage business"
//                             onClick={() => router.push(`/operations/business/${record.merchantId}`)}
//                             variant="ghost"
//                             size="sm"
//                             className="p-1 hover:bg-accent/10"
//                         >
//                             <Edit className="w-5 h-5 text-accent-foreground" />
//                         </PermissionButton>
//                         <PermissionButton
//                             requiredPermissions={['CAN_APPROVE']}
//                             requireAll={true}
//                             hideIfNoPermission={false}
//                             tooltipMessage="You do not have permission to approve business"
//                             variant="ghost"
//                             size="sm"
//                             className="p-1 hover:bg-accent/10 text-green-600 hover:text-green-700"
//                             onClick={() => onApproveMerchant(record)}
//                         >
//                             <CheckCircle className="w-4 h-4" />
//                         </PermissionButton>
//                     </div>
//                 )
//             };
//         }
//         return col;
//     });

//     return (
//         <>
//             <div className="w-full overflow-x-auto">
//                 <table className="w-full border-collapse">
//                     <thead>
//                         <tr className="border-b-2 border-accent/20">
//                             {columnsWithHandler.map((column) => (
//                                 <th
//                                     key={column.key}
//                                     className="text-left p-3 font-bold text-sm text-accent-foreground"
//                                     style={{ width: column.width ? `${column.width}px` : 'auto' }}
//                                 >
//                                     {column.title}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentData.map((item, index) => (
//                             <tr
//                                 key={item.id}
//                                 className={`border-b border-accent/10 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
//                             >
//                                 {columnsWithHandler.map((column) => (
//                                     <td key={column.key} className="p-3 text-sm text-accent-foreground">
//                                         {column.render
//                                             ? column.render(item[column.dataIndex as keyof Merchant], item, index)
//                                             : getDisplayValue(item[column.dataIndex as keyof Merchant])
//                                         }
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-accent/10 gap-4">
//                 <p className="text-sm text-accent-foreground/70">
//                     Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Merchants
//                 </p>
//                 <div className="flex items-center gap-2">
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="text-xs border-accent/20 hover:bg-accent/10"
//                     >
//                         Previous
//                     </Button>

//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                         <Button
//                             key={page}
//                             variant={currentPage === page ? "default" : "outline"}
//                             size="sm"
//                             onClick={() => handlePageChange(page)}
//                             className={`w-8 h-8 p-0 text-xs ${currentPage === page ? 'bg-accent text-white' : 'border-accent/20 hover:bg-accent/10'}`}
//                         >
//                             {page}
//                         </Button>
//                     ))}

//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className="text-xs border-accent/20 hover:bg-accent/10"
//                     >
//                         Next
//                     </Button>
//                 </div>
//             </div>

//             <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//                 <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
//                     <DialogHeader className='flex flex-col'>
//                         <DialogTitle className="text-accent-foreground">Business Details - {selectedMerchant?.businessName}</DialogTitle>
//                         <DialogDescription>
//                             Detailed information about the business
//                         </DialogDescription>
//                     </DialogHeader>

//                     {selectedMerchant && (
//                         <div className="py-4">
//                             <div className="flex items-center gap-4 mb-6">
//                                 <Avatar className="w-20 h-20">
//                                     <AvatarImage src={selectedMerchant.photoLink || "/lovable-uploads/02ad6048-41c8-4298-9103-f9760c690183.png"} />
//                                     <AvatarFallback className="text-lg bg-accent text-white">
//                                         {getInitials(selectedMerchant.businessName)}
//                                     </AvatarFallback>
//                                 </Avatar>
//                                 <div>
//                                     <h3 className="text-lg font-semibold text-accent-foreground">
//                                         {getDisplayValue(selectedMerchant.businessName)}
//                                     </h3>
//                                     <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedMerchant.merchantId)}</p>
//                                     <div className="flex gap-2 mt-1">
//                                         <Badge className={`${getStatusColor(selectedMerchant.status)} text-xs px-2 py-1 w-fit`}>
//                                             {getDisplayValue(selectedMerchant.status)}
//                                         </Badge>
//                                         <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1 w-fit">
//                                             {getDisplayValue(selectedMerchant.businessType)}
//                                         </Badge>
//                                         <div className='flex gap-2 items-center'>
//                                             <Badge className={getTierColor(selectedMerchant.subscriptionTierCode || '')}>
//                                                 {selectedMerchant?.subscriptionTierCode ? `${selectedMerchant.subscriptionTierCode}` : 'No active subscription'}
//                                             </Badge>
//                                             <Badge className={getTypeColor(selectedMerchant?.subscriptionType || '')}>
//                                                 {selectedMerchant?.subscriptionType ? `${selectedMerchant.subscriptionType}` : ''}
//                                             </Badge>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                                 <div className="space-y-2">
//                                     <p className="text-sm font-medium text-accent-foreground">Merchant ID:</p>
//                                     <p className="text-sm text-accent-foreground">{getDisplayValue(selectedMerchant.merchantId)}</p>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-sm font-medium text-accent-foreground">Business Type:</p>
//                                     <p className="text-sm text-accent-foreground">{getDisplayValue(selectedMerchant.businessType)}</p>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-sm font-medium text-accent-foreground">Status:</p>
//                                     <Badge className={`${getStatusColor(selectedMerchant.status)} text-xs px-2 py-1 w-fit`}>
//                                         {getDisplayValue(selectedMerchant.status)}
//                                     </Badge>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-sm font-medium text-accent-foreground">Merchant Type:</p>
//                                     <p className="text-sm text-accent-foreground">{getDisplayValue(selectedMerchant.merchantType)}</p>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-sm font-medium text-accent-foreground">Created Date:</p>
//                                     <p className="text-sm text-accent-foreground">{getDisplayValue(selectedMerchant.createdDate)}</p>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-sm font-medium text-accent-foreground">Settlement Account Type:</p>
//                                     <p className="text-sm text-accent-foreground">{getDisplayValue(selectedMerchant.settlementAccountType)}</p>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-sm font-medium text-accent-foreground">Settlement Period Type:</p>
//                                     <p className="text-sm text-accent-foreground">{getDisplayValue(selectedMerchant.settlementPeriodType)}</p>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-sm font-medium text-accent-foreground">Account Number:</p>
//                                     <p className="text-sm text-accent-foreground">{getDisplayValue(selectedMerchant.virtualAccountNo || selectedMerchant.accountNo)}</p>
//                                 </div>
//                             </div>

//                             <div className="border-t border-accent/10 pt-4 mt-4">
//                                 <h4 className="font-medium text-accent-foreground mb-3">Contact Information</h4>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     {selectedMerchant.email && (
//                                         <div className="flex items-center gap-2">
//                                             <Mail className="w-4 h-4 text-accent-foreground/70" />
//                                             <p className="text-sm text-accent-foreground">{getDisplayValue(selectedMerchant.email)}</p>
//                                         </div>
//                                     )}
//                                     {selectedMerchant.mobileNo && (
//                                         <div className="flex items-center gap-2">
//                                             <Phone className="w-4 h-4 text-accent-foreground/70" />
//                                             <p className="text-sm text-accent-foreground">{getDisplayValue(selectedMerchant.mobileNo)}</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="border-t border-accent/10 pt-4 mt-4">
//                                 <h4 className="font-medium text-accent-foreground mb-3">Location Information</h4>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     {selectedMerchant.address && (
//                                         <div className="space-y-2">
//                                             <p className="text-sm font-medium text-accent-foreground">Address:</p>
//                                             <p className="text-sm text-accent-foreground">{getDisplayValue(selectedMerchant.address)}</p>
//                                         </div>
//                                     )}
//                                     {selectedMerchant.city && (
//                                         <div className="space-y-2">
//                                             <p className="text-sm font-medium text-accent-foreground">City:</p>
//                                             <p className="text-sm text-accent-foreground">{getDisplayValue(selectedMerchant.city)}</p>
//                                         </div>
//                                     )}
//                                     {selectedMerchant.countryCode && (
//                                         <div className="space-y-2">
//                                             <p className="text-sm font-medium text-accent-foreground">Country Code:</p>
//                                             <p className="text-sm text-accent-foreground">{getDisplayValue(selectedMerchant.countryCode)}</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="border-t border-accent/10 pt-4 mt-4">
//                                 <h4 className="font-medium text-accent-foreground mb-3">Bank Information</h4>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div className="space-y-2">
//                                         <p className="text-sm font-medium text-accent-foreground">Account Name:</p>
//                                         <p className="text-sm text-accent-foreground">{getDisplayValue(selectedMerchant.bankAccountName)}</p>
//                                     </div>
//                                     <div className="space-y-2">
//                                         <p className="text-sm font-medium text-accent-foreground">Bank Name:</p>
//                                         <p className="text-sm text-accent-foreground">{getDisplayValue(selectedMerchant.bankName)}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// };

// const MobileMerchantCard = ({ merchant, onViewDetails }: { merchant: Merchant; onViewDetails: (merchant: Merchant) => void }) => {
//     return (
//         <div className="bg-white rounded-lg p-4 space-y-3 border border-accent/20">
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                     <Avatar className="w-12 h-12">
//                         <AvatarFallback className="bg-accent text-white">
//                             {getInitials(merchant.businessName)}
//                         </AvatarFallback>
//                     </Avatar>
//                     <div>
//                         <p className="text-sm font-semibold text-accent-foreground">
//                             {getDisplayValue(merchant.businessName)}
//                         </p>
//                         <p className="text-xs text-accent-foreground/70">{getDisplayValue(merchant.merchantId)}</p>
//                     </div>
//                 </div>
//                 <Badge className={`${getStatusColor(merchant.status)} text-xs px-2 py-1`}>
//                     {getDisplayValue(merchant.status)}
//                 </Badge>
//             </div>

//             <div className="text-sm text-accent-foreground/80 flex items-center gap-2">
//                 <Building className="w-4 h-4" />
//                 <span>{getDisplayValue(merchant.businessType)}</span>
//             </div>

//             {merchant.email && (
//                 <div className="text-sm text-accent-foreground/80 flex items-center gap-2">
//                     <Mail className="w-4 h-4" />
//                     <span>{getDisplayValue(merchant.email)}</span>
//                 </div>
//             )}

//             <div className="flex items-center justify-between pt-2 border-t border-accent/10">
//                 <div>
//                     <p className="text-xs text-accent-foreground/70">Created</p>
//                     <p className="text-sm font-medium text-accent-foreground">{getDisplayValue(merchant.createdDate)}</p>
//                 </div>
//                 <Button
//                     variant="ghost"
//                     size="sm"
//                     className="p-1 hover:bg-accent/10"
//                     onClick={() => onViewDetails(merchant)}
//                 >
//                     <Eye className="w-5 h-5 text-accent-foreground" />
//                 </Button>
//                 <Button
//                     variant="ghost"
//                     size="sm"
//                     className="p-1 hover:bg-accent/10"
//                     asChild
//                 >
//                     <Link href={`/operations/business/${merchant.merchantId}`}>
//                         <Edit className="w-5 h-5 text-accent-foreground" />
//                     </Link>
//                 </Button>
//             </div>
//         </div>
//     );
// };

// const ApproveMerchantModal = ({
//     isOpen,
//     onClose,
//     merchant
// }: {
//     isOpen: boolean;
//     onClose: () => void;
//     merchant: Merchant | null;
// }) => {
//     const [verifyStatus, setVerifyStatus] = useState<string>('');
//     const [reviewComment, setReviewComment] = useState<string>('');
//     const [otp, setOtp] = useState('');

//     const approveMerchantMutation = useMutation({
//         mutationFn: (payload: any) =>
//             axiosOperations.post('/merchant/authorize', payload, {
//                 params: { otp }
//             }),
//         onSuccess: (data) => {
//             if (data?.data?.code === '000') {
//                 toast.success(verifyStatus === 'Y' ? 'Merchant approved successfully' : 'Merchant rejected successfully');
//                 onClose();
//                 setVerifyStatus('');
//                 setReviewComment('');
//                 setOtp('');
//             } else {
//                 toast.error(data?.data?.desc || 'Operation failed');
//             }
//         },
//         onError: (error: any) => {
//             toast.error(error.response?.data?.message || 'Operation failed');
//         }
//     });

//     const handleSubmit = (e: React.FormEvent) => {
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

//     return (
//         <Dialog open={isOpen} onOpenChange={onClose}>
//             <DialogContent className="sm:max-w-md">
//                 <DialogHeader className='flex flex-col'>
//                     <DialogTitle className="text-accent-foreground">Approve Business</DialogTitle>
//                     <DialogDescription>
//                         Approve or reject the business application
//                     </DialogDescription>
//                 </DialogHeader>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="space-y-2">
//                         <Label htmlFor="verifyStatus" className="text-accent-foreground">Verify Status *</Label>
//                         <Select value={verifyStatus} onValueChange={setVerifyStatus}>
//                             <SelectTrigger className="border-accent/20">
//                                 <SelectValue placeholder="Select status" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="Y">Approve</SelectItem>
//                                 <SelectItem value="R">Reject</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="otp" className="text-accent-foreground">Enter OTP *</Label>
//                         <Input
//                             id="otp"
//                             type="text"
//                             value={otp}
//                             onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                             placeholder="Enter 6-digit OTP"
//                             className="border-accent/20 text-accent-foreground"
//                             required
//                             maxLength={6}
//                         />
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="reviewComment" className="text-accent-foreground">
//                             Review Comment {verifyStatus === 'R' && <span className="text-red-500">*</span>}
//                         </Label>
//                         <Textarea
//                             id="reviewComment"
//                             value={reviewComment}
//                             onChange={(e) => setReviewComment(e.target.value)}
//                             placeholder={verifyStatus === 'Y'
//                                 ? "Add a note for approving this merchant..."
//                                 : "Provide a reason for rejecting this merchant..."}
//                             rows={3}
//                             className="border-accent/20 text-accent-foreground"
//                             maxLength={500}
//                             required={verifyStatus === 'R'}
//                         />
//                         <div className="flex justify-between text-xs text-accent-foreground/70">
//                             <span>
//                                 {verifyStatus === 'R'
//                                     ? 'Comment is required for rejection'
//                                     : 'Optional comment'}
//                             </span>
//                             <span>{reviewComment.length}/500</span>
//                         </div>
//                     </div>

//                     <div className="flex justify-end gap-3 pt-4">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={onClose}
//                             disabled={approveMerchantMutation.isPending}
//                             className="border-accent/20 hover:bg-accent/10"
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             type="submit"
//                             disabled={approveMerchantMutation.isPending || !verifyStatus || !otp}
//                             className="bg-accent hover:bg-accent/90 text-white gap-2"
//                         >
//                             <CheckCircle className="w-4 h-4" />
//                             {approveMerchantMutation.isPending ? 'Processing...' : 'Submit'}
//                         </Button>
//                     </div>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default function ApprovalsPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('CAN_APPROVE', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to approve business"
//     });

//     const { data, isLoading, error, refetch } = useQuery({
//         queryKey: ['unverified-merchants'],
//         queryFn: () => axiosOperations.request({
//             url: '/merchant/unverified',
//             method: 'GET',
//             params: {
//                 pageNumber: 1,
//                 pageSize: 100,
//                 name: '',
//                 merchantId: ''
//             }
//         })
//     });

//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
//     const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

//     const merchants: Merchant[] = data?.data?.content || [];

//     const filteredMerchants = merchants.filter(merchant => {
//         const searchLower = searchTerm.toLowerCase();
//         return (
//             (merchant.businessName?.toLowerCase() || '').includes(searchLower) ||
//             (merchant.merchantId?.toLowerCase() || '').includes(searchLower) ||
//             (merchant.email?.toLowerCase() || '').includes(searchLower) ||
//             (merchant.businessType?.toLowerCase() || '').includes(searchLower)
//         );
//     });

//     const handleViewDetails = (merchant: Merchant) => {
//     };

//     const handleApproveMerchant = (merchant: Merchant) => {
//         setSelectedMerchant(merchant);
//         setIsApproveModalOpen(true);
//     };

//     const columns: Column[] = [
//         {
//             title: 'S/N',
//             dataIndex: 'id',
//             key: 'sn',
//             width: 80,
//             render: (text: string, record: Merchant, index: number) => (
//                 <p className="text-sm text-accent-foreground">{index + 1}</p>
//             ),
//         },
//         {
//             title: 'Merchant ID',
//             dataIndex: 'merchantId',
//             key: 'merchantId',
//             width: 180,
//             render: (text: string) => (
//                 <p className="text-sm font-medium text-accent-foreground">{getDisplayValue(text)}</p>
//             ),
//         },
//         {
//             title: 'Name',
//             dataIndex: 'businessName',
//             key: 'name',
//             width: 200,
//             render: (text: string) => (
//                 <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
//             ),
//         },
//         {
//             title: 'Email',
//             dataIndex: 'email',
//             key: 'email',
//             width: 200,
//             render: (text: string) => (
//                 <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
//             ),
//         },
//         {
//             title: 'Type of Business',
//             dataIndex: 'businessType',
//             key: 'businessType',
//             width: 150,
//             render: (text: string) => (
//                 <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
//             ),
//         },
//         {
//             title: 'Sub. Tier',
//             dataIndex: 'subscriptionTierCode',
//             key: 'subscriptionTierCode',
//             width: 150,
//             render: (text: string) => (
//                 <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
//             ),
//         },
//         {
//             title: 'Sub. Type',
//             dataIndex: 'subscriptionType',
//             key: 'subscriptionType',
//             width: 150,
//             render: (text: string) => (
//                 <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
//             ),
//         },
//         {
//             title: 'Status',
//             dataIndex: 'status',
//             key: 'status',
//             width: 120,
//             render: (text: string) => (
//                 <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 w-fit`}>
//                     {getDisplayValue(text)}
//                 </Badge>
//             ),
//         },
//         {
//             title: 'Actions',
//             dataIndex: 'actions',
//             key: 'actions',
//             width: 120,
//             render: (text: string, record: Merchant) => (
//                 <div className="flex gap-2">
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-1 hover:bg-accent/10"
//                         onClick={() => handleViewDetails(record)}
//                     >
//                         <Eye className="w-5 h-5 text-accent-foreground" />
//                     </Button>
//                     <Link href={`/operations/business/${record.merchantId}`}>
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="p-1 hover:bg-accent/10"
//                         >
//                             <Edit className="w-5 h-5 text-accent-foreground" />
//                         </Button>
//                     </Link>
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-1 hover:bg-accent/10 text-green-600 hover:text-green-700"
//                         onClick={() => handleApproveMerchant(record)}
//                     >
//                         <CheckCircle className="w-4 h-4" />
//                     </Button>
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <div className="min-h-screen bg-white">
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center justify-between mb-8">
//                     <div className="flex items-center gap-4">
//                         <div>
//                             <h1 className="text-3xl font-bold text-accent-foreground mb-2">
//                                 Business Approvals
//                             </h1>
//                             <p className="text-accent-foreground/70">
//                                 Review and approve pending business applications
//                             </p>
//                         </div>
//                     </div>
//                     <div className="text-right">
//                         <p className="text-2xl font-bold text-accent-foreground">{merchants.length}</p>
//                         <p className="text-sm text-accent-foreground/70">Pending Approvals</p>
//                     </div>
//                 </div>

//                 <div className="space-y-6">
//                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                         <div className="relative flex-1 max-w-sm w-full">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/70" />
//                             <Input
//                                 placeholder="Search businesses..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10 border-accent/20 text-accent-foreground"
//                             />
//                         </div>

//                         {/* <div className="flex items-center gap-2 w-full sm:w-auto">
//                             <Button variant="outline" className="gap-2 border-accent/20 hover:bg-accent/10">
//                                 <Download className="w-4 h-4" />
//                                 <span className="hidden sm:inline">Export</span>
//                             </Button>
//                         </div> */}
//                     </div>

//                     <Card className="border-accent/20 shadow-sm">
//                         <CardHeader>
//                             <div className="flex items-center justify-between">
//                                 <CardTitle className="text-lg font-semibold text-accent-foreground">
//                                     Pending Business Approvals
//                                 </CardTitle>
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => refetch()}
//                                     className="border-accent/20 hover:bg-accent/10"
//                                 >
//                                     Refresh
//                                 </Button>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             {isLoading ? (
//                                 <div className="flex justify-center items-center h-40">
//                                     <p className="text-accent-foreground/70">Loading approvals...</p>
//                                 </div>
//                             ) : error ? (
//                                 <div className="flex justify-center items-center h-40">
//                                     <p className="text-accent-foreground/70">Error loading approvals</p>
//                                 </div>
//                             ) : merchants.length === 0 ? (
//                                 <div className="flex justify-center items-center h-40">
//                                     <p className="text-accent-foreground/70">No pending approvals found</p>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="block lg:hidden space-y-4">
//                                         {filteredMerchants.map((merchant) => (
//                                             <MobileMerchantCard
//                                                 key={merchant.id}
//                                                 merchant={merchant}
//                                                 onViewDetails={handleViewDetails}
//                                             />
//                                         ))}
//                                     </div>

//                                     <div className="hidden lg:block">
//                                         <DynamicTable
//                                             columns={columns}
//                                             data={filteredMerchants}
//                                             itemsPerPage={15}
//                                             onViewDetails={handleViewDetails}
//                                             onApproveMerchant={handleApproveMerchant}
//                                             searchTerm={searchTerm}
//                                         />
//                                     </div>
//                                 </>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>

//             <ApproveMerchantModal
//                 isOpen={isApproveModalOpen}
//                 onClose={() => {
//                     setIsApproveModalOpen(false);
//                     setSelectedMerchant(null);
//                 }}
//                 merchant={selectedMerchant}
//             />
//         </div>
//     );
// }

'use client'
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, X, CheckCircle } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';
import { PermissionButton } from '@/components/Operations/permission/permission-button';
import { TransInflowIcon, SeperatorIcon, EditIcon } from '@/components/icons/icons';
import { BusinessDetailsModal } from '@/components/Operations/business/business-details';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Papa from 'papaparse';
import { usePageMetadata } from '@/hooks/usePageMetadata';

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

interface FilterState {
    status: string;
    subTier: string;
}

const statusOptions = [
    { id: 'all', label: 'All Status' },
    { id: 'ACTIVE', label: 'Active' },
    { id: 'INACTIVE', label: 'Inactive' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'USER_LOCKED', label: 'Locked' },
    { id: 'Rejected', label: 'Rejected' }
];

const subTierOptions = [
    { id: 'all', label: 'All Sub. Tiers' },
    { id: 'PREMIUM', label: 'Premium' },
    { id: 'STANDARD', label: 'Standard' },
    { id: 'BASIC', label: 'Basic' },
];

const getStatusColor = (status: string): string => {
    if (!status) return 'bg-gray-100 text-gray-600 border-gray-200';
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
        case 'ACTIVE':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'INACTIVE':
        case 'USER_LOCKED':
        case 'REJECTED':
        case 'REJECT':
            return 'bg-red-100 text-red-700 border-red-200';
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
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

const ApproveMerchantModal = ({
    isOpen,
    onClose,
    merchant,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    merchant: Merchant | null;
    onSuccess: () => void;
}) => {
    const [verifyStatus, setVerifyStatus] = useState<string>('Y');
    const [reviewComment, setReviewComment] = useState<string>('');
    const [otp, setOtp] = useState('');

    const approveMerchantMutation = useMutation({
        mutationFn: (payload: any) =>
            axiosOperations.post('/merchant/authorize', payload, {
                params: { otp }
            }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success(verifyStatus === 'Y' ? 'Merchant approved successfully' : 'Merchant rejected successfully');
                onSuccess();
                onClose();
                setVerifyStatus('Y');
                setReviewComment('');
                setOtp('');
            } else {
                toast.error(data?.data?.desc || 'Operation failed');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                <DialogTitle className="sr-only">Verify Business</DialogTitle>
                <div className="px-6 pt-5">
                    <h2 className="text-base font-bold text-dark-gray">Verify Business</h2>
                    <p className="text-xs text-medium-gray mt-0.5">Approve or reject {merchant?.businessName}'s application</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-white rounded-2xl m-6 p-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="verifyStatus" className="text-dark-gray">Verify Status *</Label>
                            <Select value={verifyStatus} onValueChange={setVerifyStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Y">Approve</SelectItem>
                                    <SelectItem value="R">Reject</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="otp" className="text-dark-gray">Enter OTP *</Label>
                            <Input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Enter 6-digit OTP"
                                required
                                maxLength={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reviewComment" className="text-dark-gray">
                                Review Comment {verifyStatus === 'R' && <span className="text-red-500">*</span>}
                            </Label>
                            <Textarea
                                id="reviewComment"
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder={verifyStatus === 'Y'
                                    ? "Add a note for approving this business..."
                                    : "Provide a reason for rejecting this business..."}
                                rows={3}
                                maxLength={500}
                                required={verifyStatus === 'R'}
                            />
                            <div className="flex justify-between text-xs text-medium-gray">
                                <span>
                                    {verifyStatus === 'R'
                                        ? 'Comment is required for rejection'
                                        : 'Optional comment'}
                                </span>
                                <span>{reviewComment.length}/500</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 px-6 py-3 bg-white justify-end rounded-b-2xl">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={approveMerchantMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={approveMerchantMutation.isPending || !verifyStatus || !otp || otp.length !== 6}
                            className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            {approveMerchantMutation.isPending ? 'Processing...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const TablePagination = ({
    current, total, perPage, onChange,
}: { current: number; total: number; perPage: number; onChange: (p: number) => void }) => {
    const pages = Math.ceil(total / perPage);
    const start = (current - 1) * perPage + 1;
    const end = Math.min(current * perPage, total);

    const getPageNumbers = () => {
        if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
        const result: (number | '...')[] = [];
        if (current <= 3) result.push(1, 2, 3, '...', pages);
        else if (current >= pages - 2) result.push(1, '...', pages - 2, pages - 1, pages);
        else result.push(1, '...', current, '...', pages);
        return result;
    };

    return (
        <div className="flex items-center justify-between mt-4 pt-4 mb-10">
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Merchants per Page</p>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current - 1)} disabled={current === 1}>
                    <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                {getPageNumbers().map((p, i) =>
                    p === '...' ? (
                        <span key={`e-${i}`} className="text-xs text-gray-400 px-1">···</span>
                    ) : (
                        <button key={p} onClick={() => onChange(p as number)}
                            className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${p === current ? 'border-2 border-orange-400 text-orange-500' : 'text-gray-600 hover:bg-gray-100'}`}>
                            {p}
                        </button>
                    )
                )}
                <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current + 1)} disabled={current === pages}>
                    Next <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default function ApprovalsPage() {
    usePageMetadata('Business Approvals', 'Review and approve pending business applications.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('CAN_APPROVE', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to approve business",
    });

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [merchantToApprove, setMerchantToApprove] = useState<Merchant | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        status: 'all',
        subTier: 'all'
    });
    const ITEMS_PER_PAGE = 10;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['unverified-merchants'],
        queryFn: () => axiosOperations.request({
            url: '/merchant/unverified', method: 'GET',
            params: { pageNumber: 1, pageSize: 5000, name: '', merchantId: '' },
        }),
    });

    const merchants: Merchant[] = data?.data?.content || [];

    const filtered = useMemo(() => {
        return merchants.filter((m) => {
            const s = searchTerm.toLowerCase().trim();
            const matchesSearch = !s || (
                m.businessName?.toLowerCase().includes(s) ||
                m.merchantId?.toLowerCase().includes(s) ||
                m.email?.toLowerCase().includes(s) ||
                m.businessType?.toLowerCase().includes(s) ||
                m.username?.toLowerCase().includes(s) ||
                m.firstname?.toLowerCase().includes(s) ||
                m.lastname?.toLowerCase().includes(s)
            );

            const matchesStatus = filters.status === 'all' ||
                m.status?.toUpperCase() === filters.status.toUpperCase();

            const matchesSubTier = filters.subTier === 'all' ||
                m.subscriptionTierCode?.toUpperCase() === filters.subTier.toUpperCase();

            return matchesSearch && matchesStatus && matchesSubTier;
        });
    }, [merchants, searchTerm, filters]);

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleApproveMerchant = (merchant: Merchant) => {
        setMerchantToApprove(merchant);
        setIsApproveModalOpen(true);
    };

    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const exportToCSV = () => {
        if (!filtered.length) { toast.error('No data to export'); return; }
        const csv = Papa.unparse(filtered.map((m) => ({
            'Business Name': m.businessName, 'Merchant ID': m.merchantId,
            'Email': m.email, 'Business Type': m.businessType,
            'Sub Tier': m.subscriptionTierCode, 'Sub Type': m.subscriptionType,
            'Status': m.status, 'Created Date': m.createdDate,
        })), { header: true });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = `approvals-${new Date().toISOString().split('T')[0]}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Export complete');
    };

    const FilterBar: React.FC<{
        filters: FilterState;
        onChange: (f: FilterState) => void;
        onExport: () => void;
        searchTerm: string;
        onSearchChange: (term: string) => void;
    }> = ({ filters, onChange, onExport, searchTerm, onSearchChange }) => {
        const hasActive = filters.status !== 'all' || filters.subTier !== 'all';

        const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });
        const clear = () => onChange({
            status: 'all',
            subTier: 'all'
        });

        return (
            <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                    <Input
                        value={searchTerm}
                        onChange={(e) => {
                            onSearchChange(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Search businesses..."
                        className="pl-9 text-medium-gray"
                    />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Select
                        value={filters.status}
                        onValueChange={(v) => update({ status: v })}
                    >
                        <SelectTrigger className="bg-white w-32">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                    {s.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.subTier}
                        onValueChange={(v) => update({ subTier: v })}
                    >
                        <SelectTrigger className="bg-white w-36">
                            <SelectValue placeholder="All Tiers" />
                        </SelectTrigger>
                        <SelectContent>
                            {subTierOptions.map((tier) => (
                                <SelectItem key={tier.id} value={tier.id}>
                                    {tier.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {hasActive && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clear}
                            className="gap-1 text-xs"
                        >
                            <X className="w-3.5 h-3.5" /> Clear
                        </Button>
                    )}

                    <SeperatorIcon />
                    <Button onClick={onExport} size="lg">
                        <TransInflowIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Export</span>
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen px-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                    <p className="text-sm text-medium-gray mb-1">Pending Approvals</p>
                    <p className="text-2xl font-semibold text-dark-gray">
                        {filtered.filter(m => m.status?.toUpperCase() === 'PENDING').length.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                    <p className="text-sm text-medium-gray mb-1">Rejected</p>
                    <p className="text-2xl font-semibold text-dark-gray">
                        {filtered.filter(m => m.status?.toUpperCase() === 'REJECTED').length.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="mb-4">
                <FilterBar
                    filters={filters}
                    onChange={handleFilterChange}
                    onExport={exportToCSV}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading businesses</div>
            ) : (
                <>
                    <div className="hidden lg:block">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <p className="text-2xl font-medium text-dark-gray">No businesses found</p>
                                <p className="text-sm text-medium-gray">Try adjusting your search</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#EEEEEE]">
                                                {['Merchant ID', 'Name', 'Email', 'Business Type', 'Sub. Tier', 'Sub. Type', 'Status', ''].map((h) => (
                                                    <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map((m, idx) => (
                                                <tr key={m.id}
                                                    onClick={() => { setSelectedMerchant(m); setIsDetailsOpen(true); }}
                                                    className={`border-b-2 border-[#EEEEEE] cursor-pointer hover:bg-orange-50/40 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm font-medium text-dark-gray">{getDisplayValue(m.merchantId)}</p>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <div className="flex items-center gap-3">
                                                            <p className="text-sm font-semibold text-dark-gray">{m.businessName}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm text-dark-gray">{getDisplayValue(m.email)}</p>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm text-dark-gray">{getDisplayValue(m.businessType)}</p>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm text-dark-gray">{getDisplayValue(m.subscriptionTierCode)}</p>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm text-dark-gray">{getDisplayValue(m.subscriptionType)}</p>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(m.status)}`}>
                                                            {m.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center gap-1">
                                                            <Button size="xs" variant="action"
                                                                onClick={() => { setSelectedMerchant(m); setIsDetailsOpen(true); }}
                                                                title="View Details">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <PermissionButton
                                                                requiredPermissions={['MANAGE_MERCHANTS']}
                                                                requireAll={true} hideIfNoPermission={false}
                                                                tooltipMessage="No permission to manage business"
                                                                onClick={() => router.push(`/operations/business/create?edit=true&id=${m.merchantId}`)}
                                                                size="xs" variant="action">
                                                                <EditIcon className="w-4 h-4" />
                                                            </PermissionButton>
                                                            <Button
                                                                size="xs"
                                                                variant="action"
                                                                onClick={() => handleApproveMerchant(m)}
                                                                title="Approve Business"
                                                                className="text-green-600 hover:text-green-700"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {Math.ceil(filtered.length / ITEMS_PER_PAGE) > 1 && (
                                    <TablePagination
                                        current={currentPage} total={filtered.length}
                                        perPage={ITEMS_PER_PAGE} onChange={setCurrentPage}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    <div className="lg:hidden space-y-3 py-2">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                                <p className="text-sm font-medium text-dark-gray">No businesses found</p>
                            </div>
                        ) : (
                            filtered.map((m) => (
                                <div key={m.id}
                                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                                    onClick={() => { setSelectedMerchant(m); setIsDetailsOpen(true); }}>
                                    <div className="flex items-center gap-3 p-4">
                                        <Avatar className="w-10 h-10 shrink-0">
                                            <AvatarImage src={m.photoLink as string} />
                                            <AvatarFallback className="bg-[#F5F5F5] text-dark-gray font-semibold text-sm">
                                                {getInitials(m.businessName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-dark-gray truncate">{m.businessName}</p>
                                            <p className="text-xs text-medium-gray mt-0.5">{m.merchantId}</p>
                                        </div>
                                        <Badge className={`text-[10px] px-2 py-0.5 border font-medium ${getStatusColor(m.status)}`}>
                                            {m.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100"
                                        onClick={(e) => e.stopPropagation()}>
                                        <p className="text-xs text-medium-gray">{m.businessType}</p>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="xs"
                                                variant="action"
                                                onClick={() => handleApproveMerchant(m)}
                                                className="text-green-600 hover:text-green-700"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </Button>
                                            <Button size="xs" variant="action" onClick={() => router.push(`/operations/business/create?edit=true&id=${m.merchantId}`)}>
                                                <EditIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            <BusinessDetailsModal
                merchant={selectedMerchant}
                open={isDetailsOpen}
                onClose={() => { setIsDetailsOpen(false); setSelectedMerchant(null); }}
                merchantCode={selectedMerchant?.merchantId}
            />

            <ApproveMerchantModal
                isOpen={isApproveModalOpen}
                onClose={() => {
                    setIsApproveModalOpen(false);
                    setMerchantToApprove(null);
                }}
                merchant={merchantToApprove}
                onSuccess={() => {
                    refetch();
                }}
            />
        </div>
    );
}