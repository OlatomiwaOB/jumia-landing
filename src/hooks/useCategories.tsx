'use client'

import { Category } from '@/types';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { useQuery } from '@tanstack/react-query';

interface CategoriesResponse {
  categories: Category[];
}

export const useCategories = (retry?: unknown) => {
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || 'FTD';

  const { data, isLoading, error } = useQuery({
    queryKey: ['categories', entityCode, retry],
    queryFn: () =>
      axiosInstanceNoAuth
        .request({
          url: '/ecommerce/products/categories',
          params: {
            name: '',
            entityCode,
            category: '',
            tag: '',
            pageNumber: 1,
            pageSize: 200,
          },
        })
        .then((response) => response.data as CategoriesResponse),
  });

  return { data, isLoading, error };
};
