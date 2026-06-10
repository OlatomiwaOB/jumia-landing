"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { getProductHref } from '@/utils/product-route';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

const gallery: string[] = [];

export default function ChefSpecialSection() {
  const [activeImage, setActiveImage] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  const storeCode = process.env.NEXT_PUBLIC_STORE_CODE || '';
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || '';

  const { data: featuredProductsData, isLoading } = useQuery({
    queryKey: ["testapp-featured", storeCode],
    queryFn: () => {
      return axiosInstanceNoAuth.request({
        method: "GET",
        url: '/ecommerce/products/list',
        params: {
          storeCode: storeCode,
          entityCode: entityCode,
          name: '',
          category: '',
          tag: '',
          pageNumber: 1,
          pageSize: 50
        }
      }).then(response => response.data)
    },
    refetchInterval: 30000,
  });

  const featuredProducts = featuredProductsData?.products?.filter((item: any) => item.featured) || [];

  // Only keep featured products that have a real image
  const productsWithImages = featuredProducts.filter((p: any) => {
    if (p.picture) return true;
    try {
      const list = typeof p.pictureList === 'string' ? JSON.parse(p.pictureList) : p.pictureList;
      return Array.isArray(list) && list.length > 0;
    } catch (e) { return false; }
  });

  const hasDynamicProducts = productsWithImages.length > 0;

  const currentGallery = productsWithImages.map((p: any) => {
    let pic = p.picture;
    if (!pic) {
      try {
        const list = typeof p.pictureList === 'string' ? JSON.parse(p.pictureList) : p.pictureList;
        if (Array.isArray(list) && list.length > 0) pic = list[0];
      } catch (e) { }
    }
    return pic;
  }).filter(Boolean);

  // Only use images that have actually loaded (not broken)
  const validGallery = currentGallery.filter((img: string) => !brokenImages.has(img));
  const validProducts = productsWithImages.filter((_: any, i: number) =>
    currentGallery[i] && !brokenImages.has(currentGallery[i])
  );

  const featuredProduct = validProducts.length > 0 ? validProducts[activeImage % validProducts.length] : null;

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % validGallery.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev === 0 ? validGallery.length - 1 : prev - 1));
  };

  React.useEffect(() => {
    if (validGallery.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % validGallery.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [validGallery.length]);

  if (!isLoading && !hasDynamicProducts) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="w-full bg-[var(--color-bg-main)] py-10 md:py-16">
        <div className="max-w-[1640px] mx-auto px-4 md:px-6 lg:px-10">
          <div className="bg-[var(--color-bg-secondary)] rounded-[30px] md:rounded-[40px] h-[500px] animate-pulse"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[var(--color-bg-main)] py-10 md:py-16">
      <div className="max-w-[1640px] mx-auto px-4 md:px-6 lg:px-10">
        <div className="bg-[var(--color-bg-secondary)] rounded-[30px] md:rounded-[40px] overflow-hidden shadow-sm">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* LEFT SIDE */}
            <div className="order-2 lg:order-1 p-6 pt-0 md:p-10 lg:p-14 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm w-fit mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>

                <span className="text-[var(--color-primary)] font-bold text-sm uppercase tracking-wide">
                  Chef's Special
                </span>
              </div>

              <h2 className="text-[var(--color-text)] text-3xl md:text-5xl font-bold leading-tight mb-5 line-clamp-2">
                {featuredProduct?.name || "Family Feast Combo (Jollof Rice & Chicken)"}
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

              <p className="text-[var(--color-text)] opacity-75 leading-8 mb-8 text-base md:text-lg line-clamp-3">
                {featuredProduct?.description || "Enjoy a rich serving of smoky Nigerian party jollof rice, perfectly grilled chicken, fresh salad and signature sauce. Made with premium ingredients and delivered hot to your doorstep."}
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
                    {featuredProduct?.ccy || '$'}{featuredProduct?.salePrice?.toFixed(2) || "24.99"}
                  </span>

                  {/* Only show old price if it's greater than sale price */}
                  {(featuredProduct ? (featuredProduct.oldPrice > featuredProduct.salePrice) : true) && (
                    <span className="ml-3 text-lg line-through opacity-50">
                      {featuredProduct?.ccy || '$'}{featuredProduct?.oldPrice?.toFixed(2) || "32.99"}
                    </span>
                  )}
                </div>

                {((featuredProduct && featuredProduct.oldPrice > featuredProduct.salePrice) || !featuredProduct) && (
                  <div className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full font-bold shadow-sm">
                    {featuredProduct ? Math.round(((featuredProduct.oldPrice - featuredProduct.salePrice) / featuredProduct.oldPrice) * 100) : 24}% OFF
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={featuredProduct ? getProductHref(featuredProduct) : '#'}
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

                    hover:bg-[var(--color-text)]
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
                </Link>


              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="order-1 lg:order-2 relative flex items-center justify-center p-6 pb-2 md:p-10">
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
                  {validGallery.length > 0 && validGallery[activeImage] ? (
                    <Image
                      src={validGallery[activeImage]}
                      alt={featuredProduct?.name || "Featured Food"}
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
                  ) : null}
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
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4 md:mt-6">
                  {currentGallery.map((image: string, index: number) => {
                    if (brokenImages.has(image)) return null;
                    return (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`
                          relative
                          w-16 md:w-24
                          h-16 md:h-24
                          rounded-xl md:rounded-2xl
                          overflow-hidden

                          transition-all
                          duration-500

                          hover:scale-110
                          hover:-translate-y-2
                          hover:shadow-2xl

                          ${activeImage === index
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
                          onError={() => setBrokenImages(prev => new Set(prev).add(image))}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
