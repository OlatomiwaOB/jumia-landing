'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Mocking the featured products based on the menu list (distinct from Best Sellers)
const featuredProducts = [
  {
    id: 1,
    name: 'Postpartum & Busy Mum Bundle',
    description: 'A chef-prepared, nutrient-rich solution designed specifically to nourish mums and busy families. Includes 80 delicious meal components!',
    price: '469.00',
    image: '/images/mock/mixed_platter.png',
    link: '/shop?category=bundles'
  },
  {
    id: 2,
    name: 'Fried Rice with Chicken',
    description: 'Our signature fried rice recipe includes perfectly diced chicken as standard. Rich in flavor and perfect for any occasion.',
    price: '40.00',
    image: '/images/mock/jollof_rice.png',
    link: '/shop?category=rice-dishes'
  },
  {
    id: 3,
    name: 'Beans Porridge',
    description: 'Rich, wholesome, and perfectly spiced beans porridge cooked to absolute perfection. A timeless classic.',
    price: '55.00',
    image: '/images/mock/yam_porridge.png',
    link: '/shop?category=porridges'
  },
  {
    id: 4,
    name: 'Gizdodo Special',
    description: 'A mouthwatering fusion of perfectly fried plantain and tender gizzard mixed in our signature spicy pepper sauce.',
    price: '65.00',
    image: '/images/mock/moi_moi.png',
    link: '/shop?category=sides'
  },
  {
    id: 5,
    name: 'Jumbo Turkey Mid-Wings',
    description: 'Tender, succulent jumbo turkey mid-wings tossed in our fiery, irresistible signature pepper sauce.',
    price: '3.00',
    image: '/images/mock/peppered_snail.png',
    link: '/shop?category=proteins'
  },
  {
    id: 6,
    name: 'Classic Moimoi Wraps',
    description: 'Authentic Nigerian steamed bean pudding, beautifully wrapped in fresh aromatic leaves for that traditional taste.',
    price: '39.00',
    image: '/images/mock/moi_moi.png',
    link: '/shop?category=small-chops'
  }
];

export default function FeaturedProductsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRTL, setIsRTL] = useState(false);

  // Track RTL changes
  useEffect(() => {
    const html = document.documentElement;
    setIsRTL(html.dir === 'rtl');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'dir') {
          setIsRTL(html.dir === 'rtl');
        }
      });
    });

    observer.observe(html, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Auto-rotate every 10 seconds
  useEffect(() => {
    const maxIndex = featuredProducts.length - 1;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setActiveIndex((prev) => (prev >= featuredProducts.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev <= 0 ? featuredProducts.length - 1 : prev - 1));
  };

  return (
    <div className="w-full bg-accent-foreground relative">
      <section className="w-full px-4 md:px-6 pt-16 pb-12 max-w-[1600px] mx-auto overflow-hidden relative">

        {/* Decorative Background Elements behind the cards */}
        <div className="absolute top-10 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        {/* Slider Container */}
        <div
          className="flex transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(${(isRTL ? 1 : -1) * (featuredProducts.length - 1 - activeIndex) * 100}%)` }}
        >
          {[...featuredProducts].reverse().map((product, index) => {
            const isActive = featuredProducts.length - 1 - index === activeIndex;

            return (
              <div
                key={product.id}
                className={`flex flex-col sm:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shrink-0 w-full h-auto sm:h-[500px] relative transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-40'}`}
              >
                {/* Left Content */}
                <div className="w-full sm:w-[55%] p-8 sm:p-16 lg:p-20 flex flex-col justify-center items-start z-10 bg-white relative">



                  {/* Premium Badge */}
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 font-extrabold text-[11px] uppercase tracking-widest shadow-sm mb-6 border border-orange-100 mt-12 sm:mt-0">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Featured Product</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[36px] sm:text-[46px] lg:text-[56px] font-black text-[#111] leading-[1.05] tracking-tight mb-4">
                    {product.name}
                  </h3>

                  {/* Price Tag */}
                  <div className="text-3xl lg:text-4xl font-black text-accent mb-6 flex items-baseline gap-1">
                    <span className="text-xl lg:text-2xl font-bold">£</span>
                    {product.price}
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-[16px] lg:text-[18px] mb-10 font-medium leading-relaxed max-w-lg">
                    {product.description}
                  </p>

                  {/* Button */}
                  <Link href={product.link}>
                    <button className="group flex items-center gap-3 bg-accent text-accent-foreground px-10 py-4 rounded-full font-extrabold text-[16px] hover:bg-accent/90 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 duration-300">
                      Buy Now
                      <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                    </button>
                  </Link>
                </div>

                {/* Right Image */}
                <div className="w-full sm:w-[45%] relative h-[300px] sm:h-full flex-shrink-0 bg-gray-50 group">
                  <div className={`absolute inset-0 sm:rounded-l-[200px] overflow-hidden transform origin-right transition-transform duration-[10000ms] ease-linear ${isActive ? 'scale-110' : 'scale-100'} shadow-[-15px_0_40px_rgba(0,0,0,0.06)]`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={isActive}
                    />
                    {/* Subtle aesthetic gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent opacity-60 mix-blend-overlay" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>
    </div>
  );
}
