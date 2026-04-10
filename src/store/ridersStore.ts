import { LoggedInUser, UserProfile } from '@/types/index';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserStore {
  rider: UserProfile | null;
  setRider: (rider: UserProfile) => void;
  clear: () => void;
}

const useRider = create<UserStore>()(
  persist(
    (set) => ({
      rider: null,
      setRider: (rider) => set(() => ({ rider })),
      clear: () => set(() => ({ rider: null })),
    }),
    {
      name: 'riders_store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useRider;
