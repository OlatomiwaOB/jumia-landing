'use client'
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./product-card";
import { useSearchParams } from "next/navigation";
import { ProductProps } from "@/types";

const ProductGrid = () => {
    const searchParams = useSearchParams()
    const storeCode = searchParams.get('storeCode') || ''
    const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || '';
    const {data, isLoading,error} = useProducts(storeCode,entityCode,'','','',1,8)


  if (isLoading) {
    return <div className="grid grid-cols-1 gap-y-2 lg:grid-cols-4 gap-x-2">
        {[1, 2, 3, 4].map((item) => (
            <div key={item} className="animate-pulse h-[356px] bg-gray-200 rounded-md mb-2"></div>
        ))}
    </div >;
}

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">FEATURED PRODUCTS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {data?.products?.map((product:ProductProps) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center">
          <button className="px-8 py-3 bg-accent text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
            VIEW ALL
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
