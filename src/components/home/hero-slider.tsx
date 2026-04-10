"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import heroslider from "@/components/images/hero-slider.png";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceNoAuth from "@/utils/fetch-function-auth";
import { ProductProps } from "@/types";
import ProductDetailsModal from "@/utils/product-details";
import { useSearchParams } from "next/navigation";
import { CurrencyCode, formatPrice } from '@/utils/helperfns';

interface Slide {
  id: number;
  bgImage: string;
  productImage: string;
  title: string;
  description: string;
  ctaText: string;
  product: ProductProps;
  noImg: string;
  isFirstSlide?: boolean;
  collageImages?: ProductProps[];
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [hoveredCollageImage, setHoveredCollageImage] = useState<number | null>(null);
  const [firstSlideImages, setFirstSlideImages] = useState<ProductProps[]>([]);
  const previousFirstSlideIndex = useRef<number>(-1);

  const searchParams = useSearchParams();
  const storeCode = searchParams ? searchParams.get('storeCode') || '' : '';

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: allProductsData, isLoading: allProductsLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => {
      return axiosInstanceNoAuth.request({
        method: "GET",
        url: '/ecommerce/products/list',
        params: {
          name: '',
          storeCode: storeCode || '',
          entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || 'FTD',
          category: '',
          tag: '',
          pageNumber: 1,
          pageSize: 100
        }
      }).then(response => response.data)
    }
  });

  const { data: sto0715Products } = useQuery({
    queryKey: ["sto0715-products"],
    queryFn: () => {
      return axiosInstanceNoAuth.request({
        method: "GET",
        url: '/ecommerce/products/list',
        params: {
          name: '',
          storeCode: 'STO0715',
          entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || 'FTD',
          category: '',
          tag: '',
          pageNumber: 1,
          pageSize: 100
        }
      }).then(response => response.data)
    }
  });

  // Function to get unique random products
  const getUniqueRandomProducts = useCallback((products: ProductProps[], count: number): ProductProps[] => {
    if (!products?.length) return [];

    // Remove duplicates based on product id
    const uniqueProducts = products.reduce((acc: ProductProps[], current) => {
      const exists = acc.find(product => product.id === current.id);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    // Shuffle and return requested count
    const shuffled = [...uniqueProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }, []);

  // Function to refresh first slide images
  const refreshFirstSlideImages = useCallback(() => {
    if (!allProductsData?.products) return;

    const bannerProducts = allProductsData.products.filter(
      (product: ProductProps) => product.banner === true
    );

    const fallbackProducts = sto0715Products?.products || [];

    // Combine both sources and remove duplicates
    const allAvailableProducts = [...bannerProducts, ...fallbackProducts].reduce((acc: ProductProps[], current) => {
      const exists = acc.find(product => product.id === current.id);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    // Get unique random products for collage (7 images)
    const collageImages = getUniqueRandomProducts(allAvailableProducts, 7);
    setFirstSlideImages(collageImages);
  }, [allProductsData, sto0715Products, getUniqueRandomProducts]);

  // Refresh first slide images when entering the first slide
  useEffect(() => {
    if (currentSlide === 0 && previousFirstSlideIndex.current !== 0) {
      refreshFirstSlideImages();
      previousFirstSlideIndex.current = 0;
    } else if (currentSlide !== 0) {
      previousFirstSlideIndex.current = currentSlide;
    }
  }, [currentSlide, refreshFirstSlideImages]);

  // Initial load of first slide images
  useEffect(() => {
    if (allProductsData?.products && sto0715Products?.products) {
      refreshFirstSlideImages();
    }
  }, [allProductsData, sto0715Products, refreshFirstSlideImages]);

  const slides: Slide[] = React.useMemo(() => {
    if (!allProductsData?.products) return [];

    const bannerProducts = allProductsData.products.filter(
      (product: ProductProps) => product.banner === true
    );

    const firstSlide: Slide = {
      id: 999,
      bgImage: typeof heroslider === "string" ? heroslider : heroslider.src,
      productImage: '',
      title: "Shop more.\nSpend less.",
      description: "Your everyday essentials now a few clicks closer.",
      ctaText: "Shop Now",
      product: {} as ProductProps,
      noImg: 'No image Available',
      isFirstSlide: true,
      collageImages: firstSlideImages
    };

    const productSlides = bannerProducts.map((product: ProductProps, index: number) => ({
      id: product.id || index,
      bgImage: typeof heroslider === "string" ? heroslider : heroslider.src,
      productImage: product.picture,
      title: product.name || "Product",
      noImg: 'No image available',
      description: product.description || "No description available",
      ctaText: "Buy Now",
      product: product,
      isFirstSlide: false
    }));

    return [firstSlide, ...productSlides];
  }, [allProductsData, firstSlideImages]);

  // Auto-slide functionality
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      if (!isAnimating) {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 8000);
    return () => clearInterval(interval);
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
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0
    })
  };

  const contentVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.15 + 0.3,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Responsive adjustments
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Calculate responsive container height
  const containerHeight = isMobile ? '500px' : isTablet ? '550px' : '600px';

  // Calculate responsive image size
  const productImageSize = isMobile ? 'max-h-[250px]' : isTablet ? 'max-h-[350px]' : 'max-h-[400px]';

  // Show loading state
  if (allProductsLoading) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-[16px] md:rounded-[24px] lg:rounded-[32px] bg-[#313133] flex items-center justify-center`}
        style={{ height: containerHeight }}
      >
        <div className="text-white text-lg">Loading banner products...</div>
      </div>
    );
  }

  // Show empty state if no banner products
  if (slides.length === 0) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-[16px] md:rounded-[24px] lg:rounded-[32px] bg-[#313133] flex items-center justify-center`}
        style={{ height: containerHeight }}
      >
        <div className="text-white text-lg">No featured products available</div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  // Collage layout configuration
  const collageLayout = isMobile
    ? {
      container: "grid grid-cols-3 gap-2 px-4 ",
      imageSize: "h-20 w-20 sm:h-24 sm:w-24"
    }
    : {
      container: "flex items-center space-x-4 md:space-x-6 lg:space-x-8 order-1 md:order-2",
      imageSize: "h-36 w-28 lg:h-42 lg:w-42"
    };

  // Collage image component with click handler
  const CollageImage = ({ img, idx, baseIndex = 0 }: { img: ProductProps; idx: number; baseIndex?: number }) => {
    const imageIndex = baseIndex + idx;
    return (
      <div
        key={img.id || idx}
        className="relative overflow-hidden rounded-lg bg-white backdrop-blur-sm cursor-pointer"
        onMouseEnter={() => setHoveredCollageImage(imageIndex)}
        onMouseLeave={() => setHoveredCollageImage(null)}
        onClick={() => handleProductClick(img)}
      >
        <img
          src={img.picture}
          alt={'No image available'}
          className={`${collageLayout.imageSize} object-cover transition-transform hover:scale-105`}
        />
        {hoveredCollageImage === imageIndex && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs">
            <p className="font-semibold truncate">{img.name}</p>
            <p>{formatPrice(img.salePrice || 0, img.ccy as CurrencyCode)}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={`relative w-full overflow-hidden rounded-[16px] md:rounded-[24px] lg:rounded-[32px] ${currentSlideData.isFirstSlide ? 'bg-accent' : 'bg-[#313133]'
          }`}
        style={{ height: containerHeight }}
      >
        {/* Background image with crossfade */}
        {!currentSlideData.isFirstSlide && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slides[currentSlide].bgImage})`,
                backgroundSize: isMobile ? 'cover' : 'cover',
                backgroundPosition: isMobile ? 'center center' : 'center center'
              }}
            />
          </AnimatePresence>
        )}

        {/* Overlay */}
        {!currentSlideData.isFirstSlide && <div className="absolute inset-0 bg-black/10" />}

        <div className="container relative h-full mx-auto flex items-center px-4 sm:px-6 md:px-10">
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
                opacity: { duration: 0.4 }
              }}
              className="flex flex-col md:flex-row items-center gap-6 md:gap-8 lg:gap-10 z-10 w-full"
            >
              {currentSlideData.isFirstSlide ? (
                <>
                  {/* Left side - Text content for first slide */}
                  <div className={`${isMobile ? 'w-full mt-4' : 'w-1/2 pl-2 md:pl-3 lg:pl-6'}`}>
                    <div className="text-white space-y-3 md:space-y-6 max-w-lg">
                      <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                      >
                        {currentSlideData.title}
                      </motion.h1>

                      <motion.p
                        className="text-base sm:text-lg md:text-xl"
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                      >
                        {currentSlideData.description}
                      </motion.p>

                      <motion.div
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                      >
                        <Link
                          href="/shop"
                          className="inline-flex items-center bg-white text-accent px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors group text-base sm:text-lg"
                        >
                          Shop Now
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right side - Image collage for first slide */}
                  <div className={`${isMobile ? 'w-full flex-1 flex items-center justify-center pb-4' : 'w-1/2 flex justify-center items-center'}`}>
                    <motion.div
                      key={`collage-${currentSlide}`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        transition: { delay: 0.2, duration: 0.6 }
                      }}
                      className={collageLayout.container}
                    >
                      {!isMobile ? (
                        // Desktop collage layout (3 columns)
                        <>
                          <div className="grid shrink-0 grid-cols-1 gap-y-4 lg:gap-y-6">
                            {currentSlideData.collageImages?.slice(0, 2).map((img, idx) => (
                              <CollageImage key={img.id || idx} img={img} idx={idx} baseIndex={0} />
                            ))}
                          </div>
                          <div className="grid shrink-0 grid-cols-1 gap-y-4 lg:gap-y-6">
                            {currentSlideData.collageImages?.slice(2, 5).map((img, idx) => (
                              <CollageImage key={img.id || idx} img={img} idx={idx} baseIndex={2} />
                            ))}
                          </div>
                          <div className="grid shrink-0 grid-cols-1 gap-y-4 lg:gap-y-6">
                            {currentSlideData.collageImages?.slice(5, 7).map((img, idx) => (
                              <CollageImage key={img.id || idx} img={img} idx={idx} baseIndex={5} />
                            ))}
                          </div>
                        </>
                      ) : (
                        // Mobile collage layout (3x3 grid)
                        currentSlideData.collageImages?.slice(0, 6).map((img, idx) => (
                          <CollageImage key={img.id || idx} img={img} idx={idx} />
                        ))
                      )}
                    </motion.div>
                  </div>
                </>
              ) : (
                // Regular product slides
                <>
                  <div className="flex items-center justify-between w-full md:pl-15">
                    {/* Product image (left side on larger screens, top on mobile) */}
                    <motion.div
                      className="w-full md:w-1/2 flex justify-center order-1 md:order-2"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        transition: { delay: 0.2, duration: 0.6, ease: "backOut" }
                      }}
                    >
                      <img
                        src={slides[currentSlide].productImage}
                        alt={slides[currentSlide].noImg}
                        className={`${productImageSize} object-contain text-white`}
                      />
                    </motion.div>

                    {/* Content (right side on larger screens, bottom on mobile) */}
                    <div className="w-full md:w-1/2 text-white space-y-4 md:space-y-6 order-1 md:order-2 md:text-left md:ml-15">
                      <motion.h1
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                      >
                        {slides[currentSlide].title}
                      </motion.h1>

                      <motion.p
                        className="text-sm sm:text-base md:text-lg lg:text-xl max-w-lg mx-auto md:mx-0 "
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                      >
                        {isMobile
                          ? `${slides[currentSlide].description.substring(0, 100)}...`
                          : slides[currentSlide].description
                        }
                      </motion.p>

                      <motion.div
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                        className="flex justify-start"
                      >
                        <button
                          onClick={() => handleProductClick(slides[currentSlide].product)}
                          className="inline-flex items-center bg-white text-[#d8480b] px-5 py-2 sm:px-6 sm:py-3 rounded-full font-medium hover:bg-gray-100 transition-colors group text-sm sm:text-base"
                        >
                          {slides[currentSlide].ctaText}
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination dots - position based on screen size */}
          <div className={`absolute ${isMobile ? 'bottom-4 left-1/2 transform -translate-x-1/2' : 'right-6 bottom-8'} flex gap-2 z-10`}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white w-4 sm:w-6' : 'bg-white/50 hover:bg-white/70'}`}
                aria-label={`Go to slide ${index + 1}`}
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