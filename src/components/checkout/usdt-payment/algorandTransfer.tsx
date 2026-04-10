import React, { useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';
import { DollarSign, Send, Loader2, CheckCircle, XCircle, Wallet, CheckCircle2 } from 'lucide-react';

// USDC Asset ID on Algorand TestNet
const USDC_ASSET_ID = 10458941;

// USDC has 6 decimals
const USDC_DECIMALS = 6;

interface AlgorandTransferProps {
  amount: any
  orderNo: any
  subTotal?: number;
  totalVat?: number;
  shippingFee?: number;
}

function AlgorandUSDCSender({ amount, orderNo }: AlgorandTransferProps) {
  const { activeAddress, signTransactions, algodClient, wallets, activeWallet } = useWallet();

  const [recipient, setRecipient] = useState('NLA4YTGZYFH6QMDBYRMMX724BIP2ZIBGXKVNV4PGCNZSYXR2RKWVERERK4');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [txId, setTxId] = useState('');

  // Use ref to capture activeAddress reliably
  const addressRef = React.useRef(activeAddress);

  React.useEffect(() => {
    addressRef.current = activeAddress;
  }, [activeAddress]);

  // Debug: Log wallet connection status
  React.useEffect(() => {
    console.log('Wallet Status:', {
      activeAddress,
      activeWallet: activeWallet?.id,
      algodClient: !!algodClient,
      wallets: wallets.map(w => ({ id: w.id, isActive: w.isActive, accounts: w.accounts }))
    });
  }, [activeAddress, activeWallet, algodClient, wallets]);

  const handleSendUSDC = async () => {
    // Use the ref value instead of state
    const senderAddress = addressRef.current;


    if (!algodClient) {
      console.error('FAILED: No algod client');
      setStatus({ type: 'error', message: 'Algod client not initialized' });
      return;
    }

    // if (!recipient || !amount) {
    //   console.error('FAILED: Missing recipient or amount');
    //   setStatus({ type: 'error', message: 'Please fill in all required fields' });
    //   return;
    // }

    // Validate Algorand address
    console.log('Validating recipient address:', recipient);
    if (!algosdk.isValidAddress(recipient)) {
      console.error('FAILED: Invalid recipient address');
      setStatus({ type: 'error', message: 'Invalid recipient address' });
      return;
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    console.log('Parsed amount:', amountNum);
    if (isNaN(amountNum) || amountNum <= 0) {
      console.error('FAILED: Invalid amount');
      setStatus({ type: 'error', message: 'Invalid amount' });
      return;
    }

    setLoading(true);
    setStatus(null);
    setTxId('');

    try {
      // Get suggested params
      console.log('Getting suggested params...');
      const suggestedParams = await algodClient.getTransactionParams().do();
      console.log('Suggested Params:', suggestedParams);

      // Convert USDC amount to base units (multiply by 10^6)
      const amountInBaseUnits = Math.round(amountNum * Math.pow(10, USDC_DECIMALS));
      console.log('Amount in base units:', amountInBaseUnits);

      // CRITICAL: Log all transaction parameters before creation
      console.log('Creating transaction with params:', {
        sender: senderAddress,
        receiver: recipient,
        amount: amountInBaseUnits,
        assetIndex: USDC_ASSET_ID,
        note: note || 'none',
        suggestedParams
      });

      // Create asset transfer transaction - for algosdk v3.5.2
      const transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: senderAddress,
        receiver: recipient,
        amount: amountInBaseUnits,
        assetIndex: USDC_ASSET_ID,
        note: note ? new TextEncoder().encode(note) : undefined,
        suggestedParams
      });

      console.log('Transaction created successfully:', transaction);
      console.log('Transaction sender:', transaction.sender);

      // Sign transaction - encode as Uint8Array for @txnlab/use-wallet-react
      console.log('Attempting to sign transaction...');

      // Encode the transaction to Uint8Array
      const encodedTx = algosdk.encodeUnsignedTransaction(transaction);

      // Sign the encoded transaction - @txnlab/use-wallet-react expects array of Uint8Array
      const signedTxns = await signTransactions([encodedTx]);
      console.log('Transaction signed successfully:', signedTxns);

      // Send transaction - signedTxns is an array, extract first element
      console.log('Sending transaction, signedTxns:', signedTxns);
      const response = await algodClient.sendRawTransaction(signedTxns[0]).do();
      console.log('Send response:', response);
      const txId = response.txId || response.txid || response.transactionId;
      console.log('Transaction sent, txId:', txId);
      setTxId(txId);

      setStatus({
        type: 'info',
        message: 'Transaction submitted. Waiting for confirmation...'
      });

      // Wait for confirmation
      const result = await algosdk.waitForConfirmation(algodClient, txId, 4);

      setStatus({
        type: 'success',
        message: `Transaction confirmed`
      });

      // Clear form
    } catch (error) {
      console.error('Error:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Transaction failed'
      });
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className='space-y-6'>
      {
        !activeAddress && (
          <div className="rounded-lg bg-card p-8 border border-border shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-secondary p-4">
                <Wallet className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">Connect Your Wallet</h3>
            <p className="text-sm text-muted-foreground mb-6">Connect your wallet to proceed with the payment</p>

            <div className='flex flex-col gap-y-2'>
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => wallet.connect()}
                  className="px-4 py-2 bg-accent hover:bg-accent-foreground text-white text-sm rounded-lg transition-colors"
                >
                  Connect {wallet.metadata.name}
                </button>
              ))}
            </div>

          </div>
        )
      }

      {activeAddress && (
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
                <p className="font-mono text-sm text-foreground break-all">{activeAddress}</p>
              </div>

              <button
                className='text-accent underline font-semibold hover:text-accent/80 text-sm'
                onClick={() => activeWallet?.disconnect()}
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
                <span className="font-mono text-xs text-foreground truncate max-w-xs">{activeAddress?.slice(0, 6)}...{activeAddress?.slice(-4)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">To</span>
                <span className="font-mono text-xs text-foreground truncate max-w-xs">{recipient.slice(0, 6)}...{recipient.slice(-4)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-semibold text-foreground">
                  {amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Network</span>
                <span className="font-semibold text-foreground">Algorand</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-muted-foreground">Order ID</span>
                <span className="font-mono text-xs text-foreground">{orderNo}</span>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendUSDC}
            disabled={loading}
            className="w-full rounded-lg bg-accent text-white font-semibold py-3 px-4 hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
            Send Transaction
          </button>
        </div>
      )}
      {/* Status Messages */}
      {status && (
        <div className={`mt-6 rounded-lg p-4 ${status.type === 'success' ? 'bg-green-50 border border-green-200' :
          status.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
          }`}>
          <div className="flex items-start gap-3">
            {status.type === 'success' && (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            )}
            {status.type === 'error' && (
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            {status.type === 'info' && (
              <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${status.type === 'success' ? 'text-green-800' :
                  status.type === 'error' ? 'text-red-800' :
                    'text-blue-800'
                }`}>
                {status.message}
              </p>
              {txId && (
                <a
                  href={`https://testnet.explorer.perawallet.app/tx/${txId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 underline mt-2 block break-all"
                >
                  View on AlgoExplorer: {txId}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AlgorandUSDCSender