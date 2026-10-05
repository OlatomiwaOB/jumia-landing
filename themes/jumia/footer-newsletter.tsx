'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';

// Top band of the Jumia footer: logo, newsletter sign-up, app download.
// The logo / app icon / store badges are cropped with the footer colour (#313133) baked in,
// so keep the background in sync if it ever changes.
export default function FooterNewsletter() {
  const [consent, setConsent] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid e-mail address.' });
      return;
    }
    if (!consent) {
      setMessage({ type: 'error', text: 'Please tick the consent box to subscribe.' });
      return;
    }
    // TODO: hook up to the newsletter API
    setMessage({ type: 'success', text: 'Thanks for subscribing!' });
    setEmail('');
    setConsent(false);
  };

  return (
    <div className="w-full bg-[#313133] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Logo */}
        <a href="/" className="shrink-0 lg:w-[22%]">
          <img src="/images/footer/jumia_logo_white.png" alt="Jumia" className="h-7 md:h-8 w-auto" />
        </a>

        {/* Newsletter */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-[440px] text-[13px] md:text-sm leading-snug">
          <h3 className="font-bold uppercase">New to Jumia?</h3>
          <p className="mt-2">You can subscribe to our newsletter to get updates on our latest offers, deals and marketing campaigns.</p>
          <p className="mt-2">
            To subscribe to our newsletter, you must first read and agree to Jumia&apos;s{' '}
            <a href="#" className="text-[#f68b1e] hover:underline">Privacy Policy</a> and{' '}
            <a href="#" className="text-[#f68b1e] hover:underline">Cookie Notice</a>
          </p>

          <label className="flex items-center gap-2.5 mt-5 cursor-pointer select-none text-gray-400">
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="peer sr-only"
            />
            <span className="w-5 h-5 rounded border-2 border-white flex items-center justify-center shrink-0 peer-checked:bg-[#f68b1e] peer-checked:border-[#f68b1e] peer-focus-visible:ring-2 peer-focus-visible:ring-[#f68b1e]/60">
              {consent && (
                <svg viewBox="0 0 12 10" className="w-3 h-3" fill="none" stroke="white" strokeWidth="2">
                  <path d="M1 5l3.5 3.5L11 1" />
                </svg>
              )}
            </span>
            I consent to Jumia processing my data to send me newsletters.
          </label>

          <div className="flex gap-2 mt-4">
            <div className="flex items-center gap-3 bg-white rounded border border-gray-300 px-3 h-11 md:h-12 flex-1 max-w-[220px] focus-within:ring-2 focus-within:ring-[#f68b1e]/60">
              <Mail size={22} className="text-gray-400 shrink-0 fill-gray-400 stroke-white" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter E-mail Address"
                className="w-full min-w-0 bg-transparent outline-none text-gray-900 placeholder-gray-500 text-[15px] md:text-base"
              />
            </div>
            <button
              type="submit"
              className="px-5 md:px-6 h-11 md:h-12 rounded border border-white font-bold text-[13px] hover:bg-white hover:text-[#313133] transition-colors"
            >
              Subscribe
            </button>
          </div>

          {message && (
            <p className={`mt-2 text-xs ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message.text}</p>
          )}

          <p className="mt-8">
            You can withdraw your consent at any time by clicking the Unsubscribe Link at the bottom of any email we send you
          </p>
        </form>

        {/* App download */}
        <div className="lg:ml-auto shrink-0">
          <div className="flex items-start gap-3">
            <img src="/images/footer/jumia_app_icon.png" alt="" className="w-9 h-9 md:w-10 md:h-10 rounded" />
            <div>
              <h3 className="font-bold uppercase text-[13px] md:text-sm">Download Jumia Free App</h3>
              <p className="text-[13px] md:text-sm mt-1.5">Get access to exclusive offers!</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <a href="#" aria-label="Download on the App Store">
              <img src="/images/footer/app_store.png" alt="Download on the App Store" className="h-5 md:h-[22px] w-auto" />
            </a>
            <a href="#" aria-label="Get it on Google Play">
              <img src="/images/footer/google_play.png" alt="Get it on Google Play" className="h-5 md:h-[22px] w-auto" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
