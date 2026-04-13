'use client'

import { ProductProps } from '@/types';
import { findProductBySlug } from '@/utils/product-route';
import { useMemo } from 'react';
import { useProducts } from './useProducts';

export const useProductBySlug = (
  productSlug: string,
  storeCode: string,
  entityCode: string
) => {
  const { data, isLoading, error } = useProducts(
    storeCode,
    entityCode,
    '',
    '',
    productSlug,
    1,
    1000
  );
  const products = (data?.products || []) as ProductProps[];

  const product = useMemo(
    () => findProductBySlug(products, productSlug),
    [productSlug, products]
  );

  return {
    product,
    products,
    isLoading,
    error,
  };
};
