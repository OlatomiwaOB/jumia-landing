'use client'
import React, { ReactNode, useEffect } from 'react'
import { Sheet } from './sheet'
import { usePathname } from 'next/navigation'
import { useCart } from '@/store/cart'

const CartWrapper = ({children}:{children:ReactNode}) => {
  const { cartVisibility, openCart, closeCart } = useCart()
  const pathname = usePathname()
  
  useEffect(() => {
    // Close the sheet whenever pathname changes
    closeCart()
  }, [pathname, closeCart])
  
  return (
    <Sheet open={cartVisibility} onOpenChange={(val) => val ? openCart() : closeCart()}>
        {children}
    </Sheet>
  )
}

export default CartWrapper