'use client'
import React, { ReactNode, useEffect, useState } from 'react'
import { Sheet } from './sheet'
import { usePathname } from 'next/navigation'

const CartWrapper = ({children}:{children:ReactNode}) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    // Close the sheet whenever pathname changes
    setOpen(false)
  }, [pathname])
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
        {children}
    </Sheet>
  )
}

export default CartWrapper