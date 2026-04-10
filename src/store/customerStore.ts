import { LoggedInUser, UserProfile } from '@/types/index';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


// ✅ Define the correct store shape
interface UserStore {
  customer: UserProfile | null;
  setCustomer: (customer: UserProfile) => void;
  clear: () => void;
}

// ✅ Zustand store with correct type
const useCustomer = create<UserStore>()(
  persist(
    (set) => ({
      customer: null,
      setCustomer: (customer) => set(() => ({ customer })),
      clear: () => set(() => ({ customer: null })),
    }),
    {
      name: 'customer_store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCustomer;
