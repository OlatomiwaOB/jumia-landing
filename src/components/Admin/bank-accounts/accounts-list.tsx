'use client'
import { Button } from "@/components/ui/button";
import { Trash2, Send } from "lucide-react";
import { BankAccount } from "./accounts-management";

interface BankAccountListProps {
  accounts: BankAccount[];
  onDelete: (account: BankAccount) => void;
  onSendMoney: (account: BankAccount) => void;
}

export const BankAccountList = ({ accounts, onDelete, onSendMoney }: BankAccountListProps) => {
  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-2xl">
        <p className="text-sm text-medium-gray">No bank accounts added yet.</p>
        <p className="text-xs text-medium-gray">Add your first account using the form above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <div key={account.id} className="bg-white rounded-2xl p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-dark-gray">{account.accountName}</p>
              <p className="text-xs text-medium-gray">{account.accountNo}</p>
              <p className="text-xs text-medium-gray">{account.finEntityName}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="xs"
                variant="action"
                onClick={() => onSendMoney(account)}
                title="Send Money"
              >
                <Send className="w-4 h-4" />
              </Button>
              <Button
                size="xs"
                variant="action"
                onClick={() => onDelete(account)}
                title="Remove Account"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};