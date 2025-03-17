
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SensorFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const SensorForm: React.FC<SensorFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'temperature',
    frequency: '5',
    unit: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  // Dynamically set unit based on sensor type
  const getSensorUnit = (type: string) => {
    switch (type) {
      case 'temperature':
        return '°C';
      case 'pressure':
        return 'bar';
      case 'humidity':
        return '%';
      case 'power':
        return 'kW';
      case 'flow':
        return 'L/min';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card border rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-semibold">Add New Sensor</h3>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sensor Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. T-101, P-202"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Sensor Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={(e) => {
                handleChange(e);
                setFormData(prev => ({ ...prev, unit: getSensorUnit(e.target.value) }));
              }}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="temperature">Temperature</option>
              <option value="pressure">Pressure</option>
              <option value="humidity">Humidity</option>
              <option value="power">Power</option>
              <option value="flow">Flow</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Update Frequency (s)</label>
              <input
                type="number"
                name="frequency"
                required
                min="1"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit || getSensorUnit(formData.type)}
                onChange={handleChange}
                placeholder="e.g. °C, kW, %"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Main Assembly, Production Line 1"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Add Sensor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
