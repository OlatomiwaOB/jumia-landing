import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ring-1 ring-inset",
  {
    variants: {
      variant: {
        success: "bg-success-light text-success ring-success/20 shadow-sm",
        warning: "bg-warning-light text-warning ring-warning/20 shadow-sm",
        destructive: "bg-red-50 text-red-700 ring-red-600/20 shadow-sm",
        pending: "bg-amber-50 text-amber-700 ring-amber-600/20 shadow-sm",
        neutral: "bg-muted text-muted-foreground ring-border shadow-sm",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "default",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status?: string
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, variant, size, status, children, ...props }, ref) => {
    // Auto-detect variant based on status
    const getVariantFromStatus = (status: string): typeof variant => {
      const normalizedStatus = status?.toLowerCase()
      if (['active', 'verified', 'completed', 'approved', 'y'].includes(normalizedStatus)) return 'success'
      if (['pending', 'processing', 'review'].includes(normalizedStatus)) return 'warning' 
      if (['rejected', 'failed', 'suspended', 'declined', 'n'].includes(normalizedStatus)) return 'destructive'
      if (['inactive', 'draft'].includes(normalizedStatus)) return 'neutral'
      return 'neutral'
    }

    const finalVariant = variant || getVariantFromStatus(status || '')

    return (
      <div
        className={cn(statusBadgeVariants({ variant: finalVariant, size, className }))}
        ref={ref}
        {...props}
      >
        {children || status}
      </div>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge, statusBadgeVariants }