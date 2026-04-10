import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react";
import { Installment, PaymentStatus } from "@/types/index";
import { PaymentButton } from "./payment-plan-button";


interface InstallmentScheduleProps {
  installments: Installment[];
  orderId: string;
}

const getStatusIcon = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'paid':
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'overdue':
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

const getStatusVariant = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'paid':
    case 'completed':
      return 'bg-green-600';
    case 'pending':
      return 'bg-yellow-600';
    case 'overdue':
      return 'bg-red-500';
    default:
      return 'bg-muted-foreground';
  }
};

const getStatusColor = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'paid':
    case 'completed':
      return 'text-green-600';
    case 'pending':
      return 'text-yellow-500';
    case 'overdue':
      return 'text-red-500';
    default:
      return 'text-muted-foreground';
  }
};

export function InstallmentSchedule({ installments, orderId }: InstallmentScheduleProps) {
  const canMakePayment = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    return normalizedStatus === 'pending' || normalizedStatus === 'overdue';
  };

  console.log('installment rendered:', installments);
  

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Payment Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {installments?.map((installment, index) => (
            <div className="flex flex-col gap-y-2 p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-smooth">
            <div
              key={installment?.installmentNumber}
              className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-smooth"
            >
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted ${getStatusColor(installment?.paymentStatus)}`}>
                  {getStatusIcon(installment?.paymentStatus)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      Installment {installment?.installmentNumber}
                    </span>
                    <Badge variant={getStatusVariant(installment?.paymentStatus) as any} className={`capitalize ${getStatusVariant(installment?.paymentStatus)} text-white !important`}>
                      {installment?.paymentStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Due: {installment?.scheduleDate}
                  </p>
                  {installment.scheduleDisplayText && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {installment?.scheduleDisplayText}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">{installment?.amountDisplay}</p>
                  
                </div>
                {canMakePayment(installment?.paymentStatus) && (
                  <PaymentButton
                    orderId={orderId}
                    paymentRef={installment?.paymentRef}
                    amount={installment?.scheduleAmount}
                    amountDisplay={installment?.amountDisplay}
                    installmentNumber={installment?.installmentNumber}
                    scheduleDate={installment?.scheduleDate}
                    variant={installment?.paymentStatus?.toLowerCase() === 'overdue' ? 'secondary' : 'default'}
                  />
                )}
              </div>
            </div>

            {installment.paymentRef && (
                    <p className="text-xs text-muted-foreground font-mono">
                      Ref: {installment?.paymentRef}
                    </p>
                  )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

