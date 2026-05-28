'use client'
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { KycItemIcon } from '@/components/icons/icons';

interface SecuritySectionProps {
  customer: any;
  onChangePassword: () => void;
  onChangePin: () => void;
  onForgotPin: () => void;
  onSetPin: () => void;
}

export default function SecuritySection({
  customer,
  onChangePassword,
  onChangePin,
  onForgotPin,
  onSetPin,
}: SecuritySectionProps) {

  const items = [
    {
      id: 'change-password',
      label: 'Change Password',
      description: 'Update your account password',
      onClick: onChangePassword,
      show: true,
    },
    {
      id: 'set-pin',
      label: 'Set Transaction PIN',
      description: 'Set your transaction PIN for secure payments',
      onClick: onSetPin,
      show: !customer?.pinSet,
    },
    {
      id: 'change-pin',
      label: 'Change Transaction PIN',
      description: 'Update your transaction PIN',
      onClick: onChangePin,
      show: !!customer?.pinSet,
    },
    {
      id: 'forgot-pin',
      label: 'Forgot Transaction PIN',
      description: 'Recover your transaction PIN',
      onClick: onForgotPin,
      show: !!customer?.pinSet,
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

            <ChevronRight className="w-4 h-4 text-medium-gray shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}