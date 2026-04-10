'use client'

export default function DiagonalStrips() {
  return (
    <div className="relative bg-gray-100  min-h-[50vh] py-2 overflow-hidden hidden lg:block">
      {/* Black strip - angled down-right */}
      <div className="absolute w-[300%] h-12 bg-black -rotate-6 z-10  overflow-hidden -left-1/3">
        <div className="flex gap-24 whitespace-nowrap animate-[scroll-left_28s_linear_infinite]">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="text-xl font-black text-white uppercase tracking-wider">
              Up to 10% OFF
            </span>
          ))}
        </div>
      </div>

      {/* Gray strip - angled down-left */}
      <div className="absolute w-[300%] h-12 bg-gray-400/40  rotate--rotate-6 z-0 overflow-hidden">
        <div className="flex gap-24 whitespace-nowrap animate-[scroll-right_32s_linear_infinite]">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="text-xl font-black text-gray-600 uppercase tracking-wider">
              Up to 10% OFF
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}