import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductProps } from '@/types';
import { getProductHref } from '@/utils/product-route';
import { Star } from 'lucide-react';

interface FeaturedCollectionProps {
  // Completely standalone, no props needed from endpoints
}

const MOCK_PRODUCTS: ProductProps[] = [
  {
    id: 1,
    name: "Sony XBR-950G BRAVIA 4K HDR Ultra HD TV",
    brand: "SONY",
    salePrice: 1398.00,
    oldPrice: 2198.00,
    qtyInStore: 76,
    picture: "/images/mock/sony_tv.png"
  },
  {
    id: 2,
    name: "JBL Flip 4 Waterproof Portable Bluetooth Speaker",
    brand: "JBL",
    salePrice: 74.95,
    oldPrice: 99.95,
    qtyInStore: 672,
    picture: "/images/mock/jbl_speaker.png"
  },
  {
    id: 3,
    name: "Sony PS-HX500 Hi-Res USB Turntable",
    brand: "SONY",
    salePrice: 398.00,
    oldPrice: 498.00,
    qtyInStore: 15,
    picture: "/images/mock/sony_turntable.png"
  },
  {
    id: 4,
    name: "Denon AH-C720 In-Ear Headphones",
    brand: "DENON",
    salePrice: 119.00,
    oldPrice: 149.00,
    qtyInStore: 236,
    picture: "/images/mock/denon_headphones.png"
  },
  {
    id: 5,
    name: "Klipsch R-120SW Powerful Detailed Home Speaker - Unit",
    brand: "KLIPSCH",
    salePrice: 324.00,
    oldPrice: 449.00,
    qtyInStore: 0,
    picture: "/images/mock/klipsch_subwoofer.png"
  }
];

export default function FeaturedCollection() {
  const displayProducts = MOCK_PRODUCTS;

  return (
    <div className="w-full bg-[#f9f9f9] py-16 font-sans">
      <div className="max-w-[100rem] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-[26px] font-medium text-[#253273]">Featured collection</h2>
          <Link href="/shop" className="text-[#0abedb] font-medium hover:underline">
            View all sales
          </Link>
        </div>

        {/* Grid Container */}
        <div className="bg-white border border-gray-200 flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-5 scrollbar-hide">
          {displayProducts.map((product, index) => (
            <FeaturedCard 
              key={product.id || index} 
              product={product} 
              index={index}
              isLast={index === displayProducts.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedCard({ product, index, isLast }: { product: ProductProps, index: number, isLast: boolean }) {
  // Use a static '#' link since it's disconnected from endpoints
  const href = '#';
  
  const saveAmount = product.oldPrice && product.salePrice 
    ? product.oldPrice - product.salePrice 
    : 0;

  const renderStars = () => {
    let fullStars = 5;
    let text = "3 reviews";

    if (index === 0) { fullStars = 4; text = "3 reviews"; }
    else if (index === 1) { fullStars = 5; text = "2 reviews"; }
    else if (index === 2) { fullStars = 4; text = "3 reviews"; }
    else if (index === 3) { fullStars = 5; text = "1 review"; }
    else if (index === 4) { fullStars = 0; text = "No reviews"; }

    return (
      <div className="flex items-center gap-2 mt-3 mb-3">
        <div className="flex text-[#ffc107]">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} size={14} fill="currentColor" strokeWidth={0} />
          ))}
          {[...Array(5 - fullStars)].map((_, i) => (
            <Star key={`empty-${i}`} size={14} fill="#e5e7eb" strokeWidth={0} />
          ))}
        </div>
        <span className="text-[13px] text-gray-500">{text}</span>
      </div>
    );
  };

  const renderStock = () => {
    let isSoldOut = false;
    let stockText = "In stock, 15 units";

    if (index === 0) stockText = "In stock, 76 units";
    if (index === 1) stockText = "In stock, 672 units";
    if (index === 2) stockText = "In stock, 15 units";
    if (index === 3) stockText = "In stock, 236 units";
    if (index === 4) {
      isSoldOut = true;
      stockText = "Sold out";
    }
    // Also respect real data if provided
    if (product.qtyInStore === 0) {
      isSoldOut = true;
      stockText = "Sold out";
    }

    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isSoldOut ? 'bg-gray-400' : 'bg-[#18a93e]'}`} />
        <span className={`text-[13px] font-medium ${isSoldOut ? 'text-gray-500' : 'text-[#18a93e]'}`}>
          {stockText}
        </span>
      </div>
    );
  };

  const renderSwatches = () => {
    if (index === 1) {
      return (
        <div className="flex items-center gap-2 mb-3 mt-2">
          <div className="w-[14px] h-[14px] bg-black ring-1 ring-[#0abedb] ring-offset-1" />
          <div className="w-[14px] h-[14px] bg-[#000080]" />
          <div className="w-[14px] h-[14px] bg-[#808080]" />
          <div className="w-[14px] h-[14px] bg-[#B22222]" />
          <div className="w-[14px] h-[14px] bg-[#20B2AA]" />
          <div className="text-[10px] text-gray-500 border border-gray-300 rounded-full px-1.5 py-0.5 ml-1 leading-none flex items-center justify-center">
            +2
          </div>
        </div>
      );
    }
    if (index === 3) {
      return (
        <div className="flex items-center gap-2 mb-3 mt-2">
          <div className="w-[14px] h-[14px] bg-[#d1d5db] ring-1 ring-[#0abedb] ring-offset-1" />
          <div className="w-[14px] h-[14px] bg-black" />
        </div>
      );
    }
    return null;
  };

  return (
    <Link 
      href={href}
      className={`block relative group p-6 flex-shrink-0 min-w-[85vw] sm:min-w-[300px] md:min-w-0 snap-start hover:shadow-lg transition-shadow bg-white ${!isLast ? 'border-r border-gray-200' : ''}`}
    >
      {/* Badges */}
      <div className="absolute top-0 left-0 z-10 flex flex-col items-start">
        {/* Mocking "Our Selection" for the last item as seen in screenshot */}
        {isLast && (
          <div className="bg-[#007bff] text-white text-[12px] font-bold px-3 py-1 mb-[1px]">
            Our Selection
          </div>
        )}
        {saveAmount > 0 && (
          <div className="bg-[#ff0000] text-white text-[12px] font-bold px-3 py-1">
            Save ${saveAmount.toFixed(2)}
          </div>
        )}
      </div>

      {/* Image */}
      <div className="w-full h-[220px] relative mb-6 mt-4">
        <Image
          src={product.picture || '/images/mock/placeholder-image.png'}
          alt={product.name || 'Product'}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <span className="text-[11px] text-[#888] font-semibold tracking-wider uppercase mb-1">
          {product.brand || 'SONY'}
        </span>
        <h3 className="text-[15px] font-semibold text-[#253273] leading-tight mb-4 line-clamp-2">
          {product.name}
        </h3>
        
        {renderSwatches()}
        
        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            {product.oldPrice && (
              <span className="text-[17px] text-[#ff0000]">
                {index === 0 ? 'From ' : ''}${product.salePrice?.toFixed(2) || '0.00'}
              </span>
            )}
            {!product.oldPrice && (
              <span className="text-[17px] text-[#ff0000]">
                ${product.salePrice?.toFixed(2) || '0.00'}
              </span>
            )}
            {product.oldPrice && (
              <span className="text-[14px] text-gray-400 line-through">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Reviews */}
          {renderStars()}

          {/* Stock */}
          {renderStock()}
        </div>
      </div>
    </Link>
  );
}
