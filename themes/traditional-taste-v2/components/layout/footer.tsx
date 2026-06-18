"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Mail, Clock, Globe } from "lucide-react";

const Footer = () => {


  // Sourcing variables from the theme .env
  const accentBg = process.env.NEXT_PUBLIC_ACCENT_COLOR
    ? `#${process.env.NEXT_PUBLIC_ACCENT_COLOR}`
    : "#F97316";
  const textCharcoal = process.env.NEXT_PUBLIC_TEXT_CHARCOAL
    ? `#${process.env.NEXT_PUBLIC_TEXT_CHARCOAL}`
    : "#1C1917";

  const textOffWhite = process.env.NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR
    ? `#${process.env.NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR}`
    : "#FFFFFF";
  const logoUrl =
    process.env.NEXT_PUBLIC_LOGO_URL ||
    "https://mmcpdocs.s3.eu-west-2.amazonaws.com/66044_direct-logo.png";

  return (
    <footer
      style={{ backgroundColor: textCharcoal, color: textOffWhite }}
      className="w-full font-sans pt-12 pb-8 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Top Section: Links & Store Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-14 border-b border-white/10">
          
          {/* Column 1: Brand & Badge */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/traditional-taste-logo.jpg"
                alt="Traditional Taste Logo"
                className="h-16 w-auto object-contain rounded-full shadow-md border-2 border-white/20"
              />
              <span
                className="font-bold text-2xl tracking-wide italic"
                style={{ fontFamily: "Georgia, serif", color: accentBg }}
              >
                Traditional Taste
              </span>
            </div>
            <p className="text-[14px] opacity-80 leading-relaxed max-w-[300px]">
              Authentic African cuisine, freshly prepared and delivered straight to your door. Experience the true taste of tradition.
            </p>
            
            {/* Food Hygiene Rating Badge (Pure CSS Replica for maximum professionalism) */}
            <div className="mt-2 w-full flex justify-center md:justify-start">
                <a
                  href="https://www.food.gov.uk/safety-hygiene/food-hygiene-rating-scheme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[260px] rounded-[10px] shadow-2xl hover:scale-105 transition-transform duration-300 overflow-hidden flex flex-col font-sans border border-white/20 select-none"
                >
                  {/* Top Black Section */}
                  <div className="bg-[#1A1A1A] text-white p-3 flex justify-between items-center h-[55px]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-8 bg-white/10 rounded-[2px] border border-white/20 flex flex-col justify-evenly p-[2px]">
                        <div className="h-1 bg-white/80 rounded-full w-full"></div>
                        <div className="h-1 bg-white/80 rounded-full w-full"></div>
                        <div className="h-1 bg-white/80 rounded-full w-3/4"></div>
                      </div>
                      <div className="text-[9px] font-bold leading-tight tracking-wide">
                        Food<br />Standards<br />Agency
                      </div>
                    </div>
                    <div className="text-[7px] text-right text-gray-400 max-w-[80px] leading-tight">
                      This scheme is operated in partnership with your local authority
                    </div>
                  </div>

                  {/* Bottom Green Section */}
                  <div className="bg-[#7AC142] p-3 text-[#1A1A1A] flex flex-col h-[95px] relative">
                    <h4 className="text-[17px] font-black tracking-tighter uppercase mb-1">
                      Food Hygiene Rating
                    </h4>
                    <div className="w-full h-[2px] bg-[#1A1A1A] mb-2 relative">
                      <div className="absolute -bottom-[6px] right-[40px] w-3 h-3 bg-[#1A1A1A] rotate-45"></div>
                    </div>

                    <div className="flex justify-between items-center mt-1 pr-1">
                      {[0, 1, 2, 3, 4].map((num) => (
                        <div key={num} className="w-7 h-7 rounded-full border-[1.5px] border-[#1A1A1A] flex items-center justify-center text-[13px] font-bold">
                          {num}
                        </div>
                      ))}
                      <div className="flex flex-col items-center -mt-2">
                        <div className="w-11 h-11 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[26px] font-black shadow-lg z-10">
                          5
                        </div>
                        <span className="text-[8px] font-bold mt-0.5 tracking-wider uppercase">Very Good</span>
                      </div>
                    </div>
                  </div>
                </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right md:pr-4 pt-4 md:pt-0">
            <h4 className="text-base font-bold mb-6 uppercase tracking-wider opacity-90">
              Quick Links
            </h4>
            <ul className="space-y-4 text-[15px] opacity-80">
              <li className="hidden md:block">
                <Link href="/" className="hover:text-white hover:underline transition-all">
                  Home
                </Link>
              </li>
              <li className="hidden md:block">
                <Link href="/shop" className="hover:text-white hover:underline transition-all">
                  Shop Now
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white hover:underline transition-all">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:underline transition-all">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright & Payments */}
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 text-[13px] opacity-70 text-center">
          <p>
            © {new Date().getFullYear()}, Traditional Taste. Powered by Shopify.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">

            {/* Mock Payment Badges */}
            <div className="flex items-center justify-center gap-2.5 text-[11px] font-bold tracking-wider flex-wrap">
              {/* AMEX */}
              <div className="px-2.5 py-1.5 bg-[#2A75B8] text-white border border-[#3B8DD8] rounded-[6px] shadow-sm select-none">
                AMEX
              </div>
              {/* Mastercard */}
              <div className="px-3 py-1.5 bg-[#3B433E] border border-[#525B56] rounded-[6px] shadow-sm flex items-center justify-center select-none">
                <div className="flex -space-x-2 items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] z-10"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] mix-blend-screen"></div>
                </div>
              </div>
              {/* VISA */}
              <div className="px-3 py-1.5 bg-[#14142B] text-white border border-[#2A2A44] rounded-[6px] shadow-sm italic text-[12px] select-none">
                VISA
              </div>
              {/* PayPal */}
              <div className="px-2.5 py-1.5 bg-[#003087] text-white border border-[#004BCA] rounded-[6px] shadow-sm italic text-[12px] select-none">
                <span className="font-bold">Pay</span><span className="font-semibold text-blue-200">Pal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
