// components/Operations/delivery-requests/delivery-update-status.tsx
'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import axiosOperations from '@/utils/fetch-function-op-auth';

interface DeliveryRequest {
    id: number;
    orderRefNo: string;
    status: string;
    currentLocation: string;
}

interface DeliveryUpdateStatusModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    request: DeliveryRequest | null;
    onSuccess: () => void;
}

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PICKED', label: 'Picked' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'RETURNED', label: 'Returned' }
];

export const DeliveryUpdateStatusModal: React.FC<DeliveryUpdateStatusModalProps> = ({ open, onOpenChange, request, onSuccess }) => {
    const [status, setStatus] = useState('');
    const [currentLocation, setCurrentLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!request) return;
        setIsSubmitting(true);
        try {
            const params = new URLSearchParams();
            params.append('deliveryRequestId', request.id.toString());
            params.append('status', status || request.status);
            params.append('currentLocation', currentLocation || request.currentLocation || '');
            const response = await axiosOperations.post('/delivery-request/status/update', null, { params });
            if (response.data?.code === '000') {
                toast.success('Delivery status updated successfully');
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error(response.data?.desc || 'Failed to update status');
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Error updating status');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!request) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                <DialogTitle className="sr-only">Update Delivery Status</DialogTitle>
                <div className="px-6 pt-5">
                    <h2 className="text-base font-bold text-dark-gray">Update Delivery Status</h2>
                    <p className="text-xs text-medium-gray mt-0.5">Update status for request #{request.id}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-white rounded-2xl m-6 p-4 space-y-4">
                        <div className="space-y-2">
                            <p className="text-xs text-medium-gray">Order Reference</p>
                            <p className="text-sm font-mono font-semibold text-dark-gray">{request.orderRefNo}</p>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-dark-gray">New Status *</Label>
                            <Select value={status || request.status} onValueChange={setStatus}>
                                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-dark-gray">Current Location</Label>
                            <Input
                                value={currentLocation}
                                onChange={(e) => setCurrentLocation(e.target.value)}
                                placeholder="Enter current location"
                                defaultValue={request.currentLocation}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 px-6 py-3 bg-white justify-end rounded-b-2xl">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} >
                            {isSubmitting ? 'Updating...' : 'Update Status'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};