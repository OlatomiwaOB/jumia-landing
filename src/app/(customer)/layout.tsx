import { DashboardHeader } from '@/components/Customer/dashboard-header'
import { DashboardSidebar } from '@/components/Customer/dashboard-sidebar'
import { CUSTOMER } from '@/utils/constants'
import PrivateRoute from '@/utils/private-route-customer'


import React, { ReactNode } from 'react'
import TwoFaWrapper from '../TwoFaWrapper'

const CustomerDashboardLayout = ({children}:{children:ReactNode}) => {
  return (
    <PrivateRoute requiredPermissions={[CUSTOMER]}>
      <TwoFaWrapper>
        <div className="min-h-screen bg-background">
        <div className="lg:grid lg:grid-cols-[1fr_5.5fr]">
            {/* Sidebar - hidden on mobile, sticky on desktop */}
            <div className="hidden lg:sticky lg:bottom-0 lg:block lg:left-0 lg:top-0 lg:h-screen max-w-[300px]">
                <DashboardSidebar />
            </div>
        {/* Main Content */}
        <div className="w-full overflow-x-auto h-full">
          <DashboardHeader />
          
          {/* Dashboard Content */}
          <main className="p-4 lg:p-6 space-y-4 lg:space-y-6">
            {children}
          </main>
        </div>
        </div>
    </div>
      </TwoFaWrapper>
    </PrivateRoute>
  )
}

export default CustomerDashboardLayout