
import React from 'react';
import { Bell, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

// Sample alert data
const alerts = [
  {
    id: 1,
    title: 'Temperature sensor T-103 offline',
    status: 'error',
    time: '2 minutes ago',
    details: 'Sector B, Production Line 2'
  },
  {
    id: 2,
    title: 'Energy usage above threshold',
    status: 'warning',
    time: '15 minutes ago',
    details: 'Main Assembly - 15% above normal'
  },
  {
    id: 3,
    title: 'Simulation completed successfully',
    status: 'success',
    time: '1 hour ago',
    details: 'Energy reduction: 22.5%'
  },
  {
    id: 4,
    title: 'System update available',
    status: 'neutral',
    time: '2 hours ago',
    details: 'Version 1.2.0 - Click to install'
  }
];

interface AlertsPanelProps {
  className?: string;
  limit?: number;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ 
  className, 
  limit = 4 
}) => {
  const displayedAlerts = alerts.slice(0, limit);
  
  return (
    <div className={`bg-card border rounded-xl p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={16} />
          <h3 className="font-semibold">Recent Alerts</h3>
        </div>
      </div>
      
      <div className="space-y-4">
        {displayedAlerts.map((alert) => (
          <div 
            key={alert.id} 
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <StatusBadge 
              status={alert.status as 'success' | 'warning' | 'error' | 'neutral'} 
              size="sm"
              animate={alert.status === 'error'}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{alert.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{alert.details}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="flex items-center gap-1 text-sm text-primary mt-4 hover:underline">
        View all alerts
        <ArrowRight size={14} />
      </button>
    </div>
  );
};
