'use client'

import { ProductProps } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { useProducts } from './useProducts';

const locations = [
  { city: 'Lagos', country: 'Nigeria' },
  { city: 'Nairobi', country: 'Kenya' },
  { city: 'Accra', country: 'Ghana' },
  { city: 'Cape Town', country: 'South Africa' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'New York', country: 'USA' },
  { city: 'London', country: 'UK' },
  { city: 'Abuja', country: 'Nigeria' },
];

const timeRanges = [
  'Just now',
  '2 minutes ago',
  '5 minutes ago',
  '9 minutes ago',
  '14 minutes ago',
];

export interface RecentPurchaseNotice {
  product: ProductProps;
  location: (typeof locations)[number];
  purchasedAt: string;
}

export const useRecentPurchase = (storeCode: string, entityCode: string) => {
  const { data, isLoading } = useProducts(
    storeCode,
    entityCode,
    '',
    '',
    'recent-purchase',
    1,
    100
  );
  const products = useMemo(
    () =>
      (data?.products || []).filter(
        (product: ProductProps) => Boolean(product.name && product.picture)
      ),
    [data]
  );
  const [notice, setNotice] = useState<RecentPurchaseNotice | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!products.length) {
      return;
    }

    const pickRandomNotice = () => {
      const product = products[Math.floor(Math.random() * products.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const purchasedAt = timeRanges[Math.floor(Math.random() * timeRanges.length)];

      setNotice({ product, location, purchasedAt });
      setVisible(true);
    };

    pickRandomNotice();

    const rotation = window.setInterval(pickRandomNotice, 12000);
    return () => window.clearInterval(rotation);
  }, [products]);

  const dismiss = () => setVisible(false);

  return {
    notice: visible ? notice : null,
    isLoading,
    dismiss,
  };
};
