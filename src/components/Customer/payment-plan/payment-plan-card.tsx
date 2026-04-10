'use client'
import { PaymentPlanResponse } from "@/types";
import { PaymentPlanSummary } from "./payment-plan-summary";
import { InstallmentSchedule } from "./installment-schedule";


interface PaymentPlanCardProps {
  paymentPlan: any;
}

export function PaymentPlanCard({ paymentPlan }: PaymentPlanCardProps) {
  const paymentPlanSummary  = paymentPlan;

  return (
    <div className="space-y-6">
      <PaymentPlanSummary summary={paymentPlanSummary} />
      <InstallmentSchedule installments={paymentPlanSummary?.installments} orderId={paymentPlanSummary?.orderId} />
    </div>
  );
}