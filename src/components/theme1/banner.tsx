import Image from 'next/image'
import React from 'react'
import cameraImage from '@/assets/33427_fujifilm_camera-removebg-preview.png'

const BannerComponent = () => {
  return (
    <div className='bg-gradient-to-br from-gray-900 via-black to-gray-800 w-[95%] mx-auto rounded-2xl min-h-[85vh] relative text-white overflow-hidden shadow-2xl'>
        {/* Decorative background elements */}
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent'/>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent'/>
        
        {/* Subtle grid pattern */}
        <div className='absolute inset-0 opacity-[0.02]' style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}/>

        {/* Content Container */}
        <div className='relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[85vh] px-8 py-12'>
          
          {/* Left Side - Camera Image */}
          <div className='flex items-center justify-center order-2 lg:order-1'>
            <div className='relative group w-full max-w-lg'>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl group-hover:blur-2xl transition-all duration-500'/>
              <Image
                src={cameraImage}
                alt="Camera"
                width={600}
                height={600}
                className="object-contain w-full h-auto relative drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className='flex flex-col items-start gap-y-6 order-1 lg:order-2'>
            <div className='inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20'>
              <span className='text-sm font-medium tracking-wider'>NEW COLLECTION</span>
            </div>
            
            <h2 className='text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight'>
              Experience the Best <span className='block mt-2'>Photography</span>
            </h2>
            
            <p className='text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl'>
              Discover our premium range of cameras and accessories designed for professionals and enthusiasts alike
            </p>
            
            <div className='flex flex-wrap gap-4 mt-4'>
              <button className='group relative px-8 py-4 bg-white text-black font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:bg-accent hover:shadow-2xl hover:shadow-white/20'>
                <span className='relative z-10 group-hover:text-white transition-colors duration-300'>Shop Now</span>
                <div className='absolute inset-0 bg-gradient-to-r from-accent to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'/>
              </button>
              
              <button className='px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105'>
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20'>
          <div className='w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white cursor-pointer transition-colors'/>
          <div className='w-2.5 h-2.5 rounded-full bg-white'/>
          <div className='w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white cursor-pointer transition-colors'/>
        </div>
    </div>
  )
}

export default BannerComponent