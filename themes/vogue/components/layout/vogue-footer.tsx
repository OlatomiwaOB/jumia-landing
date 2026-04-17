"use client";

import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube, Minus, Send } from "lucide-react";

export function VogueFooter() {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Email Subscription */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-serif mb-4 italic text-gray-800">Join our email list</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm">
              Get exclusive deals, discounts and early access to new products.
            </p>
            <form className="relative max-w-md group">
              <input
                type="email"
                placeholder="Email address"
                className="w-full border-b border-gray-200 py-3 pr-10 text-sm outline-none focus:border-gray-900 transition-colors"
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-900 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <nav className="flex flex-col space-y-3">
              <Link href="/contact" className="text-sm italic font-serif text-gray-800 hover:text-gray-500 underline underline-offset-4 decoration-gray-200">Contact Information</Link>
              <Link href="/privacy" className="text-sm italic font-serif text-gray-800 hover:text-gray-500 underline underline-offset-4 decoration-gray-200">Privacy Policy</Link>
              <Link href="/refund" className="text-sm italic font-serif text-gray-800 hover:text-gray-500 underline underline-offset-4 decoration-gray-200">Refund Policy</Link>
              <Link href="/shipping" className="text-sm italic font-serif text-gray-800 hover:text-gray-500 underline underline-offset-4 decoration-gray-200">Shipping Policy</Link>
              <Link href="/terms" className="text-sm italic font-serif text-gray-800 hover:text-gray-500 underline underline-offset-4 decoration-gray-200">Terms of Service</Link>
              <Link href="/size-guide" className="text-sm italic font-serif text-gray-800 hover:text-gray-500 underline underline-offset-4 decoration-gray-200">Size Guide</Link>
            </nav>
          </div>

          {/* Payment & Social */}
          <div className="flex flex-col justify-between">
            <div className="flex flex-wrap gap-4 mb-8">
              {/* Mock Payment Icons */}
              <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center text-[8px] font-bold text-gray-400">VISA</div>
              <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center text-[8px] font-bold text-gray-400">MC</div>
              <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center text-[8px] font-bold text-gray-400">APPLE</div>
              <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center text-[8px] font-bold text-gray-400">SHOP</div>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-800 hover:text-gray-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-500 transition-colors">
                <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center text-[10px] text-white">f</div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest gap-4">
          <p>© 2026 VOGUE WEARABLES. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-4">
            <span>ENGLISH (US)</span>
            <span>NGN - Nigerian Naira</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
