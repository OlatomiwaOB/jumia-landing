'use client'
import React, { useState } from 'react';
import TransactionPinModal from '@/components/pin/transaction-pin-modal';
import ResetPasswordModal from '@/components/change-password';
import ResetPinModal from '@/components/forgot-transaction-pin';
import ChangePinModal from '@/components/change-transaction-pin';
import useCustomer from '@/store/customerStore';
import ProfileSection from './profile-section';
import KycSection from './kyc-section';
import SecuritySection from './security-section';
import {
  UserFilledIcon, UserIcon,
  KycFilledIcon, KycIcon,
  LockFilledIcon, LockIcon,
} from '@/components/icons/icons';
import { ChevronRight } from 'lucide-react';
import { usePageMetadata } from '@/hooks/usePageMetadata';

type NavKey = 'profile' | 'kyc' | 'security';

interface NavItem {
  key: NavKey;
  label: string;
  IconActive: React.FC<{ className?: string }>;
  IconInactive: React.FC<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'profile', label: 'Profile', IconActive: UserIcon, IconInactive: UserFilledIcon },
  // { key: 'kyc', label: 'KYC Verification', IconActive: KycIcon, IconInactive: KycFilledIcon },
  // { key: 'security', label: 'Security', IconActive: LockIcon, IconInactive: LockFilledIcon },
];

export default function Settings(): React.ReactElement {
  usePageMetadata('Settings', 'Manage you account settings');
  const { customer } = useCustomer();
  const [activeNav, setActiveNav] = useState<NavKey>('profile');

  const [isTransactionPinOpen, setIsTransactionPinOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isResetPinOpen, setIsResetPinOpen] = useState(false);
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F5] px-2">
      <div className="max-w-5xl flex flex-col lg:flex-row gap-4">

        <nav className="w-full lg:w-[300px] shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden h-fit">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = activeNav === item.key;
            const Icon = isActive ? item.IconActive : item.IconInactive;
            return (
              <button
                key={item.key}
                onClick={() => setActiveNav(item.key)}
                className={`w-full flex items-center justify-between px-4 py-4 transition-colors ${idx !== NAV_ITEMS.length - 1 ? 'border-b border-gray-100' : ''
                  } ${isActive ? 'bg-white' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isActive ? 'bg-faded-accent' : 'bg-faded-accent/10'
                    }`}>
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-medium-gray'}`} />
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-faded-accent' : 'text-dark-gray'}`}>
                    {item.label}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-faded-accent' : 'text-medium-gray'}`} />
              </button>
            );
          })}
        </nav>

        <div className="flex-1 min-w-0">
          {activeNav === 'profile' && <ProfileSection />}

          {activeNav === 'kyc' && <KycSection />}

          {activeNav === 'security' && (
            <SecuritySection
              customer={customer}
              onChangePassword={() => setIsResetPasswordOpen(true)}
              onChangePin={() => setIsChangePinOpen(true)}
              onForgotPin={() => setIsResetPinOpen(true)}
              onSetPin={() => setIsTransactionPinOpen(true)}
            />
          )}
        </div>
      </div>

      <TransactionPinModal
        isOpen={isTransactionPinOpen}
        onClose={() => setIsTransactionPinOpen(false)}
      />
      <ChangePinModal
        isOpen={isChangePinOpen}
        setIsOpen={setIsChangePinOpen}
      />
      <ResetPinModal
        isOpen={isResetPinOpen}
        setIsOpen={setIsResetPinOpen}
      />
      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        setIsOpen={setIsResetPasswordOpen}
      />
    </div>
  );
}