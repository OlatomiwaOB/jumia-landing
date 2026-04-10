import { useTronLink } from '@/hooks/useTronLink';
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PaymentStatus } from '../usdt-payment';
import { FormData } from '@/app/checkout/checkoutContent';
import { CheckCircle2, Send, ExternalLink, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import useCustomer from '@/store/customerStore';
import { PaymentPendingScreen, PaymentSuccessScreen } from './payment-states';
import { useCart } from '@/store/cart';

// USDT TRC20 contract address on Tron NILE TESTNET
const USDT_CONTRACT_ADDRESS = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf'; // Nile testnet USDT

// Minimal TRC20 ABI for transfer function
const TRC20_ABI = [
  {
    "outputs": [{ "type": "bool" }],
    "constant": false,
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "value", "type": "uint256" }
    ],
    "name": "transfer",
    "stateMutability": "Nonpayable",
    "type": "Function"
  },
  {
    "outputs": [{ "type": "uint256" }],
    "constant": true,
    "inputs": [{ "name": "who", "type": "address" }],
    "name": "balanceOf",
    "stateMutability": "View",
    "type": "Function"
  },
  {
    "outputs": [{ "type": "uint8" }],
    "constant": true,
    "name": "decimals",
    "stateMutability": "View",
    "type": "Function"
  }
];

interface TransactionResult {
  success: boolean;
  txId?: string;
  error?: string;
}

interface TronFlowProps {
  amount: any
  recipientAddress: string
  orderNo: string,
  selectedNetwork: any,
  form?: UseFormReturn<FormData>,
  paymentStatus?: PaymentStatus,
  setPaymentStatus?: (paymentStatus: PaymentStatus) => void
  subTotal?: number; 
  totalVat?: number; 
  shippingFee?: number; 
}

export const TronTransactions = ({ amount, orderNo, recipientAddress, form, paymentStatus, setPaymentStatus, selectedNetwork, subTotal, totalVat, shippingFee }: TronFlowProps) => {
  const { address, isConnected, tronWeb } = useTronLink();
  const [activeTab, setActiveTab] = useState<'trx' | 'usdt'>('trx');
  const { clearCart } = useCart()

  console.log(form?.getValues());

  // Form states
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TransactionResult | null>(null);

  // Balance states
  const [trxBalance, setTrxBalance] = useState('0');
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [network, setNetwork] = useState<string>('Unknown');

  const searchParams = useSearchParams()
  const storeCode = searchParams.get('storeCode') || ''
  const { customer } = useCustomer()

  // Detect network
  useEffect(() => {
    if (!tronWeb) return;

    const detectNetwork = () => {
      const fullNode = tronWeb.fullNode.host;
      if (fullNode.includes('nile')) {
        setNetwork('Nile Testnet');
      } else if (fullNode.includes('shasta')) {
        setNetwork('Shasta Testnet');
      } else if (fullNode.includes('api.trongrid.io')) {
        setNetwork('Mainnet');
      } else {
        setNetwork('Unknown Network');
      }
    };

    detectNetwork();
  }, [tronWeb]);

  // Fetch balances
  useEffect(() => {
    if (!isConnected || !tronWeb || !address) return;

    const fetchBalances = async () => {
      try {
        // Get TRX balance
        const trxBal = await tronWeb.trx.getBalance(address);
        setTrxBalance((trxBal / 1_000_000).toFixed(6)); // Convert from SUN to TRX

        // Get USDT balance
        try {
          const contract = await tronWeb.contract(TRC20_ABI, USDT_CONTRACT_ADDRESS);
          const usdtBal = await contract.balanceOf(address).call();
          // Convert BigInt to number properly
          const balanceNum = typeof usdtBal === 'bigint'
            ? Number(usdtBal) / 1_000_000
            : (Number(usdtBal.toString()) / 1_000_000);
          setUsdtBalance(balanceNum.toFixed(2)); // USDT has 6 decimals
        } catch (error) {
          console.error('Error fetching USDT balance:', error);
          setUsdtBalance('0.00');
        }
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, [isConnected, tronWeb, address]);



  const sendTRX = async () => {
    if (!tronWeb || !recipientAddress || !amount) return;

    setIsLoading(true);
    setResult(null);

    try {
      // Validate address
      if (!tronWeb.isAddress(recipientAddress)) {
        throw new Error('Invalid recipient address');
      }

      // Convert TRX to SUN (1 TRX = 1,000,000 SUN)
      const amountInSun = tronWeb.toSun(amount);

      // Send transaction
      const transaction = await tronWeb.trx.sendTransaction(
        recipientAddress,
        amountInSun
      );

      if (transaction.result) {
        setResult({
          success: true,
          txId: transaction.txid || transaction.transaction?.txID,
        });
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Transaction failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendUSDT = async () => {
    if (!tronWeb || !recipientAddress || !amount) return;

    setIsLoading(true);
    setResult(null);

    try {
      // Validate address
      if (!tronWeb.isAddress(recipientAddress)) {
        throw new Error('Invalid recipient address');
      }

      // Get USDT contract instance
      const contract = await tronWeb.contract(TRC20_ABI, USDT_CONTRACT_ADDRESS);

      // USDT has 6 decimals - convert to smallest unit
      const amountInSmallestUnit = BigInt(Math.floor(parseFloat(amount as any) * 1_000_000));

      // Call transfer function - this returns the transaction ID directly
      const txId = await contract.transfer(
        recipientAddress,
        amountInSmallestUnit.toString() // Convert BigInt to string for TronWeb
      ).send({
        feeLimit: 100_000_000, // 100 TRX fee limit
        callValue: 0,
        shouldPollResponse: false, // Don't wait for confirmation, just get the txID
      });

      console.log('Transaction ID:', txId);

      // The txId is returned directly as a string
      setResult({
        success: true,
        txId: txId,
      });
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Transaction failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log(result);

  // Send payment to the backend

  const { mutate: checkPaymentStatus, isPending: checkingPaymentStatus, data } = useMutation({
    mutationFn: (data: any) => axiosCustomer.request({
      url: '/store/payment-status',
      method: 'POST',
      data
    }),
    onSuccess: (data) => {


      if (data?.data?.responseCode === '000') {
        setPaymentStatus?.('confirmed');
        // setTransactionDetails(data?.data)
        toast.success('Payment confirmed successfully!');

      }
      else if (data?.data?.responseCode === 'PP') {
        setPaymentStatus?.('pending')
        toast('Transaction is processing!')
      }
      else {
        setPaymentStatus?.('failed');
        toast.error(data?.data?.responseMessage || 'Payment verification failed');
      }
    },
    onError: (error: any) => {
      setPaymentStatus?.('failed');
      toast.error('Failed to check payment status');
    }
  });

  const makepayMent = () => {
    const payload = {
      symbol: selectedNetwork?.symbol,
      chain: selectedNetwork?.chain,
      orderNo,
      storeCode,
      entityCode: customer?.entityCode,
      txId: result?.txId,
      username: customer?.username,
            subTotal: subTotal?.toFixed(2),
      taxAmount: totalVat?.toFixed(2),
      deliveryFee: shippingFee?.toFixed(2),
      publicAddress: recipientAddress,
      totalAmount: amount?.toFixed(2),
      paymentMethod: "CRYPTO_TOKEN",
      deliveryAddressDto: {
        id: form?.getValues('selectedAddressId'),
        street: form?.getValues('street'),
        landmark: form?.getValues('landmark'),
        postCode: form?.getValues('zipCode'),
        city: form?.getValues('city'),
        state: form?.getValues('state'),
        country: form?.getValues('country'),
        addressType: form?.getValues('addressType'),
        orderNo
      }
    }

    checkPaymentStatus(payload);
  }


  // Get correct explorer URL based on network
  const getExplorerUrl = (txId: string) => {
    if (network.includes('Nile')) {
      return `https://nile.tronscan.org/#/transaction/${txId}`;
    } else if (network.includes('Shasta')) {
      return `https://shasta.tronscan.org/#/transaction/${txId}`;
    }
    return `https://tronscan.org/#/transaction/${txId}`;
  };

  if (!isConnected) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Please connect your TronLink wallet first</p>
      </div>
    );
  }

  if (selectedNetwork?.chain !== 'TRON') {
    return <div className="rounded-lg bg-card p-8 border border-border shadow-sm text-center">
      <h1>You need to be on the <b>Tron</b> network</h1>
    </div>
  }

  return (
    <>
      {
        paymentStatus === 'confirmed' && <div className="rounded-lg bg-card p-8 border border-border shadow-sm text-center">
          <PaymentSuccessScreen
            paymentResponse={data?.data}
          />

        </div>
      }

      {
        paymentStatus === 'pending' && <div className="rounded-lg bg-card p-8 border border-border shadow-sm text-center">
          <PaymentPendingScreen
            amount={amount}
            checkingPaymentStatus={checkingPaymentStatus}
            network={selectedNetwork?.chain}
            orderNo={orderNo}
            retryPaymentCheck={makepayMent}
          />
        </div>
      }

      {
        paymentStatus === 'failed' && <div className="rounded-lg bg-card p-8 border border-border shadow-sm text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Failed Transaction</h2>
              <p className="text-muted-foreground">{data?.data?.responseMessage}</p>
            </div>
          </div>

          <button className="border rounded-sm w-full flex bg-black text-white font-semibold justify-center gap-x-1 items-center p-2 text-center" onClick={() => setPaymentStatus?.('idle')}>
            <RefreshCw /> Start over
          </button>
        </div>
      }

      {
        paymentStatus === 'idle' && (
          <div className="space-y-6">
            {/* Wallet Info */}
            <div className="rounded-lg bg-card p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-accent/10 p-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">Wallet Connected</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Connected Address</p>
                  <p className="font-mono text-sm text-foreground break-all">{address}</p>
                </div>

                {/* Balance Display */}
                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">USDC Balance</p>
                      <p className="font-semibold text-lg text-foreground">
                        {selectedNetwork?.symbol === 'USDT'
                          ? `${parseFloat(usdtBalance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${selectedNetwork?.symbol}`
                          : `${parseFloat(trxBalance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${selectedNetwork?.symbol}`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transaction Preview */}
                <div className="rounded-lg bg-card p-6 border border-border shadow-sm">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4">TRANSACTION PREVIEW</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-sm text-muted-foreground">From</span>
                      <span className="font-mono text-xs text-foreground truncate max-w-xs">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-sm text-muted-foreground">To</span>
                      <span className="font-mono text-xs text-foreground truncate max-w-xs">{recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="font-semibold text-foreground">
                        {amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {selectedNetwork?.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-sm text-muted-foreground">Network</span>
                      <span className="font-semibold text-foreground">{selectedNetwork?.chain}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm text-muted-foreground">Order ID</span>
                      <span className="font-mono text-xs text-foreground">{orderNo}</span>
                    </div>
                  </div>
                </div>

                {/* Transaction Status */}
                {result && (
                  <div className={`rounded-lg p-4 border ${result.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                    }`}>
                    <div className="flex items-center gap-3">
                      {result.success ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <div className="flex-1">
                            <p className="font-medium text-green-800">
                              Transaction Sent!
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Your transaction has been broadcast to the network.
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Please click on the &quot;I&apos;ve made the payment&quot; button to complete the checkout process!
                            </p>
                            {result.txId && (
                              <a
                                href={getExplorerUrl(result.txId)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 mt-2"
                              >
                                View on Explorer <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="rounded-full bg-red-100 p-1">
                            <div className="h-3 w-3 bg-red-600 rounded-full" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-red-800">Transaction Failed</p>
                            <p className="text-sm text-red-600 mt-1">{result.error}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {!result?.success ? (
                  /* Send Transaction Button */
                  <button
                    onClick={selectedNetwork?.symbol === 'USDT' ? sendUSDT : sendTRX}
                    disabled={isLoading || parseFloat(selectedNetwork?.symbol === 'USDT' ? usdtBalance : trxBalance) < amount}
                    className="w-full rounded-lg bg-accent text-white font-semibold py-3 px-4 hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    {parseFloat(selectedNetwork?.symbol === 'USDT' ? usdtBalance : trxBalance) < amount
                      ? 'Insufficient Balance'
                      : isLoading ? 'Sending...' : 'Send Transaction'
                    }
                  </button>
                ) : result.success && (
                  /* I've Made Payment Button - Shown immediately after successful transaction */
                  <button
                    onClick={makepayMent}
                    disabled={checkingPaymentStatus}
                    className="w-full rounded-lg bg-accent text-white font-semibold py-3 px-4 hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    {checkingPaymentStatus ? 'Please wait...' : "I've made the payment"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};