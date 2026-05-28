// components/Operations/delivery-requests/delivery-assign-rider.tsx
'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';

interface DeliveryRequest {
    id: number;
    orderRefNo: string;
    deliveryLocation: string;
}

interface DeliveryAssignRiderModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    request: DeliveryRequest | null;
    onSuccess: () => void;
}

export const DeliveryAssignRiderModal: React.FC<DeliveryAssignRiderModalProps> = ({ open, onOpenChange, request, onSuccess }) => {
    const [selectedRider, setSelectedRider] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: ridersData, isLoading: isLoadingRiders } = useQuery({
        queryKey: ['available-riders'],
        queryFn: () => axiosOperations.request({ url: '/delivery-rider/riders/list', method: 'GET' }),
    });

    const riders: any[] = ridersData?.data?.data || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!request) return;
        if (!selectedRider) { toast.error('Please select a rider'); return; }
        setIsSubmitting(true);
        try {
            const params = new URLSearchParams();
            params.append('deliveryRequestId', request.id.toString());
            params.append('rider', selectedRider);
            const response = await axiosOperations.post('/delivery-request/assign-rider', null, { params });
            if (response.data?.code === '000') {
                toast.success('Rider assigned successfully');
                onSuccess();
                onOpenChange(false);
                setSelectedRider('');
            } else {
                toast.error(response.data?.desc || 'Failed to assign rider');
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Error assigning rider');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!request) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                <DialogTitle className="sr-only">Assign Rider</DialogTitle>
                <div className="px-6 pt-5">
                    <h2 className="text-base font-bold text-dark-gray">Assign Rider</h2>
                    <p className="text-xs text-medium-gray mt-0.5">Assign a rider to request #{request.id}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-white rounded-2xl m-6 p-4 space-y-4">
                        <div className="space-y-2">
                            <p className="text-xs text-medium-gray">Order Reference</p>
                            <p className="text-sm font-mono font-semibold text-dark-gray">{request.orderRefNo}</p>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-dark-gray">Select Rider *</Label>
                            <Select value={selectedRider} onValueChange={setSelectedRider}>
                                <SelectTrigger><SelectValue placeholder="Select rider" /></SelectTrigger>
                                <SelectContent>
                                    {isLoadingRiders ? (
                                        <SelectItem value="loading" disabled>Loading riders...</SelectItem>
                                    ) : riders.length === 0 ? (
                                        <SelectItem value="no-riders" disabled>No riders found</SelectItem>
                                    ) : (
                                        riders.map((rider: any) => (
                                            <SelectItem key={rider.email} value={rider.email}>{rider.fullName} • {rider.email}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-xs text-amber-800"><span className="font-semibold">Note:</span> Once assigned, this rider will be responsible for delivering this package.</p>
                        </div>
                    </div>
                    <div className="flex gap-3 px-6 py-3 bg-white justify-end rounded-b-2xl">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} >
                            {isSubmitting ? 'Assigning...' : 'Assign Rider'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};