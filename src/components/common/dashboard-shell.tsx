'use client'

import { useSidebar } from './sidebar-context'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface DashboardShellProps {
  sidebar: ReactNode
  header: ReactNode
  children: ReactNode
}

export const DashboardShell = ({ sidebar, header, children }: DashboardShellProps) => {
  const { collapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-[#F5F5F5]" style={{ '--accent': 'var(--sidebar-accent)' } as React.CSSProperties}>
      {/* Desktop sidebar — fixed position, width transitions on collapse */}
      <aside
        className={cn(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50',
          'transition-[width] duration-300 ease-in-out overflow-hidden',
          collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'
        )}
      >
        {sidebar}
      </aside>

      {/* Main content area — margin shifts with sidebar */}
      <div
        className={cn(
          'flex flex-col min-h-screen',
          'transition-[margin-left] duration-300 ease-in-out',
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        )}
      >
        {header}
        <main className="flex-1 px-3 lg:px-6 py-3 lg:py-5">
          {children}
        </main>
      </div>
    </div>
  )
}
