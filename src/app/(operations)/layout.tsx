'use client'

import React, { ReactNode } from 'react'
import { OPERATIONS, REVENUE_ASSURANCE } from '@/utils/constants'
import PrivateRoute from '@/utils/private-route-operations'
import { PageProvider } from '@/hooks/metadata-context'
import { SidebarProvider } from "@/components/common/sidebar-context";
import { DashboardShell } from "@/components/common/dashboard-shell";
import TwoFaWrapper from '../TwoFaWrapperOperations'
import { DashboardHeader } from '@/components/Operations/dashboard-header'
import { DashboardSidebar } from '@/components/Operations/dashboard-sidebar'

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

export default OperationsDashboardLayout