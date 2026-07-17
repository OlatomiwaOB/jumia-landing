"use client";


import { clientConfig, getClientIdentifiers } from '@/config/client-config';
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { Scale, ThumbsUp, UtensilsCrossed, ArrowRight } from "lucide-react";

export default function FastDeliverySection() {
  const searchParams = useSearchParams();
  const storeCode = searchParams?.get('storeCode') || getClientIdentifiers().storeCode;
  const entityCode = getClientIdentifiers().entityCode;

  const { data: productsData } = useProducts(
    storeCode,
    entityCode,
    '',
    '',
    'fast-delivery',
    1,
    20 // Fetch a few to find one with a picture
  );

  const productWithImage = productsData?.products?.find((p: any) => p.picture);
  const imageUrl = productWithImage?.picture;
  const features = [
    {
      icon: Scale,
      title: "Quality at Fair Prices",
      description:
        "Every dish is prepared fresh with quality ingredients, cooked with care and served the way it should be — just like home."
    },
    {
      icon: ThumbsUp,
      title: "100% Satisfaction",
      description: "Made with love and served with pride. We are committed to making every meal an experience worth coming back for.",
    },
    {
      icon: UtensilsCrossed,
      title: "Top Food Marketplace",
      description:
        "Bringing authentic homemade Nigerian flavours to tables across the UK, one satisfied customer at a time.",
    },
  ];

  const bannerBg = clientConfig().branding.colors.accent
    ? `#${clientConfig().branding.colors.accent}`
    : "#F97316";

  return (
    <section className="w-full bg-[var(--color-bg-main)] pb-6 md:pb-10 -mt-6 md:-mt-10 relative z-20">
      <div className="max-w-[1640px] mx-auto px-4 md:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-none bg-[var(--color-bg-off-white)]">

          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)",
                backgroundSize: "35px 35px",
              }}
            />
          </div>

          <div className="relative z-10 p-6 md:p-10 lg:p-12">
            <div>
              <span className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
                🚚 Fast Delivery Service
              </span>

              <h2 className="text-[var(--color-text)] text-3xl md:text-5xl font-bold leading-tight">
                Homemade dishes, delivered without leaving your home.
                <span className="text-[var(--color-primary)] block mt-1">
                  Order today and enjoy only freshly prepared, carefully packaged meals from us.
                </span>
              </h2>



              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-10">
                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={index}
                      className="
                        group
                        bg-[var(--color-bg-main)]
                        rounded-2xl
                        p-6
                        border border-[var(--color-border)]
                        shadow-sm
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-lg
                        hover:border-[var(--color-primary)]
                      "
                    >
                      <div
                        className="
                          w-12
                          h-12
                          rounded-xl
                          bg-[var(--color-bg-off-white)]
                          flex
                          items-center
                          justify-center
                          mb-5
                          transition-all
                          duration-300
                          group-hover:bg-[var(--color-primary)]
                          group-hover:rotate-6
                        "
                      >
                        <Icon size={24} className="text-[var(--color-primary)] group-hover:text-white transition-colors" />
                      </div>

                      <h3 className="text-[var(--color-text)] font-bold text-xl mb-3">
                        {feature.title}
                      </h3>

                      <p className="text-[var(--color-text-muted)] text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-10">
                <Link
                  href="/about"
                  className="
                    group
                    bg-[var(--color-primary)]
                    text-white
                    font-bold
                    px-8
                    py-4
                    text-base
                    rounded-xl
                    flex
                    justify-center
                    items-center
                    gap-2
                    w-full
                    sm:w-max
                    transition-all
                    duration-300
                    hover:scale-105
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >
                  Discover Our Story
                  <ArrowRight
                    size={20}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
