import { LoggedInUser } from '@/types/index';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ✅ Define the correct store shape
interface UserStore {
  user: LoggedInUser | null;
  setUser: (user: LoggedInUser) => void;
  clear: () => void;
}

// ✅ Zustand store with correct type
const useUser = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set(() => ({ user })),
      clear: () => set(() => ({ user: null })),
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUser;
