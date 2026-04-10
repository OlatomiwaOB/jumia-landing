import { useState, useEffect, useCallback } from 'react';

interface UseScrollToTopOptions {
  threshold?: number;
  smooth?: boolean;
}

export function useScrollToTop(options: UseScrollToTopOptions = {}) {
  const { threshold = 300, smooth = true } = options;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, [smooth]);

  return { isVisible, scrollToTop };
}