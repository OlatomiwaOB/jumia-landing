'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddBankAccountForm } from "./add-account-form";
import { BankAccountList } from "./bank-account-list";
import { useQuery } from "@tanstack/react-query";
import axiosCustomer from "@/utils/fetch-function-customer";

export interface BankAccount {
  id: number;
  ownerType: string;
  country: string;
  currency: string;
  accountNo: string;
  accountName: string;
  finEntityName: string;
}

export interface BankAccountFormData {
//   ownerType: string;
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
//   channel: string;
}

export const BankAccountManagement = () => {
  
  const {data} = useQuery({
    queryKey: ['bank-accounts'],
    queryFn: ()=>axiosCustomer?.request({
        url: `/bank/fetch-accounts`,
        method: 'GET'
    })
  })

  console.log(data);


//   const handleEdit = (id: number) => {
//     console.log("Edit account:", id);
//     // Implement edit functionality
//   };


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Bank Accounts</h1>
          {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add New Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Bank Account</DialogTitle>
              </DialogHeader>
              <AddBankAccountForm onSubmit={handleAddAccount} />
            </DialogContent>
          </Dialog> */}
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="relative grid lg:grid-cols-2 gap-6">
          {/* Left Column - Add Form */}
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="text-xl">Add Bank Account</CardTitle>
            </CardHeader>
            <CardContent>
              <AddBankAccountForm />
            </CardContent>
          </Card>

          {/* Right Column - Existing Accounts */}
          <Card className="shadow-sm border-border h-[450px] sticky top-0 overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-xl">Existing Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <BankAccountList
                accounts={data?.data?.bankAccountData || []}
                // onEdit={handleEdit}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
