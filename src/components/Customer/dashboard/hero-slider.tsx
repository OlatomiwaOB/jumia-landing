// "use client";

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { ArrowRight } from "lucide-react";
// import { motion, AnimatePresence, Variants } from "framer-motion";
// import { useQuery } from "@tanstack/react-query";
// import axiosInstanceNoAuth from "@/utils/fetch-function-auth";
// import { ProductProps } from "@/types";
// import ProductDetailsModal from "@/utils/product-details";
// import { useSearchParams } from "next/navigation";
// import { CurrencyCode, formatPrice } from "@/utils/helperfns";

// /* ─────────────────────────────────────────────
//    Custom Background Component
//    Gradient: #313131 (left) → #2F2F2F (~70%) → #262626 (right)
// ───────────────────────────────────────────── */
// function SliderBackground() {
//   return (
//     <div
//       className="absolute inset-0"
//       style={{
//         background:
//           "linear-gradient(to right, #313131 0%, #2F2F2F 65%, #262626 100%)",
//       }}
//     />
//   );
// }

// /* ─────────────────────────────────────────────
//    Nested Circles Component (10 rings)
//    Centered in the left half, product sits on top
// ───────────────────────────────────────────── */
// function NestedCircles() {
//   const ringCount = 10;
//   // Smallest visible ring ~48px diameter; each step adds ~44px per side
//   const minDiameter = 48;
//   const step = 44;

//   return (
//     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//       {Array.from({ length: ringCount }).map((_, i) => {
//         const diameter = minDiameter + i * step;
//         return (
//           <div
//             key={i}
//             className="absolute rounded-full border"
//             style={{
//               width: diameter,
//               height: diameter,
//               borderColor: "#595659",
//               borderWidth: 1,
//               opacity: 1 - i * 0.06, // subtle fade on outer rings
//             }}
//           />
//         );
//       })}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    Loading Skeleton
// ───────────────────────────────────────────── */
// function LoadingSkeleton({ height }: { height: string }) {
//   return (
//     <div
//       className="relative w-full overflow-hidden rounded-[16px] md:rounded-[24px] lg:rounded-[32px]"
//       style={{ height, background: "linear-gradient(to right, #313131 0%, #2F2F2F 65%, #262626 100%)" }}
//     >
//       <div className="absolute inset-0 flex items-center justify-center gap-10 px-8">
//         {/* Left: circle skeleton */}
//         <div className="hidden md:flex w-1/2 items-center justify-center">
//           <div
//             className="rounded-full animate-pulse"
//             style={{ width: 280, height: 280, background: "#595659", opacity: 0.15 }}
//           />
//         </div>
//         {/* Right: text skeleton */}
//         <div className="w-full md:w-1/2 space-y-4">
//           <div className="h-10 w-2/3 rounded-lg animate-pulse" style={{ background: "#595659", opacity: 0.25 }} />
//           <div className="h-4 w-full rounded animate-pulse" style={{ background: "#595659", opacity: 0.15 }} />
//           <div className="h-4 w-5/6 rounded animate-pulse" style={{ background: "#595659", opacity: 0.15 }} />
//           <div className="h-4 w-4/6 rounded animate-pulse" style={{ background: "#595659", opacity: 0.15 }} />
//           <div className="mt-6 h-11 w-36 rounded-full animate-pulse" style={{ background: "#595659", opacity: 0.2 }} />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function HeroSlider() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [direction, setDirection] = useState<number>(1);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(0);
//   const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
//   const [isProductModalOpen, setIsProductModalOpen] = useState(false);

//   const searchParams = useSearchParams();
//   const storeCode = searchParams ? searchParams.get("storeCode") || "" : "";

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const { data: allProductsData, isLoading } = useQuery({
//     queryKey: ["all-products"],
//     queryFn: () =>
//       axiosInstanceNoAuth
//         .request({
//           method: "GET",
//           url: "/ecommerce/products/list",
//           params: {
//             name: "",
//             storeCode: storeCode || "",
//             entityCode: getClientIdentifiers().entityCode,
//             category: "",
//             tag: "",
//             pageNumber: 1,
//             pageSize: 100,
//           },
//         })
//         .then((r) => r.data),
//   });

//   /* Only banner products, no first-slide / STO0715 */
//   const slides: ProductProps[] = React.useMemo(() => {
//     if (!allProductsData?.products) return [];
//     return allProductsData.products.filter((p: ProductProps) => p.banner === true);
//   }, [allProductsData]);

//   /* Auto-advance */
//   useEffect(() => {
//     if (slides.length === 0) return;
//     const id = setInterval(() => {
//       if (!isAnimating) {
//         setDirection(1);
//         setCurrentSlide((prev) => (prev + 1) % slides.length);
//       }
//     }, 8000);
//     return () => clearInterval(id);
//   }, [slides.length, isAnimating]);

//   const goToSlide = (index: number) => {
//     if (index === currentSlide || isAnimating || slides.length === 0) return;
//     setIsAnimating(true);
//     setDirection(index > currentSlide ? 1 : -1);
//     setCurrentSlide(index);
//     setTimeout(() => setIsAnimating(false), 1000);
//   };

//   const handleProductClick = (product: ProductProps) => {
//     setSelectedProduct(product);
//     setIsProductModalOpen(true);
//   };

//   /* ── Variants ── */
//   const slideVariants = {
//     enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
//     center: { x: 0, opacity: 1 },
//     exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
//   };

//   const contentVariants: Variants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: (i: number) => ({
//       y: 0,
//       opacity: 1,
//       transition: { delay: i * 0.15 + 0.3, duration: 0.5, ease: "easeOut" },
//     }),
//   };

//   /* ── Responsive ── */
//   const isMobile = windowWidth < 768;
//   const isTablet = windowWidth >= 768 && windowWidth < 1024;
//   const containerHeight = isMobile ? "500px" : isTablet ? "550px" : "600px";
//   const productImageSize = isMobile ? "max-h-[200px]" : isTablet ? "max-h-[320px]" : "max-h-[380px]";

//   /* ── Loading ── */
//   if (isLoading) return <LoadingSkeleton height={containerHeight} />;

//   /* ── Empty ── */
//   if (slides.length === 0) {
//     return (
//       <div
//         className="relative w-full overflow-hidden rounded-[16px] md:rounded-[24px] lg:rounded-[32px] flex items-center justify-center"
//         style={{
//           height: containerHeight,
//           background: "linear-gradient(to right, #313131 0%, #2F2F2F 65%, #262626 100%)",
//         }}
//       >
//         <p className="text-white/60 text-lg">No featured products available.</p>
//       </div>
//     );
//   }

//   const slide = slides[currentSlide];

//   return (
//     <>
//       <div
//         className="relative w-full overflow-hidden rounded-[16px] md:rounded-[24px] lg:rounded-[32px]"
//         style={{ height: containerHeight }}
//       >
//         {/* ── Custom gradient background ── */}
//         <SliderBackground />

//         {/* ── Nested rings (left half only on desktop) ── */}
//         {!isMobile ? (
//           <div
//             className="absolute top-0 bottom-0 left-0 flex items-center justify-center"
//             style={{ width: "50%" }}
//           >
//             <NestedCircles />
//           </div>
//         ) : (
//           /* Mobile: full-width subtle rings behind image */
//           <div className="absolute inset-0 flex items-center justify-center opacity-40">
//             <NestedCircles />
//           </div>
//         )}

//         {/* ── Slide content ── */}
//         <div className="relative h-full flex items-center px-4 sm:px-8 md:px-10 lg:px-14 z-10">
//           <AnimatePresence custom={direction} mode="wait">
//             <motion.div
//               key={currentSlide}
//               custom={direction}
//               variants={slideVariants}
//               initial="enter"
//               animate="center"
//               exit="exit"
//               transition={{
//                 x: { type: "spring", stiffness: 300, damping: 30 },
//                 opacity: { duration: 0.4 },
//               }}
//               className={`flex w-full items-center ${isMobile ? "flex-col gap-4 pt-6" : "flex-row gap-8 lg:gap-12"}`}
//             >
//               {/* Left: Product image (sits above circles) */}
//               <motion.div
//                 className={`${isMobile ? "w-full flex justify-center" : "w-1/2 flex justify-center"}`}
//                 initial={{ scale: 0.85, opacity: 0 }}
//                 animate={{
//                   scale: 1,
//                   opacity: 1,
//                   transition: { delay: 0.2, duration: 0.6, ease: "backOut" },
//                 }}
//               >
//                 <img
//                   src={slide.picture}
//                   alt={slide.name || "Product"}
//                   className={`${productImageSize} w-auto object-contain drop-shadow-2xl`}
//                 />
//               </motion.div>

//               {/* Right: Text content */}
//               <div className={`${isMobile ? "w-full text-center pb-6" : "w-1/2"} text-white space-y-4 md:space-y-5`}>
//                 <motion.h1
//                   className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
//                   custom={0}
//                   initial="hidden"
//                   animate="visible"
//                   variants={contentVariants}
//                 >
//                   {slide.name}
//                 </motion.h1>

//                 <motion.p
//                   className="text-sm sm:text-base md:text-lg text-white/75 leading-relaxed max-w-md"
//                   custom={1}
//                   initial="hidden"
//                   animate="visible"
//                   variants={contentVariants}
//                 >
//                   {isMobile
//                     ? `${(slide.description || "").substring(0, 100)}${slide.description?.length > 100 ? "…" : ""}`
//                     : slide.description || "No description available."}
//                 </motion.p>

//                 {slide.salePrice && (
//                   <motion.p
//                     className="text-lg md:text-xl font-semibold text-white/90"
//                     custom={1.5}
//                     initial="hidden"
//                     animate="visible"
//                     variants={contentVariants}
//                   >
//                     {formatPrice(slide.salePrice, slide.ccy as CurrencyCode)}
//                   </motion.p>
//                 )}

//                 <motion.div
//                   custom={2}
//                   initial="hidden"
//                   animate="visible"
//                   variants={contentVariants}
//                   className={`flex ${isMobile ? "justify-center" : "justify-start"}`}
//                 >
//                   <button
//                     onClick={() => handleProductClick(slide)}
//                     className="inline-flex items-center bg-white text-[#313131] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 active:scale-95 transition-all group text-sm sm:text-base"
//                   >
//                     Buy Now
//                     <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
//                   </button>
//                 </motion.div>
//               </div>
//             </motion.div>
//           </AnimatePresence>

//           {/* ── Pagination dots – bottom right ── */}
//           <div className="absolute bottom-5 right-6 flex items-center gap-2 z-20">
//             {slides.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => goToSlide(index)}
//                 aria-label={`Go to slide ${index + 1}`}
//                 className={`h-2 rounded-full transition-all duration-300 ${
//                   currentSlide === index
//                     ? "bg-white w-6"
//                     : "bg-white/40 hover:bg-white/60 w-2"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {selectedProduct && (
//         <ProductDetailsModal
//           isOpen={isProductModalOpen}
//           setIsOpen={setIsProductModalOpen}
//           product={selectedProduct}
//         />
//       )}
//     </>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceNoAuth from "@/utils/fetch-function-auth";
import { ProductProps } from "@/types";
// import ProductDetailsModal from "@/utils/product-details";
import { useSearchParams } from "next/navigation";
import { CurrencyCode, formatPrice } from "@/utils/helperfns";
import ProductDetailsModal from "@/utils/checkout-product-details";
import { getClientIdentifiers } from '@/config/client-config';

function SliderBackground() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(to right, #313131 0%, #303030 10%, #2F2F2F 20%, #2E2E2E 30%, #2D2D2D 40%, #2C2C2C 50%, #2B2B2B 60%, #2A2A2A 70%, #292929 80%, #282828 85%, #272727 90%, #262626 100%)",
      }}
    />
  );
}

function NestedCircles() {
  const ringCount = 10;
  const minDiameter = 24;
  const step = 22;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {Array.from({ length: ringCount }).map((_, i) => {
        const diameter = minDiameter + i * step;
        return (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: diameter,
              height: diameter,
              borderColor: "#595659",
              borderWidth: 1,
              opacity: 1 - i * 0.06,
            }}
          />
        );
      })}
    </div>
  );
}

function LoadingSkeleton({ height }: { height: string }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl md:rounded-2xl"
      style={{ height, background: "linear-gradient(to right, #313131 0%, #2F2F2F 65%, #262626 100%)" }}
    >
      <div className="absolute inset-0 flex items-center gap-5 px-4">
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <div className="rounded-full animate-pulse" style={{ width: 120, height: 120, background: "#595659", opacity: 0.15 }} />
        </div>
        <div className="w-full md:w-1/2 space-y-2">
          <div className="h-4 w-2/3 rounded animate-pulse" style={{ background: "#595659", opacity: 0.25 }} />
          <div className="h-2.5 w-full rounded animate-pulse" style={{ background: "#595659", opacity: 0.15 }} />
          <div className="h-2.5 w-5/6 rounded animate-pulse" style={{ background: "#595659", opacity: 0.15 }} />
          <div className="mt-3 h-6 w-20 rounded-full animate-pulse" style={{ background: "#595659", opacity: 0.2 }} />
        </div>
      </div>
    </div>
  );
}

const storeCodeEnv = getClientIdentifiers().storeCode
export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const storeCode = searchParams ? searchParams.get("storeCode") || storeCodeEnv : "";

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: allProductsData, isLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: () =>
      axiosInstanceNoAuth
        .request({
          method: "GET",
          url: "/ecommerce/products/list",
          params: {
            name: "",
            storeCode: storeCode || "",
            entityCode: getClientIdentifiers().entityCode,
            category: "",
            tag: "",
            pageNumber: 1,
            pageSize: 10000,
          },
        })
        .then((r) => r.data),
  });

  const slides: ProductProps[] = React.useMemo(() => {
    if (!allProductsData?.products) return [];
    return allProductsData.products.filter((p: ProductProps) => p.banner === true);
  }, [allProductsData]);

  useEffect(() => {
    if (slides.length === 0) return;
    const id = setInterval(() => {
      if (!isAnimating) {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 8000);
    return () => clearInterval(id);
  }, [slides.length, isAnimating]);

  const goToSlide = (index: number) => {
    if (index === currentSlide || isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handleProductClick = (product: ProductProps) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const contentVariants: Variants = {
    hidden: { y: 10, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.12 + 0.2, duration: 0.4, ease: "easeOut" },
    }),
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  // ~half the original heights
  const containerHeight = isMobile ? "220px" : isTablet ? "260px" : "290px";
  const productImageSize = isMobile ? "max-h-[100px]" : isTablet ? "max-h-[160px]" : "max-h-[190px]";

  if (isLoading) return <LoadingSkeleton height={containerHeight} />;

  if (slides.length === 0) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-xl md:rounded-2xl flex items-center justify-center"
        style={{ height: containerHeight, background: "linear-gradient(to right, #313131 0%, #2F2F2F 65%, #262626 100%)" }}
      >
        <p className="text-white/60 text-xs">No featured products available.</p>
      </div>
    );
  }

  const slide = slides[currentSlide];

  return (
    <>
      <div
        className="relative w-full overflow-hidden rounded-xl md:rounded-3xl"
        style={{ height: containerHeight }}
      >
        <SliderBackground />

        {/* Nested rings */}
        {!isMobile ? (
          <div className="absolute top-0 bottom-0 left-0 flex items-center justify-center" style={{ width: "50%" }}>
            <NestedCircles />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <NestedCircles />
          </div>
        )}

        {/* Slide content */}
        <div className="relative h-full flex items-center px-3 sm:px-4 md:px-5 z-10">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
              }}
              className={`flex w-full items-center ${isMobile ? "flex-col gap-2 py-3" : "flex-row gap-4 lg:gap-6"}`}
            >
              {/* Left: Product image */}
              <motion.div
                className={`${isMobile ? "w-full flex justify-center" : "w-1/2 flex justify-center"}`}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { delay: 0.15, duration: 0.5, ease: "backOut" } }}
              >
                <img
                  src={slide.picture}
                  alt={slide.name || "Product"}
                  className={`${productImageSize} w-auto object-contain drop-shadow-xl`}
                />
              </motion.div>

              {/* Right: Text */}
              <div className={`${isMobile ? "w-full text-center pb-2" : "w-1/2"} text-white space-y-1.5`}>
                <motion.h1
                  className="text-sm lg:text-2xl font-bold leading-snug"
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={contentVariants}
                >
                  {slide.name}
                </motion.h1>

                <motion.p
                  className="text-xs lg:text-sm text-white/70 leading-relaxed max-w-xs"
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={contentVariants}
                >
                  {`${(slide.description || "No description available.").substring(0, isMobile ? 60 : 120)}${(slide.description || "").length > (isMobile ? 60 : 120) ? "…" : ""
                    }`}
                </motion.p>

                {/* {slide.salePrice && (
                  <motion.p
                    className="text-xs font-semibold text-white/90"
                    custom={1.5}
                    initial="hidden"
                    animate="visible"
                    variants={contentVariants}
                  >
                    {formatPrice(slide.salePrice, slide.ccy as CurrencyCode)}
                  </motion.p>
                )} */}

                <motion.div
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={contentVariants}
                  className={`flex pt-0.5 ${isMobile ? "justify-center" : "justify-start"}`}
                >
                  <button
                    onClick={() => handleProductClick(slide)}
                    className="inline-flex items-center bg-white text-[#313131] px-3 py-1.5 rounded-full font-semibold hover:bg-gray-100 active:scale-95 transition-all group text-xs"
                  >
                    Buy Now
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-white w-4" : "bg-white/40 hover:bg-white/60 w-1.5"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailsModal
          isOpen={isProductModalOpen}
          setIsOpen={setIsProductModalOpen}
          product={selectedProduct}
        />
      )}
    </>
  );
}