import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CurrenciesCardProps {
  currency: string;
  amount: string;
  flag: string;
  currencyCode: string;
  isActive?: boolean;
  className?: string;
}

export const CurrenciesCard: React.FC<CurrenciesCardProps> = ({
  currency,
  amount,
  flag,
  currencyCode,
  isActive = false,
  className
}) => {
  const [showAmount, setShowAmount] = useState(true);

  const toggleAmountVisibility = () => {
    setShowAmount(!showAmount);
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden border border-border rounded-xl transition-all duration-300 cursor-pointer group',
        'hover:shadow-lg hover:-translate-y-1',
        isActive
          ? 'bg-accent text-white'
          : 'bg-white text-white',
        className
      )}
    >
      {/* Tilted squares in top right corner (only visible when active) */}
      {isActive && (
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-white/20 rotate-45 transform origin-center"></div>
          <div className="absolute -top-8 -right-8 w-14 h-14 bg-white/10 rotate-45 transform origin-center"></div>
        </div>
      )}

      <CardContent className="p-5 relative z-10">
        {/* Currency flag in white circle */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center mr-3">
            <span className="text-xl">{flag}</span>
          </div>
          <span className="text-sm font-medium">{currency}</span>
        </div>

        {/* Available balance with eye icon */}
        <div className="flex items-center justify-between mb-2">
          <span className={cn(
            "text-xs",
            isActive ? "text-muted-foreground" : "text-muted-foreground"
          )}>
            Available Balance
          </span>
          <button
            onClick={toggleAmountVisibility}
            className={cn(
              "transition-colors",
              isActive
                ? "text-muted-foreground hover:text-muted"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {showAmount ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {/* Amount display */}
        <div className="mb-4">
          <p className="text-xl font-bold">
            {showAmount ? amount : '••••••'}
          </p>
        </div>

        {/* Currency code */}
        <div>
          <span className="text-xs font-medium text-muted-foreground">{currencyCode}</span>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </CardContent>
    </Card>
  );
};