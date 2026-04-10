'use client'

import { useQuery } from "@tanstack/react-query"
import { Product } from "./product"
import { ProductProps } from "@/types"
import { useSearchParams } from "next/navigation"
import { Dialog, DialogContent } from "../ui/dialog"
import { Suspense, useState } from "react"
import ProductDetail from "../ui/product-modal"
import { Button } from "../ui/button"
import axiosInstanceNoAuth from "@/utils/fetch-function-auth"

const ProductsGrid = () => {
    // This component displays a grid of produc
    const searchParams = useSearchParams();
    const category = searchParams.get('category') || ''
    const name = searchParams.get('name') || ''
    const storeCode = searchParams.get('storeCode') || ''
    const [modalProduct, setModalProduct] = useState<ProductProps | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [retryProducts,setRetryProducts] = useState(false)
    const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || '';
    const retryFn = () =>{
        setRetryProducts(!retryProducts)
      }
    
   const { data,isLoading, error } = useQuery({
  queryKey: ["products",category,name,retryProducts],
  queryFn: () => {
    return axiosInstanceNoAuth.request({
      method: "GET",
      url: '/ecommerce/products/list',
      params: {
        name,
        storeCode,
        entityCode: entityCode,
        category,
        tag: '',
        pageNumber: 1,
        pageSize: 1000
      }
    })
    .then(response => response.data)
  }
});

    if (isLoading) return <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {
          [1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="animate-pulse h-[356px] bg-gray-200 rounded-md mb-2"></div>
          ))
        }
    </div>
    

  
    if (error) return (
    <div className='hidden lg:flex flex-col items-center justify-center l lg:sticky lg:max-h-screen'>
      <div className="p-4">Error loading products</div>
      <Button className='bg-accent text-white' onClick={retryFn}>Retry</Button>
    </div>
  )

    console.log(isOpen);
    

  return (
    <div className='p-4'>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-3">
          {data?.products?.map((product:ProductProps) => (
            <Product key={product.id} product={product} onClick={() => {
              setModalProduct(product);
              setIsOpen(true);
            }} />
          ))}
        </div>

        {
          isOpen && <Suspense><ProductDetail product={modalProduct} setIsOpen={setIsOpen} /></Suspense>
        }
    </div>
  )
}

export default ProductsGrid