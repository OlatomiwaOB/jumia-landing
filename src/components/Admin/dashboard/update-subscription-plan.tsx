// 'use client'

// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import axiosInstance from '@/utils/fetch-function';
// import useUser from '@/store/userStore';
// import useGetLookup from "@/app/hooks/useGetLookup";
// import { Loader2 } from 'lucide-react';

// interface UpdateSubscriptionModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onUpdateSuccess?: () => void;
// }

// const UpdateSubscriptionModal: React.FC<UpdateSubscriptionModalProps> = ({
//   isOpen,
//   onClose,
//   onUpdateSuccess
// }) => {
//   const { user } = useUser();
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedTierCode, setSelectedTierCode] = useState(user?.subscriptionTierCode || '');
//   const [selectedSubscriptionType, setSelectedSubscriptionType] = useState(user?.subscriptionType || '');

//   const tierCodeOptions = useGetLookup('TIER_CODE');
//   const subscriptionTypeOptions = useGetLookup('SUBSCRIPTION_TYPE');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!user?.storeCode) {
//       toast.error('Store code not found');
//       return;
//     }

//     if (!selectedTierCode) {
//       toast.error('Please select a tier code');
//       return;
//     }

//     if (!selectedSubscriptionType) {
//       toast.error('Please select a subscription type');
//       return;
//     }

//     try {
//       setIsLoading(true);
      
//       const params = new URLSearchParams({
//         storeCode: user.storeCode,
//         tierCode: selectedTierCode,
//         subscriptionType: selectedSubscriptionType
//       });

//       const response = await axiosInstance.post(
//         `/subscription-plan/merchant-store/update?${params}`
//       );

//       if (response?.data?.code === '000') {
//         toast.success('Subscription updated successfully!');
//         onClose();
//         if (onUpdateSuccess) {
//           onUpdateSuccess();
//         }
//       } else {
//         toast.error(response?.data?.desc || 'Failed to update subscription');
//       }
//     } catch (error: any) {
//       console.error('Update subscription error:', error);
//       toast.error(error.response?.data?.desc || 'An error occurred while updating subscription');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getLookupDisplayName = (options: Array<{ id: string; name: string }>, value: string) => {
//     if (!value || !options) return value;
//     const option = options.find(opt => opt.id === value);
//     return option ? option.name : value;
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader className='flex flex-col'>
//           <DialogTitle>Update Subscription Plan</DialogTitle>
//           <DialogDescription>
//             Update the subscription plan for your store. This will change your current plan settings.
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="tierCode" className="text-sm font-medium">
//                 New Tier Type <span className="text-red-500">*</span>
//               </Label>
//               <Select
//                 value={selectedTierCode}
//                 onValueChange={setSelectedTierCode}
//                 disabled={isLoading}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select tier code">
//                     {getLookupDisplayName(tierCodeOptions, selectedTierCode) || "Select tier code"}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent>
//                   {tierCodeOptions.map((option) => (
//                     <SelectItem key={option.id} value={option.id}>
//                       {option.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="subscriptionType" className="text-sm font-medium">
//                 New Subscription Type <span className="text-red-500">*</span>
//               </Label>
//               <Select
//                 value={selectedSubscriptionType}
//                 onValueChange={setSelectedSubscriptionType}
//                 disabled={isLoading}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select subscription type">
//                     {getLookupDisplayName(subscriptionTypeOptions, selectedSubscriptionType) || "Select subscription type"}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent>
//                   {subscriptionTypeOptions.map((option) => (
//                     <SelectItem key={option.id} value={option.id}>
//                       {option.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <DialogFooter className="flex flex-row justify-end gap-2 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onClose}
//               disabled={isLoading}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={isLoading || !selectedTierCode || !selectedSubscriptionType}
//               className="gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 'Update Subscription'
//               )}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default UpdateSubscriptionModal;


'use client'

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';
import useGetLookup from "@/app/hooks/useGetLookup";
import { Loader2 } from 'lucide-react';

interface UpdateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess?: () => void;
}

const UpdateSubscriptionModal: React.FC<UpdateSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onUpdateSuccess
}) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTierCode, setSelectedTierCode] = useState(user?.subscriptionTierCode || '');
  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState(user?.subscriptionType || '');

  const tierCodeOptions = useGetLookup('TIER_CODE');
  const subscriptionTypeOptions = useGetLookup('SUBSCRIPTION_TYPE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.storeCode) {
      toast.error('Store code not found');
      return;
    }

    if (!selectedTierCode) {
      toast.error('Please select a tier code');
      return;
    }

    if (!selectedSubscriptionType) {
      toast.error('Please select a subscription type');
      return;
    }

    try {
      setIsLoading(true);
      
      const params = new URLSearchParams({
        storeCode: user.storeCode,
        tierCode: selectedTierCode,
        subscriptionType: selectedSubscriptionType
      });

      const response = await axiosInstance.post(
        `/subscription-plan/merchant-store/update?${params}`
      );

      if (response?.data?.code === '000') {
        toast.success('Subscription updated successfully!');
        onClose();
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        toast.error(response?.data?.desc || 'Failed to update subscription');
      }
    } catch (error: any) {
      console.error('Update subscription error:', error);
      toast.error(error.response?.data?.desc || 'An error occurred while updating subscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
        <DialogTitle className="sr-only">Update Subscription Plan</DialogTitle>
        
        <div className="px-6 pt-5 pb-2">
          <h2 className="text-base font-bold text-dark-gray">Update Subscription Plan</h2>
          <p className="text-xs text-medium-gray mt-0.5">
            Update the subscription plan for your store. This will change your current plan settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-white rounded-2xl p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tierCode">
                New Tier Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedTierCode}
                onValueChange={setSelectedTierCode}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tier code" />
                </SelectTrigger>
                <SelectContent>
                  {tierCodeOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscriptionType">
                New Subscription Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedSubscriptionType}
                onValueChange={setSelectedSubscriptionType}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription type" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptionTypeOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !selectedTierCode || !selectedSubscriptionType}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Subscription'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSubscriptionModal;