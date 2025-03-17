
import React, { useState, useEffect } from 'react';
import { useSensorSimulation } from '../hooks/useSensorSimulation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, BarChart3, FileBarChart, PieChart as PieChartIcon, Filter, Calendar, RefreshCw } from 'lucide-react';
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
            
            <div className="mt-6 border rounded-lg p-4 bg-card">
              <h3 className="text-lg font-medium mb-4">Peak Usage Analysis</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={energyDataOverTime}
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
                    <Line type="monotone" name="Current" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" name="Optimized" dataKey="optimized" stroke="hsl(var(--success))" strokeDasharray="5 5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
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
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          name="Pressure" 
                          stroke="hsl(var(--warning))" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Sensor Readings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sensor ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSensors.map((sensor) => (
                        <TableRow key={sensor.id}>
                          <TableCell className="font-medium">{sensor.name}</TableCell>
                          <TableCell>{sensor.type}</TableCell>
                          <TableCell>{sensor.value}</TableCell>
                          <TableCell>{sensor.location}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              sensor.status === 'success' ? 'bg-success/20 text-success' :
                              sensor.status === 'warning' ? 'bg-warning/20 text-warning' :
                              'bg-destructive/20 text-destructive'
                            }`}>
                              {sensor.status === 'success' ? 'Normal' : 
                              sensor.status === 'warning' ? 'Warning' : 'Error'}
                            </span>
                          </TableCell>
                          <TableCell>{sensor.lastUpdated}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-muted/30 border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Sensor Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Total Sensors</p>
                  <p className="text-2xl font-bold">{filteredSensors.length}</p>
                </div>
                <div className="bg-card border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Operational</p>
                  <p className="text-2xl font-bold text-success">
                    {filteredSensors.filter(s => s.status === 'success').length}
                  </p>
                </div>
                <div className="bg-card border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-bold text-warning">
                    {filteredSensors.filter(s => s.status === 'warning').length}
                  </p>
                </div>
                <div className="bg-card border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Errors</p>
                  <p className="text-2xl font-bold text-destructive">
                    {filteredSensors.filter(s => s.status === 'error').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="export" className="p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Export & Report Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="border rounded-xl p-6 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-start">
                  <div className="mr-4 p-3 bg-primary/10 rounded-full">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Full Report (PDF)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete energy analysis with recommendations and optimization potential
                    </p>
                    <div className="mt-3 border-t pt-3">
                      <h4 className="text-sm font-medium mb-2">Report Contents:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Executive Summary</li>
                        <li>• Energy Consumption Analysis</li>
                        <li>• Sensor Data Readings</li>
                        <li>• Optimization Recommendations</li>
                        <li>• ROI Calculations</li>
                      </ul>
                    </div>
                    <button className="mt-4 text-primary text-sm font-medium flex items-center gap-2">
                      <Download size={16} />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-xl p-6 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-start">
                  <div className="mr-4 p-3 bg-primary/10 rounded-full">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Data Export (Excel)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Raw sensor data and calculations in spreadsheet format
                    </p>
                    <div className="mt-3 border-t pt-3">
                      <h4 className="text-sm font-medium mb-2">File Contents:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Sensor Readings (All Types)</li>
                        <li>• Historical Data (Last 30 Days)</li>
                        <li>• Calculation Formulas</li>
                        <li>• Pivot Tables</li>
                        <li>• Data Visualization Templates</li>
                      </ul>
                    </div>
                    <button className="mt-4 text-primary text-sm font-medium flex items-center gap-2">
                      <Download size={16} />
                      Download Excel
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-xl p-6 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-start">
                  <div className="mr-4 p-3 bg-primary/10 rounded-full">
                    <PieChartIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Charts & Graphs</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Visual representations of energy usage and optimization
                    </p>
                    <div className="mt-3 border-t pt-3">
                      <h4 className="text-sm font-medium mb-2">Available Formats:</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-muted rounded text-xs">PNG</span>
                        <span className="px-2 py-1 bg-muted rounded text-xs">SVG</span>
                        <span className="px-2 py-1 bg-muted rounded text-xs">PDF</span>
                        <span className="px-2 py-1 bg-muted rounded text-xs">JPEG</span>
                      </div>
                    </div>
                    <button className="mt-4 text-primary text-sm font-medium flex items-center gap-2">
                      <Download size={16} />
                      Download Images
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-xl p-6 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-start">
                  <div className="mr-4 p-3 bg-primary/10 rounded-full">
                    <FileBarChart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Custom Report</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create a customized report with selected metrics and date ranges
                    </p>
                    <div className="mt-3 border-t pt-3">
                      <h4 className="text-sm font-medium mb-2">Customization Options:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5">
                          <input type="checkbox" id="temp" className="rounded border-muted-foreground" />
                          <label htmlFor="temp" className="text-xs">Temperature Data</label>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input type="checkbox" id="power" className="rounded border-muted-foreground" />
                          <label htmlFor="power" className="text-xs">Power Usage</label>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input type="checkbox" id="press" className="rounded border-muted-foreground" />
                          <label htmlFor="press" className="text-xs">Pressure Readings</label>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input type="checkbox" id="opt" className="rounded border-muted-foreground" />
                          <label htmlFor="opt" className="text-xs">Optimization</label>
                        </div>
                      </div>
                    </div>
                    <button className="mt-4 text-primary text-sm font-medium flex items-center gap-2">
                      <Download size={16} />
                      Configure & Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 border mt-6">
              <h3 className="text-lg font-medium mb-2">Scheduling Options</h3>
              <p className="text-sm text-muted-foreground mb-4">Set up automated report delivery to your email</p>
              
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Report Type</label>
                  <select className="bg-background border rounded px-3 py-2 text-sm w-full sm:w-auto">
                    <option>Full PDF Report</option>
                    <option>Excel Data Export</option>
                    <option>Executive Summary</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Frequency</label>
                  <select className="bg-background border rounded px-3 py-2 text-sm w-full sm:w-auto">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="bg-background border rounded px-3 py-2 text-sm w-full sm:w-auto"
                  />
                </div>
                
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium">
                  Schedule Reports
                </button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
