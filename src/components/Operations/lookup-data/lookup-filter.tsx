'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import useOperations from '@/store/operationsStore';

interface LookupTypeFilterProps {
  onCodeFilter: (value: string) => void;
  handleApplyFilter: () => void;
}

export default function LookupTypeFilter({ onCodeFilter, handleApplyFilter }: LookupTypeFilterProps) {
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

  const handleSelectChange = (value: string) => {
    onCodeFilter(value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryCode">Category Code</Label>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category code" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="categoryCode">All Categories</SelectItem>
              {categoryOptions.map((option: any) => (
                <SelectItem key={option.code} value={option.code}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleApplyFilter}>
        Apply Filter
      </Button>
    </div>
  );
}