'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  Minus,
  ShoppingCart,
  Star
} from 'lucide-react';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { useProductBySlug } from '@/hooks/useProductBySlug';
import { useProductById } from '@/hooks/useProductById';
import { useCart } from '@/store/cart';
import { getProductGallery, getProductHref } from '@/utils/product-route';
import { ProductImageLightbox } from '@themes/depot/components/utils/product-image-lightbox';

type DetailTab = 'description' | 'details';

export default function VarisaThemeProductPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = decodeURIComponent((params.productSlug as string) || '');
  const storeCode = searchParams?.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE || '';
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || 'FTD';
  const { product: oldProduct, products, isLoading: isLoadingOld } = useProductBySlug(productSlug, storeCode, entityCode);

  const productId = oldProduct?.id?.toString() || '';
  const { productData, isLoading: isLoadingLive, error } = useProductById(productId, entityCode);

  const product = productData || oldProduct || null;
  const isLoading = isLoadingOld || isLoadingLive;
  const { addToCart, decrement, increment, singleQuantity } = useCart();
  const [activeTab, setActiveTab] = useState<DetailTab>('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  
  const itemVariants = Array.isArray(product?.itemVariants) ? product.itemVariants : [];
  const hasVariants = itemVariants.length > 0;
  const basePrice = product?.salePrice ?? product?.oldPrice ?? 0;

  const variants = itemVariants.map((v: any, index: number) => ({
    id: v.qty ? v.qty.toString() : index.toString(),
    qty: v.qty,
    size: v.qty ? `${v.qty} ${product?.unit || ''}`.trim() : (v.size || `${index + 1}`),
    price: v.price > 0 ? v.price : basePrice,
    weight: parseFloat(v.size) || product?.weight || 1,
    original: v
  }));

  const currentVariant = variants.find((v: any) => v.id === selectedVariantId);
  const price = currentVariant ? currentVariant.price : basePrice;

  const currentProductId = hasVariants && currentVariant ? `${product?.id}-${currentVariant.id}` : product?.id;
  const quantity = singleQuantity(currentProductId);

  const prevVariantRef = useRef(selectedVariantId);
  const prevQuantityRef = useRef(quantity);

  useEffect(() => {
    if (prevVariantRef.current === selectedVariantId) {
      if (prevQuantityRef.current > 0 && quantity <= 0) {
        setSelectedVariantId('');
      }
    }
    prevVariantRef.current = selectedVariantId;
    prevQuantityRef.current = quantity;
  }, [quantity, selectedVariantId]);

  const gallery = useMemo(() => getProductGallery(product), [product]);
  
  const discount =
    product?.salePrice && product.oldPrice && product.oldPrice > product.salePrice
      ? Math.ceil(((product.oldPrice - product.salePrice) / product.oldPrice) * 100)
      : 0;
  
  const activeImage = gallery[activeImageIndex] || product?.picture || '/placeholder-image.png';

  const productToCart = useMemo(() => {
    if (!product) return null;
    return {
      ...product,
      id: currentProductId,
      salePrice: price,
      size: currentVariant?.size || product.itemSize || product.unit,
      originalId: product.id,
      variantId: currentVariant?.id
    };
  }, [product, currentProductId, price, currentVariant]);
  const ccy = product?.ccy || '$';

  useEffect(() => {
    setActiveImageIndex(0);
    setActiveTab('description');
    setIsLightboxOpen(false);
  }, [product?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex flex-col items-center justify-center px-4 py-24 text-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-60" />
        <p className="text-xs font-black uppercase tracking-[0.35em] text-accent mb-4">
          Product not found
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-6">
          We couldn't find that product.
        </h1>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-extrabold uppercase tracking-widest text-accent-foreground hover:bg-accent/90 transition-all hover:-translate-y-1 shadow-lg shadow-accent/20"
          onClick={() => router.push('/shop')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#FCFBF8] relative overflow-hidden pb-24">
        {/* Aesthetic Background Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] opacity-60 pointer-events-none" />

        <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8 md:py-12 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-accent"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </button>
            <span className="text-xs font-bold text-gray-300">/</span>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-accent"
              onClick={() => router.push('/shop')}
            >
              Shop
            </button>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            
            {/* Left: Image Gallery */}
            <div className="flex flex-col gap-4">
              <div 
                className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-white shadow-xl shadow-black/5 cursor-zoom-in group"
                onClick={() => setIsLightboxOpen(true)}
              >
                <Image
                  src={activeImage}
                  alt={product.name || 'Product Image'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-xl">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 pointer-events-none">
                  {discount > 0 && (
                    <span className="bg-[#E74C3C] text-white text-[12px] font-extrabold px-3 py-1.5 rounded-lg shadow-lg">
                      -{discount}% OFF
                    </span>
                  )}
                  {product.qtyInStore === 0 && (
                    <span className="bg-gray-800 text-white text-[12px] font-extrabold px-3 py-1.5 rounded-lg shadow-lg">
                      OUT OF STOCK
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-300 ${
                        activeImageIndex === idx 
                          ? 'ring-4 ring-accent ring-offset-2 scale-95 opacity-100' 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/[0.03] border border-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

                <div className="mb-4 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-widest text-accent">
                  <span>SKU: {product.code || 'N/A'}</span>
                  {product.storeName && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-accent/30" />
                      <span>{product.storeName}</span>
                    </>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                  {product.name}
                </h1>

                {/* Reviews placeholder */}
                <div className="flex items-center gap-1.5 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="text-[#F39C12] fill-[#F39C12]"
                    />
                  ))}
                  <span className="text-gray-500 font-semibold text-sm ml-2">(12 Reviews)</span>
                </div>

                <div className="flex items-baseline gap-4 mb-8">
                  <span className={`text-4xl font-black ${discount > 0 ? 'text-[#E74C3C]' : 'text-gray-900'}`}>
                    {formatPrice(price, ccy as any)}
                  </span>
                  {discount > 0 && (
                    <span className="text-xl font-bold text-gray-400 line-through">
                      {formatPrice(product.oldPrice || 0, ccy as any)}
                    </span>
                  )}
                </div>

                {hasVariants && (
                  <div className="mb-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        Available Options
                      </h3>
                      <span className="text-xs font-semibold text-gray-500">
                        {variants.length} variant{variants.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {variants.map((v: any) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`relative overflow-hidden rounded-xl border-2 px-5 py-3 text-sm font-bold transition-all ${
                            selectedVariantId === v.id
                              ? 'border-accent bg-accent/5 text-accent shadow-sm'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {selectedVariantId === v.id && (
                            <div className="absolute right-0 top-0 h-4 w-4 -translate-y-1/2 translate-x-1/2 rotate-45 bg-accent" />
                          )}
                          <div className="flex items-center gap-3">
                            <span>{v.size}</span>
                            {v.price !== basePrice && (
                              <span className={`text-xs ${selectedVariantId === v.id ? 'text-accent/80' : 'text-gray-400'}`}>
                                {formatPrice(v.price, ccy as any)}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart Area */}
                <div className="bg-gray-50/80 rounded-3xl p-6 md:p-8 mb-10 border border-gray-100">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {quantity > 0 ? (
                      <div className="flex items-center justify-between w-full sm:w-auto bg-white rounded-full p-2 shadow-sm border border-gray-200">
                        <button
                          onClick={() => decrement(productToCart as any)}
                          className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="w-16 text-center font-black text-xl text-gray-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => increment(productToCart as any)}
                          className="w-12 h-12 flex items-center justify-center rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors shadow-md shadow-accent/20"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    ) : null}

                    <button
                      onClick={() => addToCart(productToCart as any)}
                      disabled={product.qtyInStore === 0 || (hasVariants && !selectedVariantId)}
                      className={`flex-grow w-full py-5 px-8 rounded-full font-black text-[15px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 ${
                        product.qtyInStore === 0 || (hasVariants && !selectedVariantId)
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : quantity > 0
                          ? 'bg-gray-900 text-white hover:bg-black hover:shadow-xl hover:-translate-y-1'
                          : 'bg-accent text-accent-foreground shadow-lg shadow-accent/30 hover:shadow-accent/40 hover:bg-accent/90 hover:-translate-y-1'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {product.qtyInStore === 0 
                        ? 'Out of Stock' 
                        : (hasVariants && !selectedVariantId)
                        ? 'Select an Option'
                        : quantity > 0 
                        ? 'Add More' 
                        : 'Add to Cart'}
                    </button>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center gap-6 text-[12px] font-semibold text-gray-500">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> In Stock</span>
                    <span>•</span>
                    <span>Taxes included</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-gray-100/50 p-1.5 rounded-full w-max">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`px-6 py-2.5 rounded-full font-extrabold text-[13px] tracking-wide transition-all duration-300 ${
                      activeTab === 'description'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-6 py-2.5 rounded-full font-extrabold text-[13px] tracking-wide transition-all duration-300 ${
                      activeTab === 'details'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Featured
                  </button>
                </div>

                <div className="prose prose-sm md:prose-base max-w-none text-gray-600 font-medium leading-relaxed">
                  {activeTab === 'description' ? (
                    <div dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }} />
                  ) : (
                    <div className="space-y-3">
                      {product.category && <p><span className="font-bold text-gray-900">Category:</span> {product.category}</p>}
                      {product.brand && <p><span className="font-bold text-gray-900">Brand:</span> {product.brand}</p>}
                      {product.itemSize && <p><span className="font-bold text-gray-900">Size:</span> {product.itemSize}</p>}
                      {product.color && <p><span className="font-bold text-gray-900">Color:</span> {product.color}</p>}
                      {product.unit && <p><span className="font-bold text-gray-900">Unit:</span> {product.unit}</p>}
                      {!product.category && !product.brand && !product.itemSize && 'No featured information available.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductImageLightbox
        open={isLightboxOpen}
        onOpenChange={setIsLightboxOpen}
        images={gallery}
        currentIndex={activeImageIndex}
        onIndexChange={setActiveImageIndex}
        productName={product.name || 'Product'}
      />
    </>
  );
}
