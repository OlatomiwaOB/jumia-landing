'use client'
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { KycItemIcon } from '@/components/icons/icons';

interface SecuritySectionProps {
  user: any;
  onChangePassword: () => void;
  onChangePin: () => void;
  onForgotPin: () => void;
  onSetPin: () => void;
}

export default function SecuritySection({
  user,
  onChangePassword,
  onChangePin,
  onForgotPin,
  onSetPin,
}: SecuritySectionProps) {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handle2FAToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIs2FAEnabled(!is2FAEnabled);
    // Add your API call logic here
  };

  const items = [
    {
      id: 'change-password',
      label: 'Change Password',
      description: 'Update your account password',
      onClick: onChangePassword,
      show: true,
      hasToggle: false,
    },
    {
      id: 'set-pin',
      label: 'Set Transaction PIN',
      description: 'Set your transaction PIN for secure payments',
      onClick: onSetPin,
      show: !user?.pinSet,
    },
    {
      id: 'change-pin',
      label: 'Change Transaction PIN',
      description: 'Update your transaction PIN',
      onClick: onChangePin,
      show: !!user?.pinSet,
    },
    {
      id: 'forgot-pin',
      label: 'Forgot Transaction PIN',
      description: 'Recover your transaction PIN',
      onClick: onForgotPin,
      show: !!user?.pinSet,
    },
    {
      id: 'two-factor-auth',
      label: 'Two-Factor Authentication',
      description: 'Add extra security to your account',
      onClick: () => { },
      show: true,
      hasToggle: true,
      toggleValue: is2FAEnabled,
      onToggle: handle2FAToggle,
    },
  ].filter((i) => i.show);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-dark-gray">Security</h2>
      </div>

      <div className="p-6 space-y-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="w-full flex items-center border-1 rounded-2xl border-gray-200 gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-faded-accent/10 flex items-center justify-center shrink-0">
              <KycItemIcon className="w-4.5 h-4.5 text-faded-accent" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-dark-gray">{item.label}</p>
              <p className="text-xs text-medium-gray font-medium mt-0.5">{item.description}</p>
            </div>

            {item.hasToggle ? (
              <button
                onClick={item.onToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-faded-accent focus:ring-offset-2 ${item.toggleValue ? 'bg-faded-accent' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.toggleValue ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            ) : (
              <ChevronRight className="w-4 h-4 text-medium-gray shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}