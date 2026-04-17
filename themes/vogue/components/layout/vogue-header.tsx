"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useCart } from "@/store/cart";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import CustomerLoginModal from "@/components/ui/customer-login-modal";
import useCustomer from '@/store/customerStore';
import CartWrapper from '@/components/ui/cart-wrapper';
import { SheetTrigger } from '@/components/ui/sheet';
import Cart from '@/components/ui/cart';

export function VogueHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { data: categoriesData } = useCategories();
  const { totalItems } = useCart();
  const { customer } = useCustomer();
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeCode = searchParams?.get("storeCode") || "";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const categories = categoriesData?.categories || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}&storeCode=${storeCode}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Top bar with logo and main actions */}
        <div className="flex items-center justify-between py-4">
          <div className="flex-1 md:hidden">
            <button onClick={() => setIsMenuOpen(true)}>
              <Menu className="w-6 h-6 text-gray-800" />
            </button>
          </div>

          <div className="flex-1 flex justify-center md:justify-start">
            <Link href="/" className="text-3xl font-serif tracking-widest text-gray-900">
              vogue
            </Link>
          </div>

          <div className="flex-1 hidden md:flex items-center justify-center space-x-8 text-[11px] font-bold tracking-[0.2em] uppercase">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.code}
                href={`/shop/${cat.code}?storeCode=${storeCode}`}
                className="hover:text-accent transition-colors relative group"
              >
                {cat.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex-1 flex items-center justify-end space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-gray-500">
              <span className="flex items-center cursor-pointer">
                NGN <ChevronDown className="w-3 h-3 ml-1" />
              </span>
            </div>
            
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-800 hover:text-accent transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => customer?.firstname ? router.push('/dashboard') : setIsLoginOpen(true)} 
              className="text-gray-800 hover:text-accent transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
            <CartWrapper>
              <SheetTrigger className="relative text-gray-800 hover:text-accent transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {isMounted && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </SheetTrigger>
              <Cart />
            </CartWrapper>
          </div>
        </div>
      </div>
      
      <CustomerLoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-2xl font-serif tracking-widest">vogue</span>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col space-y-6 uppercase text-sm font-medium tracking-tight">
                {categories.map((cat) => (
                  <Link
                    key={cat.code}
                    href={`/shop/${cat.code}?storeCode=${storeCode}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-gray-500"
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-4 z-[40]"
          >
            <form onSubmit={handleSearch} className="container mx-auto max-w-2xl flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-sm py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" onClick={() => setIsSearchOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
