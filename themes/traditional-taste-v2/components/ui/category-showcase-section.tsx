'use client';


import { getClientIdentifiers } from '@/config/client-config';
import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from './product-card';
import { useSearchParams } from "next/navigation";
import { useProducts } from '@/hooks/useProducts';
import { ProductProps } from '@/types';
import { formatPrice, CurrencyCode } from '@/utils/helperfns';

export default function CategoryShowcaseSection() {
  const searchParams = useSearchParams();
  const storeCode = searchParams?.get('storeCode') || getClientIdentifiers().storeCode;
  const entityCode = getClientIdentifiers().entityCode;

  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: productsData, isLoading: productsLoading } = useProducts(
    storeCode,
    entityCode,
    '', // Empty string fetches all categories automatically
    '',
    'showcase',
    1,
    50 // Fetch 50 products so we can find specific ones like Egusi
  );



  const displayProducts: Product[] = (productsData?.products || [])
    .filter((p: ProductProps) => !!p.picture)
    .map((p: ProductProps, i: number) => ({
      id: p.id || i,
      vendor: p.storeName || 'Restaurant',
      title: p.name || 'Unknown',
      price: p.salePrice ? formatPrice(p.salePrice, (p.ccy as CurrencyCode) || 'GBP') : formatPrice(0, (p.ccy as CurrencyCode) || 'GBP'),
      originalPrice: p.oldPrice ? formatPrice(p.oldPrice, (p.ccy as CurrencyCode) || 'GBP') : null,
      discount: p.discount ? `-${p.discount}%` : null,
      image: p.name?.toLowerCase().includes('peppered chicken') ? (productsData?.products?.find((prod: any) => prod.name?.toLowerCase().includes('egusi'))?.picture || '/pounded_yam_egusi.jpg') : p.picture,
      badges: [],
      stock: (p.qtyInStore ?? 1) > 0,
      offer: null
    }));

  return (
    <section className="w-full px-0 md:px-4 lg:px-10 py-2 md:py-4 max-w-[1640px] mx-auto bg-[var(--color-bg-main)]">
      <div className="w-full bg-gradient-to-br from-[#fdf2e3] via-[#fffbf6] to-[#fdf2e3] rounded-none md:rounded-[40px] py-8 md:py-12 px-4 md:px-8 lg:px-12 relative overflow-hidden shadow-md ring-1 ring-white/50">

        {/* Header */}
        <div className="mb-8 md:mb-10 flex items-center gap-4">
          <div className="w-1.5 h-8 bg-[var(--color-primary)] rounded-full shadow-sm"></div>
          <h2 className="text-[#1C1917] dark:text-white text-[28px] md:text-[36px] font-extrabold tracking-tight">HomeMade Food</h2>
        </div>

        {/* Layout Flex */}
        <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">

          {/* Left Banner */}
          <div className="w-full lg:w-1/4 shrink-0 bg-gradient-to-b from-[#fff7ed] to-[#ffedd5] rounded-3xl overflow-hidden group cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative min-h-[360px] flex flex-col border border-orange-100/50">

            {/* Top text area */}
            <div className="px-6 pt-12 pb-4 z-10 relative">
              <span className="inline-block bg-[var(--color-primary)] text-white text-[10px] font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider shadow-sm">🍽 Authentic</span>
              <h3 className="text-[24px] md:text-[28px] font-extrabold text-[#431407] leading-tight mb-6">
                Premium Nigerian Dishes
              </h3>
              <Link href="/shop" className="inline-flex items-center gap-2 text-[var(--color-primary)] font-bold text-[13px] uppercase tracking-wider group/link">
                Shop All
                <span className="transform group-hover/link:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>

            {/* Image fills bottom */}
            <div className="relative flex-1 min-h-[220px] mt-2">
              {/* Gradient overlay blending top of image into the card bg */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#ffedd5] via-[#ffedd5]/80 to-transparent z-10 pointer-events-none"></div>
              <Image
                src="/nigerian-food-banner.png"
                alt="Delicious Nigerian Food"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="w-full lg:w-3/4 relative">
            {productsLoading ? (
              <div className="flex items-center justify-center h-full min-h-[250px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
              </div>
            ) : displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 w-full pt-4 md:pt-8">
                {(() => {
                  const sliced = displayProducts.slice(2, 4);
                  const egusiProduct = displayProducts.find(p => p.title.toLowerCase().includes('egusi'));
                  if (egusiProduct && sliced.length > 1) {
                    sliced[1] = egusiProduct;
                  }
                  return sliced;
                })().map((product) => (
                  <div key={product.id} className="flex flex-col items-center text-center group cursor-pointer w-full bg-white/40 hover:bg-white/80 rounded-[40px] p-6 lg:p-8 transition-colors duration-500 shadow-sm hover:shadow-xl border border-white/50">
                    <div className="relative w-full aspect-[4/5] max-w-[320px] lg:max-w-[380px] mx-auto rounded-full overflow-hidden mb-8 shadow-md group-hover:shadow-2xl transition-shadow duration-500 ring-4 ring-white/60">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover object-center w-full h-full scale-150"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <h3 className="text-xl md:text-[26px] text-[#1C1917] mb-3 font-black tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                      {product.title}
                    </h3>
                    <p className="text-base md:text-[20px] font-extrabold text-[var(--color-primary)] mb-8">
                      {product.price}
                    </p>
                    <Link
                      href="/shop"
                      className="bg-[#1C1917] hover:bg-[var(--color-primary)] text-white text-[12px] md:text-[14px] font-bold px-10 py-3.5 rounded-full transition-all duration-300 uppercase tracking-widest shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      VIEW SHOP
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[250px] text-[var(--color-text)] opacity-60">
                No items found for this category.
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
