"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Minus, Plus, Search, ChevronDown, Check } from "lucide-react";
import { ProductProps } from "@/types/index";
import { formatPrice, CurrencyCode } from "@/utils/helperfns";
import { useCart } from "@/store/cart";
import { motion } from "framer-motion";

interface VogueProductDetailsProps {
  product: ProductProps;
  onClose?: () => void;
}

export function VogueProductDetails({ product, onClose }: VogueProductDetailsProps) {
  const { addToCart, inCart, increment, decrement, singleQuantity } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.itemSize || "");
  const [selectedColor, setSelectedColor] = useState<string>(product.color || "");
  const [isAdded, setIsAdded] = useState(false);

  const imagePrefix = "https://mmcpdocs.s3.eu-west-2.amazonaws.com/";
  const allImages = [
    product.picture,
    ...(product.pictureList || []).map(pic => pic.startsWith("http") ? pic : `${imagePrefix}${pic.startsWith("/") ? pic.slice(1) : pic}`)
  ].filter(Boolean) as string[];

  const [mainImage, setMainImage] = useState(allImages[0] || "/placeholder-image.png");

  const handleAddToCart = () => {
    addToCart(product as any);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const quantity = singleQuantity(product.id);

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-16 mb-20">
          {/* Image Gallery - Sticky aware */}
          <div className="space-y-6">
            <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden rounded-sm shadow-sm group border-4 border-accent/5">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                New Arrival
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {allImages.slice(0, 8).map((img, idx) => (
                <div
                  key={idx}
                  className={`aspect-[3/4] cursor-pointer overflow-hidden rounded-sm transition-all border-2 ${
                    mainImage === img ? "border-accent scale-95" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover px-1 py-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info - Sticky */}
          <div className="lg:sticky lg:top-32 self-start flex flex-col space-y-8">
            <div className="border-b-2 border-accent/10 pb-6">
              <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tight leading-none group-hover:text-accent transition-colors">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-black text-accent">
                   {formatPrice(product.salePrice || product.oldPrice || 0, (product.ccy || "NGN") as CurrencyCode)}
                </span>
                {product.oldPrice && product.oldPrice > (product.salePrice || 0) && (
                  <span className="text-lg text-gray-400 line-through decoration-accent/30 decoration-2">
                    {formatPrice(product.oldPrice, (product.ccy || "NGN") as CurrencyCode)}
                  </span>
                )}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Select Size</h3>
                <button className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[50px] h-[50px] flex items-center justify-center border-2 text-xs font-bold transition-all ${
                      selectedSize === size ? "border-accent bg-accent text-white" : "border-gray-100 text-gray-800 hover:border-accent/40"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Color</h3>
              <div className="flex flex-wrap gap-3">
                {["Black", "Wine", "Blue"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-2 border-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
                      selectedColor === color ? "border-accent bg-accent text-white" : "border-gray-100 text-gray-800 hover:border-accent/40"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col space-y-4 pt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-100 bg-gray-50 h-[60px] rounded-lg overflow-hidden">
                  <button
                    onClick={() => quantity > 1 ? decrement(product as any) : null}
                    className="w-12 h-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-12 text-center text-sm font-black">{quantity || 1}</span>
                  <button
                    onClick={() => increment(product as any)}
                    className="w-12 h-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={(product.qtyInStore ?? 0) <= 0}
                  className={`flex-1 h-[60px] flex items-center justify-center space-x-3 text-[12px] font-black tracking-[0.3em] uppercase transition-all shadow-lg rounded-lg ${
                    isAdded ? "bg-green-600 text-white" : "bg-accent text-white hover:bg-black hover:shadow-accent/40"
                  } disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <span>Add to cart</span>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Fast delivery available worldwide</p>
            </div>

            {/* Description Accordion Inspired UI */}
            <div className="border-t-2 border-gray-50 pt-8 space-y-4">
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-900 border-l-4 border-accent pl-4">Product Description</h3>
              <div className="text-[13px] text-gray-600 leading-loose font-medium italic">
                {product.description || (
                  <ul className="list-disc pl-4 space-y-2 opacity-80">
                    <li>Premium quality African print fabric</li>
                    <li>Designed for comfort and high-fashion style</li>
                    <li>Perfect for evening events and luxury outings</li>
                    <li>100% Cotton, Breathable and long-lasting</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="border-t-8 border-gray-50 pt-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tight">Customer reviews</h2>
            <div className="flex items-center space-x-2 bg-accent/5 px-6 py-3 rounded-full">
               {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-accent fill-accent" />
                ))}
                <span className="text-sm font-bold ml-2">5.0 / 5.0</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16 px-8 py-12 bg-gray-50 rounded-3xl border border-gray-100">
            {/* Rating Summary */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex items-baseline space-x-2 mb-4">
                <span className="text-9xl font-black text-accent drop-shadow-sm">0</span>
                <span className="text-2xl text-gray-400 font-bold">/ 5</span>
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Based on 0 verified reviews</p>
            </div>

            {/* Rating Bars */}
            <div className="space-y-4 flex flex-col justify-center">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-4">
                  <span className="text-xs font-black w-6">{rating}★</span>
                  <div className="flex-1 h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-accent w-0 transition-all duration-1000" />
                  </div>
                  <span className="text-xs text-gray-400 font-black tracking-widest w-8">0%</span>
                </div>
              ))}
            </div>

            {/* Action */}
            <div className="flex flex-col items-center lg:items-end justify-center">
              <button className="px-12 py-6 bg-black text-white text-[11px] font-black tracking-[0.4em] uppercase hover:bg-accent transition-all transform hover:-translate-y-2 shadow-2xl rounded-xl">
                Write a review
              </button>
            </div>
          </div>

          <div className="text-center py-32 bg-white border-4 border-dashed border-gray-50 rounded-3xl italic font-bold text-gray-300 text-xl tracking-tighter shadow-inner">
            Sharing is Caring. Be the first to leave a review!
          </div>
        </section>
      </div>
    </div>
  );
}
