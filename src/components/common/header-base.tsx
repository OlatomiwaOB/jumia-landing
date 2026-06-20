'use client'

import React, { ReactNode } from 'react'
import { BreadcrumbNav } from './breadcrumb-nav'
import { useSidebar } from './sidebar-context'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { usePage } from '@/hooks/metadata-context'

interface HeaderBaseProps {
  actions: ReactNode
  mobileSidebar: ReactNode
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
}

export const HeaderBase = ({
  actions,
  mobileSidebar,
  mobileSidebarOpen,
  setMobileSidebarOpen
}: HeaderBaseProps) => {
  const { title, description } = usePage()
  const { toggleCollapsed } = useSidebar()

  return (
    <header className="bg-white/80 backdrop-blur-md px-4 py-3 w-full min-h-[72px] border-b border-gray-200 sticky top-0 z-40 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className="hidden lg:flex text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="hidden lg:block h-6 w-px bg-gray-200 mx-2" />

        <div className="flex flex-col">
          <BreadcrumbNav />
          <h1 className="text-lg font-semibold text-gray-900 leading-tight mt-1">
            {title}
          </h1>
          {/* We hide the description if it's redundant, but let's keep it if provided */}
          {description && (
             <p className='text-xs font-normal text-gray-500 mt-0.5'>{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {actions}

        <div className="flex lg:hidden items-center">
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]">
              {mobileSidebar}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
