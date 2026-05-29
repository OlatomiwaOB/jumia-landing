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
    DialogDescription,
} from '@/components/ui/dialog';
import { ArrowLeft, Loader2, Settings } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';
import { toast } from 'sonner';
import { PinInput } from '@/components/ui/pin-input';
import { useRouter } from 'next/navigation';
import { formatPrice, CurrencyCode } from '@/utils/helperfns';
import Link from 'next/link';
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

interface SendMoneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedAccount?: BankAccount | null;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
    isOpen,
    onClose,
    preselectedAccount = null,
}) => {
    const { user } = useUser();
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [selectedAccountNo, setSelectedAccountNo] = useState(preselectedAccount?.accountNo || '');
    const [showPinModal, setShowPinModal] = useState(false);
    const [showSetupPinModal, setShowSetupPinModal] = useState(false);
    const [pin, setPin] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const { data: accountsData, isLoading: isLoadingAccounts } = useQuery({
        queryKey: ['bank-accounts'],
        queryFn: () => axiosInstance.request({
            url: '/bank/fetch-accounts',
            method: 'GET'
        }),
        enabled: isOpen && !preselectedAccount,
    });

    const { data: balanceData } = useQuery({
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
        enabled: isOpen,
    });

    const accounts: BankAccount[] = accountsData?.data?.bankAccountData || [];
    const wallet = balanceData?.data?.wallets?.[0];
    const walletBalance = wallet?.balance || 0;

    const selectedAccount = preselectedAccount || accounts.find(a => a.accountNo === selectedAccountNo);

    const handleOpenSendMoney = () => {
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
                onClose();
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
        onClose();
        router.push('/settings');
    };

    const handleClose = () => {
        setAmount('');
        setSelectedAccountNo('');
        setPin('');
        setShowPinModal(false);
        onClose();
    };

    return (
        <>
            <Dialog open={isOpen && !showPinModal && !showSetupPinModal} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogTitle className="sr-only">Send Money</DialogTitle>

                    <div className="px-6 pt-5 pb-2">
                        <h2 className="text-base font-bold text-dark-gray">Send Money</h2>
                        <p className="text-xs text-medium-gray mt-0.5">
                            Transfer funds to a saved bank account
                        </p>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="bg-white rounded-2xl p-4 space-y-4">

                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-medium-gray">Available Balance</span>
                                    <span className="text-sm font-bold text-dark-gray">
                                        {formatPrice(walletBalance, 'NGN' as CurrencyCode)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-xs font-medium text-dark-gray">
                                    Amount <span className="text-red-500">*</span>
                                </Label>
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
                                    <p className="text-xs text-red-500">Insufficient balance</p>
                                )}
                            </div>

                            {!accounts.length && (
                                <div className='text-xs text-dark-gray bg-faded-accent/5 p-2 rounded-lg'>
                                    You need to add a bank account before sending money. Please go to {""}
                                    <Link href="/admin/bank-accounts" className="text-faded-accent underline">
                                        Bank Accounts
                                    </Link> {""}
                                    to add a beneficiary account.
                                </div>
                            )}

                            {!preselectedAccount && (
                                <div className="space-y-2">
                                    <Label htmlFor="beneficiary" className="text-xs font-medium text-dark-gray">
                                        Beneficiary Account <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={selectedAccountNo}
                                        onValueChange={setSelectedAccountNo}
                                        disabled={isLoadingAccounts}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={isLoadingAccounts ? "Loading accounts..." : "Select account"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((account) => (
                                                <SelectItem key={account.id} value={account.accountNo}>
                                                    {account.accountName} - {account.accountNo}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {preselectedAccount && (
                                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                                    <p className="text-xs text-medium-gray">Beneficiary Account</p>
                                    <p className="text-sm font-semibold text-dark-gray">{preselectedAccount.accountName}</p>
                                    <p className="text-xs text-medium-gray">{preselectedAccount.accountNo}</p>
                                    <p className="text-xs text-medium-gray">{preselectedAccount.finEntityName}</p>
                                </div>
                            )}

                            {!preselectedAccount && selectedAccount && (
                                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                                    <p className="text-xs text-medium-gray">Selected Account</p>
                                    <p className="text-sm font-semibold text-dark-gray">{selectedAccount.accountName}</p>
                                    <p className="text-xs text-medium-gray">{selectedAccount.accountNo}</p>
                                    <p className="text-xs text-medium-gray">{selectedAccount.finEntityName}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end pt-1">
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleOpenSendMoney}
                                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > walletBalance || (!preselectedAccount && !selectedAccountNo)}
                            >
                                Send Money
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
                <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogTitle className="sr-only">Enter Transaction PIN</DialogTitle>

                    <div className="px-6 pt-5 pb-2">
                        <h2 className="text-base font-bold text-dark-gray">Enter Transaction PIN</h2>
                        <p className="text-xs text-medium-gray mt-0.5">
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
                        <h2 className="text-base font-bold text-dark-gray text-center flex gap-2">
                            Transaction PIN Required
                        </h2>
                        <p className="text-xs text-medium-gray mt-0.5 max-w-xs">
                            To ensure the security of your funds, please set up a transaction PIN before making transfers.
                        </p>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="bg-white rounded-2xl p-4">
                            <p className="text-sm text-medium-gray text-center">
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