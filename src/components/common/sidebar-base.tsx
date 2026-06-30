'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useSidebar } from './sidebar-context'
import { Logout2Icon } from '@/components/icons/icons'

interface SidebarBaseProps {
  children: ReactNode
  logoUrl: string
  logoHref: string
  onLogoutClick: () => void
}

export const SidebarBase = ({ children, logoUrl, logoHref, onLogoutClick }: SidebarBaseProps) => {
  const { collapsed } = useSidebar()

  return (
    <div className="w-full h-full flex flex-col bg-[var(--sidebar-accent)] text-[var(--sidebar-text)] relative">
      {/* Logo Area */}
      <div className="py-5 px-4 h-[72px] flex items-center shrink-0 border-b border-[var(--sidebar-text)]/10">
        <Link href={logoHref} className={cn("block relative transition-all", collapsed ? "w-[40px] h-[28px]" : "w-[110px] h-[30px]")}>
          <Image
            src={logoUrl || 'logo.png'}
            alt="logo"
            fill
            className={cn("object-contain", collapsed ? "object-left" : "object-left")}
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 py-4 px-3 overflow-y-auto w-full"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 transparent',
        }}
      >
        {children}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <button
          onClick={onLogoutClick}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-[var(--sidebar-text)]/10",
            "text-[var(--sidebar-text)]/70 hover:bg-[var(--sidebar-text)]/5 hover:text-[var(--sidebar-text)] hover:border-[var(--sidebar-text)]/20 transition-all",
            collapsed && "justify-center px-0 border-transparent hover:border-transparent"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <Logout2Icon className="text-[var(--sidebar-text)] w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  )
}
