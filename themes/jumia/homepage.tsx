'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ShieldCheck, RefreshCcw, ChevronLeft, ChevronRight, Star, Zap, Truck, Clock, ArrowRight } from 'lucide-react';

import { Anton, Barlow, Lilita_One } from 'next/font/google';

// Fonts are self-hosted by next/font (the CSP blocks fonts.googleapis.com / fonts.gstatic.com).
// Anton gives maximum typographic weight (billboard-style)
const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap' });
const barlow = Barlow({ weight: '900', subsets: ['latin'], display: 'swap' });
const lilitaOne = Lilita_One({ weight: '400', subsets: ['latin'], display: 'swap' });

const SLIDES = [
  {
    id: 1,
    bg: '#8fa8bf',
    leftGradient: 'linear-gradient(140deg, #6a90ae 0%, #9bbfd6 100%)',
    heading: 'WASHING\nMACHINES',
    priceLabel: 'AS LOW\nAS',
    price: '₦26,000',
    badge1: { icon: ShieldCheck, label: 'Quality Product' },
    badge2: { icon: RefreshCcw, label: 'Free Return' },
    imgSrc: '/images/hero_washing_machines.jpg',
    imgAlt: 'Washing Machines',
    imgFit: 'cover' as const,
    imgPosition: 'center right',
  },
  {
    id: 2,
    bg: '#111111',
    leftGradient: 'linear-gradient(140deg, #e84e0f 0%, #b83200 100%)',
    heading: 'SPORTING\nGOODS',
    priceLabel: 'UP TO',
    price: '50% OFF',
    badge1: { icon: ShieldCheck, label: 'Quality Products' },
    badge2: { icon: RefreshCcw, label: 'Fast Return' },
    imgSrc: '/images/hero_sporting_goods.jpg',
    imgAlt: 'Sporting Goods',
    imgFit: 'cover' as const,
    imgPosition: 'center right',
  },
  {
    id: 3,
    bg: '#0e2a1e',
    leftGradient: 'linear-gradient(140deg, #1a5c3a 0%, #0e3a22 100%)',
    heading: 'PHONES &\nTABLETS',
    priceLabel: 'FROM',
    price: '₦80,000',
    badge1: { icon: Zap, label: 'Fast Delivery' },
    badge2: { icon: Star, label: 'Top Brands' },
    imgSrc: '/images/hero_phones_tablets.jpg',
    imgAlt: 'Smartphones and Tablets',
    imgFit: 'cover' as const,
    imgPosition: 'center right',
  },
  {
    id: 4,
    bg: '#1a0f2e',
    leftGradient: 'linear-gradient(140deg, #5b1a9a 0%, #3b1070 100%)',
    heading: 'HOME &\nOFFICE',
    priceLabel: 'SAVE UP TO',
    price: '40% OFF',
    badge1: { icon: Truck, label: 'Free Delivery' },
    badge2: { icon: RefreshCcw, label: 'Easy Returns' },
    imgSrc: '/images/hero_home_office.jpg',
    imgAlt: 'Home and Office',
    imgFit: 'cover' as const,
    imgPosition: 'center right',
  },
  {
    id: 5,
    bg: '#1a0a10',
    leftGradient: 'linear-gradient(140deg, #b01030 0%, #7a0020 100%)',
    heading: 'FASHION\nFESTIVAL',
    priceLabel: 'DEALS FROM',
    price: '₦5,000',
    badge1: { icon: ShieldCheck, label: 'Authentic Items' },
    badge2: { icon: Truck, label: 'Fast Shipping' },
    imgSrc: '/images/hero_fashion_festival.jpg',
    imgAlt: 'Fashion Festival',
    imgFit: 'cover' as const,
    imgPosition: 'center right',
  },
];

const QUICK_LINKS = [
  {
    title: 'Call to Order',
    sub: 'ORDER WITH EASE',
    bg: 'bg-gradient-to-br from-pink-400 to-pink-200',
    emoji: '📞',
    circle: false,
  },
  {
    title: 'Make\nMoney',
    sub: 'Be your own\nboss',
    bg: 'bg-white border border-gray-100',
    emoji: '⭐', // using a star badge
    circle: true,
  },
  {
    title: 'Free Delivery',
    sub: 'FREE DELIVERY',
    bg: 'bg-gradient-to-br from-orange-500 to-orange-300',
    emoji: '🚚',
    circle: false,
  },
  {
    title: 'New Arrival',
    sub: 'JUST FOR YOU',
    bg: 'bg-gradient-to-br from-emerald-400 to-emerald-300',
    emoji: '📦',
    circle: false,
  },
  {
    title: 'Buy 2 Pay for 1',
    sub: 'UP TO -50%',
    bg: 'bg-gradient-to-br from-blue-500 to-blue-400',
    emoji: '🛒',
    circle: false,
  },
  {
    title: 'Banger Deals',
    sub: 'UP TO -60%',
    bg: 'bg-gradient-to-br from-red-500 to-red-400',
    emoji: '💥',
    circle: false,
  },
  {
    title: 'Jumia Global',
    sub: 'IMPORTED DEALS',
    bg: 'bg-gradient-to-br from-green-500 to-green-400',
    emoji: '🌍',
    circle: false,
  },
  {
    title: 'Clearance Sale',
    sub: 'UP TO 80% OFF',
    bg: 'bg-gradient-to-br from-purple-500 to-purple-400',
    emoji: '🏷️',
    circle: false,
  },
  {
    title: 'Official Store',
    sub: 'TOP BRANDS',
    bg: 'bg-gradient-to-br from-sky-600 to-sky-400',
    emoji: '🏅',
    circle: false,
  },
];

export default function Homepage(props: any) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((index: number) => {
    if (animating) return;
    setAnimating(true);
    setActive(index);
    setTimeout(() => setAnimating(false), 450);
  }, [animating]);

  const prev = () => goTo((active - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((active + 1) % SLIDES.length);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(i => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Swipe left/right on touch screens (the arrows are hidden on phones)
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  };

  const slide = SLIDES[active];

  return (
    <div className="w-full flex flex-col" {...props}>
      {/* ── HERO BANNER — full-width, edge to edge ── */}
      <div
        className="relative w-full overflow-hidden transition-colors duration-500"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          backgroundColor: slide.bg,
          minHeight: '260px',
          height: 'clamp(260px, 30vw, 420px)',
          borderRadius: '12px',
          boxShadow: '0 6px 30px rgba(0,0,0,0.25)',
        }}
      >
        {/* Diagonal left colour panel */}
        <div
          className="absolute inset-y-0 left-0 w-[62%] z-10 transition-all duration-500"
          style={{
            background: slide.leftGradient,
            clipPath: 'polygon(0 0, 100% 0, 78% 100%, 0 100%)',
          }}
        />

        {/* Extra depth shadow edge on the clip */}
        <div
          className="absolute inset-y-0 left-0 w-[62%] z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, transparent 70%, rgba(0,0,0,0.25) 100%)',
            clipPath: 'polygon(0 0, 100% 0, 78% 100%, 0 100%)',
          }}
        />

        {/* Product image — right side */}
        <img
          key={slide.id}
          src={slide.imgSrc}
          alt={slide.imgAlt}
          className="absolute right-0 top-0 h-full w-[60%] object-cover object-right z-0"
        />

        {/* ── LEFT TEXT CONTENT ── */}
        <div
          className="relative z-20 flex flex-col justify-center h-full w-[64%] sm:w-[55%]"
          style={{
            padding: 'clamp(16px, 3.5vw, 52px)',
            opacity: animating ? 0 : 1,
            transition: 'opacity 0.45s ease',
          }}
        >
          {/* Heading — Anton for maximum weight */}
          <h2
            style={{
              fontFamily: anton.style.fontFamily,
              fontSize: 'clamp(1.8rem, 5vw, 4.5rem)',
              lineHeight: 0.9,
              color: '#ffffff',
              letterSpacing: '-0.5px',
              textShadow: '0 3px 18px rgba(0,0,0,0.4)',
              whiteSpace: 'pre-line',
              margin: 0,
            }}
          >
            {slide.heading}
          </h2>

          {/* Price pill */}
          <div
            style={{
              marginTop: 'clamp(10px, 2vw, 20px)',
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              borderRadius: '999px',
              padding: 'clamp(6px, 1vw, 12px) clamp(12px, 2vw, 28px)',
              width: 'max-content',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              gap: '10px',
            }}
          >
            <span
              style={{
                fontFamily: barlow.style.fontFamily,
                fontWeight: 900,
                fontSize: 'clamp(8px, 0.9vw, 11px)',
                color: '#555',
                textTransform: 'uppercase',
                lineHeight: 1.2,
                whiteSpace: 'pre-line',
                textAlign: 'center',
              }}
            >
              {slide.priceLabel}
            </span>
            <span
              style={{
                fontFamily: anton.style.fontFamily,
                fontSize: 'clamp(1.4rem, 3.5vw, 3.5rem)',
                color: '#111',
                lineHeight: 1,
                letterSpacing: '-1px',
              }}
            >
              {slide.price}
            </span>
          </div>

          {/* T&Cs */}
          <p style={{ marginTop: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em' }}>
            T&amp;Cs Apply
          </p>

          {/* Badges */}
          <div className="hidden sm:flex" style={{ marginTop: 'clamp(8px, 1.5vw, 14px)', alignItems: 'center', gap: 'clamp(10px, 1.5vw, 20px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <slide.badge1.icon size={20} color="white" strokeWidth={2} />
              <span style={{ color: 'white', fontSize: 'clamp(10px, 0.9vw, 12px)', fontWeight: 800, letterSpacing: '0.03em', lineHeight: 1.25 }}>
                {slide.badge1.label}
              </span>
            </div>
            <div style={{ width: '1.5px', height: '22px', background: 'rgba(255,255,255,0.35)', borderRadius: '2px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <slide.badge2.icon size={20} color="white" strokeWidth={2} />
              <span style={{ color: 'white', fontSize: 'clamp(10px, 0.9vw, 12px)', fontWeight: 800, letterSpacing: '0.03em', lineHeight: 1.25 }}>
                {slide.badge2.label}
              </span>
            </div>
          </div>
        </div>

        {/* ── LEFT ARROW ── */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="hidden md:flex"
          style={{
            position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 30, width: '44px', height: '44px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            transition: 'transform 0.15s, background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-50%) scale(1.12)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(-50%) scale(1)')}
        >
          <ChevronLeft size={24} strokeWidth={2.8} color="#222" />
        </button>

        {/* ── RIGHT ARROW ── */}
        <button
          onClick={next}
          aria-label="Next slide"
          className="hidden md:flex"
          style={{
            position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 30, width: '44px', height: '44px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            transition: 'transform 0.15s, background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-50%) scale(1.12)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(-50%) scale(1)')}
        >
          <ChevronRight size={24} strokeWidth={2.8} color="#222" />
        </button>

        {/* ── PAGINATION DOTS ── */}
        <div style={{
          position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 30, display: 'flex', alignItems: 'center', gap: '6px',
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)',
          padding: '6px 14px', borderRadius: '999px',
        }}>
          {SLIDES.map((_, i) =>
            i === active ? (
              <div key={i} style={{ width: '22px', height: '7px', borderRadius: '999px', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.3)', transition: 'all 0.3s' }} />
            ) : (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  border: '1.5px solid rgba(255,255,255,0.7)',
                  background: 'transparent', cursor: 'pointer', padding: 0,
                }}
              />
            )
          )}
        </div>
      </div>

      {/* ── QUICK LINKS (ICONS ROW) ── */}
      <div className="w-full bg-white rounded-lg shadow-sm p-3 md:p-4 mt-2">
        <div className="flex items-center gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-2 md:pb-0 snap-x">
          {QUICK_LINKS.map((link, idx) => {
            if (link.circle) {
              return (
                <a key={idx} href="#" className="snap-start shrink-0 group relative flex flex-col items-center justify-center w-[120px] md:w-[140px] aspect-square rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1" style={{ background: link.bg }}>
                  <div className="absolute top-1 right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white z-10">
                    <Star size={16} fill="currentColor" />
                  </div>
                  <h3 className="font-black text-gray-900 text-[18px] md:text-[22px] leading-[1.1] text-center whitespace-pre-line tracking-tight">
                    {link.title}
                  </h3>
                  <p className="font-semibold text-gray-600 text-[11px] md:text-[13px] text-center whitespace-pre-line leading-tight mt-1">
                    {link.sub}
                  </p>
                </a>
              );
            }

            return (
              <a key={idx} href="#" className={`snap-start shrink-0 relative flex flex-col items-center justify-between w-[120px] md:w-[140px] aspect-square rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-3 overflow-hidden group ${link.bg}`}>
                <div className="w-full flex justify-between items-start z-10">
                  <span className="font-bold text-white text-[12px] md:text-[13px] leading-tight max-w-[80%]">{link.title}</span>
                  <ChevronRight size={16} className="text-white/80 shrink-0" />
                </div>

                {/* 3D Emoji acting as icon */}
                <div className="text-[50px] md:text-[60px] leading-none drop-shadow-xl my-auto group-hover:scale-110 transition-transform duration-300">
                  {link.emoji}
                </div>

                <div className="bg-white rounded-full px-3 py-1 mt-auto z-10 shadow-sm w-[90%] flex justify-center">
                  <span className="text-gray-800 font-extrabold text-[9px] md:text-[10px] whitespace-nowrap" style={{ color: link.bg.includes('pink') ? '#ec4899' : link.bg.includes('orange') ? '#f97316' : link.bg.includes('emerald') ? '#10b981' : link.bg.includes('blue') ? '#3b82f6' : '#ef4444' }}>
                    {link.sub}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── FLASH SALES SECTION ── */}
      <FlashSales />

      {/* ── RECENTLY VIEWED SECTION ── */}
      <RecentlyViewed />

      {/* ── DEALS OF THE DAY SECTION ── */}
      <DealsOfTheDay />

      {/* ── ALL YOUR ESSENTIALS SECTION ── */}
      <EssentialsGrid />

      {/* ── TOP SELLERS SECTION ── */}
      <TopSellers />

      {/* ── SPONSORED PRODUCTS SECTION ── */}
      <SponsoredProducts />

      {/* ── LIMITED STOCK DEALS SECTION ── */}
      <LimitedStockDeals />

      {/* ── SERVICES STRIP (Exclusive deals, Delivery, Seller, JForce) ── */}
      <ServicesStrip />

      {/* ── BOYS FASHION SECTION ── */}
      <ProductSection title="Boys Fashion - Clothing" subtitle="Kids Playnest" products={BOYS_FASHION} />

      {/* ── JUMIA BAR SECTION ── */}
      <ProductSection title="Jumia Bar" subtitle="18+ Drink Responsibly." products={JUMIA_BAR} variant="light" />

      {/* ── ABOUT / SEO TEXT SECTION ── */}
      <AboutJumia />
    </div>
  );
}

// ── FLASH SALES COMPONENT ──

const FLASH_PRODUCTS = [
  {
    id: 1,
    name: 'EASYPIE 20000mAh Ultra Slim Power Bank Fast...',
    image: '/images/flash_powerbank.jpg',
    stockText: '4139 items in stock',
    stockAlert: false,
    rating: 3.5,
    reviews: 41791,
    price: '₦ 7,800',
    oldPrice: '₦ 14,400',
    discount: '-46%',
  },
  {
    id: 2,
    name: 'Hisense 1.5HP Inverter Split Unit Air Conditione...',
    image: '/images/flash_ac.jpg',
    stockText: '5 items left',
    stockAlert: true,
    rating: 4.3,
    reviews: 275,
    price: '₦ 399,725',
    oldPrice: '₦ 530,304',
    discount: '-25%',
  },
  {
    id: 3,
    name: 'HANSEN Electric Iron Pressing Clothes 1000W',
    image: '/images/flash_iron.jpg',
    stockText: '20 items in stock',
    stockAlert: false,
    rating: 3.7,
    reviews: 11279,
    price: '₦ 5,959',
    oldPrice: '₦ 7,117',
    discount: '-16%',
  },
  {
    id: 4,
    name: 'Nexus 16 Inches Standing Fan (NXSF 4400B) - Black',
    image: '/images/flash_fan.jpg',
    stockText: '20 items in stock',
    stockAlert: false,
    rating: 3.9,
    reviews: 5314,
    price: '₦ 23,629',
    oldPrice: '₦ 31,075',
    discount: '-24%',
  },
  {
    id: 5,
    name: 'Oraimo SpaceBuds Neo True Wireless Spatial...',
    image: '/images/flash_earbuds.jpg',
    stockText: '20 items in stock',
    stockAlert: false,
    rating: 4.3,
    reviews: 3117,
    price: '₦ 17,798',
    oldPrice: '₦ 43,200',
    discount: '-59%',
  },
  {
    id: 6,
    name: 'Boscon Auto Ignition Table Top Gas Cooker-2...',
    image: '/images/flash_gascooker.jpg',
    stockText: '20 items in stock',
    stockAlert: false,
    rating: 3.7,
    reviews: 3395,
    price: '₦ 16,599',
    oldPrice: '₦ 19,024',
    discount: '-13%',
  },
  {
    id: 7,
    name: 'Syinix 2.2L Electric Kettle - Silver SKE22U1',
    image: '/images/flash_kettle.jpg',
    stockText: '1000 items in stock',
    stockAlert: false,
    rating: 3.9,
    reviews: 15127,
    price: '₦ 6,399',
    oldPrice: '₦ 7,229',
    discount: '-12%',
  },
  {
    id: 8,
    name: 'Hisense 5kg Top Load Twin Tub Washing...',
    image: '/images/flash_washingmachine.jpg',
    stockText: '20 items in stock',
    stockAlert: false,
    rating: 4.2,
    reviews: 2596,
    price: '₦ 146,190',
    oldPrice: '₦ 197,200',
    discount: '-26%',
  },
];

function FlashSales() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 53 * 60 + 9);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#c2183b] rounded-lg mt-4 shadow-sm pb-3 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight">Flash Sales</h2>
          <div className="hidden sm:flex items-center gap-1.5 bg-white text-[#c2183b] px-3 py-1.5 rounded-md font-bold text-sm md:text-base">
            <Clock size={16} className="text-[#c2183b]" />
            <span>{formattedTime}</span>
          </div>
        </div>
        <button className="flex items-center gap-1 bg-white text-[#c2183b] hover:bg-gray-100 transition-colors px-3 py-1.5 md:px-4 md:py-2 rounded-full font-semibold text-sm md:text-base shadow-sm">
          See All <ChevronRight size={16} />
        </button>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="relative group/nav">
        {/* Left Nav */}
        <button
          onClick={scrollLeft}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full hidden md:flex items-center justify-center shadow-lg border border-gray-100 opacity-0 group-hover/nav:opacity-100 transition-opacity disabled:opacity-0"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide snap-x px-3 md:px-4"
        >
          {FLASH_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px] snap-start hover:shadow-lg transition-shadow cursor-pointer relative group"
            >
              {/* Image */}
              <div className="w-full aspect-square relative bg-white p-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Stock Bar */}
              <div className={`w-full py-1 text-center text-[10px] sm:text-xs font-semibold ${product.stockAlert ? 'bg-red-50 text-[#c2183b]' : 'bg-[#fff5e6] text-[#b87c12]'}`}>
                {product.stockText}
              </div>

              {/* Content */}
              <div className="p-2 sm:p-3 pb-4">
                <h3 className="text-gray-800 text-xs sm:text-sm font-medium line-clamp-2 min-h-[32px] sm:min-h-[40px] leading-tight">
                  {product.name}
                </h3>

                <div className="flex items-center gap-1 mt-1 text-gray-500 text-[10px] sm:text-xs">
                  <Star size={12} className="fill-orange-400 text-orange-400" />
                  <span>{product.rating} <span className="text-gray-400">({product.reviews})</span></span>
                </div>

                <div className="mt-2 flex flex-col">
                  <span className="font-bold text-gray-900 text-sm sm:text-base">{product.price}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-gray-400 line-through text-[10px] sm:text-xs">{product.oldPrice}</span>
                    <span className="bg-[#e6f4ea] text-[#137333] px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-semibold">{product.discount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Nav */}
        <button
          onClick={scrollRight}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full hidden md:flex items-center justify-center shadow-lg border border-gray-100 opacity-0 group-hover/nav:opacity-100 transition-opacity"
        >
          <ChevronRight size={24} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}

// ── RECENTLY VIEWED COMPONENT ──

const RECENTLY_VIEWED_PRODUCTS = [
  {
    id: 1,
    name: 'COLA 2000 SOLAR GENERATOR',
    image: '/images/generator.jpg',
    price: '₦ 615,950',
    discount: '-15%',
  },
  {
    id: 2,
    name: 'HISENSE 1.5HP AC',
    image: '/images/flash_ac.jpg',
    price: '₦ 399,725',
    discount: '-25%',
  },
  {
    id: 3,
    name: 'HANSEN ELECTRIC IRON',
    image: '/images/flash_iron.jpg',
    price: '₦ 5,959',
    discount: '-16%',
  }
];

function RecentlyViewed() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#535357] rounded-lg mt-4 shadow-sm pb-4 relative">
      <div className="flex items-center justify-between p-3 md:p-4">
        <h2 className="text-white text-xl md:text-2xl font-bold tracking-tight">Recently viewed</h2>
        <button className="flex items-center gap-1 bg-white text-gray-800 hover:bg-gray-100 transition-colors px-3 py-1.5 md:px-4 md:py-2 rounded-full font-medium text-xs md:text-sm shadow-sm">
          See All &rarr;
        </button>
      </div>

      <div className="relative group/nav">
        <button
          onClick={scrollLeft}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full hidden md:flex items-center justify-center shadow-lg border border-gray-100 opacity-0 group-hover/nav:opacity-100 transition-opacity"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide snap-x px-3 md:px-4"
        >
          {RECENTLY_VIEWED_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-md flex-shrink-0 w-[240px] md:w-[280px] p-2 flex items-center gap-3 snap-start hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white flex items-center justify-center p-1 rounded border border-gray-100">
                <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-gray-700 text-[10px] md:text-xs uppercase line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-bold text-gray-900 text-sm md:text-base">{product.price}</span>
                  <span className="bg-[#00a060] text-white px-1 py-0.5 rounded text-[10px] font-semibold">{product.discount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full hidden md:flex items-center justify-center shadow-lg border border-gray-100 opacity-0 group-hover/nav:opacity-100 transition-opacity"
        >
          <ChevronRight size={24} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}

// ── DEALS OF THE DAY COMPONENT ──

// Transparent PNG cut-outs so the product sits on top of the orange circle.
const DEALS_OF_THE_DAY = [
  { id: 1, name: 'HANSEN Electric Iron', image: '/images/deal_iron.png', price: '₦5,959' },
  { id: 2, name: 'EASYPIE 20000mAh Power Bank', image: '/images/deal_powerbank.png', price: '₦13,800' },
  { id: 3, name: 'Syinix 2.2L Electric Kettle', image: '/images/deal_kettle.png', price: '₦6,399' },
  { id: 4, name: 'Nexus 16 Inches Standing Fan', image: '/images/deal_fan.png', price: '₦23,629' },
];

const DEALS_FONT = `${lilitaOne.style.fontFamily}, 'Arial Black', sans-serif`;

// Banner text is sized in cqw (container query width) so the lockup scales with the banner.
function DealsBanner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`shrink-0 aspect-[3/4] rounded-2xl bg-[#e2775a] items-center justify-center overflow-hidden ${className}`}
      style={{ containerType: 'inline-size' }}
    >
      <div className="flex flex-col items-center -rotate-[8deg]" style={{ fontFamily: DEALS_FONT }}>
        <span
          className="leading-[0.9] text-white"
          style={{
            fontSize: '33cqw',
            WebkitTextStroke: '3cqw #f3c27a',
            paintOrder: 'stroke fill',
            textShadow: '1px 1px 0 #d8862c, 2px 2px 0 #d8862c, 3px 3px 0 #d8862c, 4px 4px 0 #c2701f',
            letterSpacing: '-0.03em',
          }}
        >
          Deals
        </span>
        <span
          className="text-white leading-none rounded-full bg-[#a57be3] -rotate-[4deg]"
          style={{ fontSize: '14cqw', padding: '2cqw 7cqw', marginTop: '-1cqw', boxShadow: '3px 4px 0 #7b55b8' }}
        >
          of the
        </span>
        <span
          className="leading-[0.9] text-[#f0a035]"
          style={{
            fontSize: '40cqw',
            marginTop: '1cqw',
            marginLeft: '8cqw',
            WebkitTextStroke: '3.5cqw #fff5e0',
            paintOrder: 'stroke fill',
            textShadow: '1px 1px 0 #b5651d, 2px 2px 0 #b5651d, 3px 3px 0 #b5651d, 4px 4px 0 #b5651d, 5px 5px 0 #9a5418',
            letterSpacing: '-0.03em',
          }}
        >
          Day
        </span>
      </div>
    </div>
  );
}

function DealsOfTheDay() {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-3 md:p-4 mt-4">
      <div className="flex items-center gap-3 md:gap-4">
        <DealsBanner className="flex w-[34%] sm:w-[20%] lg:w-[15%]" />

        {/* 2x2 on phones, single row from sm up — always fits the width, no scrolling */}
        <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-2 md:gap-x-6">
          {DEALS_OF_THE_DAY.map(product => (
            <a key={product.id} href="#" className="group flex flex-col items-center gap-1 md:gap-2 min-w-0">
              <div className="relative w-[85%] aspect-square rounded-full bg-[#f0a035]">
                {/* image matches the circle's size */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute z-10 inset-0 w-full h-full p-[10%] object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="font-mono text-gray-700 tracking-tight whitespace-nowrap" style={{ fontSize: 'clamp(12px, 1.8vw, 28px)' }}>
                {product.price}
              </span>
            </a>
          ))}
        </div>

        <DealsBanner className="hidden lg:flex w-[15%]" />
      </div>
    </div>
  );
}

// ── ALL YOUR ESSENTIALS COMPONENT ──

// Each image already contains its purple circle (transparent around it), so no CSS circle is needed.
const ESSENTIALS = [
  { label: 'Phones & Tablets', image: '/images/essentials/phones_tablets.png' },
  { label: 'Appliances deals', image: '/images/essentials/appliances.png' },
  { label: 'Kids, Baby And More', image: '/images/essentials/kids_baby.png' },
  { label: 'Fashion deals', image: '/images/essentials/fashion.png' },
  { label: 'Beauty Must Have', image: '/images/essentials/beauty.png' },
  { label: 'Sneakers deals', image: '/images/essentials/sneakers.png' },
  { label: 'Television deals', image: '/images/essentials/television.png' },
  { label: 'Home & Office deals', image: '/images/essentials/home_office.png' },
  { label: 'Supermarket deals', image: '/images/essentials/supermarket.png' },
  { label: 'Mobile Accessories deals', image: '/images/essentials/mobile_accessories.png' },
  { label: 'Computing deals', image: '/images/essentials/computing.png' },
  { label: 'Fitness deals', image: '/images/essentials/fitness.png' },
];

function EssentialsGrid() {
  return (
    <div className="w-full bg-[#e5f5ed] rounded-2xl p-4 md:p-6 mt-4">
      <h2 className="text-[#2e8a5c] text-xl md:text-3xl font-extrabold tracking-tight mb-4 md:mb-6">
        All Your Essentials in One Place
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-5 md:gap-x-6 md:gap-y-8">
        {ESSENTIALS.map(item => (
          <a key={item.label} href="#" className="group flex flex-col items-center gap-2 md:gap-3 min-w-0">
            <img
              src={item.image}
              alt={item.label}
              className="w-full max-w-[220px] aspect-square object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-[#2e8a5c] font-semibold text-xs sm:text-sm md:text-lg text-center leading-tight">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── TOP SELLERS COMPONENT ──

type StripProduct = {
  id: number;
  name: string;
  image: string;
  rating?: number; // some products have no rating yet
  reviews?: number;
  price: string;
  oldPrice?: string; // some products have no discount
  discount?: string;
};

const TOP_SELLERS: StripProduct[] = [
  {
    id: 1,
    name: 'Royal COMBO OFFER - Royal 55" QLED Google TV + Royal 43" Smart TV',
    image: '/images/top-sellers/royal_combo.jpg',
    rating: 4,
    reviews: 2,
    price: '₦ 589,999',
    oldPrice: '₦ 850,000',
    discount: '-31%',
  },
  {
    id: 2,
    name: 'ECOFLOW DELTA Pro 3600Wh Portable Power Station',
    image: '/images/top-sellers/ecoflow_delta_pro.jpg',
    rating: 4.8,
    reviews: 41,
    price: '₦ 2,289,000',
    oldPrice: '₦ 5,038,560',
    discount: '-55%',
  },
  {
    id: 3,
    name: 'XIAOMI Redmi 15C 6.9" 4GBRAM/128GB ROM Android 15 - Black',
    image: '/images/top-sellers/redmi_15c.jpg',
    rating: 4.1,
    reviews: 776,
    price: '₦ 176,146',
    oldPrice: '₦ 195,000',
    discount: '-10%',
  },
  {
    id: 4,
    name: 'Hisense 1HP Split Copper Inverter Air Conditioner',
    image: '/images/top-sellers/hisense_ac.jpg',
    rating: 4.6,
    reviews: 79,
    price: '₦ 379,380',
    oldPrice: '₦ 496,075',
    discount: '-24%',
  },
  {
    id: 5,
    name: "Ballantine'S Finest Scotch Whiskey 70cl",
    image: '/images/top-sellers/ballantines.jpg',
    rating: 4,
    reviews: 76,
    price: '₦ 14,585',
    oldPrice: '₦ 18,210',
    discount: '-20%',
  },
  {
    id: 6,
    name: 'NIVEA Soft Cream 200ml (48 hours hydration and freshness)',
    image: '/images/top-sellers/nivea_soft.jpg',
    rating: 4,
    reviews: 565,
    price: '₦ 7,590',
    oldPrice: '₦ 8,980',
    discount: '-16%',
  },
  {
    id: 7,
    name: 'Nexus 16 Inches Standing Fan (NXSF 4400B) - Black',
    image: '/images/flash_fan.jpg',
    rating: 3.9,
    reviews: 5314,
    price: '₦ 23,629',
    oldPrice: '₦ 31,075',
    discount: '-24%',
  },
  {
    id: 8,
    name: 'Syinix 2.2L Electric Kettle - Silver SKE22U1',
    image: '/images/flash_kettle.jpg',
    rating: 3.9,
    reviews: 15127,
    price: '₦ 6,399',
    oldPrice: '₦ 7,229',
    discount: '-12%',
  },
  {
    id: 9,
    name: 'EASYPIE 20000mAh Ultra Slim Power Bank Fast Charging',
    image: '/images/flash_powerbank.jpg',
    rating: 3.5,
    reviews: 41791,
    price: '₦ 7,800',
    oldPrice: '₦ 14,400',
    discount: '-46%',
  },
];

function TopSellers() {
  return <ProductSection title="Top Sellers" subtitle="Up to 50% Off" products={TOP_SELLERS} />;
}

// Header (title, optional subtitle, optional See All) above a scrollable product strip.
// 'purple' = white text on purple (Top Sellers, Boys Fashion); 'light' = purple text on lavender
// (Sponsored products, Jumia Bar).
function ProductSection({
  title,
  subtitle,
  products,
  variant = 'purple',
  seeAll = true,
}: {
  title: string;
  subtitle?: string;
  products: StripProduct[];
  variant?: 'purple' | 'light';
  seeAll?: boolean;
}) {
  const light = variant === 'light';
  return (
    <div className={`w-full rounded-2xl mt-4 pb-4 md:pb-5 overflow-hidden ${light ? 'bg-[#f1e9fd]' : 'bg-[#784ee6]'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-4 md:p-5 md:pb-4">
        <div>
          <h2 className={`text-2xl md:text-[32px] font-extrabold tracking-tight leading-tight ${light ? 'text-[#784ee6]' : 'text-white'}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-sm md:text-base mt-0.5 ${light ? 'text-[#784ee6]' : 'text-white/95'}`}>{subtitle}</p>
          )}
        </div>
        {seeAll && (
          <a
            href="#"
            className={`flex items-center gap-1.5 transition-colors px-4 py-2 md:px-6 md:py-2.5 rounded-full font-medium text-sm md:text-base shadow-sm shrink-0 whitespace-nowrap ${
              light ? 'bg-[#784ee6] text-white hover:bg-[#6a40d8]' : 'bg-white text-[#784ee6] hover:bg-gray-100'
            }`}
          >
            See All <ArrowRight size={18} />
          </a>
        )}
      </div>

      <ProductStrip products={products} />
    </div>
  );
}

// ── SPONSORED PRODUCTS COMPONENT ──

const SPONSORED_PRODUCTS: StripProduct[] = [
  {
    id: 1,
    name: 'Malta Guinness Can 330ml x24',
    image: '/images/sponsored/malta_guinness.jpg',
    rating: 4.4,
    reviews: 873,
    price: '₦ 13,999',
    oldPrice: '₦ 18,288',
    discount: '-24%',
  },
  {
    id: 2,
    name: 'ECOFLOW DELTA Pro 3 Portable Power Station, 4096Wh LFP Battery',
    image: '/images/sponsored/ecoflow_delta_pro_3.jpg',
    rating: 5,
    reviews: 1,
    price: '₦ 3,629,000',
    oldPrice: '₦ 5,184,000',
    discount: '-30%',
  },
  {
    id: 3,
    name: 'ECOFLOW DELTA Pro Smart Extra Battery, 3600Wh Capacity',
    image: '/images/sponsored/ecoflow_extra_battery.jpg',
    rating: 4.5,
    reviews: 10,
    price: '₦ 1,938,000',
    oldPrice: '₦ 4,318,560',
    discount: '-55%',
  },
  {
    id: 4,
    name: 'ECOFLOW DELTA 3 2000 Air Portable Power Station',
    image: '/images/sponsored/ecoflow_delta_3_air.jpg',
    rating: 4.3,
    reviews: 3,
    price: '₦ 941,000',
    oldPrice: '₦ 1,584,000',
    discount: '-41%',
  },
  {
    id: 5,
    name: 'EASYPIE 20000mAh Ultra Slim Power Bank Fast Charging',
    image: '/images/sponsored/easypie_powerbank.jpg',
    rating: 3.5,
    reviews: 41988,
    price: '₦ 7,800',
    oldPrice: '₦ 14,400',
    discount: '-46%',
  },
  {
    id: 6,
    name: 'ECOFLOW EcoFlow Solar Generator RIVER 2 Pro with 160W Solar Panel',
    image: '/images/sponsored/ecoflow_river_2_pro.jpg',
    rating: 3.7,
    reviews: 9,
    price: '₦ 564,710',
    oldPrice: '₦ 1,374,293',
    discount: '-59%',
  },
  {
    id: 7,
    name: 'COLA 2000 Solar Generator',
    image: '/images/generator.jpg',
    rating: 4.2,
    reviews: 128,
    price: '₦ 615,950',
    oldPrice: '₦ 724,647',
    discount: '-15%',
  },
  {
    id: 8,
    name: 'Hisense 1.5HP Inverter Split Unit Air Conditioner',
    image: '/images/flash_ac.jpg',
    rating: 4.3,
    reviews: 275,
    price: '₦ 399,725',
    oldPrice: '₦ 530,304',
    discount: '-25%',
  },
  {
    id: 9,
    name: 'Oraimo SpaceBuds Neo True Wireless Spatial Earbuds',
    image: '/images/flash_earbuds.jpg',
    rating: 4.3,
    reviews: 3117,
    price: '₦ 17,798',
    oldPrice: '₦ 43,200',
    discount: '-59%',
  },
];

function SponsoredProducts() {
  return <ProductSection title="Sponsored products" products={SPONSORED_PRODUCTS} variant="light" seeAll={false} />;
}

// ── LIMITED STOCK DEALS COMPONENT ──

const LIMITED_STOCK_DEALS: StripProduct[] = [
  {
    id: 1,
    name: "TCL 55 Inches UHD 4k Google Smart TV + 12 Months Warranty",
    image: '/images/limited-stock/tcl_55_tv.jpg',
    rating: 4.3,
    reviews: 916,
    price: '₦ 449,999',
    oldPrice: '₦ 650,000',
    discount: '-31%',
  },
  {
    id: 2,
    name: "Hisense 20 Litres Microwave (H20MOWS10) - White",
    image: '/images/limited-stock/hisense_microwave.jpg',
    rating: 4.4,
    reviews: 852,
    price: '₦ 78,617',
    oldPrice: '₦ 103,231',
    discount: '-24%',
  },
  {
    id: 3,
    name: "Samsung Galaxy A07 6.7\" 4GB RAM/128GB ROM - Black",
    image: '/images/limited-stock/samsung_a07.jpg',
    rating: 4.2,
    reviews: 413,
    price: '₦ 189,764',
    oldPrice: '₦ 250,000',
    discount: '-24%',
  },
  {
    id: 4,
    name: "itel 8kg Front Load Washing Machine, Steam Cleaning, BLDC 1200 RPM",
    image: '/images/limited-stock/itel_washing_machine.jpg',
    price: '₦ 440,222',
    oldPrice: '₦ 629,136',
    discount: '-30%',
  },
  {
    id: 5,
    name: "NIVEA Radiant & Beauty Even Glow Body Lotion For Women 400ml x2",
    image: '/images/limited-stock/nivea_body_lotion.jpg',
    rating: 3.9,
    reviews: 9079,
    price: '₦ 9,970',
    oldPrice: '₦ 13,270',
    discount: '-25%',
  },
  {
    id: 6,
    name: "ECOFLOW Portable Power Station RIVER 3 (10 ms UPS)",
    image: '/images/limited-stock/ecoflow_river_3.jpg',
    price: '₦ 260,000',
    oldPrice: '₦ 468,000',
    discount: '-44%',
  },
  {
    id: 7,
    name: "Nexus Inverter Freezer (NX-265HEI - 210L ) - Black",
    image: '/images/limited-stock/nexus_freezer.jpg',
    rating: 4.4,
    reviews: 37,
    price: '₦ 385,470',
    oldPrice: '₦ 511,240',
    discount: '-25%',
  },
  {
    id: 8,
    name: "ALagzi 2024 Men's Fashion Casual Sports Long Sleeve Tracksuit",
    image: '/images/limited-stock/alagzi_tracksuit.jpg',
    rating: 3.2,
    reviews: 471,
    price: '₦ 10,800',
    oldPrice: '₦ 23,476',
    discount: '-54%',
  },
  {
    id: 9,
    name: "Kahlua Liqueur 70cl",
    image: '/images/limited-stock/kahlua.jpg',
    rating: 4.4,
    reviews: 9,
    price: '₦ 14,803',
    oldPrice: '₦ 21,462',
    discount: '-31%',
  },
  {
    id: 10,
    name: "HITHIUM 1kWh Power Station - Solar charge + Free Gifts",
    image: '/images/limited-stock/hithium_power_station.jpg',
    rating: 4.3,
    reviews: 1768,
    price: '₦ 249,999',
    oldPrice: '₦ 307,711',
    discount: '-19%',
  },
  {
    id: 11,
    name: "Trendyol Knitted Casual Dress - Black",
    image: '/images/limited-stock/trendyol_dress.jpg',
    rating: 4.6,
    reviews: 5,
    price: '₦ 9,210',
    oldPrice: 'From ₦ 19,000',
    discount: '-54%',
  },
  {
    id: 12,
    name: "Centrifugal Juicer Extractor Dual Speed Stainless Steel",
    image: '/images/limited-stock/centrifugal_juicer.jpg',
    price: '₦ 33,552',
    oldPrice: '₦ 62,064',
    discount: '-46%',
  },
  {
    id: 13,
    name: "Poco C71 6.88\" 4GB RAM / 64GB ROM Android 15 - Black",
    image: '/images/limited-stock/poco_c71.jpg',
    price: '₦ 142,572',
    oldPrice: '₦ 175,000',
    discount: '-19%',
  },
  {
    id: 14,
    name: "Mi+ 43'' Inches Frameless VIDAA Smart FHD LED TV",
    image: '/images/limited-stock/mi_43_tv.jpg',
    price: '₦ 199,999',
    oldPrice: '₦ 231,138',
    discount: '-14%',
  },
  {
    id: 15,
    name: "Power Oil Bottle- 1.4L",
    image: '/images/limited-stock/power_oil.jpg',
    price: '₦ 7,290',
    oldPrice: '₦ 9,477',
    discount: '-23%',
  },
  {
    id: 16,
    name: "Sun King 16\" Rechargeable Solar Fan With 20W Panel",
    image: '/images/limited-stock/sun_king_fan.jpg',
    rating: 4.1,
    reviews: 2030,
    price: '₦ 84,482',
    oldPrice: '₦ 135,700',
    discount: '-38%',
  },
  {
    id: 17,
    name: "Asus Vivobook 14 Intel Core 7-150U/8GB RAM/512GB SSD",
    image: '/images/limited-stock/asus_vivobook_14.jpg',
    price: '₦ 839,600',
    oldPrice: '₦ 925,540',
    discount: '-9%',
  },
  {
    id: 18,
    name: "Desktop Air Conditioner With H-umidifier,USB Rechargeable Cold Fan",
    image: '/images/limited-stock/desktop_air_cooler.jpg',
    price: '₦ 23,040',
    oldPrice: '₦ 31,680',
    discount: '-27%',
  },
  {
    id: 19,
    name: "LP 43\" TV Wall Mount Bracket",
    image: '/images/limited-stock/tv_wall_mount.jpg',
    rating: 4,
    reviews: 1,
    price: '₦ 4,800',
    oldPrice: '₦ 7,200',
    discount: '-33%',
  },
  {
    id: 20,
    name: "Aeon 4 Burner 50 x 50 Gas Cooker (AGC5040J) - Black",
    image: '/images/limited-stock/aeon_gas_cooker.jpg',
    rating: 4.1,
    reviews: 957,
    price: '₦ 114,995',
    oldPrice: '₦ 162,240',
    discount: '-29%',
  },
  {
    id: 21,
    name: "Large Capacity Travel Bag With Zipper Closure And Shoulder Strap",
    image: '/images/limited-stock/travel_bag.jpg',
    rating: 3.7,
    reviews: 12,
    price: '₦ 16,800',
    oldPrice: '₦ 22,000',
    discount: '-24%',
  },
  {
    id: 22,
    name: "COLAHOME 16\" Rechargeable Solar Fan With Panel",
    image: '/images/limited-stock/colahome_fan.jpg',
    price: '₦ 49,920',
    oldPrice: '₦ 60,000',
    discount: '-17%',
  },
  {
    id: 23,
    name: "Royal COMBO OFFER - Royal 55\" QLED Google TV + Royal 43\" Smart TV",
    image: '/images/limited-stock/royal_combo.jpg',
    rating: 4,
    reviews: 2,
    price: '₦ 589,999',
    oldPrice: '₦ 850,000',
    discount: '-31%',
  },
  {
    id: 24,
    name: "Desk Mat Premium Wool Felt - Dark Grey",
    image: '/images/limited-stock/desk_mat.jpg',
    price: '₦ 6,400',
    oldPrice: '₦ 8,880',
    discount: '-28%',
  },
];

function LimitedStockDeals() {
  return (
    <div className="w-full bg-[#784ee6] rounded-2xl mt-4 pb-4 md:pb-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-4 md:p-5 md:pb-4">
        <div>
          <h2 className="text-white text-2xl md:text-[32px] font-extrabold tracking-tight leading-tight">Limited Stock deals</h2>
          <p className="text-white/95 text-sm md:text-base mt-0.5">Up to 70% Off</p>
        </div>
        <a
          href="#"
          className="flex items-center gap-1.5 bg-white text-[#784ee6] hover:bg-gray-100 transition-colors px-4 py-2 md:px-6 md:py-2.5 rounded-full font-medium text-sm md:text-base shadow-sm shrink-0 whitespace-nowrap"
        >
          See All <ArrowRight size={18} />
        </a>
      </div>

      {/* 6 per row on desktop — every card in a row shares the same height */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3 px-4 md:px-5">
        {LIMITED_STOCK_DEALS.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// ── SERVICES STRIP COMPONENT ──

const SERVICES = [
  {
    title: 'Exclusive deals',
    line1: "Guess who's bringing the deal",
    line2: 'From Around The World',
    icon: '/images/features/exclusive_deals.png',
  },
  {
    title: 'Jumia Delivery',
    line1: 'Send Package',
    line2: 'Everywhere in Nigeria',
    icon: '/images/features/jumia_delivery.png',
  },
  {
    title: 'Become a Seller',
    line1: 'Sell your product',
    line2: 'Free on Jumia',
    icon: '/images/features/become_seller.png',
  },
  {
    title: 'JForce',
    line1: 'Become your own boss',
    line2: 'Earn Enough Money',
    icon: '/images/features/jforce.png',
  },
];

function ServicesStrip() {
  return (
    <div className="w-full bg-[#f1e9fd] rounded-2xl mt-4 overflow-hidden">
      <div className="flex overflow-x-auto scrollbar-hide snap-x px-4 md:px-6 py-4 md:py-5 gap-6 md:gap-10">
        {SERVICES.map(service => (
          <a
            key={service.title}
            href="#"
            className="group flex items-center gap-3 md:gap-4 shrink-0 min-w-[260px] md:min-w-[330px] snap-start"
          >
            <img
              src={service.icon}
              alt=""
              className="w-12 h-12 md:w-16 md:h-16 object-contain shrink-0 transition-transform duration-300 group-hover:scale-110"
            />
            <div className="text-[#784ee6] leading-snug">
              <h3 className="text-base md:text-xl font-semibold group-hover:underline">{service.title}</h3>
              <p className="text-xs md:text-sm font-semibold mt-1">{service.line1}</p>
              <p className="text-xs md:text-sm">{service.line2}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── BOYS FASHION DATA ──

const BOYS_FASHION: StripProduct[] = [
  {
    id: 1,
    name: 'Beautiful boys jeans trousers and jacket 3 in 1 set',
    image: '/images/boys-fashion/boys_jeans_jacket.jpg',
    price: '₦ 26,000',
  },
  {
    id: 2,
    name: 'Catpapa Brown Striped Jumpsuit Set for Boys 1-3 Years',
    image: '/images/boys-fashion/catpapa_jumpsuit.jpg',
    rating: 4.8,
    reviews: 6,
    price: '₦ 11,088',
    oldPrice: '₦ 18,720',
    discount: '-41%',
  },
  {
    id: 3,
    name: 'Quality jersey polos for kids',
    image: '/images/boys-fashion/jersey_polo.jpg',
    price: '₦ 6,999',
    oldPrice: 'From ₦ 15,000',
    discount: '-63%',
  },
  {
    id: 4,
    name: "0-5-year-old Boy's summer Set Short Sleeved Polo and Denim Shorts",
    image: '/images/boys-fashion/boys_summer_set.jpg',
    rating: 2.7,
    reviews: 6,
    price: '₦ 8,999',
    oldPrice: '₦ 14,256',
    discount: '-37%',
  },
  {
    id: 5,
    name: 'children singlet 3pcs in different color',
    image: '/images/boys-fashion/singlet_3pcs.jpg',
    price: '₦ 7,999',
  },
  {
    id: 6,
    name: 'Babyhub Boys 2-Piece Cotton Shirt & Shorts Set',
    image: '/images/boys-fashion/babyhub_shirt_shorts.jpg',
    price: '₦ 11,650',
    oldPrice: '₦ 114,850',
    discount: '-90%',
  },
];

// ── JUMIA BAR DATA ──

const JUMIA_BAR: StripProduct[] = [
  {
    id: 1,
    name: 'Magic Moments Green Apple Flavoured Vodka 75cl',
    image: '/images/jumia-bar/magic_moments_apple.jpg',
    rating: 5,
    reviews: 3,
    price: '₦ 6,715',
    oldPrice: '₦ 7,662',
    discount: '-12%',
  },
  {
    id: 2,
    name: 'Kahlua Liqueur 70cl',
    image: '/images/jumia-bar/kahlua.jpg',
    rating: 4.4,
    reviews: 9,
    price: '₦ 14,803',
    oldPrice: '₦ 21,462',
    discount: '-31%',
  },
  {
    id: 3,
    name: 'Bombay Distilled London Dry Gin 70cl',
    image: '/images/jumia-bar/bombay_dry_gin.jpg',
    rating: 4.6,
    reviews: 15,
    price: '₦ 15,520',
    oldPrice: '₦ 20,462',
    discount: '-24%',
  },
  {
    id: 4,
    name: 'Jameson CASKMATES STOUT 40% 6X70CL',
    image: '/images/jumia-bar/jameson_caskmates.jpg',
    rating: 3.7,
    reviews: 3,
    price: '₦ 28,787',
    oldPrice: '₦ 35,000',
    discount: '-18%',
  },
  {
    id: 5,
    name: 'J&W Premium Non-Alcoholic Wine 75cl (J&W)',
    image: '/images/jumia-bar/jw_non_alcoholic_wine.jpg',
    rating: 4.3,
    reviews: 19,
    price: '₦ 6,400',
    oldPrice: '₦ 7,040',
    discount: '-9%',
  },
  {
    id: 6,
    name: 'Martini Prosecco Sparkling Wine 75cl',
    image: '/images/jumia-bar/martini_prosecco.jpg',
    rating: 4.8,
    reviews: 24,
    price: '₦ 14,420',
    oldPrice: '₦ 15,004',
    discount: '-4%',
  },
  {
    id: 7,
    name: "Ballantine'S Finest Scotch Whiskey 70cl",
    image: '/images/top-sellers/ballantines.jpg',
    rating: 4,
    reviews: 76,
    price: '₦ 14,585',
    oldPrice: '₦ 18,210',
    discount: '-20%',
  },
];

// ── ABOUT / SEO TEXT COMPONENT ──

function TextLink({ children }: { children: React.ReactNode }) {
  return (
    <a href="#" className="font-bold underline underline-offset-2 hover:text-[#784ee6] transition-colors">
      {children}
    </a>
  );
}

function AboutJumia() {
  return (
    <section className="w-full bg-white rounded-2xl mt-4 p-4 md:p-6 text-[#282828]">
      <h1 className="text-2xl md:text-[32px] font-bold leading-tight">Jumia Nigeria - Nigeria&apos;s No. 1 Shopping Destination</h1>

      <h2 className="text-lg md:text-2xl font-bold mt-4 md:mt-5">Shop for Everything You Need on Jumia Nigeria</h2>
      <p className="text-sm leading-snug mt-4">
        Jumia Nigeria is the largest online shopping website in Nigeria. We offer a platform where customers in any part of
        Nigeria can find and shop for all they need in one online store and that platform is the Jumia shopping website. On
        the Jumia mobile app or website, you can shop from the comfort of your home or during work breaks and get everything
        delivered fast without you having to stress or move an inch. Be it <TextLink>fashion</TextLink>,{' '}
        <TextLink>electronics</TextLink>, <TextLink>mobile phones</TextLink>, <TextLink>computers</TextLink>, or your
        everyday <TextLink>groceries</TextLink> you can get everything you need on Jumia online store.
      </p>
      <p className="text-sm leading-snug mt-4">
        Beyond shopping, you can also <TextLink>make money online</TextLink> through the Jumia JForce program by helping
        others place orders on Jumia and earning commission on every successful delivery. It is a simple and flexible way
        for students, entrepreneurs, and anyone looking for extra income to turn their network into steady earnings.
      </p>
      <p className="text-sm leading-snug mt-4">
        Have you used the Jumia online store today? Shop now on Jumia to enjoy a seamless online shopping experience. With
        fast delivery, free returns, and flexible payment options, you are certain to enjoy the convenience of shopping
        online.
      </p>

      <h3 className="text-base md:text-xl font-bold mt-5">Shop for Original and Quality Items at The Best Prices</h3>
      <p className="text-sm leading-snug mt-4">
        Jumia Nigeria prides itself in giving the best prices and the best quality of products you can find anywhere in the
        country. Our strong partnership with top brands like <TextLink>Oraimo</TextLink>, <TextLink>Samsung</TextLink>,{' '}
        <TextLink>Infinix</TextLink>, <TextLink>Xiaomi</TextLink>, <TextLink>Diageo</TextLink>, <TextLink>Tecno</TextLink>,{' '}
        <TextLink>Adidas</TextLink>, <TextLink>Nike</TextLink>, <TextLink>Trendyol</TextLink>, etc. guarantees our customers
        the cheapest prices on original brand products. Beyond that, customers also have exclusive access to the latest
        product released by these top brands. If you enjoy exclusivity, the <TextLink>Jumia Official Store</TextLink> is the
        right place for you. On the Jumia official stores, you can experience product launches and be among the first set of
        people in Nigeria to own new products. You can also enjoy huge offers on brand days that come with heavy discounts on
        various products ranging from mobile phones to drinks, clothing items, sneakers, and many more!
      </p>
      <p className="text-sm leading-snug mt-4">
        Explore our official stores today to see a wide range of popular brands that sell directly on our platform and get
        assured of the best prices and quality of products you buy on Jumia.
      </p>

      <h3 className="text-base md:text-xl font-bold mt-5">Shop the Latest Fashion and Trendy Outfits Online</h3>
      <p className="text-sm leading-snug mt-4">
        Discover an extensive range of fashion items for women, men, and kids on Jumia. Our{' '}
        <TextLink>women&apos;s fashion</TextLink> collection includes a diverse selection of clothing such as blouses, pants,
        and jeans. We also offer a variety of gowns in different lengths and materials to suit your individual style.
        Additionally, browse through our unique fashion accessories like <TextLink>shoes</TextLink>,{' '}
        <TextLink>bags</TextLink>, <TextLink>jewelry</TextLink>, and sunglasses, all at unbeatable prices.
      </p>
      <p className="text-sm leading-snug mt-4">
        For <TextLink>men&apos;s fashion</TextLink>, Jumia has an impressive collection of stylish clothing pieces that can
        make a statement. Find quality men&apos;s trousers, shoes, shirts, <TextLink>watches</TextLink> and suits at the most
        affordable prices. Sports enthusiasts can also get their hands on quality gym wear, trendy sneakers, and other
        sportswear items.
      </p>
      <p className="text-sm leading-snug mt-4">
        At Jumia, we haven&apos;t forgotten about the little ones. Browse through our selection of{' '}
        <TextLink>baby clothes</TextLink> for boys and girls and their accessories. Shop now on Jumia Nigeria and enjoy an
        incredible online shopping experience.
      </p>
    </section>
  );
}

// ── SHARED HORIZONTAL PRODUCT STRIP (Top Sellers, Sponsored products) ──

function ProductStrip({ products }: { products: StripProduct[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (left: number) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left, behavior: 'smooth' });
  };

  return (
    // the last card peeks out at the edge, like the original
    <div className="relative group/nav">
      <button
        onClick={() => scrollBy(-400)}
        aria-label="Scroll left"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full hidden md:flex items-center justify-center shadow-lg opacity-0 group-hover/nav:opacity-100 transition-opacity"
      >
        <ChevronLeft size={24} className="text-gray-700" />
      </button>

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide snap-x pl-4 md:pl-5">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            className="flex-shrink-0 w-[150px] sm:w-[170px] lg:w-[186px] snap-start"
          />
        ))}
      </div>

      <button
        onClick={() => scrollBy(400)}
        aria-label="Scroll right"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full hidden md:flex items-center justify-center shadow-lg opacity-0 group-hover/nav:opacity-100 transition-opacity"
      >
        <ChevronRight size={24} className="text-gray-700" />
      </button>
    </div>
  );
}

// ── SHARED PRODUCT CARD ──

function ProductCard({ product, className = '' }: { product: StripProduct; className?: string }) {
  return (
    <a href="#" className={`bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow group ${className}`}>
      {/* Image */}
      <div className="w-full aspect-square bg-white border-b border-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="px-2 pt-2 pb-3">
        <h3 className="text-gray-800 text-xs sm:text-sm line-clamp-2 leading-snug min-h-[32px] sm:min-h-[40px]">
          {product.name}
        </h3>

        {product.rating !== undefined && (
          <div className="flex items-center gap-1 mt-1 text-[11px] sm:text-xs">
            <Star size={12} className="fill-[#e8903d] text-[#e8903d]" />
            <span className="font-semibold text-gray-800">{product.rating}</span>
            <span className="text-gray-500">({product.reviews})</span>
          </div>
        )}

        <div className="mt-1.5 font-bold text-gray-900 text-sm sm:text-lg leading-tight">{product.price}</div>
        {product.oldPrice && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-gray-400 line-through text-[10px] sm:text-xs">{product.oldPrice}</span>
            <span className="bg-[#3f8e66] text-white px-1 py-0.5 rounded text-[10px] sm:text-xs font-semibold leading-none">
              {product.discount}
            </span>
          </div>
        )}
      </div>
    </a>
  );
}
