'use client'
import React, { ReactNode } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface CartWrapperProps {
  children: ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const CartWrapper = ({ children, isOpen, onOpenChange }: CartWrapperProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {children}
    </Sheet>
  )
}

export default CartWrapper