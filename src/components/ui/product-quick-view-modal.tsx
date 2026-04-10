import { useCart } from "@/store/cart";
import { ProductProps } from "@/types";
import placeholderImage from '@/assets/categories_placeholder.jpg'
import Image from 'next/image';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { Reply, Shield, ThumbsUp } from "lucide-react";

export const QuickViewModal = ({ product }: { product: ProductProps }) => {
  const { addToCart, decrement, increment, inCart, singleQuantity } = useCart();
  console.log(product);
  
  return (
    <div className="p-6 w-full flex flex-col gap-6">
      {/* Main image */}
      <div className='w-full grid grid-cols-1 md:grid-cols-[3fr_1fr]'>
        <div className='w-full h-[400px] relative'>
        <Image
          src={product?.picture || placeholderImage}
          alt={product?.name!}
          fill
          className="object-contain"
        />
      </div>

      <div className='flex gap-3 md:flex-col'>
        {product?.pictureList?.length && (
          product?.pictureList?.map((imgSrc:string,index:number)=>(
            <div key={index} className='w-full h-24 mb-4 relative border-2'>
              <Image
                src={placeholderImage}
                alt={`${product?.name!} - ${index + 1}`}
                fill
                className="object-contain"
              />
            </div>
          ))
        )}
      </div>
      </div>

      {/* Product details */}
      <div className='space-y-2'>
        <h3 className='text-[14px]'>Product code: {product?.code}</h3>
        <h2 className='text-xl font-semibold md:text-2xl'>{product?.name}</h2>
        <h2 className='text-lg font-semibold'>{formatPrice(product?.salePrice!,product?.ccy as CurrencyCode)}</h2>
        <p>Shipping calculated at checkout</p>

      </div>

      <p>{product?.qtyInStore} {product?.unit} in stock</p>

      <div className='space-y-4 border p-3 rounded-md'>
        <div className='flex items-center gap-2 border-b pb-2'>
          <Shield/>
          <span>Manufacturer&apos;s Warranty</span>
        </div>
        <div className='flex items-center gap-2 border-b pb-2'>
          <Reply/>
          <span>Easy Returns & Exchanges</span>
        </div>
        <div className='flex items-center gap-2 pb-2'>
          <ThumbsUp/>
          <span>Best Price</span>
        </div>
      </div>

      <div className='flex flex-col gap-3 items-stretch'>
          {singleQuantity(product?.id) <= 0 && (
              <button 
                  className='group flex w-full py-3 bg-gray-100 items-center justify-center text-sm text-gray-600 font-semibold rounded-md transition-colors duration-200 relative hover:bg-accent hover:text-white cursor-pointer' 
                  onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product as any)
                  }}
              >
                  <span className='flex-1 text-center pr-12'>Add</span>
                  <span className='bg-gray-200 h-full absolute right-0 top-0 group-hover:bg-accent group-hover:text-white px-3 flex items-center justify-center text-base text-black rounded-r-md border-l group-hover:border-accent'>+</span>
              </button>
          )}

          {inCart(product?.id) && (
              <div className='group flex w-full py-3 bg-accent items-center justify-between text-sm text-white font-semibold rounded-md transition-colors duration-200 relative'>
                  <button 
                      className='bg-accent h-full w-12 absolute left-0 top-0 flex items-center justify-center text-base text-white border-accent rounded-l-md border-r hover:bg-accent-dark' 
                      onClick={(e) => {
                          e.stopPropagation();
                          decrement(product as any)
                      }}
                  >-</button>
                  <span className='flex-1 text-center px-12'>{singleQuantity(product?.id)}</span>
                  <button 
                      className='bg-accent h-full w-12 absolute right-0 top-0 flex items-center justify-center text-base text-white border-accent rounded-r-md border-l hover:bg-accent-dark' 
                      onClick={(e) => {
                          e.stopPropagation();
                          increment(product as any)
                      }}
                  >+</button>
              </div>
          )}
          
          
      </div>
    </div>
  )
}