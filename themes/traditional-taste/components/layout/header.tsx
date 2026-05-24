'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
        <div className="hidden md:flex items-center justify-between py-4 px-8 max-w-[1400px] mx-auto w-full">
          {/* Left: Logo and Nav Group */}
          <div className="flex items-center gap-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4 group">
              {/* Logo Icon Container with Glow */}
              <div className="relative w-20 h-20 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover:shadow-[0_8px_30px_rgba(249,115,22,0.2)] overflow-hidden flex-shrink-0 border border-gray-50 transition-all duration-300 transform group-hover:-translate-y-1">
                <Image
                  src="/traditional-taste-logo.jpg"
                  alt="Traditional Taste Logo"
                  fill
                  className="object-contain p-1 scale-110"
                />
              </div>
              {/* Logo Text in Accent Color */}
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl font-serif font-extrabold tracking-tight text-accent drop-shadow-sm transition-colors duration-300">
                  TraditionalTaste
                </h1>

              </div>
            </Link>

            {/* Navigation - Premium Pill Links */}
            <nav className="flex items-center space-x-2 text-sm font-bold text-gray-600">
              <Link href="/" className="px-4 py-2 rounded-full hover:bg-accent/10 hover:text-accent transition-all duration-300">Home</Link>
              <Link href="#" className="flex items-center gap-1 px-4 py-2 rounded-full hover:bg-accent/10 hover:text-accent transition-all duration-300">
                Shop
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </Link>
              <Link href="#" className="px-4 py-2 rounded-full hover:bg-accent/10 hover:text-accent transition-all duration-300">About</Link>
              <Link href="#" className="px-4 py-2 rounded-full hover:bg-accent/10 hover:text-accent transition-all duration-300">Contact</Link>
            </nav>
          </div>

          {/* Right: Premium Actions */}
          <div className="flex items-center space-x-5">
            {/* Search Bar - Soft Design */}
            <button
              onClick={() => setOpenSearch(true)}
              className="flex items-center px-6 py-3 bg-gray-50 hover:bg-accent/5 border border-transparent hover:border-accent/20 rounded-full text-sm font-medium text-gray-400 w-64 transition-all duration-300 shadow-inner group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-400 group-hover:text-accent transition-colors"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Search for products...
            </button>

            {/* Login Link - Colored Pill */}
            <div
              className="flex items-center px-5 py-2.5 bg-accent/10 text-accent font-bold rounded-full hover:bg-accent hover:text-white transition-all duration-300 cursor-pointer shadow-sm gap-2"
              onClick={() => !customer?.firstname && setIsOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {customer?.firstname ? (
                <Link href="/dashboard" className="text-sm font-bold hover:underline">
                  {customer.firstname}
                </Link>
              ) : (
                <span className="text-sm tracking-wide">SIGN IN</span>
              )}
            </div>

            {/* Cart Trigger - Glowing Button */}
            <CartWrapper>
              <SheetTrigger className="relative flex items-center justify-center w-12 h-12 rounded-full bg-accent text-white hover:bg-accent/90 transition-all duration-300 cursor-pointer shadow-[0_4px_15px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.6)] hover:-translate-y-0.5">
                <ShoppingBag size={22} strokeWidth={2.5} />
                {isMounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[11px] font-black rounded-full h-6 w-6 flex items-center justify-center border-2 border-white shadow-sm">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </SheetTrigger>
              <Cart />
            </CartWrapper>
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

          {/* Center Logo Mobile */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12 bg-white rounded-[1rem] shadow-md overflow-hidden flex-shrink-0 border border-gray-50">
              <Image
                src="/traditional-taste-logo.jpg"
                alt="Traditional Taste Logo"
                fill
                className="object-contain scale-110 p-0.5"
              />
            </div>
            <div className="flex flex-col justify-center mt-1">
              <h1 className="text-xl font-serif font-black tracking-tight text-accent">
                TraditionalTaste
              </h1>
            </div>
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
                <span className="text-xl font-bold tracking-[0.3em] text-black">TRADITIONAL TASTE</span>
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
                  { label: 'ABOUT', href: '#' },
                  { label: 'CONTACT', href: '#' },
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
                      SIGN IN / REGISTER
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
