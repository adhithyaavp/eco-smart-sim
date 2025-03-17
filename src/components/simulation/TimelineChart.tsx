
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Sample simulation data
const generateSimulationData = () => {
  const data = [];
  const steps = 24;
  
  for (let i = 0; i < steps; i++) {
    // Create patterns with energy spikes and efficiency improvements
    let powerValue = 50 + Math.sin(i / 3) * 20 + Math.random() * 5;
    
    // Add a spike
    if (i === 8) powerValue += 30;
    
    // Add efficiency improvement
    if (i >= 14) powerValue -= 15 + Math.random() * 5;
    
    data.push({
      step: i + 1,
      power: Math.round(powerValue),
      event: i === 8 ? 'Power Spike' : i === 14 ? 'Efficiency Improvement' : null
    });
  }
  
  return data;
};

interface TimelineChartProps {
  className?: string;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ className }) => {
  const [data] = useState(generateSimulationData());
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-md shadow-md p-3">
          <p className="text-sm font-medium">Step {label}</p>
          <p className="text-sm text-primary">Power: {payload[0].value} kW</p>
          {payload[0].payload.event && (
            <p className="text-xs text-muted-foreground mt-1">{payload[0].payload.event}</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Find power spike and efficiency improvement points
  const powerSpikePoint = data.find(d => d.event === 'Power Spike');
  const efficiencyPoint = data.find(d => d.event === 'Efficiency Improvement');
  
  return (
    <div className={`bg-card border rounded-xl p-6 shadow-sm ${className}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold">Simulation Timeline</h3>
          <p className="text-sm text-muted-foreground">Visualizing power usage throughout the simulation</p>
        </div>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="step" 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickMargin={10}
              label={{ value: 'Simulation Step', position: 'insideBottom', offset: -10, fontSize: 12 }}
            />
            <YAxis 
              width={50}
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Event reference lines */}
            {powerSpikePoint && (
              <ReferenceLine 
                x={powerSpikePoint.step} 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Power Spike', 
                  position: 'top', 
                  fontSize: 11,
                  fill: 'hsl(var(--destructive))',
                  offset: 10
                }} 
              />
            )}
            
            {efficiencyPoint && (
              <ReferenceLine 
                x={efficiencyPoint.step} 
                stroke="hsl(var(--success))" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Efficiency Improvement', 
                  position: 'top', 
                  fontSize: 11,
                  fill: 'hsl(var(--success))',
                  offset: 10
                }} 
              />
            )}
            
            <Line
              type="monotone"
              dataKey="power"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4, fill: 'hsl(var(--background))' }}
              activeDot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 6, fill: 'hsl(var(--background))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="border rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Average Power</p>
          <p className="text-xl font-medium">
            {Math.round(data.reduce((acc, d) => acc + d.power, 0) / data.length)} kW
          </p>
        </div>
        <div className="border rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Reduction Achieved</p>
          <p className="text-xl font-medium text-success">
            {Math.round(((data[0].power - data[data.length - 1].power) / data[0].power) * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
};
