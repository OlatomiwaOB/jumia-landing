// import React, { useEffect } from 'react'
// import { ShippingForm } from './shipping-form'
// import { CartReview } from './cart-review'
// import { CheckoutStep, FormData } from '@/app/checkout/checkoutContent'
// import { UseFormReturn } from 'react-hook-form'
// import useShippingOptions from '@/app/hooks/useShippingOptions';

// interface BnplManagerProps {
//   setCurrentStep: (currentStep: CheckoutStep) => void;
//   form: UseFormReturn<FormData>;
//   onShippingUpdate?: (shippingCost: number) => void;
//   onVatUpdate?: (vat: number) => void;
//   onSubtotalUpdate?: (subtotal: number) => void;
//   onTotalUpdate?: (total: number) => void;
// }

// const BnplManager = ({ setCurrentStep, form, onShippingUpdate, onVatUpdate, onSubtotalUpdate, onTotalUpdate }: BnplManagerProps) => {
//   const { watch } = form;

//   const watchShippingMethod = watch("shippingMethod");
//   const watchShippingOption = watch("shippingOption");
//   const watchPickupStore = watch("pickupStore");
//   const watchSelectedAddressId = watch("selectedAddressId");

//   const { shippingOptions } = useShippingOptions();

//   const getSelectedShippingOption = () => {
//     if (watchShippingMethod !== 'delivery' || !watchShippingOption) {
//       return null;
//     }

//     const selectedOption = shippingOptions.find((option: any) => option.id === watchShippingOption);

//     if (!selectedOption) return null;

//     return {
//       id: selectedOption.id,
//       name: selectedOption.name,
//       price: selectedOption.price,
//       description: selectedOption.description,
//       icon: selectedOption.icon
//     };
//   };

//   const selectedShippingOption = getSelectedShippingOption();

//   return (
//     <div className="min-h-screen w-full bg-[#f7f7f7] py-1">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
//           <div className="lg:pr-8">
//             <ShippingForm
//               setCurrentStep={setCurrentStep}
//               form={form}
//               onShippingUpdate={onShippingUpdate}
//             />
//           </div>

//           <div className="lg:pl-8 lg:border-l border-border">
//             <CartReview
//               selectedShippingOption={selectedShippingOption}
//               shippingMethod={watchShippingMethod}
//               setCurrentStep={setCurrentStep}
//               form={form}
//               selectedStore={watchPickupStore}
//               selectedAddressId={watchSelectedAddressId}
//               onVatUpdate={onVatUpdate}
//               onSubtotalUpdate={onSubtotalUpdate}
//               onTotalUpdate={onTotalUpdate}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default BnplManager

import React, { useEffect } from 'react'
import { ShippingForm } from './shipping-form'
import { CartReview } from './cart-review'
import { CheckoutStep, FormData } from '@/app/checkout/checkoutContent'
import { UseFormReturn } from 'react-hook-form'
import useDeliveryOptions from '@/app/hooks/useDeliveryOptions'; // Changed import

interface BnplManagerProps {
  setCurrentStep: (currentStep: CheckoutStep) => void;
  form: UseFormReturn<FormData>;
  onShippingUpdate?: (shippingCost: number) => void;
  onVatUpdate?: (vat: number) => void;
  onSubtotalUpdate?: (subtotal: number) => void;
  onTotalUpdate?: (total: number) => void;
}

const BnplManager = ({ setCurrentStep, form, onShippingUpdate, onVatUpdate, onSubtotalUpdate, onTotalUpdate }: BnplManagerProps) => {
  const { watch } = form;

  const watchShippingMethod = watch("shippingMethod");
  const watchShippingOption = watch("shippingOption");
  const watchPickupStore = watch("pickupStore");
  const watchSelectedAddressId = watch("selectedAddressId");

  const { deliveryOptions } = useDeliveryOptions(); // Changed variable name

  const getSelectedShippingOption = () => {
    if (watchShippingMethod !== 'delivery' || !watchShippingOption) {
      return null;
    }

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

  const selectedShippingOption = getSelectedShippingOption();

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] py-1">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div className="lg:pr-8">
            <ShippingForm
              setCurrentStep={setCurrentStep}
              form={form}
              onShippingUpdate={onShippingUpdate}
            />
          </div>

          <div className="lg:pl-8 lg:border-l border-border">
            <CartReview
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
  )
}

export default BnplManager