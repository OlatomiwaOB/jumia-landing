'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const faqs = [
    {
      question: "How long does shipping take for laptops and electronics?",
      answer: "Standard shipping takes 3-5 business days. Due to the high value of laptops and major electronics, these items are shipped with expedited tracking and require a signature upon delivery for your security."
    },
    {
      question: "Do your laptops and devices come with a warranty?",
      answer: "Yes! All our laptops and electronic devices come with a standard 1-year manufacturer warranty covering hardware defects. We also offer optional 2-year and 3-year extended protection plans at checkout."
    },
    {
      question: "What is your return policy for opened electronics?",
      answer: "We offer a 30-day return policy for most items. Laptops and electronic devices can be returned for a full refund if unopened. Opened items in like-new condition may be subject to a 15% restocking fee."
    },
    {
      question: "Do you offer technical support for new purchases?",
      answer: "Absolutely. Our expert tech support team is available 24/7 to help you set up your new laptop, troubleshoot software issues, or assist with device connectivity and configuration."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="w-full bg-white py-16 px-4 md:px-12 font-sans">
      <div className="max-w-[100rem] mx-auto bg-[#262626] rounded-[32px] p-10 md:p-20 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Text and Button */}
          <div className="flex flex-col justify-start">
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-8">
              Got questions? We've got answers!
            </h2>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-12 font-medium">
              If you can't find the answer you're looking for, don't hesitate to reach out to our friendly customer support team. We're here to assist you and ensure you have the best experience with our products and services.
            </p>
            <div>
              <Link 
                href="#"
                className="bg-[#ffca68] text-black text-[17px] font-extrabold px-10 py-4 rounded-xl shadow-lg hover:bg-[#e5b55d] transition-colors inline-block"
              >
                Contact us
              </Link>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="flex flex-col space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-2 border-blue-600' : 'border border-transparent'}`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 md:p-7 text-left focus:outline-none"
                  >
                    <span className="text-black font-extrabold text-[16px] md:text-[18px]">
                      {faq.question}
                    </span>
                    <span className="ml-4 flex-shrink-0 text-black">
                      {isOpen ? <ChevronUp size={24} strokeWidth={3} /> : <ChevronDown size={24} strokeWidth={3} />}
                    </span>
                  </button>
                  
                  {/* Dropdown Answer */}
                  <div 
                    className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0'} overflow-hidden px-5 md:px-6`}
                  >
                    <p className="text-gray-600 text-sm">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
