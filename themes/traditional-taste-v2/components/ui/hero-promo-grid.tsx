'use client';
import Image from 'next/image';

export default function HeroPromoGrid() {
  return (
    <section className="w-full px-4 lg:px-10 pt-0 pb-6 lg:pt-2 lg:pb-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_3.5fr_1fr] gap-2 lg:gap-2 min-h-[400px]">

        {/* CARD 1: Left (1 col) */}
        <div className="bg-[var(--color-text)] rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[550px] p-8 cursor-pointer group">
          <div className="absolute top-6 left-6 z-10 w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
            <span className="text-[var(--color-foreground)] font-bold text-sm">50%</span>
          </div>
          <div className="relative w-full flex-1 min-h-[180px] flex items-center justify-center mt-8 mb-4">
            <div className="relative w-full h-full transition-transform duration-500 md:group-hover:scale-115 md:group-hover:-translate-y-3">
              <Image src="/premium_suya_special_transparent.png" alt="Premium Suya" fill className="object-contain object-center scale-125" sizes="(max-width: 1024px) 100vw, 25vw" />
            </div>
          </div>
          <div className="relative z-10 text-center flex flex-col items-center">
            <p className="text-[var(--color-foreground)] text-[13px] font-medium mb-1">Get extra 50% off</p>
            <h3 className="text-[var(--color-foreground)] text-[32px] font-bold leading-tight mb-5">
              <span className="text-[var(--color-primary)]">Spicy</span> Suya
            </h3>
            <button className="bg-[var(--color-primary)] hover:bg-[var(--color-foreground)] hover:text-[var(--color-text)] text-[var(--color-foreground)] font-bold py-2.5 px-8 rounded-lg text-[14px] transition-colors w-max">
              Shop now
            </button>
          </div>
        </div>

        {/* CARD 2: Center (2 cols) */}
        <div className="bg-[var(--color-bg-secondary)] rounded-2xl relative overflow-hidden flex flex-col justify-center min-h-[550px] p-6 md:p-10 cursor-pointer group">
          {/* Left Image */}
          <div className="absolute bottom-0 left-0 w-[45%] md:w-[35%] max-w-[250px] aspect-square rounded-tr-[100%] md:rounded-full overflow-hidden shadow-2xl md:border-4 md:border-[var(--color-bg-secondary)] transition-transform duration-700 md:group-hover:-translate-x-24 md:group-hover:translate-y-24">
            <Image src="/pounded_yam_egusi.jpg" alt="Pounded Yam & Egusi" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 50vw" />
          </div>
          {/* Right Image */}
          <div className="absolute bottom-0 right-0 w-[45%] md:w-[35%] max-w-[250px] aspect-square rounded-tl-[100%] md:rounded-full overflow-hidden shadow-2xl md:border-4 md:border-[var(--color-bg-secondary)] transition-transform duration-700 md:group-hover:translate-x-24 md:group-hover:translate-y-24">
            <Image src="/jollof rice.jpg" alt="Fried Plantain & Jollof Rice" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 50vw" />
          </div>

          <div className="relative z-10 text-center flex flex-col items-center max-w-lg mx-auto">
            <p className="text-[var(--color-text)] text-[14px] font-medium mb-2 opacity-80">Premium Catering</p>
            <h3 className="text-[var(--color-text)] text-3xl md:text-[40px] font-extrabold leading-tight mb-4">
              Authentic <span className="text-[var(--color-primary)]">Nigerian</span> Flavors
            </h3>
            <p className="text-[var(--color-text)] text-[14px] mb-8 px-4 font-medium opacity-80">
              Experience the true taste of home, delivered fresh and hot to your doorstep.
            </p>
            <button className="bg-[var(--color-primary)] hover:bg-[var(--color-text)] hover:text-[var(--color-foreground)] text-[var(--color-foreground)] font-bold py-3 px-10 rounded-lg text-[14px] transition-colors w-max">
              Shop now
            </button>
          </div>
        </div>

        {/* CARD 3: Right (1 col) */}
        <div className="bg-[var(--color-text)] rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[550px] p-8 cursor-pointer group">
          <div className="absolute top-6 left-6 z-10 w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
            <span className="text-[var(--color-foreground)] font-bold text-sm">35%</span>
          </div>
          <div className="relative w-full flex-1 min-h-[180px] flex items-center justify-center mt-8 mb-4">
            <div className="relative w-full h-full transition-all duration-500 md:group-hover:-translate-y-6 md:group-hover:scale-110">
              <Image src="/igbo_abacha_user_transparent.png" alt="Abacha (African Salad)" fill className="object-contain object-center scale-110" sizes="(max-width: 1024px) 100vw, 25vw" />
            </div>
          </div>
          <div className="relative z-10 text-center flex flex-col items-center">
            <h3 className="text-[var(--color-foreground)] text-[32px] font-bold leading-tight mb-2">
              <span className="text-[var(--color-primary)]">African</span> Salad
            </h3>
            <p className="text-[var(--color-foreground)] text-[13px] font-medium mb-5 px-2">
              Vibrant, traditional Igbo delicacy.
            </p>
            <button className="bg-[var(--color-primary)] hover:bg-[var(--color-foreground)] hover:text-[var(--color-text)] text-[var(--color-foreground)] font-bold py-2.5 px-8 rounded-lg text-[14px] transition-colors w-max">
              Shop now
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
