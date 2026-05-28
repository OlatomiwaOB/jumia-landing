import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Controller } from "react-hook-form"

interface TermsAndConditionsProps {
  register: any
  errors: any
  control: any
}

export function TermsAndConditions({ control, errors }: TermsAndConditionsProps) {
  return (
    <div className="space-y-4 mt-7">
      <div className="flex items-center space-x-2">
        <Controller
          name="agreeToTerms"
          control={control}
          rules={{ required: "You must agree to the terms and conditions" }}
          render={({ field }) => (
            <Checkbox
              id="agreeToTerms"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="agreeToTerms"
            className="text-sm font-normal text-medium-gray leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <a
              href="/terms-and-conditions"
              target="_blank"
              className="text-faded-accent hover:text-accent/80 underline"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              target="_blank"
              className="text-faded-accent hover:text-accent/80 underline"
            >
              Privacy Policy
            </a>
          </Label>
        </div>
      </div>
      {errors.agreeToTerms && (
        <p className="text-sm text-center text-red-500">{errors.agreeToTerms.message}</p>
      )}
    </div>
  )
}