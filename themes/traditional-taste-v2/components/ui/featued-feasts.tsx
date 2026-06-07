"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

const gallery = ["/jollof-main.jpg", "/jollof rice.jpg", "/jollof-side-2.jfif"];

export default function FeaturedFoodShowcase() {
  const [activeImage, setActiveImage] = useState(0);

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  return (
    <section className="w-full bg-[var(--color-bg-main)] py-10 md:py-16">
      <div className="max-w-[1640px] mx-auto px-4 md:px-6 lg:px-10">
        <div className="bg-[var(--color-bg-secondary)] rounded-[30px] md:rounded-[40px] overflow-hidden shadow-sm">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* LEFT SIDE */}
            <div className="p-6 md:p-10 lg:p-14 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm w-fit mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>

                <span className="text-[var(--color-primary)] font-bold text-sm uppercase tracking-wide">
                  Chef's Special
                </span>
              </div>

              <h2 className="text-[var(--color-text)] text-3xl md:text-5xl font-bold leading-tight mb-5">
                Family Feast Combo
                <br />
                (Jollof Rice & Chicken)
              </h2>

              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-[var(--color-primary)] text-[var(--color-primary)]"
                  />
                ))}

                <span className="ml-2 text-sm font-medium text-[var(--color-text)] opacity-70">
                  4.9 Rating · 2.4k Reviews
                </span>
              </div>

              <div className="inline-flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm w-fit mb-6 hover:shadow-md transition-all">
                <Clock3 size={18} className="text-[var(--color-primary)]" />

                <span className="font-semibold text-[var(--color-text)]">
                  Freshly cooked today
                </span>
              </div>

              <p className="text-[var(--color-text)] opacity-75 leading-8 mb-8 text-base md:text-lg">
                Enjoy a rich serving of smoky Nigerian party jollof rice,
                perfectly grilled chicken, fresh salad and signature sauce. Made
                with premium ingredients and delivered hot to your doorstep.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Prepared by experienced local chefs",
                  "Fresh ingredients sourced daily",
                  "Fast delivery available",
                  "Perfect for families and gatherings",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 group cursor-default transition-all duration-300 hover:translate-x-2"
                  >
                    <CheckCircle2
                      size={20}
                      className="text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-110"
                    />

                    <span className="text-[var(--color-text)]">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div>
                  <span className="text-4xl md:text-5xl font-bold text-[var(--color-primary)]">
                    $24.99
                  </span>

                  <span className="ml-3 text-lg line-through opacity-50">
                    $32.99
                  </span>
                </div>

                <div className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full font-bold shadow-sm">
                  24% OFF
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  className="
                    group
                    flex items-center gap-2
                    bg-[var(--color-primary)]
                    text-white
                    font-bold
                    px-8
                    py-4
                    rounded-xl

                    transition-all
                    duration-300

                    hover:scale-105
                    hover:-translate-y-1
                    hover:shadow-[0_20px_40px_rgba(249,115,22,0.35)]

                    active:scale-95
                  "
                >
                  <ShoppingBag
                    size={18}
                    className="transition-transform group-hover:rotate-12"
                  />
                  Order Now
                </button>

                <button
                  className="
                    border-2
                    border-[var(--color-primary)]
                    text-[var(--color-primary)]
                    font-bold
                    px-8
                    py-4
                    rounded-xl

                    transition-all
                    duration-300

                    hover:bg-[var(--color-primary)]
                    hover:text-white
                    hover:scale-105
                    hover:-translate-y-1
                    hover:shadow-lg

                    active:scale-95
                  "
                >
                  View Menu
                </button>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative flex items-center justify-center p-6 md:p-10">
              <div className="relative w-full max-w-[650px] group/slider">
                {/* MAIN IMAGE */}
                <div
                  key={activeImage}
                  className="
                    bg-white
                    rounded-[30px]
                    aspect-square
                    relative
                    overflow-hidden
                    shadow-xl
                  "
                >
                  <Image
                    src={gallery[activeImage]}
                    alt="Featured Food"
                    fill
                    priority
                    className="
                      object-cover
                      transition-all
                      duration-700
                      ease-out
                      group-hover/slider:scale-110
                    "
                  />
                </div>

                {/* LEFT ARROW */}
                <button
                  onClick={prevImage}
                  className="
                    hidden md:flex
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2

                    w-12
                    h-12

                    rounded-full
                    bg-white/90
                    backdrop-blur-md
                    shadow-xl

                    items-center
                    justify-center

                    opacity-0
                    -translate-x-4
                    pointer-events-none

                    group-hover/slider:opacity-100
                    group-hover/slider:translate-x-0
                    group-hover/slider:pointer-events-auto

                    transition-all
                    duration-300

                    hover:bg-[var(--color-primary)]
                    hover:text-white
                    hover:scale-110
                  "
                >
                  <ChevronLeft size={22} />
                </button>

                {/* RIGHT ARROW */}
                <button
                  onClick={nextImage}
                  className="
                    hidden md:flex
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2

                    w-12
                    h-12

                    rounded-full
                    bg-white/90
                    backdrop-blur-md
                    shadow-xl

                    items-center
                    justify-center

                    opacity-0
                    translate-x-4
                    pointer-events-none

                    group-hover/slider:opacity-100
                    group-hover/slider:translate-x-0
                    group-hover/slider:pointer-events-auto

                    transition-all
                    duration-300

                    hover:bg-[var(--color-primary)]
                    hover:text-white
                    hover:scale-110
                  "
                >
                  <ChevronRight size={22} />
                </button>

                {/* THUMBNAILS */}
                <div className="flex justify-center gap-4 mt-6">
                  {gallery.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`
                        relative
                        w-24
                        h-24
                        rounded-2xl
                        overflow-hidden

                        transition-all
                        duration-500

                        hover:scale-110
                        hover:-translate-y-2
                        hover:shadow-2xl

                        ${
                          activeImage === index
                            ? "ring-4 ring-[var(--color-primary)] scale-105"
                            : ""
                        }
                      `}
                    >
                      <Image
                        src={image}
                        alt={`Food ${index}`}
                        fill
                        className="
                          object-cover
                          transition-transform
                          duration-700
                          hover:scale-125
                        "
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
