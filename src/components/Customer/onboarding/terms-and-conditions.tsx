import { Checkbox } from "@/components/ui/checkbox"

interface TermsAndConditionsProps {
  register: any
  errors: any
}

export function TermsAndConditions({ register, errors }: TermsAndConditionsProps) {
  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="agreeToTerms"
          {...register("agreeToTerms", {
            required: "You must agree to the terms and conditions",
          })}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="agreeToTerms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <a 
              href="/terms-and-conditions" 
              target="_blank" 
              className="text-accent hover:text-accent/80 underline"
            >
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a 
              href="/privacy" 
              target="_blank" 
              className="text-accent hover:text-accent/80 underline"
            >
              Privacy Policy
            </a>
          </label>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}