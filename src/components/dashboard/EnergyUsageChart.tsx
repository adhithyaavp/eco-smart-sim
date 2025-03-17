
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Sample data
const generateData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now);
    hour.setHours(now.getHours() - i);
    
    data.push({
      time: hour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actual: Math.round(30 + Math.random() * 40),
      optimized: Math.round(20 + Math.random() * 25),
    });
  }
  
  return data;
};

interface EnergyUsageChartProps {
  className?: string;
}

export const EnergyUsageChart: React.FC<EnergyUsageChartProps> = ({ className }) => {
  const [data] = useState(generateData());
  
  // Calculate average reduction
  const calculateReduction = () => {
    let totalActual = 0;
    let totalOptimized = 0;
    
    data.forEach(entry => {
      totalActual += entry.actual;
      totalOptimized += entry.optimized;
    });
    
    const reduction = ((totalActual - totalOptimized) / totalActual) * 100;
    return reduction.toFixed(1);
  };

  const timeRanges = ['Last 24 hours', 'Last 7 days', 'Last 30 days'];
  const [activeRange, setActiveRange] = useState(timeRanges[0]);

  return (
    <div className={`bg-card border rounded-xl p-6 shadow-sm ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-2 md:space-y-0">
        <div>
          <h3 className="text-lg font-semibold">Energy Usage</h3>
          <p className="text-sm text-muted-foreground">
            <span className="text-success font-medium">{calculateReduction()}% reduction </span> 
            with optimized settings
          </p>
        </div>
        <div className="flex bg-muted rounded-md p-0.5">
          {timeRanges.map((range) => (
            <button
              key={range}
              className={`text-xs px-3 py-1 rounded transition-colors ${
                activeRange === range
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-72 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickMargin={10}
            />
            <YAxis 
              width={40}
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}kW`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                fontSize: '12px',
              }} 
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
            <Area
              type="monotone"
              dataKey="actual"
              name="Actual Usage"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorActual)"
            />
            <Area
              type="monotone"
              dataKey="optimized"
              name="Optimized Usage"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOptimized)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
