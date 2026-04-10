// 'use client';

// import { ProductProps } from '@/types';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { ExternalLink, Loader2 } from 'lucide-react';

// interface SearchResultsProps {
//   products: ProductProps[];
//   categories: any[];
//   productsLocation: string
//   searchQuery: string;
//   onProductClick: (product: ProductProps) => void;
//   onCategoryClick: (categoryCode: string) => void;
//   onClose: () => void;
//   isLoading?: boolean;
// }

// export function SearchResults({
//   products,
//   categories,
//   productsLocation,
//   searchQuery,
//   onProductClick,
//   onCategoryClick,
//   onClose,
//   isLoading = false
// }: SearchResultsProps) {
//   const router = useRouter();

//   const groupProductsByCity = (products: ProductProps[]) => {
//     const grouped: { [city: string]: ProductProps[] } = {};

//     products.forEach(product => {
//       const city = product.storeLocationCity || 'Other Locations';
//       if (!grouped[city]) {
//         grouped[city] = [];
//       }
//       grouped[city].push(product);
//     });

//     return grouped;
//   };

//   const sortCities = (cities: string[]) => {
//     return cities.sort((a, b) => {
//       if (a === 'Other Locations') return 1;
//       if (b === 'Other Locations') return -1;
//       return a.localeCompare(b);
//     });
//   };

//   if (!searchQuery.trim()) return null;

//   if (isLoading) {
//     return (
//       <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
//         <div className="p-8 flex items-center justify-center gap-3">
//           <p className="text-sm text-gray-500">Searching...</p>
//           <Loader2 className="h-4 w-4 text-[#d8480b] animate-spin" />
//         </div>
//       </div>
//     );
//   }

//   if (products.length === 0 && categories.length === 0) {
//     return (
//       <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
//         <div className="p-6 text-center flex gap-2">
//           <p className="text-sm text-gray-500">
//             No products or categories found for
//           </p>
//           <p className="text-sm font-medium text-gray-900">
//             "{searchQuery}"
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const groupedProducts = groupProductsByCity(products);
//   const cities = sortCities(Object.keys(groupedProducts));

//   return (
//     <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
//       {categories.length > 0 && (
//         <div className="p-4 border-b border-gray-100">
//           <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories ({categories.length})</h3>
//           <div className="space-y-2">
//             {categories.map((category) => (
//               <button
//                 key={category.id}
//                 onClick={() => {
//                   onCategoryClick(category.code);
//                   onClose();
//                 }}
//                 className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer"
//               >
//                 {category.logo && (
//                   <div className="w-8 h-8 relative flex-shrink-0">
//                     <Image
//                       src={category.logo}
//                       alt={category.name}
//                       fill
//                       className="object-cover rounded"
//                     />
//                   </div>
//                 )}
//                 <div className="flex-1 min-w-0">
//                   <div className='flex items-center gap-3'>
//                     <p className="text-sm font-medium text-gray-900 truncate">
//                       {category.name}
//                     </p>
//                     <ExternalLink className='text-accent h-3 w-3' />
//                   </div>
//                   {category.description && (
//                     <p className="text-xs text-gray-500 truncate">
//                       {category.description}
//                     </p>
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {products.length > 0 && (
//         <div className="p-4">
//           <h3 className="text-sm font-semibold text-gray-900 mb-3">
//             Products ({products.length})
//           </h3>
//           <div className="space-y-3">
//             {products.map((product) => (
//               <button
//                 key={product.id}
//                 onClick={() => {
//                   onProductClick(product);
//                   onClose();
//                 }}
//                 className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors text-left group cursor-pointer"
//               >
//                 <div className="w-12 h-12 relative flex-shrink-0">
//                   <Image
//                     src={product.picture || '/placeholder-image.png'}
//                     alt={product.name || "Product Image"}
//                     fill
//                     className="object-cover rounded-md"
//                     onError={(e) => {
//                       e.currentTarget.src = '/placeholder-image.png';
//                     }}
//                   />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#d8480b]">
//                     {product.name}
//                   </p>
//                   <p className="text-xs text-gray-500 truncate">
//                     {product.description}
//                   </p>
//                   <div className="flex items-center justify-between mt-1">
//                     <span className="text-sm font-semibold text-[#d8480b]">
//                       ₦{product.salePrice ?? product.oldPrice}
//                     </span>
//                     <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
//                       {product.category}
//                     </span>
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {products.length > 0 && (
//         <div className="p-4">
//           <h3 className="text-sm font-semibold text-gray-900 mb-3">
//             Products ({products.length})
//           </h3>

//           {/* Group products by city */}
//           {cities.map((city) => (
//             <div key={city} className="mb-6 last:mb-0">
//               {/* City header */}
//               <div className="sticky top-0 bg-white py-2 z-10 border-b border-gray-200 mb-3">
//                 <h4 className="text-sm font-semibold text-[#d8480b] flex items-center gap-2">
//                   <span className="bg-[#d8480b] w-2 h-2 rounded-full"></span>
//                   {city}
//                   <span className="text-xs text-gray-500 font-normal">
//                     ({groupedProducts[city].length} {groupedProducts[city].length === 1 ? 'product' : 'products'})
//                   </span>
//                 </h4>
//               </div>

//               <div className="space-y-3">
//                 {groupedProducts[city].map((product) => (
//                   <button
//                     key={product.id}
//                     onClick={() => {
//                       onProductClick(product);
//                       onClose();
//                     }}
//                     className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors text-left group cursor-pointer"
//                   >
//                     <div className="w-12 h-12 relative flex-shrink-0">
//                       <Image
//                         src={product.picture || '/placeholder-image.png'}
//                         alt={product.name || "Product Image"}
//                         fill
//                         className="object-cover rounded-md"
//                         onError={(e) => {
//                           e.currentTarget.src = '/placeholder-image.png';
//                         }}
//                       />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#d8480b]">
//                         {product.name}
//                       </p>
//                       <p className="text-xs text-gray-500 truncate">
//                         {product.description}
//                       </p>
//                       <div className="flex items-center justify-between mt-1">
//                         <span className="text-sm font-semibold text-[#d8480b]">
//                           ₦{product.salePrice ?? product.oldPrice}
//                         </span>
//                         <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
//                           {product.category}
//                         </span>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {(products.length > 0 || categories.length > 0) && (
//         <div className="p-3 border-t border-gray-100 bg-gray-50">
//           <Link
//             href={`/shop?search=${encodeURIComponent(searchQuery)}`}
//             className="block text-center text-sm font-medium text-[#d8480b] hover:text-[#c23d09]"
//             onClick={onClose}
//           >
//             View all results for "{searchQuery}"
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { ProductProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, Loader2, MapPin, Tag, FileText } from 'lucide-react';

interface SearchResultsProps {
  products: ProductProps[];
  categories: any[];
  searchQuery: string;
  onProductClick: (product: ProductProps) => void;
  onCategoryClick: (categoryCode: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function SearchResults({
  products,
  categories,
  searchQuery,
  onProductClick,
  onCategoryClick,
  onClose,
  isLoading = false
}: SearchResultsProps) {
  const router = useRouter();

  const highlightMatch = (text: string, query: string) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-black px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const groupProductsByCity = (products: ProductProps[]) => {
    const grouped: { [city: string]: ProductProps[] } = {};

    products.forEach(product => {
      const city = product.storeLocationCity?.toLowerCase() || 'Other Locations';
      if (!grouped[city]) {
        grouped[city] = [];
      }
      grouped[city].push(product);
    });

    return grouped;
  };

  const sortCities = (cities: string[]) => {
    return cities.sort((a, b) => {
      if (a === 'Other Locations') return 1;
      if (b === 'Other Locations') return -1;
      return a.localeCompare(b);
    });
  };

  if (!searchQuery.trim()) return null;

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
        <div className="p-8 flex items-center justify-center gap-3">
          <p className="text-sm text-gray-500">Searching...</p>
          <Loader2 className="h-4 w-4 text-[#d8480b] animate-spin" />
        </div>
      </div>
    );
  }

  if (products.length === 0 && categories.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
        <div className="p-6 text-center">
          <p className="text-sm text-gray-500">
            No products or categories found for
          </p>
          <p className="text-sm font-medium text-gray-900 mt-1">
            "{searchQuery}"
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Try searching by product name, location, or description
          </p>
        </div>
      </div>
    );
  }

  const groupedProducts = groupProductsByCity(products);
  const cities = sortCities(Object.keys(groupedProducts));

  return (
    <div
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-30 max-h-96 overflow-y-auto"
      style={{
        scrollbarWidth: 'none',
        scrollbarColor: 'transparent',
      }}
    >
      {categories.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Categories ({categories.length})
          </h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryClick(category.code);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer"
              >
                {category.logo && (
                  <div className="w-8 h-8 relative flex-shrink-0">
                    <Image
                      src={category.logo}
                      alt={category.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className='flex items-center gap-3'>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {highlightMatch(category.name, searchQuery)}
                    </p>
                    <ExternalLink className='text-accent h-3 w-3' />
                  </div>
                  {category.description && (
                    <p className="text-xs text-gray-500 truncate">
                      {highlightMatch(category.description, searchQuery)}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Products ({products.length})
          </h3>

          {cities.map((city) => (
            <div key={city} className="mb-6 last:mb-0">
              <div className="sticky top-0 bg-white py-2 z-10 border-b border-gray-200 mb-3">
                <h4 className="text-sm font-semibold text-[#d8480b] flex items-center gap-2">
                  <span className="bg-[#d8480b] w-2 h-2 rounded-full"></span>
                  {highlightMatch(city.toLowerCase(), searchQuery)}
                  <span className="text-xs text-gray-500 font-normal">
                    ({groupedProducts[city].length} {groupedProducts[city].length === 1 ? 'product' : 'products'})
                  </span>
                </h4>
              </div>

              <div className="space-y-3">
                {groupedProducts[city].map((product) => {
                  return (
                    <button
                      key={product.id}
                      onClick={() => {
                        onProductClick(product);
                        onClose();
                      }}
                      className={`w-full flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors text-left group cursor-pointer`}
                    >
                      <div className="w-12 h-12 relative flex-shrink-0">
                        <Image
                          src={product.picture || '/placeholder-image.png'}
                          alt={product.name || "Product Image"}
                          fill
                          className="object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.png';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#d8480b]">
                            {highlightMatch(product.name || '', searchQuery)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {highlightMatch(product.description || '', searchQuery)}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-semibold text-[#d8480b]">
                            ₦{product.salePrice ?? product.oldPrice}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {(products.length > 0 || categories.length > 0) && (
        <div className="absolute w-full sticky bottom-0 p-3 border-t border-gray-100 bg-gray-50">
          <Link
            href={`/shop?search=${encodeURIComponent(searchQuery)}`}
            className="block text-center text-sm font-medium text-[#d8480b] hover:text-[#c23d09]"
            onClick={onClose}
          >
            View all {products.length} results for "{searchQuery}"
          </Link>
        </div>
      )}
    </div>
  );
}