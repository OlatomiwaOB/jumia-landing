'use client';
import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { DeleteIcon } from '../icons/icons';
import { Button } from './button';

interface CartDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement>;
    onCheckout: () => void;
    isPending?: boolean;
}

export const CartDropdown: React.FC<CartDropdownProps> = ({
    isOpen,
    onClose,
    anchorRef,
    onCheckout,
    isPending = false,
}) => {
    const { cart, increment, decrement, removeItem, getCartTotal, mainCcy, singleQuantity } = useCart();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const totalAmount = getCartTotal();
    const ccy = mainCcy();

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
                anchorRef.current && !anchorRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose, anchorRef]);

    if (!isOpen) return null;

    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

    return (
        <>
            <div
                className="fixed bg-black/50 inset-0 z-40"
                onClick={onClose}
            />

            <div
                ref={dropdownRef}
                className="fixed z-50 right-4 top-[72px] w-[340px] sm:w-[380px] bg-[#F5F5F5] rounded-2xl shadow-2xl border border-gray-100 flex flex-col"
                style={{ maxHeight: 'calc(100vh - 96px)' }}
            >
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-dark-gray">Cart</h3>
                    <button
                        onClick={onClose}
                        className="ring-offset-background bg-white p-1 rounded-full cursor-pointer text-dark-gray focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-dark-gray absolute top-4 right-4 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    >
                        <X className="w-4 h-4 text-medium-gray" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 bg-white mb-2 mx-4 rounded-2xl px-3 py-2" style={{ scrollbarWidth: 'none' }}>
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <p className="text-sm text-medium-gray font-light">Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {cart.map((item, idx) => {
                                const qty = singleQuantity(item.id);
                                const exceedsStock = qty > (item.qtyInStore ?? 0);

                                return (
                                    <div
                                        key={`${item.id}-${idx}`}
                                        className="flex items-center gap-3 py-1 border-b border-gray-50 last:border-b-0"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden shrink-0 relative">
                                            <Image
                                                src={item.picture || '/images/placeholder-image.png'}
                                                alt={item.name || ''}
                                                fill
                                                className="object-contain p-1"
                                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder-image.png'; }}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-medium-gray truncate">{item.name}</p>

                                            <div className="flex items-center gap-2 mt-1.5">
                                                <div className="flex items-center gap-1.5 border-1 border-gray-100 rounded-full px-2 py-0.5">
                                                    <button
                                                        onClick={() => decrement(item as any)}
                                                        disabled={qty <= 1}
                                                        className="w-5 h-5 flex items-center justify-center rounded-full text-dark-gray hover:bg-gray-200 transition-colors disabled:opacity-40"
                                                    >
                                                        <span className="text-sm leading-none">−</span>
                                                    </button>
                                                    <span className="text-sm font-semibold text-dark-gray min-w-[16px] text-center">
                                                        {qty}
                                                    </span>
                                                    <button
                                                        onClick={() => increment(item as any)}
                                                        disabled={qty >= (item.qtyInStore ?? 0)}
                                                        className="w-5 h-5 flex items-center justify-center rounded-full text-dark-gray hover:bg-gray-200 transition-colors disabled:opacity-40"
                                                    >
                                                        <span className="text-sm leading-none">+</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <DeleteIcon className="w-3.5 h-3.5" />
                                            </button>

                                            <div className='flex tems-center gap-1'>
                                                <div className='text-xs flex items-center gap-1 text-medium-gray font-light'>
                                                    <span>
                                                        {qty}x pcs
                                                    </span>
                                                    <span>−</span>
                                                </div>
                                                <div className='flex flex-row gap-1'>
                                                    <span className="text-sm font-semibold text-dark-gray">
                                                        {formatPrice(item.subTotal, (item.ccy || ccy) as CurrencyCode)}
                                                    </span>
                                                    {(item.oldPrice ?? 0) > item.subTotal && (
                                                        <span className="text-[10px] text-medium-gray font-light line-through">
                                                            {formatPrice(item.oldPrice ?? 0, item.ccy as CurrencyCode)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="px-4 py-3 border-t-1 mt-4 bg-white rounded-b-2xl border-gray-100 flex justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm text-medium-gray font-semibold">Subtotal</span>
                            <span className="text-sm font-bold text-dark-gray">
                                {formatPrice(totalAmount, ccy as CurrencyCode)}
                            </span>
                        </div>
                        <Button
                            onClick={onCheckout}
                            disabled={isPending || cart.length === 0}
                        >
                            {isPending ? 'Processing…' : 'Continue to Checkout'}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};