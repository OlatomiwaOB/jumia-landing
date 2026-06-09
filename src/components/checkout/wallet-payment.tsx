// 'use client';
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { useToast } from '@/app/hooks/use-toast';
// import { useCart } from '@/store/cart';
// import { CheckoutStep, PaymentMethod, FormData } from '@/app/checkout/checkoutContent';
// import { ArrowLeft, Loader2, CheckCircle, XCircle, Settings, Wallet, Banknote, Copy } from 'lucide-react';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import axiosCustomer from '@/utils/fetch-function-customer';
// import useCustomer from '@/store/customerStore';
// import { useLocationStore } from '@/store/locationStore';
// import { Button } from '@/components/ui/button';
// import { CurrencyCode, formatPrice, generateRandomNumber, getCurrentDate, copyToClipboard } from '@/utils/helperfns';
// import { UseFormReturn } from 'react-hook-form';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { PinInput } from '@/components/ui/pin-input';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from "sonner";

// interface WalletPaymentProps {
//     setCurrentStep: (step: CheckoutStep) => void;
//     setSelectedPayment: (method: PaymentMethod) => void;
//     orderTotal: number;
//     form: UseFormReturn<FormData>;
//     onSuccess?: () => void;
//     totalVat: number;
// }

// interface WalletBalance {
//     id: number;
//     accountNo: string;
//     virtualAccountNo: string;
//     accountType: string;
//     symbol: string;
//     balance: number;
//     lcyBalance: number;
//     lcyCcy: string;
//     label: string;
//     logo: string;
//     primaryWallet: boolean;
//     name: string;
// }

// const WalletPayment: React.FC<WalletPaymentProps> = ({
//     setCurrentStep,
//     setSelectedPayment,
//     orderTotal,
//     form,
//     onSuccess,
//     totalVat
// }) => {
//     const [processing, setProcessing] = useState(false);
//     const [verificationStatus, setVerificationStatus] = useState<'idle' | 'processing' | 'success' | 'payment' | 'failed'>('idle');
//     const [showPinModal, setShowPinModal] = useState(false);
//     const [showSetupPinModal, setShowSetupPinModal] = useState(false);
//     const [showTopUpModal, setShowTopUpModal] = useState(false);
//     const [pin, setPin] = useState('');
//     const { cart, clearCart, mainCcy } = useCart();
//     const { customer } = useCustomer();
//     const { location } = useLocationStore();
//     const rand = generateRandomNumber(5);
//     const ccy = mainCcy();
//     const router = useRouter();
//     const currentDate = getCurrentDate();
//     const searchParams = useSearchParams();
//     const storeCode = searchParams ? searchParams.get('storeCode') || '' : '';
//     const orderNo = searchParams.get('orderNo') || '';

//     const hasSubmittedOrder = useRef(false);
//     const isSubmittingRef = useRef(false);

//     const { data: balanceData, isLoading, error, refetch } = useQuery({
//         queryKey: ['wallet-balance'],
//         queryFn: () => axiosCustomer.request({
//             method: 'GET',
//             url: '/customer-dashboard/balance',
//             params: {
//                 storeCode: storeCode || '',
//                 username: customer?.username || '',
//                 entityCode: customer?.entityCode || '',
//             }
//         }),
//         enabled: !!customer?.username,
//     });

//     const walletBalance = balanceData?.data?.wallets?.[0] as WalletBalance | undefined;
//     const isBalanceSufficient = walletBalance && walletBalance.balance >= orderTotal;
//     const isLowBalance = walletBalance && walletBalance.balance < orderTotal;

//     const handleOpenTopUpModal = () => {
//         setShowTopUpModal(true);
//     };

//     const handleCloseTopUpModal = () => {
//         setShowTopUpModal(false);
//     };

//     const handleSubmitOrder = useCallback((transactionPin: string) => {
//         if (hasSubmittedOrder.current || isSubmittingRef.current) {
//             console.log('Order submission already in progress or completed, skipping');
//             return;
//         }

//         if (!customer) {
//             console.error('Customer information not available');
//             toast.error("Customer information not found. Please login again.")
//             setVerificationStatus('failed');
//             return;
//         }

//         const subTotal = cart.reduce((sum, item) => {
//             return sum + ((item.salePrice || 0) * item.quantity);
//         }, 0);

//         const checkoutData = sessionStorage.getItem('checkout');
//         const parsedCheckoutData = checkoutData ? JSON.parse(checkoutData) : {};
//         const shippingFee = parsedCheckoutData?.shippingFee || 0;
//         const shippingName = parsedCheckoutData?.shippingName || '';

//         const orderItems = cart.map(item => ({
//             itemCode: item?.code,
//             itemName: item?.name,
//             storeCode: item?.storeCode,
//             price: item?.salePrice,
//             quantity: item?.quantity,
//             amount: (item?.salePrice || 0) * item.quantity,
//             discount: item?.discount || 0,
//             picture: item?.picture,
//             vat: (item as any).vat || 0,
//             vatRate: (item as any).vatRate || 0,
//         }));

//         const currentFormData = form.getValues();
//         console.log('Using form data for wallet order:', currentFormData);

//         const payload = {
//             channel: "WEB",
//             cartId: sessionStorage.getItem('orderNo') || parsedCheckoutData?.orderNo || orderNo,
//             orderDate: currentDate,
//             totalAmount: orderTotal,
//             subTotal: subTotal,
//             taxAmount: totalVat,
//             totalDiscount: parsedCheckoutData?.totalDiscount || 0,
//             deliveryOption: currentFormData.shippingMethod || "delivery",
//             paymentMethod: 'WALLET',
//             couponCode: "",
//             ccy: ccy,
//             deliveryFee: shippingFee,
//             deliveryOptionGroup: shippingName,
//             geolocation: location ? `${location?.latitude}, ${location?.longitude}` : '',
//             deviceId: customer?.deviceID,
//             orderStatus: "COMPLETED",
//             paymentStatus: "PAID",
//             storeCode: customer?.storeCode || storeCode,
//             customerName: customer?.fullname,
//             username: customer?.username,
//             pickupId: currentFormData.shippingMethod?.toLowerCase() === 'pickup'
//                 ? currentFormData.selectedAddressId || 0
//                 : null,
//             deliveryAddress: {
//                 id: currentFormData.selectedAddressId || 0,
//                 street: currentFormData.street || "",
//                 landmark: currentFormData.landmark || "",
//                 postCode: currentFormData.zipCode || "",
//                 city: currentFormData.city || "",
//                 state: currentFormData.state || "",
//                 country: currentFormData.country || "",
//                 addressType: currentFormData.addressType || ""
//             },
//             cartItems: orderItems
//         };

//         console.log('Submitting wallet order payload:', payload);
//         console.log('Breakdown:', {
//             subTotal: subTotal,
//             taxAmount: totalVat,
//             deliveryFee: shippingFee,
//             totalAmount: orderTotal,
//             calculatedTotal: subTotal + totalVat + shippingFee
//         });

//         hasSubmittedOrder.current = true;
//         isSubmittingRef.current = true;
//         submitOrder({ payload, transactionPin });
//     }, [cart, customer, form, orderTotal, ccy, location, currentDate, totalVat, toast]);

//     const { mutate: submitOrder, isPending: isSubmitting } = useMutation({
//         mutationFn: ({ payload, transactionPin }: { payload: any; transactionPin: string }) =>
//             axiosCustomer({
//                 url: '/ecommerce/submit-order',
//                 method: 'POST',
//                 data: payload,
//                 headers: {
//                     'x-enc-pwd': transactionPin
//                 }
//             }),
//         onSuccess: (axiosResponse) => {
//             const data = axiosResponse.data;
//             isSubmittingRef.current = false;

//             if (data?.responseCode === 'E14' && data?.responseMessage === 'Wrong transaction PIN') {
//                 toast.error("Wrong transaction PIN! Please try again.");
//                 setProcessing(false);
//                 setVerificationStatus('payment');
//                 hasSubmittedOrder.current = false;
//                 isSubmittingRef.current = false;
//                 return;
//             }

//             if (data?.responseCode !== '000') {
//                 toast.error(data?.responseMessage || "Failed to place order!");
//                 setVerificationStatus('failed');
//                 setProcessing(false);
//                 hasSubmittedOrder.current = false;
//                 isSubmittingRef.current = false;
//                 return;
//             }

//             toast.success("Payment successful, your order has been placed successfully!");

//             clearCart();
//             sessionStorage.removeItem('orderNo');

//             setVerificationStatus('success');

//             if (onSuccess) {
//                 onSuccess();
//             } else {
//                 setTimeout(() => {
//                     setCurrentStep('success');
//                 }, 1500);
//             }
//         },
//         onError: (error: any) => {
//             console.error('Submit wallet order error:', error);
//             isSubmittingRef.current = false;
//             const errorMessage = error.response?.data?.responseMessage
//                 || error.response?.data?.message
//                 || "Failed to save order!";

//             toast.error(errorMessage);
//             setVerificationStatus('failed');
//             hasSubmittedOrder.current = false;
//         }
//     });

//     const handlePayment = async () => {
//         if (!walletBalance) return;

//         if (!isBalanceSufficient) {
//             handleOpenTopUpModal();
//             return;
//         }

//         if (!customer?.pinSet) {
//             setShowSetupPinModal(true);
//             return;
//         }

//         setShowPinModal(true);
//     };

//     const handlePinSubmit = () => {
//         if (pin.length !== 4) {
//             toast.error("Please enter a valid 4-digit PIN");
//             return;
//         }

//         setShowPinModal(false);
//         setProcessing(true);
//         setVerificationStatus('processing');

//         try {
//             const checkoutData = sessionStorage.getItem('checkout');
//             const parsedCheckoutData = checkoutData ? JSON.parse(checkoutData) : {};
//             const orderNo = parsedCheckoutData?.orderNo || sessionStorage.getItem('orderNo');
//             console.log('Initiating wallet payment for order:', orderNo);

//             handleSubmitOrder(pin);
//             setPin('');

//         } catch (error: any) {
//             console.error('Wallet payment error:', error);
//             setVerificationStatus('failed');
//             toast.error(error.response?.data?.message || "Payment failed. Please try again.");
//             setProcessing(false);
//         }
//     };

//     const handleNavigateToSettings = () => {
//         setShowSetupPinModal(false);
//         router.push('/settings');
//     };

//     const checkoutData = sessionStorage.getItem('checkout');
//     const parsedCheckoutData = checkoutData ? JSON.parse(checkoutData) : {};
//     const shippingFee = parsedCheckoutData?.shippingFee || 0;
//     const subTotal = orderTotal - shippingFee - totalVat;

//     if (isLoading) {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <Loader2 className="w-12 h-12 animate-spin mx-auto" />
//                 <h2 className="text-2xl font-bold">Loading Wallet</h2>
//                 <p>Please wait while we load your wallet information...</p>
//             </div>
//         );
//     }

//     if (verificationStatus === 'processing') {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 {isSubmitting ? (
//                     <>
//                         <Loader2 className="w-12 h-12 animate-spin mx-auto" />
//                         <h2 className="text-2xl font-bold">Processing Payment</h2>
//                         <p>Please wait while we process your payment...</p>
//                     </>
//                 ) : (
//                     <>
//                         <Loader2 className="w-12 h-12 animate-spin mx-auto" />
//                         <h2 className="text-2xl font-bold">Initiating Payment</h2>
//                         <p>Setting up your wallet payment...</p>
//                     </>
//                 )}
//             </div>
//         );
//     }

//     if (verificationStatus === 'success') {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
//                 <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
//                 <p className="text-muted-foreground">Your order has been placed successfully.</p>
//                 <Button onClick={() => setCurrentStep('success')}>
//                     Continue
//                 </Button>
//             </div>
//         );
//     }

//     if (verificationStatus === 'failed') {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <XCircle className="w-12 h-12 text-red-500 mx-auto" />
//                 <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
//                 <p className="text-muted-foreground">Please try another payment method.</p>
//                 <Button onClick={() => setCurrentStep('cart')} variant="outline">
//                     Try Another Payment Method
//                 </Button>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <XCircle className="w-12 h-12 text-red-500 mx-auto" />
//                 <h2 className="text-2xl font-bold text-red-600">Failed to Load Wallet</h2>
//                 <p className="text-muted-foreground">Unable to load your wallet information.</p>
//                 <Button onClick={() => setCurrentStep('cart')} variant="outline">
//                     Choose Another Payment Method
//                 </Button>
//             </div>
//         );
//     }

//     if (!walletBalance) {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <XCircle className="w-12 h-12 text-red-500 mx-auto" />
//                 <h2 className="text-2xl font-bold text-red-600">No Wallet Found</h2>
//                 <p className="text-muted-foreground">You don't have a wallet set up.</p>
//                 <Button onClick={() => setCurrentStep('cart')} variant="outline">
//                     Choose Another Payment Method
//                 </Button>
//             </div>
//         );
//     }

//     return (
//         <>
//             <div className="max-w-md mx-auto space-y-6">
//                 <div className="flex items-center gap-2">
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => setCurrentStep('cart')}
//                     >
//                         <ArrowLeft className="w-4 h-4" />
//                     </Button>
//                     <h2 className="text-xl font-semibold">Wallet Payment</h2>
//                 </div>

//                 <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
//                     <div className="p-4 bg-muted rounded-lg">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center gap-3">
//                                 {walletBalance.logo && (
//                                     <img
//                                         src={walletBalance.logo}
//                                         alt={walletBalance.symbol}
//                                         className="w-10 h-10 rounded-lg object-cover"
//                                     />
//                                 )}
//                                 <div>
//                                     <h3 className="font-semibold">{walletBalance.name}</h3>
//                                     <p className="text-sm text-muted-foreground">{walletBalance.label}</p>
//                                 </div>
//                             </div>
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={handleOpenTopUpModal}
//                                 className="text-xs py-1 h-7 bg-accent text-white hover:bg-accent/90"
//                             >
//                                 <Wallet className="w-3 h-3 mr-1" />
//                                 Fund Wallet
//                             </Button>
//                         </div>

//                         <div className="space-y-2">
//                             <div className="flex items-center justify-between">
//                                 <span className="text-muted-foreground">Available Balance:</span>
//                                 <span className={`font-semibold text-lg ${isLowBalance ? 'text-red-600' : ''}`}>
//                                     {formatPrice(walletBalance.balance, walletBalance.symbol as CurrencyCode)}
//                                 </span>
//                             </div>
//                             <div className="flex items-center justify-between text-sm text-muted-foreground">
//                                 <span>Account Number:</span>
//                                 <span className="flex items-center gap-2">
//                                     {walletBalance.virtualAccountNo || walletBalance.accountNo}
//                                     <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => copyToClipboard(walletBalance.virtualAccountNo || walletBalance.accountNo)}
//                                         className="h-6 w-6 p-0"
//                                     >
//                                         <Copy className="w-3 h-3" />
//                                     </Button>
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="p-4 border rounded-lg space-y-2">
//                         <div className="flex justify-between items-center">
//                             <span className="text-muted-foreground">Subtotal:</span>
//                             <span>{formatPrice(subTotal, ccy as CurrencyCode)}</span>
//                         </div>
//                         {totalVat > 0 && (
//                             <div className="flex justify-between items-center">
//                                 <span className="text-muted-foreground">VAT:</span>
//                                 <span>{formatPrice(totalVat, ccy as CurrencyCode)}</span>
//                             </div>
//                         )}
//                         {shippingFee > 0 && (
//                             <div className="flex justify-between items-center">
//                                 <span className="text-muted-foreground">Shipping:</span>
//                                 <span>{formatPrice(shippingFee, ccy as CurrencyCode)}</span>
//                             </div>
//                         )}
//                         <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
//                             <span>Order Total:</span>
//                             <span>{formatPrice(orderTotal, ccy as CurrencyCode)}</span>
//                         </div>
//                         {totalVat > 0 && (
//                             <p className="text-xs text-muted-foreground text-right">
//                                 Includes {formatPrice(totalVat, ccy as CurrencyCode)} VAT
//                             </p>
//                         )}
//                     </div>

//                     {isLowBalance && (
//                         <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                             <div className="flex items-start gap-3">
//                                 <div className="text-yellow-600 mt-0.5">
//                                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                         <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                     </svg>
//                                 </div>
//                                 <div className="flex-1">
//                                     <p className="text-sm text-yellow-700 font-medium">
//                                         Insufficient Balance
//                                     </p>
//                                     <p className="text-sm text-yellow-600 mt-1">
//                                         You need {formatPrice(orderTotal - walletBalance.balance, walletBalance.symbol as CurrencyCode)} more to complete this payment.
//                                     </p>
//                                     <Button
//                                         onClick={handleOpenTopUpModal}
//                                         size="sm"
//                                         className="mt-2 bg-accent hover:bg-accent/90 text-white"
//                                     >
//                                         <Wallet className="w-3 h-3 mr-1" />
//                                         Fund Wallet Now
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     <div className="flex gap-3">
//                         <Button
//                             onClick={handlePayment}
//                             disabled={!isBalanceSufficient || processing}
//                             className="flex-1 bg-accent hover:bg-accent-foreground text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
//                         >
//                             {processing ? (
//                                 <>
//                                     <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                                     Processing Payment...
//                                 </>
//                             ) : (
//                                 `Pay ${formatPrice(orderTotal, ccy as CurrencyCode)}`
//                             )}
//                         </Button>

//                         {isLowBalance && (
//                             <Button
//                                 onClick={() => refetch()}
//                                 variant="outline"
//                                 className="flex-1 border-accent text-accent hover:bg-accent/10"
//                             >
//                                 <Wallet className="w-4 h-4 mr-2" />
//                                 Refresh Balance
//                             </Button>
//                         )}
//                     </div>

//                     <Button
//                         onClick={() => setCurrentStep('cart')}
//                         variant="outline"
//                         className="w-full"
//                     >
//                         Choose Another Payment Method
//                     </Button>
//                 </div>
//             </div>

//             <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
//                 <DialogContent className="sm:max-w-md">
//                     <DialogHeader className='flex flex-col'>
//                         <DialogTitle className="text-center">Enter Transaction PIN</DialogTitle>
//                         <DialogDescription className="text-center">
//                             Please enter your 4-digit transaction PIN to complete the payment
//                         </DialogDescription>
//                     </DialogHeader>

//                     <div className="flex justify-center py-4">
//                         <PinInput
//                             length={4}
//                             value={pin}
//                             onChange={setPin}
//                             type="password"
//                             className="gap-2"
//                             inputClassName="w-12 h-12 text-lg font-semibold bg-accent/10 border-accent focus:border-accent focus:ring-accent"
//                             autoFocus
//                         />
//                     </div>

//                     <DialogFooter className="flex gap-2 sm:gap-0">
//                         <Button
//                             variant="outline"
//                             onClick={() => {
//                                 setShowPinModal(false);
//                                 setPin('');
//                             }}
//                             className="flex-1"
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             onClick={handlePinSubmit}
//                             disabled={pin.length !== 4}
//                             className="flex-1 bg-accent hover:bg-accent-foreground"
//                         >
//                             Confirm Payment
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             <Dialog open={showSetupPinModal} onOpenChange={setShowSetupPinModal}>
//                 <DialogContent className="sm:max-w-md">
//                     <DialogHeader className="flex flex-col">
//                         <DialogTitle className="text-center flex items-center justify-center gap-2">
//                             <Settings className="w-5 h-5" />
//                             Transaction PIN Required
//                         </DialogTitle>
//                         <DialogDescription className="text-center text-accent-foreground font-medium">
//                             To ensure the security of your wallet, please setup a transaction PIN before making any purchases.
//                         </DialogDescription>
//                     </DialogHeader>

//                     <div className="py-4 text-center space-y-3">
//                         <p className="text-sm text-accent-foreground font-medium">
//                             You can set up your PIN on the mobile app or through your account settings.
//                         </p>
//                     </div>

//                     <DialogFooter className="flex gap-2 sm:gap-0">
//                         <Button
//                             variant="outline"
//                             onClick={() => setShowSetupPinModal(false)}
//                             className="flex-1"
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             onClick={handleNavigateToSettings}
//                             className="flex-1 bg-accent hover:bg-accent-foreground"
//                         >
//                             Go to Settings
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
//                 <DialogContent className="sm:max-w-md">
//                     <DialogHeader className='flex flex-col'>
//                         <DialogTitle className="flex items-center gap-2">
//                             <Banknote className="w-5 h-5" />
//                             Top Up via Bank Transfer
//                         </DialogTitle>
//                         <DialogDescription>
//                             Transfer funds to this account to top up your wallet
//                         </DialogDescription>
//                     </DialogHeader>

//                     <div className="space-y-4 py-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="bank-name">Bank Name</Label>
//                             <Input
//                                 id="bank-name"
//                                 value="Rex Microfinance MFB"
//                                 readOnly
//                                 className="bg-gray-50"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <div className="flex items-center justify-between">
//                                 <Label htmlFor="account-number">Account Number</Label>
//                                 <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={() => copyToClipboard(walletBalance.virtualAccountNo || walletBalance.accountNo)}
//                                     className="h-6 text-xs"
//                                 >
//                                     <Copy className="w-3 h-3 mr-1" />
//                                     Copy
//                                 </Button>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <Input
//                                     id="account-number"
//                                     value={walletBalance.virtualAccountNo || walletBalance.accountNo}
//                                     readOnly
//                                     className="bg-gray-50 flex-1"
//                                 />
//                             </div>
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="account-name">Account Name</Label>
//                             <Input
//                                 id="account-name"
//                                 value={customer?.fullname || ''}
//                                 readOnly
//                                 className="bg-gray-50"
//                             />
//                         </div>
//                     </div>

//                     <DialogFooter className="flex-col sm:flex-col items-start">
//                         <div className="text-xs text-muted-foreground space-y-1">
//                             <p>• Transfer to this account to top up your wallet</p>
//                             <p>• Funds will be credited automatically once received</p>
//                             {isLowBalance && (
//                                 <p className='font-semibold'>• Balance needed: {formatPrice(orderTotal - walletBalance.balance, walletBalance.symbol as CurrencyCode)}</p>
//                             )}
//                         </div>
//                         <div className="flex gap-2 mt-4 w-full">
//                             <Button
//                                 variant="outline"
//                                 onClick={handleCloseTopUpModal}
//                                 className="flex-1"
//                             >
//                                 Close
//                             </Button>
//                             <Button
//                                 onClick={() => {
//                                     copyToClipboard(walletBalance.virtualAccountNo || walletBalance.accountNo);
//                                     toast.success("Account number copied to clipboard!");
//                                 }}
//                                 className="flex-1 bg-accent hover:bg-accent-foreground"
//                             >
//                                 <Copy className="w-4 h-4 mr-2" />
//                                 Copy Account Number
//                             </Button>
//                         </div>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// };

// export default WalletPayment;

'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@/app/hooks/use-toast';
import { useCart } from '@/store/cart';
import { CheckoutStep, PaymentMethod, FormData } from '@/app/checkout/checkoutContent';
import { ArrowLeft, Loader2, CheckCircle, XCircle, Settings, Wallet, Banknote, Copy } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import useCustomer from '@/store/customerStore';
import { useLocationStore } from '@/store/locationStore';
import { Button } from '@/components/ui/button';
import { CurrencyCode, formatPrice, generateRandomNumber, getCurrentDate, copyToClipboard } from '@/utils/helperfns';
import { UseFormReturn } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGuestCheckoutStore } from '@/store/guestCheckoutStore';
import { buildGuestOrderPayload } from '@/utils/guest-checkout-helpers';
import { PinInput } from '@/components/ui/pin-input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";

interface WalletPaymentProps {
    setCurrentStep: (step: CheckoutStep) => void;
    setSelectedPayment: (method: PaymentMethod) => void;
    orderTotal: number;
    form: UseFormReturn<FormData>;
    onSuccess?: () => void;
    onEmailExists?: () => void;
    totalVat: number;
}

interface WalletBalance {
    id: number;
    accountNo: string;
    virtualAccountNo: string;
    accountType: string;
    symbol: string;
    balance: number;
    lcyBalance: number;
    lcyCcy: string;
    label: string;
    logo: string;
    primaryWallet: boolean;
    name: string;
}

const WalletPayment: React.FC<WalletPaymentProps> = ({
    setCurrentStep,
    setSelectedPayment,
    orderTotal,
    form,
    onSuccess,
    onEmailExists,
    totalVat
}) => {
    const [processing, setProcessing] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'processing' | 'success' | 'payment' | 'failed'>('idle');
    const [showPinModal, setShowPinModal] = useState(false);
    const [showSetupPinModal, setShowSetupPinModal] = useState(false);
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [pin, setPin] = useState('');
    const [transactionFee, setTransactionFee] = useState<number>(0);

    const { cart, clearCart, mainCcy } = useCart();
    const { customer } = useCustomer();
    const { location } = useLocationStore();
    const rand = generateRandomNumber(5);
    const ccy = mainCcy();
    const router = useRouter();
    const currentDate = getCurrentDate();
    const searchParams = useSearchParams();
    const storeCode = searchParams ? searchParams.get('storeCode') || '' : '';
    const orderNo = searchParams.get('orderNo') || '';

    const hasSubmittedOrder = useRef(false);
    const isSubmittingRef = useRef(false);

    // const checkoutDataInitial = sessionStorage.getItem('checkout');
    // const parsedCheckoutDataInitial = checkoutDataInitial ? JSON.parse(checkoutDataInitial) : {};
    // const shippingFeeInitial = parsedCheckoutDataInitial?.shippingFee || 0;
    // const orderTotalWithoutShipping = orderTotal - shippingFeeInitial;

    const { data: paymentMethodsData } = useQuery({
        queryKey: ['payment-methods', customer?.storeCode],
        queryFn: () => axiosCustomer.request({
            method: 'GET',
            url: '/payment-methods/fetch',
            params: {
                storeCode: customer?.storeCode || storeCode,
            }
        }),
        enabled: !!(customer?.storeCode || storeCode),
    });

    useEffect(() => {
        const paymentMethods = paymentMethodsData?.data?.list?.filter((method: any) =>
            method?.status?.toUpperCase() === "ACTIVE"
        ) || [];

        const walletMethod = paymentMethods.find((method: any) =>
            method?.paymentType === 'WALLET'
        );

        if (walletMethod) {
            const fee = parseFloat(walletMethod.fee) || 0;
            const capLimit = parseFloat(walletMethod.capLimit) || 0;

            let calculatedFee = 0;

            if (walletMethod.feeType === 'PERCENT') {
                calculatedFee = (orderTotal * fee) / 100;
            } else {
                calculatedFee = fee;
            }

            if (capLimit > 0) {
                calculatedFee = Math.min(calculatedFee, capLimit);
            }

            setTransactionFee(calculatedFee);
        } else {
            setTransactionFee(0);
        }
    }, [paymentMethodsData, orderTotal]);

    const totalWithFee = orderTotal + transactionFee;

    const { data: balanceData, isLoading, error, refetch } = useQuery({
        queryKey: ['wallet-balance'],
        queryFn: () => axiosCustomer.request({
            method: 'GET',
            url: '/customer-dashboard/balance',
            params: {
                storeCode: storeCode || '',
                username: customer?.username || '',
                entityCode: customer?.entityCode || '',
            }
        }),
        enabled: !!customer?.username,
    });

    const walletBalance = balanceData?.data?.wallets?.[0] as WalletBalance | undefined;
    const isBalanceSufficient = walletBalance && walletBalance.balance >= totalWithFee;
    const isLowBalance = walletBalance && walletBalance.balance < totalWithFee;

    const handleOpenTopUpModal = () => {
        setShowTopUpModal(true);
    };

    const handleCloseTopUpModal = () => {
        setShowTopUpModal(false);
    };

    const handleSubmitOrder = useCallback((transactionPin: string) => {
        if (hasSubmittedOrder.current || isSubmittingRef.current) {
            // console.log('Order submission already in progress or completed, skipping');
            return;
        }

        if (!customer) {
            console.error('Customer information not available');
            toast.error("Customer information not found. Please login again.")
            setVerificationStatus('failed');
            return;
        }

        const subTotal = cart.reduce((sum, item) => {
            return sum + ((item.salePrice || 0) * item.quantity);
        }, 0);

        const checkoutData = sessionStorage.getItem('checkout');
        const parsedCheckoutData = checkoutData ? JSON.parse(checkoutData) : {};
        const shippingFee = parsedCheckoutData?.shippingFee || 0;
        const shippingName = parsedCheckoutData?.shippingName || '';

        const orderItems = cart.map(item => ({
            itemCode: item?.code,
            itemName: item?.name,
            storeCode: item?.storeCode,
            price: item?.salePrice,
            quantity: item?.quantity,
            amount: (item?.salePrice || 0) * item.quantity,
            discount: item?.discount || 0,
            picture: item?.picture,
            vat: (item as any).vat || 0,
            vatRate: (item as any).vatRate || 0,
        }));

        const currentFormData = form.getValues();
        // console.log('Using form data for wallet order:', currentFormData);

        const payload = {
            channel: "WEB",
            cartId: sessionStorage.getItem('orderNo') || parsedCheckoutData?.orderNo || orderNo,
            orderDate: currentDate,
            totalAmount: totalWithFee,
            subTotal: subTotal,
            taxAmount: totalVat,
            transactionFee: transactionFee,
            totalDiscount: parsedCheckoutData?.totalDiscount || 0,
            deliveryOption: currentFormData.shippingMethod || "delivery",
            paymentMethod: 'WALLET',
            couponCode: "",
            ccy: ccy,
            deliveryFee: shippingFee,
            deliveryOptionGroup: shippingName,
            geolocation: location ? `${location?.latitude}, ${location?.longitude}` : '',
            deviceId: customer?.deviceID,
            orderStatus: "COMPLETED",
            paymentStatus: "PAID",
            storeCode: customer?.storeCode || storeCode,
            customerName: customer?.fullname,
            username: customer?.username,
            pickupId: currentFormData.shippingMethod?.toLowerCase() === 'pickup'
                ? currentFormData.selectedAddressId || 0
                : null,
            deliveryAddress: {
                id: currentFormData.selectedAddressId || 0,
                street: currentFormData.street || "",
                landmark: currentFormData.landmark || "",
                postCode: currentFormData.zipCode || "",
                city: currentFormData.city || "",
                state: currentFormData.state || "",
                country: currentFormData.country || "",
                addressType: currentFormData.addressType || ""
            },
            cartItems: orderItems
        };

        // console.log('Submitting wallet order payload:', payload);
        // console.log('Breakdown:', {
        //     subTotal: subTotal,
        //     taxAmount: totalVat,
        //     transactionFee: transactionFee,
        //     deliveryFee: shippingFee,
        //     totalAmount: totalWithFee,
        //     calculatedTotal: subTotal + totalVat + transactionFee + shippingFee
        // });

        hasSubmittedOrder.current = true;
        isSubmittingRef.current = true;
        submitOrder({ payload, transactionPin });
    }, [cart, customer, form, orderTotal, totalWithFee, transactionFee, ccy, location, currentDate, totalVat, toast, storeCode, orderNo]);

    const isGuestCheckout = !!useGuestCheckoutStore.getState().guestInfo;
    const { mutate: submitGuestOrder, isPending: isSubmittingGuest } = useMutation({
        mutationFn: ({ payload, transactionPin }: { payload: any; transactionPin: string }) =>
            axiosCustomer({
                url: '/ecommerce/submit-guest-order',
                method: 'POST',
                data: payload,
                headers: {
                    'x-enc-pwd': transactionPin
                }
            }),
        onSuccess: (axiosResponse) => {
            const data = axiosResponse.data;
            isSubmittingRef.current = false;

            if (data?.responseCode === 'E412') {
                toast.error('An account with this email already exists. Please sign in to continue.');
                setProcessing(false);
                hasSubmittedOrder.current = false;
                isSubmittingRef.current = false;
                if (onEmailExists) onEmailExists();
                return;
            }

            if (data?.responseCode === 'E14' && data?.responseMessage === 'Wrong transaction PIN') {
                toast.error("Wrong transaction PIN! Please try again.");
                setProcessing(false);
                setVerificationStatus('payment');
                hasSubmittedOrder.current = false;
                isSubmittingRef.current = false;
                return;
            }

            if (data?.responseCode !== '000') {
                toast.error(data?.responseMessage || "Failed to place order!");
                setVerificationStatus('failed');
                setProcessing(false);
                hasSubmittedOrder.current = false;
                isSubmittingRef.current = false;
                return;
            }

            toast.success("Payment successful, your order has been placed successfully!");

            clearCart();
            useGuestCheckoutStore.getState().clear();
            sessionStorage.removeItem('orderNo');

            setVerificationStatus('success');

            if (onSuccess) {
                onSuccess();
            } else {
                setTimeout(() => {
                    setCurrentStep('success');
                }, 1500);
            }
        },
        onError: (error: any) => {
            console.error('Submit wallet order error:', error);
            isSubmittingRef.current = false;
            const errorMessage = error.response?.data?.responseMessage
                || error.response?.data?.message
                || "Failed to save order!";

            toast.error(errorMessage);
            setVerificationStatus('failed');
            hasSubmittedOrder.current = false;
        }
    });

    const { mutate: submitAuthOrder, isPending: isSubmittingAuth } = useMutation({
        mutationFn: ({ payload, transactionPin }: { payload: any; transactionPin: string }) =>
            axiosCustomer({
                url: '/ecommerce/submit-order',
                method: 'POST',
                data: payload,
                headers: {
                    'x-enc-pwd': transactionPin
                }
            }),
        onSuccess: (axiosResponse) => {
            const data = axiosResponse.data;
            isSubmittingRef.current = false;

            if (data?.responseCode === 'E14' && data?.responseMessage === 'Wrong transaction PIN') {
                toast.error("Wrong transaction PIN! Please try again.");
                setProcessing(false);
                setVerificationStatus('payment');
                hasSubmittedOrder.current = false;
                isSubmittingRef.current = false;
                return;
            }

            if (data?.responseCode !== '000') {
                toast.error(data?.responseMessage || "Failed to place order!");
                setVerificationStatus('failed');
                setProcessing(false);
                hasSubmittedOrder.current = false;
                isSubmittingRef.current = false;
                return;
            }

            toast.success("Payment successful, your order has been placed successfully!");

            clearCart();
            sessionStorage.removeItem('orderNo');

            setVerificationStatus('success');

            if (onSuccess) {
                onSuccess();
            } else {
                setTimeout(() => {
                    setCurrentStep('success');
                }, 1500);
            }
        },
        onError: (error: any) => {
            console.error('Submit wallet order error:', error);
            isSubmittingRef.current = false;
            const errorMessage = error.response?.data?.responseMessage
                || error.response?.data?.message
                || "Failed to save order!";

            toast.error(errorMessage);
            setVerificationStatus('failed');
            hasSubmittedOrder.current = false;
        }
    });

    const isSubmitting = isGuestCheckout ? isSubmittingGuest : isSubmittingAuth;
    const submitOrder = ({ payload, transactionPin }: { payload: any; transactionPin: string }) => {
        if (isGuestCheckout) {
            const guestInfo = useGuestCheckoutStore.getState().guestInfo;
            if (guestInfo) {
                submitGuestOrder({ payload: buildGuestOrderPayload(guestInfo, payload), transactionPin });
            } else {
                toast.error("Guest info missing");
            }
        } else {
            submitAuthOrder({ payload, transactionPin });
        }
    };

    const handlePayment = async () => {
        if (!walletBalance) return;

        if (!isBalanceSufficient) {
            handleOpenTopUpModal();
            return;
        }

        if (!customer?.pinSet) {
            setShowSetupPinModal(true);
            return;
        }

        setShowPinModal(true);
    };

    const handlePinSubmit = () => {
        if (pin.length !== 4) {
            toast.error("Please enter a valid 4-digit PIN");
            return;
        }

        setShowPinModal(false);
        setProcessing(true);
        setVerificationStatus('processing');

        try {
            const checkoutData = sessionStorage.getItem('checkout');
            const parsedCheckoutData = checkoutData ? JSON.parse(checkoutData) : {};
            const orderNo = parsedCheckoutData?.orderNo || sessionStorage.getItem('orderNo');
            // console.log('Initiating wallet payment for order:', orderNo);

            handleSubmitOrder(pin);
            setPin('');

        } catch (error: any) {
            console.error('Wallet payment error:', error);
            setVerificationStatus('failed');
            toast.error(error.response?.data?.message || "Payment failed. Please try again.");
            setProcessing(false);
        }
    };

    const handleNavigateToSettings = () => {
        setShowSetupPinModal(false);
        router.push('/settings');
    };

    const checkoutData = sessionStorage.getItem('checkout');
    const parsedCheckoutData = checkoutData ? JSON.parse(checkoutData) : {};
    const shippingFee = parsedCheckoutData?.shippingFee || 0;
    const subTotal = orderTotal - shippingFee - totalVat;

    if (isLoading) {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto" />
                <h2 className="text-2xl font-bold">Loading Wallet</h2>
                <p>Please wait while we load your wallet information...</p>
            </div>
        );
    }

    if (verificationStatus === 'processing') {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold">Processing Payment</h2>
                        <p>Please wait while we process your payment...</p>
                    </>
                ) : (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold">Initiating Payment</h2>
                        <p>Setting up your wallet payment...</p>
                    </>
                )}
            </div>
        );
    }

    if (verificationStatus === 'success') {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
                <p className="text-muted-foreground">Your order has been placed successfully.</p>
                <Button onClick={() => setCurrentStep('success')}>
                    Continue
                </Button>
            </div>
        );
    }

    if (verificationStatus === 'failed') {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
                <p className="text-muted-foreground">Please try another payment method.</p>
                <Button onClick={() => setCurrentStep('cart')} variant="outline">
                    Try Another Payment Method
                </Button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-red-600">Failed to Load Wallet</h2>
                <p className="text-muted-foreground">Unable to load your wallet information.</p>
                <Button onClick={() => setCurrentStep('cart')} variant="outline">
                    Choose Another Payment Method
                </Button>
            </div>
        );
    }

    if (!walletBalance) {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-red-600">No Wallet Found</h2>
                <p className="text-muted-foreground">You don't have a wallet set up.</p>
                <Button onClick={() => setCurrentStep('cart')} variant="outline">
                    Choose Another Payment Method
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-md mx-auto space-y-6">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep('cart')}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="text-xl font-semibold">Wallet Payment</h2>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                    <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {walletBalance.logo && (
                                    <img
                                        src={walletBalance.logo}
                                        alt={walletBalance.symbol}
                                        className="w-10 h-10 rounded-lg object-cover"
                                    />
                                )}
                                <div>
                                    <h3 className="font-semibold">{walletBalance.name}</h3>
                                    <p className="text-sm text-muted-foreground">{walletBalance.label}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleOpenTopUpModal}
                                className="text-xs py-1 h-7 bg-accent text-white hover:bg-accent/90"
                            >
                                <Wallet className="w-3 h-3 mr-1" />
                                Fund Wallet
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Available Balance:</span>
                                <span className={`font-semibold text-lg ${isLowBalance ? 'text-red-600' : ''}`}>
                                    {formatPrice(walletBalance.balance, walletBalance.symbol as CurrencyCode)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Account Number:</span>
                                <span className="flex items-center gap-2">
                                    {walletBalance.virtualAccountNo || walletBalance.accountNo}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(walletBalance.virtualAccountNo || walletBalance.accountNo)}
                                        className="h-6 w-6 p-0"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span>{formatPrice(subTotal, ccy as CurrencyCode)}</span>
                        </div>
                        {totalVat > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">VAT:</span>
                                <span>{formatPrice(totalVat, ccy as CurrencyCode)}</span>
                            </div>
                        )}
                        {shippingFee > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Shipping:</span>
                                <span>{formatPrice(shippingFee, ccy as CurrencyCode)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center font-medium border-t pt-2">
                            <span>Order Total:</span>
                            <span>{formatPrice(orderTotal, ccy as CurrencyCode)}</span>
                        </div>

                        {transactionFee > 0 && (
                            <>
                                <div className="flex justify-between items-center border-t pt-2">
                                    <span className="text-muted-foreground">Transaction Fee:</span>
                                    <span>{formatPrice(transactionFee, ccy as CurrencyCode)}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-lg text-accent ">
                                    <span>Total to Pay (inc. fee):</span>
                                    <span>{formatPrice(totalWithFee, ccy as CurrencyCode)}</span>
                                </div>
                            </>
                        )}
                        {totalVat > 0 && (
                            <p className="text-xs text-muted-foreground text-right">
                                Includes {formatPrice(totalVat, ccy as CurrencyCode)} VAT
                            </p>
                        )}
                    </div>

                    {isLowBalance && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="text-yellow-600 mt-0.5">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-yellow-700 font-medium">
                                        Insufficient Balance
                                    </p>
                                    <p className="text-sm text-yellow-600 mt-1">
                                        You need {formatPrice(totalWithFee - walletBalance.balance, walletBalance.symbol as CurrencyCode)} more to complete this payment.
                                    </p>
                                    <Button
                                        onClick={handleOpenTopUpModal}
                                        size="sm"
                                        className="mt-2 bg-accent hover:bg-accent/90 text-white"
                                    >
                                        <Wallet className="w-3 h-3 mr-1" />
                                        Fund Wallet Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button
                            onClick={handlePayment}
                            disabled={!isBalanceSufficient || processing}
                            className="flex-1 bg-accent hover:bg-accent-foreground text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Processing Payment...
                                </>
                            ) : (
                                `Pay ${formatPrice(totalWithFee, ccy as CurrencyCode)}`
                            )}
                        </Button>

                        {isLowBalance && (
                            <Button
                                onClick={() => refetch()}
                                variant="outline"
                                className="flex-1 border-accent text-accent hover:bg-accent/10"
                            >
                                <Wallet className="w-4 h-4 mr-2" />
                                Refresh Balance
                            </Button>
                        )}
                    </div>

                    <Button
                        onClick={() => setCurrentStep('cart')}
                        variant="outline"
                        className="w-full"
                    >
                        Choose Another Payment Method
                    </Button>
                </div>
            </div>

            <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle className="text-center">Enter Transaction PIN</DialogTitle>
                        <DialogDescription className="text-center">
                            Please enter your 4-digit transaction PIN to complete the payment
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-center py-4">
                        <PinInput
                            length={4}
                            value={pin}
                            onChange={setPin}
                            type="password"
                            className="gap-2"
                            inputClassName="w-12 h-12 text-lg font-semibold bg-accent/10 border-accent focus:border-accent focus:ring-accent"
                            autoFocus
                        />
                    </div>

                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowPinModal(false);
                                setPin('');
                            }}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePinSubmit}
                            disabled={pin.length !== 4}
                            className="flex-1 bg-accent hover:bg-accent-foreground"
                        >
                            Confirm Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showSetupPinModal} onOpenChange={setShowSetupPinModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="flex flex-col">
                        <DialogTitle className="text-center flex items-center justify-center gap-2">
                            <Settings className="w-5 h-5" />
                            Transaction PIN Required
                        </DialogTitle>
                        <DialogDescription className="text-center text-accent-foreground font-medium">
                            To ensure the security of your wallet, please setup a transaction PIN before making any purchases.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 text-center space-y-3">
                        <p className="text-sm text-accent-foreground font-medium">
                            You can set up your PIN on the mobile app or through your account settings.
                        </p>
                    </div>

                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowSetupPinModal(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleNavigateToSettings}
                            className="flex-1 bg-accent hover:bg-accent-foreground"
                        >
                            Go to Settings
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle className="flex items-center gap-2">
                            <Banknote className="w-5 h-5" />
                            Top Up via Bank Transfer
                        </DialogTitle>
                        <DialogDescription>
                            Transfer funds to this account to top up your wallet
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
                                    onClick={() => copyToClipboard(walletBalance.virtualAccountNo || walletBalance.accountNo)}
                                    className="h-6 text-xs"
                                >
                                    <Copy className="w-3 h-3 mr-1" />
                                    Copy
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="account-number"
                                    value={walletBalance.virtualAccountNo || walletBalance.accountNo}
                                    readOnly
                                    className="bg-gray-50 flex-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="account-name">Account Name</Label>
                            <Input
                                id="account-name"
                                value={customer?.fullname || ''}
                                readOnly
                                className="bg-gray-50"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-col items-start">
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p>• Transfer to this account to top up your wallet</p>
                            <p>• Funds will be credited automatically once received</p>
                            {isLowBalance && (
                                <p className='font-semibold'>• Balance needed: {formatPrice(totalWithFee - walletBalance.balance, walletBalance.symbol as CurrencyCode)}</p>
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
                                    copyToClipboard(walletBalance.virtualAccountNo || walletBalance.accountNo);
                                    toast.success("Account number copied to clipboard!");
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

export default WalletPayment;