'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import CartWrapper from '@/components/ui/cart-wrapper';
import { SheetTrigger } from '@/components/ui/sheet';
import Cart from '@/components/ui/cart';
import { ShoppingCart, Search, Mic, MapPin, User, Sun, Moon, ChevronLeft, ChevronRight, Menu, X, List, Mail, Phone, Globe, ChefHat, ChevronDown, Zap, Home } from 'lucide-react';
import CustomerLoginModal from "@/components/ui/customer-login-modal";
import useCustomer from '@/store/customerStore';
import Image from 'next/image';

const mockCategories = [
  "Combo & Deals", "Bundle save", "Shop by Category", "Food & Restaurant", "Meat & Fish", "Presets", "Template"
];

const menuDropdownCategories = [
  { name: "Combo & Deals", image: null, icon: Zap, iconColor: "text-orange-500" },
  { name: "Food & Restaurant", image: "/nigerian-food.png" },
  { name: "Meat & Fish", image: "/frozen-beef.jpg" },
  { name: "Pantry staples", image: "/cat-groceries.png" },
  { name: "Dairy", image: "/peak-milk-900g.jpg" },
  { name: "Bakery", image: "/chin-chin-coconut.jpg" },
  { name: "Beverages", image: "/chi-exotic.jpg" }
];

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const { cart, getCartTotal, mainCcy } = useCart();
  const { customer } = useCustomer();

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

  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || '';

  // Top Promo Carousel State
  const promos = [
    { text: "Hurry up! 30% OFF Sale Ends Soon", type: "timer" },
    { text: "Fast & Free tracked delivery over £35", type: "text" },
    { text: "Try Risk Free: 30-Day Moneyback Guarantee", type: "text" },
    { text: "Subscribe & Save 20% off + free gift!", type: "link" }
  ];
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 181, hours: 5, mins: 52, secs: 26 });
  const [isPromoHovered, setIsPromoHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
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

  useEffect(() => {
    if (isPromoHovered) return;
    const slideTimer = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(slideTimer);
  }, [isPromoHovered]);

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        if (secs > 0) secs--;
        else {
          secs = 59;
          if (mins > 0) mins--;
          else {
            mins = 59;
            if (hours > 0) hours--;
            else { hours = 23; if (days > 0) days--; }
          }
        }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, []);

  const handlePrevPromo = () => setCurrentPromoIndex((prev) => (prev - 1 + promos.length) % promos.length);
  const handleNextPromo = () => setCurrentPromoIndex((prev) => (prev + 1) % promos.length);

  return (
    <header className={`w-full flex flex-col font-sans sticky top-0 z-50 shadow-sm border-b transition-colors duration-300 ${isDarkMode ? 'bg-[#0F172A] border-gray-800' : 'bg-white border-gray-100'}`}>

      {/* ── Layer 1: Top Promo Bar ── */}
      <div
        className="w-full bg-[#1C1917] text-white py-1.5 sm:py-2 px-4 flex items-center justify-between relative overflow-hidden min-h-[40px]"
        onMouseEnter={() => setIsPromoHovered(true)}
        onMouseLeave={() => setIsPromoHovered(false)}
      >
        <button onClick={handlePrevPromo} className="text-white hover:bg-white/10 p-1 rounded transition-colors z-10 cursor-pointer flex-shrink-0"><ChevronLeft size={18} /></button>

        <div className="flex-1 flex justify-center items-center overflow-hidden px-2 py-0.5">
          <div className={`flex items-center gap-1.5 sm:gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full justify-center ${promos[currentPromoIndex].type === 'timer' ? 'flex-col sm:flex-row' : 'flex-row'}`} key={currentPromoIndex}>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wide text-white text-center truncate whitespace-nowrap">
              {promos[currentPromoIndex].text}
            </span>

            {promos[currentPromoIndex].type === 'timer' && (
              <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-[#FFC107] flex-shrink-0">
                <span className="bg-[#FFB84D] text-[#1C1917] px-1.5 py-0.5 rounded shadow-sm min-w-[24px] sm:min-w-[28px] text-center">{timeLeft.days}</span> :
                <span className="bg-[#FFB84D] text-[#1C1917] px-1.5 py-0.5 rounded shadow-sm min-w-[24px] sm:min-w-[28px] text-center">{timeLeft.hours}</span> :
                <span className="bg-[#FFB84D] text-[#1C1917] px-1.5 py-0.5 rounded shadow-sm min-w-[24px] sm:min-w-[28px] text-center">{timeLeft.mins}</span> :
                <span className="bg-[#FFB84D] text-[#1C1917] px-1.5 py-0.5 rounded shadow-sm min-w-[24px] sm:min-w-[28px] text-center">{timeLeft.secs}</span>
              </div>
            )}

            {promos[currentPromoIndex].type === 'link' && (
              <Link href="#" className="text-[11px] sm:text-xs font-extrabold underline text-tt-primary hover:text-orange-600 transition-colors whitespace-nowrap flex-shrink-0">
                View more
              </Link>
            )}
          </div>
        </div>

        <button onClick={handleNextPromo} className="text-white hover:bg-white/10 p-1 rounded transition-colors z-10 cursor-pointer"><ChevronRight size={18} /></button>
      </div>

      {/* ── Layer 2: Utility Bar ── */}
      <div className={`hidden lg:flex w-full justify-between items-center px-10 py-3 border-b text-[13px] font-bold tracking-wide transition-colors duration-300 ${isDarkMode ? 'bg-[#0F172A] border-gray-800 text-gray-300' : 'bg-white border-gray-100 text-gray-600'}`}>
        <div className="flex space-x-6">
          <Link href="#" className="hover:text-tt-primary transition-colors">. About us</Link>
          <Link href="/contact" className="hover:text-tt-primary transition-colors">. Contact Us</Link>
          <Link href="#" className="hover:text-tt-primary transition-colors">. Shop</Link>
        </div>
        <div className="flex space-x-8 items-center">
          <span className="flex items-center gap-2 hover:text-tt-primary cursor-pointer transition-colors"><Mail size={14} strokeWidth={2.5} /> example@shopify.com</span>
          <span className="flex items-center gap-2 hover:text-tt-primary cursor-pointer transition-colors"><Phone size={14} strokeWidth={2.5} /> (+1) 2345678901</span>

          <div className="relative z-50" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className={`flex items-center gap-1.5 cursor-pointer transition-colors outline-none ${isLangDropdownOpen ? 'text-tt-primary' : 'hover:text-tt-primary'}`}
            >
              <Globe size={14} strokeWidth={2.5} /> English (USD $) <ChevronDown size={14} className={`transition-transform duration-300 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isLangDropdownOpen && (
              <div className={`absolute top-full right-0 mt-4 w-64 rounded-xl shadow-xl border p-5 z-50 transition-colors duration-300 cursor-default ${isDarkMode ? 'bg-[#1C1917] border-gray-800' : 'bg-white border-gray-100'}`}>

                <div className="mb-4 text-left">
                  <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Language</label>
                  <div className={`relative border rounded-lg overflow-hidden transition-colors duration-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${isDarkMode ? 'border-gray-700 bg-[#292524]' : 'border-gray-200 bg-white'}`}>
                    <select className={`w-full bg-transparent text-[13px] font-medium py-2.5 px-3 outline-none appearance-none cursor-pointer ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      <option className="text-gray-900">English</option>
                      <option className="text-gray-900">French</option>
                      <option className="text-gray-900">Spanish</option>
                    </select>
                    <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                </div>

                <div className="mb-5 text-left">
                  <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Currency</label>
                  <div className={`relative border rounded-lg overflow-hidden transition-colors duration-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${isDarkMode ? 'border-gray-700 bg-[#292524]' : 'border-gray-200 bg-white'}`}>
                    <select className={`w-full bg-transparent text-[13px] font-medium py-2.5 px-3 outline-none appearance-none cursor-pointer ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      <option className="text-gray-900">United States (USD $)</option>
                      <option className="text-gray-900">Euro (EUR €)</option>
                      <option className="text-gray-900">Pound (GBP £)</option>
                    </select>
                    <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                </div>

                <button
                  onClick={() => setIsLangDropdownOpen(false)}
                  className={`w-full font-bold py-2.5 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-[#E2E8F0] hover:bg-slate-300 text-gray-800'}`}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Layer 3: Main Header ── */}
      <div className={`w-full px-4 lg:px-10 py-4 lg:py-5 flex flex-col justify-center relative transition-colors duration-300 ${isDarkMode ? 'bg-[#0F172A]' : 'bg-tt-peach'}`}>

        {/* --- MOBILE LAYOUT (< lg) --- */}
        <div className="flex lg:hidden items-center justify-between w-full h-14 relative">
          {/* Left: Menu & Search */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex justify-center items-center transition-colors hover:opacity-80 ${isMobileMenuOpen ? 'text-tt-primary w-7 h-7' : 'flex-col items-start gap-[5px] w-7 h-7'}`}
            >
              {isMobileMenuOpen ? (
                <X size={30} strokeWidth={2.5} />
              ) : (
                <>
                  <span className={`block h-[2.5px] rounded-full w-6 transition-colors ${isDarkMode ? 'bg-gray-300' : 'bg-gray-900'}`}></span>
                  <span className={`block h-[2.5px] rounded-full w-4 transition-colors ${isDarkMode ? 'bg-gray-300' : 'bg-gray-900'}`}></span>
                  <span className={`block h-[2.5px] rounded-full w-6 transition-colors ${isDarkMode ? 'bg-gray-300' : 'bg-gray-900'}`}></span>
                </>
              )}
            </button>
            <button className={`transition-colors hover:opacity-80 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
              <Search size={25} strokeWidth={2.5} />
            </button>
          </div>

          {/* Center: Logo (Absolute Centered) */}
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
                  <div className="flex flex-col py-2">
                    {menuDropdownCategories.map((item, idx) => (
                      <Link
                        href="#"
                        key={idx}
                        className={`flex items-center justify-between px-5 py-3 border-b last:border-b-0 transition-colors group ${isDarkMode ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-50 hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-4">
                          {item.image ? (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-sm">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                              {item.icon && <item.icon size={20} className={item.iconColor} />}
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

          {/* Center: Search Bar */}
          <div className={`flex flex-1 max-w-3xl items-center border-2 rounded-full h-14 shadow-sm focus-within:border-tt-primary transition-all px-2 ${isDarkMode ? 'bg-[#292524] border-gray-700 text-white' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
            {/* Category Dropdown */}
            <div className={`flex items-center ml-1 px-4 h-10 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <select className={`bg-transparent text-[13px] font-bold outline-none cursor-pointer pr-6 appearance-none w-36 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                <option value="all" className="text-gray-900">All categories</option>
                {mockCategories.map((cat, i) => (
                  <option key={i} value={cat} className="text-gray-900">{cat}</option>
                ))}
              </select>
              <ChevronDown size={14} strokeWidth={2.5} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            {/* Input */}
            <input
              type="text"
              placeholder="What are you searching for?"
              className={`flex-1 bg-transparent px-5 text-sm outline-none font-medium ${isDarkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
            />
            {/* Icons */}
            <button className="p-2 mr-1 text-gray-400 hover:text-tt-primary transition-colors"><Mic size={22} /></button>
            <button className={`p-2.5 mr-1 rounded-full hover:text-tt-primary transition-colors shadow-sm border ${isDarkMode ? 'bg-tt-primary text-white border-tt-primary hover:bg-orange-600' : 'bg-white text-tt-text border-gray-100 hover:bg-gray-50'}`}><Search size={20} strokeWidth={2.5} /></button>
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
            <button className="text-gray-600 hover:text-tt-primary transition-colors">
              <MapPin size={26} strokeWidth={1.5} />
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
              <div className={`w-8 h-4.5 rounded-full relative flex items-center px-0.5 transition-colors ${isDarkMode ? 'bg-white/30' : 'bg-black/20'}`}>
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
          <button onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-70 transition-opacity p-1 bg-black/5 rounded-full dark:bg-white/10">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Menu Links */}
        <div className="flex flex-col w-full">
          {mockCategories.map((cat, i) => (
            <Link
              key={i}
              href="#"
              className={`flex items-center justify-between px-5 py-2.5 border-b text-[12px] font-bold transition-colors ${isDarkMode ? 'border-gray-800 text-gray-300 hover:text-tt-primary' : 'border-gray-100 text-[#1C1917] hover:text-tt-primary'}`}
            >
              {cat}
              <ChevronRight size={14} strokeWidth={2.5} className={isDarkMode ? 'text-gray-600' : 'text-gray-300'} />
            </Link>
          ))}
        </div>

        {/* Bottom Links */}
        <div className="mt-4 mb-12 w-full flex flex-col gap-0.5">
          <Link href="/about" className={`flex items-center gap-3 px-5 py-2.5 text-[12px] font-bold transition-colors ${isDarkMode ? 'text-gray-400 hover:text-tt-primary' : 'text-gray-600 hover:text-tt-primary'}`}>
            <span className="w-[15px] text-center text-[10px] opacity-40">•</span>
            About us
          </Link>
          <Link href="/shop" className={`flex items-center gap-3 px-5 py-2.5 text-[12px] font-bold transition-colors ${isDarkMode ? 'text-gray-400 hover:text-tt-primary' : 'text-gray-600 hover:text-tt-primary'}`}>
            <span className="w-[15px] text-center text-[10px] opacity-40">•</span>
            Shop
          </Link>
          <Link href="/contact" className={`flex items-center gap-3 px-5 py-2.5 text-[12px] font-bold transition-colors ${isDarkMode ? 'text-gray-400 hover:text-tt-primary' : 'text-gray-600 hover:text-tt-primary'}`}>
            <span className="w-[15px] text-center text-[10px] opacity-40">•</span>
            Contact Us
          </Link>

          <div className={`w-full h-px my-2 opacity-50 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div>

          <Link href="tel:+12345678901" className={`flex items-center gap-3 px-5 py-2.5 text-[12px] font-bold transition-colors ${isDarkMode ? 'text-gray-400 hover:text-tt-primary' : 'text-gray-600 hover:text-tt-primary'}`}>
            <Phone size={15} strokeWidth={2} />
            (+1) 2345678901
          </Link>
          <Link href="mailto:example@shopify.com" className={`flex items-center gap-3 px-5 py-2.5 text-[12px] font-bold transition-colors ${isDarkMode ? 'text-gray-400 hover:text-tt-primary' : 'text-gray-600 hover:text-tt-primary'}`}>
            <Mail size={15} strokeWidth={2} />
            example@shopify.com
          </Link>

          <div className="mt-8 flex justify-center w-full">
            <button className={`flex items-center gap-2 text-[12px] font-bold transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
              <Globe size={14} />
              English (USD $)
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>
      {/* ── Layer 4: Category Navigation ── */}
      <div className={`hidden lg:flex w-full items-center justify-center py-4 border-t space-x-12 text-[14px] font-extrabold transition-colors duration-300 ${isDarkMode ? 'border-gray-800 text-gray-200' : 'border-black/5 text-tt-text'}`}>

        <Link href="#" className="hover:text-tt-primary transition-colors relative flex items-center gap-1.5 group">
          Combo & Deals
          <span className="text-[9px] bg-orange-100 text-tt-primary font-bold px-2 py-0.5 rounded-sm absolute -top-3 -right-4 shadow-sm border border-orange-200">Deal</span>
          <ChevronDown size={14} strokeWidth={2.5} className="text-gray-400 group-hover:text-tt-primary transition-colors ml-0.5" />
        </Link>

        <Link href="#" className="hover:text-tt-primary transition-colors relative flex items-center gap-1.5 group">
          Bundle save
          <span className="text-[9px] bg-[#6366f1] text-white font-bold px-2 py-0.5 rounded-sm absolute -top-3 -right-4 shadow-sm">New</span>
          <ChevronDown size={14} strokeWidth={2.5} className="text-gray-400 group-hover:text-tt-primary transition-colors ml-0.5" />
        </Link>

        <Link href="#" className="hover:text-tt-primary transition-colors flex items-center gap-1.5 group">
          Shop by Category <ChevronDown size={14} strokeWidth={2.5} className="text-gray-400 group-hover:text-tt-primary transition-colors ml-0.5" />
        </Link>
        <Link href="#" className="hover:text-tt-primary transition-colors flex items-center gap-1.5 group">
          Food & Restaurant <ChevronDown size={14} strokeWidth={2.5} className="text-gray-400 group-hover:text-tt-primary transition-colors ml-0.5" />
        </Link>
        <Link href="#" className="hover:text-tt-primary transition-colors flex items-center gap-1.5 group">
          Meat & Fish <ChevronDown size={14} strokeWidth={2.5} className="text-gray-400 group-hover:text-tt-primary transition-colors ml-0.5" />
        </Link>
        <Link href="#" className="hover:text-tt-primary transition-colors flex items-center gap-1.5 group">
          Presets <ChevronDown size={14} strokeWidth={2.5} className="text-gray-400 group-hover:text-tt-primary transition-colors ml-0.5" />
        </Link>
        <Link href="#" className="hover:text-tt-primary transition-colors flex items-center gap-1.5 group">
          Template <ChevronDown size={14} strokeWidth={2.5} className="text-gray-400 group-hover:text-tt-primary transition-colors ml-0.5" />
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

      {/* Login Modal Integration */}
      <CustomerLoginModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}
