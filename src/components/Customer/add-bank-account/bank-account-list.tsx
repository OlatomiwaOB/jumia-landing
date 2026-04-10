import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { BankAccount } from "./bank-account-management";

interface BankAccountListProps {
  accounts: BankAccount[];
//   onEdit: (id: number) => void;
//   onRemove: (id: number) => void;
}

export const BankAccountList = ({ accounts }: BankAccountListProps) => {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No bank accounts added yet.</p>
        <p className="text-sm mt-2">Add your first account to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div
          key={account.id}
          className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-card"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground mb-1">
                Account Name: {account.accountName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Account No: {account.accountNo}
              </p>
              <p className="text-sm text-muted-foreground">
                Bank: {account.finEntityName}
              </p>
            </div>
            {/* <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(account.id)}
                className="hover:bg-secondary"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(account.id)}
                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
};
