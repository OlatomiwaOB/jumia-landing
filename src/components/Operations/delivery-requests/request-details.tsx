'use client'
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, Truck } from 'lucide-react';

interface DeliveryRequest {
    id: number;
    orderRefNo: string;
    storeCode: string;
    storeName: string;
    pickupLocation: string;
    deliveryLocation: string;
    packageSize: string;
    weightKg: number;
    length: number;
    width: number;
    height: number;
    deliveredBy: string;
    deliverySpeed: string;
    createdDate: string;
    deliveryDate: string;
    status: string;
    currentLocation: string;
}

interface DeliveryRequestDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    request: DeliveryRequest | null;
}

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'PICKED': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'IN_TRANSIT': case 'ASSIGNED': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200';
        case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-0.5">
        <p className="text-xs text-medium-gray">{label}</p>
        <p className="text-xs font-semibold text-dark-gray">{value || 'N/A'}</p>
    </div>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl p-4 space-y-4">
        <p className="text-sm font-semibold text-dark-gray">{title}</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
);

export const DeliveryRequestDetailsModal: React.FC<DeliveryRequestDetailsModalProps> = ({ open, onOpenChange, request }) => {
    if (!request) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[100vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                <DialogTitle className="sr-only">Delivery Request Details</DialogTitle>

                <div className="px-6 pt-5 pb-4">
                    <h2 className="text-base font-semibold text-dark-gray mb-4">Delivery Request Details</h2>

                    <div className="bg-white rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#F5F5F5]">
                            <div>
                                <p className="text-sm font-bold text-dark-gray font-mono">{request.orderRefNo}</p>
                                <p className="text-xs text-medium-gray">ID: {request.id}</p>
                            </div>
                            <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full ml-auto ${getStatusColor(request.status)}`}>{request.status}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-x-6">
                            <Field label="Store" value={request.storeName} />
                            <Field label="Store Code" value={request.storeCode} />
                            <Field label="Delivery Speed" value={request.deliverySpeed} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <SectionCard title="Locations">
                            <div className="col-span-2 space-y-0.5">
                                <p className="text-xs text-medium-gray">Pickup Location</p>
                                <div className="flex items-center gap-1.5">
                                    <p className="text-xs font-semibold text-dark-gray">{request.pickupLocation}</p>
                                </div>
                            </div>
                            <div className="col-span-2 space-y-0.5">
                                <p className="text-xs text-medium-gray">Delivery Location</p>
                                <div className="flex items-center gap-1.5">
                                    <p className="text-xs font-semibold text-dark-gray">{request.deliveryLocation}</p>
                                </div>
                            </div>
                            <Field label="Current Location" value={request.currentLocation} />
                        </SectionCard>

                        <div className="grid grid-cols-2 gap-4">
                            <SectionCard title="Package Details">
                                <Field label="Size" value={request.packageSize} />
                                <Field label="Weight" value={`${request.weightKg} kg`} />
                                <Field label="Dimensions" value={`${request.length}x${request.width}x${request.height} cm`} />
                            </SectionCard>

                            <SectionCard title="Delivery Information">
                                <Field label="Delivered By" value={request.deliveredBy} />
                                <Field label="Created Date" value={request.createdDate} />
                                <Field label="Delivery Date" value={request.deliveryDate} />
                            </SectionCard>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};