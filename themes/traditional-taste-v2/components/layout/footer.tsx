"use client";

import React from "react";
import { Phone, MapPin, Mail, Clock, Globe } from "lucide-react";

const Footer = () => {
  // Sourcing variables from the theme .env
  const accentBg = process.env.NEXT_PUBLIC_ACCENT_COLOR
    ? `#${process.env.NEXT_PUBLIC_ACCENT_COLOR}`
    : "#F97316";
  const textCharcoal = process.env.NEXT_PUBLIC_TEXT_CHARCOAL
    ? `#${process.env.NEXT_PUBLIC_TEXT_CHARCOAL}`
    : "#1C1917";

  // Changed background to Peach to cleanly separate the footer from your off-white main body canvas
  const bgPeach = process.env.NEXT_PUBLIC_BG_PEACH
    ? `#${process.env.NEXT_PUBLIC_BG_PEACH}`
    : "#FFEDD5";
  const logoUrl =
    process.env.NEXT_PUBLIC_LOGO_URL ||
    "https://mmcpdocs.s3.eu-west-2.amazonaws.com/66044_direct-logo.png";

  return (
    <footer
      style={{ backgroundColor: bgPeach, color: textCharcoal }}
      className="w-full font-sans pt-12 pb-6 border-t border-stone-300/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Newsletter Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-10 border-b border-stone-900/10">
          <div className="max-w-md">
            <h3 className="text-sm font-semibold tracking-wider uppercase opacity-70">
              Join our newsletter
            </h3>
            <p className="text-2xl md:text-3xl font-bold mt-1 tracking-tight">
              Get all latest information on events, sales and offers.
            </p>
          </div>
          <form
            className="w-full md:w-auto flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email"
              required
              className="w-full md:w-80 px-4 py-3 rounded-md bg-white/80 backdrop-blur-sm border border-stone-300 focus:outline-none focus:ring-2 transition-all text-stone-900 placeholder-stone-400"
              style={{ "--tw-ring-color": accentBg } as React.CSSProperties}
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-md font-medium transition-opacity hover:opacity-90 whitespace-nowrap shadow-sm"
              style={{ backgroundColor: accentBg, color: "#FFFFFF" }}
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Middle Section: Links & Store Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Brand & Contact Column */}
          <div className="flex flex-col gap-4">
            <img
              src={logoUrl}
              alt="Various Logo"
              className="h-10 w-auto object-contain self-start"
            />
            <div className="flex text-sm opacity-80 items-center gap-2.5">
              <Phone className="w-4 h-4 opacity-80" />

              <p>
                <span className="font-semibold">Phone:</span> (+84) 123 4567 89
              </p>
            </div>
            <div className="text-sm space-y-3 opacity-80 mt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <p>
                  <span className="font-semibold">Address:</span> 75 9th Ave,
                  New York, NY 10011-7006
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0" />
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  support@example.com
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 shrink-0" />
                <p>
                  <span className="font-semibold">Mon-Sat:</span> 9:00pm -
                  5:00pm
                </p>
              </div>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-base font-bold mb-4 uppercase tracking-wider text-xs opacity-90">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm opacity-80">
              <li>
                <a href="#" className="hover:underline transition-all">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition-all">
                  Our Team
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition-all">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition-all">
                  News & Article
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition-all">
                  Recipes
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Categories Column */}
          <div>
            <h4 className="text-base font-bold mb-4 uppercase tracking-wider text-xs opacity-90">
              Popular Categories
            </h4>
            <ul className="space-y-2.5 text-sm opacity-80">
              <li>
                <a href="#" className="hover:underline transition-all">
                  Meat & Fish
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition-all">
                  Fruit & Vegetables
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition-all">
                  Pantry staples
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition-all">
                  Dairy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition-all">
                  Bakery
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition-all">
                  Beverages
                </a>
              </li>
            </ul>
          </div>

          {/* Help and Support Column */}
          <div>
            <h4 className="text-base font-bold mb-4 uppercase tracking-wider text-xs opacity-90">
              Help and support
            </h4>
            <ul className="space-y-2.5 text-sm opacity-80">
              <li>
                <a href="#" className="hover:underline transition-all">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition-all">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition-all">
                  FAQ's
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition-all">
                  Track your order
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

        {/* Cursive Brand Statement Catchphrase */}
        <div className="text-center py-8 border-t border-stone-900/10">
          <p
            className="text-3xl md:text-4xl italic tracking-wide"
            style={{ fontFamily: "Georgia, serif" }}
          >
            This is everything you need in your pantry!
          </p>
        </div>

        {/* Bottom Section: Copyright & Payments */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-stone-900/10 text-xs opacity-70">
          <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-100 transition-opacity">
            <Globe className="w-4 h-4" />
            <span>English (USD $)</span>
          </div>

          <p>
            © {new Date().getFullYear()}, Maximize Various. Powered by Shopify
          </p>

          {/* Mock Payment Badges */}
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-stone-600">
            <span className="px-1.5 py-0.5 border border-stone-400/30 rounded bg-white/60">
              VISA
            </span>
            <span className="px-1.5 py-0.5 border border-stone-400/30 rounded bg-white/60">
              MC
            </span>
            <span className="px-1.5 py-0.5 border border-stone-400/30 rounded bg-white/60">
              DISC
            </span>
            <span className="px-1.5 py-0.5 border border-stone-400/30 rounded bg-white/60">
              PP
            </span>
            <span className="px-1.5 py-0.5 border border-stone-400/30 rounded bg-white/60">
              AMEX
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
