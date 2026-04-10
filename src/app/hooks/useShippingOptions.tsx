// Create a new hook: useShippingOptions.ts
import useCustomer from '@/store/customerStore';
import axiosCustomer from '@/utils/fetch-function-customer';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
  estimatedArrival: string;
}

const useShippingOptions = () => {
  const { customer } = useCustomer();
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || customer?.entityCode || 'FTD';
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['shipping-options', entityCode],
    queryFn: () =>
      axiosCustomer.request({
        url: 'lookupdata/getdatabycategorycode/DELIVERY_TYPE',
        method: 'GET',
        params: { entityCode },
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  
  const shippingOptions = useMemo(() => {
    if (!data?.data) return [];
    
    return data.data.map((item: any, index: number) => {
      const id = String(item.id || item.lookupCode || index);
      const name = item.lookupName || 'Standard';
      const price = parseFloat(item.lookupCode) || 0;
      
      // Determine icon
      let icon = '🚚';
      const nameLower = name.toLowerCase();
      const descLower = (item.lookupDesc || '').toLowerCase();
      
      if (nameLower.includes('express') || descLower.includes('express')) {
        icon = '⚡';
      } else if (nameLower.includes('cargo') || descLower.includes('cargo')) {
        icon = '🚢';
      } else if (nameLower.includes('regular') || descLower.includes('regular')) {
        icon = '📦';
      } else if (nameLower.includes('economy') || descLower.includes('economy')) {
        icon = '🚚';
      }
      
      return {
        id,
        name,
        price,
        description: item.lookupDesc || '',
        icon,
        estimatedArrival: 'Oct 24-25',
        originalLookupCode: item.lookupCode,
      };
    });
  }, [data]);
  
  return { shippingOptions, isLoading, error };
};

export default useShippingOptions;