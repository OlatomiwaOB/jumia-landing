'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Eye, Edit, CheckCircle, XCircle, User, Truck, Bike, Footprints } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import useGetLookup from '@/app/hooks/useGetLookup';
import { usePermission } from '@/hooks/usePermission';
import { PermissionButton } from '@/components/Operations/permission/permission-button';
import { useRouter } from 'next/navigation';

interface Rider {
    id: number;
    fullName: string;
    phoneNumber: string;
    email: string;
    driverCategory: string;
    vehiclePlateNumber: string | null;
    vehicleCapacity: string | null;
    nationalIdNo: string | null;
    driverLicenseNumber: string | null;
    homeAddress: string | null;
    status: string;
    approvalStatus: string;
    availabilityStatus: string;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    emergencyContactRelationship: string | null;
    guarantorName: string | null;
    guarantorPhone: string | null;
    guarantorAddress: string | null;
    refereeName: string | null;
    refereePhone: string | null;
    refereeRelationship: string | null;
    isActive: boolean;
    createdBy: string | null;
    createdDate: number | null;
    modifiedBy: string | null;
    modifiedDate: number | null;
    photoLink?: string;
    createdAt?: string;
    driverAvailability: string;
}

interface Column {
    title: string;
    dataIndex: string;
    key: string;
    width?: number;
    render?: (value: any, record: Rider, index: number) => React.ReactNode;
}

const getStatusColor = (status: string): string => {
    if (!status) return 'bg-accent text-white';
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
        case 'ACTIVE':
        case 'APPROVED':
            return 'bg-accent text-white';
        case 'ASSIGNED':
            return 'bg-accent text-white';
        case 'PENDING':
            return 'bg-accent text-white opacity-70';
        case 'REJECTED':
        case 'INACTIVE':
            return 'bg-accent text-white opacity-50';
        default:
            return 'bg-accent text-white';
    }
};

const getAvailabilityColor = (availability: string): string => {
    if (!availability) return 'bg-gray-500 text-white';
    const availabilityUpper = availability.toUpperCase();
    switch (availabilityUpper) {
        case 'AVAILABLE':
            return 'bg-green-500 text-white';
        case 'ASSIGNED':
            return 'bg-orange-500 text-white';
        case 'OFFLINE':
            return 'bg-gray-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

const getCategoryIcon = (category: string) => {
    const categoryUpper = category?.toUpperCase() || '';
    switch (categoryUpper) {
        case 'VEHICLE':
        case 'CAR':
            return <Truck className="w-4 h-4" />;
        case 'MOTORCYCLE':
        case 'BIKE':
            return <Bike className="w-4 h-4" />;
        case 'FOOT':
            return <Footprints className="w-4 h-4" />;
        default:
            return <User className="w-4 h-4" />;
    }
};

const getDisplayValue = (value: any): string => {
    return value?.toString() || 'N/A';
};

const getInitials = (fullName: string): string => {
    if (!fullName) return 'NA';
    const names = fullName.split(' ');
    const firstInitial = names[0]?.charAt(0) || '';
    const secondInitial = names[1]?.charAt(0) || '';
    return `${firstInitial}${secondInitial}`.toUpperCase();
};

const DynamicTable = ({
    columns,
    data,
    itemsPerPage = 15,
    onViewDetails,
    onToggleActive,
    onApproveRider,
    searchTerm
}: {
    columns: Column[];
    data: Rider[];
    itemsPerPage?: number;
    onViewDetails: (rider: Rider) => void;
    onToggleActive: (rider: Rider, isActive: boolean) => void;
    onApproveRider: (rider: Rider) => void;
    searchTerm: string;
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const columnsWithHandler = columns.map(col => {
        if (col.key === 'actions') {
            return {
                ...col,
                render: (text: string, record: Rider) => (
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-accent/10"
                            title='View Details'
                            onClick={() => onViewDetails(record)}
                        >
                            <Eye className="w-5 h-5 text-accent-foreground" />
                        </Button>
                        <PermissionButton
                            requiredPermissions={['MANAGE_RIDERS']}
                            requireAll={true}
                            hideIfNoPermission={false}
                            tooltipMessage="You do not have permission to manage riders"
                            onClick={() => router.push(`/operations/riders/${record.id}`)}
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-accent/10"
                            title='Edit Rider'
                        >
                            <Edit className="w-5 h-5 text-accent-foreground" />
                        </PermissionButton>
                        {record.approvalStatus?.toUpperCase() === 'PENDING' && (
                            <PermissionButton
                                requiredPermissions={['MANAGE_RIDERS']}
                                requireAll={true}
                                hideIfNoPermission={false}
                                tooltipMessage="You do not have permission to manage riders"
                                onClick={() => onApproveRider(record)}
                                variant="ghost"
                                size="sm"
                                title='Approve Rider'
                                className="p-1 hover:bg-accent/10 text-green-600 hover:text-green-700"
                            >
                                <CheckCircle className="w-4 h-4" />
                            </PermissionButton>
                        )}
                    </div>
                )
            };
        }
        if (col.key === 'activeToggle') {
            return {
                ...col,
                render: (value: boolean, record: Rider) => (
                    <Switch
                        checked={record.isActive}
                        onCheckedChange={(checked) => onToggleActive(record, checked)}
                        className="data-[state=checked]:bg-accent"
                    />
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
                                            ? column.render(item[column.dataIndex as keyof Rider], item, index)
                                            : getDisplayValue(item[column.dataIndex as keyof Rider])
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
                    Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Riders
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
        </>
    );
};

const MobileRiderCard = ({ rider, onViewDetails }: { rider: Rider; onViewDetails: (rider: Rider) => void }) => {
    return (
        <div className="bg-white rounded-lg p-4 space-y-3 border border-accent/20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={rider.photoLink || ""} />
                        <AvatarFallback className="bg-accent text-white">
                            {getInitials(rider.fullName)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold text-accent-foreground">
                            {getDisplayValue(rider.fullName)}
                        </p>
                        <p className="text-xs text-accent-foreground/70">{getDisplayValue(rider.phoneNumber)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(rider.status)} text-xs px-2 py-1`}>
                        {getDisplayValue(rider.status)}
                    </Badge>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-accent/10"
                        onClick={() => onViewDetails(rider)}
                    >
                        <Eye className="w-5 h-5 text-accent-foreground" />
                    </Button>
                </div>
            </div>

            <div className="text-sm text-accent-foreground/80 flex items-center gap-2">
                {getCategoryIcon(rider.driverCategory)}
                <span>{getDisplayValue(rider.driverCategory)}</span>
            </div>

            {rider.vehiclePlateNumber && (
                <div className="text-sm text-accent-foreground/80 flex items-center gap-2">
                    <span className="font-mono text-xs">{getDisplayValue(rider.vehiclePlateNumber)}</span>
                </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-accent/10">
                <Badge className={getAvailabilityColor(rider.driverAvailability)}>
                    {getDisplayValue(rider.driverAvailability)}
                </Badge>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-accent-foreground/70">Active</span>
                    <Switch
                        checked={rider.isActive}
                        onCheckedChange={() => { }}
                        className="data-[state=checked]:bg-accent"
                    />
                </div>
            </div>
        </div>
    );
};

const ApproveRiderModal = ({
    isOpen,
    onClose,
    rider,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    rider: Rider | null;
    onSuccess: () => void;
}) => {
    const [verifyStatus, setVerifyStatus] = useState<string>('Y');
    const [reviewComment, setReviewComment] = useState<string>('');
    const [otp, setOtp] = useState('');

    const approveRiderMutation = useMutation({
        mutationFn: (payload: any) =>
            axiosOperations.post('/delivery-rider/riders/authorize', payload, {
                params: { otp }
            }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success(verifyStatus === 'Y' ? 'Rider approved successfully' : 'Rider rejected successfully');
                onSuccess();
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
            // id: rider?.email,
            verifyStatus: verifyStatus,
            // requestType: 'USER',
            referenceNo: rider?.email,
            comment: reviewComment,
            // otp: otp
        }];

        approveRiderMutation.mutate(payload);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className='flex flex-col'>
                    <DialogTitle className="text-accent-foreground">
                        {verifyStatus === 'Y' ? 'Approve' : 'Reject'} Rider
                    </DialogTitle>
                    <DialogDescription>
                        {verifyStatus === 'Y'
                            ? `Approve ${rider?.fullName}'s application`
                            : `Reject ${rider?.fullName}'s application`}
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

                    {/* <div className="space-y-2">
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
                    </div> */}

                    <div className="space-y-2">
                        <Label htmlFor="reviewComment" className="text-accent-foreground">
                            Review Comment {verifyStatus === 'R' && <span className="text-red-500">*</span>}
                        </Label>
                        <Textarea
                            id="reviewComment"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder={verifyStatus === 'Y'
                                ? "Add a note for approving this rider..."
                                : "Provide a reason for rejecting this rider..."}
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
                            disabled={approveRiderMutation.isPending}
                            className="border-accent/20 hover:bg-accent/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={approveRiderMutation.isPending || !verifyStatus}
                            className="bg-accent hover:bg-accent/90 text-white gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            {approveRiderMutation.isPending ? 'Processing...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const RiderViewModal = ({
    isOpen,
    onClose,
    rider
}: {
    isOpen: boolean;
    onClose: () => void;
    rider: Rider | null;
}) => {
    if (!rider) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-2xl max-h-[90vh] overflow-y-auto"
                style={{
                    scrollbarWidth: 'none',
                    scrollbarColor: 'transparent',
                }}
            >
                <DialogHeader className='flex flex-col'>
                    <DialogTitle className="text-accent-foreground">Rider Details</DialogTitle>
                    <DialogDescription>
                        Detailed information about the rider
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={rider.photoLink || ""} />
                            <AvatarFallback className="text-lg bg-accent text-white">
                                {getInitials(rider.fullName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold text-accent-foreground">
                                {getDisplayValue(rider.fullName)}
                            </h3>
                            <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.phoneNumber)}</p>
                            <div className="flex gap-2 mt-1">
                                <Badge className={`${getStatusColor(rider.status)} text-xs px-2 py-1`}>
                                    {getDisplayValue(rider.status)}
                                </Badge>
                                <Badge className={getAvailabilityColor(rider.availabilityStatus)}>
                                    {getDisplayValue(rider.availabilityStatus)}
                                </Badge>
                                <Badge className={rider.approvalStatus === 'Approved' ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}>
                                    {getDisplayValue(rider.approvalStatus)}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-md font-semibold text-accent-foreground mb-3 border-b pb-2">Personal Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Full Name</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.fullName)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Phone Number</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.phoneNumber)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Email</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.email)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Home Address</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.homeAddress)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">National ID No</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.nationalIdNo)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Driver License Number</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.driverLicenseNumber)}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-md font-semibold text-accent-foreground mb-3 border-b pb-2">Vehicle Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Driver Category</p>
                                    <div className="flex items-center gap-2">
                                        {getCategoryIcon(rider.driverCategory)}
                                        <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.driverCategory)}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Vehicle Plate Number</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.vehiclePlateNumber)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Vehicle Capacity</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.vehicleCapacity)}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-md font-semibold text-accent-foreground mb-3 border-b pb-2">Emergency Contact</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Emergency Contact Name</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.emergencyContactName)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Emergency Contact Phone</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.emergencyContactPhone)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Emergency Contact Relationship</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.emergencyContactRelationship)}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-md font-semibold text-accent-foreground mb-3 border-b pb-2">Guarantor Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Guarantor Name</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.guarantorName)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Guarantor Phone</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.guarantorPhone)}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <p className="text-sm font-medium text-accent-foreground">Guarantor Address</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.guarantorAddress)}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-md font-semibold text-accent-foreground mb-3 border-b pb-2">Referee Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Referee Name</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.refereeName)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Referee Phone</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.refereePhone)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Referee Relationship</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.refereeRelationship)}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-md font-semibold text-accent-foreground mb-3 border-b pb-2">Status Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Status</p>
                                    <Badge className={`${getStatusColor(rider.status)} text-xs px-2 py-1 w-fit`}>
                                        {getDisplayValue(rider.status)}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Availability Status</p>
                                    <Badge className={getAvailabilityColor(rider.availabilityStatus)}>
                                        {getDisplayValue(rider.availabilityStatus)}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Approval Status</p>
                                    <Badge className={rider.approvalStatus === 'Approved' ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}>
                                        {getDisplayValue(rider.approvalStatus)}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-md font-semibold text-accent-foreground mb-3 border-b pb-2">Audit Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Created By</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.createdBy)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Created Date</p>
                                    <p className="text-sm text-accent-foreground/70">
                                        {rider.createdDate ? new Date(rider.createdDate).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Modified By</p>
                                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.modifiedBy)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-accent-foreground">Modified Date</p>
                                    <p className="text-sm text-accent-foreground/70">
                                        {rider.modifiedDate ? new Date(rider.modifiedDate).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default function RidersPage() {
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('VIEW_RIDERS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to view riders"
    });

    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedAvailability, setSelectedAvailability] = useState<string>('');
    const [viewModalOpen, setViewModalOpen] = useState(false);

    const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

    const statusOptions = useGetLookup('DRIVER_STATUS');
    const categoryOptions = useGetLookup('DRIVER_CATEGORY');
    const availabilityOptions = useGetLookup('DRIVER_AVAILABILITY');

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['riders'],
        queryFn: () => axiosOperations.request({
            url: '/delivery-rider/riders/list',
            method: 'GET',
            params: {
                pageNumber: 1,
                pageSize: 200,
                fullName: searchTerm || undefined,
                phoneNumber: searchTerm || undefined,
                vehiclePlateNumber: searchTerm || undefined
            }
        }).then(res => res.data)
    });

    const updateActiveStatusMutation = useMutation({
        mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
            axiosOperations.post('/delivery-rider/riders/update-status', {
                id,
                isActive
            }),
        onSuccess: () => {
            toast.success('Rider status updated successfully');
            queryClient.invalidateQueries({ queryKey: ['riders'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    });

    const riders: Rider[] = data?.data || [];

    const filteredRiders = riders.filter(rider => {
        const matchesSearch = searchTerm === '' ||
            rider.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rider.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (rider.vehiclePlateNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus = !selectedStatus || rider.status === selectedStatus;
        const matchesCategory = !selectedCategory || rider.driverCategory === selectedCategory;
        const matchesAvailability = !selectedAvailability || rider.driverAvailability === selectedAvailability;

        return matchesSearch && matchesStatus && matchesCategory && matchesAvailability;
    });

    const stats = {
        total: filteredRiders.length,
        active: filteredRiders.filter(r => r.isActive).length,
        vehicle: filteredRiders.filter(r => r.driverCategory?.toUpperCase() === 'VEHICLE' || r.driverCategory?.toUpperCase() === 'CAR').length,
        motorcycle: filteredRiders.filter(r => r.driverCategory?.toUpperCase() === 'MOTORCYCLE' || r.driverCategory?.toUpperCase() === 'BIKE').length,
        foot: filteredRiders.filter(r => r.driverCategory?.toUpperCase() === 'FOOT').length,
    };

    const handleViewDetails = (rider: Rider) => {
        setSelectedRider(rider);
        setViewModalOpen(true);
    };

    const handleApproveRider = (rider: Rider) => {
        setSelectedRider(rider);
        setIsApproveModalOpen(true);
    };

    const handleToggleActive = (rider: Rider, isActive: boolean) => {
        updateActiveStatusMutation.mutate({ id: rider.id, isActive });
    };

    const columns: Column[] = [
        {
            title: 'S/N',
            dataIndex: 'id',
            key: 'sn',
            width: 70,
            render: (_: any, __: any, index: number) => (
                <span className="text-accent-foreground">{index + 1}</span>
            ),
        },
        {
            title: 'Rider',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 200,
            render: (text: string, record: Rider) => (
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={record.photoLink || ""} />
                        <AvatarFallback className="bg-accent text-white">
                            {getInitials(record.fullName)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium text-accent-foreground">{getDisplayValue(text)}</p>
                        <p className="text-xs text-accent-foreground/70">{getDisplayValue(record.phoneNumber)}</p>
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
            title: 'Category',
            dataIndex: 'driverCategory',
            key: 'driverCategory',
            width: 120,
            render: (text: string) => (
                <div className="flex items-center gap-2">
                    {getCategoryIcon(text)}
                    <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
                </div>
            ),
        },
        {
            title: 'Vehicle Plate',
            dataIndex: 'vehiclePlateNumber',
            key: 'vehiclePlateNumber',
            width: 120,
            render: (text: string) => (
                <span className="font-mono text-sm text-accent-foreground">{getDisplayValue(text)}</span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (text: string) => (
                <Badge className={`${getStatusColor(text)} text-xs px-2 py-1`}>
                    {getDisplayValue(text)}
                </Badge>
            ),
        },
        {
            title: 'Availability',
            dataIndex: 'availabilityStatus',
            key: 'availabilityStatus',
            width: 100,
            render: (text: string) => (
                <Badge className={getAvailabilityColor(text)}>
                    {getDisplayValue(text)}
                </Badge>
            ),
        },
        // {
        //     title: 'Active',
        //     dataIndex: 'isActive',
        //     key: 'activeToggle',
        //     width: 80,
        //     // render: (value: boolean, record: Rider) => (
        //     //     <div className="flex items-center gap-2">
        //     //         <Switch
        //     //             checked={record.isActive}
        //     //             onCheckedChange={(checked) => handleToggleActive(record, checked)}
        //     //             className="data-[state=checked]:bg-accent"
        //     //         />
        //     //     </div>
        //     // ),
        // },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: 100,
        },
    ];


    const MetricCard = ({ title, value, className = '' }: { title: string; value: number; className?: string }) => (
        <Card className={`relative overflow-hidden border-accent/20 shadow-sm ${className}`}>
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <div className="absolute rounded-2xl w-14 h-12 rotate-15 bg-accent/5 transform origin-center"></div>
                <div className="absolute rounded-2xl w-18 h-18 rotate-50 bg-accent/5 transform origin-center"></div>
            </div>

            <CardContent className="p-6 relative z-10">
                <p className="text-sm font-medium text-accent-foreground/70 mb-2">{title}</p>
                <p className="text-3xl font-bold text-accent-foreground">{value}</p>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-accent-foreground mb-2">
                            Rider Management
                        </h1>
                        <p className="text-accent-foreground/70">
                            View and manage all delivery riders
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <MetricCard title="Total Riders" value={stats.total} />
                    <MetricCard title="Active Riders" value={stats.active} />
                    <MetricCard title="Vehicle Riders" value={stats.vehicle} />
                    <MetricCard title="Motorcycle Riders" value={stats.motorcycle} />
                    <MetricCard title="Foot Delivery" value={stats.foot} />
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
                        <div className="relative flex-1 max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/70" />
                            <Input
                                placeholder="Search by name, phone, or vehicle plate..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-accent/20 text-accent-foreground"
                            />
                        </div>

                        <div className="flex flex-wrap items-center w-full lg:w-auto">
                            <div className="w-full sm:w-40">
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger className="border-accent/20">
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        {statusOptions?.map((opt: any) => (
                                            <SelectItem key={opt.id} value={opt.id}>
                                                {opt.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-full sm:w-44">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="border-accent/20">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categoryOptions?.map((opt: any) => (
                                            <SelectItem key={opt.id} value={opt.id}>
                                                {opt.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-full sm:w-44">
                                <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                                    <SelectTrigger className="border-accent/20">
                                        <SelectValue placeholder="All Availability" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Availability</SelectItem>
                                        {availabilityOptions?.map((opt: any) => (
                                            <SelectItem key={opt.id} value={opt.id}>
                                                {opt.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Card className="border-accent/20 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-accent-foreground">
                                    Riders List
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
                                    <p className="text-accent-foreground/70">Loading riders...</p>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-accent-foreground/70">Error loading riders</p>
                                </div>
                            ) : filteredRiders.length === 0 ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-accent-foreground/70">No riders found</p>
                                </div>
                            ) : (
                                <>
                                    <div className="block lg:hidden space-y-4">
                                        {filteredRiders.map((rider) => (
                                            <MobileRiderCard
                                                key={rider.id}
                                                rider={rider}
                                                onViewDetails={handleViewDetails}
                                            />
                                        ))}
                                    </div>

                                    <div className="hidden lg:block">
                                        <DynamicTable
                                            columns={columns}
                                            data={filteredRiders}
                                            itemsPerPage={15}
                                            onViewDetails={handleViewDetails}
                                            onToggleActive={handleToggleActive}
                                            onApproveRider={handleApproveRider}
                                            searchTerm={searchTerm}
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <RiderViewModal
                isOpen={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false);
                    setSelectedRider(null);
                }}
                rider={selectedRider}
            />

            <ApproveRiderModal
                isOpen={isApproveModalOpen}
                onClose={() => {
                    setIsApproveModalOpen(false);
                    setSelectedRider(null);
                }}
                rider={selectedRider}
                onSuccess={() => {
                    refetch();
                }}
            />
        </div>
    );
}