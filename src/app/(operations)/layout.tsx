'use client'

import { DashboardHeader } from '@/components/Operations/dashboard-header'
import { DashboardSidebar } from '@/components/Operations/dashboard-sidebar'
import { OPERATIONS, REVENUE_ASSURANCE } from '@/utils/constants'
import PrivateRoute from '@/utils/private-route-operations'
import React, { ReactNode } from 'react'
import TwoFaWrapper from '../TwoFaWrapperOperations'
import { PageProvider } from '@/hooks/metadata-context'

interface OperationsDashboardLayoutProps {
  children: ReactNode
}

const OperationsDashboardLayout = ({
  children,
}: OperationsDashboardLayoutProps) => {
  return (
    <PrivateRoute requiredPermissions={[OPERATIONS, REVENUE_ASSURANCE]}>
      <PageProvider>
        <TwoFaWrapper>
          <div className="min-h-screen bg-[#F5F5F5]">
            <div className="lg:grid lg:grid-cols-[1fr_5.5fr]">
              <div className="hidden lg:sticky lg:bottom-0 lg:block lg:left-0 lg:top-0 lg:h-screen max-w-[300px]">
                <DashboardSidebar />
              </div>
              <div className="w-full overflow-x-auto h-full">
                <DashboardHeader />
                <main className='px-2 lg:px-4 py-2 lg:py-4'>
                  {children}
                </main>
              </div>
            </div>
          </div>
        </TwoFaWrapper>
      </PageProvider>
    </PrivateRoute>
  )
}

export default OperationsDashboardLayout