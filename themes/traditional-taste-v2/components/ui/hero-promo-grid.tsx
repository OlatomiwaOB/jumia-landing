'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroPromoGrid() {
  return (
    <section className="w-full px-4 lg:px-10 py-6 lg:py-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 min-h-[400px]">
        
        {/* CARD 1: Left (1 col) */}
        <div className="lg:col-span-1 bg-[#373A40] rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[350px] p-6 group cursor-pointer hover:shadow-xl transition-all duration-300">
          {/* Badge */}
          <div className="absolute top-5 left-5 z-10 w-12 h-12 bg-[#F97316]/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#F97316]/30">
            <span className="text-[#F97316] font-bold text-sm">50%</span>
          </div>
          
          {/* Image */}
          <div className="absolute inset-0 flex items-center justify-center top-6 bottom-32">
             <div className="relative w-3/4 h-3/4 transition-transform duration-500 group-hover:scale-105">
                <Image 
                  src="/frozen-beef.jpg" 
                  alt="Fresh Meat" 
                  fill 
                  className="object-contain object-center drop-shadow-2xl rounded-xl shadow-lg" 
                  sizes="(max-width: 1024px) 100vw, 25vw" 
                />
             </div>
          </div>

          {/* Text Content */}
          <div className="relative z-10 mt-auto text-center flex flex-col items-center">
            <p className="text-white text-[13px] font-medium mb-1">Get extra 50% off</p>
            <h3 className="text-white text-2xl md:text-[28px] font-bold leading-tight mb-5">
              <span className="text-[#F97316]">Fresh</span> Everyday
            </h3>
            <button className="bg-[#F97316] hover:bg-white hover:text-black text-black font-bold py-2.5 px-8 rounded-lg text-[13px] transition-colors w-max shadow-md">
              Shop now
            </button>
          </div>
        </div>

        {/* CARD 2: Center (2 cols) */}
        <div className="lg:col-span-2 bg-[#3A4D39] rounded-2xl relative overflow-hidden flex flex-col justify-center min-h-[350px] p-6 md:p-10 group cursor-pointer hover:shadow-xl transition-all duration-300">
          
          {/* Background Images */}
          <div className="absolute bottom-[-10%] left-[-5%] w-2/5 h-2/3 md:w-[45%] md:h-[80%] transition-transform duration-700 group-hover:scale-105 origin-bottom-left">
            <Image src="/red_tomatoes.png" alt="Fresh Vegetables" fill className="object-contain object-bottom drop-shadow-2xl" sizes="(max-width: 1024px) 50vw, 50vw" />
          </div>
          <div className="absolute bottom-[-10%] right-[-5%] w-2/5 h-2/3 md:w-[45%] md:h-[80%] transition-transform duration-700 group-hover:scale-105 origin-bottom-right">
            <Image src="/hands_vegetables.png" alt="Fresh Produce" fill className="object-contain object-bottom drop-shadow-2xl" sizes="(max-width: 1024px) 50vw, 50vw" />
          </div>

          {/* Text Content */}
          <div className="relative z-10 text-center flex flex-col items-center max-w-md mx-auto drop-shadow-xl bg-black/10 p-6 rounded-2xl backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-none">
            <p className="text-white text-[13px] font-medium mb-2 opacity-90 tracking-wide">Big Discount</p>
            <h3 className="text-white text-3xl md:text-[38px] font-extrabold leading-tight mb-4">
              Fresh <span className="text-[#F97316]">Vegetables</span> & <span className="text-[#F97316]">Fruit</span> Basket
            </h3>
            <p className="text-white/80 text-[13px] mb-8 px-4 font-medium">
              So you don't have to go anywhere else for freshness
            </p>
            <button className="bg-[#F97316] hover:bg-white hover:text-black text-black font-bold py-3 px-10 rounded-lg text-sm transition-colors shadow-xl w-max">
              Shop now
            </button>
          </div>
        </div>

        {/* CARD 3: Right (1 col) */}
        <div className="lg:col-span-1 bg-[#2C3E50] rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[350px] p-6 group cursor-pointer hover:shadow-xl transition-all duration-300">
          {/* Badge */}
          <div className="absolute top-5 left-5 z-10 w-12 h-12 bg-[#F97316]/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#F97316]/30">
            <span className="text-[#F97316] font-bold text-sm">35%</span>
          </div>
          
          {/* Image */}
          <div className="absolute inset-0 flex items-start justify-center top-12 bottom-32">
             <div className="relative w-3/4 h-full transition-transform duration-500 group-hover:-translate-y-2">
                <Image 
                  src="/maltina-can-pack.png" 
                  alt="Quality Products" 
                  fill 
                  className="object-contain object-top drop-shadow-2xl" 
                  sizes="(max-width: 1024px) 100vw, 25vw" 
                />
             </div>
          </div>

          {/* Text Content */}
          <div className="relative z-10 mt-auto text-center flex flex-col items-center">
            <h3 className="text-white text-[28px] font-bold leading-tight mb-2">
              Quality <br/>Products
            </h3>
            <p className="text-white/70 text-[13px] font-medium mb-5 px-2">
              Everything for an easier start to the new year
            </p>
            <button className="bg-[#F97316] hover:bg-white hover:text-black text-black font-bold py-2.5 px-8 rounded-lg text-[13px] transition-colors w-max shadow-md">
              Shop now
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
