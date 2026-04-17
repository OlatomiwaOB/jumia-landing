"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { ProductProps } from "@/types/index";
import { formatPrice, CurrencyCode } from "@/utils/helperfns";
import { useCart } from "@/store/cart";
import { motion, AnimatePresence } from "framer-motion";

interface VogueProductCardProps {
  product: ProductProps;
  onClick: () => void;
}

export function VogueProductCard({ product, onClick }: VogueProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, inCart } = useCart();
  const hoverIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const imagePrefix = "https://mmcpdocs.s3.eu-west-2.amazonaws.com/";
  
  // Combine main picture and pictureList, ensuring all have the correct prefix/format
  const allImages = [
    product.picture,
    ...(product.pictureList || []).map(pic => pic.startsWith("http") ? pic : `${imagePrefix}${pic.startsWith("/") ? pic.slice(1) : pic}`)
  ].filter(Boolean) as string[];

  // Auto-swipe on hover logic
  useEffect(() => {
    if (isHovered && allImages.length > 1) {
      hoverIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 1500);
    } else {
      if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);
      setCurrentImageIndex(0);
    }
    return () => {
      if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);
    };
  }, [isHovered, allImages.length]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product as any);
  };

  const handleSwipe = (direction: number) => {
    if (allImages.length <= 1) return;
    const newIndex = (currentImageIndex + direction + allImages.length) % allImages.length;
    setCurrentImageIndex(newIndex);
  };

  return (
    <div
      className="group relative flex flex-col bg-white overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image Carousel */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 50) handleSwipe(-1);
              else if (info.offset.x < -50) handleSwipe(1);
            }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <img
              src={allImages[currentImageIndex] || "/placeholder-image.png"}
              alt={product.name || "Product image"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
            />
          </motion.div>
        </AnimatePresence>

        {/* Swipe Indicators */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
            {allImages.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? "bg-white scale-110" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Add to Cart Icon Button */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 z-20 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          } ${
            inCart(product.id) ? "bg-accent text-white" : "bg-white text-gray-900 hover:bg-accent hover:text-white"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>

      {/* Product Details */}
      <div className="mt-4 flex flex-col items-center">
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-gray-800 text-center line-clamp-1 px-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center space-x-3">
          <span className="text-sm font-black text-accent">
            {formatPrice(product.salePrice || product.oldPrice || 0, (product.ccy || "NGN") as CurrencyCode)}
          </span>
          {product.oldPrice && product.oldPrice > (product.salePrice || 0) && (
            <span className="text-xs text-gray-400 line-through decoration-accent/30 tracking-tight">
              {formatPrice(product.oldPrice, (product.ccy || "NGN") as CurrencyCode)}
            </span>
          )}
        </div>
      </div>
      
      {/* Colorful Accent Border */}
      <div className={`absolute bottom-0 left-0 h-1 bg-accent transition-all duration-500 ${isHovered ? "w-full" : "w-0"}`} />
    </div>
  );
}
