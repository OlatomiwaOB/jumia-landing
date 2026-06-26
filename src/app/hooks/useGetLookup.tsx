
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

  const lookupList: SelectOption[] =
    lookupData?.data.map((item) => {
      return {
        id: item.lookupCode,
        name: item.lookupName,
        description: item.lookupDesc,
      };
    }) ?? [];
  return lookupList;
};

export default useGetLookup;
