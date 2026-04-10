'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/store/cart';

interface CartIconWithBadgeProps {
  // onClick: () => void;
}

export const CartIconWithBadge = (props: CartIconWithBadgeProps) => {
  const { cart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const itemCount = cart.length;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="relative cursor-pointer">
        <ShoppingBag size={20} className="text-[#313133]" />
        <span className="sr-only">Cart</span>
      </div>
    );
  }

  return (
    <div className="relative cursor-pointer" >
      <ShoppingBag size={20} className="text-[#313133]" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#d8480b] text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
      <span className="sr-only">Cart ({itemCount} items)</span>
    </div>
  );
};