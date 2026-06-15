"use client"
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface GuestInfo {
  firstname: string;
  lastname: string;
  email: string;
  mobileNo: string;
  city: string;
  countryCode: string;
  password: string;
  nationality?: string;
  gender?: string;
  dateOfBirth?: string;
  customerType?: string;
}

interface GuestCheckoutStore {
  isGuestCheckout: boolean;
  guestInfo: GuestInfo | null;
  setGuestCheckout: (isGuest: boolean) => void;
  setGuestInfo: (info: GuestInfo) => void;
  clear: () => void;
}

export const useGuestCheckoutStore = create<GuestCheckoutStore>()(
  persist(
    (set) => ({
      isGuestCheckout: false,
      guestInfo: null,
      setGuestCheckout: (isGuest) => set({ isGuestCheckout: isGuest }),
      setGuestInfo: (info) => set({ guestInfo: info }),
      clear: () => set({ isGuestCheckout: false, guestInfo: null }),
    }),
    {
      name: 'guest-checkout-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
