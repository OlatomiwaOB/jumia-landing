'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Loader2, Settings } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';
import { toast } from 'sonner';
import { PinInput } from '@/components/ui/pin-input';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatPrice, CurrencyCode } from '@/utils/helperfns';
// import { encryptTransactionPin } from '@/utils/encrypt-pin';

interface BankAccount {
    id: number;
    ownerType: string;
    country: string;
    currency: string;
    accountNo: string;
    accountName: string;
    finEntityName: string;
    finEntityCode: string;
}

const FormSection = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-100 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1 mt-1">
                <h2 className="text-sm font-semibold text-dark-gray">{title}</h2>
                <p className="text-xs text-medium-gray mt-1">{subtitle}</p>
            </div>
            <div className="md:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
            </div>
        </div>
    </div>
);

const FormField = ({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) => (
    <div className={`space-y-1.5 ${className || ''}`}>
        <Label>{label} {required && <span className="text-red-500">*</span>}</Label>
        {children}
    </div>
);

export const SendMoneyPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedAccountNo = searchParams.get('accountNo') || '';
    
    const [amount, setAmount] = useState('');
    const [selectedAccountNo, setSelectedAccountNo] = useState(preselectedAccountNo);
    const [showPinModal, setShowPinModal] = useState(false);
    const [showSetupPinModal, setShowSetupPinModal] = useState(false);
    const [pin, setPin] = useState('');

    const { data: accountsData, isLoading: isLoadingAccounts } = useQuery({
        queryKey: ['bank-accounts'],
        queryFn: () => axiosInstance.request({
            url: '/bank/fetch-accounts',
            method: 'GET'
        }),
    });

    const { data: balanceData, isLoading: isLoadingBalance } = useQuery({
        queryKey: ['wallet-balances'],
        queryFn: () => axiosInstance.request({
            method: 'GET',
            url: '/store-dashboard/balance',
            params: {
                username: user?.username,
                entityCode: user?.entityCode,
                storeCode: user?.storeCode || '',
            }
        }),
    });

    const accounts: BankAccount[] = accountsData?.data?.bankAccountData || [];
    const wallet = balanceData?.data?.wallets?.[0];
    const walletBalance = wallet?.balance || 0;

    const preselectedAccount = accounts.find(a => a.accountNo === preselectedAccountNo) || null;
    const selectedAccount = preselectedAccount || accounts.find(a => a.accountNo === selectedAccountNo);

    const handleSendMoney = () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (!selectedAccount) {
            toast.error('Please select a beneficiary account');
            return;
        }

        if (parseFloat(amount) > walletBalance) {
            toast.error('Insufficient balance');
            return;
        }

        if (!user?.pinSet) {
            setShowSetupPinModal(true);
            return;
        }

        setShowPinModal(true);
    };

    const { mutate: sendMoney, isPending: isSending } = useMutation({
        mutationFn: (transactionPin: string) => {
            // const encryptedPin = encryptTransactionPin(transactionPin);
            const payload = {
                rrn: '',
                stan: '',
                externalRefNo: `SEND-${Date.now()}`,
                username: user?.username || '',
                terminalId: '',
                deviceId: user?.deviceID || '',
                sourceAccount: wallet?.accountNo || '',
                senderCcy: 'NGN',
                senderNetwork: '',
                senderAccountType: '',
                exchRate: '',
                tranCode: 'IBFT',
                tranType: 'OUTWARD',
                senderName: user?.fullname || user?.firstname || '',
                senderMobile: user?.mobileNo || '',
                senderBankCode: '',
                senderBankName: '',
                beneficiaryAccount: selectedAccount?.accountNo || '',
                beneficiaryName: selectedAccount?.accountName || '',
                beneficiaryMobile: '',
                beneficiaryEntityCode: selectedAccount?.finEntityCode || '',
                beneficiaryAccountType: '',
                beneficiaryCcy: 'NGN',
                serviceProvider: '',
                entityCode: user?.entityCode || 'FTD',
                slipNo: '',
                geolocation: '0,0',
                amount: parseFloat(amount),
                charge: 0,
                beneficiaryAmount: parseFloat(amount),
                currencyCode: 'NGN',
                tranDate: '',
                narration: `Transfer to ${selectedAccount?.accountName}`,
                paymentMethod: 'WALLET',
                channelType: 'WEB',
                network: ''
            };

            return axiosInstance.post('/transfer/fundTransfer', payload, {
                headers: {
                    'x-enc-pwd': transactionPin
                }
            });
        },
        onSuccess: (response) => {
            if (response?.data?.code === '000') {
                toast.success('Transfer successful!');
                setAmount('');
                setSelectedAccountNo('');
                setPin('');
                setShowPinModal(false);
                router.push('/admin/dashboard');
            } else {
                toast.error(response?.data?.description || 'Transfer failed');
                setPin('');
            }
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.description || 'Transfer failed');
            setPin('');
        }
    });

    const handlePinSubmit = () => {
        if (pin.length !== 4) {
            toast.error('Please enter a valid 4-digit PIN');
            return;
        }
        sendMoney(pin);
    };

    const handleNavigateToSettings = () => {
        setShowSetupPinModal(false);
        router.push('/settings');
    };

    if (isLoadingBalance || isLoadingAccounts) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-medium-gray">Loading...</p>
                </div>
            </div>
        );
    }

    if (!accounts.length) {
        return (
            <div className="min-h-screen">
                <div className="max-w-5xl">
                    <div className="mb-4">
                        <Button variant="link" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Button>
                    </div>
                    <div className='container mx-auto px-20 py-6'>
                        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-2xl">
                            <p className="text-2xl font-medium text-dark-gray">No Bank Accounts</p>
                            <p className="text-sm text-medium-gray">You need to add a bank account before sending money.</p>
                            <Button onClick={() => router.push('/admin/bank-accounts')}>
                                Add Bank Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
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
                                Send Money
                            </h1>
                            <p className="text-xs lg:text-sm font-normal text-medium-gray">
                                Transfer funds to a saved bank account
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className='bg-white px-6 py-4 rounded-2xl'>
                                <FormSection title="Wallet Balance" subtitle="Your available balance for transfers.">
                                    <FormField label="Available Balance">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-lg font-bold text-dark-gray">
                                                {formatPrice(walletBalance, 'NGN' as CurrencyCode)}
                                            </p>
                                        </div>
                                    </FormField>
                                </FormSection>

                                <FormSection title="Transfer Details" subtitle="Enter the amount and select beneficiary.">
                                    <FormField label="Amount" required>
                                        <Input
                                            id="amount"
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Enter amount to send"
                                            min={0}
                                            max={walletBalance}
                                        />
                                        {amount && parseFloat(amount) > walletBalance && (
                                            <p className="text-xs text-red-500 mt-1">Insufficient balance</p>
                                        )}
                                    </FormField>

                                    {!preselectedAccount && (
                                        <FormField label="Beneficiary Account" required>
                                            <Select
                                                value={selectedAccountNo}
                                                onValueChange={setSelectedAccountNo}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select account" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {accounts.map((account) => (
                                                        <SelectItem key={account.id} value={account.accountNo}>
                                                            {account.accountName} - {account.accountNo}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                    )}
                                </FormSection>

                                {selectedAccount && (
                                    <FormSection title="Beneficiary Details" subtitle="Recipient account information.">
                                        <FormField label="Account Name">
                                            <Input value={selectedAccount.accountName} disabled className="bg-gray-50" />
                                        </FormField>
                                        <FormField label="Account Number">
                                            <Input value={selectedAccount.accountNo} disabled className="bg-gray-50" />
                                        </FormField>
                                        <FormField label="Bank Name">
                                            <Input value={selectedAccount.finEntityName} disabled className="bg-gray-50" />
                                        </FormField>
                                    </FormSection>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button variant="outline" onClick={() => router.back()}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSendMoney}
                                    disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > walletBalance || (!preselectedAccount && !selectedAccountNo)}
                                >
                                    Send Money
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
                <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogTitle className="sr-only">Enter Transaction PIN</DialogTitle>

                    <div className="px-6 pt-5 pb-2">
                        <h2 className="text-base font-bold text-dark-gray text-center">Enter Transaction PIN</h2>
                        <p className="text-xs text-medium-gray mt-0.5 text-center">
                            Please enter your 4-digit transaction PIN to complete the transfer
                        </p>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex justify-center py-2">
                            <PinInput
                                length={4}
                                value={pin}
                                onChange={setPin}
                                type="password"
                                className="gap-2"
                                inputClassName="w-12 h-12 text-lg font-semibold"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3 justify-end pt-1">
                            <Button
                                variant="outline"
                                onClick={() => { setShowPinModal(false); setPin(''); }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePinSubmit}
                                disabled={pin.length !== 4 || isSending}
                            >
                                {isSending ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                                ) : (
                                    'Confirm Transfer'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showSetupPinModal} onOpenChange={setShowSetupPinModal}>
                <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogTitle className="sr-only">Transaction PIN Required</DialogTitle>

                    <div className="px-6 pt-5 pb-2">
                        <h2 className="text-base font-bold text-dark-gray flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Transaction PIN Required
                        </h2>
                        <p className="text-xs text-medium-gray mt-0.5">
                            To ensure the security of your funds, please set up a transaction PIN before making transfers.
                        </p>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="bg-white rounded-2xl p-4">
                            <p className="text-sm text-medium-gray">
                                You can set up your PIN on the mobile app or through your account settings.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end pt-1">
                            <Button
                                variant="outline"
                                onClick={() => setShowSetupPinModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleNavigateToSettings}
                            >
                                Go to Settings
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};