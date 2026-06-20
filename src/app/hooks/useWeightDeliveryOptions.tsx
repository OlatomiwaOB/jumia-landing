import useCustomer from '@/store/customerStore';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import axiosCustomer from '@/utils/fetch-function-customer';
import { useQuery } from '@tanstack/react-query';

export interface WeightDeliveryOption {
  responseCode: string;
  responseMessage: string;
  zoneCode: string;
  typeCode: string;
  typeName: string;
  totalWeightKg: number;
  baseFee: number;
  weightFee: number;
  finalFee: number;
  estimatedTime: number;
  estimatedTimeType: string;
  breakdown: string;
}

export interface WeightDeliveryOptionsResponse {
  responseCode: string;
  responseMessage: string;
  options: WeightDeliveryOption[];
}

/**
 * Fetches weight-based delivery options (e.g. Regular, Express) for a given
 * zone and cart weight. Replaces the old flat-fee delivery option selection.
 *
 * @param zoneCode  - The delivery zone code (from the selected delivery option's groupCode)
 * @param totalWeightKg - Total weight of the cart in kg (defaults to total item quantity)
 * @param sourceType - Optional source type for guest vs authenticated
 */
const useWeightDeliveryOptions = (
  zoneCode: string | undefined = 'Camden',
  totalWeightKg: number = 1,
  sourceType?: string
) => {
  const { customer } = useCustomer();
  const axiosInstance = !customer?.ticketID ? axiosInstanceNoAuth : axiosCustomer;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['weight-delivery-options', zoneCode, totalWeightKg],
    queryFn: () =>
      axiosInstance.request({
        url: '/delivery-by-weight/options-summary',
        method: 'GET',
        params: {
          zoneCode,
          totalWeightKg,
        },
      }),
    enabled: !!zoneCode && totalWeightKg > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const filteredOptions = data?.data?.options?.filter((option: WeightDeliveryOption) => option?.responseCode === '000');
  const options: WeightDeliveryOption[] = filteredOptions || [];

  return { options, isLoading, error, refetch };
};

export default useWeightDeliveryOptions;
