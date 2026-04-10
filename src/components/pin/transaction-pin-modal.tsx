"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useCustomer from "@/store/customerStore";
import { logout } from '@/utils/auth-utils-customer'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import axiosCustomer from "@/utils/fetch-function-customer";
import PinInput from "@/components/ui/pin-input";

interface SetPinFormData {
  newPin: string;
  confirmPin: string;
}

interface TransactionPinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionPinModal = ({ isOpen, onClose }: TransactionPinModalProps) => {
  const { customer } = useCustomer();
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [newPinValue, setNewPinValue] = useState("");
  const [confirmPinValue, setConfirmPinValue] = useState("");

  const { register, handleSubmit, watch, reset, formState: { errors }, setValue } = useForm<SetPinFormData>({
    defaultValues: {
      newPin: "",
      confirmPin: ""
    }
  });

  const isWeakPin = (pin: string): boolean => {
    if (pin.length !== 4) return false;

    const isConsecutive = (pin: string): boolean => {
      for (let i = 0; i < pin.length - 1; i++) {
        if (parseInt(pin[i + 1]) !== parseInt(pin[i]) + 1) {
          return false;
        }
      }
      return true;
    };

    const isReverseConsecutive = (pin: string): boolean => {
      for (let i = 0; i < pin.length - 1; i++) {
        if (parseInt(pin[i + 1]) !== parseInt(pin[i]) - 1) {
          return false;
        }
      }
      return true;
    };

    const isRepeated = (pin: string): boolean => {
      return new Set(pin.split('')).size === 1;
    };

    const commonWeakPins = [
      '1234', '1111', '0000', '2222', '3333', '4444', '5555',
      '6666', '7777', '8888', '9999', '4321', '1212', '1004',
      '2000', '3000', '1234', '2345', '3456', '4567', '5678',
      '6789', '9876', '8765', '7654', '6543', '5432', '4321'
    ];

    return isConsecutive(pin) ||
      isReverseConsecutive(pin) ||
      isRepeated(pin) ||
      commonWeakPins.includes(pin);
  };

  const getWeakPinReason = (pin: string): string => {
    if (pin.length !== 4) return '';

    if (new Set(pin.split('')).size === 1) {
      return 'PIN contains repeated digits';
    }

    let isConsecutive = true;
    for (let i = 0; i < pin.length - 1; i++) {
      if (parseInt(pin[i + 1]) !== parseInt(pin[i]) + 1) {
        isConsecutive = false;
        break;
      }
    }
    if (isConsecutive) return 'PIN contains consecutive numbers';

    let isReverseConsecutive = true;
    for (let i = 0; i < pin.length - 1; i++) {
      if (parseInt(pin[i + 1]) !== parseInt(pin[i]) - 1) {
        isReverseConsecutive = false;
        break;
      }
    }
    if (isReverseConsecutive) return 'PIN contains reverse consecutive numbers';

    return 'PIN is too common or predictable';
  };

  const mutation = useMutation({
    mutationFn: async (data: SetPinFormData) => {
      const payload = {
        username: customer?.username || "",
        newPin: data.newPin,
        entityCode: customer?.entityCode || "",
        channel: "WEB",
      };

      const response = await axiosCustomer.post('/ecommerce/setPIN', payload);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.code === "000") {
        toast.success("Transaction PIN set successfully! You will be logged out in 5 seconds...");
        reset();
        setNewPinValue("");
        setConfirmPinValue("");
        onClose();
      } else {
        toast.error(data.message || "Failed to set transaction PIN");
      }
    },
    onSettled: () => {
      setIsLoggingOut(true);
      setTimeout(() => {
        logout();
        setIsLoggingOut(false);
      }, 5000);
    },
    onError: (error: any) => {
      console.error('Error setting PIN:', error);
      toast.error(error.response?.data?.message || "Failed to set transaction PIN");
    },
  });

  const onSubmit = (data: SetPinFormData) => {
    if (data.newPin !== data.confirmPin) {
      toast.error("PINs do not match");
      return;
    }

    if (data.newPin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }

    if (isWeakPin(data.newPin)) {
      toast.error("Please choose a stronger PIN");
      return;
    }

    mutation.mutate(data);
  };

  const handleNewPinChange = (value: string) => {
    setNewPinValue(value);
    setValue("newPin", value);
  };

  const handleConfirmPinChange = (value: string) => {
    setConfirmPinValue(value);
    setValue("confirmPin", value);
  };

  const isFormValid = () => {
    return newPinValue.length === 4 &&
      confirmPinValue.length === 4 &&
      newPinValue === confirmPinValue &&
      !isWeakPin(newPinValue);
  };

  const handleClose = () => {
    reset();
    setNewPinValue("");
    setConfirmPinValue("");
    setShowNewPin(false);
    setShowConfirmPin(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col mb-4">
          <DialogTitle className="text-center text-xl">
            Set Transaction PIN
          </DialogTitle>
          <DialogDescription className="text-center">
            Secure your transactions with a 4-digit PIN
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Account Details</CardTitle>
            <CardDescription>
              PIN will be set for this account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-7 text-sm justify-between">
              <div>
                <Label className="text-xs text-muted-foreground">Username</Label>
                <p className="font-medium">{customer?.username}</p>
              </div>
              {/* <div>
                <Label className="text-xs text-muted-foreground">Tier</Label>
                <p className="font-medium">{customer?.customerTier || "N/A"}</p>
              </div> */}
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">New PIN</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowNewPin(!showNewPin)}
              >
                {showNewPin ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showNewPin ? 'Hide PIN' : 'Show PIN'}
                </span>
              </Button>
            </div>
            <PinInput
              length={4}
              value={newPinValue}
              onChange={handleNewPinChange}
              type={showNewPin ? "text" : "password"}
              secure={!showNewPin}
              className="justify-center"
              inputClassName="w-12 h-12 text-lg"
            />
            {newPinValue.length === 4 && isWeakPin(newPinValue) && (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>{getWeakPinReason(newPinValue)}</span>
              </div>
            )}
            <input
              type="hidden"
              {...register("newPin", {
                required: "PIN is required",
                pattern: {
                  value: /^\d{4}$/,
                  message: "PIN must be exactly 4 digits"
                }
              })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Confirm PIN</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
              >
                {showConfirmPin ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showConfirmPin ? 'Hide PIN' : 'Show PIN'}
                </span>
              </Button>
            </div>
            <PinInput
              length={4}
              value={confirmPinValue}
              onChange={handleConfirmPinChange}
              type={showConfirmPin ? "text" : "password"}
              secure={!showConfirmPin}
              className="justify-center"
              inputClassName="w-12 h-12 text-lg"
            />
            <input
              type="hidden"
              {...register("confirmPin", {
                required: "Please confirm your PIN",
                validate: value =>
                  value === newPinValue || "PINs do not match"
              })}
            />
          </div>

          {confirmPinValue && newPinValue.length === 4 && confirmPinValue.length === 4 && (
            <div className="text-sm text-center">
              {newPinValue === confirmPinValue ? (
                isWeakPin(newPinValue) ? (
                  <p className="text-yellow-600">PIN match, but we recommend using a stronger pin.</p>
                ) : (
                  <p className="text-green-600">PIN match and meet security requirements.</p>
                )
              ) : (
                <p className="text-red-600">PIN does not match!</p>
              )}
            </div>
          )}

          <div className="rounded-lg bg-muted/50 p-3">
            <h4 className="text-xs font-medium mb-2">PIN Requirements:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Must be exactly 4 digits</li>
              <li>• Numbers only (0-9)</li>
              <li>• Avoid consecutive numbers (1234, 4321)</li>
              <li>• Avoid repeated digits (1111, 2222)</li>
              <li>• Avoid common patterns</li>
              <li>• Do not share your PIN with anyone</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={mutation.isPending || !isFormValid()}
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Setting PIN...
                </>
              ) : (
                "Set PIN"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionPinModal;