// 'use client'
// import React, { useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//   Eye,
//   EyeOff,
//   Plus
// } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import { copyToClipboard, CurrencyCode, formatPrice } from '@/utils/helperfns';
// import Image from 'next/image';
// import useUser from '@/store/userStore';
// import { Button } from '@/components/ui/button';
// import dollarSign from '@/assets/dollar-sign-icons-gold-circle-2184236.webp'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import axiosInstance from '@/utils/fetch-function';
// import { CopyIcon, SendMoneyIcon, SwapMoneyIcon, RecieveMoneyIcon, PayBillsIcon } from '@/components/icons/icons';
// // import HeroSlider from './hero-slider';
// import { cn } from '@/lib/utils';
// import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// const quickMenuData = [
//   {
//     title: 'Send Money',
//     icon: SendMoneyIcon,
//   },
//   {
//     title: 'Recieve Money',
//     icon: RecieveMoneyIcon,
//   },
//   {
//     title: 'Swap Money',
//     icon: SwapMoneyIcon,
//   },
//   {
//     title: 'Pay Bills',
//     icon: PayBillsIcon,
//   }
// ];

// interface CurrenciesCardProps {
//   currency: string;
//   amount: number;
//   flag: any;
//   label: string;
//   currencyCode: string;
//   virtualAccountNo: string;
//   walletId: string;
//   accountName?: string;
//   className?: string;
// }

// const CurrenciesCard: React.FC<CurrenciesCardProps> = ({
//   currency,
//   amount,
//   flag,
//   label,
//   currencyCode,
//   virtualAccountNo,
//   walletId,
//   accountName = '',
//   className
// }) => {
//   const [showAmount, setShowAmount] = React.useState(true);
//   const [showTopUpModal, setShowTopUpModal] = React.useState(false);
//   const { user } = useUser()

//   const toggleAmountVisibility = () => {
//     setShowAmount(!showAmount);
//   };

//   const handleOpenTopUpModal = () => {
//     setShowTopUpModal(true);
//   };

//   const handleCloseTopUpModal = () => {
//     setShowTopUpModal(false);
//   };

//   const handleCopyAccountNumber = () => {
//     copyToClipboard(virtualAccountNo);
//   };

//   return (
//     <>
//       <Card
//         className={cn(
//           'relative overflow-hidden border border-border rounded-2xl transition-all duration-300 cursor-pointer group w-full',
//           'hover:shadow-lg hover:-translate-y-1',
//           'bg-cover bg-center bg-no-repeat',
//           className
//         )}
//         style={{
//           backgroundImage: 'url("/images/wallet-bg.png")',
//           backgroundColor: '#F56B08'
//         }}
//       >
//         <CardContent className="px-3 py-2 relative z-10">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center">
//               <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center mr-3 overflow-hidden bg-white">
//                 <Image
//                   src={flag || dollarSign}
//                   alt={`${currency} flag`}
//                   width={32}
//                   height={32}
//                   className="w-6 h-4 object-cover"
//                 />
//               </div>
//               <div className="flex gap-1 items-center justify-center text-xs text-sidebar-text">
//                 <span>{label}</span>
//                 <span>•</span>
//                 <span>Available Balance</span>
//               </div>
//             </div>

//             <button
//               onClick={toggleAmountVisibility}
//               className="transition-colors text-white/80 hover:text-white p-1.5 cursor-pointer rounded-full bg-[#F6712D]"
//             >
//               {showAmount ? <Eye size={16} className='font-bold' /> : <EyeOff size={16} className='font-bold' />}
//             </button>
//           </div>

//           <div className="">
//             <p className="text-xl font-bold text-white">
//               {showAmount ? formatPrice(amount || 0, currencyCode as CurrencyCode) : '••••••••'}
//             </p>
//           </div>

//           <div className='flex justify-between'>
//             <div className="flex items-center mt-2">
//               <div className="text-xs font-light text-sidebar-text">
//                 Acct Details:
//               </div>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleCopyAccountNumber}
//                 className="text-white text-xs hover:text-sidebar-text"
//               >
//                 Rex MFB <span className='mb-0.5'>-</span> {virtualAccountNo}
//                 <CopyIcon className="w-3 h-3" />
//               </Button>
//             </div>
//             <div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleOpenTopUpModal}
//                 className="text-xs rounded-lg bg-white text-faded-accent hover:bg-white/90 hover:text-faded-accent"
//               >
//                 <Plus className="w-3 h-3" />
//                 Fund Wallet
//               </Button>
//             </div>
//           </div>

//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
//             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//           </div>
//         </CardContent>
//       </Card>

//       <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader className='flex flex-col'>
//             <DialogTitle className="flex items-center gap-2">
//               Top Up via Bank Transfer
//             </DialogTitle>
//             <DialogDescription>
//               Transfer funds to this account to top up your wallet
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="bank-name">Bank Name</Label>
//               <Input
//                 id="bank-name"
//                 value="Rex Microfinance Bank"
//                 readOnly
//                 className="bg-gray-50"
//               />
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="account-number">Account Number</Label>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Input
//                   id="account-number"
//                   value={virtualAccountNo}
//                   readOnly
//                   className="bg-gray-50 flex-1"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="wallet-id">Wallet ID</Label>
//               <div className="flex items-center gap-2">
//                 <Input
//                   id="wallet-id"
//                   value={walletId}
//                   readOnly
//                   className="bg-gray-50 flex-1"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="account-name">Account Name</Label>
//               <Input
//                 id="account-name"
//                 value={accountName || user?.fullname || ''}
//                 readOnly
//                 className="bg-gray-50"
//               />
//             </div>
//           </div>

//           <DialogFooter className="flex-col sm:flex-col items-start">
//             <div className="text-xs text-muted-foreground space-y-1">
//               <p>• Transfer to this account to top up your wallet</p>
//               <p>• Funds will be credited automatically once received</p>
//             </div>
//             <div className="flex gap-2 mt-4 w-full">
//               <Button
//                 variant="outline"
//                 onClick={handleCloseTopUpModal}
//                 className="flex-1"
//               >
//                 Close
//               </Button>
//               <Button
//                 onClick={() => {
//                   copyToClipboard(virtualAccountNo);
//                   handleCloseTopUpModal();
//                 }}
//                 className="flex-1"
//               >
//                 <CopyIcon className="w-4 h-4 mr-2" />
//                 Copy Account Number
//               </Button>
//             </div>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// interface CryptoCardProps {
//   currency: string;
//   amount: number;
//   icon: string;
//   currencyCode: string;
//   publicAddress?: string;
//   chain?: string;
//   className?: string;
// }

// const CryptoCard: React.FC<CryptoCardProps> = ({
//   currency,
//   amount,
//   icon,
//   currencyCode,
//   chain,
//   publicAddress,
//   className,
// }) => {
//   const [showAmount, setShowAmount] = React.useState(true);

//   const toggleAmountVisibility = () => {
//     setShowAmount(!showAmount);
//   };

//   return (
//     <Card
//       className={cn(
//         'relative overflow-hidden border border-border rounded-2xl transition-all duration-300 cursor-pointer group w-full',
//         'hover:shadow-lg hover:-translate-y-1',
//         'bg-cover bg-center bg-no-repeat',
//         className
//       )}
//       style={{
//         backgroundImage: 'url("/images/wallet-bg.png")',
//         backgroundColor: '#F56B08'
//       }}
//     >
//       <CardContent className="px-3 py-2 relative z-10">
//         <div className="flex items-center justify-between space-y-1">
//           <div className="flex items-center">
//             <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center mr-3 overflow-hidden bg-white">
//               <Image
//                 src={icon || dollarSign}
//                 alt={`${currency} flag`}
//                 width={32}
//                 height={32}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="flex gap-1 items-center lowercase justify-center text-xs text-sidebar-text">
//               <span>{currency}</span>
//               <div>({chain})</div>
//             </div>
//           </div>
//           <button
//             onClick={toggleAmountVisibility}
//             className="transition-colors text-white/80 hover:text-white p-1.5 cursor-pointer rounded-full bg-[#F6712D]"
//           >
//             {showAmount ? <Eye size={16} className='font-bold' /> : <EyeOff size={16} className='font-bold' />}
//           </button>
//         </div>
//         <div className="mb-2">
//           <p className="text-xl font-bold text-white">
//             {showAmount ? formatPrice(amount || 0, currencyCode as CurrencyCode) : '••••••••'}
//           </p>
//         </div>
//         <div className='flex items-center w-full'>
//           <Button variant={'ghost'} onClick={() => copyToClipboard(publicAddress!)} className="text-white hover:text-white/80 flex justify-between w-full">
//             <p className="break-all text-sidebar-text text-xs">{publicAddress?.slice(0, 10)}...{publicAddress?.slice(-8)}</p>
//             <CopyIcon className='w-5 h-5' />
//           </Button>
//         </div>

//         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
//           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export const WalletOverview = () => {
//   const { user } = useUser()
//   const [openId, setOpenId] = useState<string | null>(null);

//   const { data: storeBalance, isLoading: balancesLoading } = useQuery({
//     queryKey: ['wallet-balances'],
//     queryFn: () => axiosInstance.request({
//       method: 'GET',
//       url: '/store-dashboard/balance',
//       params: {
//         username: user?.username,
//         entityCode: user?.entityCode,
//         storeCode: user?.storeCode || '',
//       }
//     })
//   })

//   const { data, isLoading } = useQuery({
//     queryKey: ['dashboard-summary'],
//     queryFn: () => axiosInstance.request({
//       method: 'GET',
//       url: '/store-dashboard/summary',
//       params: {
//         startDate: '01-01-2025',
//         endDate: (() => {
//           const today = new Date();
//           const month = String(today.getMonth() + 1).padStart(2, '0');
//           const day = String(today.getDate()).padStart(2, '0');
//           const year = today.getFullYear();
//           return `${day}-${month}-${year}`;
//         })(),
//         datePeriod: "",
//         storeCode: user?.storeCode || '',
//         username: user?.username,
//         entityCode: user?.entityCode
//       }
//     })
//   })

//   const fiatBalances = storeBalance?.data?.wallets || [];
//   const coinBalances = storeBalance?.data?.coins || [];

//   const BalancesLoadingCards = () => (
//     <div className="w-full">
//       <div className=''>
//         <div className="animate-pulse h-[100px] bg-gray-200 rounded-xl"></div>
//       </div>
//     </div>
//   )

//   return (
//     <div className="flex gap-6 px-2">
//       <div className="w-full lg:w-1/2 space-y-6">
//         <Tabs defaultValue="fiat" className="w-full">
//           <TabsList className="grid grid-cols-2">
//             <TabsTrigger value="fiat">Fiat Currencies</TabsTrigger>
//             <TabsTrigger value="crypto">Crypto Currencies</TabsTrigger>
//           </TabsList>

//           <TabsContent value="fiat" className="mt-4">
//             {balancesLoading ? (
//               <BalancesLoadingCards />
//             ) : (
//               <div className="grid grid-cols-1 gap-4 w-full">
//                 {fiatBalances.map((wallet: any, index: number) => (
//                   <CurrenciesCard
//                     key={index}
//                     currency={wallet.symbol}
//                     amount={wallet.balance}
//                     flag={wallet.logo}
//                     label={wallet.label}
//                     currencyCode={wallet.symbol}
//                     virtualAccountNo={wallet.virtualAccountNo || 'No account available'}
//                     walletId={wallet.accountNo || 'No wallet ID'}
//                     accountName={wallet.name}
//                   />
//                 ))}
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="crypto" className="mt-4">
//             {balancesLoading ? (
//               <BalancesLoadingCards />
//             ) : (
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
//                   {coinBalances.map((wallet: any, index: number) => (
//                     <CryptoCard
//                       key={index}
//                       currency={wallet.symbol}
//                       amount={wallet.balance}
//                       icon={wallet.logo}
//                       currencyCode={wallet.symbol}
//                       publicAddress={wallet.publicAddress}
//                       chain={wallet.chain}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>

//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {quickMenuData.map((item, index) => (
//             <div
//               key={index}
//               className='bg-white rounded-2xl p-4 flex justify-center items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer'
//               onClick={() => setOpenId(item.title)}
//             >
//               <div className="text-center space-y-2">
//                 <div className="flex justify-center">
//                   <item.icon className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium text-medium-gray truncate">{item.title}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="hidden lg:flex w-1/2">
//         {/* <HeroSlider /> */}
//       </div>

//       <AlertDialog open={!!openId} onOpenChange={(open) => { if (!open) setOpenId(null); }}>
//         <AlertDialogContent className="rounded-2xl max-w-sm">
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-base font-semibold text-dark-gray">
//               Coming Soon
//             </AlertDialogTitle>
//             <AlertDialogDescription className="text-sm text-medium-gray font-light">
//               This feature is currently under development and will be available soon. Stay tuned!
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel
//               onClick={() => setOpenId(null)}
//               className="rounded-xl h-11 text-sm font-medium"
//             >
//               Got it
//             </AlertDialogCancel>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };


'use client'
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Eye,
  EyeOff,
  Plus
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { copyToClipboard, CurrencyCode, formatPrice } from '@/utils/helperfns';
import Image from 'next/image';
import useUser from '@/store/userStore';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from '@/utils/fetch-function';
import { CopyIcon, SendMoneyIcon, SwapMoneyIcon, RecieveMoneyIcon, PayBillsIcon } from '@/components/icons/icons';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import HeroSlider from '@/components/Customer/dashboard/hero-slider';
import { BankAccount } from '../bank-accounts/accounts-management';
import { SendMoneyModal } from '../send-money/send-money';

const quickMenuData = [
  {
    title: 'Send Money',
    icon: SendMoneyIcon,
  },
  {
    title: 'Recieve Money',
    icon: RecieveMoneyIcon,
  },
  {
    title: 'Swap Money',
    icon: SwapMoneyIcon,
  },
  {
    title: 'Pay Bills',
    icon: PayBillsIcon,
  }
];

interface CurrenciesCardProps {
  currency: string;
  amount: number;
  flag: any;
  label: string;
  currencyCode: string;
  virtualAccountNo: string;
  accountName?: string;
  className?: string;
  accountNo?: string;
}

const CurrenciesCard: React.FC<CurrenciesCardProps> = ({
  currency,
  amount,
  flag,
  label,
  currencyCode,
  virtualAccountNo,
  accountName = '',
  className,
  accountNo = ''
}) => {
  const [showAmount, setShowAmount] = React.useState(true);
  const [showTopUpModal, setShowTopUpModal] = React.useState(false);
  const { user } = useUser()

  const toggleAmountVisibility = () => {
    setShowAmount(!showAmount);
  };

  const handleOpenTopUpModal = () => {
    setShowTopUpModal(true);
  };

  const handleCloseTopUpModal = () => {
    setShowTopUpModal(false);
  };

  const handleCopyAccountNumber = () => {
    copyToClipboard(virtualAccountNo);
  };

  const handleCopyWalletNumber = () => {
    copyToClipboard(accountNo);
  };

  return (
    <>
      <Card
        className={cn(
          'relative overflow-hidden border border-border rounded-2xl transition-all duration-300 cursor-pointer group w-full',
          'hover:shadow-lg hover:-translate-y-1',
          'bg-cover bg-center bg-no-repeat',
          className
        )}
        style={{
          backgroundImage: 'url("/images/wallet-bg.png")',
          backgroundColor: '#F56B08'
        }}
      >
        <CardContent className="px-3 py-2 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center mr-3 overflow-hidden bg-white">
                <Image
                  src={flag || dollarSign}
                  alt={`${currency} flag`}
                  width={32}
                  height={32}
                  className="w-6 h-4 object-cover"
                />
              </div>
              <div className="flex gap-1 items-center justify-center text-xs text-sidebar-text">
                <span>{label}</span>
                <span>•</span>
                <span>Available Balance</span>
              </div>
            </div>

            <button
              onClick={toggleAmountVisibility}
              className="transition-colors text-white/80 hover:text-white p-1.5 cursor-pointer rounded-full bg-[#F6712D]"
            >
              {showAmount ? <Eye size={16} className='font-bold' /> : <EyeOff size={16} className='font-bold' />}
            </button>
          </div>

          <div className="">
            <p className="text-xl font-bold text-white">
              {showAmount ? formatPrice(amount || 0, currencyCode as CurrencyCode) : '••••••••'}
            </p>
          </div>

          <div className='flex justify-between items-center'>
            <div className='-space-y-4'>
              {/* <div className="flex items-center">
                <div className="text-xs font-light text-sidebar-text">
                  Acct Details:
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyAccountNumber}
                  className="text-white text-xs hover:text-sidebar-text"
                >
                  Rex MFB <span className='mb-0.5'>-</span> {virtualAccountNo}
                  <CopyIcon className="w-3 h-3" />
                </Button>
              </div> */}
              <div className="flex items-center">
                <div className="text-xs font-light text-sidebar-text">
                  My Fortitude ID:
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyWalletNumber}
                  className="text-white text-xs hover:text-sidebar-text"
                >
                  {accountNo}
                  <CopyIcon className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenTopUpModal}
                className="text-xs rounded-lg bg-white text-faded-accent hover:bg-white/90 hover:text-faded-accent"
              >
                <Plus className="w-3 h-3" />
                Fund Wallet
              </Button>
            </div>
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
        <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogTitle className="sr-only">Top Up via Bank Transfer</DialogTitle>

          <div className="px-6 pt-5">
            <h2 className="text-base font-bold text-dark-gray">Top Up via Bank Transfer</h2>
            <p className="text-xs text-medium-gray mt-0.5">
              Transfer funds to this account to top up your wallet
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-white rounded-2xl p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank-name" className="text-xs font-medium text-dark-gray">Bank Name</Label>
                <Input
                  id="bank-name"
                  value="Rex Microfinance Bank"
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-number" className="text-xs font-medium text-dark-gray">Account Number</Label>
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
                <Label htmlFor="wallet-id" className="text-xs font-medium text-dark-gray">My Fortitude ID (Wallet ID)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="wallet-id"
                    value={accountNo}
                    readOnly
                    className="bg-gray-50 flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-name" className="text-xs font-medium text-dark-gray">Account Name</Label>
                <Input
                  id="account-name"
                  value={accountName || user?.fullname || ''}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4">
              <div className="text-xs text-medium-gray space-y-1">
                <p>• Transfer to this account to top up your wallet</p>
                <p>• Funds will be credited automatically once received</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-1">
              <Button
                variant="outline"
                onClick={handleCloseTopUpModal}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  copyToClipboard(virtualAccountNo);
                  handleCloseTopUpModal();
                }}
              >
                <CopyIcon className="w-4 h-4 mr-2" />
                Copy Account Number
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface CryptoCardProps {
  currency: string;
  amount: number;
  icon: string;
  currencyCode: string;
  publicAddress?: string;
  chain?: string;
  className?: string;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  currency,
  amount,
  icon,
  currencyCode,
  chain,
  publicAddress,
  className,
}) => {
  const [showAmount, setShowAmount] = React.useState(true);

  const toggleAmountVisibility = () => {
    setShowAmount(!showAmount);
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden border border-border rounded-2xl transition-all duration-300 cursor-pointer group w-full',
        'hover:shadow-lg hover:-translate-y-1',
        'bg-cover bg-center bg-no-repeat',
        className
      )}
      style={{
        backgroundImage: 'url("/images/wallet-bg.png")',
        backgroundColor: '#F56B08'
      }}
    >
      <CardContent className="px-3 py-2 relative z-10">
        <div className="flex items-center justify-between space-y-1">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center mr-3 overflow-hidden bg-white">
              <Image
                src={icon || dollarSign}
                alt={`${currency} flag`}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-1 items-center lowercase justify-center text-xs text-sidebar-text">
              <span>{currency}</span>
              <div>({chain})</div>
            </div>
          </div>
          <button
            onClick={toggleAmountVisibility}
            className="transition-colors text-white/80 hover:text-white p-1.5 cursor-pointer rounded-full bg-[#F6712D]"
          >
            {showAmount ? <Eye size={16} className='font-bold' /> : <EyeOff size={16} className='font-bold' />}
          </button>
        </div>
        <div className="mb-2">
          <p className="text-xl font-bold text-white">
            {showAmount ? formatPrice(amount || 0, currencyCode as CurrencyCode) : '••••••••'}
          </p>
        </div>
        <div className='flex items-center w-full'>
          <Button variant={'ghost'} onClick={() => copyToClipboard(publicAddress!)} className="text-white hover:text-white/80 flex justify-between w-full">
            <p className="break-all text-sidebar-text text-xs">{publicAddress?.slice(0, 10)}...{publicAddress?.slice(-8)}</p>
            <CopyIcon className='w-5 h-5' />
          </Button>
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </CardContent>
    </Card>
  );
};

export const WalletOverview = () => {
  const { user } = useUser()
  const [openId, setOpenId] = useState<string | null>(null);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);
  const [sendMoneyPreselectedAccount, setSendMoneyPreselectedAccount] = useState<BankAccount | null>(null);

  const { data: storeBalance, isLoading: balancesLoading } = useQuery({
    queryKey: ['wallet-balances'],
    queryFn: () => axiosInstance.request({
      method: 'GET',
      url: '/store-dashboard/balance',
      params: {
        username: user?.username,
        entityCode: user?.entityCode,
        storeCode: user?.storeCode || '',
      }
    })
  })

  const { data } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => axiosInstance.request({
      method: 'GET',
      url: '/store-dashboard/summary',
      params: {
        startDate: '01-01-2025',
        endDate: (() => {
          const today = new Date();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          const year = today.getFullYear();
          return `${day}-${month}-${year}`;
        })(),
        datePeriod: "",
        storeCode: user?.storeCode || '',
        username: user?.username,
        entityCode: user?.entityCode
      }
    })
  })

  const fiatBalances = storeBalance?.data?.wallets || [];
  const coinBalances = storeBalance?.data?.coins || [];

  const BalancesLoadingCards = () => (
    <div className="w-full">
      <div className=''>
        <div className="animate-pulse h-[100px] bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  )

  return (
    <>
      <div className="flex gap-6 px-2">
        <div className="w-full lg:w-1/2 space-y-6">
          <Tabs defaultValue="fiat" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="fiat">Fiat Currencies</TabsTrigger>
              <TabsTrigger value="crypto">Crypto Currencies</TabsTrigger>
            </TabsList>

            <TabsContent value="fiat" className="mt-4">
              {balancesLoading ? (
                <BalancesLoadingCards />
              ) : (
                <div className="grid grid-cols-1 gap-4 w-full">
                  {fiatBalances.map((wallet: any, index: number) => (
                    <CurrenciesCard
                      key={index}
                      currency={wallet.symbol}
                      amount={wallet.balance}
                      flag={wallet.logo}
                      label={wallet.label}
                      currencyCode={wallet.symbol}
                      virtualAccountNo={wallet.virtualAccountNo || 'No account available'}
                      accountNo={wallet.accountNo || 'No wallet ID'}
                      accountName={wallet.name} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="crypto" className="mt-4">
              {balancesLoading ? (
                <BalancesLoadingCards />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {/* {coinBalances.map((wallet: any, index: number) => (
                      <CryptoCard
                        key={index}
                        currency={wallet.symbol}
                        amount={wallet.balance}
                        icon={wallet.logo}
                        currencyCode={wallet.symbol}
                        publicAddress={wallet.publicAddress}
                        chain={wallet.chain} />
                    ))} */}
                    <div className="flex h-24 bg-white px-5 py-10 rounded-2xl flex-col items-center justify-center">
                      <p className="text-sm font-medium text-dark-gray">Coming Soon</p>
                      <p className="text-xs text-medium-gray text-center">
                        We're working hard to bring you a seamless way to access and manage crypto wallets.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickMenuData.map((item, index) => (
              <div
                key={index}
                className='bg-white rounded-2xl p-4 flex justify-center items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer'
                onClick={() => {
                  if (item.title === 'Send Money') {
                    setSendMoneyPreselectedAccount(null);
                    setShowSendMoneyModal(true);
                  } else {
                    setOpenId(item.title);
                  }
                }}
              >
                <div className="text-center space-y-2">
                  <div className="flex justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-medium-gray truncate">{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex w-1/2">
          {/* <HeroSlider /> */} {''}
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
      </div>

      <div className='mt-10 px-2'>
        <h3 className="text-base font-semibold text-dark-gray mb-4">Store Performance</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.data?.figures?.map((item: {
            title: string;
            amount: string | number;
            volume?: string | number;
          }, index: number) => (
            <div
              key={index}
              className='bg-white rounded-2xl p-4'
            >
              <div className="space-y-2">
                <p className="text-xs text-medium-gray truncate">
                  {item.title === "Item Count" ? "Sale Count" : item.title}
                </p>
                <p className="text-lg font-bold text-dark-gray">
                  {item.amount ? `₦${parseFloat(item.amount as string || '0').toLocaleString()}` : '—'}
                </p>
                <p className="text-xs text-medium-gray">
                  {item.volume ? `${item.volume} vol.` : '—'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SendMoneyModal
        isOpen={showSendMoneyModal}
        onClose={() => {
          setShowSendMoneyModal(false);
          setSendMoneyPreselectedAccount(null);
        }}
        preselectedAccount={sendMoneyPreselectedAccount}
      />
    </>
  );
};