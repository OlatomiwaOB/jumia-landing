import { DashboardHeader } from '@/components/Customer/dashboard-header'
import { DashboardSidebar } from '@/components/Customer/dashboard-sidebar'
import { CUSTOMER } from '@/utils/constants'
import PrivateRoute from '@/utils/private-route-customer'


import React, { ReactNode } from 'react'
import TwoFaWrapper from '../TwoFaWrapper'
import { PageProvider } from '@/hooks/metadata-context'
import { SidebarProvider } from '@/components/common/sidebar-context'
import { DashboardShell } from '@/components/common/dashboard-shell'


const CustomerDashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <PrivateRoute requiredPermissions={[CUSTOMER]}>
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

export default CustomerDashboardLayout