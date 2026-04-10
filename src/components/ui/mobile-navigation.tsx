'use client'
import { Home, Search, ShoppingCart, User, Menu } from "lucide-react"
import { useMemo, useState } from "react"
import { MobileMenu } from "./mobile-menu"
import { useCart } from "@/store/cart"
import CartWrappper from "./cart-wrapper"
import { SheetTrigger } from "./sheet"
import Cart from "./cart"
import SearchInput from "./search-input"
import useCustomer from "@/store/customerStore"

export function MobileNavigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { cart } = useCart()
    const [openSearch,setOpenSearch] = useState(false)
    const { customer } = useCustomer()

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t z-50 border-gray-200 md:hidden">
      <div className="flex items-center justify-around py-2">
        <button className="flex flex-col items-center gap-1 p-2" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="h-6 w-6 text-gray-600" />
        </button>

        <button className="flex flex-col items-center gap-1 p-2" onClick={() => setOpenSearch(true)}>
          <Search className="h-6 w-6 text-gray-600" />
        </button>

        <button className="flex flex-col items-center gap-1 p-2">
          <Home className="h-6 w-6 text-gray-600" />
        </button>

        <CartWrappper>
          <SheetTrigger className="flex flex-col items-center gap-1 p-2 relative">
          <ShoppingCart className="h-6 w-6 text-gray-600" />
          <div className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cart?.length > 10 ? '10+' : cart?.length}
          </div>
        </SheetTrigger>
        <Cart/>
        </CartWrappper>

        {/* <button className="flex flex-col items-center gap-1 p-2">
          <User className="h-6 w-6 text-gray-600" />
        </button> */}
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      {/* Mobile Search Input */}
      {
        openSearch && <SearchInput
          onClose={() => setOpenSearch(false)}
        />
      }
    </div>
  )
}
