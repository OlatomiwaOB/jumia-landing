'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { Check, Mail, Sparkles } from "lucide-react";

export default function LimitedOffer() {
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call delay for premium feel
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      setEmail('');
    }, 600);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 max-w-[1500px] mx-auto my-24 relative">
      
      {/* Main Container */}
      <div className="relative bg-[#111111] rounded-[2.5rem] md:rounded-[3rem] overflow-visible shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-white/10">
        
        {/* Background Decorative Patterns */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] md:rounded-[3rem] pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[150%] bg-gradient-to-r from-white/5 to-transparent -rotate-12 blur-2xl"></div>
          <div className="absolute top-[-50px] right-[20%] w-[200px] h-[200px] bg-[#E35920]/10 rounded-full blur-[80px]"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] items-center relative z-10">
          
          {/* Left Content Area */}
          <div className="flex flex-col gap-6 md:gap-8 p-8 md:p-14 lg:p-20 text-white">
            
            {/* Premium Badge */}
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-[#E35920] to-[#ff7a45] p-[1px] rounded-full shadow-[0_0_15px_rgba(227,89,32,0.4)]">
                <div className="flex items-center gap-2 bg-[#111111] px-4 py-1.5 rounded-full">
                  <Sparkles size={14} className="text-[#E35920]" />
                  <span className="text-[#E35920] text-xs font-bold tracking-[0.2em] uppercase">
                    Limited Time Offer
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] font-serif tracking-tight">
                Get <span className="text-[#E35920] inline-block hover:scale-110 transition-transform duration-300">10% Off</span> Your <br className="hidden lg:block"/>First Order
              </h2>
              
              <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-lg font-light">
                Join our family today. Sign up for our newsletter to receive exclusive discounts, recipes, and updates on new products.
              </p>
            </div>
            
            {/* Input Form */}
            <form onSubmit={handleSubscribe} className="flex flex-col xl:flex-row gap-4 mt-4 w-full max-w-full relative">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#E35920] transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  placeholder="Enter your email address..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#f8fafc] text-[#1a1a1a] placeholder-gray-500 border border-gray-200 rounded-2xl md:rounded-full pl-12 pr-6 py-4 md:py-5 focus:outline-none focus:bg-white focus:border-[#E35920] focus:ring-2 focus:ring-[#E35920]/20 transition-all text-base md:text-lg shadow-inner"
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="group relative bg-[#E35920] text-white font-bold px-8 py-4 md:py-5 rounded-2xl md:rounded-full overflow-hidden shadow-[0_10px_20px_rgba(227,89,32,0.3)] hover:shadow-[0_15px_30px_rgba(227,89,32,0.5)] transition-all duration-300 shrink-0 flex items-center justify-center min-w-[160px]"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                <span className="relative text-base md:text-lg flex items-center gap-2">
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Subscribe Now'
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Right Image Area - Breaks out of the container on large screens */}
          <div className="w-full h-[400px] lg:h-[120%] lg:absolute lg:right-0 lg:-top-[10%] lg:w-[45%] lg:max-w-[600px] p-6 lg:p-0 z-20">
            <div className="relative w-full h-full rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-4 lg:border-8 border-white/10 group">
              {/* Overlay gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-10 pointer-events-none group-hover:opacity-50 transition-opacity duration-500"></div>
              
              <Image 
                src="/three-soups-semo-white-cloth.png" 
                alt="Delicious Nigerian Soups with Semo"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              />
              
              {/* Floating decorative element over image */}
              <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full shadow-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                <span className="font-semibold tracking-wide flex items-center gap-2">
                  <Check size={16} className="text-[#E35920]" />
                  Fresh Ingredients
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Subscription Success Toast */}
      <div 
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white text-[#111111] px-8 py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          showToast ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8 pointer-events-none'
        }`}
      >
        <div className="bg-[#25D366] text-white p-1 rounded-full">
          <Check size={16} strokeWidth={4} />
        </div>
        <span className="font-bold text-base">You're on the list! Thank you for subscribing.</span>
      </div>

    </section>
  );
}
