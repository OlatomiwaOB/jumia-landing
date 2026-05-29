'use client'
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { KycItemIcon } from '@/components/icons/icons';

interface KycItem {
  id: string;
  label: string;
  description: string;
  status: 'Pending' | 'Verified' | 'Rejected';
}

const KYC_ITEMS: KycItem[] = [
  {
    id: 'income',
    label: 'Income/Employment Details',
    description: 'Provide your income/employment details.',
    status: 'Pending',
  },
  {
    id: 'liveness',
    label: 'Upload Photo and Liveness Check',
    description: 'Provide your income/employment details.',
    status: 'Pending',
  },
  {
    id: 'payslip',
    label: 'Pay Slip',
    description: 'Upload pay slip.',
    status: 'Pending',
  },
];

const statusColor = (s: KycItem['status']) => {
  switch (s) {
    case 'Verified':  return 'bg-green-100 text-green-700 border-green-200';
    case 'Rejected':  return 'bg-red-100 text-red-700 border-red-200';
    default:          return 'bg-bg-faded-accent/10 text-faded-accent border-faded-accent';
  }
};

export default function KycSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-dark-gray">KYC Verification</h2>
          <p className="text-xs text-medium-gray font-light mt-0.5">
            We require all users to complete identity verification.
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {KYC_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setOpenId(item.id)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-faded-accent/10 flex items-center justify-center shrink-0">
                <KycItemIcon className="w-4.5 h-4.5 text-faded-accent" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-gray">{item.label}</p>
                <p className="text-xs text-medium-gray font-light mt-0.5">{item.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge className={`text-[10px] px-2 py-0.5 border font-medium ${statusColor(item.status)}`}>
                  {item.status}
                </Badge>
                <ChevronRight className="w-4 h-4 text-medium-gray" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <AlertDialog open={!!openId} onOpenChange={(open) => { if (!open) setOpenId(null); }}>
        <AlertDialogContent className="rounded-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold text-dark-gray">
              Coming Soon
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-medium-gray font-light">
              This feature is currently under development and will be available soon. Stay tuned!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setOpenId(null)}
              className="rounded-xl h-11 text-sm font-medium"
            >
              Got it
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}