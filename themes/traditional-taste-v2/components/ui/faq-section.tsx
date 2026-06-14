"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I place an order?",
    answer: "Choose your meal from the menu, select your portion/size, and click “Add to Cart.” Then proceed to checkout to confirm your order."
  },
  {
    question: "Do you offer delivery?",
    answer: "Yes, we deliver to all areas in the UK. Delivery charges will be shown at checkout."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept card payment and bank transfers, more details are on the checkout page."
  },
  {
    question: "What happens if my order arrives incorrect or late?",
    answer: "If there’s any issue with your order, contact us immediately and we’ll fix it or offer a replacement/refund based on the situation."
  },
  {
    question: "Do you offer catering for events?",
    answer: "Yes once your order is confirmed, you'll receive updates and estimated delivery time. Our team may also call to confirm your address and status."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[var(--color-bg-off-white)] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-[var(--color-primary)] text-3xl md:text-5xl font-serif italic tracking-wide mb-6">
          Frequently Asked Questions
        </h2>

        <div className="text-[var(--color-text)] opacity-80 text-sm md:text-base mb-12 space-y-1 font-medium">
          <p>Got questions? We've got answers.</p>
          <p>Here are some common questions customers ask before ordering.</p>
          <p>If you need more help, feel free to contact us — we're happy to assist!</p>
        </div>

        <div className="flex flex-col text-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-transparent border-b border-black/10 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center gap-4 py-5 md:py-6 bg-transparent focus:outline-none hover:opacity-70 transition-opacity text-left"
              >
                <span className="text-[var(--color-text)] text-[15px] md:text-base font-medium leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-[var(--color-text)] opacity-60 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="pb-5 md:pb-6 text-[var(--color-text)] opacity-80 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
