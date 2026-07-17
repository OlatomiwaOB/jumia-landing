'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import CartWrapper from '@/components/ui/cart-wrapper';
import { SheetTrigger } from '@/components/ui/sheet';
import Cart from '@/components/ui/cart';
import { Menu, Search, User, ShoppingCart, Mail, Package, X } from 'lucide-react';
import CustomerLoginModal from "@/components/ui/customer-login-modal";
import useCustomer from '@/store/customerStore';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { customer } = useCustomer();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const itemCount = isMounted ? cart.length : 0;

  return (
    <>
      <header className="sticky top-0 z-50 w-full font-sans bg-[#253273] text-white shadow-md">
        {/* Top Bar */}
        <div className="flex w-full border-b border-white/10 items-center justify-center md:justify-start h-12 max-w-[100rem] mx-auto">
          {/* Left: Free shipping text */}
          <div className="flex-1 flex items-center justify-center md:justify-start px-6 md:px-12 text-[15px] font-medium tracking-wide">
            Free shipping on orders over $80
          </div>
          {/* Right: Subscribe button */}
          <button className="hidden md:flex h-full bg-[#0abedb] hover:bg-[#09aac4] transition-colors items-center justify-center gap-2 px-8 font-bold text-[15px]">
            <Mail size={18} strokeWidth={2.5} />
            Subscribe & Save
          </button>
        </div>

        {/* Main Header Row */}
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 md:min-h-[160px] py-4 md:py-0 flex items-center justify-between gap-4 md:gap-8">

          {/* Left: Menu & Logo */}
          <div className="flex items-center gap-6">
            <button
              className="hover:opacity-70 transition-opacity text-white"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu size={32} strokeWidth={1.5} />
            </button>

            <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0abedb] w-10 h-10 rounded-lg flex items-center justify-center">
                <Package size={24} strokeWidth={2.5} className="text-white" />
              </div>
              <span className="text-[26px] font-semibold tracking-tight text-white">
                Warehouse
              </span>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-6">
            <div className="flex w-full h-[46px] rounded bg-white overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent px-5 text-[16px] text-gray-800 placeholder-[#7d8087] focus:outline-none"
              />
              <button className="bg-[#0abedb] hover:bg-[#09aac4] transition-colors w-[60px] flex items-center justify-center text-white">
                <Search size={22} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Right: User & Cart */}
          <div className="flex items-center gap-8">
            <div
              className="cursor-pointer hover:opacity-70 transition-opacity text-white"
              onClick={() => !customer?.firstname ? setIsOpen(true) : null}
            >
              {customer?.firstname ? (
                <Link href="/dashboard" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <span className="text-sm font-bold text-white">{customer.firstname.charAt(0)}</span>
                </Link>
              ) : (
                <User size={28} strokeWidth={1.5} />
              )}
            </div>

            <CartWrapper>
              <SheetTrigger className="relative flex items-center hover:opacity-70 transition-opacity cursor-pointer text-white">
                <ShoppingCart size={28} strokeWidth={1.5} />
                {isMounted && (
                  <span className="absolute -top-2 -right-3 bg-[#0abedb] text-white text-[12px] font-bold rounded-full h-[22px] w-[22px] flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </SheetTrigger>
              <Cart />
            </CartWrapper>
          </div>
        </div>

        {/* Mobile Search Bar (shows only on small screens) */}
        <div className="md:hidden px-6 pb-5">
          <div className="flex w-full h-[46px] rounded bg-white overflow-hidden shadow-sm">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent px-5 text-[16px] text-gray-800 placeholder-[#7d8087] focus:outline-none"
            />
            <button className="bg-[#0abedb] hover:bg-[#09aac4] transition-colors w-[60px] flex items-center justify-center text-white">
              <Search size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="w-[300px] bg-[#253273] h-full relative z-10 p-6 flex flex-col">
            <button onClick={() => setMobileMenuOpen(false)} className="self-end text-white/70 hover:text-white">
              <X size={28} strokeWidth={1.5} />
            </button>
            <nav className="flex flex-col gap-6 mt-8 text-lg font-medium text-white">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
              <Link href="/categories" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            </nav>
          </div>
        </div>
      )}

      <CustomerLoginModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
