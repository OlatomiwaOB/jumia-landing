'use client'
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useMutation } from '@tanstack/react-query';
import useOperations from '@/store/operationsStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LookupData {
  id: number;
  entityCode: string;
  countryCode: string;
  categoryCode: string;
  lookupCode: string;
  lookupName: string;
  lookupDesc: string;
  status: string;
  usageAccess: string;
}

interface EditLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  lookupData: LookupData | null;
  onSuccess?: () => void;
}

interface LookupFormData {
  categoryCode: string;
  lookupCode: string;
  lookupName: string;
  lookupDesc: string;
  status: string;
}

export default function EditLookupModal({ isOpen, onClose, lookupData, onSuccess }: EditLookupModalProps) {
  const { operations } = useOperations();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<LookupFormData>();

  useEffect(() => {
    if (lookupData && isOpen) {
      reset({
        categoryCode: lookupData.categoryCode,
        lookupCode: lookupData.lookupCode,
        lookupName: lookupData.lookupName,
        lookupDesc: lookupData.lookupDesc,
        status: lookupData.status
      });
    }
  }, [lookupData, reset, isOpen]);

  const updateLookupMutation = useMutation({
    mutationFn: (formData: any) =>
      axiosOperations.request({
        method: 'POST',
        url: 'lookupdata/save',
        data: formData
      }),
    onSuccess: (data) => {
      if (data?.data?.responseCode === '000') {
        toast.success('Lookup Data updated successfully!');
        reset();
        onSuccess?.();
        onClose();
      } else {
        toast.error(data?.data?.responseMessage || 'Failed to update lookup data');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error updating lookup data');
    }
  });

  const onSubmit = (data: LookupFormData) => {

    const payload = {
      id: lookupData?.id,
      entityCode: operations?.entityCode,
      countryCode: 'NG',
      lookupDesc: data.lookupDesc,
      lookupName: data.lookupName,
      lookupCode: data.lookupCode,
      status: data.status,
      categoryCode: data.categoryCode,
      usageAccess: 'All'
    };

    // console.log('Submitting payload:', payload);
    updateLookupMutation.mutate(payload);
  };

  const categoryCodeValue = watch('categoryCode');
  const statusValue = watch('status');
  const lookupCodeValue = watch('lookupCode');

  if (!lookupData) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className='flex flex-col'>
          <DialogTitle className="text-center">
            Edit Lookup Data
          </DialogTitle>
          <DialogDescription className="text-center">
            Update lookup data information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lookupName">Lookup Name *</Label>
              <Input
                id="lookupName"
                {...register('lookupName', { required: 'Lookup name is required' })}
                placeholder="Enter lookup name"
              />
              {errors.lookupName && (
                <p className="text-sm text-red-500">{errors.lookupName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryCode">Category Code</Label>
              <div className="relative">
                <Input
                  id="categoryCode"
                  value={categoryCodeValue || lookupData?.categoryCode || ''}
                  readOnly
                  disabled
                  className="bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400 text-sm">(Read only)</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Category code cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={statusValue || lookupData?.status || 'Active'}
                onValueChange={(value) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lookupCode">Lookup Code *</Label>
              <Input
                id="lookupCode"
                {...register('lookupCode', {
                  required: 'Lookup code is required',
                  validate: (value) => {
                    if (!value.trim()) {
                      return 'Lookup code cannot be empty';
                    }
                    return true;
                  }
                })}
                placeholder="Enter lookup code"
              />
              {errors.lookupCode && (
                <p className="text-sm text-red-500">{errors.lookupCode.message}</p>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="lookupDesc">Lookup Description *</Label>
              <Textarea
                id="lookupDesc"
                {...register('lookupDesc', { required: 'Lookup description is required' })}
                placeholder="Enter lookup description"
                className="min-h-[100px] resize-none"
              />
              {errors.lookupDesc && (
                <p className="text-sm text-red-500">{errors.lookupDesc.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateLookupMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateLookupMutation.isPending}
              className="gap-2"
            >
              {updateLookupMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Lookup Data
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}