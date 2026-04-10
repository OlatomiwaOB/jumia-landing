// utils/tronUtils.ts

/**
 * Common TRC20 token addresses
 */
export const TOKEN_ADDRESSES = {
  // MAINNET
  MAINNET: {
    USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    USDC: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8',
    USDD: 'TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn',
  },
  // NILE TESTNET
  NILE: {
    USDT: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj',
    // Add more testnet tokens as needed
  },
  // SHASTA TESTNET
  SHASTA: {
    USDT: 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs',
    // Add more testnet tokens as needed
  }
};

/**
 * Standard TRC20 ABI for common operations
 */
export const TRC20_ABI = [
  {
    outputs: [{ type: 'bool' }],
    constant: false,
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' }
    ],
    name: 'transfer',
    stateMutability: 'Nonpayable',
    type: 'Function'
  },
  {
    outputs: [{ type: 'uint256' }],
    constant: true,
    inputs: [{ name: 'who', type: 'address' }],
    name: 'balanceOf',
    stateMutability: 'View',
    type: 'Function'
  },
  {
    outputs: [{ type: 'string' }],
    constant: true,
    name: 'name',
    stateMutability: 'View',
    type: 'Function'
  },
  {
    outputs: [{ type: 'string' }],
    constant: true,
    name: 'symbol',
    stateMutability: 'View',
    type: 'Function'
  },
  {
    outputs: [{ type: 'uint8' }],
    constant: true,
    name: 'decimals',
    stateMutability: 'View',
    type: 'Function'
  },
  {
    outputs: [{ type: 'uint256' }],
    constant: true,
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    stateMutability: 'View',
    type: 'Function'
  },
  {
    outputs: [{ type: 'bool' }],
    constant: false,
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' }
    ],
    name: 'approve',
    stateMutability: 'Nonpayable',
    type: 'Function'
  }
];

/**
 * Convert TRX to SUN (smallest unit)
 * 1 TRX = 1,000,000 SUN
 */
export const trxToSun = (trx: number | string): number => {
  return Math.floor(Number(trx) * 1_000_000);
};

/**
 * Convert SUN to TRX
 */
export const sunToTrx = (sun: number | string): number => {
  return Number(sun) / 1_000_000;
};

/**
 * Convert token amount to smallest unit based on decimals
 */
export const toSmallestUnit = (amount: number | string, decimals: number): string => {
  const multiplier = BigInt(10 ** decimals);
  const amountBigInt = BigInt(Math.floor(Number(amount) * (10 ** decimals)));
  return amountBigInt.toString();
};

/**
 * Convert from smallest unit to readable amount
 */
export const fromSmallestUnit = (amount: number | string | bigint, decimals: number): number => {
  // Handle BigInt conversion
  const amountStr = typeof amount === 'bigint' ? amount.toString() : String(amount);
  const amountNum = Number(amountStr);
  const divisor = Math.pow(10, decimals);
  return amountNum / divisor;
};

/**
 * Format Tron address (shorten for display)
 */
export const formatAddress = (address: string, startChars = 6, endChars = 4): string => {
  if (!address) return '';
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Get TRC20 token balance
 */
export const getTokenBalance = async (
  tronWeb: any,
  tokenAddress: string,
  walletAddress: string
): Promise<number> => {
  try {
    const contract = await tronWeb.contract(TRC20_ABI, tokenAddress);
    const balance = await contract.balanceOf(walletAddress).call();
    const decimals = await contract.decimals().call();
    
    // Handle BigInt conversion
    const balanceStr = typeof balance === 'bigint' ? balance.toString() : String(balance);
    const decimalsNum = typeof decimals === 'bigint' ? Number(decimals) : Number(decimals);
    
    return fromSmallestUnit(balanceStr, decimalsNum);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
};

/**
 * Get TRX balance
 */
export const getTrxBalance = async (
  tronWeb: any,
  address: string
): Promise<number> => {
  try {
    const balance = await tronWeb.trx.getBalance(address);
    return sunToTrx(balance);
  } catch (error) {
    console.error('Error fetching TRX balance:', error);
    return 0;
  }
};

/**
 * Send TRX transaction
 */
export const sendTrx = async (
  tronWeb: any,
  toAddress: string,
  amount: number | string
): Promise<{ success: boolean; txId?: string; error?: string }> => {
  try {
    if (!tronWeb.isAddress(toAddress)) {
      throw new Error('Invalid recipient address');
    }

    const amountInSun = trxToSun(amount);
    const transaction = await tronWeb.trx.sendTransaction(toAddress, amountInSun);

    if (transaction.result) {
      return {
        success: true,
        txId: transaction.txid || transaction.transaction?.txID,
      };
    } else {
      throw new Error('Transaction failed');
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Transaction failed',
    };
  }
};

/**
 * Send TRC20 token transaction
 */
export const sendToken = async (
  tronWeb: any,
  tokenAddress: string,
  toAddress: string,
  amount: number | string,
  decimals: number = 6
): Promise<{ success: boolean; txId?: string; error?: string }> => {
  try {
    if (!tronWeb.isAddress(toAddress)) {
      throw new Error('Invalid recipient address');
    }

    const contract = await tronWeb.contract(TRC20_ABI, tokenAddress);
    const amountInSmallestUnit = toSmallestUnit(amount, decimals);

    const transaction = await contract.transfer(toAddress, amountInSmallestUnit).send({
      feeLimit: 100_000_000, // 100 TRX fee limit
      callValue: 0,
      shouldPollResponse: true,
    });

    return {
      success: true,
      txId: transaction,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Transaction failed',
    };
  }
};

/**
 * Get token info (name, symbol, decimals)
 */
export const getTokenInfo = async (
  tronWeb: any,
  tokenAddress: string
): Promise<{ name: string; symbol: string; decimals: number } | null> => {
  try {
    const contract = await tronWeb.contract(TRC20_ABI, tokenAddress);
    const [name, symbol, decimals] = await Promise.all([
      contract.name().call(),
      contract.symbol().call(),
      contract.decimals().call(),
    ]);

    return {
      name,
      symbol,
      decimals: Number(decimals),
    };
  } catch (error) {
    console.error('Error fetching token info:', error);
    return null;
  }
};

/**
 * Validate Tron address
 */
export const isValidTronAddress = (address: string): boolean => {
  if (typeof window === 'undefined' || !window.tronWeb) {
    // Basic validation without tronWeb
    return /^T[A-Za-z1-9]{33}$/.test(address);
  }
  return window.tronWeb.isAddress(address);
};

/**
 * Get transaction details from TronScan (supports testnet)
 */
export const getTronScanUrl = (
  txId: string, 
  type: 'transaction' | 'address' = 'transaction',
  network: 'mainnet' | 'nile' | 'shasta' = 'mainnet'
): string => {
  const baseUrls = {
    mainnet: 'https://tronscan.org',
    nile: 'https://nile.tronscan.org',
    shasta: 'https://shasta.tronscan.org'
  };
  return `${baseUrls[network]}/#/${type}/${txId}`;
};

/**
 * Wait for transaction confirmation
 */
export const waitForConfirmation = async (
  tronWeb: any,
  txId: string,
  maxAttempts: number = 30
): Promise<boolean> => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const tx = await tronWeb.trx.getTransaction(txId);
      if (tx && tx.ret && tx.ret[0].contractRet === 'SUCCESS') {
        return true;
      }
    } catch (error) {
      // Transaction not found yet
    }
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  }
  return false;
};

/**
 * Estimate transaction fee (approximate)
 */
export const estimateFee = {
  trx: 0, // TRX transfers are free (uses bandwidth)
  trc20: 5, // TRC20 transfers typically cost 5-15 TRX
};

export default {
  TOKEN_ADDRESSES,
  TRC20_ABI,
  trxToSun,
  sunToTrx,
  toSmallestUnit,
  fromSmallestUnit,
  formatAddress,
  getTokenBalance,
  getTrxBalance,
  sendTrx,
  sendToken,
  getTokenInfo,
  isValidTronAddress,
  getTronScanUrl,
  waitForConfirmation,
  estimateFee,
};