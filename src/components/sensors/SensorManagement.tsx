
import React, { useState } from 'react';
import { PlusCircle, Search, Download, Upload, Filter, MoreHorizontal, Play, Pause } from 'lucide-react';
import { SensorForm } from './SensorForm';
import { StatusBadge } from '../common/StatusBadge';
import { useSensorSimulation } from '../../hooks/useSensorSimulation';
import { toast } from 'sonner';

export const SensorManagement: React.FC = () => {
  const { sensors, isSimulating, toggleSimulation, addSensor } = useSensorSimulation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  
  const handleAddSensor = (data: any) => {
    const newSensor = {
      name: data.name,
      type: data.type.charAt(0).toUpperCase() + data.type.slice(1),
      unit: data.unit,
      min: parseFloat(data.min) || 0,
      max: parseFloat(data.max) || 100,
      frequency: parseInt(data.frequency) * 1000 || 5000, // Convert seconds to milliseconds
      location: data.location || 'Not specified',
    };
    
    addSensor(newSensor);
    toast.success(`Sensor ${data.name} added successfully!`);
    setShowForm(false);
  };
  
  const filteredSensors = sensors.filter(sensor => {
    return (
      (selectedType === 'All' || sensor.type === selectedType) &&
      (sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       sensor.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
       sensor.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  const sensorTypes = ['All', ...Array.from(new Set(sensors.map(s => s.type)))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sensor Management</h1>
          <p className="text-muted-foreground">Configure and monitor factory sensors.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-2 px-4 py-2 ${
              isSimulating ? 'bg-muted text-foreground' : 'bg-success text-success-foreground'
            } rounded-md text-sm font-medium hover:opacity-90 transition-colors sm:self-start`}
          >
            {isSimulating ? <Pause size={16} /> : <Play size={16} />}
            {isSimulating ? 'Pause Simulation' : 'Start Simulation'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors sm:self-start"
          >
            <PlusCircle size={16} />
            Add Sensor
          </button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sensors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <button className="px-3 py-2 border rounded-md flex items-center gap-1 hover:bg-muted transition-colors">
              <Filter size={16} />
              <span className="text-sm">{selectedType}</span>
            </button>
            <div className="absolute right-0 mt-1 w-40 bg-card border rounded-md shadow-md z-10 hidden group-hover:block">
              {sensorTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <button className="px-3 py-2 border rounded-md hover:bg-muted transition-colors">
            <Upload size={16} />
          </button>
          
          <button className="px-3 py-2 border rounded-md hover:bg-muted transition-colors">
            <Download size={16} />
          </button>
        </div>
      </div>
      
      <div className="border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Frequency</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Updated</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSensors.map((sensor) => (
                <tr key={sensor.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{sensor.name}</td>
                  <td className="px-4 py-3 text-sm">{sensor.type}</td>
                  <td className="px-4 py-3 text-sm">{sensor.value}</td>
                  <td className="px-4 py-3 text-sm">{(sensor.frequency / 1000)}s</td>
                  <td className="px-4 py-3 text-sm">{sensor.location}</td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={sensor.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{sensor.lastUpdated}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1 hover:bg-muted rounded-md transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSensors.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No sensors found matching your search.</p>
          </div>
        )}
      </div>
      
      {showForm && (
        <SensorForm 
          onClose={() => setShowForm(false)} 
          onSubmit={handleAddSensor} 
        />
      )}
    </div>
  );
};
