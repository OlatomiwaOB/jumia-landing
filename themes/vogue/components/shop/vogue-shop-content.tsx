"use client";


import { getClientIdentifiers } from '@/config/client-config';
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceNoAuth from "@/utils/fetch-function-auth";
import { VogueProductCard } from "./vogue-product-card";
import { VogueProductDetails } from "./vogue-product-details";
import { ProductProps } from "@/types/index";
import { useCategories } from "@/hooks/useCategories";
import { Search, X, SlidersHorizontal, ChevronRight, ChevronLeft, Dialog } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VogueShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialCategory = searchParams?.get("category") || "";
  const initialSearch = searchParams?.get("search") || "";
  const storeCode = searchParams?.get("storeCode") || getClientIdentifiers().storeCode;
  const entityCode = getClientIdentifiers().entityCode;

  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [shopByCategorySelected, setShopByCategorySelected] = useState(initialCategory);

  const { data: categoriesData } = useCategories();

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["vogue-products", storeCode, shopByCategorySelected, searchQuery],
    queryFn: async () => {
      const response = await axiosInstanceNoAuth.request({
        method: "GET",
        url: "/ecommerce/products/list",
        params: {
          name: searchQuery,
          storeCode: storeCode,
          entityCode: entityCode,
          category: shopByCategorySelected,
          tag: "",
          pageNumber: 1,
          pageSize: 200,
        },
      });
      return response.data;
    },
  });

  const allProducts = productsData?.products || [];

  const handleCategoryClick = (categoryCode: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (categoryCode) {
      params.set("category", categoryCode);
      setShopByCategorySelected(categoryCode);
    } else {
      params.delete("category");
      setShopByCategorySelected("");
    }
    params.delete("search");
    setSearchQuery("");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Search Header */}
      <div className="container mx-auto px-4 lg:px-8 py-12 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-serif italic text-gray-900 mb-2">
              {searchQuery ? `Search: ${searchQuery}` : shopByCategorySelected || "The Shop"}
            </h1>
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400">
              {allProducts.length} Results
            </p>
          </div>
          
          <div className="flex items-center space-x-6 text-[10px] font-medium tracking-[0.2em] uppercase text-gray-500">
            <button className="flex items-center space-x-2 border-b border-gray-200 pb-1">
              <span>Sort by</span>
              <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
            <button className="flex items-center space-x-2 border-b border-gray-200 pb-1">
              <span>Filter</span>
              <SlidersHorizontal className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="container mx-auto px-4 lg:px-8 py-6 flex space-x-8 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          onClick={() => handleCategoryClick("")}
          className={`text-[10px] font-medium tracking-[0.2em] uppercase whitespace-nowrap pb-2 border-b-2 transition-all ${
            !shopByCategorySelected ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          All
        </button>
        {categoriesData?.categories?.map((cat: any) => (
          <button
            key={cat.code}
            onClick={() => handleCategoryClick(cat.code)}
            className={`text-[10px] font-medium tracking-[0.2em] uppercase whitespace-nowrap pb-2 border-b-2 transition-all ${
              shopByCategorySelected === cat.code ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-900"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {productsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-50 mb-4" />
                <div className="h-4 bg-gray-50 w-2/3 mb-2" />
                <div className="h-4 bg-gray-50 w-1/3" />
              </div>
            ))}
          </div>
        ) : allProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {allProducts.map((product: ProductProps) => (
              <VogueProductCard
                key={product.id}
                product={product}
                onClick={() => {
                  setSelectedProduct(product);
                  setIsDetailsOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
            <p className="font-serif italic text-gray-400">No pieces found in this collection.</p>
          </div>
        )}
      </div>

      {/* Full Page Product Details Overlay */}
      <AnimatePresence>
        {isDetailsOpen && selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex justify-between items-center p-6 bg-white/80 backdrop-blur-md">
              <span className="text-xl font-serif tracking-widest uppercase">vogue</span>
              <button 
                onClick={() => setIsDetailsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <VogueProductDetails product={selectedProduct} />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
