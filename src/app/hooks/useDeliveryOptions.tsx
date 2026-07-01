import useCustomer from '@/store/customerStore';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import axiosCustomer from '@/utils/fetch-function-customer';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getClientIdentifiers } from '@/config/client-config';

export interface DeliveryOption {
    id: string;
    name: string;
    price: number;
    description: string;
    icon: string;
    estimatedArrival: string;
    area: string;
    groupCode: string;
    estimatedTime: number;
    estimatedTimeType: string;
    amount: number;
    deliveryVatRate: number;
    deliveryVatAmount: number;
    capLimit: number;
}

const storeCode = getClientIdentifiers().storeCode;

/**
 * Fetches delivery options from /delivery/option/all.
 *
 * @param sourceType  - Optional source type (e.g. 'GUEST' for unauthenticated flows)
 * @param totalWeight - Optional total weight in kg computed from variant items only.
 *                      When provided and > 0, it is sent as a query param so the backend
 *                      can filter/price weight-based options. When undefined or 0, the
 *                      param is omitted entirely (NOT sent as 0).
 */
const useDeliveryOptions = (sourceType?: string | undefined, totalWeight?: number) => {
    const { customer } = useCustomer();
    const axiosInstance = !customer?.ticketID ? axiosInstanceNoAuth : axiosCustomer;

    const { data, isLoading, error } = useQuery({
        queryKey: ['delivery-options', sourceType, totalWeight],
        queryFn: () =>
            axiosInstance.request({
                url: '/delivery/option/all',
                method: 'GET',
                params: {
                    sourceType,
                    storeCode,
                    // Only include totalWeight when it is a positive number — do NOT send 0
                    totalWeight: totalWeight || 0
                }
            }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const deliveryOptions = useMemo(() => {
        if (!data?.data?.deliveryOptions) return [];

        return data.data.deliveryOptions.map((item: any, index: number) => {
            const id = String(item.id || index);
            const name = item.area || 'Delivery Option';

            let cappedVatAmount = item.deliveryVatAmount || 0;

            if (item.capLimit && item.capLimit > 0) {
                cappedVatAmount = Math.min(cappedVatAmount, item.capLimit);
            }

            const price = parseFloat(item.amount + cappedVatAmount) || 0;
            const groupCode = item.groupCode || '';

            let icon = '🚚';
            const groupLower = groupCode.toLowerCase();

            if (groupLower.includes('express') || groupLower.includes('fast')) {
                icon = '⚡';
            } else if (groupLower.includes('standard') || groupLower.includes('regular')) {
                icon = '📦';
            } else if (groupLower.includes('premium') || groupLower.includes('priority')) {
                icon = '⭐';
            } else if (groupLower.includes('economy') || groupLower.includes('budget')) {
                icon = '💰';
            } else if (groupLower.includes('cargo') || groupLower.includes('freight')) {
                icon = '🚢';
            } else if (groupLower.includes('same-day') || groupLower.includes('instant')) {
                icon = '🚀';
            } else if (groupLower.includes('next-day') || groupLower.includes('overnight')) {
                icon = '🌙';
            }

            let estimatedArrival = 'Est. to arrive within ';
            if (item.estimatedTime && item.estimatedTimeType) {
                const timeType = item.estimatedTimeType.toLowerCase();
                if (timeType.includes('hour')) {
                    estimatedArrival += `${item.estimatedTime} hour${item.estimatedTime > 1 ? 's' : ''}`;
                } else if (timeType.includes('day')) {
                    estimatedArrival += `${item.estimatedTime} day${item.estimatedTime > 1 ? 's' : ''}`;
                } else if (timeType.includes('week')) {
                    estimatedArrival += `${item.estimatedTime} week${item.estimatedTime > 1 ? 's' : ''}`;
                } else if (timeType.includes('minute')) {
                    estimatedArrival += `${item.estimatedTime} minute${item.estimatedTime > 1 ? 's' : ''}`;
                } else {
                    estimatedArrival += `${item.estimatedTime} ${item.estimatedTimeType}`;
                }
            } else {
                estimatedArrival = 'Standard delivery';
            }

            return {
                id,
                name: groupCode,
                price,
                description: item.area,
                icon,
                estimatedArrival,
                area: item.area,
                groupCode: item.groupCode,
                estimatedTime: item.estimatedTime || 0,
                estimatedTimeType: item.estimatedTimeType || '',
                amount: item.amount || 0,
                deliveryVatRate: item.deliveryVatRate || 0,
                deliveryVatAmount: cappedVatAmount || 0,
                capLimit: item.capLimit || 0
            };
        });
    }, [data]);

    return { deliveryOptions, isLoading, error };
};

export default useDeliveryOptions;