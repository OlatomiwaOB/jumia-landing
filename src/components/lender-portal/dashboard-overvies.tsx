import React, { useState } from 'react';
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useChainId } from 'wagmi';
import { formatUnits, parseUnits, Address, parseAbi, maxUint256 } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import { arcTestnet } from '@/wagmi.config';

// Contract configuration per chain
const CHAIN_CONFIG = {
  [arcTestnet.id]: {
    contractAddress: "0xa9608182f11110DC31BD8a95f2EE43546B2c9d6F" as Address,
    usdcAddress: "0x3600000000000000000000000000000000000000" as Address,
    usdcDecimals: 6,
  },
  [baseSepolia.id]: {
    contractAddress: "0xYourBaseSepoliaContract" as Address,
    usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as Address,
    usdcDecimals: 6,
  },
};

const CONTRACT_ABI = parseAbi([
  "function deposit(uint256 amount) external returns (uint256 sharesMinted)",
  "function withdraw(uint256 sharesToBurn) external",
  "function balanceOf(address user) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function fetchDashboardView() external view returns (uint256 noOfLoans, uint256 poolBalance, uint256 totalPrincipal, uint256 poolCashTotal, uint256 totalPaidToMerchant, uint256 totalReserveBalance, uint256 totalPlatformFees, uint256 totalLenderFees, uint256 totalPastDue)",
]);

const ERC20_ABI = parseAbi([
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
]);

const DashboardView = () => {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get current chain config
  const config = CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG];
  const isValidChain = !!config;

  console.log('Connected chain:', chain);

  // Write hooks
  const { writeContract, isPending, data: hash } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read hooks - only if on valid chain
  const { data: dashboardData, isLoading: isDashboardLoading, refetch: refetchDashboard } = useReadContract({
    address: config?.contractAddress,
    abi: CONTRACT_ABI,
    functionName: 'fetchDashboardView',
    query: {
      enabled: isValidChain && isConnected,
    },
  });

  const { data: userShares, refetch: refetchShares } = useReadContract({
    address: config?.contractAddress,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isValidChain && isConnected && !!address,
    },
  });

  const { data: contractDecimals } = useReadContract({
    address: config?.contractAddress,
    abi: CONTRACT_ABI,
    functionName: 'decimals',
    query: {
      enabled: isValidChain && isConnected,
    },
  });

  const { data: userBalance, refetch: refetchBalance } = useBalance({
    address: address,
    token: config?.usdcAddress,
    query: {
      enabled: isValidChain && isConnected && !!address,
    },
  });

  const { data: usdcAllowance, refetch: refetchAllowance } = useReadContract({
    address: config?.usdcAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && config ? [address, config.contractAddress] : undefined,
    query: {
      enabled: isValidChain && isConnected && !!address && !!config,
    },
  });

  const SHARE_DECIMALS = contractDecimals || 18;
  const USDC_DECIMALS = config?.usdcDecimals || 6;

  // Refresh all data
  const refreshData = () => {
    refetchDashboard();
    refetchBalance();
    refetchShares();
    refetchAllowance();
  };

  // Transform dashboard data
  const dashboard = dashboardData ? {
    noOfLoans: dashboardData[0],
    poolBalance: dashboardData[1],
    totalPrincipal: dashboardData[2],
    poolCashTotal: dashboardData[3],
    totalPaidToMerchant: dashboardData[4],
    totalReserveBalance: dashboardData[5],
    totalPlatformFees: dashboardData[6],
    totalLenderFees: dashboardData[7],
    totalPastDue: dashboardData[8],
  } : null;

  // Check if we need to approve USDC first
  const needsApproval = depositAmount && parseFloat(depositAmount) > 0
    ? !usdcAllowance || parseUnits(depositAmount, USDC_DECIMALS) > usdcAllowance
    : false;

  // ✅ FIXED: Approve with max amount for better UX and debugging
  const handleApprove = async () => {
    if (!config || !depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    console.log('=== APPROVAL DEBUG ===');
    console.log('Approving for contract:', config.contractAddress);
    console.log('USDC Token:', config.usdcAddress);
    console.log('Amount to approve:', maxUint256.toString());

    setIsProcessing(true);
    try {
      // Approve maximum amount so user doesn't need to approve again
      writeContract({
        address: config.usdcAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [config.contractAddress, maxUint256],
      });
    } catch (error: any) {
      console.error('Approval failed:', error);
      if (error.message?.includes('user rejected')) {
        alert('Approval cancelled');
      } else {
        alert(`Approval failed: ${error.shortMessage || error.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ FIXED: Deposit with proper validation and debugging
  const handleDeposit = async () => {
    if (!config || !depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const amount = parseUnits(depositAmount, USDC_DECIMALS);

    // Debug logging
    console.log('=== DEPOSIT DEBUG ===');
    console.log('Deposit Amount (input):', depositAmount);
    console.log('Deposit Amount (wei):', amount.toString());
    console.log('User Balance (wei):', userBalance?.value.toString());
    console.log('Allowance (wei):', usdcAllowance?.toString());
    console.log('Contract Address:', config.contractAddress);
    console.log('USDC Address:', config.usdcAddress);
    console.log('User Address:', address);

    // Check if user has enough balance
    if (userBalance && amount > userBalance.value) {
      alert(`Insufficient USDC balance. You have ${formatUnits(userBalance.value, USDC_DECIMALS)} USDC`);
      return;
    }

    // Check allowance again (critical check)
    if (usdcAllowance && amount > usdcAllowance) {
      alert(`Insufficient allowance. Current allowance: ${formatUnits(usdcAllowance, USDC_DECIMALS)} USDC. Please approve first.`);
      return;
    }

    setIsProcessing(true);
    try {
      writeContract({
        address: config.contractAddress,
        abi: CONTRACT_ABI,
        functionName: 'deposit',
        args: [amount],
      });
    } catch (error: any) {
      console.error('Deposit failed:', error);
      if (error.message?.includes('user rejected')) {
        alert('Transaction cancelled');
      } else {
        alert(`Deposit failed: ${error.shortMessage || error.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ FIXED: Withdraw now uses shares correctly
  const handleWithdraw = async () => {
    if (!config || !withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount of shares');
      return;
    }

    // Check if user has enough shares
    if (userShares && parseUnits(withdrawAmount, SHARE_DECIMALS) > userShares) {
      alert('Insufficient shares');
      return;
    }

    setIsProcessing(true);
    try {
      // Convert input to shares (user inputs shares directly)
      const sharesToBurn = parseUnits(withdrawAmount, SHARE_DECIMALS);
      
      writeContract({
        address: config.contractAddress,
        abi: CONTRACT_ABI,
        functionName: 'withdraw',
        args: [sharesToBurn],
      });
    } catch (error: any) {
      console.error('Withdrawal failed:', error);
      if (error.message?.includes('user rejected')) {
        alert('Transaction cancelled');
      } else {
        alert(`Withdrawal failed: ${error.shortMessage || error.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset form and refresh data when transaction is confirmed
  React.useEffect(() => {
    if (isConfirmed) {
      setDepositAmount('');
      setWithdrawAmount('');
      refreshData();
      setIsProcessing(false);
    }
  }, [isConfirmed]);

  const isLoading = isPending || isConfirming || isProcessing;

  // Get current chain name
  const getCurrentChainName = () => {
    if (chainId === arcTestnet.id) return 'Arc Testnet';
    if (chainId === baseSepolia.id) return 'Base Sepolia';
    return 'Unknown Network';
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Network Switcher */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Lender Dashboard</h1>
            <p className="text-gray-600">Manage your deposits and track protocol performance</p>
          </div>
          
          {/* Network Switcher */}
          {isConnected && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  isValidChain ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {getCurrentChainName()}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => switchChain({ chainId: arcTestnet.id })}
                  disabled={isSwitchingChain || chainId === arcTestnet.id}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    chainId === arcTestnet.id
                      ? 'bg-accent text-white cursor-default'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-accent hover:text-accent'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Arc Testnet
                </button>
                <button
                  onClick={() => switchChain({ chainId: baseSepolia.id })}
                  disabled={isSwitchingChain || chainId === baseSepolia.id}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    chainId === baseSepolia.id
                      ? 'bg-accent text-white cursor-default'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-accent hover:text-accent'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Base Sepolia
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wrong Network Warning */}
        {!isValidChain && isConnected && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Wrong Network</h3>
                <p className="text-red-800 mb-4">
                  You're connected to an unsupported network. Please switch to Arc Testnet or Base Sepolia to use this app.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => switchChain({ chainId: arcTestnet.id })}
                    disabled={isSwitchingChain}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Switch to Arc Testnet
                  </button>
                  <button
                    onClick={() => switchChain({ chainId: baseSepolia.id })}
                    disabled={isSwitchingChain}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Switch to Base Sepolia
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Status */}
        {(isPending || isConfirming) && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                <div>
                  <p className="font-medium text-blue-800">
                    {isPending ? 'Waiting for wallet confirmation...' : 'Transaction confirming...'}
                  </p>
                  <p className="text-sm text-blue-600">
                    {hash && `TX: ${hash.slice(0, 10)}...${hash.slice(-8)}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isConfirmed && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="font-medium text-green-800">Transaction confirmed successfully!</p>
            </div>
          </div>
        )}

        {/* Only show main content if on valid chain */}
        {isValidChain ? (
          <>
            {/* User Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Wallet USDC</h3>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {userBalance ? parseFloat(formatUnits(userBalance.value, userBalance.decimals)).toFixed(2) : '0.00'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Available to deposit</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Pool Shares</h3>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {userShares ? parseFloat(formatUnits(userShares, SHARE_DECIMALS)).toFixed(4) : '0.0000'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Your ownership in pool</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Estimated Value</h3>
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {userShares ? parseFloat(formatUnits(userShares, SHARE_DECIMALS)).toFixed(2) : '0.00'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Withdrawable share (approx)</p>
              </div>
            </div>

            {/* Main Action Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  {/* Tabs */}
                  <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
                    <button
                      onClick={() => setActiveTab('deposit')}
                      className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                        activeTab === 'deposit'
                          ? 'bg-white text-accent shadow-md'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Deposit USDC
                    </button>
                    <button
                      onClick={() => setActiveTab('withdraw')}
                      className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                        activeTab === 'withdraw'
                          ? 'bg-white text-accent shadow-md'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Withdraw Shares
                    </button>
                  </div>

                  {/* Deposit Tab */}
                  {activeTab === 'deposit' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount to Deposit (USDC)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            disabled={isLoading}
                          />
                          <button
                            onClick={() => setDepositAmount(userBalance ? formatUnits(userBalance.value, userBalance.decimals) : '0')}
                            disabled={isLoading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors disabled:opacity-50"
                          >
                            MAX
                          </button>
                        </div>
                      </div>

                      {needsApproval && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div className="text-sm text-amber-800">
                              <p className="font-medium mb-1">Approval Required</p>
                              <p>You need to approve the contract to spend your USDC before depositing.</p>
                              <p className="text-xs mt-2">
                                Current allowance: {usdcAllowance ? formatUnits(usdcAllowance, USDC_DECIMALS) : '0'} USDC
                              </p>
                            </div>
                          </div>
                        </div>
                      )}


                      {needsApproval ? (
                        <button
                          onClick={handleApprove}
                          disabled={isLoading || !depositAmount}
                          className="w-full py-4  bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                        >
                          {isLoading ? 'Approving...' : '🔓 Approve USDC First'}
                        </button>
                      ) : (
                        <button
                          onClick={handleDeposit}
                          disabled={isLoading || !depositAmount}
                          className="w-full py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                        >
                          {isLoading ? 'Depositing...' : '💰 Deposit USDC'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Withdraw Tab */}
                  {activeTab === 'withdraw' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shares to Withdraw
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="0.0000"
                            step="0.0001"
                            className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            disabled={isLoading}
                          />
                          <button
                            onClick={() => {
                              if (userShares) {
                                setWithdrawAmount(formatUnits(userShares, SHARE_DECIMALS));
                              }
                            }}
                            disabled={isLoading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors disabled:opacity-50"
                          >
                            MAX
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Your shares: {userShares ? parseFloat(formatUnits(userShares, SHARE_DECIMALS)).toFixed(4) : '0.0000'}
                        </p>
                      </div>

                      <button
                        onClick={handleWithdraw}
                        disabled={isLoading || !withdrawAmount}
                        className="w-full py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                      >
                        {isLoading ? 'Withdrawing...' : 'Withdraw Shares'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Total Loans</span>
                      <span className="font-semibold text-gray-800">
                        {dashboard ? dashboard.noOfLoans.toString() : '...'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Pool TVL</span>
                      <span className="font-semibold text-gray-800">
                        ${dashboard ? parseFloat(formatUnits(dashboard.poolBalance, USDC_DECIMALS)).toLocaleString() : '...'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Available Cash</span>
                      <span className="font-semibold text-green-600">
                        ${dashboard ? parseFloat(formatUnits(dashboard.poolCashTotal, USDC_DECIMALS)).toLocaleString() : '...'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Past Due</span>
                      <span className="font-semibold text-red-600">
                        ${dashboard ? parseFloat(formatUnits(dashboard.totalPastDue, USDC_DECIMALS)).toLocaleString() : '...'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={refreshData}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-medium transition-all shadow-sm disabled:opacity-50"
                >
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Protocol Overview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Protocol Overview</h2>
              
              {isDashboardLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : dashboard ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
                    <p className="text-sm font-medium text-blue-700 mb-1">Total Principal</p>
                    <p className="text-2xl font-bold text-blue-900">
                      ${parseFloat(formatUnits(dashboard.totalPrincipal, USDC_DECIMALS)).toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Outstanding loans</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
                    <p className="text-sm font-medium text-green-700 mb-1">Reserve Balance</p>
                    <p className="text-2xl font-bold text-green-900">
                      ${parseFloat(formatUnits(dashboard.totalReserveBalance, USDC_DECIMALS)).toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">Safety buffer</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5">
                    <p className="text-sm font-medium text-purple-700 mb-1">Lender Fees</p>
                    <p className="text-2xl font-bold text-purple-900">
                      ${parseFloat(formatUnits(dashboard.totalLenderFees, USDC_DECIMALS)).toLocaleString()}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">Total earned</p>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-5">
                    <p className="text-sm font-medium text-indigo-700 mb-1">Platform Fees</p>
                    <p className="text-2xl font-bold text-indigo-900">
                      ${parseFloat(formatUnits(dashboard.totalPlatformFees, USDC_DECIMALS)).toLocaleString()}
                    </p>
                    <p className="text-xs text-indigo-600 mt-1">Protocol revenue</p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-12">Unable to load dashboard data</p>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default DashboardView;