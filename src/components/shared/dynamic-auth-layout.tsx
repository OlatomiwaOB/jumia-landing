import React, { Suspense, lazy } from 'react';
import Loader from '@/components/ui/loader';
import { AuthLayoutProps } from './default-auth-layout';

// Lazy load theme specific auth layouts
const VarisaAuthLayout = lazy(() => import('../../../themes/varisa/components/ui/auth-layout'));
const TraditionalTasteAuthLayout = lazy(() => import('../../../themes/traditional-taste-v2/components/ui/auth-layout'));
const DefaultAuthLayout = lazy(() => import('./default-auth-layout'));

export default function DynamicAuthLayout(props: AuthLayoutProps) {
  const storefront = process.env.NEXT_PUBLIC_STORE_FRONT;

  if (storefront === 'varisa') {
    return (
      <Suspense fallback={<Loader text="Loading..." />}>
        <VarisaAuthLayout {...props} />
      </Suspense>
    );
  }

  if (storefront === 'traditional-taste-v2') {
    return (
      <Suspense fallback={<Loader text="Loading..." />}>
        <TraditionalTasteAuthLayout {...props} />
      </Suspense>
    );
  }

  // Fallback to default for depot, fortitude, vogue until they have specific layouts
  return (
    <Suspense fallback={<Loader text="Loading..." />}>
      <DefaultAuthLayout {...props} />
    </Suspense>
  );
}
