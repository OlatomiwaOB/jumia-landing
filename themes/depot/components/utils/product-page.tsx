'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Bolt,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  PackageCheck,
  Plus,
  RotateCcw,
  ShieldCheck,
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
import { ProductImageLightbox } from './product-image-lightbox';
import { RecentPurchaseToast } from './recent-purchase-toast';
import { ProductCard } from './products-card';

type DetailTab = 'description' | 'details';

const imageZoomCursor =
  'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2732%27 height=%2732%27 viewBox=%270 0 32 32%27%3E%3Ccircle cx=%2716%27 cy=%2716%27 r=%2714.5%27 fill=%27white%27 stroke=%27black%27 stroke-width=%271.5%27/%3E%3Cpath d=%27M16 10v12M10 16h12%27 stroke=%27black%27 stroke-width=%272%27 stroke-linecap=%27round%27/%3E%3C/svg%3E") 16 16, zoom-in';

export default function DepotThemeProductPage() {
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const quantity = singleQuantity(product?.id);
  const gallery = useMemo(() => getProductGallery(product), [product]);
  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

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
  const viewerCount = product?.id ? 4 + (product.id % 6) : 6;
  const cartsCount = product?.id ? 2 + (product.id % 4) : 3;
  const activeImage = gallery[activeImageIndex] || product?.picture || '/placeholder-image.png';
  const price = product?.salePrice ?? product?.oldPrice ?? 0;

  const tabLabels: Array<{ id: DetailTab; label: string }> = [
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Featured' },
  ];

  useEffect(() => {
    setActiveImageIndex(0);
    setActiveTab('description');
    setIsLightboxOpen(false);
  }, [product?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <div className="aspect-square animate-pulse bg-[#f3f3f3]" />
            <div className="space-y-4">
              <div className="h-5 w-36 animate-pulse rounded-full bg-[#efefef]" />
              <div className="h-10 w-3/4 animate-pulse rounded-full bg-[#efefef]" />
              <div className="h-12 w-44 animate-pulse rounded-full bg-[#efefef]" />
              <div className="h-24 animate-pulse rounded-[2rem] bg-[#f5f5f5]" />
              <div className="grid gap-4 sm:grid-cols-2">
                {[0, 1].map((item) => (
                  <div key={item} className="h-32 animate-pulse rounded-[2rem] bg-[#f5f5f5]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
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
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-accent-foreground transition-opacity hover:opacity-90"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
          <div className="mb-6 flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-black/55 transition-colors hover:text-accent"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </button>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-black/30">/</span>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-black/55 transition-colors hover:text-accent"
              onClick={() => router.push('/shop')}
            >
              Shop
            </button>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <div className="space-y-4">
              <div className="relative overflow-hidden bg-[#f4f4f4] p-4 md:p-8">
                <button
                  type="button"
                  className="group relative block aspect-square w-full"
                  onClick={() => setIsLightboxOpen(true)}
                  style={{ cursor: imageZoomCursor }}
                >
                  <Image
                    src={activeImage}
                    alt={product.name || 'Product image'}
                    fill
                    className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 52vw"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.03]" />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-accent opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100">
                    <Plus className="h-5 w-5" />
                  </div>
                </button>

                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={() =>
                        setActiveImageIndex((current) => (current - 1 + gallery.length) % gallery.length)
                      }
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setActiveImageIndex((current) => (current + 1) % gallery.length)}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {discount > 0 && (
                  <div className="absolute left-5 top-5 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent-foreground">
                    {discount}% off
                  </div>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {gallery.map((image, index) => (
                    <button
                      key={`${product.code || product.name}-${index}`}
                      type="button"
                      className={`relative h-24 w-24 shrink-0 overflow-hidden border transition-colors ${index === activeImageIndex
                        ? 'border-accent'
                        : 'border-black/10 hover:border-black/30'
                        }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-contain bg-[#f4f4f4] p-2"
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-7">
              <div className="space-y-4">
                <div className="space-y-1 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                  {product.code && <p>SKU: {product.code}</p>}
                  {product.brand && <p>Vendor: {product.storeName}</p>}
                </div>

                <h1 className="text-4xl font-semibold tracking-tight text-black md:text-5xl">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-end gap-3">
                  <span className="text-4xl font-semibold text-accent">
                    {formatPrice(price, ((product.ccy as CurrencyCode) || 'NGN'))}
                  </span>
                  {discount > 0 && product.oldPrice && (
                    <span className="text-lg text-black/40 line-through">
                      {formatPrice(product.oldPrice, ((product.ccy as CurrencyCode) || 'NGN'))}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm leading-7 text-black/60">
                  <p>Taxes included.</p>
                  <p>Shipping calculated at checkout.</p>
                </div>
              </div>



              <div className="space-y-4 border-t border-black/8 pt-6">
                {quantity <= 0 ? (
                  <button
                    type="button"
                    className="w-full rounded-full bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-black/35"
                    onClick={() => addToCart(product as any)}
                    disabled={(product.qtyInStore ?? 0) <= 0}
                  >
                    {(product.qtyInStore ?? 0) > 0 ? 'Add to cart' : 'Out of stock'}
                  </button>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex h-14 items-center justify-between rounded-full bg-black/[0.05] px-2 sm:w-52">
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:text-black/25"
                        onClick={() => decrement(product as any)}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-base font-semibold text-black">{quantity}</span>
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:text-black/25"
                        onClick={() => increment(product as any)}
                        disabled={quantity >= (product.qtyInStore ?? 0)}
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-1 items-center justify-center rounded-full border border-accent/20 bg-accent px-6 text-sm font-semibold uppercase tracking-[0.3em] text-accent-foreground">
                      Added to cart
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-5 border-t border-black/8 pt-6">
                <div className="flex flex-wrap gap-3">
                  {tabLabels.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`rounded-full px-5 py-3 text-sm font-semibold transition-colors ${activeTab === tab.id
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-black/[0.05] text-black/70 hover:bg-black/[0.09]'
                        }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="border-t border-black/8 pt-6 text-sm leading-7 text-black/65">
                  {activeTab === 'description' && (
                    <div className="space-y-4">
                      <p>
                        {product.description ||
                          'A refined product designed for everyday use, with clean lines and a durable finish that fits naturally into a modern storefront.'}
                      </p>
                      {product.category && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-black transition-colors hover:border-accent hover:text-accent"
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
                        <p>
                          <span className="font-semibold text-black">Category:</span> {product.category}
                        </p>
                      )}
                      {product.brand && (
                        <p>
                          <span className="font-semibold text-black">Brand:</span> {product.brand}
                        </p>
                      )}
                      {product.itemSize && (
                        <p>
                          <span className="font-semibold text-black">Size:</span> {product.itemSize}
                        </p>
                      )}
                      {product.color && (
                        <p>
                          <span className="font-semibold text-black">Color:</span> {product.color}
                        </p>
                      )}
                      {product.unit && (
                        <p>
                          <span className="font-semibold text-black">Unit:</span> {product.unit}
                        </p>
                      )}
                      {product.code && (
                        <p>
                          <span className="font-semibold text-black">Product code:</span> {product.code}
                        </p>
                      )}
                    </div>
                  )}


                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-20">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                    You may also like
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-black">Related picks</h2>
                </div>

                {product.category && (
                  <button
                    type="button"
                    className="hidden text-xs font-semibold uppercase tracking-[0.3em] text-black/55 transition-colors hover:text-accent md:inline-flex"
                    onClick={() => router.push(getCategoryHref(product.category || '', storeCode))}
                  >
                    View category
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
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

          {/* <section className="mt-20 border-t border-black/8 pt-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-black/[0.04] px-5 py-3 text-sm text-black/65">
              <PackageCheck className="h-4 w-4 text-accent" />
              <span>
                Shopping this theme with{' '}
                <span className="font-semibold text-black">accent-driven minimal styling</span>
              </span>
            </div>
          </section> */}
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

      {/* <RecentPurchaseToast entityCode={entityCode} storeCode={storeCode} /> */}
    </>
  );
}
