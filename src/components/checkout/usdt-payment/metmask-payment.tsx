'use client'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import { useAccount, useDisconnect, useSendTransaction, useWaitForTransactionReceipt, useWriteContract, useReadContract, useConnect } from 'wagmi'
import { parseEther, parseUnits, encodeFunctionData, formatUnits } from 'viem'
import Link from 'next/link'
import { stepProps } from '../usdt-payment'
import { ArrowLeft } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import ConnectPage from '@/app/connect_wallet/page'


type MetamaskPaymentProps = {
    setStep : (step:stepProps)=>void,
    checkoutData : any
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
  }
] as const

// Common token addresses (example for Ethereum mainnet)
const TOKENS = {
  USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, symbol: 'USDT' },
  USDC: { address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', decimals: 6, symbol: 'USDC' },
}

const MetamaskPayment = ({checkoutData,setStep}:MetamaskPaymentProps) => {
  const [selectedToken, setSelectedToken] = useState<'USDT'|'USDC'>('USDC')
  const [recipient, setRecipient] = useState('0x19fa03190443C8bAc83Df11a771b3431c31FaA7b')
  const {connect} = useConnect()
  const {disconnect} = useDisconnect()
  const [mounted, setMounted] = useState(false)
  
  const {isConnected, address, chain} = useAccount()

  // Fetch token balance
  const { 
    data: balance,
    isError: isBalanceError,
    isLoading: isBalanceLoading,
    refetch: refetchBalance
  } = useReadContract({
    address: TOKENS[selectedToken].address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected
    }
  })

  // Format balance for display
  const formattedBalance = balance 
    ? formatUnits(balance, TOKENS[selectedToken].decimals)
    : '0'

  // Hydration fix
  useEffect(() => {
    setMounted(true)
  }, [])

  // Refetch balance when token changes
  useEffect(() => {
    if (isConnected && address) {
      refetchBalance()
    }
  }, [selectedToken, isConnected, address, refetchBalance])

  // For native ETH transactions
  const {
    data: hash,
    error: sendError,
    isPending: isSendPending,
    sendTransaction
  } = useSendTransaction()

  // For ERC-20 token transactions
  const {
    data: tokenHash,
    error: writeError,
    isPending: isWritePending,
    writeContract
  } = useWriteContract()

  const txHash = hash || tokenHash
  const error = sendError || writeError
  const isPending = isSendPending || isWritePending

  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed ,
    data
  } = useWaitForTransactionReceipt({
    hash: txHash
  })

  // Refetch balance after successful transaction
  useEffect(() => {
    if (isConfirmed) {
      refetchBalance()
    }
  }, [isConfirmed, refetchBalance])

  console.log(data);
  
  async function handleSend() {
    // Additional connection check
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    if (!checkoutData?.payingAmount || parseFloat(checkoutData?.payingAmount) <= 0) {
      alert('Invalid amount')
      return
    }

    // Check if user has sufficient balance
    const token = TOKENS[selectedToken]
    const amountInWei = parseUnits(checkoutData?.payingAmount?.toString(), token.decimals)
    
    if (balance && amountInWei > balance) {
      alert(`Insufficient ${token.symbol} balance`)
      return
    }

    try {
      writeContract({
        address: token.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, amountInWei]
      })
    } catch (err) {
      console.error('Transaction error:', err)
    }
  }

  // Don't render until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen relative flex items-center justify-center bg-gray-50 p-4'>
       <button className='absolute left-1 top-1' onClick={()=>setStep('selectMode')}>
        <ArrowLeft/>
       </button>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-4'>
        <h2 className='text-2xl font-bold text-center mb-6'>Send Transaction</h2>
        
        {/* Connection Status */}
        {isConnected && address && (
          <div className='p-3 bg-green-50 border border-green-200 rounded-md mb-4'>
            <p className='text-sm text-green-800'>
              ✓ Wallet Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </p>
            {chain && (
              <p className='text-xs text-green-600 mt-1'>
                Chain: {chain.name} (ID: {chain.id})
              </p>
            )}
          </div>
        )}

        {/* Token Selection */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Select Token
          </label>
          <select 
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value as any)}
            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          >
            {Object.entries(TOKENS).map(([key, token]) => (
              <option key={key} value={key}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>

        {/* Balance Display */}
        {isConnected && address && (
          <div className='p-3 bg-blue-50 border border-blue-200 rounded-md'>
            <p className='text-sm text-gray-700'>
              Your Balance: 
              {isBalanceLoading ? (
                <span className='ml-2 text-gray-500'>Loading...</span>
              ) : isBalanceError ? (
                <span className='ml-2 text-red-600'>Error loading balance</span>
              ) : (
                <span className='ml-2 font-bold text-blue-800'>
                  {parseFloat(formattedBalance).toFixed(2)} {TOKENS[selectedToken].symbol}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Amount Display */}
        {checkoutData?.payingAmount && (
          <div className='p-3 bg-gray-50 border border-gray-200 rounded-md'>
            <p className='text-sm text-gray-700'>
              Amount to Send: <span className='font-bold'>{checkoutData.payingAmount?.toFixed(2)} {TOKENS[selectedToken].symbol}</span>
            </p>
          </div>
        )}

        {/* Send Button */}
        <Button 
          onClick={handleSend}
          disabled={!isConnected || isPending || isConfirming || isBalanceLoading}
          className='w-full bg-accent text-white py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {!isConnected ? 'Wallet Not Connected' : 
           isPending ? 'Confirming...' : 
           isConfirming ? 'Processing...' : 
           'Send Transaction'}
        </Button>

        {/* Status Messages */}
        {txHash && (
          <div className='p-3 bg-blue-50 border border-blue-200 rounded-md'>
            <p className='text-sm text-accent'>
              Transaction Hash: <span className='font-mono text-xs break-all'>{txHash}</span>
            </p>
          </div>
        )}
        
        {isConfirmed && (
          <div className='p-3 bg-green-50 border border-green-200 rounded-md'>
            <p className='text-sm text-green-800 font-medium'>
              ✓ Transaction confirmed!
            </p>
          </div>
        )}
        
        {error && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-sm text-red-800 break-words'>
              Error: {error.message}
            </p>
          </div>
        )}

        {/* Connection Warning */}
        {!isConnected && (
          <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-md'>
            <p className='text-sm text-yellow-800 mb-2'>
              You&apos;re not connected. Please connect your wallet.
            </p>

            <Dialog>
              <DialogTrigger className='text-accent underline font-semibold hover:text-accent/80' >Connect Wallet →</DialogTrigger>
              <DialogContent>
                <ConnectPage/>
              </DialogContent>
            </Dialog>
          </div>
        )}
        {
          isConnected && address && (
            <button className='text-accent underline font-semibold hover:text-accent/80' onClick={()=>disconnect()}>Disconnect Wallet</button>
          )
        }
      </div>
    </div>
  )
}

export default MetamaskPayment