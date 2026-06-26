"use client";


import { getClientIdentifiers } from '@/config/client-config';
import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceNoAuth from "@/utils/fetch-function-auth";
import { VogueProductCard } from "./components/shop/vogue-product-card";
import { VogueProductDetails } from "./components/shop/vogue-product-details";
import { ProductProps } from "@/types/index";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getProductHref } from "@/utils/product-route";

export default function VogueHomepage() {
  const searchParams = useSearchParams();
  const storeCode = searchParams?.get("storeCode") || "";
  const entityCode = getClientIdentifiers().entityCode;
  const router = useRouter()


  const { data: bestSellerData, isLoading: bestSellerLoading } = useQuery({
    queryKey: ["all-best-products", storeCode],
    queryFn: () => {
      return axiosInstanceNoAuth
        .request({
          method: "GET",
          url: "/ecommerce/products/best-selling",
          params: {
            name: "",
            storeCode: storeCode,
            entityCode: entityCode,
            category: "",
            tag: "",
            pageNumber: 1,
            pageSize: 10,
          },
        })
        .then((response) => response.data);
    },
  });

  const { data: newArrivalsData } = useQuery({
    queryKey: ["new-arrivals", storeCode],
    queryFn: () => {
      return axiosInstanceNoAuth
        .request({
          method: "GET",
          url: "/ecommerce/products/list",
          params: {
            name: "",
            storeCode: storeCode,
            entityCode: entityCode,
            category: "",
            tag: "",
            pageNumber: 1,
            pageSize: 10,
          },
        })
        .then((response) => response.data);
    },
  });

  const { data: allProductsData } = useQuery({
    queryKey: ["all-products", storeCode],
    queryFn: () => {
      return axiosInstanceNoAuth
        .request({
          method: "GET",
          url: "/ecommerce/products/list",
          params: {
            name: "",
            storeCode: storeCode,
            entityCode: entityCode,
            category: "",
            tag: "",
            pageNumber: 1,
            pageSize: 24,
          },
        })
        .then((response) => response.data);
    },
  });

  const bestSellers = bestSellerData?.products || [];
  const newArrivals = newArrivalsData?.products || [];
  const allProducts = allProductsData?.products || [];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden group">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 text-center drop-shadow-2xl"
          >
            Vogue <span className="text-accent underline decoration-8 underline-offset-8 decoration-white/20">Essence</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/shop"
              className="px-12 py-5 bg-accent text-white text-[11px] font-black tracking-[0.4em] uppercase hover:bg-black transition-all transform hover:scale-110 shadow-2xl rounded-full"
            >
              Enter The Shop
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Buy Now Pay Later - Banner */}
      <div className="bg-accent/5 py-6 overflow-hidden whitespace-nowrap border-y-2 border-accent/10">
        <div className="flex animate-marquee space-x-12">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-[11px] font-black tracking-[0.4em] uppercase text-accent/60">
              FREE DELIVERY OVER 100K • BUY NOW PAY LATER • EXCLUSIVELY VOGUE •
            </span>
          ))}
        </div>
      </div>

      {/* What's New Section */}
      <section className="container mx-auto px-4 lg:px-8 py-24 bg-white">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-[11px] font-black tracking-[0.5em] uppercase text-accent mb-4">The Latest</h2>
          <h3 className="text-5xl font-black uppercase tracking-tighter">What's New</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {newArrivals.slice(0, 3).map((product: ProductProps) => (
            <VogueProductCard
              key={product.id}
              product={product}
              onClick={() => router.push(getProductHref(product, storeCode))}
            />
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="bg-gray-50 py-32 rounded-[4rem] mx-4 lg:mx-8 shadow-inner border border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-[11px] font-black tracking-[0.5em] uppercase text-accent mb-4">Trending</h2>
            <h3 className="text-5xl font-black uppercase tracking-tighter">Best Sellers</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.slice(0, 8).map((product: ProductProps) => (
              <VogueProductCard
                key={product.id}
                product={product}
                onClick={() => router.push(getProductHref(product, storeCode))}
              />
            ))}
          </div>
          <div className="text-center mt-16">
            <Link href="/shop" className="px-10 py-4 border-2 border-accent text-accent text-[11px] font-black tracking-[0.3em] uppercase hover:bg-accent hover:text-white transition-all rounded-xl inline-block">
              Explore More
            </Link>
          </div>
        </div>
      </section>

      {/* Browse Products Section */}
      <section className="container mx-auto px-4 lg:px-8 py-32">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-[11px] font-black tracking-[0.5em] uppercase text-accent mb-4">Full Catalogue</h2>
          <h3 className="text-5xl font-black uppercase tracking-tighter">Browse All Pieces</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {allProducts.slice(0, 12).map((product: ProductProps) => (
            <VogueProductCard
              key={product.id}
              product={product}
              onClick={() => router.push(getProductHref(product, storeCode))}
            />
          ))}
        </div>
        <div className="text-center mt-20">
          <Link href="/shop" className="text-[11px] font-black tracking-[0.4em] uppercase border-b-4 border-accent pb-2 hover:text-accent transition-all">
            Load Full Collection
          </Link>
        </div>
      </section>

      {/* Choose Your Style Section */}
      <section className="container mx-auto px-4 lg:px-8 py-32">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-[11px] font-black tracking-[0.5em] uppercase text-accent mb-4">Curation</h2>
          <h3 className="text-5xl font-black uppercase tracking-tighter">Choose Your Style</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="relative aspect-[4/5] overflow-hidden group rounded-3xl cursor-pointer shadow-xl border-4 border-transparent hover:border-accent transition-all">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute bottom-10 left-0 right-0 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <span className="text-white text-md font-black tracking-[0.4em] uppercase bg-accent px-8 py-4 shadow-2xl">Modern Muse</span>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden group rounded-3xl cursor-pointer shadow-xl border-4 border-transparent hover:border-accent transition-all">
            <img
              src="https://images.unsplash.com/photo-1549062572-544a64fb0c56?q=80&w=1920&auto=format&fit=crop"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute bottom-10 left-0 right-0 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <span className="text-white text-md font-black tracking-[0.4em] uppercase bg-accent px-8 py-4 shadow-2xl">Luxe Living</span>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden group rounded-3xl cursor-pointer shadow-xl border-4 border-transparent hover:border-accent transition-all">
            <img
              src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1920&auto=format&fit=crop"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute bottom-10 left-0 right-0 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <span className="text-white text-md font-black tracking-[0.4em] uppercase bg-accent px-8 py-4 shadow-2xl">Urban Elite</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
