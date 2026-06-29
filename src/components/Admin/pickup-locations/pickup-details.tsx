'use client'
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Phone, Ruler } from 'lucide-react';

interface PickupLocation {
    id: number;
    name: string;
    location: string;
    distance: number;
    timeframe: string;
    contact: string;
    amount: number;
    status: string;
}

interface PickupLocationViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    location: PickupLocation | null;
}

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
        case 'INACTIVE': return 'bg-red-100 text-red-700 border-red-200';
        case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const formatDistance = (distance: number): string => {
    if (distance >= 1000) return `${(distance / 1000).toFixed(1)} km`;
    return `${distance} m`;
};

const Field = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
    <div className="space-y-0.5">
        <p className="text-xs text-medium-gray">{label}</p>
        <div className="flex items-center gap-1.5">
            {icon}
            <p className="text-xs font-semibold text-dark-gray">{value || 'N/A'}</p>
        </div>
    </div>
);

export const PickupLocationViewModal: React.FC<PickupLocationViewModalProps> = ({ open, onOpenChange, location }) => {
    if (!location) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[100vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                <DialogTitle className="sr-only">Pickup Location Details</DialogTitle>

                <div className="px-6 pt-5 pb-4">
                    <h2 className="text-base font-semibold text-dark-gray mb-4">Pickup Location Details</h2>

                    <div className="bg-white rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#F5F5F5]">
                            <div>
                                <p className="text-sm font-bold text-dark-gray">{location.name}</p>
                                <p className="text-xs text-medium-gray">ID: {location.id}</p>
                            </div>
                            <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full ml-auto ${getStatusColor(location.status)}`}>{location.status}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-x-6">
                            <Field label="Amount" value={`£${location.amount}`} />
                            <Field label="Distance" value={formatDistance(location.distance)} icon={<Ruler className="w-3.5 h-3.5 text-medium-gray" />} />
                            <Field label="Timeframe" value={location.timeframe} icon={<Clock className="w-3.5 h-3.5 text-medium-gray" />} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <div className="col-span-2">
                                <Field label="Full Address" value={location.location} icon={<MapPin className="w-3.5 h-3.5 text-medium-gray" />} />
                            </div>
                            <Field label="Contact Information" value={location.contact} icon={<Phone className="w-3.5 h-3.5 text-medium-gray" />} />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};