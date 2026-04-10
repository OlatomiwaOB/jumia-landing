"use client"

interface PaymentHeaderProps {
  amount: number
  orderNo: string,
  currency?: string | null
  subTotal?: number;
  totalVat?: number;
  shippingFee?: number;
}

export default function PaymentHeader({ 
  amount, 
  orderNo, 
  currency, 
  subTotal, 
  totalVat, 
  shippingFee 
}: PaymentHeaderProps) {
  return (
    <div className="mb-8 rounded-lg bg-card p-6 shadow-sm border border-border">
      <div className="space-y-4">
        {/* Amount Display */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Amount</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              {amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xl font-semibold text-accent">{currency}</span>
          </div>
        </div>

        {/* Order Breakdown */}
        {(subTotal !== undefined || totalVat !== undefined || shippingFee !== undefined) && (
          <div className="pt-2 border-t border-border">
            <div className="space-y-2 text-sm">
              {subTotal !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{subTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</span>
                </div>
              )}
              {totalVat !== undefined && totalVat > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT:</span>
                  <span>{totalVat.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</span>
                </div>
              )}
              {shippingFee !== undefined && shippingFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span>{shippingFee.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total:</span>
                <span>{amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</span>
              </div>
              {totalVat !== undefined && totalVat > 0 && (
                <p className="text-xs text-muted-foreground text-right">
                  Includes {totalVat.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency} VAT
                </p>
              )}
            </div>
          </div>
        )}

        {/* Order Number */}
        <div className="pt-2 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground mb-1">Order Number</p>
          <p className="text-lg font-mono text-primary">{orderNo}</p>
        </div>
      </div>
    </div>
  )
}