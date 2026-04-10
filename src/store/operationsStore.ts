import { LoggedInUser, UserProfile } from '@/types/index';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserStore {
  operations: UserProfile | null;
  setOperations: (operations: UserProfile) => void;
  clear: () => void;
}

const useOperations = create<UserStore>()(
  persist(
    (set) => ({
      operations: null,
      setOperations: (operations) => set(() => ({ operations })),
      clear: () => set(() => ({ operations: null })),
    }),
    {
      name: 'operations_store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useOperations;
