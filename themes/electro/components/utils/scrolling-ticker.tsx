'use client';

import React from 'react';
import Link from 'next/link';

export default function ScrollingTicker() {
  const text = "A question? Visit our contact page to send us a message";
  
  // We repeat the text enough times to fill the screen twice, 
  // ensuring the animation loops seamlessly.
  const repeatedItems = Array(12).fill(text);

  return (
    <section className="w-full bg-white overflow-hidden py-6 border-y border-gray-200 relative flex items-center font-sans">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 25s linear infinite;
            display: flex;
            width: max-content;
          }
        `}
      </style>
      
      <div className="animate-marquee hover:[animation-play-state:paused]">
        {repeatedItems.map((item, i) => (
          <div key={i} className="flex items-center">
            <Link 
              href="/contact" 
              className="text-black font-extrabold text-[18px] md:text-[22px] tracking-wide hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              {item}
            </Link>
            {/* Spacer between phrases */}
            <span className="inline-block w-16 md:w-32" />
          </div>
        ))}
      </div>
    </section>
  );
}
