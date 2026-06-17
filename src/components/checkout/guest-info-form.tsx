import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GuestFormData } from '@/app/checkout/guestCheckoutContent';
import { CartReview } from './bnpl_checkout/cart-review';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Truck, MapPin, Eye, EyeOff } from 'lucide-react';
import { SearchSelect } from '@/components/ui/search-select';
import { nationalityOptions, countryOptions } from '@/utils/country-data';
import { useRouter } from 'next/navigation';
import useDeliveryOptions from '@/app/hooks/useDeliveryOptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { formatPrice } from '@/utils/helperfns';
import { useCart } from '@/store/cart';
import { useQuery } from '@tanstack/react-query';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { Store, Clock } from 'lucide-react';
import useGetLookup from '@/app/hooks/useGetLookup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GuestInfoFormProps {
  form: UseFormReturn<GuestFormData>;
  onContinue: () => void;
  onShippingUpdate?: (shippingCost: number) => void;
  onVatUpdate?: (vat: number) => void;
  onSubtotalUpdate?: (subtotal: number) => void;
  onTotalUpdate?: (total: number) => void;
}

const GuestInfoForm = ({
  form,
  onContinue,
  onShippingUpdate,
  onVatUpdate,
  onSubtotalUpdate,
  onTotalUpdate
}: GuestInfoFormProps) => {
  const router = useRouter();
  const { watch, register, formState: { errors }, setValue, trigger } = form;
  const { mainCcy } = useCart();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const watchShippingMethod = watch("shippingMethod");
  const watchShippingOption = watch("shippingOption");
  const watchPickupStore = watch("pickupStore");
  const watchSelectedAddressId = watch("selectedAddressId");

  const { deliveryOptions } = useDeliveryOptions('GUEST');
  const addressTypeOptions = useGetLookup('ADDRESS_TYPE');

  const { data: pickupData, isLoading: isLoadingPickup } = useQuery({
    queryKey: ['pickup-locations-guest'],
    queryFn: () => axiosInstanceNoAuth.request({
      url: '/ecommerce/pickup-location/all',
      method: 'GET',
      params: {
        sourceType: 'GUEST'
      }
    }),
    enabled: watchShippingMethod === 'pickup',
  });

  const pickupStores = React.useMemo(() => {
    return pickupData?.data?.pickupLocations?.map((location: any) => ({
      id: location.id,
      name: location.name,
      address: location.location || '',
      distance: `${location.distance || 0} miles`,
      hours: location.timeframe || '9:00 AM - 5:00 PM',
      phone: location.contact || '',
      amount: location.amount || 0,
      street: location.location?.split(',')[0] || '',
      postCode: '',
      state: '',
      country: 'NG',
      landmark: '',
      city: location.location?.split(',')[1]?.trim() || ''
    })) || [];
  }, [pickupData]);

  const lastShippingAmount = React.useRef<number | null>(null);

  // Recalculate shipping cost if delivery option or pickup store changes
  useEffect(() => {
    let shippingAmount = 0;
    if (watchShippingMethod === 'delivery' && watchShippingOption) {
      const selectedOption = deliveryOptions?.find((opt: any) => opt.id === watchShippingOption);
      shippingAmount = selectedOption?.amount || 0;
      if (selectedOption?.groupCode) {
        setValue("deliveryOptionGroup", selectedOption.groupCode);
      } else {
        setValue("deliveryOptionGroup", "");
      }
    } else if (watchShippingMethod === 'pickup' && watchPickupStore) {
      const selectedStore = pickupStores.find((store: any) => store.id === watchPickupStore);
      shippingAmount = selectedStore?.amount || 0;
      setValue("deliveryOptionGroup", "");
    }

    if (lastShippingAmount.current !== shippingAmount) {
      lastShippingAmount.current = shippingAmount;
      onShippingUpdate?.(shippingAmount);
    }
  }, [watchShippingMethod, watchShippingOption, watchPickupStore, deliveryOptions, pickupStores, onShippingUpdate]);

  const handleShippingMethodChange = (method: "delivery" | "pickup") => {
    setValue("shippingMethod", method);
    if (method === 'pickup') {
      setValue("shippingOption", undefined);
      setValue("street", "");
      setValue("city", "");
      setValue("state", "");
      setValue("zipCode", "");
    } else {
      setValue("pickupStore", undefined);
    }
  };

  const handleStoreSelect = (store: any) => {
    console.log(store);

    setValue("pickupStore", store?.id);
    setValue("selectedAddressId", store?.id);
    setValue('country', store?.country || 'NG');
    setValue('addressType', 'WAREHOUSE');
    setValue('street', store?.address || '');
    setValue('city', store?.city || '');
    setValue('state', store?.state || store?.city || '');
  };

  const handleShippingOptionChange = (optionId: string) => {
    setValue("shippingOption", optionId);
    const selectedOption = deliveryOptions?.find((option: any) => option.id === optionId);
    if (selectedOption?.groupCode) {
      setValue("deliveryOptionGroup", selectedOption.groupCode);
    } else {
      setValue("deliveryOptionGroup", "");
    }
  };

  const getSelectedShippingOption = () => {
    if (watchShippingMethod !== 'delivery' || !watchShippingOption) return null;
    const selectedOption = deliveryOptions.find((option: any) => option.id === watchShippingOption);
    if (!selectedOption) return null;

    return {
      id: selectedOption.id,
      name: selectedOption.name,
      price: selectedOption.amount,
      description: selectedOption.description,
      icon: selectedOption.icon,
      estimatedArrival: selectedOption.estimatedArrival,
      area: selectedOption.area,
      groupCode: selectedOption.groupCode,
      estimatedTime: selectedOption.estimatedTime,
      estimatedTimeType: selectedOption.estimatedTimeType,
      amount: selectedOption.amount,
      deliveryVatAmount: selectedOption.deliveryVatAmount
    };
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      onContinue();
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/')}
          className="bg-accent/15 hover:bg-accent/50 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-bold">Guest Checkout</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
        <div className="lg:pr-8 space-y-8">

          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input {...register('firstname')} placeholder="John" className={errors.firstname ? "border-destructive" : ""} />
                  {errors.firstname && <p className="text-xs text-destructive">{errors.firstname.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input {...register('lastname')} placeholder="Doe" className={errors.lastname ? "border-destructive" : ""} />
                  {errors.lastname && <p className="text-xs text-destructive">{errors.lastname.message as string}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" {...register('email')} placeholder="john@example.com" className={errors.email ? "border-destructive" : ""} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number *</Label>
                  <Input {...register('mobileNo')} placeholder="+1234567890" className={errors.mobileNo ? "border-destructive" : ""} />
                  {errors.mobileNo && <p className="text-xs text-destructive">{errors.mobileNo.message as string}</p>}
                </div>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nationality *</Label>
                  <SearchSelect
                    options={nationalityOptions}
                    value={watch('nationality')}
                    onValueChange={(value) => { setValue('nationality', value, { shouldValidate: true }); trigger('nationality'); }}
                    placeholder="Select nationality"
                  />
                  {errors.nationality && <p className="text-xs text-destructive">{errors.nationality.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth *</Label>
                  <Input type="date" {...register('dateOfBirth')} className={errors.dateOfBirth ? "border-destructive" : ""} />
                  {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth.message as string}</p>}
                </div>
              </div> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Set Account Password *</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...register('password')}
                      placeholder="••••••••"
                      className={errors.password ? "border-destructive" : ""}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password.message as string}</p>}
                  <p className="text-xs text-muted-foreground mt-1">We will create an account for you using this password.</p>
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register('confirmPassword')}
                      placeholder="••••••••"
                      className={errors.confirmPassword ? "border-destructive" : ""}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message as string}</p>}
                  <p className="text-xs text-muted-foreground mt-1">We will create an account for you using this password.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <div>
            <h2 className="text-lg font-medium text-checkout-text mb-4">Shipping Information</h2>

            <div className="flex gap-4 mb-6">
              <Button
                type="button"
                className={`flex-1 justify-start gap-3 h-12 ${watchShippingMethod === 'delivery' ? 'bg-accent/5 border-accent border text-accent' : 'bg-white border text-black'} hover:bg-accent/10`}
                onClick={() => handleShippingMethodChange("delivery")}
              >
                <Truck className="w-4 h-4" />
                Delivery
              </Button>
              <Button
                type="button"
                className={`flex-1 justify-start gap-3 h-12 ${watchShippingMethod === 'pickup' ? 'bg-accent/5 border-accent border text-accent' : "bg-white border text-black"} hover:bg-accent/10`}
                onClick={() => handleShippingMethodChange("pickup")}
              >
                <MapPin className="w-4 h-4" />
                Pick up
              </Button>
            </div>

            {watchShippingMethod === 'delivery' && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Address Type *</Label>
                      <Select
                        value={watch('addressType')}
                        onValueChange={(value) => { setValue('addressType', value, { shouldValidate: true }); trigger('addressType'); }}
                      >
                        <SelectTrigger className={`w-full ${errors.addressType ? "border-destructive" : ""}`}>
                          <SelectValue placeholder="Choose address type" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {addressTypeOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.addressType && <p className="text-xs text-destructive">{errors.addressType.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Street Address *</Label>
                      <Input {...register('street', { required: watchShippingMethod === 'delivery' ? 'Street is required' : false })} placeholder="123 Main St" />
                      {errors.street && <p className="text-xs text-destructive">{errors.street.message as string}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>City *</Label>
                      <Input {...register('city', { required: watchShippingMethod === 'delivery' ? 'City is required' : false })} placeholder="City" />
                      {errors.city && <p className="text-xs text-destructive">{errors.city.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>State *</Label>
                      <Input {...register('state', { required: watchShippingMethod === 'delivery' ? 'State is required' : false })} placeholder="State" />
                      {errors.state && <p className="text-xs text-destructive">{errors.state.message as string}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Country *</Label>
                      <SearchSelect
                        options={countryOptions}
                        value={watch('country')}
                        onValueChange={(value) => { setValue('country', value, { shouldValidate: true }); trigger('country'); }}
                        placeholder="Select country"
                      />
                      {errors.country && <p className="text-xs text-destructive">{errors.country.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Zip/Postal Code</Label>
                      <Input {...register('zipCode')} placeholder="Zip Code" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {watchShippingMethod === 'delivery' && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Delivery Method</CardTitle>
                </CardHeader>
                <CardContent>
                  {deliveryOptions.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">Loading delivery options...</p>
                    </div>
                  ) : (
                    <RadioGroup
                      value={watchShippingOption || ""}
                      onValueChange={handleShippingOptionChange}
                      className="space-y-3"
                    >
                      {deliveryOptions.map((option: any) => (
                        <div
                          key={option.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${watchShippingOption === option.id
                            ? 'border-accent bg-accent/5 shadow-sm'
                            : 'border-gray-200 hover:border-accent/50'
                            }`}
                        >
                          <label
                            htmlFor={option.id}
                            className="flex items-start gap-3 md:gap-4 cursor-pointer w-full"
                          >
                            <div className="mt-0.5 shrink-0">
                              <RadioGroupItem
                                value={option.id}
                                id={option.id}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex items-center gap-2 mb-1">
                                  {option.icon && <div className="text-xl shrink-0">{option.icon}</div>}
                                  <div className="font-semibold cursor-pointer text-checkout-text">
                                    {option.groupCode ? `Delivery (${option.groupCode})` : option.name || "Delivery Option"}
                                  </div>
                                </div>
                                <div className="font-semibold text-checkout-text shrink-0 text-right mt-0.5">
                                  {formatPrice(option.amount, mainCcy() as any)}
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground flex flex-col gap-1 mt-1">
                                {option.estimatedTime && option.estimatedTimeType && (
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">Est. Delivery: {option.estimatedTime} {option.estimatedTimeType.toLowerCase()}{option.estimatedTime > 1 ? 's' : ''}</span>
                                  </span>
                                )}
                                {option.area && (
                                  <span className="flex items-start gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                    <span className="line-clamp-2" title={option.area}>Covers: {option.area.split(',').join(', ')}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  {!watchShippingOption && watchShippingMethod === 'delivery' && (
                    <p className="text-sm text-destructive mt-2">Please select a delivery option</p>
                  )}
                </CardContent>
              </Card>
            )}

            {watchShippingMethod === 'pickup' && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Select Pickup Store</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingPickup ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">Loading pickup locations...</p>
                    </div>
                  ) : pickupStores.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No pickup locations available in your area</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pickupStores.map((store: any) => (
                        <div
                          key={store.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${watchPickupStore === store.id
                            ? "border-accent bg-accent/5 shadow-sm"
                            : "border-gray-200 hover:border-accent/50"
                            }`}
                          onClick={() => handleStoreSelect(store)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Store className="w-4 h-4 text-accent" />
                                <h3 className="font-semibold text-checkout-text">{store.name}</h3>
                                {watchPickupStore === store.id && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-white">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p>{store.address}</p>
                                <div className="flex items-center gap-4 text-xs">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {store.distance}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {store.hours}
                                  </span>
                                </div>
                                {store.phone && (
                                  <p className="text-xs">Contact: {store.phone}</p>
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${watchPickupStore === store.id
                                  ? "border-accent bg-accent"
                                  : "border-gray-300"
                                  }`}
                              >
                                {watchPickupStore === store.id && (
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {!watchPickupStore && watchShippingMethod === 'pickup' && (
                    <p className="text-sm text-destructive mt-2">Please select a pickup store</p>
                  )}
                </CardContent>
              </Card>
            )}

          </div>
        </div>

        <div className="lg:pl-8 lg:border-l border-border">
          {/* We reuse the CartReview component, but override its internal continue button by hiding it and providing our own */}
          <div className="pointer-events-none opacity-100">
            <CartReview
              selectedShippingOption={getSelectedShippingOption()}
              shippingMethod={watchShippingMethod}
              setCurrentStep={() => { }} // Won't be called directly
              form={form as any}
              selectedStore={watchPickupStore}
              selectedAddressId={watchSelectedAddressId}
              onVatUpdate={onVatUpdate}
              onSubtotalUpdate={onSubtotalUpdate}
              onTotalUpdate={onTotalUpdate}
              hideContinueButton={true}
            />
          </div>

          <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
            <div className="flex items-start gap-3">
              <Checkbox
                id="agreeTerms"
                checked={watch('agreeTerms')}
                onCheckedChange={(checked) => setValue('agreeTerms', checked as boolean, { shouldValidate: true })}
                className="mt-1"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="agreeTerms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </label>
                <p className="text-sm text-muted-foreground">
                  You agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
            {errors.agreeTerms && (
              <p className="text-xs text-destructive mt-2 ml-7">{errors.agreeTerms.message as string}</p>
            )}
          </div>

          <Button
            className="w-full bg-accent hover:bg-accent/90 text-white mt-6 py-6 text-lg"
            onClick={handleNext}
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuestInfoForm;
