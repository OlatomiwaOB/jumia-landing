import { DashboardHeader } from '@/components/Admin/dashboard-header'
import { DashboardSidebar } from '@/components/Admin/dashboard-sidebar'
import { BUSINESS_MANAGER, CASHIER, SALES_REP } from '@/utils/constants'
import PrivateRoute from '@/utils/private-route'
import React, { ReactNode } from 'react'
import { PageProvider } from '@/hooks/metadata-context'
import TwoFaWrapper from '../TwoFaWrapperAdmin'
import { SidebarProvider } from '@/components/common/sidebar-context'
import { DashboardShell } from '@/components/common/dashboard-shell'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <PrivateRoute requiredPermissions={[BUSINESS_MANAGER, CASHIER, SALES_REP]}>
      <PageProvider>
        <TwoFaWrapper>
          <SidebarProvider>
            <DashboardShell
              sidebar={<DashboardSidebar />}
              header={<DashboardHeader />}
            >
              {children}
            </DashboardShell>
          </SidebarProvider>
        </TwoFaWrapper>
      </PageProvider>
    </PrivateRoute>
  )
}

export default DashboardLayout