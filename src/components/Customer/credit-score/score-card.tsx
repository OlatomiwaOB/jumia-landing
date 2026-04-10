import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  score: number;
  title: string;
  weight?: number;
  className?: string;
  accentColor?: string; // Optional accent color override
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  title,
  weight,
  className,
  accentColor
}) => {
  return (
    <Card 
      className={cn(
        "p-4 bg-card border-0 shadow-sm relative",
        "hover:shadow-md transition-shadow duration-200",
        // Left border using accent color
        "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1",
        accentColor ? "" : "before:bg-[var(--accent)]",
        "before:rounded-l-lg",
        className
      )}
      style={accentColor ? {
        '--border-color': accentColor
      } as React.CSSProperties & { '--border-color': string } : undefined}
    >
      <div className="space-y-1">
        <div className="text-2xl font-bold text-foreground">
          {score}
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          {title}
        </div>
        {weight && (
          <div className="text-xs text-muted-foreground">
            Weight: {weight}%
          </div>
        )}
      </div>
    </Card>
  );
};

export default ScoreCard;