'use client'
import { useCategories } from '@/app/hooks/useCategories'
import { Category } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import categories_placeholder from '@/assets/categories_placeholder.jpg'

const CategoriesDesktop = () => {
  const [retry,setRetry] = useState(false)
  const {data, isLoading, error} = useCategories(retry)
  const searchParams = useSearchParams(); 
  const selectedCategory = searchParams.get('category') || '';
  const storeCode = searchParams.get('storeCode') || ''
  const retryFn = () =>{
    setRetry(!retry)
  }

  console.log(data);

  if (isLoading) return (
    <div className='hidden lg:block lg:w-[380px] xl:w-[380px] lg:sticky lg:top-22 lg:self-start lg:max-h-screen'>
      <div className='px-4 pb-4 bg-light max-h-[calc(100vh-5.5rem)] overflow-y-auto'>
        <ul className='grid grid-cols-2 gap-4'>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <li key={item} className='w-full h-[136px]'>
              <div className="animate-pulse h-full w-full bg-gray-200 rounded-lg"></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
  
  if (error) return (
    <div className='hidden lg:flex flex-col items-center justify-center lg:w-[380px] xl:w-[380px] lg:sticky lg:top-22 lg:self-start lg:max-h-screen'>
      <div className="p-4">Error loading categories</div>
      <Button className='bg-accent text-white' onClick={retryFn}>Retry</Button>
    </div>
  )

  return (
    <div className='hidden lg:block lg:w-[380px] xl:w-[380px] lg:sticky lg:top-22 lg:self-start lg:max-h-screen'>
      <div 
        className='px-4 pb-4 bg-light max-h-[calc(100vh-5.5rem)] overflow-y-auto'
        style={{
          scrollbarWidth: 'none',
          scrollbarColor: 'transparent',
        }}
      >
        <ul className='grid grid-cols-2 gap-4'>
          {data?.categories?.map((category:Category) => (
            <li
              key={category.id}
              className='w-full h-[136px] mt-0.5'
            >
              <Link 
                href={`?category=${category?.name}&storeCode=${storeCode}`} 
                className={`w-full h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer ${
                  selectedCategory === category.name 
                    ? 'ring-2 ring-accent' 
                    : 'hover:border-gray-200'
                }`}
              >
                <div className='w-12 h-12 mb-3 relative flex-shrink-0'>
                  <Image
                    src={category?.logo! || categories_placeholder?.src}
                    alt={category?.name!}
                    fill
                    className='object-contain'
                  />
                </div>
                <span className='text-xs text-center text-gray-700 font-medium leading-tight line-clamp-2'>
                  {category.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CategoriesDesktop