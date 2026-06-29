import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Plus, Search, Phone, } from 'lucide-react';
import { toast } from 'sonner';
import { CheckoutStep, FormData } from '@/app/checkout/checkoutContent';
import axiosInstance from '@/utils/fetch-function';
import useCustomer from '@/store/customerStore';
import { useCart } from '@/store/cart';
import { formatPrice } from '@/utils/helperfns';
import { useRouter } from 'next/navigation';
import { useGetDeliveryAddress } from '@/app/hooks/useGetDeliveryAddress';
import AddDeliveryAddress from '@/components/checkout/add-delivery-address';
import useDeliveryOptions from '@/app/hooks/useDeliveryOptions';
import useWeightDeliveryOptions from '@/app/hooks/useWeightDeliveryOptions';
import { useQuery } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowIcon, CheckIcon, EditIcon } from '@/components/icons/icons';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useGetLookup from '@/app/hooks/useGetLookup';

interface ShippingFormProps {
    setCurrentStep: (currentStep: CheckoutStep) => void;
    form: UseFormReturn<FormData>;
    onShippingUpdate?: (shippingCost: number) => void;
}

export const ShippingForm = ({ setCurrentStep, form, onShippingUpdate }: ShippingFormProps) => {
    const { customer } = useCustomer();
    const { cart, getCartTotal, mainCcy } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const [editingAddress, setEditingAddress] = useState<any | null>(null);
    const [pickupSearch, setPickupSearch] = useState('');
    const [deliverySearch, setDeliverySearch] = useState('');

    const { setValue, watch, getValues } = form;

    const areaOptions = useGetLookup('AREAS');
    const { deliveryAddress } = useGetDeliveryAddress();

    const shippingMethod = watch('shippingMethod');
    const selectedShippingOption = watch('shippingOption');
    const selectedAddressId = watch('selectedAddressId');
    const selectedStore = watch('pickupStore');

    const [selectedZone, setSelectedZone] = useState<string>('');
    const cartWeight = Object.values(cart).reduce((total: any, item: any) => total + (item.quantity || 1), 0);

    const { options: weightOptions, isLoading: isLoadingWeightOptions } = useWeightDeliveryOptions(
        selectedZone,
        cartWeight
    );

    const { data: pickupData, isLoading: isLoadingPickup, error: pickupError } = useQuery({
        queryKey: ['pickup-locations'],
        queryFn: () => axiosCustomer.request({ url: '/ecommerce/pickup-location/all', method: 'GET' }),
        enabled: shippingMethod === 'pickup',
    });

    const activePickupLocations = pickupData?.data?.pickupLocations.filter(
        (m: any) => m?.status?.toUpperCase() === 'ACTIVE'
    ) || [];

    const pickupStores = activePickupLocations.map((loc: any) => ({
        id: loc.id,
        name: loc.name,
        address: loc.location || '',
        distance: `${loc.distance || 0} miles`,
        hours: loc.timeframe || '9AM - 5PM',
        phone: loc.contact || '',
        amount: loc.amount || 0,
        street: loc.location?.split(',')[0] || '',
        postCode: '',
        state: '',
        country: customer?.country || 'NG',
        landmark: '',
        city: loc.location?.split(',')[1]?.trim() || '',
    }));

    const filteredPickupStores = pickupStores.filter((s: any) => {
        const q = pickupSearch.toLowerCase();
        if (!q) return true;
        return (
            s.name?.toLowerCase().includes(q) ||
            s.address?.toLowerCase().includes(q) ||
            s.city?.toLowerCase().includes(q)
        );
    });



    useEffect(() => {
        setValue('shippingMethod', undefined);
        setValue('pickupStore', undefined);
        setValue('selectedAddressId', undefined);
        setValue('shippingOption', undefined);
        setValue('fullName', '');
        setValue('street', '');
        setValue('landmark', '');
        setValue('zipCode', '');
        setValue('city', '');
        setValue('state', '');
        setValue('country', '');
        setValue('addressType', '');
        sessionStorage.removeItem('checkoutFormData');
    }, [setValue]);

    useEffect(() => {
        let shippingAmount = 0;
        if (shippingMethod === 'pickup' && selectedStore) {
            const loc = activePickupLocations.find((l: any) => l.id === selectedStore);
            shippingAmount = loc?.amount || 0;
        } else if (shippingMethod === 'delivery' && selectedShippingOption) {
            const opt = weightOptions?.find((o: any) => o.typeCode === selectedShippingOption);
            shippingAmount = opt?.finalFee || 0;
        }
        onShippingUpdate?.(shippingAmount);
    }, [shippingMethod, selectedShippingOption, selectedStore, weightOptions, onShippingUpdate]);

    const handleShippingMethodChange = (method: 'delivery' | 'pickup') => {
        if (method === 'delivery') {
            setValue('pickupStore', undefined);
            setValue('fullName', '');
            setValue('street', '');
            setValue('landmark', '');
            setValue('zipCode', '');
            setValue('city', '');
            setValue('state', '');
            setValue('country', '');
            setValue('addressType', '');
        } else {
            setValue('shippingOption', undefined);
            setValue('selectedAddressId', undefined);
            setValue('street', '');
            setValue('landmark', '');
            setValue('zipCode', '');
            setValue('city', '');
            setValue('state', '');
            setValue('country', '');
            setValue('addressType', '');
            setValue('fullName', '');
        }
        setValue('shippingMethod', method);
    };

    const handleZoneSelect = (zoneCode: string) => {
        setSelectedZone(zoneCode);
        setValue('shippingOption', undefined);
        setValue('deliveryOptionGroup', undefined);
    };

    const handleWeightOptionSelect = (typeCode: string) => {
        setValue('shippingOption', typeCode);
        setValue('deliveryOptionGroup', typeCode);
        const selectedOpt = weightOptions?.find((opt) => opt.typeCode === typeCode);
        if (selectedOpt) {
            sessionStorage.setItem('selectedWeightOption', JSON.stringify(selectedOpt));
        }
    };

    const handleAddressSelect = (address: any) => {
        setValue('pickupStore', undefined);
        setValue('addressType', address.addressType);
        setValue('selectedAddressId', address.id);
        setValue('street', address.street || '');
        setValue('landmark', address.landmark || '');
        setValue('zipCode', address.postCode || '');
        setValue('city', address.city || '');
        setValue('state', address.state || '');
        setValue('country', address.country || '');
    };

    const handleStoreSelect = (store: any) => {
        setValue('pickupStore', store.id);
        setValue('selectedAddressId', store.id);
        setValue('country', store.country || customer?.country || '');
        setValue('addressType', 'WAREHOUSE');
        setValue('landmark', store.landmark || '');
        setValue('street', store.street || store.address || '');
        setValue('city', store.city || '');
        setValue('state', store.state || store.city || '');
        setValue('zipCode', store.postCode || '');
        setValue('fullName', store.name);
    };

    const fetchAddressById = async (id: number) => {
        try {
            const res = await axiosInstance.get(`/ecommerce/get-delivery-address?id=${id}`);
            if (res.data.deliveryAddress) return res.data.deliveryAddress;
        } catch { toast.error('Failed to fetch address details'); }
        return null;
    };

    const handleEditAddress = async (address: any, e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        const details = await fetchAddressById(address.id);
        if (details) { setEditingAddress(details); setIsModalOpen(true); }
    };

    return (
        <>
            <div className="w-full ">
                <Button
                    variant='link'
                    onClick={() => router.back()}
                >
                    <ArrowIcon className="w-3 h-3 rotate-90" />
                    Back
                </Button>

                <div className="gap-2 mb-3 bg-muted text-muted-foreground flex h-10 w-fit items-center justify-center rounded-lg p-[3px]">
                    {(['delivery', 'pickup'] as const).map((method) => (
                        <button
                            key={method}
                            onClick={() => handleShippingMethodChange(method)}
                            className={`data-[state=active]:bg-background cursor-pointer data-[state=active]:text-medium-gray dark:data-[state=active]:text-medium-gray focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-[#9E9E9E] dark:text-white inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-lg border border-transparent px-2 py-2.5 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${shippingMethod === method
                                ? 'bg-white shadow-sm text-dark-gray border border-gray-200'
                                : 'text-medium-gray hover:text-dark-gray'
                                }`}
                        >
                            {method.charAt(0).toUpperCase() + method.slice(1)}
                        </button>
                    ))}
                </div>

                {shippingMethod === 'delivery' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-dark-gray mb-4">Delivery Information</h3>

                            {deliveryAddress.length === 0 ? (
                                <button
                                    onClick={() => { setEditingAddress(null); setIsModalOpen(true); }}
                                    className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-2 hover:border-[#d8480b] hover:bg-sidebar-accent/10 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-medium-gray" />
                                    </div>
                                    <p className="text-sm font-medium text-medium-gray">Add New Address</p>
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    {deliveryAddress.map((address: any) => (
                                        <div
                                            key={address.id}
                                            onClick={() => handleAddressSelect(address)}
                                            className={`relative flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all border-2 overflow-hidden group ${selectedAddressId === address.id
                                                ? 'border-faded-accent bg-faded-accent/10'
                                                : 'border-gray-100 hover:border-gray-200'
                                                }`}
                                        >
                                            <div className={`absolute rounded-full -bottom-7 -right-4 w-12 h-12 rotate-45 transition-all duration-300 ${selectedAddressId === address.id
                                                ? 'bg-faded-accent scale-100'
                                                : 'bg-gray-200 scale-0'
                                                }`}>
                                                {selectedAddressId === address.id && (
                                                    <CheckIcon className="absolute -rotate-45 mt-3 ml-2.5 top-2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MapPin className="w-3 h-3 text-medium-gray shrink-0" />
                                                    <span className="text-xs text-medium-gray font-medium">Delivery Address</span>
                                                    <span className={`text-xs lowercase font-medium border-2 px-2 rounded-full ${selectedAddressId === address.id
                                                        ? 'text-faded-accent border-faded-accent'
                                                        : 'text-dark-gray border-gray-100'
                                                        }`}>
                                                        {address.addressType}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-dark-gray">
                                                    {[address.street, address.city, address.state].filter(Boolean).join(', ')}
                                                </p>
                                            </div>

                                            <button
                                                onClick={(e) => handleEditAddress(address, e)}
                                                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-faded-accent/30 transition-colors shrink-0"
                                            >
                                                <EditIcon className="w-4 h-4 text-medium-gray" />
                                            </button>
                                        </div>
                                    ))}

                                    <Button
                                        onClick={() => { setEditingAddress(null); setIsModalOpen(true); }}
                                        variant='link'
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add New Address
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl p-5 mb-4">
                            <h3 className="text-sm font-semibold text-dark-gray mb-4">Delivery Area</h3>
                            <div className="space-y-2">
                                <Select
                                    value={selectedZone || ""}
                                    onValueChange={(value) => handleZoneSelect(value)}
                                >
                                    <SelectTrigger className={`w-full py-6 rounded-xl border-gray-200 bg-white shadow-sm focus:ring-[#d8480b] focus:border-[#d8480b] ${!selectedZone && shippingMethod === 'delivery' ? "border-red-400" : ""}`}>
                                        <SelectValue placeholder="Select your area" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        {areaOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {!selectedZone && (
                                    <p className="text-sm text-red-400 mt-2">Please select a delivery area</p>
                                )}
                            </div>
                        </div>

                        {selectedZone && (
                            <div className="bg-white rounded-2xl p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-semibold text-dark-gray">Delivery Speed</h3>
                                    <p className="text-xs text-medium-gray">Weight: {cartWeight.toFixed(1)} kg</p>
                                </div>

                                {isLoadingWeightOptions ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="w-6 h-6 rounded-full border-2 border-[#d8480b] border-t-transparent animate-spin" />
                                    </div>
                                ) : weightOptions.length === 0 ? (
                                    <p className="text-sm text-medium-gray font-light text-center py-6">
                                        No delivery options available for this zone
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {weightOptions.map((option: any) => (
                                            <div
                                                key={option.typeCode}
                                                onClick={() => handleWeightOptionSelect(option.typeCode)}
                                                className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all border-2 ${selectedShippingOption === option.typeCode
                                                    ? 'border-faded-accent bg-faded-accent/10'
                                                    : 'border-gray-100 hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedShippingOption === option.typeCode ? 'border-[#d8480b]' : 'border-gray-300'
                                                    }`}>
                                                    {selectedShippingOption === option.typeCode && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-faded-accent" />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="text-xl shrink-0">{option.typeCode === 'EXPRESS' ? '⚡' : '📦'}</div>
                                                            <p className="text-sm font-semibold text-dark-gray">
                                                                {option.typeName}
                                                            </p>
                                                            {option.typeCode === 'EXPRESS' && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                                    Fastest
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm font-semibold text-dark-gray shrink-0 text-right mt-0.5">
                                                            {formatPrice(option.finalFee, mainCcy() as any)}
                                                        </p>
                                                    </div>

                                                    <div className="text-xs text-medium-gray flex flex-col gap-1 mt-1">
                                                        <span className="flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5 shrink-0" />
                                                            <span className="truncate">Est. Delivery: {option.estimatedTime} {option.estimatedTimeType.toLowerCase()}{option.estimatedTime > 1 ? 's' : ''}</span>
                                                        </span>
                                                        <p className="font-medium mt-1">{option.breakdown}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {!selectedShippingOption && weightOptions.length > 0 && (
                                    <p className="text-sm text-red-400 mt-2">Please select a delivery speed</p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {shippingMethod === 'pickup' && (
                    <div className="bg-white rounded-2xl p-5">
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-dark-gray">Pickup Locations</h3>
                            <p className="text-xs text-medium-gray font-light mt-0.5">Select a store near you for pickup</p>
                        </div>

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                            <Input
                                type="text"
                                value={pickupSearch}
                                onChange={(e) => setPickupSearch(e.target.value)}
                                placeholder="Search by name or location..."
                                className="w-full pl-9 pr-4 py-2.5 text-sm text-dark-gray placeholder:text-medium-gray"
                            />
                        </div>

                        {isLoadingPickup ? (
                            <div className="flex items-center justify-center py-10">
                                <div className="w-6 h-6 rounded-full border-2 border-[#d8480b] border-t-transparent animate-spin" />
                            </div>
                        ) : pickupError ? (
                            <p className="text-sm text-red-400 text-center py-6">Failed to load pickup locations</p>
                        ) : filteredPickupStores.length === 0 ? (
                            <p className="text-sm text-medium-gray font-light text-center py-6">
                                {pickupSearch ? 'No locations match your search' : 'No pickup locations available'}
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {filteredPickupStores.map((store: any) => (
                                    <div
                                        key={store.id}
                                        onClick={() => handleStoreSelect(store)}
                                        className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${selectedStore === store.id
                                            ? 'border-faded-accent bg-faded-accent/10'
                                            : 'border-gray-100 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className={`mt-0.5 w-4 h-4 rounded-full border-2 border-faded-accent flex items-center justify-center shrink-0 ${selectedStore === store.id ? 'border-[#d8480b]' : 'border-gray-300'
                                            }`}>
                                            {selectedStore === store.id && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-faded-accent" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="text-sm font-semibold text-dark-gray">{store.name}</p>
                                                <p className="text-sm font-semibold text-dark-gray shrink-0">
                                                    {formatPrice(store.amount || 0, mainCcy() as any)}
                                                </p>
                                            </div>
                                            <p className="text-xs text-medium-gray mt-0.5">{store.address}</p>
                                            <div className="flex items-center font-light gap-3 mt-2 text-xs text-medium-gray">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {store.distance}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {store.hours}
                                                </span>
                                                {store.phone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {store.phone}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {!shippingMethod && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                        <p className="text-sm text-medium-gray font-light">Select a shipping method above to continue</p>
                    </div>
                )}
            </div>

            <AddDeliveryAddress
                isOpen={isModalOpen}
                setIsOpen={() => { setIsModalOpen(false); setEditingAddress(null); }}
                editingAddress={editingAddress}
                onAddressSaved={() => { setIsModalOpen(false); setEditingAddress(null); }}
            />
        </>
    );
};