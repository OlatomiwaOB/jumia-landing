import { useCart } from '@/store/cart'
import { ProductProps } from '@/types'
import { CurrencyCode, formatPrice } from '@/utils/helperfns'
import Image from 'next/image'
import React from 'react'
import placeholder from '@/assets/shopping-cart-realistic_1284-6011.jpg'

export const Product = ({ product, onClick }: { product: ProductProps, onClick: () => void }) => {
    const discount = product?.salePrice ? Math.ceil((product.oldPrice! - product.salePrice!) / product.oldPrice! * 100):0

    const {inCart,addToCart,singleQuantity,increment,decrement} = useCart()
    
    
  return (
    <div className='w-full bg-white shadow-md relative p-4 rounded-sm space-y-2' onClick={onClick}>
        {discount > 0 && (
            <div className='absolute top-0 right-0 bg-accent text-white p-1 rounded-bl-md'>
                {discount}%
            </div>
        )}
        <div className='relative w-[200px] h-[200px] mx-auto flex justify-center'>
            <Image
                src={product.picture || placeholder?.src}
                alt={product.name!}
                fill
                className='object-contain'
            />
        </div>

        <div className='space-x-2 py-1'>
            <span className='text-md font-semibold'>
                {formatPrice(product.salePrice! || product.oldPrice!, product?.ccy! as CurrencyCode)}
            </span>
            {discount > 0 && (
                <del className='text-[#9ca3af] text-[14px]'>{formatPrice(product.oldPrice!, product?.ccy! as CurrencyCode)}</del>
            )}
        </div>

        <span className='text-sm text-[#6b7280]'>
            ({formatPrice(product.usdPrice!, 'USD')})
        </span>

        <h3 className="truncate text-md font-semibold text-[#6b7280]">
            {product.name!}
        </h3>

        {
            singleQuantity(product?.id) <= 0 && (
                <button className='group flex w-full py-3 bg-[#f3f4f6] items-center justify-center gap-2 text-sm text-[#6b7280] font-semibold rounded-md mt-2  transition-colors duration-200 relative hover:bg-accent hover:text-white cursor-pointer' onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product as any)
                }}>
            <span className='flex-1'>Add</span>
            <span className='bg-[#e5e7eb] h-full absolute right-0 group-hover:bg-accent group-hover:text-white px-3 flex items-center justify-center text-[16px] text-black rounded-r-md border-l group-hover:border-accent'>+</span>
        </button>
            )
        }

        {
            inCart(product?.id) && (
                <div className='group flex w-full py-3 bg-accent items-center justify-between gap-2 text-sm text-[white] font-semibold rounded-md mt-2  transition-colors duration-200 relative hover:bg-accent hover:text-white cursor-pointer' onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product as any)
                }}>
                <button className='bg-accent h-full flex-[0.2] absolute left-0 group-hover:bg-accent group-hover:text-white px-3 flex items-center justify-center text-[16px] text-white border-accent rounded-l-md border-r group-hover:border-accent' onClick={() => decrement(product as any)}>-</button>
                <span className='flex-1 text-center'>{singleQuantity(product?.id)}</span>
                <button className='bg-accent h-full flex-[0.2] absolute right-0 group-hover:bg-accent group-hover:text-white px-3 flex items-center justify-center text-[16px] text-white border-accent rounded-r-md border-l group-hover:border-accent' onClick={() => increment(product as any)}>+</button>
        </div>
            )
        }

    </div>
  )
}
