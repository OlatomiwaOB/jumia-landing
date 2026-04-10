import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '@/utils/helperfns';

const BnplChainSelector = ({ 
  modalOpen, 
  setModalOpen, 
  networks, 
  wallets, 
  onConfirm,
  isPending 
}:any) => {
  const [selectedNetwork, setSelectedNetwork] = useState<any|null>(null);
  const [selectedWallet, setSelectedWallet] = useState<any|null>(null);

  // Filter wallets based on selected network
  const availableWallets = selectedNetwork
    ? wallets.filter((wallet:any) => wallet.chain === selectedNetwork.code)
    : [];

  const handleConfirm = () => {
    if (selectedNetwork && selectedWallet) {
      onConfirm({
        networkChain: selectedNetwork.code,
        publicAddress: selectedWallet.publicAddress,
        tokenSymbol: selectedWallet.symbol
      });
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedNetwork(null);
    setSelectedWallet(null);
  };

  return (
    <AlertDialog open={modalOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Complete BNPL Payment</AlertDialogTitle>
          <AlertDialogDescription>
            Select your preferred blockchain network and token to complete your Buy Now Pay Later purchase
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          {/* Network Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Step 1: Select Network</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {networks?.map((network:any) => (
                <Card
                  key={network.code}
                  className={`cursor-pointer transition-all ${
                    selectedNetwork?.code === network.code
                      ? 'border-accent bg-accent/5 shadow-md'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => {
                    setSelectedNetwork(network);
                    setSelectedWallet(null); // Reset wallet selection
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {network.otherInfo && (
                        <img
                          src={network.otherInfo}
                          alt={network.name}
                          className="w-10 h-10 rounded-lg object-contain"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{network.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {network.description}
                        </p>
                      </div>
                      {selectedNetwork?.code === network.code && (
                        <Check className="w-5 h-5 text-accent" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Wallet/Token Selection */}
          {selectedNetwork && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Step 2: Select Token</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableWallets.map((wallet:any, index:number) => (
                  <Card
                    key={`${wallet.publicAddress}-${wallet.symbol}-${index}`}
                    className={`cursor-pointer transition-all ${
                      selectedWallet?.symbol === wallet.symbol &&
                      selectedWallet?.publicAddress === wallet.publicAddress
                        ? 'border-accent bg-accent/5 shadow-md'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedWallet(wallet)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={wallet.logo}
                          alt={wallet.symbol}
                          className="w-10 h-10 rounded-lg object-contain"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{wallet.symbol}</h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {wallet.publicAddress.slice(0, 8)}...{wallet.publicAddress.slice(-6)}
                          </p>
                        </div>
                        {selectedWallet?.symbol === wallet.symbol &&
                          selectedWallet?.publicAddress === wallet.publicAddress && (
                            <Check className="w-5 h-5 text-accent" />
                          )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Selected Summary */}
          {selectedNetwork && selectedWallet && (
            <Card className="bg-accent/5 border-accent">
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-2">Payment Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network:</span>
                    <span className="font-medium">{selectedNetwork.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token:</span>
                    <span className="font-medium">{selectedWallet.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">
                      {selectedWallet.publicAddress.slice(0, 10)}...{selectedWallet.publicAddress.slice(-8)}
                    </span>
                    {selectedWallet?.publicAddress && (
                      <button onClick={() => copyToClipboard(selectedWallet?.publicAddress as string)}>
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedNetwork || !selectedWallet || isPending}
            className="bg-accent text-white"
          >
            {isPending ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BnplChainSelector;