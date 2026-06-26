'use client';


import { getClientIdentifiers } from '@/config/client-config';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useProductBySlug } from '@/hooks/useProductBySlug';
import { useCart } from '@/store/cart';
import { VogueProductDetails } from '../shop/vogue-product-details';
import { VogueProductCard } from '../shop/vogue-product-card';
import { getProductHref } from '@/utils/product-route';

export default function VogueThemeProductPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = decodeURIComponent((params.productSlug as string) || '');
  const storeCode = searchParams?.get('storeCode') || getClientIdentifiers().storeCode;
  const entityCode = getClientIdentifiers().entityCode;
  const { product, products, isLoading } = useProductBySlug(productSlug, storeCode, entityCode);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const sameCategory = products.filter(item => item.id !== product.id && item.category === product.category);
    return (sameCategory.length ? sameCategory : products.filter(item => item.id !== product.id)).slice(0, 4);
  }, [product, products]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">Loading Vogue Piece...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Piece not found</h1>
        <p className="text-gray-500 mb-8 max-w-md">The product you are looking for might have been moved or is no longer available.</p>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-4 bg-accent text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl shadow-xl"
        >
          Back to Collection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <VogueProductDetails product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="container mx-auto px-4 lg:px-8 py-32 border-t-8 border-gray-50">
          <div className="flex flex-col items-center mb-16 text-center">
             <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-accent mb-4 underline decoration-2 underline-offset-8">Complementary Pieces</h2>
             <h3 className="text-4xl font-black uppercase tracking-tighter">You may also like</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <VogueProductCard
                key={p.id}
                product={p}
                onClick={() => router.push(getProductHref(p, storeCode))}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
