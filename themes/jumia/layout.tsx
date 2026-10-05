import React from 'react';
import { Search, User, HelpCircle, ShoppingCart, Star, ChevronDown, Monitor, Smartphone, Shirt, Home, Store, Dumbbell, Apple, Computer } from 'lucide-react';
import BackToTop from './back-to-top';
import FooterNewsletter from './footer-newsletter';
import FooterLinks from './footer-links';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f1f1f2] flex flex-col font-sans text-sm">
      {/* Top Banner */}
      <div className="bg-[#f1f1f2] text-gray-500 text-[11px] font-medium py-1 px-4 md:px-8 flex justify-between items-center border-b border-gray-200">
        <div className="flex gap-4 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-1 cursor-pointer hover:underline text-orange-500 font-bold">
            <Star size={12} className="fill-orange-500" /> Sell on Jumia
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center font-bold text-black tracking-tighter">
              JUMIA<Star size={10} className="text-orange-500 fill-orange-500 ml-[1px]"/>
            </div>
            <div className="flex items-center font-bold text-gray-400 opacity-60 tracking-tighter">
              PAY
            </div>
            <div className="flex items-center font-bold text-gray-400 opacity-60 tracking-tighter">
              DELIVERY
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Header Wrapper */}
      <div className="sticky top-0 z-50 w-full shadow-sm">
        {/* Main Header */}
        <header className="bg-white py-2">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-8">
          {/* Logo */}
          <a href="/" className="text-4xl font-black text-black tracking-tighter shrink-0 flex items-center pr-4">
            JUMIA<Star size={20} className="text-orange-500 fill-orange-500 ml-1" />
          </a>

          {/* Search Bar */}
          <div className="flex-grow flex items-center">
            <div className="flex w-full bg-[#f1f1f2] rounded-md overflow-hidden border border-transparent focus-within:border-gray-300 transition-colors h-10">
              <div className="px-3 flex items-center text-gray-500">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search products, brands and categories" 
                className="w-full bg-transparent outline-none text-[14px] font-medium text-gray-900 placeholder-gray-500 h-full"
              />
            </div>
            <button className="bg-[#f68b1e] hover:bg-[#e07b1a] text-white font-bold px-8 h-10 ml-2 rounded-md shadow-sm transition-colors text-[14px] uppercase tracking-wide">
              Search
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 shrink-0">
            <button className="flex items-center gap-2 hover:text-orange-500 font-bold text-[14px] transition-colors text-gray-900 px-2 py-2 rounded-md hover:bg-gray-100">
              <User size={22} className="stroke-[2]" />
              <span>Account</span>
              <ChevronDown size={18} className="text-gray-600 stroke-[2]" />
            </button>
            <button className="flex items-center gap-2 hover:text-orange-500 font-bold text-[14px] transition-colors text-gray-900 px-2 py-2 rounded-md hover:bg-gray-100">
              <HelpCircle size={22} className="stroke-[2]" />
              <span>Help</span>
              <ChevronDown size={18} className="text-gray-600 stroke-[2]" />
            </button>
            <button className="flex items-center gap-2 hover:text-orange-500 font-bold text-[14px] transition-colors text-gray-900 px-2 py-2 rounded-md hover:bg-gray-100">
              <ShoppingCart size={22} className="stroke-[2]" />
              <span>Cart</span>
            </button>
          </div>
        </div>
      </header>

      {/* Category Navigation Bar */}
      <nav className="bg-white border-t border-gray-100 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide text-gray-800">
          <a href="#" className="flex items-center gap-2 text-[13px] font-bold hover:text-orange-500 transition-colors">
            <Store size={18} className="stroke-[2]" /> Official Store
          </a>
          <a href="#" className="flex items-center gap-2 text-[13px] font-bold hover:text-orange-500 transition-colors">
            <Monitor size={18} className="stroke-[2]" /> Appliances
          </a>
          <a href="#" className="flex items-center gap-2 text-[13px] font-bold hover:text-orange-500 transition-colors">
            <Smartphone size={18} className="stroke-[2]" /> Phones & Tablets
          </a>
          <a href="#" className="flex items-center gap-2 text-[13px] font-bold hover:text-orange-500 transition-colors">
            <Dumbbell size={18} className="stroke-[2]" /> Health & Beauty
          </a>
          <a href="#" className="flex items-center gap-2 text-[13px] font-bold hover:text-orange-500 transition-colors">
            <Home size={18} className="stroke-[2]" /> Home & Office
          </a>
          <a href="#" className="flex items-center gap-2 text-[13px] font-bold hover:text-orange-500 transition-colors">
            <Monitor size={18} className="stroke-[2]" /> Electronics
          </a>
          <a href="#" className="flex items-center gap-2 text-[13px] font-bold hover:text-orange-500 transition-colors">
            <Shirt size={18} className="stroke-[2]" /> Fashion
          </a>
          <a href="#" className="flex items-center gap-2 text-[13px] font-bold hover:text-orange-500 transition-colors">
            <Apple size={18} className="stroke-[2]" /> Supermarket
          </a>
          <a href="#" className="flex items-center gap-2 text-[13px] font-bold hover:text-orange-500 transition-colors">
            <Computer size={18} className="stroke-[2]" /> Computing
          </a>
        </div>
      </nav>
      </div>

      {/* Main Content Area — aligned with nav (max-w-7xl px-4 md:px-8) */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-3">
        {children}
      </main>

      <footer className="mt-6">
        <FooterNewsletter />
        <FooterLinks />
      </footer>

      <BackToTop />
    </div>
  );
}
