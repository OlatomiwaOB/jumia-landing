'use client'
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, Plus, Search, Eye, Phone, Mail, User, Edit, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import useOperations from '@/store/operationsStore';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/usePermission';
import { PermissionButton } from '@/components/Operations/permission/permission-button';

interface UserInfo {
    id: number;
    firstname: string;
    middlename: string | null;
    lastname: string;
    username: string;
    email: string;
    mobileNo: string;
    userRole: string;
    status: string;
    fullname: string;
    merchantCode: string;
    storeCode: string;
    merchantGroupCode: string;
    entityCode: string;
    branchCode: string;
    deviceId: string;
    country: string;
    city: string | null;
    address: string;
    language: string;
    lastLoginDate: string | null;
    verifyStatus: string;
    authStatus: string;
    createdDate: string;
    bvn: string | null;
    gender: string | null;
    referalCode: string;
    walletNo: string | null;
    photoLink: string | Blob;
}

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
    photoLink: string | null;
}

interface Column {
    title: string;
    dataIndex: string;
    key: string;
    width?: number;
    render?: (value: any, record: UserInfo, index: number) => React.ReactNode;
}

const getStatusColor = (status: string): string => {
    if (!status) return 'bg-accent text-white';

    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
        case 'ACTIVE':
        case 'Y':
            return 'bg-accent text-white';
        case 'INACTIVE':
        case 'N':
            return 'bg-accent text-white opacity-70';
        case 'PENDING':
            return 'bg-accent text-white opacity-80';
        default:
            return 'bg-accent text-white';
    }
};

const getDisplayValue = (value: any): string => {
    return value?.toString() || 'N/A';
};

const getInitials = (fullName: string): string => {
    if (!fullName) return 'NA';
    const names = fullName.split(' ');
    const firstInitial = names[0]?.charAt(0) || '';
    const lastInitial = names[names.length - 1]?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
};

const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
};

const ApproveUserModal = ({
    isOpen,
    onClose,
    user
}: {
    isOpen: boolean;
    onClose: () => void;
    user: UserInfo | null;
}) => {
    const [verifyStatus, setVerifyStatus] = useState<string>('');
    const [reviewComment, setReviewComment] = useState<string>('');
    const [otp, setOtp] = useState('');

    const approveUserMutation = useMutation({
        mutationFn: (payload: any) =>
            axiosOperations.post('/usermanager/authorizeUser', payload, {
                params: { otp }
            }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success(verifyStatus === 'Y' ? 'User approved successfully' : 'User rejected successfully');
                onClose();
                setVerifyStatus('');
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
            id: user?.id,
            verifyStatus: verifyStatus,
            requestType: 'USER',
            referenceNo: user?.username,
            comment: reviewComment,
            otp: otp
        }];

        approveUserMutation.mutate(payload);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className='flex flex-col'>
                    <DialogTitle className="text-accent-foreground">Approve User</DialogTitle>
                    <DialogDescription>
                        Approve or reject the user created
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="verifyStatus" className="text-accent-foreground">Verify Status *</Label>
                        <Select value={verifyStatus} onValueChange={setVerifyStatus}>
                            <SelectTrigger className="border-accent/20">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Y">Approve</SelectItem>
                                <SelectItem value="R">Reject</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="otp" className="text-accent-foreground">Enter OTP *</Label>
                        <Input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Enter 6-digit OTP"
                            className="border-accent/20 text-accent-foreground"
                            required
                            maxLength={6}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reviewComment" className="text-accent-foreground">
                            Review Comment {verifyStatus === 'R' && <span className="text-red-500">*</span>}
                        </Label>
                        <Textarea
                            id="reviewComment"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder={verifyStatus === 'Y'
                                ? "Add a note for approving this user..."
                                : "Provide a reason for rejecting this user..."}
                            rows={3}
                            className="border-accent/20 text-accent-foreground"
                            maxLength={500}
                            required={verifyStatus === 'R'}
                        />
                        <div className="flex justify-between text-xs text-accent-foreground/70">
                            <span>
                                {verifyStatus === 'R'
                                    ? 'Comment is required for rejection'
                                    : 'Optional comment'}
                            </span>
                            <span>{reviewComment.length}/500</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={approveUserMutation.isPending}
                            className="border-accent/20 hover:bg-accent/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={approveUserMutation.isPending || !verifyStatus || !otp}
                            className="bg-accent hover:bg-accent/90 text-white gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            {approveUserMutation.isPending ? 'Processing...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const ApproveMerchantModal = ({
    isOpen,
    onClose,
    merchant
}: {
    isOpen: boolean;
    onClose: () => void;
    merchant: Merchant | null;
}) => {
    const [verifyStatus, setVerifyStatus] = useState<string>('');
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
                onClose();
                setVerifyStatus('');
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader className='flex flex-col'>
                    <DialogTitle className="text-accent-foreground">Approve Business</DialogTitle>
                    <DialogDescription>
                        Approve or reject the business application
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="verifyStatus" className="text-accent-foreground">Verify Status *</Label>
                        <Select value={verifyStatus} onValueChange={setVerifyStatus}>
                            <SelectTrigger className="border-accent/20">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Y">Approve</SelectItem>
                                <SelectItem value="R">Reject</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="otp" className="text-accent-foreground">Enter OTP *</Label>
                        <Input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Enter 6-digit OTP"
                            className="border-accent/20 text-accent-foreground"
                            required
                            maxLength={6}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reviewComment" className="text-accent-foreground">
                            Review Comment {verifyStatus === 'R' && <span className="text-red-500">*</span>}
                        </Label>
                        <Textarea
                            id="reviewComment"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder={verifyStatus === 'Y'
                                ? "Add a note for approving this merchant..."
                                : "Provide a reason for rejecting this merchant..."}
                            rows={3}
                            className="border-accent/20 text-accent-foreground"
                            maxLength={500}
                            required={verifyStatus === 'R'}
                        />
                        <div className="flex justify-between text-xs text-accent-foreground/70">
                            <span>
                                {verifyStatus === 'R'
                                    ? 'Comment is required for rejection'
                                    : 'Optional comment'}
                            </span>
                            <span>{reviewComment.length}/500</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={approveMerchantMutation.isPending}
                            className="border-accent/20 hover:bg-accent/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={approveMerchantMutation.isPending || !verifyStatus || !otp}
                            className="bg-accent hover:bg-accent/90 text-white gap-2"
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

const DynamicTable = ({
    columns,
    data,
    itemsPerPage = 15,
    onViewDetails,
    onEditDetails,
    searchTerm
}: {
    columns: Column[];
    data: UserInfo[];
    itemsPerPage?: number;
    onViewDetails: (user: UserInfo) => void;
    onEditDetails: (user: UserInfo) => void;
    searchTerm: string;
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
    const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isApproveMerchantModalOpen, setIsApproveMerchantModalOpen] = useState(false);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleViewDetails = (user: UserInfo) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        onViewDetails(user);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleApproveUser = (user: UserInfo) => {
        setSelectedUser(user);
        setIsApproveModalOpen(true);
    };

    const handleApproveMerchant = (merchant: Merchant) => {
        setSelectedMerchant(merchant);
        setIsApproveMerchantModalOpen(true);
    };

    const columnsWithHandler = columns.map(col => {
        if (col.key === 'actions') {
            return {
                ...col,
                render: (text: string, record: UserInfo & Merchant) => (
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-accent/10"
                            onClick={() => handleViewDetails(record)}
                        >
                            <Eye className="w-5 h-5 text-accent-foreground" />
                        </Button>
                        <PermissionButton
                            requiredPermissions={['MANAGE_USERS']}
                            requireAll={true}
                            hideIfNoPermission={false}
                            tooltipMessage="You do not have permission to edit users"
                            onClick={() => onEditDetails(record)}
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-accent/10"
                        >
                            <Edit className="w-4 h-4 text-accent-foreground" />
                        </PermissionButton>
                        {record.userRole.toUpperCase() !== 'BUSINESS_MANAGER' && record.status.toLowerCase() === 'pending' && (
                            <PermissionButton
                                requiredPermissions={['CAN_APPROVE']}
                                requireAll={true}
                                hideIfNoPermission={false}
                                tooltipMessage="You do not have permission to approve business"
                                onClick={() => handleApproveUser(record)}
                                variant="ghost"
                                size="sm"
                                className="p-1 hover:bg-accent/10 text-green-600 hover:text-green-700"
                            >
                                <CheckCircle className="w-4 h-4" />
                            </PermissionButton>
                        )}
                    </div>
                )
            };
        }
        return col;
    });

    return (
        <>
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-accent/20">
                            {columnsWithHandler.map((column) => (
                                <th
                                    key={column.key}
                                    className="text-left p-3 font-bold text-sm text-accent-foreground"
                                    style={{ width: column.width ? `${column.width}px` : 'auto' }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr
                                key={item.id}
                                className={`border-b border-accent/10 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
                            >
                                {columnsWithHandler.map((column) => (
                                    <td key={column.key} className="p-3 text-sm text-accent-foreground">
                                        {column.render
                                            ? column.render((item as any)[column.dataIndex as keyof UserInfo], item as any, index)
                                            : getDisplayValue((item as any)[column.dataIndex as keyof UserInfo])
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-accent/10 gap-4">
                <p className="text-sm text-accent-foreground/70">
                    Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Users
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="text-xs border-accent/20 hover:bg-accent/10"
                    >
                        Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 p-0 text-xs ${currentPage === page ? 'bg-accent text-white' : 'border-accent/20 hover:bg-accent/10'}`}
                        >
                            {page}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="text-xs border-accent/20 hover:bg-accent/10"
                    >
                        Next
                    </Button>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle className="text-accent-foreground">User Details - {selectedUser?.fullname}</DialogTitle>
                        <DialogDescription>
                            Detailed information about the selected user
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="py-4">
                            <div className="flex items-center gap-4 mb-6">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage src={selectedUser.photoLink} alt={getInitials(selectedUser.fullname)} />
                                    <AvatarFallback className="text-lg bg-accent text-white">
                                        {getInitials(selectedUser.fullname)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold text-accent-foreground">
                                        {getDisplayValue(selectedUser.fullname)}
                                    </h3>
                                    <p className="text-sm text-accent-foreground/70">{selectedUser.userRole !== "CUSTOMER" ? `@${getDisplayValue(selectedUser.username)}` : ''}</p>
                                    <div className="flex gap-2 mt-1">
                                        <Badge className={`${getStatusColor(selectedUser.status)} text-xs px-2 py-1 w-fit`}>
                                            {getDisplayValue(selectedUser.status)}
                                        </Badge>
                                        <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1 w-fit">
                                            {getDisplayValue(selectedUser.userRole)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-accent-foreground">Username:</p>
                                    <p className="text-sm text-accent-foreground">{getDisplayValue(selectedUser.username)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-accent-foreground">User Role:</p>
                                    <p className="text-sm text-accent-foreground">{getDisplayValue(selectedUser.userRole)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-accent-foreground">Status:</p>
                                    <Badge className={`${getStatusColor(selectedUser.status)} text-xs px-2 py-1 w-fit`}>
                                        {getDisplayValue(selectedUser.status)}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-accent-foreground">User ID:</p>
                                    <p className="text-sm text-accent-foreground">{getDisplayValue(selectedUser.id)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-accent-foreground">Entity Code:</p>
                                    <p className="text-sm text-accent-foreground">{getDisplayValue(selectedUser.entityCode)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-accent-foreground">Branch Code:</p>
                                    <p className="text-sm text-accent-foreground">{getDisplayValue(selectedUser.branchCode)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-accent-foreground">Merchant Code:</p>
                                    <p className="text-sm text-accent-foreground">{getDisplayValue(selectedUser.merchantCode)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-accent-foreground">Store Code:</p>
                                    <p className="text-sm text-accent-foreground">{getDisplayValue(selectedUser.storeCode)}</p>
                                </div>
                            </div>

                            <div className="border-t border-accent/10 pt-4 mt-4">
                                <h4 className="font-medium text-accent-foreground mb-3">Contact Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedUser.mobileNo && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-accent-foreground/70" />
                                            <p className="text-sm text-accent-foreground">{getDisplayValue(selectedUser.mobileNo)}</p>
                                        </div>
                                    )}
                                    {selectedUser.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-accent-foreground/70" />
                                            <p className="text-sm text-accent-foreground">{getDisplayValue(selectedUser.email)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-accent/10 pt-4 mt-4">
                                <h4 className="font-medium text-accent-foreground mb-3">Additional Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-accent-foreground">Created Date:</p>
                                        <p className="text-sm text-accent-foreground">{(selectedUser.createdDate)}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-accent-foreground">Last Login:</p>
                                        <p className="text-sm text-accent-foreground">{(selectedUser.lastLoginDate)}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-accent-foreground">Language:</p>
                                        <p className="text-sm text-accent-foreground">{getDisplayValue(selectedUser.language)}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-accent-foreground">Country:</p>
                                        <p className="text-sm text-accent-foreground">{getDisplayValue(selectedUser.country)}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-accent-foreground">Referral Code:</p>
                                        <p className="text-sm text-accent-foreground">{getDisplayValue(selectedUser.referalCode)}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-accent-foreground">Verification Status:</p>
                                        <p className="text-sm text-accent-foreground">{getDisplayValue(selectedUser.verifyStatus)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <ApproveUserModal
                isOpen={isApproveModalOpen}
                onClose={() => {
                    setIsApproveModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
            />

            <ApproveMerchantModal
                isOpen={isApproveMerchantModalOpen}
                onClose={() => {
                    setIsApproveMerchantModalOpen(false);
                    setSelectedMerchant(null);
                }}
                merchant={selectedMerchant}
            />
        </>
    );
};

const MobileUserCard = ({ user, onViewDetails }: { user: UserInfo; onViewDetails: (user: UserInfo) => void }) => {
    return (
        <div className="bg-white rounded-lg p-4 space-y-3 border border-accent/20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={user.photoLink || "/lovable-uploads/02ad6048-41c8-4298-9103-f9760c690183.png"} />
                        <AvatarFallback className="bg-accent text-white">
                            {getInitials(user.fullname)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold text-accent-foreground">
                            {getDisplayValue(user.fullname)}
                        </p>
                        <p className="text-xs text-accent-foreground/70">{user.userRole !== "CUSTOMER" ? `@${getDisplayValue(user.username)}` : ''}</p>
                    </div>
                </div>
                <Badge className={`${getStatusColor(user.status)} text-xs px-2 py-1`}>
                    {getDisplayValue(user.status)}
                </Badge>
            </div>

            <div className="text-sm text-accent-foreground/80 flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{getDisplayValue(user.userRole)}</span>
            </div>

            {user.mobileNo && (
                <div className="text-sm text-accent-foreground/80 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{getDisplayValue(user.mobileNo)}</span>
                </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-accent/10">
                <div>
                    <p className="text-xs text-accent-foreground/70">User ID</p>
                    <p className="text-sm font-medium text-accent-foreground">{getDisplayValue(user.id)}</p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 hover:bg-accent/10"
                    onClick={() => onViewDetails(user)}
                >
                    <Eye className="w-5 h-5 text-accent-foreground" />
                </Button>
            </div>
        </div>
    );
};

const LinkUserModal = ({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const { operations } = useOperations();
    const [selectedUsername, setSelectedUsername] = useState('');
    const [comment, setComment] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

    const { data: usersData, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['available-users'],
        queryFn: () => axiosOperations.request({
            url: '/usermanager/getUserMasterList',
            method: 'GET',
            params: {
                pageNumber: 1,
                pageSize: 10,
                name: '',
                role: '',
                mobileNo: ''
            }
        }),
        enabled: isOpen
    });

    const users: UserInfo[] = usersData?.data?.userInfoList || [];

    const linkUserMutation = useMutation({
        mutationFn: (linkData: any) =>
            axiosOperations.post('/usermanager/linkstaffstore', linkData),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('User linked successfully');
                onClose();
                setSelectedUsername('');
                setComment('');
                setSelectedUser(null);
            } else {
                toast.error(data?.data?.desc || 'Failed to link user');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to link user');
        }
    });

    const handleUsernameChange = (username: string) => {
        setSelectedUsername(username);
        const user = users.find(u => u.username === username);
        setSelectedUser(user || null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedUsername) {
            toast.error('Please select a username');
            return;
        }

        const payload = {
            username: selectedUsername,
            storeCode: operations?.storeCode || '',
            merchantCode: operations?.merchantCode || '',
            merchantGroupCode: operations?.merchantGroupCode || '',
            entityCode: operations?.entityCode || '',
            comment: comment
        };

        linkUserMutation.mutate(payload);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-accent-foreground">Link Existing User</DialogTitle>
                    <DialogDescription>
                        Link an existing user to your store
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-accent-foreground">Username *</Label>
                        <Select value={selectedUsername} onValueChange={handleUsernameChange}>
                            <SelectTrigger className="border-accent/20">
                                <SelectValue placeholder="Select username" />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoadingUsers ? (
                                    <SelectItem value="loading" disabled>
                                        Loading users...
                                    </SelectItem>
                                ) : users.length === 0 ? (
                                    <SelectItem value="no-users" disabled>
                                        No users found
                                    </SelectItem>
                                ) : (
                                    users.map((user) => (
                                        <SelectItem key={user.id} value={user.username}>
                                            {user.username} - {user.fullname}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-accent-foreground/70">
                            Select an existing user to link to your store
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullname" className="text-accent-foreground">Full Name</Label>
                        <Input
                            id="fullname"
                            value={selectedUser?.fullname || ''}
                            disabled
                            placeholder="Full name will appear here when a user is selected"
                            className="bg-white border-accent/20 text-accent-foreground"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment" className="text-accent-foreground">Comment (Optional)</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add any comments about this user linkage..."
                            rows={3}
                            className="border-accent/20 text-accent-foreground"
                        />
                    </div>

                    {selectedUser && (
                        <div className="bg-accent/5 border border-accent/10 p-3 rounded-lg space-y-2">
                            <p className="text-sm font-medium text-accent-foreground">Selected User Details:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs text-accent-foreground/80">
                                <div>
                                    <span className="font-medium">Email:</span>
                                    <p>{selectedUser.email}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Phone:</span>
                                    <p>{selectedUser.mobileNo}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Role:</span>
                                    <p>{selectedUser.userRole}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Status:</span>
                                    <p>{selectedUser.status}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={linkUserMutation.isPending}
                            className="border-accent/20 hover:bg-accent/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={linkUserMutation.isPending || !selectedUsername}
                            className="gap-2 bg-accent hover:bg-accent/90 text-white"
                        >
                            <LinkIcon className="w-4 h-4" />
                            {linkUserMutation.isPending ? 'Linking...' : 'Link User'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default function UsersPage() {
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('VIEW_USERS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to view users"
    });

    const { operations } = useOperations();
    const router = useRouter();
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['users-list'],
        queryFn: () => axiosOperations.request({
            url: '/usermanager/getUserMasterList',
            method: 'GET',
            params: {
                pageNumber: 1,
                pageSize: 100,
                name: '',
                role: '',
                mobileNo: ''
            }
        })
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

    const users: UserInfo[] = data?.data?.userInfoList || [];

    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (user.fullname?.toLowerCase() || '').includes(searchLower) ||
            (user.username?.toLowerCase() || '').includes(searchLower) ||
            (user.email?.toLowerCase() || '').includes(searchLower) ||
            (user.mobileNo?.toLowerCase() || '').includes(searchLower) ||
            (user.userRole?.toLowerCase() || '').includes(searchLower)
        );
    });

    const handleViewDetails = (user: UserInfo) => {

    };

    const handleEditDetails = (user: UserInfo) => {
        router.push(`/operations/users/create-users?edit=true&id=${user.username}`);
    };

    const handleOpenLinkModal = () => {
        setIsLinkModalOpen(true);
    };

    const handleCloseLinkModal = () => {
        setIsLinkModalOpen(false);
    };

    const columns: Column[] = [
        {
            title: 'User',
            dataIndex: 'fullname',
            key: 'user',
            width: 220,
            render: (text: string, record: UserInfo) => (
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={record.photoLink} alt={getInitials(record.fullname)} />
                        <AvatarFallback className="bg-accent text-white">
                            {getInitials(record.fullname)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium text-accent-foreground">
                            {getDisplayValue(record.fullname)}
                        </p>
                        <p className="text-xs text-accent-foreground/70">{record.userRole !== "CUSTOMER" ? `@${getDisplayValue(record.username)}` : ''}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            render: (text: string) => (
                <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'mobileNo',
            key: 'phone',
            width: 150,
            render: (text: string) => (
                <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'userRole',
            key: 'role',
            width: 150,
            render: (text: string) => (
                <p className="text-sm font-medium text-accent-foreground">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (text: string) => (
                <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 w-fit`}>
                    {getDisplayValue(text)}
                </Badge>
            ),
        },
        // {
        //     title: 'Entity',
        //     dataIndex: 'entityCode',
        //     key: 'entity',
        //     width: 100,
        //     render: (text: string) => (
        //         <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
        //     ),
        // },
        {
            title: 'Created Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 150,
            render: (text: string) => (
                <p className="text-sm text-accent-foreground">{text}</p>
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: 100,
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-accent-foreground mb-2">
                                User Management
                            </h1>
                            <p className="text-accent-foreground/70">
                                View and manage your users
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-accent-foreground">{users.length}</p>
                        <p className="text-sm text-accent-foreground/70">Total Users</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/70" />
                            <Input
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-accent/20 text-accent-foreground"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <PermissionButton
                                requiredPermissions={['MANAGE_USERS']}
                                requireAll={true}
                                hideIfNoPermission={false}
                                tooltipMessage="You do not have permission to create users"
                                onClick={() => router.push('/operations/users/create-users')}
                            >
                                <Plus className="w-4 h-4" />
                                Add User
                            </PermissionButton>
                            {/* <Button
                                onClick={handleOpenLinkModal}
                                variant="outline"
                                className="gap-2 border-accent/20 hover:bg-accent/10"
                            >
                                <LinkIcon className="w-4 h-4" />
                                Link User
                            </Button> */}
                            {/* <Button variant="outline" className="gap-2 border-accent/20 hover:bg-accent/10">
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Export</span>
                            </Button> */}
                        </div>
                    </div>

                    <Card className="border-accent/20 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-accent-foreground">
                                    User List
                                </CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetch()}
                                    className="border-accent/20 hover:bg-accent/10"
                                >
                                    Refresh
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-accent-foreground/70">Loading users...</p>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-accent-foreground/70">Error loading users</p>
                                </div>
                            ) : users.length === 0 ? (
                                <div className="flex justify-center items-center h-40 flex-col gap-4">
                                    <p className="text-accent-foreground/70">No users found</p>
                                    <div className="flex gap-2">
                                        <PermissionButton
                                            requiredPermissions={['MANAGE_USERS']}
                                            requireAll={true}
                                            hideIfNoPermission={false}
                                            tooltipMessage="You do not have permission to create users"
                                            onClick={() => router.push('/operations/users/create-users')}
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add User
                                        </PermissionButton>
                                        {/* <Button
                                            onClick={handleOpenLinkModal}
                                            variant="outline"
                                            className="gap-2 border-accent/20 hover:bg-accent/10"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                            Link User
                                        </Button> */}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="block lg:hidden space-y-4">
                                        {filteredUsers.map((user) => (
                                            <MobileUserCard
                                                key={user.username}
                                                user={user}
                                                onViewDetails={handleViewDetails}
                                            />
                                        ))}
                                    </div>

                                    <div className="hidden lg:block">
                                        <DynamicTable
                                            columns={columns}
                                            data={filteredUsers}
                                            itemsPerPage={15}
                                            onViewDetails={handleViewDetails}
                                            onEditDetails={handleEditDetails}
                                            searchTerm={searchTerm}
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <LinkUserModal
                isOpen={isLinkModalOpen}
                onClose={handleCloseLinkModal}
            />

        </div>
    );
}