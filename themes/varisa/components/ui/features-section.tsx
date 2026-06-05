'use client';

import { useState, useRef, useEffect } from 'react';

const features = [
  {
    title: "Shipping",
    desc1: "Meals are shipped on every Wednesday for next day delivery.",
    desc2: "Pre-orders close at 9am on Sundays, orders placed after that will be shipped the following week",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    )
  },
  {
    title: "Allergen Disclaimer",
    desc1: "While we take every care to prevent cross-contamination, all our dishes are prepared in a kitchen that handles peanuts, tree nuts, gluten, eggs, dairy, soya, fish, crustaceans, molluscs, celery, mustard, sesame, lupin, and sulphites.",
    desc2: "Therefore, we cannot guarantee that any product is completely free from traces of these allergens. Please inform us of any allergies or dietary requirements before placing your order.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    )
  },
  {
    title: "Support Online",
    desc1: "We support customers 24/7, send questions we will solve for you immediately.",
    desc2: "",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    )
  }
];

export default function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = Math.abs(scrollRef.current.scrollLeft);
      const width = scrollRef.current.clientWidth;
      // Calculate which slide is currently mostly in view
      const newIndex = Math.round(scrollLeft / width);
      setActiveIndex(newIndex);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
    }
  };

  const directionRef = useRef(1);

  // Auto-play functionality for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
        
        // Only auto-scroll if the container is actually scrollable (mobile view)
        if (scrollWidth > clientWidth) {
          const currentIndex = Math.round(scrollLeft / clientWidth);
          let nextIndex = currentIndex + directionRef.current;
          
          // Reverse direction at the ends (Ping-Pong effect)
          if (nextIndex >= features.length) {
            directionRef.current = -1;
            nextIndex = currentIndex - 1;
          } else if (nextIndex < 0) {
            directionRef.current = 1;
            nextIndex = currentIndex + 1;
          }
          
          scrollTo(nextIndex);
        }
      }
    }, 4000); // Scroll every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-transparent font-sans -mt-8 md:mt-0 relative z-10">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-3 md:py-16">
        
        {/* Carousel / Grid Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-4 gap-0 md:gap-8 text-center overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 md:pb-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center min-w-full md:min-w-0 snap-center shrink-0 px-2 md:px-4 ${idx === 1 ? 'md:col-span-2' : 'md:col-span-1'}`}
            >
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-2 md:mb-5 text-accent transition-transform hover:scale-110 duration-300 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-[14px] md:text-lg font-bold text-accent3 mb-1 md:mb-3">{feature.title}</h3>
              <p className={`text-[12px] md:text-[14px] text-gray-500 mx-auto leading-snug md:leading-relaxed ${idx === 1 ? 'md:max-w-2xl max-w-[340px]' : 'max-w-[340px] md:max-w-sm'}`}>
                {feature.desc1}
              </p>
              {feature.desc2 && (
                <p className={`text-[12px] md:text-[14px] text-gray-500 mx-auto leading-snug md:leading-relaxed mt-1 md:mt-2 ${idx === 1 ? 'md:max-w-2xl max-w-[340px]' : 'max-w-[340px] md:max-w-sm'}`}>
                  {feature.desc2}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex md:hidden justify-center items-center gap-2 mt-4">
          {features.map((_, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className="transition-all flex items-center justify-center"
                aria-label={`Go to slide ${idx + 1}`}
              >
                {isActive ? (
                  <div className="w-6 h-6 rounded-full border border-accent flex items-center justify-center">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                  </div>
                ) : (
                  <div className="w-2 h-2 bg-gray-400 rounded-full hover:bg-gray-500 transition-colors" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
