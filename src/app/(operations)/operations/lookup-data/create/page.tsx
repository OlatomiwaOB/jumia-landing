'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import useOperations from '@/store/operationsStore';
import FileUpload from '@/components/Admin/inventories/file-input';
import { usePermission } from '@/hooks/usePermission';

interface LookupFormData {
  categoryCode: string;
  lookupCode: string;
  lookupName: string;
  lookupDesc: string;
  status: string;
}

export default function CreateLookupDataPage() {
  const { usePermissionGuard } = usePermission();

  usePermissionGuard('MANAGE_LOOKUP', {
    redirectToNotPermitted: true,
    toastMessage: "You don't have permission to manage lookup data"
  });

  const router = useRouter();
  const { operations } = useOperations();

  const { data: categoryData } = useQuery({
    queryKey: ['category-codes'],
    queryFn: () => axiosOperations.request({
      method: 'GET',
      url: 'lookupdata/new-list',
      params: {
        entityCode: operations?.entityCode,
        categoryCode: 'CATEGORY_CODE',
        pageNumber: 1,
        pageSize: 100
      }
    }),
    enabled: !!operations?.entityCode,
  });

  const categoryOptions = categoryData?.data?.list || [];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<LookupFormData>({
    defaultValues: {
      categoryCode: '',
      lookupCode: '',
      lookupName: '',
      lookupDesc: '',
      status: 'ACTIVE'
    }
  });

  const createLookupMutation = useMutation({
    mutationFn: (formData: any) =>
      axiosOperations.request({
        method: 'POST',
        url: 'lookupdata/save',
        data: formData
      }),
    onSuccess: (data) => {
      if (data?.data?.responseCode === '000') {
        toast.success('Lookup Data created successfully!');
        router.push('/operations/lookup-data');
      } else {
        toast.error(data?.data?.responseMessage || 'Failed to create lookup data');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error creating lookup data');
    }
  });

  const onSubmit = (data: LookupFormData) => {
    const payload = {
      id: 0,
      entityCode: operations?.entityCode,
      countryCode: 'NG',
      lookupDesc: data.lookupDesc,
      lookupName: data.lookupName,
      lookupCode: data.lookupCode,
      status: data.status,
      categoryCode: data.categoryCode,
      usageAccess: 'All'
    };

    createLookupMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lookup Data
          </Button>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
              <Save className="w-8 h-8 text-accent-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-accent-foreground">
              Create Lookup Data
            </h1>
            <p className="text-muted-foreground mt-2">
              Add new lookup data to your system
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="border-gray-200 shadow-sm mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Lookup Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    <Label htmlFor="categoryCode">Category Code *</Label>
                    <Select
                      onValueChange={(value) => setValue('categoryCode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category code" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option: any) => (
                          <SelectItem key={option.code} value={option.code}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryCode && (
                      <p className="text-sm text-red-500">{errors.categoryCode.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      onValueChange={(value) => setValue('status', value)}
                      defaultValue="ACTIVE"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lookupCode">Lookup Code *</Label>
                    <Input
                      id="lookupCode"
                      {...register('lookupCode', { required: 'Lookup code is required' })}
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
                      className="min-h-[100px]"
                    />
                    {errors.lookupDesc && (
                      <p className="text-sm text-red-500">{errors.lookupDesc.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createLookupMutation.isPending}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {createLookupMutation.isPending ? 'Creating...' : 'Create Lookup Data'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}