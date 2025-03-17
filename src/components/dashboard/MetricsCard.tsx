
import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  className,
}) => {
  return (
    <div className={`rounded-xl bg-card border p-6 shadow-sm animate-scale-in transition-all hover:shadow card-hover ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={`text-xs font-medium ${
                trend.isPositive ? 'text-success' : 'text-destructive'
              }`}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};
