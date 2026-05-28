'use client'
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

export interface UserDetailsModalProps {
    user: UserInfo | null;
    open: boolean;
    onClose: () => void;
}

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
const getInitials = (fullName: string): string => {
    if (!fullName) return 'NA';
    const names = fullName.trim().split(' ');
    return `${names[0]?.charAt(0) || ''}${names[names.length - 1]?.charAt(0) || ''}`.toUpperCase();
};

const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-0.5">
        <p className="text-xs text-medium-gray">{label}</p>
        <p className="text-sm font-medium text-dark-gray">{value}</p>
    </div>
);

const SideField = ({ label, value }: { label: string; value: string }) => (
    <div className="py-3 border-b border-gray-200 last:border-0">
        <p className="text-sm font-medium text-dark-gray">{label}</p>
        <p className="text-xs text-medium-gray mt-0.5">{value}</p>
    </div>
);

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, open, onClose }) => {
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl gap-0 border-0 shadow-xl bg-[#F5F5F5]">
                <DialogTitle className="sr-only">User Details</DialogTitle>

                <div className="px-2">
                    <h2 className="text-md font-bold text-dark-gray">User Details</h2>
                </div>

                <div className="px-2 pb-6 pt-4 flex flex-col lg:flex-row gap-5">
                    <div className="flex-1 space-y-4">
                        <div className="bg-white rounded-2xl p-4 space-y-3">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={user.photoLink as string} />
                                        <AvatarFallback className="bg-[#F5F5F5] text-dark-gray font-semibold text-sm">
                                            {getInitials(user.fullname)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-semibold text-dark-gray">{getDisplayValue(user.fullname)}</p>
                                        <p className="text-xs text-medium-gray">{user.email}</p>
                                    </div>
                                </div>
                                <Badge className={`text-xs px-3 py-1 border font-medium rounded-full ${getStatusColor(user.status)}`}>
                                    {user.status?.toUpperCase() === 'USER_LOCKED' ? 'Locked' : user.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <Field label="Username" value={getDisplayValue(user.username)} />
                                <Field label="User Role" value={getDisplayValue(user.userRole)} />
                                <Field label="User ID" value={getDisplayValue(user.walletNo || user.id)} />
                                <Field label="Gender" value={getDisplayValue(user.gender)} />
                                <Field label="Merchant Code" value={getDisplayValue(user.merchantCode)} />
                                <Field label="Store Code" value={getDisplayValue(user.storeCode)} />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 space-y-3">
                            <p className="text-sm font-semibold text-dark-gray mb-4">Contact Information</p>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <Field label="Phone Number" value={getDisplayValue(user.mobileNo)} />
                                <Field label="Email" value={getDisplayValue(user.email)} />
                            </div>
                        </div>
                    </div>

                    <div className="w-56 shrink-0 bg-white rounded-2xl p-4">
                        <p className="text-sm font-semibold text-dark-gray mb-1">Additional Information</p>
                        <SideField
                            label="Date Created"
                            value={user.createdDate ? new Date(user.createdDate).toLocaleString() : 'N/A'}
                        />
                        <SideField
                            label="Last Login"
                            value={user.lastLoginDate ? new Date(user.lastLoginDate).toLocaleString() : 'N/A'}
                        />
                        {/* <SideField label="Language" value={getDisplayValue(user.language)} /> */}
                        <SideField label="Country" value={getDisplayValue(user.country)} />
                        <SideField label="Referral Code" value={getDisplayValue(user.referalCode)} />
                        <SideField label="Verification Status" value={getDisplayValue(user.verifyStatus)} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};