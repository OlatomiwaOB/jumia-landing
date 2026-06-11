'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import CartWrapper from '@/components/ui/cart-wrapper';
import { SheetTrigger } from '@/components/ui/sheet';
import Cart from '@/components/ui/cart';
import { ShoppingCart, Search, User, Sun, Moon, ChevronRight, Menu, X, List, Mail, Phone, Globe, ChefHat, ChevronDown, Zap, Home } from 'lucide-react';
import CustomerLoginModal from "@/components/ui/customer-login-modal";
import useCustomer from '@/store/customerStore';
import Image from 'next/image';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/types';

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();
  const { customer } = useCustomer();
  const { data: categoriesData } = useCategories();

  const categories: Category[] = (categoriesData?.categories || []).filter(
    (cat: Category) => cat.code && cat.name
  );

  const [brokenLogos, setBrokenLogos] = useState<Set<string>>(new Set());

  const getFallbackImage = (categoryName: string) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('drink') || name.includes('beverage') || name.includes('water')) return '/maltina-can-pack.png';
    if (name.includes('meat') || name.includes('beef') || name.includes('goat') || name.includes('chicken') || name.includes('poultry') || name.includes('protein')) return '/naija-goat-meat.jpg';
    if (name.includes('fish') || name.includes('seafood') || name.includes('prawn')) return '/hake-fish-box.jpg';
    if (name.includes('soup') || name.includes('stew') || name.includes('sauce')) return '/three-soups-hero.png';
    if (name.includes('snack') || name.includes('pastry')) return '/grandios-pap.jpg';
    if (name.includes('rice') || name.includes('jollof') || name.includes('grain')) return '/party-jollof.png';
    if (name.includes('swallow') || name.includes('fufu') || name.includes('pound') || name.includes('garri') || name.includes('yam')) return '/olu-olu-poundo-yam.jpg';
    if (name.includes('veg') || name.includes('leaf') || name.includes('fruit')) return '/hands_vegetables.png';
    if (name.includes('spice') || name.includes('season') || name.includes('pepper') || name.includes('oil')) return '/maggi-cubes.png';
    return '/nigerian-food.png';
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const itemCount = isMounted ? cart.length : 0;

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target as Node)) {
        setIsDesktopMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    const root = document.querySelector('.min-h-screen') as HTMLElement;
    if (root) {
      if (!isDarkMode) {
        root.style.setProperty('--color-bg-main', '#0F172A');
        root.style.setProperty('--color-text', '#FAFAF9');
      } else {
        root.style.setProperty('--color-bg-main', '#FAFAF9');
        root.style.setProperty('--color-text', '#1C1917');
      }
    }
  };

  return (
    <header className={`w-full flex flex-col font-sans sticky top-0 z-50 shadow-sm border-b transition-colors duration-300 ${isDarkMode ? 'bg-[#0F172A] border-gray-800' : 'bg-white border-gray-100'}`}>

      {/* ── Main Header ── */}
      <div className={`w-full px-4 lg:px-10 py-4 lg:py-5 flex flex-col justify-center relative transition-colors duration-300 ${isDarkMode ? 'bg-[#0F172A]' : 'bg-tt-peach'}`}>

        {/* --- MOBILE LAYOUT (< lg) --- */}
        <div className="flex lg:hidden items-center justify-between w-full h-14 relative">

          {/* Left: Menu & Search (Removed to avoid duplicate with bottom nav) */}
          <div className="flex items-center gap-5 w-7 h-7">
            {/* Empty space to maintain layout balance */}
          </div>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group">
            <div className="relative h-10 w-10 flex-shrink-0 rounded-full overflow-hidden shadow-sm">
              <Image src="/traditional-taste-logo.jpg" alt="Traditional Taste Logo" fill className="object-cover" priority />
            </div>
            <div className="flex flex-col justify-center">
              <span className={`text-[10px] font-black tracking-[0.2em] uppercase leading-none transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-tt-text'}`}>
                TRADITIONAL
              </span>
              <span className="text-xl font-serif italic font-extrabold text-tt-primary leading-none mt-0.5">
                Taste
              </span>
            </div>
          </Link>

          {/* Right: Cart */}
          <div className={`flex items-center transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            <CartWrapper>
              <SheetTrigger className="relative cursor-pointer hover:text-tt-primary transition-colors">
                <ShoppingCart size={24} strokeWidth={2} />
                {isMounted && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-tt-primary text-white text-[10px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white shadow-sm">
                    {itemCount}
                  </span>
                )}
              </SheetTrigger>
              <Cart />
            </CartWrapper>
          </div>
        </div>

        {/* --- DESKTOP LAYOUT (>= lg) --- */}
        <div className="hidden lg:flex items-center justify-between w-full gap-6">

          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-8">
            <div className="relative" ref={desktopMenuRef}>
              <button
                onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                className="bg-tt-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm shadow-md hover:bg-orange-600 transition-colors"
              >
                {isDesktopMenuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
                <span>Menu</span>
              </button>

              {isDesktopMenuOpen && (
                <div className={`absolute top-full left-0 mt-3 w-72 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border overflow-hidden z-50 transition-colors duration-300 animate-in fade-in slide-in-from-left-8 ${isDarkMode ? 'bg-[#1C1917] border-gray-800' : 'bg-white border-gray-100'}`}>
                  <div className="flex flex-col py-2 max-h-[60vh] overflow-y-auto">
                    {categories.map((item, idx) => (
                      <Link
                        href={`/shop/${item.code}`}
                        key={idx}
                        className={`flex items-center justify-between px-5 py-3 border-b last:border-b-0 transition-colors group ${isDarkMode ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-50 hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-4">
                          {item.logo && !brokenLogos.has(item.logo) ? (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-sm border border-black/5">
                              <Image 
                                src={item.logo} 
                                alt={item.name || ''} 
                                fill 
                                className="object-cover" 
                                onError={() => setBrokenLogos(prev => new Set(prev).add(item.logo as string))}
                              />
                            </div>
                          ) : (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-sm border border-black/5">
                              <Image 
                                src={getFallbackImage(item.name || '')} 
                                alt={item.name || 'Category'} 
                                fill 
                                className="object-cover" 
                              />
                            </div>
                          )}
                          <span className={`text-[14px] font-bold transition-colors group-hover:text-tt-primary ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            {item.name}
                          </span>
                        </div>
                        <ChevronRight size={16} className={`transition-transform group-hover:translate-x-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-full overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105">
                <Image src="/traditional-taste-logo.jpg" alt="Traditional Taste Logo" fill className="object-cover" priority />
              </div>
              <div className="flex flex-col justify-center">
                <span className={`text-[16px] md:text-[20px] font-black tracking-[0.25em] uppercase leading-none transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-tt-text'}`}>
                  TRADITIONAL
                </span>
                <span className="text-4xl md:text-5xl font-serif italic font-extrabold text-tt-primary leading-none mt-1">
                  Taste
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className={`flex items-center gap-7 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-tt-text'}`}>
            <button
              onClick={toggleTheme}
              className={`flex items-center w-14 h-7 rounded-full p-1 transition-colors duration-300 shadow-inner border border-gray-200 ${isDarkMode ? 'bg-tt-primary border-tt-primary' : 'bg-gray-100'}`}
            >
              <div className={`flex items-center justify-center w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}`}>
                {isDarkMode ? <Moon size={12} className="text-tt-primary" strokeWidth={3} /> : <Sun size={12} className="text-gray-400" strokeWidth={3} />}
              </div>
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="text-gray-600 hover:text-tt-primary transition-colors flex items-center"
            >
              <User size={26} strokeWidth={1.5} />
            </button>

            <CartWrapper>
              <SheetTrigger className="relative text-gray-600 hover:text-tt-primary transition-colors cursor-pointer">
                <ShoppingCart size={26} strokeWidth={1.5} />
                {isMounted && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-tt-primary text-white text-[10px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white shadow-sm">
                    {itemCount}
                  </span>
                )}
              </SheetTrigger>
              <Cart />
            </CartWrapper>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY & DRAWER --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`fixed top-0 left-0 h-full w-[85%] max-w-sm z-[110] shadow-2xl flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode ? 'bg-[#0F172A]' : 'bg-white'}`}>

        {/* Welcome Banner */}
        <div className="sticky top-0 z-10 w-full bg-tt-primary text-white py-3.5 px-5 flex items-center justify-between shadow-sm">
          <span className="text-[13px] font-bold">Welcome to Traditional Taste</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsOpen(true)} className="hover:opacity-80 transition-opacity">
              <User size={18} strokeWidth={2.5} />
            </button>
            <button onClick={toggleTheme} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className={`w-8 h-4 rounded-full relative flex items-center px-0.5 transition-colors ${isDarkMode ? 'bg-white/30' : 'bg-black/20'}`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ${isDarkMode ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
              </div>
              {isDarkMode ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* Main Menu Label */}
        <div className={`flex items-center justify-between px-5 py-3 font-bold text-[14px] border-b ${isDarkMode ? 'text-gray-200 border-gray-800' : 'text-tt-primary border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <List size={18} strokeWidth={2.5} />
            Main menu
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-70 transition-opacity p-1 bg-black/5 rounded-full">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Menu Links Removed */}

        {/* Bottom Links */}
        <div className="mt-4 mb-12 w-full flex flex-col gap-0.5">
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-5 py-2.5 text-[12px] font-bold transition-colors ${isDarkMode ? 'text-gray-400 hover:text-tt-primary' : 'text-gray-600 hover:text-tt-primary'}`}>
            <span className="w-[15px] text-center text-[10px] opacity-40">•</span>
            About us
          </Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-5 py-2.5 text-[12px] font-bold transition-colors ${isDarkMode ? 'text-gray-400 hover:text-tt-primary' : 'text-gray-600 hover:text-tt-primary'}`}>
            <span className="w-[15px] text-center text-[10px] opacity-40">•</span>
            Shop
          </Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-5 py-2.5 text-[12px] font-bold transition-colors ${isDarkMode ? 'text-gray-400 hover:text-tt-primary' : 'text-gray-600 hover:text-tt-primary'}`}>
            <span className="w-[15px] text-center text-[10px] opacity-40">•</span>
            Contact Us
          </Link>

        </div>
      </div>

      {/* ── Desktop Main Nav ── */}
      <div className={`hidden lg:flex w-full items-center justify-center py-3.5 border-t gap-10 text-[14px] font-extrabold transition-colors duration-300 ${isDarkMode ? 'border-gray-800 text-gray-200' : 'border-black/5 text-tt-text'}`}>
        <Link href="/" className="hover:text-tt-primary transition-colors flex items-center gap-2 group">
          <Home size={15} strokeWidth={2.5} className="text-tt-primary" /> Home
        </Link>
        <Link href="/shop" className="hover:text-tt-primary transition-colors flex items-center gap-2 group">
          <List size={15} strokeWidth={2.5} className="text-tt-primary" /> Shop
        </Link>
        <Link href="/about" className="hover:text-tt-primary transition-colors flex items-center gap-2 group">
          <ChefHat size={15} strokeWidth={2.5} className="text-tt-primary" /> About Us
        </Link>
        <Link href="/contact" className="hover:text-tt-primary transition-colors flex items-center gap-2 group">
          <Mail size={15} strokeWidth={2.5} className="text-tt-primary" /> Contact Us
        </Link>
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION BAR --- */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-3 px-2 border-t shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.1)] transition-colors duration-300 ${isDarkMode ? 'bg-[#0F172A] border-gray-800' : 'bg-white border-gray-100'}`}>
        <Link href="/" className={`flex flex-col items-center gap-1 hover:text-tt-primary transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Home size={22} strokeWidth={2} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="/shop" className={`flex flex-col items-center gap-1 hover:text-tt-primary transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <List size={22} strokeWidth={2} />
          <span className="text-[10px] font-bold">Shop</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(true)} className={`flex flex-col items-center gap-1 transition-colors ${isMobileMenuOpen ? 'text-tt-primary' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`}>
          <Menu size={22} strokeWidth={2.5} />
          <span className="text-[10px] font-bold">Menu</span>
        </button>
        <CartWrapper>
          <SheetTrigger className={`relative flex flex-col items-center gap-1 hover:text-tt-primary transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <ShoppingCart size={22} strokeWidth={2} />
            <span className="text-[10px] font-bold">Cart</span>
            {isMounted && itemCount > 0 && (
              <span className="absolute -top-1.5 right-1.5 bg-tt-primary text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                {itemCount}
              </span>
            )}
          </SheetTrigger>
          <Cart />
        </CartWrapper>
        <button onClick={() => setIsOpen(true)} className={`flex flex-col items-center gap-1 hover:text-tt-primary transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <User size={22} strokeWidth={2} />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>

      {/* Login Modal */}
      <CustomerLoginModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}
