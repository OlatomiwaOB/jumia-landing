// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Truck, MapPin, ArrowLeft, Clock, Plus, Store, Edit } from "lucide-react";
// import { toast } from "sonner";
// import { CheckoutStep, FormData } from "@/app/checkout/checkoutContent";
// import axiosInstance from "@/utils/fetch-function";
// import useCustomer from "@/store/customerStore";
// import { useCart } from "@/store/cart";
// import { useLocationStore } from "@/store/locationStore";
// import { formatPrice } from "@/utils/helperfns";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useGetDeliveryAddress } from "@/app/hooks/useGetDeliveryAddress";
// import AddDeliveryAddress from "../add-delivery-address";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Badge } from "@/components/ui/badge";
// import useGetLookup from "@/app/hooks/useGetLookup";
// import useShippingOptions from '@/app/hooks/useShippingOptions';
// import { useQuery } from "@tanstack/react-query";
// import axiosCustomer from "@/utils/fetch-function-customer";

// interface ShippingFormProps {
//   setCurrentStep: (currentStep: CheckoutStep) => void;
//   form: UseFormReturn<FormData>;
//   onShippingUpdate?: (shippingCost: number) => void;
// }

// export const ShippingForm = ({ setCurrentStep, form, onShippingUpdate }: ShippingFormProps) => {
//   const { customer } = useCustomer();
//   const { cart, getCartTotal, mainCcy } = useCart();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { location } = useLocationStore();
//   const { back } = useRouter();
//   const [editingAddress, setEditingAddress] = useState<any | null>(null);
//   const router = useRouter();

//   const {
//     setValue,
//     watch,
//     getValues,
//   } = form;

//   const addressTypeOptions = useGetLookup('ADDRESS_TYPE');
//   const { deliveryAddress } = useGetDeliveryAddress();

//   const { shippingOptions, isLoading: isLoadingShippingOptions } = useShippingOptions();

//   const shippingMethod = watch("shippingMethod");
//   const selectedShippingOption = watch("shippingOption");
//   const selectedAddressId = watch("selectedAddressId");
//   const selectedStore = watch("pickupStore");

//   const { data: pickupData, isLoading: isLoadingPickup, error: pickupError } = useQuery({
//     queryKey: ['pickup-locations'],
//     queryFn: () => axiosCustomer.request({
//       url: '/ecommerce/pickup-location/all',
//       method: 'GET'
//     }),
//     enabled: shippingMethod === 'pickup',
//   });

//   const activePickupLocations = pickupData?.data?.pickupLocations.filter((method: any) =>
//     method?.status?.toUpperCase() === "ACTIVE"
//   ) || [];

//   const pickupStores = activePickupLocations.map((location: any) => ({
//     id: location.id,
//     name: location.name,
//     address: location.location || '',
//     distance: `${location.distance || 0} miles`,
//     hours: location.timeframe || '9:00 AM - 5:00 PM',
//     phone: location.contact || '',
//     street: location.location?.split(',')[0] || '',
//     postCode: '',
//     state: '',
//     country: customer?.country || 'NG',
//     landmark: '',
//     city: location.location?.split(',')[1]?.trim() || ''
//   })) || [];

//   useEffect(() => {
//     setValue("shippingMethod", undefined);
//     setValue("pickupStore", null);
//     setValue("selectedAddressId", null);
//     setValue("shippingOption", null);
//     setValue("fullName", "");
//     setValue("street", "");
//     setValue("landmark", "");
//     setValue("zipCode", "");
//     setValue("city", "");
//     setValue("state", "");
//     setValue("country", "");
//     setValue("addressType", "");

//     sessionStorage.removeItem('checkoutFormData');

//     console.log('ShippingForm: Reset all form fields');
//   }, [setValue]);

//   useEffect(() => {
//     if (shippingMethod === 'pickup') {
//       onShippingUpdate?.(0);
//     } else if (shippingMethod === 'delivery' && selectedShippingOption) {
//       const selectedOption = shippingOptions.find(opt => opt.id === selectedShippingOption);
//       onShippingUpdate?.(selectedOption?.price || 0);
//     } else {
//       onShippingUpdate?.(0);
//     }
//   }, [shippingMethod, selectedShippingOption, shippingOptions]);

//   const handleShippingMethodChange = (method: "delivery" | "pickup") => {
//     if (method === 'delivery') {
//       setValue("pickupStore", null);
//       setValue("fullName", "");
//       setValue("street", "");
//       setValue("landmark", "");
//       setValue("zipCode", "");
//       setValue("city", "");
//       setValue("state", "");
//       setValue("country", "");
//       setValue("addressType", "");
//     } else if (method === 'pickup') {
//       setValue("shippingOption", null);
//       setValue("selectedAddressId", null);
//       setValue("street", "");
//       setValue("landmark", "");
//       setValue("zipCode", "");
//       setValue("city", "");
//       setValue("state", "");
//       setValue("country", "");
//       setValue("addressType", "");
//       setValue("fullName", "");
//     }
//     setValue("shippingMethod", method);

//     console.log(`Switched to ${method} mode, cleared all related fields`);
//   };

//   const handleShippingOptionChange = (optionId: string) => {
//     setValue("shippingOption", optionId);
//   };

//   const handleAddressSelect = (address: any) => {
//     setValue("pickupStore", null);
//     setValue("addressType", address.addressType);
//     setValue("selectedAddressId", address.id);
//     setValue("street", address.street || '');
//     setValue("landmark", address.landmark || "");
//     setValue("zipCode", address.postCode || "");
//     setValue("city", address.city || "");
//     setValue("state", address.state || "");
//     setValue("country", address.country || "");

//     console.log('Delivery address selected:', {
//       id: address.id,
//       street: address.street,
//       city: address.city,
//       state: address.state,
//       country: address.country,
//       postCode: address.postCode
//     });
//   };

//   const handleStoreSelect = (store: any) => {
//     setValue("pickupStore", store.id);
//     setValue("selectedAddressId", store.id);
//     setValue('country', store.country || customer?.country || '');
//     setValue('addressType', 'WAREHOUSE');
//     setValue('landmark', store.landmark || '');
//     setValue('street', store.street || store.address || '');
//     setValue('city', store.city || '');
//     setValue('state', store.state || store.city || '');
//     setValue('zipCode', store.postCode || '');
//     setValue('fullName', store.name);

//     console.log('Pickup store selected:', {
//       id: store.id,
//       name: store.name,
//       address: store.address,
//       fullNameSet: store.name
//     });
//   };

//   const fetchAddressById = async (id: number) => {
//     try {
//       const response = await axiosInstance.get(`/ecommerce/get-delivery-address?id=${id}`);
//       if (response.data.deliveryAddress) {
//         return response.data.deliveryAddress;
//       }
//     } catch (error) {
//       toast.error('Failed to fetch address details');
//     }
//     return null;
//   };

//   const handleEditAddress = async (address: any, e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const addressDetails = await fetchAddressById(address.id);
//     if (addressDetails) {
//       setEditingAddress(addressDetails);
//       setIsModalOpen(true);
//     }
//   };

//   const handleAddNewAddress = () => {
//     setEditingAddress(null);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingAddress(null);
//   };

//   const handleAddressSaved = () => {
//     handleCloseModal();
//   };

//   return (
//     <>
//       <div className="w-full">
//         <div className="flex items-center gap-2 mb-4">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => {
//               router?.push(`/`);
//             }}
//             className="bg-accent/15 hover:bg-accent/50 hover:text-white"
//           >
//             <ArrowLeft className="w-4 h-4" />
//           </Button>
//           <h2 className="text-2xl font-bold"></h2>
//         </div>

//         <form>
//           <div className="mb-8">
//             <h2 className="text-lg font-medium text-checkout-text mb-4">Shipping Information</h2>

//             <div className="flex gap-4 mb-6">
//               <Button
//                 type="button"
//                 className={`flex-1 justify-start gap-3 h-12 ${shippingMethod === 'delivery' ? 'bg-accent/5 border-accent border text-accent' : 'bg-white border text-black'} hover:bg-accent/10`}
//                 onClick={() => handleShippingMethodChange("delivery")}
//               >
//                 <Truck className="w-4 h-4" />
//                 Delivery
//               </Button>
//               <Button
//                 type="button"
//                 className={`flex-1 justify-start gap-3 h-12 ${shippingMethod === 'pickup' ? 'bg-accent/5 border-accent border text-accent' : "bg-white border text-black"} hover:bg-accent/10`}
//                 onClick={() => handleShippingMethodChange("pickup")}
//               >
//                 <MapPin className="w-4 h-4" />
//                 Pick up
//               </Button>
//             </div>

//             {shippingMethod === 'delivery' && (
//               <>
//                 <Card className="mb-6">
//                   <CardHeader>
//                     <CardTitle className="text-lg">Delivery Information</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {deliveryAddress.length === 0 ? (
//                       <div className="border-2 border-dashed border-accent rounded-md p-4 bg-accent/5 hover:bg-accent/10 cursor-pointer">
//                         <Button
//                           type="button"
//                           className="w-full bg-transparent h-full flex flex-col items-center justify-center text-center py-10 hover:bg-accent/10"
//                           onClick={handleAddNewAddress}
//                         >
//                           <div className="flex items-center justify-center rounded-full border-2 border-dashed bg-white border-border w-16 h-16 mb-4">
//                             <Plus className="w-7 h-7 text-muted-foreground" />
//                           </div>
//                           <h3 className="text-lg font-medium mb-2 text-muted-foreground">Add New Address</h3>
//                         </Button>
//                       </div>
//                     ) : (
//                       <div className="space-y-4">
//                         {deliveryAddress.map((address: any) => (
//                           <div
//                             key={address.id}
//                             className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === address.id
//                               ? "border-accent bg-accent/5 shadow-sm"
//                               : "border-gray-200 hover:border-accent/50"
//                               }`}
//                             onClick={() => handleAddressSelect(address)}
//                           >
//                             <div className="flex items-start justify-between">
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-2 mb-2">
//                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
//                                     {address.addressType}
//                                   </span>
//                                   {selectedAddressId === address.id && (
//                                     <span className="text-xs text-accent font-medium">✓ Selected</span>
//                                   )}
//                                 </div>

//                                 <div className="space-y-1 text-sm">
//                                   <p className="font-medium text-checkout-text">{address.street}</p>
//                                   {address.landmark && (
//                                     <p className="text-muted-foreground">Landmark: {address.landmark}</p>
//                                   )}
//                                   <p className="text-muted-foreground">
//                                     {[address.city, address.state, address.postCode]
//                                       .filter(Boolean)
//                                       .join(", ")}
//                                   </p>
//                                   <p className="text-muted-foreground font-medium">{address.country}</p>
//                                 </div>
//                               </div>

//                               <div className="flex items-center gap-2">
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={(e) => handleEditAddress(address, e)}
//                                   className="h-8 w-8 p-0"
//                                 >
//                                   <Edit className="w-3 h-3" />
//                                 </Button>
//                                 <div className="ml-2">
//                                   <div
//                                     className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddressId === address.id
//                                       ? "border-accent bg-accent"
//                                       : "border-gray-300"
//                                       }`}
//                                   >
//                                     {selectedAddressId === address.id && (
//                                       <div className="w-2 h-2 bg-white rounded-full" />
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}

//                         <Button
//                           type="button"
//                           variant="outline"
//                           className="w-full border-dashed border-accent text-accent hover:bg-accent/10"
//                           onClick={handleAddNewAddress}
//                         >
//                           <Plus className="w-4 h-4 mr-2" />
//                           Add Another Address
//                         </Button>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 <Card className="mb-6">
//                   <CardHeader>
//                     <CardTitle className="text-lg">Shipping Method</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {shippingOptions.length === 0 ? (
//                       <div className="text-center py-8">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
//                         <p className="text-sm text-muted-foreground mt-2">Loading shipping options...</p>
//                       </div>
//                     ) : (
//                       <>
//                         <RadioGroup
//                           value={selectedShippingOption || ""}
//                           onValueChange={handleShippingOptionChange}
//                           className="space-y-3"
//                         >
//                           {shippingOptions.map((option: any) => (
//                             <div
//                               key={option.id}
//                               className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedShippingOption === option.id
//                                 ? 'border-accent bg-accent/5 shadow-sm'
//                                 : 'border-gray-200 hover:border-accent/50'
//                                 }`}
//                             >
//                               <label
//                                 htmlFor={option.id}
//                                 className="flex items-center gap-4 cursor-pointer"
//                               >
//                                 <RadioGroupItem
//                                   value={option.id}
//                                   id={option.id}
//                                   onClick={(e) => e.stopPropagation()}
//                                 />
//                                 <div className="text-2xl">{option.icon}</div>
//                                 <div className="flex-1">
//                                   <span className="font-semibold cursor-pointer text-checkout-text">
//                                     {option.name}
//                                   </span>
//                                   <p className="text-sm text-muted-foreground">{option.description}</p>
//                                 </div>
//                                 <div className="text-right">
//                                   <p className="font-semibold text-checkout-text">{formatPrice(option.price, mainCcy() as any)}</p>
//                                 </div>
//                               </label>
//                             </div>
//                           ))}
//                         </RadioGroup>
//                         {!selectedShippingOption && (
//                           <p className="text-sm text-muted-foreground mt-2">Please select a shipping option</p>
//                         )}
//                       </>
//                     )}
//                   </CardContent>
//                 </Card>
//               </>
//             )}

//             {shippingMethod === 'pickup' && (
//               <Card className="mb-6">
//                 <CardHeader>
//                   <CardTitle className="text-lg">Pickup Locations</CardTitle>
//                   <p className="text-sm text-muted-foreground">Select a store near you for pickup</p>
//                 </CardHeader>
//                 <CardContent>
//                   {isLoadingPickup ? (
//                     <div className="text-center py-8">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
//                       <p className="text-sm text-muted-foreground mt-2">Loading pickup locations...</p>
//                     </div>
//                   ) : pickupError ? (
//                     <div className="text-center py-8">
//                       <p className="text-red-500">Failed to load pickup locations</p>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => window.location.reload()}
//                         className="mt-2"
//                       >
//                         Retry
//                       </Button>
//                     </div>
//                   ) : pickupStores.length === 0 ? (
//                     <div className="text-center py-8 text-muted-foreground">
//                       <p>No pickup locations available in your area</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {pickupStores.map((store: any) => (
//                         <div
//                           key={store.id}
//                           className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedStore === store.id
//                             ? "border-accent bg-accent/5 shadow-sm"
//                             : "border-gray-200 hover:border-accent/50"
//                             }`}
//                           onClick={() => handleStoreSelect(store)}
//                         >
//                           <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                               <div className="flex items-center gap-2 mb-2">
//                                 <Store className="w-4 h-4 text-accent" />
//                                 <h3 className="font-semibold text-checkout-text">{store.name}</h3>
//                                 {selectedStore === store.id && (
//                                   <Badge variant="secondary" className="bg-accent text-white text-xs">
//                                     Selected
//                                   </Badge>
//                                 )}
//                               </div>

//                               <div className="space-y-1 text-sm text-muted-foreground">
//                                 <p>{store.address}</p>
//                                 <div className="flex items-center gap-4 text-xs">
//                                   <span className="flex items-center gap-1">
//                                     <MapPin className="w-3 h-3" />
//                                     {store.distance}
//                                   </span>
//                                   <span className="flex items-center gap-1">
//                                     <Clock className="w-3 h-3" />
//                                     {store.hours}
//                                   </span>
//                                 </div>
//                                 {store.phone && (
//                                   <p className="text-xs">Contact: {store.phone}</p>
//                                 )}
//                               </div>
//                             </div>

//                             <div className="ml-4">
//                               <div
//                                 className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedStore === store.id
//                                   ? "border-accent bg-accent"
//                                   : "border-gray-300"
//                                   }`}
//                               >
//                                 {selectedStore === store.id && (
//                                   <div className="w-2 h-2 bg-white rounded-full" />
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                   {!selectedStore && (
//                     <p className="text-sm text-muted-foreground mt-2">Please select a pickup store</p>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {!shippingMethod && (
//               <div className="text-center py-8 text-muted-foreground">
//                 <p>Please select a shipping method above</p>
//               </div>
//             )}
//           </div>
//         </form>
//       </div>

//       <AddDeliveryAddress
//         isOpen={isModalOpen}
//         setIsOpen={handleCloseModal}
//         editingAddress={editingAddress}
//         onAddressSaved={handleAddressSaved}
//       />
//     </>
//   );
// };


import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, ArrowLeft, Clock, Plus, Store, Edit } from "lucide-react";
import { toast } from "sonner";
import { CheckoutStep, FormData } from "@/app/checkout/checkoutContent";
import axiosInstance from "@/utils/fetch-function";
import useCustomer from "@/store/customerStore";
import { useCart } from "@/store/cart";
import { useLocationStore } from "@/store/locationStore";
import { formatPrice } from "@/utils/helperfns";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDeliveryAddress } from "@/app/hooks/useGetDeliveryAddress";
import AddDeliveryAddress from "../add-delivery-address";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import useDeliveryOptions from '@/app/hooks/useDeliveryOptions';
import { useQuery } from "@tanstack/react-query";
import axiosCustomer from "@/utils/fetch-function-customer";
import { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface ShippingFormProps {
  setCurrentStep: (currentStep: CheckoutStep) => void;
  form: UseFormReturn<FormData>;
  onShippingUpdate?: (shippingCost: number) => void;
}

export const ShippingForm = ({ setCurrentStep, form, onShippingUpdate }: ShippingFormProps) => {
  const { customer } = useCustomer();
  const { cart, getCartTotal, mainCcy, getVariantCartWeight } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { location } = useLocationStore();
  const { back } = useRouter();
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const router = useRouter();

  const {
    setValue,
    watch,
    getValues,
  } = form;

  const { deliveryAddress } = useGetDeliveryAddress();

  const shippingMethod = watch("shippingMethod");
  const selectedShippingOption = watch("shippingOption");
  const selectedAddressId = watch("selectedAddressId");
  const selectedStore = watch("pickupStore");

  // Only variant items with a configured weight contribute to totalWeight.
  // If the result is 0 (no variant items), the hook omits totalWeight from the API call.
  const variantWeight = getVariantCartWeight();
  const { deliveryOptions, isLoading: isLoadingDeliveryOptions } = useDeliveryOptions(undefined, variantWeight || undefined);

  const { data: pickupData, isLoading: isLoadingPickup, error: pickupError } = useQuery({
    queryKey: ['pickup-locations'],
    queryFn: () => axiosCustomer.request({
      url: '/ecommerce/pickup-location/all',
      method: 'GET'
    }),
    enabled: shippingMethod === 'pickup',
  });

  // const activePickupLocations = pickupData?.data?.pickupLocations.filter((method: any) =>
  //   method?.status?.toUpperCase() === "ACTIVE"
  // ) || [];

  const pickupStores = pickupData?.data?.pickupLocations?.map((location: any) => ({
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
    country: customer?.country || 'NG',
    landmark: '',
    city: location.location?.split(',')[1]?.trim() || ''
  })) || [];

  useEffect(() => {
    setValue("shippingMethod", undefined);
    setValue("pickupStore", undefined);
    setValue("selectedAddressId", undefined);
    setValue("shippingOption", undefined);
    setValue("fullName", "");
    setValue("street", "");
    setValue("landmark", "");
    setValue("zipCode", "");
    setValue("city", "");
    setValue("state", "");
    setValue("country", "");
    setValue("addressType", "");

    sessionStorage.removeItem('checkoutFormData');

    // console.log('ShippingForm: Reset all form fields');
  }, [setValue]);

  useEffect(() => {
    let shippingAmount = 0;

    if (shippingMethod === 'pickup' && selectedStore) {
      const selectedPickupLocation = pickupStores.find((loc: any) => loc.id === selectedStore);
      shippingAmount = selectedPickupLocation?.amount || 0;
      setValue("deliveryOptionGroup", "");
    } else if (shippingMethod === 'delivery' && selectedShippingOption) {
      const selectedOption = deliveryOptions?.find((opt: any) => opt.id === selectedShippingOption);
      shippingAmount = selectedOption?.price || 0;
      setValue("deliveryOptionGroup", selectedOption?.groupCode || "");
    }

    onShippingUpdate?.(shippingAmount);
  }, [shippingMethod, selectedShippingOption, selectedStore, deliveryOptions, setValue, onShippingUpdate]);

  const handleShippingMethodChange = (method: "delivery" | "pickup") => {
    if (method === 'delivery') {
      setValue("pickupStore", undefined);
      setValue("fullName", "");
      setValue("street", "");
      setValue("landmark", "");
      setValue("zipCode", "");
      setValue("city", "");
      setValue("state", "");
      setValue("country", "");
      setValue("addressType", "");
    } else if (method === 'pickup') {
      setValue("shippingOption", undefined);
      setValue("selectedAddressId", undefined);
      setValue("street", "");
      setValue("landmark", "");
      setValue("zipCode", "");
      setValue("city", "");
      setValue("state", "");
      setValue("country", "");
      setValue("addressType", "");
      setValue("fullName", "");
    }
    setValue("shippingMethod", method);

    // console.log(`Switched to ${method} mode, cleared all related fields`);
  };

  const handleDeliveryOptionSelect = (optionId: string) => {
    setValue("shippingOption", optionId);
    const selectedOpt = deliveryOptions?.find((opt: any) => opt.id === optionId);
    if (selectedOpt) {
      setValue("deliveryOptionGroup", selectedOpt.groupCode);
      // Persist shippingName for order payload
      try {
        const stored = sessionStorage.getItem('checkout');
        const parsedData = stored ? JSON.parse(stored) : {};
        sessionStorage.setItem('checkout', JSON.stringify({ ...parsedData, shippingName: selectedOpt.name }));
      } catch { }
    }
  };

  const handleAddressSelect = (address: any) => {
    setValue("pickupStore", undefined);
    setValue("addressType", address.addressType);
    setValue("selectedAddressId", address.id);
    setValue("street", address.street || '');
    setValue("landmark", address.landmark || "");
    setValue("zipCode", address.postCode || "");
    setValue("city", address.city || "");
    setValue("state", address.state || "");
    setValue("country", address.country || "");

    // console.log('Delivery address selected:', {
    //   id: address.id,
    //   street: address.street,
    //   city: address.city,
    //   state: address.state,
    //   country: address.country,
    //   postCode: address.postCode
    // });
  };

  const handleStoreSelect = (store: any) => {
    setValue("pickupStore", store.id);
    setValue("selectedAddressId", store.id);
    setValue('country', store.country || customer?.country || '');
    setValue('addressType', 'WAREHOUSE');
    setValue('landmark', store.landmark || '');
    setValue('street', store.street || store.address || '');
    setValue('city', store.city || '');
    setValue('state', store.state || store.city || '');
    setValue('zipCode', store.postCode || '');
    setValue('fullName', store.name);

    // console.log('Pickup store selected:', {
    //   id: store.id,
    //   name: store.name,
    //   address: store.address,
    //   fullNameSet: store.name
    // });
  };

  const fetchAddressById = async (id: number) => {
    try {
      const response = await axiosInstance.get(`/ecommerce/get-delivery-address?id=${id}`);
      if (response.data.deliveryAddress) {
        return response.data.deliveryAddress;
      }
    } catch (error) {
      toast.error('Failed to fetch address details');
    }
    return null;
  };

  const handleEditAddress = async (address: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const addressDetails = await fetchAddressById(address.id);
    if (addressDetails) {
      setEditingAddress(addressDetails);
      setIsModalOpen(true);
    }
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleAddressSaved = () => {
    handleCloseModal();
  };

  return (
    <>
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              router?.push(`/`);
            }}
            className="bg-accent/15 hover:bg-accent/50 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold"></h2>
        </div>

        <Form {...form}>
          <form>
            <div className="mb-8">
              <h2 className="text-lg font-medium text-checkout-text mb-4">Shipping Information</h2>

              <div className="flex gap-4 mb-6">
                <Button
                  type="button"
                  className={`flex-1 justify-start gap-3 h-12 ${shippingMethod === 'delivery' ? 'bg-accent/5 border-accent border text-accent' : 'bg-white border text-black'} hover:bg-accent/10`}
                  onClick={() => handleShippingMethodChange("delivery")}
                >
                  <Truck className="w-4 h-4" />
                  Delivery
                </Button>
                <Button
                  type="button"
                  className={`flex-1 justify-start gap-3 h-12 ${shippingMethod === 'pickup' ? 'bg-accent/5 border-accent border text-accent' : "bg-white border text-black"} hover:bg-accent/10`}
                  onClick={() => handleShippingMethodChange("pickup")}
                >
                  <MapPin className="w-4 h-4" />
                  Pick up
                </Button>
              </div>

              {shippingMethod === 'delivery' && (
                <>
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Delivery Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {deliveryAddress.length === 0 ? (
                        <div className="border-2 border-dashed border-accent rounded-md p-4 bg-accent/5 hover:bg-accent/10 cursor-pointer">
                          <Button
                            type="button"
                            className="w-full bg-transparent h-full flex flex-col items-center justify-center text-center py-10 hover:bg-accent/10"
                            onClick={handleAddNewAddress}
                          >
                            <div className="flex items-center justify-center rounded-full border-2 border-dashed bg-white border-border w-16 h-16 mb-4">
                              <Plus className="w-7 h-7 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-2 text-muted-foreground">Add New Address</h3>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {deliveryAddress.map((address: any) => (
                            <div
                              key={address.id}
                              className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === address.id
                                ? "border-accent bg-accent/5 shadow-sm"
                                : "border-gray-200 hover:border-accent/50"
                                }`}
                              onClick={() => handleAddressSelect(address)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                                      {address.addressType}
                                    </span>
                                    {selectedAddressId === address.id && (
                                      <span className="text-xs text-accent font-medium">✓ Selected</span>
                                    )}
                                  </div>

                                  <div className="space-y-1 text-sm">
                                    <p className="font-medium text-checkout-text">{address.street}</p>
                                    {address.landmark && (
                                      <p className="text-muted-foreground">Landmark: {address.landmark}</p>
                                    )}
                                    <p className="text-muted-foreground">
                                      {[address.city, address.state, address.postCode]
                                        .filter(Boolean)
                                        .join(", ")}
                                    </p>
                                    <p className="text-muted-foreground font-medium">{address.country}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleEditAddress(address, e)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <div className="ml-2">
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddressId === address.id
                                        ? "border-accent bg-accent"
                                        : "border-gray-300"
                                        }`}
                                    >
                                      {selectedAddressId === address.id && (
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-dashed border-accent text-accent hover:bg-accent/10"
                            onClick={handleAddNewAddress}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Another Address
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Delivery Options</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingDeliveryOptions ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                          <p className="text-sm text-muted-foreground mt-2">Loading delivery options...</p>
                        </div>
                      ) : deliveryOptions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No delivery options available</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {deliveryOptions.map((option: any) => (
                            <div
                              key={option.id}
                              onClick={() => handleDeliveryOptionSelect(option.id)}
                              className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedShippingOption === option.id
                                ? 'border-accent bg-accent/5 shadow-sm'
                                : 'border-gray-200 hover:border-accent/50'
                                }`}
                            >
                              <div className="flex items-start gap-4 cursor-pointer">
                                <div className={`mt-1 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedShippingOption === option.id ? 'border-accent' : 'border-gray-300'}`}>
                                  {selectedShippingOption === option.id && <div className="w-2 h-2 rounded-full bg-accent" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="text-xl shrink-0">{option.icon}</div>
                                      <span className="font-semibold cursor-pointer text-checkout-text">
                                        {option.name}
                                      </span>
                                      {option.description && (
                                        <span className="text-xs text-muted-foreground">({option.description})</span>
                                      )}
                                    </div>
                                    <p className="font-semibold text-checkout-text shrink-0 mt-0.5 text-right">{formatPrice(option.price, mainCcy() as any)}</p>
                                  </div>
                                  <div className="text-sm text-muted-foreground flex flex-col gap-1 mt-1">
                                    <span className="flex items-center gap-1.5">
                                      <Clock className="w-4 h-4 shrink-0" />
                                      <span className="truncate">{option.estimatedArrival}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {!selectedShippingOption && deliveryOptions.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-2">Please select a delivery option</p>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}


              {shippingMethod === 'pickup' && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Pickup Locations</CardTitle>
                    <p className="text-sm text-muted-foreground">Select a store near you for pickup</p>
                  </CardHeader>
                  <CardContent>
                    {isLoadingPickup ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                        <p className="text-sm text-muted-foreground mt-2">Loading pickup locations...</p>
                      </div>
                    ) : pickupError ? (
                      <div className="text-center py-8">
                        <p className="text-red-500">Failed to load pickup locations</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.reload()}
                          className="mt-2"
                        >
                          Retry
                        </Button>
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
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedStore === store.id
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
                                  {selectedStore === store.id && (
                                    <Badge variant="secondary" className="bg-accent text-white text-xs">
                                      Selected
                                    </Badge>
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
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedStore === store.id
                                    ? "border-accent bg-accent"
                                    : "border-gray-300"
                                    }`}
                                >
                                  {selectedStore === store.id && (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  )}

                                </div>

                              </div>

                            </div>
                            <div>
                              <div className="text-right">
                                <p className={`font-semibold text-checkout-text ${selectedStore === store.id
                                  ? "text-accent"
                                  : ""
                                  }`}
                                >
                                  {formatPrice(store.amount || 0, mainCcy() as any)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {!selectedStore && (
                      <p className="text-sm text-muted-foreground mt-2">Please select a pickup store</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {!shippingMethod && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Please select a shipping method above</p>
                </div>
              )}

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="mt-6 mb-4">
                    <FormLabel>Order Note (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any special instructions for your order..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>

      <AddDeliveryAddress
        isOpen={isModalOpen}
        setIsOpen={handleCloseModal}
        editingAddress={editingAddress}
        onAddressSaved={handleAddressSaved}
      />
    </>
  );
};