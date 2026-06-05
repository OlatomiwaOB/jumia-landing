'use client';

import { useState, useEffect } from 'react';
import { ChevronsUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    // Show button when page is scrolled down
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    // Calculate scroll progress percentage (0 to 100)
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    
    if (docHeight > winHeight) {
      const scrollPercent = scrollTop / (docHeight - winHeight);
      setScrollProgress(Math.min(100, Math.max(0, Math.round(scrollPercent * 100))));
    } else {
      setScrollProgress(0);
    }
  };

  // Scroll to the top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check in case the page is reloaded halfway down
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // SVG Circle calculations
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  // Offset goes from circumference (0%) to 0 (100%)
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className={`fixed bottom-6 right-6 z-[90] transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
    }`}>
      <button
        type="button"
        onClick={scrollToTop}
        className="relative flex items-center justify-center w-[54px] h-[54px] rounded-full bg-accent3 text-white shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:opacity-90 transition-all group active:scale-95"
        aria-label="Scroll to top"
      >
        {/* Progress SVG Ring */}
        <svg 
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" 
          viewBox="0 0 54 54"
        >
          {/* Background Track */}
          <circle 
            cx="27" cy="27" r={radius} 
            fill="none" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="2.5" 
          />
          {/* Moving Color Progress Line */}
          <circle 
            cx="27" cy="27" r={radius} 
            fill="none" 
            className="text-accent transition-all duration-150 ease-out"
            stroke="currentColor"
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <ChevronsUp size={24} strokeWidth={2.5} className="group-hover:-translate-y-1 transition-transform duration-300 relative z-10" />
      </button>
    </div>
  );
}
