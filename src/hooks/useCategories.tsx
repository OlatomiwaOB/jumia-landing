'use client'

import { Category } from '@/types';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { useQuery } from '@tanstack/react-query';
import { getClientIdentifiers } from '@/config/client-config';

interface CategoriesResponse {
  categories: Category[];
}

export const useCategories = (retry?: unknown) => {
  const { entityCode, storeCode } = getClientIdentifiers();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['categories', entityCode, storeCode, retry],
    queryFn: () =>
      axiosInstanceNoAuth
        .request({
          url: '/ecommerce/products/categories',
          params: {
            name: '',
            entityCode,
            storeCode,
            category: '',
            tag: '',
            pageNumber: 1,
            pageSize: 200,
          },
        })
        .then((response) => response.data as CategoriesResponse),
  });

  return { data, isLoading, error, refetch };
};
