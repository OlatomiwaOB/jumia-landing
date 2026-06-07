"use client";

import React from "react";
import Link from "next/link";
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
        {/* Top Section: Newsletter Banner */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 pb-10 border-b border-white/10">
          <div className="max-w-md w-full flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold tracking-wider uppercase opacity-70">
              Join our newsletter
            </h3>
            <p className="text-2xl md:text-3xl font-bold mt-1 tracking-tight">
              Get all latest information on events, sales and offers.
            </p>
          </div>
          <form
            className="w-full md:w-auto flex flex-col sm:flex-row gap-3 items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email"
              required
              className="w-full md:w-80 px-4 py-3 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 transition-all text-white placeholder-white/50 text-center sm:text-left"
              style={{ "--tw-ring-color": accentBg } as React.CSSProperties}
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-md font-bold transition-opacity hover:opacity-90 whitespace-nowrap shadow-sm"
              style={{ backgroundColor: accentBg, color: "#FFFFFF" }}
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Middle Section: Links & Store Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Brand & Contact Column */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-6 md:col-span-2 md:pr-12">
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
            
            <div className="text-[15px] space-y-4 opacity-80 w-full max-w-sm">
              <div className="flex items-center md:items-start justify-center md:justify-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 opacity-80" />
                <p>
                  <span className="font-semibold block sm:inline">Address: </span> 
                  75 9th Ave, New York, NY 10011-7006
                </p>
              </div>
              <div className="flex items-center md:items-start justify-center md:justify-start gap-3">
                <Phone className="w-5 h-5 shrink-0 opacity-80" />
                <p>
                  <span className="font-semibold block sm:inline">Phone: </span> 
                  (+84) 123 4567 89
                </p>
              </div>
              <div className="flex items-center md:items-start justify-center md:justify-start gap-3">
                <Mail className="w-5 h-5 shrink-0 opacity-80" />
                <p>
                  <span className="font-semibold block sm:inline">Email: </span> 
                  support@traditional-taste.com
                </p>
              </div>
              <div className="flex items-center md:items-start justify-center md:justify-start gap-3">
                <Clock className="w-5 h-5 shrink-0 opacity-80" />
                <p>
                  <span className="font-semibold block sm:inline">Hours: </span> 
                  Mon-Sat: 9:00am - 5:00pm
                </p>
              </div>
            </div>
          </div>

          {/* Company and Support Columns - Side by Side on Mobile */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2 w-full pt-4 md:pt-0">
            {/* Company Column */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-base font-bold mb-5 uppercase tracking-wider opacity-90">
                Company
              </h4>
              <ul className="space-y-4 text-[15px] opacity-80 text-center md:text-left">
                <li>
                  <a href="#" className="hover:underline transition-all">
                    About Us
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline transition-all">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-base font-bold mb-5 uppercase tracking-wider opacity-90">
                Support
              </h4>
              <ul className="space-y-4 text-[15px] opacity-80 text-center md:text-left">
                <li>
                  <a href="#" className="hover:underline transition-all">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline transition-all">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline transition-all">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Payments */}
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 text-[13px] opacity-70 text-center">
          <p>
            © {new Date().getFullYear()}, Traditional Taste. Powered by Shopify.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-100 transition-opacity font-medium">
              <Globe className="w-4 h-4" />
              <span>English (USD $)</span>
            </div>

            {/* Mock Payment Badges */}
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest text-white/80 flex-wrap">
              <span className="px-2 py-1 border border-white/20 rounded-md bg-white/10">VISA</span>
              <span className="px-2 py-1 border border-white/20 rounded-md bg-white/10">MC</span>
              <span className="px-2 py-1 border border-white/20 rounded-md bg-white/10">DISC</span>
              <span className="px-2 py-1 border border-white/20 rounded-md bg-white/10">PP</span>
              <span className="px-2 py-1 border border-white/20 rounded-md bg-white/10">AMEX</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
