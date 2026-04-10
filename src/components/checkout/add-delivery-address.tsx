import React, { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Controller, useForm } from 'react-hook-form'
import useGetLookup from '@/app/hooks/useGetLookup'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '@aws-amplify/ui-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosCustomer from '@/utils/fetch-function-customer'
import { toast } from 'sonner'

type AddDeliveryForm = {
  state: string;
  city: string;
  street: string;
  postCode: string;
  landmark: string;
  country: string;
  addressType: string;
  area: string;
}

interface AddDeliveryAddressProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingAddress?: any;
  onAddressSaved?: () => void;
}

const AddDeliveryAddress = ({ isOpen, setIsOpen, editingAddress, onAddressSaved }: AddDeliveryAddressProps) => {
  const { register, formState: { errors }, control, handleSubmit, reset, setValue } = useForm<AddDeliveryForm>()
  const addressTypeOptions = useGetLookup('ADDRESS_TYPE')
  const areaOptions = useGetLookup('AREAS')

  const queryClient = useQueryClient()

  const { isPending, mutate } = useMutation({
    mutationFn: (data: any) => axiosCustomer.request({
      url: '/ecommerce/save-delivery-address',
      method: 'POST',
      data
    }),
    onSuccess: (data) => {
      if (data?.data?.code !== '000') {
        toast.error(data?.data?.desc || 'Failed to save address')
        return
      }
      toast.success(editingAddress ? 'Address updated successfully' : 'Address saved successfully')
      queryClient.invalidateQueries({
        queryKey: ["delivery-addresses"]
      })
      setIsOpen(false)
      reset()
      onAddressSaved?.()
    },
    onError: (error) => {
      // console.log(error)
      toast.error('Something went wrong!')
    }
  })

  useEffect(() => {
    if (isOpen) {
      if (editingAddress) {
        setValue("state", editingAddress.state || "")
        setValue("city", editingAddress.city || "")
        setValue("street", editingAddress.street || "")
        setValue("postCode", editingAddress.postCode || "")
        setValue("landmark", editingAddress.landmark || "")
        setValue("country", editingAddress.country || "")
        setValue("addressType", editingAddress.addressType || "")
        setValue("area", editingAddress.area || "")
      } else {
        reset()
      }
    }
  }, [isOpen, editingAddress, reset, setValue])

  const onSubmit = (data: AddDeliveryForm) => {

    const payload: any = {
      street: data?.street,
      landmark: data?.landmark,
      postCode: data?.postCode,
      city: data?.city,
      state: data?.state,
      country: data?.country,
      addressType: data?.addressType,
      area: data?.area
    }

    if (editingAddress && editingAddress.id) {
      payload.id = editingAddress.id;
    }

    // console.log('Final payload:', payload);
    mutate(payload)
  }

  const handleClose = () => {
    setIsOpen(false)
    reset()
  }

  return (
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            {editingAddress ? 'Edit Delivery Address' : 'Add Delivery Address'}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full">
              <Label htmlFor="addressType" className="text-checkout-text text-sm font-medium">
                Address Type *
              </Label>
              <Controller
                name="addressType"
                control={control}
                rules={{ required: "Address type is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={`mt-1 ${errors.addressType ? "border-destructive" : ""} w-full`}>
                      <SelectValue placeholder="Choose address type" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {
                        addressTypeOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.addressType && (
                <p className="text-destructive text-sm mt-1">{errors.addressType.message}</p>
              )}
            </div>
            <div className="w-full">
              <Label htmlFor="country" className="text-checkout-text text-sm font-medium">
                Country *
              </Label>
              <Controller
                name="country"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={`mt-1 ${errors.country ? "border-destructive" : ""} w-full`}>
                      <SelectValue placeholder="Choose country" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="NG">Nigeria</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country && (
                <p className="text-destructive text-sm mt-1">{errors.country.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="state" className="text-checkout-text text-sm font-medium">
                State *
              </Label>
              <Input
                id="state"
                placeholder="Enter state"
                {...register("state", { required: "State is required" })}
                className={`mt-1 ${errors.state ? "border-destructive" : ""}`}
              />
              {errors.state && (
                <p className="text-destructive text-sm mt-1">{errors.state.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="city" className="text-checkout-text text-sm font-medium">
                City *
              </Label>
              <Input
                id="city"
                placeholder="Enter city"
                {...register("city", { required: "City is required" })}
                className={`mt-1 ${errors.city ? "border-destructive" : ""}`}
              />
              {errors.city && (
                <p className="text-destructive text-sm mt-1">{errors.city.message}</p>
              )}
            </div>
            <div className="w-full">
              <Label htmlFor="area" className="text-checkout-text text-sm font-medium">
                Area *
              </Label>
              <Controller
                name="area"
                control={control}
                rules={{ required: "Area is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={`mt-1 ${errors.area ? "border-destructive" : ""} w-full`}>
                      <SelectValue placeholder="Choose area" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {
                        areaOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.area && (
                <p className="text-destructive text-sm mt-1">{errors.area.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="street" className="text-checkout-text text-sm font-medium">
                Street Address *
              </Label>
              <Input
                id="street"
                placeholder="Enter street address"
                {...register("street", { required: "Street address is required" })}
                className={`mt-1 ${errors.street ? "border-destructive" : ""}`}
              />
              {errors.street && (
                <p className="text-destructive text-sm mt-1">{errors.street.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="landmark" className="text-checkout-text text-sm font-medium">
                Landmark *
              </Label>
              <Input
                id="landmark"
                placeholder="Enter landmark"
                {...register("landmark", { required: "Landmark is required" })}
                className={`mt-1 ${errors.landmark ? "border-destructive" : ""}`}
              />
              {errors.landmark && (
                <p className="text-destructive text-sm mt-1">{errors.landmark?.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="postCode" className="text-checkout-text text-sm font-medium">
                Postal Code *
              </Label>
              <Input
                id="postCode"
                placeholder="Enter postal code"
                {...register("postCode", { required: "Postal code is required" })}
                className={`mt-1 ${errors.postCode ? "border-destructive" : ""}`}
              />
              {errors.postCode && (
                <p className="text-destructive text-sm mt-1">{errors.postCode?.message}</p>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 p-2 rounded-md text-gray-700"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent hover:bg-accent/90 p-2 rounded-md text-white"
              disabled={isPending}
            >
              {isPending ? 'Please wait...' : (editingAddress ? 'Update Address' : 'Save Address')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddDeliveryAddress