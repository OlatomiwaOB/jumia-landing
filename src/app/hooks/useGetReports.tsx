import useCustomer from '@/store/customerStore';
import { LoggedInUser, SelectOption, UserProfile } from '@/types';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { getClientIdentifiers } from '@/config/client-config';

export interface LookupOptions {
  id: number;
  categoryCode: string;
  lookupCode: string;
  lookupName: string;
  lookupDesc: string;
  usageAccess: string;
  status: string;
  entityCode: string;
  countryCode: string;
}

export interface ExtendedSelectOption extends SelectOption {
  lookupCode: string;
  lookupName: string;
  lookupDesc: string;
  categoryCode: string;
  usageAccess: string;
  status: string;
  entityCode: string;
  countryCode: string;
}

const useGetLookup = (categoryCode: string) => {
  const entityCode = getClientIdentifiers().entityCode;
  const { data: lookupData } = useQuery<AxiosResponse<LookupOptions[]>>({
    queryKey: [categoryCode],
    queryFn: () =>
      axiosInstanceNoAuth.request({
        url: 'lookupdata/getdatabycategorycode/' + categoryCode,
        method: 'GET',
        params: {
          entityCode: entityCode,
        },
      })
  });

  const lookupList: ExtendedSelectOption[] =
    lookupData?.data.map((item) => {
      return {
        id: item.id.toString(),
        value: item.lookupCode,
        label: item.lookupName,
        name: item.lookupName,
        description: item.lookupDesc,
        lookupCode: item.lookupCode,
        lookupName: item.lookupName,
        lookupDesc: item.lookupDesc,
        categoryCode: item.categoryCode,
        usageAccess: item.usageAccess,
        status: item.status,
        entityCode: item.entityCode,
        countryCode: item.countryCode,
      };
    }) ?? [];
  return lookupList;
};

export default useGetLookup;