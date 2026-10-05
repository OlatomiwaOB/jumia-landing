'use client';

import { ChevronUp } from 'lucide-react';
import { useScrollToTop } from '@/app/hooks/useScrollToTop';

// Jumia-style back-to-top button: white circle, orange ring, black chevron.
// Fades in once the page is scrolled past 300px and smooth-scrolls back to the top.
export default function BackToTop() {
  const { isVisible, scrollToTop } = useScrollToTop({ threshold: 300 });

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-[#f68b1e] flex items-center justify-center shadow-md hover:bg-[#fff4e8] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ChevronUp size={26} strokeWidth={3} className="text-black" />
    </button>
  );
}
