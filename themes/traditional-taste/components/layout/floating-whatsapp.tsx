'use client';

import { useState } from 'react';
import { MessageCircle, X } from "lucide-react";

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      
      {/* Expanded Menu Options */}
      <div 
        className={`flex flex-col items-end gap-3 transition-all duration-500 origin-bottom ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'
        }`}
      >
        {/* WhatsApp Option */}
        <a 
          href="https://wa.me/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-4"
          aria-label="Chat on WhatsApp"
        >
          <span className="bg-white text-gray-800 px-4 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_15px_rgba(0,0,0,0.08)] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 border border-gray-50">
            WhatsApp
          </span>
          <div className="w-[54px] h-[54px] bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300 relative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-8 h-8 fill-current">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
            <div className="absolute inset-0 bg-white rounded-full opacity-0 hover:opacity-20 transition-opacity"></div>
          </div>
        </a>

        {/* Live Chat Option */}
        <button 
          className="group flex items-center gap-4"
          aria-label="Live Chat"
        >
          <span className="bg-white text-gray-800 px-4 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_15px_rgba(0,0,0,0.08)] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 border border-gray-50">
            Live Chat
          </span>
          <div className="w-[54px] h-[54px] bg-[#0F5A3E] text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(15,90,62,0.4)] hover:scale-110 transition-transform duration-300 relative">
            <MessageCircle size={24} strokeWidth={2.5} />
            <div className="absolute inset-0 bg-white rounded-full opacity-0 hover:opacity-20 transition-opacity"></div>
          </div>
        </button>
      </div>

      {/* Main Toggle Speed-Dial Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-[64px] h-[64px] bg-accent text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(227,89,32,0.4)] hover:shadow-[0_15px_40px_rgba(227,89,32,0.5)] hover:scale-105 transition-all duration-300 overflow-visible"
        aria-label="Toggle Support Menu"
      >
        <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'rotate-[135deg] scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
          <MessageCircle size={32} strokeWidth={2.5} />
        </div>
        <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-[135deg] scale-0 opacity-0'}`}>
          <X size={32} strokeWidth={3} />
        </div>

        {/* Subtle continuous pulse effect behind the button when closed */}
        {!isOpen && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-accent/60 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            <div className="absolute inset-0 rounded-full border border-accent/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
          </>
        )}
      </button>

    </div>
  );
}
