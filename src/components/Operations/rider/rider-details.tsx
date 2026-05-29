'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileText, Car, Bike, Footprints, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PermissionButton } from '@/components/Operations/permission/permission-button';

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
}

interface Document {
    id: number;
    type: string;
    link: string;
    createdDate: string;
    verifyStatus: string;
    comment?: string;
}

interface RiderDetailsModalProps {
    rider: Rider | null;
    open: boolean;
    onClose: () => void;
    documents?: Document[];
    onRefetch?: () => void;
}

type TabKey = 'overview' | 'documents';

const getStatusColor = (status: string): string => {
    if (!status) return 'bg-gray-100 text-gray-600 border-gray-200';
    switch (status.toUpperCase()) {
        case 'ACTIVE': case 'APPROVED': case 'Y':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'REJECTED': case 'INACTIVE': case 'R': case 'N':
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
    <div className="p-4 rounded-2xl border border-gray-200 space-y-4">
        <p className="text-sm font-semibold text-dark-gray">{title}</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
);

const TABS: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'documents', label: 'Document' },
];

export const RiderDetailsModal: React.FC<RiderDetailsModalProps> = ({
    rider, open, onClose, documents = [], onRefetch,
}) => {
    const [activeTab, setActiveTab] = useState<TabKey>('overview');
    const router = useRouter();

    if (!rider) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                <DialogTitle className="sr-only">Rider Details</DialogTitle>

                <div className="px-6 pt-5 pb-4">
                    <h2 className="text-base font-semibold text-dark-gray mb-4">Rider Details</h2>

                    <div className="bg-white rounded-2xl p-4">
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F5F5F5]">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-11 h-11">
                                    <AvatarImage src={rider.photoLink || ''} />
                                    <AvatarFallback className="bg-[#F5F5F5] text-dark-gray font-semibold text-sm">
                                        {getInitials(rider.fullName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-bold text-dark-gray">{rider.fullName}</p>
                                    <p className="text-xs text-medium-gray">{rider.phoneNumber}</p>
                                </div>
                                <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full ml-2 ${getStatusColor(rider.status)}`}>
                                    {rider.status}
                                </Badge>
                            </div>
                            <div className='flex items-center gap-2'>
                                <PermissionButton
                                    requiredPermissions={['MANAGE_RIDERS']}
                                    requireAll={true} hideIfNoPermission={false}
                                    tooltipMessage="No permission to manage riders"
                                    onClick={() => router.push(`/operations/riders/${rider.id}`)}
                                >
                                    Edit Rider
                                </PermissionButton>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-x-6">
                            <Field label="Category" value={getDisplayValue(rider.driverCategory)} />
                            <Field label="Vehicle Plate" value={getDisplayValue(rider.vehiclePlateNumber)} />
                            <Field label="Availability" value={getDisplayValue(rider.availabilityStatus)} />
                            <Field label="Approval Status" value={getDisplayValue(rider.approvalStatus)} />
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
                                    <SectionCard title="Personal Information">
                                        <Field label="Full Name" value={getDisplayValue(rider.fullName)} />
                                        <Field label="Phone Number" value={getDisplayValue(rider.phoneNumber)} />
                                        <Field label="Email" value={getDisplayValue(rider.email)} />
                                        <div className="col-span-2">
                                            <Field label="Address" value={getDisplayValue(rider.homeAddress)} />
                                        </div>
                                    </SectionCard>

                                    <SectionCard title="Vehicle Information">
                                        <Field label="Category" value={getDisplayValue(rider.driverCategory)} />
                                        <Field label="Plate Number" value={getDisplayValue(rider.vehiclePlateNumber)} />
                                        <Field label="Capacity" value={getDisplayValue(rider.vehicleCapacity)} />
                                        <Field label="Availability" value={getDisplayValue(rider.availabilityStatus)} />
                                    </SectionCard>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <SectionCard title="Identification">
                                        <Field label="National ID" value={getDisplayValue(rider.nationalIdNo)} />
                                        <Field label="License Number" value={getDisplayValue(rider.driverLicenseNumber)} />
                                    </SectionCard>

                                    <SectionCard title="Status">
                                        <Field label="Status" value={getDisplayValue(rider.status)} highlight={rider.status?.toUpperCase() === 'ACTIVE'} />
                                        <Field label="Approval" value={getDisplayValue(rider.approvalStatus)} />
                                        <Field label="Availability" value={getDisplayValue(rider.availabilityStatus || rider.driverAvailability)} />
                                    </SectionCard>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <SectionCard title="Emergency Contact">
                                        <Field label="Name" value={getDisplayValue(rider.emergencyContactName)} />
                                        <Field label="Phone" value={getDisplayValue(rider.emergencyContactPhone)} />
                                        <Field label="Relationship" value={getDisplayValue(rider.emergencyContactRelationship)} />
                                    </SectionCard>

                                    <SectionCard title="Guarantor Information">
                                        <Field label="Name" value={getDisplayValue(rider.guarantorName)} />
                                        <Field label="Phone" value={getDisplayValue(rider.guarantorPhone)} />
                                        <div className="col-span-2">
                                            <Field label="Address" value={getDisplayValue(rider.guarantorAddress)} />
                                        </div>
                                    </SectionCard>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <SectionCard title="Referee Information">
                                        <Field label="Name" value={getDisplayValue(rider.refereeName)} />
                                        <Field label="Phone" value={getDisplayValue(rider.refereePhone)} />
                                        <Field label="Relationship" value={getDisplayValue(rider.refereeRelationship)} />
                                    </SectionCard>

                                    <SectionCard title="Audit Information">
                                        <Field label="Created By" value={getDisplayValue(rider.createdBy)} />
                                        <Field label="Created Date" value={rider.createdDate ? new Date(rider.createdDate).toLocaleString() : 'N/A'} />
                                        <Field label="Modified By" value={getDisplayValue(rider.modifiedBy)} />
                                        <Field label="Modified Date" value={rider.modifiedDate ? new Date(rider.modifiedDate).toLocaleString() : 'N/A'} />
                                    </SectionCard>
                                </div>
                            </>
                        )}

                        {activeTab === 'documents' && (
                            <div className="bg-white rounded-2xl p-4">
                                {documents.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                                        <p className="text-md font-semibold text-dark-gray">Documents</p>
                                        <p className="text-sm text-medium-gray">No document found for this Rider</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {documents.map((doc, i) => (
                                            <div key={i} className="border border-[#F5F5F5] rounded-xl p-3 space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-dark-gray">{doc.type || 'Document'}</p>
                                                        <p className="text-xs text-medium-gray mt-0.5">{doc.createdDate}</p>
                                                    </div>
                                                    <Badge className={`text-[10px] border ${getStatusColor(doc.verifyStatus)}`}>
                                                        {doc.verifyStatus === 'Y' ? 'Approved' : doc.verifyStatus === 'R' ? 'Rejected' : 'Pending'}
                                                    </Badge>
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
                                                        className="block text-center text-xs text-orange-500 py-1.5 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                                                        View Full Document
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};