
import React from 'react';
import { MetricsCard } from './MetricsCard';
import { EnergyUsageChart } from './EnergyUsageChart';
import { AlertsPanel } from './AlertsPanel';
import { Zap, Thermometer, Gauge, RadioTower } from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor and optimize your factory operations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard 
          title="Current Power Usage" 
          value="124.5 kW" 
          description="Main factory floor"
          trend={{ value: -12.5, isPositive: true }}
          icon={<Zap size={20} />}
        />
        <MetricsCard 
          title="Energy Efficiency" 
          value="82%" 
          description="Operating at optimal levels"
          trend={{ value: 8.2, isPositive: true }}
          icon={<Gauge size={20} />}
        />
        <MetricsCard 
          title="Active Sensors" 
          value="28/32" 
          description="4 sensors offline"
          trend={{ value: -2, isPositive: false }}
          icon={<RadioTower size={20} />}
        />
        <MetricsCard 
          title="Average Temperature" 
          value="23.4°C" 
          description="Within optimal range"
          trend={{ value: 0.2, isPositive: false }}
          icon={<Thermometer size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EnergyUsageChart className="lg:col-span-2" />
        <AlertsPanel />
      </div>
    </div>
  );
};
