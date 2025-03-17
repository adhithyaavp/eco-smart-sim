
import React, { useState } from 'react';
import { useSensorSimulation } from '../hooks/useSensorSimulation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, BarChart3, FileBarChart, PieChart } from 'lucide-react';

const Reports: React.FC = () => {
  const { sensors } = useSensorSimulation();
  const [activeTab, setActiveTab] = useState('overview');

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

  // Generate aggregated data for report
  const aggregatedData = [
    { name: 'Main Assembly', current: 124.5, optimized: 96.3, saving: 28.2 },
    { name: 'Hydraulic System', current: 85.2, optimized: 65.8, saving: 19.4 },
    { name: 'Production Line 2', current: 110.3, optimized: 92.4, saving: 17.9 },
    { name: 'Cooling System', current: 62.1, optimized: 48.9, saving: 13.2 },
    { name: 'Storage Area', current: 45.6, optimized: 38.2, saving: 7.4 }
  ];

  // Temperature data
  const temperatureData = sensors
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and export factory insights.</p>
        </div>
        
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors sm:self-start"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>
      
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <div className="flex items-center gap-2">
                <BarChart3 size={16} />
                <span>Overview</span>
              </div>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'energy'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('energy')}
            >
              <div className="flex items-center gap-2">
                <PieChart size={16} />
                <span>Energy Analysis</span>
              </div>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'sensor'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('sensor')}
            >
              <div className="flex items-center gap-2">
                <FileBarChart size={16} />
                <span>Sensor Data</span>
              </div>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'export'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('export')}
            >
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>Export Options</span>
              </div>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h2 className="text-xl font-semibold">Energy Optimization Overview</h2>
                <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
              
              <div className="h-80">
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-muted/20 rounded-lg p-4 border">
                  <h3 className="text-lg font-medium mb-2">Current Power Usage</h3>
                  <p className="text-3xl font-bold">427.7 kW</p>
                  <p className="text-sm text-muted-foreground mt-1">Total factory consumption</p>
                </div>
                <div className="bg-muted/20 rounded-lg p-4 border">
                  <h3 className="text-lg font-medium mb-2">Optimized Usage</h3>
                  <p className="text-3xl font-bold text-success">341.6 kW</p>
                  <p className="text-sm text-muted-foreground mt-1">With recommended settings</p>
                </div>
                <div className="bg-muted/20 rounded-lg p-4 border">
                  <h3 className="text-lg font-medium mb-2">Potential Savings</h3>
                  <p className="text-3xl font-bold text-primary">86.1 kW</p>
                  <p className="text-sm text-muted-foreground mt-1">20.1% reduction</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'energy' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Energy Usage Analysis</h2>
              
              <div className="h-80">
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
                    <Line type="monotone" name="Current" dataKey="value" stroke="hsl(var(--primary))" />
                    <Line type="monotone" name="Optimized" dataKey="optimized" stroke="hsl(var(--success))" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Optimization Recommendations</h3>
                <ul className="space-y-3 pl-5 list-disc">
                  <li>Reduce temperature setpoints by 2°C in Main Assembly area</li>
                  <li>Implement sequential startup for hydraulic systems</li>
                  <li>Optimize cooling system run schedules</li>
                  <li>Install variable frequency drives on pump systems</li>
                  <li>Implement smart lighting controls in storage areas</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'sensor' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Live Sensor Data</h2>
              
              <div className="h-80">
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
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="border rounded-lg overflow-hidden mt-6">
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
                    {sensors.map((sensor) => (
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
            </div>
          )}
          
          {activeTab === 'export' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Export Options</h2>
              
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
                      <PieChart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Charts & Graphs</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Visual representations of energy usage and optimization
                      </p>
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
                      <button className="mt-4 text-primary text-sm font-medium flex items-center gap-2">
                        <Download size={16} />
                        Configure & Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
