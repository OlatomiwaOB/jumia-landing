'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Users,
  Headphones,
  CreditCard,
  PiggyBank,
  Wallet,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  Target,
  ShoppingCart,
  Banknote,
  BadgeDollarSign,
  Eye,
  EyeOff,
  Warehouse,
  Copy
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { copyToClipboard, CurrencyCode, formatPrice, getCurrentDate } from '@/utils/helperfns';
import useUser from '@/store/userStore';
import ng from '@/components/images/United Kingdom 4.png';
import uk from '@/components/images/United Kingdom 6.png';
import us from '@/components/images/us.png';
import gh from '@/components/images/gh.png';
import swap from '@/components/images/swap.png';
import send from '@/components/images/send.png';
import recieve from '@/components/images/recieve.png';
import paybills from '@/components/images/pay.png';
import Image from 'next/image';
import { color } from 'framer-motion';
import { Button } from '@/components/ui/button';
import dollarSign from '@/assets/dollar-sign-icons-gold-circle-2184236.webp'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const currencyWallets = [
  {
    currency: 'United Kingdom Pound',
    amount: '£103,101.86',
    flag: uk,
    isActive: true,
    currencyCode: 'GBP',
  },
  {
    currency: 'United States Dollar',
    amount: '$103,101.86',
    flag: us,
    currencyCode: 'USD',
    isActive: false,
  },
  {
    currency: 'Nigerian naira',
    amount: '₦103,101.86',
    flag: ng,
    isActive: false,
    currencyCode: 'NGN',
  },
  {
    currency: 'Ghanaian cedi',
    amount: '₵103,101.86',
    flag: gh,
    currencyCode: 'GHC',
    isActive: false,
  }
];

const cryptoWallets = [
  {
    currency: 'Bitcoin',
    amount: '0.5234',
    icon: '₿',
    currencyCode: 'BTC',
    isActive: true,
    change: '+2.5%',
    changePositive: true,
  },
  {
    currency: 'Ethereum',
    amount: '4.321',
    icon: 'Ξ',
    currencyCode: 'ETH',
    isActive: false,
    change: '-1.2%',
    changePositive: false,
  },
  {
    currency: 'USD Coin',
    amount: '12,345.67',
    icon: '💲',
    currencyCode: 'USDC',
    isActive: false,
    change: '+0.1%',
    changePositive: true,
  },
  {
    currency: 'Litecoin',
    amount: '15.789',
    icon: 'Ł',
    currencyCode: 'LTC',
    isActive: false,
    change: '+5.3%',
    changePositive: true,
  }
];

const quickMenuData = [
  {
    title: 'Send Money',
    icon: send,
  },
  {
    title: 'Recieve Money',
    icon: recieve,
  },
  {
    title: 'Swap Money',
    icon: swap,
  },
  {
    title: 'Pay Bills',
    icon: paybills,
  }
];

interface CurrenciesCardProps {
  currency: string;
  amount: string;
  label: string;
  flag: any;
  currencyCode: string;
  virtualAccountNo: string;
  isActive?: boolean;
  className?: string;
  forceHideAmount?: boolean;
  isLowBalance?: boolean;
  accountName?: string;
}

const CurrenciesCard: React.FC<CurrenciesCardProps> = ({
  currency,
  amount,
  label,
  flag,
  currencyCode,
  virtualAccountNo,
  isActive = false,
  className,
  forceHideAmount = false,
  isLowBalance = false,
  accountName = ''
}) => {
  const [showAmount, setShowAmount] = React.useState(true);
  const [showTopUpModal, setShowTopUpModal] = React.useState(false);

  const toggleAmountVisibility = () => {
    setShowAmount(!showAmount);
  };

  const handleOpenTopUpModal = () => {
    setShowTopUpModal(true);
  };

  const handleCloseTopUpModal = () => {
    setShowTopUpModal(false);
  };

  const displayAmount = forceHideAmount ? false : showAmount;

  return (
    <>
      <Card
        className={cn(
          'relative overflow-hidden border border-border rounded-xl transition-all duration-300 cursor-pointer group',
          'hover:shadow-lg hover:-translate-y-1',
          isActive
            ? 'bg-accent text-white'
            : 'bg-white text-foreground',
          isLowBalance ? 'border-red-300 bg-red-50 text-red-600' : '',
          className
        )}
      >
        {isActive && (
          <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden">
            <div className="rounded-xl absolute top-4 -right-22 rotate-40 w-44 h-25 bg-white/20  transform origin-center"></div>
            <div className="rounded-xl absolute top-8 -right-24 rotate-40 w-44 h-30 bg-white/20  transform origin-center"></div>
          </div>
        )}

        {!isActive && (
          <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden">
            <div className="rounded-xl absolute top-4 -right-22 rotate-40 w-44 h-25 bg-accent/30  transform origin-center"></div>
            <div className="rounded-xl absolute top-8 -right-24 rotate-40 w-44 h-30 bg-accent/30  transform origin-center"></div>
          </div>
        )}

        <CardContent className="p-5 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center mr-3 overflow-hidden">
                <Image
                  src={flag || dollarSign}
                  alt={`${currency} flag`}
                  width={32}
                  height={32}
                  className="w-10 h-10 object-cover"
                />
              </div>
              <span className={cn("text-sm font-medium", isLowBalance ? "text-red-600" : "")}>{label}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenTopUpModal}
              className={cn(
                "text-xs py-1 h-7",
                isActive
                  ? "bg-white text-accent hover:bg-white/90"
                  : "bg-accent text-white hover:bg-accent/90",
                isLowBalance ? "bg-red-600 text-white hover:bg-red-700" : ""
              )}
            >
              <Wallet className="w-3 h-3 mr-1" />
              Fund Wallet
            </Button>
          </div>

          <div className="flex items-center gap-7 mb-2">
            <span className={cn(
              "text-xs",
              isActive ? "text-white" : "text-muted-foreground",
              isLowBalance ? "text-white bg-red-600 rounded-md p-1 border border-red-600" : ""
            )}>
              Available Balance
            </span>
            <button
              onClick={toggleAmountVisibility}
              className={cn(
                "transition-colors",
                isActive
                  ? "text-[#ffffff] hover:text-muted"
                  : "text-muted-foreground hover:text-foreground",
                isLowBalance ? "text-red-600 hover:text-red-800" : ""
              )}
              disabled={forceHideAmount}
            >
              {displayAmount ? <EyeOff size={16} className='font-bold' /> : <Eye size={16} className='font-bold' />}
            </button>
          </div>

          <div className="mb-4">
            <p className={cn(
              "text-xl font-bold",
              isLowBalance ? "text-red-600" : ""
            )}>
              {displayAmount ? formatPrice(parseFloat(amount) || 0, currencyCode as CurrencyCode) : '••••••••'}
            </p>
            {isLowBalance && displayAmount && (
              <p className="text-xs text-red-600 mt-1">Balance low, please top up</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs">
              <span className={cn(
                "text-xs",
                isActive ? "text-[#ffffff]" : "text-muted-foreground",
                isLowBalance ? "text-red-600" : ""
              )}>
                <b>Account No:</b> {virtualAccountNo} <br />
                <b>Bank:</b> Rex MFB
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(virtualAccountNo)}
              className="h-6 w-6 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className='flex flex-col'>
            <DialogTitle className="flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              Top Up Store Wallet via Bank Transfer
            </DialogTitle>
            <DialogDescription>
              Transfer funds to this account to top up your store wallet
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input
                id="bank-name"
                value="Rex Microfinance MFB"
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="account-number">Account Number</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(virtualAccountNo)}
                  className="h-6 text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="account-number"
                  value={virtualAccountNo}
                  readOnly
                  className="bg-gray-50 flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-name">Account Name</Label>
              <Input
                id="account-name"
                value={accountName || "Store Wallet"}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency-info">Currency</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <Image
                    src={flag || dollarSign}
                    alt={currency}
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-medium">{currencyCode} - {label}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col items-start">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Transfer to this account to top up your store wallet</p>
              <p>• Funds will be credited automatically once received</p>
              <p>• Current balance: {amount}</p>
              {isLowBalance && (
                <p className="text-red-600 font-medium">
                  ⚠️ Low balance detected. Please top up to continue operations.
                </p>
              )}
            </div>
            <div className="flex gap-2 mt-4 w-full">
              <Button
                variant="outline"
                onClick={handleCloseTopUpModal}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  copyToClipboard(virtualAccountNo);
                }}
                className="flex-1 bg-accent hover:bg-accent-foreground"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Account Number
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface CryptoCardProps {
  currency: string;
  amount: string;
  icon: string;
  currencyCode: string;
  isActive?: boolean;
  change?: string;
  changePositive?: boolean;
  className?: string;
  forceHideAmount?: boolean;
  publicAddress?: string;
  isLowBalance?: boolean;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  currency,
  amount,
  icon,
  currencyCode,
  isActive = false,
  change,
  changePositive,
  publicAddress,
  className,
  forceHideAmount = false,
  isLowBalance = false
}) => {
  const [showAmount, setShowAmount] = React.useState(true);
  const [showTopUpModal, setShowTopUpModal] = React.useState(false);

  const toggleAmountVisibility = () => {
    setShowAmount(!showAmount);
  };

  const handleOpenTopUpModal = () => {
    setShowTopUpModal(true);
  };

  const handleCloseTopUpModal = () => {
    setShowTopUpModal(false);
  };

  const displayAmount = forceHideAmount ? false : showAmount;

  return (
    <>
      <Card
        className={cn(
          'relative overflow-hidden border border-border rounded-xl transition-all duration-300 cursor-pointer group',
          'hover:shadow-lg hover:-translate-y-1',
          isActive
            ? 'bg-accent text-white'
            : 'bg-white text-foreground',
          isLowBalance ? 'border-red-300 bg-red-50' : '',
          className
        )}
      >
        {isActive && (
          <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden">
            <div className="rounded-xl absolute top-4 -right-22 rotate-40 w-44 h-25 bg-white/20  transform origin-center"></div>
            <div className="rounded-xl absolute top-8 -right-24 rotate-40 w-44 h-30 bg-white/10  transform origin-center"></div>
          </div>
        )}

        {!isActive && (
          <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden">
            <div className="rounded-xl absolute top-4 -right-22 rotate-40 w-44 h-25 bg-accent/30  transform origin-center"></div>
            <div className="rounded-xl absolute top-8 -right-24 rotate-40 w-44 h-30 bg-accent/30  transform origin-center"></div>
          </div>
        )}

        <CardContent className="p-5 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center mr-3 overflow-hidden">
                <Image
                  src={icon || dollarSign}
                  alt={`${currency} icon`}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-cover"
                />
              </div>
              <span className="text-sm font-medium">{currency}</span>
            </div>
            <div className="flex items-center gap-1">
              {isLowBalance && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenTopUpModal}
                  className="text-xs py-1 h-7 bg-accent text-white hover:bg-accent/90 mr-1"
                >
                  <Wallet className="w-3 h-3 mr-1" />
                  Fund
                </Button>
              )}
              <Button variant={'ghost'} onClick={() => copyToClipboard(publicAddress!)}>
                <Copy className='w-5 h-5 text-white' />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-7 mb-2">
            <span className={cn(
              "text-xs",
              isActive ? "text-white" : "text-muted-foreground",
              isLowBalance ? "text-white bg-red-600 rounded-md p-1 border border-red-600" : ""
            )}>
              Holdings
            </span>
            <button
              onClick={toggleAmountVisibility}
              className={cn(
                "transition-colors",
                isActive
                  ? "text-white hover:text-muted"
                  : "text-muted-foreground hover:text-foreground",
                isLowBalance ? "text-red-600 hover:text-red-800" : ""
              )}
              disabled={forceHideAmount}
            >
              {displayAmount ? <EyeOff size={16} className='font-bold' /> : <Eye size={16} className='font-bold' />}
            </button>
          </div>

          <div className="mb-2">
            <p className={cn(
              "text-xl font-bold",
              isLowBalance ? "text-red-600" : ""
            )}>
              {displayAmount ? formatPrice(parseFloat(amount) || 0, currencyCode as CurrencyCode) : '••••••••'}
            </p>
            {isLowBalance && displayAmount && (
              <p className="text-xs text-red-600 mt-1">Balance low, please top up</p>
            )}
          </div>

          <div>
            <Badge variant="secondary" className="text-xs">
              <span className={cn(
                "text-xs",
                isActive ? "text-black" : "text-muted-foreground",
                isLowBalance ? "text-red-600" : ""
              )}>
                {currencyCode}
              </span>
            </Badge>
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

const useBalanceVisibility = () => {
  const [hideAllBalances, setHideAllBalances] = useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem('admin-wallet-balance-visibility');
    if (storedValue) {
      setHideAllBalances(JSON.parse(storedValue));
    }
  }, []);

  const toggleAllBalances = () => {
    const newValue = !hideAllBalances;
    setHideAllBalances(newValue);
    localStorage.setItem('admin-wallet-balance-visibility', JSON.stringify(newValue));
  };

  return { hideAllBalances, toggleAllBalances };
};

export const WalletOverview = () => {
  const { hideAllBalances, toggleAllBalances } = useBalanceVisibility();
  const [activeTab, setActiveTab] = useState<'fiat' | 'crypto'>('fiat');
  const { user } = useUser()

  const isFTD = process.env.NEXT_PUBLIC_ENTITYCODE === 'FTD';

  const getCurrentDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => axiosInstance.request({
      method: 'GET',
      url: '/store-dashboard/summary',
      params: {
        startDate: '01-01-2025',
        endDate: getCurrentDate(),
        datePeriod: "",
        storeCode: user?.storeCode || '',
        username: user?.username,
        entityCode: user?.entityCode
      }
    })
  })

  const { data: balances, isLoading: balancesLoading, error: balancesError } = useQuery({
    queryKey: ['wallet-balances'],
    queryFn: () => axiosInstance.request({
      method: 'GET',
      url: '/coinwallet/balance',
      params: {
        username: user?.username,
        entityCode: user?.entityCode,
        storeCode: user?.storeCode || '',
      }
    })
  })

  const { data: storeBalance } = useQuery({
    queryKey: ['recen-trans'],
    queryFn: () => axiosInstance.request({
      url: '/store-dashboard/balance',
      method: 'GET',
      params: {
        storeCode: user?.storeCode,
        entityCode: user?.entityCode || ''
      }
    })
  })

  const processFiatBalances = () => {
    if (!storeBalance?.data?.wallets || storeBalance.data.wallets.length === 0) {
      return [{
        id: 0,
        accountNo: 'Unavailable',
        accountType: 'WALLET',
        entityCode: null,
        symbol: 'Nigerian Naira',
        chain: 'BANK',
        username: null,
        publicAddress: 'DEFAULT_NGN',
        name: 'Default NGN Wallet',
        label: 'NGN Wallet',
        balance: '0.00',
        usdBalance: 0,
        lcyBalance: 0,
        lcyCcy: 'NGN',
        logo: 'https://flagcdn.com/w320/ng.png',
        status: null,
        primaryWallet: true,
        isLowBalance: true,
        accountName: user?.fullname || 'Store Account'
      }];
    }

    return storeBalance.data.wallets.map((wallet: any) => ({
      ...wallet,
      balance: parseFloat(wallet.balance).toFixed(2),
      isActive: wallet.primaryWallet === true,
      isLowBalance: parseFloat(wallet.balance) <= 1000,
      accountName: user?.fullname || wallet.name || 'Store Account'
    }));
  };

  const processCryptoBalances = () => {
    if (!storeBalance?.data?.coins || storeBalance.data.coins.length === 0) {
      return [{
        id: 0,
        accountNo: 'DEFAULT_USDT',
        accountType: 'COIN',
        entityCode: null,
        symbol: 'USDT',
        chain: 'TRON',
        username: null,
        publicAddress: 'DEFAULT_USDT_ADDRESS',
        name: 'Default USDT Wallet',
        label: 'USDT',
        balance: '0.00',
        usdBalance: 0,
        lcyBalance: 0,
        lcyCcy: 'NGN',
        logo: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661',
        status: 'Active',
        primaryWallet: true,
        isLowBalance: true
      }];
    }

    return storeBalance.data.coins.map((coin: any) => ({
      ...coin,
      balance: parseFloat(coin.balance).toFixed(2),
      isActive: coin.primaryWallet === true,
      isLowBalance: parseFloat(coin.balance) <= 10
    }));
  };

  const fiatBalances = processFiatBalances();
  const coinBalances = processCryptoBalances();

  const BalancesLoadingCards = () => (
    <div className="grid md:grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="animate-pulse h-[60px] bg-gray-200 rounded-md mb-2"></div>
      ))}
    </div>
  );

  const getTierColor = (tierCode: string): string => {
    switch (tierCode?.toUpperCase()) {
      case 'BASIC':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'STANDARD':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PREMIUM':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type?.toUpperCase()) {
      case 'YEARLY':
        return 'bg-yellow-100 text-yellow-800';
      case 'WEEKLY':
        return 'bg-orange-100 text-orange-800';
      case 'MONTHLY':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-background p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h3 className="text-base lg:text-lg font-semibold">Wallet Overview</h3>
          <div className="flex items-center gap-2">
            <div className='border-2 border-accent rounded-xl bg-accent/10 flex items-center gap-2 px-3 py-1.5'>
              <span className="text-sm text-foreground text-black font-semibold mr-2">
                {hideAllBalances ? 'Show' : 'Hide'}
              </span>

              <button
                onClick={toggleAllBalances}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                  hideAllBalances ? "bg-accent" : "bg-gray-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    hideAllBalances ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex mb-4 lg:mb-6 gap-7">
          <button
            className={`py-2 px-1 font-medium text-sm relative ${activeTab === 'fiat'
              ? 'text-accent'
              : 'text-muted-foreground hover:text-foreground'
              }`}
            onClick={() => setActiveTab('fiat')}
          >
            Fiat Currencies
            {activeTab === 'fiat' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></span>
            )}
          </button>
          <button
            className={`py-2 px-1 font-medium text-sm relative ${activeTab === 'crypto'
              ? 'text-accent'
              : 'text-muted-foreground hover:text-foreground'
              }`}
            onClick={() => setActiveTab('crypto')}
          >
            Crypto Currencies
            {activeTab === 'crypto' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></span>
            )}
          </button>
          {user?.userRole === 'BUSINESS_MANAGER' && (
            <div className='flex gap-2 items-center'>
              <Badge className={getTierColor(user?.subscriptionTierCode || '')}>
                {user?.subscriptionTierCode ? `${user.subscriptionTierCode}` : 'No active subscription'}
              </Badge>
              <Badge className={getTypeColor(user?.subscriptionType || '')}>
                {user?.subscriptionType ? `${user.subscriptionType}` : ''}
              </Badge>
            </div>
          )}
        </div>

        {activeTab === 'fiat' && (
          <>
            {balancesLoading && <BalancesLoadingCards />}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
              {fiatBalances.map((wallet: any, index: number) => (
                <CurrenciesCard
                  key={index}
                  currency={wallet.symbol}
                  virtualAccountNo={wallet.virtualAccountNo || wallet.accountNo || wallet.symbol}
                  amount={wallet.balance}
                  flag={wallet.logo}
                  label={wallet.label}
                  currencyCode={wallet.symbol}
                  isActive={wallet.isActive}
                  forceHideAmount={hideAllBalances}
                  isLowBalance={wallet.isLowBalance}
                  accountName={wallet.accountName}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'crypto' && (
          <>
            {isFTD ? (
              <div className="flex justify-center items-center py-12">
                <Card className="max-w-md w-full text-center">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-semibold mb-2">Feature Coming Soon</h3>
                      <p className="text-muted-foreground">
                        This feature is coming soon. We're working hard to bring you a seamless way to transact with crypto securely.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {balancesLoading && <BalancesLoadingCards />}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                  {coinBalances.map((wallet: any, index: number) => (
                    <CryptoCard
                      key={index}
                      currency={wallet.symbol}
                      amount={wallet.balance}
                      icon={wallet.logo}
                      currencyCode={wallet.symbol}
                      isActive={wallet.isActive}
                      publicAddress={wallet?.publicAddress}
                      forceHideAmount={hideAllBalances}
                      isLowBalance={wallet.isLowBalance}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="bg-background p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6">Quick Menus</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {quickMenuData.map((item, index) => (
            <div key={index} className='bg-background border rounded-lg p-3 flex justify-center items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer'>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 lg:gap-3 min-w-0">
                  <div className={`rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Image src={item.icon} alt={item.title} className="w-4 h-4 lg:w-5 lg:h-5 object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs lg:text-sm text-muted-foreground truncate">{item.title}</p>
                  </div>
                </div>
                <div className='text-xs lg:text-sm text-muted-foreground truncate'>(Coming soon)</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6">Store Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {data?.data?.figures?.map((item: {
            title: string;
            subTitle?: string;
            amount: string | number;
            volume?: string | number;
          }, index: number) => {
            let IconComponent, color, subtitle;

            switch (item.title) {
              case "Completed & Paid Orders":
                IconComponent = BadgeDollarSign;
                color = "bg-green-500";
                subtitle = "Successful transactions";
                break;
              case "Pending Orders":
                IconComponent = Activity;
                color = "bg-amber-500";
                subtitle = "Awaiting completion";
                break;
              case "Total Stock Inventory":
                IconComponent = Warehouse;
                color = "bg-blue-500";
                subtitle = "Products in stock";
                break;
              case "Item Count":
                IconComponent = ShoppingCart;
                color = "bg-purple-500";
                subtitle = "Total items sold";
                break;
              case "Cancelled Orders":
                IconComponent = TrendingDown;
                color = "bg-red-500";
                subtitle = "Cancelled transactions";
                break;
              default:
                IconComponent = BarChart3;
                color = "bg-gray-500";
                subtitle = "Performance metric";
            }

            return (
              <Card key={index} className="border-border shadow-sm hover:shadow-md transition-shadow duration-300 group">
                <CardContent className="p-4 lg:p-6 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                    <div className="absolute rounded-2xl w-22 h-22 rotate-15 bg-accent/5 transform origin-center"></div>
                    <div className="absolute rounded-2xl w-28 h-28 rotate-50 bg-accent/5 transform origin-center"></div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className="text-xs bg-muted/50 group-hover:bg-muted transition-colors"
                      >
                        {item.volume} vol.
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-2">
                    <p className="text-xs lg:text-sm text-muted-foreground truncate">
                      {item.subTitle || subtitle}
                    </p>
                    <p className="text-lg lg:text-2xl font-bold text-foreground truncate">
                      ₦{parseFloat(item.amount as string || '0').toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium truncate">
                      {item.title === "Item Count" ? "Sale Count" : item.title}
                    </p>
                    <div className={`p-1 rounded-full ${color.replace('300', '300')}`}>
                      <TrendingUp className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};