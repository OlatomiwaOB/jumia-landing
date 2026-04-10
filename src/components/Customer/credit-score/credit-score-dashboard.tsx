import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


import { cn } from '@/lib/utils';
import { CreditScoreResponse } from '@/types';

import ScoreCard from './score-card';
import CircularProgress from './circular-progress';
import useCustomer from '@/store/customerStore';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';

interface CreditScoreDashboardProps {
  data: CreditScoreResponse;
  className?: string;
}

const getRatingColor = (rating: string): string => {
  switch (rating?.toLowerCase()) {
    case 'excellent':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'good':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'fair':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'poor':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusMessage = (rating: string): string => {
  switch (rating?.toLowerCase()) {
    case 'excellent':
      return 'OUTSTANDING';
    case 'good':
      return 'SUCCESS';
    case 'fair':
      return 'IMPROVING';
    case 'poor':
      return 'NEEDS ATTENTION';
    default:
      return 'PROCESSING';
  }
};

const CreditScoreDashboard: React.FC<CreditScoreDashboardProps> = ({
  data,
  className
}) => {
    const {customer} = useCustomer()
    console.log(data);
    
  return (
    data?.scoreDetails ? <div className={cn("max-w-4xl mx-auto p-6 space-y-8", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Your Credit Score</h1>
        <p className="text-muted-foreground">Based on your financial profile analysis</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
         {/* Main Score Display */}
      <Card className="p-8 bg-card border-0 shadow-lg">
        <div className="flex flex-col items-center space-y-6">
          <CircularProgress 
            score={data?.totalScore} 
            maxScore={100}
            size={100}
            strokeWidth={16}
          />
          
          <div className="text-center space-y-3">
            <Badge 
              variant="outline" 
              className={cn("text-lg px-6 py-2 font-semibold", getRatingColor(data?.rating))}
            >
              {data?.rating}
            </Badge>
            
            <div className="text-xl font-bold text-accent">
              {getStatusMessage(data?.rating)}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Score: {data?.totalScore}/100
            </div>
          </div>
        </div>
      </Card>

      {/* Approved Amount */}
      {data?.approvedAmount > 0 && (
        <Card className="p-6 bg-card border-0 shadow-sm card-gradient flex items-center justify-center">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Approved Credit Limit</h3>
            <div className="text-3xl font-bold text-accent">
              {formatPrice(data?.approvedAmount, customer?.ccy as CurrencyCode)}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on your current credit profile
            </p>
          </div>
        </Card>
      )}

      </div>
     
      {/* Score Breakdown */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground text-center">Score Breakdown</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.scoreDetails?.map((detail) => (
            <ScoreCard
              key={detail?.parameterCode}
              score={detail?.score}
              title={detail?.parameterName}
              weight={detail?.weight}
            />
          ))}
        </div>
      </div>

      {/* User Info */}
      <Card className="p-4 bg-muted/30 border-0">
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground">
            Report generated for: <span className="font-medium">{data?.username}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Entity: {data?.entityCode} • Status: {data?.responseMessage}
          </p>
        </div>
      </Card>
    </div>
    : 
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">No credit score data available.</p>
    </div>
  );
};

export default CreditScoreDashboard;