import { LoggedInUser } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const initialUser: LoggedInUser = {
  accountType: null,
  address: '',
  appMenuList: null,
  appSettingsDto: null,
  appVersion: null,
  branchID: '',
  branchName: '',
  businessName: '',
  ccy: '',
  country: '',
  creditWallet: false,
  customerTier: null,
  deviceID: '',
  email: '',
  entityCode: '',
  entityLogo: '',
  entityName: '',
  entityStyle: null,
  entityType: '',
  expiryDate: null,
  externalAccount: null,
  firstname: null,
  forcePwdChange: '',
  fullname: '',
  hardTokenOtpValid: null,
  language: null,
  lastLoginDate: '',
  medium: null,
  menuInfoList: null,
  merchantCode: '',
  merchantGroupCode: '',
  messageActionDto: null,
  metaData: null,
  mobileNo: '',
  paymentMethodAllowed: null,
  photoLinks: null,
  pwd: '',
  referalCode: '',
  refreshToken: null,
  responseCode: '',
  responseMessage: '',
  retryNo: 0,
  softTokenQrCodeLink: null,
  storeCode: null,
  supervisor: '',
  supervisorPassword: null,
  terminalId: '',
  ticketID: '',
  twoFactorLimit: 0,
  twoFactorType: '',
  userID: '',
  userPermissionList: null,
  userRole: '',
  userRoles: null,
  username: '',
  walletAcc: '',
  walletBalance: 0,
  walletType: 0,
};

// ✅ Define the correct store shape
interface UserStore {
  user: LoggedInUser;
  setUser: (user: LoggedInUser) => void;
  clear: () => void;
}

// ✅ Zustand store with correct type
const useUser = create<UserStore>()(
  persist(
    (set) => ({
      user: initialUser,
      setUser: (user) => set(() => ({ user })),
      clear: () => set(() => ({ user: initialUser })),
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUser;
