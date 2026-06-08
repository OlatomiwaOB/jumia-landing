'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Bolt,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flame,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { useProductBySlug } from '@/hooks/useProductBySlug';
import { useCart } from '@/store/cart';
import {
  getCategoryHref,
  getProductGallery,
  getProductHref,
} from '@/utils/product-route';

type DetailTab = 'description' | 'details' | 'shipping';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = decodeURIComponent((params.productSlug as string) || '');
  const storeCode = searchParams?.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE || '';
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || 'FTD';
  const { product, products, isLoading } = useProductBySlug(productSlug, storeCode, entityCode);
  const { addToCart, decrement, increment, singleQuantity } = useCart();
  const [activeTab, setActiveTab] = useState<DetailTab>('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const quantity = singleQuantity(product?.id);
  const gallery = useMemo(() => getProductGallery(product), [product]);
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const sameCategoryProducts = products.filter(
      (item) => item.id !== product.id && item.category === product.category
    );
    const fallbackProducts = products.filter((item) => item.id !== product.id);
    return (sameCategoryProducts.length ? sameCategoryProducts : fallbackProducts).slice(0, 4);
  }, [product, products]);

  const discount =
    product?.salePrice && product.oldPrice && product.oldPrice > product.salePrice
      ? Math.ceil(((product.oldPrice - product.salePrice) / product.oldPrice) * 100)
      : 0;

  const cartsCount = product?.id ? 2 + (product.id % 4) : 3;
  const activeImage = gallery[activeImageIndex] || product?.picture || '/placeholder-image.png';
  const price = product?.salePrice ?? product?.oldPrice ?? 0;

  const shippingHighlights = [
    {
      description: 'Fast dispatch on qualifying orders placed today.',
      icon: Truck,
      title: 'Fast delivery',
    },
    {
      description: 'Straightforward return support within 30 days.',
      icon: RotateCcw,
      title: 'Easy returns',
    },
    {
      description: 'Protected checkout and trusted store fulfillment.',
      icon: ShieldCheck,
      title: 'Secure checkout',
    },
  ];

  const tabLabels: Array<{ id: DetailTab; label: string }> = [
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Details' },
    { id: 'shipping', label: 'Shipping & Returns' },
  ];

  useEffect(() => {
    setActiveImageIndex(0);
    setActiveTab('description');
  }, [product?.id]);

  /* ── LOADING ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-main)]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-3xl bg-[var(--color-bg-secondary)]" />
            <div className="space-y-4">
              <div className="h-5 w-36 animate-pulse rounded-full bg-[var(--color-bg-secondary)]" />
              <div className="h-10 w-3/4 animate-pulse rounded-full bg-[var(--color-bg-secondary)]" />
              <div className="h-12 w-44 animate-pulse rounded-full bg-[var(--color-bg-secondary)]" />
              <div className="h-24 animate-pulse rounded-3xl bg-[var(--color-bg-secondary)]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── NOT FOUND ── */
  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-main)]">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
          <Flame className="h-16 w-16 text-[var(--color-primary)] mb-6" />
          <h1 className="text-4xl font-bold text-[var(--color-text)]">
            Product not found
          </h1>
          <p className="mt-4 max-w-xl text-[var(--color-text)] opacity-60">
            The link may be outdated, or the product is no longer available.
          </p>
          <button
            type="button"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-8 py-4 font-bold text-white transition-all hover:bg-[var(--color-text)] hover:scale-105"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back Home
          </button>
        </div>
      </div>
    );
  }

  /* ── MAIN PAGE ── */
  return (
    <div className="min-h-screen bg-[var(--color-bg-main)]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">

        {/* BACK BUTTON */}
        <button
          type="button"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] opacity-60 transition-all hover:opacity-100 hover:text-[var(--color-primary)]"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">

          {/* ── LEFT: IMAGE GALLERY ── */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl bg-[var(--color-bg-secondary)] group">
              <div className="relative aspect-square w-full">
                <Image
                  src={activeImage}
                  alt={product.name || 'Product image'}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Nav arrows */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-[var(--color-text)] transition-all hover:bg-[var(--color-primary)] hover:text-white hover:scale-110"
                    onClick={() =>
                      setActiveImageIndex((c) => (c - 1 + gallery.length) % gallery.length)
                    }
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-[var(--color-text)] transition-all hover:bg-[var(--color-primary)] hover:text-white hover:scale-110"
                    onClick={() => setActiveImageIndex((c) => (c + 1) % gallery.length)}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Discount badge */}
              {discount > 0 && (
                <div className="absolute left-5 top-5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white shadow-lg">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {gallery.map((image, index) => (
                  <button
                    key={`${product.code || product.name}-${index}`}
                    type="button"
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all hover:scale-105 ${
                      index === activeImageIndex
                        ? 'border-[var(--color-primary)] shadow-lg'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover rounded-xl"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: PRODUCT INFO ── */}
          <div className="flex flex-col gap-6">

            {/* SKU & Store */}
            <div className="space-y-1">
              {product.code && (
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                  SKU: {product.code}
                </p>
              )}
              {product.storeName && (
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                  Vendor: {product.storeName}
                </p>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex flex-wrap items-end gap-3">
              <span className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">
                {formatPrice(price, ((product.ccy as CurrencyCode) || 'NGN'))}
              </span>
              {discount > 0 && product.oldPrice && (
                <span className="text-lg text-[var(--color-text)] opacity-40 line-through">
                  {formatPrice(product.oldPrice, ((product.ccy as CurrencyCode) || 'NGN'))}
                </span>
              )}
            </div>

            {/* Tax & Shipping */}
            <div className="text-sm text-[var(--color-text)] opacity-60 space-y-1">
              <p>Taxes included.</p>
              <p>Shipping calculated at checkout.</p>
            </div>

            {/* Urgency indicators */}
            <div className="space-y-3 border-y border-[var(--color-text)]/10 py-5">
              <div className="flex items-center gap-3 text-sm">
                <Bolt className="h-4 w-4 text-[var(--color-primary)]" />
                <span className="font-semibold text-[var(--color-primary)]">Selling quickly!</span>
                <span className="text-[var(--color-text)] opacity-65">
                  {cartsCount} people have this item in their carts
                </span>
              </div>
              <div
                className={`flex items-center gap-3 text-sm font-medium ${
                  (product.qtyInStore ?? 0) > 0 ? 'text-green-600' : 'text-red-500'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {(product.qtyInStore ?? 0) > 0
                    ? `${product.qtyInStore} in stock`
                    : 'Currently out of stock'}
                </span>
              </div>
            </div>

            {/* Shipping highlights */}
            <div className="grid gap-3 sm:grid-cols-3">
              {shippingHighlights.map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <div
                    key={highlight.title}
                    className="rounded-2xl border border-[var(--color-text)]/8 bg-white p-4 transition-all hover:shadow-md hover:-translate-y-1"
                  >
                    <Icon className="h-5 w-5 text-[var(--color-primary)]" />
                    <h3 className="mt-3 text-sm font-bold text-[var(--color-text)]">{highlight.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-[var(--color-text)] opacity-60">
                      {highlight.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Add to Cart */}
            <div className="space-y-4 border-t border-[var(--color-text)]/10 pt-5">
              {quantity <= 0 ? (
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-4 font-bold text-white transition-all hover:bg-[var(--color-text)] hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => addToCart(product as any)}
                  disabled={(product.qtyInStore ?? 0) <= 0}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {(product.qtyInStore ?? 0) > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
                </button>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex h-14 items-center justify-between rounded-xl bg-[var(--color-bg-secondary)] px-2 sm:w-48">
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-lg text-[var(--color-text)] transition-colors hover:bg-white"
                      onClick={() => decrement(product as any)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-base font-bold text-[var(--color-text)]">{quantity}</span>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-lg text-[var(--color-text)] transition-colors hover:bg-white"
                      onClick={() => increment(product as any)}
                      disabled={quantity >= (product.qtyInStore ?? 0)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-1 items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-4 font-bold text-white">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Added to cart
                  </div>
                </div>
              )}
            </div>

            {/* Tabs: Description / Details / Shipping */}
            <div className="space-y-5 border-t border-[var(--color-text)]/10 pt-5">
              <div className="flex flex-wrap gap-3">
                {tabLabels.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`rounded-xl px-5 py-3 text-sm font-bold transition-all ${
                      activeTab === tab.id
                        ? 'bg-[var(--color-primary)] text-white shadow-md'
                        : 'bg-[var(--color-bg-secondary)] text-[var(--color-text)] opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="border-t border-[var(--color-text)]/8 pt-5 text-sm leading-7 text-[var(--color-text)] opacity-65">
                {activeTab === 'description' && (
                  <div className="space-y-4">
                    <p>{product.description || 'A carefully prepared product, perfect for any occasion.'}</p>
                    {product.category && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-primary)]/30 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] transition-all hover:bg-[var(--color-primary)] hover:text-white"
                        onClick={() =>
                          router.push(getCategoryHref(product.category || '', storeCode))
                        }
                      >
                        Explore {product.category}
                      </button>
                    )}
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {product.category && (
                      <p><span className="font-bold text-[var(--color-text)]">Category:</span> {product.category}</p>
                    )}
                    {product.brand && (
                      <p><span className="font-bold text-[var(--color-text)]">Brand:</span> {product.brand}</p>
                    )}
                    {product.itemSize && (
                      <p><span className="font-bold text-[var(--color-text)]">Size:</span> {product.itemSize}</p>
                    )}
                    {product.color && (
                      <p><span className="font-bold text-[var(--color-text)]">Color:</span> {product.color}</p>
                    )}
                    {product.unit && (
                      <p><span className="font-bold text-[var(--color-text)]">Unit:</span> {product.unit}</p>
                    )}
                    {product.code && (
                      <p><span className="font-bold text-[var(--color-text)]">Product code:</span> {product.code}</p>
                    )}
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-4">
                    <p>
                      Orders are prepared quickly and fulfilled through the active store. Delivery
                      timing may vary based on your location and order volume.
                    </p>
                    <p>
                      If the product isn&apos;t the right fit, return support is available within 30
                      days for eligible orders, subject to the store&apos;s policy.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 md:mt-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">
                  You may also like
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                  Related picks
                </h2>
              </div>

              {product.category && (
                <button
                  type="button"
                  className="hidden md:inline-flex text-sm font-semibold text-[var(--color-text)] opacity-55 transition-all hover:opacity-100 hover:text-[var(--color-primary)]"
                  onClick={() => router.push(getCategoryHref(product.category || '', storeCode))}
                >
                  View category
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={getProductHref(relatedProduct, storeCode)}
                  className="group rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-secondary)]">
                    <Image
                      src={relatedProduct.picture || '/placeholder-image.png'}
                      alt={relatedProduct.name || 'Product'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {relatedProduct.featured && (
                      <span className="absolute top-3 left-3 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[var(--color-text)] text-sm uppercase tracking-wide line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="mt-2 text-[var(--color-primary)] font-bold">
                      {formatPrice(
                        relatedProduct.salePrice ?? relatedProduct.oldPrice ?? 0,
                        (relatedProduct.ccy as CurrencyCode) || 'NGN'
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
