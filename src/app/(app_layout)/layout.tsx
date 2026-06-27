import React, { ReactNode } from 'react'
import ThemeLayout from '@theme/layout'

/**
 * App Layout — uses build-time @theme alias.
 * Only the selected storefront's layout code is bundled.
 * No lazy loading, no Suspense, no if/else cascade.
 */
const AppLayout = ({ children }: { children: ReactNode }) => {
  return <ThemeLayout>{children}</ThemeLayout>;
}

export default AppLayout