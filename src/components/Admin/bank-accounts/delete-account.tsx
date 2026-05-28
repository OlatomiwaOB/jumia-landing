'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import { toast } from "sonner";
import { BankAccount } from "./accounts-management";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: BankAccount | null;
  onSuccess?: () => void;
}

export const DeleteAccountModal = ({
  isOpen,
  onClose,
  account,
  onSuccess,
}: DeleteAccountModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await axiosInstance.delete('/bank/remove-account', {
        params: {
          accountNo: account?.accountNo,
          finEntityName: account?.finEntityName
        }
      });
    },
    onSuccess: (data) => {
      if (data?.data?.code === '000') {
        toast.success('Bank account removed successfully');
        onSuccess?.();
        onClose();
      } else {
        toast.error(data?.data?.desc || 'Failed to remove account');
        setIsDeleting(false);
      }
    },
    onError: () => {
      toast.error('Failed to remove bank account');
      setIsDeleting(false);
    }
  });

  const handleDelete = () => {
    setIsDeleting(true);
    deleteMutation.mutate();
  };

  if (!account) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
        <DialogTitle className="sr-only">Remove Bank Account</DialogTitle>
        <div className="px-6 pt-5 pb-2">
          <h2 className="text-base font-bold text-dark-gray">Remove Bank Account</h2>
          <p className="text-xs text-medium-gray mt-0.5">This action cannot be undone</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-white rounded-2xl p-4 space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs text-medium-gray">Account Name</p>
              <p className="text-sm font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{account.accountName}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-medium-gray">Account Number</p>
              <p className="text-sm font-mono font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{account.accountNo}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-medium-gray">Bank</p>
              <p className="text-sm font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{account.finEntityName}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-600"><span className="font-semibold">Warning:</span> This bank account will be permanently removed.</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-1">
            <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>Cancel</Button>
            <Button onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Removing...</> : <><Trash2 className="w-4 h-4" /> Remove Account</>}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};