"use client"
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuItem } from "./cart";

interface WishlistStore {
  wishlist: MenuItem[];
  inWishlist: (id: number | undefined) => boolean;
  toggleWishlist: (payload: MenuItem) => void;
  clearWishlist: () => void;
  totalItems: number;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      totalItems: 0,

      inWishlist: (id) => {
        const { wishlist } = get();
        return wishlist.some(item => item.id === id);
      },

      toggleWishlist: (payload) =>
        set((state) => {
          const exists = state.wishlist.some(item => item.id === payload.id);
          let updatedWishlist: MenuItem[];

          if (exists) {
            updatedWishlist = state.wishlist.filter(item => item.id !== payload.id);
          } else {
            updatedWishlist = [...state.wishlist, payload];
          }

          return {
            wishlist: updatedWishlist,
            totalItems: updatedWishlist.length
          };
        }),

      clearWishlist: () => set({ wishlist: [], totalItems: 0 }),
    }),
    {
      name: "varisa-wishlist",
    }
  )
);
