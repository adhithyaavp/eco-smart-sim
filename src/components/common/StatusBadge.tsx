
import React from 'react';

type StatusType = 'success' | 'warning' | 'error' | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  animate = false,
  size = 'md'
}) => {
  const getStatusStyles = (): string => {
    const baseStyles = "inline-flex items-center rounded-full font-medium";
    
    // Size variations
    const sizeStyles = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-xs",
      lg: "px-3 py-1 text-sm"
    };
    
    // Status variations
    const statusStyles = {
      success: "bg-success/15 text-success",
      warning: "bg-warning/15 text-warning",
      error: "bg-destructive/15 text-destructive",
      neutral: "bg-muted text-muted-foreground"
    };
    
    // Animation
    const animationStyles = animate ? "animate-pulse-soft" : "";
    
    return `${baseStyles} ${sizeStyles[size]} ${statusStyles[status]} ${animationStyles}`;
  };

  return (
    <span className={getStatusStyles()}>
      <span className={`mr-1 rounded-full w-1.5 h-1.5 bg-current`}></span>
      {label || status}
    </span>
  );
};
