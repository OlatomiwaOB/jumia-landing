import React, { useState } from 'react'
import { SheetContent, SheetTitle } from '../ui/sheet'
import { useCategories } from '@/app/hooks/useCategories'
import Image from 'next/image'
import { Category } from '@/types'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'

const CategoriesMoile = () => {
  const {data,isLoading,error} = useCategories()
    const searchParams = useSearchParams();
    // const selectedCategory = searchParams.get('category') || '';
    const storeCode = searchParams.get('storeCode') || ''
    const [retry,setRetry] = useState(false)
    const retryFn = () =>{
        setRetry(!retry)
      }
  return (
    <SheetContent 
      side='left' 
      className='p-4 h-full overflow-y-auto'
      style={{
        scrollbarWidth: 'none'
      }}
    >
      <SheetTitle>Categories</SheetTitle>
      {isLoading && <div>Loading...</div>}
      {error && <div className='hidden lg:flex flex-col items-center justify-center lg:w-[380px] xl:w-[380px] lg:sticky lg:top-22 lg:self-start lg:max-h-screen'>
      <div className="p-4">Error loading categories</div>
      <Button className='bg-accent text-white' onClick={retryFn}>Retry</Button>
    </div>}
      {data?.categories && (
        <ul className='space-y-5'>
          {data?.categories?.map((category:Category) => (
            <li key={category.id} className='flex items-center gap-x-3'>
              <Link href={`?category=${category?.name}&storeCode=${storeCode}`} className='flex items-center gap-x-3'>
                <div className='w-5 h-5 mb-3 relative flex-shrink-0 flex items-center'>
                <Image
                  src={category?.logo||`loading..`}
                  alt={category.name!}
                  fill
                  className='object-contain self-center'
                />
              </div>
              <span>{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SheetContent>
  )
}

export default CategoriesMoile