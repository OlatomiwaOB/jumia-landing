import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CreditCardProps {
  currency: string;
  amount: string;
  flag: string;
  change: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  className?: string;
}

const cardVariants = {
  primary: 'bg-card-gradient-primary shadow-card-primary',
  secondary: 'bg-card-gradient-secondary shadow-card-secondary', 
  accent: 'bg-card-gradient-accent shadow-card-accent',
  success: 'bg-card-gradient-success shadow-card-success'
};

export const CreditCard: React.FC<CreditCardProps> = ({
  currency,
  amount,
  flag,
  change,
  variant = 'primary',
  className
}) => {
  return (
    <Card 
      className={cn(
        'relative overflow-hidden border-0 group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-card-glow',
        cardVariants[variant],
        className
      )}
    >
      <CardContent className="p-6 text-white relative z-10">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{flag}</span>
            <div>
              <span className="text-sm font-medium text-white/80 uppercase tracking-wider">
                {currency}
              </span>
              <p className="text-xs text-white/60">Available Balance</p>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-6">
          <p className="text-2xl lg:text-3xl font-bold tracking-wide">
            {amount}
          </p>
        </div>

        {/* Card Footer - Decorative Elements */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-8 h-5 bg-white/20 rounded-sm"></div>
            <div className="w-6 h-5 bg-white/20 rounded-sm"></div>
          </div>
          <div className="text-xs text-white/60 font-mono">
            **** **** **** {currency}
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
        
        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 -left-4 w-8 h-full bg-white/20 rotate-12 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />
        </div>
      </CardContent>
    </Card>
  );
};