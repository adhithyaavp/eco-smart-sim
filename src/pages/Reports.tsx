import React, { useState, useEffect } from 'react';
import { useSensorSimulation } from '../hooks/useSensorSimulation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, BarChart3, FileBarChart, PieChart as PieChartIcon, Filter, Calendar, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { TimelineChart } from '../components/simulation/TimelineChart';

const Reports: React.FC = () => {
  const { sensors } = useSensorSimulation();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('daily');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [refreshTime, setRefreshTime] = useState(new Date());

  // Refresh data every 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setRefreshTime(new Date());
    }, 30000);
    
    return () => clearTimeout(timer);
  }, [refreshTime]);

  // Create data for energy usage over time
  const energyDataOverTime = sensors
    .filter(sensor => sensor.type === 'Power')
    .map(sensor => {
      const value = parseFloat(sensor.value.split(' ')[0]);
      return {
        name: sensor.name,
        value,
        optimized: value * 0.8, // 20% less for optimized
        location: sensor.location
      };
    });

  // Get all unique locations
  const locations = ['all', ...new Set(sensors.map(sensor => sensor.location))];

  // Filter sensors by selected location
  const filteredSensors = selectedLocation === 'all' 
    ? sensors 
    : sensors.filter(sensor => sensor.location === selectedLocation);

  // Generate aggregated data for report
  const aggregatedData = [
    { name: 'Main Assembly', current: 124.5, optimized: 96.3, saving: 28.2, percentage: 22.7 },
    { name: 'Hydraulic System', current: 85.2, optimized: 65.8, saving: 19.4, percentage: 22.8 },
    { name: 'Production Line 2', current: 110.3, optimized: 92.4, saving: 17.9, percentage: 16.2 },
    { name: 'Cooling System', current: 62.1, optimized: 48.9, saving: 13.2, percentage: 21.3 },
    { name: 'Storage Area', current: 45.6, optimized: 38.2, saving: 7.4, percentage: 16.2 }
  ];

  // Temperature data
  const temperatureData = filteredSensors
    .filter(sensor => sensor.type === 'Temperature')
    .map(sensor => {
      const value = parseFloat(sensor.value.replace('°C', ''));
      return {
        name: sensor.name,
        value,
        location: sensor.location,
        status: sensor.status
      };
    });

  // Pressure data
  const pressureData = filteredSensors
    .filter(sensor => sensor.type === 'Pressure')
    .map(sensor => {
      const value = parseFloat(sensor.value.split(' ')[0]);
      return {
        name: sensor.name,
        value,
        location: sensor.location,
        status: sensor.status
      };
    });

  // Efficiency data for pie chart
  const efficiencyData = [
    { name: 'Utilized Energy', value: 72 },
    { name: 'Wasted Energy', value: 28 }
  ];

  const EFFICIENCY_COLORS = ['hsl(var(--success))', 'hsl(var(--destructive))'];

  // Historical data for area chart (simulated)
  const generateHistoricalData = () => {
    const data = [];
    const periods = timeframe === 'daily' ? 24 : timeframe === 'weekly' ? 7 : 30;
    
    for (let i = 0; i < periods; i++) {
      const baseValue = 100 + Math.sin(i / 3) * 20;
      data.push({
        name: timeframe === 'daily' ? `${i}:00` : timeframe === 'weekly' ? `Day ${i+1}` : `Day ${i+1}`,
        consumption: Math.round(baseValue + Math.random() * 30),
        optimized: Math.round((baseValue + Math.random() * 10) * 0.75)
      });
    }
    
    return data;
  };

  const historicalData = generateHistoricalData();

  // New peak usage data with more detail
  const generatePeakUsageData = () => {
    const hours = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    
    return hours.map(hour => {
      // Simulate different usage patterns based on time of day
      const isBusinessHours = hour.startsWith('08') || hour.startsWith('10') || hour.startsWith('12') || 
                              hour.startsWith('14') || hour.startsWith('16') || hour.startsWith('18');
      const isPeakHour = hour.startsWith('10') || hour.startsWith('14') || hour.startsWith('16');
      
      // Base value varies by time of day
      const baseValue = isBusinessHours ? 180 + Math.random() * 40 : 80 + Math.random() * 30;
      const peakAddition = isPeakHour ? 50 + Math.random() * 30 : 0;
      const actualValue = baseValue + peakAddition;
      
      // Calculate optimized values (simulating 15-25% reduction during peaks)
      const optimizedReduction = isPeakHour ? 0.2 + Math.random() * 0.05 : 0.15 + Math.random() * 0.05;
      const optimizedValue = actualValue * (1 - optimizedReduction);
      
      // Calculate threshold values
      const warningThreshold = isPeakHour ? 220 : 180;
      const criticalThreshold = isPeakHour ? 240 : 200;
      
      return {
        hour,
        actual: Math.round(actualValue),
        optimized: Math.round(optimizedValue),
        warningThreshold,
        criticalThreshold,
        status: actualValue > criticalThreshold ? 'critical' : actualValue > warningThreshold ? 'warning' : 'normal'
      };
    });
  };

  const peakUsageData = generatePeakUsageData();
  
  // Calculate peak metrics
  const peakHourData = peakUsageData.reduce((max, item) => item.actual > max.actual ? item : max, peakUsageData[0]);
  const averageUsage = Math.round(peakUsageData.reduce((sum, item) => sum + item.actual, 0) / peakUsageData.length);
  const potentialPeakSavings = Math.round(peakHourData.actual - peakHourData.optimized);
  const peakReductionPercent = Math.round((potentialPeakSavings / peakHourData.actual) * 100);

  // Calculate totals for the cards
  const totalPowerUsage = aggregatedData.reduce((acc, item) => acc + item.current, 0);
  const totalOptimized = aggregatedData.reduce((acc, item) => acc + item.optimized, 0);
  const totalSavings = aggregatedData.reduce((acc, item) => acc + item.saving, 0);
  const savingsPercentage = (totalSavings / totalPowerUsage) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and export factory insights.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="flex items-center gap-2 px-3 py-2 bg-muted/70 text-foreground rounded-md text-sm font-medium hover:bg-muted transition-colors"
            onClick={() => setRefreshTime(new Date())}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 bg-muted/30 border rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            className="bg-background border rounded px-3 py-1 text-sm"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          
          <select 
            className="bg-background border rounded px-3 py-1 text-sm"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locations.map(location => (
              <option key={location} value={location}>
                {location === 'all' ? 'All Locations' : location}
              </option>
            ))}
          </select>
          
          <div className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
            <Calendar size={14} />
            <span>Last updated: {format(refreshTime, 'h:mm:ss a')}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Power Usage</CardDescription>
            <CardTitle className="text-3xl font-bold">{totalPowerUsage.toFixed(1)} kW</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total factory consumption</p>
            <div className="w-full h-1 bg-muted mt-2 overflow-hidden rounded-full">
              <div className="bg-primary h-full" style={{ width: '100%' }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Optimized Usage</CardDescription>
            <CardTitle className="text-3xl font-bold text-success">{totalOptimized.toFixed(1)} kW</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">With recommended settings</p>
            <div className="w-full h-1 bg-muted mt-2 overflow-hidden rounded-full">
              <div className="bg-success h-full" style={{ width: `${(totalOptimized/totalPowerUsage)*100}%` }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Potential Savings</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">{totalSavings.toFixed(1)} kW</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{savingsPercentage.toFixed(1)}% reduction</p>
            <div className="w-full h-1 bg-muted mt-2 overflow-hidden rounded-full">
              <div className="bg-destructive h-full" style={{ width: `${savingsPercentage}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="border-b px-4">
          <TabsList className="bg-transparent h-auto p-0 flex overflow-x-auto">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              <BarChart3 size={16} />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="energy" 
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              <PieChartIcon size={16} />
              <span>Energy Analysis</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sensor" 
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              <FileBarChart size={16} />
              <span>Sensor Data</span>
            </TabsTrigger>
            <TabsTrigger 
              value="export" 
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              <FileText size={16} />
              <span>Export Options</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h2 className="text-xl font-semibold">Energy Optimization Overview</h2>
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-primary rounded-sm"></div>
                  <span className="text-xs">Current</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-success rounded-sm"></div>
                  <span className="text-xs">Optimized</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-3">
                <div className="h-80 bg-card border rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={aggregatedData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit=" kW" />
                      <Tooltip 
                        formatter={(value) => [`${value} kW`, 'Power Usage']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)'
                        }}
                      />
                      <Legend />
                      <Bar name="Current Usage" dataKey="current" fill="hsl(var(--primary))" />
                      <Bar name="Optimized Usage" dataKey="optimized" fill="hsl(var(--success))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="h-80 bg-card border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Savings By Area (%)</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie
                        data={aggregatedData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="saving"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {
                          aggregatedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 50}, 70%, 60%)`} />
                          ))
                        }
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} kW`, 'Potential Saving']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead>Current Usage (kW)</TableHead>
                    <TableHead>Optimized (kW)</TableHead>
                    <TableHead>Savings (kW)</TableHead>
                    <TableHead>Savings (%)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aggregatedData.map((area) => (
                    <TableRow key={area.name}>
                      <TableCell className="font-medium">{area.name}</TableCell>
                      <TableCell>{area.current.toFixed(1)}</TableCell>
                      <TableCell className="text-success">{area.optimized.toFixed(1)}</TableCell>
                      <TableCell>{area.saving.toFixed(1)}</TableCell>
                      <TableCell>{area.percentage.toFixed(1)}%</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          area.percentage > 20 ? 'bg-success/20 text-success' :
                          area.percentage > 15 ? 'bg-warning/20 text-warning' :
                          'bg-muted/20 text-muted-foreground'
                        }`}>
                          {area.percentage > 20 ? 'High Savings' : 
                           area.percentage > 15 ? 'Moderate' : 'Low'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <TimelineChart className="mt-6" />
          </div>
        </TabsContent>
        
        <TabsContent value="energy" className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-xl font-semibold">Energy Consumption Analysis</h2>
                <p className="text-muted-foreground text-sm">Detailed breakdown of energy usage patterns</p>
              </div>
              <div className="text-sm text-muted-foreground">
                Timeframe: {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Historical Energy Consumption</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={historicalData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis unit=" kW" />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)'
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="consumption"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary)/0.2)"
                          name="Actual Consumption"
                        />
                        <Area
                          type="monotone"
                          dataKey="optimized"
                          stroke="hsl(var(--success))"
                          fill="hsl(var(--success)/0.2)"
                          name="Optimized Projection"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Energy Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={efficiencyData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {efficiencyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={EFFICIENCY_COLORS[index % EFFICIENCY_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, '']}
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              borderRadius: 'var(--radius)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success"></div>
                        <span className="text-sm">Utilized: 72%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive"></div>
                        <span className="text-sm">Wasted: 28%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span>Reduce temperature setpoints by 2°C</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span>Implement sequential startup</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span>Optimize cooling system schedules</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mt-6 border rounded-lg bg-card">
              <div className="border-b p-4">
                <h3 className="text-lg font-medium">Peak Usage Analysis</h3>
                <p className="text-sm text-muted-foreground mt-1">24-hour power consumption pattern with peak identification</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                <Card className="md:col-span-3">
                  <CardContent className="pt-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={peakUsageData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis unit=" kW" domain={[0, 300]} />
                          <Tooltip 
                            formatter={(value) => [`${value} kW`, 'Power Usage']}
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              borderRadius: 'var(--radius)'
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            name="Actual Usage" 
                            dataKey="actual" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={{
                              stroke: 'hsl(var(--primary))',
                              strokeWidth: 2,
                              r: 4,
                              fill: 'hsl(var(--card))'
                            }}
                            activeDot={{ r: 8 }}
                          />
                          <Line 
                            type="monotone" 
                            name="Optimized Usage" 
                            dataKey="optimized" 
                            stroke="hsl(var(--success))" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{
                              stroke: 'hsl(var(--success))',
                              strokeWidth: 2,
                              r: 4,
                              fill: 'hsl(var(--card))'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            name="Warning Threshold" 
                            dataKey="warningThreshold" 
                            stroke="hsl(var(--warning))" 
                            strokeWidth={1.5}
                            strokeDasharray="3 3"
                            dot={false}
                          />
                          <Line 
                            type="monotone" 
                            name="Critical Threshold" 
                            dataKey="criticalThreshold" 
                            stroke="hsl(var(--destructive))" 
                            strokeWidth={1.5}
                            strokeDasharray="3 3"
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Peak Hour</CardDescription>
                      <CardTitle className="text-xl font-bold flex items-center gap-1">
                        {peakHourData.hour}
                        {peakHourData.status === 'critical' && (
                          <AlertTriangle size={16} className="text-destructive" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Usage:</p>
                          <p className="font-medium">{peakHourData.actual} kW</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Optimized:</p>
                          <p className="font-medium text-success">{peakHourData.optimized} kW</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Peak vs Average</CardDescription>
                      <CardTitle className="text-xl font-bold">{Math.round((peakHourData.actual / averageUsage) * 100)}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">Average usage: {averageUsage} kW</p>
                      <div className="w-full h-1.5 bg-muted mt-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full" 
                          style={{ width: `${Math.min(100, Math.round((peakHourData.actual / averageUsage) * 100))}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Peak Reduction</CardDescription>
                      <CardTitle className="text-xl font-bold text-success">{peakReductionPercent}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">Potential savings: {potentialPeakSavings} kW</p>
                      <div className="w-full h-1.5 bg-muted mt-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-success h-full" 
                          style={{ width: `${peakReductionPercent}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="p-4 border-t">
                <h4 className="font-medium mb-3">Peak Shaving Recommendations</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                    <span>Implement load shedding during identified peak hours (10:00, 14:00, 16:00)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                    <span>Schedule high-power operations outside of peak hours to flatten consumption curve</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                    <span>Consider installing energy storage systems to reduce peak demand charges</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sensor" className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Detailed Sensor Data</h2>
                <p className="text-muted-foreground text-sm">Real-time readings from all sensor types</p>
              </div>
              <div className="text-sm text-muted-foreground">
                Location: {selectedLocation === 'all' ? 'All Locations' : selectedLocation}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Temperature Readings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={temperatureData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis unit="°C" domain={[15, 35]} />
                        <Tooltip 
                          formatter={(value) => [`${value}°C`, 'Temperature']}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          name="Temperature" 
                          stroke="hsl(var(--primary))" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pressure Readings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={pressureData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis unit=" bar" />
                        <Tooltip 
                          formatter={(value) => [`${value} bar`, 'Pressure']}
                          contentStyle={{ 
                            backgroundColor: 'hsl(
