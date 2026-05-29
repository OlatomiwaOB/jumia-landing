import React from 'react'
import { ShippingForm } from './shipping-form'
import { CartSidebar } from './cart-sidebar'
import { CheckoutStep, FormData } from './checkout-content'
import { UseFormReturn } from 'react-hook-form'
import useDeliveryOptions from '@/app/hooks/useDeliveryOptions'

interface CheckoutManagerProps {
  setCurrentStep: (currentStep: CheckoutStep) => void;
  form: UseFormReturn<FormData>;
  onShippingUpdate?: (shippingCost: number) => void;
  onVatUpdate?: (vat: number) => void;
  onSubtotalUpdate?: (subtotal: number) => void;
  onTotalUpdate?: (total: number) => void;
}

const CheckoutManager = ({
  setCurrentStep,
  form,
  onShippingUpdate,
  onVatUpdate,
  onSubtotalUpdate,
  onTotalUpdate,
}: CheckoutManagerProps) => {
  const { watch } = form;

  const watchShippingMethod   = watch('shippingMethod');
  const watchShippingOption   = watch('shippingOption');
  const watchPickupStore      = watch('pickupStore');
  const watchSelectedAddressId = watch('selectedAddressId');

  const { deliveryOptions } = useDeliveryOptions();

  const getSelectedShippingOption = () => {
    if (watchShippingMethod !== 'delivery' || !watchShippingOption) return null;
    const opt = deliveryOptions.find((o: any) => o.id === watchShippingOption);
    if (!opt) return null;
    return {
      id: opt.id, name: opt.name, price: opt.price,
      description: opt.description, icon: opt.icon,
      estimatedArrival: opt.estimatedArrival, area: opt.area,
      groupCode: opt.groupCode, estimatedTime: opt.estimatedTime,
      estimatedTimeType: opt.estimatedTimeType, amount: opt.amount,
      deliveryVatAmount: opt.deliveryVatAmount,
    };
  };

  const selectedShippingOption = getSelectedShippingOption();

  return (
    <div className="w-full bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 w-full lg:w-6/10 min-w-0">
            <ShippingForm
              setCurrentStep={setCurrentStep}
              form={form}
              onShippingUpdate={onShippingUpdate}
            />
          </div>

          <div className="w-full lg:w-4/10 shrink-0">
            <CartSidebar
              selectedShippingOption={selectedShippingOption}
              shippingMethod={watchShippingMethod}
              setCurrentStep={setCurrentStep}
              form={form}
              selectedStore={watchPickupStore}
              selectedAddressId={watchSelectedAddressId}
              onVatUpdate={onVatUpdate}
              onSubtotalUpdate={onSubtotalUpdate}
              onTotalUpdate={onTotalUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutManager;