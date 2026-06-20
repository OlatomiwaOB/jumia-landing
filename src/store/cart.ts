"use client"
import { Item } from "@radix-ui/react-dropdown-menu";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MenuItem {
  id?: number;
  name?: string;
  salePrice: number;
  picture?: any;
  category?: string;
  description?: string;
  unit?: string;
  code?: string;
  ccy?: string;
  usdPrice?: number,
  dicount?: number
  qtyInStore: number
  storeCode: string
  vat?: string | null;
  weight?: number;
  weightUnit?: string;
  variantId?: any
  //   bg?: string;
  //   color?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  subTotal: number;
  oldPrice?: number;
  discount?: number,
  qtyInStore: number
  // vat?: number | null | undefined | string
}

interface CartStore {
  cartVisibility: boolean;
  inCart: (id: number | undefined) => boolean;
  singleQuantity: (id: number | undefined) => number;
  cart: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  increment: (payload: CartItem) => void;
  decrement: (payload: CartItem) => void;
  addToCart: (payload: MenuItem, qty?: number) => void;
  removeItem: (id: number | undefined) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartWeight: () => number;
  totalItems: number;
  mainCcy: () => string | undefined;
  usdTotal: () => number;
  totalVat?: () => number | null | undefined | string;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cartVisibility: false,
      cart: [],
      mainCcy: () => {
        const { cart } = get();
        const currency = cart.length > 0 ? cart[0].ccy : '';
        return currency;
      },
      totalItems: 0,

      inCart: (id) => {
        const { cart } = get();
        return cart.some(item => item.id === id);
      },

      singleQuantity: (id) => {
        const { cart } = get();
        const item = cart.find(item => item.id === id);
        return item ? item.quantity : 0;
      },

      openCart: () => set({ cartVisibility: true }),
      closeCart: () => set({ cartVisibility: false }),

      increment: (payload) =>
        set((state) => {
          const updatedCart = state.cart.map((item) => {
            if (item.id === payload.id) {
              return {
                ...item,
                quantity: item.quantity + 1,
                subTotal: (item.quantity + 1) * item.salePrice
              };
            }
            return item;
          });

          return {
            cart: updatedCart,
            totalItems: state.totalItems + 1
          };
        }),

      decrement: (payload) =>
        set((state) => {
          const updatedCart = state.cart.map((item) => {
            if (item.id === payload.id) {
              const newQuantity = Math.max(1, item.quantity - 1);
              return {
                ...item,
                quantity: newQuantity,
                subTotal: newQuantity * item.salePrice
              };
            }
            return item;
          });

          const totalItemsDelta = updatedCart.reduce((acc, item) => acc + item.quantity, 0) - state.totalItems;

          return {
            cart: updatedCart,
            totalItems: state.totalItems + totalItemsDelta
          };
        }),

      // Cart modifications
      addToCart: (payload, qty = 1) =>
        set((state) => {
          // Check if product already exists in cart
          const existingItemIndex = state.cart.findIndex(item => item.id === payload.id);

          if (existingItemIndex === -1) {
            // Add new item to cart with quantity and subtotal
            const newItem: CartItem = {
              ...payload,
              quantity: qty,
              subTotal: payload.salePrice * qty
            };

            return {
              cart: [...state.cart, newItem],
              totalItems: state.totalItems + qty
            };
          }

          // If product already exists, return unchanged cart
          return { cart: [...state.cart] };
        }),

      removeItem: (id) =>
        set((state) => {
          const itemToRemove = state.cart.find(item => item.id === id);
          return {
            cart: state.cart.filter(item => item.id !== id),
            totalItems: state.totalItems - (itemToRemove?.quantity || 0)
          };
        }),

      clearCart: () => set({ cart: [], totalItems: 0 }),

      // Calculate total cart value
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.subTotal, 0);
      },
      // Calculate total cart weight in kg (falls back to quantity if weight is not set)
      getCartWeight: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          const itemWeight = item.weight && item.weight > 0 ? item.weight : 1;
          return total + (itemWeight * item.quantity);
        }, 0);
      },
      usdTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + (item.usdPrice || 0) * item.quantity, 0);
      },
      totalVat: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + Number(item.vat || 0) * item.quantity, 0);
      }

    }),

    {
      name: 'cart-storage-storefront', // Unique name for localStorage
      partialize: (state) => ({ cart: state.cart, totalItems: state.totalItems }), // Only persist the cart items
    }
  )
);
