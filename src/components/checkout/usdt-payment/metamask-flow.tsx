"use client"

import { useState, useEffect } from "react"
import { Wallet, Send, CheckCircle2, AlertCircle, Clock, ExternalLink, RefreshCw } from "lucide-react"
import { useAccount, useDisconnect, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSwitchChain } from "wagmi"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { baseSepolia } from "wagmi/chains"
import { parseUnits, formatUnits } from "viem"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import ConnectPage from "@/app/connect_wallet/page"
import { UseFormReturn } from "react-hook-form"
import { FormData } from "@/app/checkout/checkoutContent"
import axiosCustomer from "@/utils/fetch-function-customer"
import { toast } from "sonner"
import useCustomer from "@/store/customerStore"
import { PaymentPendingScreen, PaymentSuccessScreen } from "./payment-states"
import { PaymentStatus } from "../usdt-payment"

interface MetaMaskFlowProps {
  amount: number
  recipientAddress: string
  orderNo: string,
  network: any,
  form?: UseFormReturn<FormData>,
  paymentStatus?: PaymentStatus,
  setPaymentStatus?: (paymentStatus: PaymentStatus) => void
  subTotal?: number;
  totalVat?: number;
  shippingFee?: number;
}

type WalletState = "disconnected" | "connecting" | "connected" | "sending" | "success" | "error"

interface TransactionDetails {
  hash?: string
  from?: string
  to?: string
  value?: string
  gasPrice?: string
  gasLimit?: string
}

// ERC-20 ABI for transfer and balanceOf functions
const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }]
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }]
  }
] as const

// USDC contract address on Base Sepolia
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'


export default function MetaMaskFlow({ amount, recipientAddress, orderNo, network, form, paymentStatus, setPaymentStatus, subTotal, totalVat, shippingFee }: MetaMaskFlowProps) {
  const [walletState, setWalletState] = useState<WalletState>("disconnected")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [balance, setBalance] = useState<string>("0")
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  // const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle")
  const searchParams = useSearchParams()
  const storeCode = searchParams.get('storeCode') || ''
  const { customer } = useCustomer()
  const router = useRouter()
  const { address, isConnected, isConnecting, isDisconnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()


  // Read USDC balance
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: baseSepolia.id,
  })

  // Write contract for transfer
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract()

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })


  useEffect(() => {
    setPaymentStatus?.('idle')
  }, [])

  // Update balance when data changes
  useEffect(() => {
    if (balanceData) {
      setBalance(formatUnits(balanceData as bigint, 6)) // USDC has 6 decimals
    }
  }, [balanceData])

  // Update wallet state based on connection
  useEffect(() => {
    if (isDisconnected) {
      setWalletState("disconnected")
    } else if (isConnecting) {
      setWalletState("connecting")
    } else if (isConnected) {
      setWalletState("connected")
    }
  }, [isDisconnected, isConnecting, isConnected])

  // Handle transaction states
  useEffect(() => {
    if (isPending || isConfirming) {
      setWalletState("sending")
    } else if (isConfirmed) {
      setWalletState("success")
      refetchBalance() // Refresh balance after successful transaction

    } else if (isError) {
      setWalletState("error")
      setErrorMessage(error?.message || "Transaction failed")
    }
  }, [isPending, isConfirming, isConfirmed, isError, error, hash, address])

  const handleSendTransaction = async () => {
    try {
      setErrorMessage("")

      // Check if on correct network
      if (chain?.id !== baseSepolia.id) {
        try {
          await switchChain({ chainId: baseSepolia.id })
        } catch (err) {
          setErrorMessage("Please switch to Base Sepolia network in MetaMask")
          setWalletState("error")
          return
        }
      }

      // Check balance
      const requiredAmount = parseUnits(amount.toString(), 6)
      if (balanceData && (balanceData as bigint) < requiredAmount) {
        setErrorMessage(`Insufficient USDC balance. You have ${balance} USDC but need ${amount} USDC`)
        setWalletState("error")
        return
      }

      // Send transaction
      writeContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, requiredAmount],
        chainId: baseSepolia.id,
      })
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to send transaction")
      setWalletState("error")
    }
  }

  const handleRefreshBalance = async () => {
    setIsLoadingBalance(true)
    await refetchBalance()
    setIsLoadingBalance(false)
  }

  const handleReset = () => {
    setWalletState("connected")
    setErrorMessage("")
  }

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
      symbol: 'USDC',
      chain: network,
      orderNo,
      storeCode,
      entityCode: customer?.entityCode,
      txId: hash,
      username: customer?.username,
      publicAddress: recipientAddress,
      totalAmount: amount?.toFixed(2),
      subTotal: subTotal?.toFixed(2),
      taxAmount: totalVat?.toFixed(2),
      deliveryFee: shippingFee?.toFixed(2),
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

  if (!network) {
    return
  }

  if (network != 'BASE-SEPOLIA') {
    return <div className="rounded-lg bg-card p-8 border border-border shadow-sm text-center">
      <h1>You need to be on the <b>BASE-SEPOLIA</b> network</h1>
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
            network={network}
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
        paymentStatus === 'idle' && <div className="space-y-6">
          {/* Wallet Connection State */}
          {isDisconnected && (
            <div className="rounded-lg bg-card p-8 border border-border shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-secondary p-4">
                  <Wallet className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground mb-6">Connect MetaMask to proceed with the payment</p>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-full rounded-lg bg-accent text-accent-foreground font-semibold py-3 px-4 hover:bg-accent/90 transition-all">
                    Connect MetaMask
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <ConnectPage />
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Connecting State */}
          {isConnecting && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-blue-100 p-4">
                  <Clock className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Connecting Wallet</h3>
              <p className="text-sm text-blue-700">Please approve the connection in your MetaMask extension...</p>
            </div>
          )}

          {/* Connected State - Ready to Send */}
          {isConnected && walletState === "connected" && (
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
                          {parseFloat(balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })} USDC
                        </p>
                      </div>
                      <button
                        onClick={handleRefreshBalance}
                        disabled={isLoadingBalance}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <RefreshCw className={`h-4 w-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Network Warning */}
                  {chain?.id !== baseSepolia.id && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Wrong network detected. Please switch to Base Sepolia
                      </p>
                    </div>
                  )}

                  <button
                    className='text-accent underline font-semibold hover:text-accent/80 text-sm'
                    onClick={() => disconnect()}
                  >
                    Disconnect Wallet
                  </button>
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
                      {amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Network</span>
                    <span className="font-semibold text-foreground">Base Sepolia</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-muted-foreground">Order ID</span>
                    <span className="font-mono text-xs text-foreground">{orderNo}</span>
                  </div>
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendTransaction}
                disabled={isPending || parseFloat(balance) < amount}
                className="w-full rounded-lg bg-accent text-white font-semibold py-3 px-4 hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
                {parseFloat(balance) < amount ? 'Insufficient Balance' : 'Send Transaction'}
              </button>
            </div>
          )}

          {/* Sending State */}
          {walletState === "sending" && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-blue-100 p-4">
                  <Clock className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Processing Transaction</h3>
              <p className="text-sm text-blue-700 mb-4">
                {isPending ? 'Please confirm the transaction in MetaMask...' : 'Your transaction is being processed on the blockchain...'}
              </p>
              {hash && (
                <p className="text-xs text-blue-600 font-mono break-all">
                  Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
                </p>
              )}
            </div>
          )}

          {/* Success State */}
          {walletState === "success" && hash && (
            <div className="space-y-6">
              <div className="rounded-lg bg-green-50 border border-green-200 p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Transaction Successful!</h3>
                <p className="text-sm text-green-700">Your payment has been sent successfully to the blockchain.</p>
                <p className="text-xs text-green-600 mt-2">Please click &quot;I&apos;ve made the payment&quot; below to complete your order.</p>
              </div>

              {/* Transaction Details */}
              <div className="rounded-lg bg-card p-6 border border-border shadow-sm">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">TRANSACTION DETAILS</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-start py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Transaction Hash</span>
                    <a
                      href={`https://sepolia.basescan.org/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-accent transition-colors"
                    >
                      <span className="font-mono text-xs text-foreground truncate max-w-xs">
                        {hash.slice(0, 16)}...
                      </span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </a>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="font-semibold text-foreground">{amount.toFixed(2)} USDC</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Network</span>
                    <span className="font-semibold text-foreground">Base Sepolia</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-muted-foreground">Order ID</span>
                    <span className="font-mono text-xs text-foreground">{orderNo}</span>
                  </div>
                </div>

              </div>

              <button
                onClick={makepayMent}
                disabled={checkingPaymentStatus}
                className="w-full rounded-lg bg-accent text-white font-semibold py-3 px-4 hover:bg-accent-foreground/80 transition-all border "
              >
                {checkingPaymentStatus ? 'Please wait...' : "I've made the payment"}
              </button>
              {/* New Transaction Button */}
            </div>
          )}



          {/* Error State */}
          {walletState === "error" && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900">Transaction Error</h4>
                  <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                  <button
                    onClick={handleReset}
                    className="mt-4 rounded-lg bg-red-600 text-white font-semibold py-2 px-4 hover:bg-red-700 transition-all text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          {walletState === "disconnected" && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-sm text-blue-900">
                💡 <strong>Note:</strong> Make sure you have MetaMask installed, are connected to Base Sepolia network, and have sufficient USDC balance to cover the transaction. When you have completed payment, click on the &quot;I have made payment&quot; button to finalise transaction.
              </p>
            </div>
          )}
        </div>
      }
    </>
  )
}