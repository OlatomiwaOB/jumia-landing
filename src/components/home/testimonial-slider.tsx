"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import stars from "@/components/images/stars.png";
import rene from "@/components/images/rene.png";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
}

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "Love the simplicity of the service and the prompt customer support. We can't imagine working without it.",
      author: "Renee Wells"
    },
    {
      id: 2,
      quote: "The product has completely transformed our workflow. The support team is incredibly responsive.",
      author: "Michael Chen"
    },
    {
      id: 3,
      quote: "Exceptional quality and service. Would recommend to anyone looking for reliable solutions.",
      author: "Sarah Johnson"
    }
  ];

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#313133] text-white rounded-lg shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-start"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 p-4">
                <p className="mb-6">
                    <img src={stars.src} alt="5" className="" />
                </p>
                <p className="text-xl md:text-2xl font-light mb-6">
                "{testimonials[currentIndex].quote}"
                </p>
                <p className="text-lg font-medium">
                – {testimonials[currentIndex].author}
                </p>
            </div>
            <div>
                <motion.img
                src={rene.src}
                alt="Renee Wells"
                className="object-cover w-[800px] h-[350px] rounded-lg shadow-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination dots */}
      <div className="absolute bottom-5 left-5 flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentIndex === index ? 'bg-white' : 'bg-[#ff9e76] hover:bg-gray-400'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}