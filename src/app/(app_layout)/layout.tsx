
import React, { lazy, ReactNode, Suspense } from 'react'

const AppLayoutDepot = lazy(() => import('../../../themes/depot/layout'))
const AppLayoutFortitude = lazy(() => import('../../../themes/fortitude/layout'))
const AppLayoutVogue = lazy(() => import('../../../themes/vogue/layout'))
const AppLayoutTraditionalTaste = lazy(() => import('../../../themes/traditional-taste/layout'))

const AppLayout = ({ children }: { children: ReactNode }) => {
  const storefront = process.env?.NEXT_PUBLIC_STORE_FRONT;

  if (storefront === 'depot') {
    return (
      <Suspense><AppLayoutDepot>{children}</AppLayoutDepot></Suspense>
    );
  }

  if (storefront === 'vogue') {
    return (
      <Suspense><AppLayoutVogue>{children}</AppLayoutVogue></Suspense>
    );
  }

  if (storefront === 'traditional-taste') {
    return (
      <Suspense><AppLayoutTraditionalTaste>{children}</AppLayoutTraditionalTaste></Suspense>
    );
  }

  return (
    <Suspense><AppLayoutFortitude>{children}</AppLayoutFortitude></Suspense>
  );
}

export default AppLayout