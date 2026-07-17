'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp, Phone, Mail, Facebook, Instagram, Youtube, ChevronDown } from 'lucide-react';

const navigation = {
  collections: [
    { name: 'Amplifiers', href: '#' },
    { name: 'Headphones', href: '#' },
    { name: 'Home Audio', href: '#' },
    { name: 'Microphones', href: '#' },
    { name: 'Mouse', href: '#' },
  ],
  sales: [
    { name: 'Bass Amplifier SKB2511', href: '#' },
    { name: 'SkyBuds SKB2518', href: '#' },
    { name: 'SonicMove SM1312', href: '#' },
    { name: 'WaveJive WJ1231', href: '#' },
    { name: 'SonicBlu SN5599', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Contact Us', href: '#' },
    { name: 'Investors', href: '#' },
  ],
  other: [
    { name: 'FAQs', href: '#' },
    { name: 'Return & Refund', href: '#' },
    { name: 'Shipping', href: '#' },
    { name: 'Become A Partner', href: '#' },
  ]
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-gray-100 font-sans pb-16 pt-8">
      <div className="mx-auto max-w-[100rem] px-6 md:px-12">

        {/* Back to Top */}
        <div className="pb-10">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 rounded-none px-5 py-2.5 text-black font-extrabold tracking-wide text-sm hover:bg-gray-100 transition-colors"
          >
            Back to top
            <ArrowUp size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Top Footer Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-10 pb-16">

          {/* About us */}
          <div className="lg:pr-8">
            <h3 className="font-bold text-black mb-6 text-[15px]">About us</h3>
            <div className="mb-6 flex items-center">
              <span className="font-black text-4xl tracking-tighter text-[#1c1c1c] uppercase">WAREH</span>
              {/* Custom 'O' logo component */}
              <div className="relative mx-0.5 w-[26px] h-[26px] border-[5px] border-[#1c1c1c] rounded-full mt-1">
                <div className="absolute -inset-[6px] rounded-full border-[3.5px] border-transparent border-t-[#ffca68] border-r-[#ffca68] transform rotate-45"></div>
                <div className="absolute inset-0 m-auto w-[6px] h-[6px] bg-[#1c1c1c] rounded-full"></div>
              </div>
              <span className="font-black text-4xl tracking-tighter text-[#1c1c1c] uppercase ml-0.5">USE</span>
            </div>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Every day is an evolution. Since our launch in 2013, we've explored and curated the tools for your continual transformation—on an emotional, physical, intellectual and spiritual level.
            </p>
          </div>

          {/* Contact us */}
          <div>
            <h3 className="font-bold text-black mb-6 text-[15px]">Contact us</h3>
            <ul className="space-y-5">
              <li className="flex items-center gap-3 text-[#1c1c1c] font-medium text-[15px]">
                <Phone size={20} strokeWidth={2} />
                +1234567890
              </li>
              <li className="flex items-center gap-3 text-[#1c1c1c] font-medium text-[15px]">
                <Mail size={20} strokeWidth={2} />
                hello@yourstore.com
              </li>
            </ul>
          </div>

          {/* Follow us */}
          <div>
            <h3 className="font-bold text-black mb-6 text-[15px]">Follow us</h3>
            <div className="flex gap-4">
              <a href="#" className="w-[42px] h-[42px] rounded-full bg-[#ffca68] flex items-center justify-center text-[#1c1c1c] hover:bg-[#e0b25c] transition-colors">
                <Facebook size={20} strokeWidth={2} />
              </a>
              <a href="#" className="w-[42px] h-[42px] rounded-full bg-[#ffca68] flex items-center justify-center text-[#1c1c1c] hover:bg-[#e0b25c] transition-colors">
                {/* Custom X Logo */}
                <span className="font-bold text-[19px]">X</span>
              </a>
              <a href="#" className="w-[42px] h-[42px] rounded-full bg-[#ffca68] flex items-center justify-center text-[#1c1c1c] hover:bg-[#e0b25c] transition-colors">
                <Instagram size={20} strokeWidth={2} />
              </a>
              <a href="#" className="w-[42px] h-[42px] rounded-full bg-[#ffca68] flex items-center justify-center text-[#1c1c1c] hover:bg-[#e0b25c] transition-colors">
                <Youtube size={20} strokeWidth={2} />
              </a>
            </div>
          </div>

          {/* Stay in touch (Newsletter) */}
          <div className="bg-[#ffca68] p-7 rounded-lg border border-black/5 shadow-sm">
            <h3 className="font-bold text-[#1c1c1c] text-lg mb-2">Stay in touch</h3>
            <p className="text-[#1c1c1c]/80 text-[15px] mb-5 leading-snug">
              Sign up for newsletter and get 20% sale coupon
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-[#222222] text-white border-none outline-none rounded-md px-4 py-3.5 text-[15px] placeholder:text-gray-400 focus:ring-2 focus:ring-black"
                required
              />
              <button
                type="submit"
                className="w-full bg-white text-[#1c1c1c] font-bold py-3.5 rounded-md text-[15px] hover:bg-gray-50 transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Links Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-12 border-t border-gray-100">
          <div>
            <h3 className="font-bold text-[#1c1c1c] mb-6 text-[15px]">Our Collections</h3>
            <ul className="space-y-4">
              {navigation.collections.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-500 text-[15px] hover:text-black transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[#1c1c1c] mb-6 text-[15px]">Sales</h3>
            <ul className="space-y-4">
              {navigation.sales.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-500 text-[15px] hover:text-black transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[#1c1c1c] mb-6 text-[15px]">Our Company</h3>
            <ul className="space-y-4">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-500 text-[15px] hover:text-black transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[#1c1c1c] mb-6 text-[15px]">Other</h3>
            <ul className="space-y-4">
              {navigation.other.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-500 text-[15px] hover:text-black transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-start gap-8">

          {/* Left Side: Dropdowns & Payment Icons */}
          <div className="flex flex-col gap-6 w-full md:w-auto">
            <div className="flex gap-4 w-full md:w-auto">
              {/* Language Dropdown */}
              <button className="flex items-center justify-between gap-3 bg-[#1c1c1c] text-white px-5 py-2.5 rounded-md text-[15px] font-bold min-w-[120px]">
                English
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              {/* Currency Dropdown */}
              <button className="flex items-center justify-between gap-3 bg-[#1c1c1c] text-white px-5 py-2.5 rounded-md text-[15px] font-bold min-w-[200px]">
                United States (USD $)
                <ChevronDown size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Right Side: Links & Copyright */}
          <div className="flex flex-col md:items-end gap-3 w-full md:w-auto mt-2 md:mt-0">
            {/* Links */}
            <div className="flex gap-6 text-gray-500 text-[14px]">
              <Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-black transition-colors">Terms and Conditions</Link>
            </div>

            {/* Payment Icons */}
            <div className="flex gap-2.5 mt-1">
              <div className="w-[48px] h-[30px] bg-[#14226d] rounded flex items-center justify-center text-white text-[13px] font-bold">VISA</div>
              <div className="w-[48px] h-[30px] bg-[#1c1c1c] rounded flex items-center justify-center relative overflow-hidden">
                <div className="w-[18px] h-[18px] bg-[#ff5f00] rounded-full absolute -left-0.5 mix-blend-screen opacity-90"></div>
                <div className="w-[18px] h-[18px] bg-[#eb001b] rounded-full absolute left-4 mix-blend-screen opacity-90"></div>
              </div>
              <div className="w-[48px] h-[30px] bg-[#0079c1] rounded flex items-center justify-center text-white text-[11px] font-black italic tracking-tighter">AMEX</div>
              <div className="w-[48px] h-[30px] bg-white border border-gray-200 rounded flex items-center justify-center text-[#003087] text-[12px] font-bold italic">PayPal</div>
            </div>


          </div>
        </div>

      </div>
    </footer>
  );
}
