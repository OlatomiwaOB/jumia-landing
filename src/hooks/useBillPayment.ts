import { useQuery, useMutation } from '@tanstack/react-query';
import type {
    Biller,
    BillerCategory,
    ValidateBillRequest,
    ValidateBillResponse,
    BillPaymentRequest,
    BillPaymentResponse,
} from '@/types/bill-payment-types';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { LocationData, useLocationStore } from '@/store/locationStore';

export function useFetchBillerCategories() {
    return useQuery<BillerCategory[]>({
        queryKey: ['biller-categories'],
        queryFn: async () => {
            const res = await axiosInstanceNoAuth.request({
                method: 'GET',
                url: '/web-collection/getBillerCategories',
            });
            return res.data?.category ?? res.data ?? [];
        },
        staleTime: 5 * 60 * 1000,
    });
}

interface FetchBillersParams {
    billerCategory?: string;
    name?: string;
    countryCode?: string;
}

export function useFetchBillers(params: FetchBillersParams, location: LocationData | null) {
    return useQuery<Biller[]>({
        queryKey: ['billers', params, location?.address?.countryCode],
        queryFn: async () => {
            // console.log(location);

            const categories = params.billerCategory ? params.billerCategory.split(',') : [''];

            const fetchPromises = categories.map(async (catCode) => {
                const res = await axiosInstanceNoAuth.request({
                    method: 'GET',
                    url: '/web-collection/list',
                    params: {
                        ...(catCode && { billerCategory: catCode }),
                        ...(params.name && { name: params.name }),
                        ...(params.countryCode && { countryCode: params.countryCode }),
                        ...(!params?.countryCode && { countryCode: '' }),
                        ...(!params?.billerCategory && { billerCategory: '' }),
                        ...(!params?.name && { name: '' }),
                    },
                    headers: {
                        'geolocation': `${location!.latitude}, ${location!.longitude}`
                    }
                });

                if (res.data?.billers && Array.isArray(res.data.billers)) {
                    return res.data.billers;
                }
                return [];
            });

            const results = await Promise.all(fetchPromises);
            const combinedBillers = results.flat();

            return combinedBillers;
        },
        enabled: !!location,
        staleTime: 2 * 60 * 1000,
    });
}

export function useFetchBillerDetail(billerCode: string, location: LocationData | null) {
    return useQuery<Biller | null>({
        queryKey: ['biller-detail', billerCode],
        queryFn: async () => {
            if (!billerCode) return null;
            const res = await axiosInstanceNoAuth.request({
                method: 'GET',
                url: `/web-collection/getbillerdetail`,
                params: { billerCode },
                headers: {
                    'geolocation': `${location!.latitude}, ${location!.longitude}`
                }
            });
            return res.data;
        },
        enabled: !!billerCode && !!location,
        staleTime: 2 * 60 * 1000,
    });
}

export function useValidateBill() {
    return useMutation<ValidateBillResponse, Error, ValidateBillRequest>({
        mutationFn: async (payload) => {
            const res = await axiosInstanceNoAuth.request({
                method: 'POST',
                url: '/web-collection/validatebill',
                data: payload,
            });
            return res.data;
        },
    });
}

export function usePostBillPayment() {
    return useMutation<BillPaymentResponse, Error, BillPaymentRequest>({
        mutationFn: async (payload) => {
            const res = await axiosInstanceNoAuth.request({
                method: 'POST',
                url: '/billpayment/postbillpayment',
                data: payload,
            });
            return res.data;
        },
    });
}