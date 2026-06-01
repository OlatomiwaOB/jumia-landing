'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const reviews = [
  {
    id: 1,
    text: "This catering service stands out for its dedication to authentic Nigerian flavors and premium quality ingredients. It's rare to find such reliability and care in every single dish delivered.",
    author: "Sarah O.",
    location: "London, UK",
    avatar: "/images/mock/african_reviewer_1.png"
  },
  {
    id: 2,
    text: "The Asun Jollof Rice is absolutely phenomenal. The smoky flavor and perfect spice level made our weekend party an absolute hit. Highly recommended for any event!",
    author: "Michael T.",
    location: "Manchester, UK",
    avatar: "/images/mock/african_reviewer_2.png"
  },
  {
    id: 3,
    text: "The Postpartum Bundle was a complete lifesaver! The food was incredibly fresh, authentic, and saved me so much time. It felt exactly like having a personal chef.",
    author: "Grace A.",
    location: "Birmingham, UK",
    avatar: "/images/mock/african_reviewer_3.png"
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section className="w-full bg-accent-foreground py-24 md:py-32 overflow-hidden relative group">

      {/* Desktop Navigation Arrows (Positioned at extreme sides, visible on hover) */}
      <button
        onClick={handlePrev}
        className="hidden md:flex absolute left-4 md:left-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-gray-900 border border-gray-100 rounded-full items-center justify-center shadow-lg hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 pointer-events-auto"
        aria-label="Previous review"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        className="hidden md:flex absolute right-4 md:right-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-gray-900 border border-gray-100 rounded-full items-center justify-center shadow-lg hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 pointer-events-auto"
        aria-label="Next review"
      >
        <ChevronRight size={24} />
      </button>

      <div className="max-w-5xl mx-auto px-4 md:px-16 text-center relative z-10">

        {/* Stars */}
        <div className="flex items-center justify-center gap-1.5 mb-10">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={22} className="fill-[#F59E0B] text-[#F59E0B]" />
          ))}
        </div>

        {/* Carousel Container */}
        <div className="relative h-[300px] sm:h-[220px]">
          {reviews.map((review, index) => {
            let transformClass = '';
            if (index === activeIndex) {
              transformClass = 'opacity-100 translate-x-0 z-10';
            } else if (
              index === activeIndex - 1 ||
              (activeIndex === 0 && index === reviews.length - 1)
            ) {
              transformClass = 'opacity-0 -translate-x-16 pointer-events-none z-0'; // Previous item slides to/from the left
            } else {
              transformClass = 'opacity-0 translate-x-16 pointer-events-none z-0'; // Next item slides to/from the right
            }

            return (
              <div
                key={review.id}
                className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col items-center justify-start ${transformClass}`}
              >
                {/* Quote */}
                <p className="text-[22px] md:text-[30px] font-medium text-[#111] leading-relaxed mb-10 max-w-3xl px-4">
                  &quot; {review.text} &quot;
                </p>

                {/* Author Info */}
                <div className="flex flex-col items-center gap-4">
                  {/* Avatar */}
                  <div className="w-[70px] h-[70px] rounded-full overflow-hidden shadow-md relative">
                    <Image
                      src={review.avatar}
                      alt={review.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Name & Location */}
                  <div className="text-[15px] tracking-wide">
                    <span className="font-extrabold text-[#111]">{review.author}</span>
                    <span className="text-gray-400 font-medium"> - {review.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Action Dots */}
        <div className="flex md:hidden justify-center gap-2.5 mt-24 h-6 items-center relative z-20">
          {reviews.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setActiveIndex(dotIndex)}
              className="flex items-center justify-center w-6 h-6 pointer-events-auto"
              aria-label={`Go to slide ${dotIndex + 1}`}
            >
              {activeIndex === dotIndex ? (
                <div className="w-6 h-6 rounded-full border border-accent flex items-center justify-center">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                </div>
              ) : (
                <div className="w-2 h-2 bg-gray-400 rounded-full hover:bg-gray-500 transition-colors" />
              )}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
