import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  score,
  maxScore = 100,
  size = 100,
  strokeWidth = 12,
  className
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((score / maxScore) * 100, 100);
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className={cn("relative", className)}>
      <svg 
        width={size} 
        height={size} 
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(142 76% 36%)" />
            <stop offset="50%" stopColor="hsl(48 100% 67%)" />
            <stop offset="100%" stopColor="hsl(35 100% 55%)" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="progress-ring progress-track"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="progress-ring"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={0}
          stroke="url(#scoreGradient)"
          style={{
            transition: 'stroke-dasharray 2s ease-out',
          }}
        />
      </svg>
      
      {/* Score display in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-foreground">
          {score}
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;