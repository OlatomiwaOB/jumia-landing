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
  Plus,
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

  const specificNames = [
    "peppered turkey",
    "coconut rice"
  ];

  const matchedProducts = featuredProductsData?.products?.filter((item: any) => {
    const itemName = item.name?.toLowerCase() || '';
    return specificNames.some(name => itemName.includes(name));
  }) || [];

  // Sort them to match the exact order requested by the user
  const featuredProducts = [...matchedProducts].sort((a: any, b: any) => {
    const aName = a.name?.toLowerCase() || '';
    const bName = b.name?.toLowerCase() || '';
    const aIndex = specificNames.findIndex(name => aName.includes(name));
    const bIndex = specificNames.findIndex(name => bName.includes(name));
    return (aIndex >= 0 ? aIndex : 99) - (bIndex >= 0 ? bIndex : 99);
  });

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

  // Only use images that have actually loaded (not broken), and limit to 2 items
  const validGallery = currentGallery.filter((img: string) => !brokenImages.has(img)).slice(0, 2);
  const validProducts = productsWithImages.filter((_: any, i: number) =>
    currentGallery[i] && !brokenImages.has(currentGallery[i])
  ).slice(0, 2);

  const featuredProduct = validProducts.length > 0 ? validProducts[activeImage % validProducts.length] : null;

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % validGallery.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev === 0 ? validGallery.length - 1 : prev - 1));
  };

  if (!isLoading && !hasDynamicProducts) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="w-full bg-[var(--color-text)] h-[500px] lg:h-[700px] animate-pulse"></section>
    );
  }

  return (
    <section className="w-full bg-[var(--color-text)] lg:h-[700px] flex flex-col lg:flex-row relative z-20">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 p-10 md:p-16 lg:p-24 flex flex-col justify-center order-2 lg:order-1">
        <h2 className="text-white text-4xl md:text-5xl lg:text-[54px] font-serif italic tracking-wide leading-[1.2] mb-6 uppercase drop-shadow-md">
          {featuredProduct?.name || "Chef's Special"}
        </h2>

        <p className="text-white/90 text-base md:text-lg max-w-lg mb-10 leading-relaxed font-medium">
          {featuredProduct?.description || "Experience our meticulously crafted dishes, highlighted by unique characteristics and premium ingredients, making every bite a true delight."}
        </p>

        <Link
          href="/shop"
          className="bg-white hover:bg-[var(--color-primary)] text-[#1C1917] hover:text-white font-bold py-4 px-12 text-[15px] uppercase tracking-wider transition-all duration-300 w-full sm:w-max text-center"
        >
          Shop Now
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 h-[400px] lg:h-full relative order-1 lg:order-2 group/slider">
        {validGallery.length > 0 && validGallery[activeImage] ? (
          <Image
            src={validGallery[activeImage]}
            alt={featuredProduct?.name || "Featured Food"}
            fill
            priority
            className="object-cover transition-opacity duration-1000 ease-in-out"
          />
        ) : null}

        {/* Floating Thumbnails / Selectors */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
          {validGallery.map((image: string, index: number) => {
            return (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`
                      relative flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-xl
                      ${activeImage === index
                    ? "border-[6px] border-white/60 bg-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    : "border-transparent bg-white/40 backdrop-blur-sm opacity-90 hover:opacity-100 hover:scale-105"
                  }
                    `}
              >
                {activeImage === index ? (
                  <Image
                    src={image}
                    alt={`Food ${index}`}
                    fill
                    className="object-cover rounded-full"
                    onError={() => setBrokenImages(prev => new Set(prev).add(image))}
                  />
                ) : (
                  <Plus size={36} strokeWidth={1.5} className="text-[#1C1917]" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  );
}
