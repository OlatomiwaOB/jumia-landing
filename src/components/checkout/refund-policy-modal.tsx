"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollText } from "lucide-react";

/**
 * Default refund & cancellation policy.
 *
 * Every client storefront shares this copy unless it passes its own `policy`
 * (see `RefundPolicyModalProps`). Keep client-specific wording out of here —
 * override it at the call site instead.
 */
export const DEFAULT_REFUND_POLICY =
  "I confirm that my order and delivery or collection details are correct. As our food and drinks are freshly prepared and perishable, we cannot offer refunds for a change of mind once preparation has begun or after the order has been delivered or collected. This does not affect your legal rights if an item is faulty, incorrect or not as described. I agree to the Refund and Cancellation Policy.";

export const DEFAULT_REFUND_POLICY_TITLE = "Refund & Cancellation Policy";

export const DEFAULT_REFUND_CONSENT_LABEL =
  "I have read and agree to the Refund and Cancellation Policy.";

export interface RefundPolicyModalProps {
  /** Whether the modal is visible. */
  open: boolean;
  /** Called when the modal requests to open/close (overlay click, escape, close button). */
  onOpenChange: (open: boolean) => void;
  /** Called once the customer has consented and confirmed. */
  onConfirm: () => void;
  /**
   * Policy body. Pass a string (blank lines become separate paragraphs) or any
   * node for richer, client-specific content. Defaults to
   * {@link DEFAULT_REFUND_POLICY}.
   */
  policy?: React.ReactNode;
  /** Modal heading. */
  title?: string;
  /** Optional line under the heading. */
  description?: string;
  /** Label next to the consent checkbox. */
  consentLabel?: string;
  /** Label of the confirm button. */
  confirmLabel?: string;
  /** Label of the dismiss button. */
  cancelLabel?: string;
  /** Disables the confirm button while an async continue is in flight. */
  isConfirming?: boolean;
}

const renderPolicy = (policy: React.ReactNode) => {
  if (typeof policy !== "string") return policy;

  return policy
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={index} className="text-sm leading-relaxed text-muted-foreground">
        {paragraph}
      </p>
    ));
};

/**
 * Reusable refund/cancellation consent modal shown before a customer proceeds
 * to payment. Consent is required on every attempt — the checkbox resets each
 * time the modal opens.
 */
export const RefundPolicyModal = ({
  open,
  onOpenChange,
  onConfirm,
  policy = DEFAULT_REFUND_POLICY,
  title = DEFAULT_REFUND_POLICY_TITLE,
  description,
  consentLabel = DEFAULT_REFUND_CONSENT_LABEL,
  confirmLabel = "Continue to Payment",
  cancelLabel = "Cancel",
  isConfirming = false,
}: RefundPolicyModalProps) => {
  const [hasConsented, setHasConsented] = useState(false);

  // Consent is never carried over between attempts.
  useEffect(() => {
    if (!open) setHasConsented(false);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex-col gap-2 pr-8">
          <DialogTitle className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-accent flex-shrink-0" />
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="max-h-[45vh] overflow-y-auto space-y-3 rounded-lg border border-border bg-muted/40 p-4">
          {renderPolicy(policy)}
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <Checkbox
            id="refundPolicyConsent"
            checked={hasConsented}
            onCheckedChange={(checked) => setHasConsented(checked === true)}
            className="mt-0.5"
          />
          <label
            htmlFor="refundPolicyConsent"
            className="text-sm font-medium leading-snug cursor-pointer"
          >
            {consentLabel}
          </label>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isConfirming}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            className="bg-accent hover:bg-accent/90"
            onClick={onConfirm}
            disabled={!hasConsented || isConfirming}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RefundPolicyModal;
