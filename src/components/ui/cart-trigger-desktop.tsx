'use client';

import React, { useEffect, useState } from 'react';
import { SheetTrigger } from './sheet';
import CartWrappper from './cart-wrapper';
import { ShoppingBag } from 'lucide-react';
import Cart from './cart';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';

const CartTriggerDesktop = () => {
    const { getCartTotal, cart, mainCcy } = useCart();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    if (!isMounted) {
        return (
            <CartWrappper>
                <SheetTrigger 
                    className="hidden lg:block w-[90.39px] h-[96px] p-3 bg-accent fixed top-[50%] right-0 z-50 rounded-l-sm cursor-pointer space-y-3"
                    aria-label="Open cart"
                >
                    <div className='flex items-center justify-center gap-1 text-white text-[13px] font-semibold'>
                        <span><ShoppingBag size={18} strokeWidth={2.5} /></span> 
                        <span>0 items</span>
                    </div>
                    {
                        cart.length === 0 ? null :(
                            <div className={`${cart.length===0 && 'hidden'} text-accent bg-white text-center py-1 rounded-sm text-[13px] font-semibold`}>
                        {formatPrice(0, mainCcy() as CurrencyCode)}
                    </div>
                        )
                    }
                </SheetTrigger>
            </CartWrappper>
        );
    }

    const totalAmount = getCartTotal();
    const itemCount = cart.length;

    return (
        <CartWrappper>
            <SheetTrigger 
                className="hidden lg:block w-[90.39px] h-[96px] p-3 bg-accent fixed top-[50%] right-0 z-50 rounded-l-sm cursor-pointer space-y-3"
                aria-label="Open cart"
            >
                <div className='flex items-center justify-center gap-1 text-white text-[13px] font-semibold'>
                    <span><ShoppingBag size={18} strokeWidth={2.5} /></span> 
                    <span>{itemCount > 1 ? `${itemCount} items` : `${itemCount} item`}</span>
                </div>

                 {
                        itemCount === 0 ? null :(
                            <div className={`${cart.length===0 && 'hidden'} text-accent bg-white text-center py-1 rounded-sm text-[13px] font-semibold`}>
                        {formatPrice(totalAmount, mainCcy() as CurrencyCode)}
                    </div>
                        )
                    }
            </SheetTrigger>
            <Cart />
        </CartWrappper>
    );
};

export default CartTriggerDesktop;