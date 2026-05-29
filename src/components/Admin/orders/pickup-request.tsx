'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';
import { toast } from 'sonner';

interface Order {
  cartId: string;
  orderDate: string;
  customerName: string;
  deliveryAddress?: any;
  cartItems?: any[];
}

interface PickupLocation {
  id: number;
  name: string;
  location: string;
  distance: number;
  timeframe: string;
  contact: string;
  status: string;
}

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

interface PickupRequestModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const packageSizeOptions = [
  { value: 'SMALL', label: 'Small' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LARGE', label: 'Large' },
];

const PickupRequestModal: React.FC<PickupRequestModalProps> = ({ order, isOpen, onClose, onSuccess }) => {
  const { user } = useUser();
  const [isLoadingPickupData, setIsLoadingPickupData] = useState(false);
  const [isLoadingDeliveryRequest, setIsLoadingDeliveryRequest] = useState(false);
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [existingDeliveryRequest, setExistingDeliveryRequest] = useState<DeliveryRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pickupRequestForm, setPickupRequestForm] = useState({
    pickupLocation: '',
    packageSize: 'SMALL',
    weightKg: 0,
    length: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (isOpen && order?.cartId) {
      fetchExistingDeliveryRequest(order.cartId);
      fetchPickupLocations();
    }
  }, [isOpen, order?.cartId]);

  const fetchExistingDeliveryRequest = async (cartId: string) => {
    try {
      setIsLoadingDeliveryRequest(true);
      const response = await axiosInstance.get('/delivery-request/fetch', {
        params: { orderRef: cartId, storeCode: user?.storeCode }
      });
      if (response.data.responseCode === '000' && response.data.deliveryRequests?.length > 0) {
        const request = response.data.deliveryRequests[0];
        setExistingDeliveryRequest(request);
        setPickupRequestForm({
          pickupLocation: request.pickupLocation || '',
          packageSize: request.packageSize || 'SMALL',
          weightKg: request.weightKg || 0,
          length: request.length || 0,
          width: request.width || 0,
          height: request.height || 0,
        });
      } else {
        setExistingDeliveryRequest(null);
        setPickupRequestForm({ pickupLocation: '', packageSize: 'SMALL', weightKg: 0, length: 0, width: 0, height: 0 });
      }
    } catch (error) {
      setExistingDeliveryRequest(null);
      toast.error('Failed to load existing delivery request');
    } finally {
      setIsLoadingDeliveryRequest(false);
    }
  };

  const fetchPickupLocations = async () => {
    try {
      setIsLoadingPickupData(true);
      const response = await axiosInstance.get('/ecommerce/pickup-location/all');
      if (response.data.responseCode === '000' && response.data.pickupLocations) {
        const activeLocations = response.data.pickupLocations.filter(
          (location: PickupLocation) => location?.status?.toUpperCase() === "ACTIVE"
        );
        setPickupLocations(activeLocations);
      }
    } catch (error) {
      toast.error('Failed to load pickup locations');
    } finally {
      setIsLoadingPickupData(false);
    }
  };

  const handleSavePickupRequest = async () => {
    if (!pickupRequestForm.pickupLocation) { toast.error('Please select a pickup location'); return; }
    if (pickupRequestForm.weightKg <= 0) { toast.error('Please enter a valid weight'); return; }

    try {
      setIsSubmitting(true);
      const requestData = {
        id: existingDeliveryRequest?.id || 0,
        orderRefNo: order.cartId,
        storeCode: user?.storeCode || '',
        storeName: user?.businessName || '',
        pickupLocation: pickupRequestForm.pickupLocation,
        deliveryLocation: `${order.deliveryAddress?.street || ''}, ${order.deliveryAddress?.city || ''}, ${order.deliveryAddress?.state || ''}`,
        packageSize: pickupRequestForm.packageSize,
        weightKg: pickupRequestForm.weightKg,
        length: pickupRequestForm.length,
        width: pickupRequestForm.width,
        height: pickupRequestForm.height,
        deliveredBy: existingDeliveryRequest?.deliveredBy || '',
        deliverySpeed: existingDeliveryRequest?.deliverySpeed || '',
        createdDate: existingDeliveryRequest?.createdDate || new Date().toISOString(),
        deliveryDate: existingDeliveryRequest?.deliveryDate || '',
        status: existingDeliveryRequest?.status || 'PENDING',
        currentLocation: user?.address || '',
      };

      const response = await axiosInstance.post('/delivery-request/save', requestData);
      if (response.data?.code === '000') {
        toast.success('Delivery request saved successfully!');
        onSuccess?.();
        onClose();
      } else {
        toast.error(response.data?.desc || 'Failed to save delivery request');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error saving delivery request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl gap-0 border-0 shadow-xl bg-[#F5F5F5]"
        style={{
          scrollbarWidth: 'none',
          scrollbarColor: 'transparent',
        }}
      >
        <DialogTitle className="sr-only">Pickup Request</DialogTitle>

        <div className="px-2 pt-1">
          <h2 className="text-md font-bold text-dark-gray">
            {existingDeliveryRequest ? 'View Pickup Request' : 'Request Pickup'}
          </h2>
        </div>

        <div className="px-2 pb-6 pt-4 space-y-5">
          {isLoadingDeliveryRequest ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-faded-accent" />
              <p className="text-sm text-medium-gray">Loading delivery request...</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
                  <div>
                    <p className="text-xs text-medium-gray">Order ID</p>
                    <p className="text-sm font-bold text-dark-gray">{order.cartId}</p>
                  </div>
                  {existingDeliveryRequest && (
                    <Badge className={`text-[10px] px-2 py-0.5 font-semibold border ${existingDeliveryRequest.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                      existingDeliveryRequest.status === 'IN_TRANSIT' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                        existingDeliveryRequest.status === 'DELIVERED' ? 'bg-green-100 text-green-700 border-green-200' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                      {existingDeliveryRequest.status}
                    </Badge>
                  )}
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
                  {existingDeliveryRequest?.createdDate && (
                    <div className="col-span-2">
                      <p className="text-xs text-medium-gray">Request Created</p>
                      <p className="font-medium text-dark-gray">{existingDeliveryRequest.createdDate}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 space-y-4">
                <p className="text-sm font-semibold text-dark-gray">Pickup Details</p>

                <div className="space-y-2">
                  <Label htmlFor="pickupLocation">
                    Pickup Location <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={pickupRequestForm.pickupLocation}
                    onValueChange={(value) => setPickupRequestForm({ ...pickupRequestForm, pickupLocation: value })}
                    disabled={isLoadingPickupData}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingPickupData ? "Loading locations..." : "Select pickup location"} />
                    </SelectTrigger>
                    <SelectContent>
                      {pickupLocations.map((location) => (
                        <SelectItem key={location.id} value={location.name}>
                          {location.name} - {location.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {pickupLocations.length === 0 && !isLoadingPickupData && (
                    <p className="text-xs text-red-500">No active pickup locations available</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="packageSize">
                    Package Size <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={pickupRequestForm.packageSize}
                    onValueChange={(value) => setPickupRequestForm({ ...pickupRequestForm, packageSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select package size" />
                    </SelectTrigger>
                    <SelectContent>
                      {packageSizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weightKg">
                    Weight (Kg) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="weightKg" type="number" min="0" step="0.1"
                    value={pickupRequestForm.weightKg || ''}
                    onChange={(e) => setPickupRequestForm({ ...pickupRequestForm, weightKg: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter weight in kilograms"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Length (cm)</Label>
                    <Input id="length" type="number" min="0"
                      value={pickupRequestForm.length || ''}
                      onChange={(e) => setPickupRequestForm({ ...pickupRequestForm, length: parseFloat(e.target.value) || 0 })}
                      placeholder="Length" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (cm)</Label>
                    <Input id="width" type="number" min="0"
                      value={pickupRequestForm.width || ''}
                      onChange={(e) => setPickupRequestForm({ ...pickupRequestForm, width: parseFloat(e.target.value) || 0 })}
                      placeholder="Width" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input id="height" type="number" min="0"
                      value={pickupRequestForm.height || ''}
                      onChange={(e) => setPickupRequestForm({ ...pickupRequestForm, height: parseFloat(e.target.value) || 0 })}
                      placeholder="Height" />
                  </div>
                </div>
              </div>

              {!existingDeliveryRequest && (
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePickupRequest}
                    disabled={!pickupRequestForm.pickupLocation || pickupRequestForm.weightKg <= 0 || isSubmitting}>
                    {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Request'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PickupRequestModal;