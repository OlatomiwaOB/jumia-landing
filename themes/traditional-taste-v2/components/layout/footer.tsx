"use client";


import { clientConfig } from '@/config/client-config';
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Mail, Clock, Globe } from "lucide-react";

const Footer = () => {


  // Sourcing variables from the theme .env
  const accentBg = clientConfig().branding.colors.accent
    ? `#${clientConfig().branding.colors.accent}`
    : "#F97316";
  const textCharcoal = clientConfig().branding.colors.textCharcoal
    ? `#${clientConfig().branding.colors.textCharcoal}`
    : "#1C1917";

  const textOffWhite = clientConfig().branding.colors.accentForeground
    ? `#${clientConfig().branding.colors.accentForeground}`
    : "#FFFFFF";
  const logoUrl =
    clientConfig().branding.logos.primary ||
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

            {/* Social Links */}
            <h4 className="text-base font-bold mb-4 uppercase tracking-wider opacity-90 mt-8">
              Follow Us
            </h4>
            <div className="flex justify-center md:justify-end gap-4">
              <a href="https://www.instagram.com/traditionaltastez" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#E4405F] hover:border-white transition-all duration-300">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
              <a href="https://wa.me/447721542823" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#25D366] hover:border-white transition-all duration-300">
                <svg fill="currentColor" viewBox="0 0 448 512" className="w-4 h-4">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
              </a>
            </div>
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
