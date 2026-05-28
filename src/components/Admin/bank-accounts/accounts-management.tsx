'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import { AddBankAccountForm } from "./add-account";
import { BankAccountList } from "./accounts-list";
import { DeleteAccountModal } from "./delete-account";
import { SendMoneyModal } from "../send-money/send-money";

export interface BankAccount {
  id: number;
  ownerType: string;
  country: string;
  currency: string;
  accountNo: string;
  accountName: string;
  finEntityName: string;
  finEntityCode: string;
  sortCode?: string;
  iban?: string;
  accountType?: string;
  address?: string;
  docLink?: string;
}

export interface BankAccountFormData {
  country: string;
  currency: string;
  accountNo: string;
  finEntityCode: string;
  finEntityName: string;
  entityType: string;
  accountName: string;
  sortCode?: string;
  iban?: string;
  checksum?: string;
}

export const BankAccountManagement = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deletingAccount, setDeletingAccount] = useState<BankAccount | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);
  const [sendMoneyAccount, setSendMoneyAccount] = useState<BankAccount | null>(null);

  const { data } = useQuery({
    queryKey: ['bank-accounts'],
    queryFn: () => axiosInstance?.request({
      url: `/bank/fetch-accounts`,
      method: 'GET'
    })
  });

  const handleSendMoney = (account: BankAccount) => {
    setSendMoneyAccount(account);
    setShowSendMoneyModal(true);
  };

  const accounts: BankAccount[] = data?.data?.bankAccountData || [];

  const handleDelete = (account: BankAccount) => {
    setDeletingAccount(account);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    queryClient?.invalidateQueries({ queryKey: ['bank-accounts'] });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl">
        <div className="mb-4">
          <Button variant="link" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>

        <div className='container mx-auto px-20 py-6'>
          <div className="mb-6">
            <h1 className="text-md lg:text-lg font-medium text-dark-gray">
              Manage Bank Accounts
            </h1>
            <p className="text-xs lg:text-sm font-normal text-medium-gray">
              Add and manage your bank accounts
            </p>
          </div>

          <AddBankAccountForm />

          <div className="mt-10">
            <h2 className="text-md font-semibold text-dark-gray mb-4">
              Existing Accounts <span className="text-md text-faded-accent">({accounts.length})</span>
            </h2>
            <BankAccountList
              accounts={accounts}
              onDelete={handleDelete}
              onSendMoney={handleSendMoney}
            />
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeletingAccount(null); }}
        account={deletingAccount}
        onSuccess={handleDeleteSuccess}
      />

      <SendMoneyModal
        isOpen={showSendMoneyModal}
        onClose={() => {
          setShowSendMoneyModal(false);
          setSendMoneyAccount(null);
        }}
        preselectedAccount={sendMoneyAccount}
      />
    </div>
  );
};