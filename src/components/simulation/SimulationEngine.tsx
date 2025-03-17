
import React, { useState, useEffect } from 'react';
import { TimelineChart } from './TimelineChart';
import { Play, Pause, RotateCcw, Save, Clock, ChevronRight } from 'lucide-react';
import { useSensorSimulation } from '../../hooks/useSensorSimulation';
import { toast } from 'sonner';

export const SimulationEngine: React.FC = () => {
  const { sensors, isSimulating, toggleSimulation } = useSensorSimulation();
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('scenario');
  const [running, setRunning] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  // Manage simulation progress
  const startSimulation = () => {
    if (progress === 100) {
      resetSimulation();
      setTimeout(() => {
        setRunning(true);
      }, 100);
      return;
    }
    
    setRunning(true);
  };

  const pauseSimulation = () => {
    setRunning(false);
  };

  const resetSimulation = () => {
    setRunning(false);
    setProgress(0);
    setSimulationComplete(false);
  };

  const toggleRunning = () => {
    if (running) {
      pauseSimulation();
    } else {
      startSimulation();
    }
  };

  // Save simulation results
  const saveResults = () => {
    toast.success('Simulation results saved successfully!');
  };

  // Simulation progress effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (running) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (interval) clearInterval(interval);
            setRunning(false);
            setSimulationComplete(true);
            toast.success('Simulation completed! View optimization results below.');
            return 100;
          }
          return prev + 4;  // Adjust speed as needed
        });
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running]);

  // Filter sensors by type for the simulation
  const enabledSensors = sensors.filter(sensor => 
    ['Temperature', 'Pressure', 'Power', 'Flow'].includes(sensor.type)
  ).slice(0, 5); // Limit to 5 for display purposes

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Digital Twin Simulation</h1>
          <p className="text-muted-foreground">Simulate and optimize factory operations.</p>
        </div>

        <div className="flex gap-2 sm:self-start">
          <button
            onClick={toggleRunning}
            disabled={simulationComplete && progress === 100}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              running
                ? 'bg-muted text-foreground hover:bg-muted/80'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {running ? <Pause size={16} /> : <Play size={16} />}
            {running ? 'Pause' : progress === 0 ? 'Run Simulation' : 'Resume'}
          </button>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="border-b">
              <div className="flex">
                <button
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'scenario'
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('scenario')}
                >
                  Scenario
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'sensors'
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('sensors')}
                >
                  Sensors
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'parameters'
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('parameters')}
                >
                  Parameters
                </button>
              </div>
            </div>

            <div className="p-4">
              {activeTab === 'scenario' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Scenario Name</label>
                    <input
                      type="text"
                      defaultValue="Peak Production Optimization"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration</label>
                    <div className="flex">
                      <input
                        type="number"
                        defaultValue="24"
                        className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <div className="flex items-center justify-center px-3 border-y border-r rounded-r-md bg-muted text-sm">
                        hours
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      defaultValue="Optimize energy usage during peak production hours when all factory systems are running simultaneously."
                      rows={3}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'sensors' && (
                <div className="space-y-3">
                  {enabledSensors.map((sensor) => (
                    <div key={sensor.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                      <div>
                        <p className="text-sm font-medium">{sensor.name}</p>
                        <p className="text-xs text-muted-foreground">{sensor.type} - {sensor.value}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                        <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'parameters' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Power Reduction</label>
                    <div className="flex">
                      <input
                        type="number"
                        defaultValue="20"
                        className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <div className="flex items-center justify-center px-3 border-y border-r rounded-r-md bg-muted text-sm">
                        %
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Step Interval</label>
                    <div className="flex">
                      <input
                        type="number"
                        defaultValue="1"
                        className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <div className="flex items-center justify-center px-3 border-y border-r rounded-r-md bg-muted text-sm">
                        hour
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium">
                      <span>Advanced Settings</span>
                      <ChevronRight size={16} className="ml-1" />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {progress > 0 && (
            <div className="bg-card border rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <h3 className="text-sm font-medium">Simulation Progress</h3>
                </div>
                {progress === 100 && (
                  <button 
                    className="flex items-center gap-1 text-xs text-primary"
                    onClick={saveResults}
                  >
                    <Save size={12} />
                    Save Results
                  </button>
                )}
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300 ease-linear"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
                <span>Step {Math.round((progress / 100) * 24)}/24</span>
                <span>{progress}% Complete</span>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <TimelineChart />
          {progress === 100 && (
            <div className="mt-6 bg-success/10 border border-success/20 rounded-xl p-5 animate-fade-in">
              <h3 className="text-lg font-semibold mb-2">Optimization Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-card border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Power Reduction</p>
                  <p className="text-xl font-medium text-success">22.4%</p>
                </div>
                <div className="bg-card border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Cost Savings</p>
                  <p className="text-xl font-medium">$1,280/month</p>
                </div>
                <div className="bg-card border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">CO2 Reduction</p>
                  <p className="text-xl font-medium">4.2 tonnes/month</p>
                </div>
              </div>
              <div className="p-4 bg-card border rounded-lg">
                <h4 className="font-medium mb-2">Recommended Actions</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <span>Adjust temperature setpoints for cooling systems by +2°C during non-peak hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <span>Sequence startup of heavy machinery to prevent power spikes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <span>Implement variable speed control for pump systems P-102 and P-201</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

