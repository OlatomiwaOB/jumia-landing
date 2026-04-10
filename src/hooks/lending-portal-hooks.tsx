/**
 * Lending Protocol Contract Interaction with Wagmi
 * 
 * Contract Address: 0x8b470D6f81d87d9cdcAcd1F96c577913947a4b2f
 * 
 * This module provides React hooks for interacting with a decentralized lending protocol.
 * The protocol facilitates loans between borrowers, merchants, and lenders with a pooled liquidity model.
 * 
 * HOOK TYPES:
 * - Write Hooks: Functions that modify blockchain state (require gas and wallet signatures)
 * - Read Hooks: Functions that only read data from the blockchain (no gas required)
 * 
 * All write hooks return:
 * - The main function to call
 * - hash: Transaction hash (available after user confirms)
 * - isPending: True when waiting for user confirmation in wallet
 * - isConfirming: True when transaction is being mined
 * - isSuccess: True when transaction is confirmed on-chain
 * - error: Error object if transaction fails
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Address, parseAbi } from 'viem';

// Contract configuration
export const CONTRACT_ADDRESS: Address = "0xa9608182f11110DC31BD8a95f2EE43546B2c9d6F";

export const CONTRACT_ABI = parseAbi([
  "function deposit(address token,uint256 amount) external returns (uint256 sharesMinted)",
  "function withdraw(address token,uint256 sharesToBurn) external",
  "function setWhitelist(address user, bool status) external",
  "function repayLoan(bytes32 ref, uint256 amount) external",
  "function withdrawMerchantFund(address token) external",
  "function setFeeRate(uint256 platformFeeRate, uint256 lenderFeeRate,uint256 bp) external",
  "function setDepositContributionPercent(uint256 depositContributionPercent) external",
  "function markDefault(bytes32 ref) external",
  "function writeOffLoan(bytes32 ref) external",
  "function getMerchantFund(address merchant, address token) external view returns (uint256)",
  "function withdrawPlatformFees(uint256 amount,address token) external",
  "function createLoan(bytes32 ref,address token, address merchant, uint256 principal,uint256 fee, uint256 depositAmount, address borrower, uint256 maturitySeconds) external",
  "function getLoanData(bytes32 ref) external view returns (address borrower, address token, uint256 principal, uint256 outstanding, uint256 totalPaid,uint256 maturityDate,string memory status)",
  "function fetchDashboardView() external view returns (uint256 noOfLoans, uint256 poolBalance, uint256 totalPrincipal, uint256 poolCashTotal, uint256 totalPaidToMerchant, uint256 totalReserveBalance, uint256 totalPlatformFees, uint256 totalLenderFees, uint256 totalPastDue)",
]);

// Type definitions
export interface LoanData {
  borrower: Address;
  token: Address;
  principal: bigint;
  outstanding: bigint;
  totalPaid: bigint;
  maturityDate: bigint;
  status: string;
}

export interface DashboardView {
  noOfLoans: bigint;
  poolBalance: bigint;
  totalPrincipal: bigint;
  poolCashTotal: bigint;
  totalPaidToMerchant: bigint;
  totalReserveBalance: bigint;
  totalPlatformFees: bigint;
  totalLenderFees: bigint;
  totalPastDue: bigint;
}

// ============= CUSTOM HOOKS FOR WRITE FUNCTIONS =============

/**
 * Hook for depositing tokens into the lending pool
 * 
 * PURPOSE: Allows lenders to deposit tokens and receive shares representing their portion of the pool
 * 
 * FUNCTION: deposit(token, amount)
 * @param token - Address of the ERC20 token contract to deposit (e.g., USDC, DAI)
 *                Example: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" (USDC on mainnet)
 * @param amount - Amount to deposit in the token's smallest unit (wei for ETH, or token decimals)
 *                 Example: For 100 USDC (6 decimals): BigInt("100000000")
 *                 Example: For 1 ETH (18 decimals): BigInt("1000000000000000000")
 * 
 * RETURNS:
 * - deposit: Function to call to initiate deposit
 * - hash: Transaction hash once user confirms (use to track on block explorer)
 * - isPending: true when waiting for user to confirm in MetaMask
 * - isConfirming: true when transaction is being mined on blockchain
 * - isSuccess: true when transaction is confirmed and complete
 * - error: Contains error details if transaction fails
 * 
 * NOTES:
 * - User must first approve the contract to spend their tokens
 * - Returns shares that represent ownership in the lending pool
 * - Shares can later be burned to withdraw proportional assets
 */
export function useDeposit() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const deposit = (token: Address, amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'deposit',
      args: [token, amount],
    });
  };

  return {
    deposit,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for withdrawing tokens from the lending pool
 * 
 * PURPOSE: Allows lenders to burn their pool shares and withdraw their proportional assets
 * 
 * FUNCTION: withdraw(token, sharesToBurn)
 * @param token - Address of the ERC20 token to withdraw
 *                Must match the token you originally deposited
 *                Example: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
 * @param sharesToBurn - Amount of shares to burn to withdraw funds
 *                       You received these shares when you deposited
 *                       Example: BigInt("1000000000000000000") to burn 1 share
 * 
 * RETURNS: Same as useDeposit (hash, isPending, isConfirming, isSuccess, error)
 * 
 * NOTES:
 * - Shares represent your percentage ownership of the pool
 * - Burning shares returns your proportional amount of the underlying token
 * - If pool has grown (from interest/fees), you get more than you deposited
 * - If pool has losses, you may get less than you deposited
 */
export function useWithdraw() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const withdraw = (token: Address, sharesToBurn: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'withdraw',
      args: [token, sharesToBurn],
    });
  };

  return {
    withdraw,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for setting whitelist status (Admin only)
 * 
 * PURPOSE: Controls who can participate in the protocol (KYC/access control)
 * 
 * FUNCTION: setWhitelist(user, status)
 * @param user - Ethereum address of the user to whitelist/unwhitelist
 *               Example: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
 * @param status - Boolean flag: true to whitelist, false to remove from whitelist
 *                 true = user can now interact with protocol
 *                 false = user loses access to protocol functions
 * 
 * RETURNS: Same as useDeposit (hash, isPending, isConfirming, isSuccess, error)
 * 
 * NOTES:
 * - Only contract owner/admin can call this function
 * - Useful for regulatory compliance and KYC requirements
 * - Non-whitelisted users will be rejected when trying to borrow/lend
 */
export function useSetWhitelist() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const setWhitelist = (user: Address, status: boolean) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'setWhitelist',
      args: [user, status],
    });
  };

  return {
    setWhitelist,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for repaying a loan
 * 
 * PURPOSE: Allows borrowers to pay back their loans (principal + interest)
 * 
 * FUNCTION: repayLoan(ref, amount)
 * @param ref - Unique loan identifier (bytes32 hash)
 *              This is assigned when the loan is created
 *              Example: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
 *              Usually generated using keccak256 of loan details
 * @param amount - Amount to repay in the token's smallest unit
 *                 Can be partial payment or full payment
 *                 Example: BigInt("50000000") to repay 50 USDC (6 decimals)
 * 
 * RETURNS: Same as useDeposit (hash, isPending, isConfirming, isSuccess, error)
 * 
 * NOTES:
 * - Borrower must approve contract to spend repayment tokens first
 * - Can make multiple partial payments until loan is fully repaid
 * - Reduces the "outstanding" balance on the loan
 * - May include interest/fees depending on loan terms
 */
export function useRepayLoan() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const repayLoan = (ref: `0x${string}`, amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'repayLoan',
      args: [ref, amount],
    });
  };

  return {
    repayLoan,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for withdrawing merchant funds
 * 
 * PURPOSE: Allows merchants to withdraw their accumulated earnings from facilitated loans
 * 
 * FUNCTION: withdrawMerchantFund(token)
 * @param token - Address of the token to withdraw
 *                Must match a token that merchant has earned fees in
 *                Example: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" (USDC)
 * 
 * RETURNS: Same as useDeposit (hash, isPending, isConfirming, isSuccess, error)
 * 
 * NOTES:
 * - Merchants earn fees when borrowers use their platform to get loans
 * - This withdraws the merchant's entire accumulated balance for that token
 * - Check balance first using useGetMerchantFund() hook
 * - Only the merchant wallet can withdraw their own funds
 */
export function useWithdrawMerchantFund() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const withdrawMerchantFund = (token: Address) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'withdrawMerchantFund',
      args: [token],
    });
  };

  return {
    withdrawMerchantFund,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for setting fee rates (Admin only)
 * 
 * PURPOSE: Configure how fees are split between platform and lenders
 * 
 * FUNCTION: setFeeRate(platformFeeRate, lenderFeeRate, bp)
 * @param platformFeeRate - Percentage of interest that goes to protocol
 *                          In basis points (1 bp = 0.01%)
 *                          Example: BigInt("500") = 5% goes to platform
 * @param lenderFeeRate - Percentage of interest that goes to lenders
 *                        In basis points (1 bp = 0.01%)
 *                        Example: BigInt("9500") = 95% goes to lenders
 * @param bp - Total basis points denominator (usually 10000 for percentages)
 *             Example: BigInt("10000") means rates are out of 100%
 *             So 500/10000 = 5%, 9500/10000 = 95%
 * 
 * RETURNS: Same as useDeposit (hash, isPending, isConfirming, isSuccess, error)
 * 
 * NOTES:
 * - Only contract admin can modify fee rates
 * - platformFeeRate + lenderFeeRate should typically equal bp (10000)
 * - Changes apply to new loans, not existing ones
 * - Example: 5% platform, 95% lenders means for $100 interest:
 *   Platform gets $5, lenders get $95
 */
export function useSetFeeRate() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const setFeeRate = (platformFeeRate: bigint, lenderFeeRate: bigint, bp: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'setFeeRate',
      args: [platformFeeRate, lenderFeeRate, bp],
    });
  };

  return {
    setFeeRate,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for setting deposit contribution percentage (Admin only)
 * 
 * PURPOSE: Configure what percentage of borrower deposits go into the pool reserves
 * 
 * FUNCTION: setDepositContributionPercent(percent)
 * @param percent - Percentage in basis points (1 bp = 0.01%)
 *                  Example: BigInt("2000") = 20% of borrower deposits go to reserves
 *                  The rest stays with the borrower or goes elsewhere
 * 
 * RETURNS: Same as useDeposit (hash, isPending, isConfirming, isSuccess, error)
 * 
 * NOTES:
 * - Only contract admin can call this
 * - Affects how borrower deposits are allocated
 * - Higher percentage = more protection for lenders (reserve buffer)
 * - Lower percentage = borrowers keep more of their deposit
 * - Example: 20% means if borrower deposits $100, $20 goes to pool reserves
 */
export function useSetDepositContributionPercent() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const setDepositContributionPercent = (percent: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'setDepositContributionPercent',
      args: [percent],
    });
  };

  return {
    setDepositContributionPercent,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for marking a loan as default (Admin only)
 * 
 * PURPOSE: Flag a loan as defaulted when borrower fails to repay
 * 
 * FUNCTION: markDefault(ref)
 * @param ref - Unique loan identifier (bytes32 hash)
 *              Same ref used when loan was created
 *              Example: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
 * 
 * RETURNS: Same as useDeposit (hash, isPending, isConfirming, isSuccess, error)
 * 
 * NOTES:
 * - Only contract admin can mark loans as default
 * - Usually done when loan is past maturity date and unpaid
 * - Changes loan status to "DEFAULT"
 * - Triggers accounting changes in the protocol
 * - May trigger collection processes or write-offs
 * - Check loan status first with useGetLoanData()
 */
export function useMarkDefault() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const markDefault = (ref: `0x${string}`) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'markDefault',
      args: [ref],
    });
  };

  return {
    markDefault,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for writing off a loan (Admin only)
 * 
 * PURPOSE: Remove uncollectible debt from the books (accounting write-off)
 * 
 * FUNCTION: writeOffLoan(ref)
 * @param ref - Unique loan identifier (bytes32 hash)
 *              Must be a loan that has already been marked as default
 *              Example: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
 * 
 * RETURNS: Same as useDeposit (hash, isPending, isConfirming, isSuccess, error)
 * 
 * NOTES:
 * - Only contract admin can write off loans
 * - Should only be done after exhausting collection efforts
 * - Removes outstanding balance from pool's expected receivables
 * - Impacts pool accounting and lender returns
 * - Usually loan must be in DEFAULT status first (use markDefault)
 * - Permanent action - cannot be undone
 */
export function useWriteOffLoan() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const writeOffLoan = (ref: `0x${string}`) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'writeOffLoan',
      args: [ref],
    });
  };

  return {
    writeOffLoan,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for withdrawing platform fees (Admin only)
 * 
 * PURPOSE: Allows protocol operator to extract accumulated platform fees
 * 
 * FUNCTION: withdrawPlatformFees(amount, token)
 * @param amount - Amount of fees to withdraw in token's smallest unit
 *                 Example: BigInt("1000000") = 1 USDC (6 decimals)
 *                 Check available balance with useFetchDashboardView() first
 * @param token - Address of the token to withdraw fees in
 *                Example: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" (USDC)
 * 
 * RETURNS: Same as useDeposit (hash, isPending, isConfirming, isSuccess, error)
 * 
 * NOTES:
 * - Only contract admin/owner can call this
 * - Fees accumulate from platformFeeRate on loan interest
 * - Check totalPlatformFees in dashboard before withdrawing
 * - Cannot withdraw more than accumulated fees
 * - These are the protocol's earnings/revenue
 */
export function useWithdrawPlatformFees() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const withdrawPlatformFees = (amount: bigint, token: Address) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'withdrawPlatformFees',
      args: [amount, token],
    });
  };

  return {
    withdrawPlatformFees,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for creating a new loan (Admin only)
 * 
 * PURPOSE: Originate a new loan in the system with all terms defined
 * 
 * FUNCTION: createLoan(ref, token, merchant, principal, fee, depositAmount, borrower, maturitySeconds)
 * @param ref - Unique loan identifier (bytes32 hash) - must be unique across all loans
 *              Generate using: keccak256(abi.encodePacked(borrower, timestamp, nonce))
 *              Example: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
 * 
 * @param token - Address of the token for this loan (what borrower receives/repays)
 *                Example: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" (USDC)
 * 
 * @param merchant - Address of merchant facilitating this loan
 *                   Merchant earns fees when borrower repays
 *                   Example: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
 * 
 * @param principal - Loan amount borrower receives (in token's smallest unit)
 *                    Example: BigInt("1000000000") = 1000 USDC (6 decimals)
 * 
 * @param fee - Interest/fee amount borrower must pay on top of principal
 *              Example: BigInt("50000000") = 50 USDC fee (5% of 1000 USDC)
 * 
 * @param depositAmount - Collateral/deposit borrower must provide upfront
 *                        Provides security for lenders
 *                        Example: BigInt("200000000") = 200 USDC deposit (20% of principal)
 * 
 * @param borrower - Ethereum address of the borrower receiving the loan
 *                   Example: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
 * 
 * @param maturitySeconds - Loan duration in seconds from creation
 *                          Example: BigInt("2592000") = 30 days (30 * 24 * 60 * 60)
 *                          Example: BigInt("7776000") = 90 days
 * 
 * RETURNS: Same as useDeposit (hash, isPending, isConfirming, isSuccess, error)
 * 
 * NOTES:
 * - Only contract admin can create loans
 * - Pool must have sufficient liquidity for principal amount
 * - Borrower must be whitelisted (if whitelist is enabled)
 * - Total outstanding = principal + fee
 * - Maturity date = current timestamp + maturitySeconds
 * - ref must be unique - transaction reverts if ref already exists
 */
export function useCreateLoan() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createLoan = (
    ref: `0x${string}`,
    token: Address,
    merchant: Address,
    principal: bigint,
    fee: bigint,
    depositAmount: bigint,
    borrower: Address,
    maturitySeconds: bigint
  ) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'createLoan',
      args: [ref, token, merchant, principal, fee, depositAmount, borrower, maturitySeconds],
    });
  };

  return {
    createLoan,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// ============= CUSTOM HOOKS FOR READ FUNCTIONS =============

/**
 * Hook for reading merchant fund balance
 * 
 * PURPOSE: Check how much a merchant has earned and can withdraw
 * 
 * FUNCTION: Called automatically when component renders (no manual call needed)
 * @param merchant - Merchant's Ethereum address
 *                   Example: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
 * @param token - Token address to check balance for
 *                Example: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" (USDC)
 * 
 * RETURNS:
 * - data: Merchant's available balance as bigint
 *         Example: 50000000n = 50 USDC (6 decimals)
 * - isLoading: true while fetching data
 * - isError: true if read failed
 * - error: Error details if failed
 * - refetch: Function to manually refresh data
 * 
 * NOTES:
 * - Read-only operation (no gas cost, no wallet signature needed)
 * - Data auto-updates when blockchain state changes
 * - Returns 0 if merchant has no balance
 * - Pass undefined to merchant/token to disable the query
 * 
 * USAGE:
 * const { data: balance, isLoading } = useGetMerchantFund(merchantAddress, tokenAddress);
 */
export function useGetMerchantFund(merchant?: Address, token?: Address) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getMerchantFund',
    args: merchant && token ? [merchant, token] : undefined,
    query: {
      enabled: Boolean(merchant && token),
    },
  });
}

/**
 * Hook for reading loan data
 * @param ref - Loan reference (bytes32)
 * @returns Wagmi read contract hook with loan data
 */
export function useGetLoanData(ref?: `0x${string}`) {
  const result = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getLoanData',
    args: ref ? [ref] : undefined,
    query: {
      enabled: Boolean(ref),
    },
  });

  // Transform the result to a more friendly format
  const loanData: LoanData | undefined = result.data
    ? {
        borrower: result.data[0],
        token: result.data[1],
        principal: result.data[2],
        outstanding: result.data[3],
        totalPaid: result.data[4],
        maturityDate: result.data[5],
        status: result.data[6],
      }
    : undefined;

  return {
    ...result,
    data: loanData,
  };
}

/**
 * Hook for reading dashboard view with aggregate data
 * @returns Wagmi read contract hook with dashboard metrics
 */
export function useFetchDashboardView() {
  const result = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'fetchDashboardView',
  });

  // Transform the result to a more friendly format
  const dashboardData: DashboardView | undefined = result.data
    ? {
        noOfLoans: result.data[0],
        poolBalance: result.data[1],
        totalPrincipal: result.data[2],
        poolCashTotal: result.data[3],
        totalPaidToMerchant: result.data[4],
        totalReserveBalance: result.data[5],
        totalPlatformFees: result.data[6],
        totalLenderFees: result.data[7],
        totalPastDue: result.data[8],
      }
    : undefined;

  return {
    ...result,
    data: dashboardData,
  };
}