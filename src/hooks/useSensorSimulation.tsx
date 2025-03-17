
import { useState, useEffect } from 'react';

// Define types for our sensor data
export interface SimulatedSensor {
  id: number;
  name: string;
  type: string;
  value: string;
  unit: string;
  min: number;
  max: number;
  frequency: number; // in milliseconds
  location: string;
  status: 'success' | 'warning' | 'error';
  lastUpdated: string;
}

// Generate a random value between min and max with specified precision
const generateRandomValue = (min: number, max: number, precision: number = 1): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(precision));
};

// Format the value with the appropriate unit
const formatValue = (value: number, unit: string, type: string): string => {
  switch (type) {
    case 'Temperature':
      return `${value}${unit}`;
    case 'Pressure':
      return `${value} ${unit}`;
    case 'Humidity':
      return `${value}${unit}`;
    case 'Power':
      return `${value} ${unit}`;
    case 'Flow':
      return `${value} ${unit}`;
    default:
      return `${value}${unit}`;
  }
};

// Generate status based on value and thresholds
const determineStatus = (value: number, min: number, max: number, type: string): 'success' | 'warning' | 'error' => {
  // Calculate thresholds based on the range
  const range = max - min;
  const warningLowerThreshold = min + range * 0.1;
  const warningUpperThreshold = max - range * 0.1;

  // For temperature, pressure, etc. different types might have different threshold logic
  if (value < warningLowerThreshold || value > warningUpperThreshold) {
    return 'warning';
  }
  
  // Random errors (5% chance)
  if (Math.random() < 0.05) {
    return 'error';
  }

  return 'success';
};

// Format the last updated timestamp
const formatLastUpdated = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 5) {
    return 'Just now';
  } else if (diffSec < 60) {
    return `${diffSec}s ago`;
  } else if (diffMin < 60) {
    return `${diffMin}min ago`;
  } else {
    return `${diffHour}h ago`;
  }
};

// Initial sensor data with appropriate ranges and units
const initialSensors: SimulatedSensor[] = [
  {
    id: 1,
    name: 'T-101',
    type: 'Temperature',
    value: '23.5°C',
    unit: '°C',
    min: 18,
    max: 28,
    frequency: 5000, // 5 seconds
    location: 'Main Assembly',
    status: 'success',
    lastUpdated: '2min ago'
  },
  {
    id: 2,
    name: 'P-201',
    type: 'Pressure',
    value: '2.4 bar',
    unit: 'bar',
    min: 1.8,
    max: 3.2,
    frequency: 10000, // 10 seconds
    location: 'Hydraulic System',
    status: 'success',
    lastUpdated: '1min ago'
  },
  {
    id: 3,
    name: 'T-103',
    type: 'Temperature',
    value: '32.1°C',
    unit: '°C',
    min: 20,
    max: 40,
    frequency: 5000, // 5 seconds
    location: 'Production Line 2',
    status: 'warning',
    lastUpdated: '3h ago'
  },
  {
    id: 4,
    name: 'H-301',
    type: 'Humidity',
    value: '68%',
    unit: '%',
    min: 40,
    max: 80,
    frequency: 30000, // 30 seconds
    location: 'Storage Area',
    status: 'warning',
    lastUpdated: '5min ago'
  },
  {
    id: 5,
    name: 'P-102',
    type: 'Power',
    value: '42.1 kW',
    unit: 'kW',
    min: 30,
    max: 60,
    frequency: 1000, // 1 second
    location: 'Main Assembly',
    status: 'success',
    lastUpdated: 'Just now'
  },
  {
    id: 6,
    name: 'F-201',
    type: 'Flow',
    value: '12.3 L/min',
    unit: 'L/min',
    min: 8,
    max: 18,
    frequency: 2000, // 2 seconds
    location: 'Cooling System',
    status: 'success',
    lastUpdated: '30s ago'
  }
];

export const useSensorSimulation = (initialData: SimulatedSensor[] = initialSensors) => {
  const [sensors, setSensors] = useState<SimulatedSensor[]>(initialData);
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    if (!isSimulating) return;

    // Create individual interval for each sensor based on its frequency
    const intervals = sensors.map(sensor => {
      return setInterval(() => {
        setSensors(prevSensors => {
          return prevSensors.map(s => {
            if (s.id === sensor.id) {
              const now = new Date();
              const randomValue = generateRandomValue(s.min, s.max);
              const status = determineStatus(randomValue, s.min, s.max, s.type);
              const formattedValue = formatValue(randomValue, s.unit, s.type);
              
              return {
                ...s,
                value: formattedValue,
                status,
                lastUpdated: formatLastUpdated(now)
              };
            }
            return s;
          });
        });
      }, sensor.frequency);
    });

    // Cleanup function to clear all intervals
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [sensors, isSimulating]);

  const toggleSimulation = () => {
    setIsSimulating(prev => !prev);
  };

  const addSensor = (newSensor: Partial<SimulatedSensor>) => {
    const sensorDefaults = {
      id: sensors.length + 1,
      name: `S-${sensors.length + 101}`,
      type: 'Temperature',
      value: '0°C',
      unit: '°C',
      min: 0,
      max: 100,
      frequency: 5000,
      location: 'Not specified',
      status: 'success' as const,
      lastUpdated: 'Just added'
    };

    const completeSensor = { ...sensorDefaults, ...newSensor };
    setSensors(prev => [...prev, completeSensor]);
  };

  return { sensors, isSimulating, toggleSimulation, addSensor };
};
