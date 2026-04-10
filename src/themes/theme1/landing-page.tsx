'use client'
import AboutSection from '@/components/theme1/about-us'
import BannerComponent from '@/components/theme1/banner'
import DiagonalStrips from '@/components/theme1/diagonal-strip'
import FAQSection from '@/components/theme1/faq-section'
import ProductGrid from '@/components/theme1/featured-products'
import FeaturedProducts from '@/components/theme1/hot-products'
import ReviewsSection from '@/components/theme1/review-section'
import BrandLogos from '@/components/theme1/sponsors'
import { notFound, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const storeCode = process?.env?.NEXT_PUBLIC_STORE_CODE!
const ThemeOneLandingPage = () => {
const router = useRouter()

  useEffect(()=>{
    if(!storeCode){
      return notFound()
    }
    router.push(`?storeCode=${storeCode}`)
  },[])
  return (
    <main className='flex-1 min-h-screen py-2.5 bg-gradient-to-b from-gray-50 to-gray-100 space-y-4'>
        <BannerComponent/>
        <FeaturedProducts/>
        <DiagonalStrips/>
        <BrandLogos/>
        <ProductGrid/>
        <ReviewsSection/>
        <AboutSection/>
        <FAQSection/>
    </main>
  )
}

export default ThemeOneLandingPage