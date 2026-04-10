import Footer from '@/components/theme1/footer'
import Navigation from '@/components/theme1/navigation'
import CartTriggerDesktop from '@/components/ui/cart-trigger-desktop'
import React, { ReactNode } from 'react'

const ThemeOneLayout = ({children}:{children: ReactNode}) => {
  return (
    <div className='min-h-screen flex flex-col'>
        <Navigation/>
        <CartTriggerDesktop/>
        {children}
        <Footer/>
    </div>
  )
}

export default ThemeOneLayout