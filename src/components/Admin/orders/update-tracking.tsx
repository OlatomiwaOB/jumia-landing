'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, Truck, CheckCircle, XCircle, Clock, Store, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import useUser from '@/store/userStore';
import { toast } from 'sonner';
import { FormSelect } from "@/components/ui/form-select"

interface Order {
    cartId: string;
    orderDate: string;
    customerName: string;
    cartItems: any[];
    ccy?: string;
    taxAmount?: number;
    deliveryFee?: number;
    paymentMethod?: string;
}

interface UpdateOrderTrackingProps {
    order: Order;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const DELIVERY_PROGRESSION = [
    'PAYMENT_RECEIVED', 'ORDER_REVIEW', 'PACKING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED',
] as const;

const PICKUP_PROGRESSION = [
    'PAYMENT_RECEIVED', 'ORDER_REVIEW', 'PACKING', 'SHIPPED', 'IN_TRANSIT', 'AVAILABLE_FOR_PICKUP',
] as const;

const STATUS_LABELS: Record<string, string> = {
    PAYMENT_RECEIVED: 'Payment Received',
    ORDER_REVIEW: 'Order Review',
    PACKING: 'Packing',
    SHIPPED: 'Shipped',
    IN_TRANSIT: 'In Transit',
    DELIVERED: 'Delivered',
    AVAILABLE_FOR_PICKUP: 'Available for Pickup',
    CANCELLED: 'Cancelled',
};

const activityIcons: Record<string, React.ReactNode> = {
    PAYMENT_RECEIVED: <CheckCircle className="w-5 h-5" />,
    ORDER_REVIEW: <Clock className="w-5 h-5" />,
    PACKING: <Package className="w-5 h-5" />,
    SHIPPED: <Truck className="w-5 h-5" />,
    IN_TRANSIT: <Truck className="w-5 h-5" />,
    DELIVERED: <CheckCircle className="w-5 h-5" />,
    AVAILABLE_FOR_PICKUP: <Store className="w-5 h-5" />,
    CANCELLED: <XCircle className="w-5 h-5" />,
};

export const UpdateOrderTracking: React.FC<UpdateOrderTrackingProps> = ({
    order,
    isOpen,
    onClose,
    onSuccess
}) => {
    const { user } = useUser();
    const queryClient = useQueryClient();

    const { data: existingTrackingData, refetch } = useQuery({
        queryKey: ['order-tracking-existing', order.cartId],
        queryFn: () => axiosInstance.request({
            method: 'GET',
            url: 'ecommerce/track-sale-order',
            params: {
                orderNo: order.cartId,
                storeCode: user?.storeCode
            }
        }),
        enabled: isOpen && !!order.cartId,
        select: (response: any) => response.data,
    });

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            activityType: '',
            comment: '',
        }
    });

    const existingTrackingInfo = existingTrackingData?.orderTrackInfo;
    const deliveryOption = existingTrackingInfo?.deliveryOption || 'delivery';

    const getActivityTypeOptions = () => {
        const baseOptions = [
            { id: 'ORDER_REVIEW', name: 'Order In Review' },
            { id: 'PACKING', name: 'Packed' },
            { id: 'SHIPPED', name: 'Shipped' },
            { id: 'IN_TRANSIT', name: 'Order In Transit' },
            { id: 'CANCELLED', name: 'Cancelled' },
        ];

        if (deliveryOption === 'pickup') {
            baseOptions.push({ id: 'AVAILABLE_FOR_PICKUP', name: 'Available for Pickup' });
        } else {
            baseOptions.push({ id: 'DELIVERED', name: 'Delivered' });
        }

        return baseOptions;
    };

    const activityTypeOptions = getActivityTypeOptions();
    const selectedActivityType = watch('activityType');

    const onSubmit = async (data: { activityType: string; comment: string }) => {
        try {
            const payload = {
                orderNo: order.cartId,
                status: 'IN_PROGRESS',
                activityType: data.activityType,
                comment: data.comment,
                entityCode: user?.entityCode,
                deliveryOption: deliveryOption,
                storeCode: user?.storeCode
            };

            const response = await axiosInstance.request({
                method: 'POST',
                url: 'ecommerce/save-order-track',
                data: payload
            });

            if (response.data?.code === '000') {
                toast.success('Tracking updated successfully');
                reset();
                refetch();
                queryClient.invalidateQueries({ queryKey: ['order-tracking'] });
                onSuccess?.();
                onClose();
            } else {
                toast.error(response.data?.desc || 'Failed to update tracking');
            }
        } catch (error: any) {
            console.error('Error updating tracking:', error);
            toast.error(error?.response?.data?.message || 'Error updating tracking');
        }
    };

    const progression = deliveryOption === 'pickup' ? PICKUP_PROGRESSION : DELIVERY_PROGRESSION;
    const currentActivityType = existingTrackingInfo?.activityType || '';
    const currentIdx = progression.indexOf(currentActivityType as any);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl gap-0 border-0 shadow-xl bg-[#F5F5F5]"
                style={{
                    scrollbarWidth: 'none',
                    scrollbarColor: 'transparent',
                }}
            >
                <DialogTitle className="sr-only">Update Order Tracking</DialogTitle>

                <div className="px-2 pt-1">
                    <h2 className="text-md font-bold text-dark-gray">Update Tracking</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-2 pb-6 pt-4 space-y-5">
                    <div className="bg-white rounded-2xl p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
                            <div>
                                <p className="text-xs text-medium-gray">Order ID</p>
                                <p className="text-sm font-bold text-dark-gray">{order.cartId}</p>
                            </div>
                            <Badge className={`text-[10px] px-2 py-0.5 font-semibold border text-medium-gray ${deliveryOption === 'pickup' ? 'bg-faded-accent/5' : 'bg-faded-accent/5'}`}>
                                {deliveryOption === 'pickup' ? 'Pickup' : 'Delivery'}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-xs text-medium-gray">Customer</p>
                                <p className="font-medium text-dark-gray">{order.customerName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-medium-gray">Order Date</p>
                                <p className="font-medium text-dark-gray">{order.orderDate}</p>
                            </div>
                            <div>
                                <p className="text-xs text-medium-gray">Items</p>
                                <p className="font-medium text-dark-gray">{order.cartItems?.length || 0} items</p>
                            </div>
                            {existingTrackingInfo?.trackingNo && (
                                <div>
                                    <p className="text-xs text-medium-gray">Tracking No</p>
                                    <p className="font-medium text-dark-gray">{existingTrackingInfo.trackingNo}</p>
                                </div>
                            )}
                        </div>

                        {existingTrackingInfo && (
                            <div className="bg-faded-accent/5 rounded-xl p-3 space-y-2">
                                <p className="text-xs font-semibold text-dark-gray">Current Status</p>
                                <div className="flex items-center gap-2 text-xs text-medium-gray">
                                    <span className="font-medium">
                                        {(STATUS_LABELS[currentActivityType] ?? currentActivityType) || 'No status yet'}
                                    </span>
                                    {existingTrackingInfo.activityDate && (
                                        <>
                                            <span>•</span>
                                            <span>{existingTrackingInfo.activityDate}</span>
                                        </>
                                    )}
                                </div>
                                {existingTrackingInfo.comment && (
                                    <p className="text-xs text-medium-gray bg-white rounded-lg p-2">{existingTrackingInfo.comment}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl p-4 space-y-4">
                        <p className="text-sm font-semibold text-dark-gray">Update Status</p>

                        <div className="space-y-2">
                            <Label htmlFor="activityType">
                                Activity Type <span className="text-red-500">*</span>
                            </Label>
                            {/* <select
                id="activityType"
                {...register('activityType', { required: 'Activity type is required' })}
                className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-faded-accent focus:border-transparent"
              >
                <option value="">Select Activity Type</option>
                {activityTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select> */}
                            <FormSelect
                                name="activityType"
                                control={control}
                                placeholder="Select Activity Type"
                                options={activityTypeOptions}
                                required
                                onChange={(value) => {
                                }}
                                triggerClassName="w-full border-2 border-gray-200 rounded-xl text-sm"
                            />
                            {errors.activityType && (
                                <p className="text-red-500 text-xs">{errors.activityType.message as string}</p>
                            )}
                        </div>

                        {selectedActivityType && (
                            <div className="flex items-center gap-3 p-3 bg-faded-accent/5 rounded-xl">
                                <div className="flex-shrink-0 text-faded-accent">
                                    {activityIcons[selectedActivityType] || <Package className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-dark-gray">
                                        {activityTypeOptions.find(opt => opt.id === selectedActivityType)?.name}
                                    </p>
                                    <p className="text-xs text-medium-gray">
                                        {selectedActivityType === 'AVAILABLE_FOR_PICKUP'
                                            ? 'Customer will be notified that their order is ready for pickup'
                                            : selectedActivityType === 'DELIVERED'
                                                ? 'Order has been delivered to the customer'
                                                : 'This will update the order\'s tracking status'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="comment">
                                Comments
                            </Label>
                            <Textarea
                                id="comment"
                                {...register('comment')}
                                placeholder="Enter any comments about this update (optional)"
                                className="min-h-[80px] resize-none rounded-xl"
                            />
                        </div>

                        <div className="bg-white rounded-2xl p-0">
                            <p className="text-xs font-semibold text-dark-gray mb-3">Order Progression</p>
                            <ol className="space-y-0">
                                {progression.map((step, idx) => {
                                    const isDone = currentIdx >= 0 && idx < currentIdx;
                                    const isCurrent = idx === currentIdx;
                                    const isPending = currentIdx < 0 || idx > currentIdx;
                                    const isLast = idx === progression.length - 1;

                                    return (
                                        <li key={step} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${isDone ? 'bg-orange-500 text-white' :
                                                    isCurrent ? 'bg-white border-2 border-faded-accent' :
                                                        'bg-gray-100'
                                                    }`}>
                                                    {isDone ? (
                                                        <CheckCircle className="w-2.5 h-2.5" />
                                                    ) : isCurrent ? (
                                                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                                                    ) : (
                                                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                                                    )}
                                                </div>
                                                {!isLast && (
                                                    <div className={`w-0.5 flex-1 my-0.5 min-h-[12px] rounded-full ${isDone ? 'bg-orange-400' : 'bg-gray-200'
                                                        }`} />
                                                )}
                                            </div>
                                            <div className={`pb-3 min-w-0 ${isLast ? 'pb-0' : ''}`}>
                                                <p className={`text-xs font-medium leading-snug ${isPending ? 'text-gray-400' : 'text-dark-gray'
                                                    }`}>
                                                    {STATUS_LABELS[step] ?? step}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Tracking'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateOrderTracking;