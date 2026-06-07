'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import { useCart } from '@/store/cart';
import { formatPrice } from '@/utils/helperfns';
import { useWishlist } from '@/store/wishlist';
import CartWrapper from '@/components/ui/cart-wrapper';
import Cart from '@/components/ui/cart';
import { SheetTrigger } from '@/components/ui/sheet';
import CustomerLoginModal from "@/components/ui/customer-login-modal";
import useCustomer from '@/store/customerStore';
import { Search, ShoppingBag, User, Heart, ChevronDown, Clock, Menu, X, ArrowLeft, ArrowRight, Phone, MapPin } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { cart, getCartTotal, mainCcy } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const [isMounted, setIsMounted] = useState(false);
  const { customer } = useCustomer();
  const [isRTL, setIsRTL] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (isMounted) {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    }
  }, [isRTL, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);



  const itemCount = isMounted ? cart.length : 0;
  const ccy = isMounted ? mainCcy() : '';
  const totalAmount = isMounted ? getCartTotal() : 0;

  return (
    <header className="w-full sticky top-0 z-50 flex flex-col">



      {/* ── 2. MAIN HEADER BAR ── */}
      {/* bg: accent3 (dark forest green) */}
      <div
        className="bg-accent3 text-accent-foreground py-4 px-6 md:px-10 flex items-center justify-between gap-6 relative"
      >
        {/* Left: Hamburger + Desktop/Tablet Logo */}
        <div className="flex items-center gap-5">
          <button
            className="lg:hidden text-white/80 hover:text-accent-foreground transition-colors"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setMobileSearchOpen(false);
            }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          <Link href="/" className="hidden md:flex items-center gap-4 group">
            {/* Desktop/Tablet Logo */}
            <div className="relative w-12 h-[60px] md:w-14 md:h-[68px] rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-white/5 transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(160,82,45,0.5)] group-hover:border-accent-foreground/40">
              <Image
                src="/varisa-logo.jpg"
                alt="Varisa Catering Logo"
                fill
                className="object-contain p-1"
              />
            </div>

            {/* Brand name */}
            <div className="hidden sm:flex flex-col gap-0.5">
              <span
                className="text-white font-black text-lg md:text-xl uppercase leading-none"
                style={{ letterSpacing: '0.18em' }}
              >
                Varisa
              </span>
              <span
                className="text-accent-foreground font-black text-lg md:text-xl uppercase leading-none"
                style={{ letterSpacing: '0.18em' }}
              >
                Catering Foods
              </span>
              <div className="h-[2px] w-full rounded-full mt-0.5" style={{ background: '#967BB6' }} />
            </div>
          </Link>
        </div>

        {/* Mobile Centered Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 md:hidden flex items-center z-10 pointer-events-none">
          <Link href="/" className="flex items-center gap-2.5 group pointer-events-auto bg-gradient-to-r from-white/10 to-white/0 border border-white/10 rounded-full pl-1 pr-4 py-1 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition-all duration-300 active:scale-95">
            {/* Circular Image Badge */}
            <div className="relative w-[36px] h-[36px] rounded-full overflow-hidden bg-white shadow-[0_0_12px_rgba(160,82,45,0.4)] flex-shrink-0 flex items-center justify-center">
              <Image
                src="/varisa-logo.jpg"
                alt="Varisa Catering Logo"
                fill
                className="object-contain p-1"
              />
            </div>
            {/* Sleek Typography */}
            <div className="flex flex-col items-start justify-center">
              <span className="text-white font-black text-[13px] uppercase leading-none" style={{ letterSpacing: '0.18em' }}>
                Varisa
              </span>
              <span className="text-accent-foreground font-extrabold text-[7.5px] uppercase leading-none mt-1" style={{ letterSpacing: '0.22em' }}>
                Catering
              </span>
            </div>
          </Link>
        </div>



        {/* Right: Action Icons */}
        <div className="flex items-center gap-5 md:gap-7">


          {/* Login / Register */}
          <div className="hidden lg:flex items-center gap-3 cursor-pointer" onClick={() => setIsLoginModalOpen(true)}>
            <User size={28} className="hover:text-accent transition-colors duration-200" strokeWidth={2.5} />
            <div className="flex flex-col gap-[3px]">
              <span className="text-[12px] font-extrabold tracking-wider hover:text-accent transition-colors cursor-pointer leading-none">Login</span>
              <span className="text-[12px] font-extrabold tracking-wider hover:text-accent transition-colors cursor-pointer leading-none text-white/60">Register</span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-7 bg-white/15" />


          {/* Cart */}
          <CartWrapper>
            <SheetTrigger className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <ShoppingBag size={23} className="group-hover:text-accent transition-colors duration-200" strokeWidth={2} />
                {isMounted && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-accent text-white text-[9px] w-[17px] h-[17px] rounded-full flex items-center justify-center font-black">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col leading-tight text-left gap-[3px]">
                <span className="text-[11px] font-bold tracking-wide text-white/50 group-hover:text-accent transition-colors duration-200">Cart</span>
                <span className="text-[12px] font-extrabold text-white group-hover:text-accent transition-colors duration-200">{isMounted ? formatPrice(totalAmount, ccy as any) : '$0.00'}</span>
              </div>
            </SheetTrigger>
            <Cart />
          </CartWrapper>

        </div>
      </div>



      {/* ── 3. NAVIGATION BAR ── */}
      {/* bg: accent-foreground (cream) | text: gray-900 | hover: accent (dark orange) */}
      <div className="hidden lg:flex bg-accent-foreground border-b border-gray-200 py-0 px-8 justify-between items-center">
        <nav className="flex items-center">
          {[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: 'About', href: '/about' },
            { label: 'Contact Us', href: '/contact' },
          ].map((item) => {
            const className = "relative flex items-center gap-1 px-5 py-4 text-[14px] font-bold text-gray-900 hover:text-accent transition-colors duration-200 group";
            const content = (
              <>
                {item.label}
                <span className="absolute bottom-0 left-5 right-5 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </>
            );

            if (item.href.startsWith('#')) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={className}
                  onClick={(e) => {
                    if (item.href === '#contact-us') {
                      e.preventDefault();
                      document.getElementById('contact-us')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={item.label} href={item.href} className={className}>
                {content}
              </Link>
            );
          })}

          {/* Sale with HOT badge
          <div className="relative flex items-center gap-1 px-5 py-4 text-[14px] font-bold text-gray-900 hover:text-accent transition-colors duration-200 cursor-pointer group">
            Sale
            <span className="absolute top-2 right-1 text-accent-foreground text-[8px] px-1.5 py-[1px] rounded-[3px] font-black tracking-widest uppercase bg-accent">
              HOT
            </span>
            <span className="absolute bottom-0 left-5 right-5 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
          </div> */}
        </nav>

        {/* Recent view
        <div className="flex items-center gap-2 text-gray-900 cursor-pointer hover:text-accent transition-colors pr-8">
          <Clock size={16} strokeWidth={2.5} />
          <span className="text-[13px] font-extrabold tracking-wide">Recent view product</span>
        </div> */}
      </div>

      {/* ── 4. MOBILE OFF-CANVAS MENU ── */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Drawer Dropdown */}
      <div
        className={`fixed top-0 left-0 w-full bg-white z-[110] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Drawer Header */}
        <div className="bg-accent3 text-white flex items-center justify-between px-5 py-[18px]">
          <span className="font-bold text-[15px]">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)} className="hover:text-white/80 transition-colors">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex flex-col pb-2">
          <nav className="flex flex-col">
            {[
              { name: 'Home', href: '/' },
              { name: 'Shop', href: '/shop' },
              { name: 'Contact Us', href: '/contact' },
            ].map((item) => {
              const className = "flex items-center justify-between py-[12px] px-5 border-b border-gray-100 text-[14px] font-bold text-gray-800 hover:text-accent transition-colors";
              const content = (
                <>
                  {item.name}
                  <ChevronDown className="rotate-[-90deg] text-gray-400" size={16} />
                </>
              );

              if (item.href.startsWith('#')) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={className}
                    onClick={(e) => {
                      if (item.href === '#contact-us') {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        setTimeout(() => {
                          document.getElementById('contact-us')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }
                    }}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={className}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {content}
                </Link>
              );
            })}



            {/* Utilities */}
            <div className="flex flex-col mt-2 mb-6">
              <button
                onClick={() => { setMobileMenuOpen(false); setIsLoginModalOpen(true); }}
                className="flex items-center gap-3 py-3 px-5 text-[14px] font-medium text-gray-600 hover:text-accent transition-colors w-full text-left"
              >
                <User size={20} strokeWidth={1.5} className="text-gray-500" />
                My account
              </button>
            </div>
          </nav>
        </div>

      </div>

      {/* RTL Toggle Button */}
      <button
        onClick={() => setIsRTL(!isRTL)}
        className={`fixed top-1/2 z-[100] -translate-y-1/2 bg-accent3 hover:bg-accent-foreground text-white text-[11px] font-black w-[38px] h-[38px] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-500 ${isRTL ? 'left-4' : 'right-4'}`}
      >
        {isRTL ? 'LTR' : 'RTL'}
      </button>

      <CustomerLoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
    </header>
  );
}
