// page.tsx
'use client'
import CategoriesDesktop from "@/components/gadgets/categories-desktop";
import bannerImg from '@/assets/Gadget-banners.webp'
import Image from "next/image";
import FilterHeader from "@/components/gadgets/filter-header";
import ProductsGrid from "@/components/gadgets/products-grid";
import CartTriggerDesktop from "@/components/ui/cart-trigger-desktop";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const storeCode = searchParams ? searchParams.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE : process.env.NEXT_PUBLIC_STORE_CODE;
  useEffect(()=>{
    router?.push(`?storeCode=${storeCode}`)
  },[router])
  return (
    <main className="w-full flex-1 flex">
      {/* Categories desktop - Fixed sidebar */}
        <Suspense>
          <CategoriesDesktop />
        </Suspense>
        <CartTriggerDesktop/>
      {/* Main content area - Scrollable */}
      <div className="flex-1 w-full relative lg:py-4">
        <div className="w-full">
          {/* banner */}
          <div className="relative w-full  lg:p-4">
            <Image
              src={bannerImg}
              alt="Banner"
              className="object-cover w-full"
            />
          </div>

          {/* filter header */}
          <Suspense>
            <FilterHeader/>
          </Suspense>
           {/* <ProductGrid/> */}
           <Suspense>
            <ProductsGrid/>
           </Suspense>
        </div>
      </div>
    </main>
  );
}