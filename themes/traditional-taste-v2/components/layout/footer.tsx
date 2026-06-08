"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, MapPin, Mail, Clock, Globe } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/newsletter/subscribe`;
      const payload = {
        email,
        name: "Subscriber",
        storeCode: process.env.NEXT_PUBLIC_STORE_CODE || '',
        entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || '',
        merchantCode: process.env.NEXT_PUBLIC_MERCHANT_CODE || ''
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-source-code': process.env.NEXT_PUBLIC_SOURCE_CODE || 'FORTITUDE',
          'x-client-id': process.env.NEXT_PUBLIC_CLIENT_ID || 'TST03054745785188010772',
          'x-client-secret': process.env.NEXT_PUBLIC_CLIENT_SECRET || 'TST03722175625334233555707073458615741827171811840881'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus('success');
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error("Subscription Error:", errData);
        setStatus('error');
        setMessage(`Failed: ${errData.message || 'Please try again.'}`);
      }
    } catch (err) {
      console.error("Network Error:", err);
      setStatus('error');
      setMessage("An error occurred. Please try again later.");
    }
  };

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
            className="w-full md:w-auto flex flex-col items-center sm:items-start"
            onSubmit={handleSubscribe}
          >
            <div className="flex flex-col sm:flex-row gap-3 w-full items-center">
              <input
                type="email"
                placeholder="Your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full md:w-80 px-4 py-3 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 transition-all text-white placeholder-white/50 text-center sm:text-left"
                style={{ "--tw-ring-color": accentBg } as React.CSSProperties}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto px-8 py-3 rounded-md font-bold transition-opacity hover:opacity-90 whitespace-nowrap shadow-sm disabled:opacity-50"
                style={{ backgroundColor: accentBg, color: "#FFFFFF" }}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {message && (
              <p className={`mt-3 text-sm font-medium ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
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
