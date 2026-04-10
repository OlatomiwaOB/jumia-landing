import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

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
  toCurrency?: Coin | any;
  recipientNetwork: string;
  recipientAddress: string;
  purposeOfPayment?: string;
  payloadInfo?: any;
}
interface SuccessModalProps {
  onLogin: () => void;
  onCancel: () => void;
  data: ConfirmationData | any
}

export const SuccessModal = ({ onLogin, onCancel,data }: SuccessModalProps) => {

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
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold">Transaction Successful</h2>
          
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">You Sent</span>
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
            
            <div className="flex justify-between">
                <span className="text-muted-foreground">ExternalRefNo</span>
                <span className="font-semibold max-w-48 text-right">{data.payloadInfo?.externalRefNo}</span>
              </div>
            
            {data.purposeOfPayment && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purpose</span>
                <span className="font-semibold max-w-48 text-right">{data.purposeOfPayment}</span>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onLogin} className="flex-1 bg-accent">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};