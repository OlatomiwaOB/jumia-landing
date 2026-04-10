import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface VerificationModalProps {
  onVerify: () => void;
  onCancel: () => void;
}

export const VerificationModal = ({ onVerify, onCancel }: VerificationModalProps) => {
  const [codes, setCodes] = useState(["", "", "", ""]);
  
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);
      
      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = () => {
    if (codes.every(code => code !== "")) {
      onVerify();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verification Code</CardTitle>
          <p className="text-muted-foreground">
            To login, kindly enter the verification code sent to your email address
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center gap-4">
            {codes.map((code, index) => (
              <Input
                key={index}
                id={`code-${index}`}
                type="text"
                value={code}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-bold"
                maxLength={1}
              />
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!codes.every(code => code !== "")}
            className="w-full"
          >
            Login
          </Button>

          <div className="text-center">
            <span className="text-muted-foreground">Didn't Get an E-mail? </span>
            <Button variant="link" className="p-0 h-auto text-primary">
              Resend
            </Button>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onVerify} className="flex-1 bg-accent text-white">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};