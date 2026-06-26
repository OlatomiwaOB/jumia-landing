"use client";


import { getClientIdentifiers } from '@/config/client-config';
import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceNoAuth from "@/utils/fetch-function-auth";
import { VogueProductCard } from "./vogue-product-card";
import { VogueProductDetails } from "./vogue-product-details";
import { ProductProps } from "@/types/index";
import { useCategories } from "@/hooks/useCategories";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VogueCategoryContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryCode = decodeURIComponent(params.categoryCode as string);
  const storeCode = searchParams?.get("storeCode") || getClientIdentifiers().storeCode;
  const entityCode = getClientIdentifiers().entityCode;

  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: categoriesData } = useCategories();
  const currentCategory = categoriesData?.categories?.find((cat: any) => cat.code === categoryCode);
  const categoryName = currentCategory?.name || categoryCode;

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["vogue-category-products", categoryCode, storeCode],
    queryFn: async () => {
      const response = await axiosInstanceNoAuth.request({
        method: "GET",
        url: "/ecommerce/products/list",
        params: {
          name: "",
          storeCode: storeCode,
          entityCode: entityCode,
          category: categoryCode,
          tag: "",
          pageNumber: 1,
          pageSize: 200,
        },
      });
      return response.data;
    },
  });

  const allProducts = productsData?.products || [];

  return (
    <div className="bg-white min-h-screen">
      {/* Category Header */}
      <div className="container mx-auto px-4 lg:px-8 py-12 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div className="text-left">
              <h1 className="text-3xl font-serif italic text-gray-900 mb-1">{categoryName}</h1>
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400">
                {allProducts.length} Pieces found
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-[10px] font-medium tracking-[0.2em] uppercase text-gray-500">
            <button className="flex items-center space-x-2 border border-gray-100 px-4 py-2 hover:bg-gray-50 transition-all">
              <span>Filter</span>
              <SlidersHorizontal className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
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
            <p className="font-serif italic text-gray-400">This collection is currently empty.</p>
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
    </div>
  );
}
