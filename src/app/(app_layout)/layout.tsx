
import React, { lazy, ReactNode, Suspense } from 'react'



const AppLayoutH2P = lazy(()=>import('../../../h2p-app/layout'))
const AppLayoutFortitude = lazy(()=>import('../../../fortitude-app/layout'))
const AppLayoutThemeOne = lazy(()=>import('@/themes/theme1/layout'))
const AppLayoutTestApp = lazy(()=>import('../../../test-app/layout'))

const AppLayout = ({children}: {children: ReactNode}) => {

  if (process.env?.NEXT_PUBLIC_STORE_FRONT === 'fortitude'){
    return (
        <AppLayoutFortitude>{children}</AppLayoutFortitude>
    );
  }
  if (process.env?.NEXT_PUBLIC_STORE_FRONT === 'h2p'){
    return (
        <AppLayoutH2P>{children}</AppLayoutH2P>
    );
  }

  if (process.env?.NEXT_PUBLIC_STORE_FRONT === 'theme1'){
    return (
        <AppLayoutThemeOne>{children}</AppLayoutThemeOne>
    );
  }

  if (process.env?.NEXT_PUBLIC_STORE_FRONT === 'test-app'){
    return (
        <AppLayoutTestApp>{children}</AppLayoutTestApp>
    );
  }
}

export default AppLayout