import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";

interface Coin {
  id: string | null;
  accountNo: string;
  accountType: string;
  entityCode: string | null;
  symbol: string;
  chain: string;
  username: string | null;
  publicAddress: string;
  name: string;
  label: string | null;
  balance: number;
  usdBalance: number | null;
  lcyBalance: number | null;
  lcyCcy: string | null;
  logo: string;
  status: string | null;
}

interface ConfirmationData {
  fromAmount: string;
  toAmount: string;
  fromCurrency?: Coin | any;
  recipientNetwork: string;
  recipientAddress: string;
  purposeOfPayment?: string;
}

interface ConfirmationModalProps {
  data: ConfirmationData | any;
  onConfirm: any;
  onCancel: () => void;
  isPending?: boolean
}

export const ConfirmationModal = ({ data, onConfirm, onCancel, isPending }: ConfirmationModalProps) => {
  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case "USDT":
        return { icon: "T", color: "bg-crypto-usdt" };
      case "BTC":
        return { icon: "₿", color: "bg-crypto-bitcoin" };
      case "USDC":
        return { icon: "$", color: "bg-crypto-usdc" };
      default:
        return { icon: "$", color: "bg-primary" };
    }
  };

  const fromCurrency = getCurrencyIcon(data.fromCurrency?.symbol || "");

  // Format date
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold mb-4">Confirm Transaction</CardTitle>
          <div className="flex items-center justify-between mb-4 px-4">
            <div className="flex flex-col items-center gap-2 flex-1">
              {data.fromCurrency?.logo ? (
                <div className="w-12 h-12 rounded-full bg-white p-2 flex items-center justify-center">
                  <Image
                    src={data.fromCurrency.logo}
                    alt={data.fromCurrency.symbol}
                    width={32}
                    height={32}
                  />
                </div>
              ) : (
                <div
                  className={`w-12 h-12 rounded-full ${fromCurrency.color} flex items-center justify-center text-white text-lg font-bold`}
                >
                  {fromCurrency.icon}
                </div>
              )}
              <span className="text-xs text-muted-foreground text-center">{data.fromCurrency?.chain}</span>
            </div>
            
            <div className="flex justify-center px-6">
              <ArrowUpDown className="w-6 h-6 text-muted-foreground" />
            </div>
            
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg">🏦</span>
              </div>
              <span className="text-xs text-muted-foreground">External</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">You'll Send</span>
              <div className="text-right">
                <div className="font-semibold">
                  {data.fromAmount} {data.fromCurrency?.symbol}
                </div>
                <div className="text-xs text-muted-foreground">
                  From {data.fromCurrency?.chain}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient Network</span>
              <span className="font-semibold">{data.recipientNetwork}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient Address</span>
              <div className="text-right max-w-48">
                <span className="font-semibold text-xs break-all">
                  {data.recipientAddress.slice(0, 6)}...{data.recipientAddress.slice(-4)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-semibold">{currentDate}</span>
            </div>
            
            {/* <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-semibold">{transactionId}</span>
            </div> */}
            
            {data.purposeOfPayment && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purpose</span>
                <span className="font-semibold max-w-48 text-right">{data.purposeOfPayment}</span>
              </div>
            )}
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-3">
              {data.fromCurrency?.logo && (
                <Image
                  src={data.fromCurrency.logo}
                  alt={data.fromCurrency.symbol}
                  width={24}
                  height={24}
                />
              )}
              <div>
                <div className="font-medium">
                  {data.fromCurrency?.name || data.fromCurrency?.symbol}
                </div>
                <div className="text-sm text-muted-foreground">
                  Balance: {data.fromCurrency?.balance} {data.fromCurrency?.symbol}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={isPending} className="flex-1 bg-accent">
              {isPending ? `Sending`: `Confirm & Send`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};