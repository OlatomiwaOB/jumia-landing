'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import CartWrapper from '@/components/ui/cart-wrapper';
import { SheetTrigger } from '@/components/ui/sheet';
import Cart from '@/components/ui/cart';
import SearchInput from '@/components/ui/search-input';
import { ShoppingBag, X } from 'lucide-react';
import CustomerLoginModal from "@/components/ui/customer-login-modal";
import useCustomer from '@/store/customerStore';


export default function Header() {
  const [openSearch, setOpenSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, getCartTotal, mainCcy } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false)

  const { customer } = useCustomer()

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const itemCount = isMounted ? cart.length : 0;
  const totalAmount = isMounted ? getCartTotal() : 0;
  const ccy = isMounted ? mainCcy() : '';

  return (
    <>
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between py-6 px-8">
          {/* Left Navigation */}
          <nav className="flex space-x-8 text-xs font-semibold tracking-widest text-[#555]">
            <Link href="/" className="hover:text-black transition-colors">HOME</Link>
            <Link href="#" className="hover:text-black transition-colors">SHOP</Link>
            <Link href="#" className="hover:text-black transition-colors">PAGES</Link>
          </nav>

          {/* Center Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/">
              <h1 className="text-2xl font-bold tracking-[0.3em] text-black">DEPOT</h1>
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-6 text-xs font-semibold tracking-widest text-[#555]">
            {/* Cart Trigger */}
            <CartWrapper>
              <SheetTrigger
                className="flex items-center hover:text-black transition-colors cursor-pointer gap-1.5"
                aria-label="Open cart"
              >
                <ShoppingBag size={15} strokeWidth={2} />
                <span>CART</span>
                {isMounted && itemCount > 0 && (
                  <span className="inline-flex items-center justify-center bg-accent text-white text-[10px] font-bold rounded-full h-5 w-5 ml-0.5">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
                {isMounted && totalAmount > 0 && (
                  <span className="ml-0.5">
                    ({formatPrice(totalAmount, ccy as CurrencyCode)})
                  </span>
                )}
              </SheetTrigger>
              <Cart />
            </CartWrapper>

            {/* Login Link */}
            <div className="flex items-center hover:text-black transition-colors gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <div className="flex-col items-start">
                {customer?.firstname ? (
                  <Link
                    href="/dashboard"
                    className="text-xs md:text-sm font-semibold hover:underline hover:text-accent"
                  >
                    {customer.firstname}
                  </Link>
                ) : (
                  <span
                    className="text-xs md:text-sm font-semibold hover:underline hover:text-accent"
                    onClick={() => setIsOpen(true)}
                  >
                    LOGIN
                  </span>
                )}
              </div>
            </div>

            {/* Search Icon */}
            <button
              className="hover:text-black transition-colors cursor-pointer"
              onClick={() => setOpenSearch(true)}
              aria-label="Open search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Menu Button (desktop — optional side drawer) */}
            <button
              className="hover:text-black transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between py-4 px-4">
          {/* Mobile Menu Button */}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Center Logo */}
          <Link href="/">
            <h1 className="text-xl font-bold tracking-[0.3em] text-black">DEPOT</h1>
          </Link>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => setOpenSearch(true)}
              aria-label="Open search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Mobile Cart */}
            <CartWrapper>
              <SheetTrigger
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Open cart"
              >
                <ShoppingBag size={16} strokeWidth={2} />
                {isMounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </SheetTrigger>
              <Cart />
            </CartWrapper>
          </div>
        </div>

        {/* Search Overlay */}
        {openSearch && (
          <Suspense>
            <SearchInput onClose={() => setOpenSearch(false)} />
          </Suspense>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-xl font-bold tracking-[0.3em] text-black">DEPOT</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Nav */}
            <nav className="p-6">
              <div className="space-y-1">
                {[
                  { label: 'HOME', href: '/' },
                  { label: 'SHOP', href: '#' },
                  { label: 'PAGES', href: '#' },
                  { label: 'CONTACT', href: '#' },
                  { label: 'FAQ', href: '#' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block py-3 px-3 text-xs font-semibold tracking-[0.25em] text-[#555] hover:text-black hover:bg-gray-50 rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="my-6 border-t border-gray-100" />

              {/* Account */}
              <div
                className="flex items-center gap-3 py-3 px-3 text-xs font-semibold tracking-[0.25em] text-[#555] hover:text-black hover:bg-gray-50 rounded-lg transition-all"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsOpen(true);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <div className="flex-col items-start">
                  {customer?.firstname ? (
                    <Link
                      href="/dashboard"
                      className="text-xs md:text-sm font-semibold hover:underline hover:text-accent"
                    >
                      {customer.firstname}
                    </Link>
                  ) : (
                    <span
                      className="text-xs md:text-sm font-semibold hover:underline hover:text-accent"
                      onClick={() => setIsOpen(true)}
                    >
                      LOGIN / REGISTER
                    </span>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Cart Trigger — fixed sidebar button */}
      <CartWrapper>
        <SheetTrigger
          className="hidden lg:block w-[90px] p-3 bg-accent fixed top-[50%] -translate-y-1/2 right-0 z-50 rounded-l-md cursor-pointer space-y-2"
          aria-label="Open cart"
        >
          <div className="flex items-center justify-center gap-1.5 text-white text-[12px] font-semibold">
            <ShoppingBag size={16} strokeWidth={2.5} />
            <span>{isMounted ? (itemCount > 1 ? `${itemCount} items` : `${itemCount} item`) : '0 items'}</span>
          </div>
          {isMounted && itemCount > 0 && (
            <div className="text-accent bg-white text-center py-1 rounded-sm text-[12px] font-semibold">
              {formatPrice(totalAmount, ccy as CurrencyCode)}
            </div>
          )}
        </SheetTrigger>
        <Cart />
      </CartWrapper>

      <CustomerLoginModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
