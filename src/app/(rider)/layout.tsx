'use client'

import { DashboardHeader } from '@/components/Rider/dashboard-header'
import { DashboardSidebar } from '@/components/Rider/dashboard-sidebar'
import { RIDERS } from '@/utils/constants'
import PrivateRoute from '@/utils/private-route-riders'
import React, { ReactNode } from 'react'

interface RidersDashboardLayoutProps {
    children: ReactNode
    showSidebar?: boolean
    headerTitle?: string
}

const RidersDashboardLayout = ({
    children,
    showSidebar = true,
    headerTitle
}: RidersDashboardLayoutProps) => {
    return (
        <PrivateRoute requiredPermissions={[RIDERS]}>
            <div className="min-h-screen bg-background">
                <div className="lg:grid lg:grid-cols-[1fr_5.5fr]">
                    {/* Sidebar - hidden on mobile, sticky on desktop */}
                    {showSidebar && (
                        <div className="hidden lg:sticky lg:bottom-0 lg:block lg:left-0 lg:top-0 lg:h-screen max-w-[300px]">
                            <DashboardSidebar />
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="w-full overflow-x-auto h-full">
                        <DashboardHeader />

                        {/* Dashboard Content */}
                        <main className={`p-4 lg:p-6 space-y-4 lg:space-y-6 ${!showSidebar ? 'lg:col-span-full' : ''}`}>
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    )
}

export default RidersDashboardLayout