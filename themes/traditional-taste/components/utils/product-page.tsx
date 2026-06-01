'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Truck,
  Star,
  Heart,
  Clock,
  Facebook,
  Twitter,
  Copy,
  ShoppingBag,
} from 'lucide-react';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { useProductBySlug } from '@/hooks/useProductBySlug';
import { useCart } from '@/store/cart';
import {
  getCategoryHref,
  getProductGallery,
  getProductHref,
  slugifyProductName,
} from '@/utils/product-route';
import { getMockedProducts } from '@/utils/mocked-products';
import { ProductImageLightbox } from './product-image-lightbox';
import { RecentPurchaseToast } from './recent-purchase-toast';
import { ProductCard } from './products-card';
import { ProductProps } from '@/types';

const imageZoomCursor =
  'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2732%27 height=%2732%27 viewBox=%270 0 32 32%27%3E%3Ccircle cx=%2716%27 cy=%2716%27 r=%2714.5%27 fill=%27white%27 stroke=%27black%27 stroke-width=%271.5%27/%3E%3Cpath d=%27M16 10v12M10 16h12%27 stroke=%27black%27 stroke-width=%272%27 stroke-linecap=%27round%27/%3E%3C/svg%3E") 16 16, zoom-in';

export default function DepotThemeProductPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = decodeURIComponent((params.productSlug as string) || '');
  const storeCode = searchParams?.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE || '';
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || 'FTD';
  const { product: backendProduct, products, isLoading } = useProductBySlug(productSlug, storeCode, entityCode);
  
  const product = useMemo(() => {
    if (backendProduct) return backendProduct;
    // Fallback to mock products if not found in backend
    const mockedProducts = getMockedProducts({ ccy: 'GBP' });
    return mockedProducts.find(p => slugifyProductName(p.name) === productSlug);
  }, [backendProduct, productSlug]);
  const { addToCart, decrement, increment, singleQuantity } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const quantity = singleQuantity(product?.id);
  const gallery = useMemo(() => getProductGallery(product), [product]);
  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    const sourceProducts = backendProduct ? products : getMockedProducts({ ccy: 'GBP' });

    const sameCategoryProducts = sourceProducts.filter(
      (item) => item.id !== product.id && item.category === product.category
    );
    const fallbackProducts = sourceProducts.filter((item) => item.id !== product.id);

    return (sameCategoryProducts.length ? sameCategoryProducts : fallbackProducts).slice(0, 4);
  }, [product, products, backendProduct]);
  
  const discount =
    product?.salePrice && product.oldPrice && product.oldPrice > product.salePrice
      ? Math.ceil(((product.oldPrice - product.salePrice) / product.oldPrice) * 100)
      : 0;
      
  const activeImage = gallery[activeImageIndex] || product?.picture || '/placeholder-image.png';
  const price = product?.salePrice ?? product?.oldPrice ?? 0;

  useEffect(() => {
    setActiveImageIndex(0);
    setIsLightboxOpen(false);
  }, [product?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_450px]">
            <div className="aspect-square animate-pulse rounded-[2rem] bg-white shadow-sm border border-gray-100" />
            <div className="space-y-6 pt-4">
              <div className="flex gap-3"><div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" /><div className="h-6 w-32 animate-pulse rounded-full bg-gray-200" /></div>
              <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />
              <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-4 w-48 animate-pulse rounded-full bg-gray-200" />
              <div className="h-20 w-full animate-pulse rounded-lg bg-gray-100 mt-8" />
              <div className="h-14 w-full animate-pulse rounded-xl bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Product not found
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black">
            We couldn&apos;t find that product.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-black/60">
            The link may be outdated, or the product is no longer available in this store.
          </p>
          <button
            type="button"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white transition-opacity hover:opacity-90 shadow-lg shadow-accent/20"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back Home
          </button>
        </div>
      </div>
    );
  }

  // Use a default quantity of 1 for the selector if nothing is in the cart yet
  const displayQuantity = quantity > 0 ? quantity : 1;

  // Handler for custom add to cart that uses the selector value
  const handleAddToCart = () => {
    // If quantity is 0, add 1. If we had a local state for quantity, we would add that many.
    // For now, we just add the item to cart. The useCart `addToCart` handles 1 qty by default, 
    // and if we need more we would increment. Wait, our `addToCart` just adds 1. Let's just use it as is.
    addToCart(product as any);
  };

  return (
    <>
      <div className="min-h-screen bg-[#fafafa]">
        <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-8 md:py-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_450px]">
            {/* Left Column - Image Gallery */}
            <div className="space-y-4">
              <div className="relative overflow-hidden bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-center h-auto min-h-[400px]">
                <button
                  type="button"
                  className="group relative block aspect-[4/5] w-full max-w-[500px]"
                  onClick={() => setIsLightboxOpen(true)}
                  style={{ cursor: imageZoomCursor }}
                >
                  <Image
                    src={activeImage}
                    alt={product.name || 'Product image'}
                    fill
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-accent opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100">
                    <Plus className="h-5 w-5" />
                  </div>
                </button>

                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="absolute left-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition-colors hover:bg-accent hover:text-white"
                      onClick={() =>
                        setActiveImageIndex((current) => (current - 1 + gallery.length) % gallery.length)
                      }
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="absolute right-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition-colors hover:bg-accent hover:text-white"
                      onClick={() => setActiveImageIndex((current) => (current + 1) % gallery.length)}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {discount > 0 && (
                  <div className="absolute left-6 top-6 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white shadow-md">
                    -{discount}%
                  </div>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {gallery.map((image, index) => (
                    <button
                      key={`${product.code || product.name}-${index}`}
                      type="button"
                      className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${index === activeImageIndex
                          ? 'border-accent shadow-sm'
                          : 'border-transparent bg-white shadow-sm hover:border-accent/30'
                        }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-contain p-2"
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="flex flex-col">
              {/* Category & SKU */}
              <div className="flex items-center gap-3 mb-4">
                {product.category && (
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase">
                    {product.category}
                  </span>
                )}
                {product.code && (
                  <span className="text-gray-400 text-[11px] font-semibold tracking-wide">SKU: {product.code}</span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-[2.5rem] font-serif font-extrabold text-[#111827] mb-4 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Reviews */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-[2px] text-[#F4B41A]">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const rating = (product as any).rating ?? 5;
                    return (
                      <Star
                        key={star}
                        size={16}
                        className={star <= rating ? "fill-current" : "text-gray-300"}
                      />
                    );
                  })}
                </div>
                <span className="text-sm text-gray-500 font-medium ml-1">
                  {(product as any).rating ?? 5} ({(product as any).reviews ?? 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-[2.25rem] font-black text-accent leading-none">
                  {formatPrice(price, ((product.ccy as CurrencyCode) || 'NGN'))}
                </span>
                {discount > 0 && product.oldPrice && (
                  <span className="text-lg text-gray-400 line-through font-medium">
                    {formatPrice(product.oldPrice, ((product.ccy as CurrencyCode) || 'NGN'))}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2.5 h-2.5 rounded-full ${(product.qtyInStore ?? 0) > 0 ? 'bg-[#10B981]' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-semibold ${(product.qtyInStore ?? 0) > 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                  {(product.qtyInStore ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Short Description */}
              <p className="text-gray-500 text-[15px] leading-relaxed mb-8 pb-8 border-b border-gray-200">
                {product.description || `${product.name}, carefully sourced and packed. Perfect for all your culinary needs.`}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-bold text-gray-800">Quantity:</span>
                <div className="flex h-[44px] items-center justify-between rounded-xl border border-gray-200 bg-white w-32 px-1 shadow-sm">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => decrement(product as any)}
                    disabled={quantity <= 0}
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-gray-900">{displayQuantity}</span>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => increment(product as any)}
                    disabled={(product.qtyInStore ?? 0) <= 0 || quantity >= (product.qtyInStore ?? 0)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-10">
                {quantity === 0 ? (
                  <button
                    type="button"
                    className="flex-1 rounded-[1rem] bg-accent px-6 py-[18px] text-[15px] font-bold text-white transition-all hover:bg-accent/90 shadow-[0_8px_25px_rgba(249,115,22,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(249,115,22,0.4)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2.5"
                    onClick={handleAddToCart}
                    disabled={(product.qtyInStore ?? 0) <= 0}
                  >
                    <ShoppingBag size={20} strokeWidth={2.5} />
                    {(product.qtyInStore ?? 0) > 0 ? 'Add to bag' : 'Out of stock'}
                  </button>
                ) : (
                  <div className="flex-1 rounded-[1rem] border border-accent/20 bg-accent/5 px-6 py-[18px] text-[15px] font-bold text-accent flex items-center justify-center gap-2.5">
                    <CheckCircle2 size={20} strokeWidth={2.5} />
                    Added to bag
                  </div>
                )}
                <button
                  type="button"
                  className="flex w-[60px] h-[60px] flex-shrink-0 items-center justify-center rounded-[1rem] border border-gray-200 bg-white text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
                >
                  <Heart size={24} strokeWidth={1.5} />
                </button>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex gap-3.5 p-4 bg-white border border-gray-100 rounded-[1.25rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] items-center">
                  <div className="text-gray-700 flex-shrink-0">
                    <Truck size={22} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-gray-900 mb-0.5">UK-Wide Delivery</h4>
                    <p className="text-[11px] text-gray-500 font-medium">Weight-based - from £3.99</p>
                  </div>
                </div>
                <div className="flex gap-3.5 p-4 bg-white border border-gray-100 rounded-[1.25rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] items-center">
                  <div className="text-gray-700 flex-shrink-0">
                    <Clock size={22} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-gray-900 mb-0.5">Next Day</h4>
                    <p className="text-[11px] text-gray-500 font-medium">Order before 2pm</p>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-bold text-gray-800">Share:</span>
                <div className="flex items-center gap-2.5">
                  <button className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity shadow-sm hover:-translate-y-0.5">
                    <Facebook size={16} strokeWidth={2.5} />
                  </button>
                  <button className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-[#1DA1F2] text-white hover:opacity-90 transition-opacity shadow-sm hover:-translate-y-0.5">
                    <Twitter size={16} strokeWidth={2.5} />
                  </button>
                  <button className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors shadow-sm hover:-translate-y-0.5">
                    <Copy size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <section className="mt-24 pt-12 border-t border-gray-200">
              <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">You May Also Like</h2>
                </div>

                {product.category && (
                  <button
                    type="button"
                    className="hidden text-sm font-bold tracking-wide text-accent hover:text-accent/80 transition-colors md:inline-flex items-center gap-1"
                    onClick={() => router.push(getCategoryHref(product.category || '', storeCode))}
                  >
                    View more
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    onClick={() => router.push(getProductHref(relatedProduct, storeCode))}
                    product={relatedProduct}
                    storeCode={storeCode}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <ProductImageLightbox
        currentIndex={activeImageIndex}
        images={gallery}
        onIndexChange={setActiveImageIndex}
        onOpenChange={setIsLightboxOpen}
        open={isLightboxOpen}
        productName={product.name || 'Product'}
      />

      <RecentPurchaseToast entityCode={entityCode} storeCode={storeCode} />
    </>
  );
}
