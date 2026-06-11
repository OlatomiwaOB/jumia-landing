'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from "@tanstack/react-query";
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { useSearchParams } from "next/navigation";
import { ProductProps } from '@/types';

export default function HeroPromoGrid() {
  const searchParams = useSearchParams();
  const storeCode = searchParams?.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE || '';
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || '';

  const { data: allProductsData } = useQuery({
    queryKey: ["hero-promo-products", storeCode],
    queryFn: () => {
      return axiosInstanceNoAuth.request({
        method: "GET",
        url: '/ecommerce/products/list',
        params: {
          storeCode: storeCode,
          entityCode: entityCode,
          name: '',
          category: '',
          tag: '',
          pageNumber: 1,
          pageSize: 100
        }
      }).then(response => response.data)
    }
  });

  const endpointProducts = allProductsData?.products || [];
  const bannerProducts = endpointProducts.filter((p: ProductProps) => p.banner === true);
  const sourceProducts = bannerProducts.length >= 4 ? bannerProducts : endpointProducts;

  const p1 = sourceProducts[5] || sourceProducts[0] || {};
  const p2 = sourceProducts[1] || {};
  const p3 = sourceProducts[2] || {};
  // Always search ALL products for Bitterleaf by name
  const p4 = endpointProducts.find((p: ProductProps) =>
    p.name?.toLowerCase().includes('bitterleaf')
  ) || sourceProducts[3] || {};

  return (
    <section className="w-full px-4 lg:px-10 pt-0 pb-6 lg:pt-2 lg:pb-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_3.5fr_1fr] gap-3 lg:gap-2">

        {/* CARD 1: Left (1 col) */}
        <div className="bg-[#1C1917] rounded-2xl relative overflow-hidden flex flex-col justify-end min-h-[380px] lg:min-h-[550px] cursor-pointer group">

          {/* Full Cover Image */}
          {p1.picture && (
            <Image
              src={p1.picture}
              alt={p1.name || "Product"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 25vw"
            />
          )}

          {/* Dark gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

          {/* Text & Button */}
          <div className="relative z-20 text-center flex flex-col items-center p-6 lg:p-8">
            <h3 className="text-white text-[22px] lg:text-[28px] font-bold leading-tight mb-3">
              {p1.name && (
                <>
                  <span className="text-[var(--color-primary)]">
                    {p1.name.toLowerCase().startsWith('puff puff') ? p1.name.split(' ').slice(0, 2).join(' ') : p1.name.split(' ')[0]}
                  </span>{' '}
                  {p1.name.toLowerCase().startsWith('puff puff') ? p1.name.split(' ').slice(2).join(' ') : p1.name.split(' ').slice(1).join(' ')}
                </>
              )}
            </h3>
            <Link href="/shop" className="bg-[var(--color-primary)] hover:bg-white hover:text-[#1C1917] text-white font-bold py-2.5 px-8 rounded-lg text-[14px] transition-colors w-max block">
              Shop now
            </Link>
          </div>
        </div>

        {/* CARD 2: Center (2 cols) */}
        <div className="bg-[#F1EADC] rounded-2xl relative overflow-hidden flex flex-col justify-center min-h-[550px] p-6 md:p-10 cursor-pointer group">
          {/* Left Image */}
          <div className="absolute bottom-0 left-0 w-[45%] md:w-[35%] max-w-[250px] aspect-square rounded-tr-[100%] md:rounded-full overflow-hidden shadow-2xl md:border-4 md:border-[#F1EADC] transition-transform duration-700 md:group-hover:-translate-x-24 md:group-hover:translate-y-24">
            {p2.picture && <Image src={p2.picture} alt={p2.name || "Product"} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 50vw" />}
          </div>
          {/* Right Image */}
          <div className="absolute bottom-0 right-0 w-[45%] md:w-[35%] max-w-[250px] aspect-square rounded-tl-[100%] md:rounded-full overflow-hidden shadow-2xl md:border-4 md:border-[#F1EADC] transition-transform duration-700 md:group-hover:translate-x-24 md:group-hover:translate-y-24">
            {p3.picture && <Image src={p3.picture} alt={p3.name || "Product"} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 50vw" />}
          </div>

          <div className="relative z-10 text-center flex flex-col items-center max-w-lg mx-auto">
            <p className="text-[#1C1917] text-[14px] font-medium mb-2 opacity-80">Premium Catering</p>
            <h3 className="text-[#1C1917] text-3xl md:text-[40px] font-extrabold leading-tight mb-4">
              Authentic <span className="text-[var(--color-primary)]">Nigerian</span> Flavors
            </h3>
            <p className="text-[#1C1917] text-[14px] mb-8 px-4 font-medium opacity-80">
              Experience the true taste of home, delivered fresh and hot to your doorstep.
            </p>
            <Link href="/shop" className="bg-[var(--color-primary)] hover:bg-[#1C1917] hover:text-white text-white font-bold py-3 px-10 rounded-lg text-[14px] transition-colors w-max block">
              Shop now
            </Link>
          </div>
        </div>

        {/* CARD 3: Right (1 col) */}
        <div className="bg-[#1C1917] rounded-2xl relative overflow-hidden flex flex-col justify-end min-h-[380px] lg:min-h-[550px] cursor-pointer group">

          {/* Full Cover Image */}
          {p4.picture && (
            <Image
              src={p4.picture}
              alt={p4.name || "Product"}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 25vw"
            />
          )}

          {/* Dark gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

          {/* Text & Button */}
          <div className="relative z-20 text-center flex flex-col items-center p-6 lg:p-8">
            <h3 className="text-white text-[22px] lg:text-[28px] font-bold leading-tight mb-3">
              {p4.name && (
                <>
                  <span className="text-[var(--color-primary)]">
                    {p4.name.toLowerCase().startsWith('puff puff') ? p4.name.split(' ').slice(0, 2).join(' ') : p4.name.split(' ')[0]}
                  </span>{' '}
                  {p4.name.toLowerCase().startsWith('puff puff') ? p4.name.split(' ').slice(2).join(' ') : p4.name.split(' ').slice(1).join(' ')}
                </>
              )}
            </h3>
            <Link href="/shop" className="bg-[var(--color-primary)] hover:bg-white hover:text-[#1C1917] text-white font-bold py-2.5 px-8 rounded-lg text-[14px] transition-colors w-max block">
              Shop now
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
