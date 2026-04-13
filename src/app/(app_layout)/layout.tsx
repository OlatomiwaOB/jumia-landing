
import React, { lazy, ReactNode, Suspense } from 'react'

const AppLayoutDepot = lazy(()=>import('../../../themes/depot/layout'))
const AppLayoutFortitude = lazy(()=>import('../../../themes/fortitude/layout'))

const AppLayout = ({children}: {children: ReactNode}) => {
  const storefront = process.env?.NEXT_PUBLIC_STORE_FRONT;
  
  if (storefront === 'depot'){
    return (
        <AppLayoutDepot>{children}</AppLayoutDepot>
    );
  }
  
  if (storefront === 'fortitude'){
    return (
        <AppLayoutFortitude>{children}</AppLayoutFortitude>
    );
  }
}

export default AppLayout