'use client';

import { useScrollToTop } from '@/app/hooks/useScrollToTop';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ScrollToTopButtonProps {
  threshold?: number;
  smooth?: boolean;
  className?: string;
}

export default function ScrollToTopButton({
  threshold = 300,
  smooth = true,
  className = '',
}: ScrollToTopButtonProps) {
  const { isVisible, scrollToTop } = useScrollToTop({ threshold, smooth });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-8 z-50
        flex items-center justify-center
        w-12 h-12 rounded-full
        bg-accent text-white cursor-pointer
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
        ${isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
        ${className}
      `}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

// 'use client';

// import { useScrollToTop } from '@/app/hooks/useScrollToTop';
// import { ArrowUp } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { cn } from '@/lib/utils';

// interface ScrollToTopButtonProps {
//   threshold?: number;
//   smooth?: boolean;
//   className?: string;
//   position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
//   size?: 'sm' | 'md' | 'lg';
//   showOnMount?: boolean;
// }

// export default function ScrollToTopButton({
//   threshold = 300,
//   smooth = true,
//   className = '',
//   position = 'bottom-right',
//   size = 'md',
//   showOnMount = false,
// }: ScrollToTopButtonProps) {
//   const { isVisible, scrollToTop } = useScrollToTop({ threshold, smooth });
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) return null;

//   const positionClasses = {
//     'bottom-left': 'bottom-8 left-8',
//     'bottom-right': 'bottom-8 right-8',
//     'top-left': 'top-8 left-8',
//     'top-right': 'top-8 right-8',
//   };

//   const sizeClasses = {
//     sm: 'w-10 h-10',
//     md: 'w-12 h-12',
//     lg: 'w-14 h-14',
//   };

//   const iconSizes = {
//     sm: 'w-4 h-4',
//     md: 'w-5 h-5',
//     lg: 'w-6 h-6',
//   };

//   return (
//     <button
//       onClick={scrollToTop}
//       className={cn(
//         'fixed z-50',
//         positionClasses[position],
//         sizeClasses[size],
//         'flex items-center justify-center',
//         'rounded-full bg-accent text-white',
//         'shadow-lg hover:shadow-xl',
//         'transition-all duration-300 ease-in-out',
//         'hover:scale-110 active:scale-95',
//         'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
//         (isVisible || showOnMount)
//           ? 'opacity-100 translate-y-0 pointer-events-auto'
//           : 'opacity-0 translate-y-4 pointer-events-none',
//         className
//       )}
//       aria-label="Scroll to top"
//     >
//       <ArrowUp className={iconSizes[size]} />
//     </button>
//   );
// }