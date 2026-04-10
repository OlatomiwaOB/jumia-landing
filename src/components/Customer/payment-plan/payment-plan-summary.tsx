import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, BadgeDollarSign } from "lucide-react";
import { PaymentPlanSummary as PaymentPlanSummaryType } from "@/types/index";

interface PaymentPlanSummaryProps {
  summary: PaymentPlanSummaryType;
}

export function PaymentPlanSummary({ summary }: PaymentPlanSummaryProps) {
  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-accent">
          <CreditCard className="h-5 w-5 text-accent" />
          Payment Plan Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono text-sm">{summary?.orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-accent">{summary?.totalAmountDisplay}</p>
          </div>
        </div>

        {/* Payment Plan Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">First Payment</p>
              <p className="font-medium">{summary?.firstPaymentDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <BadgeDollarSign className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Per Installment</p>
              <p className="font-medium">{summary?.installmentAmountDisplay}</p>
            </div>
          </div>
        </div>

        {/* Credit Limit Info */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Credit Limit</h4>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Used: {summary?.creditLimitUsed}</span>
            <span className="text-sm text-muted-foreground">Remaining: {summary?.remainingCreditLimit}</span>
          </div>
        </div>

        {/* Payment Plan Text */}
        {summary?.paymentPlanText && (
          <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-accent">
            <p className="text-sm">{summary?.paymentPlanText}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}