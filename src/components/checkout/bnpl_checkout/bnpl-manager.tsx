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



  const getSelectedShippingOption = () => {
    if (watchShippingMethod !== 'delivery' || !watchShippingOption) {
      return null;
    }

    let selectedOption: any = null;
    try {
      const stored = sessionStorage.getItem('selectedWeightOption');
      if (stored) {
        selectedOption = JSON.parse(stored);
      }
    } catch { /* ignore */ }

    if (!selectedOption || selectedOption.typeCode !== watchShippingOption) return null;

    return {
      id: selectedOption.typeCode,
      name: selectedOption.typeName,
      price: selectedOption.finalFee,
      description: selectedOption.breakdown,
      icon: '',
      estimatedArrival: `${selectedOption.estimatedTime} ${selectedOption.estimatedTimeType}`,
      area: selectedOption.area || '',
      groupCode: selectedOption.zoneCode || '',
      estimatedTime: selectedOption.estimatedTime,
      estimatedTimeType: selectedOption.estimatedTimeType,
      amount: selectedOption.finalFee,
      deliveryVatAmount: 0
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