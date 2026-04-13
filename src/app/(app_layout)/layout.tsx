
import React, { lazy, ReactNode, Suspense } from 'react'

const AppLayoutTestApp = lazy(()=>import('../../../test-app/layout'))

const AppLayout = ({children}: {children: ReactNode}) => {
  if (process.env?.NEXT_PUBLIC_STORE_FRONT === 'test-app'){
    return (
        <AppLayoutTestApp>{children}</AppLayoutTestApp>
    );
  }
}

export default AppLayout