import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function FeatureHighlights() {
  const highlights = [
    {
      title: "Built to Endure",
      image: "/images/mock/built_to_endure.png",
      link: "#"
    },
    {
      title: "Unparalleled Design",
      image: "/images/mock/unparalleled_design.png",
      link: "#"
    },
    {
      title: "Seamless Connectivity",
      image: "/images/mock/seamless_connectivity.png",
      link: "#"
    }
  ];

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[100rem] mx-auto px-4 md:px-12">
        
        {/* Header Section */}
        <div className="mb-20 flex flex-col items-center relative">
          {/* Titles */}
          <div className="text-center mt-14 md:mt-0">
            <h4 className="text-black text-[15px] font-bold mb-2">Our Signature Headphones</h4>
            <h2 className="text-black text-3xl md:text-4xl font-bold tracking-wide">A Melody for Your Ears</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item, index) => (
            <div 
              key={index} 
              className="group relative block w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Text Content */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center px-4">
                <h3 className="text-white text-lg md:text-xl font-semibold tracking-wide text-center drop-shadow-md">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
