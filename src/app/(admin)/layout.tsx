import { DashboardHeader } from '@/components/Admin/dashboard-header'
import { DashboardSidebar } from '@/components/Admin/dashboard-sidebar'
import { BUSINESS_MANAGER, CASHIER, SALES_REP } from '@/utils/constants'
import PrivateRoute from '@/utils/private-route'
import React, { ReactNode } from 'react'
import { PageProvider } from '@/hooks/metadata-context'
import TwoFaWrapper from '../TwoFaWrapperAdmin'



const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <PrivateRoute requiredPermissions={[BUSINESS_MANAGER, CASHIER, SALES_REP]}>
      <PageProvider>
        <TwoFaWrapper>
          <div className="min-h-screen bg-[#F5F5F5]">
            <div className="lg:grid lg:grid-cols-[1fr_5.5fr]">
              <div className="hidden lg:sticky lg:bottom-0 lg:block lg:left-0 lg:top-0 lg:h-screen max-w-[300px]">
                <DashboardSidebar />
              </div>
              <div className="w-full overflow-x-auto h-full">
                <DashboardHeader />
                <main className="px-2 lg:px-4 py-2 lg:py-4">
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

export default DashboardLayout