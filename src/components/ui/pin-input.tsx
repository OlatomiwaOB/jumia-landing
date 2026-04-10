import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PinInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'password';
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  mask?: boolean;
  maskChar?: string;
  secure?: boolean;
}

export const PinInput: React.FC<PinInputProps> = ({
  length = 4,
  value,
  onChange,
  type = 'text',
  className,
  inputClassName,
  autoFocus = false,
  disabled = false,
  mask = false,
  maskChar = '•',
  secure = false,
}) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [isFocused, setIsFocused] = useState<number | null>(null);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(newValue)) {
      return;
    }

    if (newValue.length <= 1) {
      const newPin = value.split('');
      newPin[index] = newValue;
      const combinedPin = newPin.join('');

      onChange(combinedPin);

      if (newValue && index < length - 1) {
        focusInput(index + 1);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (!value[index] && index > 0) {
        const newPin = value.split('');
        newPin[index - 1] = '';
        onChange(newPin.join(''));
        focusInput(index - 1);
      } else {
        const newPin = value.split('');
        newPin[index] = '';
        onChange(newPin.join(''));
        if (index > 0) {
          focusInput(index - 1);
        }
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      focusInput(index + 1);
    } else if (e.key === 'Delete') {
      e.preventDefault();
      const newPin = value.split('');
      newPin[index] = '';
      onChange(newPin.join(''));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');

    if (/^\d+$/.test(pastedData) && pastedData.length === length) {
      onChange(pastedData);
      focusInput(length - 1);
    }
  };

  const handleFocus = (index: number) => {
    setIsFocused(index);
    setTimeout(() => {
      inputRefs.current[index]?.select();
    }, 0);
  };

  const handleBlur = () => {
    setIsFocused(null);
  };

  const getDisplayValue = (index: number) => {
    const char = value[index];
    if (!char) return '';
    
    if (secure || type === 'password') {
      return maskChar;
    }
    
    if (mask && isFocused !== index) {
      return maskChar;
    }
    
    return char;
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="relative">
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={getDisplayValue(index)}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            disabled={disabled}
            className={cn(
              'w-12 h-12 text-lg font-semibold text-center border-2 rounded-lg transition-all duration-200',
              'bg-accent/10 border-accent/30 focus:bg-accent/20 focus:border-accent',
              'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-1',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'text-accent-foreground placeholder:text-accent-foreground/50',
              'caret-transparent selection:bg-transparent',
              inputClassName
            )}
          />
          <div
            className={cn(
              'absolute inset-0 rounded-lg pointer-events-none transition-all duration-200',
              'border-2 border-transparent',
              isFocused === index && 'border-accent/50'
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default PinInput;