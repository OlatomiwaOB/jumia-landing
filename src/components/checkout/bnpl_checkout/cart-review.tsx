import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Tag, Eye, ShieldCheck, ArrowLeft } from "lucide-react";
import { CartItem, useCart } from "@/store/cart";
import { formatPrice, CurrencyCode } from "@/utils/helperfns";
import { CheckoutStep } from "@/app/checkout/checkoutContent";
import { UseFormReturn } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductDetailsModal from '@/utils/checkout-product-details';
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axiosCustomer from "@/utils/fetch-function-customer";
import { RefundPolicyModal } from "../refund-policy-modal";

// interface CartItem {
//   id?: number;
//   name?: string | undefined;
//   image?: string;
//   price?: number;
//   quantity: number;
//   picture?: string;
//   salePrice?: number;
//   oldPrice?: number;
//   description?: string;
//   category?: string;
//   code?: string;
//   itemSize?: string;
//   color?: string;
//   qtyInStore?: number;
//   unit?: string;
//   model?: string;
//   barCode?: string;
//   expiryDate?: string;
//   ccy?: string;
//   discount?: number;
//   vat?: number;
//   vatRate?: number;
// }

interface PickupLocation {
  id: number;
  name: string;
  status: string;
  location: string;
  distance?: number;
  timeframe?: string;
  contact?: string;
  amount: number
}

interface DeliveryOption {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
  estimatedArrival: string;
  area: string;
  groupCode: string;
  estimatedTime: number;
  estimatedTimeType: string;
  amount: number;
  deliveryVatAmount: number;
}

interface CartReviewProps {
  selectedShippingOption?: DeliveryOption | null;
  shippingMethod?: "delivery" | "pickup" | null;
  setCurrentStep: (currentStep: CheckoutStep) => void;
  form: UseFormReturn<any>;
  selectedStore?: number | null;
  selectedAddressId?: number | null;
  onVatUpdate?: (vat: number) => void;
  onSubtotalUpdate?: (subtotal: number) => void;
  onTotalUpdate?: (total: number) => void;
  hideContinueButton?: boolean;
}

export const CartReview = ({
  selectedShippingOption,
  shippingMethod = null,
  setCurrentStep,
  form,
  selectedStore,
  onVatUpdate,
  onSubtotalUpdate,
  onTotalUpdate,
  hideContinueButton = false
}: CartReviewProps) => {
  const [discountCode, setDiscountCode] = useState("");
  const { cart, getCartTotal, mainCcy, totalVat: vatTotal } = useCart();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<CartItem | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  const [isRefundPolicyOpen, setIsRefundPolicyOpen] = useState(false);


  const { getValues, watch, setValue } = form;

  const { data: pickupData } = useQuery({
    queryKey: ['pickup-locations'],
    queryFn: () => axiosCustomer.request({
      url: '/ecommerce/pickup-location/all',
      method: 'GET',
      params: {
        sourceType: 'GUEST'
      }
    }),
    enabled: shippingMethod === 'pickup',
  });

  // const activePickupLocations = pickupData?.data?.pickupLocations?.filter((location: PickupLocation) =>
  //   location?.status?.toUpperCase() === "ACTIVE"
  // ) || [];

  const isSelectedStoreActive = () => {
    if (shippingMethod !== 'pickup' || !selectedStore) return true;

    return pickupData?.data?.pickupLocations?.some((location: any) => location.id === selectedStore);
  };

  const getSelectedPickupLocation = (): PickupLocation | null => {
    if (!selectedStore) return null;
    return pickupData?.data?.pickupLocations?.find((location: PickupLocation) => location.id === selectedStore) || null;
  };

  const areSelectionsFresh = () => {
    const values = getValues();

    if (!shippingMethod) return false;

    if (shippingMethod === 'delivery') {
      const hasAddress = !!values.selectedAddressId;
      const hasShippingOption = !!values.shippingOption;

      return hasAddress && hasShippingOption;
    }

    if (shippingMethod === 'pickup') {
      const hasPickupStore = !!selectedStore;
      const hasFullName = !!values.fullName && values.fullName.trim().length > 0;

      return hasPickupStore && hasFullName;
    }

    return false;
  };

  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const values = getValues();
    // console.log('Form values changed:', {
    //   shippingMethod: values.shippingMethod,
    //   selectedAddressId: values.selectedAddressId,
    //   shippingOption: values.shippingOption,
    //   street: values.street,
    //   city: values.city,
    //   state: values.state,
    //   country: values.country,
    //   addressType: values.addressType,
    //   pickupStore: values.pickupStore
    // });
  }, [watch()]);

  useEffect(() => {
    // console.log('Shipping method changed to:', shippingMethod);
  }, [shippingMethod]);

  const totalVat = vatTotal!();

  const totalDiscountAmount = cart.reduce((total, item) => {
    if (item.oldPrice && item.salePrice && item.oldPrice > item.salePrice) {
      const itemDiscountPerUnit = item.oldPrice - item.salePrice;
      return total + (itemDiscountPerUnit * item.quantity);
    }
    return total;
  }, 0);

  const totalDiscountPercentage = cart.reduce((total, item) => {
    const discountNum = Number(item?.discount ?? 0);
    const cartTotal = getCartTotal() || 0;
    if (discountNum > 0 && cartTotal > 0) {
      const itemValue = (item.oldPrice || item.salePrice || 0) * item.quantity;
      return total + (discountNum * (itemValue / cartTotal));
    }
    return total;
  }, 0);

  const subtotal = getCartTotal();

  const selectedPickupLocation = getSelectedPickupLocation();
  const pickupAmount = selectedPickupLocation?.amount || 0;

  const shipping = shippingMethod === "delivery" && selectedShippingOption
    ? selectedShippingOption.price
    : shippingMethod === "pickup" && selectedStore
      ? pickupAmount
      : 0;

  const shippingVat = shippingMethod === "delivery" && selectedShippingOption
    ? selectedShippingOption.deliveryVatAmount || 0
    : shippingMethod === "pickup" && selectedStore
      ? 0
      : 0;

  const shippingName = shippingMethod === "delivery" && selectedShippingOption
    ? selectedShippingOption.name
    : shippingMethod === "pickup" && selectedStore
      ? `Store Pickup - ${selectedPickupLocation?.name || ''}`
      : "No shipping method";

  const total = subtotal + shipping + totalVat + shippingVat;

  const totalVatWithShippingVat = totalVat + shippingVat

  const handleApplyDiscount = () => {
    // console.log("Applying discount code:", discountCode);
  };

  const isPickupDataPresent = () => {
    const values = getValues();

    const hasPickupStore = !!values.pickupStore;
    const hasWarehouseAddressType = values.addressType === 'WAREHOUSE';
    const hasPickupName = values.fullName?.includes('Store') ||
      values.fullName?.includes('Pickup') ||
      values.fullName?.includes('Hub');

    const streetHasStore = values.street?.includes('Store') ||
      values.street?.includes('Pickup');
    const cityHasStore = values.city?.includes('Store') ||
      values.city?.includes('Pickup');

    return hasPickupStore || hasWarehouseAddressType || hasPickupName ||
      streetHasStore || cityHasStore;
  };

  const isDeliveryDataPresent = () => {
    const values = getValues();
    const hasPickupStore = !!values.pickupStore;

    if (hasPickupStore) {
      return false;
    }

    const hasShippingOption = !!values.shippingOption;
    const hasSelectedAddress = !!(values.selectedAddressId && values.selectedAddressId > 0);

    return hasShippingOption && hasSelectedAddress;
  };

  const isDeliveryAddressComplete = () => {
    const values = getValues();

    if (!values.selectedAddressId) return false;

    const hasStreet = !!values.street && values.street.trim().length > 0;
    const hasCity = !!values.city && values.city.trim().length > 0;
    const hasCountry = !!values.country && values.country.trim().length > 0;

    return hasStreet && hasCity && hasCountry;
  };

  const validateContinueButton = () => {
    if (!shippingMethod) {
      // console.log('No shipping method selected');
      return false;
    }

    const values = getValues();

    if (shippingMethod === 'delivery') {
      const hasCompleteDeliveryAddress = isDeliveryAddressComplete();
      const hasShippingOption = !!values.shippingOption;
      const hasPickupData = isPickupDataPresent();

      // console.log('Delivery validation:', {
      //   shippingMethod: 'delivery',
      //   hasCompleteDeliveryAddress,
      //   hasShippingOption,
      //   hasPickupData,
      //   selectedAddressId: values.selectedAddressId,
      //   shippingOption: values.shippingOption,
      //   street: values.street,
      //   city: values.city,
      //   country: values.country,
      //   pickupStore: values.pickupStore,
      //   addressType: values.addressType
      // });

      return hasCompleteDeliveryAddress && hasShippingOption && !hasPickupData;
    }

    if (shippingMethod === 'pickup') {
      const hasPickupStore = !!values.pickupStore;
      const hasShippingOption = !!values.shippingOption;
      const isStoreActive = isSelectedStoreActive();

      // console.log('Pickup validation:', {
      //   shippingMethod: 'pickup',
      //   hasPickupStore,
      //   hasShippingOption,
      //   isStoreActive,
      //   pickupStore: values.pickupStore,
      //   shippingOption: values.shippingOption,
      //   selectedAddressId: values.selectedAddressId
      // });

      return hasPickupStore && !hasShippingOption && isStoreActive;
    }

    return false;
  };

  const isButtonDisabled = !validateContinueButton();

  const handleContinueToPayment = () => {
    if (shippingMethod === 'pickup' && selectedStore && !isSelectedStoreActive()) {
      const selectedLocation = pickupData?.data?.pickupLocations?.find(
        (location: PickupLocation) => location.id === selectedStore
      );

      if (selectedLocation) {
        toast.error(`"${selectedLocation.name}" is currently unavailable. Please refresh and select another location.`);
      } else {
        toast.error("Selected pickup location is unavailable. Please refresh your page.");
      }
      return;
    }

    if (isButtonDisabled) {
      if (!shippingMethod) {
        toast.error("Please select a shipping method");
      } else if (shippingMethod === 'delivery') {
        const hasAddress = !!getValues("selectedAddressId");
        const hasCompleteAddress = isDeliveryAddressComplete();
        const hasOption = !!getValues("shippingOption");

        if (!hasAddress) {
          toast.error("Please select a delivery address");
        } else if (!hasCompleteAddress) {
          toast.error("Selected delivery address is incomplete. Please select a valid address.");
        } else if (!hasOption) {
          toast.error("Please select a shipping option");
        } else if (isPickupDataPresent()) {
          toast.error("Please switch to delivery mode properly by selecting a delivery address");
        }
      } else if (shippingMethod === 'pickup') {
        if (!selectedStore) {
          toast.error("Please select a pickup store");
        } else if (getValues("shippingOption")) {
          toast.error("Please switch to pickup mode properly");
        }
      }
      return;
    }

    const formValues = getValues();

    if (shippingMethod === 'delivery') {
      if (formValues.pickupStore || formValues.addressType === 'WAREHOUSE') {
        toast.error("Invalid delivery data. Please refresh and select delivery properly.");
        return;
      }

      if (!formValues.selectedAddressId || !formValues.shippingOption) {
        toast.error("Delivery address and shipping option are required");
        return;
      }

      if (!isDeliveryAddressComplete()) {
        toast.error("Selected delivery address is incomplete");
        return;
      }
    }

    if (shippingMethod === 'pickup') {
      if (formValues.shippingOption || !formValues.pickupStore) {
        toast.error("Invalid pickup data. Please refresh and select pickup properly.");
        return;
      }
    }

    // All shipping data is valid — the customer must now consent to the refund
    // policy before we commit the checkout data and move to payment.
    setIsRefundPolicyOpen(true);
  };

  const proceedToPayment = () => {
    const formValues = getValues();

    const pickupAmount = shippingMethod === 'pickup' && selectedStore
      ? getSelectedPickupLocation()?.amount || 0
      : 0;

    const shippingAmount = shippingMethod === "delivery" && selectedShippingOption
      ? selectedShippingOption.price
      : pickupAmount;

    // console.log("Continue to Payment clicked");
    // console.log("Form values:", formValues);
    // console.log("Selected shipping option:", selectedShippingOption);
    // console.log("Shipping method:", shippingMethod);
    // console.log("Selected store:", selectedStore);

    const combinedVat = totalVat + shippingVat;
    const finalTotal = subtotal + shippingAmount + combinedVat;

    const updatedCheckoutData = {
      ...checkoutData,
      subtotal: subtotal,
      shippingFee: shippingAmount,
      shippingName: shippingName,
      totalAmount: finalTotal,
      totalVat: combinedVat,
      totalDiscount: totalDiscountAmount,
      shippingMethod,
      selectedShippingOption,
      selectedStore,
      fullName: formValues.fullName
    };

    sessionStorage.setItem('checkout', JSON.stringify(updatedCheckoutData));
    if (onVatUpdate) onVatUpdate(combinedVat);
    if (onSubtotalUpdate) onSubtotalUpdate(subtotal);
    if (onTotalUpdate) onTotalUpdate(finalTotal);

    setCurrentStep('cart');
  };

  const handleRefundPolicyConfirm = () => {
    setValue('agreeTerms', true, { shouldValidate: true });
    setIsRefundPolicyOpen(false);
    proceedToPayment();
  };

  const handleProductClick = (item: CartItem) => {
    setSelectedProduct(item);
    setIsProductModalOpen(true);
  };

  const displayedItems = cart.slice(0, 3);
  const hasMoreItems = cart.length > 3;

  return (
    <div className="w-full h-fit sticky top-4">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold h-8"></h2>
      </div>
      <h2 className="text-lg font-medium text-checkout-text mb-6">Review your cart</h2>

      <div className="space-y-4 mb-6">
        {displayedItems.map((item) => {
          const itemVat = (item as any).vat || 0;
          // console.log('Item VAT:', item.name, itemVat);
          const itemTotalVat = itemVat;
          // console.log('Item Total VAT:', item.name, itemTotalVat);
          const itemDiscountAmount = item.oldPrice && item.salePrice
            ? (item.oldPrice - item.salePrice) * item.quantity
            : 0;

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-checkout-bg-subtle rounded-lg cursor-pointer hover:bg-checkout-bg-subtle/80 transition-colors"
              onClick={() => handleProductClick(item)}
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                <img
                  src={item.picture || '/placeholder.svg'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-checkout-text truncate">{item.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-checkout-text-muted">{item.quantity}x</p>
                  {(Number(item?.discount ?? 0) > 0) && (
                    <>
                      <span>•</span>
                      <div className="text-accent text-xs font-semibold inline-block">
                        {Number(item?.discount ?? 0)}% off
                        {item.quantity > 1 && (
                          <>
                            <span> each </span> <br />
                            <span> (total: {formatPrice(itemDiscountAmount, mainCcy() as any)}) </span>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end flex-shrink-0">
                <div className="text-checkout-text font-semibold">
                  {formatPrice((item?.salePrice || 0) * item.quantity, mainCcy() as any)}
                </div>
                {item.oldPrice && item.salePrice && item.oldPrice > item.salePrice && (
                  <span className="text-sm text-[#88888d] line-through">
                    {formatPrice(item.oldPrice * item.quantity, mainCcy() as any)}
                  </span>
                )}
                {itemVat > 0 && (
                  <div className="text-xs font-medium text-checkout-text-muted">
                    VAT: {formatPrice(itemTotalVat, mainCcy() as any)}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {hasMoreItems && (
          <div
            className="w-full text-center text-sm text-accent hover:text-accent/70 cursor-pointer mt-2"
            onClick={() => setIsViewAllModalOpen(true)}
          >
            View All Items ({cart.length})
          </div>
        )}
      </div>

      {/* {shippingMethod === "delivery" && selectedShippingOption && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-checkout-text font-medium">
              Shipping: {selectedShippingOption.name}
            </span>
            <span className="text-checkout-text font-semibold">
              {formatPrice(selectedShippingOption.price, mainCcy() as any)}
            </span>
          </div>
        </div>
      )} */}

      {selectedShippingOption && shippingMethod === "delivery" && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="text-checkout-text font-medium">
                Delivery: {selectedShippingOption.name}
              </span>
            </div>
            <span className="text-checkout-text font-semibold">
              {formatPrice(selectedShippingOption.price, mainCcy() as any)}
            </span>
          </div>
        </div>
      )}

      {shippingMethod === "delivery" && !selectedShippingOption && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-sm text-checkout-text font-medium">
            ⚠️ Please select a delivery address & shipping option
          </div>
        </div>
      )}

      {shippingMethod === "pickup" && selectedStore && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="text-checkout-text font-medium">
                Store Pickup: {getSelectedPickupLocation()?.name || ''}
              </span>
            </div>
            <span className="text-checkout-text font-semibold">
              {formatPrice(getSelectedPickupLocation()?.amount || 0, mainCcy() as any)}
            </span>
          </div>
        </div>
      )}

      {shippingMethod === "pickup" && !selectedStore && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-sm text-checkout-text font-medium">
            ⚠️ Please select a pickup store
          </div>
        </div>
      )}

      {shippingMethod === "pickup" && selectedStore && !isSelectedStoreActive() && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-sm text-red-600 font-medium">
            ⚠️ Selected pickup location is inactive. Please refresh page and select an active store.
          </div>
        </div>
      )}

      {!shippingMethod && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-checkout-text font-medium">
            📦 Please select a shipping method
          </div>
        </div>
      )}



      <div className="space-y-3 mb-6 p-4 bg-checkout-bg-subtle rounded-lg">
        <div className="flex justify-between text-checkout-text-muted">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal, mainCcy() as any)}</span>
        </div>

        <div className="flex justify-between text-checkout-text-muted">
          <span>Shipping</span>
          <span>
            {!shippingMethod
              ? "Select method"
              : shippingMethod === "delivery"
                ? selectedShippingOption
                  ? formatPrice(shipping, mainCcy() as any)
                  : "Select option"
                : selectedStore
                  ? formatPrice(shipping, mainCcy() as any)
                  : "Select store"
            }
          </span>
        </div>



        <div className="flex justify-between text-checkout-text-muted">
          <span>Total Discount</span>
          {totalDiscountAmount > 0 ? (
            <div className="flex flex-col items-end gap-1">
              <span className="text-green-600 font-medium">
                Saved: {formatPrice(totalDiscountAmount, mainCcy() as any)}
              </span>
              {/* <span className="text-xs text-checkout-text-muted">
                approx: ({Math.round(totalDiscountPercentage)}% off total)
              </span> */}
            </div>
          ) : (
            <span>{formatPrice(0, mainCcy() as any)}</span>
          )}
        </div>

        {/* {totalVat > 0 && (
          <div className="flex justify-between text-checkout-text-muted">
            <span>Total VAT</span>
            <span className="text-checkout-text font-medium">
              {formatPrice(totalVat, mainCcy() as any)}
            </span>
          </div>
        )} */}

        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold text-checkout-text text-lg">
            <span>Total</span>
            <span>
              {!shippingMethod
                ? "Select shipping"
                : formatPrice(total, mainCcy() as any)
              }
            </span>
          </div>
          {totalVat! > 0 && (
            <p className="text-xs text-checkout-text-muted mt-1 text-right">
              Includes {formatPrice(totalVatWithShippingVat, mainCcy() as any)} Total VAT
            </p>
          )}
        </div>

        {!hideContinueButton && (
          <>
            <Button
              type="button"
              className="w-full bg-accent md:w-full"
              onClick={handleContinueToPayment}
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Complete Shipping Info" : "Continue"}
            </Button>

            {isButtonDisabled && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                Please complete all shipping information to continue
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex items-start gap-3 p-4 bg-checkout-bg-subtle rounded-lg border border-checkout-border">
        <ShieldCheck className="w-4 h-4 text-checkout-success mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-checkout-text text-sm">
            Your Payment is Secure
          </h4>
          <p className="text-xs text-checkout-text-muted mt-1">
            We protect your payment information with industry-standard security measures.
          </p>
        </div>
      </div>

      {!hideContinueButton && (
        <RefundPolicyModal
          open={isRefundPolicyOpen}
          onOpenChange={setIsRefundPolicyOpen}
          onConfirm={handleRefundPolicyConfirm}
        />
      )}

      <ProductDetailsModal
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
        product={selectedProduct as any}
      />

      <Dialog open={isViewAllModalOpen} onOpenChange={setIsViewAllModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Cart Items ({cart.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {cart.map((item: CartItem) => {
              const itemVat = (item as any).vat || 0;
              const itemTotalVat = itemVat * item.quantity;
              const itemDiscountAmount = item.oldPrice && item.salePrice
                ? (item.oldPrice - item.salePrice) * item.quantity
                : 0;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-checkout-bg-subtle rounded-lg cursor-pointer hover:bg-checkout-bg-subtle/80 transition-colors"
                  onClick={() => {
                    handleProductClick(item);
                    setIsViewAllModalOpen(false);
                  }}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    <img
                      src={item.picture || '/placeholder.svg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-checkout-text truncate">{item.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-checkout-text-muted">{item.quantity}x</p>
                      {(Number(item?.discount ?? 0) > 0) && (
                        <>
                          <span>•</span>
                          <div className="text-accent text-xs font-semibold inline-block">
                            {Number(item?.discount ?? 0)}% off
                            {item.quantity > 1 && (
                              <>
                                <span> each </span> <br />
                                <span> (total: {formatPrice(itemDiscountAmount, mainCcy() as any)}) </span>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <div className="text-checkout-text font-semibold">
                      {formatPrice((item?.salePrice || 0) * item.quantity, mainCcy() as any)}
                    </div>
                    {item.oldPrice && item.salePrice && item.oldPrice > item.salePrice && (
                      <span className="text-sm text-[#88888d] line-through">
                        {formatPrice(item.oldPrice * item.quantity, mainCcy() as any)}
                      </span>
                    )}
                    {itemVat > 0 && (
                      <div className="text-xs text-checkout-text-muted">
                        VAT: {formatPrice(itemTotalVat, mainCcy() as any)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};