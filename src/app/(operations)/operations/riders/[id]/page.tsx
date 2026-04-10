'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, Truck, Bike, Footprints, Car, CheckCircle, XCircle, AlertCircle, Users, UserCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/usePermission';

interface Rider {
    id: number;
    fullName: string;
    phoneNumber: string;
    driverCategory: string;
    email: string;
    status: string;
    driverAvailability: string;
    vehiclePlateNumber: string | null;
    vehicleCapacity: string | null;
    nationalIdNo: string | null;
    driverLicenseNumber: string | null;
    homeAddress: string | null;
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
    createdBy: string | null;
    createdDate: number | null;
    modifiedBy: string | null;
    modifiedDate: number | null;
    photoLink?: string;
    createdAt?: string;
    updatedAt?: string;
    address?: string;
    city?: string;
    state?: string;
    countryCode?: string;
    identityNo?: string;
    identityType?: string;
    dateOfBirth?: string;
}

interface Document {
    id: number;
    type: string;
    link: string;
    createdDate: string;
    verifyStatus: string;
    comment?: string;
}

const getStatusColor = (status: string): string => {
    if (!status) return 'bg-accent text-white';
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
        case 'ACTIVE':
        case 'APPROVED':
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
        case 'BUSY':
            return 'bg-orange-500 text-white';
        case 'OFFLINE':
            return 'bg-gray-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

const getCategoryIcon = (category: string, size = 5) => {
    const categoryUpper = category?.toUpperCase() || '';
    const iconSize = `w-${size} h-${size}`;
    switch (categoryUpper) {
        case 'VEHICLE':
        case 'CAR':
            return <Car className={iconSize} />;
        case 'MOTORCYCLE':
        case 'BIKE':
            return <Bike className={iconSize} />;
        case 'FOOT':
            return <Footprints className={iconSize} />;
        default:
            return <User className={iconSize} />;
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
    const [verifyStatus, setVerifyStatus] = useState<string>('Y');
    const [comment, setComment] = useState('');
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const approveDocumentMutation = useMutation({
        mutationFn: (payload: any[]) =>
            axiosOperations.post('/delivery-rider/riders/authorize-document', payload),
        onSuccess: (data) => {
            if (data?.data?.responseCode === '000') {
                toast.success(`Document ${verifyStatus === 'Y' ? 'approved' : 'rejected'} successfully`);
                onSuccess();
                onClose();
                setVerifyStatus('Y');
                setComment('');
                setOtp('');
            } else {
                toast.error(data?.data?.responseMessage || 'Failed to process document');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to process document');
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });

    const handleSubmit = () => {
        if (!document) return;

        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        if (verifyStatus === 'R' && !comment) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        setIsSubmitting(true);
        const payload = [{
            id: document.id,
            referenceNo: document.id.toString(),
            verifyStatus: verifyStatus,
            comment: comment,
            // otp: otp
        }];

        approveDocumentMutation.mutate(payload);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-accent-foreground">
                        {verifyStatus === 'Y' ? 'Approve' : 'Reject'} Document
                    </DialogTitle>
                    <DialogDescription>
                        {verifyStatus === 'Y' ? 'Approve' : 'Reject'} {document?.type}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-accent-foreground">Verify Status *</Label>
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

                    {verifyStatus === 'R' && (
                        <div className="space-y-2">
                            <Label className="text-accent-foreground">Rejection Reason *</Label>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Please provide a reason for rejection"
                                rows={3}
                                className="border-accent/20"
                                maxLength={500}
                            />
                        </div>
                    )}

                    {verifyStatus === 'Y' && (
                        <div className="space-y-2">
                            <Label className="text-accent-foreground">Comment (Optional)</Label>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add any additional notes..."
                                rows={2}
                                className="border-accent/20"
                                maxLength={500}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="otp" className="text-accent-foreground">Enter OTP *</Label>
                        <Input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Enter 6-digit OTP"
                            className="border-accent/20"
                            required
                            maxLength={6}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="border-accent/20 hover:bg-accent/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !otp || otp.length !== 6}
                            className={verifyStatus === 'Y'
                                ? "bg-accent hover:bg-accent/90 text-white gap-2"
                                : "bg-red-600 hover:bg-red-700 text-white gap-2"}
                        >
                            <CheckCircle className="w-4 h-4" />
                            {isSubmitting ? 'Processing...' : (verifyStatus === 'Y' ? 'Approve' : 'Reject')}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const RiderApproveModal = ({
    isOpen,
    onClose,
    rider,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    rider: Rider | null;
    onSuccess: () => void;
}) => {
    const [verifyStatus, setVerifyStatus] = useState<string>('Y');
    const [comment, setComment] = useState('');
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const approveRiderMutation = useMutation({
        mutationFn: (payload: any[]) =>
            axiosOperations.post('/delivery-rider/riders/authorize', payload),
        onSuccess: (data) => {
            if (data?.data?.responseCode === '000') {
                toast.success(`Rider ${verifyStatus === 'Y' ? 'approved' : 'rejected'} successfully`);
                onSuccess();
                onClose();
                setVerifyStatus('Y');
                setComment('');
                setOtp('');
            } else {
                toast.error(data?.data?.responseMessage || 'Failed to process request');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to process request');
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });

    const handleSubmit = () => {
        if (!rider) return;

        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        if (verifyStatus === 'R' && !comment) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        setIsSubmitting(true);
        const payload = [{
            // id: rider?.email,
            verifyStatus: verifyStatus,
            // requestType: 'USER',
            referenceNo: rider?.email,
            comment: comment,
            // otp: otp
        }];

        approveRiderMutation.mutate(payload);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-accent-foreground">
                        {verifyStatus === 'Y' ? 'Approve' : 'Reject'} Rider
                    </DialogTitle>
                    <DialogDescription>
                        {verifyStatus === 'Y'
                            ? `Approve ${rider?.fullName}'s application`
                            : `Reject ${rider?.fullName}'s application`}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-accent-foreground">Verify Status *</Label>
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

                    {verifyStatus === 'R' && (
                        <div className="space-y-2">
                            <Label className="text-accent-foreground">Rejection Reason *</Label>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Please provide a reason for rejection"
                                rows={3}
                                className="border-accent/20"
                                maxLength={500}
                            />
                        </div>
                    )}

                    {verifyStatus === 'Y' && (
                        <div className="space-y-2">
                            <Label className="text-accent-foreground">Comment (Optional)</Label>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add any additional notes..."
                                rows={2}
                                className="border-accent/20"
                                maxLength={500}
                            />
                        </div>
                    )}

                    {/* <div className="space-y-2">
                        <Label htmlFor="otp" className="text-accent-foreground">Enter OTP *</Label>
                        <Input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Enter 6-digit OTP"
                            className="border-accent/20"
                            required
                            maxLength={6}
                        />
                    </div> */}
                </div>

                <DialogFooter>
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="border-accent/20 hover:bg-accent/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={verifyStatus === 'Y'
                                ? "bg-accent hover:bg-accent/90 text-white gap-2"
                                : "bg-red-600 hover:bg-red-700 text-white gap-2"}
                        >
                            <CheckCircle className="w-4 h-4" />
                            {isSubmitting ? 'Processing...' : (verifyStatus === 'Y' ? 'Approve' : 'Reject')}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function RiderDetailsPage() {
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('MANAGE_RIDERS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage riders"
    });
    const router = useRouter();
    const params = useParams();
    const riderId = params.id as string;
    const [activeTab, setActiveTab] = useState('overview');
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [isDocumentApprovalModalOpen, setIsDocumentApprovalModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['rider-details', riderId],
        queryFn: () => axiosOperations.request({
            url: `/delivery-rider/riders/${riderId}`,
            method: 'GET'
        }).then(res => res.data),
        enabled: !!riderId
    });

    const rider: Rider = data?.data || {};
    const documents = data?.documents || [];

    const pendingDocumentIds = documents
        .filter((doc: Document) => doc.verifyStatus === 'N')
        .map((doc: Document) => doc.id);

    const handleApproveDocument = (document: Document) => {
        setSelectedDocument(document);
        setIsDocumentApprovalModalOpen(true);
    };

    const handleDocumentApprovalSuccess = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-accent-foreground/70">Loading rider details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-accent-foreground/70">Error loading rider details</p>
                    <Button onClick={() => router.back()} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-accent-foreground/70 hover:text-accent-foreground hover:bg-accent/10"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>

                    {rider?.approvalStatus === 'PENDING' && (
                        <Button
                            onClick={() => setIsApprovalModalOpen(true)}
                            className="bg-accent hover:bg-accent/90 text-white"
                        >
                            Verify Rider
                        </Button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={rider.photoLink || ""} />
                        <AvatarFallback className="text-xl bg-accent text-white">
                            {getInitials(rider.fullName)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-accent-foreground">
                                {getDisplayValue(rider.fullName)}
                            </h1>
                            {getCategoryIcon(rider.driverCategory, 6)}
                        </div>
                        <p className="text-accent-foreground/70 mt-1">{getDisplayValue(rider.phoneNumber)}</p>
                        <div className="flex gap-2 mt-3">
                            <Badge className={`${getStatusColor(rider.approvalStatus)} text-sm px-3 py-1`}>
                                {getDisplayValue(rider.approvalStatus)}
                            </Badge>
                            <Badge className={getAvailabilityColor(rider.availabilityStatus || rider.driverAvailability)}>
                                {getDisplayValue(rider.availabilityStatus || rider.driverAvailability)}
                            </Badge>
                            <Badge className={rider.status === 'Active' ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                                {rider.status === 'Active' ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="border-b border-accent/20 w-full justify-start h-auto p-0 bg-transparent">
                        <TabsTrigger
                            value="overview"
                            className="outline-none rounded-none border-b-2 border-transparent data-[state=active]:border-b-accent data-[state=active]:text-accent-foreground data-[state=active]:bg-transparent px-4 py-3"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="personal"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-accent data-[state=active]:text-accent-foreground data-[state=active]:bg-transparent px-4 py-3"
                        >
                            Personal Info
                        </TabsTrigger>
                        <TabsTrigger
                            value="vehicle"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-accent data-[state=active]:text-accent-foreground data-[state=active]:bg-transparent px-4 py-3"
                        >
                            Vehicle Info
                        </TabsTrigger>
                        <TabsTrigger
                            value="contacts"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-accent data-[state=active]:text-accent-foreground data-[state=active]:bg-transparent px-4 py-3"
                        >
                            Contacts
                        </TabsTrigger>
                        <TabsTrigger
                            value="documents"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-accent data-[state=active]:text-accent-foreground data-[state=active]:bg-transparent px-4 py-3"
                        >
                            Documents
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-accent/20">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Basic Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Full Name</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.fullName)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Phone Number</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Phone className="w-4 h-4 text-accent-foreground/70" />
                                                <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.phoneNumber)}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Email</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Mail className="w-4 h-4 text-accent-foreground/70" />
                                                <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.email)}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Home Address</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <MapPin className="w-4 h-4 text-accent-foreground/70" />
                                                <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.homeAddress)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-accent/20">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
                                        <Truck className="w-5 h-5" />
                                        Driver Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Driver Category</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {getCategoryIcon(rider.driverCategory, 4)}
                                                <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.driverCategory)}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Vehicle Plate Number</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1 font-mono">{getDisplayValue(rider.vehiclePlateNumber)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Vehicle Capacity</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.vehicleCapacity)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Availability</p>
                                            <Badge className={`${getAvailabilityColor(rider.availabilityStatus || rider.driverAvailability)} mt-1`}>
                                                {getDisplayValue(rider.availabilityStatus || rider.driverAvailability)}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-accent/20">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
                                        <UserCircle2 className="w-5 h-5" />
                                        Identification
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">National ID Number</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1 font-mono">{getDisplayValue(rider.nationalIdNo)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Driver License Number</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1 font-mono">{getDisplayValue(rider.driverLicenseNumber)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-accent/20">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        Registration Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Created By</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.createdBy)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Created Date</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">
                                                {rider.createdDate ? new Date(rider.createdDate).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Modified By</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.modifiedBy)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Modified Date</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">
                                                {rider.modifiedDate ? new Date(rider.modifiedDate).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="personal" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-accent/20">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-accent-foreground mb-4">
                                        Personal Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Full Name</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.fullName)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Phone Number</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.phoneNumber)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Email</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.email)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Home Address</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.homeAddress)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-accent/20">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-accent-foreground mb-4">
                                        Identification Documents
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">National ID Number</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1 font-mono">{getDisplayValue(rider.nationalIdNo)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Driver License Number</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1 font-mono">{getDisplayValue(rider.driverLicenseNumber)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="vehicle" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-accent/20">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
                                        <Truck className="w-5 h-5" />
                                        Vehicle Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Driver Category</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {getCategoryIcon(rider.driverCategory, 4)}
                                                <p className="text-sm text-accent-foreground/70">{getDisplayValue(rider.driverCategory)}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Vehicle Plate Number</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1 font-mono">{getDisplayValue(rider.vehiclePlateNumber)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Vehicle Capacity</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.vehicleCapacity)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-accent/20">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        Status Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Approval Status</p>
                                            <Badge className={`${getStatusColor(rider.approvalStatus)} mt-1`}>
                                                {getDisplayValue(rider.approvalStatus)}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Availability Status</p>
                                            <Badge className={`${getAvailabilityColor(rider.availabilityStatus || rider.driverAvailability)} mt-1`}>
                                                {getDisplayValue(rider.availabilityStatus || rider.driverAvailability)}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Active Status</p>
                                            <Badge className={rider.status === 'Active' ? "bg-green-500 text-white mt-1" : "bg-gray-500 text-white mt-1"}>
                                                {rider.status === 'Active' ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="contacts" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <Card className="border-accent/20">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        Emergency Contact
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Contact Name</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.emergencyContactName)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Contact Phone</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.emergencyContactPhone)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Relationship</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.emergencyContactRelationship)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-accent/20">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
                                        <UserCircle2 className="w-5 h-5" />
                                        Guarantor Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Guarantor Name</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.guarantorName)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Guarantor Phone</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.guarantorPhone)}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm font-medium text-accent-foreground">Guarantor Address</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.guarantorAddress)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-accent/20">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        Referee Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Referee Name</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.refereeName)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Referee Phone</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.refereePhone)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Relationship</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(rider.refereeRelationship)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-6">
                        <Card className="border-accent/20">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-accent-foreground">
                                            Documents
                                        </h3>
                                        {pendingDocumentIds.length > 0 && (
                                            <Badge className="bg-accent text-white">
                                                {pendingDocumentIds.length} pending
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {documents.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {documents.map((doc: Document, index: number) => (
                                            <div key={index} className="border border-accent/20 rounded-lg p-4 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="text-sm font-medium text-accent-foreground">{doc.type || 'Document'}</p>
                                                        <p className="text-xs text-accent-foreground/70 mt-1">
                                                            Created: {doc.createdDate || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={`${getStatusColor(doc.verifyStatus)} text-xs px-2 py-1`}>
                                                            {doc.verifyStatus === 'Y' ? 'Approved' :
                                                                doc.verifyStatus === 'R' ? 'Rejected' : 'Pending'}
                                                        </Badge>
                                                        {doc.verifyStatus === 'N' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="p-1 h-8 w-8 hover:bg-green-50 hover:text-green-600"
                                                                onClick={() => handleApproveDocument(doc)}
                                                                title="Approve Document"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-4 mb-3 flex-1">
                                                    {doc.link ? (
                                                        <div className="relative w-full h-40 border border-accent/10 rounded overflow-hidden">
                                                            <Image
                                                                src={doc.link}
                                                                alt={doc.type || 'Document'}
                                                                fill
                                                                className="object-contain"
                                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-40 flex items-center justify-center border border-accent/10 rounded bg-accent/5">
                                                            <p className="text-sm text-accent-foreground/50">No preview available</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {doc.comment && (
                                                    <div className="mt-2 pt-2 border-t border-accent/10">
                                                        <p className="text-xs font-medium text-accent-foreground">Comment:</p>
                                                        <p className="text-xs text-accent-foreground/70 mt-1">{doc.comment}</p>
                                                    </div>
                                                )}

                                                {doc.link && (
                                                    <a
                                                        href={doc.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-block mt-3 text-sm text-accent hover:text-accent/80 text-center w-full py-2 border border-accent/20 rounded hover:bg-accent/5 transition-colors"
                                                    >
                                                        View Full Document
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-accent-foreground/70">No documents found for this rider</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <RiderApproveModal
                isOpen={isApprovalModalOpen}
                onClose={() => setIsApprovalModalOpen(false)}
                rider={rider}
                onSuccess={() => refetch()}
            />

            <DocumentApprovalModal
                isOpen={isDocumentApprovalModalOpen}
                onClose={() => {
                    setIsDocumentApprovalModalOpen(false);
                    setSelectedDocument(null);
                }}
                document={selectedDocument}
                onSuccess={handleDocumentApprovalSuccess}
            />
        </div>
    );
}