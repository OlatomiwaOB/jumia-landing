"use client";

import Image from "next/image";
import { Scale, ThumbsUp, UtensilsCrossed, ArrowRight } from "lucide-react";

export default function WhyChooseUsSection() {
  const features = [
    {
      icon: Scale,
      title: "Quality at Fair Prices",
      description:
        "Fresh ingredients sourced directly from trusted farmers and suppliers.",
    },
    {
      icon: ThumbsUp,
      title: "100% Satisfaction",
      description: "If you're not happy with your order, we'll make it right.",
    },
    {
      icon: UtensilsCrossed,
      title: "Top Food Marketplace",
      description:
        "Thousands of customers trust us for delicious meals every day.",
    },
  ];

  const bannerBg = process.env.NEXT_PUBLIC_ACCENT_COLOR
    ? `#${process.env.NEXT_PUBLIC_ACCENT_COLOR}`
    : "#F97316";

  return (
    <section className="w-full bg-[var(--color-bg-main)] pb-6 md:pb-10 -mt-6 md:-mt-10 relative z-20">
      <div className="max-w-[1640px] mx-auto px-4 md:px-6 lg:px-10">
        <div
          className="relative overflow-hidden rounded-[32px] md:rounded-[40px]"
          style={{ backgroundColor: bannerBg }}
        >
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-[0.05]">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "35px 35px",
              }}
            />
          </div>

          {/* White Glow instead of primary glow */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white rounded-full blur-[120px] opacity-30" />

          <div className="relative z-10 grid lg:grid-cols-[1fr_320px] gap-6 items-center p-4 md:p-6 lg:p-8">
            {/* LEFT */}
            <div>
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-5 shadow-sm border border-white/20">
                🚚 Fast Delivery Service
              </span>

              <h2 className="text-white text-2xl md:text-4xl font-bold leading-tight">
                More than groceries,
                <span className="text-white opacity-90">
                  {" "}
                  delivered to your door in 1 hour
                </span>
              </h2>

              <p className="text-white/90 text-base mt-3 max-w-3xl leading-relaxed">
                From authentic African dishes to fresh groceries and kitchen
                essentials, enjoy fast delivery and premium quality without
                leaving your home.
              </p>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-5 mt-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={index}
                      className="
                        group
                        bg-white/10
                        backdrop-blur-md
                        rounded-2xl
                        p-4
                        border border-white/10

                        transition-all
                        duration-300

                        hover:bg-white
                        hover:-translate-y-2
                        hover:shadow-2xl
                      "
                    >
                      <div
                        className="
                          w-10
                          h-10
                          rounded-lg
                          bg-white/20
                          border border-white/20

                          flex
                          items-center
                          justify-center

                          mb-4

                          transition-all
                          duration-300

                          group-hover:bg-transparent
                          group-hover:border-transparent
                          group-hover:rotate-6
                          group-hover:scale-110
                        "
                      >
                        <Icon size={20} className="text-white group-hover:text-[var(--color-primary)]" />
                      </div>

                      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-stone-900 transition-colors">
                        {feature.title}
                      </h3>

                      <p className="text-white/80 text-sm leading-relaxed group-hover:text-stone-600 transition-colors">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-6">
                <button
                  className="
                    group
                    bg-white
                    text-[#F97316]
                    font-bold

                    px-6
                    py-3
                    text-sm

                    rounded-lg

                    flex
                    items-center
                    gap-2

                    transition-all
                    duration-300

                    hover:scale-105
                    hover:-translate-y-1
                    hover:shadow-[0_20px_40px_rgba(255,255,255,0.25)]
                  "
                  style={{ color: bannerBg }}
                >
                  Order Now
                  <ArrowRight
                    size={18}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </button>

                <button
                  className="
                    border-2
                    border-white/40

                    text-white
                    font-semibold

                    px-6
                    py-3
                    text-sm

                    rounded-lg

                    transition-all
                    duration-300

                    hover:bg-white/20
                    hover:scale-105
                    hover:-translate-y-1
                  "
                >
                  Browse Menu
                </button>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="flex justify-center lg:justify-end">
              <div
                className="
                  group
                  relative

                  w-full
                  max-w-[320px]

                  h-[200px]
                  md:h-[260px]

                  rounded-3xl
                  overflow-hidden

                  shadow-[0_30px_60px_rgba(0,0,0,0.25)]
                "
              >
                <Image
                  src="/delivery-food.jfif"
                  alt="Food delivery"
                  fill
                  className="
                    object-cover

                    transition-all
                    duration-700

                    group-hover:scale-110
                  "
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Floating Badge */}
                <div
                  className="
                    absolute
                    bottom-4
                    left-4

                    bg-white

                    px-4
                    py-3

                    rounded-xl

                    shadow-lg
                  "
                >
                  <p className="text-sm font-bold text-[#245c3b]">
                    🚀 Delivery in 60 mins
                  </p>
                </div>

                {/* Floating Stats */}
                <div
                  className="
                    absolute
                    top-4
                    right-4

                    bg-white/90
                    backdrop-blur-md

                    px-4
                    py-2

                    rounded-xl

                    shadow-lg
                  "
                >
                  <span className="font-bold text-[var(--color-primary)]">
                    10k+
                  </span>

                  <p className="text-xs text-gray-600">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
