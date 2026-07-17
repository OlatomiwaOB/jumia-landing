'use client';

import React from 'react';
import { ShoppingBag, Headphones, CreditCard, Package } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      icon: <ShoppingBag size={42} className="text-[#253273]" strokeWidth={1.5} />,
      title: "Free Shipping",
      description: "Free worldwide shipping on all orders of $50"
    },
    {
      icon: <Headphones size={42} className="text-[#253273]" strokeWidth={1.5} />,
      title: "Customer Support",
      description: "Our support team is available 24/7"
    },
    {
      icon: <CreditCard size={42} className="text-[#253273]" strokeWidth={1.5} />,
      title: "Secure Payment",
      description: "All payments are processed securely"
    },
    {
      icon: <Package size={42} className="text-[#253273]" strokeWidth={1.5} />,
      title: "Designed by Electro",
      description: "Products designed and developed by us."
    }
  ];

  return (
    <section className="w-full bg-white py-20 px-6 md:px-12 font-sans border-t border-gray-200">
      <div className="max-w-[100rem] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center gap-6">
              <div className="shrink-0">
                {feature.icon}
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-[#253273] font-bold text-lg md:text-[18px]">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-[15px] leading-relaxed max-w-[280px] mx-auto">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
