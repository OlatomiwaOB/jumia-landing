'use client'
import { SlidersHorizontal } from 'lucide-react'
import React, { Suspense } from 'react'
import { Sheet, SheetTrigger } from '../ui/sheet'
import CategoriesMoile from './categories-mobile'

const FilterHeader = () => {
  return (
    <div className='bg-white md:hidden p-4 sticky top-0 z-40 border-b border-gray-200'>
      <Sheet>
        <SheetTrigger asChild>
          <button className='flex items-center gap-2 text-gray-700 border p-2 bg-[#f3f4f6e6] hover:bg-accent hover:text-white font-medium'>
        <SlidersHorizontal/>
        Filter
      </button>
        </SheetTrigger>
        <Suspense>
          <CategoriesMoile/>
        </Suspense>
      </Sheet>
    </div>
  )
}

export default FilterHeader